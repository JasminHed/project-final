//Calm Mode helps reduce visual distractions and enhance focus — especially for users who are neurodivergent or easily overwhelmed

import { useEffect, useState } from "react";

const CalmModeToggle = () => {
  const [calmMode, setCalmMode] = useState(false);

  useEffect(() => {
    if (calmMode) {
      document.body.classList.add("calm");
    } else {
      document.body.classList.remove("calm");
    }
  }, [calmMode]);

  return (
    <button onClick={() => setCalmMode(!calmMode)}>
      {calmMode ? "Exit Calm Mode" : "Enter Calm Mode"}
    </button>
  );
};

export default CalmModeToggle;
