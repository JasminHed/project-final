import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
  flex-wrap: wrap;
`;

const SuccessMessage = styled.p`
  color: var(--color-success);
  margin-top: 8px;
  font-size: 14px;
`;

const TagLabel = styled.label`
  display: inline-block;
  background-color: #e0f7fa;
  color: black;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
`;

const SMART_FIELDS = [
  "specific",
  "measurable",
  "achievable",
  "relevant",
  "timebound",
];

const tagPool = [
  { id: "personal", label: "Personal" },
  { id: "professional", label: "Professional" },
];

const GoalForm = ({
  goal,
  onIntentionChange,
  onFieldChange,
  onSave,
  onComplete,
  onShare,
  successMessage,
  shareSuccessMessage,
}) => {
  const handleDragEnd = (result) => {
    const { draggableId, destination } = result;
    if (!destination) return;

    if (destination.droppableId === goal._id) {
      onFieldChange(goal._id, draggableId)({ target: { checked: true } });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div aria-labelledby={`goal-title-${goal._id}`}>
        <Droppable droppableId="tags-pool" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
            >
              {tagPool.map((tag, index) => (
                <Draggable key={tag.id} draggableId={tag.id} index={index}>
                  {(provided) => (
                    <TagLabel
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      tabIndex={0}
                      aria-label={tag.label}
                    >
                      {tag.label}
                    </TagLabel>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(goal._id);
          }}
        >
          <Fieldset>
            <FormCard>
              <Droppable droppableId={goal._id}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <TagLabel>
                      <label>
                        <input
                          type="checkbox"
                          checked={goal.started || false}
                          onChange={(e) =>
                            onFieldChange(goal._id, "started")(e)
                          }
                        />
                        Started
                      </label>
                    </TagLabel>

                    {["personal", "professional"].map(
                      (tag) =>
                        goal[tag] && (
                          <TagLabel key={tag} tabIndex={0} aria-label={tag}>
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </TagLabel>
                        )
                    )}

                    {provided.placeholder}

                    <h1 id={`goal-title-${goal._id}`}>Your Intention</h1>
                    <Label htmlFor={`intention-${goal._id}`}></Label>
                    <Textarea
                      id={`intention-${goal._id}`}
                      rows={2}
                      maxLength={150}
                      value={goal.intention || ""}
                      onChange={onIntentionChange(goal._id)}
                    />
                    <p>{(goal.intention || "").length}/150</p>
                  </div>
                )}
              </Droppable>

              <FormCard>
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
                      maxLength={150}
                      value={goal[field] || ""}
                      onChange={onFieldChange(goal._id, field)}
                    />
                    <p>{(goal[field] || "").length}/150</p>
                  </div>
                ))}
              </FormCard>
            </FormCard>
          </Fieldset>

          <ButtonContainer>
            <button type="submit">Save this goal</button>
            <button type="button" onClick={() => onComplete(goal._id)}>
              Mark goal as completed
            </button>
            <button type="button" onClick={() => onShare && onShare(goal._id)}>
              Share to Community
            </button>
          </ButtonContainer>
        </form>

        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        {shareSuccessMessage && (
          <SuccessMessage>{shareSuccessMessage}</SuccessMessage>
        )}
      </div>
    </DragDropContext>
  );
};

export default GoalForm;
