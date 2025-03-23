import React, { useState, useRef } from "react";

function DictationComponent() {
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const startListening = () => {
    // Check for SpeechRecognition API support (including iPad/Safari)
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    // Create a new instance of SpeechRecognition
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // Change language if needed
    recognition.continuous = false; // Stop automatically after one phrase
    recognition.interimResults = false; // Only use final results

    // Event handler when a result is obtained
    recognition.onresult = (event) => {
      // Grab the transcript from the first (and only) result
      const resultText = event.results[0][0].transcript;
      setTranscript(resultText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
    };

    // Store the recognition instance if needed later and start listening
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div style={{ padding: "1rem" }}>
      <button
        onClick={startListening}
        style={{ padding: "0.5rem 1rem", fontSize: "16px" }}
      >
        Start Listening
      </button>
      <div
        style={{
          marginTop: "20px",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <h3>Dictated Text:</h3>
        <p>{transcript}</p>
      </div>
    </div>
  );
}

export default DictationComponent;
