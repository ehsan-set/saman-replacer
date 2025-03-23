import React from "react";
import QuestionItem from "./QuestionItem";

/*
  Props:
    questions: Array of {
      id: string | number,
      q: string,
      a: string,
      loading: boolean
    }
    onRetry: function(questionId: string | number) => void
    onDelete: function(questionId: string | number) => void
*/

function QuestionList({ questions, onRetry, onDelete }) {
  return (
    <div>
      <h3>Questions</h3>
      {questions.length === 0 ? (
        <p>No questions yet.</p>
      ) : (
        <ul className="list-group">
          {questions.map((q) => (
            <QuestionItem
              key={q.id}
              question={q}
              onRetry={onRetry}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default QuestionList;
