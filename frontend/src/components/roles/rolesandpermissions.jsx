import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar, Drawer, Placeholder } from "rsuite";
import { Grid, Row, Col, Form, FormGroup, SelectPicker } from "rsuite";
import { FormControl, ControlLabel, HelpBlock, Loader, Toggle } from "rsuite";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { Modules } from "../../controllers/fetchdata";
import { hasPermission } from "../../controllers/auth";

const RolePermissionsComponent = (props) => {
  let initialFormState = {
    isEnabled: undefined,
    name: undefined,
    permissions: undefined,
  };
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [rolesData, setRolesData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let [loading, setLoading] = useState(false);

  const deleterole = async (id) => {
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
        const res = await API.delete("/api/roles/" + id, config);
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

  const addrole = async () => {
    const { isEnabled, name, permissions } = formValue;
    if (!name) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let body = { name };
    isEnabled && (body.isEnabled = isEnabled);
    permissions &&
      typeof permissions === "object" &&
      (body.permissions = permissions);
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.post("/api/roles", body, config);
      if (res.status == 201) {
        new AWN().success("Role added successfully ", {
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

  const updaterole = async (id) => {
    const { isEnabled, name, permissions } = formValue;
    if (!name) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let body = { name };
    isEnabled !== undefined && (body.isEnabled = isEnabled);
    permissions &&
      typeof permissions === "object" &&
      (body.permissions = permissions);
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.put("/api/roles/" + id, body, config);
      if (res.status == 200) {
        new AWN().success("Role updated successfully ", {
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

  const fetchroles = async () => {
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.get("/api/roles", config);
      if (!res) {
        return false;
      }
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const setModulePerm = (module, perm, value = false) => {
    let permissions = {};
    let defaultPerm = {
      read: false,
      create: false,
      update: false,
      delete: false,
    };
    let permObj = {};
    formValue.permissions && formValue.permissions[module]
      ? (permObj = { ...formValue.permissions[module], [perm]: value })
      : (permObj = { ...defaultPerm, [perm]: value });
    let moduleObj = {};
    moduleObj = { [module]: permObj };
    permissions[module] = { ...defaultPerm, [perm]: value };
    setFormValue({
      ...formValue,
      ["permissions"]: { ...formValue.permissions, ...moduleObj },
    });
  };

  useEffect(() => {}, [formValue]);

  useEffect(async () => {
    $(document).ready(function () {
      $("#myInput").on("input", function () {
        var value = $(this).val().toLowerCase();
        $("tbody tr").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });
    });

    const roles = await fetchroles();
    if (!roles) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    console.log(roles);
    setRolesData(roles);
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
                  <h4 className="page-title">Roles</h4>
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
                            <th>Name</th>
                            <th>ID</th>
                            <th>Status</th>
                            <th style={{ width: 82 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rolesData && rolesData.length >= 1 ? (
                            rolesData.map((testcenter, index) => (
                              <tr key={index}>
                                <td className="table-user">
                                  <a className="text-primary font-weight-semibold">
                                    {testcenter.name.substring(0, 35)}
                                  </a>
                                </td>

                                <td>{testcenter.roleId}</td>
                                <td>
                                  {testcenter.isEnabled ? (
                                    <span className="badge badge-success">
                                      Enabled
                                    </span>
                                  ) : (
                                    <span className="badge badge-warning">
                                      Disabled
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <a
                                    onClick={() => {
                                      setFormValue(testcenter);
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
                                        deleterole(testcenter._id);
                                      }}
                                    >
                                      {" "}
                                      <i className="mdi mdi-delete" />
                                    </a>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : rolesData && rolesData.length === 0 && loading ? (
                            <tr>
                              <td colSpan={6} className="text-center py-5">
                                <h3> There are no Roles</h3>
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
        size="lg"
        onHide={() => {
          toggleShowDrawer(!showDrawer);
        }}
      >
        <Drawer.Header>
          <Drawer.Title>
            {dataUpdate && (
              <span>
                Update Role{" "}
                <small className="font-weight-bolder text-primary ml-2">
                  {formValue.roleId}
                </small>
              </span>
            )}
            {!dataUpdate && <span>Add Role</span>}
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Form
            fluid
            checkTrigger="change"
            formValue={formValue}
            onSubmit={(data) => {
              dataUpdate ? updaterole(formValue._id) : addrole();
            }}
            onChange={(data) => {
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
                    <FormControl name="name" required />
                  </FormGroup>
                </Col>
                <Col xs={11}>
                  <FormGroup>
                    <ControlLabel>
                      Enabled
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl
                      name="isEnabled"
                      required
                      accepter={SelectPicker}
                      data={[
                        { label: "Enabled", value: true },
                        { label: "Disabled", value: false },
                      ]}
                      placeholder="Select Status"
                      block
                    />
                  </FormGroup>
                </Col>
              </Row>

              <div className="mb-3"></div>
              {Modules &&
                Modules.map((module, index) => (
                  <div className="mb-2" key={index}>
                    <Row
                      gutter={10}
                      className="pb-2"
                      style={{ borderBottom: "1px solid #ccc" }}
                    >
                      <Col xs={6}>
                        <h5 className="py-2">{module.name}</h5>
                      </Col>
                      <Col xs={18}>
                        <Row gutter={10}>
                          <Col xs={6}>
                            <FormGroup>
                              <ControlLabel>Create</ControlLabel>
                              <Toggle
                                checked={
                                  formValue &&
                                  formValue.permissions &&
                                  formValue.permissions[module.name] &&
                                  formValue.permissions[module.name].create
                                }
                                onChange={(e) => {
                                  setModulePerm(module.name, "create", e);
                                }}
                                size="sm"
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <FormGroup>
                              <ControlLabel>Read</ControlLabel>
                              <Toggle
                                size="sm"
                                checked={
                                  formValue &&
                                  formValue.permissions &&
                                  formValue.permissions[module.name] &&
                                  formValue.permissions[module.name].read
                                }
                                onChange={(e) => {
                                  setModulePerm(module.name, "read", e);
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <FormGroup>
                              <ControlLabel>Update</ControlLabel>
                              <Toggle
                                size="sm"
                                checked={
                                  formValue &&
                                  formValue.permissions &&
                                  formValue.permissions[module.name] &&
                                  formValue.permissions[module.name].update
                                }
                                onChange={(e) => {
                                  setModulePerm(module.name, "update", e);
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <FormGroup>
                              <ControlLabel>Delete</ControlLabel>
                              <Toggle
                                size="sm"
                                checked={
                                  formValue &&
                                  formValue.permissions &&
                                  formValue.permissions[module.name] &&
                                  formValue.permissions[module.name].delete
                                }
                                onChange={(e) => {
                                  setModulePerm(module.name, "delete", e);
                                }}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                ))}

              <div className="mb-4"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ButtonToolbar>
                      {dataUpdate
                        ? hasPermission.update(props.permissions) && (
                            <Button
                              onClick={() => {
                                //updaterole(formValue.testCenterId);
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
                                //addrole();
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

export default RolePermissionsComponent;
