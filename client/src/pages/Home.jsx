import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CarCard from "../components/CarCard";
import Loading from "../components/Loading";
import { getCars } from "../redux/reducers/api/car";

export default function Home() {
  const [cars, setCars] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      let _cars = await dispatch(getCars());
      if (_cars) {
        setCars([..._cars]);
        setLoading(false);
      }
    };
    getData();
  }, [dispatch]);

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
