import React from "react";

function Spinner() {
  return (
    <div className="d-inline-block">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner;
