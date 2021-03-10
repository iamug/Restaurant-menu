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
                {/* <Switch>
                  <Route
                    path="/dashboard"
                    exact
                    render={(props) => (
                      <DashboardComponent
                        {...props}
                        permissions={{
                          ...(userdata.permissions || {}),
                          superAdmin: userdata.superAdmin || false,
                        }}
                      />
                    )}
                  />
                  <Route path="/profile" exact component={ProfileComponent} />
                  {/* <Route path="/users" exact component={UserListComponent} /> 
                  <PrivateRoute
                    path="/users"
                    module="Users"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                    component={UserListComponent}
                  />
                  <PrivateRoute
                    path="/drivers"
                    module="Drivers"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                    component={DriverListComponent}
                  />
                  <PrivateRoute
                    path="/admins"
                    module="Admins"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                    component={AdminListComponent}
                  />
                  <PrivateRoute
                    path="/partners"
                    module="Partners"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                    component={PartnerListComponent}
                  />

                  <PrivateRoute
                    path="/plans"
                    module="Plans"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                    component={PlanListComponent}
                  />
                  <PrivateRoute
                    path="/faqs"
                    module="FAQs"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                    component={FAQListComponent}
                  />
                  <PrivateRoute
                    path="/vehicles"
                    module="Vehicles"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                    component={VehicleListComponent}
                  />
                  <PrivateRoute
                    path="/tickets"
                    module="Tickets"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                    component={TicketListComponent}
                  />

                  <PrivateRoute
                    path="/drivetest"
                    module="Drive Test"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                    component={DriveTestListComponent}
                  />

                  <PrivateRoute
                    path="/testcenters"
                    module="Drive Test Centers"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                    component={TestCenterListComponent}
                  />

                  <PrivateRoute
                    path="/inspcenters"
                    module="Vehicle Inspection Centers"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                    component={InspCenterListComponent}
                  />

                  <PrivateRoute
                    path="/vehicleinsp"
                    component={VehicleInspectionList}
                    module="Vehicle Inspection"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                  />

                  <PrivateRoute
                    path="/editbooking"
                    component={EditBookingComponent}
                    module="Bookings"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                  />

                  <PrivateRoute
                    path="/bookings"
                    component={BookingListComponent}
                    module="Bookings"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                  />

                  <PrivateRoute
                    path="/itineraries"
                    component={ItineraryComponent}
                    module="Itineraries"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                  />

                  <PrivateRoute
                    path="/transactions"
                    component={TransactionListComponent}
                    module="Transactions"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                  />

                  <PrivateRoute
                    path="/requestrepair"
                    component={RequestRepairComponent}
                    module="Request Repair"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                  />

                  <PrivateRoute
                    path="/sos"
                    component={SOSComponent}
                    module="Report SOS"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                  />

                  <PrivateRoute
                    path="/roles"
                    exact
                    component={RolesComponent}
                    module="Roles and Permissions"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                  />

                  <PrivateRoute
                    path="/logs"
                    exact
                    component={LogComponent}
                    module="Activity Logs"
                    permissions={userdata.permissions || {}}
                    superAdmin={userdata.superAdmin || false}
                  />

                  <Route path="/404" component={Error404Component} />
                  <Route component={Error404Component} />
                </Switch> */}
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
