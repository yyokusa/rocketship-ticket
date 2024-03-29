import { TimeResolution } from "../../dto/read.sensor_data.dto";
import SensorRecordType from "../../types/sensor.record.type";
import Strategy from "./sensor.aggregation.strategy.interface";
import concreteStrategyRaw from "./sensor.aggregation.strategy.raw.service";
import concreteStrategyHourly from "./sensor.aggregation.strategy.hourly.service";
import concreteStrategyDaily from "./sensor.aggregation.strategy.daily.service";
import concreteStrategyWeekly from "./sensor.aggregation.strategy.weekly.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:sensor-aggregation-context-service");

/**
 * @class SensorAggregationContext
 * @description The Context defines the interface of interest to clients.
 * @property {Strategy} strategy
 * @method setStrategy(strategy: Strategy): void
 * @method getAggregateForSetStrategy(data: SensorRecordType[]): SensorRecordType[]
 */
export default class SensorAggregationContext {
    /**
     * @property {Strategy} The Context maintains a reference to one of the Strategy
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
                this.strategy = concreteStrategyRaw;
                break;
            case TimeResolution.hourly:
                this.strategy = concreteStrategyHourly;
                break;
            case TimeResolution.daily:
                this.strategy = concreteStrategyDaily;
                break;
            case TimeResolution.weekly:
                this.strategy = concreteStrategyWeekly;
                break;
            default:
                this.strategy = concreteStrategyRaw;
                break;
        }
    }

    /**
     * @method setStrategy
     * @description
     * Context allows replacing a Strategy object at runtime.
     * @param strategy - Strategy object
     */
    public setStrategy(strategy: Strategy) {
        this.strategy = strategy;
    }

    /**
     * @method getAggregateForSetStrategy
     * @description
     * The Context delegates work to the Strategy object instead of
     * implementing multiple versions of the algorithm on its own.
     * @param data - SensorRecordType[]
     * @returns SensorRecordType[]
     */
    public getAggregateForSetStrategy(data: SensorRecordType[]): SensorRecordType[] {
        log(`Context: aggregating data using the ${this.strategy.type} strategy`);
        return this.strategy.getAggregate(data);
    }
}