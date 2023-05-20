import SensorSchemaType from "../types/sensor.schema.type";

type GroupType = {
    Measurement?: string;
    Room?: string;
}

type GrouppedSensorRecordType = { _id: {room?: string; measurement?: string;}, values: SensorSchemaType[] };

type SensorRecordType = GrouppedSensorRecordType | SensorSchemaType;

export default SensorRecordType;