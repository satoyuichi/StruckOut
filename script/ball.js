import {Environment} from './environment.js';

export class Ball {
  static _radius = 0.072;
  static _weight = 0.148;
  
  constructor (ev) {
    this._environment = ev;

    this.init ();
  }

  init () {
    const geometry = new this._environment.three.SphereGeometry( Ball._radius, 32, 16 );
    const material = new this._environment.three.MeshBasicMaterial( { color: 0xdddd00 } );
    this._mesh = new this._environment.three.Mesh( geometry, material );

    this._environment.scene.add( this._mesh );

    const sphereShape = new this._environment.cannon.Sphere(this._radius);
    this._body = new this._environment.cannon.Body({
      mass: Ball._weight,
      shape: sphereShape
    });
    this._body.sleepState = this._environment.cannon.Body.SLEEPING
    this._environment.world.addBody(this._body);
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
