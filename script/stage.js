class Plate {
  static _length = 0.6;
  
  constructor (ev, material) {
    this._geometry = new ev.three.BoxGeometry (Plate._length, Plate._length, 0.02);
    this._material = material;
    this._mesh = new ev.three.Mesh (this._geometry, this._material);
    ev.scene.add (this._mesh);

    const halfExtents = new ev.cannon.Vec3 (Plate._length, Plate._length, 0.01);
    this._body = new ev.cannon.Body ({
      mass: 0.4,
      shape: new ev.cannon.Box (halfExtents),
    });
    this._body.sleepState = ev.cannon.Body.SLEEPING
    ev.world.addBody (this._body);
  }

  step (frame) {
    this._mesh.position.copy(this._body.position)
    this._mesh.quaternion.copy(this._body.quaternion)
  }

  set position (v) {
    this._mesh.position.x = v.x;
    this._mesh.position.y = v.y;
    this._mesh.position.z = v.z;

    this._body.position.set(v.x, v.y, v.z);
  }
}

export class Stage {
  constructor (ev) {
    this._environment = ev;
    this._children = [];
  }

  setup () {
    this._environment.scene.add(new this._environment.three.AmbientLight(0xffffff, 1.0));
    
    this.createPlates ();
    this.createFloor ();
  }

  addChild (child) {
    this._children.push(child);
  }

  createPlates () {
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

    const material = new this._environment.three.MeshPhongMaterial({
      color: 0xffffff,
      side: this._environment.three.DoubleSide,
      map: this.createTexture('../texture/Alloy_diamond_plate_pxr128.png', 1.0),
      bumpMap: this.createTexture('../texture/Alloy_diamond_plate_pxr128_bmp.png', 1.0),
      normalMap: this.createTexture('../texture/Alloy_diamond_plate_pxr128_normal.png', 1.0),
    });
    
    for (var i = 0; i < 9; i++) {
      let plate = new Plate (this._environment, material);
      let p = platePositions[i];
      let v = new this._environment.three.Vector3(p.x, p.y + 1.5, p.z);
      plate.position = v;
      this.addChild(plate);
    }
  }
  
  createFloor () {
    const ev = this._environment;
    const geometry = new ev.three.PlaneGeometry( 100, 100 );
    const material = new ev.three.MeshPhongMaterial({
      color: 0xffffff,
      side: ev.three.DoubleSide,
      map: this.createTexture('../texture/Redwood_outdoor_pxr128.png', 10.0),
      bumpMap: this.createTexture('../texture/Redwood_outdoor_pxr128_bmp.png', 10.0),
      normalMap: this.createTexture('../texture/Redwood_outdoor_pxr128_normal.png', 10.0),
    });
    const plane = new ev.three.Mesh( geometry, material );
    plane.rotation.x = 90;
    ev.scene.add( plane );

    const groundBody = new ev.cannon.Body({
      type: ev.cannon.Body.STATIC,
      shape: new ev.cannon.Plane(),
    })
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
    ev.world.addBody(groundBody)
  }

  createTexture (name, repeat) {
    const ev = this._environment;
    const texture = ev.loader.load(name);
    texture.wrapS = ev.three.RepeatWrapping;
    texture.wrapT = ev.three.RepeatWrapping;
    texture.repeat.set(repeat, repeat);

    return texture;
  }
  
  step (frame) {
    for (var p of this._children) {
      p.step ();
    }
  }
}
