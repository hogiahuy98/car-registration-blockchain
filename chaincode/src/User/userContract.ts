/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Contract, Context } from "fabric-contract-api";
import { User } from "./user";



export class UserContract extends Contract {

    constructor(){
        super('User');
    }

    // 0: UID, 1: password, 2:fullName, 3: phoneNumber, 4: dateOfBirth, 5: ward, 6: identityCardNumber, 7: role
    public async createUser(ctx: Context, ...params: string[]) {
        console.log('START========CREATE-USER===========');
        const user: User = this.paramsToUser(params);
        user.createTime = new Date().toString();
        user.updateTime = new Date().toString();
        await ctx.stub.putState(user.id, Buffer.from(JSON.stringify(user)));
        console.log("END========CREATE-USER===========");
    }


    public async updateUser(ctx: Context, ...params: string[]){
        console.log("======START=UPDATE=USER=======");

        const userAsBytes: Uint8Array= await ctx.stub.getState(params[0]);
        if (!userAsBytes || userAsBytes.length === 0){
            throw new Error('wrong UID');
        }
        const currentUser: User = JSON.parse(userAsBytes.toString());
        const modifyUser: User = this.paramsToUser(params);
        modifyUser.createTime = currentUser.createTime;
        modifyUser.updateTime = new Date().toString();
        await ctx.stub.putState(modifyUser.id, Buffer.from(JSON.stringify(modifyUser)));
    }


    public async readUserByUID(ctx: Context, key: string): Promise<string> {
        const userAsBytes = await ctx.stub.getState(key);
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`Cannot find any user has ${key} key`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }


    public async queryUserByPhoneNumber(ctx: Context, phoneNumber: string): Promise<string>{
        const queryString: any = {};
        queryString.selector = {};
        queryString.selector.phoneNumber = phoneNumber;
        const queryResult = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));   
        return queryResult;
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


    public async readHistoryOfUser(ctx: Context, userId: string) {
        const history = await ctx.stub.getHistoryForKey(userId);
    }


    public paramsToUser(params: string[]): User{
        return {
            id: params[0],
            password: params[1],
            fullName: params[2],
            phoneNumber: params[3],
            dateOfBirth: params[4],
            ward: params[5],
            identityCardNumber: params[6],
            role: params[7],
            docType: 'user',
        }
    } 


    public async initLedger(ctx: Context) {

        const user: User= {
            id: "CSGT",
            fullName: "csgt",
            ward: "Ninh Kieu",
            dateOfBirth: "TEST",
            identityCardNumber: "TEST",
            role: "police",
            password: "admin",
            createTime: new Date().toString(),
            updateTime: new Date().toString(),
            phoneNumber: "test",
            docType: 'user'
        };

        await ctx.stub.putState(user.id, Buffer.from(JSON.stringify(user)));

    }


}
