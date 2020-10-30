/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserContract } from "./User/userContract";
export { UserContract } from "./User/userContract";

import { CarContract } from './Car/carContract';
export { CarContract } from './Car/carContract';

export const contracts: any[] = [ UserContract, CarContract ];