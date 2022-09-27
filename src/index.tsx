import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import App from "./App";
import Listing from "./pages/Listing/Listing";
import Profile from "./pages/Profile/Profile";
import Home from "./pages/Home/Home";
import SignIn from "./pages/Signin/Signin";
import { Loading } from "./components/Loading";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <Routes>
      {/* <Route element={<Loading />}> */}
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="listing/:id" element={<Listing />} />
        <Route path="profile" element={<Profile />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="*/*" element={<Navigate to="/" replace />} />
      </Route>
      {/* </Route> */}
    </Routes>
  </BrowserRouter>
);
