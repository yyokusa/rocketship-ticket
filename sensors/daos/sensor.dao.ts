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

class SensorDataDao {

    Schema = mongooseService.getMongoose().Schema;

    sensorDataSchema = new this.Schema<SensorSchemaType>({
        _id: String,
        Datetime: Date,
        Room: String,
        Measurement: String,
        Value: Number,
    }, { id: false });

    SensorData: SensorQueryModelType = mongooseService.getMongoose().model('SensorData', this.sensorDataSchema);

    constructor() {
        log('Created new instance of SensorDataDao');
    }

    async addSensorData(sensorDataFields: CreateSensorDataDto) {
        const generatedId = shortid.generate();
        const sensorData = new this.SensorData({
            _id: generatedId,
            ...sensorDataFields
        });
        await sensorData.save();
        return generatedId;
    }
    
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
            // TODO: LOG SUCCESS
            return true;
          }).catch((err: any) => {
            // TODO: LOG ERROR
            return false;
          })
        
        return result;
    }
    
    async getSensorData(limit = 25, page = 0, filterParams: ReadSensorDataDto): Promise<SensorRecordType[]> {
        // log if model is not defined
        if (!this.SensorData) {
            log("SensorData model is not defined");
        }

        let builder: SensorQueryBuilder = new ConcreteSensorQueryBuilder(this.SensorData);
        let director: SensorQueryDirector = new SensorQueryDirector(builder);
        director.buildSensorQuery(filterParams, limit, page);
        const query = builder.getQuery();
        // TODO: handle error
        // TODO: log to be applied query
        return this.SensorData.aggregate(query).exec();
    }

    // query data with parameters 
    // for start and end times, 
    // measurement type, 
    // room, 
    // and time resolution (raw, hourly, daily, weekly), 
    // returning the queried data in a JSON format.

    // Each parameter should be optional to provide for the user. 
    // (The default value for resolution is "raw"). 
    // If the resolution is not set to "raw," then you need
    //  to find the average value of all the values that
    //  fall within a time bucket of the chosen resolution. 
    // For example, if the hourly resolution is chosen, 
    // you should average all the values that occur within a specific hour.
}

export default new SensorDataDao();

