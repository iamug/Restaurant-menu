import React, { useEffect, useState, useContext } from "react";
import { Button, ButtonToolbar, ControlLabel } from "rsuite";
import { Grid, Row, Col, InputGroup, Icon, Input, SelectPicker } from "rsuite";
import { Form, FormGroup, FormControl, HelpBlock, Loader } from "rsuite";
import { DrawerOverlay, DrawerContent } from "@chakra-ui/react";
import { DrawerCloseButton } from "@chakra-ui/react";
import { Drawer, DrawerBody, DrawerHeader } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import $ from "jquery";
import DataContext, { DataConsumer } from "../../../context/datacontext";
import AWN from "awesome-notifications";
import API from "../../../controllers/api";
//var QRCode = require('qrcode.react');
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import html2PDF from "jspdf-html2canvas";
import { FetchTableCategoryData } from "../../../controllers/fetchdata";

const ProductListComponent = (props) => {
  let initialFormState = {};
  const { userdata } = useContext(DataContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [loading, setLoading] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [orderData, setOrderData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let [tableCategoryData, setTableCategoryData] = useState(false);
  let notifier = new AWN();
  let token = localStorage.getItem("token");
  let headers = {
    "Content-Type": "application/json",
    "x-auth-token": token,
  };

  const handleSelectTableCategory = async () => {
    const cat = await FetchTableCategoryData();
    let dataArray = [];
    if (cat.category) {
      cat.category.forEach((e) => {
        e.isEnabled && (dataArray = [...dataArray, e]);
      });
    }
    setTableCategoryData(dataArray);
  };

  const deleterecord = async (id) => {
    if (!id) notifier.alert("Error. Kindly check internet connection.");
    let onOk = async () => {
      try {
        const config = { headers };
        const res = await API.delete("/api/user/tables/" + id, config);
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
    const { tableName, isEnabled, tableCategory } = formValue;
    const { slug } = userdata;
    if (!tableName) {
      notifier.alert("Kindly fill all fields");
      return false;
    }
    let body = { tableName, slug };
    isEnabled && (body.isEnabled = isEnabled);
    tableCategory && (body.tableCategory = tableCategory);
    try {
      const config = { headers };
      const res = await API.post("/api/user/tables", body, config);
      if (res.status == 201) {
        notifier.success("Record added successfully ");
        setRefreshData(!refreshData);
      } else {
        notifier.alert("Failed, Kindly try again");
      }
    } catch (err) {
      console.log(err);
      notifier.alert("Failed, Kindly try again");
    }
  };

  const updaterecord = async (id) => {
    const { tableName, isEnabled, tableCategory } = formValue;
    if (!tableName) {
      notifier.alert("Kindly fill all fields");
      return false;
    }
    let body = { tableName };
    isEnabled && (body.isEnabled = isEnabled);
    tableCategory && (body.tableCategory = tableCategory);
    try {
      const config = { headers };
      const res = await API.put("/api/user/tables/" + id, body, config);
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
      const res = await API.get("/api/user/tables", config);
      if (!res) return false;
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const downloadQRCode = (type) => {
    if (type === "jpeg") {
      html2canvas(document.querySelector("#capture")).then((canvas) => {
        document.body.appendChild(canvas);
        canvas.toBlob(
          (blob) => {
            const anchor = document.createElement("a");
            anchor.download = "Table-" + formValue.tableName + "" + ".jpg"; // optional, but you can give the file a name
            anchor.href = URL.createObjectURL(blob);
            anchor.click(); // ✨ magic!
            URL.revokeObjectURL(anchor.href); // remove it from memory and save on memory! 😎
          },
          "image/jpeg",
          0.9
        );
      });
    }
    if (type === "pdf") {
      let page = document.getElementById("capture");
      html2PDF(page, {
        jsPDF: {
          format: "a4",
        },
        imageType: "image/jpeg",
        output: "Table-" + formValue.tableName + "" + ".pdf",
      });
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
    handleSelectTableCategory();
    const data = await fetchrecords();
    if (!data) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    setOrderData(data.tables);
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
                  <h4 className="page-title">Tables</h4>
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
                            <th>Table Name</th>
                            <th>Category</th>
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
                                    {product.tableCategory &&
                                      product.tableCategory.name}
                                  </td>
                                  <td>{product.tableId}</td>
                                  <td>
                                    {product.isEnabled ? (
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
                                <h3> There are no tables yet.</h3>
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

      <Drawer onClose={onClose} isOpen={isOpen} size="lg" placement="right">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton className="mt-1" />
            <DrawerHeader borderBottomWidth="1px">
              {" "}
              {dataUpdate && (
                <span>
                  Update Table{" "}
                  <small className="font-weight-bolder text-primary ml-2">
                    {formValue.tableId}
                  </small>
                </span>
              )}
              {!dataUpdate && <span>Add Table</span>}
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
                  <Row gutter={10}>
                    <Col xs={12}>
                      <FormGroup>
                        <ControlLabel>Table Category</ControlLabel>
                        <FormControl
                          name="tableCategory"
                          accepter={SelectPicker}
                          data={tableCategoryData}
                          labelKey="name"
                          valueKey="_id"
                          onOpen={handleSelectTableCategory}
                          onSearch={handleSelectTableCategory}
                          renderMenu={(menu) => {
                            if (!tableCategoryData) {
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
                          placeholder="Select Table Category"
                          required
                          block
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="mb-5"></div>
                  {formValue.tableName && (
                    <>
                      <div className="mb-3"></div>
                      <Row gutter={10} className="d-flex">
                        <Col xs={12} id="capture">
                          <QRCode
                            value={
                              window.location.origin +
                              "/menu/" +
                              userdata.slug +
                              "/" +
                              formValue.tableName
                            }
                            size={256}
                          />
                        </Col>
                        <Col xs={12} className="d-flex align-items-center">
                          <div>
                            <button
                              type="button"
                              className="btn  btn-sm btn-success mb-4"
                              onClick={() => downloadQRCode("jpeg")}
                            >
                              Download QRCode as Jpeg
                            </button>
                            <button
                              type="button"
                              className="btn  btn-sm btn-success"
                              onClick={() => downloadQRCode("pdf")}
                            >
                              Download QRCode as PDF
                            </button>
                          </div>
                        </Col>
                      </Row>
                      <div className="mb-3"></div>
                      <Row>
                        <Col>
                          {formValue.tableName && userdata && userdata.slug && (
                            <span className="form-text font-18 text-muted">
                              <small className="">
                                <a
                                  href={
                                    window.location.origin +
                                    "/menu/" +
                                    userdata.slug +
                                    "/" +
                                    formValue.tableName
                                  }
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  {" "}
                                  {window.location.origin +
                                    "/menu/" +
                                    userdata.slug +
                                    "/" +
                                    formValue.tableName}
                                </a>
                              </small>
                            </span>
                          )}
                        </Col>
                      </Row>
                    </>
                  )}
                  <div className="mb-3"></div>

                  <div className="mb-5"></div>
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
