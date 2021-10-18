import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";

export default function Login() {
  const [values, setValues] = useState({ username: "", password: "" });
  return (
    <div className="container pt-5">
      <h1 className="text-center my-3">Login to Mobihub</h1>
      <AuthForm text="Login" values={values} setValues={setValues} />
      <div className="col-md-5 mx-auto mt-3">
        <p>
          Don't have an account?
          <Link to="/register" className="text-orange hover-orange">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
