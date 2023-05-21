import { TimeResolution } from "../../dto/read.sensor_data.dto";
import SensorRecordType from "../../types/sensor.record.type";

/**
 * @interface Strategy
 * @description 
 * The Strategy interface declares operations common to all supported versions of some algorithm.
 * The Context uses this interface to call the algorithm defined by Concrete Strategies.
 * @method getAggregate
 * @method type
 */
interface Strategy {
    getAggregate(data: SensorRecordType[]): SensorRecordType[];
    type: TimeResolution;
}

export default Strategy;
