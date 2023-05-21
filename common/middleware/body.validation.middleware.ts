import express from 'express';
import { validationResult } from 'express-validator';
/**
 * @class BodyValidationMiddleware
 * @description Middleware for validating the request body
 * @method verifyBodyFieldsErrors
 */
class BodyValidationMiddleware {
    /**
     * @method verifyBodyFieldsErrors
     * @description Middleware for validating the request body
     * @param req - express.Request
     * @param res - express.Response
     * @param next - express.NextFunction
     * @returns - express.Response | express.NextFunction
     */
    verifyBodyFieldsErrors(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() });
        }
        next();
    }
}

export default new BodyValidationMiddleware();