/**
 * @type IntermediateAggregatedDataDictionary
 * @description Intermediate aggregated data type.
 * @property {string} key - Key of the aggregated data.
 * @property {number} count - Count of the aggregated data.
 * @property {number} sum - Sum of the aggregated data.
 */
export type IntermediateAggregatedDataDict = { [key: string]: { count: number; sum: number; } };