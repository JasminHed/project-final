import React from "react";
import { FaBullhorn, FaRocket, FaTrophy } from "react-icons/fa";
import styled from "styled-components";

import { FormCard, Textarea } from "../styling/FormCard.jsx";

const Fieldset = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
  margin-bottom: 40px;
`;

const Label = styled.label`
  display: block;

  font-weight: 500;
  margin-bottom: 8px;
  color: var(--color-text-primary);
`;

const TagLabel = styled.label`
  max-width: 300px;
  display: inline-flex;
  align-items: center;
  color: var(--color-text-primary);
  padding: 12px 12px;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s, transform 0.2s;

  input {
    margin-left: 6px;
    cursor: pointer;
  }
`;

const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  font-size: 20px;
  color: ${(props) => props.color || "black"};
`;

const ActionButton = styled.button`
  max-width: 300px;
  width: 250px;
  display: inline-flex;
  align-items: center;
  color: var(--color-text-primary);
  padding: 12px 12px;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s, transform 0.2s;
  border: none;
  background: none;
`;

const SMART_FIELDS = [
  { key: "specific", label: "Specific" },
  { key: "measurable", label: "Measurable" },
  { key: "achievable", label: "Achievable" },
  { key: "relevant", label: "Relevant" },
  { key: "timebound", label: "Time-bound" },
];

const DashboardForm = ({
  goal,
  //onFieldChange,
  onStartToggle,
  onComplete,
  onShare,
  onSave,
}) => {
  return (
    <div aria-labelledby={`goal-title-${goal._id}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(goal._id);
        }}
      >
        <Fieldset>
          <FormCard>
            <ActionButton onClick={onStartToggle}>
              <Icon color="#ff6584">
                <FaRocket />
              </Icon>
              <span>{goal.started ? "Started" : "Start"}</span>
            </ActionButton>
            <ActionButton
              type="button"
              onClick={() => onComplete(goal._id)}
              aria-label="Mark goal as completed - goal will be removed"
            >
              <Icon color="var(--color-button-bg)">
                <FaTrophy />
              </Icon>
              <span>Mark as complete </span>
            </ActionButton>
            <ActionButton type="button" onClick={() => onShare(goal._id)}>
              <Icon color="#6c63ff">
                <FaBullhorn />
              </Icon>
              <span>
                {goal.shareToCommunity
                  ? "Unshare from community"
                  : "Share to community"}
              </span>
            </ActionButton>

            <h1 id={`goal-title-${goal._id}`}>Your Intention</h1>

            <Textarea
              id={`intention-${goal._id}`}
              rows={2}
              value={goal.intention || ""}
              readOnly
              aria-describedby={`goal-title-${goal._id}`}
            />

            <h2 id={`details-title-${goal._id}`}>Your detailed goals</h2>
            {SMART_FIELDS.map(({ key, label }) => (
              <div key={key}>
                <Label htmlFor={`${key}-${goal._id}`}>{label}</Label>
                <Textarea
                  id={`${key}-${goal._id}`}
                  rows={2}
                  value={goal[key] || ""}
                  readOnly
                  aria-describedby={`details-title-${goal._id}`}
                />
              </div>
            ))}
          </FormCard>
        </Fieldset>
      </form>
    </div>
  );
};

export default DashboardForm;
