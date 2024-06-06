import * as THREE from "three";
export function createFloorgraphics() {
  const floorWidth = 8; // Adjust as needed
  const floorLength = 1000; // Adjust as needed
  const floorHeight = 1; // Adjust as needed

  const floorGeometry = new THREE.BoxGeometry(
    floorWidth,
    floorHeight,
    floorLength
  );
  const floorMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  }); // White color
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.receiveShadow = true;
  floor.position.y = -0.5;

  return floor;
}
