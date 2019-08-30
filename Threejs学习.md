# Begin

# 要看到世界的几大要素
 1. 摄像机 
 2. 场景
 3. 渲染器
 4. 光源
 5. ……
 
# 几个工具
  1. `OrbitControls.js`  轨道控制器
  2. `CSS2DRenderer.js`  可以在页面中渲染出一个DIV标签 跟随某个物体 很多demo中都有这个插件 很重要
  3. `TrackballControls.js` 跟踪球 轨迹球控制器
 

# 工具函数
- 获取随机色
```javascript
element.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle()
```

# threejs 配合 video js  全景视频
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>three.js webgl - equirectangular video panorama</title>
        <meta charset="utf-8" />
        <meta
            name="viewport"
            content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
        />
        <!-- videojs 在初始化之后在canvas下面 用样式可以调出来 -->
        <style>
            body {
                background-color: #000000;
                margin: 0px;
                overflow: hidden;
            }

            #info {
                position: absolute;
                top: 0px;
                width: 100%;
                color: #ffffff;
                padding: 5px;
                font-family: Monospace;
                font-size: 13px;
                font-weight: bold;
                text-align: center;
            }

            a {
                color: #ffffff;
            }
        </style>
        <link
            href="https://vjs.zencdn.net/7.5.4/video-js.css"
            rel="stylesheet"
        />
    </head>
    <body>
        <div id="container"></div>
        <video
            id="my-video"
            class="video-js"
            controls
            preload="auto"
            autoplay="true"
            width="640"
            loop
            height="264"
            poster="MY_VIDEO_POSTER.jpg"
            data-setup="{}"
        >
            <source src="./textures/MaryOculus.webm" />
            <p class="vjs-no-js">
                To view this video please enable JavaScript, and consider
                upgrading to a web browser that
                <a
                    href="https://videojs.com/html5-video-support/"
                    target="_blank"
                    >supports HTML5 video</a
                >
            </p>
        </video>
        <script src="https://vjs.zencdn.net/7.5.4/video.js"></script>
        <script src="../build/three.js"></script>

        <script>
            // videojs('#my-video', {
            //     controls: true,
            //     autoplay: true,
            //     preload: 'auto'
            // })
            var camera, scene, renderer

            var isUserInteracting = false,
                lon = 0,
                lat = 0,
                phi = 0,
                theta = 0,
                distance = 50,
                onPointerDownPointerX = 0,
                onPointerDownPointerY = 0,
                onPointerDownLon = 0,
                onPointerDownLat = 0

            init()
            animate()

            function init() {
                var container, mesh

                container = document.getElementById('container')

                camera = new THREE.PerspectiveCamera(
                    75,
                    window.innerWidth / window.innerHeight,
                    1,
                    1100
                )
                camera.target = new THREE.Vector3(0, 0, 0)

                scene = new THREE.Scene()

                var geometry = new THREE.SphereBufferGeometry(500, 60, 40)
                // invert the geometry on the x-axis so that all of the faces point inward
                geometry.scale(-1, 1, 1)

                // var video = document.createElement('video')
                // video.crossOrigin = '*'
                // video.width = 640
                // video.height = 360
                // video.loop = true
                // video.muted = true
                // video.src =
                //     'http://223.110.242.130:6610/gitv/live1/G_CCTV-1-HQ/1.m3u8'
                // video.setAttribute('webkit-playsinline', 'webkit-playsinline')
                // video.play()

                var texture = new THREE.VideoTexture(
                    document.querySelector('#my-video')
                )
                var material = new THREE.MeshBasicMaterial({ map: texture })

                mesh = new THREE.Mesh(geometry, material)

                scene.add(mesh)

                renderer = new THREE.WebGLRenderer()
                renderer.setPixelRatio(window.devicePixelRatio)
                renderer.setSize(window.innerWidth, window.innerHeight)
                container.appendChild(renderer.domElement)

                document.addEventListener(
                    'mousedown',
                    onDocumentMouseDown,
                    false
                )
                document.addEventListener(
                    'mousemove',
                    onDocumentMouseMove,
                    false
                )
                document.addEventListener('mouseup', onDocumentMouseUp, false)
                document.addEventListener('wheel', onDocumentMouseWheel, false)

                //

                window.addEventListener('resize', onWindowResize, false)
            }

            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight
                camera.updateProjectionMatrix()

                renderer.setSize(window.innerWidth, window.innerHeight)
            }

            function onDocumentMouseDown(event) {
                event.preventDefault()

                isUserInteracting = true

                onPointerDownPointerX = event.clientX
                onPointerDownPointerY = event.clientY

                onPointerDownLon = lon
                onPointerDownLat = lat
            }

            function onDocumentMouseMove(event) {
                if (isUserInteracting === true) {
                    lon =
                        (onPointerDownPointerX - event.clientX) * 0.1 +
                        onPointerDownLon
                    lat =
                        (event.clientY - onPointerDownPointerY) * 0.1 +
                        onPointerDownLat
                }
            }

            function onDocumentMouseUp() {
                isUserInteracting = false
            }

            function onDocumentMouseWheel(event) {
                distance += event.deltaY * 0.05

                distance = THREE.Math.clamp(distance, 1, 50)
            }

            function animate() {
                requestAnimationFrame(animate)
                update()
            }

            function update() {
                lat = Math.max(-85, Math.min(85, lat))
                phi = THREE.Math.degToRad(90 - lat)
                theta = THREE.Math.degToRad(lon)

                camera.position.x = distance * Math.sin(phi) * Math.cos(theta)
                camera.position.y = distance * Math.cos(phi)
                camera.position.z = distance * Math.sin(phi) * Math.sin(theta)

                camera.lookAt(camera.target)

                renderer.render(scene, camera)
            }
        </script>
    </body>
