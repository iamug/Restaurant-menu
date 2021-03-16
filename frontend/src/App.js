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
import LoginComponent from "./components/login/login";
import MenuComponent from "./components/menu/menucomponent";
import ProfileComponent from "./components/profile/profile";
import AdminListComponent from "./components/admins/adminlist";
import ProductListComponent from "./components/products/productlist";
import CategoryListComponent from "./components/Category/categorylist";
import Error404Component from "./components/404";
import VerifyAdminComponent from "./components/login/verifyadmin";
import RecoverPasswordComponent from "./components/resetpassword/recoverpassword";
import ResetPasswordComponent from "./components/resetpassword/resetpassword";
import LeftSideMenuComponent from "./components/LeftSideMenu";
import TopbarMenuComponent from "./components/TopBarMenu";

function App() {
  let [userdata, setUserData] = useState(false);
  let [loading, setLoading] = useState(false);
  let providerValue = useMemo(() => ({ userdata, setUserData }), [
    userdata,
    setUserData,
  ]);

  useEffect(async () => {
    let data;
    try {
      data = await GetUserData();
    } catch (error) {
      data = false;
    }
    console.log({ data });
    if (data && data.email) {
      if (
        window.location.pathname === "/login" ||
        window.location.pathname === "/"
      ) {
        window.location.href = "/dashboard";
      }
    }
    if (!data) {
      if (window.location.pathname === "/login") {
        setLoading(true);
        return false;
      } else {
        if (
          window.location.pathname &&
          (window.location.pathname.includes("/resetpassword") ||
            window.location.pathname.includes("/verify"))
        ) {
          setLoading(true);
          return false;
        }
        //window.location.href = "/login";
      }
    }
    setUserData(data);
    setLoading(true);
  }, []);
  return loading ? (
    <DataContext.Provider value={providerValue}>
      <Router>
        <Switch>
          <Route path="/login" exact component={LoginComponent} />
          <Route path="/menu" exact component={withRouter(MenuComponent)} />
          <Route path="/" exact component={LoginComponent} />
          <Route
            path="/recoverpassword"
            exact
            component={RecoverPasswordComponent}
          />
          <Route
            path="/resetpassword"
            exact
            component={withRouter(ResetPasswordComponent)}
          />
          <Route
            path="/resetpassword:resetToken"
            exact
            component={withRouter(ResetPasswordComponent)}
          />
          <Route
            path="/verify:signupToken"
            exact
            component={withRouter(VerifyAdminComponent)}
          />

          {loading && userdata ? (
            <React.Fragment>
              <TopbarMenuComponent />
              <div className="left-side-menu" id="left-side-menu">
                <LeftSideMenuComponent />
              </div>
              <div className="content-page">
                <Switch>
                  <Route
                    path="/dashboard"
                    exact
                    render={(props) => <ProfileComponent {...props} />}
                  />
                  <Route path="/profile" exact component={ProfileComponent} />
                  <Route path="/admins" exact component={AdminListComponent} />
                  <Route
                    path="/products"
                    exact
                    component={ProductListComponent}
                  />
                  <Route
                    path="/category"
                    exact
                    component={CategoryListComponent}
                  />

                  <Route path="/404" component={Error404Component} />
                  <Route component={Error404Component} />
                </Switch>
              </div>
            </React.Fragment>
          ) : (
            <Redirect to="/login" />
          )}
        </Switch>
      </Router>
    </DataContext.Provider>
  ) : (
    <>
      <div className=" my-5 py-5 text-center  h-100">
        <div className=" my-5 py-5 text-center  h-100">
          <Spinner size="xl" />
          {/* <Loader size="lg" content="Loading..." vertical="true" /> */}
          {/* <div className="text-center py-5">
            <div
              class="spinner-border avatar-lg text-primary m-2"
              role="status"
            ></div>
            <h4> Loading...</h4>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default App;
