import React, { useState, useRef } from "react";

function DictationComponent({ onAddQuestion, onReset }) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const toggleListening = () => {
    if (!isListening) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false; // Stop automatically after a phrase
      recognition.interimResults = false; // Only use final results

      recognition.onresult = (event) => {
        const resultText = event.results[0][0].transcript;
        // Update transcript state and notify parent
        setTranscript(resultText);
        onAddQuestion(resultText);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  };

  // Reset only the transcript (input)
  const resetTranscript = () => {
    setTranscript("");
    // Optionally notify parent with an empty transcript update:
    //onAddQuestion("");
  };

  // Handle manual edits and update parent on every change.
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setTranscript(newValue);
    if (newValue.trim().length > 0) {
      console.log("asking...");
      onAddQuestion(newValue);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <textarea
        style={{
          marginTop: "20px",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          width: "100%",
          minHeight: "100px",
        }}
        value={transcript}
        onChange={handleInputChange}
        placeholder="Dictated text will appear here. You can also edit it manually..."
      />
      <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
        <button onClick={toggleListening} className="btn btn-lg btn-primary">
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>
        <button onClick={resetTranscript} className="btn btn-lg btn-danger">
          Reset Input
        </button>
      </div>
      <button onClick={onReset} className="btn btn-lg btn-warning">
        <br />
        Reset Questions
      </button>
    </div>
  );
}

export default DictationComponent;
