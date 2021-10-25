import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { GET_UPDATE_CAR } from "../apollo/queries/car";
import EntryForm from "../components/EntryForm";
// import { getCar } from "../redux/reducers/api/car";

export default function UpdateEntry() {
  const location = useLocation();
  const [car, setCar] = useState({});

  const carId = parseInt(location.pathname.split("/")[2], 10);

  const { loading, error, data } = useQuery(GET_UPDATE_CAR, {
    variables: { id: carId },
  });

  useEffect(() => {
    if (data) {
      setCar({
        name: data.car.name,
        make: data.car.make,
        model: data.car.model,
        images: data.car.images,
        year: data.car.year,
        location: data.car.location,
      });
    }
  }, [data]);

  return (
    <div className="container mt-4">
      <div className="col-md-5 mx-auto">
        <h3>Update Entry</h3>
      </div>
      <EntryForm edit data={car} carId={carId} />
    </div>
  );
}
