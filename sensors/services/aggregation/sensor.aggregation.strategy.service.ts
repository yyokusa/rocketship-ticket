import { log } from "winston";
import { TimeResolution } from "../../dto/read.sensor_data.dto";
import SensorSchemaType from "../../types/sensor.schema.type";
import Strategy from "./sensor.aggregation.strategy.interface";
import SensorAggregateType from "../../types/sensor.aggregate.type";
import sensorMiddleware from "../../middleware/sensor.middleware";
// TODO: rename lots of type stuff

type IntermediateAggregatedDataType = { [key: string]: { count: number; sum: number; } };
type IntermediateGroupByDataType = { [key: string]: { room: string; measurement: string; values: {room?: string; measurement?: string; Datetime: Date; Value: number;}[] } };
export type GroupByDataType = { room?: string; measurement?: string; values: {Datetime: Date; Value: number; }[] };

function groupBy(data: SensorSchemaType[], byRoom:boolean = false, byMeasurement:boolean = false): GroupByDataType[] {
    const grouped = data.reduce((r, { Room: room, Measurement: measurement, ...rest }: SensorSchemaType) => {
        let key = "";
        if (byRoom && byMeasurement) {
            key = `${room}-${measurement}`;
            r[key] = r[key] || { room, measurement, values: [] };
            r[key]["values"].push(rest)
        } else if (byRoom) {
            key = room;
            r[key] = r[key] || { room, values: [] };
            r[key]["values"].push({measurement, ...rest})
        } else if (byMeasurement) {
            key = measurement;
            r[key] = r[key] || { measurement, values: [] };
            r[key]["values"].push({room , ...rest})
        }

        return r;
      }, {} as IntermediateGroupByDataType);
      
      const grouppedSensorsData = Object.values(grouped);
      console.log(grouppedSensorsData)
      return grouppedSensorsData;
}



abstract class CustomStrategy implements Strategy {
    public type: TimeResolution; 
    public groupByMeasurement: boolean = false;
    public groupByRoom: boolean = false;

    abstract getAggregate(data: SensorSchemaType[]): GroupByDataType[];

    public getAggregateCustom(data: SensorSchemaType[], customStrategyCallback: (date: Date) => string): GroupByDataType[] {
        if (data.length === 0) {
            return [];
        }

        const grouppedSensorsData: GroupByDataType[] = groupBy(data, this.groupByRoom, this.groupByMeasurement);     
        let toBeReturned: GroupByDataType[] = [];
        for (const sensorData of grouppedSensorsData) {
            
            // if (sensorData.values.length === 0) { toBeReturned.push({measurement: sensorData.measurement, room: sensorData.room, values: {}}); }

            const aggregatedData: IntermediateAggregatedDataType = {};
    
            for (const entry of sensorData.values) {
                const date = entry.Datetime;
                const key = customStrategyCallback(date);
            
                if (!aggregatedData[key]) {
                    aggregatedData[key] = { count: 0, sum: 0 };
                }
            
                aggregatedData[key].count++;
                aggregatedData[key].sum += entry.Value;
            }
            const result: SensorAggregateType[] = calculateAverage(aggregatedData);
            if (sensorData.measurement && sensorData.room) {
                toBeReturned.push({
                    measurement: sensorData.measurement,
                    room: sensorData.room,
                    values: result
                });
            } else if (sensorData.measurement) {
                toBeReturned.push({
                    measurement: sensorData.measurement,
                    values: result
                });
            } else if (sensorData.room) {
                toBeReturned.push({
                    room: sensorData.room,
                    values: result
                });
            }
        };
        return toBeReturned;
    }

    constructor(timeResolution: TimeResolution, groupByMeasurement: boolean = false, groupByRoom: boolean = false) {
        this.type = timeResolution;
        this.groupByMeasurement = groupByMeasurement;
        this.groupByRoom = groupByRoom;
    }
}
/**
 * Concrete Strategies implement the algorithm while following the base Strategy
 * interface. The interface makes them interchangeable in the Context.
 */
export class ConcreteStrategyRaw implements Strategy {
    public type: TimeResolution;

    public getAggregate(data: SensorSchemaType[]): SensorSchemaType[] {
        return data;
    }

    constructor() {
        this.type = TimeResolution.raw;
    }
}

export class ConcreteStrategyHourly extends CustomStrategy {
    public getAggregate(data: SensorSchemaType[]): GroupByDataType[] {
        return super.getAggregateCustom(data, (date: Date) => {
            const hourStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
            const key = hourStart.toISOString();
            return key;
        });
    }

    constructor(groupByMeasurement: boolean = false, groupByRoom: boolean = false) {
        super(TimeResolution.hourly, groupByMeasurement, groupByRoom);
    }
}

export class ConcreteStrategyDaily extends CustomStrategy {
    public getAggregate(data: SensorSchemaType[]): GroupByDataType[] {
        return super.getAggregateCustom(data, (date: Date) => {
            const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const key = dayStart.toISOString();
            return key;
        });
    }

    constructor(groupByMeasurement: boolean = false, groupByRoom: boolean = false) {
        super(TimeResolution.daily, groupByMeasurement, groupByRoom);
    }
}

export class ConcreteStrategyWeekly extends CustomStrategy {
    public getAggregate(data: SensorSchemaType[]): GroupByDataType[] {
        return super.getAggregateCustom(data, (date: Date) => {
            // TODO: add corner case handling
            if (date === undefined) {
                return "";
            }
            const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
            weekStart.setHours(0, 0, 0, 0);
            const key = weekStart.toISOString();
            return key;
        });
    }

    constructor(groupByMeasurement: boolean = false, groupByRoom: boolean = false) {
        super(TimeResolution.weekly, groupByMeasurement, groupByRoom);
    }
}
  
function calculateAverage(aggregatedData: IntermediateAggregatedDataType): SensorAggregateType[] {
    const result = [];
    let idx = 0;
    for (const key in aggregatedData) {
      const value = aggregatedData[key];
      const average = value.sum / value.count;
      result.push(
            {
                _id: idx++, 
                Datetime: new Date(key), 
                Value: average, 
            }
        );
    }
  
    return result;
}
  
