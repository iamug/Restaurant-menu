import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar, ControlLabel } from "rsuite";
import axios from "axios";
import { Grid, Row, Col, InputGroup, Icon, Input, SelectPicker } from "rsuite";
import { Form, FormGroup, FormControl, HelpBlock, Loader } from "rsuite";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { formatAmount } from "../../controllers/utils";
import { FetchCategoryData } from "../../controllers/fetchdata";

const ProductListComponent = (props) => {
  let initialFormState = {};
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [productData, setProductData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let [categoryData, setCategoryData] = useState(false);
  let token = localStorage.getItem("token");
  let headers = {
    "Content-Type": "application/json",
    "x-auth-token": token,
  };

  const handleSelectCategory = async () => {
    const cat = await FetchCategoryData();
    let dataArray = [];
    if (cat) {
      cat.forEach((e) => {
        e.isEnabled && (dataArray = [...dataArray, e]);
      });
    }
    setCategoryData(dataArray);
  };

  const deleterecord = async (id) => {
    let notifier = new AWN();
    if (!id) {
      notifier.alert("Error. Kindly check internet connection.");
    }
    let onOk = async () => {
      try {
        const config = { headers };
        const res = await API.delete("/api/products/" + id, config);
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

  const addrecord = async () => {
    const { name, imageUrl, description, price } = formValue;
    const { isEnabled, productCategory } = formValue;
    if (!name || !imageUrl || !description || !productCategory) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let body = { name, imageUrl, description, productCategory };
    price !== undefined && (body.price = price);
    isEnabled && (body.isEnabled = isEnabled);
    console.log(body);
    try {
      const config = { headers };
      const res = await API.post("/api/products", body, config);
      if (res.status == 201) {
        console.log("success");
        new AWN().success("Record added successfully ", {
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

  const updaterecord = async (id) => {
    const { name, imageUrl, description, price } = formValue;
    const { isEnabled, productCategory } = formValue;
    if (!name || !imageUrl || !description || !productCategory) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let body = { name, imageUrl, description, productCategory };
    price !== undefined && (body.price = price);
    isEnabled !== undefined && (body.isEnabled = isEnabled);
    console.log(body);
    try {
      const config = { headers };
      const res = await API.put("/api/products/" + id, body, config);
      if (res.status == 200) {
        console.log("success");
        new AWN().success("Record updated successfully ", {
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

  const fetchrecords = async () => {
    try {
      let token = localStorage.getItem("token");
      const config = { headers };
      const res = await API.get("/api/products", config);
      if (!res) return false;
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const onUploadImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
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
            ["imageUrl"]: filePath,
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
    handleSelectCategory();
    const products = await fetchrecords();
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
                                  <td>
                                    {product.productCategory &&
                                      product.productCategory.name}
                                  </td>
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
                    {formValue.adminId}
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
                  dataUpdate ? updaterecord(formValue._id) : addrecord();
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
                          Price{" "}
                          <HelpBlock tooltip style={{ marginTop: "0px" }}>
                            Required
                          </HelpBlock>
                        </ControlLabel>
                        <InputGroup style={{ width: "100%" }}>
                          <InputGroup.Addon>NGN</InputGroup.Addon>
                          <FormControl name="price" required />
                          <InputGroup.Addon>.00</InputGroup.Addon>
                        </InputGroup>
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
                  <Row gutter={10}>
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
                    <Col xs={12}>
                      <FormGroup>
                        <ControlLabel>Category</ControlLabel>
                        <FormControl
                          name="productCategory"
                          accepter={SelectPicker}
                          data={categoryData}
                          labelKey="name"
                          valueKey="_id"
                          onOpen={handleSelectCategory}
                          onSearch={handleSelectCategory}
                          renderMenu={(menu) => {
                            if (!categoryData) {
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
                          placeholder="Select Category"
                          required
                          block
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="mb-3"></div>
                  <Row gutter={10}>
                    <Col xs={24}>
                      <FormGroup>
                        <ControlLabel></ControlLabel>
                        {formValue.imageUrl ? (
                          <span className="font-16">
                            <a target="_blank" href={formValue.imageUrl}>
                              <Image
                                boxSize="200px"
                                objectFit="cover"
                                src={formValue.imageUrl}
                                alt="Product Image"
                                className="mb-1"
                              />
                              View Product Image
                            </a>
                            <i
                              className="fas fa-times ml-3"
                              onClick={() => {
                                setFormValue({
                                  ...formValue,
                                  ["imageUrl"]: null,
                                });
                              }}
                            >
                              {" "}
                            </i>
                          </span>
                        ) : (
                          <>
                            <label htmlFor="imageUrl">
                              <span class="btn btn-dark btn-sm mt-1 ">
                                Upload Product Image
                              </span>
                            </label>
                            <input
                              type="file"
                              name="imageUrl"
                              id="imageUrl"
                              accept="image/*"
                              onChange={(e) => onUploadImage(e)}
                              class="m-t-20 hidden"
                            />
                          </>
                        )}
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
