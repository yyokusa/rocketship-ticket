import { CreateSensorDataDto } from "../dto/create.sensor_data.dto";

type SensorSchemaType = CreateSensorDataDto & {_id:string}

export default SensorSchemaType;
