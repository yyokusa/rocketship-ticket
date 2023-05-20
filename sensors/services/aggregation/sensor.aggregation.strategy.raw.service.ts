import Strategy from "./sensor.aggregation.strategy.interface";
import { TimeResolution } from "../../dto/read.sensor_data.dto";
import SensorSchemaType from "../../types/sensor.schema.type";

/**
 * @class ConcreteStrategyRaw
 * @description
 * Concrete Strategies implement the algorithm while following the base Strategy
 * interface. The interface makes them interchangeable in the Context.
 * @method getAggregate - Returns aggregated data.
 * @property type - Time resolution type.
 */
class ConcreteStrategyRaw implements Strategy {
    public type: TimeResolution;

    /**
     * @method getAggregate
     * @param {GroupByDataType[]} data - data to be aggregated
     * @returns {SensorSchemaType[]} aggregated data
     */
    public getAggregate(data: SensorSchemaType[]): SensorSchemaType[] {
        return data;
    }

    constructor() {
        this.type = TimeResolution.raw;
    }
}

// use singleton as a module and export it with the ES6 export functionality
export default new ConcreteStrategyRaw();
