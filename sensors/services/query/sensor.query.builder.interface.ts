import { TimeResolution } from "../../dto/read.sensor_data.dto";
import Query from 'mongoose';
import SensorSchemaType from "../../types/sensor.schema.type";

/**
 * The Builder interface specifies methods for creating the different parts of
 * the Product objects.
 */
interface SensorQueryBuilder {
    addLimitSkip(limit: number, page: number): unknown;
    // addGroupBy(arg0: boolean, arg1: boolean): void;
    addGroupBy(): void;
    addStartTimeFilter(startTime: Date): void;
    addEndTimeFilter(endTime: Date): void;
    addMeasurementTypeFilter(measurementType: string): void; 
    addRoomFilter(room: string): void;
    getQuery(): Query.Aggregate<SensorSchemaType[]>;
    
}

export default SensorQueryBuilder;