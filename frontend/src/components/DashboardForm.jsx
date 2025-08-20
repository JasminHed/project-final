import React from "react";
import styled from "styled-components";
import { FaRocket, FaTrophy, FaBullhorn } from "react-icons/fa";

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

const SuccessMessage = styled.p`
  color: var(--color-success);
  margin-top: 8px;
  font-size: 14px;
`;

const TagLabel = styled.label`
  width: 200px;
  display: inline-flex;
  align-items: center;
  background-color: #e0f7fa;
  color: black;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: #b2ebf2;
    transform: translateY(-2px);
  }

  input {
    margin-left: 8px;
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
  successMessage,
  shareSuccessMessage,
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
              <Icon color="#4dabf5">
                <FaRocket />
              </Icon>
              <span>Started</span>
              <input
                type="checkbox"
                checked={goal.started || false}
                onChange={onStartToggle}
                aria-label="Mark goal as started"
              />
            </TagLabel>
            <TagLabel>
              <Icon color="#ffb74d">
                <FaTrophy />
              </Icon>
              <span>Completed</span>
              <input
                type="checkbox"
                checked={goal.completed || false}
                onChange={() => onComplete(goal._id)}
                aria-label="Mark goal as completed"
              />
            </TagLabel>
            <TagLabel>
              <Icon color="#ba68c8">
                <FaBullhorn />
              </Icon>
              <span>
                {goal.shareToCommunity
                  ? "Post shared to community!"
                  : "Share to community"}
              </span>
              <input
                type="checkbox"
                checked={goal.shareToCommunity || false}
                onChange={() => onShare(goal._id)}
                aria-label="Share goal to community"
              />
            </TagLabel>

            {["personal", "professional"].map(
              (tag) =>
                goal[tag] && (
                  <TagLabel key={tag} tabIndex={0} aria-label={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </TagLabel>
                )
            )}

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

      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {shareSuccessMessage && (
        <SuccessMessage>{shareSuccessMessage}</SuccessMessage>
      )}
    </div>
  );
};

export default DashboardForm;
