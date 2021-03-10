import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, ButtonToolbar, Drawer, DatePicker } from "rsuite";
import { Grid, Row, Col, InputGroup, Icon, Input, SelectPicker } from "rsuite";
import { Form, FormGroup, FormControl } from "rsuite";
import { ControlLabel, HelpBlock, Loader } from "rsuite";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { hasPermission } from "../../controllers/auth";
import { FetchUsersData, FetchAdminsData } from "../../controllers/fetchdata";

const TransactionListComponent = (props) => {
  let initialFormState = {};
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [transactionData, setTransactionData] = useState([]);
  let [summaryData, setSummaryData] = useState({});
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let [loading, setLoading] = useState(false);
  let [users, setUsers] = useState(false);
  let [testCenters, setTestCenters] = useState(false);

  const handleSelectUser = async () => {
    const users = await FetchUsersData();
    let dataArray = [];
    if (users && users.users)
      users.users.forEach((e) => {
        dataArray = [...dataArray, { label: e.email, value: e._id }];
      });
    setUsers(dataArray);
  };

  const deletetrans = async (id) => {
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
        const res = await API.delete("/api/transactions/" + id, config);
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

  const updatetrans = async (id) => {
    const { status, comments } = formValue;
    if (!status && !comments) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let body = { status, comments };
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.put("/api/transactions/" + id, body, config);
      if (res.status == 200) {
        new AWN().success("Transaction updated successfully ", {
          durations: { success: 3000 },
        });
        setRefreshData(!refreshData);
      } else {
        new AWN().alert("Failed, Kindly try again", {
          durations: { alert: 3000 },
        });
      }
    } catch (err) {
      console.log(err);
      new AWN().alert("Failed, Kindly try again", {
        durations: { alert: 3000 },
      });
    }
  };

  const fetchtrans = async () => {
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.get("/api/transactions", config);
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
    const transactions = await fetchtrans();
    if (!transactions) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    handleSelectUser();
    console.log(transactions);
    setTransactionData(transactions);
    setLoading(true);
  }, [refreshData]);

  useEffect(() => {
    if (transactionData && transactionData.length > 0 && loading) {
      let topupArr = transactionData.filter((e) => e.mode == "Topup");
      let withdrawalArr = transactionData.filter((e) => e.mode == "Withdrawal");
      let paymentArr = transactionData.filter((e) => e.mode == "Payment");
      let totalTopup = topupArr.reduce(
        (sum, o) => (o.status == "Approved" ? sum + o.amount : sum),
        0
      );
      let totalPendingTopup = topupArr.reduce(
        (sum, o) => (o.status == "Pending" ? sum + o.amount : sum),
        0
      );
      let totalWithdrawal = withdrawalArr.reduce(
        (sum, o) => (o.status == "Approved" ? sum + o.amount : sum),
        0
      );
      let totalPendingWithdrawal = withdrawalArr.reduce(
        (sum, o) => (o.status == "Pending" ? sum + o.amount : sum),
        0
      );
      let totalPayment = paymentArr.reduce(
        (sum, o) => (o.status == "Approved" ? sum + o.amount : sum),
        0
      );
      let totalPendingPayment = paymentArr.reduce(
        (sum, o) => (o.status == "Pending" ? sum + o.amount : sum),
        0
      );
      let total = transactionData.reduce(
        (sum, o) => (o.status == "Approved" ? sum + o.amount : sum),
        0
      );
      let totalPending = transactionData.reduce(
        (sum, o) => (o.status == "Pending" ? sum + o.amount : sum),
        0
      );
      let topup = {
        arr: topupArr,
        total: totalTopup,
        pending: totalPendingTopup,
      };
      let withdrawal = {
        arr: withdrawalArr,
        total: totalWithdrawal,
        pending: totalPendingWithdrawal,
      };
      let payment = {
        arr: paymentArr,
        total: totalPayment,
        pending: totalPendingPayment,
      };
      let summary = {
        topup,
        withdrawal,
        payment,
        total: { total, pending: totalPending },
      };
      setSummaryData(summary);
    }
  }, [transactionData, loading]);

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
                  <h4 className="page-title">Transactions</h4>
                </div>
              </div>
            </div>
            {/* end page title */}

            <div className="row">
              <div className="col-md-6 col-xl-3">
                <div className="card-box">
                  <i
                    className="fa fa-info-circle text-muted float-right"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title
                    data-original-title="More Info"
                  />
                  <h4 className="mt-0 font-16">Total</h4>
                  <h2 className="text-primary my-3 text-center font-22">
                    {"NGN "}
                    <span data-plugin="counterup">
                      {parseInt(
                        (summaryData.total && summaryData.total.total) || 0
                      )
                        .toFixed(0)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </span>
                  </h2>
                  <p className="text-muted mb-0">
                    Total pending:{" "}
                    <span className="float-right">
                      {"NGN " +
                        parseInt(
                          (summaryData.total && summaryData.total.pending) || 0
                        )
                          .toFixed(0)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-xl-3">
                <div className="card-box">
                  <h4 className="mt-0 font-16">Topup</h4>
                  <h2 className="text-primary my-3 text-center font-22">
                    {"NGN "}
                    <span data-plugin="counterup">
                      {parseInt(
                        (summaryData.topup && summaryData.topup.total) || 0
                      )
                        .toFixed(0)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </span>
                  </h2>
                  <p className="text-muted mb-0">
                    Total pending:{" "}
                    <span className="float-right">
                      {"NGN " +
                        parseInt(
                          (summaryData.topup && summaryData.topup.pending) || 0
                        )
                          .toFixed(0)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-xl-3">
                <div className="card-box">
                  <i
                    className="fa fa-info-circle text-muted float-right"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title
                    data-original-title="More Info"
                  />
                  <h4 className="mt-0 font-16">Withdrawal</h4>
                  <h2 className="text-primary my-3 text-center font-22">
                    {"NGN "}
                    <span data-plugin="counterup">
                      {parseInt(
                        (summaryData.withdrawal &&
                          summaryData.withdrawal.total) ||
                          0
                      )
                        .toFixed(0)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </span>
                  </h2>
                  <p className="text-muted mb-0">
                    Total pending:{" "}
                    <span className="float-right">
                      {"NGN " +
                        parseInt(
                          (summaryData.withdrawal &&
                            summaryData.withdrawal.pending) ||
                            0
                        )
                          .toFixed(0)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-xl-3">
                <div className="card-box">
                  <i
                    className="fa fa-info-circle text-muted float-right"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title
                    data-original-title="More Info"
                  />
                  <h4 className="mt-0 font-16">Payment</h4>
                  <h2 className="text-primary my-3 text-center font-22">
                    {"NGN "}
                    <span data-plugin="counterup">
                      {parseInt(
                        (summaryData.payment && summaryData.payment.total) || 0
                      )
                        .toFixed(0)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </span>
                  </h2>
                  <p className="text-muted mb-0">
                    Total pending:{" "}
                    <span className="float-right">
                      {"NGN " +
                        parseInt(
                          (summaryData.payment &&
                            summaryData.payment.pending) ||
                            0
                        )
                          .toFixed(0)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-2">
                      <div className="col-sm-5">
                        <form
                          className="form-inline"
                          onSubmit={(e) => e.preventDefault()}
                        >
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
                              setLoading(false);
                              setRefreshData(!refreshData);
                            }}
                            className="btn btn-success waves-effect waves-light mb-2 mr-1"
                          >
                            <i className="mdi mdi-refresh" />
                          </button>
                          {hasPermission.create(props.permissions) && (
                            <button
                              type="button"
                              className="btn btn-blue hidden waves-effect waves-light mb-2"
                              data-toggle="modal"
                              data-target="#custom-modal"
                              onClick={() => {
                                setFormValue(initialFormState);
                                setDataUpdate(false);
                                toggleShowDrawer(!showDrawer);
                              }}
                            >
                              Add New
                            </button>
                          )}
                        </div>
                      </div>
                      {/* end col*/}
                    </div>
                    <div className="table-responsive">
                      <table className="table table-centered table-nowrap table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Reference</th>
                            <th>Date</th>
                            <th>Mode</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th style={{ width: 82 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading &&
                          transactionData &&
                          transactionData.length >= 1 ? (
                            transactionData.map((driveTest, index) => (
                              <tr key={index}>
                                <td>{driveTest.reference}</td>
                                <td className="font-weight-semibold">
                                  {new Date(
                                    driveTest.createdAt
                                  ).toDateString() +
                                    " " +
                                    new Date(
                                      driveTest.createdAt
                                    ).toLocaleTimeString()}
                                </td>
                                <td>{driveTest.mode}</td>

                                <td>
                                  {driveTest.amount &&
                                    "NGN " +
                                      parseFloat(driveTest.amount)
                                        .toFixed(2)
                                        .replace(
                                          /(\d)(?=(\d{3})+(?!\d))/g,
                                          "$1,"
                                        )}
                                </td>
                                <td>
                                  {driveTest.status == "Approved" ? (
                                    <span className="badge badge-success">
                                      {driveTest.status}
                                    </span>
                                  ) : driveTest.status == "Pending" ? (
                                    <span className="badge badge-warning">
                                      {driveTest.status}
                                    </span>
                                  ) : (
                                    <span className="badge badge-dark">
                                      {driveTest.status}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <a
                                    onClick={() => {
                                      console.log(driveTest);
                                      setFormValue(driveTest);
                                      setDataUpdate(true);
                                      toggleShowDrawer(!showDrawer);
                                    }}
                                    className="action-icon"
                                  >
                                    {" "}
                                    <i className="mdi mdi-square-edit-outline" />
                                  </a>
                                  {hasPermission.delete(props.permissions) && (
                                    <a
                                      className="action-icon"
                                      onClick={() => {
                                        deletetrans(driveTest.driveTestId);
                                      }}
                                    >
                                      {" "}
                                      <i className="mdi mdi-delete" />
                                    </a>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : transactionData &&
                            transactionData.length === 0 &&
                            loading ? (
                            <tr>
                              <td colSpan={7} className="text-center py-5">
                                <h3> There are no Transactions</h3>
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
      <Drawer
        backdrop={showDrawer}
        show={showDrawer}
        size="sm"
        onHide={() => {
          toggleShowDrawer(!showDrawer);
        }}
      >
        <Drawer.Header>
          <Drawer.Title>
            {dataUpdate && (
              <span>
                Update Transaction{" "}
                <small className="font-weight-bolder text-primary ml-2">
                  {formValue.driveTestId}
                </small>
              </span>
            )}
            {!dataUpdate && <span>Add Transaction</span>}
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Form
            fluid
            checkTrigger="change"
            formValue={formValue}
            onSubmit={(data) => {
              console.log(data);
              console.log({ formValue });
              updatetrans(formValue._id);
            }}
            onChange={(data) => {
              console.log({ data });
              setFormValue({ ...data });
              console.log({ formValue });
            }}
          >
            <Grid fluid>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Status</ControlLabel>
                    <FormControl
                      name="status"
                      required={true}
                      accepter={SelectPicker}
                      data={[
                        { label: "Pending", value: "Pending" },
                        { label: "Approved", value: "Approved" },
                      ]}
                      placeholder="Select Status"
                      block
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Reference</ControlLabel>
                    <FormControl name="reference" readOnly />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Amount</ControlLabel>
                    <FormControl
                      name="amount"
                      value={
                        "NGN " +
                        parseFloat(formValue.amount)
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                      }
                      readOnly
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Mode</ControlLabel>
                    <FormControl name="mode" readOnly />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ControlLabel>Comments</ControlLabel>
                    <FormControl
                      rows={3}
                      name="comments"
                      componentClass="textarea"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Date</ControlLabel>
                    <FormControl
                      name="createdAt"
                      value={new Date(formValue.createdAt)}
                      required
                      accepter={DatePicker}
                      format="YYYY-MM-DD HH:mm:ss"
                      oneTap
                      block
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>User</ControlLabel>
                    <FormControl
                      name="createdfor"
                      required
                      readOnly
                      accepter={SelectPicker}
                      data={users}
                      onOpen={handleSelectUser}
                      onSearch={handleSelectUser}
                      renderMenu={(menu) => {
                        if (!users) {
                          return (
                            <p
                              style={{
                                padding: 4,
                                color: "#999",
                                textAlign: "center",
                              }}
                            >
                              <Icon icon="spinner" spin />
                              Loading...
                            </p>
                          );
                        }
                        return menu;
                      }}
                      placeholder="Select User"
                      block
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              {dataUpdate && (
                <>
                  <Row gutter={10}>
                    <Col xs={12}>
                      <FormGroup>
                        <ControlLabel>Created</ControlLabel>
                        <FormControl
                          disabled
                          readOnly
                          value={new Date(formValue.createdAt).toDateString()}
                        />
                      </FormGroup>
                    </Col>
                    <Col xs={12}>
                      <FormGroup>
                        <ControlLabel>Last updated</ControlLabel>
                        <FormControl
                          disabled
                          readOnly
                          value={new Date(formValue.updatedAt).toDateString()}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="mb-3"></div>
                </>
              )}
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ButtonToolbar>
                      {dataUpdate
                        ? hasPermission.update(props.permissions) && (
                            <Button
                              onClick={() => {
                                //updatetrans(formValue.driveTestId);
                              }}
                              appearance="primary"
                              type="submit"
                            >
                              Update
                            </Button>
                          )
                        : hasPermission.create(props.permissions) && (
                            <Button
                              onClick={() => {
                                //adddrivetest();
                              }}
                              appearance="primary"
                              type="submit"
                            >
                              Add New
                            </Button>
                          )}
                    </ButtonToolbar>
                  </FormGroup>
                </Col>
              </Row>
            </Grid>
          </Form>
        </Drawer.Body>
        <Drawer.Footer>
          <Button
            onClick={() => {
              toggleShowDrawer(!showDrawer);
            }}
            appearance="subtle"
          >
            Close
          </Button>
        </Drawer.Footer>
      </Drawer>
    </React.Fragment>
  );
};

export default TransactionListComponent;
