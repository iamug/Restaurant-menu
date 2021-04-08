import React, { useState, useEffect, useMemo } from "react";
import "./styles/notification/shared-awesome.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter,
} from "react-router-dom";
import Popper from "popper.js";
import "rsuite/dist/styles/rsuite-default.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Loader } from "rsuite";
import { Spinner } from "@chakra-ui/react";

import DataContext, { DataProvider } from "./context/datacontext";
import { GetUserData, PrivateRoute } from "./controllers/auth";
import LoginComponent from "./components/adminDashboard/login/login";
import SignupComponent from "./components/adminDashboard/signup/signup";
import MenuComponent from "./components/menu/menucomponent";

import Error404Component from "./components/404";
import VerifyAdminComponent from "./components/adminDashboard/login/verifyadmin";
import RecoverPasswordComponent from "./components/adminDashboard/resetpassword/recoverpassword";
import ResetPasswordComponent from "./components/adminDashboard/resetpassword/resetpassword";

import AdminDashboard from "./components/adminDashboard/home";
import UserDashboard from "./components/userDashboard/home";

function App() {
  let [userdata, setUserData] = useState(false);
  let [loading, setLoading] = useState(false);
  let providerValue = useMemo(() => ({ userdata, setUserData }), [
    userdata,
    setUserData,
  ]);

  useEffect(async () => {
    // let data;
    // try {
    //   data = await GetUserData();
    // } catch (error) {
    //   data = false;
    // }
    // console.log({ data });
    // if (data && data.email) {
    //   if (
    //     window.location.pathname === "/login" ||
    //     window.location.pathname === "/"
    //   ) {
    //     window.location.href = "/dashboard";
    //   }
    // }
    // if (!data) {
    //   if (window.location.pathname === "/login") {
    //     setLoading(true);
    //     return false;
    //   } else {
    //     if (
    //       window.location.pathname &&
    //       (window.location.pathname.includes("/resetpassword") ||
    //         window.location.pathname.includes("/verify"))
    //     ) {
    //       setLoading(true);
    //       return false;
    //     }
    //     //window.location.href = "/login";
    //   }
    // }
    // setUserData(data);
    // setLoading(true);
  }, []);
  return (
    <DataContext.Provider value={providerValue}>
      <Router>
        <Switch>
          {/* <Route path="/user/login" exact component={LoginComponent} />
          <Route path="/signup" exact component={SignupComponent} />
          <Route path="/menu" exact component={withRouter(MenuComponent)} />
          <Route path="/" exact component={LoginComponent} /> */}

          <Route path="/user/" component={withRouter(UserDashboard)} />
          <Route path="/admin/" component={withRouter(AdminDashboard)} />
          <Redirect to="/user/login" />
        </Switch>
      </Router>
    </DataContext.Provider>
  );
}

export default App;
