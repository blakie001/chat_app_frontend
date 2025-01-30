import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import { LoginFailure, LoginStart, LoginSuccess } from "../context/Action";

function Login() {
  const { dispatch } = useContext(Context);
  const [internalError, setInternalError] = useState(null);
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(LoginStart()); // Start login process


    try {
      const res = await axios.post("http://localhost:3000/login", {
        email: data.email,
        password: data.password,
      });
      // Save token to local storage
      localStorage.setItem("token", res.data.token);

      dispatch({type: "LOGIN_SUCCESS", payload: res.data.token});
      // window.location.href = ("/");
      navigate("/")

    } catch (error) {
      console.log(error)
      dispatch(LoginFailure());
      if (error?.response?.data) {
        setInternalError(error.response.data);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setInternalError(null);
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <>
      <section
        className="vh-100 bg-imhandleChangeage"
        style={{
          backgroundImage:
            "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
        }}
      >
        <div className="mask d-flex align-items-center h-100 gradient-custom-3">
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                <div className="card" style={{ borderRadius: "15px" }}>
                  <div className="card-body p-5">
                    <h2
                      className="text-uppercase text-center mb-4"
                      style={{ marginTop: "-2px", marginBottom: "2px" }}
                    >
                      Login
                    </h2>

                    <form onSubmit={handleSubmit}>
                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          placeholder="Email"
                          id="form3Example3cg"
                          onChange={handleChange}
                          value={data.email}
                          name="email"
                          className="form-control form-control-lg"
                        />
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          placeholder="Password"
                          id="form3Example4cg"
                          onChange={handleChange}
                          value={data.password}
                          name="password"
                          className="form-control form-control-lg"
                        />
                      </div>
                      {internalError && (
                        <p style={{ color: "red", marginLeft: "160px" }}>
                          {internalError + "!"}
                        </p>
                      )}
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-outline-primary"
                          style={{ marginTop: "14px" }}
                          type="submit"
                        >
                          Login
                        </button>
                      </div>

                      <div className="extraContent">
                        <p className="text-center text-muted mt-2">
                          Don't have an account?{" "}
                          <Link to={"/signup"}>
                            <span className="fw-bold text-body">
                              <u>Register here</u>
                            </span>
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
