import { createSlice } from "@reduxjs/toolkit";
import store from "../../Store";
// let dataSource = [];
// for (let i = 0; i < 15; i++) {
//   dataSource.push({
//     id: i + 1,
//     name: `venkata`,
//     login: `User name ${i + 1}`,
//     salary: `343432${i + 1}`,
//   });
// }
const dataSource = [
  { id: 1, name: "venka", login: "user name", salary: 10 },
  {
    id: 2,
    name: "rama raju",
    login: "raju name",
    login: "name raju",
    salary: 4,
  },
];

const initialState = {
  employeeList: dataSource,
  isLoading: true,
};

export const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    getEmployees: (state, action) => {
      // return { employeeList: dataSource };
      state.employeeList = action.payload;
    },
    // updateEmployee: (state, action) => {
    //   // console.log(action);
    //   // const {id, name, login, salary} = action.payload;
    // //   state.employeeList = state.employeeList.map((list) =>
    // //   list.id === id
    // //     ? { id: list.id, name: name, login: login, salary: salary }
    // //     : list
    // // );
    // },
    deleteEmployee: (state, action) => {
      const empId = action.payload;
      state.employeeList = state.employeeList.filter(
        (list) => list.id != empId
      );
    },
  },
});
// console.log(cartSlice)

// Action creators are generated for each case reducer function
export const { getEmployees, deleteEmployee } =
  employeeSlice.actions;

export default employeeSlice.reducer;
