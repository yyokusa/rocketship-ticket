import Strategy from "./sensor.aggregation.strategy.interface";
import { TimeResolution } from "../../dto/read.sensor_data.dto";
import SensorSchemaType from "../../types/sensor.schema.type";

/**
 * Concrete Strategies implement the algorithm while following the base Strategy
 * interface. The interface makes them interchangeable in the Context.
 */
class ConcreteStrategyRaw implements Strategy {
    public type: TimeResolution;

    public getAggregate(data: SensorSchemaType[]): SensorSchemaType[] {
        return data;
    }

    constructor() {
        this.type = TimeResolution.raw;
    }
}

// use singleton as a module and export it with the ES6 export functionality
export default new ConcreteStrategyRaw();
