import React from "react";
import EntryForm from "../components/EntryForm";

export default function AddEntry() {
  return (
    <div className="container mt-4">
      <div className="col-md-5 mx-auto">
        <h3>Add Entry</h3>
      </div>
      <EntryForm />
    </div>
  );
}
