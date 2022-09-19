import React, {useEffect, useState} from 'react'
import {useForm} from "react-hook-form";
import useAxios from '../../hooks/useAxios'
import toast, {Toaster} from 'react-hot-toast'
import {useRecoilState} from "recoil";
import {accessTokenState} from "../../recoil/atoms/userAtom";
import StudentSearch from "../studentSearch/StudentSearch";
import useUrlSearchParams from "../../hooks/useUrlSearchParams";
import StudentTablePagination from "../studentTablePagination/StudentTablePagination";
import StudentTableColumns from "../studentTableColumns/StudentTableColumns";
import StudentTableRows from "../studentTableRows/StudentTableRows";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

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

const StudentsTable = ({crud}) => {
    const limit = 3;
    const axios = useAxios();
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
    const [pageCount, setpageCount] = useState(0);
    const [rows, setRows] = useState([]);
    const [specialityDDL, setSpecialityDDL] = useState();
    const {register, handleSubmit, watch, formState: {errors}, reset} = useForm(
        {
            mode: 'onSubmit',
            reValidateMode: 'onBlur',
        }
    );
    const {register: register2, handleSubmit: handleSubmit2, formState: {errors:errors2}, reset: reset2} = useForm();
    const [editing, setEditing] = useState(null);
    const [addStudent, setAddStudent] = useState(false);
    const [currentlyEditing, setCurrentlyEditing] = useState(false);
    const {urlSearchParams, page} = useUrlSearchParams();

    const MySwal = withReactContent(Swal)

    useEffect(() => {
        const getSpeciality = async () => {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                const response = await axios.get("/speciality");
                setSpecialityDDL(response.data);
            } catch (e) {
                console.error(e);
            }
        }
        getSpeciality();

    }, [])

    useEffect(()=>{
        console.log(page);
        setEditing(initialEditingState());
        setCurrentlyEditing(false);
        reset();
    },[page])

    useEffect(() => {
        urlSearchParams && getStudents();
    }, [urlSearchParams])

    const getStudents = async () => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            const response = await axios.get(`/students`, {
                params: {
                    ...urlSearchParams,
                    limit
                }
            });

            const total = response.headers["x-total-count"];
            setpageCount(Math.ceil(total / limit));
            response.data.map((elt) => {
                if (elt.speciality) {
                    elt.speciality = elt.speciality.name;
                }
                elt.birthDate = elt.birthDate.substring(0, 10);
                return elt;
            })
            setRows(response.data);
            console.log(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    const columns = [
        {headerName: "ID", field: "id", width: 80, editable: false, identity: true},
        {headerName: "Name", field: "name", width: 150, editable: true},
        {headerName: "Birth Date", field: "birthDate", width: 150, editable: true,type:"date"},
        {headerName: "Email", field: "email", width: 150, editable: true,type:"email"},
        {headerName: "Phone Number", field: "phoneNumber", width: 150,type:"phone"},
        {headerName: "Speciality", field: "speciality", width: 150, editable: true, dropDownList: specialityDDL}
    ]

    const onSubmitUpdateStudent = async (data) => {

        const body = {...data};
        body["specId"] = data.speciality;
        delete body.speciality;

        const updateStudent = async () => {
            try {
                const response = await axios.put(`/students/${data.id}`, body);
                if (response.status === 200) {
                    // toast(`Student successfully updated`,
                    //     {
                    //         style: successToastStyle,
                    //     })
                    MySwal.fire("Success","Student successfully updated","success");
                    setEditing(initialEditingState());
                    setCurrentlyEditing(false);
                    reset();
                }
            } catch (e) {
                toast(`Error while updating the student`,
                    {
                        style: errorToastStyle,
                    })
                console.error(e);
            }
        }
        await updateStudent();
        await getStudents();
    }

    const onSubmitAddStudent = async (data) => {
        console.log(data);
        const body = {...data};
        body["specId"] = data.speciality;
        delete body.speciality;

        const addStudent = async () => {
            try {
                const response = await axios.post(`/students`, body);
                if (response.status === 201) {
                    console.log("added");
                    MySwal.fire("Success","Student successfully added","success");
                    setAddStudent(false);
                    setCurrentlyEditing(false);
                    reset2();
                }
            } catch (e) {
                toast(`Error while adding the student`,
                    {
                        style: errorToastStyle,
                    })
                console.error(e);
            }
        }
        await addStudent();
        await getStudents();
    }

    useEffect(() => {
        setEditing(initialEditingState());
    }, [])

    const initialEditingState = () => {
        let obj = {};
        for (let i = 0; i < columns.length; i++) {
            obj[i] = false;
        }
        return obj;
    }

    if(errors){
        if (Object.keys(errors).length > 0) {
            Object.keys(errors).forEach(key => {
                toast(`Error : ${errors[key].message}`,
                    {
                        style: errorToastStyle,
                    })
                // alert(`Error : ${errors[key].message}`);
            })
        }
    }

    if(errors2){
        console.log(errors2);

        if (Object.keys(errors2).length > 0) {
            Object.keys(errors2).forEach(key => {
                toast(`Error : ${errors2[key].message}`,
                    {
                        style: errorToastStyle,
                    })
                // alert(`Error : ${errors2[key].message}`);
            })
        }
    }


    const deleteStudentHandler = async (studentId) => {
        console.log(studentId);
        Swal.fire({
            title: 'are you sure?',
            showCancelButton: true,
            confirmButtonText: 'delete',
            icon:"warning"
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                await deleteStudent();
                await getStudents();
            }
        })
            const deleteStudent = async () => {
                try {
                    const response = await axios.delete(`/students/${studentId}`)
                    if (response.status === 200) {
                        await Swal.fire('deleted!', 'Student successfully deleted', 'success')
                    }
                } catch (e) {
                    toast(`Error while deleting the student`,
                        {
                            style: errorToastStyle,
                        })
                    console.error(e);
                }
            }
    }

    return (
        <>
            <Toaster position="bottom-center" containerStyle={{
                bottom: '20px',
            }}/>

            <form id={"updateForm"} onSubmit={handleSubmit(onSubmitUpdateStudent)}></form>
            <form id={"postForm"} onSubmit={handleSubmit2(onSubmitAddStudent)}></form>

            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    <StudentSearch/>
                    {crud && <button className="btn btn-outline-success mb-2" onClick={() => {
                        setAddStudent(true);
                        setCurrentlyEditing(true)
                        setEditing(initialEditingState());
                        reset();
                    }}>Add Student</button>
                    }
                </div>
                <div style={{overflowX: "auto", padding: "2px"}}>
                    <table className={`table table-hover rounded shadow-sm table-responsive`}
                           style={{outlineStyle: "solid", outlineWidth: "1px", outlineColor: "silver"}}>
                        <thead>
                            <StudentTableColumns
                                columns={columns}
                                crud={crud}
                            />
                        </thead>
                        <tbody>
                            <StudentTableRows
                                rows={rows}
                                columns={columns}
                                crud={crud}
                                editing={editing}
                                currentlyEditing={currentlyEditing}
                                setEditing={setEditing}
                                setCurrentlyEditing={setCurrentlyEditing}
                                register={register}
                                reset={reset}
                                deleteStudentHandler={deleteStudentHandler}
                                addStudent={addStudent}
                                setAddStudent={setAddStudent}
                                register2={register2}
                            />
                        </tbody>
                    </table>
                </div>
            </div>
            <StudentTablePagination pageCount={pageCount}/>
        </>
    )
}

export default StudentsTable
