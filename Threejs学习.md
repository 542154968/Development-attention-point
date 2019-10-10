# Begin THREEJS的demo很齐全 多看看基本需求都能解决

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
        <title>将3D坐标的标记投影到屏幕上</title>
        <script type="text/javascript" src="libs/three.js"></script>
        <script type="text/javascript" src="libs/stats.min.js"></script>
        <script type="text/javascript" src="libs/dat.gui.min.js"></script>

        <script
            type="text/javascript"
            src="libs/controls/OrbitControls.js"
        ></script>

        <style>
            body {
                /* set margin to 0 and overflow to hidden, to go fullscreen */
                margin: 0;
                overflow: hidden;
            }
        </style>
    </head>
    <body>
        <div id="Stats-output"></div>
        <!-- Div which will hold the Output -->
        <div id="WebGL-output"></div>

        <script type="text/javascript">
            var scene = new THREE.Scene()

            var camera = new THREE.PerspectiveCamera(
                45,
                window.innerWidth / window.innerHeight,
                0.1,
                1000000
            )
            camera.position.set(0, 5, 33)
            camera.lookAt(scene.position)

            var renderer = new THREE.WebGLRenderer()
            renderer.setClearColor(0x000000, 1.0)
            renderer.setPixelRatio(window.devicePixelRatio)
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.sortObjects = true

            renderer.shadowMap.enabled = true
            renderer.shadowMap.type = THREE.PCFShadowMap

            var ambientLight = new THREE.AmbientLight(0xffffff)
            scene.add(ambientLight)

            var light = new THREE.SpotLight(0xffffff, 1.1)
            light.position.set(0, 0, 0)
            light.castShadow = true
            scene.add(light)

            var tagObject = new THREE.Object3D()
            scene.add(tagObject)

            var controls = new THREE.OrbitControls(camera)

            document
                .getElementById('WebGL-output')
                .appendChild(renderer.domElement)

            var textureCube = createCubeMap()
            var shader = THREE.ShaderLib['cube']
            shader.uniforms['tCube'].value = textureCube
            var material = new THREE.ShaderMaterial({
                uniforms: shader.uniforms,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader,
                depthWrite: false,
                side: THREE.BackSide
            })
            var geometry = new THREE.BoxGeometry(10000, 10000, 10000)
            var cubeMesh = new THREE.Mesh(geometry, material)

            // var loader = new THREE.TextureLoader(),
            //     texture = loader.load(
            //         'images/DJI_0114-output Panorama.jpg',
            //         function(obj) {
            //             renderer.render(scene, camera)
            //             return obj
            //         }
            //     ),
            //     cubeMesh = new THREE.Mesh(
            //         // 形状
            //         // new THREE.CubeGeometry(10, 10, 10),
            //         new THREE.SphereGeometry(50, 32, 32),
            //         // 材质
            //         new THREE.MeshPhongMaterial({
            //             // color: 0xff0000,
            //             side: THREE.DoubleSide,
            //             map: texture
            //         })
            //     )
            scene.add(cubeMesh)

            //添加射线代码
            var raycasterCubeMesh
            var raycaster = new THREE.Raycaster()
            var mouseVector = new THREE.Vector3()
            var tags = []

            document.addEventListener('mousemove', onMouseMove, false)
            document.addEventListener('mousedown', onMouseDown, false)

            render()

            var activePoint
            function onMouseMove(event) {
                mouseVector.x = 2 * (event.clientX / window.innerWidth) - 1
                mouseVector.y = -2 * (event.clientY / window.innerHeight) + 1

                raycaster.setFromCamera(mouseVector.clone(), camera)
                var intersects = raycaster.intersectObjects([cubeMesh])

                if (raycasterCubeMesh) {
                    scene.remove(raycasterCubeMesh)
                }
                activePoint = null
                if (intersects.length > 0) {
                    // var points = []
                    // points.push(new THREE.Vector3(0, 0, 0))
                    // points.push(intersects[0].point)

                    // var mat = new THREE.MeshBasicMaterial({
                    //     color: 0xff0000,
                    //     transparent: true,
                    //     opacity: 0.5
                    // })
                    // var sphereGeometry = new THREE.SphereGeometry(100)

                    // raycasterCubeMesh = new THREE.Mesh(sphereGeometry, mat)
                    // raycasterCubeMesh.position.copy(intersects[0].point)
                    // scene.add(raycasterCubeMesh)
                    activePoint = intersects[0].point
                }
            }
            function onMouseDown(event) {
                if (event.buttons === 2 && activePoint) {
                    var tagMesh = new THREE.Mesh(
                        new THREE.SphereGeometry(0.1),
                        new THREE.MeshBasicMaterial({ color: 0xffff00 })
                    )
                    tagMesh.position.copy(activePoint)
                    tagObject.add(tagMesh)

                    var tagElement = document.createElement('div')
                    tagElement.innerHTML =
                        '<span>标记' + (tags.length + 1) + '</span>'
                    tagElement.style.background = '#00ff00'
                    tagElement.style.position = 'absolute'
                    tagElement.addEventListener('click', function(evt) {
                        alert(tagElement.innerText)
                    })
                    tagMesh.updateTag = function() {
                        if (isOffScreen(tagMesh, camera)) {
                            tagElement.style.display = 'none'
                        } else {
                            tagElement.style.display = 'block'
                            var position = toScreenPosition(tagMesh, camera)
                            tagElement.style.left = position.x + 'px'
                            tagElement.style.top = position.y + 'px'
                        }
                    }
                    tagMesh.updateTag()
                    document
                        .getElementById('WebGL-output')
                        .appendChild(tagElement)
                    tags.push(tagMesh)
                }
            }

            function createCubeMap() {
                var path = 'assets/texture/cubemap/'
                var format = '.jpg'
                var context = ''

                var urls = [
                    path + 'posx' + context + format,
                    path + 'negx' + context + format,
                    path + 'posy' + context + format,
                    path + 'negy' + context + format,
                    path + 'posz' + context + format,
                    path + 'negz' + context + format
                ]

                var texture = THREE.ImageUtils.loadTextureCube(
                    urls,
                    THREE.CubeReflectionMapping
                )

                return texture
            }

            function toScreenPosition(obj, camera) {
                var vector = new THREE.Vector3()
                var widthHalf = 0.5 * renderer.context.canvas.width
                var heightHalf = 0.5 * renderer.context.canvas.height

                obj.updateMatrixWorld()
                vector.setFromMatrixPosition(obj.matrixWorld)
                vector.project(camera)

                vector.x = vector.x * widthHalf + widthHalf
                vector.y = -(vector.y * heightHalf) + heightHalf

                return {
                    x: vector.x,
                    y: vector.y
                }
            }

            function isOffScreen(obj, camera) {
                var frustum = new THREE.Frustum() //Frustum用来确定相机的可视区域
                var cameraViewProjectionMatrix = new THREE.Matrix4()
                cameraViewProjectionMatrix.multiplyMatrices(
                    camera.projectionMatrix,
                    camera.matrixWorldInverse
                ) //获取相机的法线
                frustum.setFromMatrix(cameraViewProjectionMatrix) //设置frustum沿着相机法线方向

                return !frustum.intersectsObject(obj)
            }

            function render() {
                controls.update()
                tags.forEach(function(tagMesh) {
                    tagMesh.updateTag()
                })
                renderer.render(scene, camera)
                requestAnimationFrame(render)
            }
        </script>
    </body>
