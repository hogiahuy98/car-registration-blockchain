import { getUserContract } from './commonFuntion';

export { registerUser } from './registerUser';
export { User } from './userInterface';


export async function getUserByPhoneNumber(phoneNumber: any): Promise<any> {
    try {
        const contract = await getUserContract(phoneNumber);
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