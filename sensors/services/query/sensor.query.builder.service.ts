import Query, { Aggregate } from "mongoose";
import { TimeResolution } from "../../dto/read.sensor_data.dto";
import SensorQueryModelType from "../../types/sensor.query.model.type";
import SensorQueryResultType from "../../types/sensor.query.result.type";
import SensorQueryBuilder from "./sensor.query.builder.interface";
import SensorSchemaType from "../../types/sensor.schema.type";

/**
 * The Concrete Builder classes follow the Builder interface and provide
 * specific implementations of the building steps. Your program may have several
 * variations of Builders, implemented differently.
 */
export default class ConcreteSensorQueryBuilder implements SensorQueryBuilder {
    private model!: SensorQueryModelType;
    // private query!: Query.Aggregate<SensorSchemaType[]>;
    private query!: any;
    
    constructor(model: SensorQueryModelType) {
        this.reset(model);
    }

    public reset(model: SensorQueryModelType): void {
        this.model = model;
        // initially did find chaining, changed because of aggregate group by possibility
        // https://thecodebarbarian.com/how-find-works-in-mongoose.html
        this.query = [];
    }
    
    // https://masteringjs.io/tutorials/fundamentals/compare-dates
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

    public addEndTimeFilter(endTime: Date): void {
        if (!this.model) {
            return;
        }
        // check if query is empty
        if (this.query.length === 0)
            this.query.push({$match: {$and: [{Datetime: {$gte: endTime}}]}});
        else
            this.query[0].$match.$and.push({Datetime: {$lte: endTime}});
        
    }

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

    public addLimitSkip(limit: number, page: number): void {
        if (!this.model) {
            console.log("\n\n\n Model is empty\n\n\n")
            return;
        }
        this.query.push({$limit: limit});
        this.query.push({$skip: limit * page});
        console.log("\n\n\n Pushed limit: " + limit + ", and skip: " + limit*page + " \n\n\n")
    }

    public addGroupBy(filteredByRoom: boolean = false, filteredByMeasurement: boolean = false) {
        if (!this.model) {
            // TODO: log
            return;
        }

        if (filteredByRoom) {
            this.query.push({
                $group: {
                    _id: {
                        Measurement: "$Measurement",
                    },
                    values: {
                        $push: {
                            _id: "$_id", 
                            Datetime: "$Datetime",
                            Room: "$Room",
                            Value: "$Value"
                        }
                    }
                }
            })
        } else if (filteredByMeasurement) {
            this.query.push({
                $group: {
                    _id: {
                        Room: "$Room",
                    },
                    values: {
                        $push: {
                            _id: "$_id", 
                            Datetime: "$Datetime",
                            Measurement: "$Measurement",
                            Value: "$Value"
                        }
                    }
                }
            })
        }

    }

    public getQuery(): SensorQueryResultType {
        const result = this.query;
        this.reset(this.model);
        return result;
    }
}