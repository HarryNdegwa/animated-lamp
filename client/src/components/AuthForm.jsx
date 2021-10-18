import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { login, register } from "../redux/reducers/api/auth";

export default function AuthForm({ text, values, setValues }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let response;
    if (text === "Login") {
      response = await dispatch(login(values));
    } else {
      response = await dispatch(register(values));
    }
    if (response === "Invalid credentials!" || response === "Wrong Password!") {
      setError(response);
      setLoading(false);
      return;
    } else if (response === "Username already exists!") {
      setError(response);
      setLoading(false);
      return;
    }
    setLoading(false);
    if (location && location.state && location.state.toRedirectTo) {
      history.replace(location.state.toRedirectTo);
    } else {
      history.replace("/");
    }
  };

  const handleFocus = (e) => {
    if (error) {
      setError("");
    }
  };

  return (
    <form className="col-md-5 mx-auto" onSubmit={handleSubmit} method="POST">
      {error && <p className="text-danger m-0">{error}</p>}
      <div className="mb-3 row">
        <label htmlFor="username" className="col-form-label">
          Username
        </label>
        <div>
          <input
            type="text"
            className="form-control"
            id="username"
            required
            values={values.username}
            onChange={handleChange}
            name="username"
            onFocus={handleFocus}
          />
        </div>
      </div>
      <div className="mb-3 row">
        <label htmlFor="password" className="col-form-label mb-0">
          Password
        </label>
        <div>
          <input
            type="password"
            className="form-control"
            required
            id="password"
            values={values.password}
            onChange={handleChange}
            name="password"
            onFocus={handleFocus}
          />
        </div>
      </div>

      <div className="d-grid gap-2">
        <button
          className="btn bg-orange text-light"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            text
          )}
        </button>
      </div>
    </form>
  );
}
