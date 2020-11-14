export class Car {
    public id: string;
    public registrationNumber?: string;
    public brand: string;
    public model: string;
    public color: string;
    public vin: string;
    public owner: string;
    public createTime?: string;
    public modifyTime?: string;
    public registrationState: string;
    public processedPolice?: string;
    public docType: string;
}

export class ChangeOwnerRequest {
    public id: string;
    public carId: string;
    public currentOwner: string;
    public newOwner: string;
    public state: string;
    public createTime?: string;
    public modifyTime?: string;
    public acceptTime?: string;
    public rejectTime?: string;
}
