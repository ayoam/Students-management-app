import React from 'react'
import {BiEdit} from "react-icons/bi";
import {RiDeleteBinLine} from "react-icons/ri";
import {IoClose} from "react-icons/io5";
import {FiCheck} from "react-icons/fi";
import AddNewStudent from "../addNewStudent/AddNewStudent";
import useAxios from '../../hooks/useAxios'

const StudentTableRows = ({rows,columns,crud,editing,currentlyEditing,setEditing,setCurrentlyEditing,register,reset,deleteStudentHandler,addStudent,setAddStudent,register2})=>{
    const axios=useAxios();

    const closeAddRowHandler = ()=>{
        setAddStudent(false);
        setCurrentlyEditing(false);
    }

    const validateEmailHandler = async (newEmail,currentEmail)=>{
        if(newEmail.toLowerCase().trim()===currentEmail.toLowerCase().trim()){
            return true;
        }

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
            {
                rows.map((row,rowPos)=>{
                    const arr = Object.keys(row).map((key)=>row[key]);
                    return(
                        !editing[rowPos] ?
                            <tr key={rowPos}>
                                {arr.map((field,fPos)=>{
                                    return <td key={fPos} style={{padding:"5px"}}>{field}</td>

                                })}
                                { crud &&
                                    <>
                                        <td  style={{width:"50px"}}><BiEdit role="button" className="fs-4" onClick={()=>
                                        {
                                            if(!currentlyEditing){
                                                setEditing(prev=>{
                                                    const p = {...prev};
                                                    p[rowPos]=true;
                                                    return p;
                                                });
                                                setCurrentlyEditing(true);
                                            }
                                        }

                                        }/></td>
                                        <td  style={{width:"50px"}}>
                                            <button style={{border:"none",background:"none"}} type='button'  onClick={e=>deleteStudentHandler(arr[0])}>
                                                <RiDeleteBinLine className="fs-4"/>
                                            </button>
                                        </td>
                                    </>
                                }
                            </tr>
                            :
                            <tr key={rowPos} className="bg-warning">
                                {arr.map((field,fPos)=>{
                                    if(columns[fPos].dropDownList){
                                        return <td key={fPos}  style={{width:"150px"}}>
                                            <select className="w-100 form-select" {...register(columns[fPos].field)} defaultValue={
                                                columns[fPos].dropDownList.filter((opt)=>{
                                                    return opt.name===field;
                                                })[0].id
                                            }>
                                                {
                                                    columns[fPos].dropDownList.map((option,ddlPos)=>{
                                                        return <option key={ddlPos} value={option?.id} >{option?.name}</option>
                                                    })
                                                }
                                            </select>
                                        </td>
                                    }
                                    else if(columns[fPos].editable===false){
                                        return <td key={fPos}  style={{width:"150px"}}><input defaultValue={field} form={"updateForm"} readOnly {...register(columns[fPos].field)} style={
                                            {border:"none",background:"none",width:"100%",outline:"none"}
                                        }/></td>
                                    }
                                    else if(columns[fPos].type==="email") {
                                        return (<td key={fPos} style={{width: "150px"}}>
                                            <input defaultValue={field} className="form-control" style={{width: "100%"}}
                                                   form={"updateForm"} {...register(columns[fPos].field,
                                                {
                                                    required: `${columns[fPos].field} required!`,
                                                    pattern: {value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,message:"email invalid!"},
                                                    validate:(email)=>validateEmailHandler(email,field)
                                                })
                                            }/>
                                        </td>);
                                    }
                                    else if(columns[fPos].type==="phone") {
                                        return (<td key={fPos} style={{width: "150px"}}>
                                            <input defaultValue={field} className="form-control" style={{width: "100%"}}
                                                   form={"updateForm"}
                                                   {...register(columns[fPos].field, {required: `${columns[fPos].headerName} required!`,pattern: {value:/^06\d{8}$/,message:"phone number invalid"}})}/>
                                        </td>);
                                    }
                                    else if(columns[fPos].type==="date"){
                                            return (<td key={fPos} style={{width:"150px"}}>
                                                <input type="date" defaultValue={field} className="form-control" style={{width:"100%"}} form={"updateForm"}
                                                       {...register(columns[fPos].field, { required: `${columns[fPos].field} required!` })}/>
                                            </td>);
                                    }else{
                                        return (<td key={fPos} style={{width:"150px"}}>
                                            <input defaultValue={field} className="form-control" style={{width:"100%"}} form={"updateForm"} {...register(columns[fPos].field, { required: `${columns[fPos].field} required!` })}/>
                                        </td>);
                                    }

                                })}
                                <td style={{width:"50px"}} ><IoClose role="button" className="fs-4" onClick={()=>
                                {setEditing(prev=>{
                                    const p = {...prev};
                                    p[rowPos]=false;
                                    return p;
                                })
                                    setCurrentlyEditing(false);
                                    reset();
                                }
                                }/></td>
                                <td style={{width:"50px"}}>
                                    <button style={{border:"none",background:"none"}} type={"submit"} form={"updateForm"}>
                                        <FiCheck className="fs-4"/>
                                    </button>
                                </td>
                            </tr>
                    )})
            }
            {addStudent && <AddNewStudent columns={columns} closeAddRow={closeAddRowHandler} register={register2}/>}
        </>
    )
}

export default StudentTableRows
