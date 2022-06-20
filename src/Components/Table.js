// import React from 'react'
import { Table, Pagination, message } from "antd";
import sortUp from "../Images/sort-up-solid.svg";
import sortDown from "../Images/sort-down-solid.svg";

import "./Table.css";

export default function CustomTable(props) {
  const {
    dataSource,
    columns,
    editEmp,
    deleteEmp,
    idClick,
    nameClick,
    loginClick,
    salaryClick,
    sortbyIdFlag,
    sortbyNameflag,
    sortbyLoginflag,
    sortbySalary,
    pageChange,
  } = props;
  const tbodyData = dataSource.map((item) => {
    return (
      <>
        <tr key={item.toString()}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.login}</td>
          <td>{item.salary}</td>
          <td>
            <a className="pr-2" onClick={() => editEmp(item)}>
              Edit
            </a>{" "}
            <a className="" onClick={() => deleteEmp(item)}>
              Delete
            </a>
          </td>
        </tr>
      </>
    );
  });
  return (
    <>
      <table className="table table-striped mt-5">
        <thead>
          <tr>
            <th scope="col" onClick={idClick}>
              Id{" "}
              {sortbyIdFlag ? (
                <img src={sortUp} alt="sortUp" className="ml-4 sortStyles" />
              ) : (
                <img
                  src={sortDown}
                  alt="sortDown"
                  className=" ml-4 sortStyles pb-2"
                />
              )}
            </th>
            <th scope="col" onClick={nameClick}>
              Name{" "}
              {sortbyNameflag ? (
                <img src={sortUp} alt="sortUp" className="ml-4 sortStyles" />
              ) : (
                <img
                  src={sortDown}
                  alt="sortDown"
                  className=" ml-4 sortStyles pb-2"
                />
              )}
            </th>
            <th scope="col" onClick={loginClick}>
              Login{" "}
              {sortbyLoginflag ? (
                <img src={sortUp} alt="sortUp" className="ml-4 sortStyles" />
              ) : (
                <img
                  src={sortDown}
                  alt="sortDown"
                  className=" ml-4 sortStyles pb-2"
                />
              )}
            </th>
            <th scope="col" onClick={salaryClick}>
              Salary
              {sortbySalary ? (
                <img src={sortUp} alt="sortUp" className="ml-4 sortStyles" />
              ) : (
                <img
                  src={sortDown}
                  alt="sortDown"
                  className=" ml-4 sortStyles pb-2"
                />
              )}
            </th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>{tbodyData}</tbody>
      </table>
      {dataSource.length > 0 ? (
        <Pagination
          defaultCurrent={1}
          current={1}
          total={23}
          defaultPageSize={7}
          showSizeChanger={false}
          onChange={(page, pageSize) => pageChange(1, 7)}
        ></Pagination>
      ): message.info('No Employee Found!!')}
    </>
    // <Table dataSource={dataSource} columns={columns}/>
  );
}
