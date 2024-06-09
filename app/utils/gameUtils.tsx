import * as THREE from "three";

function checkIsDead(position: THREE.Vector3) {
  if (
    position.z > 3 ||
    position.z < -3 ||
    position.y < -5 ||
    position.x > 10 ||
    position.x < -10
  ) {
    return true;
  }
  return false;
}

export default checkIsDead;
