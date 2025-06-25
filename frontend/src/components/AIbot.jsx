import React from "react";

const AI = () => {
  return (
    <div>
      <h1>How can I help?</h1>

      <section>
        <h2>How did it go with your goal this week?</h2>
        <p>Follow-up questions:</p>
        <ul>
          <li>What felt easy?</li>
          <li>What was challenging?</li>
        </ul>
        <textarea placeholder="Write your answer here..." />
      </section>

      <section>
        <h2>Answers to Common Questions </h2>
        <ul>
          <li>What is a SMART goal again?</li>
          <li>What’s included in the subscription?</li>
          <li>What happens if I miss one of my goals?</li>
        </ul>
      </section>

      <section>
        <h2>Motivation & Encouragement </h2>
        <p>“Keep going! You’re doing great.”</p>
        <p>Remember why you set your goal in the first place.</p>
      </section>

      <section>
        <h2>Journaling Prompts</h2>
        <ul>
          <li>Write down 3 things you're grateful for this week.</li>
          <li>How does it feel to be on the path toward your goal?</li>
        </ul>
        <textarea placeholder="Write your journal here..." />
      </section>
    </div>
  );
};

export default AI;
