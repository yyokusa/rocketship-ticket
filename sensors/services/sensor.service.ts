import SensorDao from '../daos/sensor.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreateSensorDataDto } from '../dto/create.sensor_data.dto';
import { ReadSensorDataDto } from '../dto/read.sensor_data.dto';
import SensorAggregationContext from './aggregation/sensor.aggregation.context.service';
import SensorRecordType from '../types/sensor.record.type';
import { InternalResultType, InternalStatus } from '../types/internal/internal.result.type';
import debug from 'debug';


const log: debug.IDebugger = debug('app:sensor-service');

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
    /**
     * @method create
     * @param resource - sensor data to be created
     * @returns - id of the created sensor data entry
     */
    async create(resource: CreateSensorDataDto): Promise<InternalResultType> {
        return SensorDao.addSensorData(resource);
    }
    
    /**
     * @method createBulk
     * @param resources - sensor data to be created
     * @returns - result of the bulk insert
     */
    async createBulk(resources: CreateSensorDataDto[]) {
        return SensorDao.addSensorDataBulk(resources);
    }

    /**
     * @method list
     * @param limit - number of records to be returned
     * @param page - page number
     * @param filterParams - filter parameters
     * @returns - list of sensor data entries
     */
    async list(limit: number, page: number, filterParams: ReadSensorDataDto): Promise<InternalResultType> {
        let sensorDataFetchingResult: InternalResultType = await SensorDao.getSensorData(limit, page, filterParams);
        if (sensorDataFetchingResult.status !== InternalStatus.success) {
            log('Error fetching sensor data: ', sensorDataFetchingResult);
            return sensorDataFetchingResult;
        }
        
        const rawSensorData: SensorRecordType[] = sensorDataFetchingResult.data;
        if (rawSensorData.length === 0) {
            log('No data to aggregate.');
            return {
                message: "success",
                status: InternalStatus.success,
                data: rawSensorData,
            };
        }

        // set aggregation strategy based on the timeResolution parameter
        const sensorAggregationContext = new SensorAggregationContext(filterParams.timeResolution);
        // apply aggregation strategy
        const sensorData = sensorAggregationContext.getAggregateForSetStrategy(rawSensorData);
        log('Aggregated data: ', sensorData);
        return {
            message: "success",
            status: InternalStatus.success,
            data: sensorData,
        };
    }
}

export default new SensorService();
