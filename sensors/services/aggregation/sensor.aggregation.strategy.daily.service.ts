import { CustomStrategy } from "./sensor.aggregation.strategy.custom.service";
import { TimeResolution } from "../../dto/read.sensor_data.dto";
import { GrouppedSensorRecordType } from "../../types/sensor.record.type";
import { FinalAggregatedDataRecord } from "../../types/sensor.aggregate.record.type";

/**
 * @class ConcreteStrategyDaily
 * @extends CustomStrategy
 * @description Aggregation using custom daily time resolution callback by utilizing the custom strategy.
 * @method getAggregate - Returns aggregated data.
 */
class ConcreteStrategyDaily extends CustomStrategy {
    /**
     * @method getAggregate
     * @param {GrouppedSensorRecordType[]} data - data to be aggregated
     * @returns {FinalAggregatedDataRecord[]} aggregated data 
     */
    public getAggregate(data: GrouppedSensorRecordType[]): FinalAggregatedDataRecord[] {
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

// use singleton as a module and export it with the ES6 export functionality
export default new ConcreteStrategyDaily();
