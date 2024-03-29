import SensorQueryModelType from "../../types/sensor.query.model.type";
import SensorQueryBuilder from "./sensor.query.builder.interface";

/**
 * @class ConcreteSensorQueryBuilder
 * @implements SensorQueryBuilder
 * @description Concrete implementation of the SensorQueryBuilder.
 * The Concrete Builder classes follow the Builder interface and provide
 * specific implementations of the building steps. Your program may have several
 * variations of Builders, implemented differently.
 * @method addLimitSkip - Adds limit and skip to the query.
 * @method addGroupBy - Adds group by to the query.
 * @method addStartTimeFilter - Adds start time filter to the query.
 * @method addEndTimeFilter - Adds end time filter to the query.
 * @method addMeasurementTypeFilter - Adds measurement type filter to the query.
 * @method addRoomFilter - Adds room filter to the query.
 * @method getQuery - Returns the query.
 */
export default class ConcreteSensorQueryBuilder implements SensorQueryBuilder {
    private model!: SensorQueryModelType;
    private query!: any;
    
    constructor(model: SensorQueryModelType) {
        this.reset(model);
    }

    /**
     * @method reset
     * @description resets the model and the query
     * @param model - model to be used for the query
     */
    public reset(model: SensorQueryModelType): void {
        this.model = model;
        // initially did `find` chaining, changed because of aggregate group by possibility
        this.query = [];
    }
    
    /**
     * @method addStartTimeFilter
     * @description
     * This method adds start time filter to the query.
     * @param startTime - start time of the query
     */
    public addStartTimeFilter(startTime: Date): void {
        if (!this.model) {
            // TODO: log
            return;
        }
        // check if query is empty
        if (this.query.length === 0)
            this.query.push({$match: {$and: [{Datetime: {$gte: startTime}}]}});
        else
            this.query[0].$match.$and.push({Datetime: {$gte: startTime}});
    }

    /**
     * @method addEndTimeFilter
     * @description
     * This method adds end time filter to the query.
     * @param endTime - end time of the query
     */
    public addEndTimeFilter(endTime: Date): void {
        if (!this.model) {
            return;
        }
        // check if query is empty
        if (this.query.length === 0)
            this.query.push({$match: {$and: [{Datetime: {$lte: endTime}}]}});
        else
            this.query[0].$match.$and.push({Datetime: {$lte: endTime}});
        
    }
    /**
     * @method addMeasurementTypeFilter
     * @description
     * This method adds measurement type filter to the query.
     * @param measurementType - measurement type of the query
     */
    public addMeasurementTypeFilter(measurementType: string): void {
        if (!this.model) {
            return;
        }
        // check if query is empty
        if (this.query.length === 0)
            this.query.push({$match: {$and: [{Measurement: measurementType}]}});
        else
            this.query[0].$match.$and.push({Measurement: measurementType});
    }

    /**
     * @method addRoomFilter
     * @description
     * This method adds room filter to the query.
     * @param room - room of the query
     */
    public addRoomFilter(room: string): void {
        if (!this.model) {
            return;
        }
        // check if query is empty
        if (this.query.length === 0)
            this.query.push({$match: {$and: [{Room: room}]}});
        else
            this.query[0].$match.$and.push({Room: room});
    }

    /**
     * @method addLimitSkip
     * @description
     * This method adds limit and skip to the query.
     * @param limit - limit of the query
     * @param page - page of the query
     */
    public addLimitSkip(limit: number, page: number): void {
        if (!this.model) {
            console.log("\n\n\n Model is empty\n\n\n")
            return;
        }
        this.query.push({$limit: limit});
        this.query.push({$skip: limit * page});
        console.log("\n\n\n Pushed limit: " + limit + ", and skip: " + limit*page + " \n\n\n")
    }

    /**
     * @method addGroupBy
     * @description 
     * This method adds group by to the query in case aggregation is needed.
     */
    public addGroupBy() {
        if (!this.model) {
            // TODO: log
            return;
        }

        this.query.push({
            $group: {
                _id: {
                    room: "$Room",
                    measurement: "$Measurement",
                },
                values: {
                    $push: {
                        _id: "$_id", 
                        Datetime: "$Datetime",
                        Room: "$Room",
                        Measurement: "$Measurement",
                        Value: "$Value"
                    }
                }
            }
        })
    }

    /**
     * @method getQuery
     * @description
     * This method returns the prepared query.
     * @returns the query
     */
    public getQuery(): any {
        const result = this.query;
        this.reset(this.model);
        return result;
    }
}