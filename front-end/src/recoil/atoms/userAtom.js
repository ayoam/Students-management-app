import { atom } from "recoil";

export const accessTokenState = atom({
    key:"accessToken",
    default:null
});

export const userState = atom({
    key:"user",
    default:null
})