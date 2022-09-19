import React, {useEffect, useRef, useState} from 'react'
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast'
import axios from "../../api/axios";
import {useNavigate} from "react-router-dom";
import {accessTokenState} from '../../recoil/atoms/userAtom'
import {useRecoilState} from 'recoil';

const errorToastStyle = {
    background: '#EF5350',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '8px',
    borderRadius: '9999px',
    maxWidth: '1000px',
}

const successToastStyle = {
    background: 'green',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '8px',
    borderRadius: '9999px',
    maxWidth: '1000px',
}

const Register = ()=>{
    const [accessToken,setAccessToken] = useRecoilState(accessTokenState);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [isRegistred,setIsRegistred] = useState(false);
    const password = useRef({});
    password.current = watch("password","");

    useEffect(()=>{
        let timeout;
        if(isRegistred){
            toast(`User registered with success!`,
                {
                    style: successToastStyle,
                })
            timeout = setTimeout(()=>{
                navigate("/login")
            },2000)
        }

        return ()=>{
            clearTimeout(timeout);
        }
    },[isRegistred,navigate])

    // useEffect(()=>{
    //     if(accessToken){
    //         navigate(-1);
    //     }
    // },[])

    const onSubmit = (data)=>{
        const register = async()=>{
            try{
                const body = {
                    "username":data.username,
                    "email":data.email,
                    "password":data.password
                }

                const response = await axios.post("/register",body);

                if(response.status===201){
                    console.log("success");
                    setIsRegistred(true);
                }
            }
            catch (err){
                console.log(err);
                if(err.response.data){
                    if(err.response?.data.message==="Username already used!"){
                        toast(`Registration Failed : Username already used`,
                            {
                                style: errorToastStyle,
                            })
                    }
                    else if(err.response?.data.message==="Email already used!"){
                        toast(`Registration Failed : Email already used`,
                            {
                                style: errorToastStyle,
                            })
                    }
                }
                else{
                    toast(`Registration Failed : an unexpected error occurred`,
                        {
                            style: errorToastStyle,
                        })
                }
            }
        }
        register();
    }

    return(
        <>
            <Toaster position="bottom-center" containerStyle={{
                bottom: '20px',
            }} />
            <div className="mt-sm-5 mt-0 row justify-content-center container-fluid">
                <form className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 rounded p-4 shadow-lg" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-center mb-4">Create account</h1>
                    <div className="mb-2">
                        <label className="form-label fw-semibold">Username</label>
                        <input type="text" className="form-control" placeholder="Enter username"  {...register("username", { required: 'username required!' })}/>
                        {errors?.username && <p className="text-danger fst-italic fs-6">{errors?.username?.message}</p>}
                    </div>
                    <div className="mb-2">
                        <label className="form-label fw-semibold">Email</label>
                        <input type="text" className="form-control" placeholder="Enter Email" {...register("email", { required: 'email required!' })}/>
                        {errors?.email && <p className="text-danger fst-italic fs-6">{errors?.email?.message}</p>}
                    </div>
                    <div className="mb-2">
                        <label className="form-label fw-semibold">Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" {...register("password", { required: 'password required!',minLength:{value:6,message:"password should be a least 6 characters!"}})}/>
                        {errors?.password && <p className="text-danger fst-italic fs-6">{errors?.password?.message}</p>}
                    </div>
                    <div className="mb-2">
                        <label className="form-label fw-semibold">Confirm Password</label>
                        <input type="password" className="form-control" placeholder="Confirm password" {...register("passwordConfirm",
                            { validate:value=>
                                    value===password.current || "passwords doesn't match"
                                    }
                        )}/>
                        {errors?.passwordConfirm && <p className="text-danger fst-italic fs-6">{errors?.passwordConfirm?.message}</p>}
                    </div>
                    <div className="mt-4 mb-2">
                        <button className="btn bg-success w-100 text-white">Sign up</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Register
