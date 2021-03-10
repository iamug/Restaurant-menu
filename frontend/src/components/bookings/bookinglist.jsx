import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Loader } from "rsuite";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { FetchUsersData } from "../../controllers/fetchdata";
import { hasPermission } from "../../controllers/auth";

const BookingListComponent = (props) => {
  const history = useHistory();
  let [bookingData, setBookingData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [loading, setLoading] = useState(false);
  let [users, setUsers] = useState(false);

  const handleSelectUser = async () => {
    const users = await FetchUsersData();
    let dataArray = [];
    if (users && users.users)
      users.users.forEach((e) => {
        dataArray = [...dataArray, { label: e.email, value: e._id }];
      });
    setUsers(dataArray);
  };

  const getUserEmail = (id) => {
    if (!id) return null;
    if (!users) return null;
    let obj = users.find((o) => o.value === id);
    return (obj && obj.label) || null;
  };

  const deletebooking = async (id) => {
    let notifier = new AWN();
    if (id == undefined) {
      notifier.alert("Error. Kindly check internet connection.");
      return;
    }
    let onOk = async () => {
      try {
        let token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        };
        const res = await API.delete("/api/bookings/" + id, config);
        if (!res) {
          notifier.alert("Error. Kindly check internet connection");
          return false;
        }
        if (res.status == 200) {
          notifier.success("Record deleted.");
          setRefreshData(!refreshData);
          return true;
        }
      } catch (err) {
        console.log(err);
        notifier.alert("Error. Kindly check internet connection");
        return false;
      }
    };
    let onCancel = () => {};
    notifier.confirm("Are you sure?", onOk, onCancel);
  };

  const fetchbookings = async () => {
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.get("/api/bookings", config);
      if (!res) {
        return false;
      }
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  useEffect(async () => {
    $(document).ready(function () {
      $("#myInput").on("input", function () {
        var value = $(this).val().toLowerCase();
        $("tbody tr").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });
    });
    handleSelectUser();
    const drivetests = await fetchbookings();
    console.log({ drivetests });
    if (!drivetests) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    setBookingData(drivetests);
    setLoading(true);
  }, [refreshData]);

  return (
    <React.Fragment>
      <div>
        <div className="content">
          {/* Start Content*/}
          <div className="container-fluid">
            {/* start page title */}
            <div className="row">
              <div className="col-12">
                <div className="page-title-box">
                  <h4 className="page-title">Bookings</h4>
                </div>
              </div>
            </div>
            {/* end page title */}

            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-2">
                      <div className="col-sm-5">
                        <form className="form-inline">
                          <div className="form-group mb-2 col-sm-12 pl-0">
                            <label htmlFor="inputPassword2" className="sr-only">
                              Search
                            </label>
                            <input
                              type="search"
                              className="form-control col-sm-12"
                              id="myInput"
                              placeholder="Search..."
                            />
                          </div>
                        </form>
                      </div>
                      <div className="col-sm-7">
                        <div className="text-sm-right">
                          <button
                            type="button"
                            onClick={() => {
                              setRefreshData(!refreshData);
                            }}
                            className="btn btn-success waves-effect waves-light mb-2 mr-1"
                          >
                            <i className="mdi mdi-refresh" />
                          </button>
                        </div>
                      </div>
                      {/* end col*/}
                    </div>
                    <div className="table-responsive">
                      <table className="table table-centered table-nowrap table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Quotation Amount</th>
                            <th>User</th>
                            <th>ID</th>
                            <th>Paid</th>

                            <th style={{ width: 82 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookingData && bookingData.length >= 1 ? (
                            bookingData.map((booking, index) => (
                              <>
                                <tr key={index}>
                                  <td className="font-weight-semibold">
                                    {new Date(
                                      booking.createdAt
                                    ).toDateString() +
                                      " " +
                                      new Date(
                                        booking.createdAt
                                      ).toLocaleTimeString()}
                                  </td>
                                  <td className="text-primary font-weight-semibold">
                                    <b>
                                      {booking.quotation &&
                                        booking.quotation.amount &&
                                        "NGN " +
                                          parseFloat(booking.quotation.amount)
                                            .toFixed(2)
                                            .replace(
                                              /(\d)(?=(\d{3})+(?!\d))/g,
                                              "$1,"
                                            )}
                                    </b>
                                  </td>
                                  <td>{getUserEmail(booking.userId)}</td>
                                  <td>{booking.bookingId}</td>
                                  <td>
                                    {booking.quotation &&
                                    booking.quotation.isPaid ? (
                                      <span className="badge badge-success">
                                        Paid
                                      </span>
                                    ) : (
                                      <span className="badge badge-dark">
                                        Unpaid
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <a
                                      onClick={() => {
                                        console.log(booking);
                                        history.push({
                                          pathname: "/editbooking",
                                          state: { detail: booking },
                                        });
                                      }}
                                      className="action-icon"
                                    >
                                      {" "}
                                      <i className="mdi mdi-square-edit-outline" />
                                    </a>
                                    {hasPermission.delete(
                                      props.permissions
                                    ) && (
                                      <a
                                        className="action-icon"
                                        onClick={() => {
                                          deletebooking(booking.bookingId);
                                        }}
                                      >
                                        {" "}
                                        <i className="mdi mdi-delete" />
                                      </a>
                                    )}
                                  </td>
                                </tr>
                              </>
                            ))
                          ) : bookingData &&
                            bookingData.length === 0 &&
                            loading ? (
                            <tr>
                              <td colSpan={7} className="text-center py-5">
                                <h3> There are no Bookings</h3>
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <td colSpan={7} className="text-center py-5">
                                <Loader size="lg" content="Loading" />
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>{" "}
                  {/* end card-body*/}
                </div>{" "}
                {/* end card*/}
              </div>{" "}
              {/* end col */}
            </div>
            {/* end row */}
          </div>{" "}
          {/* container */}
        </div>{" "}
        {/* content */};
      </div>
    </React.Fragment>
  );
};

export default BookingListComponent;
