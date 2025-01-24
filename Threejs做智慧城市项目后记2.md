# ThreeJS 智慧城市项目后记 2

![image-20241231092203872](/Application Support/typora-user-images/image-20241231092203872.png)

![image-20250117091901028](/Application Support/typora-user-images/image-20250117091901028.png)

这次的场景比较大，设计出来的 blender 模型文件有 1.5 个 G，比较吃性能，而且有的模型面数巨大，几千万几百万个面，很考验性能的优化。

## 模型加载

由于模型比较大，我们可以从两个方面去考虑优化模型，一方面是如何在保证模型效果的前提下进行模型的减面，另一方面就是如何更高性能的加载模型。

### 先减面

1. 模型减面优化考验的是建模伙伴的功底，但是我们也要注意模型的几个性能指标，一个是面数，一个是绘制次数。可以在https://sandbox.babylonjs.com/查看模型的面数和绘制次数，一般来讲，面数越低，绘制次数越好，模型加载进来的性能就越高。

![image-20241231093002846](/Application Support/typora-user-images/image-20241231093002846.png)

2. 减面有多种方式，推荐专业人做专业事，如果你非要去减面的话，建议使用塌陷，平面的效果最好，但是平面的话导出 glb 文件后很多情况下是减不动面的，可以在 babylon 的沙盒环境中验证下，导出 glb 的时候不要忘了勾选应用修改器
   ![image-20241231093950536](/Application Support/typora-user-images/image-20241231093950536.png)

   ![image-20241231093754881](/Application Support/typora-user-images/image-20241231093754881.png)

### 重复的模型实例化

1. 这个是我们加载模型时需要考虑的了，概念不再介绍，如果场景中重复的模型，就使用实例化去加载。

2. 实例化之前肯定要先去减面的，也有实例化+lod 的方案，但是一切全场景的都切模型的精度了。

3. 实例化可以在 blender 中去进行操作，简单说就是创建一个空物体，然后将需要实例化的关联进这个空物体（shift + A 创建空物体， shift+L 可以复制修改器统一减面模型，shift+P 关联空物体）中形成组，在 blender 导出时，选中 gpu instance（blender 4.0 版本以上才有）即可
   ![image-20241231093908111](/Application Support/typora-user-images/image-20241231093908111.png)

4. 另一种实例化途径，比较简单，https://gltf.report/ 推荐使用这个，这个不仅能压缩而且还能自动实例化，非常方便，嘎嘎好用
   ![image-20241231094240239](/Application Support/typora-user-images/image-20241231094240239.png)

### 唯一模型使用 LOD 加载

1. 概念不再介绍
2. 当你的需求需要展示精细模型时，可以考虑 lod 的方式，它会以模型的中心点和摄像机的距离判定加载哪个精度的模型

### 合并模型

这也是一种性能优化的方式，当模型的绘制次数很多时，可以使用合并模型提高性能，步骤就是选中模型，右键合并，合并的模型就没法再实例化了哈，而且合并模型的性能没有实例化好，重复模型优先实例化

### 实例化+LOD

1. Three-instance-mesh babylonjs 自带 适用于大量重复模型 又需要高精度显示的场景
2. https://github.com/agargaro/instanced-mesh

## 其他

### 抗锯齿处理

1. *SSAA*效果很好，但是很吃性能
2. 本项目中采用的是 FXAA + antialias（render 中的抗锯齿） + setPixelRatio(2)（2 倍像素比）提高渲染精度，减少锯齿
3. 最终我还是用 ssaa 了 fxaa 太糊了

### hdr 环境贴图

1. 这个是真的好用，自带光照，效果还比较好，弊端就是无法产生阴影

2. https://polyhaven.com/zh/hdris

3. https://ambientcg.com/list?type=hdri&sort=popular

4. 一定要在 scene 中设置一个全局的环境贴图，会减少很多麻烦，一开始我没设置，模型很多都是黑的

5. 后记 因为要给场景加阴影 我放弃了 hdr 贴图的方案

   ```js
   /**
    * 加载hdr环境贴图 这个加载到场景里很漂亮 光照氛围感拉满
    * 场景漂亮就靠它了！！！
    */
   const rgbeLoader = new RGBELoader();
   let envTexture: THREE.Texture;
   rgbeLoader
     .loadAsync("/textures/equirectangular/symmetrical_garden_02_1k.hdr")
     .then(texture => {
       texture.mapping = THREE.EquirectangularReflectionMapping;
       scene.environment = texture;
       // scene.background = texture;
       // 环境色影响度
       // scene.environmentIntensity = 1;
       // 旋转角度
       // scene.environmentRotation = new THREE.Euler(0, 0, (Math.PI / 360) * 10);
       envTexture = texture;
     });
   ```

