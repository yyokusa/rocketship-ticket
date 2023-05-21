export enum InternalStatus {
    success = 'success',
    failure = 'failure',
}

export type InternalResultType = {
    message?: string;
    status: InternalStatus;
    data?: any;
}