import debug from "debug";
import { ReadSensorDataDto } from "../../dto/read.sensor_data.dto";
import SensorQueryBuilder from "./sensor.query.builder.interface";

const log: debug.IDebugger = debug('app:sensor-query-director');

/**
 * @class SensorQueryDirector
 * @description Director class for the builder pattern.
 * The Director is only responsible for executing the building steps in a
 * particular sequence. It is helpful when producing products according to a
 * specific order or configuration. Strictly speaking, the Director class is
 * optional, since the client can control builders directly.
 * @property builder - Builder instance.
 * @method setBuilder - Sets the builder.
 * @method buildSensorQuery - Builds the query.
 */
class SensorQueryDirector {
    private builder: SensorQueryBuilder;

    constructor(builder: SensorQueryBuilder) {
        this.builder = builder;
    }

    /**
     * @method setBuilder
     * @description Sets the builder.
     * The Director works with any builder instance that the client code passes
     * to it. This way, the client code may alter the final type of the newly
     * assembled product.
     * @param builder - Builder instance.
     * @returns void
     */
    public setBuilder(builder: SensorQueryBuilder): void {
        this.builder = builder;
    }

    /**
     * @method buildSensorQuery
     * @description Builds the query.
     * The Director can construct several product variations using the same
     * building steps.
     * @param filterParams - Filter parameters.
     * @param limit - Limit of the query.
     * @param page - Page of the query.
     * @returns void
     */
    public buildSensorQuery(filterParams: ReadSensorDataDto, limit: number, page: number): void {
        // extract filter params
        const {room: room, measurement: measurement, startTime, endTime, timeResolution} = filterParams;
        // if optionals are not set, do not call those filter methods from builder
        if (startTime && !Number.isNaN(startTime.valueOf())) {
            log("Adding startTime filter", startTime);
            this.builder.addStartTimeFilter(startTime);
        }
        if (endTime && !Number.isNaN(endTime.valueOf())) {
            log("Adding endTime filter: ", endTime);
            this.builder.addEndTimeFilter(endTime);
        }
        if (measurement) {
            log("Adding measurement filter: ", measurement);
            this.builder.addMeasurementTypeFilter(measurement);
        }
        if (room) {
            log("Adding room filter: ", room);
            this.builder.addRoomFilter(room);
        }
        
        // add limit and skip
        log("Adding limit with page: ", limit, page);
        this.builder.addLimitSkip(limit, page);

        // add group by because of time resolution
        if (timeResolution) {
            log("Adding group by");
            this.builder.addGroupBy();
        }
    }
}

export default SensorQueryDirector;