import mongoose from 'mongoose';
import debug from 'debug';

const log: debug.IDebugger = debug('app:mongoose-service');

/**
 * @class MongooseService
 * @description Mongoose Service
 * @method connectWithRetry - connect to MongoDB with retry
 * @method getMongoose - get mongoose module
 * @property count - number of retries
 * @property mongooseOptions - mongoose options
 */
class MongooseService {
    private count = 0;
    private mongooseOptions = {
        serverSelectionTimeoutMS: 5000,
    };

    constructor() {
        this.connectWithRetry();
    }

    /**
     * @method getMongoose
     * @description Get mongoose module
     * @returns - mongoose
     */
    getMongoose() {
        return mongoose;
    }

    /**
     * @method connectWithRetry
     * @description Connect to MongoDB with retry
     */ 
    connectWithRetry = () => {
        log('Attempting MongoDB connection (will retry if needed)');
        mongoose
            .connect('mongodb://localhost:27017/api-db', this.mongooseOptions)
            .then(() => {
                log('MongoDB is connected');
            })
            .catch((err) => {
                const retrySeconds = 5;
                log(
                    `MongoDB connection unsuccessful (will retry #${++this
                        .count} after ${retrySeconds} seconds):`,
                    err
                );
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };
}
export default new MongooseService();