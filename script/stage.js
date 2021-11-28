class Plate {
  constructor (THREE, CANNON, scene) {
    this._geometry = new THREE.BoxGeometry (1, 1, 1);
    this._material = new THREE.MeshBasicMaterial ({color: 0x00ff00});
    this._cube = new THREE.Mesh (this._geometry, this._material);
    scene.add (this._cube);
  }

  step (frame) {
  }
}

class Stage {
  constructor (THREE, CANNON, scene) {
    this._three = THREE;
    this._cannon = CANNON;
    this._scene = scene;
    this._plate = [];
  }

  setup () {
    for (var i = 0; i < 9; i++) {
      let plate = new Plate (this._three, this._cannon, this._scene);
      this._plate.push(plate);
    }
  }
  
  step (frame) {
  }
}
