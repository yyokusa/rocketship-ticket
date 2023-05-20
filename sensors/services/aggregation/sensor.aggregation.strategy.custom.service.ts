import { log } from "winston";
import { TimeResolution } from "../../dto/read.sensor_data.dto";
import Strategy from "./sensor.aggregation.strategy.interface";
import SensorAggregateType from "../../types/sensor.aggregate.type";
import calculateAverage, { aggregateDataUsingCustomStrategy } from "./sensor.aggregation.utils";
// TODO: rename lots of type stuff

export type IntermediateAggregatedDataType = { [key: string]: { count: number; sum: number; } };
export type GroupByDataType = { _id: {room?: string; measurement?: string;}, values: {
        _id: string;
        datetime: Date;
        value: number;
        room?: string;
        measurement?: string;
    }[] };


export abstract class CustomStrategy implements Strategy {

    public type: TimeResolution; 

    abstract getAggregate(data: GroupByDataType[]): GroupByDataType[];

    public getAggregateCustom(sensorDataRecordsByGroup: GroupByDataType[], strategyCallback: (date: Date) => string): GroupByDataType[]{
        if (sensorDataRecordsByGroup.length === 0) {
            return [];
        }

        let aggregatedSensorDataResults: GroupByDataType[] = [];
        for (const sensorDataRecords of sensorDataRecordsByGroup) {
            
            const aggregatedData: IntermediateAggregatedDataType = aggregateDataUsingCustomStrategy(sensorDataRecords.values, strategyCallback);
            const averageOfAggregatedData: SensorAggregateType[] = calculateAverage(aggregatedData);

            const resultObject: GroupByDataType = {_id: {}, values: []} as GroupByDataType;
            resultObject._id.measurement = sensorDataRecords._id.measurement;
            resultObject._id.room = sensorDataRecords._id.room;
            resultObject.values = averageOfAggregatedData;

            aggregatedSensorDataResults.push(resultObject);
        };
        return aggregatedSensorDataResults;
    }

    constructor(timeResolution: TimeResolution) {
        this.type = timeResolution;
    }
}
