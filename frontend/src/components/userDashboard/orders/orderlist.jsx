import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar, ControlLabel, DatePicker } from "rsuite";
import { Grid, Row, Col, InputGroup, Icon, Input, SelectPicker } from "rsuite";
import { Form, FormGroup, FormControl, HelpBlock, Loader } from "rsuite";
import { DrawerOverlay, DrawerContent } from "@chakra-ui/react";
import { DrawerCloseButton } from "@chakra-ui/react";
import { Drawer, DrawerBody, DrawerHeader } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../../controllers/api";
import { formatAmount } from "../../../controllers/utils";

const ProductListComponent = (props) => {
  let initialFormState = {};
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [loading, setLoading] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [orderData, setOrderData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let notifier = new AWN();
  let token = localStorage.getItem("token");
  let headers = {
    "Content-Type": "application/json",
    "x-auth-token": token,
  };

  const deleterecord = async (id) => {
    if (!id) notifier.alert("Error. Kindly check internet connection.");
    let onOk = async () => {
      try {
        const config = { headers };
        const res = await API.delete("/api/user/orders/" + id, config);
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
        notifier.alert("Error. Kindly check internet connection");
        return false;
      }
    };
    let onCancel = () => {};
    notifier.confirm("Are you sure?", onOk, onCancel);
  };

  //   const addrecord = async () => {
  //     const { name, imageUrl, description, price } = formValue;
  //     const { isEnabled, productCategory } = formValue;
  //     if (!name || !imageUrl || !description || !productCategory) {
  //       new AWN().alert("Kindly fill all fields", {
  //         durations: { alert: 4000 },
  //       });
  //       return false;
  //     }
  //     let body = { name, imageUrl, description, productCategory };
  //     price !== undefined && (body.price = price);
  //     isEnabled && (body.isEnabled = isEnabled);
  //     console.log(body);
  //     try {
  //       const config = { headers };
  //       const res = await API.post("/api/user/products", body, config);
  //       if (res.status == 201) {
  //         console.log("success");
  //         new AWN().success("Record added successfully ", {
  //           durations: { success: 3000 },
  //         });
  //         setRefreshData(!refreshData);
  //       } else {
  //         console.log("failed");
  //         new AWN().alert("Failed, Kindly try again", {
  //           durations: { alert: 3000 },
  //         });
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       new AWN().alert("Failed, Kindly try again", {
  //         durations: { alert: 3000 },
  //       });
  //     }
  //   };

  const updaterecord = async (id) => {
    const { tableName, products, isCompleted } = formValue;
    if (!tableName || !products || !isCompleted) {
      notifier.alert("Kindly fill all fields");
      return false;
    }
    let body = { tableName, products, isCompleted };
    console.log(body);
    try {
      const config = { headers };
      const res = await API.put("/api/user/orders/" + id, body, config);
      if (res.status == 200) {
        notifier.success("Record updated successfully");
        setRefreshData(!refreshData);
      }
    } catch (err) {
      console.log(err);
      notifier.alert("Failed, Kindly try again");
    }
  };

  const fetchrecords = async () => {
    try {
      const config = { headers };
      const res = await API.get("/api/user/orders", config);
      if (!res) return false;
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const handleRemoveFromCart = (item) => {
    const isItemInCart = formValue.products.find((v) => v._id === item._id);
    if (isItemInCart) {
      let newProducts = formValue.products.filter((el) => el._id !== item._id);
      setFormValue({ ...formValue, products: newProducts });
      notifier.success("Removed successfully.");
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
    const data = await fetchrecords();
    if (!data) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    setOrderData(data.orders);
    console.log({ data });
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
                  <h4 className="page-title">Orders</h4>
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

                          {/* <button
                            type="button"
                            className="btn btn-blue waves-effect waves-light mb-2"
                            data-toggle="modal"
                            data-target="#custom-modal"
                            onClick={() => {
                              setFormValue(initialFormState);
                              setDataUpdate(false);
                              toggleShowDrawer(!showDrawer);
                              onOpen();
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
                            <th>Table Name</th>
                            <th>Date</th>
                            <th>Id</th>
                            <th>Status</th>
                            <th style={{ width: 82 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading && orderData && orderData.length >= 1 ? (
                            orderData.map((product, index) => (
                              <>
                                <tr key={index}>
                                  <td className="table-user">
                                    <a className="text-primary font-weight-semibold">
                                      {product.tableName}
                                    </a>
                                  </td>
                                  <td>
                                    {product.date &&
                                      new Date(product.date).toDateString() +
                                        " " +
                                        new Date(
                                          product.date
                                        ).toLocaleTimeString()}
                                  </td>
                                  <td>{product.orderId}</td>
                                  <td>
                                    {product.isCompleted ? (
                                      <span className="badge badge-success">
                                        Completed
                                      </span>
                                    ) : (
                                      <span className="badge badge-warning">
                                        Pending
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
                                        onOpen();
                                      }}
                                      className="action-icon"
                                    >
                                      {" "}
                                      <i className="mdi mdi-square-edit-outline" />
                                    </a>

                                    <a
                                      className="action-icon"
                                      onClick={() => {
                                        deleterecord(product._id);
                                      }}
                                    >
                                      {" "}
                                      <i className="mdi mdi-delete" />
                                    </a>
                                  </td>
                                </tr>
                              </>
                            ))
                          ) : loading && orderData && orderData.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center py-5">
                                {" "}
                                <h3> There are no orders yet.</h3>
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

      <Drawer onClose={onClose} isOpen={isOpen} size="md" placement="right">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton className="mt-1" />
            <DrawerHeader borderBottomWidth="1px">
              {" "}
              {dataUpdate && (
                <span>
                  Update Product{" "}
                  <small className="font-weight-bolder text-primary ml-2">
                    {formValue.orderId}
                  </small>
                </span>
              )}
              {!dataUpdate && <span>Add Product</span>}
            </DrawerHeader>
            <DrawerBody>
              <Form
                fluid
                checkTrigger="change"
                formValue={formValue}
                onSubmit={(data) => {
                  console.log(data);
                  console.log({ formValue });
                  dataUpdate && updaterecord(formValue._id);
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
                          Table Name
                          <HelpBlock tooltip style={{ marginTop: "0px" }}>
                            Required
                          </HelpBlock>
                        </ControlLabel>
                        <FormControl name="tableName" required />
                      </FormGroup>
                    </Col>
                    <Col xs={12}>
                      <FormGroup>
                        <ControlLabel>
                          Date
                          <HelpBlock tooltip style={{ marginTop: "0px" }}>
                            Required
                          </HelpBlock>
                        </ControlLabel>
                        <FormControl
                          name="date"
                          required
                          readOnly
                          accepter={DatePicker}
                          format="YYYY-MM-DD HH:mm:ss"
                          oneTap
                          block
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="mb-3"></div>
                  {formValue &&
                    formValue.products &&
                    formValue.products.length > 0 && (
                      <>
                        <Row gutter={10}>
                          <Col xs={24}>
                            <ul
                              className="mb-3"
                              style={{ listStyleType: "none" }}
                            >
                              {formValue &&
                                formValue.products &&
                                formValue.products.map((item, index) => (
                                  <li className="py-2" key={index}>
                                    <div>
                                      <div className="shadow-sm row g-0 border rounded overflow-hidden flex-md-row">
                                        <div className="col-sm-5 col-5 col-md-5 p-0 ">
                                          <img
                                            src={item.imageUrl}
                                            className="img-fluid"
                                            style={{
                                              height: "120px",
                                              objectFit: "cover",
                                              width: "100%",
                                            }}
                                          />
                                        </div>
                                        <div className="col-sm-6 col-xs-6 col-6 col-md-6 p-2 pr-0">
                                          <h3 className="font-weight-bolder font-16">
                                            {item.name}
                                          </h3>
                                          <h6 className="mt-3">
                                            {item.productCategory &&
                                              item.productCategory.name &&
                                              item.productCategory.name}
                                          </h6>
                                        </div>
                                        <div className="col-1 p-o">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleRemoveFromCart(item)
                                            }
                                            className="btn btn-danger btn-sm waves-effect waves-light mt-2 ml-n4"
                                          >
                                            <i className="mdi mdi-close" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          </Col>
                        </Row>
                        <div className="mb-3"></div>
                      </>
                    )}
                  <Row gutter={10}>
                    <Col xs={12}>
                      <FormGroup>
                        <ControlLabel>Status</ControlLabel>
                        <FormControl
                          name="isCompleted"
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

                  <div className="mb-4"></div>
                  <Row gutter={10}>
                    <Col xs={24}>
                      <FormGroup>
                        <ButtonToolbar>
                          {dataUpdate ? (
                            <button
                              type="submit"
                              className="btn btn-blue waves-effect waves-light mb-2"
                            >
                              Update
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className="btn btn-blue waves-effect waves-light mb-2"
                            >
                              Add New
                            </button>
                          )}
                        </ButtonToolbar>
                      </FormGroup>
                    </Col>
                  </Row>
                </Grid>
              </Form>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </React.Fragment>
  );
};

export default ProductListComponent;
