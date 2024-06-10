import React from "react";
import "./deathScreen.css";

interface DeathScreenProps {
  onRestart: () => void;
}

const DeathScreen: React.FC<DeathScreenProps> = ({ onRestart }) => {
  return (
    <div className="overlay">
      <div className="deathScreen">
        <h1>You Died</h1>
        <p>Your score was 132735.</p>

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
