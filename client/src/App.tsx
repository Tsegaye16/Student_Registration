import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/home";

import Dashboard from "./pages/admin/dashboard/dashboard";
import Login from "./components/form/login/login";
import Registration from "./components/form/register/register";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        <Route path="/" element={<Home />} />

        <Route path="/manager" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