</html>

```

## THREEJS 实现3D签到墙
```html
<!DOCTYPE html>
<html>
	<head>
		<title>three.js css3d - periodic table</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
		<style>
			html, body {
				height: 100%;
			}

			body {
				background-color: #000000;
				margin: 0;
				font-family: Helvetica, sans-serif;;
				overflow: hidden;
			}

			a {
				color: #ffffff;
			}

			#info {
				position: absolute;
				width: 100%;
				color: #ffffff;
				padding: 5px;
				font-family: Monospace;
				font-size: 13px;
				font-weight: bold;
				text-align: center;
				z-index: 1;
			}

			#menu {
				position: absolute;
				bottom: 20px;
				width: 100%;
				text-align: center;
			}

			.element {
				width: 120px;
				height: 160px;
				box-shadow: 0px 0px 12px rgba(0,255,255,0.5);
				border: 1px solid rgba(127,255,255,0.25);
				text-align: center;
				cursor: default;
			}

			.element:hover {
				box-shadow: 0px 0px 12px rgba(0,255,255,0.75);
				border: 1px solid rgba(127,255,255,0.75);
			}

				.element .number {
					position: absolute;
					top: 20px;
					right: 20px;
					font-size: 12px;
					color: rgba(127,255,255,0.75);
				}

				.element .symbol {
					position: absolute;
					top: 40px;
					left: 0px;
					right: 0px;
					font-size: 60px;
					font-weight: bold;
					color: rgba(255,255,255,0.75);
					text-shadow: 0 0 10px rgba(0,255,255,0.95);
				}

				.element .details {
					position: absolute;
					bottom: 15px;
					left: 0px;
					right: 0px;
					font-size: 12px;
					color: rgba(127,255,255,0.75);
				}

			button {
				color: rgba(127,255,255,0.75);
				background: transparent;
				outline: 1px solid rgba(127,255,255,0.75);
				border: 0px;
				padding: 5px 10px;
				cursor: pointer;
			}
			button:hover {
				background-color: rgba(0,255,255,0.5);
			}
			button:active {
				color: #000000;
				background-color: rgba(0,255,255,0.75);
			}
		</style>
	</head>
	<body>
		<script src="../build/three.js"></script>
		<script src="js/libs/tween.min.js"></script>
		<script src="js/controls/TrackballControls.js"></script>
		<script src="js/renderers/CSS3DRenderer.js"></script>

		<div id="info"><a href="http://threejs.org" target="_blank" rel="noopener">three.js css3d</a> - periodic table. <a href="https://plus.google.com/113862800338869870683/posts/QcFk5HrWran" target="_blank" rel="noopener">info</a>.</div>
		<div id="container"></div>
		<div id="menu">
			<button id="table">TABLE</button>
			<button id="sphere">SPHERE</button>
			<button id="helix">HELIX</button>
			<button id="grid">GRID</button>
		</div>

		<script>

			var table = [
				"H", "Hydrogen", "1.00794", 1, 1,
				"He", "Helium", "4.002602", 18, 1,
				"Li", "Lithium", "6.941", 1, 2,
				"Be", "Beryllium", "9.012182", 2, 2,
				"B", "Boron", "10.811", 13, 2,
				"C", "Carbon", "12.0107", 14, 2,
				"N", "Nitrogen", "14.0067", 15, 2,
				"O", "Oxygen", "15.9994", 16, 2,
				"F", "Fluorine", "18.9984032", 17, 2,
				"Ne", "Neon", "20.1797", 18, 2,
				"Na", "Sodium", "22.98976...", 1, 3,
				"Mg", "Magnesium", "24.305", 2, 3,
				"Al", "Aluminium", "26.9815386", 13, 3,
				"Si", "Silicon", "28.0855", 14, 3,
				"P", "Phosphorus", "30.973762", 15, 3,
				"S", "Sulfur", "32.065", 16, 3,
				"Cl", "Chlorine", "35.453", 17, 3,
				"Ar", "Argon", "39.948", 18, 3,
				"K", "Potassium", "39.948", 1, 4,
				"Ca", "Calcium", "40.078", 2, 4,
				"Sc", "Scandium", "44.955912", 3, 4,
				"Ti", "Titanium", "47.867", 4, 4,
				"V", "Vanadium", "50.9415", 5, 4,
				"Cr", "Chromium", "51.9961", 6, 4,
				"Mn", "Manganese", "54.938045", 7, 4,
				"Fe", "Iron", "55.845", 8, 4,
				"Co", "Cobalt", "58.933195", 9, 4,
				"Ni", "Nickel", "58.6934", 10, 4,
				"Cu", "Copper", "63.546", 11, 4,
				"Zn", "Zinc", "65.38", 12, 4,
				"Ga", "Gallium", "69.723", 13, 4,
				"Ge", "Germanium", "72.63", 14, 4,
				"As", "Arsenic", "74.9216", 15, 4,
				"Se", "Selenium", "78.96", 16, 4,
				"Br", "Bromine", "79.904", 17, 4,
				"Kr", "Krypton", "83.798", 18, 4,
				"Rb", "Rubidium", "85.4678", 1, 5,
				"Sr", "Strontium", "87.62", 2, 5,
				"Y", "Yttrium", "88.90585", 3, 5,
				"Zr", "Zirconium", "91.224", 4, 5,
				"Nb", "Niobium", "92.90628", 5, 5,
				"Mo", "Molybdenum", "95.96", 6, 5,
				"Tc", "Technetium", "(98)", 7, 5,
				"Ru", "Ruthenium", "101.07", 8, 5,
				"Rh", "Rhodium", "102.9055", 9, 5,
				"Pd", "Palladium", "106.42", 10, 5,
				"Ag", "Silver", "107.8682", 11, 5,
				"Cd", "Cadmium", "112.411", 12, 5,
				"In", "Indium", "114.818", 13, 5,
				"Sn", "Tin", "118.71", 14, 5,
				"Sb", "Antimony", "121.76", 15, 5,
				"Te", "Tellurium", "127.6", 16, 5,
				"I", "Iodine", "126.90447", 17, 5,
				"Xe", "Xenon", "131.293", 18, 5,
				"Cs", "Caesium", "132.9054", 1, 6,
				"Ba", "Barium", "132.9054", 2, 6,
				"La", "Lanthanum", "138.90547", 4, 9,
				"Ce", "Cerium", "140.116", 5, 9,
				"Pr", "Praseodymium", "140.90765", 6, 9,
				"Nd", "Neodymium", "144.242", 7, 9,
				"Pm", "Promethium", "(145)", 8, 9,
				"Sm", "Samarium", "150.36", 9, 9,
				"Eu", "Europium", "151.964", 10, 9,
				"Gd", "Gadolinium", "157.25", 11, 9,
				"Tb", "Terbium", "158.92535", 12, 9,
				"Dy", "Dysprosium", "162.5", 13, 9,
				"Ho", "Holmium", "164.93032", 14, 9,
				"Er", "Erbium", "167.259", 15, 9,
				"Tm", "Thulium", "168.93421", 16, 9,
				"Yb", "Ytterbium", "173.054", 17, 9,
				"Lu", "Lutetium", "174.9668", 18, 9,
				"Hf", "Hafnium", "178.49", 4, 6,
				"Ta", "Tantalum", "180.94788", 5, 6,
				"W", "Tungsten", "183.84", 6, 6,
				"Re", "Rhenium", "186.207", 7, 6,
				"Os", "Osmium", "190.23", 8, 6,
				"Ir", "Iridium", "192.217", 9, 6,
				"Pt", "Platinum", "195.084", 10, 6,
				"Au", "Gold", "196.966569", 11, 6,
				"Hg", "Mercury", "200.59", 12, 6,
				"Tl", "Thallium", "204.3833", 13, 6,
				"Pb", "Lead", "207.2", 14, 6,
				"Bi", "Bismuth", "208.9804", 15, 6,
				"Po", "Polonium", "(209)", 16, 6,
				"At", "Astatine", "(210)", 17, 6,
				"Rn", "Radon", "(222)", 18, 6,
				"Fr", "Francium", "(223)", 1, 7,
				"Ra", "Radium", "(226)", 2, 7,
				"Ac", "Actinium", "(227)", 4, 10,
				"Th", "Thorium", "232.03806", 5, 10,
				"Pa", "Protactinium", "231.0588", 6, 10,
				"U", "Uranium", "238.02891", 7, 10,
				"Np", "Neptunium", "(237)", 8, 10,
				"Pu", "Plutonium", "(244)", 9, 10,
				"Am", "Americium", "(243)", 10, 10,
				"Cm", "Curium", "(247)", 11, 10,
				"Bk", "Berkelium", "(247)", 12, 10,
				"Cf", "Californium", "(251)", 13, 10,
				"Es", "Einstenium", "(252)", 14, 10,
				"Fm", "Fermium", "(257)", 15, 10,
				"Md", "Mendelevium", "(258)", 16, 10,
				"No", "Nobelium", "(259)", 17, 10,
				"Lr", "Lawrencium", "(262)", 18, 10,
				"Rf", "Rutherfordium", "(267)", 4, 7,
				"Db", "Dubnium", "(268)", 5, 7,
				"Sg", "Seaborgium", "(271)", 6, 7,
				"Bh", "Bohrium", "(272)", 7, 7,
				"Hs", "Hassium", "(270)", 8, 7,
				"Mt", "Meitnerium", "(276)", 9, 7,
				"Ds", "Darmstadium", "(281)", 10, 7,
				"Rg", "Roentgenium", "(280)", 11, 7,
				"Cn", "Copernicium", "(285)", 12, 7,
				"Nh", "Nihonium", "(286)", 13, 7,
				"Fl", "Flerovium", "(289)", 14, 7,
				"Mc", "Moscovium", "(290)", 15, 7,
				"Lv", "Livermorium", "(293)", 16, 7,
				"Ts", "Tennessine", "(294)", 17, 7,
				"Og", "Oganesson", "(294)", 18, 7
			];

			var camera, scene, renderer;
			var controls;

			var objects = [];
			var targets = { table: [], sphere: [], helix: [], grid: [] };

			init();
			animate();

			function init() {

				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 3000;

				scene = new THREE.Scene();

				// table

				for ( var i = 0; i < table.length; i += 5 ) {

					var element = document.createElement( 'div' );
					element.className = 'element';
					element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

					var number = document.createElement( 'div' );
					number.className = 'number';
					number.textContent = ( i / 5 ) + 1;
					element.appendChild( number );

					var symbol = document.createElement( 'div' );
					symbol.className = 'symbol';
					symbol.textContent = table[ i ];
					element.appendChild( symbol );

					var details = document.createElement( 'div' );
					details.className = 'details';
					details.innerHTML = table[ i + 1 ] + '<br>' + table[ i + 2 ];
					element.appendChild( details );

					var object = new THREE.CSS3DObject( element );
					object.position.x = Math.random() * 4000 - 2000;
					object.position.y = Math.random() * 4000 - 2000;
					object.position.z = Math.random() * 4000 - 2000;
					scene.add( object );

					objects.push( object );

					//

					var object = new THREE.Object3D();
					object.position.x = ( table[ i + 3 ] * 140 ) - 1330;
					object.position.y = - ( table[ i + 4 ] * 180 ) + 990;

					targets.table.push( object );

				}

				// sphere

				var vector = new THREE.Vector3();

				for ( var i = 0, l = objects.length; i < l; i ++ ) {

					var phi = Math.acos( - 1 + ( 2 * i ) / l );
					var theta = Math.sqrt( l * Math.PI ) * phi;

					var object = new THREE.Object3D();

					object.position.setFromSphericalCoords( 800, phi, theta );

					vector.copy( object.position ).multiplyScalar( 2 );

					object.lookAt( vector );

					targets.sphere.push( object );

				}

				// helix

				var vector = new THREE.Vector3();

				for ( var i = 0, l = objects.length; i < l; i ++ ) {

					var theta = i * 0.175 + Math.PI;
					var y = - ( i * 8 ) + 450;

					var object = new THREE.Object3D();

					object.position.setFromCylindricalCoords( 900, theta, y );

					vector.x = object.position.x * 2;
					vector.y = object.position.y;
					vector.z = object.position.z * 2;

					object.lookAt( vector );

					targets.helix.push( object );

				}

				// grid

				for ( var i = 0; i < objects.length; i ++ ) {

					var object = new THREE.Object3D();

					object.position.x = ( ( i % 5 ) * 400 ) - 800;
					object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
					object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

					targets.grid.push( object );

				}

				//

				renderer = new THREE.CSS3DRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.getElementById( 'container' ).appendChild( renderer.domElement );

				//

				controls = new THREE.TrackballControls( camera, renderer.domElement );
				controls.rotateSpeed = 0.5;
				controls.minDistance = 500;
				controls.maxDistance = 6000;
				controls.addEventListener( 'change', render );

				var button = document.getElementById( 'table' );
				button.addEventListener( 'click', function () {

					transform( targets.table, 2000 );

				}, false );

				var button = document.getElementById( 'sphere' );
				button.addEventListener( 'click', function () {

					transform( targets.sphere, 2000 );

				}, false );

				var button = document.getElementById( 'helix' );
				button.addEventListener( 'click', function () {

					transform( targets.helix, 2000 );

				}, false );

				var button = document.getElementById( 'grid' );
				button.addEventListener( 'click', function () {

					transform( targets.grid, 2000 );

				}, false );

				transform( targets.table, 2000 );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function transform( targets, duration ) {

				TWEEN.removeAll();

				for ( var i = 0; i < objects.length; i ++ ) {

					var object = objects[ i ];
					var target = targets[ i ];

					new TWEEN.Tween( object.position )
						.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();

					new TWEEN.Tween( object.rotation )
						.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();

				}

				new TWEEN.Tween( this )
					.to( {}, duration * 2 )
					.onUpdate( render )
					.start();

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}

			function animate() {

				requestAnimationFrame( animate );

				TWEEN.update();

				controls.update();

			}

			function render() {

				renderer.render( scene, camera );

			}

		</script>
	</body>
</html>

```

## 实现地图 使用geojson  介绍链接

https://www.oschina.net/translate/geojson-spec
// 一些资料
https://www.iteye.com/blog/ningandjiao-2159894
https://blog.csdn.net/u014529917/article/details/80322034


## 实现路径移动效果 
[78 - three.js 笔记 - 设置纹理offset偏移模拟箭头线性流动](https://blog.csdn.net/ithanmang/article/details/83538039)
[ThreeJS模拟人沿着路径运动-路径箭头使用纹理offset偏移](https://www.cnblogs.com/xuejianxiyang/p/9719715.html)
[纹理 纹理映射](http://www.yanhuangxueyuan.com/Three.js_course/texture.html#2)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>第一个three.js文件_WebGL三维场景</title>
    <style>
      body {
        margin: 0;
        overflow: hidden;
      }
    </style>
    <script src="../build/three.js"></script>
    <script src="js/controls/OrbitControls.js"></script>
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
      var curve = new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(-80, -40, 0),
          new THREE.Vector3(-70, 40, 0),
          new THREE.Vector3(70, 40, 0),
          new THREE.Vector3(80, -40, 0)
        ],
        false /*是否闭合*/
      );
      var tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.6, 50, false);
      var textureLoader = new THREE.TextureLoader();
      var texture = textureLoader.load("textures/road.png");
      // 设置阵列模式为 RepeatWrapping
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
      //等价texture.repeat= new THREE.Vector2(20,1)
      texture.repeat.x = 20;
      var tubeMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true
      });
      var tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      scene.add(tube);
      /**
       * 创建一个半透明管道
       */
      var tubeGeometry2 = new THREE.TubeGeometry(curve, 100, 2, 50, false);
      var tubeMaterial2 = new THREE.MeshPhongMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.3
      });
      var tube2 = new THREE.Mesh(tubeGeometry2, tubeMaterial2);
      scene.add(tube2);

      scene.add(new THREE.AxesHelper(300));

      //小人box
      //geometryP = new THREE.CircleGeometry( 5, 32 );
      geometryP = new THREE.SphereGeometry(5, 16, 16);
      console.log("geometryP", geometryP);
      var materialP = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide
      });
      circleP = new THREE.Mesh(geometryP, materialP);
      scene.add(circleP);
      geometryP.rotateY(Math.PI / 2);

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

      var progress = 0;

      // 渲染函数
      function render() {
        renderer.render(scene, camera); //执行渲染操作
        requestAnimationFrame(render);
        // 使用加减法可以设置不同的运动方向
        // 设置纹理偏移
        texture.offset.x -= 0.06;

        if (progress > 1.0) {
          return; //停留在管道末端,否则会一直跑到起点 循环再跑
        }
        progress += 0.0009;
        console.log(progress);
        if (curve) {
          let point = curve.getPoint(progress);
          if (point && point.x) {
            circleP.position.set(point.x, point.y, point.z);
          }
        }
      }
      render();
      var controls = new THREE.OrbitControls(camera); //创建控件对象
    </script>
  </body>
</html>

```

## 实现局部辉光 和 切换显示某个局部辉光
> 核心是 UnrealBloomPass 现存问题 加载的模型使用这个方法时 如果遍历设置layer 渲染会卡 

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>three.js webgl - postprocessing - unreal bloom</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
    />
    <style>
      body {
        color: #fff;
        font-family: Monospace;
        font-size: 13px;
        text-align: center;
        background-color: #fff;
        margin: 0px;
        overflow: hidden;
      }
      #info {
        position: absolute;
        top: 0px;
        width: 100%;
        padding: 5px;
      }
      #info p {
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        padding: 0 2em;
      }
      a {
        color: #2983ff;
      }
    </style>
  </head>

  <body>
    <div id="container"></div>

    <div id="info">
      <a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> -
      Bloom pass by
      <a href="http://eduperiment.com" target="_blank" rel="noopener"
        >Prashant Sharma</a
      >
      and
      <a href="https://clara.io" target="_blank" rel="noopener">Ben Houston</a>
      <p>
        This Bloom Pass is inspired by the bloom pass of the Unreal Engine. It
        creates a mip map chain of bloom textures and blur them with different
        radii. Because of the weigted combination of mips, and since larger
        blurs are done on higher mips, this bloom is better in quality and
        performance.
      </p>
      Model:
      <a
        href="https://blog.sketchfab.com/art-spotlight-primary-ion-drive/"
        target="_blank"
        rel="noopener"
        >Primary Ion Drive</a
      >
      by
      <a href="http://mjmurdock.com/" target="_blank" rel="noopener"
        >Mike Murdock</a
      >, CC Attribution.
    </div>

    <script src="../build/three.js"></script>

    <script src="js/libs/stats.min.js"></script>
    <script src="js/libs/dat.gui.min.js"></script>
    <script src="js/controls/OrbitControls.js"></script>
    <script src="js/loaders/GLTFLoader.js"></script>

    <script src="js/postprocessing/EffectComposer.js"></script>
    <script src="js/postprocessing/RenderPass.js"></script>
    <script src="js/postprocessing/ShaderPass.js"></script>
    <script src="js/shaders/CopyShader.js"></script>
    <script src="js/shaders/LuminosityHighPassShader.js"></script>
    <script src="js/postprocessing/UnrealBloomPass.js"></script>

    <script>
      var scene, camera, controls, pointLight, stats;
      var composer, renderer, mixer;

      var params = {
        exposure: 1,
        bloomStrength: 20,
        bloomThreshold: 0,
        bloomRadius: 0
      };

      var clock = new THREE.Clock();
      var container = document.getElementById("container");

      stats = new Stats();
      container.appendChild(stats.dom);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ReinhardToneMapping;
      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        100
      );
      camera.position.set(-5, 2.5, -3.5);
      camera.layers.enable(0);
      scene.add(camera);

      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.5;
      controls.minDistance = 1;
      controls.maxDistance = 10;

      scene.add(new THREE.AmbientLight(0x404040));

      pointLight = new THREE.PointLight(0xffffff, 1);
      camera.add(pointLight);

      var renderScene = new THREE.RenderPass(scene, camera);

      var bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      );
      bloomPass.renderToScreen = true;
      bloomPass.threshold = params.bloomThreshold;
      bloomPass.strength = params.bloomStrength;
      bloomPass.radius = params.bloomRadius;

      composer = new THREE.EffectComposer(renderer);
      composer.setSize(window.innerWidth, window.innerHeight);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);

      new THREE.GLTFLoader().load("models/gltf/PrimaryIonDrive.glb", function(
        gltf
      ) {
        // 应该不是这种方式渲染的 不然好卡
        // function deepLayers(obj) {
        //   if (Array.isArray(obj.children) && obj.children.length > 0) {
        //     for (var l = obj.children.length, i = 0; i < l; i++) {
        //       var item = obj.children[i];
        //       item.type === "Mesh" ? item.layers.enable(1) : deepLayers(item);
        //       item.type === "Mesh" && console.log(item);
        //     }
        //   }
        // }
        var model = gltf.scene;
        // model.layers.enable(1);
        // deepLayers(model);

        scene.add(model);

        // Mesh contains self-intersecting semi-transparent faces, which display
        // z-fighting unless depthWrite is disabled.
        var core = model.getObjectByName("geo1_HoloFillDark_0");
        core.material.depthWrite = false;

        mixer = new THREE.AnimationMixer(model);
        var clip = gltf.animations[0];
        mixer.clipAction(clip.optimize()).play();
        console.log(model, gltf);
        animate();
      });

      (function() {
        var objBack = new THREE.Mesh(
          new THREE.BoxGeometry(5, 5, 1),
          new THREE.MeshBasicMaterial({ color: "red", wireframe: false })
        );
        objBack.position.z = -2.25;
        objBack.layers.enable(2);
        scene.add(objBack);
      })();

      (function() {
        var material = new THREE.LineBasicMaterial({ color: "#DC143C" });
        var geometry = new THREE.Geometry();

        geometry.vertices.push(new THREE.Vector3(5, 0, 1));
        geometry.vertices.push(new THREE.Vector3(0, 5, 1));
        //线构造
        var line = new THREE.Line(geometry, material);

        line.layers.enable(3);
        scene.add(line);
      })();

      (function() {
        var spriteMap = new THREE.TextureLoader().load("textures/colors.png");
        var spriteMaterial = new THREE.SpriteMaterial({
          map: spriteMap,
          color: 0xffffff
        });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.layers.enable(4);
        sprite.position.set(0, 0, -5);

        scene.add(sprite);
      })();

      window.onresize = function() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        composer.setSize(width, height);
      };

      function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();

        mixer.update(delta);

        stats.update();
        // 如果整个场景都高亮 用下面整个
        // composer.render();

        // 如果只高亮一部分 就下面的代码
        // 原理就是 根据摄像机设置的layers 显示不同层次的layers layer就是层次

        // 关闭自动清除缓存
        renderer.autoClear = false;
        // 清除缓存
        renderer.clear();
        // 设置当前高亮的部位 建立关系 显示哪个
        camera.layers.set(1);
        // 渲染
        composer.render();

        // 清除深度缓存 显示没有添加亮度的模型 设置为0
        renderer.clearDepth();
        camera.layers.set(0);
        renderer.render(scene, camera);
      }

      var gui = new dat.GUI();

      gui.add(params, "exposure", 0.1, 2).onChange(function(value) {
        renderer.toneMappingExposure = Math.pow(value, 4.0);
      });

      gui.add(params, "bloomThreshold", 0.0, 1.0).onChange(function(value) {
        bloomPass.threshold = Number(value);
      });

      gui.add(params, "bloomStrength", 0.0, 20.0).onChange(function(value) {
        bloomPass.strength = Number(value);
      });

      gui
        .add(params, "bloomRadius", 0.0, 1.0)
        .step(0.01)
        .onChange(function(value) {
          bloomPass.radius = Number(value);
        });
    </script>
  </body>
