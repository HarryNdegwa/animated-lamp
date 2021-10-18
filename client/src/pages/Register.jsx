import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";

export default function Register() {
  const [values, setValues] = useState({ username: "", password: "" });
  return (
    <div className="container pt-5">
      <h1 className="text-center my-3">Create a mobihub account</h1>
      <AuthForm text="Register" values={values} setValues={setValues} />
      <div className="col-md-5 mx-auto mt-3">
        <p>
          Already have an account?
          <Link to="/login" className="text-orange hover-orange">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
