import * as THREE from 'three';
// import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//Scene: 3D空間の枠組み。これにカメラなど、もろもろ加えていく
export default class Scene {
  public $stage: HTMLElement | null;
  public scene!: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;
  public renderer!: THREE.WebGLRenderer;
  public sphereGeometry!: THREE.SphereGeometry;
  public boxGeometry!: THREE.BoxGeometry;
  public material!: THREE.MeshBasicMaterial;
  public mesh!: THREE.Mesh;
  public Line!: THREE.Line;
  public Points!: THREE.Points;
  public controls!: OrbitControls;
  public spaceKeyFlag!: boolean;
  public meshArr!: THREE.Mesh[];

  constructor() {
    this.$stage = document.getElementById('stage');
    this.meshArr = [];

    this.setup();
    this.bindEvents();
  }

  setup(): void {
    //scene用意して、カメラ・ライト等を追加！そしてレンダリング
    this.scene = new THREE.Scene();
    this.setMesh();
    // this.addObjects();
    this.setCamera();
    this.setLights();
    this.setRender();
    this.setupDebug();
  }

  bindEvents(): void {
    window.addEventListener('resize', () => {
      this.onResize();
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === ' ') {
        this.spaceKeyFlag = true;
      }
    });
    window.addEventListener('keyup', (event) => {
      if (event.key === ' ') {
        this.spaceKeyFlag = false;
      }
    });
  }

  onResize(): void {
    this.camera.aspect = window.APP.Layout.windowWidth / window.APP.Layout.windowHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.APP.Layout.windowWidth, window.APP.Layout.windowHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  setRender(): void {
    //「現像する」役割。Sceneを映し出す！
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: this.$stage as HTMLCanvasElement,
    });

    this.renderer.setClearColor(new THREE.Color(0x666666)); //three.jsのColorクラスを使用。RGBでもいける
    this.renderer.setSize(window.APP.Layout.windowWidth, window.APP.Layout.windowHeight); //サイズを指定
    this.renderer.setPixelRatio(window.devicePixelRatio); //Retina対応

    this.renderer.setAnimationLoop(() => {
      //requestAnimationFrameと同じ！
      //インタラクションでアニメーションさせたい等、連続でレンダリングさせたいのであれば、loopが必要になる
      this.render();
      // this.mesh.rotation.x += 0.05; //Object3Dという基底クラスのインスタンスであるmeshやcameraはrotationなど便利なプロパティを持っている
      // this.mesh.rotation.y += 0.05;
    });
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
    this.controls.update();

    if (this.spaceKeyFlag) {
      this.meshArr.forEach((mesh) => {
        mesh.rotation.x += 0.05;
        mesh.rotation.y += 0.05;
      });
    }
  }

  setGeometry(): void {
    //「ジオメトリ」は頂点の集合体。単なる形状、設計図・骨組み。
    // boxや球体とかいろいろ種類がある
    this.boxGeometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    // this.sphereGeometry = new THREE.SphereGeometry(1.0, 16, 16);
  }

  setMaterial(): void {
    //「マテリアル」は質感！
    // 光を受けるマテリアルと受けないマテリアルがある
    // this.material = new THREE.MeshBasicMaterial({ color: 0x3399ff });
    // this.material = new THREE.MeshLambertMaterial({ color: 0x3399ff });
    // this.material = new THREE.MeshPhongMaterial({ color: new THREE.Color('hsl(0, 100%, 50%)'), specular: 0xffffff }); //反射光（フォンシェーディング）どの面でも同じ色、にはならない。視線を考慮する
  }

  setMesh(): void {
    //「メッシュ」はジオメトリ + マテリアル。メッシュになって初めて3D空間に設置できる
    //「メッシュ」は面だが、点・線でも表現できる
    //これらの概念を3Dで「プリミティブ」という
    //点の場合はマテリアルも専用のものが別途必要d
    this.setGeometry();
    this.setMaterial();
    // this.mesh = new THREE.Mesh(this.geometry, this.material);
    // this.Line = new THREE.Line(this.geometry, this.material);
    const count = 10;
    const size = 1.0;
    const pos = new THREE.Vector3(0, 0);
    // this.meshArr = [];

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`),
          specular: 0xffffff,
        });
        const box = new THREE.Mesh(this.boxGeometry, material);
        pos.x = i + size / 2 - (count * size) / 2;
        pos.y = j + size / 2 - (count * size) / 2;
        box.position.x = pos.x;
        box.position.y = pos.y;

        this.scene.add(box);
        this.meshArr.push(box);
      }
    }
  }

  addObjects(): void {
    // this.scene.add(this.mesh);
    // this.scene.add(this.Line);
  }

  setCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      60, //fovy... これが大きいと視野が広がる
      window.APP.Layout.windowWidth / window.APP.Layout.windowHeight, //aspect... 撮影する空間の縦横比
      0.1, //near...  カメラからニアクリップまでの距離
      100.0, //far... カメラからファークリップまでの距離
      //ニアクリップとファークリップでできる視錐台の間だけレンダリングされる
      //ゲームでキャラとカメラが近づきすぎると見えなくなったりするのはこの原理
    );
    this.camera.position.set(0.0, 2.0, 5.0); //カメラもObject3Dを継承している
    this.camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
  }

  setLights(): void {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    //平行光源（指定した座標から原点に向かって光が降り注いでくる）
    //マテリアルの設定が必要になるのも注意
    //平行光源によるランバートライティングは「拡散光」といわれる
    directionalLight.position.x = 1.0;
    directionalLight.position.y = 1.0;
    directionalLight.position.z = 1.0;
    this.scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    //環境光。現実世界（環境全体が持つ複雑な光の反射・屈折）に近い光。光が当たらなくても完全に真っ黒にならない！
    //現実に近似しているので処理が重くなる。
    //空間全体を表現しているので、向きに関するパラメータはない！
    //実際の仕組みは、色を加算している（負荷を抑える目的から）
    //最近は「リアルタイムレイトーシング」というのがゲーム世界では出てきている（WEBではまだ！）
    this.scene.add(ambientLight);
  }

  setupDebug(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    //第一引数にカメラを渡す。つまりオブジェクトが動いているのではなくカメラが動いている。3Dでは「ユーザーがどう見えているか」が大事。

    const axesHelper = new THREE.AxesHelper(5.0);
    //軸が伸びている方がプラス。右にX、上にY、手前にZ。→ 「右手座標系」（xとyを合わせてから中指の方向をみると。。）
    this.scene.add(axesHelper);
  }
}
