import { getUserContract } from './commonFuntion';

export { registerUser } from './registerUser';
export { User } from './userInterface';
import { User } from './userInterface'


export async function getUserByIdentityCard(identityCardNumber: any): Promise<any> {
    try {
        const contract = await getUserContract(identityCardNumber);
        const rs = await contract.evaluateTransaction('queryUserByIdentityCard', identityCardNumber);
        return JSON.parse(rs.toString())[0];
    } catch (error) {
        console.log(error);
    }
}


export async function getId(identityCardNumber: any): Promise<any> {
    try {
        const contract = await getUserContract(identityCardNumber);
        const rs = await contract.evaluateTransaction('getUserId');
        return rs.toString();
    } catch (error) {
        console.log(error)
    }
}