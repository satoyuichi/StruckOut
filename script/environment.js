export class Environment {
  constructor (THREE, CANNON) {
    this._three = THREE;
    this._cannon = CANNON;

    this.init ();
  }

  init () {
    const canvas = document.querySelector('#c');
    this._renderer = new this._three.WebGLRenderer({canvas});

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;

    this._camera = new this._three.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.z = 2;

    this._scene = new this._three.Scene();
  }

  get three () {
    return this._three;
  }
  
  get renderer () {
    return this._renderer;
  }

  get scene () {
    return this._scene;
  }

  get camera () {
    return this._camera;
  }
}
