
![demo展示效果](https://img-blog.csdnimg.cn/20191101180056341.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)
> 随着时间的推移技术的进步，前端越来越杂了，但是也越来越精彩了。只是会用一点`ThreeJs`，对于`WebGl`的原理并没了解过，这并不影响我们利用`ThreeJs`去做出一个非常炫酷的项目。

# 开始
> 新世界的大门打开啦！
## 写在前面
1. 不要因为不了解就被这种3D展示的项目给吓到 其实实现起来**很简单 很简单 很简单**
2. 城市模型一份 最好是`gltf`模型，`obj`模型也没问题，我会介绍如何转化与压缩 PS:为什么只有这俩，因为我写这个项目只用到了这俩，处理的经验也是针对这俩的，我项目中所用的模型是公司所有暂不能提供。
3. 有一定`ThreeJs`的基础 俗话说得好 万丈高楼平地起嘛 如果没有这方面基础的同学也不要急 推荐一本书`《THREE.JS开发指南》`，有基础也有提高 很棒
4. 本文所示代码大部分只是思路 我也是第一次上手用`ThreeJs`处理模型并应用到项目中，可能有少许不足之处，还望各路大神指正教导
5. 项目进行一半的时候，因为没经验，我发现让建模看着地图建模的思路是不对的，应该让他们利用`geoJson`作为地理数据，去建模，建造出来的更精确，而且可以利用地理坐标和世界坐标去关联（猜想），利于项目开发，毕竟第一次，这个锅我背了
6. `Threejs`的文档是不全的，很多`控制器`，`loader`，`后期处理`都没有文档，要自己多看看`Threejs`的`examples`，很多效果都可以基于`Demo`去实现
7. 单页面应用一定要清除`ThreeJs` 的创建的对象，避免内存泄露，能`dispose`的`dispose`，多个`children`的要遍历`remove`掉 而且里面的 `material` 和`geometry`也要删掉，最近刚知道一个取消占用的妙招，[WEBGL_lose_context](https://developer.mozilla.org/zh-CN/docs/Web/API/WEBGL_lose_context)
8. 后期处理对显卡有一定要求
9. 最好一次渲染，不要多次渲染

## HTML部分
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Threejs-city-model-show</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
    />
    <style>
      body {
        color: #fff;
        margin: 0px;
        overflow: hidden;
      }
    </style>
  </head>

  <body>
    <script src="../build/three.min.js"></script>
  </body>
</html> 
```


## 创建场景
首先，我们要祭出`ThreeJs`的最重要的几大组件——`scene(场景)`、`camera(相机)`、`renderer(渲染器)` 、`light(灯光)`，以及渲染的目标——`container`(就是DOM结构)，老生常谈，不多说
> 打个比方，scene就是舞台，camera就是拍摄舞台的摄像机，它能决定观众看到什么，而一个舞台没有灯光的话它就是黑乎乎的，所以light就是舞台上的各种灯光，所以舞台上表演什么，就是舞台中有什么，所以要加入到scene中 scene.add("演员们（模型）")

```javascript
var camera, scene, renderer;
var container;
var ambientLight, pointLight;

// 初始化
init()
// 循环渲染每一帧  一帧一帧的 就是你打游戏时的FPS
animate()

function init(){
	// 初始化相机 
	// 这里使用的是透视相机来模拟人眼看到的效果 近大远小
	camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.z = 70;
    camera.position.x = 50;
    camera.position.y = 10;
	
	// 初始化场景
	scene = new THREE.Scene();

	// 初始化灯光
	// 环境光 能保持整体都是亮点
	ambientLight = new THREE.AmbientLight(0x404040)
	// 点光源 就像灯泡一样的效果  白色灯光 亮度0.6
	pointLight = new THREE.PointLight(0xffffff, 0.6);

	// 将灯光加入到场景中
	scene.add(ambientLight)
	// 将灯光加到摄像机中 点光源跟随摄像机移动
	// 为什么这样做  因为这样可以让后期处理时的辉光效果更漂亮 
	camera.add(pointLight);

	// 我们将摄像机加入到场景中
    scene.add(camera);

	// 初始化渲染器
	renderer = new THREE.WebGLRenderer({
	  // 开启抗锯齿
      antialias: true,
      // 开启背景透明
      alpha: true
    });
    // 把自动清除颜色缓存关闭 这个如果不关闭 后期处理这块会不能有效显示
    // 书上的描述是 如果不这样做，每次调用效果组合器的render()函数时，之前渲染的场景会被清理掉。通过这种方法，我们只会在render循环开始时，把所有东西清理一遍。
    renderer.autoClear = false;
    // 背景透明 配合 alpha
    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 伽马值启动 更像人眼观察的场景
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
	
	// 渲染到DOM中去
	container = document.createElement("div");
    container.appendChild(renderer.domElement);
    document.body.appendChild(container);
}
// 这样一来，基础场景创建就完成了，接下来我们来让它循环渲染起来

function animate() {
   // 这个方法低版本浏览器兼容不好 可以从github上找些兼容库 如果要兼容低版本浏览器
   requestAnimationFrame(animate);
   // 渲染我们的场景  摄像机啪啪啪的拍和录
   // 由于把renderer autoClear  关闭了 所以我们要在渲染函数中手动清除
   renderer.clear();
   renderer.render(scene, camera);
 }
// ok 基础部分完成 接下来我们来加载模型
```

## 加载城市模型
限于经验和技术等各种外力因素影响，项目最开始时编写demo使用的是`Obj模型`和`Mtl贴图文件（不太确定贴图文件的叫法是否准确）`，使用起来也很简单（`ThreeJs`仓库里的`webgl_loader_obj_mtl.html`拿来改下就行了）
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Threejs-city-model-show</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
    />
    <style>
      body {
        color: #fff;
        margin: 0px;
        overflow: hidden;
      }
    </style>
  </head>

  <body>
    <script src="../build/three.min.js"></script>
    <!-- 引入我们可爱的加载器 -->
    <script src="js/loaders/MTLLoader.js"></script>
    <script src="js/loaders/OBJLoader.js"></script>
    <script>
	  /* 省略创建场景部分的代码 */

	  // 加载的过程 
	  var onProgress = function(xhr) {
          if (xhr.lengthComputable) {
            var percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(Math.round(percentComplete, 2) + "% downloaded");
          }
        };

      var onError = function() {
 		// 载入出错时候
	  };

	  // 加载Mtl贴图文件
      new THREE.MTLLoader()
        // 贴图文件的路径 
        .setPath("models/obj/male02/")
        .load("male02_dds.mtl", function(materials) {
          // 看代码意思是预加载
          materials.preload();

		  // 加载OBJ模型
          new THREE.OBJLoader()
            // 设置OBJ模型的材质贴图
            .setMaterials(materials)
            .setPath("models/obj/male02/")
            .load(
              "male02.obj",
              function(object) {
                object.position.y = -95;
                scene.add(object);
              },
              onProgress,
              onError
            );
        });
	</script>
  </body>
</html> 
```
这一步一般会出现的问题有如下

1. 模型加载后，不显示也不报错？
检查场景是否正常渲染了，如果正常渲染模型的位置在哪里，摄像机在哪里，摄像机是否对着模型，灯光是否配置，模型是否太大或者太小了，超出了摄像机的摄影范围……
2. 模型可以正常加载，但是贴图不显示？
首先检查`network`是否报`404`错误，如果报错，一般都是`mtl`贴图文件（看起来像是`雪碧图`那种）没给你，或者路径配置的不是`相对路径`，如果贴图没错误，模型是**黑色的**，在`mtl`文件中可以更改`ka`或`kd`的三个值（对应`rgb`），或者打印出模型属性，在`material.color`中更改点色值或别的属性。黑色的时候，看不到贴图。一般这样一通操作之后，就能看到了模型了
3. 模型文件太大了，浏览器在渲染的时候进程被完全卡死！要等待几十秒之久！天呐！
这个问题看起来比较棘手，其实很好解决。`ThreeJs`官方推荐`gltf`格式的模型在浏览器中渲染，因为它是为浏览器而生的，性能好，体积小。我们项目中使用的模型文件，一开始是`Obj`和`Mtl`的，达到**25MB**大小，在`vue`项目中渲染会阻塞浏览器**46s**，原生`html`+`js`的项目中好些，几秒时间就行了，我怀疑是我写法的问题，但是我测试仅仅是加载模型渲染到场景，并没有多余操作和数据绑定，还是一样，阻塞进程，一度导致我怀疑人生？？？黑人问号脸。那么如何将`Obj模型`转换为`gltf`模型，还能再优化吗？进入下一章节！对了对了，`Obj`模型也是可以压缩的，而且`ObjLoader2`加载会快一点

## Obj模型转Gltf模型并压缩Gltf模型，性能爆炸提升！
> 真的很牛逼 模型加贴图从 25mb 减小到了1.8mb 上效果图

1.这是不加贴图和`mtl`的`obj`文件 已经达到了**22.5MB**！![在这里插入图片描述](https://img-blog.csdnimg.cn/2019110119221657.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)

2. 这是`obj`转`gltf`之后的文件，贴图转成了`base64`包含在了`gltf`文件中，可通过配置项提取出文件，稍后介绍
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101192412472.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)

3. 这是经过`gltf`压缩处理之后的贴图+模型的文件大小![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101192519351.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)



### obj2gltf —— Obj模型转Gltf
 >[obj2gltf-github](https://github.com/AnalyticalGraphicsInc/obj2gltf)

1. 用法
```cmd
// 全局安装后
             obj文件所在目录                             输出目录 
obj2gltf  -i ./examples/models/obj/hanchuan/city.obj -o ./gltf/city.gltf --unlit --separate
```
2. 介绍下为什么要加这两个参数
`--unlit`的作用是可以保留**环境贴图**的效果，环境贴图后面再介绍
`--separate`是将贴图文件提取出来，提出来浏览器可以缓存，如果你需要继续压缩`gltf`文件，这里不加这个参数也行，因为压缩的时候也能提出来

### gltf-pipeline
> [gltf-pipeline-github](https://github.com/AnalyticalGraphicsInc/gltf-pipeline)
1. 用法
```cmd
// 非全局安装的时候
// 先进入node_modules中，在进入gltf-pipeline中，再进入bin中
node gltf-pipeline.js -i  ../../../gltf/city.gltf  -o  ../../../examples/models/obj/hanchuan/city_small1.gltf -d --separate
```
2. 介绍下参数
`-d`是`--draco.compressMeshes`的缩写，使用`draco`算法压缩模型
`--separate`就是将贴图文件提取出来，不提可以不加

这样，我们就完成了`gltf`模型的转化和压缩，性能暴增！秒开！ 
在我们最终的模型中，obj模型**297Mb**，转gltf之后还有**150Mb**左右，最终经过压缩，还有**7.3Mb**!

## Gltf模型的加载
抛弃了`Obj`和`Mtl`之后，我们的加载器也要做一下改变
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Threejs-city-model-show</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
    />
    <style>
      body {
        color: #fff;
        margin: 0px;
        overflow: hidden;
      }
    </style>
  </head>

  <body>
    <script src="../build/three.min.js"></script>
    <!-- 引入我们可爱的加载器 -->
    <script src="js/loaders/GLTFLoader.js"></script>
    <script src="js/loaders/DRACOLoader.js"></script>
    <script>
	  /* 省略创建场景部分的代码 */

	  // 加载的过程 
	  var onProgress = function(xhr) {
          if (xhr.lengthComputable) {
            var percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(Math.round(percentComplete, 2) + "% downloaded");
          }
        };

      var onError = function() {
 		// 载入出错时候
	  };

      var loader = new THREE.GLTFLoader();
      // 这个是Threejs解析draco压缩之后的解析器 
      // 它从这里读取解析器JS
      THREE.DRACOLoader.setDecoderPath("js/libs/draco/gltf/");
      // 将Draco解析器和GltfLoader绑定在一起
      loader.setDRACOLoader(new THREE.DRACOLoader());
      loader.load(
        "models/obj/hanchuan/city_small1.gltf",
        function(gltf) {
         // gltf.scene 拿到这个可以处理模型
         scene.add(gltf.scene)
        },
        onProgress,
        onError
      );
	</script>
  </body>
</html> 
```
这时候的场景，应该是这样的，很丑吧哈哈哈，没关系没关系，我们可以为它美容，不过在此之前，我们先来试着转动这个模型，看看性能怎么样。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101195828942.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)
## OrbitControls——轨道控制器
```javascript
var controls

function init(){
	// 省略创建场景部分
	controls = new THREE.OrbitControls(camera, renderer.domElement);
}
```
它的常用参数在源码中可以找到，也可以百度/goggle一下中文翻译的，不做太多介绍，这是其中一段源码。
```javascript
// Set to false to disable this control
	this.enabled = true;

	// "target" sets the location of focus, where the object orbits around
	this.target = new THREE.Vector3();

	// How far you can dolly in and out ( PerspectiveCamera only )
	this.minDistance = 0;
	this.maxDistance = Infinity;

	// How far you can zoom in and out ( OrthographicCamera only )
	this.minZoom = 0;
	this.maxZoom = Infinity;

	// How far you can orbit vertically, upper and lower limits.
	// Range is 0 to Math.PI radians.
	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	// How far you can orbit horizontally, upper and lower limits.
	// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
	this.minAzimuthAngle = - Infinity; // radians
	this.maxAzimuthAngle = Infinity; // radians

	// Set to true to enable damping (inertia)
	// If damping is enabled, you must call controls.update() in your animation loop
	this.enableDamping = false;
	this.dampingFactor = 0.25;

	// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
	// Set to false to disable zooming
	this.enableZoom = true;
	this.zoomSpeed = 1.0;

	// Set to false to disable rotating
	this.enableRotate = true;
	this.rotateSpeed = 1.0;

	// Set to false to disable panning
	this.enablePan = true;
	this.panSpeed = 1.0;
	this.screenSpacePanning = false; // if true, pan in screen-space
	this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

	// Set to true to automatically rotate around the target
	// If auto-rotate is enabled, you must call controls.update() in your animation loop
	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	// Set to false to disable use of the keys
	this.enableKeys = true;

	// The four arrow keys
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	// Mouse buttons
	this.mouseButtons = { LEFT: THREE.MOUSE.LEFT, MIDDLE: THREE.MOUSE.MIDDLE, RIGHT: THREE.MOUSE.RIGHT };

	// for reset
	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.zoom0 = this.object.zoom;

	//
	// public methods
	//

	this.getPolarAngle = function () {
```
- 初始化这个控制器之后，就可以操作模型旋转放大缩小了。它的原理就是控制**摄像机和模型**的距离，同理也可以控制**模型与摄像机**的距离去实现移动放大缩小等功能，可以自己尝试一下。一个比较有趣的操作是在`function animate(){}`中，设置`camera.lookAt=scene.position`效果也很不错。
- `ThreeJs`中内置了很多有趣的控制器，用法和效果都可以从`ThreeJs`的`examples`中找到，记得看看。

## Stats
玩过`LOL`，大型单机游戏的同学都知道，如果`帧率`不好，画面看起来就会**卡顿**，影响体验，这也为什么用`requestAnimationFrame`去作为渲染调用的原因之一，它的性能比`函数递归`和`setInterval`实现渲染调用好很多。那么我们如何去检测我们的场景渲染的性能怎么样呢？就可以使用`Stats`
```javascript
// <script src="js/libs/stats.min.js"></script> 不要忘了引入进来
var stats;

function init(){
	// 省略创建场景部分
	stats = new Stats();
	container.appendChild(stats.dom);
}

function animatie(){
	stats.update();
	// 省略renderer
}
```
- 初始化之后在页面左上角会看到，这个原理还没研究过，有机会翻翻源码看看。 
- ![在这里插入图片描述](https://img-blog.csdnimg.cn/20191104091446471.png)
- 如果实在vue/react等单页面环境中，可以通过`process.env.NODE_ENV`控制开发环境再显示这个。
- 这样一来，我们在开发调试的时候，就能很直观的看出效果了。

## 给scene添加自定义背景
>若不为空，在渲染场景的时候将设置背景，且背景总是首先被渲染的。 可以设置一个用于的“clear”的Color（颜色）、一个覆盖canvas的Texture（纹理），或是一个CubeTexture。默认值为null。 

- 实验结果是，`TextureLoader`、`CubeTexture`和`SphereGeometry`都可以作为背景图，简单介绍下这三者。 

1. TextureLoader 一张图，背景看起来是静止不动的
2. CubeTexture 立方纹理 图片是分割成6块 相当于摄像机和模型在一个正方体盒子中 背景随着摄像机转动而转动
3. SphereGeometry 一张图 全景图原理 相当于摄像机和模型在一个圆球盒子中 背景随着摄像机转动而转动
4. 不太理解可以百度下`threejs全景图原理`，不做过多叙述

```javascript
function init(){
	// 省略其余代码
	// ....
	// 添加一张静止的背景图
	scene.background = new THREE.TextureLoader().load("你的背景图")
	// ....
}
```
5. 之后效果大概是这样的，我们的世界里有了天空，其实这里用`CubeTexture`或者`SphereGeometry`效果更好
6. ![在这里插入图片描述](https://img-blog.csdnimg.cn/20191104102332302.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)

## 设置模型环境贴图和材质颜色
细心的同学会发现，河流和楼上会有星星点点的光，这是怎么实现的呢？答案就是`环境贴图`。
> [环境贴图](http://www.twinklingstar.cn/2014/1322/environment-mapping/)
简单的讲，环境贴图就像把物体的表面化作一面镜子，可以反射出你为它赋予的图片。

如何设置环境贴图呢？回到我们加载模型的部分。核心就是创建`立方纹理`然后设置某个模型的`material`的`envMap`为这个立方纹理。 环境贴图的使用限制受纹理影响，有一部分纹理加不上环境贴图。
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Threejs-city-model-show</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
    />
    <style>
      body {
        color: #fff;
        margin: 0px;
        overflow: hidden;
      }
    </style>
  </head>

  <body>
    <script src="../build/three.min.js"></script>
    <!-- 引入我们可爱的加载器 -->
    <script src="js/loaders/GLTFLoader.js"></script>
    <script src="js/loaders/DRACOLoader.js"></script>
    <script>
	  /* 省略创建场景部分的代码 */

	 // 创建一个立方纹理
	 var envMap = new THREE.CubeTextureLoader()
            .setPath("textures/")
            .load(new Array(6).fill("start.jpg"));

      var loader = new THREE.GLTFLoader();
      // 这个是Threejs解析draco压缩之后的解析器 
      // 它从这里读取解析器JS
      THREE.DRACOLoader.setDecoderPath("js/libs/draco/gltf/");
      // 将Draco解析器和GltfLoader绑定在一起
      loader.setDRACOLoader(new THREE.DRACOLoader());
      loader.load(
        "models/obj/hanchuan/city_small1.gltf",
        function(gltf) {
         // gltf.scene 拿到这个可以处理模型
         gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              /* 这些都是DEMO  具体看你模型调整 下节介绍通过鼠标点击确定模型所属对象 然后去调试模型 */
			  // 这些名称都可以通过打印看出 console.log(child)

			  // 比如我想给这些加上环境贴图 就可以这样写
              /hai|city|liubianxing/i.test(child.name) &&
                (child.material.envMap = envMap);
              
              if (/city/i.test(child.name)) {
                // 更改模型颜色
                child.material.color = new THREE.Color(6, 6, 5);
                // 更改模型环境贴图影响  0-1
                child.material.reflectivity = 0.9;
              }
              
			  // 更改模型位置
              /lumian|hai/i.test(child.name) && (child.position.y = 0.5);
              
              // ...
            }
          });
          
          scene.add(gltf.scene)
        },
        onProgress,
        onError
      );
      
	</script>
  </body>
</html> 
```

## Raycaster 光线投射
> 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。

- 打印出所有的child不好定位是哪块模型，有没有更快的方法？ 
- 您好，有的。
- [通过 THREE.Raycaster 实现模型选中与信息显示](https://blog.csdn.net/ithanmang/article/details/80897888)，点击打印出当前点击的模型，在它的属性中修改颜色，位置等，可以直接更新效果，调试更方便
- 到此，经过我们的美化之后，效果就是这样了。还缺了点什么，道路咋不发光啊，看着没光效，不炫酷！
- ![在这里插入图片描述](https://img-blog.csdnimg.cn/20191104105606238.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)

## 利用EffectComposer（效果组合器）进行后期处理
这一块的基础建议好好看看`《THREE.JS开发指南》`这本书。如果需要多个`pass`，要学会使用`MaskPass`和`clearPass`。这一块因为不熟悉，我在添加效果的时候花费了很大量的时间，尤其是`Threejs`内置的`pass`效果没有文档，甚至你都不知道内置了多少种效果...`《THREE.JS开发指南》`这本书介绍的比较全面，用法也很详细。

## 利用EffectComposer进行后期处理——辉光(bloompass)
### 如何设置后期处理？
1. 创建一个`EffectComposer`对象，然后在该对象上添加后期处理通道。
2. 配置该对象，使它可以渲染我们的场景，并用额外的后期处理步骤
3. 在`render`循环中，使用`EffectComposer`渲染场景、应用通道，并输出结果

### 几个引用介绍
- `EffectComposer`效果组合器，每个通道会按照其加入`EffectComposer`的顺序执行。
- `RenderPass`该通道在指定的场景和相机的基础上渲染出一个新的场景。一般在第一个加入到`Composer`中，它会渲染场景，但是不会将渲染结果输出到屏幕上。
-  `ShaderPass`使用该通道可以传入一个自定义的着色器，用来生成高级的、自定义的后期处理通道
- `BloomPass`该通道会使明亮区域渗入较暗的区域，模拟相机照到过多亮光的情形
- `CopyShader`它不会添加任何特殊效果，只是将最后一个通道的结果复制到屏幕上，`BloomPass`无法直接添加到屏幕上，需要借助这个`Shader`，其实使用`bloompass.renderToScreen = true`是可以添加的，但是后续再加处理效果会无效，所以一定要借用这个`Shader`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Threejs-city-model-show</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
    />
    <style>
      body {
        color: #fff;
        margin: 0px;
        overflow: hidden;
      }
    </style>
  </head>

  <body>
    <!-- 省略其他引入的 -->
    <!-- 引入Effect -->
    <script src="js/postprocessing/EffectComposer.js"></script>
    <!-- 引入Effect配套的render -->
    <script src="js/postprocessing/RenderPass.js"></script>
    <script src="js/postprocessing/ShaderPass.js"></script>
    <!-- 引入各种需要的shader -->
    <script src="js/shaders/CopyShader.js"></script>
    <script src="js/shaders/LuminosityHighPassShader.js"></script>
    <script src="js/postprocessing/UnrealBloomPass.js"></script>
    <script>
      var clock;
	  /* 省略创建场景部分的代码 */
	  // 初始化renderPass
	  var renderScene = new THREE.RenderPass(scene, camera);
	
	  // 初始化bloomPass 
	  var bloomPass = new THREE.UnrealBloomPass(
	    // 没研究过这些参数的意义 会提上日程
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      );
      // 一些参数 可以调整看效果
      bloomPass.threshold = 0.36;
      bloomPass.strength = 0.6;
      bloomPass.radius = 0;

	  // effectCopy
      var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
      // 让effectCopy渲染到屏幕上 没这句不会再屏幕上渲染
      effectCopy.renderToScreen = true;
	  
	  // 初始化 composer
	  var composer = new THREE.EffectComposer(renderer);
	  // 模版缓冲（stencil buffer） https://blog.csdn.net/silangquan/article/details/46608915
      composer.renderTarget1.stencilBuffer = true;
      composer.renderTarget2.stencilBuffer = true;
      composer.setSize(window.innerWidth, window.innerHeight);
      composer.addPass(renderScene);
	  composer.addPass(bloomPass);
      composer.addPass(effectCopy);

	  // 修改animate
	  function animate() {
        requestAnimationFrame(animate);
        var delt = clock.getDelta();
        stats.update();
        renderer.clear();
        // 删除renderer使用composerrender去渲染
        // renderer.render(scene, camera);
        
		// 没理解透这个delt的作用 ？？？
        composer.render(delt);
      }
	</script>
  </body>
</html> 
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191104131726358.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)这样 辉光效果就出来了。还不够还不够，让我们加上`FocusShaper`，让它看起来像聚焦在中心一样（突出中心）。
1. **颜色越亮，发光效果越强**
2. **辉光受环境贴图影响**
3. **模型可以通过`map`贴图来更改亮度，比如暗色的贴图，它反光就会很软**

### 为场景添加聚焦效果——FocusShader

我们要引入`FocusShader`。
- `FocusShader`是一个简单的着色器，其结果是中央区域渲染的比较锐利，单周围比较模糊。
- ![在这里插入图片描述](https://img-blog.csdnimg.cn/20191104133026907.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Threejs-city-model-show</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
    />
    <style>
      body {
        color: #fff;
        margin: 0px;
        overflow: hidden;
      }
    </style>
  </head>

  <body>
    <!-- 省略其他引入的 -->
    <!-- 引入Effect -->
    <script src="js/postprocessing/EffectComposer.js"></script>
    <!-- 引入Effect配套的render -->
    <script src="js/postprocessing/RenderPass.js"></script>
    <script src="js/postprocessing/ShaderPass.js"></script>
    <!-- 引入各种需要的shader -->
    <script src="js/shaders/CopyShader.js"></script>
    <script src="js/shaders/LuminosityHighPassShader.js"></script>
    <script src="js/postprocessing/UnrealBloomPass.js"></script>
    <!-- focusShader 相对于bloompass新加的 -->
    <script src="js/shaders/FocusShader.js"></script>
    <script>
      var clock;
	  /* 省略创建场景部分的代码 */
	
	 // 创建focusShader 相对于bloompass新加的
	 var focusShader = new THREE.ShaderPass(THREE.FocusShader);
     focusShader.uniforms["screenWidth"].value = window.innerWidth;
     focusShader.uniforms["screenHeight"].value = window.innerHeight;
     focusShader.uniforms["sampleDistance"].value = 1.07;

	  // 初始化renderPass
	  var renderScene = new THREE.RenderPass(scene, camera);
	
	  // 初始化bloomPass 
	  var bloomPass = new THREE.UnrealBloomPass(
	    // 没研究过这些参数的意义 会提上日程
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      );
      // 一些参数 可以调整看效果
      bloomPass.threshold = 0.36;
      bloomPass.strength = 0.6;
      bloomPass.radius = 0;

	  // effectCopy
      var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
      // 让effectCopy渲染到屏幕上 没这句不会再屏幕上渲染
      effectCopy.renderToScreen = true;
	  
	  // 初始化 composer
	  var composer = new THREE.EffectComposer(renderer);
	  // 模版缓冲（stencil buffer） https://blog.csdn.net/silangquan/article/details/46608915
      composer.renderTarget1.stencilBuffer = true;
      composer.renderTarget2.stencilBuffer = true;
      composer.setSize(window.innerWidth, window.innerHeight);
      composer.addPass(renderScene);
	  composer.addPass(bloomPass);
	  // 相对于bloompass新加的
	  composer.addPass(focusShader);
      composer.addPass(effectCopy);

	  // 修改animate
	  function animate() {
        requestAnimationFrame(animate);
        var delt = clock.getDelta();
        stats.update();
        renderer.clear();
        // 删除renderer使用composerrender去渲染
        // renderer.render(scene, camera);
        
		// 没理解透这个delt的作用 ？？？
        composer.render(delt);
      }
	</script>
  </body>
</html> 
```

模型的渲染和后期处理就到此就全部结束了。

## Sprite精灵的应用
> 精灵是一个总是面朝着摄像机的平面，通常含有使用一个半透明的纹理。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191104140230366.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)
```javascript
 var textured = new THREE.TextureLoader().load("textures/warning.png");
 var spriteMaterial = new THREE.SpriteMaterial({
   // color: 0xffffff,
   map: textured
 });
 var sprite = new THREE.Sprite(spriteMaterial);
 sprite.position.set(
   25.729931791092394,
   10.179400757773436,
   36.07142388020101
 );
 // console.log(sprite);
 sprite.scale.x = 10;
 sprite.scale.y = 5;

 scene.add(sprite);
```

这张图火灾预警的图其实就是一张透明的png图片，精灵可以用`canvas贴图`，你可以自己编写`canvas`渲染在指定点上，也可以使用`CSS3DRenderer`去实现。

## Group
通常的情况下`Threejs`里的模型是要分组的。在处理交互起来，有分组会更加清晰明了，就像模块拆分一样。
```javascript
var group = new THREE.Group();
```

## 区域、路线、移动等功能实现逻辑
1. 不规则区域可以用`ShapeGeometry`创建，使用可以设置透明的`material`比较好。`material`设置`transparent:true`可以支持透明
2. 移动就是更改模型位置，很简单`model.position.set(x,y,z)`
3. 画线，`line`、`lineLoop`、`CubicBezierCurve3`等`Threejs`提供的画线方法
4. 路线循环流动效果可以创建一个`管道`，然后增加一个路径一样的`贴图`，设置`wrap`为重复，在`animate`中不断更改`texture.offset`即可


## VUE/React等单页面注意点
由于单页面中，`Threejs`创建的任何材质，模型，贴图……只要含有`dispose`方法的，你在页面组件即将销毁的周期中，都要调用下`dispose`方法清除，不然可能**内存泄漏**。刚学会一个妙招，利用[WEBGL_lose_context](https://developer.mozilla.org/zh-CN/docs/Web/API/WEBGL_lose_context)这个API 可以让当前的webgl环境失效，达到取消占用的目的。
```javascript
beforeDestory(){
	this.bloomPass.dispose();
    this.envMap.dispose();
    this.skymap.dispose();
    this.dracoLoader.dispose();
    this.spriteMaterial.dispose();
    this.sphereGeometry.dispose();
    this.meshBasicMaterial.dispose();
    this.scene.dispose();
    this.controls.dispose();
	
	/*
	const data = this.$data;
    for (let i in data) {
      if (data.hasOwnProperty(i)) {
        if (data[i] && typeof data[i].dispose == "function") {
          data[i].dispose();
        }
      }
    }
	*/
	// this.renderer.domElement 就是你的threejs的canvas Dom
	let gl = this.renderer.domElement.getContext("webgl");

    gl && gl.getExtension("WEBGL_lose_context").loseContext();
}
```

## 模型发光还带线的效果怎么做？
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019110913531145.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)
```javascript

var lineMaterial = new THREE.LineBasicMaterial({
  // 线的颜色
  color: "blue",
  transparent: true,
  opacity: 0.8,
  depthFunc: THREE.AlwaysDepth
});
模型.add(
  new THREE.LineSegments(模型geometry, lineMaterial)
);
// 之后把模型设置下透明度就成了

```

## 坐标转换 经纬度转墨卡托
- 先把经纬度转墨卡托坐标 然后由于墨卡托坐标比较大，找到地图模型的中心点，墨卡托转Threejs的坐标时，减去这个中心点，之后就能画出一样的点或区域，之后再将z轴（y）取反
- x+对应东，z+对应南
- z算出来还得取个反
- 根据坐标系适当调整
```javascript
function lonlatToMercator(lon, lat, height) {
        var z = height ? height : 0;
        var x = (lon / 180.0) * 20037508.3427892;
        var y = (Math.PI / 180.0) * lat;
        var tmp = Math.PI / 4.0 + y / 2.0;
        y = (20037508.3427892 * Math.log(Math.tan(tmp))) / Math.PI;
        return { x: x, y: y, z: z };
      }

// 找到地图的中心对应的经纬度坐标
var center = lonlatToMercator(113.82909, 30.6549, 1);

function lonlatToThree(lon, lat, height) {
  var z = height ? height : 0;
  var x = (lon / 180.0) * 20037508.3427892;
  var y = (Math.PI / 180.0) * lat;
  var tmp = Math.PI / 4.0 + y / 2.0;
  y = (20037508.3427892 * Math.log(Math.tan(tmp))) / Math.PI;
  var result = {
    x: x - center.x,
    y: y - center.y,
    z: z - center.z
  };
  // x 越大越远
  // 因为比地图大了 可以让地图整体放大或缩小 然后偏移到大概位置
  return [result.x / 100 + 17, -result.y / 100 + 33];
  // [-result.x / 100 - 14, -result.y / 100 - 35];
}
console.log(lonlatToThree(113.84411, 30.65231));
```

## antialias开启后，渲染还有锯齿怎么办？
使用`SSAA`、`FXAA`、`SMAA`等抗锯齿后处理。任选其一即可。
```javascript
initFxaaPass() {
	let fxaaPass = new ShaderPass(FXAAShader);
	const pixelRatio = this.renderer.getPixelRatio();
	fxaaPass.material.uniforms["resolution"].value.x =
	  1 / (this.width * pixelRatio);
	fxaaPass.material.uniforms["resolution"].value.y =
	  1 / (this.height * pixelRatio);
	fxaaPass.renderToScreen = true;
	this.fxaaPass= fxaaPass;
},
```
```javascript
initSmaaShader() {
	const pixelRatio = this.renderer.getPixelRatio();
	this.smaaPass = new SMAAPass(
	  this.width * pixelRatio,
	  this.height * pixelRatio
	);
	this.smaaShader.renderToScreen = true;
},
```
```javascript
initSsaaShader() {
	this.ssaaRenderPass = new SSAARenderPass(this.scene, this.camera);
	this.ssaaRenderPass.unbiased = false;
	this.ssaaRenderPass.sampleLevel = 2;
},
```
利用`EffectComposer`应用某个效果
```javascript
initEffectComposer() {
	const composer = new EffectComposer(this.renderer);
	composer.setSize(this.width, this.height);
	composer.addPass(this.renderScene);
	composer.addPass(this.ssaaRenderPass);
	composer.addPass(this.bloomPass);
	composer.addPass(this.focusShader);
	composer.addPass(this.effectCopy);
	
	this.composer = composer;
},
```


## 光柱效果如何实现
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191121132817119.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)

1. 准备一张渐变灰色`png`图片, 类似如下图
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191121113318385.png)我在这 ↑
2. 代码部分
```javascript
import * as THREE from "three";

const scaleSpeed = 0.01;

export default {
  data(){
    return {
      // ...  
    }
  },
  created(){
    this.loadRangeMap()
  },
  beforeDestory(){
      // ...
  },
  methods: {
    initRingAnimate() {
      Array.isArray(this.gatewayGroup.children) &&
        this.gatewayGroup.children.forEach(v => {
          Array.isArray(v.children) &&
            v.children.forEach(item => {
              if (item.userData.type === "ring") {
                item.rotation.z = item.rotation.z + scaleSpeed;
              }
            });
        });
    },
    loadRangeMap() {
      this.rangeMap = this.textureLoader.load(require("../images/range.png"));
    },
    initOctahedronBufferGeometry() {
      this.octahedronBufferGeometry = new THREE.OctahedronBufferGeometry();
    },
    initCylinderBufferGeometry() {
      this.cylinderBufferGeometry = new THREE.CylinderBufferGeometry(
        2,
        2,
        14,
        12,
        1,
        true
      );
    },
    initOctahedron(color) {
      let geometry = this.octahedronBufferGeometry;
      let material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.3
      });
      let lineMaterial = new THREE.LineBasicMaterial({
        color,
        depthFunc: THREE.AlwaysDepth
      });
      let octahedron = new THREE.Mesh(geometry, material);
      let line = new THREE.LineSegments(geometry, lineMaterial);
      octahedron.add(line);
      octahedron.position.z = -8;
      return octahedron;
    },
    initRing(color) {
      let geometry = this.cylinderBufferGeometry;
      let material = new THREE.MeshBasicMaterial({
        color,
        map: this.rangeMap,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false
      });
      let cylinder = new THREE.Mesh(geometry, material);
      cylinder.rotation.x = (Math.PI / 180) * -90;
      cylinder.position.z = -2;
      return cylinder;
    },
    initGateway(data = { color: "#54C41D",x: 0, z: 0 }) {
      let group = new THREE.Group();
      let octahedron = this.initOctahedron(data.color);
      let ring = this.initRing(data.color);
      group.add(ring);
      group.add(octahedron);
      group.rotation.x = (Math.PI / 180) * 90;
      group.position.y = 0.2;
      group.position.x = data.x;
      group.position.z = data.z;
      this.gatewayGroup.add(group);
    }
  }
};

```


## 删除子对象时，用forEach等高阶循环删不干净？
- 因为`group.children`是个数组，每次删除的时候，数组都会变动，比如长度是5，你删了第一个，下次循环你要删除第二个，但是数组长度变了，第二次删除的时候其实删的是第三个了。
- 解决方案1 `children.map(v=>{group.remove(children[0])})` 一直删除第一个
- 解决方案2 `for(let i = 0, l = children.length; i < l; i++){ group.remove(children[i]) }` 将数组长度存储下来，就不会变啦！

## 我们项目的最终效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191224152828602.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191224152835817.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)
