// components/Scene.tsx
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as CANNON from "cannon";
import { createBallgraphics } from "./ball";
import { createFloorgraphics } from "./floor";
import { createDirectionalLight } from "./directionalLight";
import { createObstaclegraphics } from "./obstacle";
import { createFloorBoundarygraphics } from "./floorBoundary";
import StartScreen from "./startScreen/startScreen";
import checkIsDead from "../utils/gameUtils";
import DeathScreen from "./deathScreen/deathScreen";
import ScoreCounter from "./scoreCounter/scoreCounter";

interface Obstacle {
  mesh: THREE.Mesh;
  body: CANNON.Body;
}

const Scene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  //const [isPaused, setIsPaused] = useState(true);
  const isPaused = useRef<boolean>(true);
  const [isAlive, setIsAlive] = useState(true);
  const [score, setScore] = useState(0);
  const obstacles: Obstacle[] = [];
  const ball = useRef<THREE.Mesh | null>(null);
  const ballBody = useRef<CANNON.Body | null>(null);

  useEffect(() => {
    let oldTime: number = 0.1;
    function createObstacle(elaspedTime: number) {
      const x = Math.random() * (4 - -4) + -4; // Random x position
      const y = Math.random() * (3 - 0.5) + 0.5; // Random y position (height)
      const z = -100; // Random z position

      // Create graphical obstacle
      const obstacle = createObstaclegraphics(x, y, z);
      scene.add(obstacle);

      // Create physics body for the obstacle
      const obstacleShape = new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25));
      const obstacleBody = new CANNON.Body({ mass: 1 });
      obstacleBody.addShape(obstacleShape);
      obstacleBody.position.set(x, y, z);
      const obstacleMat = new CANNON.Material("obstacle");
      obstacleBody.material = obstacleMat;
      world.addBody(obstacleBody);

      obstacleBody.velocity.z = Math.random() * (20 - 5) + 5;

      obstacles.push({ mesh: obstacle, body: obstacleBody });
      const obstacleContactMaterial = new CANNON.ContactMaterial(
        obstacleMat, // Material A
        floorMat, // Material B

        {
          restitution: 1, // Adjust restitution coefficient as needed
          friction: 0, // Adjust friction coefficient as needed
        }
      );
      world.addContactMaterial(obstacleContactMaterial);
    }

    function removeObstacle(mesh: THREE.Mesh, body: CANNON.Body) {
      // Remove the mesh from the Three.js scene
      scene.remove(mesh);

      // Dispose of the mesh's geometry and material to free up resources
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material: THREE.Material) => material.dispose());
      } else {
        mesh.material.dispose();
      }

      // Remove the body from the Cannon.js world
      world.remove(body);
    }

    if (!mountRef.current) return;

    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Create Cannon.js world
    const world = new CANNON.World();
    world.gravity.set(0, -10, 0); // Set gravity

    // Create geometry for the ball

    ball.current = createBallgraphics();

    scene.add(ball.current);

    //Create Floor Boundary graphic
    const floorBoundaryMax = createFloorBoundarygraphics(-3);
    const floorBoundaryMin = createFloorBoundarygraphics(3);
    scene.add(floorBoundaryMax);
    scene.add(floorBoundaryMin);

    // Create Cannon.js ball shape and body
    const ballShape = new CANNON.Sphere(0.5);
    ballBody.current = new CANNON.Body({ mass: 1, shape: ballShape });
    ballBody.current.position.set(0, 1, 0); // Initial position
    const ballMat = new CANNON.Material("ball");
    ballBody.current.material = ballMat;
    world.addBody(ballBody.current);

    // Create geometry and material for the floor
    const floor = createFloorgraphics();
    scene.add(floor);

    const floorShape = new CANNON.Box(new CANNON.Vec3(4, 200, 1));
    const floorBody = new CANNON.Body({ mass: 0, shape: floorShape });
    const floorMat = new CANNON.Material("ball");
    floorBody.material = floorMat;
    floorBody.position.set(0, -1, 0);
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    ); // Rotate to match Three.js floor
    world.addBody(floorBody);

    const ballContactMaterial = new CANNON.ContactMaterial(
      ballMat, // Material A
      floorMat, // Material B

      {
        restitution: 0.5, // Adjust restitution coefficient as needed
        friction: 10000, // Adjust friction coefficient as needed
      }
    );
    world.addContactMaterial(ballContactMaterial);

    // Add lights to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = createDirectionalLight();
    scene.add(directionalLight);

    // Position the camera
    camera.position.z = 5;
    camera.position.y = 3;
    camera.rotation.set(-Math.PI / 7.5, 0, 0);

    // Event listener for spacebar keydown event
    const spaceDown = (event: KeyboardEvent) => {
      if (ballBody.current)
        if (
          event.code === "Space" &&
          !isJumping &&
          ballBody.current.position.y <= 2 &&
          ballBody.current
        ) {
          // Apply an impulse to the ball's body in the upward direction
          ballBody.current.velocity.y = 0;
          ballBody.current.applyImpulse(
            new CANNON.Vec3(0, 6, 0),
            ballBody.current.position
          );

          // Set isJumping to true to prevent multiple jumps in quick succession
          setIsJumping(true);
        }
    };

    // Event listener for spacebar keyup event
    const spaceUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        // Reset the jumping flag when the spacebar is released
        setIsJumping(false);
      }
    };

    const ADown = (event: KeyboardEvent) => {
      if (event.code === "KeyA" && ballBody.current) {
        if (ballBody.current.velocity.x > 1) {
          ballBody.current.velocity.x = 0;
        }
        //ballBody.applyForce(new CANNON.Vec3(-5, 0, 0), ballBody.position);
        ballBody.current.velocity.x = -2;
      }
    };

    const DDown = (event: KeyboardEvent) => {
      if (event.code === "KeyD" && ballBody.current) {
        if (ballBody.current.velocity.x < 1) {
          ballBody.current.velocity.x = 0;
        }
        //ballBody.applyForce(new CANNON.Vec3(+5, 0, 0), ballBody.position);
        ballBody.current.velocity.x = +2;
      }
    };

    const WDown = (event: KeyboardEvent) => {
      if (event.code === "KeyW" && ballBody.current) {
        if (ballBody.current.velocity.x > 1) {
          ballBody.current.velocity.z = 0;
        }
        //ballBody.applyForce(new CANNON.Vec3(-5, 0, 0), ballBody.position);
        ballBody.current.velocity.z = -2;
      }
    };

    const SDown = (event: KeyboardEvent) => {
      if (event.code === "KeyS" && ballBody.current) {
        if (ballBody.current.velocity.x < 1) {
          ballBody.current.velocity.z = 0;
        }
        //ballBody.applyForce(new CANNON.Vec3(+5, 0, 0), ballBody.position);
        ballBody.current.velocity.z = +2;
      }
    };

    // Add event listeners
    document.addEventListener("keydown", spaceDown);
    document.addEventListener("keyup", spaceUp);
    document.addEventListener("keydown", ADown);
    document.addEventListener("keydown", DDown);
    document.addEventListener("keydown", WDown);
    document.addEventListener("keydown", SDown);

    function updatePhysics(deltaTime: number) {
      world.step(1 / 60, deltaTime, 3); // Step the physics world with deltaTime

      // Update the Three.js objects to match the physics bodies
      obstacles.forEach(({ mesh, body }) => {
        if (body.position.y < -2 || body.position.z > 5) {
          removeObstacle(mesh, body);
          return;
        }
        const speed = Math.abs(body.velocity.z);

        const color = new THREE.Color();
        const hue = THREE.MathUtils.mapLinear(speed, 0, 10, 0.66, 0);
        color.setHSL(hue, 1, 0.5);
        mesh.material = new THREE.MeshLambertMaterial({
          color,
          side: THREE.DoubleSide,
        });

        mesh.position.copy(body.position);
        mesh.quaternion.copy(body.quaternion);
      });
    }

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      if (isPaused.current) {
        return;
      }
      const deltaTime = clock.getDelta();
      world.step(deltaTime); // Step the physics simulation

      if (clock.elapsedTime >= oldTime && !showStartScreen) {
        createObstacle(clock.getElapsedTime());
        oldTime = oldTime * 0.99 + 1;
      }

      // Update positions of Three.js objects based on Cannon.js simulation
      if (ball.current && ballBody.current) {
        ball.current.position.copy(ballBody.current.position);
        ball.current.quaternion.copy(ballBody.current.quaternion);
      }

      updatePhysics(deltaTime);
      renderer.shadowMap.autoUpdate = true;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
      setScore(obstacles.length);

      if (ball.current && checkIsDead(ball.current.position)) {
        clock.elapsedTime = 0;
        isPaused.current = true;
        setIsAlive(false);
      }
    };
    animate();

    // Clean up on component unmount
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [showStartScreen, isAlive, isPaused]);

  const handleStart = () => {
    setShowStartScreen(false);
    isPaused.current = false;
  };
  const handleRestart = () => {
    setIsAlive(true);
    isPaused.current = false;
  };

  return (
    <div>
      {!isAlive && <DeathScreen onRestart={handleRestart} score={score} />}
      {isAlive && !showStartScreen && <ScoreCounter score={score} />}
      {showStartScreen && <StartScreen onStart={handleStart} />}
      <div ref={mountRef} id="gameContainer" />
    </div>
  );
};

export default Scene;
