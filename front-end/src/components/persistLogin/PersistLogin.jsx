import React, {useEffect, useRef, useState} from 'react'
import {Outlet, useLocation, useNavigate , Navigate} from 'react-router-dom'
import useRefreshToken from "../../hooks/useRefreshToken";
import {accessTokenState} from '../../recoil/atoms/userAtom'
import {useRecoilState} from 'recoil';

const PersistLogin = ()=>{
    const refresh = useRefreshToken();
    const navigate =useNavigate();
    const [isLoading,setIsLoading] = useState(true);
    const [accessToken,setAccessToken] = useRecoilState(accessTokenState);
    const location = useLocation();


    useEffect(()=>{

        const verifyRefereshToken = async()=>{
            try {
                return await refresh();
            } catch (e) {
                console.log(e);
            }
            finally {
                setIsLoading(false);
            }
        }

        const main = async()=>{
            const tokenRefreshed = await verifyRefereshToken();
            if(!tokenRefreshed){
                navigate("/login",{state:{from: location}});
            }
        }

        !accessToken ?main():setIsLoading(false);

    },[])

    return(
        <>
            {   isLoading
                ?
                <p>is loading ...</p>
                :
                <Outlet/>
            }
        </>
    )
}

export default PersistLogin
