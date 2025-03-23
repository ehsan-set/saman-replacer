import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

/*
  Props:
    show: boolean - controls whether the modal is visible
    onClose: function() => void - called to close the modal
*/

function SettingsModal({ show, onClose }) {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [speechLang, setSpeechLang] = useState("en-US");

  useEffect(() => {
    // Load settings from cookies on mount
    const storedApiKey = Cookies.get("openai_api_key") || "";
    const storedModel = Cookies.get("openai_model") || "gpt-3.5-turbo";
    const storedLang = Cookies.get("speech_lang") || "en-US";

    setApiKey(storedApiKey);
    setModel(storedModel);
    setSpeechLang(storedLang);
  }, []);

  const handleSave = () => {
    // Save all settings to cookies
    Cookies.set("openai_api_key", apiKey, { expires: 365 });
    Cookies.set("openai_model", model, { expires: 365 });
    Cookies.set("speech_lang", speechLang, { expires: 365 });

    onClose();
  };

  // If 'show' is false, we can hide the modal with a simple conditional
  // Or use a fade / transition in Bootstrap by toggling class names.
  if (!show) {
    return null;
  }

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Settings</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="apiKey" className="form-label">
                OpenAI API Key
              </label>
              <input
                type="text"
                className="form-control"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenAI API Key"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="modelSelect" className="form-label">
                GPT Model
              </label>
              <select
                className="form-select"
                id="modelSelect"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                <option value="gpt-4">gpt-4</option>
                {/* Add other models as needed */}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="speechLang" className="form-label">
                Speech Recognition Language
              </label>
              <input
                type="text"
                className="form-control"
                id="speechLang"
                value={speechLang}
                onChange={(e) => setSpeechLang(e.target.value)}
                placeholder="e.g. en-US"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
