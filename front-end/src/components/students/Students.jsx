import React, {useEffect,useState} from 'react'
import {accessTokenState} from "../../recoil/atoms/userAtom";
import {useRecoilState} from 'recoil';
import {useNavigate} from "react-router-dom";
import UserLayout from "../layout/userLayout/UserLayout";
import axios from '../../api/axios'
import StudentsTable from '../studentsTable/StudentsTable'

const Students = ()=>{
    const navigate = useNavigate();

    return(
        <UserLayout>
            <div>
                <p className="fs-3 text-center fw-semibold my-2">Students details</p>
                <StudentsTable crud={false}/>
            </div>
        </UserLayout>
    )
}

export default Students
