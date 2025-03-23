import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import SpeechControls from "./components/SpeechControls";
import QuestionList from "./components/QuestionList";
import SettingsModal from "./components/SettingsModal";
import DictationComponent from "./components/DictationComponent";
import { streamChatGPTAnswer } from "./services/chatgptService";
import {
  saveQuestions,
  loadQuestions,
  clearAllData,
} from "./utils/localStorageHelpers";

function App() {
  const [questions, setQuestions] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Load questions from localStorage on mount and sort by newest (highest id first)
    const storedQuestions = loadQuestions();
    const sortedQuestions = storedQuestions.sort((a, b) => b.id - a.id);
    setQuestions(sortedQuestions);
  }, []);

  // Persist questions to localStorage whenever they change
  useEffect(() => {
    saveQuestions(questions);
  }, [questions]);

  // Add a new question with loading = true and stream answer tokens
  const handleAddQuestion = async (qText) => {
    const newQuestion = {
      id: Date.now(),
      q: qText.trim(),
      a: "",
      loading: true,
    };
    // Prepend the new question so that it's always on top
    setQuestions((prev) => [newQuestion, ...prev]);
    // Start streaming the answer
    fetchAnswer(newQuestion.id, qText.trim());
  };

  // Fetch answer as a stream and update UI incrementally
  const fetchAnswer = async (questionId, qText) => {
    const contextNote = localStorage.getItem("contextNote") || "";
    try {
      streamChatGPTAnswer(qText, contextNote, (token, currentAnswer) => {
        // For each token chunk received, update the corresponding question's answer

        setQuestions((prev) =>
          prev.map((q) => {
            if (q.id === questionId) {
              q.a = currentAnswer;
            }
            return q;
            //q.id === questionId ? { ...q, a: currentAnswer } : q
          })
        );
      });
      // Mark as finished loading when stream is done
      updateQuestion(questionId, { loading: false });
    } catch (err) {
      console.error("Error streaming answer:", err);
      updateQuestion(questionId, { loading: false });
    }
  };

  // Generic function to update a question by ID
  const updateQuestion = (questionId, updates) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
    );
  };

  // Retry sending the same question
  const handleRetry = (questionId) => {
    const qObj = questions.find((q) => q.id === questionId);
    if (!qObj) return;
    updateQuestion(questionId, { loading: true, a: "" });
    fetchAnswer(questionId, qObj.q);
  };

  // Delete a question
  const handleDelete = (questionId) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  // Reset clears all questions (and optionally the context note)
  const handleReset = () => {
    clearAllData(); // Clears localStorage items for questions + context
    setQuestions([]);
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Speech App</h1>
        <button className="btn btn-info" onClick={() => setShowSettings(true)}>
          Settings
        </button>
      </div>

      <div className="row">
        {/* Left Column */}
        <div className="col-4 height-100">
          <SpeechControls
            onAddQuestion={handleAddQuestion}
            onReset={handleReset}
          />
          <DictationComponent />
        </div>

        {/* Right Column */}
        <div className="col-8">
          <QuestionList
            questions={questions}
            onRetry={handleRetry}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

export default App;
