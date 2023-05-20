/**
 * @interface PutSensorDataDto
 * @property {Date} dateTime the date and time of the measurement, e.g. 2021-05-01T00:00:00.000Z
 * @property {string} room the room where the sensor is located, e.g. Room 1
 * @property {string} measurement the type of measurement, e.g. Temperature, Humidity, etc.
 * @property {number} value the value of the measurement, e.g. 20.5
 * @example
 * {
 *   "dateTime": "2021-05-01T00:00:00.000Z",
 *   "room": "Room 1",
 *   "measurement": "Temperature",
 *   "value": 20.5
 * }
 */
export interface PutSensorDataDto {
    dateTime: Date;
    room: string;
    measurement: string;
    value: number;
}
