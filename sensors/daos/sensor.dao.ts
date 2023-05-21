import { CreateSensorDataDto  } from "../dto/create.sensor_data.dto";
import { ReadSensorDataDto  } from "../dto/read.sensor_data.dto";
import mongooseService from '../../common/services/mongoose.service';
import shortid from 'shortid';
import debug from 'debug';
import SensorSchemaType from "../types/sensor.schema.type";
import SensorQueryModelType from "../types/sensor.query.model.type";
import SensorQueryDirector from "../services/query/sensor.query.director.service";
import ConcreteSensorQueryBuilder from "../services/query/sensor.query.builder.service";
import SensorQueryBuilder from "../services/query/sensor.query.builder.interface";
import SensorRecordType from "../types/sensor.record.type";
import { InternalResultType, InternalStatus } from "../types/internal/internal.result.type";

const log: debug.IDebugger = debug('app:mongo-dao');

/**
 * @class SensorDataDao
 * @description Data Access Object for SensorData
 * @method addSensorData
 * @method addSensorDataBulk
 * @method getSensorData
 */
class SensorDataDao {

    // mongoose schema
    Schema = mongooseService.getMongoose().Schema;

    // schema used to create a new SensorData document
    sensorDataSchema = new this.Schema<SensorSchemaType>({
        _id: String,
        Datetime: Date,
        Room: String,
        Measurement: String,
        Value: Number,
    }, { id: false });

    // mongoose model
    SensorData: SensorQueryModelType = mongooseService.getMongoose().model('SensorData', this.sensorDataSchema);

    constructor() {
        log('Created new instance of SensorDataDao');
    }

    /**
     * @method addSensorData
     * @description 
     * This method creates a new SensorData document and saves it to the database
     * @param sensorDataFields - fields to be added to the SensorData document
     * @returns id of the newly created document
     */
    async addSensorData(sensorDataFields: CreateSensorDataDto): Promise<InternalResultType> {
        const generatedId = shortid.generate();
        const sensorData = new this.SensorData({
            _id: generatedId,
            ...sensorDataFields
        });
        
        const result = sensorData.save().then(() =>
            ({
                message: generatedId,
                status: InternalStatus.success,
            })
        ).catch((error: any) => {
            log(error);
            return {
                message: "failure",
                status: InternalStatus.failure,
            };
        });

        return result;
    }
    
    /**
     * @method addSensorDataBulk
     * @description
     * This method creates new SensorData documents and saves them to the database
     * @param sensorDataBulkFields - array of fields to be added to the SensorData documents
     * @returns 
     */
    async addSensorDataBulk(sensorDataBulkFields: CreateSensorDataDto[]): Promise<InternalResultType> {
        const sensorDataBulk = sensorDataBulkFields.map((sensorDataFields) => {
            const generatedId = shortid.generate();
            const sensorData = new this.SensorData({
                _id: generatedId,
                ...sensorDataFields,
            });
            return sensorData;
        });

        const result = this.SensorData.insertMany(sensorDataBulk).then((docs: any) => {
            log(`Successfully inserted ${docs.length} documents`)
            return ({
                message: "success",
                status: InternalStatus.success,
            });
          }).catch((err: any) => {
            log(`Error inserting documents: ${err}`)
            return {
                message: "failure",
                status: InternalStatus.failure,
            };
          })
        
        return result;
    }
    
    /**
     * This function returns SensorData documents from the database
     * @param limit - number of documents to be returned
     * @param page - page number to be used with limit
     * @param filterParams - query parameters to be used to filter the documents
     * @returns array of SensorData documents
     */
    async getSensorData(limit = 25, page = 0, filterParams: ReadSensorDataDto): Promise<InternalResultType> {
        if (!this.SensorData) {
            log("SensorData model is not defined");
            return {
                message: "failure",
                status: InternalStatus.failure,
                data: [],
            };
        }

        let builder: SensorQueryBuilder = new ConcreteSensorQueryBuilder(this.SensorData);
        let director: SensorQueryDirector = new SensorQueryDirector(builder);
        director.buildSensorQuery(filterParams, limit, page);
        const query = builder.getQuery();
        log(`Constructed sensor data query: ${JSON.stringify(query)}`);
        
        return this.SensorData.aggregate(query).exec().then((result: SensorRecordType[]) => {
            log(`Successfully retrieved ${result.length} documents`);
            return {
                message: "success",
                status: InternalStatus.success,
                data: result,
            };
        }).catch((err: any) => {
            log(`Error retrieving documents: ${err}`);
            return {
                message: "failure",
                status: InternalStatus.failure,
                data: [],
            };
        });
    }
}

export default new SensorDataDao();

