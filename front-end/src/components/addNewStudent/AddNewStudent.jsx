import React from 'react'
import {IoClose} from "react-icons/io5";
import {FiCheck} from "react-icons/fi";
import useAxios from '../../hooks/useAxios';

const AddNewStudent = ({columns,closeAddRow,register,errors2})=>{
    const axios = useAxios();
    const validateEmailHandler = async (newEmail)=>{
        try {
            const response = await axios.post("/students/validateEmail", {
                email:newEmail
            })
            if(response.status===200){
                return true;
            }
        } catch (e) {
            console.error(e);
            return "Email already used!"
        }
    }
    return(
        <>
            <tr>
                {
                    columns.map((col,pos)=>{
                        if(col.identity){
                            return <td scope="row" key={pos}></td>
                        }
                        else if(col.dropDownList){
                            return <td scope="row" key={pos}>
                                <select className="w-100 form-select" form={"postForm"} {...register(col.field, { required: `${col.field} required!` })}>
                                    {
                                        col.dropDownList.map((option,ddlPos)=>{
                                            return <option key={ddlPos} value={option?.id} >{option?.name}</option>
                                        })
                                    }
                                </select>
                            </td>
                        }
                        else if(col?.type==="email") {
                            return (<td key={pos} style={{width: "150px"}}>
                                <input className="form-control" style={{width: "100%"}}
                                       form={"postForm"} {...register(col.field,
                                    {
                                        required: `${col.field} required!`,
                                        pattern: {value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,message:"email invalid!"},
                                        validate:(email)=>validateEmailHandler(email)
                                    })
                                       }/>
                            </td>);
                        }
                        else if(col?.type==="phone") {
                            return (<td key={pos} style={{width: "150px"}}>
                                <input className="form-control" style={{width: "100%"}}
                                       form={"postForm"}
                                       {...register(col.field, {required: `${col.headerName} required!`,pattern: {value:/^06\d{8}$/,message:"phone number invalid"}})}/>
                            </td>);
                        }
                        else if(col?.type==="date"){
                            return (<td key={pos} style={{width:"150px"}}>
                                <input type="date" className="form-control" style={{width:"100%"}} form={"postForm"}
                                       {...register(col.field, { required: `${col.field} required!` })}/>
                            </td>);
                        }else{
                            return (<td key={pos} style={{width:"150px"}}>
                                <input className="form-control" style={{width:"100%"}} form={"postForm"} {...register(col.field, { required: `${col.field} required!` })}/>
                            </td>);
                        }
                    })
                }

                <td style={{width:"50px"}} ><IoClose role="button" className="fs-4" onClick={()=>closeAddRow()}/></td>
                <td style={{width:"50px"}}>
                    <button style={{border:"none",background:"none"}} type='submit' form={"postForm"}>
                        <FiCheck role="button" className="fs-4"/>
                    </button>
                </td>

            </tr>
        </>
    )
}

export default AddNewStudent
