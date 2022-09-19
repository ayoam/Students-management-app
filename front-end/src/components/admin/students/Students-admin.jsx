import React, {useEffect} from 'react'
import {accessTokenState,userState} from '../../../recoil/atoms/userAtom'
import {useRecoilState} from 'recoil';
import {useNavigate} from "react-router-dom";
import UserLayout from '../../layout/userLayout/UserLayout'
import StudentsTable from "../../studentsTable/StudentsTable";

const Students = ()=>{
    const navigate = useNavigate();
    const [user,setUser] = useRecoilState(userState);

    useEffect(()=>{
        console.log(user);
    },[])

    return(
        <UserLayout>
            <div>
                <p className="fs-3 text-center fw-semibold my-2">Students details</p>
                <StudentsTable crud={true}/>
            </div>
        </UserLayout>
    )
}

export default Students
