// src/utils/localStorageHelpers.js

const QUESTIONS_KEY = "savedQuestions";
const CONTEXT_NOTE_KEY = "contextNote";

// Save questions array to localStorage
export function saveQuestions(questions) {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
}

// Retrieve questions array from localStorage
export function loadQuestions() {
  const stored = localStorage.getItem(QUESTIONS_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save context note to localStorage
export function saveContextNote(note) {
  localStorage.setItem(CONTEXT_NOTE_KEY, note);
}

// Retrieve context note from localStorage
export function loadContextNote() {
  return localStorage.getItem(CONTEXT_NOTE_KEY) || "";
}

// Clear all data
export function clearAllData() {
  localStorage.removeItem(QUESTIONS_KEY);
  localStorage.removeItem(CONTEXT_NOTE_KEY);
}
