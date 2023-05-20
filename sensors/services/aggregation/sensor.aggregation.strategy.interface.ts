// https://en.wikipedia.org/wiki/Single-responsibility_principle

import { TimeResolution } from "../../dto/read.sensor_data.dto";
import SensorAggregateType from "../../types/sensor.aggregate.type";
import SensorRecordType from "../../types/sensor.record.type";
import SensorSchemaType from "../../types/sensor.schema.type";
import {GroupByDataType} from "./sensor.aggregation.strategy.custom.service";
/**
 * The Strategy interface declares operations common to all supported versions
 * of some algorithm.
 *
 * The Context uses this interface to call the algorithm defined by Concrete
 * Strategies.
 */
interface Strategy {
    getAggregate(data: SensorRecordType[] | GroupByDataType[]): SensorRecordType[] | GroupByDataType[];
    type: TimeResolution;
}

export default Strategy;
