import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar, Drawer } from "rsuite";
import { Grid, Row, Col, ControlLabel, Icon, SelectPicker } from "rsuite";
import { Form, FormGroup, FormControl, HelpBlock, Loader } from "rsuite";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { hasPermission } from "../../controllers/auth";
import { FetchUsersData, FetchVehiclesData } from "../../controllers/fetchdata";

const ItineraryListComponent = (props) => {
  let initialFormState = {};
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [ticketData, setTicketData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let [loading, setLoading] = useState(false);
  let [users, setUsers] = useState(false);
  let [vehicles, setVehicles] = useState(false);
  let [vehiclesData, setVehiclesData] = useState(false);
  let [usersData, setUsersData] = useState(false);

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

  const handleSelectVehicle = async () => {
    const vehicles = await FetchVehiclesData();
    console.log(vehicles);
    let dataArray = [];
    if (vehicles && vehicles.vehicle) {
      setVehiclesData(vehicles.vehicle);
      vehicles.vehicle.forEach((e) => {
        dataArray = [
          ...dataArray,
          { label: `${e.car && e.car.name} || ${e.plateNo}`, value: e._id },
        ];
      });
    }
    setVehicles(dataArray);
  };

  const getUserEmail = (id) => {
    if (!id) return null;
    if (!users) return null;
    let obj = users.find((o) => o.value === id);
    return (obj && obj.label) || null;
  };

  const deleteitinerary = async (id) => {
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
        const res = await API.delete("/api/itineraries/" + id, config);
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

  const updateitinerary = async (id) => {
    const { assignedVehicle } = formValue;
    let body = {};
    assignedVehicle && (body.assignedVehicle = assignedVehicle);
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.put("/api/itineraries/" + id, body, config);
      if (res.status == 200) {
        new AWN().success("Itinerary updated successfully ", {
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

  const fetchitineraries = async () => {
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.get("/api/itineraries", config);
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
    const tickets = await fetchitineraries();
    //console.log(plans);
    if (!tickets) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    handleSelectVehicle();
    handleSelectUser();
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
                  <h4 className="page-title">Itineraries</h4>
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
                            <th>User</th>
                            <th>Plan</th>
                            <th>Pickup Date</th>
                            <th>Option</th>
                            <th>Assigned</th>
                            <th>Status</th>
                            <th style={{ width: 82 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ticketData && ticketData.length >= 1 ? (
                            ticketData.map((ticket, index) => (
                              <tr key={index}>
                                <td className="font-weight-semibold">
                                  {getUserEmail(ticket.createdBy)}
                                </td>
                                <td>{ticket.planName}</td>
                                <td>
                                  {new Date(ticket.pickupDate).toDateString()}
                                </td>

                                <td>
                                  {ticket.itineraryOption === "app-driver" ? (
                                    <span className="badge badge-blue">
                                      {ticket.itineraryOption}
                                    </span>
                                  ) : (
                                    <span className="badge badge-pink">
                                      {ticket.itineraryOption}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {ticket.assignedVehicle ? (
                                    <span className="badge badge-success">
                                      Assigned
                                    </span>
                                  ) : (
                                    <span></span>
                                  )}
                                </td>
                                <td>
                                  {ticket.status === "Completed" ? (
                                    <span className="badge badge-success">
                                      {ticket.status}
                                    </span>
                                  ) : ticket.status === "Requested" ? (
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
                                        deleteitinerary(ticket._id);
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
                                <h3> There are no Itineraries</h3>
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
            {dataUpdate && <span>Update Itinerary</span>}
            {!dataUpdate && <span></span>}
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
              setFormValue({ ...data });
            }}
          >
            <Grid fluid>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <FormControl name="status" readOnly />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <FormControl
                      value={getUserEmail(formValue.createdBy)}
                      readOnly
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ControlLabel>Pickup Location</ControlLabel>
                    <FormControl name="pickupLocationName" readOnly />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ControlLabel>Destination</ControlLabel>
                    <FormControl name="destinationName" readOnly />
                  </FormGroup>
                </Col>
              </Row>

              <div className="mb-3"></div>

              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Pickup Date</ControlLabel>
                    <FormControl
                      disabled
                      readOnly
                      value={new Date(formValue.pickupDate).toDateString()}
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Dropoff Date</ControlLabel>
                    {formValue.dropoffDate && (
                      <FormControl
                        disabled
                        readOnly
                        value={new Date(formValue.dropoffDate).toDateString()}
                      />
                    )}
                  </FormGroup>
                </Col>
              </Row>

              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Itinerary Option</ControlLabel>
                    <FormControl
                      name="itineraryOption"
                      accepter={SelectPicker}
                      data={[
                        { label: "App Driver", value: "app-driver" },
                        { label: "Driver myself", value: "self-driven" },
                      ]}
                      placeholder="Select Itinerary Option"
                      readOnly
                      block
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Plan </ControlLabel>
                    <FormControl name="planName" readOnly />
                  </FormGroup>
                </Col>
              </Row>

              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  {formValue.itineraryOption === "self-driven" && (
                    <FormGroup>
                      <ControlLabel>Assigned Vehicle</ControlLabel>
                      <FormControl
                        name="assignedVehicle"
                        accepter={SelectPicker}
                        data={vehicles}
                        onOpen={handleSelectVehicle}
                        onSearch={handleSelectVehicle}
                        renderMenu={(menu) => {
                          if (!vehicles) {
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
                        placeholder="Select Vehicle"
                        block
                      />
                    </FormGroup>
                  )}
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
                                updateitinerary(formValue._id);
                              }}
                              disabled={
                                formValue.itineraryOption !== "self-driven"
                              }
                              appearance="primary"
                              type="submit"
                            >
                              Update
                            </Button>
                          )
                        : hasPermission.create(props.permissions) && (
                            <Button
                              onClick={() => {}}
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

export default ItineraryListComponent;
