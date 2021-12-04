import { OrbitControls } from './OrbitControls.js';

export class Environment {
  static _distance = 18.44 * 0.5; // ピッチャーとキャッチャーの距離
  
  constructor (THREE, CANNON) {
    this._three = THREE;
    this._cannon = CANNON;

    this.init ();
    this.initCannon ();
  }

  init () {
    this._clock = new this._three.Clock();
    this._clock.start ();
    
    const canvas = document.querySelector('#c');
    this._renderer = new this._three.WebGLRenderer({canvas});

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 50;

    this._camera = new this._three.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.y = 1.6;
    this._camera.position.z = Environment._distance + 1.0;

    this._scene = new this._three.Scene();

    this._loader = new this._three.TextureLoader();

    this._controls = new OrbitControls( this._camera, this._renderer.domElement );
    this._controls.enablePan = false;
    this._controls.enableZoom = false;
    this._controls.minAzimuthAngle = this._three.MathUtils.degToRad( -45 );
    this._controls.maxAzimuthAngle = this._three.MathUtils.degToRad( 45 );
    this._controls.minPolarAngle = this._three.MathUtils.degToRad( 70 );
    this._controls.maxPolarAngle = this._three.MathUtils.degToRad( 120 );
    this._controls.target = new this._three.Vector3 (0.0, 1.5, Environment._distance);

    window.addEventListener( 'resize', () => {
      this._camera.aspect = window.innerWidth / window.innerHeight;
      this._camera.updateProjectionMatrix();

      this._renderer.setSize( window.innerWidth, window.innerHeight );
    });
  }

  initCannon () {
    this._world = new this._cannon.World ({
      gravity: new this._cannon.Vec3(0, -9.82 * 0.5, 0), // m/s²
    });
    this._world.solver.iterations = 20;
  }

  update () {
    this._controls.update( this._clock.getDelta() );
    this._renderer.render( this._scene, this._camera );
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

  get controls () {
    return this._controls;
  }

  get clock () {
    return this._clock;
  }
}
