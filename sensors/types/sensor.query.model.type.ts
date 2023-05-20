import SensorSchemaType from '../types/sensor.schema.type';
import Query from 'mongoose';

type SensorQueryModelType = Query.Model<SensorSchemaType>;

export default SensorQueryModelType;
