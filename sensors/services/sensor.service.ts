import SensorDao from '../daos/sensor.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateSensorDataDto } from '../dto/create.sensor_data.dto';
import { ReadSensorDataDto } from '../dto/read.sensor_data.dto';
import SensorAggregationContext from './aggregation/sensor.aggregation.context.service';
import SensorRecordType from '../types/sensor.record.type';

/**
 * @class SensorService
 * @implements CRUD
 * @description presents the service layer for the sensor data
 * @method create - creates a new sensor data entry
 * @method createBulk - creates multiple sensor data entries
 * @method list - returns a list of sensor data entries
 */
//@ts-ignore
class SensorService implements CRUD {
    async create(resource: CreateSensorDataDto) {
        return SensorDao.addSensorData(resource);
    }
    
    async createBulk(resources: CreateSensorDataDto[]) {
        return SensorDao.addSensorDataBulk(resources);
    }

    async list(limit: number, page: number, filterParams: ReadSensorDataDto) {
        let rawSensorData: SensorRecordType[] = await SensorDao.getSensorData(limit, page, filterParams);
        // set aggregation strategy based on the timeResolution parameter
        const sensorAggregationContext = new SensorAggregationContext(filterParams.timeResolution);
        // apply aggregation strategy
        const sensorData = sensorAggregationContext.getAggregateForSetStrategy(rawSensorData);
        return sensorData;
    }
}

export default new SensorService();
