import { CommonRoutesConfig } from '../common/common.routes.config';
import SensorController from './controllers/sensor.controller';
import SensorMiddleware from './middleware/sensor.middleware';
import express from 'express';
import BodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import { body } from 'express-validator';

export class SensorRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'SensorRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/sensors`)
            // TODO: test endpoint
            .post(
                body('Room').isString(),
                body('Measurement').isString(),
                body('Value').isNumeric(),
                body('Datetime').isISO8601().withMessage('Must be a ISO8601 date.'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                SensorController.createSensorData
            );

        // TODO: maybe would secure this for internal use only
        this.app
            .route(`/sensors/bulk`)
            // TODO: test endpoint
            .post(
                body().isArray(),
                body('*.Room').isString(),
                body('*.Measurement').isString(),
                body('*.Value').isNumeric(),
                body('*.Datetime').isISO8601().withMessage('Must be a ISO8601 date.'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                SensorController.createSensorDataBulk
            );

            
        // https://stackabuse.com/get-query-strings-and-parameters-in-express-js/
        this.app
            .route(`/sensors`)
            .get(
                SensorMiddleware.extractStarttime,
                SensorMiddleware.extractEndtime,
                SensorMiddleware.extractMeasurement,
                SensorMiddleware.extractRoom,
                SensorMiddleware.extractTimeResolution,
                SensorController.listSensorsData
            );
        
       
        return this.app;
    }
}
