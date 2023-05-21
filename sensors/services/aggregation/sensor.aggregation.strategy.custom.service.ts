import debug from 'debug';
import { TimeResolution } from "../../dto/read.sensor_data.dto";
import Strategy from "./sensor.aggregation.strategy.interface";
import { GrouppedSensorRecordType } from '../../types/sensor.record.type';
import { IntermediateAggregatedDataDict } from '../../types/sensor.aggregate.intermediate.type';
import { AggregatedDataSubrecord, FinalAggregatedDataRecord } from '../../types/sensor.aggregate.record.type';
import { CreateSensorDataDto } from '../../dto/create.sensor_data.dto';

const log: debug.IDebugger = debug('app:aggregation-custom-strategy');

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
     * @returns {GrouppedSensorRecordType[]} Aggregated data.
     */
    abstract getAggregate(data: GrouppedSensorRecordType[]): FinalAggregatedDataRecord[];

    /**
     * @method getAggregateCustom
     * @description
     * Returns aggregated data using custom strategy.
     * @param groupedRawRecords - Data to be aggregated.
     * @param strategyCallback - Callback function for custom strategy.
     * @returns {GrouppedSensorRecordType[]} Aggregated data.
     */
    public getAggregateCustom(groupedRawRecords: GrouppedSensorRecordType[], strategyCallback: (date: Date) => string): FinalAggregatedDataRecord[]{
        let aggregatedSensorDataOverTimePeriodResult: FinalAggregatedDataRecord[] = [];
        // iterate each group of raw grouped sensor data to be aggregated over time period
        for (const groupedRawRecord of groupedRawRecords) {
            
            const aggregatedData: IntermediateAggregatedDataDict = this.aggregateDataUsingCustomStrategy(groupedRawRecord.values, strategyCallback);
            const averageOfAggregatedData: AggregatedDataSubrecord[] = this.calculateAverage(aggregatedData);

            const resultObject: FinalAggregatedDataRecord = {_id: {room: "", measurement: ""}, values: []};
            resultObject._id.measurement = groupedRawRecord._id.measurement;
            resultObject._id.room = groupedRawRecord._id.room;
            resultObject.values = averageOfAggregatedData

            aggregatedSensorDataOverTimePeriodResult.push(resultObject);
        };
        return aggregatedSensorDataOverTimePeriodResult;
    }

    constructor(timeResolution: TimeResolution) {
        this.type = timeResolution;
    }


    /**
     * @method calculateAverage
     * @description
     * This function calculates the average value of the aggregated data.
     * @param aggregatedData - Intermediate aggregated data.
     * @returns {SensorAggregateType[]} Aggregated data.
     */
    calculateAverage(aggregatedData: IntermediateAggregatedDataDict): AggregatedDataSubrecord[] {
        const result = [];
        let idx = 0;
        for (const key in aggregatedData) {
        const value = aggregatedData[key];
        const average = value.sum / value.count;
        result.push(
                {
                    _id: idx.toString(), 
                    Datetime: new Date(key), 
                    Value: average, 
                }
            );
            idx++;
        }

        return result;
    }


    /**
     * @method aggregateDataUsingCustomStrategy
     * @description
     * This functions finds average value of the raw data.
     * It uses the custom strategy callback to do aggregation in 6 steps:
     *  1. Iterate over the raw data.
     *  2. Calculate the key for the aggregated data using the custom strategy callback. (key is either a hour, day or week)
     *  3. If the key does not exist in the aggregated data, create it.
     *  4. Increment the count of the aggregated data.
     *  5. Add the value to the sum of the aggregated data.
     *  6. Return the aggregated data.
     * @param values - Intermediate aggregated data.
     * @param customStrategyCallback - Callback function that returns a key for the aggregated data.
     * @returns {IntermediateAggregatedDataDict} Aggregated data.
     */
    aggregateDataUsingCustomStrategy(values: CreateSensorDataDto[], customStrategyCallback: (date: Date) => string) {

        const aggregatedData: IntermediateAggregatedDataDict = {};
        
        for (const entry of values) {
            const date = entry.Datetime;
            const key = customStrategyCallback(date);
        
            if (!aggregatedData[key]) {
                aggregatedData[key] = { count: 0, sum: 0 };
            }
        
            aggregatedData[key].count++;
            aggregatedData[key].sum += entry.Value;
        }

        return aggregatedData;
    }
}
