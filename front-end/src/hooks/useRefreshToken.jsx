import React from 'react'
import axios from '../api/axios'
import {accessTokenState,userState} from '../recoil/atoms/userAtom'
import {useRecoilState} from 'recoil';

const useRefreshToken = ()=>{

    const [user,setUser] = useRecoilState(userState);
    const [accessToken,setAccessToken] = useRecoilState(accessTokenState);

    const refresh = async () => {
        try {
            const response = await axios.get('/auth/refreshToken');

            if (response.status === 200) {
                setAccessToken(response.data.access_token);
                setUser(response.data.user);
                axios.defaults.headers.common['Authorization']=`Bearer ${response.data.access_token}`;
                console.log("token refreshed!");
            }
            return response.data;

        } catch (e) {
            console.log("refresh token error")
            return null;
        }

    }
    return refresh;
}

export default useRefreshToken
