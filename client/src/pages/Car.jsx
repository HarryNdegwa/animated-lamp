import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { getCar } from "../redux/reducers/api/car";
import Carousel from "react-bootstrap/Carousel";
import { createNewChat, getMe, getUser } from "../redux/reducers/api/auth";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { useQuery } from "@apollo/client";
import { GET_CAR } from "../apollo/queries/car";

export default function Car() {
  const [car, setCar] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const carId = parseInt(location.pathname.split("/")[2], 10);
  const [me, setMe] = useState(null);
  const { qid: token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState(null);
  const [startingChat, setStartingChat] = useState(false);
  const history = useHistory();
  const {
    loading: gloading,
    error,
    data: carData,
  } = useQuery(GET_CAR, {
    variables: {
      id: carId,
    },
    skip: !carId,
  });

  console.log(`carData`, carData);
  useEffect(() => {
    if (carData && carData.car) {
      // setCar({ ...carData.car });
    }
  }, [carData]);

  // useEffect(() => {
  //   const getData = async () => {
  //     if (carId) {
  //       const response = await dispatch(getCar(carId));
  //       if (response) {
  //         setCar({ ...response });
  //       }
  //       setCar({ ...response });

  //       if (token) {
  //         const response2 = await dispatch(getMe());
  //         if (response2) {
  //           setMe({ ...response2 });
  //         }

  //         if (response) {
  //           const response3 = await dispatch(getUser(response.UserId));
  //           if (response3) {
  //             setOwner({ ...response3 });
  //           }
  //         }
  //       }

  //       setLoading(false);
  //     }
  //   };
  //   getData();
  // }, [dispatch, token]);

  // const handleStartChat = async (e) => {
  //   setStartingChat(true);
  //   const response = await dispatch(createNewChat(owner.id));
  //   if (response) {
  //     setStartingChat(false);
  //     let route = "/chats";
  //     const win = window.open(route, "_blank");
  //     win.focus();
  //   }
  // };

  if (gloading) {
    return <Loading isCar />;
  }

  return (
    <div className="mb-5">
      <div className="container-fluid p-0">
        <Carousel>
          {car &&
            car.images &&
            car.images.map((img, idx) => (
              <Carousel.Item key={idx} indicators="false" interval={null}>
                <img
                  className="d-block w-100 carousel-img"
                  src={img}
                  alt="First slide"
                />
              </Carousel.Item>
            ))}
        </Carousel>
      </div>
      <div className="row m-0 mt-4">
        <div className="col-md-8 mx-auto">
          <div className="d-flex align-items-center justify-content-between">
            <div className="mb-4">
              {" "}
              <h3 className="m-0">{car && car.name}</h3>
              {token && <small>Car posted by {owner && owner.username}</small>}
            </div>

            {car && me && car.UserId === me.id && (
              <Link to={`/update-car/${car && car.id}`}>Edit Car</Link>
            )}
          </div>
          <ul>
            <li>Make:{car && car.make}</li>
            <li>Model:{car && car.model}</li>
            <li>Year:{car && car.year}</li>
          </ul>

          {!token && (
            <small>
              <i>
                Login{" "}
                <Link
                  className="text-orange"
                  to={{ pathname: "/login", state: { toRedirectTo: location } }}
                >
                  here
                </Link>{" "}
                to view car location or chat with owner
              </i>
            </small>
          )}

          {token && <p>Car location: {car && car.location}</p>}
          {/* If logged in and not my entry */}
          {token && !(car && me && car.UserId === me.id) && (
            <button
              className="btn bg-orange"
              disabled={startingChat}
              // onClick={handleStartChat}
            >
              {startingChat ? "Initializing..." : "Start Chat"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
