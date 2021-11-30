import {Environment} from './environment.js';

export class Ball {
  constructor (ev) {
    this._environment = ev;

    this.init ();
  }

  init () {
    const geometry = new this._environment.three.SphereGeometry( 0.072, 32, 16 );
    const material = new this._environment.three.MeshBasicMaterial( { color: 0xdddd00 } );
    this._sphere = new this._environment.three.Mesh( geometry, material );

    this._sphere.position.y = 1.5;
    this._sphere.position.z = Environment._distance;
    
    this._environment.scene.add( this._sphere );
  }

  step (frame) {
  }
}