</html>

```

## threejs 光后期处理 边缘发光实现
- UnrealBloomPass 辉光
- OutlinePass 边缘发光
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>three.js webgl - post processing - Outline Pass</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
    />
    <style>
      body {
        background-color: #000000;
        margin: 0px;
        overflow: hidden;
        font-family: Monospace;
        font-size: 13px;
        text-align: center;
        font-weight: bold;
      }

      a {
        color: #00ff78;
      }

      #info {
        color: #fff;
        position: absolute;
        top: 10px;
        width: 100%;
        text-align: center;
        display: block;
      }
      .dg.ac {
        z-index: 1 !important; /* FIX DAT.GUI */
      }
    </style>
  </head>
  <body>
    <script src="../build/three.js"></script>
    <script src="js/controls/OrbitControls.js"></script>
    <script src="js/loaders/OBJLoader.js"></script>

    <script src="js/WebGL.js"></script>

    <script src="js/shaders/CopyShader.js"></script>
    <script src="js/shaders/FXAAShader.js"></script>
    <script src="js/postprocessing/EffectComposer.js"></script>
    <script src="js/postprocessing/RenderPass.js"></script>
    <script src="js/postprocessing/ShaderPass.js"></script>
    <script src="js/postprocessing/OutlinePass.js"></script>
    <script src="js/libs/stats.min.js"></script>
    <script src="js/libs/dat.gui.min.js"></script>

    <div id="info">
      <a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> -
      Outline Pass by
      <a href="http://eduperiment.com" target="_blank" rel="noopener"
        >Prashant Sharma</a
      >
      and
      <a href="https://clara.io" target="_blank" rel="noopener">Ben Houston</a
      ><br /><br />
    </div>

    <script>
      if (WEBGL.isWebGLAvailable() === false) {
        document.body.appendChild(WEBGL.getWebGLErrorMessage());
      }

      var container, stats;
      var camera, scene, renderer, controls;
      var raycaster = new THREE.Raycaster();

      var mouse = new THREE.Vector2();
      var selectedObjects = [];

      var composer, effectFXAA, outlinePass;
      var obj3d = new THREE.Object3D();

      var group = new THREE.Group();

      var params = {
        edgeStrength: 3.0,
        edgeGlow: 0.0,
        edgeThickness: 1.0,
        pulsePeriod: 0,
        rotate: false,
        usePatternTexture: false
      };

      init();
      animate();

      function init() {
        container = document.createElement("div");
        document.body.appendChild(container);

        var width = window.innerWidth;
        var height = window.innerHeight;

        renderer = new THREE.WebGLRenderer();
        renderer.shadowMap.enabled = true;
        // todo - support pixelRatio in this demo
        renderer.setSize(width, height);
        document.body.appendChild(renderer.domElement);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 8);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.minDistance = 5;
        controls.maxDistance = 20;
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;

        //

        scene.add(new THREE.AmbientLight(0xaaaaaa, 0.2));

        var light = new THREE.DirectionalLight(0xddffdd, 0.6);
        light.position.set(1, 1, 1);

        light.castShadow = true;

        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        var d = 10;

        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;

        light.shadow.camera.far = 1000;

        scene.add(light);

        // model

        var manager = new THREE.LoadingManager();

        manager.onProgress = function(item, loaded, total) {
          console.log(item, loaded, total);
        };

        // var loader = new THREE.OBJLoader(manager);
        // loader.load("models/obj/tree.obj", function(object) {
        //   var scale = 1.0;

        //   object.traverse(function(child) {
        //     if (child instanceof THREE.Mesh) {
        //       child.geometry.center();
        //       child.geometry.computeBoundingSphere();
        //       scale = 0.2 * child.geometry.boundingSphere.radius;

        //       var phongMaterial = new THREE.MeshPhongMaterial({
        //         color: 0xffffff,
        //         specular: 0x111111,
        //         shininess: 5
        //       });
        //       child.material = phongMaterial;
        //       child.receiveShadow = true;
        //       child.castShadow = true;
        //     }
        //   });

        //   object.position.y = 1;
        //   object.scale.divideScalar(scale);
        //   obj3d.add(object);
        // });

        scene.add(group);

        group.add(obj3d);

        //

        var geometry = new THREE.SphereBufferGeometry(3, 48, 24);

        // for (var i = 0; i < 20; i++) {
        //   var material = new THREE.MeshLambertMaterial();
        //   material.color.setHSL(Math.random(), 1.0, 0.3);

        //   var mesh = new THREE.Mesh(geometry, material);
        //   mesh.position.x = Math.random() * 4 - 2;
        //   mesh.position.y = Math.random() * 4 - 2;
        //   mesh.position.z = Math.random() * 4 - 2;
        //   mesh.receiveShadow = true;
        //   mesh.castShadow = true;
        //   mesh.scale.multiplyScalar(Math.random() * 0.3 + 0.1);
        //   group.add(mesh);
        // }

        var floorMaterial = new THREE.MeshLambertMaterial({
          side: THREE.DoubleSide
        });

        var floorGeometry = new THREE.PlaneBufferGeometry(12, 12);
        var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        floorMesh.rotation.x -= Math.PI * 0.5;
        floorMesh.position.y -= 1.5;
        group.add(floorMesh);
        floorMesh.receiveShadow = true;

        var geometry = new THREE.TorusBufferGeometry(1, 0.3, 16, 100);
        var material = new THREE.MeshPhongMaterial({ color: 0xffaaff });
        var torus = new THREE.Mesh(geometry, material);
        torus.position.z = -4;
        group.add(torus);
        torus.receiveShadow = true;
        torus.castShadow = true;

        //

        stats = new Stats();
        container.appendChild(stats.dom);

        // postprocessing

        composer = new THREE.EffectComposer(renderer);

        var renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);

        outlinePass = new THREE.OutlinePass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          scene,
          camera
        );
        composer.addPass(outlinePass);

        var onLoad = function(texture) {
          //   outlinePass.patternTexture = texture;
          //   texture.wrapS = THREE.RepeatWrapping;
          //   texture.wrapT = THREE.RepeatWrapping;
        };

        var loader = new THREE.TextureLoader();
        outlinePass.selectedObjects = [floorMesh];

        loader.load("textures/tri_pattern.jpg", onLoad);

        effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
        effectFXAA.uniforms["resolution"].value.set(
          1 / window.innerWidth,
          1 / window.innerHeight
        );
        effectFXAA.renderToScreen = true;
        composer.addPass(effectFXAA);

        window.addEventListener("resize", onWindowResize, false);

        window.addEventListener("mousemove", onTouchMove);
        window.addEventListener("touchmove", onTouchMove);

        function onTouchMove(event) {
          var x, y;

          if (event.changedTouches) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
          } else {
            x = event.clientX;
            y = event.clientY;
          }

          mouse.x = (x / window.innerWidth) * 2 - 1;
          mouse.y = -(y / window.innerHeight) * 2 + 1;

          checkIntersection();
        }

        function addSelectedObject(object) {
          selectedObjects = [];
          selectedObjects.push(object);
        }

        function checkIntersection() {
          raycaster.setFromCamera(mouse, camera);

          var intersects = raycaster.intersectObjects([scene], true);

          if (intersects.length > 0) {
            var selectedObject = intersects[0].object;
            addSelectedObject(selectedObject);
            outlinePass.selectedObjects = selectedObjects;
            console.log(outlinePass, selectedObjects);
          } else {
            // outlinePass.selectedObjects = [];
          }
        }
      }

      function onWindowResize() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        composer.setSize(width, height);

        effectFXAA.uniforms["resolution"].value.set(
          1 / window.innerWidth,
          1 / window.innerHeight
        );
      }

      function animate() {
        requestAnimationFrame(animate);

        stats.begin();

        var timer = performance.now();

        if (params.rotate) {
          group.rotation.y = timer * 0.0001;
        }

        controls.update();

        composer.render();

        stats.end();
      }
    </script>
  </body>
</html>

```
