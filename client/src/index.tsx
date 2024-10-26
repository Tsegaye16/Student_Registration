import React from "react";
import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import "./index.css";

import App from "./App";
import rootReducer from "./redux/reducer/mainReducer";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Configure the Redux store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Custom middleware can be added here if needed
});

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
