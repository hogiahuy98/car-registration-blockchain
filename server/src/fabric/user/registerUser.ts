/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wallets, X509Identity, Wallet, Gateway } from 'fabric-network';
import * as FabricCAServices from 'fabric-ca-client';
import * as path from 'path';
import * as fs from 'fs';
import { User } from './userInterface';

export async function registerUser(user: User): Promise<boolean>{
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', '..','..','test-network','organizations','peerOrganizations','org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices.default(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd() ,'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(user.phoneNumber);
        if (userIdentity) {
            const messeage = `Số điện thoại ${user.phoneNumber} đã đăng ký`;
            throw new Error(messeage)
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            const message = 'An identity for the admin user "admin" does not exist in the wallet, Run the enrollAdmin.ts application before retrying';
            throw new Error(message)
        }

        // build a user object for authenticating with the CA
       const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
       const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: user.phoneNumber, role: 'client'}, adminUser);
        const enrollment = await ca.enroll({ enrollmentID: user.phoneNumber, enrollmentSecret: secret });
        const x509Identity: X509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        console.log(enrollment.certificate.split('\r\n'));
        await wallet.put(user.phoneNumber, x509Identity);
        const isRegisted = await createUser(user, wallet, ccp);
        return isRegisted;
    } catch (error) {
        throw error;
    }
}

async function createUser(user: User, wallet: Wallet, ccp: any): Promise<boolean>{
    try {
        const identity = await wallet.get(user.phoneNumber);
        if (!identity) {
            throw new Error("Cannot find Identity in wallet!");
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet: wallet,
            identity: user.phoneNumber,
            discovery: {
                enabled: true,
                asLocalhost: true
            }
        });

        const network = await gateway.getNetwork('mychannel');
        const contract = await network.getContract("CRChaincode", "User");

        const transaction = await contract.submitTransaction("createUser", user.id, user.password, user.fullName, user.phoneNumber, user.dateOfBirth, user.ward, user.identityCardNumber, user.role);
        console.log(`User ${user.phoneNumber} (${user.fullName}) has been registed`);
        return true
    } catch (error) {
        console.log(error);
        return false;
    }
}