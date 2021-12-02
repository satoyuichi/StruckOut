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

    this._body = new this._environment.cannon.Body({
      mass: Ball._weight,
      shape: new this._environment.cannon.Sphere(Ball._radius)
    });
    this._body.sleepState = this._environment.cannon.Body.SLEEPING
    this._environment.world.addBody(this._body);

    this._mesh.add(new this._environment.three.PointLight(0xffff00, 0.8, 2.0));
  }

  step (frame) {
    this._mesh.position.copy(this._body.position)
    this._mesh.quaternion.copy(this._body.quaternion)
  }

  set position (v) {
    this._mesh.position.x = v.x;
    this._mesh.position.y = v.y;
    this._mesh.position.z = v.z;

    this._body.sleep();
    this._body.position.set(v.x, v.y, v.z);
  }

  setPower (v) {
    this._body.applyForce (v);
  }

  reset () {
    this.position = new this._environment.three.Vector3(0.0, 1.5, Environment._distance);
  }
}
