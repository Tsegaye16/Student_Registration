import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/home";

import Dashboard from "./pages/admin/dashboard/dashboard";
import Login from "./components/form/login/login";
import Registration from "./components/form/register/register";
import EmailConfirm from "./components/form/emailConfirm";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/confirm-email" element={<EmailConfirm />} />

        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
