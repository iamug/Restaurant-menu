import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProfileComponent from "./profile/profile";
import DashboardComponent from "./dashboard/dashboard";
import AdminListComponent from "./admins/adminlist";
import ProductListComponent from "./products/productlist";
import CategoryListComponent from "./Category/categorylist";
import Error404Component from "../404";
import LeftSideMenuComponent from "./LeftSideMenu";
import TopbarMenuComponent from "./TopBarMenu";

const AdminDashboard = () => (
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
          render={(props) => <DashboardComponent {...props} />}
        />
        <Route path="/profile" exact component={ProfileComponent} />
        <Route path="/admins" exact component={AdminListComponent} />
        <Route path="/products" exact component={ProductListComponent} />
        <Route path="/category" exact component={CategoryListComponent} />
        <Route path="/404" component={Error404Component} />
        <Route component={Error404Component} />
      </Switch>
    </div>
  </React.Fragment>
);

export default AdminDashboard;
