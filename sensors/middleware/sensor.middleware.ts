import express from 'express';
import SensorService from '../services/sensor.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:sensors-middleware');
class SensorMiddleware {    

    async extractStarttime(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.startTime = req.query.startTime;
        next();
    }
    
    async extractEndtime(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.endTime = req.query.endTime;
        next();
    }
    
    async extractMeasurement(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.measurement = req.query.measurement;
        next();
    }
    
    async extractRoom(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.room = req.query.room;
        next();
    }
    
    async extractTimeResolution(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.timeResolution = req.query.timeResolution;
        next();
    }
}

export default new SensorMiddleware();