import React from 'react'

const StudentTableColumns = ({columns,crud})=>{
    return(
        <>
            <tr>
                {
                    columns.map((col,pos)=>{
                        return <th scope="col" key={pos}>{col.headerName}</th>
                    })
                }
                {crud &&
                    <>
                        <th></th>
                        <th></th>
                    </>
                }

            </tr>
        </>
    )
}

export default StudentTableColumns
