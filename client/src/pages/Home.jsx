import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import { GET_CARS } from "../apollo/queries/car";
import CarCard from "../components/CarCard";
import Loading from "../components/Loading";
// import { getCars } from "../redux/reducers/api/car";

export default function Home() {
  const [cars, setCars] = useState([]);
  // const dispatch = useDispatch();
  const { loading, error, data } = useQuery(GET_CARS);
  // console.log(`data`, data);

  useEffect(() => {
    if (!loading && !error && data && data.cars) {
      setCars([...data.cars]);
    }
  }, [data, loading]);

  if (error) {
    return null;
  }

  if (loading) {
    return <Loading isHome />;
  }

  return (
    <div className="container mb-5">
      <h3>Cars</h3>
      <div className="row m-0">
        {cars.map((car) => (
          <CarCard data={car} key={car.id} />
        ))}
      </div>
    </div>
  );
}
