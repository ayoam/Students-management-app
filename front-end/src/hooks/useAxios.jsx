import React, {useEffect} from 'react'
import useRefreshToken from '../hooks/useRefreshToken'
import axios from '../api/axios'
import {useNavigate} from "react-router-dom";

const useAxios = ()=>{
    const navigate = useNavigate();
    const refresh = useRefreshToken();
    useEffect(()=>{
        const requestInterceptor = axios.interceptors.request.use(
            config => config, (error) => Promise.reject(error)
        );

        const responseInterceptor = axios.interceptors.response.use(
            response=>response,
            async(error)=>{
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    console.log("sent");
                    prevRequest.sent = true;
                    const data = await refresh();
                    if(!data){
                        navigate("/login",{replace:true})
                    }
                    prevRequest.headers['Authorization'] = `Bearer ${data?.access_token}`;
                    return axios(prevRequest);
                }
                return Promise.reject(error);
            }
        )

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        }

    },[])

    return axios
}

export default useAxios
