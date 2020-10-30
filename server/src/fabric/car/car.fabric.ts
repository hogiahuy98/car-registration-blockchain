import { getCarContract } from './commonFuntion';
import { Car } from './carInterface';
export { Car } from './carInterface'

export async function registryCar(car: Car, identityCardNumber: string) {
    try {
        const contract = await getCarContract(identityCardNumber);
        console.log(car);
        const TxID = await contract.submitTransaction('registryCar', car.UID, car.vin, car.brand, car.model, car.model);
        return { success: true, data: { TxID: TxID.toString() } };
    } catch (error) {
        console.log(error);
        return { success: false, data: { error: error } }
    }
}

export async function getAllCars (identityCardNumber: string) {
    try {
        const contract = await getCarContract(identityCardNumber);
        const carsAsBuffer = await contract.evaluateTransaction('queryAllCars');
        const cars = JSON.parse(carsAsBuffer.toString());
        return { success: true, data: { cars } };
    } catch (error) {
        return { success: false, data: { error: error } }
    }
}