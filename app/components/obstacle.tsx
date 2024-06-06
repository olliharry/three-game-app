import * as THREE from "three";
export function createObstaclegraphics(
  spawnX: number,
  spawnY: number,
  spawnZ: number
) {
  const floorGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const floorMaterial = new THREE.MeshLambertMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide,
  });
  const obstacle = new THREE.Mesh(floorGeometry, floorMaterial);
  obstacle.castShadow = true;
  obstacle.position.y = spawnY;
  obstacle.position.z = spawnZ;
  obstacle.position.x = spawnX;

  return obstacle;
}