</html>

```


# threejs  + vidoejs 全景直播
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>three.js webgl - equirectangular video panorama</title>
        <meta charset="utf-8" />
        <meta
            name="viewport"
            content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
        />
        <!-- videojs 在初始化之后在canvas下面 用样式可以调出来 -->
        <style>
            body {
                background-color: #000000;
                margin: 0px;
                overflow: hidden;
            }

            #info {
                position: absolute;
                top: 0px;
                width: 100%;
                color: #ffffff;
                padding: 5px;
                font-family: Monospace;
                font-size: 13px;
                font-weight: bold;
                text-align: center;
            }

            a {
                color: #ffffff;
            }
            #my-video {
                position: fixed;
                z-index: 99999;
                top: 0;
                left: 0;
            }
        </style>
        <link
            href="https://vjs.zencdn.net/7.5.4/video-js.css"
            rel="stylesheet"
        />
    </head>
    <body>
        <div id="container"></div>
        <video
            id="my-video"
            class="video-js"
            controls
            preload="auto"
            autoplay
            width="640"
            loop
            height="264"
            poster="MY_VIDEO_POSTER.jpg"
            data-setup="{}"
            crossorigin="anonymous"
        >
            <source
                src="http://i3.vzan.cc/clip/85191/1038133875/E97998EBA355633F.m3u8"
            />
            <p class="vjs-no-js">
                To view this video please enable JavaScript, and consider
                upgrading to a web browser that
                <a
                    href="https://videojs.com/html5-video-support/"
                    target="_blank"
                    >supports HTML5 video</a
                >
            </p>
        </video>
        <script src="https://vjs.zencdn.net/7.5.4/video.js"></script>
        <script src="https://cdn.bootcss.com/three.js/r83/three.min.js"></script>

        <script>
            // videojs('#my-video', {
            //     controls: true,
            //     autoplay: true,
            //     preload: 'auto'
            // })
            var camera, scene, renderer

            var isUserInteracting = false,
                lon = 0,
                lat = 0,
                phi = 0,
                theta = 0,
                distance = 50,
                onPointerDownPointerX = 0,
                onPointerDownPointerY = 0,
                onPointerDownLon = 0,
                onPointerDownLat = 0

            init()
            animate()

            function init() {
                var container, mesh

                container = document.getElementById('container')

                camera = new THREE.PerspectiveCamera(
                    75,
                    window.innerWidth / window.innerHeight,
                    1,
                    1100
                )
                camera.target = new THREE.Vector3(0, 0, 0)

                scene = new THREE.Scene()

                var geometry = new THREE.SphereBufferGeometry(500, 60, 40)
                // invert the geometry on the x-axis so that all of the faces point inward
                geometry.scale(-1, 1, 1)

                // var video = document.createElement('video')
                // video.crossOrigin = '*'
                // video.width = 640
                // video.height = 360
                // video.loop = true
                // video.muted = true
                // video.src =
                //     'http://223.110.242.130:6610/gitv/live1/G_CCTV-1-HQ/1.m3u8'
                // video.setAttribute('webkit-playsinline', 'webkit-playsinline')
                // video.play()

                var texture = new THREE.VideoTexture(
                    document.querySelector('#my-video')
                )
                var material = new THREE.MeshBasicMaterial({ map: texture })

                mesh = new THREE.Mesh(geometry, material)

                scene.add(mesh)

                renderer = new THREE.WebGLRenderer()
                renderer.setPixelRatio(window.devicePixelRatio)
                renderer.setSize(window.innerWidth, window.innerHeight)
                container.appendChild(renderer.domElement)

                document.addEventListener(
                    'mousedown',
                    onDocumentMouseDown,
                    false
                )
                document.addEventListener(
                    'mousemove',
                    onDocumentMouseMove,
                    false
                )
                document.addEventListener('mouseup', onDocumentMouseUp, false)
                document.addEventListener('wheel', onDocumentMouseWheel, false)

                //

                window.addEventListener('resize', onWindowResize, false)
            }

            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight
                camera.updateProjectionMatrix()

                renderer.setSize(window.innerWidth, window.innerHeight)
            }

            function onDocumentMouseDown(event) {
                event.preventDefault()

                isUserInteracting = true

                onPointerDownPointerX = event.clientX
                onPointerDownPointerY = event.clientY

                onPointerDownLon = lon
                onPointerDownLat = lat
            }

            function onDocumentMouseMove(event) {
                if (isUserInteracting === true) {
                    lon =
                        (onPointerDownPointerX - event.clientX) * 0.1 +
                        onPointerDownLon
                    lat =
                        (event.clientY - onPointerDownPointerY) * 0.1 +
                        onPointerDownLat
                }
            }

            function onDocumentMouseUp() {
                isUserInteracting = false
            }

            function onDocumentMouseWheel(event) {
                distance += event.deltaY * 0.05

                distance = THREE.Math.clamp(distance, 1, 50)
            }

            function animate() {
                requestAnimationFrame(animate)
                update()
            }

            function update() {
                lat = Math.max(-85, Math.min(85, lat))
                phi = THREE.Math.degToRad(90 - lat)
                theta = THREE.Math.degToRad(lon)

                camera.position.x = distance * Math.sin(phi) * Math.cos(theta)
                camera.position.y = distance * Math.cos(phi)
                camera.position.z = distance * Math.sin(phi) * Math.sin(theta)

                camera.lookAt(camera.target)

                renderer.render(scene, camera)
            }
        </script>
    </body>
</html>

```

