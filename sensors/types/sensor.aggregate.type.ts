/**
 * @typedef SensorAggregateType
 * @property {string} _id
 * @property {Date} datetime
 * @property {number} value
 */
export type SensorAggregateType = {
    _id:string;
    datetime: Date;
    value: number;
}


export default SensorAggregateType;
