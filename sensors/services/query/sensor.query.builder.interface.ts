/**
 * @class SensorQueryBuilder
 * @description Interface for the SensorQueryBuilder.
 * The Builder interface specifies methods for creating the different parts of
 * the Product objects.
 * @method addLimitSkip - Adds limit and skip to the query.
 * @method addGroupBy - Adds group by to the query.
 * @method addStartTimeFilter - Adds start time filter to the query.
 * @method addEndTimeFilter - Adds end time filter to the query.
 * @method addMeasurementTypeFilter - Adds measurement type filter to the query.
 * @method addRoomFilter - Adds room filter to the query.
 * @method getQuery - Returns the query.
 */
interface SensorQueryBuilder {
    addLimitSkip(limit: number, page: number): unknown;
    addGroupBy(): void;
    addStartTimeFilter(startTime: Date): void;
    addEndTimeFilter(endTime: Date): void;
    addMeasurementTypeFilter(measurementType: string): void; 
    addRoomFilter(room: string): void;
    getQuery(): any;
    
}

export default SensorQueryBuilder;