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
     * This function creates a new SensorData document and saves it to the database
     * @param sensorDataFields - fields to be added to the SensorData document
     * @returns id of the newly created document
     */
    async addSensorData(sensorDataFields: CreateSensorDataDto) {
        const generatedId = shortid.generate();
        const sensorData = new this.SensorData({
            _id: generatedId,
            ...sensorDataFields
        });
        await sensorData.save();
        return generatedId;
    }
    
    /**
     * This function creates new SensorData documents and saves them to the database
     * @param sensorDataBulkFields - array of fields to be added to the SensorData documents
     * @returns 
     */
    async addSensorDataBulk(sensorDataBulkFields: CreateSensorDataDto[]) {
        const sensorDataBulk = sensorDataBulkFields.map((sensorDataFields) => {
            const generatedId = shortid.generate();
            const sensorData = new this.SensorData({
                _id: generatedId,
                ...sensorDataFields,
            });
            return sensorData;
        });

        const result: boolean = await this.SensorData.insertMany(sensorDataBulk).then((docs: any) => {
            log(`Successfully inserted ${docs.length} documents`)
            return true;
          }).catch((err: any) => {
            log(`Error inserting documents: ${err}`)
            return false;
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
    async getSensorData(limit = 25, page = 0, filterParams: ReadSensorDataDto): Promise<SensorRecordType[]> {
        if (!this.SensorData) {
            log("SensorData model is not defined");
        }

        let builder: SensorQueryBuilder = new ConcreteSensorQueryBuilder(this.SensorData);
        let director: SensorQueryDirector = new SensorQueryDirector(builder);
        director.buildSensorQuery(filterParams, limit, page);
        const query = builder.getQuery();
        // TODO: handle error
        log(`Query to be applied: ${JSON.stringify(query)}`);
        return this.SensorData.aggregate(query).exec();
    }
}

export default new SensorDataDao();

