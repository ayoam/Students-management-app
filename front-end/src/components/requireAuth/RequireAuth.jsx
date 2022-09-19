import React from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom";
import {accessTokenState,userState} from "../../recoil/atoms/userAtom"
import {useRecoilState} from 'recoil';

const RequireAuth = ({allowedRoles})=>{
    const [user,setUser] = useRecoilState(userState);
    const [accessToken,setAccessToken] = useRecoilState(accessTokenState);
    const location = useLocation();

    // console.log(allowedRoles.includes(user?.authority.role));

    return(
        <>
            {
            allowedRoles.includes(user?.authority.role)
            ?
            <Outlet/>
            :
            accessToken
            ?
            <Navigate to="/unauthorized" state={{ from: location }} replace />
            :
            <Navigate to="/login" state={{ from: location }} replace />
            }
        </>
    )
}

export default RequireAuth
