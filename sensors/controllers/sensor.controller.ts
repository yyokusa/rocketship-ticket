// we import express to add types to the request/response 
// objects from our controller functions
import express from 'express';

// we import our newly created user services
import SensorService from '../services/sensor.service';

// we import the argon2 library for password hashing
import argon2 from 'argon2';

// we use debug with a custom context as described in Part 1
import debug from 'debug';

import { PatchSensorDataDto } from '../dto/patch.sensor_data.dto'; 
import { TimeResolution } from '../dto/read.sensor_data.dto';
import { CreateSensorDataDto } from '../dto/create.sensor_data.dto';

const log: debug.IDebugger = debug('app:users-controller');

// user controller singleton
class SensorController {

    async createSensorData(req: express.Request, res: express.Response) {
        // req.body.password = await argon2.hash(req.body.password);
        console.log("req.body: ", req.body);
        
        const {
            Room,
            Measurement,
            Value,
            Datetime,
        } = req.body;

        const createSensorDataDto: CreateSensorDataDto = {
            Room,
            Measurement,
            Value,
            Datetime: new Date(Datetime),
        };

        const userId = await SensorService.create(createSensorDataDto);
        res.status(201).send({ id: userId });
    }
    
    async createSensorDataBulk(req: express.Request, res: express.Response) {
        console.log("req.body: ", req.body);
        
        // convert the Datetime string to a Date object inside each sensorData object
        const resources: CreateSensorDataDto[] = req.body.map((sensorData: any) => {
            sensorData.Datetime = new Date(sensorData.Datetime);
            return sensorData;
        });
        // send CreateSensorDataDto[] to the service
        const result = await SensorService.createBulk(resources);
        const message = result ? "success" : "failure";
        const status = result ? 201 : 500;
        res.status(status).send({ message });
    }

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
            // TODO: looks ugly, find a better way to do this
            startTime: undefined === startTime ? undefined : new Date(startTime),
            endTime: undefined === endTime ? undefined : new Date(endTime),
            measurement,
            room,
            timeResolution: TimeResolution[timeResolution  as keyof typeof TimeResolution],
        };

        const sensorsData = await SensorService.list(100, 0, readDataDto);

        res.status(200).send(sensorsData);
    }
}

export default new SensorController();
