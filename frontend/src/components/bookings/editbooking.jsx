import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Button, ButtonToolbar, Drawer, ControlLabel, Loader } from "rsuite";
import { Grid, Row, Col, InputGroup, Icon, Input, SelectPicker } from "rsuite";
import { Form, FormGroup, FormControl, HelpBlock, DatePicker } from "rsuite";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { hasPermission } from "../../controllers/auth";
import {
  FetchUsersData,
  FetchPlansData,
  FetchVehiclesData,
} from "../../controllers/fetchdata";

const EditBookingComponent = (props) => {
  const history = useHistory();
  let initialFormState = {
    isEnabled: undefined,
    title: null,
    description: null,
  };
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [bookingData, setBookingData] = useState(false);
  let [bookingFormData, setBookingFormData] = useState(false);
  let [itinerariesData, setItinerariesData] = useState(false);
  let [faqData, setFaqData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let [loading, setLoading] = useState(false);
  let [users, setUsers] = useState(false);
  let [plans, setPlans] = useState(false);
  let [vehicles, setVehicles] = useState(false);

  const handleSelectUser = async () => {
    const users = await FetchUsersData();
    let dataArray = [];
    if (users && users.users)
      users.users.forEach((e) => {
        if (
          !e.userDriveTestId ||
          e.userDriveTestId == undefined ||
          e.userDriveTestId == null ||
          e.userDriveTestId == ""
        )
          dataArray = [...dataArray, { label: e.email, value: e._id }];
      });
    setUsers(dataArray);
  };

  const handleSelectPlan = async () => {
    const plans = await FetchPlansData();
    let dataArray = [];
    if (plans && plans.plan)
      plans.plan.forEach((e) => {
        dataArray = [...dataArray, { label: e.planName, value: e.planId }];
      });
    setPlans(dataArray);
  };

  const handleSelectVehicle = async () => {
    const vehicles = await FetchVehiclesData();
    let dataArray = [];
    if (vehicles && vehicles.vehicle)
      vehicles.vehicle.forEach((e) => {
        dataArray = [...dataArray, { label: e.car.name, value: e.carId }];
      });
    setVehicles(dataArray);
  };

  const onChange = (e) => {
    setBookingFormData({ ...bookingFormData, [e.target.name]: e.target.value });
  };

  const deletebooking = async (id) => {
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
        const res = await API.delete("/api/bookings/" + id, config);
        if (!res) {
          notifier.alert("Error. Kindly check internet connection");
          return false;
        }
        if (res.status == 200) {
          notifier.success("Record deleted.");
          //setRefreshData(!refreshData);
          history.push({ pathname: "/bookings" });
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

  const updatebooking = async (id) => {
    const { quotationAmount } = bookingFormData;
    if (!quotationAmount && quotationAmount === undefined) {
      new AWN().alert("Kindly Enter valid quotation amount", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let quotation = { amount: quotationAmount };
    let body = { quotation };
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.put("/api/bookings/" + id, body, config);
      if (res.status == 200) {
        new AWN().success("Booking updated successfully ", {
          durations: { success: 3000 },
        });
        if (res && res.data && res.data.booking) {
          console.log("booking update", res.data.booking);
          setBookingData(res.data.booking);
        }
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

  const fetchbookings = async () => {
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.get("/api/bookingss", config);
      if (!res) {
        return false;
      }
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const getItineraryData = async (id) => {
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.get("/api/itineraries/" + id, config);
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
      $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("tbody tr").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });
    });
    if (history && history.location && history.location.state) {
      console.log(" values", history.location.state);
      setBookingData(history.location.state.detail);
      let itinerary,
        data = [],
        booking = history.location.state.detail;
      if (booking && booking.itineraries && booking.itineraries.length > 0) {
        booking.itineraries.forEach(async (e) => {
          console.log("itinerary id ", e);
          getItineraryData(e).then((v) => {
            console.log("v", v);
            console.log("itinerary", v);
            data = [...data, v];
            console.log("data", { data });
            setItinerariesData(data);
          });
        });
      }
    } else {
      console.log(" no values", history);
      history.push({ pathname: "/bookings" });
      return false;
    }
    handleSelectUser();
    handleSelectVehicle();
    handleSelectPlan();
    setLoading(true);
  }, [refreshData]);

  return (
    <React.Fragment>
      <div>
        <div className="content">
          {/* Start Content*/}
          <div className="container-fluid">
            {/* start page title */}
            <div className="row" style={{ borderBottom: "2px solid #7e57c2" }}>
              <div className="col-2 pull-left">
                <div className="page-title-box">
                  <h4 className="page-title">
                    {" "}
                    <button
                      type="button"
                      onClick={() => {
                        history.push({ pathname: "/bookings" });
                      }}
                      className="btn btn-primary waves-effect waves-light mb-2 mr-1"
                    >
                      <i className="fas fa-angle-left mr-2" />
                      Back to List
                    </button>
                  </h4>
                </div>
              </div>
              <div className="col-8">
                <div className="page-title-box">
                  <h4 className="page-title">Edit Booking</h4>
                </div>
              </div>
              <div className="col-2 pull-right ">
                <div className="page-title-box">
                  <h4 className="page-title"></h4>
                </div>
              </div>
              <div className="clearfix"></div>
              <hr />
            </div>
            {/* end page title */}
            <div className="row mt-3">
              <div className="col-6">
                <div className="form-group col-sm-12 row">
                  <label className="col-sm-4 col-form-label mb-0 text-right">
                    ID
                  </label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      disabled
                      className="form-control"
                      placeholder="Booking ID"
                      value={(bookingData && bookingData.bookingId) || null}
                    />
                  </div>
                </div>
                <div className="form-group col-sm-12 row">
                  <label className="col-sm-4 col-form-label mb-0 text-right">
                    Date
                  </label>
                  <div className="col-sm-7">
                    <DatePicker
                      name="bookingDate"
                      readOnly
                      value={(bookingData && bookingData.createdAt) || null}
                      oneTap
                      block
                    />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group col-sm-12 row">
                  <label className="col-sm-4 col-form-label mb-0 text-right">
                    User
                  </label>
                  <div className="col-sm-7">
                    <SelectPicker
                      name="user"
                      data={users}
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
                      value={(bookingData && bookingData.userId) || null}
                      placeholder="Select User"
                      readOnly
                      block
                    />
                  </div>
                </div>
                <div className="form-group col-sm-12 row">
                  <label className="col-sm-4 col-form-label mb-0 text-right">
                    Plan Package
                  </label>
                  <div className="col-sm-7">
                    <SelectPicker
                      name="planId"
                      data={plans}
                      onOpen={handleSelectPlan}
                      onSearch={handleSelectPlan}
                      renderMenu={(menu) => {
                        if (!plans) {
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
                      value={
                        (itinerariesData && itinerariesData[0].planId) || null
                      }
                      placeholder="Select Plan"
                      readOnly
                      block
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div
                className="col-12"
                style={{ borderBottom: "2px solid #7e57c2" }}
              >
                <h4 class="mt-2 mb-2">Cars</h4>
              </div>
              <div className="row col-12 mt-3">
                <div className="col-4">
                  <div class="widget-bg-color-icon card-box">
                    <label for="" class="control-label m-b-10">
                      Car 1
                    </label>
                    <div class="">
                      <SelectPicker
                        name="vehicle1"
                        value={
                          itinerariesData &&
                          itinerariesData.length > 0 &&
                          itinerariesData[0].vehicles &&
                          itinerariesData[0].vehicles[0]
                        }
                        readOnly
                        data={vehicles}
                        onOpen={handleSelectVehicle}
                        onSearch={handleSelectVehicle}
                        renderMenu={(menu) => {
                          if (!vehicles) {
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
                        placeholder="Select First Vehicle"
                        block
                      />
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div class="widget-bg-color-icon card-box">
                    <label for="" class="control-label m-b-10">
                      Car 2
                    </label>
                    <div class="">
                      <SelectPicker
                        name="vehicle2"
                        value={
                          itinerariesData &&
                          itinerariesData.length > 0 &&
                          itinerariesData[0].vehicles &&
                          itinerariesData[0].vehicles[1]
                        }
                        readOnly
                        data={vehicles}
                        onOpen={handleSelectVehicle}
                        onSearch={handleSelectVehicle}
                        renderMenu={(menu) => {
                          if (!vehicles) {
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
                        placeholder="Select Second Vehicle"
                        block
                      />
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div class="widget-bg-color-icon card-box">
                    <label for="" class="control-label m-b-10">
                      Car 3
                    </label>
                    <div class="">
                      <SelectPicker
                        name="vehicle3"
                        value={
                          itinerariesData &&
                          itinerariesData.length > 0 &&
                          itinerariesData[0].vehicles &&
                          itinerariesData[0].vehicles[2]
                        }
                        readOnly
                        data={vehicles}
                        onOpen={handleSelectVehicle}
                        onSearch={handleSelectVehicle}
                        renderMenu={(menu) => {
                          if (!vehicles) {
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
                        placeholder="Select Third Vehicle"
                        block
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div
                className="col-12"
                style={{ borderBottom: "2px solid #7e57c2" }}
              >
                <h4 class="mt-2 mb-2">Itineraries</h4>
              </div>
              <div className="col-lg-12 mt-3">
                <div className="">
                  <div className="">
                    <div className="row mb-2">
                      <div className="col-sm-5"></div>
                      <div className="col-sm-7">
                        <div className="text-sm-right">
                          <button
                            type="button"
                            className=" hidden btn btn-blue btn-sm waves-effect waves-light mb-2"
                          >
                            <i className="fas fa-plus" />
                            Add Itinerary
                          </button>
                        </div>
                      </div>
                      {/* end col*/}
                    </div>
                    <div className="table-responsive">
                      <table className="table table-centered table-nowrap table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Pickup Location</th>
                            <th>Desstination</th>
                            <th>Date Time</th>
                            <th>Status</th>
                            <th style={{ width: 82 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itinerariesData && itinerariesData.length >= 1 ? (
                            itinerariesData.map((faq, index) => (
                              <>
                                <tr key={index}>
                                  <td className="table-user">
                                    <a href="#">
                                      {faq.pickupLocationName &&
                                        faq.pickupLocationName.substring(0, 35)}
                                    </a>
                                  </td>
                                  <td>
                                    {faq.destinationName &&
                                      faq.destinationName.substring(0, 35)}
                                  </td>

                                  <td>
                                    {new Date(faq.pickupDate).toDateString() +
                                      " " +
                                      new Date(
                                        faq.pickupDate
                                      ).toLocaleTimeString()}
                                  </td>
                                  <td>
                                    {faq.isEnabled ? (
                                      <span className="badge badge-success">
                                        Enabled
                                      </span>
                                    ) : (
                                      <span className="badge badge-warning">
                                        {faq.status || null}
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <a
                                      onClick={() => {
                                        console.log(faq);
                                        setFormValue(faq);
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
                                        deletebooking(faq.faqId);
                                      }}
                                    >
                                      {" "}
                                      <i className="fas fa-times" />
                                    </a>
                                  </td>
                                </tr>
                              </>
                            ))
                          ) : faqData && faqData.length === 0 && loading ? (
                            <tr>
                              <td colSpan={7} className="text-center py-5">
                                <h3> There are no Itineraries</h3>
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
            <div className="row mt-3">
              <div
                className="col-12"
                style={{ borderBottom: "2px solid #7e57c2" }}
              >
                <h4 class="mt-2 mb-2">Quotations and Payment</h4>
              </div>
              <div className="col-12 row mt-3">
                <div className="col-6">
                  <div className="form-group col-sm-12 row">
                    <label className="col-sm-4 col-form-label mb-0 text-right">
                      ID
                    </label>
                    <div className="col-sm-7">
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={
                          (bookingData &&
                            bookingData.quotation &&
                            bookingData.quotation.id) ||
                          null
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group col-sm-12 row">
                    <label className="col-sm-4 col-form-label mb-0 text-right">
                      Amount
                    </label>
                    <div className="col-sm-7">
                      <input
                        type="number"
                        name="quotationAmount"
                        onChange={(e) => onChange(e)}
                        className="form-control"
                        value={
                          bookingFormData.quotationAmount ||
                          (bookingData &&
                            bookingData.quotation &&
                            bookingData.quotation.amount) ||
                          null
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group col-sm-12 row">
                    <label className="col-sm-4 col-form-label mb-0 text-right">
                      Status
                    </label>
                    <div className="col-sm-7">
                      <input
                        type="text"
                        className="form-control"
                        disabled
                        value={
                          (bookingData &&
                            bookingData.quotation &&
                            bookingData.quotation.isPaid &&
                            "Paid") ||
                          "Unpaid"
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group col-sm-12 row">
                    <label className="col-sm-4 col-form-label mb-0 text-right">
                      Date
                    </label>
                    <div className="col-sm-7">
                      <DatePicker
                        readOnly
                        value={
                          (bookingData &&
                            bookingData.quotation &&
                            bookingData.quotation.date) ||
                          null
                        }
                        oneTap
                        block
                      />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group col-sm-12 row">
                    <label className="col-sm-4 col-form-label mb-0 text-right">
                      ID
                    </label>
                    <div className="col-sm-7">
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={
                          (bookingData &&
                            bookingData.payment &&
                            bookingData.payment.id) ||
                          null
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group col-sm-12 row">
                    <label className="col-sm-4 col-form-label mb-0 text-right">
                      Amount
                    </label>
                    <div className="col-sm-7">
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={
                          (bookingData &&
                            bookingData.payment &&
                            bookingData.payment.amount) ||
                          null
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group col-sm-12 row">
                    <label className="col-sm-4 col-form-label mb-0 text-right">
                      Reference
                    </label>
                    <div className="col-sm-7">
                      <input
                        type="text"
                        className="form-control"
                        disabled
                        value={
                          (bookingData &&
                            bookingData.payment &&
                            bookingData.payment.reference) ||
                          null
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group col-sm-12 row">
                    <label className="col-sm-4 col-form-label mb-0 text-right">
                      Date
                    </label>
                    <div className="col-sm-7">
                      <DatePicker
                        readOnly
                        value={
                          (bookingData &&
                            bookingData.payment &&
                            bookingData.payment.date) ||
                          null
                        }
                        oneTap
                        block
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div
                className="col-12"
                style={{ borderBottom: "2px solid #7e57c2" }}
              >
                <h4 class="mt-2 mb-2"></h4>
              </div>
              <div className="col-12 row mt-3">
                <ButtonToolbar>
                  {hasPermission.update(props.permissions) && (
                    <Button
                      onClick={() => {
                        updatebooking(bookingData.bookingId);
                      }}
                      appearance="primary"
                      type="submit"
                    >
                      Update
                    </Button>
                  )}
                </ButtonToolbar>
              </div>
            </div>
          </div>{" "}
          {/* container */}
        </div>{" "}
        {/* content */};
      </div>
      {/* <Drawer
        backdrop={showDrawer}
        show={showDrawer}
        size="sm"
        onHide={() => {
          toggleShowDrawer(!showDrawer);
        }}
      >
        <Drawer.Header>
          <Drawer.Title>{dataUpdate ? "Update FAQ" : "Add FAQ"}</Drawer.Title>
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
                      Title
                      <HelpBlock tooltip style={{ marginTop: "0px" }}>
                        Required
                      </HelpBlock>
                    </ControlLabel>
                    <FormControl name="title" />
                  </FormGroup>
                </Col>
              </Row>

              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ControlLabel>Description</ControlLabel>
                    <FormControl
                      rows={5}
                      name="description"
                      componentClass="textarea"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-4"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ButtonToolbar>
                      {dataUpdate ? (
                        <Button
                          onClick={() => {
                            updatebooking(formValue.faqId);
                          }}
                          appearance="primary"
                          type="submit"
                        >
                          Update
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            addfaq();
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
                          setFormValue(initialFormState);
                        }}
                      >
                        Reset
                      </Button>
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
      </Drawer> */}
    </React.Fragment>
  );
};

export default EditBookingComponent;
