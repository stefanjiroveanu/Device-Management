export interface QueuePayload {
    device : {
        deviceUuid:string,
        maxEnergyConsumption:number,
        userUuid:string
    }
    operation: string
}