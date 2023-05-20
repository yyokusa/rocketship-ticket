import { log } from "winston";
import { TimeResolution } from "../../dto/read.sensor_data.dto";
import SensorSchemaType from "../../types/sensor.schema.type";
import Strategy from "./sensor.aggregation.strategy.interface";
import SensorAggregateType from "../../types/sensor.aggregate.type";
import sensorMiddleware from "../../middleware/sensor.middleware";
// TODO: rename lots of type stuff

type IntermediateAggregatedDataType = { [key: string]: { count: number; sum: number; } };
export type GroupByDataType = { _id: {room?: string; measurement?: string;}, values: {
        _id: string;
        datetime: Date;
        room: string;
        measurement: string;
        value: number;
    }[] };


abstract class CustomStrategy implements Strategy {
    
    public type: TimeResolution; 

    abstract getAggregate(data: GroupByDataType[]): GroupByDataType[];

    public getAggregateCustom(data: GroupByDataType[], customStrategyCallback: (date: Date) => string): GroupByDataType[]{
        if (data.length === 0) {
            return [];
        }

        const grouppedSensorsData: GroupByDataType[] = data;
        let toBeReturned: GroupByDataType[] = [];
        for (const sensorData of grouppedSensorsData) {
            
            // if (sensorData.values.length === 0) { toBeReturned.push({measurement: sensorData.measurement, room: sensorData.room, values: {}}); }

            const aggregatedData: IntermediateAggregatedDataType = {};
    
            for (const entry of sensorData.values) {
                const date = entry.datetime;
                const key = customStrategyCallback(date);
            
                if (!aggregatedData[key]) {
                    aggregatedData[key] = { count: 0, sum: 0 };
                }
            
                aggregatedData[key].count++;
                aggregatedData[key].sum += entry.value;
            }
            const result: SensorAggregateType[] = calculateAverage(aggregatedData);
            if (sensorData._id.measurement && sensorData._id.room) {
                toBeReturned.push({
                    _id: {
                        measurement: sensorData._id.measurement,
                        room: sensorData._id.room,
                    },
                    values: result.map((entry: SensorAggregateType) => {
                        return {
                            measurement: sensorData._id.measurement ?? "",
                            room: sensorData._id.room ?? "",
                            ...entry
                        };
                    })
                });
            } else if (sensorData._id.measurement) {
                toBeReturned.push({
                    _id: {
                        measurement: sensorData._id.measurement,
                    },
                    values: result.map((entry: SensorAggregateType) => {
                        return {
                            measurement: sensorData._id.measurement ?? "",
                            room: sensorData._id.room ?? "",
                            ...entry
                        };
                    })
                });
            } else if (sensorData._id.room) {
                toBeReturned.push({
                    _id: {
                        room: sensorData._id.room,
                    },
                    values: result.map((entry: SensorAggregateType) => {
                        return {
                            measurement: sensorData._id.measurement ?? "",
                            room: sensorData._id.room ?? "",
                            ...entry
                        };
                    })
                });
            }
        };
        return toBeReturned;
    }

    constructor(timeResolution: TimeResolution) {
        this.type = timeResolution;
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
    public getAggregate(data: GroupByDataType[]): GroupByDataType[] {
        return super.getAggregateCustom(data, (date: Date) => {
            const hourStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
            const key = hourStart.toISOString();
            return key;
        });
    }

    constructor() {
        super(TimeResolution.hourly);
    }
}

export class ConcreteStrategyDaily extends CustomStrategy {
    public getAggregate(data: GroupByDataType[]): GroupByDataType[] {
        return super.getAggregateCustom(data, (date: Date) => {
            const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const key = dayStart.toISOString();
            return key;
        });
    }

    constructor() {
        super(TimeResolution.daily);
    }
}

export class ConcreteStrategyWeekly extends CustomStrategy {
    public getAggregate(data: GroupByDataType[]): GroupByDataType[] {
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

    constructor() {
        super(TimeResolution.weekly);
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
                _id: idx.toString(), 
                datetime: new Date(key), 
                value: average, 
            }
        );
        idx++;
    }
  
    return result;
}
  
