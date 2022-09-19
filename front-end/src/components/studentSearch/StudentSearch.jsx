import React, {useEffect, useState} from 'react'
import {useSearchParams} from "react-router-dom";


const StudentSearch = ()=>{
    const [filters, setFilters] = useState({});
    let [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        let initialParams = {};
        for (let [key, value] of searchParams.entries()) {
            initialParams[key] = value;
        }
        setFilters(initialParams);
    }, []);

    let timer;
    const onChangeFilter = (input) => {
        clearTimeout(timer);
        let newValue = { ...filters, [input.attributeName]: input.value };
        setFilters(newValue);

        for (const [key, value] of Object.entries(newValue)) {
            if (value === 0 || value === "") {
                searchParams.delete(key);
            } else {
                searchParams.set(key, input.value.toString());
            }
        }

        searchParams.set("page", 1);

        if (input.type === "text") {
            timer = setTimeout(() => {
                setSearchParams(searchParams);
            }, 1000);
        } else {
            setSearchParams(searchParams);
        }
    }

    return(
        <>
            <input type={"text"} className="form-control w-25 mb-2" placeholder="Search" defaultValue={filters["name"]} onChange={
                (e)=>{
                    onChangeFilter({"attributeName":"name","type":"text","value":e.target.value})
                }
            }/>
        </>
    )
}

export default StudentSearch
