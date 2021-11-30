export class Environment {
  static _distance = 18.44 * 0.5; // ピッチャーとキャッチャーの距離
  
  constructor (THREE, CANNON) {
    this._three = THREE;
    this._cannon = CANNON;

    this.init ();
    this.initCannon ();
  }

  init () {
    const canvas = document.querySelector('#c');
    this._renderer = new this._three.WebGLRenderer({canvas});

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 50;

    this._camera = new this._three.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.y = 1.6;
    this._camera.position.z = Environment._distance + 1.0;

    this._scene = new this._three.Scene();

    this._loader = new this._three.TextureLoader();
  }

  initCannon () {
    this._world = new this._cannon.World ({
      gravity: new this._cannon.Vec3(0, -0.0098, 0), // m/s²
    });
  }
    
  get three () {
    return this._three;
  }

  get cannon () {
    return this._cannon;
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

  get world () {
    return this._world;
  }

  get loader () {
    return this._loader;
  }
}
