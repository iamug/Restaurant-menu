import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar, Drawer } from "rsuite";
import { Grid, Row, Col, ControlLabel, SelectPicker } from "rsuite";
import { Form, FormGroup, FormControl, HelpBlock, Loader } from "rsuite";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../controllers/api";
import { hasPermission } from "../../controllers/auth";

const FAQListComponent = (props) => {
  let initialFormState = {
    isEnabled: undefined,
    title: null,
    description: null,
  };
  let [showDrawer, toggleShowDrawer] = useState(false);
  let [formValue, setFormValue] = useState(initialFormState);
  let [faqData, setFaqData] = useState([]);
  let [refreshData, setRefreshData] = useState(false);
  let [dataUpdate, setDataUpdate] = useState(false);
  let [loading, setLoading] = useState(false);

  const deletefaq = async (id) => {
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
        const res = await API.delete("/api/faqs/" + id, config);
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

  const addfaq = async () => {
    const { isEnabled, title, description } = formValue;
    if (!title && !description && isEnabled === undefined) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }
    let body = { isEnabled, title, description };
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.post("/api/faqs", body, config);
      if (res.status == 201) {
        new AWN().success("FAQ added successfully ", {
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

  const updateplans = async (id) => {
    const { isEnabled, title, description } = formValue;
    if (!title && !description && isEnabled === undefined) {
      new AWN().alert("Kindly fill all fields", {
        durations: { alert: 4000 },
      });
      return false;
    }

    let body = { isEnabled, title, description };
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.put("/api/faqs/" + id, body, config);
      if (res.status == 200) {
        new AWN().success("FAQ updated successfully ", {
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

  const fetchfaqs = async () => {
    try {
      let token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };
      const res = await API.get("/api/faqs", config);
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
        $("tbody tr").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });
    });

    const faqs = await fetchfaqs();
    //console.log(plans);
    if (!faqs) {
      new AWN().alert("Network Error. Kindly check your internet connection", {
        durations: { alert: 0 },
      });
    }
    console.log(faqs);
    setFaqData(faqs);
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
                  <h4 className="page-title">FAQs</h4>
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
                            <th>Title</th>
                            <th>Description</th>
                            <th>ID</th>
                            <th>Status</th>
                            <th style={{ width: 82 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {faqData && faqData.length >= 1 ? (
                            faqData.map((faq, index) => (
                              <>
                                <tr key={index}>
                                  <td className="table-user">
                                    <a
                                      href="#"
                                      className="text-primary font-weight-semibold"
                                    >
                                      {faq.title.substring(0, 35)}
                                    </a>
                                  </td>
                                  <td>{faq.description.substring(0, 35)}</td>

                                  <td>{faq.faqId}</td>
                                  <td>
                                    {faq.isEnabled ? (
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
                                    {hasPermission.delete(
                                      props.permissions
                                    ) && (
                                      <a
                                        className="action-icon"
                                        onClick={() => {
                                          deletefaq(faq.faqId);
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
                          ) : faqData && faqData.length === 0 && loading ? (
                            <tr>
                              <td colSpan={6} className="text-center py-5">
                                <h3> There are no FAQs</h3>
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
                            updateplans(formValue.faqId);
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
      </Drawer>
    </React.Fragment>
  );
};

export default FAQListComponent;
