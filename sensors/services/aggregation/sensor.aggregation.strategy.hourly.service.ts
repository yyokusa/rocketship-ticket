import { GroupByDataType } from "./sensor.aggregation.strategy.custom.service";
import { CustomStrategy } from "./sensor.aggregation.strategy.custom.service";
import { TimeResolution } from "../../dto/read.sensor_data.dto";

export class ConcreteStrategyHourly extends CustomStrategy {
    public getAggregate(data: GroupByDataType[]): GroupByDataType[] {
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
