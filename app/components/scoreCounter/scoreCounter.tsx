import React from "react";
import "./scoreCounter.css";

interface ScoreCounterProps {
  score: number;
}

const ScoreCounter: React.FC<ScoreCounterProps> = ({ score }) => {
  return (
    <div className="scoreContainer">
      <p className="scoreText">SCORE: {score}</p>
    </div>
  );
};

export default ScoreCounter;
