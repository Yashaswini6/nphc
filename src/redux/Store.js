import { configureStore } from "@reduxjs/toolkit";
import employeeSlice from "./features/employee/employeeSlice";
import { combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  storage,
  whitelist: [employeeSlice],
};

const rootReducer = combineReducers({
  employee: employeeSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PURGE, REHYDRATE, REGISTER, PERSIST],
      },
    }),
});
export const persistor = persistStore(store);
export default store;

// The store now has redux-thunk added and the Redux DevTools Extension is turned on
