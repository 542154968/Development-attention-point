# HarmonyOS 3.1/4.0 学习笔记

## 环境搭建

### 开发环境

1. Mac OS Catalina 10.15.4

### 编辑器安装以及环境配置

1. 参考[搭建开发环境流程](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V2/installation_process-0000001071425528-V2)

### 使用本地模拟

1. 参考 [应用/服务运行](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V2/running-app-0000001495169810-V2)

2. 这里我遇到个问题，当模拟器启动后，运行代码时无法选择到启动的模拟器，需要设置一下环境变量，之后就可以正常选择模拟器了。
   ```shell
   # HarmonyOS start
   export PATH=$PATH:/Users/你的电脑名字/Library/Huawei/Sdk/hmscore/3.1.0/toolchains
   export CLASSPATH
   HDC_SERVER_PORT=7035
   launchctl setenv HDC_SERVER_PORT $HDC_SERVER_PORT
   export HDC_SERVER_PORT
   ```

### 预览

https://zhuanlan.zhihu.com/p/669635536

### 双向预览

https://ost.51cto.com/posts/22609

## 基本概念理解（基于 Stage 模型和 ArkTs）

> 目前官方推荐使用 Stage 模型去搭建项目，所以学习时就直接略过了 FA 模型
>
> 请先熟读相关文档 [构建第一个 ArkTS 应用（Stage 模型）](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V2/start-with-ets-stage-0000001477980905-V2)

## 目录结构

### 多 HAP 构建

[多 HAP 构建视图](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V2/multi-hap-build-view-0000001427744536-V2) ,基于官方的命名规范，`feature`目录可以理解为小程序的分包概念

### Ablitity

#### UIAbility

是应用的入口文件，可以理解为渲染器（浏览器），包含单实例模式（只能开一个浏览器），多实例模式（打开多个浏览器），指定实例模式（指定打开浏览器的某个页面）[UIAbility 组件启动模式](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V2/uiability-launch-type-0000001428061476-V2)

## 如何热更新代码

![image-20240206091508816](/Users/liqiankun/Library/Application Support/typora-user-images/image-20240206091508816.png)

不过热更新目前发现只在更改 build(){}以内的页面内容时才会自动热加载，更改 state 之类的都会提示一行蓝色文字要求重新运行

## 如何使用插槽

1. 参考文档[@BuilderParam 装饰器：引用@Builder 函数](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V2/arkts-builderparam-0000001524416541-V2)

2. 不支持作用域插槽（可能我没理解），可以传子组件+子组件数据的方式传递

   ```tsx
   // 子组件
   @Component
   struct Child {
     @Link slot1DataList: string[]
     @BuilderParam slot1: (arg:string[]) => void;

     build(){
       Row(){
           this.slot1(this.slot1DataList)
       }
     }
   }

   export default Child;
   ```

   ```tsx
   // 父组件
   import router from '@ohos.router';
   import Child from './components/Child'

   @Entry
   @Component
   struct Index {
     @State dataList: string[] = ['1', '2', '3']

     @Builder CustomerList(dataList:string[] = []){
         ForEach(dataList, item=>{
           Text(item)
         })
     }

     build() {
       Row() {
         Column() {
           // 自定义组件
           Child({slot1: this.CustomerList, slot1DataList: $dataList})
         }
         .width('100%')
       }
       .height('100%')
     }
   }
   ```

## Failure[INSTALL_FAILED_INTERNAL_ERROR]

![cke_240.jpeg](https://alliance-communityfile-drcn.dbankcdn.com/FileServer/getFile/cmtybbs/739/542/078/0030086000739542078.20231227111115.12034213155012882109106982861024:50001231000000:2800:10B69837F7F7B35E87AA57642111D6E5EDB2687076389DEB3B0B3279BFE18380.jpeg)在设备管理中点击 wipe user Data 清理数据 或者是代码出错了 检查下代码

### preview
