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

        // 创建相机
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
        var axesHelper = new THREE.AxesHelper(300);
        scene.add(axesHelper);

        var geometry = new THREE.BoxBufferGeometry(150, 150, 150);
        var material = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          // ！！！！ 必须开启这个 蒙皮
          skinning: true
          //   wireframe: true
        });

        // 必须用这种mesh
        var cube = new THREE.SkinnedMesh(geometry, material);
        // 创建骨骼
        // root是根节点 相当于起始位置
        var root = new THREE.Bone();
        var child = new THREE.Bone();
        // 为啥要加到root里面  猜想是连起来 这个几个骨骼是一体的
        root.add(child);
        // 设置骨骼位置
        child.position.y = 100;
        root.position.y = 50;
        // 形成骨架
        var skeleton = new THREE.Skeleton([root, child]);
        // 模型中加入骨骼 为啥是 0  母鸡 猜想是从头开始放入
        cube.add(skeleton.bones[0]);
        // 绑定骨骼
        cube.bind(skeleton);
        // 这里就可以操作骨骼做动作了 变形之类的
        skeleton.bones[0].rotation.x = -0.1;
        skeleton.bones[1].rotation.y = 45;
        // console.log(skeleton.bones[0]);

        // 开启辅助 看看骨骼
        var helper = new THREE.SkeletonHelper(cube);
        // 骨骼宽度  改了没啥用 ??? 文档错了？？
        helper.material.linewidth = 100;
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

      function animate() {
        controls.update();
        renderer.render(scene, camera);

        requestAnimationFrame(animate);
      }
    </script>
  </body>
</html>

```
