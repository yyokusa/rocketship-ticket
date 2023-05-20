import { TimeResolution } from "../../dto/read.sensor_data.dto";
import SensorRecordType from "../../types/sensor.record.type";
import {GroupByDataType} from "./sensor.aggregation.strategy.custom.service";

/**
 * @interface Strategy
 * @description 
 * The Strategy interface declares operations common to all supported versions of some algorithm.
 * The Context uses this interface to call the algorithm defined by Concrete Strategies.
 * @method getAggregate
 * @method type
 */
interface Strategy {
    getAggregate(data: SensorRecordType[] | GroupByDataType[]): SensorRecordType[] | GroupByDataType[];
    type: TimeResolution;
}

export default Strategy;
