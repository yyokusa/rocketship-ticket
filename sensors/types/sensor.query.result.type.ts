import SensorSchemaType from './sensor.schema.type';
import Query from 'mongoose';


type SensorQueryResultType = Query.Query<SensorSchemaType[], SensorSchemaType>;

export default SensorQueryResultType;
