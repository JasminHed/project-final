import React, { useState } from "react";

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [completed, setCompleted] = useState({
    intention: false,
    smartGoals: false,
    smartDetails: false,
  });
  const [showError, setShowError] = useState(false);

  const modules = [
    {
      key: "intention",
      title: "Intention",
      image: "notebook.jpg",
      content: (
        <>
          <p>
            Visualising your dream life isn't just a pleasant daydream - it's
            essential for making effective decisions. Ask yourself: What matters
            most in your life? Your answers - whether it's family, career, or
            travel—will reveal your core values.
          </p>
          <p>
            Visualise this dream life in detail – where you live, work, and the
            relationships you value. From this, determine short-term goals like
            specialised courses or travels and long-term goals like early
            retirement or starting a meaningful project. Note these visions, as
            they will guide your journey.
          </p>
          <p>
            The idea is that visions and goals can apply to all areas of your
            life—whether it's a career change, creating your dream lifestyle,
            improving your physical health, or anything else that matters to
            you.
          </p>
        </>
      ),
    },
    {
      key: "smartGoals",
      title: "SMART goals",
      image: "tablet.jpg",
      content: (
        <>
          <p>
            A well-crafted action plan is what stands between you and your
            dreams and it all starts with setting clear goals.
          </p>
          <p>
            Hitting a goal will ignite a blaze of possibilities, fuelling your
            ambitions. You're in control of your dreams, and there's no "wrong
            time" to set new goals. As long as you're determined and
            disciplined, you're set for success. Goals turn aspirations into
            focused targets, guiding your actions with purpose. By setting
            goals, you can track your progress. Ticking off achieved goals
            boosts excitement and motivates you to accomplish more.
          </p>
        </>
      ),
    },
    {
      key: "smartDetails",
      title: "SMART goals details",
      image: "tablet.jpg",
      content: (
        <div>
          <p>
            <strong>Specific</strong> - Instead of vague goals like "be
            healthier," be specific. Break improvement into concrete, actionable
            steps like "exercise 3 times a week." For even more precision,
            specify "walk 10,000 steps daily".
          </p>
          <p>
            <strong>Measurable</strong> - To track progress clearly, make your
            goal measurable. For example, if you want to find your first role in
            a new career, set a goal like "apply to 5 positions each month."
            Measure your progress by counting applications sent.
          </p>
          <p>
            <strong>Achievable</strong> - Achieve breakthroughs by taking
            realistic steps. Avoid setting unrealistic expectations that can
            demotivate you. If you want to start meditating, aim for 5 minutes a
            day at first instead of an hour immediately.
          </p>
          <p>
            <strong>Realistic</strong> - Challenge yourself, but don't set
            impossible missions. For instance, if you want to run a marathon,
            don't expect to do it next month if you're just starting. If you
            want to find your first job, don't expect to land your dream role
            immediately—set attainable steps toward it.
          </p>
          <p>
            <strong>Time-bound</strong> - Set deadlines to encourage focus and
            urgency. For example, decide to finish an online coding course
            within three months. Time-sensitive goals help keep you on track and
            motivated.
          </p>
        </div>
      ),
    },
  ];

  const currentModule = modules[currentSlide];

  const handleMarkComplete = () => {
    const moduleKey = currentModule.key;
    setCompleted((prev) => ({ ...prev, [moduleKey]: true }));
    setShowError(false);
  };

  const handleNext = () => {
    if (currentSlide < modules.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setShowError(false);
    }
  };

  const handleFinalNext = () => {
    // Navigate to next step
  };

  const allDone = Object.values(completed).every(Boolean);

  return (
    <div>
      <h1>Onboarding Modules</h1>
      <p>
        Please read and check off modules when done. This will take you to the
        next step.
      </p>

      <div>
        <img src={currentModule.image} alt={currentModule.title} />
        <h3>{currentModule.title}</h3>
        {currentModule.content}
      </div>

      {currentSlide > 0 && <button onClick={handlePrevious}>Previous</button>}

      {currentSlide < modules.length - 1 && (
        <button onClick={handleNext}>
          Next ({currentSlide + 1} of {modules.length})
        </button>
      )}
    </div>
  );
};

export default Onboarding;
