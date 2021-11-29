class Plate {
  constructor (ev) {
    this._geometry = new ev.three.BoxGeometry (1, 1, 1);
    this._material = new ev.three.MeshBasicMaterial ({color: 0x00ff00});
    this._cube = new ev.three.Mesh (this._geometry, this._material);
    ev.scene.add (this._cube);
  }

  step (frame) {
  }
}

export class Stage {
  constructor () {
    this._plate = [];
  }

  setup (environment) {
    for (var i = 0; i < 9; i++) {
      let plate = new Plate (environment);
      this._plate.push(plate);
    }
  }
  
  step (frame) {
  }
}
