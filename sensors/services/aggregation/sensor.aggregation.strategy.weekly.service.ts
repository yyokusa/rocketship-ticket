import { GroupByDataType } from "./sensor.aggregation.strategy.custom.service";
import { CustomStrategy } from "./sensor.aggregation.strategy.custom.service";
import { TimeResolution } from "../../dto/read.sensor_data.dto";

/**
 * @class ConcreteStrategyWeekly
 * @extends CustomStrategy
 * @description Aggregation using custom weekly time resolution callback by utilizing the custom strategy.
 * @method getAggregate - Returns aggregated data.
 */
class ConcreteStrategyWeekly extends CustomStrategy {
    /**
     * @method getAggregate
     * @param {GroupByDataType[]} data - data to be aggregated
     * @returns {GroupByDataType[]} aggregated data 
     */
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

// use singleton as a module and export it with the ES6 export functionality
export default new ConcreteStrategyWeekly();
