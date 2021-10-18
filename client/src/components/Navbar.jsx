import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLocation, useHistory } from "react-router-dom";
import { unSetQid } from "../redux/reducers/auth";
import HamburgerMenu from "react-hamburger-menu";

export default function Navbar() {
  const location = useLocation();
  const history = useHistory();
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [showDropDown, setShowDropDown] = useState();

  const dispatch = useDispatch();

  const { qid: token } = useSelector((state) => state.auth);

  const isAuthPath =
    location.pathname === "/login" || location.pathname === "/register";

  const handleClick = (e) => {
    setBurgerOpen(!burgerOpen);
  };

  useEffect(() => {
    if (burgerOpen) {
      setShowDropDown(true);
    } else {
      setShowDropDown(false);
    }
  }, [burgerOpen]);

  if (isAuthPath) {
    return null;
  }

  return (
    <div className="header shadow">
      <div className="container d-flex align-items-center justify-content-between">
        <div>
          <h3 className="brand">
            <Link to="/" className="custom-link">
              <span className="text-orange">Mobi</span>Hub
            </Link>
          </h3>
        </div>
        <div className="nav-links align-items-center">
          {token ? (
            <>
              {" "}
              <div>
                <Link to="/chats" className="custom-link">
                  Messages
                </Link>
              </div>
              <div>
                <Link to="/add-car" className="custom-link">
                  Add Car
                </Link>
              </div>
              <div>
                <span
                  className="custom-link btn logout-nav-btn m-0"
                  onClick={async () => {
                    await dispatch(unSetQid());
                    history.push("/");
                  }}
                >
                  Logout
                </span>
              </div>
            </>
          ) : (
            <>
              <div>
                <Link to="/login" className="custom-link btn login-nav-btn">
                  Sign In
                </Link>
              </div>
              <div>
                <Link to="/register" className="btn register-nav-btn">
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
        <div className="burger">
          <HamburgerMenu
            isOpen={burgerOpen}
            menuClicked={handleClick}
            width={25}
            height={16}
            strokeWidth={3}
            rotate={0}
            color="orange"
            borderRadius={0}
            animationDuration={0.5}
          />

          <div
            className={`burger-dropdown shadow ${
              showDropDown ? `burger-dropdown-open` : ``
            }`}
          >
            {token ? (
              <>
                {" "}
                <div className="p-2">
                  <Link
                    to="/chats"
                    onClick={() => setBurgerOpen(false)}
                    className="custom-link"
                  >
                    Messages
                  </Link>
                </div>
                <div className="p-2">
                  <Link
                    to="/add-car"
                    onClick={() => setBurgerOpen(false)}
                    className="custom-link"
                  >
                    Add Car
                  </Link>
                </div>
                <div className="p-2">
                  <span
                    className="custom-link btn logout-nav-btn m-0"
                    onClick={async () => {
                      await dispatch(unSetQid());
                      setBurgerOpen(false);
                      history.push("/");
                    }}
                  >
                    Logout
                  </span>
                </div>
              </>
            ) : (
              <div className="d-flex justify-content-between">
                <div className="p-2">
                  <Link
                    to="/login"
                    onClick={() => setBurgerOpen(false)}
                    className="custom-link btn login-nav-btn"
                  >
                    Sign In
                  </Link>
                </div>
                <div className="p-2">
                  <Link
                    to="/register"
                    onClick={() => setBurgerOpen(false)}
                    className="btn register-nav-btn"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
