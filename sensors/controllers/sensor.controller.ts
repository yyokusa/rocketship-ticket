// import express to add types to the request/response 
// objects from our controller functions
import express from 'express';
import SensorService from '../services/sensor.service';

// debug will be used with a custom context
import debug from 'debug';

import { ReadSensorDataDto, TimeResolution } from '../dto/read.sensor_data.dto';
import { CreateSensorDataDto } from '../dto/create.sensor_data.dto';

const log: debug.IDebugger = debug('app:sensors-controller');

// user controller singleton
/**
 * @class SensorController
 * @description Controller for the sensor data
 * @method createSensorData - create a new sensor data record
 * @method createSensorDataBulk - create multiple sensor data records
 * @method listSensorData - list sensor data records
 */
class SensorController {
    
    /**
     * @method createSensorData
     * @description Create a new sensor data record
     * This method will be called when the client makes a POST request to /sensors
     * @param req - Express request object
     * @param res - Express response object
     * @returns id of the newly created record
     */
    async createSensorData(req: express.Request, res: express.Response) {
        // use destructuring to extract the properties from the request body
        const {
            Room,
            Measurement,
            Value,
            Datetime,
        } = req.body;

        // construct a CreateSensorDataDto from the request body
        const createSensorDataDto: CreateSensorDataDto = {
            Room,
            Measurement,
            Value,
            // convert the Datetime string to a Date object
            Datetime: new Date(Datetime),
        };

        // call the create method from the SensorService
        const recordId = await SensorService.create(createSensorDataDto);
        // send the id of the newly created record back to the client with status 201
        res.status(201).send({ id: recordId });
    }
    
    /**
     * @method createSensorDataBulk
     * @description Create multiple sensor data records
     * This method will be called when the client makes a POST request to /sensors/bulk
     * @param req - Express request object
     * @param res - Express response object
     * @returns status code 201 if all records were created successfully, 500 otherwise
     */
    async createSensorDataBulk(req: express.Request, res: express.Response) {
        
        // convert the Datetime string to a Date object inside each sensorData object
        const resources: CreateSensorDataDto[] = req.body.map((sensorData: any) => {
            sensorData.Datetime = new Date(sensorData.Datetime);
            return sensorData;
        });
        const result = await SensorService.createBulk(resources);
        const message = result ? "success" : "failure";
        const status = result ? 201 : 500;
        if (result) {
            log("Created bulk records successfully");
        } else {
            log("Failed to create bulk records");
        }
        res.status(status).send({ message });
    }

    /**
     * @method listSensorData
     * @description List sensor data records
     * This method will be called when the client makes a GET request to /sensors
     * @param req - Express request object
     * @param res - Express response object
     * @returns a list of sensor data records
     */
    async listSensorsData(req: express.Request, res: express.Response) {
        // extract query parameters from req.body
        let {
            startTime,
            endTime,
            measurement,
            room,
            timeResolution,
        } = req.body;

        // construct a ReadSensorDataDto from the query parameters
        const readDataDto = {
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            measurement,
            room,
            timeResolution: TimeResolution[timeResolution  as keyof typeof TimeResolution],
        } as ReadSensorDataDto;

        const sensorsData = await SensorService.list(100, 0, readDataDto);
        
        res.status(200).send(sensorsData);
    }
}

export default new SensorController();
