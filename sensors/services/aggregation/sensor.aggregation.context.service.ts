import { ReadSensorDataDto, TimeResolution } from "../../dto/read.sensor_data.dto";
import SensorAggregateType from "../../types/sensor.aggregate.type";
import SensorRecordType from "../../types/sensor.record.type";
import SensorSchemaType from "../../types/sensor.schema.type";
import Strategy from "./sensor.aggregation.strategy.interface";
import { ConcreteStrategyRaw, ConcreteStrategyHourly, ConcreteStrategyDaily, ConcreteStrategyWeekly, GroupByDataType } from "./sensor.aggregation.strategy.service";
/**
 * The Context defines the interface of interest to clients.
 */
export default class SensorAggregationContext {
    /**
     * @type {Strategy} The Context maintains a reference to one of the Strategy
     * objects. The Context does not know the concrete class of a strategy. It
     * should work with all strategies via the Strategy interface.
     */
    private strategy: Strategy;
    
    /**
     * Usually, the Context accepts a strategy through the constructor, but also
     * provides a setter to change it at runtime.
     */
    constructor(timeResolution?: TimeResolution) {
        // set groupByMeasurement and groupByRoom
        // set strategy
        switch (timeResolution) {
            case TimeResolution.raw:
                this.strategy = new ConcreteStrategyRaw();
                break;
            case TimeResolution.hourly:
                this.strategy = new ConcreteStrategyHourly();
                break;
            case TimeResolution.daily:
                this.strategy = new ConcreteStrategyDaily();
                break;
            case TimeResolution.weekly:
                this.strategy = new ConcreteStrategyWeekly();
                break;
            default:
                this.strategy = new ConcreteStrategyRaw();
                break;
        }
    }

    /**
     * Usually, the Context allows replacing a Strategy object at runtime.
     */
    public setStrategy(strategy: Strategy) {
        this.strategy = strategy;
    }

    /**
     * The Context delegates some work to the Strategy object instead of
     * implementing multiple versions of the algorithm on its own.
     */
    public getAggregateForSetStrategy(data: SensorRecordType[]): SensorRecordType[] | GroupByDataType[] {
        console.log(`Context: aggregating data using the ${this.strategy.type} strategy`);
        return this.strategy.getAggregate(data);
    }
}