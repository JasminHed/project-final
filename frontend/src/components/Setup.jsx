import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//to add: Disable the save button when inputs are incomplete. Confirmation / feedback on save. Persist data in backend so data does not go away on page reload.

// Setup component for setting intention and SMART goals
const Setup = () => {
  // Local state to store all goal fields
  const [values, setValues] = useState({
    intention: "",
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    timebound: "",
  });
  // State to show error message if fields are not filled in
  const [showError, setShowError] = useState(false);
  // Hook to navigate to another page
  const navigate = useNavigate();

  // Update goal fields when user types
  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setShowError(false);
  };

  // Save goals to backend when user clicks save button
  const handleSave = () => {
    //Check if field is empty
    const hasEmpty = Object.values(values).some((value) => value.trim() === "");
    if (hasEmpty) {
      setShowError(true);
    } else {
      const token = localStorage.getItem("accessToken");
      //Send POST request to save goal data
      fetch("http://localhost:8080/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (response.ok) {
            // Mark onboarding complete in local storage
            localStorage.setItem("hasCompletedOnboarding", "true");
            //Navigate to dahsboard page
            navigate("/dashboard");
          } else {
            console.error("Failed to save goal. Try again");
          }
        })
        .catch((error) => {
          console.error("Error", error);
        });
    }
  };

  //dot forget to put resize none on the styling so the textarea does not move!
  return (
    <div>
      <h1>Set your intention + SMART goal</h1>

      <div>
        <h2>Your Intention & Vision</h2>
        <div>
          <h3>Reflect on these questions:</h3>
          <ul>
            <li>
              What are my top priorities in life, and how can my goals help me
              get there?
            </li>
            <li>Thinking long term, where do I want to be in five years?</li>
            <li>
              If I could achieve just one major milestone in the next year, what
              would it be, and why?
            </li>
          </ul>
        </div>

        <p>
          Write your intention. Based on your reflections above, write your main
          intention/goal. It can be broad, you will specify how to get there in
          your SMART goals."
        </p>
        <textarea
          placeholder="Write your intention here"
          value={values.intention}
          onChange={(e) => handleChange("intention", e.target.value)}
          maxLength="150"
        />
        <p>{values.intention.length}/150</p>

        {showError && <p>Please fill in your intention</p>}
      </div>

      <div>
        <h3>Now Create Your SMART Goals</h3>
        <p>Specific</p>
        <textarea
          placeholder="Enter your specific goal"
          value={values.specific}
          onChange={(e) => handleChange("specific", e.target.value)}
        ></textarea>
        <p>{values.specific.length}/150</p>

        <p>Measurable</p>
        <textarea
          placeholder="Enter your measurable goal"
          value={values.measurable}
          onChange={(e) => handleChange("measurable", e.target.value)}
        ></textarea>
        <p>{values.measurable.length}/150</p>

        <p>Achievable</p>
        <textarea
          placeholder="Enter your achievable goal"
          value={values.achievable}
          onChange={(e) => handleChange("achievable", e.target.value)}
        ></textarea>
        <p>{values.achievable.length}/150</p>

        <p>Relevant</p>
        <textarea
          placeholder="Enter your relevant goal"
          value={values.relevant}
          onChange={(e) => handleChange("relevant", e.target.value)}
        ></textarea>
        <p>{values.relevant.length}/150</p>

        <p>Timebound</p>
        <textarea
          placeholder="Enter your timebound goal"
          value={values.timebound}
          onChange={(e) => handleChange("timebound", e.target.value)}
        ></textarea>
        <p>{values.timebound.length}/150</p>
      </div>

      {showError && <p>Please fill in all fields before moving forward</p>}

      <button onClick={handleSave}>Save. To dashboard.</button>
    </div>
  );
};

export default Setup;
