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

## 打 hap 包

https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/creating_har_api9-0000001518082393-V3#section143510369612

1. 新建一个任意项目
2. 选中 entry 新建一个**Static Library**模块
3. ![image-20240219143002758](/Users/liqiankun/Library/Application Support/typora-user-images/image-20240219143002758.png)

4. 生成的 key 需要设置密码 不然传包的时候上传不过
   ![image-20240219153704654](/Users/liqiankun/Library/Application Support/typora-user-images/image-20240219153704654.png)
5. 个人中心中管理包、组织、认证信息。包和组织需要审核
   ![image-20240219153628534](/Users/liqiankun/Library/Application Support/typora-user-images/image-20240219153628534.png)

6. 设置私有 key 的路径` ohpm config set key_path ~/.ssh/harmonyos`
7. 上传包时，需要具体到.har 文件
   ![image-20240219153754311](/Users/liqiankun/Library/Application Support/typora-user-images/image-20240219153754311.png)

8. name 中带组织名称引入的包就带组织了
   ![image-20240219154050424](/Users/liqiankun/Library/Application Support/typora-user-images/image-20240219154050424.png)

## 上传文件

```typescript
  uploadFile(realuri){
    let uploadTask;

    let uploadConfig = {
      url: 'http://10.7.100.86:3000/file/getFile?id=5',
      header: {},
      method: "POST",
      files: [{ filename: "ceshi.jpg", name: "files", uri: realuri, type: "jpg" }],
        data: [
          { name: "userId", value: "342427199404266610"},
          { name: "fileId", value: "24e97ea0-c4b9-11ee-948d-4f69f88bf333"},
          { name: "functionName", value: "EXPENSE"},
          { name: "moduleName", value: "note"}
        ],
    };
    try {
      request.uploadFile( getContext(this), uploadConfig).then((data) => {
        uploadTask = data;
        console.log('图片216：applog2');
        let upProgressCallback = (uploadedSize, totalSize) => {
          console.info("图片217：applog:upload totalSize:" + totalSize + "  uploadedSize:" + uploadedSize);
        };
        uploadTask.on('progress', upProgressCallback);
        let upCompleteCallback = (taskStates) => {
          for (let i = 0; i < taskStates.length; i++ ) {
            console.info("图片215：upOnComplete taskState:" + JSON.stringify(taskStates[i]));
          }
        };
        uploadTask.on('complete', upCompleteCallback);

        let upFailCallback = (taskStates) => {
          for (let i = 0; i < taskStates.length; i++ ) {
            console.info("图片214：upOnFail taskState:" + JSON.stringify(taskStates[i]));
          }
        };
        uploadTask.on('fail', upFailCallback);


        let headerCallback = (headers) => {
          console.info("图片218：upOnHeader headers:" + JSON.stringify(headers)
          );
        }
        uploadTask.on('headerReceive', headerCallback);


      }).catch((err) => {
        console.info('图片218：Failed to request the upload. Cause: ' + JSON.stringify(err));
      });
    } catch (err) {
      console.info('图片219：applog:'+JSON.stringify(err));
      console.info('图片220：err.code : ' + err.code + ', err.message : ' + err.message);
    }
  }
	// axios的一直不行！！！
  getPhoto() {
    // 获取应用文件路径
    let context = getContext(this) as common.UIAbilityContext;
    let PhotoSelectOptions = new picker.PhotoSelectOptions();
    PhotoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE;
    PhotoSelectOptions.maxSelectNumber = 1;
    let photoPicker = new picker.PhotoViewPicker();
    photoPicker.select(PhotoSelectOptions).then(async (PhotoSelectResult) => {
      console.info('图片', JSON.stringify(PhotoSelectResult))
      if (PhotoSelectResult.photoUris) {
        const uri = PhotoSelectResult.photoUris[0]
        let file = fs.openSync(uri, fs.OpenMode.READ_ONLY)
        console.log('图片1', file, uri)
        const dateStr = (new Date().getTime()).toString()
        let newPath = context.cacheDir + `/${dateStr}.png`;
        fs.copyFile(file.fd, newPath).then(() => {
          console.info("图片8  applog:copy file succeed");
          let realUri = "internal://cache/" + newPath.split("cache/")[1];
          console.info('图片2', realUri)

          // 读取
          let stat = fs.lstatSync(newPath);
          let buf2 = new ArrayBuffer(stat.size);
          fs.readSync(file.fd, buf2); // 以同步方法从流文件读取数据。
          fs.fsyncSync(file.fd);
          fs.closeSync(file.fd);

          let formData = new FormData()
          formData.set('file', buf2)
          // formData.append('file2', buf2)
          formData.set('userId', '342427199404266610')
          formData.set('fileId', '24e97ea0-c4b9-11ee-948d-4f69f88bf333')
          formData.set('functionName', 'EXPENSE')
          formData.set('moduleName', 'note')

          this.uploadFile(realUri)


          // 发送请求
          console.info('图片9 开始请求', formData)
          axios.post<string, AxiosResponse<string>, FormData>('http://10.7.100.86:3000/file/getFile?id=5', formData, {
            // headers: {
            //   'Content-Type': `multipart/form-data; boundary=----WebKitFormBoundary${generateBoundary()}`,
            //   // 'Content-Type': 'application/x-www-form-urlencoded',
            //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ',
            // },
            headers: { 'Content-Type': 'multipart/form-data' },
            context: context,
            onUploadProgress: (progressEvent: AxiosProgressEvent): void => {
              console.info(progressEvent && progressEvent.loaded && progressEvent.total ? '图片 555  ' + Math.ceil(progressEvent.loaded / progressEvent.total * 100) + '%' :  '图片 555  ' + '0%');
            },
          }).then((res: AxiosResponse<string>) => {
            console.info("图片15" + JSON.stringify(res.data));
          }).catch((err: any) => {
            console.info("图片16" + JSON.stringify(err));
          })




        }).catch((err) => {
          console.info("图片5 applog:copy file failed with error message: " + err.message + ", error code: " + err.code);
        })

      }

    }).catch((err) => {
      console.info('图片6 PhotoViewPicker.select failed with err: ' + err);
    });

  }
```
