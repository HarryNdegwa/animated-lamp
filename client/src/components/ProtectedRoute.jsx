import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { isAuthenticated } from "../util/authService";

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  const { qid: token } = useSelector((state) => state.auth);
  const toRedirectTo = rest.location;

  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        const authInfo = isAuthenticated(token);
        if (authInfo) {
          return Component ? <Component {...props} /> : render(props);
        } else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { toRedirectTo },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
