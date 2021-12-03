class Plate {
  static _length = 0.6;
  static _thin = 0.05;
  
  constructor (ev, material) {
    this._geometry = new ev.three.BoxGeometry (Plate._length, Plate._length, Plate._thin);
    this._material = material;
    this._mesh = new ev.three.Mesh (this._geometry, this._material);
    ev.scene.add (this._mesh);

    const halfExtents = new ev.cannon.Vec3 (Plate._length * 0.5, Plate._length * 0.5, Plate._thin * 0.5);
    this._body = new ev.cannon.Body ({
      mass: 0.2,
      shape: new ev.cannon.Box (halfExtents),
    });
    this._body.sleepState = ev.cannon.Body.SLEEPING
    ev.world.addBody (this._body);
  }

  step (frame) {
    this._mesh.position.copy(this._body.position)
    this._mesh.quaternion.copy(this._body.quaternion)
  }

  set position0 (v) {
    this._position0 = v;
  }

  set position (v) {
    this._body.sleepState = ev.cannon.Body.SLEEPING
    this._body.position.set(v.x, v.y, v.z);
    this._mesh.position.copy(this._body.position)
  }

  reset () {
    this._body.quaternion.set (0.0, 0.0, 0.0, 1.0);
    this.position = this._position0;
  }
}

export class Stage {
  constructor (ev) {
    this._environment = ev;
    this._children = [];
  }

  setup () {
    this._environment.scene.add(new this._environment.three.AmbientLight(0xffffff, 0.85));

    this.createFrame ();
    this.createPlates ();
    this.createFloor ();
  }

  addChild (child) {
    this._children.push(child);
  }

  createFrame () {
    const length = Plate._length * 5.0;
    const thin = 0.1;
    let geometry = new this._environment.three.BoxGeometry (length, Plate._length * 0.5, thin);
    const material = new this._environment.three.MeshPhongMaterial({
      color: 0xffffff,
      map: this.createTexture('../texture/White_oak_pxr128.png', 1.0),
      bumpMap: this.createTexture('../texture/White_oak_pxr128_bmp.png', 1.0),
      normalMap: this.createTexture('../texture/White_oak_pxr128_normal.png', 1.0),
    });

    frame (this._environment, 0.0, Plate._length * 0.5 * 4.5 + 1.5, 0.0);
    frame (this._environment, 0.0, Plate._length * 0.5 * 1.5 + 1.5, 0.0);
    frame (this._environment, 0.0, -Plate._length * 0.5 * 1.5 + 1.5, 0.0);
    frame (this._environment, 0.0, -Plate._length * 0.5 * 4.5 + 1.5, 0.0);

    geometry = new this._environment.three.BoxGeometry (Plate._length * 0.5, length, thin);

    frame (this._environment, Plate._length * 0.5 * 4.5, 1.5, 0.01);
    frame (this._environment, Plate._length * 0.5 * 1.5, 1.5, 0.01);
    frame (this._environment, -Plate._length * 0.5 * 1.5, 1.5, 0.01);
    frame (this._environment, -Plate._length * 0.5 * 4.5, 1.5, 0.01);
    
    function frame (ev, x, y, z) {
      const mesh = new ev.three.Mesh (geometry, material);
      ev.scene.add (mesh);

      geometry.computeBoundingBox ();
      const bb = geometry.boundingBox;
      const halfExtents = new ev.cannon.Vec3 ((bb.max.x - bb.min.x) * 0.5, (bb.max.y - bb.min.y) * 0.5, (bb.max.z - bb.min.z) * 0.5);
      const body = new ev.cannon.Body ({
        type: ev.cannon.Body.STATIC,
        shape: new ev.cannon.Box (halfExtents),
      });
      body.position.set(x, y, z);
      ev.world.addBody (body);

      mesh.position.copy(body.position)
      mesh.quaternion.copy(body.quaternion)
    }
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
      plate.position0 = v;
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
    plane.rotation.x = ev.three.MathUtils.degToRad( 90 );
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

  reset () {
    this._environment.world.clearForces ();
    
    for (var p of this._children) {
      p.reset ();
    }
  }
}
