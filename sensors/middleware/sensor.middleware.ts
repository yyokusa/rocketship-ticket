import express from 'express';
import debug from 'debug';

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
}

export default new SensorMiddleware();