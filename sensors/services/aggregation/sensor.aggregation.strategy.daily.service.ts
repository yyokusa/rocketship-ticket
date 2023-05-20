import { GroupByDataType } from "./sensor.aggregation.strategy.custom.service";
import { CustomStrategy } from "./sensor.aggregation.strategy.custom.service";
import { TimeResolution } from "../../dto/read.sensor_data.dto";

class ConcreteStrategyDaily extends CustomStrategy {
    public getAggregate(data: GroupByDataType[]): GroupByDataType[] {
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
