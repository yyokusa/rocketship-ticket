import {IntermediateAggregatedDataType} from "./sensor.aggregation.strategy.custom.service";
import SensorAggregateType from "../../types/sensor.aggregate.type";

export default function calculateAverage(aggregatedData: IntermediateAggregatedDataType): SensorAggregateType[] {
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

// TODO: use types
export function aggregateDataUsingCustomStrategy(values: {
    _id: string;
    datetime: Date;
    value: number;
    room?: string | undefined;
    measurement?: string | undefined;
}[], customStrategyCallback: (date: Date) => string) {

    const aggregatedData: IntermediateAggregatedDataType = {};
    
    for (const entry of values) {
        const date = entry.datetime;
        const key = customStrategyCallback(date);
    
        if (!aggregatedData[key]) {
            aggregatedData[key] = { count: 0, sum: 0 };
        }
    
        aggregatedData[key].count++;
        aggregatedData[key].sum += entry.value;
    }

    return aggregatedData;
}