export class Car {
    public id: string;
    public registrationNumber?: string;
    public brand: string;
    public model: string;
    public color: string;
    public engineNumber: string;
    public chassisNumber: string;
    public owner: string;
    public year: string;
    public createTime?: string;
    public modifyTime?: string;
    public registrationTime?: string;
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