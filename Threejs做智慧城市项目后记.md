
![demo展示效果](https://img-blog.csdnimg.cn/20191101180056341.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)
> 随着时间的推移技术的进步，前端越来越杂了，但是也越来越精彩了。只是会用一点`ThreeJs`，对于`WebGl`的原理并没了解过，这并不影响我们利用`ThreeJs`去做出一个非常炫酷的项目。

# 开始
> 新世界的大门打开啦！
## 写在前面
1. 不要因为不了解就被这种3D展示的项目给吓到 其实实现起来**很简单 很简单 很简单**
2. 城市模型一份 最好是`gltf`模型，`obj`模型也没问题，我会介绍如何转化与压缩 PS:为什么只有这俩，因为我写这个项目只用到了这俩，处理的经验也是针对这俩的，我项目中所用的模型是公司所有暂不能提供。
3. 有一定`ThreeJs`的基础 俗话说得好 万丈高楼平地起嘛 如果没有这方面基础的同学也不要急 推荐一本书`《WebGL编程指南》`，有基础也有提高 很棒
4. 本文所示代码大部分只是思路 我也是第一次上手用`ThreeJs`处理模型并应用到项目中，可能有少许不足之处，还望各路大神指正教导
5. 项目进行一半的时候，因为没经验，我发现让建模看着地图建模的思路是不对的，应该让他们利用`geoJson`作为地理数据，去建模，建造出来的更精确，而且可以利用地理坐标和世界坐标去关联（猜想），利于项目开发，毕竟第一次，这个锅我背了。

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

1.这是不加贴图和`mtl`的`obj`文件 已经达到了**22.5MB**！
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019110119221657.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)

2. 这是`obj`转`gltf`之后的文件，贴图转成了`base64`包含在了`gltf`文件中，可通过配置项提取出文件，稍后介绍
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101192412472.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)

3. 这是经过`gltf`压缩处理之后的贴图+模型的文件大小
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101192519351.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)



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

	  // 加载Mtl贴图文件
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
