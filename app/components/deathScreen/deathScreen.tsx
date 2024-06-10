import React from "react";
import "./deathScreen.css";

interface DeathScreenProps {
  onRestart: () => void;
  score: number;
}

const DeathScreen: React.FC<DeathScreenProps> = ({ onRestart, score }) => {
  return (
    <div className="overlay">
      <div className="deathScreen">
        <h1>You Died</h1>
        <p>Your score was {score}</p>

        <button
          id="restartButton"
          className="restartButton"
          onClick={onRestart}
        >
          Restart Game
        </button>
      </div>
    </div>
  );
};

export default DeathScreen;
