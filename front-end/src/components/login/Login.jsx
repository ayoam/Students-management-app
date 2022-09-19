import React, {useEffect, useState} from 'react'
import {Link,useNavigate,useLocation} from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from '../../api/axios';
import {useRecoilState} from 'recoil';
import {accessTokenState,userState} from "../../recoil/atoms/userAtom";
import toast, { Toaster } from 'react-hot-toast'

const toastStyle = {
    background: '#EF5350',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '8px',
    borderRadius: '9999px',
    maxWidth: '1000px',
}

const Login = ()=>{
    const navigate = useNavigate();
    const [accessToken,setAccessToken] = useRecoilState(accessTokenState);
    const [user,setUser] = useRecoilState(userState);
    const [invalidCredentials,setInvalidCredentials] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const location = useLocation();
    // const from = location.state?.from?.pathname === "/login" ? null : location.state?.from?.pathname ;

    // useEffect(()=>{
    //     if(accessToken){
    //         navigate(-1);
    //     }
    // },[])

    const onSubmit = (data)=>{
        const loginUser = async()=>{
            try{
                const body = {
                    "username":data.username,
                    "password":data.password
                }

                const response = await axios.post("/auth/authenticate",body);
                if(response.status===200){
                    setAccessToken(response.data.access_token);
                    setUser(response.data.user);
                    setInvalidCredentials(false);
                    axios.defaults.headers.common['Authorization']=`Bearer ${response.data.access_token}`;
                    if(response.data.user.authority.role==="ROLE_ADMIN"){
                        navigate("/admin/students",{replace:true})
                    }else if(response.data.user.authority.role==="ROLE_USER"){
                        navigate("/students",{replace:true})
                    }
                }
            }
            catch (err){
                if(err.response.status===500 && err.response.data.message==="Invalid Credentials!"){
                    setInvalidCredentials(true);
                }else{
                    toast(`Login Failed : an unexpected error  occurred`,
                        {
                            style: toastStyle,
                        })
                }
            }
        }
        loginUser();
    }

    return(
        <>
            <Toaster position="bottom-center" containerStyle={{
                bottom: '20px',
            }} />
            <div className="mt-sm-5 mt-0 row justify-content-center container-fluid">
                <form className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-3 rounded p-4 shadow-lg" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-center mb-4">Login</h1>
                    <div className="mb-2">
                        <label className="form-label fw-semibold">Username</label>
                        <input type="text" className="form-control" placeholder="Enter username"  {...register("username", { required: 'username required!' })}/>
                        {errors?.username && <p className="text-danger fst-italic fs-6">{errors.username?.message}</p>}
                    </div>
                    <div className="mb-2">
                        <label className="form-label fw-semibold">Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" {...register("password", { required: 'password required!' ,minLength:{value:6,message:"password invalid!"}})}/>
                        {errors?.password && <p className="text-danger fst-italic fs-6">{errors.password?.message}</p>}
                    </div>
                    <div className="mt-4 mb-2">
                        <button className="btn btn-primary w-100">Log in</button>
                    </div>
                    <div>
                        <p className="mb-1 mt-4">Need an account?</p>
                        <span><Link to="/register" className="fw-semibold">Sign up</Link></span>
                    </div>
                    {invalidCredentials && <p className="text-danger fst-italic mt-4 fs-6">username and/or passowrd invalid!</p>}
                </form>
            </div>
        </>
    )
}

export default Login
