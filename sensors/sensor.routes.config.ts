import { CommonRoutesConfig } from '../common/common.routes.config';
import SensorController from './controllers/sensor.controller';
import SensorMiddleware from './middleware/sensor.middleware';
import express from 'express';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body, query } from 'express-validator';

/**
 * @class SensorRoutes
 * @extends CommonRoutesConfig
 * @description Sensor routes configuration
 * @method configureRoutes - configures the routes for the sensor data
 */
export class SensorRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'SensorRoutes');
    }

    /**
     * @method configureRoutes
     * @description configures the routes for the sensor data
     */
    configureRoutes(): express.Application {
        
        // set POST /sensors endpoint
        this.app
            .route(`/sensors`)
            .post(
                body('Room').isString(),
                body('Measurement').isString(),
                body('Value').isNumeric(),
                body('Datetime').isISO8601().withMessage('Must be a ISO8601 date.'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                SensorController.createSensorData
            );

        // TODO: maybe would secure this for internal use only
        // set POST /sensors/bulk endpoint
        this.app
            .route(`/sensors/bulk`)
            .post(
                body().isArray(),
                body('*.Room').isString(),
                body('*.Measurement').isString(),
                body('*.Value').isNumeric(),
                body('*.Datetime').isISO8601().withMessage('Must be a ISO8601 date.'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                SensorController.createSensorDataBulk
            );

            
        // set GET /sensors endpoint
        this.app
            .route(`/sensors`)
            .get(
                query('room').optional().isString(),
                query('measurement').optional().isString(),
                query('value').optional().isNumeric(),
                query('startTime').optional().isISO8601().withMessage('Must be a ISO8601 date.'),
                query('endTime').optional().isISO8601().withMessage('Must be a ISO8601 date.'),
                query('timeResolution').optional().isString(),
                SensorMiddleware.extractStarttime,
                SensorMiddleware.extractEndtime,
                SensorMiddleware.extractMeasurement,
                SensorMiddleware.extractRoom,
                SensorMiddleware.extractTimeResolution,
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                SensorMiddleware.areDatesTupleValid,
                SensorMiddleware.isTimeResolutionValid,
                SensorController.listSensorsData
            );
        
       
        return this.app;
    }
}
