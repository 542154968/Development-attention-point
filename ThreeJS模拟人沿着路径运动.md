ThreeJS模拟人沿着路径运动-路径箭头使用纹理offset偏移
![效果](https://img2018.cnblogs.com/blog/814286/201809/814286-20180928170921435-606119465.gif)

```html
<!DOCTYPE html>
<html lang="en">
 
<head>
  <meta charset="UTF-8">
  <title>第一个three.js文件_WebGL三维场景</title>
  <style>
    body {
      margin: 0;
      overflow: hidden; //隐藏body窗口区域滚动条
    }
  </style>
  <!--引入three.js三维引擎-->
  <!-- <script src="./3D/example/three.min.js"></script> -->
  <script src="https://threejs.org/build/three.js"></script>
  <!--引入轨道控件OrbitControls.js-->
  <script src="./3D/example/OrbitControls.js"></script>
</head>
 
<body>
 
  <script>
    /**
     * 创建场景对象
     */
    var scene = new THREE.Scene();
    /**
     * 创建一个设置重复纹理的管道
     */
    var curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-80, -40, 0),
      new THREE.Vector3(-70, 40, 0),
      new THREE.Vector3(70, 40, 0),
      new THREE.Vector3(80, -40, 0)
    ],false/*是否闭合*/);
    var tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.6, 50, false);
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('run.jpg');
    // 设置阵列模式为 RepeatWrapping
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT=THREE.RepeatWrapping
    // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
    //等价texture.repeat= new THREE.Vector2(20,1)
    texture.repeat.x = 20;
    var tubeMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
    });
    var tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(tube)
    /**
     * 创建一个半透明管道
     */
    var tubeGeometry2 = new THREE.TubeGeometry(curve, 100, 2, 50, false);
    var tubeMaterial2 = new THREE.MeshPhongMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.3,
    });
    var tube2 = new THREE.Mesh(tubeGeometry2, tubeMaterial2);
    scene.add(tube2)
     
    scene.add(new THREE.AxesHelper(300))
         
         
         
        //小人box
        //geometryP = new THREE.CircleGeometry( 5, 32 );               
        geometryP = new THREE.SphereGeometry(5,16,16); 
        console.log('geometryP',geometryP);
        var materialP = new THREE.MeshBasicMaterial( { color: 0xff0000 ,side:THREE.DoubleSide} );
        circleP = new THREE.Mesh( geometryP, materialP );
        scene.add( circleP );
        geometryP.rotateY(Math.PI/2);
         
        circleP.position.set(-80, -40, 0);
        console.log(circleP);
         
         
         
         
    /**
     * 光源设置
     */
    //点光源
    var point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300); //点光源位置
    scene.add(point); //点光源添加到场景中
    //环境光
    var ambient = new THREE.AmbientLight(0x888888);
    scene.add(ambient);
    /**
     * 相机设置
     */
    var width = window.innerWidth; //窗口宽度
    var height = window.innerHeight; //窗口高度
    var k = width / height; //窗口宽高比
    var s = 100; //三维场景缩放系数
    //创建相机对象
    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    camera.position.set(200, 300, 200); //设置相机位置
    camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
    /**
     * 创建渲染器对象
     */
    var renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(width, height);
    // renderer.setClearColor(0xb9d3ff,1);//设置背景颜色
    document.body.appendChild(renderer.domElement); //body元素中插入canvas对象
     
         
         
        var progress=0;
 
        // 渲染函数
    function render() {
      renderer.render(scene, camera); //执行渲染操作
      requestAnimationFrame(render);
      // 使用加减法可以设置不同的运动方向
      // 设置纹理偏移
      texture.offset.x -= 0.06
             
            if(progress>1.0){
                return;    //停留在管道末端,否则会一直跑到起点 循环再跑
            }
            progress += 0.0009;
            console.log(progress);
            if(curve){
                let point = curve.getPoint(progress);
                if(point&&point.x){
                circleP.position.set(point.x,point.y,point.z);
                }
            }
             
    }
    render();
    var controls = new THREE.OrbitControls(camera); //创建控件对象
  </script>
</body>
 
</html>
```
