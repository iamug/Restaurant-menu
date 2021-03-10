import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar, Drawer } from "rsuite";
import { Grid, Row, Col, ControlLabel, Icon, SelectPicker } from "rsuite";
import { Form, FormGroup, FormControl, HelpBlock, Loader } from "rsuite";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { hasPermission } from "../../controllers/auth";
import {
  FetchUsersData,
  FetchAdminsData,
  FetchDriversData,
} from "../../controllers/fetchdata";

const TicketListComponent = (props) => {
  let initialFormState = {
    issuer: undefined,
    status: undefined,
    subject: undefined,
    description: null,
    ticketCategory: null,
    assignedAdmin: null,
    response: null,
  };
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [summaryData, setSummaryData] = useState({});
  let [ticketData, setTicketData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let [loading, setLoading] = useState(false);
  let [admins, setAdmins] = useState(false);
  let [users, setUsers] = useState(false);
  let [drivers, setDrivers] = useState(false);
  let [usersData, setUsersData] = useState(false);
  let [driversData, setDriversData] = useState(false);

  const handleSelectAdmin = async () => {
    const admins = await FetchAdminsData();
    let dataArray = [];
    if (admins && admins.admins)
      admins.admins.forEach((e) => {
        dataArray = [...dataArray, { label: e.email, value: e.email }];
      });
    setAdmins(dataArray);
  };

  const handleSelectUser = async () => {
    const users = await FetchUsersData();
    let dataArray = [];
    if (users && users.users) {
      setUsersData(users.users);
      users.users.forEach((e) => {
        dataArray = [...dataArray, { label: e.email, value: e._id }];
      });
    }
    setUsers(dataArray);
  };

  const handleSelectDriver = async () => {
    const drivers = await FetchDriversData();
    let dataArray = [];
    if (drivers && drivers.drivers) {
      setDriversData(drivers.drivers);
      drivers.drivers.forEach((e) => {
        dataArray = [...dataArray, { label: e.email, value: e._id }];
      });
    }
    setDrivers(dataArray);
  };

  const deleteticket = async (id) => {
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
        const res = await API.delete("/api/tickets/" + id, config);
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

  const addticket = async () => {
    const { issuer, issuerId, status, subject, description } = formValue;
    const { ticketCategory, assignedAdmin, response, issuerEmail } = formValue;
    if (!issuerId && !subject && !issuerEmail) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 3000 },
      });
      return false;
    }
    let body = { issuerId, subject, issuerEmail };
    issuer && (body.issuer = issuer);
    if (issuer && issuer == "User") {
      let data = usersData.find((o) => o._id === issuerId) || false;
      if (!data || data.email !== issuerEmail) {
        new AWN().alert("Kindly select a User", {
          durations: { alert: 3000 },
        });
        return false;
      }
    }
    if (issuer && issuer == "Driver") {
      let data = driversData.find((o) => o._id === issuerId) || false;
      if (!data || data.email !== issuerEmail) {
        new AWN().alert("Kindly select a Driver", {
          durations: { alert: 3000 },
        });
        return false;
      }
    }
    status && (body.status = status);
    description && (body.description = description);
    ticketCategory && (body.ticketCategory = ticketCategory);
    assignedAdmin && (body.assignedAdmin = assignedAdmin);
    response && (body.response = response);
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.post("/api/tickets", body, config);
      if (res.status == 201) {
        new AWN().success("Ticket added successfully ", {
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

  const updateticket = async (id) => {
    const { issuer, issuerId, status, subject, description } = formValue;
    const { ticketCategory, assignedAdmin, response, issuerEmail } = formValue;
    if (!issuerId && !subject) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 3000 },
      });
      return false;
    }
    let body = { issuerId, subject };
    issuer && (body.issuer = issuer);
    issuerEmail && (body.issuerEmail = issuerEmail);
    status && (body.status = status);
    description && (body.description = description);
    ticketCategory && (body.ticketCategory = ticketCategory);
    assignedAdmin && (body.assignedAdmin = assignedAdmin);
    response && (body.response = response);
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.put("/api/tickets/" + id, body, config);
      if (res.status == 200) {
        new AWN().success("Ticket updated successfully ", {
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

  const fetchtickets = async () => {
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.get("/api/tickets", config);
      if (!res) {
        return false;
      }
      let arrayData = [...res.data];
      let openCount = arrayData.filter((e) => e.status == "Open").length;
      let closedCount = arrayData.filter((e) => e.status == "Closed").length;
      let holdCount = arrayData.filter((e) => e.status == "Hold").length;
      let totalCount = arrayData.length;
      let summary = { openCount, closedCount, holdCount, totalCount };
      setSummaryData(summary);
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
    const tickets = await fetchtickets();
    //console.log(plans);
    if (!tickets) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    handleSelectAdmin();
    handleSelectUser();
    handleSelectDriver();
    console.log(tickets);
    setTicketData(tickets);
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
                  <h4 className="page-title">Tickets</h4>
                </div>
              </div>
            </div>
            {/* end page title */}
            <div className="row">
              <div className="col-sm-6 col-xl-3">
                <div className="widget-rounded-circle card-box">
                  <div className="row">
                    <div className="col-6">
                      <div className="avatar-lg rounded-circle bg-primary">
                        <i className="fe-tag font-22 avatar-title text-white" />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-right">
                        <h3 className="text-dark mt-1">
                          <span data-plugin="counterup">
                            {parseInt(summaryData.totalCount || 0)}
                          </span>
                        </h3>
                        <p className="text-muted mb-1 text-truncate">
                          Total Tickets
                        </p>
                      </div>
                    </div>
                  </div>{" "}
                  {/* end row*/}
                </div>{" "}
                {/* end widget-rounded-circle*/}
              </div>{" "}
              {/* end col*/}
              <div className="col-sm-6 col-xl-3">
                <div className="widget-rounded-circle card-box">
                  <div className="row">
                    <div className="col-6">
                      <div className="avatar-lg rounded-circle bg-warning">
                        <i className="fe-clock font-22 avatar-title text-white" />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-right">
                        <h3 className="text-dark mt-1">
                          <span data-plugin="counterup">
                            {parseInt(summaryData.openCount || 0)}
                          </span>
                        </h3>
                        <p className="text-muted mb-1 text-truncate">
                          Open Tickets
                        </p>
                      </div>
                    </div>
                  </div>{" "}
                  {/* end row*/}
                </div>{" "}
                {/* end widget-rounded-circle*/}
              </div>{" "}
              {/* end col*/}
              <div className="col-sm-6 col-xl-3">
                <div className="widget-rounded-circle card-box">
                  <div className="row">
                    <div className="col-6">
                      <div className="avatar-lg rounded-circle bg-success">
                        <i className="fe-check-circle font-22 avatar-title text-white" />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-right">
                        <h3 className="text-dark mt-1">
                          <span data-plugin="counterup">
                            {parseInt(summaryData.closedCount || 0)}
                          </span>
                        </h3>
                        <p className="text-muted mb-1 text-truncate">
                          Closed Tickets
                        </p>
                      </div>
                    </div>
                  </div>{" "}
                  {/* end row*/}
                </div>{" "}
                {/* end widget-rounded-circle*/}
              </div>{" "}
              {/* end col*/}
              <div className="col-sm-6 col-xl-3">
                <div className="widget-rounded-circle card-box">
                  <div className="row">
                    <div className="col-6">
                      <div className="avatar-lg rounded-circle bg-dark">
                        <i className="fe-pause font-22 avatar-title text-white" />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-right">
                        <h3 className="text-dark mt-1">
                          <span data-plugin="counterup">
                            {parseInt(summaryData.holdCount || 0)}
                          </span>
                        </h3>
                        <p className="text-muted mb-1 text-truncate">
                          Hold Tickets
                        </p>
                      </div>
                    </div>
                  </div>{" "}
                  {/* end row*/}
                </div>{" "}
                {/* end widget-rounded-circle*/}
              </div>{" "}
              {/* end col*/}
            </div>

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
                          {hasPermission.create(props.permissions) && (
                            <button
                              type="button"
                              className="btn btn-blue waves-effect waves-light mb-2"
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
                            <th>Subject</th>
                            <th>Category</th>
                            <th>Issuer</th>
                            <th>Date</th>
                            <th>ID</th>
                            <th>Status</th>
                            <th style={{ width: 82 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ticketData && ticketData.length >= 1 ? (
                            ticketData.map((ticket, index) => (
                              <tr key={index}>
                                <td>{ticket.subject.substring(0, 35)}</td>
                                <td className="font-weight-semibold">
                                  {ticket.ticketCategory}
                                </td>
                                <td>{ticket.issuerEmail}</td>
                                <td>
                                  {new Date(ticket.createdAt).toDateString()}
                                </td>
                                <td>{ticket.ticketId}</td>
                                <td>
                                  {ticket.status === "Closed" ? (
                                    <span className="badge badge-success">
                                      {ticket.status}
                                    </span>
                                  ) : ticket.status === "Open" ? (
                                    <span className="badge badge-warning">
                                      {ticket.status}
                                    </span>
                                  ) : (
                                    <span className="badge badge-dark">
                                      {ticket.status}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <a
                                    onClick={() => {
                                      console.log(ticket);
                                      setFormValue(ticket);
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
                                        deleteticket(ticket._id);
                                      }}
                                    >
                                      {" "}
                                      <i className="mdi mdi-delete" />
                                    </a>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : ticketData &&
                            ticketData.length === 0 &&
                            loading ? (
                            <tr>
                              <td colSpan={7} className="text-center py-5">
                                <h3> There are no Tickets</h3>
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
                Update Ticket{" "}
                <small className="font-weight-bolder text-primary ml-2">
                  {formValue.ticketId}
                </small>
              </span>
            )}
            {!dataUpdate && <span>Add Ticket</span>}
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
            }}
            onChange={(data) => {
              console.log({ data });
              if (data.issuerId) {
                let usersdrivers = [...usersData, ...driversData];
                let obj =
                  usersdrivers.find((o) => o._id === data.issuerId) || null;
                setFormValue({
                  ...data,
                  ["issuerEmail"]: (obj && obj.email) || null,
                });
              } else {
                setFormValue({ ...data });
              }
            }}
          >
            <Grid fluid>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <FormControl
                      name="status"
                      accepter={SelectPicker}
                      data={[
                        { label: "Open", value: "Open" },
                        { label: "Closed", value: "Closed" },
                        { label: "Hold", value: "Hold" },
                      ]}
                      placeholder="Select Status"
                      block
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <FormControl
                      name="ticketCategory"
                      accepter={SelectPicker}
                      data={[
                        {
                          label: "Enquiry",
                          value: "Enquiry",
                        },
                        {
                          label: "Technical",
                          value: "Technical",
                        },
                        { label: "Feedback", value: "Feedback" },
                        { label: "Payment", value: "Payment" },
                      ]}
                      placeholder="Select Ticket Category"
                      block
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ControlLabel>
                      Subject
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl name="subject" />
                  </FormGroup>
                </Col>
              </Row>

              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ControlLabel>Description</ControlLabel>
                    <FormControl
                      rows={5}
                      name="description"
                      componentClass="textarea"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ControlLabel>Response</ControlLabel>
                    <FormControl
                      rows={5}
                      name="response"
                      componentClass="textarea"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Issuer</ControlLabel>
                    <FormControl
                      name="issuer"
                      accepter={SelectPicker}
                      data={[
                        { label: "User", value: "User" },
                        { label: "Driver", value: "Driver" },
                      ]}
                      placeholder="Select Issuer"
                      block
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Issuer</ControlLabel>
                    {formValue.issuer == "User" ? (
                      <FormControl
                        name="issuerId"
                        accepter={SelectPicker}
                        data={users}
                        readOnly={dataUpdate}
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
                    ) : formValue.issuer == "Driver" ? (
                      <FormControl
                        name="issuerId"
                        accepter={SelectPicker}
                        data={drivers}
                        readOnly={dataUpdate}
                        onOpen={handleSelectDriver}
                        onSearch={handleSelectDriver}
                        renderMenu={(menu) => {
                          if (!drivers) {
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
                        placeholder="Select Driver"
                        block
                      />
                    ) : (
                      <span></span>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>IssuerEmail</ControlLabel>
                    <FormControl name="issuerEmail" disabled />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Assigned Admin</ControlLabel>
                    <FormControl
                      name="assignedAdmin"
                      accepter={SelectPicker}
                      data={admins}
                      onOpen={handleSelectAdmin}
                      onSearch={handleSelectAdmin}
                      renderMenu={(menu) => {
                        if (!admins) {
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
                      placeholder="Select Admin"
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
                        <ControlLabel>Issue created</ControlLabel>
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
                        {formValue.updatedAt && (
                          <FormControl
                            disabled
                            readOnly
                            value={new Date(formValue.updatedAt).toDateString()}
                          />
                        )}
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
                                updateticket(formValue._id);
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
                                addticket();
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

export default TicketListComponent;
