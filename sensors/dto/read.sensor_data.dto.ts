/**
 * @enum TimeResolution
 * @property {string} raw the raw time resolution
 * @property {string} hourly the hourly time resolution
 * @property {string} daily the daily time resolution
 * @property {string} weekly the weekly time resolution
 */
export enum TimeResolution {
    raw = "raw",
    hourly = "hourly",
    daily = "daily",
    weekly = "weekly",
}

/**
 * @interface ReadSensorDataDto
 * @property {Date} [startTime] the start time of the measurement, e.g. 2021-05-01T00:00:00.000Z
 * @property {Date} [endTime] the end time of the measurement, e.g. 2021-05-01T00:00:00.000Z
 * @property {string} [measurement] the type of measurement, e.g. Temperature, Humidity, etc.
 * @property {string} [room] the room where the sensor is located, e.g. Room 1
 * @property {TimeResolution} [timeResolution] the time resolution of the measurement, e.g. raw, hourly, daily, weekly
 * @example
 * {
 *  "startTime": "2021-05-01T00:00:00.000Z",
 *  "endTime": "2021-05-01T00:00:00.000Z",
 *  "measurement": "Temperature",
 *  "room": "Room 1",
 *  "timeResolution": "raw"
 * }
 */
export interface ReadSensorDataDto {
    startTime?: Date;
    endTime?: Date;
    measurement?: string;
    room?: string;
    timeResolution?: TimeResolution;
}
