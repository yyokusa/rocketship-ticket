import { CreateSensorDataDto } from "../dto/create.sensor_data.dto";

/**
 * @typedef SensorSchemaType
 * @property {string} _id
 * @property {string} Room
 * @property {string} Measurement
 * @property {Date} Datetime
 * @property {number} Value
 */
type SensorSchemaType = CreateSensorDataDto & {_id:string}

export default SensorSchemaType;
