import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar, Drawer } from "rsuite";
import { Grid, Row, Col } from "rsuite";
import { Form, FormGroup, FormControl, ControlLabel, Loader } from "rsuite";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";

const ActivityLogComponent = () => {
  let initialFormState = {};
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [ticketData, setTicketData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let [loading, setLoading] = useState(false);

  const fetchlogs = async () => {
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.get("/api/logs", config);
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
    const tickets = await fetchlogs();
    if (!tickets) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    console.log(tickets);
    setTicketData(tickets);
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
                  <h4 className="page-title">Activity Logs</h4>
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
                            <th>Date</th>
                            <th>Module</th>
                            <th>Operation</th>
                            <th>Resource</th>
                            <th>IP Address</th>
                            <th style={{ width: 50 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ticketData && ticketData.length >= 1 ? (
                            ticketData.map((log, index) => (
                              <tr key={index}>
                                <td className="font-weight-semibold">
                                  {log.adminName}
                                </td>
                                <td>
                                  {new Date(log.date).toDateString() +
                                    " " +
                                    new Date(log.date).toLocaleTimeString()}
                                </td>
                                <td>{log.module} </td>
                                <td>{log.operation} </td>
                                <td>{log.resource}</td>
                                <td>{log.ipAddress}</td>
                                <td>
                                  <a
                                    onClick={() => {
                                      console.log(log);
                                      setFormValue(log);
                                      setDataUpdate(true);
                                      toggleShowDrawer(!showDrawer);
                                    }}
                                    className="action-icon"
                                  >
                                    {" "}
                                    <i className="mdi mdi-square-edit-outline" />
                                  </a>
                                </td>
                              </tr>
                            ))
                          ) : ticketData &&
                            ticketData.length === 0 &&
                            loading ? (
                            <tr>
                              <td colSpan={7} className="text-center py-5">
                                <h3> There are no Logs</h3>
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
                View Log{" "}
                <small className="font-weight-bolder text-primary ml-2">
                  {formValue.ticketId}
                </small>
              </span>
            )}
            {!dataUpdate && <span></span>}
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Form fluid checkTrigger="change" formValue={formValue}>
            <Grid fluid>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Name</ControlLabel>
                    <FormControl name="adminName" readOnly />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Date</ControlLabel>
                    <FormControl
                      name="date"
                      readOnly
                      value={
                        new Date(formValue.date).toDateString() +
                        " " +
                        new Date(formValue.date).toLocaleTimeString()
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Module</ControlLabel>
                    <FormControl name="module" readOnly />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Operation</ControlLabel>
                    <FormControl name="operation" readOnly />
                  </FormGroup>
                </Col>
              </Row>

              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Resource</ControlLabel>
                    <FormControl name="resource" readOnly />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>IP Address</ControlLabel>
                    <FormControl name="ipAddress" readOnly />
                  </FormGroup>
                </Col>
              </Row>

              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Client URL</ControlLabel>
                    <FormControl name="referer" readOnly />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <ControlLabel>Endpoint</ControlLabel>
                    <FormControl name="endpoint" readOnly />
                  </FormGroup>
                </Col>
              </Row>

              <div className="mb-3"></div>
              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ControlLabel>Detail</ControlLabel>
                    <FormControl
                      rows={3}
                      name="detail"
                      componentClass="textarea"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <div className="mb-3"></div>

              <Row gutter={10}>
                <Col xs={24}>
                  <FormGroup>
                    <ButtonToolbar>
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

export default ActivityLogComponent;
