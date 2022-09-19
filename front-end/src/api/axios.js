import axios from 'axios'
// import useRefreshToken from '../hooks/useRefreshToken'
// import {useEffect} from 'react'

export default axios.create({
    baseURL:process.env.REACT_APP_DEV_API_BASEURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})

// const refresh = useRefreshToken();
//
// const responseInterceptor = axios.interceptors.response.use(res=>res,async(error)=>{
//     const prevReq = error?.config;
//     if(error?.response?.status===403 || !prevReq?.sent){
//         prevReq.sent=true;
//         await refresh();
//         //if refresh token failed redirect to login page
//         return axios(prevReq);
//     }
// })
