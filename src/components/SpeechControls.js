import React, { useState, useEffect, useRef } from "react";
import useLocalStorageState from "use-local-storage-state";
/*
  Props:
    onAddQuestion: function(finalTranscript: string) => void
      - Called when speech input is finalized and we need to add a new question
    onReset: function() => void
      - Called when the user clicks the Reset button to clear all questions
*/

function SpeechControls({ onAddQuestion, onReset }) {
  const [contextNote, setContextNote] = useLocalStorageState("contextNote");
  const [isRecording, setIsRecording] = useState(false);
  const [partialTranscript, setPartialTranscript] = useState("");
  const recognitionRef = useRef(null);

  // // Load the context note from localStorage on mount
  // useEffect(() => {
  //   const savedNote = localStorage.getItem("contextNote") || "";
  //   setContextNote(savedNote);
  // }, []);

  // // Save the context note to localStorage whenever it changes
  // useEffect(() => {
  //   localStorage.setItem("contextNote", contextNote);
  // }, [contextNote]);

  // Initialize and configure speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition is not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.interimResults = true; // Capture partial transcripts
    recognitionRef.current.lang = "en-US"; // Could be set from user settings
    recognitionRef.current.continuous = false; // Stop automatically on pause in speech

    // Handle speech recognition results
    recognitionRef.current.onresult = (event) => {
      let interimTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (!event.results[i].isFinal) {
          // Append partial result
          interimTranscript += transcriptChunk;
        } else {
          // Final result: add question and clear live dictation text
          onAddQuestion(transcriptChunk);
        }
      }
      setPartialTranscript(interimTranscript);
    };

    // When recognition ends, stop showing partial transcript
    recognitionRef.current.onend = () => {
      setIsRecording(false);
      setPartialTranscript("");
    };
  }, [onAddQuestion]);

  // Start recording on mouse down
  const handleRecordStart = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  // Stop recording on mouse up
  const handleRecordStop = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  // Update the context note when the user types in it
  const handleContextChange = (e) => {
    setContextNote(e.target.value);
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="mb-2">
        {/* Manual context note input */}
        <label htmlFor="contextNote" className="form-label">
          Context Note
        </label>
        <textarea
          id="contextNote"
          className="form-control"
          rows="5"
          value={contextNote}
          onChange={handleContextChange}
          placeholder="Type your context note here..."
        />
      </div>

      {/* Live dictation display */}
      <div className="mb-2">
        <label className="form-label">Live Dictation</label>
        <div
          className="border p-2"
          style={{ minHeight: "80px", backgroundColor: "#f1f1f1" }}
        >
          {isRecording ? partialTranscript : ""}
        </div>
      </div>

      <div className="mt-auto mb-auto">
        <div className="d-flex d-flex justify-content-center align-items-center ">
          <button
            className="btn btn-primary me-5"
            onMouseDown={handleRecordStart}
            onMouseUp={handleRecordStop}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Record
          </button>
          <button
            className="btn btn-danger"
            onClick={onReset}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default SpeechControls;