## THREEJS 骨骼功能
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>three.js webgl - loaders - 3DS loader</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
    />
    <style>
      body {
        font-family: Monospace;
        background-color: #000;
        color: #fff;
        margin: 0px;
        overflow: hidden;
      }
      #info {
        color: #fff;
        position: absolute;
        top: 10px;
        width: 100%;
        text-align: center;
        z-index: 100;
        display: block;
      }
      #info a,
      .button {
        color: #f00;
        font-weight: bold;
        text-decoration: underline;
        cursor: pointer;
      }
    </style>
  </head>

  <body>
    <div id="info">
      <a href="http://threejs.org" target="_blank" rel="noopener">three.js</a>
      - 3DS loader
    </div>

    <script src="../build/three.js"></script>
    <script src="js/controls/TrackballControls.js"></script>
    <script src="js/controls/OrbitControls.js"></script>
    <script src="js/loaders/TDSLoader.js"></script>
    <script src="js/loaders/STLLoader.js"></script>

    <script>
      var container, controls;
      var camera, scene, renderer;

      init();
      animate();

      function init() {
        container = document.createElement("div");
        document.body.appendChild(container);

        // 创建相机 正交摄像机
        camera = new THREE.PerspectiveCamera(
          60,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        // 相机位置
        camera.position.z = 300;
        camera.position.x = 150;
        camera.position.y = 150;
        // 添加控制器 这里使用的是轨道控制器
        controls = new THREE.OrbitControls(camera);
        // 创建场景
        scene = new THREE.Scene();

        // 添加光源
        var light = new THREE.AmbientLight(0x404040);
        scene.add(light);
        // 添加三维坐标轴辅助
        // var axesHelper = new THREE.AxesHelper(300);
        // scene.add(axesHelper);

        var geometry = new THREE.BoxBufferGeometry(150, 150, 150);
        var texture = new THREE.TextureLoader().load(
          "textures/land_ocean_ice_cloud_2048.jpg"
        );
        var material = new THREE.MeshBasicMaterial({
          //   color: 0x00ff00,
          // ！！！！ 必须开启这个 蒙皮
          skinning: true,
          map: texture
          //   wireframe: true
        });

        var skinIndices = [];
        var skinWeights = [];
        var vertex = new THREE.Vector3();
        var position = geometry.attributes.position;
        // 将定点加入到骨骼列表中 骨骼和定点对应起来
        for (let i = 0, l = position.length; i < l; i++) {
          vertex.fromBufferAttribute(position, i);

          var y = vertex.y + 75;
          var skinIndex = Math.floor(y / 75);
          var skinWeight = (y % 75) / 75;
          // 当前这个点 受那几个骨骼控制 规定最多4个
          // skinIndex是骨骼的index 上面那个只是算出来index
          skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
          // 设置四个点的控制权重
          skinWeights.push(0.5, 0.5, 0, 0);
        }

        geometry.addAttribute(
          "skinIndex",
          new THREE.Uint16BufferAttribute(skinIndices, 4)
        );
        geometry.addAttribute(
          "skinWeight",
          new THREE.Float32BufferAttribute(skinWeights, 4)
        );

        // 必须用这种mesh
        var cube = new THREE.SkinnedMesh(geometry, material);

        // 创建骨骼
        // root是根节点 相当于起始位置
        var root = new THREE.Bone();
        var child = new THREE.Bone();
        var son = new THREE.Bone();
        // 为啥要加到root里面  猜想是连起来 这个几个骨骼是一体的
        // root就是骨骼开始的地方  如 起始是 -75 要射到150 才能到定点
        root.add(child);
        root.add(son);

        // 设置骨骼位置

        root.position.set(0, 0, 0);
        child.position.set(0, 50, 0);
        son.position.set(75, -75, 75);

        // 形成骨架
        skeleton = new THREE.Skeleton([root, child, son]);
        // 模型中加入骨骼 为啥是 0  母鸡 猜想是从头开始放入
        cube.add(skeleton.bones[0]);
        cube.bind(skeleton);

        // 绑定骨骼

        // 这里就可以操作骨骼做动作了 变形之类的
        // skeleton.bones[0].position.y = 0;
        // skeleton.bones[1].rotation.y = 70;
        // skeleton.bones[2].rotation.y = 0;

        // 开启辅助 看看骨骼
        var helper = new THREE.SkeletonHelper(cube);
        // 骨骼宽度  改了没啥用 ??? 文档错了？？
        helper.material.linewidth = 40;
        scene.add(helper);
        // 将模型添加到长江中
        scene.add(cube);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        window.addEventListener("resize", resize, false);
      }

      function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      var angle = 0;
      function animate() {
        controls.update();
        // skeleton.bones[1].position.z++;
        angle++;

        skeleton.bones[2].rotation.y = (angle / 180) * Math.PI;
        skeleton.bones[1].rotation.y = (-angle / 180) * Math.PI;
        renderer.render(scene, camera);

        requestAnimationFrame(animate);
      }
    </script>
  </body>
</html>
```

## THREEJS 加载OBJ模型 添加骨骼demo
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>three.js webgl - loaders - 3DS loader</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
    />
    <style>
      body {
        font-family: Monospace;
        background-color: #000;
        color: #fff;
        margin: 0px;
        overflow: hidden;
      }
      #info {
        color: #fff;
        position: absolute;
        top: 10px;
        width: 100%;
        text-align: center;
        z-index: 100;
        display: block;
      }
      #info a,
      .button {
        color: #f00;
        font-weight: bold;
        text-decoration: underline;
        cursor: pointer;
      }
    </style>
  </head>

  <body>
    <div id="info">
      <a href="http://threejs.org" target="_blank" rel="noopener">three.js</a>
      - 3DS loader
    </div>

    <script src="../build/three.js"></script>
    <script src="js/controls/TrackballControls.js"></script>
    <script src="js/controls/OrbitControls.js"></script>
    <script src="js/loaders/TDSLoader.js"></script>
    <script src="js/loaders/STLLoader.js"></script>
    <script src="js/loaders/OBJLoader.js"></script>

    <script>
      var container, controls;
      var camera, scene, renderer;
      var skeleton = [];

      init();
      animate();

      function init() {
        container = document.createElement("div");
        document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(
          60,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.z = 400;
        camera.position.x = 400;
        camera.position.y = 400;
        // 轨迹球控制器
        // controls = new THREE.TrackballControls(camera);
        controls = new THREE.OrbitControls(camera);

        scene = new THREE.Scene();
        // 创建一个虚拟的球形网格 Mesh 的辅助对象来模拟 半球形光源 HemisphereLight.
        scene.add(new THREE.HemisphereLight());
        // 平行光
        // var directionalLight = new THREE.DirectionalLight(0xffeedd);
        // directionalLight.position.set(0, 0, 200);

        var light = new THREE.AmbientLight(0x404040);
        scene.add(light);

        var axesHelper = new THREE.AxesHelper(300);
        scene.add(axesHelper);

        //SkeletonHelper可以用线显示出骨架，帮助我们调试骨架，可有可无

        //3ds files dont store normal maps
        // var loader = new THREE.TextureLoader()
        // var normal = loader.load(
        //     'models/3ds/portalgun/textures/normal.jpg'
        // )

        // var loader = new THREE.TDSLoader()
        // loader.setResourcePath('models/3ds/portalgun/textures/')
        // loader.load('models/3ds/zc/xcq.3ds', function(object) {
        //     // console.log(object)
        //     object.traverse(function(child) {
        //         if (child instanceof THREE.Mesh) {
        //             // child.material.normalMap = normal
        //             child.material.color = new THREE.Color('#eb6120')
        //             // console.log(child.material)
        //         }
        //     })
        //     object.rotation.x = 200
        //     object.rotation.y = 0
        //     object.rotation.z = 180

        //     scene.add(object)
        // })

        // var loader = new THREE.STLLoader();
        // loader.load(
        //   "./models/stl/ht/controller.STL",
        //   function(geometry) {
        //     //加载纹理 stl没有纹理

        //     var material = new THREE.MeshStandardMaterial({
        //       // color: 0xff5533
        //       // skinning: true
        //       // map: texture
        //     });
        //     var mesh = new THREE.Mesh(geometry, material);
        //     mesh.position.set(0, 0, 0);

        //     console.log(mesh);
        //     scene.add(mesh);
        //   },
        //   function(err) {
        //     console.log(err);
        //   },
        //   function(err) {
        //     console.log(err);
        //   }
        // );

        var loader = new THREE.OBJLoader();
        var texture = new THREE.TextureLoader().load("textures/colors.png");
        var materialScene = new THREE.MeshBasicMaterial({
          skinning: true,
          map: texture
        });

        loader.load(
          "./models/obj/tree.obj",
          function(object) {
            object.traverse(function(child) {
              // console.log(child, "child");
              if (child.isMesh) {
                var geometry = child.geometry;

                var skinIndices = [];
                var skinWeights = [];
                var vertex = new THREE.Vector3();
                var position = geometry.attributes.position;
                // 将定点加入到骨骼列表中 骨骼和定点对应起来
                for (let i = 0, l = position.count; i < l; i++) {
                  // 当前这个点 受那几个骨骼控制 规定最多4个
                  if (i <= 2) {
                    skinIndices.push(0, 1, 0, 0);
                  } else {
                    skinIndices.push(0, 0, 0, 0);
                  }
                  // 设置四个点的控制权重
                  skinWeights.push(0.5, 0.5, 0, 0);
                }

                geometry.addAttribute(
                  "skinIndex",
                  new THREE.Uint16BufferAttribute(skinIndices, 4)
                );
                geometry.addAttribute(
                  "skinWeight",
                  new THREE.Float32BufferAttribute(skinWeights, 4)
                );

                var root = new THREE.Bone();
                var child = new THREE.Bone();
                root.add(child);

                root.position.set(0, 0, 0);
                child.position.set(
                  -0.31415700912475586,
                  0.8964679837226868,
                  -0.11074800044298172
                );

                skeleton = new THREE.Skeleton([root, child]);
                var cube = new THREE.SkinnedMesh(geometry, materialScene);
                // 模型中加入骨骼 为啥是 0  母鸡 猜想是从头开始放入
                cube.add(skeleton.bones[0]);
                cube.bind(skeleton);
                cube.scale.multiplyScalar(200);
                scene.add(cube);

                var helper = new THREE.SkeletonHelper(cube);
                // 骨骼宽度  改了没啥用 ??? 文档错了？？
                helper.material.linewidth = 40;
                scene.add(helper);
              }
            });
            object.position.set(0, -0, -0);
            object.scale.multiplyScalar(200);

            // scene.add(object);
          },
          function(process) {},
          function(error) {
            console.log(error);
          }
        );

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        window.addEventListener("resize", resize, false);
      }

      function resize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      var angle = 0;
      function animate() {
        // skeleton.bones[1].position.z++;
        angle++;

        if (
          skeleton &&
          Array.isArray(skeleton.bones) &&
          skeleton.bones.length > 0
        ) {
          // console.log(skeleton);
          // skeleton.bones[2].rotation.y = (angle / 180) * Math.PI;
          skeleton.bones[1].rotation.y = (-angle / 180) * Math.PI;
        }

        controls.update();
        renderer.render(scene, camera);

        requestAnimationFrame(animate);
      }
    </script>
  </body>
</html>

```

## THREEJS 全景图点击demo
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>全景图demo</title>
        <style lang="">
            #canvas {
                height: 640px;
                width: 1280px;
                margin: 0 auto;
            }
        </style>
    </head>
    <body>
        <div id="canvas"></div>
        <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
        <script src="three.js"></script>
        <script>
            function Tcanvas() {
                if (!(this instanceof Tcanvas)) {
                    return new Tcanvas()
                }
                var requesAnimationFrame =
                    window.requestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.msRequestAnimationFrame
                window.requestAnimationFrame = requesAnimationFrame

                this.ctxHeight = 0
                this.ctxWidth = 0
                this.renderer = null
                this.scene = null
                this.camera = null
                this.cube = null
                this.ballMesh = null
                this.tagObject = null
                this.tags = []
                this.init()
            }
            Tcanvas.prototype = {
                constructor: Tcanvas,
                init: function() {
                    this.initCanvas()
                    this.initScene()
                    this.initCamera()
                    this.initLight()
                    this.initMesh()
                    this.initClick()
                },
                // 创建canvas 和 渲染器
                initCanvas: function() {
                    var body = document.getElementById('canvas')
                    this.ctxHeight = body.clientHeight
                    this.ctxWidth = body.clientWidth
                    var renderer = new THREE.WebGLRenderer()
                    renderer.setSize(body.clientWidth, body.clientHeight)
                    renderer.setClearColor(0x000000)
                    body.appendChild(renderer.domElement)
                    this.renderer = renderer
                },
                // 创建场景
                initScene: function() {
                    var scene = new THREE.Scene()
                    this.scene = scene
                },
                // 创建环境光
                initLight: function() {
                    var light = new THREE.AmbientLight(0xffffff, 1)
                    // light.position.set( 100, 100, 100 )
                    this.scene.add(light)
                },
                // 创建透视投影相机
                initCamera: function() {
                    var camera = new THREE.PerspectiveCamera(60, 2 / 1, 1, 1000)
                    camera.position.set(0, 0, 0)
                    camera.lookAt(new THREE.Vector3(0, 0, 500))
                    this.scene.add(camera)
                    this.camera = camera
                },
                // 创建正交投影色相头
                // initCamera: function(){
                //     var camera = new THREE.OrthographicCamera( -50, 50, 25, -25, 0.1, 10000 );
                //     camera.position.set( 100, 100, 100 );
                //     camera.lookAt( new THREE.Vector3(0, 0, 0) )
                //     this.scene.add( camera );
                //     this.camera = camera;
                // },
                // 创建球体
                initMesh: function() {
                    var _this = this,
                        materials = [],
                        loader = new THREE.TextureLoader(),
                        texture = loader.load('images/fish.jpg', function(obj) {
                            _this.renderer.render(_this.scene, _this.camera)
                            return obj
                        }),
                        cube = new THREE.Mesh(
                            // 形状
                            // new THREE.CubeGeometry(10, 10, 10),
                            new THREE.SphereGeometry(50, 32, 32),
                            // 材质
                            new THREE.MeshPhongMaterial({
                                // color: 0xff0000,
                                side: THREE.DoubleSide,
                                map: texture
                            })
                        ),
                        cube3D = new THREE.Object3D()
                    this.tagObject = new THREE.Object3D()
                    cube3D.add(cube)
                    this.scene.add(cube3D)
                    this.cube = [cube3D]

                    rotates()
                    function rotates() {
                        requestAnimationFrame(rotates)
                        cube3D.rotateY(Math.PI / 1440)
                        // cube3D.rotateX(Math.PI/720)
                        _this.tags.forEach(function(tagMesh) {
                            tagMesh.updateTag()
                        })
                        _this.renderer.render(_this.scene, _this.camera)
                    }
                },
                isOffScreen(obj, camera) {
                    var frustum = new THREE.Frustum() //Frustum用来确定相机的可视区域
                    var cameraViewProjectionMatrix = new THREE.Matrix4()
                    cameraViewProjectionMatrix.multiplyMatrices(
                        camera.projectionMatrix,
                        camera.matrixWorldInverse
                    ) //获取相机的法线
                    frustum.setFromMatrix(cameraViewProjectionMatrix) //设置frustum沿着相机法线方向

                    return !frustum.intersectsObject(obj)
                },
                toScreenPosition(obj, camera) {
                    var vector = new THREE.Vector3()
                    var widthHalf = 0.5 * this.renderer.context.canvas.width
                    var heightHalf = 0.5 * this.renderer.context.canvas.height

                    obj.updateMatrixWorld()
                    vector.setFromMatrixPosition(obj.matrixWorld)
                    vector.project(camera)

                    vector.x = vector.x * widthHalf + widthHalf
                    vector.y = -(vector.y * heightHalf) + heightHalf

                    return {
                        x: vector.x,
                        y: vector.y
                    }
                },
                // 点击事件交互
                initClick: function() {
                    var _this = this,
                        dom = this.renderer.domElement,
                        raycaster = new THREE.Raycaster()
                    dom.onclick = function(event) {
                        // var mouse = {};
                        // mouse.x = ( (event.clientX - dom.getBoundingClientRect().left) / dom.offsetWidth ) * 2 - 1;
                        // mouse.y = - ( (event.clientY - dom.getBoundingClientRect().top) / dom.offsetHeight ) * 2 + 1;
                        // var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(_this.camera),
                        // // 在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
                        //     raycaster = new THREE.Raycaster( _this.camera.position, vector.sub(_this.camera.position).normalize() ),
                        // // 射线和模型求交，选中一系列直线
                        //     intersects = raycaster.intersectObjects(_this.cube);

                        // console.log(intersects)
                        // console.log( vector )
                        var mouse = {}
                        mouse.x =
                            ((event.clientX -
                                dom.getBoundingClientRect().left) /
                                dom.offsetWidth) *
                                2 -
                            1
                        mouse.y =
                            -(
                                (event.clientY -
                                    dom.getBoundingClientRect().top) /
                                dom.offsetHeight
                            ) *
                                2 +
                            1
                        raycaster.setFromCamera(mouse, _this.camera)

                        var intersects = raycaster.intersectObjects(
                            _this.cube[0].children
                        )
                        if (intersects.length <= 0) {
                            return false
                        }
                        // intersects[0].point  就是当前点击的点
                        var activePoint = intersects[0].point
                        console.log(activePoint)

                        // var tagMesh = new THREE.Mesh(
                        //     new THREE.SphereGeometry(1),
                        //     new THREE.MeshBasicMaterial({ color: 0xffff00 })
                        // )
                        // tagMesh.position.copy(activePoint)
                        // _this.tagObject.add(tagMesh)

                        // var tagElement = document.createElement('div')
                        // tagElement.innerHTML =
                        //     '<span>标记' +
                        //     ~~(Math.random() * 100000) +
                        //     '</span>'
                        // tagElement.style.background = '#00ff00'
                        // tagElement.style.position = 'absolute'
                        // tagElement.addEventListener('click', function(evt) {
                        //     alert(tagElement.innerText)
                        // })

                        // tagMesh.updateTag = function() {
                        //     if (_this.isOffScreen(tagMesh, _this.camera)) {
                        //         tagElement.style.display = 'none'
                        //     } else {
                        //         tagElement.style.display = 'block'
                        //         var position = _this.toScreenPosition(
                        //             tagMesh,
                        //             _this.camera
                        //         )
                        //         tagElement.style.left = position.x + 'px'
                        //         tagElement.style.top = position.y + 'px'
                        //     }
                        // }
                        // tagMesh.updateTag()
                        // _this.tags.push(tagMesh)
                        // document
                        //     .getElementById('canvas')
                        //     .appendChild(tagElement)

                        var points = []
                        points.push(new THREE.Vector3(0, 0, 0))
                        points.push(intersects[0].point)
                        var mat = new THREE.MeshBasicMaterial({
                            color: 0xff0000,
                            transparent: true,
                            opacity: 0.5
                        })
                        var sphereGeometry = new THREE.SphereGeometry(100)
                        var raycasterCubeMesh
                        raycasterCubeMesh = new THREE.Mesh(sphereGeometry, mat)
                        raycasterCubeMesh.position.copy(intersects[0].point)
                        _this.scene.add(raycasterCubeMesh)
                        var activePoint = intersects[0].point
                    }
                }
            }
            Tcanvas()
        </script>
    </body>
</html>

```