### AO 环境光遮蔽

1. 这个能提升场景的阴影细节，让场景更真实，我在项目中用得 ssaoPass
   ```js
   const ssaoPass = new SSAOPass(
     scene,
     orbitControlsCamera,
     sceneWidth,
     sceneHeight
   );
   // 数值越大效果越好 性能消耗越高 4-8低端设备  12-16中端 20-32高端
   ssaoPass.kernelRadius = 16;
   ```

### 使用 blender 遇到的一些问题

#### 建模使用了阵列，一排模型导出只有一个模型

1. 选中模型 ctrl+a 实例独立化 可视几何->网格 再导出就行了，这个方法也能用于实例化的模型独立出来

#### 模型没法应用贴图，法线贴图

1. 查看模型的 geometry 的 attributes 中有没有 uv 信息，没有的话自然应用不上
   ![image-20241231095917913](/Application Support/typora-user-images/image-20241231095917913.png)
2. 可以在 blender 中使用编辑模式，然后选 UV，智能 uv 或从视角投影创建 uv
   ![image-20241231100021852](/Application Support/typora-user-images/image-20241231100021852.png)
3. gltf-report 压缩时可能会抹除 UV，要看一下压缩后的文件

### 修改后的模型记得备份一个

比如你单独处理了哪个模型，先保留原始的以备后面需要，比如需要 lod 多个精度

### 阵列的模型怎么拆开

1. 物体模式下选中所有的模型
2. 点 tab 进入编辑模式 网格 拆分 按松散块 快捷键就是 tab p p
3. ![image-20250116101410468](/Application Support/typora-user-images/image-20250116101410468.png)

### 阵列后实例化无效

1. 可能是模型的旋转中心不在同一个点造成的 需要将模型的旋转中心设为一个点
2. 物体模式全选模型 右键设置原点
3. https://blog.csdn.net/yuantingfei/article/details/130983699
4. 但是我这样设置过后经过处理貌似是合并成一个模型了 并没有实例化

### 设置相机平移范围

```js
const cameraAreaData = {
  min: { x: -9, z: -4 },
  max: { x: 6, z: 3 },
};
controls.addEventListener("change", data => {
  const { x, z } = data.target.target;
  const { min, max } = cameraAreaData;
  controls[
    x < min.x || x > max.x || z < min.z || z > max.z ? "reset" : "saveState"
  ]();
  // 14是临界值  小于14就不显示管道了
  piplineGroup.visible = controls.getDistance() > 14;
});
```

### 使用 css 模拟景深效果

> bokenpass 我没调出来想要的效果 这个能实现四周逐渐模糊中间清晰的效果

```vue
<template>
  <!-- css实现的景深效果 -->
  <div class="blur-shade"></div>
  <!-- 场景渲染容器 -->
  <section
    ref="sceneContainerRef"
    class="w-full h-full"
    @click="handleMouseDown"
  ></section>
</template>

<style lang="scss">
// 使用css模拟景深效果 bokenpass调不出来这种中间清晰 四周模糊的效果
.blur-shade {
  // backdrop-blur- 调整模糊度
  @apply pointer-events-none fixed inset-0 w-full h-full backdrop-blur-[2px] z-1;
  // 渐变遮罩 调整模糊的范围
  mask: radial-gradient(
    ellipse,
    transparent 30%,
    rgb(0 0 0 / 50%) 60%,
    black 90%
  );
}
</style>
```

### 场景加阴影

1. 加上阴影效果真的好 光影很真实
2. 可以使用烘焙静态阴影
3. 计算出来的阴影比较耗性能

### GUI 调出来的颜色，直接赋值变成别的颜色的解决方案

```js
export const basicColorBlockMaterial = new THREE.MeshStandardMaterial({
  // 需要转成srgb的色相
  color: new THREE.Color("#333a3d").convertLinearToSRGB(),
  transparent: true,
  opacity: 0.7,
});
```

### threejs 的 lod 在对不规则模型的处理时有问题

1. babylon 中有根据屏幕空间占比的 lod 方式，threejs 中没有
2. 我的场景中模型不需要改变位置 所以我使用了包围盒根据相机位置到包围盒的距离自己实现了一个 lod 方式，但是与业务耦合度较高，所以这里只提供一个思路

### 发光贴图

1. 绿色会亮度高 发光效果更好
2. 蓝色会亮度低
