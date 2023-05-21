import { CustomStrategy } from "./sensor.aggregation.strategy.custom.service";
import { TimeResolution } from "../../dto/read.sensor_data.dto";
import { GrouppedSensorRecordType } from "../../types/sensor.record.type";
import { FinalAggregatedDataRecord } from "../../types/sensor.aggregate.record.type";

/**
 * @class ConcreteStrategyWeekly
 * @extends CustomStrategy
 * @description Aggregation using custom weekly time resolution callback by utilizing the custom strategy.
 * @method getAggregate - Returns aggregated data.
 */
class ConcreteStrategyWeekly extends CustomStrategy {
    /**
     * @method getAggregate
     * @param {GrouppedSensorRecordType[]} data - data to be aggregated
     * @returns {FinalAggregatedDataRecord[]} aggregated data 
     */
    public getAggregate(data: GrouppedSensorRecordType[]): FinalAggregatedDataRecord[] {
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

// use singleton as a module and export it with the ES6 export functionality
export default new ConcreteStrategyWeekly();
