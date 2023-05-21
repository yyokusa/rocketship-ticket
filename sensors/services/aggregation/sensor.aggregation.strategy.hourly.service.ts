import { CustomStrategy } from "./sensor.aggregation.strategy.custom.service";
import { TimeResolution } from "../../dto/read.sensor_data.dto";
import { GrouppedSensorRecordType } from "../../types/sensor.record.type";
import { FinalAggregatedDataRecord } from "../../types/sensor.aggregate.record.type";

/**
 * @class ConcreteStrategyHourly
 * @extends CustomStrategy
 * @description Aggregation using custom hourly time resolution callback by utilizing the custom strategy.
 * @method getAggregate - Returns aggregated data.
 */
export class ConcreteStrategyHourly extends CustomStrategy {
    /**
     * @method getAggregate
     * @param {GrouppedSensorRecordType[]} data - data to be aggregated
     * @returns {FinalAggregatedDataRecord[]} aggregated data 
     */
    public getAggregate(data: GrouppedSensorRecordType[]): FinalAggregatedDataRecord[] {
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

// use singleton as a module and export it with the ES6 export functionality
export default new ConcreteStrategyHourly();
