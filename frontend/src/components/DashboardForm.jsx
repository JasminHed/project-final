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
  font-size: 18px;
  color: ${(props) => props.color || "black"};
`;

const SMART_FIELDS = [
  "specific",
  "measurable",
  "achievable",
  "relevant",
  "timebound",
];

const DashboardForm = ({
  goal,
  onFieldChange,
  onStartToggle,
  onComplete,
  onShare,
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
            <TagLabel>
              <Icon color="var(--color-success)">
                <FaRocket />
              </Icon>
              <span>Set as started</span>
              <input
                type="checkbox"
                checked={goal.started || false}
                onChange={onStartToggle}
                aria-label="Mark goal as started"
              />
            </TagLabel>
            <TagLabel
              onClick={() => onComplete(goal._id)}
              aria-label="Mark goal as completed - goal will be removed"
            >
              <Icon color="var(--color-button-bg)">
                <FaTrophy />
              </Icon>
              <span>Mark as complete (will be removed)</span>
            </TagLabel>
            <TagLabel onClick={() => onShare(goal._id)}>
              <Icon color="var(--color-focus)">
                <FaBullhorn />
              </Icon>
              <span>
                {goal.shareToCommunity
                  ? "Unshare from community"
                  : "Share to community"}
              </span>
            </TagLabel>

            <h1 id={`goal-title-${goal._id}`}>Your Intention</h1>
            <Label htmlFor={`intention-${goal._id}`}></Label>

            <Textarea
              id={`intention-${goal._id}`}
              rows={2}
              value={goal.intention || ""}
              readOnly
            />

            <h2 id={`details-title-${goal._id}`}>Your detailed goals</h2>
            {SMART_FIELDS.map((field) => (
              <div key={field}>
                <strong>
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </strong>
                <Label htmlFor={`${field}-${goal._id}`} />
                <Textarea
                  id={`${field}-${goal._id}`}
                  rows={2}
                  value={goal[field] || ""}
                  readOnly
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
