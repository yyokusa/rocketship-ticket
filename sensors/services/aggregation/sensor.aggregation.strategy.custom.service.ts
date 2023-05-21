import debug from 'debug';
import { TimeResolution } from "../../dto/read.sensor_data.dto";
import Strategy from "./sensor.aggregation.strategy.interface";
import calculateAverage, { aggregateDataUsingCustomStrategy } from "./sensor.aggregation.utils";
import { GrouppedSensorRecordType } from '../../types/sensor.record.type';
import { IntermediateAggregatedDataDict } from '../../types/sensor.aggregate.intermediate.type';
import { AggregatedDataSubrecord, FinalAggregatedDataRecord } from '../../types/sensor.aggregate.record.type';

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
            
            const aggregatedData: IntermediateAggregatedDataDict = aggregateDataUsingCustomStrategy(groupedRawRecord.values, strategyCallback);
            const averageOfAggregatedData: AggregatedDataSubrecord[] = calculateAverage(aggregatedData);

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
}
