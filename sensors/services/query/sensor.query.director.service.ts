import { ReadSensorDataDto } from "../../dto/read.sensor_data.dto";
import SensorQueryBuilder from "./sensor.query.builder.interface";
/**
 * The Director is only responsible for executing the building steps in a
 * particular sequence. It is helpful when producing products according to a
 * specific order or configuration. Strictly speaking, the Director class is
 * optional, since the client can control builders directly.
 */
class SensorQueryDirector {
    private builder: SensorQueryBuilder;

    constructor(builder: SensorQueryBuilder) {
        this.builder = builder;
    }

    /**
     * The Director works with any builder instance that the client code passes
     * to it. This way, the client code may alter the final type of the newly
     * assembled product.
     */
    public setBuilder(builder: SensorQueryBuilder): void {
        this.builder = builder;
    }

    /**
     * The Director can construct several product variations using the same
     * building steps.
     */
    public buildSensorQuery(filterParams: ReadSensorDataDto, limit: number, page: number): void {
        // extract filterParams
        const {room: room, measurement: measurement, startTime, endTime} = filterParams;
        // if optionals are not set, do not call those filter methods from builder
        if (startTime) {
            console.log("\n\n\n----------adding startTime filter: ----------\n", startTime);
            this.builder.addStartTimeFilter(startTime);
        }
        if (endTime) {
            console.log("\n\n\n----------adding endTime filter: ----------\n", endTime);
            this.builder.addEndTimeFilter(endTime);
        }
        if (measurement) {
            console.log("\n\n\n----------adding measurement filter: ----------\n", measurement);
            this.builder.addMeasurementTypeFilter(measurement);
        }
        if (room) {
            console.log("\n\n\n----------adding room filter: ----------\n", room);
            this.builder.addRoomFilter(room);
        }
        // add limit and skip
        console.log("\n\n\n----------limit, page: ----------\n", limit, page);
        this.builder.addLimitSkip(limit, page);
        // add group by
        // TODO: refactor for easier extensibility maybe
        const filterByMeasurement = Boolean(measurement)
        const filterByRoom = Boolean(room)
        if (filterByMeasurement != filterByRoom) {
            console.log("\n\n\n----------adding group by: ----------\n");
            this.builder.addGroupBy(Boolean(room), Boolean(measurement));
        }
    }
}

export default SensorQueryDirector;