import * as THREE from "three";
export function createFloorBoundarygraphics(positionZ: number) {
  const floorWidth = 8; // Adjust as needed
  const floorLength = 0.25; // Adjust as needed
  const floorHeight = 0.1; // Adjust as needed

  const floorGeometry = new THREE.BoxGeometry(
    floorWidth,
    floorHeight,
    floorLength
  );
  const floorMaterial = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
  }); // White color
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.z = positionZ;

  return floor;
}
