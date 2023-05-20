import SensorSchemaType from "../types/sensor.schema.type";

/**
 * @typedef GrouppedSensorRecordType
 * @property {{room?: string; measurement?: string;}} _id
 * @property {SensorSchemaType[]} values
 */
type GrouppedSensorRecordType = { _id: {room?: string; measurement?: string;}, values: SensorSchemaType[] };


/**
 * @typedef SensorRecordType
 * @type {GrouppedSensorRecordType | SensorSchemaType}
 */
type SensorRecordType = GrouppedSensorRecordType | SensorSchemaType;

export default SensorRecordType;