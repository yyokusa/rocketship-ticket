import express from 'express';

/**
 * @class CommonRoutesConfig
 * @description Abstract class for configuring routes
 * @method getName - returns name of the route
 * @method configureRoutes - abstract function for configuring routes
 * @property app - express.Application
 * @property name - name of the route
 */
export abstract class CommonRoutesConfig {
    app: express.Application;
    name: string;

    constructor(app: express.Application, name: string) {
        this.app = app;
        this.name = name;
        this.configureRoutes();
    }

    /**
     * @method getName
     * @description Returns name of the route
     * @returns - name of the route
     */
    getName() {
        return this.name;
    }

    /**
     * @method configureRoutes
     * @description Abstract function for configuring routes
     * @returns - express.Application
     */
    abstract configureRoutes(): express.Application;
}