import React from "react";
import "./startScreen.css";

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="overlay">
      <div className="startScreen">
        <h1>Welcome to GAMENAME</h1>
        <p>Use WASD keys to move and spacebar to jump.</p>
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
