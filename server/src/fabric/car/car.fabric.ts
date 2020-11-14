import { getCarContract } from './commonFuntion';
import { Car } from './carInterface';
export { Car } from './carInterface'


export async function registryCar(car: Car, identityCardNumber: string) {
    try {
        const contract = await getCarContract(identityCardNumber);
        const TxID = await contract.submitTransaction('registryCar', car.id, car.vin, car.brand, car.model, car.model);
        return { success: true, result: { TxID: TxID.toString() } };
    } catch (error) {
        return { success: false, result: { error: error } };
    }
}


export async function getAllCars(identityCardNumber: string) {
    try {
        const contract = await getCarContract(identityCardNumber);
        const carsAsBuffer = await contract.evaluateTransaction('queryAllCars');
        const cars = JSON.parse(carsAsBuffer.toString());
        return { success: true, result: { cars } };
    } catch (error) {
        return { success: false, result: { error: error } }
    }
}


export async function getCarById(identityCardNumber: string, carId: string) {
    try {
        const contract = await getCarContract(identityCardNumber);
        const carsAsBuffer = await contract.evaluateTransaction('queryCarById', carId);
        const car = JSON.parse(carsAsBuffer.toString());
        return { success: true, result: { car } };
    } catch (error) {
        return { success: false, result: { error: error } }
    }
}


export async function getProcesscingCars(identityCardNumber: string) {
    try {
        const contract = await getCarContract(identityCardNumber);
        const processingCarsAsBuffer = await contract.evaluateTransaction('queryAllProcessingCar');
        const processingCars = JSON.parse(processingCarsAsBuffer.toString());
        if (processingCars.length > 0) {
            return { success: true, result: { processingCars } };
        }
        else {
            throw new Error("Không có xe đang xử lí");
        }
    } catch (error) {
        return { success: false, result: { msg: error } };
    }
}


export async function acceptCarRegistration(carId: string, registrationNumber: string, identityCardNumber: string) {
    try {
        const contract = await getCarContract(identityCardNumber);
        const TxID = await contract.submitTransaction('acceptRegistration', carId, registrationNumber);
        if (TxID.toString().length !== 0) {
            return { success: true, result: { TxID: TxID.toString() }};
        }
        else {
            throw new Error("Không thể hoàn thành đăng ký");
        }
    } catch (error) {
        return { success: false, result: { msg: error }};
    }
}

export async function rejectCarRegistration(carId: string, registrationNumber: string, identityCardNumber: string) {
    try {
        const contract = await getCarContract(identityCardNumber);
        const TxID = await contract.submitTransaction('rejectRegistration', carId);
        if (TxID.toString().length !== 0) {
            return { success: true, result: { TxID: TxID.toString() }};
        }
        else {
            throw new Error("Không thể hoàn thành đăng ký");
        }
    } catch (error) {
        return { success: false, result: { msg: error }};
    }
}

export async function isOwnerOfCar(carId: string, userId: string, identityCardNumber: string): Promise<any> {
    try {
        const contract = await getCarContract(identityCardNumber);
        const resultByte = await contract.evaluateTransaction('isOwnerOfCar', carId, userId);
        const result = resultByte.toString();
        console.log(result);
        if(result === 'true'){
            return { success: true, result: { isOnwer: true } }
        }
        return { success: true, result: { isOnwer: false } }
    } catch (error) {
        return { success: false, result: { msg: error } }
    }
}

export async function requestChangeOwner(carId: string, identityCardNumber: string, newOwner: string, currentOwner: string) {
    try {
        const contract = await getCarContract(identityCardNumber);
        const TxIDByte = await contract.submitTransaction('createRequestToChangeOwner', carId, currentOwner, newOwner);
        const TxID = TxIDByte.toString();
        if( TxID !== "" || TxID.length !== 0) {
            return { success: true, result: { TxID: TxID } }
        }
        else {
            throw new Error("Có lỗi khi gọi transaction");
        }
    } catch (error) {
        return { success: false, result: { msg: error } }
    }
}