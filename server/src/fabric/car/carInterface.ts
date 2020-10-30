export interface Car {
    UID: string;
    registrationNumber?: string;
    brand: string;
    model: string;
    color: string;
    vin: string;
    owner?: string;
    createTime?: string;
    modifyTime?: string;
    registrationState?: string;
    processedPolice?: string;
}