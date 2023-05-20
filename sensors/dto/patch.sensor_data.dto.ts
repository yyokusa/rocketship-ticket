import { PutSensorDataDto } from './put.sensor_data.dto';

/**
 * @interface PatchSensorDataDto
 * @property {Date} [Datetime] the date and time of the measurement, e.g. 2021-05-01T00:00:00.000Z
 * @property {string} [Room] the room where the sensor is located, e.g. Room 1
 * @property {string} [Measurement] the type of measurement, e.g. Temperature, Humidity, etc.
 * @property {number} [Value] the value of the measurement, e.g. 20.5
 * @example
 * {
 *   "Datetime": "2021-05-01T00:00:00.000Z",
 *   "Room": "Room 1",
 *   "Measurement": "Temperature",
 *   "Value": 20.5
 * }
 */
export interface PatchSensorDataDto extends Partial<PutSensorDataDto> {}