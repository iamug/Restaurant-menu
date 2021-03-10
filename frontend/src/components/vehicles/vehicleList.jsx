import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar, Drawer, Placeholder } from "rsuite";
import { Grid, Row, Col, InputGroup, Icon, Input, Loader } from "rsuite";
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock } from "rsuite";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { hasPermission } from "../../controllers/auth";

const VehicleListComponent = (props) => {
  let initialFormState = {
    plateNo: null,
    carStatus: null,
    vin: null,
  };
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [vehicleData, setVehicleData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let [loading, setLoading] = useState(false);

  const deletevehicle = async (id) => {
    let notifier = new AWN();
    console.log(id);
    if (!id) {
      notifier.alert("Error. Kindly check internet connection.");
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
        const res = await API.delete("/api/plans/" + id, config);
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

  const addVehicle = async () => {
    const {
      planName,
      planDescription,
      planStatus,
      planCategory,
      price,
      maxCars,
    } = formValue;
    if (!planName && !price && !maxCars && !planCategory) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let body = { planName, price, maxCars, planCategory };
    planDescription && (body.planDescription = planDescription);
    planStatus && (body.planStatus = planStatus);
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.post("/api/plans", body, config);
      if (res.status == 201) {
        console.log("success");
        new AWN().success("Plan added successfully ", {
          durations: { success: 3000 },
        });
        setRefreshData(!refreshData);
      } else {
        console.log("failed");
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

  const updatevehicle = async (id) => {
    const { plateNo, vin } = formValue;
    if (!plateNo && !vin) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let body = { plateNo, vin };
    //planDescription && (body.planDescription = planDescription);
    //planStatus && (body.planStatus = planStatus);
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.put("/api/vehicles/" + id, body, config);
      if (res.status == 200) {
        console.log("success");
        new AWN().success("Vehicle updated successfully ", {
          durations: { success: 3000 },
        });
        setRefreshData(!refreshData);
      } else {
        console.log("failed");
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

  const fetchvehicles = async () => {
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.get("/api/vehicles", config);
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
        console.log(value);
        $("tbody tr").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });
    });

    const vehicles = await fetchvehicles();
    console.log(vehicles);
    if (!vehicles) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    console.log(vehicles);
    setVehicleData(vehicles.vehicle);
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
                  <h4 className="page-title">Vehicles</h4>
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
                          {/* <button
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
                          </button> */}
                        </div>
                      </div>
                      {/* end col*/}
                    </div>
                    <div className="table-responsive">
                      <table className="table table-centered table-nowrap table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Plate No</th>
                            <th>VIN</th>
                            <th>ID</th>
                            <th>Booked</th>
                            <th>Status</th>
                            <th style={{ width: 82 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vehicleData && vehicleData.length >= 1 ? (
                            vehicleData.map((plan, index) => (
                              <tr key={index}>
                                <td className="table-user">
                                  <a
                                    href="#"
                                    className="text-primary font-weight-semibold"
                                  >
                                    {plan.car.name}
                                  </a>
                                </td>
                                <td>{plan.plateNo}</td>
                                <td>{plan.vin}</td>

                                <td>{plan.carId}</td>
                                <td>
                                  {plan.isBooked ? (
                                    <span className=" badge badge-success ">
                                      Booked
                                    </span>
                                  ) : (
                                    <span className="badge badge-warning">
                                      Not Booked
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {plan.carStatus == "Disabled" ? (
                                    <span className="badge badge-warning">
                                      {plan.carStatus}
                                    </span>
                                  ) : plan.carStatus == "Active" ? (
                                    <span className="badge badge-success">
                                      {plan.carStatus}
                                    </span>
                                  ) : (
                                    <span className="badge badge-dark">
                                      {plan.carStatus}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <a
                                    onClick={() => {
                                      console.log(plan);
                                      setFormValue(plan);
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
                                        deletevehicle(plan.carId);
                                      }}
                                    >
                                      {" "}
                                      <i className="mdi mdi-delete" />
                                    </a>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : vehicleData &&
                            vehicleData.length === 0 &&
                            loading ? (
                            <tr>
                              <td colSpan={7} className="text-center py-5">
                                <h3> There are no Vehicles</h3>
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <td colSpan={6} className="text-center py-5">
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
          <Drawer.Title>Drawer Title</Drawer.Title>
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
            onChange={(data) => setFormValue({ ...data })}
          >
            <Grid fluid>
              <Row gutter={10}>
                {formValue.carImage && (
                  <div className="text-center px-3">
                    <img
                      style={{ height: "12rem", width: "auto" }}
                      className=" rounded"
                      src={formValue.carImage && formValue.carImage}
                    />
                  </div>
                )}
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>
                      Car Name
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl
                      name="carName"
                      value={formValue.car && formValue.car.name}
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>
                      Model name{" "}
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl
                      name="modelName"
                      value={formValue.car && formValue.car.modelName}
                      disabled="true"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>
                      Model Trim
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl
                      name="modelTrim"
                      value={formValue.car && formValue.car.modelTrim}
                      disabled="true"
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>
                      Model Year{" "}
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl
                      name="modelYear"
                      value={formValue.car && formValue.car.modelYear}
                      disabled="true"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>
                      Plate No
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl name="plateNo" disabled="true" />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>
                      Vehicle Identification No{" "}
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl name="vin" disabled="true" />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <div className="mb-4"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ButtonToolbar>
                      {dataUpdate
                        ? hasPermission.update(props.permissions) && (
                            <Button appearance="primary" type="submit">
                              Update
                            </Button>
                          )
                        : hasPermission.create(props.permissions) && (
                            <Button appearance="primary" type="submit">
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

export default VehicleListComponent;
