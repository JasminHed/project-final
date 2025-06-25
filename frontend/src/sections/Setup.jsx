import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Setup = () => {
  const [values, setValues] = useState({
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    timebound: "",
  });
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setShowError(false);
  };

  const handleSave = () => {
    const hasEmpty = Object.values(values).some((value) => value.trim() === "");
    if (hasEmpty) {
      setShowError(true);
    } else {
      // Save logic to dahsboard here?
      navigate("/dashboard");
    }
  };

  //dot forget to put resize none on the styling so the textarea does not move!
  return (
    <div>
      <h1>Set your intention + SMART goal</h1>

      <div>
        <p>Specific</p>
        <textarea
          placeholder="Enter your specific goal..."
          value={values.specific}
          onChange={(e) => handleChange("specific", e.target.value)}
        ></textarea>
        <p>{values.specific.length}/150</p>

        <p>Measurable</p>
        <textarea
          placeholder="Enter your measurable goal..."
          value={values.measurable}
          onChange={(e) => handleChange("measurable", e.target.value)}
        ></textarea>
        <p>{values.measurable.length}/150</p>

        <p>Achievable</p>
        <textarea
          placeholder="Enter your achievable goal..."
          value={values.achievable}
          onChange={(e) => handleChange("achievable", e.target.value)}
        ></textarea>
        <p>{values.achievable.length}/150</p>

        <p>Relevant</p>
        <textarea
          placeholder="Enter your relevant goal..."
          value={values.relevant}
          onChange={(e) => handleChange("relevant", e.target.value)}
        ></textarea>
        <p>{values.relevant.length}/150</p>

        <p>Timebound</p>
        <textarea
          placeholder="Enter your timebound goal..."
          value={values.timebound}
          onChange={(e) => handleChange("timebound", e.target.value)}
        ></textarea>
        <p>{values.timebound.length}/150</p>
      </div>

      {showError && <p>Please fill in all fields</p>}

      <button onClick={handleSave}>Save and go to dashboard</button>
    </div>
  );
};

export default Setup;
