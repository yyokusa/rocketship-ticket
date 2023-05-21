/**
 * @typedef SensorAggregateType
 * @property {string} _id
 * @property {Date} datetime
 * @property {number} value
 */
export type SensorAggregateType = {
    _id:string;
    Datetime: Date;
    Value: number;
}


export default SensorAggregateType;
