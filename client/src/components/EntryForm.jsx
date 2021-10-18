import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { addCar, updateCar, uploadImage } from "../redux/reducers/api/car";

export default function EntryForm({ edit, data, carId }) {
  const [values, setValues] = useState({
    name: "",
    make: "",
    model: "",
    images: [],
    year: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (edit) {
      setValues({ ...data });
    }
  }, [edit, data]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    let file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setUploading(true);
      const responseData = await dispatch(uploadImage(formData));
      if (responseData) {
        setValues({
          ...values,
          images: [...values.images, responseData.secure_url],
        });
      }
      setUploading(false);
    }
    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...values };

    setLoading(true);
    if (edit) {
      await dispatch(updateCar(carId, payload));
    } else {
      await dispatch(addCar(payload));
    }

    setLoading(false);
    setValues({
      name: "",
      make: "",
      model: "",
      images: [],
      year: "",
      location: "",
    });
    history.replace("/");
  };

  return (
    <form className="col-md-5 mx-auto mb-5" onSubmit={handleSubmit}>
      <div className="mb-3 row">
        <label htmlFor="name" className="col-form-label">
          Car Name
        </label>
        <div>
          <input
            type="text"
            name="name"
            className="form-control"
            id="name"
            required
            value={values.name}
            onChange={handleChange}
          />
        </div>
      </div>{" "}
      <div className="mb-3 row">
        <label htmlFor="model" className="col-form-label">
          Model
        </label>
        <div>
          <input
            type="text"
            name="model"
            className="form-control"
            id="model"
            required
            value={values.model}
            onChange={handleChange}
          />
        </div>
      </div>{" "}
      <div className="mb-3 row">
        <label htmlFor="make" className="col-form-label">
          Make
        </label>
        <div>
          <input
            type="text"
            name="make"
            className="form-control"
            id="make"
            required
            value={values.make}
            onChange={handleChange}
          />
        </div>
      </div>{" "}
      <div className="mb-3 row">
        <label htmlFor="year" className="col-form-label">
          Year
        </label>
        <div>
          <input
            type="text"
            name="year"
            className="form-control"
            id="year"
            required
            onChange={handleChange}
            value={values.year}
          />
        </div>
      </div>
      <div className="mb-3 row">
        <label htmlFor="year" className="col-form-label">
          Location
        </label>
        <div>
          <input
            type="text"
            name="location"
            className="form-control"
            id="year"
            required
            onChange={handleChange}
            value={values.location}
          />
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="formFile" className="form-label">
          Image
        </label>
        <input
          className="form-control"
          type="file"
          id="formFile"
          accept="image/*"
          onChange={handleUpload}
          disabled={
            uploading || (values && values.images && values.images.length === 6)
          }
        />
        <div>
          <small>Maximum of 6 images</small>
        </div>
        {uploading && (
          <>
            <div className="spinner-border text-orange" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span>Uploading...</span>
          </>
        )}
      </div>
      <div className="images-wrapper mb-3">
        {values &&
          values.images &&
          values.images.map((img) => (
            <div className="entry-image">
              <img src={img} alt="entry-cap" />
            </div>
          ))}
      </div>
      <div className="d-grid gap-2">
        <button
          className="btn bg-orange text-light"
          type="submit"
          disabled={loading || uploading}
        >
          {loading ? (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            "Publish"
          )}
        </button>
      </div>
    </form>
  );
}
