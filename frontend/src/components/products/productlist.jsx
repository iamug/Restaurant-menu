import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar, Drawer, ControlLabel } from "rsuite";
import { Grid, Row, Col, InputGroup, Icon, Input, SelectPicker } from "rsuite";
import { Form, FormGroup, FormControl, HelpBlock, Loader } from "rsuite";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { formatAmount } from "../../controllers/utils";

const ProductListComponent = (props) => {
  let initialFormState = {};
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [productData, setProductData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
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
    const { name, email, phone, isActive, role } = formValue;
    const { isVerified, password, password2 } = formValue;
    if (!name && !email && !phone) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    if (password !== "" && password2 !== "")
      if (password !== password2) {
        new AWN().alert("Passwords do not match", {
          durations: { alert: 4000 },
        });
        return false;
      }
    let body = { name, email, phone };
    isActive && (body.isActive = isActive);
    role && (body.role = role);
    isVerified && (body.isVerified = isVerified);
    password && password !== "" && (body.password = password);
    console.log(body);
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
        new AWN().success("Admin added successfully ", {
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
    const { name, email, phone, isActive, role } = formValue;
    const { isVerified, password, password2 } = formValue;
    if (!name && !email && !phone) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    if (password !== "" && password2 !== "")
      if (password !== password2) {
        new AWN().alert("Passwords do not match", {
          durations: { alert: 4000 },
        });
        return false;
      }
    let body = { name, email, phone };
    isActive !== undefined && (body.isActive = isActive);
    role && (body.role = role);
    isVerified !== undefined && (body.isVerified = isVerified);
    password && password !== "" && (body.password = password);
    console.log(body);
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
        new AWN().success("Admin updated successfully ", {
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

  const fetchproducts = async () => {
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.get("/api/products", config);
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
        console.log(value);
        $("tbody tr").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });
    });
    const products = await fetchproducts();
    if (!products) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    setProductData(products.products);
    console.log(products);
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
                  <h4 className="page-title">Products</h4>
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
                        </div>
                      </div>
                      {/* end col*/}
                    </div>
                    <div className="table-responsive">
                      <table className="table table-centered table-nowrap table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th style={{ width: 82 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData && productData.length >= 1 ? (
                            productData.map((product, index) => (
                              <>
                                <tr key={index}>
                                  <td className="table-user">
                                    <a
                                      href="#"
                                      className="text-primary font-weight-semibold"
                                    >
                                      {product.name}
                                    </a>
                                  </td>
                                  <td>{product.productCategory}</td>
                                  <td>{formatAmount(product.price)}</td>
                                  <td>
                                    {product.isEnabled ? (
                                      <span className="badge badge-success">
                                        Enabled
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
                                        console.log(product);
                                        setFormValue(product);
                                        setDataUpdate(true);
                                        toggleShowDrawer(!showDrawer);
                                      }}
                                      className="action-icon"
                                    >
                                      {" "}
                                      <i className="mdi mdi-square-edit-outline" />
                                    </a>

                                    <a
                                      className="action-icon"
                                      onClick={() => {
                                        deleteadmin(product._id);
                                      }}
                                    >
                                      {" "}
                                      <i className="mdi mdi-delete" />
                                    </a>
                                  </td>
                                </tr>
                              </>
                            ))
                          ) : productData && productData.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center py-5">
                                {" "}
                                <h3> There are no products yet.</h3>
                                {/* <Loader size="lg" content="Loading" /> */}
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
            {dataUpdate && (
              <span>
                Update Product{" "}
                <small className="font-weight-bolder text-primary ml-2">
                  {formValue.adminId}
                </small>
              </span>
            )}
            {!dataUpdate && <span>Add Product</span>}
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
              dataUpdate ? updateadmins(formValue._id) : addadmin();
            }}
            onChange={(data) => {
              console.log({ data });
              console.log({ formValue });
              setFormValue({ ...data });
            }}
          >
            <Grid fluid>
              <Row gutter={10}>
                {formValue.avatar && (
                  <div className="text-center px-3">
                    <img
                      style={{ height: "10rem", width: "10rem" }}
                      className="img-thumbnail  rounded-circle"
                      src={formValue.avatar && formValue.avatar}
                    />
                  </div>
                )}
              </Row>
              <div className="mb-3"></div>
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
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>
                      Email{" "}
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl name="email" required />
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
                    <FormControl name="phone" required />
                  </FormGroup>
                </Col>
                <Col xs={12}></Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Status</ControlLabel>
                    <FormControl
                      name="isActive"
                      accepter={SelectPicker}
                      data={[
                        { label: "Active", value: true },
                        { label: "Disabled", value: false },
                      ]}
                      placeholder="Select Status"
                      block
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Verified</ControlLabel>
                    <FormControl
                      name="isVerified"
                      accepter={SelectPicker}
                      data={[
                        { label: "Verified", value: true },
                        { label: "Not Verified", value: false },
                      ]}
                      placeholder="Select Status"
                      block
                    />
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
                            ["password"]: e.trim(),
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
                            ["password2"]: e.trim(),
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
              <div className="mb-4"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ButtonToolbar>
                      {dataUpdate ? (
                        <Button
                          onClick={() => {
                            //updateadmins(formValue.adminId);
                          }}
                          appearance="primary"
                          type="submit"
                        >
                          Update
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            //addadmin();
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

export default ProductListComponent;
