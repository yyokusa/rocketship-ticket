export type AggregatedDataSubrecord = { _id: string; Datetime: Date; Value: number; Room?: string; Measurement?: string;};
export type FinalAggregatedDataRecord = { _id: {measurement?: string; room?: string; }; values: AggregatedDataSubrecord[] };
