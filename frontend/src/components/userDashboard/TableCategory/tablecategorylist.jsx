import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar, ControlLabel } from "rsuite";
import { Grid, Row, Col, InputGroup, Icon, Input, SelectPicker } from "rsuite";
import { Form, FormGroup, FormControl, HelpBlock, Loader } from "rsuite";
import { Drawer, DrawerBody, DrawerCloseButton } from "@chakra-ui/react";
import { DrawerOverlay, DrawerContent, DrawerHeader } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../../controllers/api";

const CategoryListComponent = (props) => {
  let initialFormState = {};
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [loading, setLoading] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [productData, setProductData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let token = localStorage.getItem("token");
  let headers = {
    "Content-Type": "application/json",
    "x-auth-token": token,
  };
  let notifier = new AWN();

  const deleterecord = async (id) => {
    if (!id) notifier.alert("Error. Kindly check internet connection.");
    let onOk = async () => {
      try {
        const config = { headers };
        const res = await API.delete("/api/user/tablecategory/" + id, config);
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

  const addrecord = async () => {
    const { name, description, isEnabled } = formValue;
    if (!name || !description) {
      notifier.alert("Kindly fill all fields");
      return false;
    }
    let body = { name, description };
    isEnabled !== undefined && (body.isEnabled = isEnabled);
    try {
      const config = { headers };
      const res = await API.post("/api/user/tablecategory", body, config);
      if (res.status == 201) {
        notifier.success("Category added successfully");
        setRefreshData(!refreshData);
      } else {
        notifier.alert("Failed, Kindly try again");
      }
    } catch (err) {
      notifier.alert("Failed, Kindly try again");
    }
  };

  const updaterecord = async (id) => {
    const { name, description, isEnabled } = formValue;
    if (!name || !description) {
      notifier.alert("Kindly fill all fields");
      return false;
    }
    let body = { name, description };
    isEnabled !== undefined && (body.isEnabled = isEnabled);
    try {
      const config = { headers };
      const res = await API.put("/api/user/tablecategory/" + id, body, config);
      if (res.status == 200) {
        notifier.success("Update successful");
        setRefreshData(!refreshData);
      } else {
        notifier.alert("Failed, Kindly try again");
      }
    } catch (err) {
      notifier.alert("Failed, Kindly try again");
    }
  };

  const fetchdata = async () => {
    try {
      const config = { headers };
      const res = await API.get("/api/user/tablecategory", config);
      if (!res) return false;
      return res.data;
    } catch (err) {
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
    const products = await fetchdata();
    if (!products) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    setProductData(products.category);
    console.log(products);
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
                  <h4 className="page-title">Table Categories</h4>
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
                              onOpen();
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
                            <th>Status</th>
                            <th style={{ width: 82 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading && productData && productData.length >= 1 ? (
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
                                  <td>
                                    {product.description &&
                                      product.description.substring(0, 10)}
                                  </td>
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
                          ) : loading &&
                            productData &&
                            productData.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center py-5">
                                {" "}
                                <h3> There are no categories.</h3>
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
                  Update Category{" "}
                  <small className="font-weight-bolder text-primary ml-2">
                    {formValue.adminId}
                  </small>
                </span>
              )}
              {!dataUpdate && <span>Add Category</span>}
            </DrawerHeader>
            <DrawerBody>
              <Form
                fluid
                checkTrigger="change"
                formValue={formValue}
                onSubmit={(data) => {
                  dataUpdate ? updaterecord(formValue._id) : addrecord();
                }}
                onChange={(data) => {
                  setFormValue({ ...data });
                }}
              >
                <Grid fluid>
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
                        <ControlLabel>Status</ControlLabel>
                        <FormControl
                          name="isEnabled"
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
                  <Row gutter={10}>
                    <Col xs={24}>
                      <FormGroup>
                        <ControlLabel>
                          Description
                          <HelpBlock tooltip style={{ marginTop: "0px" }}>
                            Required
                          </HelpBlock>
                        </ControlLabel>
                        <FormControl
                          rows={4}
                          name="description"
                          required
                          componentClass="textarea"
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

export default CategoryListComponent;
