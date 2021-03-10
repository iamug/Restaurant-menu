import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, ButtonToolbar, Drawer, Placeholder, DatePicker } from "rsuite";
import { Grid, Row, Col, InputGroup, Icon, Input, SelectPicker } from "rsuite";
import { Form, FormGroup, FormControl, Uploader } from "rsuite";
import { ControlLabel, HelpBlock, Loader } from "rsuite";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { hasPermission } from "../../controllers/auth";
import {
  FetchUsersData,
  FetchAdminsData,
  FetchTestCenterData,
} from "../../controllers/fetchdata";

const DriveTestListComponent = (props) => {
  let initialFormState = {
    status: null,
    testCenter: null,
    testCenterAddress: null,
    comments: undefined,
    certificateUrl: undefined,
    user: null,
    testDate: undefined,
  };
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [driveTestData, setDriveTestData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let [loading, setLoading] = useState(false);
  let [users, setUsers] = useState(false);
  let [nonTestUsers, setNonTestUsers] = useState(false);
  let [testCenters, setTestCenters] = useState(false);
  let [testCentersData, setTestCentersData] = useState(false);

  const handleSelectUser = async () => {
    const users = await FetchUsersData();
    let dataArray = [],
      dataUsers = [];
    if (users && users.users)
      users.users.forEach((e) => {
        dataUsers = [...dataUsers, { label: e.email, value: e._id }];
        if (
          !e.userDriveTestId ||
          e.userDriveTestId == undefined ||
          e.userDriveTestId == null ||
          e.userDriveTestId == ""
        )
          dataArray = [...dataArray, { label: e.email, value: e._id }];
      });
    setNonTestUsers(dataArray);
    setUsers(dataUsers);
  };

  const handleSelectTestCenter = async () => {
    const testcentersdata = await FetchTestCenterData();
    let dataArray = [];
    if (testcentersdata) {
      setTestCentersData(testcentersdata);
      testcentersdata.forEach((e) => {
        e.isEnabled &&
          (dataArray = [...dataArray, { label: e.name, value: e.name }]);
      });
    }
    setTestCenters(dataArray);
  };

  const getUserEmail = (id) => {
    if (!id) return null;
    if (!users) return null;
    console.log(users);
    console.log(id);
    // return null;
    let obj = users.find((o) => o.value === id);
    console.log("obj user", { obj });
    return (obj && obj.label) || null;
  };

  const deletedrivetest = async (id) => {
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
        const res = await API.delete("/api/drivetests/" + id, config);
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

  const adddrivetest = async () => {
    const { testCenter, testCenterAddress, comments } = formValue;
    const { certificateUrl, createdfor, testDate } = formValue;
    if (!testCenter && !testCenterAddress && !testDate && !createdfor) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let body = { testCenter, testCenterAddress, testDate, createdfor };
    comments && (body.comments = comments);
    certificateUrl && (body.comments = comments);
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.post("/api/drivetests", body, config);
      if (res.status == 201) {
        new AWN().success("Drive Test added successfully ", {
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

  const updatedrivetest = async (id) => {
    const { status, testCenter, testCenterAddress, comments } = formValue;
    const { certificateUrl, createdfor, testDate } = formValue;
    if (!testCenter && !testCenterAddress && !testDate && !createdfor) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let body = { testCenter, testCenterAddress, testDate, createdfor };
    status && (body.status = status);
    comments && (body.comments = comments);
    certificateUrl && (body.certificateUrl = certificateUrl);
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.put("/api/drivetests/" + id, body, config);
      if (res.status == 200) {
        new AWN().success("Drive Test updated successfully ", {
          durations: { success: 3000 },
        });
        console.log({ driveTest: res.data.driveTest });
        setFormValue(res.data.driveTest);
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

  const fetchdrivetests = async () => {
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.get("/api/drivetests", config);
      if (!res) {
        return false;
      }
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const onUploadCert = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    let token = localStorage.getItem("token");
    new AWN().info("Please wait while picture uploads", {
      durations: { info: 0 },
    });
    try {
      const res = await API.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": token,
        },
      });
      console.log(res);
      if (res.status !== 200) {
        new AWN().alert("Picture Upload Failed, Kindly try again", {
          durations: { alert: 3000 },
        });
        return false;
      }
      if (res.status == 200) {
        let pic = await axios.put(res.data.url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
        if (pic.status !== 200) {
          new AWN().alert("Picture Upload Failed, Kindly try again", {
            durations: { alert: 3000 },
          });
          return false;
        }
        if (pic.status == 200) {
          let filePath =
            "https://commute-partner-s3-bucket.s3.eu-west-2.amazonaws.com/" +
            res.data.key;
          setFormValue({
            ...formValue,
            ["certificateUrl"]: filePath,
          });
          new AWN().closeToasts();
          new AWN().success("Picture upload successful", {
            durations: { success: 4000 },
          });
        }
      }
    } catch (err) {
      if (err) {
        if (err.response.status === 500) {
          console.log("There was a problem with the server");
        } else {
          console.log(err);
        }
      }
    }
  };

  const canceldrivetest = async (id) => {
    const { createdfor } = formValue;
    if (createdfor == undefined) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let body = { createdfor };
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.put("/api/drivetests/cancel/" + id, body, config);
      if (res.status == 200) {
        new AWN().success("Drive Test cancelled successfully ", {
          durations: { success: 3000 },
        });
        console.log(res);
        let data = {
          ...res.data.driveTest,
          driveTestCertId: null,
          certificateUrl: null,
        };
        setFormValue(data);
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
    const drivetests = await fetchdrivetests();
    //console.log(plans);
    if (!drivetests) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    handleSelectTestCenter();
    console.log(drivetests);
    setDriveTestData(drivetests);
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
                  <h4 className="page-title">Drive Test</h4>
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
                            <th>User</th>
                            <th>Test Date</th>
                            <th>Test Center</th>
                            <th>ID</th>
                            <th>Status</th>
                            <th style={{ width: 82 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {driveTestData && driveTestData.length >= 1 ? (
                            driveTestData.map((driveTest, index) => (
                              <tr key={index}>
                                <td>{getUserEmail(driveTest.createdfor)}</td>
                                <td className="font-weight-semibold">
                                  {new Date(driveTest.testDate).toDateString() +
                                    " " +
                                    new Date(
                                      driveTest.testDate
                                    ).toLocaleTimeString()}
                                </td>
                                <td>{driveTest.testCenter.substring(0, 35)}</td>

                                <td>{driveTest.driveTestId}</td>
                                <td>
                                  {driveTest.status == "Passed" ? (
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
                                        deletedrivetest(driveTest.driveTestId);
                                      }}
                                    >
                                      {" "}
                                      <i className="mdi mdi-delete" />
                                    </a>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : driveTestData &&
                            driveTestData.length === 0 &&
                            loading ? (
                            <tr>
                              <td colSpan={7} className="text-center py-5">
                                <h3> There are no Drive Tests</h3>
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
                Update Drive Test{" "}
                <small className="font-weight-bolder text-primary ml-2">
                  {formValue.driveTestId}
                </small>
              </span>
            )}
            {!dataUpdate && <span>Add Drive Test</span>}
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
              dataUpdate
                ? updatedrivetest(formValue.driveTestId)
                : adddrivetest();
            }}
            onChange={(data) => {
              console.log({ data });
              console.log({ testCentersData });
              //setFormValue({ ...data });
              if (data.testCenter && data.testCenter !== null) {
                let obj = testCentersData.find(
                  (o) => o.name === data.testCenter
                );
                console.log("obj", { obj });
                setFormValue({
                  ...data,
                  ["testCenterAddress"]: obj.address,
                });
              } else {
                setFormValue({ ...data });
              }
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
                      readOnly={
                        formValue.driveTestCertId &&
                        formValue.status == "Passed" &&
                        dataUpdate
                      }
                      accepter={SelectPicker}
                      data={[
                        { label: "Pending", value: "Pending" },
                        { label: "Failed", value: "Failed" },
                        { label: "Passed", value: "Passed" },
                      ]}
                      placeholder="Select Status"
                      block
                    />
                  </FormGroup>
                </Col>
                {formValue.status == "Passed" && formValue.driveTestCertId && (
                  <Col xs={12}>
                    <FormGroup>
                      <ControlLabel>Drive Test Cert Id</ControlLabel>
                      <FormControl name="driveTestCertId" readOnly />
                    </FormGroup>
                  </Col>
                )}
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ControlLabel>
                      Test Center
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl
                      name="testCenter"
                      accepter={SelectPicker}
                      data={testCenters}
                      onOpen={handleSelectTestCenter}
                      onSearch={handleSelectTestCenter}
                      renderMenu={(menu) => {
                        if (!handleSelectTestCenter) {
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
                      placeholder="Select Test Center"
                      block
                    />
                  </FormGroup>
                </Col>
              </Row>

              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ControlLabel>Test Center Address</ControlLabel>
                    <FormControl
                      rows={3}
                      name="testCenterAddress"
                      disabled
                      componentClass="textarea"
                    />
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
                    <ControlLabel>Test Date</ControlLabel>
                    <FormControl
                      name="testDate"
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
                    {formValue.driveTestCertId &&
                    formValue.createdfor &&
                    dataUpdate ? (
                      <FormControl
                        name="createdfor"
                        value={getUserEmail(formValue.createdfor)}
                        disabled
                      />
                    ) : (
                      <FormControl
                        name="createdfor"
                        value={formValue.createdfor}
                        required
                        accepter={SelectPicker}
                        data={nonTestUsers}
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
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={22}>
                  <FormGroup>
                    <ControlLabel></ControlLabel>
                    {formValue.certificateUrl ? (
                      <span className="font-16">
                        <a target="_blank" href={formValue.certificateUrl}>
                          {" "}
                          View Drive Test Certificate
                        </a>
                        <i
                          className="fas fa-times ml-3"
                          onClick={() => {
                            setFormValue({
                              ...formValue,
                              ["certificateUrl"]: null,
                            });
                          }}
                        >
                          {" "}
                        </i>
                      </span>
                    ) : (
                      <>
                        <label htmlFor="certificateUrl">
                          <span className="btn btn-dark btn-sm mt-1 ">
                            Upload Drive Test Certificate
                          </span>
                        </label>
                        <input
                          type="file"
                          name="certificateUrl"
                          id="certificateUrl"
                          accept="application/pdf"
                          onChange={(e) => onUploadCert(e)}
                          className="m-t-20 hidden"
                        />
                      </>
                    )}
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
                                //updatedrivetest(formValue.driveTestId);
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
                      {dataUpdate &&
                        formValue.driveTestCertId &&
                        hasPermission.update(props.permissions) && (
                          <Button
                            appearance="ghost"
                            onClick={() => {
                              canceldrivetest(formValue.driveTestId);
                            }}
                          >
                            Cancel Drive Test
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

export default DriveTestListComponent;
