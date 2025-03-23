import React from "react";
import Spinner from "./Spinner";

/*
  Props:
    question: {
      id: string | number,
      q: string,
      a: string,
      loading: boolean
    }
    onRetry: function(questionId: string | number) => void
    onDelete: function(questionId: string | number) => void
*/

function QuestionItem({ question, onRetry, onDelete }) {
  const handleRetry = () => {
    onRetry(question.id);
  };

  const handleDelete = () => {
    onDelete(question.id);
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-start">
      <div className="ms-2 me-auto">
        <h4 style={{ color: "red" }}>{question.q}</h4>
        <div className="mt-2">
          {question.loading ? (
            <Spinner />
          ) : question.a ? (
            <div>
              <strong>Answer:</strong>{" "}
              <span dangerouslySetInnerHTML={{ __html: question.a }} />
            </div>
          ) : (
            <em>No answer yet</em>
          )}
        </div>
      </div>
      <div className="btn-group" role="group">
        <button className="btn btn-secondary me-2" onClick={handleRetry}>
          Retry
        </button>
        <button className="btn btn-outline-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default QuestionItem;
