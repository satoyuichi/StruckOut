class Plate {
  static _length = 0.6;
  
  constructor (ev) {
    this._geometry = new ev.three.BoxGeometry (Plate._length, Plate._length, 0.01);
    this._material = new ev.three.MeshBasicMaterial ({color: 0xdddddd});
    this._mesh = new ev.three.Mesh (this._geometry, this._material);
    ev.scene.add (this._mesh);
  }

  step (frame) {
  }

  set position (v) {
    this._mesh.position.x = v.x;
    this._mesh.position.y = v.y;
    this._mesh.position.z = v.z;
  }
}

export class Stage {
  constructor (ev) {
    this._environment = ev;
    this._plate = [];
  }

  setup () {
    const w = Plate._length;
    const h = Plate._length;
    const s = 0.05;
    const platePositions = [
      {x: -1.5 * w, y: -1.5 * h, z: 0.0},
      {x: 0.0, y: -1.5 * h, z: 0.0},
      {x: 1.5 * w, y: -1.5 * h, z: 0.0},

      {x: -1.5 * w, y: 0.0, z: 0.0},
      {x: 0.0, y: 0.0, z: 0.0},
      {x: 1.5 * w, y: 0.0, z: 0.0},

      {x: -1.5 * w, y: 1.5 * h, z: 0.0},
      {x: 0.0, y: 1.5 * h, z: 0.0},
      {x: 1.5 * w, y: 1.5 * h, z: 0.0},
    ];

    for (var i = 0; i < 9; i++) {
      let plate = new Plate (this._environment);
      let p = platePositions[i];
      let v = new this._environment.three.Vector3(p.x, p.y + 1.5, p.z);
      plate.position = v;
      this._plate.push(plate);
    }

    this.createFloor ();
  }

  createFloor () {
    const ev = this._environment;
    const geometry = new ev.three.PlaneGeometry( 100, 100 );
    const material = new ev.three.MeshBasicMaterial( {color: 0xffffff, side: ev.three.DoubleSide} );
    const plane = new ev.three.Mesh( geometry, material );
    plane.rotation.x = 90;
    ev.scene.add( plane );    
  }
  
  step (frame) {
    for (var p of this._plate) {
      p.step ();
    }
  }
}
