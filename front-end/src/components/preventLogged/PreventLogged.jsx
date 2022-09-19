import React, {useEffect, useRef, useState} from 'react'
import {Navigate, Outlet,useNavigate} from "react-router-dom";
import {accessTokenState, userState} from "../../recoil/atoms/userAtom"
import {useRecoilState} from 'recoil';
import useRefreshToken from "../../hooks/useRefreshToken";

const PreventLogged = ()=>{
    const navigate = useNavigate();
    const refresh = useRefreshToken();
    const [accessToken,setAccessToken] = useRecoilState(accessTokenState);
    const [user,setUser] = useRecoilState(userState);
    const [isLoading,setIsLoading] = useState(true);

    useEffect(()=>{
        console.log(accessToken);
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
            const data = await verifyRefereshToken();
            const resUser = data?.user;
            if(resUser){
                if(resUser.authority.role==="ROLE_ADMIN"){
                    navigate("/admin/students",{replace:true})
                }else if(resUser.authority.role==="ROLE_USER"){
                    navigate("/students",{replace:true})
                }
            }
        }

        !accessToken ? main(): setIsLoading(false);

    },[])


    return(
        <>
            {
                !isLoading
                &&
                <Outlet/>
            }
        </>
    )
}

export default PreventLogged
