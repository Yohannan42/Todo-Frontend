import React, { useState } from "react";
import "./MoodEstimator.css";

interface MoodEstimatorProps {
  onMoodSelect: (mood: string) => void;
  onClose: () => void;
}

const MoodEstimator: React.FC<MoodEstimatorProps> = ({ onMoodSelect, onClose }) => {
  const questions = [
    {
      question: "How much energy do you have today?",
      options: ["High", "Medium", "Low"],
    },
    {
      question: "How productive do you feel today?",
      options: ["Very Productive", "Productive", "Not Productive"],
    },
    {
      question: "How social do you feel today?",
      options: ["Talkative", "Neutral", "Quiet"],
    },
    {
      question: "What emotion best describes your day so far?",
      options: ["Happy", "Stressed", "Calm", "Anxious"],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);

  const handleOptionSelect = (option: string) => {
    setResponses([...responses, option]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Map responses to a mood
      const mood = determineMood(responses);
      onMoodSelect(mood);
      onClose();
    }
  };

  const determineMood = (responses: string[]): string => {
    // Simple logic to determine mood 
    if (responses.includes("Happy") || responses.includes("High")) return "Happy";
    if (responses.includes("Stressed") || responses.includes("Low")) return "Stressed";
    if (responses.includes("Calm")) return "Calm";
    return "Neutral";
  };

  return (
    <div className="mood-estimator-modal">
      <div className="modal-content">
        <h2>Mood Estimation</h2>
        <p>{questions[currentQuestion].question}</p>
        <div className="options">
          {questions[currentQuestion].options.map((option) => (
            <button key={option} onClick={() => handleOptionSelect(option)}>
              {option}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default MoodEstimator;
