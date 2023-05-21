import { CreateSensorDataDto } from "../../dto/create.sensor_data.dto";
import { IntermediateAggregatedDataDict } from "../../types/sensor.aggregate.intermediate.type";
import { AggregatedDataSubrecord } from "../../types/sensor.aggregate.record.type";

/**
 * @description
 * This function calculates the average value of the aggregated data.
 * @param aggregatedData - Intermediate aggregated data.
 * @returns {SensorAggregateType[]} Aggregated data.
 */
export default function calculateAverage(aggregatedData: IntermediateAggregatedDataDict): AggregatedDataSubrecord[] {
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
export function aggregateDataUsingCustomStrategy(values: CreateSensorDataDto[], customStrategyCallback: (date: Date) => string) {

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