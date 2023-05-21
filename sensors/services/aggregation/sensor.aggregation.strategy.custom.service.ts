import debug from 'debug';
import { TimeResolution } from "../../dto/read.sensor_data.dto";
import Strategy from "./sensor.aggregation.strategy.interface";
import SensorAggregateType from "../../types/sensor.aggregate.type";
import calculateAverage, { aggregateDataUsingCustomStrategy } from "./sensor.aggregation.utils";
// TODO: rename lots of type stuff

const log: debug.IDebugger = debug('app:aggregation-custom-strategy');

/**
 * @type IntermediateAggregatedDataType
 * @description Intermediate aggregated data type.
 * @property {string} key - Key of the aggregated data.
 * @property {number} count - Count of the aggregated data.
 * @property {number} sum - Sum of the aggregated data.
 */
export type IntermediateAggregatedDataType = { [key: string]: { count: number; sum: number; } };

/**
 * @type GroupByDataType
 * @description Grouped data type.
 * @property {string} _id - Id of the grouped data.
 * @property {SensorAggregateType[]} values - Values of the grouped data.
 */
export type GroupByDataType = { _id: {room?: string; measurement?: string;}, values: {
        _id: string;
        datetime: Date;
        value: number;
        room?: string;
        measurement?: string;
    }[] };


/**
 * @class CustomStrategy
 * @implements {Strategy}
 * @description Custom aggregation strategy.
 * @property {TimeResolution} type - Time resolution of the aggregation strategy.
 * @method getAggregate - Returns aggregated data.
 * @method getAggregateCustom - Returns aggregated data using custom strategy.
 */
export abstract class CustomStrategy implements Strategy {

    public type: TimeResolution; 

    /**
     * @method getAggregate
     * @param data - Data to be aggregated.
     * @returns {GroupByDataType[]} Aggregated data.
     */
    abstract getAggregate(data: GroupByDataType[]): GroupByDataType[];

    /**
     * @method getAggregateCustom
     * @description
     * Returns aggregated data using custom strategy.
     * @param sensorDataRecordsByGroup - Data to be aggregated.
     * @param strategyCallback - Callback function for custom strategy.
     * @returns {GroupByDataType[]} Aggregated data.
     */
    public getAggregateCustom(sensorDataRecordsByGroup: GroupByDataType[], strategyCallback: (date: Date) => string): GroupByDataType[]{
        if (sensorDataRecordsByGroup.length === 0) {
            log('No data to aggregate.');
            return [];
        }

        let aggregatedSensorDataResults: GroupByDataType[] = [];
        // iterate each group of sensor data to be aggregated
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
