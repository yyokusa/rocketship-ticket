// allow use distinct time resolutions and expressiveness
export enum TimeResolution {
    raw = "raw",
    hourly = "hourly",
    daily = "daily",
    weekly = "weekly",
}

// TODO: mention all parameters are optional
export interface ReadSensorDataDto {
    startTime?: Date;
    endTime?: Date;
    measurement?: string;
    room?: string;
    timeResolution?: TimeResolution;
}
