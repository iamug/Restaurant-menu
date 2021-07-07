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
  let [recentTickets, setRecentTickets] = useState(false);
  let [recentBookings, setRecentBookings] = useState(false);
  let [recentTrans, setRecentTrans] = useState(false);
  let [loading, setLoading] = useState(false);
  let [refreshData, setRefreshData] = useState(false);
  const { userdata } = useContext(DataContext);
  let token = localStorage.getItem("token");
  let headers = {
    "Content-Type": "application/json",
    "x-auth-token": token,
  };

  useEffect(async () => {
    console.log({ userdata });
    //$("body").addClass("authentication-bg authentication-bg-pattern");
    //$("body").removeClass("authentication-bg authentication-bg-pattern");
    //console.log("enter");
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
                            <span data-plugin="counterup">0</span>
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
                            <span data-plugin="counterup">0</span>
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
                            <span data-plugin="counterup">0</span>
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
                <div className="col-md-3 col-xl-3">
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
              {/* <div className="row ">
                <div className="col-xl-6">
                  <div className="card-box h-100">
                    <div className="float-left">
                      <h4 className="header-title mb-3">Recent Bookings</h4>
                    </div>
                    <div className="float-right">
                      {hasModulePermission.read(
                        props.permissions,
                        "Bookings"
                      ) && (
                        <a
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            props.history.push("/bookings");
                          }}
                          className="btn btn-primary btn-md"
                        >
                          View more
                        </a>
                      )}
                    </div>
                    <div className="table-responsive">
                      <table className="table table-borderless table-hover table-nowrap table-centered m-0">
                        <thead className="thead-light">
                          <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Itineraries</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hasModulePermission.read(
                            props.permissions,
                            "Bookings"
                          ) ? (
                            recentBookings && recentBookings.length > 0 ? (
                              recentBookings.map((booking, index) => (
                                <tr key={index}>
                                  <td>
                                    {new Date(booking.createdAt).toDateString()}
                                  </td>
                                  <td>
                                    <h5 className="m-0 font-weight-bold font-13">
                                      {booking.quotation &&
                                        booking.quotation.amount &&
                                        "NGN " +
                                          parseFloat(booking.quotation.amount)
                                            .toFixed(2)
                                            .replace(
                                              /(\d)(?=(\d{3})+(?!\d))/g,
                                              "$1,"
                                            )}
                                    </h5>
                                  </td>
                                  <td className="text-center">
                                    {booking.itineraries &&
                                      booking.itineraries.length}
                                  </td>
                                  <td>
                                    {booking.quotation &&
                                    booking.quotation.isPaid ? (
                                      <span className="badge bg-soft-success text-success">
                                        Paid
                                      </span>
                                    ) : (
                                      <span className="badge bg-soft-dark text-dark">
                                        Unpaid
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="text-center py-3">
                                  <div className="text-center my-3 h-100">
                                    <h4> No Bookings </h4>
                                  </div>
                                </td>
                              </tr>
                            )
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center py-3">
                                <div className="text-center my-5 h-100">
                                  <h4 className="text-muted">
                                    {" "}
                                    Not Permitted{" "}
                                  </h4>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>{" "}
                {/* end col 
                <div className="col-xl-6">
                  <div className="card-box h-100">
                    <div className="float-left">
                      <h4 className="header-title mb-3">Recent Transactions</h4>
                    </div>
                    <div className="float-right">
                      {hasModulePermission.read(
                        props.permissions,
                        "Transactions"
                      ) && (
                        <a
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            props.history.push("/transactions");
                          }}
                          className="btn btn-primary btn-md"
                        >
                          View more
                        </a>
                      )}
                    </div>
                    <div className="table-responsive">
                      <table className="table table-borderless table-nowrap table-hover table-centered m-0">
                        <thead className="thead-light">
                          <tr>
                            <th>Mode</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hasModulePermission.read(
                            props.permissions,
                            "Transactions"
                          ) ? (
                            recentTrans && recentTrans.length > 0 ? (
                              recentTrans.map((trans, index) => (
                                <tr key={index}>
                                  <td>
                                    <h5 className="m-0 font-weight-normal font-13">
                                      {trans.mode}
                                    </h5>
                                  </td>
                                  <td>
                                    {new Date(trans.createdAt).toDateString()}
                                  </td>
                                  <td>
                                    {trans.amount &&
                                      "NGN " +
                                        parseFloat(trans.amount)
                                          .toFixed(2)
                                          .replace(
                                            /(\d)(?=(\d{3})+(?!\d))/g,
                                            "$1,"
                                          )}
                                  </td>
                                  <td>
                                    {trans.status == "Approved" ? (
                                      <span className="badge bg-soft-success text-success">
                                        {trans.status}
                                      </span>
                                    ) : trans.status == "Pending" ? (
                                      <span className="badge bg-soft-warning text-warning">
                                        {trans.status}
                                      </span>
                                    ) : (
                                      <span className="badge bg-soft-dark text-dark">
                                        {trans.status}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="text-center py-3">
                                  <div className="text-center my-3 h-100">
                                    <h4> No Transactions </h4>
                                  </div>
                                </td>
                              </tr>
                            )
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center py-3">
                                <div className="text-center my-5 h-100">
                                  <h4 className="text-muted">
                                    {" "}
                                    Not Permitted{" "}
                                  </h4>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>{" "}
                    {/* end .table-responsive 
                  </div>{" "}
                  {/* end card-box 
                </div>{" "}
                {/* end col 
              </div>
              <div className="row mt-4">
                <div className="col-xl-12">
                  <div className="card-box h-100">
                    <div className="float-left">
                      <h4 className="header-title mb-3">Recent Tickets</h4>
                    </div>
                    <div className="float-right">
                      {hasModulePermission.read(
                        props.permissions,
                        "Transactions"
                      ) && (
                        <a
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            props.history.push("/tickets");
                          }}
                          className="btn btn-primary btn-md"
                        >
                          View more
                        </a>
                      )}
                    </div>
                    <div className="table-responsive">
                      <table className="table table-borderless table-nowrap table-hover table-centered m-0">
                        <thead className="thead-light">
                          <tr>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Issuer</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hasModulePermission.read(
                            props.permissions,
                            "Transactions"
                          ) ? (
                            recentTickets && recentTickets.length > 0 ? (
                              recentTickets.map((ticket, index) => (
                                <tr key={index}>
                                  <td>
                                    <h5 className="m-0 font-weight-normal font-13">
                                      {ticket.subject.substring(0, 15)}
                                    </h5>
                                  </td>
                                  <td>
                                    {new Date(ticket.createdAt).toDateString()}
                                  </td>
                                  <td> {ticket.ticketCategory}</td>
                                  <td>{ticket.issuerEmail}</td>
                                  <td>
                                    {ticket.status === "Closed" ? (
                                      <span className="badge bg-soft-success text-success">
                                        {ticket.status}
                                      </span>
                                    ) : ticket.status === "Open" ? (
                                      <span className="badge bg-soft-warning text-warning">
                                        {ticket.status}
                                      </span>
                                    ) : (
                                      <span className="badge bg-soft-dark text-dark">
                                        {ticket.status}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="text-center py-3">
                                  <div className="text-center my-3 h-100">
                                    <h4> No Tickets </h4>
                                  </div>
                                </td>
                              </tr>
                            )
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center py-3">
                                <div className="text-center my-5 h-100">
                                  <h4 className="text-muted">
                                    {" "}
                                    Not Permitted{" "}
                                  </h4>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>{" "}
                    {/* end .table-responsive 
                  </div>{" "}
                </div>{" "}
                {/* end card-box 
              </div>{" "} */}
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
