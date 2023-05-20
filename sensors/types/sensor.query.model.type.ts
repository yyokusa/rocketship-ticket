import SensorSchemaType from '../types/sensor.schema.type';
import Query from 'mongoose';

/**
 * @typedef SensorQueryModelType
 * @property {string} _id
 * @property {string} Room
 * @property {string} Measurement
 * @property {Date} Datetime
 * @property {number} Value
 */
type SensorQueryModelType = Query.Model<SensorSchemaType>;

export default SensorQueryModelType;
