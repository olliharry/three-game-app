import React from "react";
import "./startScreen.css";

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="overlayy">
      <div className="startScreen">
        <h1>Welcome to awd</h1>
        <p>Use arrow keys to move and spacebar to jump.</p>
        <p>Dodge the cubes.</p>
        <p>Stay on the platform in between the green lines.</p>
        <button id="startButton" className="startButton" onClick={onStart}>
          Start Game
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
