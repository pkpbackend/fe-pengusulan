// ** Redux Imports
import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { v3ApiNew } from "../api/ApiCallV3New";

const store = configureStore({
  reducer: {
    ...rootReducer,
    [v3ApiNew.reducerPath]: v3ApiNew.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    }).concat(v3ApiNew.middleware);
  },
});

export { store };
