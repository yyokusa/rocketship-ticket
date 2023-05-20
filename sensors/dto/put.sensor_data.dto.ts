
export interface PutSensorDataDto {
    dateTime: Date;
    room: string;
    measurement: string;
    value: number;
}
