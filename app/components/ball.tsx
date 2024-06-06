import * as THREE from "three";
export function createBallgraphics() {
  const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const ballMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 }); // Red color
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.castShadow = true;
  return ball;
}
