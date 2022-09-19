import React from 'react'
import ReactPaginate from "react-paginate";
import useUrlSearchParams from "../../hooks/useUrlSearchParams";
import {useSearchParams} from "react-router-dom";

const StudentTablePagination = ({pageCount})=>{
    const { page } = useUrlSearchParams();
    let [searchParams, setSearchParams] = useSearchParams();

    const handlePageClick = async(data)=>{
        let currentPage = data.selected;
        searchParams.set("page", currentPage+1);
        setSearchParams(searchParams);
    }

    return(
        <>
            <ReactPaginate
                forcePage={page-1}
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
                // activeLinkClassName={"active"}
            />
        </>
    )
}

export default StudentTablePagination
