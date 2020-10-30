import { Contract ,Context } from 'fabric-contract-api';
import { Car } from './car';


export class CarContract extends Contract {

    constructor(){
        super('Car')
    }

    public async registryCar(ctx: Context, ...params: string[]): Promise<string>{
        const car: Car = {
            UID: params[0],
            registrationNumber: "",
            vin: params[1],
            brand: params[2],
            model: params[3],
            color: params[4],
            owner: this.getUserId(ctx), //Owner identity card number
            registrationState: "processing",
            createTime: new Date().toString(),
            modifyTime: new Date().toString(),
        };
        console.log(params);
        await ctx.stub.putState(car.UID, Buffer.from(JSON.stringify(car)));
        return ctx.stub.getTxID();
    }


    public async acceptRegistry(ctx: Context,  carId: string, registrationNumber: string): Promise<string> {
        const carAsBytes = await ctx.stub.getState(carId);
        let car: any;
        try {
            car = JSON.parse(carAsBytes.toString());
        } catch (error) {
            return "error";
        }
        car.processedPolice = this.getUserId(ctx);
        car.registrationNumber = registrationNumber;
        car.registrationState = "registered";
        car.modifyTime = new Date().toString();
        // await ctx.stub.putState(carId, Buffer.from(JSON.stringify(car)));
        // return ctx.stub.getTxID();
        return car;
    }

    public async queryAllCars(ctx: Context) {
        const queryString: any = {};
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }


    public async queryCarByRegistrationNumber(ctx: Context, registrationNumber: string): Promise<string>{
        const queryString: any = {}
        queryString.selector = {
            registrationNumber: registrationNumber,
        }
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult)[0];
    }


    public async queryProcessingCarByOwnerIdentityCardNumber(ctx: Context, ownerIdentityCardNumber: string): Promise<string>{
        const queryString: any = {}
        queryString.selector = {
            onwer: ownerIdentityCardNumber,
            registrationState: 'processing',
        }
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult)[0];
    }


    public async queryAllProcessingCar(ctx: Context): Promise<string>{
        const queryString: any = {}
        queryString.selector = {
            registrationState: 'processing',
        }
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.parse(queryResult);
    }


    public async getQueryResultForQueryString(ctx: Context, queryString: string): Promise<string> {

		let resultsIterator = await ctx.stub.getQueryResult(queryString);
		let results = await this.getAllResults(resultsIterator, false);

		return JSON.stringify(results);
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



}