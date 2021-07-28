import React, { useEffect, useState, useContext } from "react";
import $ from "jquery";
import { Button, ButtonToolbar, Paragraph } from "rsuite";
import { Loader } from "rsuite";
import { Table } from "rsuite";
import API from "../../../controllers/api";
import { Notification } from "rsuite";
import AWN from "awesome-notifications";
import DataContext, { DataConsumer } from "../../../context/datacontext";

const DashboardComponent = (props) => {
  let [totalSummary, setTotalSummary] = useState(false);
  let [recentOrders, setRecentOrders] = useState(false);
  let [recentProducts, setRecentProducts] = useState(false);
  let [loading, setLoading] = useState(false);
  let [refreshData, setRefreshData] = useState(false);
  const { userdata } = useContext(DataContext);
  let token = localStorage.getItem("token");
  let headers = {
    "Content-Type": "application/json",
    "x-auth-token": token,
  };

  const fetchrecentproducts = async () => {
    try {
      const config = { headers };
      const res = await API.get("/api/user/dashboard/recentproducts", config);
      if (!res) return false;
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const fetchrecentorders = async () => {
    try {
      const config = { headers };
      const res = await API.get("/api/user/dashboard/recentorders", config);
      if (!res) return false;
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const fetchtotalsummary = async () => {
    try {
      const config = { headers };
      const res = await API.get("/api/user/dashboard/totalsummary", config);
      if (!res) return false;
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  useEffect(async () => {
    console.log({ userdata });
    //$("body").addClass("authentication-bg authentication-bg-pattern");
    //$("body").removeClass("authentication-bg authentication-bg-pattern");
    //console.log("enter");
    const total = await fetchtotalsummary();
    const orders = await fetchrecentorders();
    const products = await fetchrecentproducts();
    console.log({ total, orders, products });
    if (!total || !orders || !products)
      new AWN().alert("Network Error. Kindly check your internet connection");
    setTotalSummary(total);
    setRecentProducts(products);
    setRecentOrders(orders);
    setLoading(true);
    setLoading(true);
  }, [userdata, refreshData]);

  return (
    <React.Fragment>
      <div>
        {loading ? (
          <div className="content">
            {/* Start Content*/}
            <div className="container-fluid">
              {/* start page title */}
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box">
                    <div className="page-title-right">
                      <form className="form-inline">
                        <a
                          onClick={() => {
                            setLoading(false);
                            setRefreshData(!refreshData);
                          }}
                          className="btn btn-default btn-md ml-2 text-white"
                        >
                          <i className="mdi mdi-autorenew" />
                        </a>
                      </form>
                    </div>
                    <h4 className="page-title">Dashboard</h4>
                  </div>
                </div>
              </div>
              {/* end page title */}
              <div className="row">
                <div className="col-md-3 col-xl-3">
                  <div className="widget-rounded-circle card-box">
                    <div className="row">
                      <div className="col-6">
                        <div className="avatar-lg rounded-circle bg-soft-info border-info border">
                          <i className="mdi mdi-tag-multiple font-22 avatar-title text-info" />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-right">
                          <h3 className="mt-1">
                            <span data-plugin="counterup">
                              {totalSummary && totalSummary.products}
                            </span>
                          </h3>
                          <p className="text-muted mb-1 text-truncate">
                            Total Products
                          </p>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end row*/}
                  </div>{" "}
                  {/* end widget-rounded-circle*/}
                </div>
                {/* end col*/}
                <div className="col-md-3 col-xl-3">
                  <div className="widget-rounded-circle card-box">
                    <div className="row">
                      <div className="col-6">
                        <div className="avatar-lg rounded-circle bg-soft-primary border-primary border">
                          <i className="mdi mdi-receipt font-22 avatar-title text-primary" />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-right">
                          <h3 className="text-dark mt-1">
                            <span data-plugin="counterup">
                              {totalSummary && totalSummary.orders}
                            </span>
                          </h3>
                          <p className="text-muted mb-1 text-truncate">
                            Total Orders
                          </p>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end row*/}
                  </div>{" "}
                  {/* end widget-rounded-circle*/}
                </div>

                {/* end col*/}
                <div className="col-md-3 col-xl-3">
                  <div className="widget-rounded-circle card-box">
                    <div className="row">
                      <div className="col-6">
                        <div className="avatar-lg rounded-circle bg-soft-info border-info border">
                          <i className="mdi mdi-table-chair font-22 avatar-title text-info" />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-right">
                          <h3 className="text-dark mt-1">
                            <span data-plugin="counterup">
                              {totalSummary && totalSummary.tables}
                            </span>
                          </h3>
                          <p className="text-muted mb-1 text-truncate">
                            Total Tables
                          </p>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end row*/}
                  </div>{" "}
                  {/* end widget-rounded-circle*/}
                </div>
                {/* end col*/}
                <div className="col-md-3 col-xl-3 hidden">
                  <div className="widget-rounded-circle card-box">
                    <div className="row">
                      <div className="col-6">
                        <div className="avatar-lg rounded-circle bg-soft-primary border-primary border">
                          <i className="mdi mdi-credit-card font-22 avatar-title text-primary" />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-right">
                          <h3 className="text-dark mt-1">
                            <span data-plugin="counterup">0</span>
                          </h3>
                          <p className="text-muted mb-1 text-truncate">
                            Total Payments
                          </p>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end row*/}
                  </div>{" "}
                  {/* end widget-rounded-circle*/}
                </div>
                {/* end col*/}
              </div>
              {/* end row*/}
              {/* end row */}
              <div className="row ">
                <div className="col-xl-7">
                  <div className="card-box h-100">
                    <div className="float-left">
                      <h4 className="header-title mb-3">Recent Orders</h4>
                    </div>
                    <div className="float-right">
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          props.history.push("/user/orders");
                        }}
                        className="btn btn-primary btn-md"
                      >
                        View more
                      </a>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-borderless table-hover table-nowrap table-centered m-0">
                        <thead className="thead-light">
                          <tr>
                            <th>Date</th>
                            <th>Table Name</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders && recentOrders.length > 0 ? (
                            recentOrders.map((order, index) => (
                              <tr key={index}>
                                <td>
                                  {new Date(order.createdAt).toDateString()}
                                </td>
                                <td>
                                  <h5 className="m-0 font-weight-bold font-13 pl-2 ">
                                    {order.tableName}
                                  </h5>
                                </td>

                                <td>
                                  {order.isCompleted ? (
                                    <span className="badge bg-soft-success text-success">
                                      Completed
                                    </span>
                                  ) : (
                                    <span className="badge bg-soft-dark text-dark">
                                      Pending
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center py-3">
                                <div className="text-center my-3 h-100">
                                  <h4> No Orders yet. </h4>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>{" "}
                {/* end col  */}
                <div className="col-xl-5">
                  <div className="card-box h-100">
                    <div className="float-left">
                      <h4 className="header-title mb-3">Recent Products</h4>
                    </div>
                    <div className="float-right">
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          props.history.push("/user/products");
                        }}
                        className="btn btn-primary btn-md"
                      >
                        View more
                      </a>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-borderless table-nowrap table-hover table-centered m-0">
                        <thead className="thead-light">
                          <tr>
                            <th>Name</th>
                            <th>Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentProducts && recentProducts.length > 0 ? (
                            recentProducts.map((product, index) => (
                              <tr key={index}>
                                <td>
                                  <h5 className="m-0 font-weight-normal font-13">
                                    {product.name}
                                  </h5>
                                </td>
                                <td>{product.productCategory?.name}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center py-3">
                                <div className="text-center my-3 h-100">
                                  <h4> No Produts yet. </h4>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>{" "}
                    {/* end .table-responsive  */}
                  </div>{" "}
                  {/* end card-box  */}
                </div>{" "}
                {/* end col  */}
              </div>
            </div>
            {/* end row */}
          </div>
        ) : (
          /* content */
          <div className="text-center py-5 my-5 h-100">
            <div
              className="spinner-border avatar-lg text-primary m-2"
              role="status"
            ></div>
            <h4> Loading...</h4>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default DashboardComponent;
