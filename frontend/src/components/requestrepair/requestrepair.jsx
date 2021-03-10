import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar, Drawer, Form, Loader } from "rsuite";
import { Grid, Row, Col, InputGroup, Icon, Input, SelectPicker } from "rsuite";
import { FormGroup, FormControl, ControlLabel, HelpBlock } from "rsuite";
import $ from "jquery";
import Map from "../map";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { hasPermission } from "../../controllers/auth";
import { FetchUsersData, FetchAdminsData } from "../../controllers/fetchdata";

const RequestRepairComponent = (props) => {
  let initialFormState = {
    issuer: undefined,
    status: undefined,
    carDescription: undefined,
    isssueNoticed: null,
    locationName: null,
    assignedAdmin: null,
    response: null,
  };
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [summaryData, setSummaryData] = useState({});
  let [requestData, setRequestData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let [loading, setLoading] = useState(false);
  let [admins, setAdmins] = useState(false);
  let [users, setUsers] = useState(false);
  let [usersData, setUsersData] = useState(false);

  // const handleSelectAdmin = async () => {
  //   const admins = await FetchAdminsData();
  //   let dataArray = [];
  //   if (admins && admins.admins)
  //     admins.admins.forEach((e) => {
  //       dataArray = [...dataArray, { label: e.email, value: e.email }];
  //     });
  //   setAdmins(dataArray);
  // };

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

  const deleterequest = async (id) => {
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
        const res = await API.delete("/api/requestmechanic/" + id, config);
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

  const updateticket = async (id) => {
    const { isssueNoticed, status, response, carDescription } = formValue;
    if (!response) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let body = { response };
    status && (body.status = status);
    //response && (body.response = response);
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.put("/api/requestmechanic/" + id, body, config);
      if (res.status == 200) {
        new AWN().success("Request updated successfully ", {
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

  const fetchrequests = async () => {
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.get("/api/requestmechanic", config);
      if (!res) return false;
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
    const requests = await fetchrequests();
    //console.log(plans);
    if (!requests) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    handleSelectUser();
    console.log(requests);
    setRequestData(requests);
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
                  <h4 className="page-title">Request Repair</h4>
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
                            <th>Car Description</th>
                            <th>Issue Noticed</th>
                            <th>Issuer</th>
                            <th>Date</th>
                            <th>ID</th>
                            <th>Status</th>
                            <th style={{ width: 82 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requestData && requestData.length >= 1 ? (
                            requestData.map((request, index) => (
                              <>
                                <tr key={index}>
                                  <td>
                                    {request.carDescription &&
                                      request.carDescription.substring(0, 35)}
                                  </td>
                                  <td>
                                    {request.issueNoticed &&
                                      request.issueNoticed.substring(0, 35)}
                                  </td>
                                  <td className="font-weight-semibold">
                                    {request.issuerEmail}
                                  </td>
                                  <td>
                                    {new Date(request.createdAt).toDateString()}
                                  </td>
                                  <td>{request.requestId}</td>
                                  <td>
                                    {request.status == "Completed" ? (
                                      <span className="badge badge-success">
                                        {request.status}
                                      </span>
                                    ) : request.status == "Pending" ? (
                                      <span className="badge badge-warning">
                                        {request.status}
                                      </span>
                                    ) : (
                                      <span className="badge badge-dark">
                                        {request.status}
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <a
                                      onClick={() => {
                                        setFormValue(request);
                                        setDataUpdate(true);
                                        toggleShowDrawer(!showDrawer);
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
                                          deleterequest(request._id);
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
                          ) : requestData &&
                            requestData.length === 0 &&
                            loading ? (
                            <tr>
                              <td colSpan={7} className="text-center py-5">
                                <h3> There are no Requests</h3>
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
        full
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
                Update Request{" "}
                <small className="font-weight-bolder text-primary ml-2">
                  {formValue.ticketId}
                </small>
              </span>
            )}
            {!dataUpdate && <span>Add Request</span>}
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
                console.log({ usersData });
                let obj =
                  usersData.find((o) => o._id === data.issuerId) || null;
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
                  <Grid fluid>
                    <Row gutter={10}>
                      <Col xs={12}>
                        <FormGroup>
                          <FormControl
                            name="status"
                            accepter={SelectPicker}
                            data={[
                              { label: "Pending", value: "Pending" },
                              { label: "Completed", value: "Completed" },
                              { label: "Ongoing", value: "Ongoing" },
                            ]}
                            placeholder="Select Status"
                            block
                          />
                        </FormGroup>
                      </Col>
                      <Col xs={12}>
                        <FormGroup></FormGroup>
                      </Col>
                    </Row>
                    <div className="mb-3"></div>
                    <Row gutter={10}>
                      <Col xs={24}>
                        <FormGroup>
                          <ControlLabel>Car Description</ControlLabel>
                          <FormControl name="carDescription" readOnly />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="mb-3"></div>
                    <Row gutter={10}>
                      <Col xs={24}>
                        <FormGroup>
                          <ControlLabel>Location</ControlLabel>
                          <FormControl name="locationName" readOnly />
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="mb-3"></div>
                    <Row gutter={10}>
                      <Col xs={24}>
                        <FormGroup>
                          <ControlLabel>Issue Noticed</ControlLabel>
                          <FormControl
                            rows={4}
                            name="issueNoticed"
                            componentClass="textarea"
                            readOnly
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
                            rows={4}
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
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row gutter={10} className="hidden">
                      <Col xs={12}>
                        <FormGroup>
                          <ControlLabel>IssuerEmail</ControlLabel>
                          <FormControl name="issuerEmail" disabled />
                        </FormGroup>
                      </Col>
                      <Col xs={12}>
                        <FormGroup></FormGroup>
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
                                value={new Date(
                                  formValue.createdAt
                                ).toDateString()}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={12}>
                            <FormGroup>
                              <ControlLabel>Last updated</ControlLabel>
                              <FormControl
                                disabled
                                readOnly
                                value={new Date(
                                  formValue.updatedAt
                                ).toDateString()}
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
                                      //addticket();
                                    }}
                                    appearance="primary"
                                    type="submit"
                                  >
                                    Add New
                                  </Button>
                                )}

                            <Button
                              appearance="default"
                              onClick={() => {
                                toggleShowDrawer(!showDrawer);
                              }}
                            >
                              Close
                            </Button>
                          </ButtonToolbar>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Grid>
                </Col>
                <Col xs={12}>
                  {formValue.imgUrl && (
                    <div
                      style={{ maxHeight: "50vh" }}
                      className="text-center px-3"
                    >
                      <img
                        className="img-fluid rounded"
                        style={{ maxHeight: "40vh" }}
                        src={formValue.imgUrl && formValue.imgUrl}
                      />
                      <br />
                      <br />
                    </div>
                  )}
                  {formValue.location &&
                    formValue.location.coordinates &&
                    formValue.location.coordinates[0] &&
                    formValue.location.coordinates[1] && (
                      <Map location={formValue.location} />
                    )}
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

export default RequestRepairComponent;
