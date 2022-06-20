import "./App.css";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Modal, Layout, Menu, Breadcrumb } from "antd";
import React, { useEffect, useRef, useState } from "react";
import CustomTable from "./Components/Table";
import _ from "lodash";
import { useCSVReader } from "react-papaparse";
import { useSelector, useDispatch } from "react-redux";
import {
  getEmployees,
  deleteEmployee,
  // updateEmployee,
} from "./redux/features/employee/employeeSlice";

const { Header, Content, Sider } = Layout;
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,
      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  }
);

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  browseFile: {
    width: "20%",
  },
  acceptedFile: {
    border: "1px solid #ccc",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: "80%",
  },
  remove: {
    borderRadius: 0,
    padding: "0 20px",
  },
  progressBarBackgroundColor: {
    backgroundColor: "red",
  },
};

let dataSource = [];
for (let i = 0; i < 4; i++) {
  dataSource.push({
    id: i + 1,
    name: `venkata`,
    login: `User name ${i + 1}`,
    salary: `343432${i + 1}`,
  });
}

export default function App() {
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sortIdFlags, setIdFlags] = useState(true);
  const [sortNameFlags, setNameFlag] = useState(false);
  const [sortLoginFlags, setLoginflag] = useState(false);
  const [sortSalaryFlags, setSalaryflag] = useState(false);
  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const [data, setdata] = useState([]);
  //  useState(
  //   _.orderBy(dataSource, ["id"], ["asc"]).slice(0, 5)
  // );
  const [empId, setEmpID] = useState("");
  const [empName, setEmpName] = useState("");
  const [formObj, setFormObj] = useState({});
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  const { employeeList } = useSelector((state) => state.employee);

  const dispatch = useDispatch();

  const buttonRef = useRef(null);

  const { CSVReader } = useCSVReader();

  const fileReader = new FileReader();
  useEffect(() => {
    dispatch(getEmployees(_.orderBy(employeeList, ["id"], ["asc"])));
  }, []);

  const handleOnChange = (e) => {
    console.log(e.target.files[0], "file.......");
    setFile(e.target.files[0]);
    // handleOnSubmit(e)
  };

  // console.log(array);
  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((i) => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });
    setArray(array);
    console.log(array, "arryyyyyy");
  };

  const openModalform = () => {
    setOpenModal(true);
  };

  const handleOk = (type) => {
    if (type === 1) {
      setOpenModal(false);
    } else if (type === 2) {
      setEditModal(false);
    } else {
      setDeleteModal(false);
    }
  };

  //Modal popups cancel
  const handleCancel = (type) => {
    if (type === 1) {
      setOpenModal(false);
    } else if (type === 2) {
      setEditModal(false);
    } else {
      setDeleteModal(false);
    }
  };
  // const handleFiles = (files) => {
  //   var reader = new FileReader();
  //   console.log(files, "file");
  //   console.log(files[0], "files");

  //   // let file = files[0];
  // };
  //open edit form modal pop up
  const editRow = (item) => {
    // setEmpObject(item ? item : "", () => {});
    setFormObj(
      { ...formObj, name: item.name, login: item.login, salary: item.salary },
      () => {}
    );
    setEmpID(item ? item.id : "", () => {});
    setEditModal(true);
  };
  //open deletePopup Modal
  const deleteRow = (item) => {
    setDeleteModal(true);
    setEmpID(item ? item.id : "", () => {});
    setEmpName(item ? item.name : "", () => {});
  };
  //delete row of table
  const deleteEachItem = (empId) => {
    // console.log(empId)
    // const cloneArray = [...data];
    // let finalArraySet = cloneArray.filter((list) => list.id != empId);
    setDeleteModal(false);
    dispatch(deleteEmployee(empId));
    // setdata(finalArraySet);
  };
  //handle edit form input controls
  const handleInputs = (event) => {
    const { name, value } = event.target;
    setFormObj({ ...formObj, [name]: value });
  };
  //handleSalary range inputs
  const handleSalaryInputs = (event, type) => {
    const { name, value } = event.target;
    if (type === "min") {
      setMinSalary(value);
    } else {
      setMaxSalary(value);
    }
  };

  //edit emoplyee modal
  const editEmployeeInfo = () => {
    const { name, salary, login } = formObj;
    const cloneArray = [...data];
    let updatedList = cloneArray.map((list) =>
      list.id === empId
        ? { id: list.id, name: name, login: login, salary: salary }
        : list
    );
    setEditModal(false);
    // dispatch(updateEmployee(formObj))
    setdata(updatedList);
  };
  //filter by salary range
  const filterSalaryByRange = () => {
    const cloneArray = [...employeeList];
    let filteredSalaries = cloneArray.filter(
      (item) => item.salary >= minSalary && item.salary <= maxSalary
    );
    console.log(filteredSalaries)
    dispatch(getEmployees(filteredSalaries))
  };

  //sort by ids
  const sortByIds = () => {
    setIdFlags(!sortIdFlags);
    if (sortIdFlags) {
      dispatch(getEmployees(_.orderBy(employeeList, ["id"], ["desc"])));
    } else {
      dispatch(getEmployees(_.orderBy(employeeList, ["id"], ["asc"])));
    }
  };
  //sort by names
  const sortByName = () => {
    setNameFlag(!sortNameFlags);
    if (!sortNameFlags) {
      dispatch(getEmployees(_.orderBy(employeeList, ["name"], ["asc"])));
    } else {
      dispatch(getEmployees(_.orderBy(employeeList, ["name"], ["desc"])));
    }
  };
  //sort by login names
  const sortByLogin = () => {
    setLoginflag(!sortLoginFlags);
    if (!sortLoginFlags) {
      dispatch(getEmployees(_.orderBy(employeeList, ["login"], ["asc"])));
    } else {
      dispatch(getEmployees(_.orderBy(employeeList, ["login"], ["desc"])));
    }
  };
  //sort by salary
  const sortBySalary = () => {
    setSalaryflag(!sortSalaryFlags);
    if (!sortSalaryFlags) {
      dispatch(getEmployees(_.orderBy(employeeList, ["salary"], ["asc"])));
    } else {
      dispatch(getEmployees(_.orderBy(employeeList, ["salary"], ["desc"])));
    }
  };
  //handle pagination
  const handlePageChange = (page, limit) => {
    console.log(page, limit);
  };

  const handleOnFileLoad = (data) => {
    console.log(data);
  };
  const onErrorHandler = (data) => {
    console.log(data);
  };
  const handleFileRemove = (data) => {
    console.log(data);
  };

  const handleOpenCSVReader = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };
  // const uploadCSV = (results) => {
  //   console.log(results.data);
  //   const columns = results.data.map((col, index) => {
  //     return {
  //       Header: col,
  //       accessor: col.split(" ").join("_").toLowerCase(),
  //     };
  //   });
  //   console.log(columns, "colmmmmmmmmmmmmm");
  // };
  const { id, name, login, salary } = formObj;
  // console.log(cartItems, "list............");
  return (
    <>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            items={items2}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>Employee</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <div className="row">
              <div className="offset-2 col-xl-5">
                {/* <button className="mt-3 mb-3" onClick={openModalform}>
                  upload Employees
                </button> */}
                {openModal && (
                  <Modal
                    maskClosable={false}
                    visible={openModal}
                    onOk={() => handleOk(1)}
                    onCancel={() => handleCancel(1)}
                  >
                    <div className="row">
                      <CSVReader onUploadAccepted={undefined}>
                        {({
                          getRootProps,
                          acceptedFile,
                          ProgressBar,
                          getRemoveFileProps,
                        }) => (
                          <>
                            <div style={styles.csvReader}>
                              <button
                                type="button"
                                {...getRootProps()}
                                style={styles.browseFile}
                              >
                                Browse file
                              </button>
                              <div style={styles.acceptedFile}>
                                {acceptedFile && acceptedFile.name}
                              </div>
                              <button
                                {...getRemoveFileProps()}
                                style={styles.remove}
                              >
                                Remove
                              </button>
                            </div>
                          </>
                        )}
                      </CSVReader>
                    </div>
                  </Modal>
                )}
                {editModal && (
                  <Modal
                    maskClosable={false}
                    visible={editModal}
                    onOk={() => handleOk(2)}
                    onCancel={() => handleCancel(2)}
                    footer={[
                      <>
                        <button
                          onClick={() => handleCancel(2)}
                          className="btn btn-outline-primary"
                        >
                          Cancel
                        </button>{" "}
                        <button
                          onClick={editEmployeeInfo}
                          className="btn btn-primary"
                        >
                          Save
                        </button>
                      </>,
                    ]}
                  >
                    {`Employee ID ${empId}`}
                    <form>
                      <div className="form-group mt-3">
                        <label for="formGroupExampleInput">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput"
                          placeholder="name"
                          name="name"
                          value={name}
                          autoComplete="off"
                          onChange={handleInputs}
                        />
                      </div>
                      <div className="form-group">
                        <label for="formGroupExampleInput2">Login</label>
                        <input
                          type="text"
                          className="form-control"
                          id="formGroupExampleInput2"
                          placeholder="login username"
                          name="login"
                          value={login}
                          autoComplete="off"
                          onChange={handleInputs}
                        />
                      </div>
                      <div className="form-group">
                        <label for="formGroupExampleInput2">Salary</label>
                        <input
                          type="number"
                          className="form-control"
                          id="formGroupExampleInput2"
                          placeholder="salary"
                          name="salary"
                          value={salary}
                          autoComplete="off"
                          onChange={handleInputs}
                        />
                      </div>
                    </form>
                  </Modal>
                )}
                {deleteModal && (
                  <Modal
                    title={`delete ${empName}`}
                    maskClosable={false}
                    visible={deleteModal}
                    onOk={() => handleOk(3)}
                    onCancel={() => handleCancel(3)}
                    footer={[
                      <>
                        <button
                          className="mr-3 btn btn-secondary"
                          onClick={() => handleCancel(3)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteEachItem(empId)}
                        >
                          Delete
                        </button>
                      </>,
                    ]}
                  >
                    <div className="row">
                      <div className=" col-sm-12 col-md-12 col-xl-12 col-lg-12 delete-item-body">
                        {`Are you sure you want to delete ${empName}  ?`}
                      </div>
                    </div>
                  </Modal>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <input
                className="form-control col-xl-3 col-md-4 col-lg-3 mt-2 mr-3"
                type="number"
                placeholder="Minimum Salary"
                name="minSalary"
                onChange={(e) => handleSalaryInputs(e, "min")}
              />{" "}
              <span className="mt-3"> - </span>
              <input
                className="form-control col-xl-3 col-md-4 col-lg-3 mt-2 ml-3 mr-3 "
                type="number"
                placeholder="Maximum Salary"
                name="maxSalary"
                onChange={(e) => handleSalaryInputs(e, "max")}
              />
              <button
                className="mt-2 btn btn-primary btn-sm"
                disabled={!(minSalary && maxSalary)}
                onClick={filterSalaryByRange}
              >
                Filter
              </button>
            </div>

            <CustomTable
              dataSource={employeeList}
              editEmp={editRow}
              deleteEmp={deleteRow}
              idClick={sortByIds}
              nameClick={sortByName}
              loginClick={sortByLogin}
              salaryClick={sortBySalary}
              sortbyIdFlag={sortIdFlags}
              sortbyNameflag={sortNameFlags}
              sortbyLoginflag={sortLoginFlags}
              sortbySalary={sortSalaryFlags}
              pageChange={handlePageChange}
            />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
