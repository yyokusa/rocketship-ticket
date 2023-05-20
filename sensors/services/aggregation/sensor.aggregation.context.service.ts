import { TimeResolution } from "../../dto/read.sensor_data.dto";
import SensorAggregateType from "../../types/sensor.aggregate.type";
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
    private groupByMeasurement: boolean;
    private groupByRoom: boolean;
    /**
     * Usually, the Context accepts a strategy through the constructor, but also
     * provides a setter to change it at runtime.
     */
    constructor(timeResolution?: TimeResolution, groupByMeasurement: boolean = false, groupByRoom: boolean = false) {
        // set groupByMeasurement and groupByRoom
        this.groupByMeasurement = groupByMeasurement;
        this.groupByRoom = groupByRoom;

        // set strategy
        switch (timeResolution) {
            case TimeResolution.raw:
                this.strategy = new ConcreteStrategyRaw();
                break;
            case TimeResolution.hourly:
                this.strategy = new ConcreteStrategyHourly(this.groupByMeasurement, this.groupByRoom)
                break;
            case TimeResolution.daily:
                this.strategy = new ConcreteStrategyDaily(this.groupByMeasurement, this.groupByRoom)
                break;
            case TimeResolution.weekly:
                this.strategy = new ConcreteStrategyWeekly(this.groupByMeasurement, this.groupByRoom)
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
    public getAggregateForSetStrategy(data: SensorSchemaType[]): SensorSchemaType[] | GroupByDataType[] {
        console.log(`Context: aggregating data using the ${this.strategy.type} strategy`);
        return this.strategy.getAggregate(data);
    }
}