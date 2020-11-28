export interface User {  
    id: string;
    fullName: string;
    ward: string;
    dateOfBirth: string;
    identityCardNumber: string;
    phoneNumber: string;
    role: string;
    password: string;
    createTime?: string;
    updateTime?: string;     
}