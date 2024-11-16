import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import "./index.css";
import "./i18n";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import App from "./App";
import rootReducer from "./redux/reducer/mainReducer";
import ErrorBoundary from "./globalError/globalError";
//import ErrorBoundary from "antd/es/alert/ErrorBoundary";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Configure the Redux store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <Suspense fallback={<div>Loading translations...</div>}>
          <ErrorBoundary
          //fallback={<div>Error loading page. Please refresh.</div>}
          >
            <App />
          </ErrorBoundary>
        </Suspense>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
);
