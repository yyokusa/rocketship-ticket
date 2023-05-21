import express from 'express';
import debug from 'debug';
import { TimeResolution } from '../dto/read.sensor_data.dto';

const log: debug.IDebugger = debug('app:sensors-middleware');

/**
 * @class SensorMiddleware
 * @description Middleware for Sensor routes
 * @method extractStarttime
 * @method extractEndtime
 * @method extractMeasurement
 * @method extractRoom
 * @method extractTimeResolution
 */
class SensorMiddleware {    

    /**
     * @method extractStarttime
     * @description
     * Stores the startTime query parameter in the request body
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next function
     */
    async extractStarttime(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.startTime = req.query.startTime;
        if (req.body.startTime) {
            log("Set query parameter startTime: " + req.body.startTime);
        }
        next();
    }
    
    /**
     * @method extractEndtime
     * @description
     * Stores the endTime query parameter in the request body
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next function
     */
    async extractEndtime(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.endTime = req.query.endTime;
        if (req.body.endTime) {
            log("Set query parameter endTime: " + req.body.endTime);
        }
        next();
    }
    
    /**
     * @method extractMeasurement
     * @description
     * Stores the measurement query parameter in the request body
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next function
     */
    async extractMeasurement(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.measurement = req.query.measurement;
        if (req.body.measurement) {
            log("Set query parameter measurement: " + req.body.measurement);
        }
        next();
    }
    
    /**
     * @method extractRoom
     * @description
     * Stores the room query parameter in the request body
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next function
     */
    async extractRoom(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.room = req.query.room;
        if (req.body.room) {
            log("Set query parameter room: " + req.body.room);
        }
        next();
    }
    
    /**
     * @method extractTimeResolution
     * @description
     * Stores the timeResolution query parameter in the request body
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next function
     */
    async extractTimeResolution(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.timeResolution = req.query.timeResolution;
        if (req.body.timeResolution) {
            log("Set query parameter timeResolution: " + req.body.timeResolution);
        }
        next();
    }

    /**
     * @method extractSensorId
     * @description
     * Checks if the startTime and endTime query parameters are valid together
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next function
     * @returns 400 if startTime is after endTime
     * @returns next() if startTime is before endTime
     */
    areDatesTupleValid(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        // check if startTime is before endTime
        if (req.body['startTime'] && 
            req.body['endTime'] &&
            req.body['startTime'] > req.body['endTime']) {
            return res.status(400).send({
                message: "startTime must be before endTime"
            });
        }
        
        return next();
    }

    /**
     * @method isMeasurementValid
     * @description
     * Checks if the timeResolution query parameter is valid
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next function
     * @returns 400 if timeResolution is not one of TimeResolution enum
     * @returns next() if timeResolution is one of TimeResolution enum
     */
    isTimeResolutionValid(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        // check if timeResolution is valid by checking if its value is not one of TimeResolution enum
        if (req.body['timeResolution'] && !Object.values(TimeResolution).includes(req.body['timeResolution'])) {
            return res.status(400).send({
                message: "timeResolution must be one of " + Object.values(TimeResolution)
            });
        }
        
        return next();
    }
}

export default new SensorMiddleware();