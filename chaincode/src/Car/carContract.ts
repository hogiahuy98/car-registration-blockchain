import { Contract ,Context } from 'fabric-contract-api';
import { Car, ChangeOwnerRequest } from './car';
import {uid} from 'uid';


const DOCTYPE = 'car';
const PENDING_REGISTRATION_NUMBER = 'jotaro';
const REGISTRATION_STATE = {
    PENDING: 'pending',
    REGISTERED: 'registered',
    REJECTED: 'rejected',
}
const CHANGE_OWNER_STATE = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
}
const CONTRACT_NAME = 'car';
const BOOLEAN_STRING = {
    true: 'true',
    false: 'false',
}

export class CarContract extends Contract {

    constructor(){
        super(CONTRACT_NAME);
    }

    public async registryCar(ctx: Context, ...params: string[]): Promise<string>{
        const car: Car = {
            id: params[0],
            registrationNumber: PENDING_REGISTRATION_NUMBER,
            vin: params[1],
            brand: params[2],
            model: params[3],
            color: params[4],
            owner: this.getUserId(ctx), //Owner identity card number
            registrationState: REGISTRATION_STATE.PENDING,
            createTime: new Date().toString(),
            modifyTime: new Date().toString(),
            docType: DOCTYPE,
        };
        console.log(params);
        await ctx.stub.putState(car.id, Buffer.from(JSON.stringify(car)));
        return ctx.stub.getTxID();
    }


    public async acceptRegistration(ctx: Context,  carId: string, registrationNumber: string): Promise<string> {
        const carAsBytes = await ctx.stub.getState(carId);
        let car: any;
        try {
            car = JSON.parse(carAsBytes.toString());
        } catch (error) {
            return "";
        }
        car.processedPolice = this.getUserId(ctx);
        car.registrationNumber = registrationNumber;
        car.registrationState = REGISTRATION_STATE.REGISTERED;
        car.modifyTime = new Date().toString();
        await ctx.stub.putState(carId, Buffer.from(JSON.stringify(car)));
        return ctx.stub.getTxID();
    }

    public async rejectRegistration(ctx: Context,  carId: string): Promise<string> {
        const carAsBytes = await ctx.stub.getState(carId);
        let car: any;
        try {
            car = JSON.parse(carAsBytes.toString());
        } catch (error) {
            return "";
        }
        car.processedPolice = this.getUserId(ctx);
        car.registrationState = REGISTRATION_STATE.REJECTED;
        car.modifyTime = new Date().toString();
        await ctx.stub.putState(carId, Buffer.from(JSON.stringify(car)));
        return ctx.stub.getTxID();
    }

    public async queryAllCars(ctx: Context) {
        const queryString: any = { };
        queryString.selector = {
            docType: DOCTYPE,
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }


    public async queryCarById(ctx: Context, carId: string) {
        const queryString: any = { };
        queryString.selector = {
            docType: DOCTYPE,
            id: carId
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult)[0];
    }


    public async queryCarByRegistrationNumber(ctx: Context, registrationNumber: string): Promise<string>{
        const queryString: any = {}
        queryString.selector = {
            registrationNumber: registrationNumber,
        }
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult)[0];
    }


    public async queryPendingCarByOwnerIdentityCardNumber(ctx: Context, ownerIdentityCardNumber: string): Promise<string>{
        const queryString: any = {}
        queryString.selector = {
            onwer: ownerIdentityCardNumber,
            registrationState: REGISTRATION_STATE.PENDING,
        }
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }


    public async queryAllProcessingCar(ctx: Context): Promise<string>{
        const queryString: any = {}
        queryString.selector = {
            registrationState: REGISTRATION_STATE.PENDING,
        }
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }


    public async getQueryResultForQueryString(ctx: Context, queryString: string): Promise<string> {
		let resultsIterator = await ctx.stub.getQueryResult(queryString);
		let results = await this.getAllResults(resultsIterator, false);
		return JSON.stringify(results);
	}


    public async queryResult(ctx: Context, queryString: string): Promise<any> {
		let resultsIterator = await ctx.stub.getQueryResult(queryString);
		let results = await this.getAllResults(resultsIterator, false);
		return results;
	}


    public async getAllResults(iterator, isHistory) {
		let allResults = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let jsonRes: any = {};
				console.log(res.value.value.toString('utf8'));
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.tx_id;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				allResults.push(jsonRes);
			}
			res = await iterator.next();
		}
		iterator.close();
		return allResults;
	}


    private getUserId(ctx: Context): string {
        const rs = ctx.clientIdentity.getID();
        const find = rs.match(/\d{7,}/);
        console.log(find[0]);
        return find![0];
    }


    public async createRequestToChangeOwner(ctx: Context, carId: string, currentOwner: string, newOwner: string): Promise<string> {
        const request: ChangeOwnerRequest = {
            id: uid(16),
            currentOwner: currentOwner,
            newOwner: newOwner,
            carId: carId,
            state: CHANGE_OWNER_STATE.PENDING,
            createTime: new Date().toString(),
            modifyTime: new Date().toString(),
        }
        await ctx.stub.putState(request.id, Buffer.from(JSON.stringify(request)));
        return ctx.stub.getTxID();
    }

    public async queryChangeOwnerRequest(ctx: Context, newOwner: string){
        const queryString: any = {};
        queryString.selector = {
            newOnwer: newOwner,
            state: CHANGE_OWNER_STATE.PENDING,
            docType: DOCTYPE
        };
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }


    public async acceptChangeOwnerRequest(ctx: Context, carId: string): Promise<string> {
        const changeRequestAsByte = await ctx.stub.getState(carId);
        const changeRequest: ChangeOwnerRequest = JSON.parse(changeRequestAsByte.toString());
        changeRequest.state = CHANGE_OWNER_STATE.ACCEPTED;
        changeRequest.modifyTime = new Date().toString();
        await ctx.stub.putState(changeRequest.id, Buffer.from(JSON.stringify(changeRequest)));
        const carAsBytes = await ctx.stub.getState(changeRequest.carId);
        const car: Car = JSON.parse(carAsBytes.toString());
        car.owner = changeRequest.newOwner;
        car.modifyTime = new Date().toString();
        await ctx.stub.putState(car.id, Buffer.from(JSON.stringify(car)));
        return ctx.stub.getTxID();
    }


    public async isOwnerOfCar(ctx: Context, carId: string, userId: string): Promise<string>{
        const queryString: any = {};
        queryString.selector = {
            id: carId,
            onwer: userId,
            docType: DOCTYPE,
        }
        const queryResult = await this.queryResult(ctx, JSON.stringify(queryString));
        if(queryResult.length === 0) {
            return BOOLEAN_STRING.false
        }
        return BOOLEAN_STRING.true;
    }

}