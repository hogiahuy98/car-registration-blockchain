import { getUserContract } from './CommonFuntion';

export { registerUser } from './RegisterUser';
export { User } from './UserInterface';


export async function getUserByPhoneNumber(phoneNumber: any): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const rs = await contract.evaluateTransaction('queryUserByPhoneNumber', phoneNumber);
        const users = JSON.parse(rs.toString());
        if(users.length === 0) return undefined;
        return users[0];
    } catch (error) {
        throw error;
    }
}


export async function getId(phoneNumber: any): Promise<any> {
    try {
        const contract = await getUserContract(phoneNumber);
        const rs = await contract.evaluateTransaction('getUserId');
        return rs.toString();
    } catch (error) {
        throw new Error(error);
    }
}

export async function getUserById(userId: string): Promise<any> {
    try {
        const contract = await getUserContract('admin');
        const queryString: any = {}
        queryString.selector = {
            docType: 'user',
            id: userId,
        }
        const queryResultBuffer = await contract.evaluateTransaction('getQueryResultForQueryString', JSON.stringify(queryString));
        const queryResult = JSON.parse(queryResultBuffer.toString());
        if(queryResult.length > 0) {
            return queryResult[0].Record;
        }
    } catch (error) {
        return null
    }
}

export async function queryUser(userId: string, queryString: string): Promise<any> {
    try {
        const contract = await getUserContract(userId);
        const queryResult = await contract.evaluateTransaction('getQueryResultForQueryString', queryString);
        return JSON.parse(queryResult.toString());
    } catch (err) {
        throw err
    }
}