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
interface SensorQueryBuilder extends BaseFilterable, TimeFilterable, MeasurementFilterable, RoomFilterable, LimitSkipFilterable, GroupFilterable {}

interface BaseFilterable {
    getQuery(): any;
}

interface TimeFilterable {
    addStartTimeFilter(startTime: Date): void;
    addEndTimeFilter(endTime: Date): void;
}

interface MeasurementFilterable {
    addMeasurementTypeFilter(measurementType: string): void;
}

interface RoomFilterable {
    addRoomFilter(room: string): void;
}

interface LimitSkipFilterable {
    addLimitSkip(limit: number, page: number): void;
}

interface GroupFilterable {
    addGroupBy(): void;
}

export default SensorQueryBuilder;