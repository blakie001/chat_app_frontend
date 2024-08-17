import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../context/Context";
import { RegisterFailure, RegisterStart, RegisterSuccess } from "../context/Action";

function Register() {
  const { dispatch } = useContext(Context);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [internalError, setInternalError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      setInternalError("Passwords do not match");
      return;
    }

    dispatch(RegisterStart()); // Start registration process

    try {
      const res = await axios.post("http://localhost:3000/signup", {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      // Save token to local storage
      // if (res.data.token) {
      //   localStorage.setItem("token", res.data.token);
      // } else {
      //   console.log("Token is undefined or null");
      // }
    
      localStorage.setItem("token", res.data.token);

      // Update context and redirect
      dispatch(RegisterSuccess(res.data.user));
      navigate("/");
    } catch (error) {
      dispatch(RegisterFailure());
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
        className="vh-100 bg-image"
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
                      New User ?
                    </h2>

                    <form onSubmit={handleSubmit}>
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          placeholder="Username"
                          id="form3Example1cg"
                          name="username"
                          onChange={handleChange}
                          value={data.username}
                          className="form-control form-control-lg"
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          placeholder="Email"
                          id="form3Example2cg"
                          name="email"
                          onChange={handleChange}
                          value={data.email}
                          className="form-control form-control-lg"
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          placeholder="Password"
                          id="form3Example3cg"
                          name="password"
                          onChange={handleChange}
                          value={data.password}
                          className="form-control form-control-lg"
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          id="form3Example4cg"
                          name="confirmPassword"
                          onChange={handleChange}
                          value={data.confirmPassword}
                          className="form-control form-control-lg"
                        />
                      </div>

                      {internalError && (
                        <p style={{ color: "red", marginLeft: "160px" }}>
                          {internalError}
                        </p>
                      )}

                      <div className="form-check d-flex justify-content-center mb-5">
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          value=""
                          id="form2Example3cg"
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="form2Example3cg"
                        >
                          I agree to all statements in{" "}
                          <a href="#!" className="text-body">
                            <u>Terms of service</u>
                          </a>
                        </label>
                      </div>

                      <div className="d-flex justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-outline-primary"
                        >
                          Register
                        </button>
                      </div>

                      <p className="text-center text-muted mt-5 mb-0">
                        Already have an account?{" "}
                        <Link to={"/login"}>
                          <span className="fw-bold text-body">
                            <u>Login here</u>
                          </span>
                        </Link>
                      </p>
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

export default Register;
