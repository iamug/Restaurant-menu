import React, { useEffect, useState, useContext } from "react";
import { InputGroup, Icon, Input } from "rsuite";
import { Form, FormGroup, ControlLabel } from "rsuite";
import $ from "jquery";
import AWN from "awesome-notifications";
import API from "../../../controllers/api";
import { Center, Square, Circle } from "@chakra-ui/react";
import { GetUserData, Reload } from "../../../controllers/auth";
import { uploadImage } from "../../../controllers/utils";
import DataContext, { DataConsumer } from "../../../context/datacontext";

const ProfileComponent = () => {
  let [formValue, setFormValue] = useState({});
  let [userData, setUserData] = useState({});
  let [refreshData, setRefreshData] = useState(false);
  const [showpassword, setshowpassword] = useState(false);
  const [showpassword2, setshowpassword2] = useState(false);
  const user = useContext(DataContext);
  //const { user, setUser } = useContext(DataContext);
  let token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
  };

  const updateprofile = async (...args) => {
    //console.log("args", ...args);
    const { name, phone, avatar } = formValue;
    if (!name || !phone || !avatar)
      return new AWN().alert("Kindly fill all fields");
    if (formValue.password) {
      if (formValue.password !== formValue.password2) {
        return new AWN().alert("Passwords do not match");
      }
    }
    let body = { name, phone, avatar };
    formValue.bannerImg && (body.bannerImg = formValue.bannerImg);
    formValue.password && (body.password = formValue.password);
    //body = { ...body, ...args[0] };
    console.log(body);
    try {
      const res = await API.put("/api/user/auth/profile", body, config);
      if (res.status == 200) {
        new AWN().success("Profile updated successfully ");
        user.setUserData(res.data.admin);
        setRefreshData(!refreshData);
        Reload(user.setUserData, false);
      } else {
        new AWN().alert("Failed, Kindly try again");
      }
    } catch (err) {
      console.log(err);
      new AWN().alert("Failed, Kindly try again");
    }
  };

  const updateslug = async () => {
    const { slug } = formValue;
    if (!slug) return new AWN().alert("Kindly enter slug");
    let body = { slug };
    try {
      const res = await API.put("/api/user/auth/profile/slug", body, config);
      if (res.status == 200) {
        new AWN().success("Profile updated successfully ");
        user.setUserData(res.data.admin);
        setRefreshData(!refreshData);
        Reload(user.setUserData, false);
      } else {
        new AWN().alert("Failed, Kindly try again");
      }
    } catch (err) {
      if (err?.response?.data?.msg) {
        new AWN().alert(err.response.data.msg);
      } else {
        new AWN().alert("Failed, Kindly try again");
      }
    }
  };

  const handleInputChange = (value, elem) => {
    setFormValue({
      ...formValue,
      [elem.target.name]: value,
    });
  };

  const onChangeProfile = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    try {
      const url = await uploadImage(file);
      if (!url) return new Error("image upload error");
      setFormValue({ ...formValue, ["avatar"]: url });
      //updateprofile({ avatar: url });
    } catch (err) {
      console.error(err);
      return new AWN().alert("Picture Upload Failed, Kindly try again");
    }
  };

  const onChangeBannerImg = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    try {
      const url = await uploadImage(file);
      if (!url) return new Error("image upload error");
      setFormValue({ ...formValue, ["bannerImg"]: url });
      //updateprofile({ bannerImg: url });
    } catch (err) {
      console.error(err);
      return new AWN().alert("Picture Upload Failed, Kindly try again");
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
    const userData = await GetUserData();
    setUserData(userData);
    setFormValue(userData);
  }, [refreshData]);

  return (
    <React.Fragment>
      <div>
        {userData.email ? (
          <div className="content">
            {/* Start Content*/}
            <div className="container-fluid">
              {/* start page title */}
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box">
                    <h4 className="page-title">Profile</h4>
                  </div>
                </div>
              </div>
              {/* end page title */}
              <div className="row">
                <div className="col-lg-4 col-xl-4">
                  <div className="card-box text-center">
                    <Center>
                      <img
                        src={
                          formValue && formValue.avatar
                            ? formValue.avatar
                            : userData && userData.avatar
                            ? userData.avatar
                            : "../assets/images/users/user-1.jpg"
                        }
                        className="rounded-circle d-inline-block avatar-xxl"
                        alt="profile-image"
                      />
                    </Center>
                    <p>
                      <label htmlFor="avatar">
                        <span class="btn btn-dark btn-xs mt-3 ">
                          Change Profile Picture
                        </span>
                      </label>
                      <input
                        type="file"
                        name="avatar"
                        id="avatar"
                        accept="image/*"
                        onChange={(e) => onChangeProfile(e)}
                        class="m-t-20 hidden"
                        style={{ display: "none" }}
                      />
                    </p>
                  </div>{" "}
                  {/* end card-box */}
                  <div className="card-box text-center">
                    <Center>
                      {(formValue.bannerImg ||
                        (userData && userData.bannerImg)) && (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={formValue.bannerImg || userData.bannerImg}
                        >
                          <img
                            src={
                              formValue && formValue.bannerImg
                                ? formValue.bannerImg
                                : userData &&
                                  userData.bannerImg &&
                                  userData.bannerImg
                            }
                            className="img-fluid d-inline-block"
                            alt="banner-image"
                          />
                        </a>
                      )}
                    </Center>
                    <p>
                      <label htmlFor="bannerImg">
                        <span class="btn btn-dark btn-xs mt-3 ">
                          Change Banner Image
                        </span>
                      </label>
                      <input
                        type="file"
                        name="bannerImg"
                        id="bannerImg"
                        accept="image/*"
                        onChange={(e) => onChangeBannerImg(e)}
                        class="m-t-20 hidden"
                        style={{ display: "none" }}
                      />
                    </p>
                  </div>{" "}
                  {/* end card-box */}
                </div>{" "}
                {/* end col*/}
                <div className="col-lg-8 col-xl-8">
                  <div className="card-box">
                    <div className="tab-pane" id="settings">
                      <Form
                        fluid
                        checkTrigger="change"
                        formValue={userData}
                        onSubmit={() => {
                          updateprofile();
                        }}
                        onChange={(data) => {
                          setFormValue({ ...data });
                        }}
                      >
                        <h5 className="mb-4 text-uppercase">
                          <i className="mdi mdi-account-circle mr-1" /> Personal
                          Info{" "}
                          <span className="ml-3">
                            {userData.isVerified ? (
                              <span className="badge badge-success px-2 py-1 font-12">
                                Verified
                              </span>
                            ) : (
                              <button
                                type="button"
                                class="btn btn-success btn-xs "
                              >
                                Not Verified. Resend verification
                              </button>
                            )}
                          </span>
                        </h5>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <FormGroup>
                              <ControlLabel> Name</ControlLabel>
                              <Input
                                name="name"
                                className="form-control"
                                type="text"
                                onChange={(v, e) => handleInputChange(v, e)}
                                value={formValue.name}
                              />
                            </FormGroup>
                          </div>
                          <div className="col-md-6">
                            <FormGroup>
                              <ControlLabel> Email</ControlLabel>
                              <Input
                                name="email"
                                className="form-control"
                                disabled
                                value={formValue.email}
                              />
                            </FormGroup>
                          </div>
                        </div>
                        {/* end row */}
                        {/* <div className="row">
                            <div className="col-12">
                              <div className="form-group">
                                <label htmlFor="userbio">Bio</label>
                                <textarea
                                  className="form-control"
                                  id="userbio"
                                  rows={4}
                                  placeholder="Write something..."
                                  defaultValue={""}
                                />
                              </div>
                            </div>
                          </div>{" "} */}
                        {/* end row */}
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <FormGroup>
                              <ControlLabel> Phone</ControlLabel>
                              <Input
                                name="phone"
                                className="form-control"
                                type="text"
                                onChange={(v, e) => handleInputChange(v, e)}
                                value={formValue.phone}
                              />
                            </FormGroup>
                          </div>
                          <div className="col-md-6"></div>{" "}
                        </div>{" "}
                        {/* end row */}
                        <div className="text-left mb-3">
                          <button
                            type="submit"
                            className="btn btn-primary waves-effect waves-light mt-1"
                          >
                            <i className="mdi mdi-content-save hidden" /> Update
                            Profile
                          </button>
                        </div>
                        <h5 className="mb-3 text-uppercase bg-light p-2">
                          <i className="fas fa-globe mr-1" /> Change Public URL
                        </h5>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <FormGroup>
                              <ControlLabel> Slug</ControlLabel>
                              <Input
                                name="slug"
                                className="form-control"
                                type="text"
                                onChange={(v, e) => handleInputChange(v, e)}
                                value={formValue.slug}
                              />
                              {formValue.slug && (
                                <span className="form-text text-default">
                                  <small className="">
                                    <a
                                      href={
                                        window.location.origin +
                                        "/menu/" +
                                        formValue.slug
                                      }
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      {" "}
                                      {window.location.origin +
                                        "/menu/" +
                                        formValue.slug}
                                    </a>
                                  </small>
                                </span>
                              )}
                            </FormGroup>
                            {/* end col */}{" "}
                          </div>
                        </div>{" "}
                        {/* end row */}
                        <div className="text-left mb-3">
                          <button
                            onClick={() => updateslug()}
                            type="button"
                            className="btn btn-primary waves-effect waves-light mt-1"
                          >
                            <i className="mdi mdi-content-save hidden" /> Update
                            Slug
                          </button>
                        </div>
                        <h5 className="mb-3 text-uppercase bg-light p-2">
                          <i className="mdi mdi-shield-key mr-1" /> Change
                          Password
                        </h5>
                        <div className="row">
                          <div className="col-md-6">
                            <FormGroup>
                              <ControlLabel>Password</ControlLabel>
                              <InputGroup inside style={{ width: "auto" }}>
                                <Input
                                  name="password"
                                  type={showpassword ? "text" : "password"}
                                  onChange={(v, e) => handleInputChange(v, e)}
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
                          </div>
                          <div className="col-md-6">
                            <FormGroup>
                              <ControlLabel> Confirm Password</ControlLabel>
                              <InputGroup inside style={{ width: "auto" }}>
                                <Input
                                  name="password2"
                                  type={showpassword2 ? "text" : "password"}
                                  onChange={(v, e) => handleInputChange(v, e)}
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
                          </div>{" "}
                          {/* end col */}
                        </div>{" "}
                        {/* end row */}
                        <div className="text-left">
                          <button
                            type="submit"
                            className="btn btn-primary waves-effect waves-light mt-4"
                          >
                            <i className="mdi mdi-content-save hidden" /> Update
                            Password
                          </button>
                        </div>
                      </Form>
                    </div>
                    {/* end settings content*/}
                  </div>{" "}
                  {/* end card-box*/}
                </div>{" "}
                {/* end col */}
              </div>
              {/* end row*/}
            </div>{" "}
            {/* container */}
          </div>
        ) : (
          <div className="text-center py-5 my-5 h-100">
            <div
              class="spinner-border avatar-lg text-primary m-2"
              role="status"
            ></div>
            <h4> Loading...</h4>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default ProfileComponent;
