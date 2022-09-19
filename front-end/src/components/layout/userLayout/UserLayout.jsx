import React from 'react'
import axios from '../../../api/axios'
import {useNavigate} from "react-router-dom";
import {accessTokenState, userState} from '../../../recoil/atoms/userAtom'
import {useRecoilState} from 'recoil';

const UserLayout = ({children})=>{
    const [accessToken,setAccessToken] = useRecoilState(accessTokenState);
    const [user,setUser] = useRecoilState(userState);
    const navigate = useNavigate();
    const logoutClickHandler = ()=>{
        const logout = async()=>{
            try {
                const response = await axios.get("/auth/logout",{});
                setUser(null);
                setAccessToken(null);
                navigate("/login",{replace:true});
            } catch (e) {
                console.error(e);
            }
        }
        logout();
    }

    return(
        <>
            <div className="container-fluid bg-primary py-3 d-flex justify-content-between">
                <h3 className="text-white">Student management</h3>
                <button className="btn btn-warning" onClick={logoutClickHandler}>Sign out</button>
            </div>
            <main className="container-fluid mt-3">{children}</main>
        </>
    )
}

export default UserLayout
