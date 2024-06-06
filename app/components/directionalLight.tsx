import * as THREE from "three";
export function createDirectionalLight() {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true; // Enable shadow casting
  directionalLight.shadow.mapSize.width = 1024; // Shadow map width
  directionalLight.shadow.mapSize.height = 1024; // Shadow map height
  directionalLight.shadow.camera.near = 0.5; // Near plane of the shadow camera
  directionalLight.shadow.camera.far = 100; // Far plane of the shadow camera

  return directionalLight;
}
