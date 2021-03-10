import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar, Drawer, ControlLabel } from "rsuite";
import { Grid, Row, Col, InputGroup, Icon, Input } from "rsuite";
import { Form, FormGroup, FormControl, HelpBlock, Loader } from "rsuite";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { hasPermission } from "../../controllers/auth";

const PartnerListComponent = (props) => {
  let initialFormState = {
    name: null,
    email: null,
    phone: null,
    isActive: null,
    isVerified: null,
    password: null,
    password2: null,
    avatar: null,
  };
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [adminData, setAdminData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let [loading, setLoading] = useState(false);
  const [showpassword, setshowpassword] = useState(false);
  const [showpassword2, setshowpassword2] = useState(false);

  const deleteadmin = async (id) => {
    let notifier = new AWN();
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
        const res = await API.delete("/api/admins/" + id, config);
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

  const addadmin = async () => {
    const {
      name,
      email,
      phone,
      isActive,
      isVerified,
      password,
      password2,
      avatar,
    } = formValue;
    if (!name && !email && !phone) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let body = {};
    // let body = { adminName, price, maxCars, adminCategory };
    // adminDescription && (body.adminDescription = adminDescription);
    // adminStatus && (body.adminStatus = adminStatus);
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.post("/api/admins", body, config);
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

  const updateadmins = async (id) => {
    const {
      adminName,
      adminDescription,
      adminStatus,
      adminCategory,
      price,
      maxCars,
    } = formValue;
    if (!adminName && !price && !maxCars && !adminCategory) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let body = { adminName, price, maxCars, adminCategory };
    adminDescription && (body.adminDescription = adminDescription);
    adminStatus && (body.adminStatus = adminStatus);
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.put("/api/admins/" + id, body, config);
      if (res.status == 200) {
        console.log("success");
        new AWN().success("Plan updated successfully ", {
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

  const fetchadmins = async () => {
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.get("/api/partners", config);
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

    const admin = await fetchadmins();
    if (!admin) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    setAdminData(admin.partners);
    console.log(admin.partners);
    setLoading(true);
    console.log("props", { props });
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
                  <h4 className="page-title">Partners</h4>
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
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>ID</th>
                            <th>Status</th>
                            <th style={{ width: 82 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminData && adminData.length >= 1 ? (
                            adminData.map((admin, index) => (
                              <>
                                <tr key={index}>
                                  <td className="table-user">
                                    <a
                                      href="#"
                                      className="text-primary font-weight-semibold"
                                    >
                                      {admin.name}
                                    </a>
                                  </td>
                                  <td>{admin.email}</td>
                                  <td>{admin.phone}</td>

                                  <td>{admin.partnerId}</td>
                                  <td>
                                    {admin.isActive ? (
                                      <span className="badge badge-success">
                                        Active
                                      </span>
                                    ) : (
                                      <span className="badge badge-dark">
                                        Disabled
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <a
                                      onClick={() => {
                                        console.log(admin);
                                        setFormValue(admin);
                                        setDataUpdate(true);
                                        toggleShowDrawer(!showDrawer);
                                      }}
                                      className="action-icon"
                                    >
                                      {" "}
                                      <i className="mdi mdi-square-edit-outline" />
                                    </a>
                                    {hasPermission.delete(props.permission) && (
                                      <a
                                        className="action-icon"
                                        onClick={() => {
                                          deleteadmin(admin.adminId);
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
                          ) : adminData && adminData.length === 0 && loading ? (
                            <tr>
                              <td colSpan={7} className="text-center py-5">
                                {" "}
                                <h3> There are no partners yet.</h3>
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
          <Drawer.Title>
            {dataUpdate ? "Update Partner" : "Add Partner"}
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
              console.log({ formValue });
              setFormValue({ ...data });
            }}
          >
            <Grid fluid>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>
                      Name
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl name="name" />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>
                      Price{" "}
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl name="email" />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>
                      Phone
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl name="phone" />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>
                      {" "}
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl name="adminCategory" />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Password</ControlLabel>
                    <InputGroup inside style={{ width: "auto" }}>
                      <Input
                        name="password"
                        type={showpassword ? "text" : "password"}
                        id="password"
                        onChange={(e) => {
                          setFormValue({
                            ...formValue,
                            ["password"]: e,
                          });
                        }}
                        value={formValue.password}
                      />
                      <InputGroup.Button
                        onClick={() => {
                          setshowpassword(!showpassword);
                        }}
                      >
                        {" "}
                        {showpassword ? (
                          <Icon icon="eye" />
                        ) : (
                          <Icon icon="eye-slash" />
                        )}
                      </InputGroup.Button>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel> Confirm Password</ControlLabel>
                    <InputGroup inside style={{ width: "auto" }}>
                      <Input
                        name="password2"
                        type={showpassword2 ? "text" : "password"}
                        id="password2"
                        onChange={(e) => {
                          setFormValue({
                            ...formValue,
                            ["password2"]: e,
                          });
                        }}
                        value={formValue.password2}
                      />
                      <InputGroup.Button
                        onClick={() => {
                          setshowpassword2(!showpassword2);
                        }}
                      >
                        {" "}
                        {showpassword2 ? (
                          <Icon icon="eye" />
                        ) : (
                          <Icon icon="eye-slash" />
                        )}
                      </InputGroup.Button>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>

              <div className="mb-3"></div>
              {/* <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ControlLabel>Plan Description</ControlLabel>
                    <FormControl
                      rows={5}
                      name="adminDescription"
                      componentClass="textarea"
                    />
                  </FormGroup>
                </Col>
              </Row> */}
              <div className="mb-4"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ButtonToolbar>
                      {dataUpdate
                        ? hasPermission.update(props.permission) && (
                            <Button
                              onClick={() => {
                                updateadmins(formValue.adminId);
                              }}
                              appearance="primary"
                              type="submit"
                            >
                              Update
                            </Button>
                          )
                        : hasPermission.create(props.permission) && (
                            <Button
                              onClick={() => {
                                addadmin();
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

export default PartnerListComponent;
