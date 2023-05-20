import SensorSchemaType from './sensor.schema.type';
import Query from 'mongoose';

/**
 * @typedef SensorQueryResultType
 * @property {SensorSchemaType[]} docs
 */
type SensorQueryResultType = Query.Query<SensorSchemaType[], SensorSchemaType>;

export default SensorQueryResultType;
