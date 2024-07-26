# 工作中遇到的坑和思考

## 有不同意见欢迎指正交流

### 前排推荐 https://github.com/topics/javascript 关注 JS 开源框架动态

### 勤于总结和思考

**1. ajax 请求的结果要和后端约定好返回的数据格式。**

- 比如：成功与否 code、提示信息 msg、详细的返回数据 data。如果每次格式不一致会导致出错。一个场景：后端在当前接口直接返回数据 `response = [1, 2, 3]` ，而后端验证登录过期后返回的数据格式是`response = { code: 2, msg: "登录过期", data: "" }`，这个时候如果你的异常处理没有做好，就可能会出错。

**2. 注意代码的复用（切记）**

- 写逻辑的时候经常能抽离出公用代码，比如一个公共的方法、一个公共的逻辑、能抽离的一定要抽离！不要觉得抽离很难，就是把会变的设置成变量，传递进方法中就行。这样你后期维护的时候会省很多事

```javascript
/* 比如一个计算方法封装到公共的JS中 */

function addResult(a, b, c) {
  return a * b - c;
}

/* 如果项目中多次用到这个方法 你就可以直接调用这个函数 */

// 页面a
addResult(9, 5, 5);
// 页面b
addResult(9, 9, 6);

/**
 * 尴尬的问题来了 产品说这种计算方法不对 要改一下
 * 这时候就体现了这种封装带来的好处
 * 如果你的页面中每个都是单独写的一个方法 那你就要一个一个去改
 * 封装进公共的JS中 我直接修改这个方法 所有的页面引用这个函数的就都生效了
 * 改一个的快捷方便性远远大于改几个、几十个页面 对吧
 */
```

- 我建议两个或者三个以上页面使用到了相同的逻辑或者函数就封装进公共函数中 一个一个页面去改真的很痛苦
- 封装的公共方法注释一定要写清楚 不要觉得方法很简单就不写了
- 封装的方法语法尽量友好，方便同事维护。不要觉得写逼格很高的代码就很好，每个人的技术水平不同。
- 方法命名尽量符合规范 动词 + 名词
- 工具方法和逻辑方法可以分开封装 方便维护

```javascript
// 比如这个文件是 common.js
let tools = {
  /**
   * @description 返回一个数字类型的数字
   * @param { * } -- num： 任意值
   */
  returnNum(num) {
    isNaN(num) && (num = 0);
    return Number(num);
  },
};
let logic = {
  // 你的逻辑函数
};
```

**3. 做好异常检测**

- 善用 `try{} catch(){}`
- 数据类型验证
- 后端返回的数据类型验证，不要觉得后端每次返回的类型都是对的。比如有时候空的时候，后端没返回 `""`,返回的是 `null`，你的页面就可能报错。
- 传入公共函数中的参数类型验证
- 现在比较流行的 `TypeScript` 就是强类型的 JS 是 JS 的超集 数据验证等 很强大
- 等等……

**4. 写完界面和逻辑一定要在常用浏览器中跑一下看看是否有兼容性问题**

**5. 静态资源管理**

> 如果项目中使用的有 webpack 等打包工具 可以避免这个问题 如果没有使用 就要注意了

- 静态资源存在缓存的问题。一个场景就是页面`index.html`中增加了一个公共方法`addNum`，公共方法写在`common.js`中。当用户访问这个页面时，`common.js`并没有得到更新，`addNum is not defined`报错了。我们目前使用的方案就是后端在文件后面添加版本号`common.js?v=xxxxx`，这个版本号可以让后端通过获取文件修改时间来添加，这样就起到了版本控制的效果，最好的方式其实是`common.dde65x.js`这种。v 版本的方式有的浏览器还是会无视，但是大部分都没问题。
- 图片压缩。 图片压缩的话 webpack 有插件。我们可以使用 [Tiny](https://tinypng.com/) 这个在线压缩的网站来压缩我们的图片。
- css 压缩、整理、美化 [CSS 在线压缩/整理/格式化工具](https://tool.lu/css/), 很多编译器的插件都有这个功能啦，就不做太多介绍。
- js 压缩、整理、混淆 [JS 在线压缩/整理/格式化工具](https://tool.lu/js/), 很多编译器的插件都有这个功能啦，就不做太多介绍。

**6. 需求**

- 尽量需求明确后再开始写项目，避免返工。
- 不清楚的需求一定要问清楚，不要怕问。问清楚总比犯错强。

**7. es5 块级作用域**

- es5 和它之前 js 并没有明确的模块化和块级作用域规范，现在有 es6 的`export/import`、`{}`块级作用域等。很方便的，不要抗拒新技术，拥抱它你会爱上它。
- 如果你的项目中技术栈比较落后，没有模块化工具比如 `require.js`、`sea.js`等。你可以使用`闭包`、`匿名函数`模拟一个块级作用域。
- 使用 babel 写 es6 在项目中也是一个不错的选择，babel 可以单独使用的，不用配合 webpack

```javascript
var glob = {
  // 全局函数 用来实现作用域间的通信
  // 这里定义全局的属性和一些别的
};
(function () {
  // 作用域1 这是业务逻辑A的部分
})();
(function () {
  // 作用域2 这是业务逻辑B的部分
})();

// 注意了 闭包中的变量不会被垃圾回收机制删除 用完记得null一下
```

**8. input 也是有长度限制的**

- 在一次项目中，我使用隐藏的`input`来存放`base64`的图片，传递给后端后，图片只有一半了，被截取了。使用的`POST`传输。

**9. z-index 的优先级**

- 子元素的`z-index`受父元素影响。如果父元素的`z-index`是 2，子元素的`z-index`是`66666`。那么子元素的`66666`只在当前父级下的同级和子集生效，父级以上和父级的兄弟元素仍示`z-index: 66666`为`z-index: 2`。

**10. 神奇的`<pre>`标签**

- `<pre>` 标签可定义预格式化的文本。
- 被包围在 `<pre>` 标签 元素中的文本通常会保留空格和换行符。而文本也会呈现为等宽字体。
- 一个场景： 比如我要解析出来的文本保留用户在`textarea`中输入的换行等，就可以使用这个标签。
- 1. `pre`元素是块级元素，但是只能包含文本或行内元素。也就是说，任何块级元素（常见为可以导致段落断开的标签）都不能位于 pre 元素中。
  2. `pre`元素中允许的文本可以包含物理样式和基于内容的样式变化，还有链接、图像和水平分隔线。当把其他标签，比如`<a>`标签放到`<pre>`块中时，就像放在 HTML/XHTML 文档的其他部分中一样即可。
  3. 制表符 tab 在`<pre>`标签定义的块当中可以起到应有的作用，每个制表符占据 8 个字符的位置，但并不推荐使用 tab，因为在不同的浏览器中，tab 的表现形式各不相同。在用`<pre>`标签格式化的文档段中使用**空格**，可以确保文本正确的水平位置。
  4. 如果希望使用`<pre>`标签来定义计算机源代码，比如 HTML 源代码，请使用符号实体来表示特殊字符。一般将`<pre>`标签与`<code>`标签结合起来使用，以获得更加精确的语义，用于标记页面中需要呈现的源代码。
  5. 如果想要把某一段规定好的文本格式放在 HTML 中，那么就要利用`<pre>`元素的特性。

- 可以使用`white-space`的 `pre`、 `pre-line`、 `pre-wrap` 属性达到相同的效果

**11. 规范**

- 最好弄清楚 w3c 规范
- 公司规范也要遵守
- 如果有好的建议要及时提出来

**12. 没事可以多逛逛社区**

- [segmentfault——思否](https://segmentfault.com/)
- [掘金](https://juejin.im/timeline)
- [知乎](https://www.zhihu.com/signup?next=%2F)
- [简书](https://www.jianshu.com/)
- 很多很多 找几个自己比较喜欢的经常看 对自己了解技术动态、知识点检测、学习很有帮助 共勉

**13. substring、 substr、 slice**

```javascript
	substr(start [, length])
	substring(start [, end])
	slice(start [, end])
```

- substring 有个神奇的地方 就是 start， end ，两个参数 谁小 谁就是 start

```javascript
var str = "My name is: Jerry . My age is: 12 . : :666 .";
str.substring(0, 5);
("My na");
var str = "My name is: Jerry . My age is: 12 . : :666 .";
str.substring(5, 0);
("My na");
```

- substr 和 slice 如果遇到负数 会 和 length 相加

```javascript
var str = "My name is: Jerry . My age is: 12 . : :666 .";
str.slice(0, 5);
("My na");
var str = "My name is: Jerry . My age is: 12 . : :666 .";
str.slice(0, -5);
("My name is: Jerry . My age is: 12 . : :");
str.length;
44;
str.slice(0, 39);
("My name is: Jerry . My age is: 12 . : :");
```

- 从定义上看： substring 和 slice 是同类的，参数都是字符串的某个｛开始｝位置到某个｛结束｝位置（但｛结束｝位置的字符不包括在结果中）；而 substr 则是字符串的某个｛开始｝位置起，数 length 个长度的字符才结束。－－ 共性：从 start 开始，如果没有第 2 个参数，都是直到字符串末尾
- substring 和 slice 的区别则是，slice 可以接受“负数”，表示从字符串尾部开始计数； 而 substring 则把负数或其它无效的数，当作 0。
- substr 的 start 也可接受负数，也表示从字符串尾部计数，这点和 slice 相同；但 substr 的 length 则不能小于 1，否则返回空字符串。

**14. 通过 promise 判断滚动事件是 scrollTo 触发的还是鼠标滚动触发的**

```javascript
status = false;
function timeout(long) {
  return new Promise(function (resolve, reject) {
    window.scrollTo(0, long);
    setTimeout(resolve, 0);
  });
}

$(document).click(function () {
  status = true;
  timeout(200).then(function () {
    status = false;
  });
});

$(window).scroll(function () {
  if (status == "true") {
    console.log("点击事件触发的");
  } else if (status == "false") {
    console.log("滚动事件触发的");
  }
});
```

**15. 函数的参数可以是个表达式（任意类型）**

```javascript
function timeout(a) {
  console.log(a);
}
timeout(window.scrollTo(0, 200), 6); // undefined
```

**16. window.status**

- 全局定义 status 是不行的 它是个保留字 定义任何都是字符串
- status 属性在 IE，火狐，Chrome，和 Safari 默认配置是不能正常工作。要允许脚本来改变状态栏文本，用户必须把配置屏幕首选项设置为 false dom.disable_window_status_change。

**17. 一个有趣的 JS 面试题目**

```javascript
function a(xxx) {
  this.x = xxx;
  return this;
}
x = a(5);
y = a(6);
console.log(x.x);
console.log(y.x);

// 输出什么 ？
// undefined 和 6
/**
	 * 非严格模式
	 * 首先 函数 a 定义在全局环境执行 它里面的this就是指向了window，return 的this也是window
	 * 当执行 x = a(5);的时候 this.x = 5，函数返回了this，this是window对象，又被重新赋值给了x， 此时x又是window对象。
	 * 如果我们不返回this，就会是这个结果。
	 * function a(xxx){
	       this.x=xxx
	   }
	   a(5) 
	   console.log(x) //5
	 * 但是我们返回了this;
	 * 当执行 y = a(6); 这个时候 x 就是 6 了，而返回的this被赋值给了y。
	 * 所以当打印x.x时， x是Number类型，基本类型，x.x 所以是undefined
	 * 而y.x就是 window.x x是6 所以是 6
	 */
```

**18. label for**

- 给 label 指定 for 对应 input 或者别的 form 元素 即使 label 不包裹着 for 也会触发该元素的聚焦 for 把两个不包裹的元素关联了起来
- 而 label 包裹上的元素不需要写 for 也可以聚焦

**19. JS 中的 Label**

- start 在 ES5 中并没有建立作用域

```JAVASCRIPT
start: {
	console.log(1);
	console.log(2);
	break start
	console.log(3);
}
// 1 2
还有双重for循环的场景 有兴趣可以MDN看一下
```

**20. setTimeout 严格上来讲并不是全局函数**

- `setTimeout`是`window`的一个方法，如果把`window`当做全局对象来看待的话，他就是全局函数。严格来讲，它不是。全局函数与内置对象的属性或方法不是一个概念。全局函数他不属于任何一个内置对象。JS 中包含以下 7 个全局函数`escape()eval()isFinite()isNaN()parseFloat()parseInt()unescape()`

**21. 一个朋友提的场景需求而引发的 Array.sort()方法思考**

```javascript
// 比如一个数组
let arr = [1, 23, 4, 5, 6, 8, 9, 1, 0, 11, 5, 666, -1, -1, -1];
// 需求是 按照升序排列 但是-1必须在最后

arr.sort((a, b) => {
  a < 0 && (a = Number.POSITIVE_INFINITY);
  b < 0 && (b = Number.POSITIVE_INFINITY);
  return a - b;
});

arr.sort((a, b) => {
  a < 0 || (b < 0 && ((a *= -1), (b *= -1)));
  return a - b;
});

// 位运算
arr.sort((a, b) => (!~a || !~b ? b : a - b));

// sort方法会修改原始数组 使用之前最好拷贝一下原数组
```

**22. 如果你要处理多列或多行之间的计算或别的问题**

- 如果是数据驱动很好处理
- 如果是 JQ 计算的时候最好给每列或每行要用到的起个 class 类名，根绝这个类名去查找计算。这样会避免列或行的增删带来的问题。比如你用 eq 去找的，但是增加了一列，减少了一列。或者你按着 input 的 name 名字去找，后端给你改了名字咋搞呢。

**23. 一个 iframe 跨域的场景**

- 今天遇到一个场景，父页面 A、Iframe 页面 B 和 Iframe 页面 C，B 页面提交后通过 A 页面关闭打开的 Iframe
- 父页面 A 用来操作关闭当前 Iframe 和刷新 A 页面中的列表
- Iframe-B 中需要上传图片，而上传图片的组件是公共 Iframe-C
- 但是 Iframe-C 的域名和 A、B 页面不同，产生了跨域问题
- 尝试了`window.name`, `document.domain`等方法皆不奏效。
- 后来，想到个笨方法

```javascript
/*
 * 正常来讲
 *	$.ajax().done( ( response )=> {
 *		window.parent.modal.hide();
 *		window.parent.IframeB.hide();
 *	})
 * 但是到这里由于Iframe-C的问题产生了跨域
 * 于是换了个思路
 * 请求成功后 给URL加一个hash然后刷新当前页面
 * $.ajax().done( ( response )=> {
 *		window.location.hash = '?active=true';
 *		window.location.reload();
 *	})
 * 然后在引起跨域的问题之前 (我是放在了<body>之后) 检查url的hash值
 * var body = document.body || document.getElementsByClassName('body')[0];
 * /\?active\=true/.test(window.location.href) && (  window.parent.modal.hide(), window.parent.IframeB.hide() )
 * 这个时候会有一些闪动 你可以给body设置透明或者别的 等加载到JS把透明或别的去掉
 */
```

**24. IE8 的异步上传文件方案**

- 基本思路很简单，提交上传文件表单时，让浏览器转移到 iframe 处理响应信息，响应信息嵌入一段 js 代码，这段 js 代码调用当前页面的一个方法就可以实现回调，类似于 xss 攻击。这时就要用到 form 表单的 target 属性，我们这里只需要用到 iframename 的值，iframename 指的是 iframe 的 name 属性，意思是转移到 iframe 处理响应信息。
- 父页面

```html
<form
  action="excel/uploadExcel"
  target="testForm"
  method="POST"
  enctype="multipart/form-data"
>
  <input type="file" name="file" />
  <input type="submit" value="submit" />
</form>
<div id="titles"></div>
<iframe name="testForm" style="display: none"></iframe>

<script>
  // 暴露一个全局方法供Iframe调用
  function uploadFileCallback = function( data, errorMsg ){
  	if( errorMsg ){
  		alert( errorMsg );
  		return
  	}
  	document.getElementById('titles').innerHTML = data;
  }
</script>
```

- iframe 页面

```html
<script>
  window.parent.uploadFileCallback( '数据1'， '数据2' )
</script>
```

**25. isNaN( ) 会把被检测的内容先转成数字类型**

> [MDN-isNaN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN)

```javascript
var str = "";
isNaN(str); // false
Number(str); // 0

var num = 0;
isNaN(num); // false

//isNaN() 底层会将字符串先转成数字类型
isNaN("666"); // false
```

**26. 对象拍平方法**

> 我自己写的只能拍平 2 层 最下面是大猫大牛写的

- 三层的情况

```javascript
var m = { a: 1, b: { c: 2, d: [3, 4] }, e: { f: { g: "6" } } };
var obj = {};
function planeHouse(m, child) {
  Object.keys(m).forEach(function (v, k) {
    if (Object.prototype.toString.call(m[v]) === "[object Object]") {
      // 如果当前还是一个对象 递归调用 传入child  v是m[v]的子key  obj[b.c] obj[b.d]
      planeHouse(m[v], v);
    } else {
      child ? (obj[child + "." + v] = m[v]) : (obj[v] = m[v]);
    }
  });
}

planeHouse(m); // {a: 1, b.c: 2, b.d: Array(2), f.g: "6"}
```

- 两层的情况

```javascript
var m = { a: 1, b: { c: 2, d: [3, 4] } };
var obj = {};
function planeHouse(m, child) {
  Object.keys(m).forEach(function (v, k) {
    if (Object.prototype.toString.call(m[v]) === "[object Object]") {
      // 如果当前还是一个对象 递归调用 传入child  v是m[v]的子key  obj[b.c] obj[b.d]
      planeHouse(m[v], v);
    } else {
      child ? (obj[child + "." + v] = m[v]) : (obj[v] = m[v]);
    }
  });
}

planeHouse(m); // {a: 1, b.c: 2, b.d: Array(2)}
```

- 大猫大牛写的方法 支持多层

```javascript
var m = { "a": 1, "b": { "c": 2, "d": [3, 4] }, "e": { f: { g: "6" } } };
function spreadJSON (result, json, parentKey) {
      const keys = Object.keys(json);
      keys.forEach(key => {
        const value = json[key];
        const concatKey = parentKey + (parentKey ? '.' : '') + key;
        if (Object.prototype.toString.call(value) === '[object Object]'){
			spreadJSON (result, value, concatKey)
		}else {
			result[concatKey] = value
		};
      })
      return result;
    }

spreadJSON ({}, m, '')

{a: 1, b.c: 2, b.d: Array(2), e.f.g: "6"}
```

**27. Blob 对象**

> [MDN-Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)

- Blob 对象表示一个不可变、原始数据的类文件对象。Blob 表示的不一定是 JavaScript 原生格式的数据。文件接口基于 Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
- 要从其他非 blob 对象和数据构造一个 Blob，请使用 Blob() 构造函数。要创建包含另一个 blob 数据的子集 blob，请使用 slice()方法。要获取用户文件系统上的文件对应的 Blob 对象，请参阅 文件文档。

**28. Postcss-cli 的简单使用**

- 今天把项目中的 css 单独使用 postcss 优化了一下

1. npm i -g|-D postcss-cli 安装 postcss-cli
2. npm i -g autoprefixer 安装插件
3. cd node_modules/.bin 一定要进入这个文件夹
4. 在 3 进入的文件夹中 根据相对路径找到你要优化的 css （我的是放在了根目录的 css 文件中）
5. postcss ../../css/common.css -o ../../css/outcommon.css -u autoprefixer
6. 然后你就拿到了加了兼容的新的 css 样式

- 还有很多插件（现在貌似 200+）还没用到 有时间一起研究

**29. IOS9 和低版本安卓 不支持 let！**

**30. IOS 的时间格式 必须是 2018/03/24 19:11:00**

- IOS 的时间格式 必须是 2018/03/24 19:11:00
- IOS 的时间格式 必须是 2018/03/24 19:11:00
- IOS 的时间格式 必须是 2018/03/24 19:11:00

**31. Vue 开发微信网页遇到的一些问题**

- 前几天做一个专题，本来有个老的模板，可以直接套，但是我想用 VUE，于是给自己找了个大麻烦，熬到凌晨，还加了班，最后因为微信的配置问题和甲方比较催促，不得不放弃了。讲一下期间遇到的问题，等这个项目忙完了，接着研究，不能遗留这些问题。
- 1. Vue bus 的状态没有实时更改，不得不采用 props 传值的麻烦方式，具体在弹窗的那里 —— 待解决。
  2. 微信 wx.config 签名无效一直报错（这是我最后放弃使用 vue 的原因，实在是来不及了）所以你使用 Vue 开发微信的时候一定要提前做个 demo 测试一下，貌似通过`URL.split('#')[0]`这样传递给后端去做签名就行了
  3. 如何使用内网穿透调试微信。
  4. 桌面右下角的网络查看属性 IPV4 的 ip 并不准确 还是要用`cmd`-`ipconfig`
  5. Vue `beforeEach`的全局路由导航中 如果没有进入登录页面（获取用户信息存储到 Store 中） 你在这个周期里用 Store 取值是拿不到的，所以要做个路由名称的判断(当时脑子确实写浆糊了 几近崩溃 很难受)
  6. IOS 的时间格式 必须是 `2018/03/24 19:11:00`
  7. IOS<=9 和老版本的安卓的系统 不支持`let`
  8. 关于微信的授权：
     - 我们的后端是通过 URL 的 hash 值将用户授权后的信息传递给我 + 首先你要做个 Vue 的登录页 + 思路是 这个登录页中，`mouted`或者`creadted`周期中判断 url 中是否有后端传来的 hash，我们定的是 data，如果取到了这个 hash 并且有内容，就存储到`store`中 + 在这个组件中首先要跳转到后端的授权链接假如是`http://www.shou.com` + 然后后端接到这个请求链接后，将参数附加在 URL 中 `http://www.shou.com?data={"user": {"openid": "ssxffqfsf"}}` + 然后后端还会重定向回我们的页面，然后我们再次进入这个登录组件，这个时候就取到了后端给我们的 hash 然后就可以进入我们的项目了

**32. table 表格中的表格如果使用 relative 定位会导致表格边框消失**

- 在 IE、火狐中都测出该问题
- 解决思路： 给 td 中套一个 div，给这个 div 设置相对定位，内容写在相对定位的 DIV 中。
- 可看帖子 [解决 IE 浏览器下：td 标签上有 position: relative;与 background-color 属性时 td 边框消失](https://blog.csdn.net/littlebeargreat/article/details/71123979)
- 另一种思路，看场景。 不要给 td 背景色 给 tr 背景色 当:hover 当前行的时候就不会出现边框问题了

**33. 一个横着铺开的 ul 列表的样式**

```css
.tabs .tabs-navbar .tabs-nav {
  height: 30px;
  white-space: nowrap;
  overflow: hidden;
}
.tabs .tabs-navbar .nav-tabs > li {
  display: inline-block;
  float: none;
}
```

**34. table 使用 table-layout: fixed;带来的问题**

- table 使用 table-layout: fixed;然后使用 colspan rowspan 会使子表格中设置宽度失效，这个时候可以用

```HTML
<colgroup>
	<col style="width: 60px">
	<col style="width: 100px">
	<col style="width: 209px">
	<col style="width: 50px">
	<col style="width: 60px">
	<col style="width: 209px">
	<col style="width: 209px">
	<col style="width: 80px">
	<col style="width: 110px">
	<col style="width: 60px">
</colgroup>
```

- 来分隔表格宽度

**35. JQ \$(dom).html()保存的 html 中没有 input 和 textarea 的值**

- 监听 textarea 和 input 的 input 事件 赋值在 DOM 结构上即可

```JAVASCRIPT
saveDom()
function saveDom(){
	var changeInputTimeId = null,
		changeTextTimeId = null;
	$('input').on( 'input', function(e){
		clearTimeout( changeInputTimeId )
		var $this = $(this);
		setTimeout( function(){
			$this.attr( 'value', $this.val() )
		}, 200 )
	} )

	$('textarea').on( 'input', function(e){
		clearTimeout( changeTextTimeId )
		var $this = $(this);
		setTimeout( function(){
			// TEXTAREA必须是val和text
			$this.text( $this.val() )
		}, 200 )
	} )
}
```

**36. 回流（reflow）和重绘（repaint）**

> 传送门 [DOM 操作成本到底高在哪儿？](https://segmentfault.com/a/1190000014070240?utm_source=feed-content)

- **reflow(回流)**: 根据 Render Tree 布局(几何属性)，意味着元素的内容、结构、位置或尺寸发生了变化，需要重新计算样式和渲染树；
- **repaint(重绘)**: 意味着元素发生的改变只影响了节点的一些样式（背景色，边框颜色，文字颜色等），只需要应用新样式绘制这个元素就可以了；
- reflow 回流的成本开销要高于 repaint 重绘，一个节点的回流往往回导致子节点以及同级节点的回流；
- **引起 reflow 回流**
  1. 页面第一次渲染（初始化）
  2. DOM 树变化（如：增删节点）
  3. Render 树变化（如：padding 改变）
  4. 浏览器窗口 resize
  5. 获取元素的某些属性：
  6. 浏览器为了获得正确的值也会提前触发回流，这样就使得浏览器的优化失效了，这些属性包括 offsetLeft、offsetTop、offsetWidth、offsetHeight、 scrollTop/Left/Width/Height、clientTop/Left/Width/Height、调用了 getComputedStyle()或者 IE 的 currentStyle
- **引起 repaint 重绘** 1. reflow 回流必定引起 repaint 重绘，重绘可以单独触发 2. 背景色、颜色、字体改变（注意：字体大小发生变化时，会触发回流）

- **优化方式**

  1. 避免逐个修改节点样式，尽量一次性修改
  2. 使用 DocumentFragment 将需要多次修改的 DOM 元素缓存，最后一次性 append 到真实 DOM 中渲染
  3. 可以将需要多次修改的 DOM 元素设置 display: none，操作完再显示。（因为隐藏元素不在 render 树内，因此修改隐藏元素不会触发回流重绘）
  4. 避免多次读取某些属性（见上）
  5. 将复杂的节点元素脱离文档流，降低回流成本

- **为什么一再强调将 css 放在头部，将 js 文件放在尾部** + DOMContentLoaded 和 load 1. DOMContentLoaded 事件触发时，仅当 DOM 加载完成，不包括样式表，图片... 2. load 事件触发时，页面上所有的 DOM，样式表，脚本，图片都已加载完成 + CSS 资源阻塞渲染 1. 构建 Render 树需要 DOM 和 CSSOM，所以 HTML 和 CSS 都会阻塞渲染。所以需要让 CSS 尽早加载（如：放在头部），以缩短首次渲染的时间。 + JS 资源 1. 阻塞浏览器的解析，也就是说发现一个外链脚本时，需等待脚本下载完成并执行后才会继续解析 HTML - 这和之前文章提到的浏览器线程有关，浏览器中 js 引擎线程和渲染线程是互斥的，详见[《从 setTimeout-setInterval 看 JS 线程》](https://segmentfault.com/a/1190000013702430#articleHeader2) 2. 普通的脚本会阻塞浏览器解析，加上 defer 或 async 属性，脚本就变成异步，可等到解析完毕再执行 - async 异步执行，异步下载完毕后就会执行，不确保执行顺序，一定在 onload 前，但不确定在 DOMContentLoaded 事件的前后 - defer 延迟执行，相对于放在 body 最后（理论上在 DOMContentLoaded 事件前）

**37. 滚动的图片视差效果 demo**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>滚动的图片视差效果demo</title>
    <style>
      body {
        margin: 0;
        background: url("../images/timg.jpg") no-repeat;
        background-size: 100% 100%;
        /*这个属性把背景图固定住*/
        background-attachment: fixed;
      }
      header,
      footer {
        height: 800px;
        background: #fff;
      }
      section {
        height: 100px;
        /*背景色透明*/
        background: transparent;
      }
    </style>
  </head>
  <body>
    <header></header>
    <section>66</section>
    <footer></footer>
  </body>
</html>
```

**38. NVM 安装后，以前装的 Node 的环境变量没了**

- 自己没好好看安装的提示文字吧
- 第一个安装路径是 NVM 的安装路径
- 第二个安装路径是你已经安装的 Node 环境的安装路径，比如我的 node 在安装 NVM 之前装在 D:\node\, NVM 安装的第二个路径就要是这个路径下，这样你的 Node 环境变量就不会丢失了

**39. 移动端 web 页面上使用软键盘时如何让其显示“前往”（GO）而不是换行？**

- 用一个 form 表单包裹住就会显示前往，单独的一个 input 就会提示换行。

**40. vue 使用 bootstrap 的响应式布局**

1. http://v3.bootcss.com/customize/ 到这里去定制 bootstrap 所有的都不勾选 只勾选 grid
2. 下载下来 引入到你的 vue 项目用
3. 和使用 bootstarp 一样布局吧 亲测好用

**41. VUE 权限控制——动态路由的方案**

- https://github.com/tianxiadaluan/vue-checkAuth 王大哥总结的 可以学习一波

**42. Vue ElementUI 的导航栏刷新后默认选择的没了**

```javascript
	<el-aside width="200px" style="background-color: rgb(238, 241, 246)">
		<!-- 设置成route模式 然后设置默认选择的路由 -->
        <el-menu :default-openeds="openIndex" :router="true" :default-active="this.$route.path">
            <el-submenu index="1">
                <template slot="title"><i class="el-icon-message"></i>导航一</template>
                <el-menu-item-group>
                <template slot="title">分组一</template>
				<!-- 设置成route模式 index设置成路由 -->
                <el-menu-item index="/table" >表格1
                </el-menu-item>
                <el-menu-item index="/table2">表格2
                </el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项4-1</el-menu-item>
                </el-submenu>
            </el-submenu>
        </el-menu>
    </el-aside>
```

**43. 关于 toString 和 valueof 的面试题**

```javascript
var a = {};
var b = {key: 'b'};
var c = {key: 'c'};
var d = [3,5,6];
a[b] = 123;
a[c] = 345;
a[d] = 333;
console.log(a[b]);
console.log(a[c]);
console.log(a[d]);
// 345
// 345
// 333
????? 没错 没有搞错  why
/*
Object内置toString 和 valueOf 方法;
这种情况a[b] = 123 会默认调用对象的toString()
所以就是 a['object Objcet'] = 123;
		a['object Object'] = 345;
		a['object Array'] = 333;
		*/
/*
如果是多个对象
var g = [ {name: 666}, {age: 666}, {job: 777} ]
g.toString()
"[object Object],[object Object],[object Object]"
a[g]  其实就是 a["[object Object],[object Object],[object Object]"]
*/
```

**44. ‘false‘如何转成布尔后仍然是 false**

```javascript
const str = "false";
Boolean(str); // true
JSON.parse(str); // false
// 使用JSON.parse()最好try-catch 避免报错
```

**45. 字符串不会隐式转换的**

```javascript
"0" == "";
false;
"0" == false;
true;
"" == false;
true;
```

**46. 一个数组交叉合并题**

```javascript
const arr = [
  ["1", "2", "3"],
  ["a", "b"],
];
for (let i = 0, l = arr[0].length; i < l; i++) {
  newArr.push(arr[0][i] + arr[1][0], arr[0][i] + arr[1][1]);
}
// ["1a", "1b", "2a", "2b", "3a", "3b"]
```

**47. 函数柯里化**

```javascript
// 固定参数实现
const result = x => y => z => x * y * z;
result(3)(4)(4); // 48;
// 柯里化实现
function curry(fn) {
  const len = fn.length;
  return function curried() {
    const args = Array.prototype.slice.call(arguments);
    if (args.length >= len) {
      return fn.apply(this, args);
    }
    return function () {
      return curried.apply(
        this,
        args.concat(Array.prototype.slice.call(arguments))
      );
    };
  };
}
const result = curry(function (a, b, c) {
  return a * b * c;
});
result(3)(4)(4); // 48
```

**48. 空数组循环的问题**

```javascript
let arr = [];
arr[4] = "a";
console.log(arr); // [ emptyx3, 4 ]
// 如果要循环出来 需要用for 使用forEach 等一些高阶函数 会过滤空的数组
```

**49. Array.sort()**

- Array.sort()默认是按照字符集排序的

```javascript
let arr = [6, 1, 0, 8, 9, 10, 15, 20, 9];
// 字符集
arr.sort(); // (9) [0, 1, 10, 15, 20, 6, 8, 9, 9];

// 老老实实回调不能少
arr.sort((a, b) => {
  return a - b;
});
```

**50. 数组含有[0001]这种类型的问题**

```javascript
var arr = [
  ["0001", "0010"],
  ["0020", "0300"],
  ["0301", "0400"],
];
console.log(JSON.stringify(arr)); // [["0001","0010"],["0020","0300"],["0301","0400"]]

var arr = [
  [0001, 0010],
  [0020, 0300],
  [0301, 0400],
];
console.log(JSON.stringify(arr)); // [[1,8],[16,192],[193,256]]
```

**51. 正则 g 的问题**

> [原文](https://blog.csdn.net/jackie_tsai/article/details/52102363)

-在创建正则表达式对象时如果使用了“g”标识符或者设置它了的 global 属性值为 ture 时，那么新创建的正则表达式对象将使用模式对要将要匹配的字符串进行全局匹配。在全局匹配模式下可以对指定要查找的字符串执行多次匹配。每次匹配使用当前正则对象的 lastIndex 属性的值作为在目标字符串中开始查找的起始位置。 lastIndex 属性的初始值为 0，找到匹配的项后 lastIndex 的值被重置为匹配内容的下一个字符在字符串中的位置索引，用来标识下次执行匹配时开始查找的位置。如果找不到匹配的项 lastIndex 的值会被设置为 0。 当没有设置正则对象的全局匹配标志时 lastIndex 属性的值始终为 0，每次执行匹配仅查找字符串中第一个匹配的项。可以通过 regex.lastIndex 来访问在执行匹配相应的 lastIndex 属性的值。

- 多次使用同一个 g 正则匹配同个字符串可能会出现问题

**52. animation-fill-mode: forwards 影响 z-index 关系**

- #content > .modal #content 包裹着 modal 弹窗
- modal 的遮罩层和#content 是兄弟节点关系
- #content 是 absolute 定位 但是没有设置 z-index modalz-index 是 1050 遮罩层是 1040
- 当使用 animation-fill-mode: forwards 时 modal 的 z-index 失效 或是受#content 的无 z-index 影响 导致遮罩挡着弹窗 具体原因 还不清楚

**53. 传统 a 链接跳转的网页也可以加过度动画的**

- 具体动画看你怎么加喽 体验也很棒

```html
<head>
  <style>
    .content {
      opacity: 0;
      transition: opacity 0.5s;
    }
    .content.active {
      opacity: 1;
    }
  </style>
</head>
<body>
  <nav>
    <ul>
      <li><a href="/">首页</a></li>
      <li><a href="/my">我的</a></li>
      <li><a href="/you">你的</a></li>
    </ul>
  </nav>
  <div class="content">内容</div>
  <script>
    var content = document.querySelector(".content");
    content.classList.add("active"); // 这个 classList IE10才行
  </script>
</body>
```

**54. net::ERR_BLOCKED_BY_CLIENT**

- 可能是用户装了什么过滤插件 把当前域名加到浏览器白名单或插件白名单就行了

**55. 抽象的组件到底是用一个公共 DOM 还是多个 DOM**

- 推荐多个 DOM 如果用一个公共 DOM 容易出问题 当然看组件的复杂度和业务逻辑
- 比如一个下拉列表组件 还是用多个 dom 吧 就是生成多个 DOM 结构
- 可以使用 .el + 随机数的方式生成 class 名字
- 但是要注意生成的随机数不要保存在 this.引用类型中 会造成状态共享的问题！！！

**56. 接口、css、JS 中不要出现 ad 或者广告一类的英文词语**

- 为啥 会被无情地屏蔽 哈哈哈

**57. Blob 对象了解下**
[MDN-Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)

**58. :active 在移动端不生效**

> [解决方案](https://blog.csdn.net/freshlover/article/details/43735273)

-看来在 iOS 系统的移动设备中，需要在按钮元素或 body/html 上绑定一个 touchstart 事件才能激活:active 状态

```javascript
/*
1] By default, Safari Mobile does not use the :active state unless there is a touchstart event handler on the relevant element or on the <body>.
看来在iOS系统的移动设备中，需要在按钮元素或body/html上绑定一个touchstart事件才能激活:active状态。
*/
document.body.addEventListener('touchstart', function () { //...空函数即可});
```

**59. 移动端点击会有部分高亮**

- 无背景会发现

```css
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent; /* For some Androids */
}
```

**60. Vue 和 Elementui 写后台页面，路由和组件划分的问题**

- 如果我们有两个导航栏，hader（头） 和 aside（左侧）和一个主体区域 contain
- 想实现 切换头的导航 aside 和 contain 要切换
- 切换 aside 的导航 只切换 contian
- index 组件和 me 组件的内容 **即便一样也要拆开**

```vue
<template>
  <div class="container-fluid index">
    <v-header />
    <v-aside />
    <transition name="el-fade-in-linear">
      <router-view class="container-fluid"></router-view>
    </transition>
  </div>
</template>
```

- header 部分的导航看做父路由，如果两个导航内的结构和代码一样的话也要拆分开，不然路由的组件不会重新渲染，比如/index,/me,即便 component 的内容相同，也要写成

```javascript
{
	path: '/index',
	component: index
},
{
	path: '/me',
	component: me
}
```

- 一开始我写的是

```javascript
{
	path: '/index',
	component: index
},
{
	path: '/me',
	component: index
}
```

- 导致 component 不会重新渲染， aside 的导航栏的 active 获取就出了问题
- 这样，切换 header 的时候 aside 和 contain 就切换了
- 切换 aside 只切换 contain

**61. 牢记一点： VUE 切换路由，相同的组件不会重新渲染！**

**62. 了解下鸭式辩型**

- 他和鸭子一样的习性，就认为他是鸭子

**63. 在 vue 中灵活运用原生 JS**

- 比如我点击按钮之后禁止它点击，我就可以这样

```template
<button @click="refuse($event)" ></button>
```

```javascript
methods: {
	refuse(event){
		event.target.disabled = true;
	}
}
```

**64. 一个关于作用域的面试题**

```javascript
(function () {
  try {
    throw new Error();
  } catch (x) {
    // 因为这个x的关系， 外部的x不可访问了 而y仍然可以访问
    var x = 1,
      y = 2;
    console.log(x);
  }
  console.log(x);
  console.log(y);
})();

1;
undefined;
2;
```

- 解释(看着生涩)

```javascript
- var语句被挂起（没有它们的值初始化）到它所属的全局或函数作用域的顶部，即使它位于with或catch块内。但是，错误的标识符只在catch块内部可见。它相当于：
(function () {
    var x, y; // outer and hoisted
    try {
        throw new Error();
    } catch (x /* inner */) {
        x = 1; // inner x, not the outer one
        y = 2; // there is only one y, which is in the outer scope
        console.log(x /* inner */);
    }
    console.log(x);
    console.log(y);
})();
```

**65. FormData 配合 JQ ajax**

> [通过 Ajax 使用 FormData 对象无刷新上传文件](https://www.cnblogs.com/zzgblog/p/5417969.html)

- Ajax 的 processData 设置为 false。因为 data 值是 FormData 对象，不需要对数据做处理。（第二种方式中<form>标签加 enctyp 　　 e="multipart/form-data"属性。）
- cache 设置为 false，上传文件不需要缓存。
- contentType 设置为 false。因为是由<form>表单构造的 FormData 对象，且已经声明了属性 enctype="mutipart/form-data"，所以这里设置为 false。

**66. 图片预览**

- URL.createObjectURL(blob);
- FileReader()

**67. webview 不支持 input:file 需要安卓重写底层**

**68. webview 如果不开启 DOM 缓存，localStorage 等将失效**

**69. 美化 select input 等 移动端原表单组件**

> [MDN-appearance](https://developer.mozilla.org/zh-CN/docs/Web/CSS/-moz-appearance)

```css
select {
  /* 看起来是个按钮 */
  appearance: button;
  -moz-appearance: button;
  -webkit-appearance: button;
  border: none;
}
/* 去除点击高亮 */
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
}
```

**70. webview 中用户不选照片仍会返回一个 file 对象**

- 可以通过 file 的 size 来判断是否有图片

**71. VUE 使用 viewerJS**

> [viewerJS 传送门](https://github.com/fengyuanchen/viewerjs)

```javascript
import viewer from 'viewerjs'
// 取得css
import '../../../../node_modules/viewerjs/dist/viewer.min.css'

export default{
	data() {
        return {
            viewerId: null
		}
    }
	methods: {
		getData(){
			ajax().then( (res)=>{
				// 渲染dom的逻辑
				this.$nextTick( ()=>{
					// 我的场景是一个弹窗中显示图片 因为弹窗是个组件，所以并不会每次关闭都销毁
					// 所以我选择每次获取数据后销毁viewer
					// 如果你的场景每次进入需要重新created的话，应该是不需要销毁的
					// 如果你需要更新图片列表 可以使用update方法
					// 注意要用新版本 老版本的没有update方法
                    this.viewerId && this.viewerId.destroy()
					// 假设你的图片列表的id是images
                    this.viewerId = new viewer(document.getElementById('images'));
                } )
			})
		}
	}
}
```

**73. 善用打印寻找要找的内容**

```javascript
console.log(this.$refs.passInput); // 显示的是vue组件 然后我找到了挂载的el
console.log(this.$refs.passInput.$el); // 显示的是当前DOM
this.$refs.passInput.$el.querySelector("input").focus(); // 然后在找到input focus
```

**74. Vue-cli api 请求架构的建议**

- 请求的接口单独管理 —— api.js

```javascript
/*api.js*/
export const CONTEXT = "";

export const FILE_LIST = CONTEXT + "/api/file/list";
```

- 请求的方法单独管理 —— fetch.js

```javascript
/*fetch.js*/
// 我们封装的fetch.js
import axios from "axios";
import { Message } from "element-ui";
import auth from "./auth";
const model = process.env.NODE_ENV === "development";

//设置用户信息action
export default function fetch(options, type) {
  let token = "";
  if (options.url.indexOf("api") > 0) {
    token = JSON.stringify({
      deviceType: "WEB",
      token: "Basic  " + auth.getToken(),
    });
  }
  //console.log('token is ' + token);
  return new Promise((resolve, reject) => {
    // https://github.com/mzabriskie/axios
    //创建一个axios实例
    const instance = axios.create({
      headers: {
        Authorization: token,
      },
    });
    //请求处理
    instance(options)
      .then(({ data: data }) => {
        //console.log(data);
        var status = data.status;
        var msg = data.msgContent;
        var body = data.body;

        //请求成功时,根据业务判断状态
        if (status === 200) {
          //console.log(11);
          resolve({
            data: body,
          });
        } else if (status === 300) {
          if (model) {
            Message.warning(msg);
          } else {
            setUserInfo(null);
            router.replace({ name: "login" });
            Message.warning(msg);
          }
        }
      })
      .catch(error => {
        //请求失败时,根据业务判断状态
        if (error.response) {
          let resError = error.response;
          let resCode = resError.status;
          let resMsg = error.message;
          // 判断是否是开发模式 开发模式调用本地模拟数据
          if (model) {
            let mockData = getMockData(JSON.stringify(options.url));
            resolve({
              data: mockData,
            });
          } else {
            Message.error("操作失败！错误原因 " + resMsg);
            reject({ code: resCode, msg: resMsg });
          }
        }
      });
  });
}
```

- 具体到某个模块的请求 —— list.js

```javascript
import * as api from "../api";
import fetch from "../common/fetch";

export function getList(data) {
  return fetch({
    url: api.FILE_LIST,
    method: "post",
    data,
  });
}
```

**75. nodemon——node 的热更新**

> [node 中的 express 框架，nodemon 设置修改代码后服务自动重启](https://blog.csdn.net/a419419/article/details/78831869)

- -g 安装 nodemon
- 当前根目录下配置`nodemon.json`

```json
{
  "restartable": "rs",
  "ignore": [".git", ".svn", "node_modules/**/node_modules"],
  "verbose": true,
  "execMap": {
    "js": "node --harmony"
  },
  "watch": [],
  "env": {
    "NODE_ENV": "development"
  },
  "ext": "js json"
}
```

- 配置项介绍

```html
restartable-设置重启模式 ignore-设置忽略文件 verbose-设置日志输出模式，true
详细模式 execMap-设置运行服务的后缀名与对应的命令 { “js”: “node –harmony” }
表示使用 nodemon 代替 node watch-监听哪些文件的变化，当变化的时候自动重启
ext-监控指定的后缀文件名
```

- 修改 app.js 文件，记得注稀最后一行的：module.exports = app;

```javascript
var debug = require("debug")("my-application"); // debug模块
app.set("port", process.env.PORT || 3000); // 设定监听端口

//启动监听
var server = app.listen(app.get("port"), function () {
  debug("Express server listening on port " + server.address().port);
});

//module.exports = app;//这是 4.x 默认的配置，分离了 app 模块,将它注释即可，上线时可以重新改回来
```

- 启动服务

```javascript
nodemon app.js
```

**75. js 触发 window 的 resize 事件**

```javascript
export const triggerResize = () => {
  if (document.createEvent) {
    var event = document.createEvent("HTMLEvents");
    event.initEvent("resize", true, true);
    window.dispatchEvent(event);
  } else if (document.createEventObject) {
    window.fireEvent("onresize");
  }
};
```

**76. 字节换算**

```javascript
export const bytesToSize = bytes => {
  if (bytes === 0) return "0 B";
  var k = 1000, // or 1024
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
};
```

**77. Vue 监听 store 中的 state**

```javascript
export default{
	data(){
		return {
			reloadStatus: this.$store.state.reloadStatus
		}
	},
	watch: {
		reloadStatus( cur, old ){
			console.log( cur ) // 无效
		}
	}
}

// 怎么办呢
// 可以使用computed

computed: {
	reloadStatus() {
		return this.$store.state.indexRefresh
	}
},

```

**78. Vue 使用 highcharts 的扩展**

- 最主要的是引入扩展包

```javascript
import Highcharts from "highcharts/highstock"; // 必须
import HighchartsMore from "highcharts/highcharts-more"; // 必须
import SolidGauge from "highcharts/modules/solid-gauge.js";
HighchartsMore(Highcharts);
SolidGauge(Highcharts);
```

```vue
<template>
  <div>
    <div id="highCharts" style="width: 400px; height: 300px;"></div>
  </div>
</template>

<script>
import Highcharts from "highcharts/highstock";
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge.js";
HighchartsMore(Highcharts);
SolidGauge(Highcharts);

Highcharts.setOptions({
  chart: {
    type: "solidgauge",
  },
  title: null,
  pane: {
    center: ["50%", "85%"],
    size: "140%",
    startAngle: -90,
    endAngle: 90,
    background: {
      backgroundColor:
        (Highcharts.theme && Highcharts.theme.background2) || "#EEE",
      innerRadius: "60%",
      outerRadius: "100%",
      shape: "arc",
    },
  },
  tooltip: {
    enabled: false,
  },
  yAxis: {
    stops: [
      [0.1, "#55BF3B"], // green
      [0.5, "#DDDF0D"], // yellow
      [0.9, "#DF5353"], // red
    ],
    lineWidth: 0,
    minorTickInterval: null,
    tickPixelInterval: 400,
    tickWidth: 0,
    title: {
      y: -70,
    },
    labels: {
      y: 16,
    },
  },
  plotOptions: {
    solidgauge: {
      dataLabels: {
        y: 5,
        borderWidth: 0,
        useHTML: true,
      },
    },
  },
});

export default {
  mounted() {
    this.init();
  },
  data() {
    return {};
  },
  methods: {
    init() {
      this.draw();
    },
    draw() {
      new Highcharts.chart("highCharts", {
        yAxis: {
          min: 0,
          max: 200,
          title: {
            text: "速度",
          },
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            name: "速度",
            data: [80],
            dataLabels: {
              format:
                '<div style="text-align:center"><span style="font-size:25px;color:' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                  "black") +
                '">{y}</span><br/>' +
                '<span style="font-size:12px;color:silver">km/h</span></div>',
            },
            tooltip: {
              valueSuffix: " km/h",
            },
          },
        ],
      });
    },
  },
};
</script>

<style lang="stylus"></style>
```

**78. 只期待后来的你能快乐 那就是后来的我想要的**

- 今天什么都没学，就只想说这么一句话。

**79. Vue 引入了公共样式的 style 少用 scoped**

- 如果引用了公共样式，公共样式同样会加 scoped 会造成重复代码

**80. echarts 的响应式**

- echart.resize()
- option.grid.containLabel // 这个参数非常棒

**81. addEventListener 的第三个参数已经是一个对象了，不再是简单的 true，false**

> [MDN-EventTarget.addEventListener()](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

**82. 简单的防抖写法**

- 节流是事件不再触发多少秒后触发回调函数
- 防抖是事件频繁触发中每多少秒触发一次回调函数

```javascript
// 简单的节流函数
function throttle(func, wait, mustRun) {
  var timeout,
    startTime = new Date();

  return function () {
    var context = this,
      args = arguments,
      curTime = new Date();

    clearTimeout(timeout);
    // 如果达到了规定的触发时间间隔，触发 handler
    if (curTime - startTime >= mustRun) {
      func.apply(context, args);
      startTime = curTime;
      // 没达到触发间隔，重新设定定时器
    } else {
      timeout = setTimeout(func, wait);
    }
  };
}
// 实际想绑定在 scroll 事件上的 handler
function realFunc() {
  console.log("Success");
}
// 采用了节流函数
window.addEventListener("scroll", throttle(realFunc, 500, 1000));
```

**83. 一个声明提前面试题**

```javascript
function Foo() {
    getName = function () { alert (1); };
    return this;
}
Foo.getName = function () { alert (2);};
Foo.prototype.getName = function () { alert (3);};
var getName = function () { alert (4);};
function getName() { alert (5);}

// 请写出以下输出结果：
Foo.getName();
getName(); // 声明提前
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();

作者：不肥的肥羊
链接：https://juejin.im/post/5b0562306fb9a07aaf3596c1
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

- 这道题的答案是：2、4、1、1、2、3、3。 -这里考察声明提前的题目在代码中已经标出，这里声明 getName 方法的两个语句：

```javascript
var getName = function () {
  alert(4);
};
function getName() {
  alert(5);
}
```

-实际上在解析的时候是这样的顺序：

```javascript
function getName() {
  alert(5);
}
var getName;
getName = function () {
  alert(4);
};
```

- 如果我们在代码中间再加两个断点：

```javascript
getName(); // 5
var getName = function () {
  alert(4);
};
getName(); // 4
function getName() {
  alert(5);
}
```

- 在第一次 getName 时，function 的声明和 var 的声明都被提前到了第一次 getName 的前面，而 getName 的赋值操作并不会提前，单纯使用 var 的声明也不会覆盖 function 所定义的变量，因此第一次 getName 输出的是 function 声明的 5；
  而第二次 getName 则是发生在赋值语句的后面，因此输出的结果是 4，所以实际代码的执行顺序是这样：

```javascript
function getName() {
  alert(5);
}
var getName;
getName(); // 5
getName = function () {
  alert(4);
};
getName(); // 4
```

**84. 数组方法的 32 场演唱会**

> 摘抄自 @大转转 FE

```html
来跟我一起唱 判断是不是数组，isArray最靠谱。 按照条件来判断，every/some给答案
是否包含此元素，includes最快速。 find/findIndex很相似，按条件给第一个值。
indexOf/lastIndexOf也很强，有没有来在哪忙。 from和of，都能用来生数组。
concat当红娘，数组结婚她帮忙。 filter瘦身有一套，不想要的都不要。
map整容有实力，改头换面出新意。 slice就像买切糕，想切哪来就下刀。
自力更生很重要，copyWithin自己搞。 fill就像填大坑，想往哪扔往哪扔。
搬山摸金四兄弟，pop、push、shift、unshift不难记。
造反其实很容易，reverse一下看好戏。 sort排序有技巧，能小大来能大小。
splice要认识，能插能删有本事。 forEach最熟悉，有人说它是万能滴。
keys、values、entries，遍历数组新方式。
算总账，不要慌，reduce、reduceRight帮你忙。
toString，join变字符，toLocaleString不常用。
当里个当，当里个当，数组32方法，猥琐发育不要浪，嘿！不要浪！
```

**85. Object 对象如果 key 是数字，会按照数字从小到大排列**

```javascript
const object3 = { 100: "a", 2: "b", 7: "c" };
console.log(object3);
// {2: "b", 7: "c", 100: "a"}
```

**86. Object.definePrototy 用法的一道题**

```javascript
var foo = (function () {
  var o = {
    a: 1,
    b: 2,
  };
  return function (key) {
    return o[key];
  };
})();
// 不改变以上函数  取出o的所有属性

Object.defineProperty(Object.prototype, "_getAll", {
  get() {
    return this;
  },
});
let obj = foo("_getAll");
// 避免污染
delete Object.prototype._getAll;
Object.keys(obj);
```

**87、 OS X 快捷键**

```html
control + a ：移到命令行首，HOME control + e ：移到命令行尾，End control + f
：按字符前移（右向） control + b ：按字符后移（左向） option + f
：按单词前移（右向） option + b ：按单词后移（左向） control + u
：从光标处删除至命令行首 control + k ：从光标处删除至命令行尾 control + w
：从光标处删除至字首等同于option + backspace option + d ：从光标处删除至字尾
control + l : Clean control + d ：删除光标处的字符 control + h
：删除光标前的字符 control + y ：粘贴至光标后 option + c
：从光标处更改为首字母大写的单词 option + u ：从光标处更改为全部大写的单词
option + l ：从光标处更改为全部小写的单词 control + t ：交换光标处和之前的字符
option + t ：交换光标处和之前的单词
```

**88. 一个简单的模板引擎**

```javascript
let data = {
  up: "运行了",
  Exited: "关闭了",
  month: "月",
  days: "天",
  hours: "小时",
  minutes: "分钟",
  secondes: "秒",
  ago: "",
  "Less than a second": "少于一秒",
  "About a minute": "大概一分钟",
};

var str = "系统{%up%}, 15{%days%}";
var regex = /\{%([^{]+)%\}/g;
var match = null;
while ((match = regex.exec(str))) {
  // console.log( match )
  match.index -= match[0].length;
  console.log(match[0]);
  str = str.replace(match[0], data[match[1]]);
  regex.lastIndex = 0;
}
console.log(str);
```

**89. 获取对象中所有的 id**

```javascript
let data = {"body":[{"icon":"fa fa-cloud","sort":5,"type":"PAGE","parentId":0,"isShow":true,"children":[{"icon":"fa fa-laptop","sort":1,"type":"PAGE","parentId":13,"isShow":true,"name":"主机信息","id":14,"href":"/server/resource"},{"icon":"fa fa-cubes","sort":2,"type":"PAGE","parentId":13,"isShow":true,"name":"容器服务","id":15,"href":"/server/container"},{"icon":"fa fa-database","sort":3,"type":"PAGE","parentId":13,"isShow":true,"name":"mysql数据库","id":16,"href":"/backup/mysqlFileList"},{"icon":"fa fa-database","sort":4,"type":"PAGE","parentId":13,"isShow":true,"name":"mongo数据库","id":17,"href":"/backup/mongoFileList"}],"name":"服务器管理","id":13,"href":"/server/resource"}],"msgCode":"ACTIVE","msgContent":"正常","status":200}

- 有这样一段数据 要拿出所有的id

function getAllId( data ){
    let str = '',
	regexp = /,"id":(\d+)(?=,)/g,
	matchStr = '',
	idArr = [];
    try {
	str = JSON.stringify( data );
    } catch (error) {}
    while(matchStr = regexp.exec( str )){
	idArr.push( matchStr[1] )
    }
    return idArr
}
```

**90. ajax 请求到的 blob 对象下载**

```javascript
/**
 * 下载传入的文件流
 * @param { Blob } blob 文件流
 * @param { String } file_name 生成的文件名称
 */
export const download_blob = (blob, file_name) => {
  return new Promise((resolve, reject) => {
    try {
      const BLOB = new Blob([blob]);
      if ("download" in document.createElement("a")) {
        // 非IE下载
        const elink = document.createElement("a");
        elink.download = file_name;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(BLOB);
        document.body.appendChild(elink);
        elink.click();
        // trigger 不触发下载 trigger( elink, 'click' )
        // 删除引用 释放URL 对象
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
        // IE10+下载
      } else {
        navigator.msSaveBlob(BLOB, file_name);
      }
      resolve({ status: "success", content: "" });
    } catch (error) {
      reject({ status: "error", content: error });
    }
  });
};

axios({})
  .then(res => {
    download_blob(res, Date.parse(new Date()) + ".xls")
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });
```

**91. 前端下载文件常见的两种方式**

- ajax

```javascript
// 请求的responsetype设置为 responseType: 'blob'
// 剩下的参考90那条
```

- form 表单下载
  > 参考 [隐藏 form 表单下载文件](https://blog.csdn.net/java_trainee/article/details/73647806)

```javascript
function downloadFile(actoinURL,filePath,fileName){
<span style="white-space:pre;"> </span>var form = $("<form>");
    $('body').append(form);
        form.attr('style','display:none');
        form.attr('target','');
        form.attr('method','post');
        form.attr('action',actoinURL);//下载文件的请求路径


        var input1 = $('<input>');
        input1.attr('type','hidden');
        input1.attr('name','filePath');
        input1.attr('value',filePath);
        form.append(input1);
        var input2 = $('<input>');
        input2.attr('type','hidden');
        input2.attr('name','fileName');
        input2.attr('value',fileName);
        form.append(input2);

        form.submit();

    };
```

**92. 网页实现下载功能、 说「ajax 下载文件」是否准确**

- 网页实现下载功能，有两个下载过程
- 第一个是 JS 吧远程服务端的文件「下载」装载到浏览器内存
- 第二个是吧浏览器内存里的字符型文件「下载」到用户的 PC 硬盘上
- 第一个过程几乎所有浏览器都能实现，第二个则不一定
- 另外：ajax 起的作用仅仅是第一个过程內，而真正的下载是第二个过程，所以说「ajax 下载文件」是不准确的

**93. 使用开源库或者框架的时候，要小心了，可能被人嵌入挖矿代码！**

**94. vue-cli3.0 webpack 插件设置**

```javascript
module.exports = {
	configureWebpack: {
		plugins: {
			new XXX()
		}
	}
}
```

**95. 切记切记项目开发完后自己多测试**

- 多浏览器打开看兼容
- 多测试业务逻辑
- PC 站网页的分辨率 1920 1377 等 都要兼容照顾

**96. 善用 webpack 得 alias**

- 虽然有点晚了，但是不要再写那么麻烦的`../../../`了
- 一个 alias 变量多么方便

**97. 为何不尝试学习下 express 呢**

- 前后端分离的项目中，你完全可以使用 express 等来模拟数据
- 可以模拟真实环境，比如利用延迟达到网络不好的异常检测，分页查询数据，不同的值返回不同的数据……
- 很简单的，不需要查询数据库！认真脸！不需要查询数据库！你直接返回 json 字符串就行了

**99. OS 系统是真的好看**

- 平心而论，UI 效果比 Windows 确实好，好友推荐给我了一款软件叫`mactype`，用来在 Windows 上做类似 OS 的美化

**100. 如何不写域名的情况下修改端口**

```javascript
io.connect("http://192.168.1.122:8080");
// 改成我们自己的
io.connect(":9101"); // http://localhost:9101
```

**101. Vue Highcharts 双饼图需要引入的**

```javascript
// 只有这一个就好啦
import Highcharts from "highcharts";
```

**102. linear-gradient 可以用在很多地方的**

```css
.box {
  height: 400px;
  width: 400px;
  border: 30px solid transparent;
  border-image: linear-gradient(45deg, red, blue) 10%;
}
```

**103. 禁止缩放的时候（meta）部分浏览器就已经解决 300 毫秒延迟的问题了**

> [移动端点击 300ms 延迟问题和解决](https://blog.csdn.net/qq_34986769/article/details/62046696)

**104. VsCode 配置 eslint 和 prettier 保存格式化代码**

```json
{
  "prettier.eslintIntegration": true,
  "eslint.autoFixOnSave": true,
  "editor.formatOnSave": true
}
```

**105. 请用 JS 计算 1-10000 之间有几个零**

```javascript
let arr = [];
for (let i = 1, l = 10000; i <= l; i++) {
  arr.push(i);
}
arr.join().match(/0/g); // 2893
```

**106. 一个比较全面的前端面试题集合**

- [前端面试题（1）Html](https://segmentfault.com/a/1190000014994737)
- [前端面试题（2）CSS](https://segmentfault.com/a/1190000014994892)
- [前端面试题（3）JavaScript 现代化开发](https://segmentfault.com/a/1190000015150912)
- [前端面试题（4）JavaScript 知识点](https://segmentfault.com/a/1190000015162142)
- [前端面试题（5）安全性能优化](https://segmentfault.com/a/1190000015275832)
- [前端面试题（6）HTML 语义化标签](https://segmentfault.com/a/1190000013901244)
- [前端面试题（7）href url src](https://segmentfault.com/a/1190000013845173)

**107. 今天踩得 IE 的几个坑**

- IE 没有`window.scrollY` 使用 document 来获取滚动高度

```javascript
export const getScrollTop = function () {
  let scrollTop = 0;
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop;
  } else if (document.body) {
    scrollTop = document.body.scrollTop;
  }
  return scrollTop;
};
```

- IE 的 new Date("2018-05-06 00:00:00")报错 要改成斜线
- IE 的 Date.parse("2018-05-06 00:00:00")报错 要改成斜线

**108. promiseAll 使用的时候也是要多考虑的**

- 比如我有三个请求 使用了 promiseAll 之后 其中一个请求报 500 了 整个 promiseall 的回调会走向 catch 其他正确的不再执行了

**109. transform 和 z-index 的关系 了解下**

- 今天做项目再次遇到了 z-index 失效的问题 上次是因为 animation 这次是因为 transform
- [z-index 和 transform,你真的了解吗？](https://blog.csdn.net/fanhu6816/article/details/52523815)

**110. IOS 系统下浏览器滚动漏黑底 别担心 iNoBounce 来帮您**

> [iNoBounce](https://github.com/lazd/iNoBounce)

- 亲测可行

```html
<!DOCTYPE html>
<html>
  <head>
    <title>iNoBounce Example - Full</title>
    <!-- Ensure correct presentation on iOS -->
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <style>
      body,
      html {
        height: 100%;
        margin: 0;
        /* Fill the window */
      }

      .scrollable {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }

      ul {
        width: 100%;
        height: 100%;
        /* Fill the window */
        margin: 0;
        padding: 0;
        list-style: none;
        overflow-x: auto;
      }
    </style>
    <!-- iNoBounce to prevent bouncing -->
    <script src="../inobounce.js"></script>
  </head>

  <body>
    <ul class="list scrollable">
      <li>List Item 1</li>
      <li>List Item 2</li>
      <li>List Item 3</li>
      更多li。。。
    </ul>
  </body>
</html>
```

**111. 再次强调不要怕抽离麻烦，你会很感激今天的抽离**

- 这两天接口更改，项目合并，又体会到了抽离的好处，不用频繁的更改真的爽。

**112. 平铺多维数组**

```javascript
function flattenArray(arr) {
  const flattened = [].concat(...arr);
  return flattened.some(item => Array.isArray(item))
    ? flattenArray(flattened)
    : flattened;
}
const arr = [11, [22, 33], [44, [55, 66, [77, [88]], 99]]];
const flatArr = flattenArray(arr);
//=> [11, 22, 33, 44, 55, 66, 77, 88, 99]
```

**112. compositionstart 和 compositionend**

- 今天遇到一个场景，共有六个 inpu，点删除按键删空这个之后，让上一个 input 聚焦
- 于是遇到了一个问题
- 搜狗输入法输入的状态下，如果这个 input 不是第一个而且是空的，在没有输入进去的情况下，按删除键取到的\$val 是空的，会造成聚焦上一个 input，从而再按删除的时候，删除上一个 input 的值，导致光标乱跳
- 通过 composition 的状态可以确定用户是否输入完毕，之后再进行之后的逻辑

```vue
<template>
  <div class="seria-item" v-for="(item, index) in seriaNums" :key="index">
    <input
      v-model.trim="seriaNums[index]"
      class="ht-input small seria"
      ref="seriaInput"
      @compositionstart="composition = false"
      @compositionend="composition = true"
      @keyup.delete="seriaDelete($event, index)"
      @input="seriaChange($event, index)"
    />
    <span v-if="index < 5"></span>
  </div>
</template>
<script>
export default{
	return{
		data(){
			composition: false
		}
	},
	methods: {
		seriaDelete($event, index) {
            const $val = this.seriaNums[index];
            if (this.composition) {
                if ($val.length <= 0) {
                    this.$refs &&
                        this.$refs.seriaInput &&
                        this.$refs.seriaInput[index - 1] &&
                        this.$refs.seriaInput[index - 1].focus();
                }
            }
        },
	}
}
</script>
```

**113. 地图如何做到区域点聚合？**

> [百度地图 省市区县 信息展示](https://blog.csdn.net/liuyuqin1991/article/details/78052262)

> [我自己亲测可跑的 demo 没图片，可以自己随便找几个图片](https://github.com/542154968/Development-attention-point/blob/master/webpack3.x%E7%9A%84%E4%B8%80%E4%BA%9Bdemo/%E7%99%BE%E5%BA%A6%E5%9C%B0%E5%9B%BE%E6%A0%B9%E6%8D%AE%E5%8C%BA%E5%9F%9F%E8%81%9A%E5%90%88%E7%82%B9%E7%9A%84demo.md)

- 是 根据地图的缩放 zoom 值 分级 （省 市 区/ 乡镇 街道）
- 根据这个值 来获得后端返回的每个级别的数据 然后写个自定义的标注在该级别点的坐标上
- 一二三级都是统计数据 第四级是详细的点数据

**114. 小程序数据请求的注意点（待验证）**

> [《腾讯游戏人生》微信小程序开发总结](https://segmentfault.com/a/1190000015393890)

- 请求不支持设置 header 的 refer；
- 请求 url 不允许带自定义端口，只能是默认 80 端口；
- 请求 content-type 默认为'application/json'，如需用 POST 请求则需改为'application/x-www-form-urlencoded'或'multipart/form-data'，否则后台请求里得不到 post 数据；
- 后台接收请求 php 里最好用 json_decode（file_get_contents("php://input")）方式获取完整的 post 数据，否则如果传递较为复杂的多层 post 数据结构体，直接用\$\_POST 等可能导致获取数据格式异常或失败

**115. 在移动端遇到的一个 VUE 数据渲染的问题**

- 场景是一个 table 列表，分页
- 遇到的问题是 第一页的第一条的 mobile 手机号数据，再跳转第二页后，仍保留。PC 上没有这个问题
- 解决方法是，加个 setTimeout，等待 VUE 的数据切换完成之后再渲染

**116. input 是没有伪类元素的哦**

**117. 如果后端返回你的日期对象是这样的 2018-05-08T01:16:11.000+0000**

- 注意了 这个时区不是我们这里的时区，会造成时间偏差 需要先`new Date()`一下这个时间，之后再转换成你要的格式。

**118. -apple-system, BlinkMacSystemFont,**

- -apple-system 是在以 WebKit 为内核的浏览器（如 Safari）中，调用 Apple（苹果公司）系统（iOS, macOS, watchOS, tvOS）中默认字体（现在一般情况下，英文是 San Francisco，中文是苹方）
- BlinkMacSystemFont 是在 Chrome 中实现调用 Apple 的系统字体

**119. UglifyJsPlugin 报错？**

- 看看是哪个文件夹的 es6 没有被 babel 转义 一包含就有效

**120. JS 动画帧与速度的关系**

- 我的天啊 我迷了好久 今天终于想透彻了
- 就拿匀速运动举例子

```javascript
// 首先知道 距离 x 时间 ms
// 求速度  v = x / ms;
// setTinterval 最好是 16.7毫秒执行一次
// 以前就理解不了这个16.7毫秒和速度时间的关系
// 换个角度想一下 16.7毫秒动一次 那每次动的距离不就是 16.7 * 每毫秒动的距离吗
// 关系就出来了
const v = x / ms,
  onceMoveLong = v * 16.7;
// 移动距离
let s = 0;

setInterval(function () {
  // 避免计算不精确的小数问题
  s = ~~s + onceMoveloNG;
}, 16.7);
```

**121. vue style scoped 想对设置了 scoped 的子组件里的元素进行控制可以使用`>>>`或者`deep`**

```vue
<template>
  <div id="app">
    <gHeader></gHeader>
  </div>
</template>

<style lang="css" scoped>
.gHeader /deep/ .name {
  //第一种写法
  color: red;
}
.gHeader >>> .name {
  //二种写法
  color: red;
}
</style>
```

- 一些预处理程序例如 sass 不能解析>>>属性，这种情况下可以用 deep，它是>>>的别名，工作原理相同。
- 使用 v-html 动态创建的 DOM 内容，不受设置 scoped 的样式影响，但你依然可以使用深选择器进行控制

**122. 如何不通过控制台编辑 DOM 就能修改网页？**

> [document.designMode](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/designMode)

- `document.designMode`了解下

**123. vue mixins 太好用了**

- 简单来讲就是合并 vue 的代码的 可以把 script 中的 data、methods、生命周期等抽离出去
- 就像抽离公共方法一样

**124. vue directives 好用**

- 我觉得它更大的用处是分离数据渲染和 UI 渲染
- 场景是 进度条 宽度是靠 width 的 css 来控制的 比如现在宽度是 20% 然后我刷新数据之后，因为这个值是 20% 再次取得的数据还是 20% 导致宽度变化的 css 动画就不再触发了
- 通过自定义指令 分割了 UI 渲染和数据渲染部分 简化了代码量 更加清晰

```vue
export default { directives: { frame: { bind(el, binding, vNode) {
el.style.width = `0%`; setTimeout(_ => { el.style.width = `${binding.value}%`;
}, 20); }, update(el, binding, vNode) { el.style.width = `0%`; setTimeout(_ => {
el.style.width = `${binding.value}%`; }, 100); } } }, }
```

**125. 今天遇到的一个下往上找到所有的父级 Id 的场景问题**

- 由于 element 的 tree 组件没全选的情况下，父级的 Id 取不到，所以有了从下往上找到所有的父级 Id 的场景需求
- 受 @大狗蛋 的指导，合理使用`Map`，较为优雅解决问题

```javascript
const arr = [
  {
    parentId: 0,
    id: 1,
    children: [
      {
        parentId: 1,
        id: 2,
        children: [
          {
            parentId: 2,
            id: 3,
          },
        ],
      },
    ],
  },
  {
    parentId: 0,
    id: 4,
    children: [
      {
        parentId: 4,
        id: 5,
        children: [
          {
            parentId: 5,
            id: 6,
          },
        ],
      },
    ],
  },
];

let m = new Map();
let iKnowIds = [3, 6];

function arr2Map(arr) {
  for (let i = 0, l = arr.length; i < l; i++) {
    let item = arr[i];
    m.set(item.id, item.parentId);
    if (Array.isArray(item.children) && item.children.length > 0) {
      arr2Map(item.children);
    }
  }
}
// 先变成map结构
arr2Map(arr);

function deepMap(key, allIds) {
  let parentId = m.get(key);
  if (parentId !== 0) {
    allIds.push(parentId);
    deepMap(parentId, allIds);
  }
}

function getIds(key) {
  let allIds = [];
  deepMap(key, allIds);
  console.log(allIds);
}
```

**126. vue 引入百度地图的两种方式**

- 方式一

```javascript
1. index.html 中引入script
<script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak=HWzRuiQHQj1QrMifGGkXXXXXXXXX"></script>

2. webpack.base.conf.js中
module.exports = {
    entry: {
        app: "./src/main.js",
        vendor: ["vue", "vuex", "vue-router", "element-ui"] //第三方库和框架
    },
    externals: {
    // 扩展外部
        BMap: "BMap"
    },
}

3. 要使用的组件中
// const BMap = require('BMap');
import BMap from require('BMap');

4. 缺点
如果百度的链接出现延迟 500等问题 会导致整个项目出现问题
```

- 方式二

```vue
export default { mounted(){ this.MP().then( BMap => { this.initMap( BMap ) } )
}, methods: { MP() { return new Promise(function(resolve, reject) { window.init
= function() { resolve(BMap); }; var script = document.createElement("script");
script.type = "text/javascript"; // 注意这里的callback script.src =
"http://api.map.baidu.com/api?v=3.0&ak=HWzRuiQHQj1QrMifGGxxxx&callback=init";
script.onerror = reject; document.head.appendChild(script); }); }, initMap(Map){
// 初始化地图 } } } 缺点 可能是我引入方式有问题 每次都会增加script标签
造成重复的百度地图的Map对象加入
```

**127. echarts、HighCharts 按需加载**

- echarts

```javascript
const echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
require("echarts/lib/chart/bar");
require("echarts/lib/chart/pie");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
```

- Highcharts（这个商业化要收费）

```javascript
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge.js";
HighchartsMore(Highcharts);
SolidGauge(Highcharts);
```

- 终极版真正按需加载 懒加载
  > 场景是滚动到某个距离 加载 echarts

```vue
<script type="text/ecmascript-6">
let echarts = null;

export default {
    data() {
        return {

        };
    },
    mounted() {
        this.addeventWindow();
        this.handleScroll();
    },
    methods: {
        handleScroll() {
            window.addEventListener("scroll", this.drawAll);
        },
        drawAll(event) {
            let _this = this;
            clearTimeout(_this.load_all_timeId);
            _this.load_all_timeId = setTimeout(function() {
                if (
                    _this.$refs.EError.offsetTop <=
                    getScrollTop() + window.innerHeight - 100
                ) {
                    _this.syncLoadEcharts().then( res => {
                        _this.load_all_data();
                        _this.isLoaded = true;
                        window.removeEventListener("scroll", _this.drawAll);
                    })
                }
            }, 200);
        },
        syncLoadEcharts(){
            return new Promise( (resolve, reject) => {
                require.ensure([], function() {
                    echarts = require('echarts/lib/echarts');
                    require('echarts/lib/chart/line');
                    require('echarts/lib/chart/bar');
                    require('echarts/lib/chart/pie');
                    // 引入提示框和标题组件
                    require('echarts/lib/component/tooltip');
                    require('echarts/lib/component/title');
                    resolve('success')
                }, 'syncEcharts')
            })
        },

        // 画终端分配
        drawDistribution() {
            this.distribution_chart
                ? this.distribution_chart.clear()
                : (this.distribution_chart = echarts.init(
                      document.getElementById("distribution-chart")
                  ));
            this.distribution_chart.setOption(this.distribution_option, true);
        },
        // 以下全是响应式改变的逻辑
        addeventWindow() {
            window.addEventListener("resize", this.resizeIndexCharts);
        },
        resizeIndexCharts() {
            clearTimeout(this.resizeTimeId);
            this.resizeTimeId = setTimeout(() => {
                this.resetSize();
            }, 200);
        },
        resetSize() {
            this.$nextTick(() => {
                this.terminal_chart && this.terminal_chart.resize();
                this.error_msg_chart && this.error_msg_chart.resize();
                this.distribution_chart && this.distribution_chart.resize();
            });
        }
    },
    beforeDestroy() {
        echarts = null;
        window.removeEventListener("resize", this.resizeIndexCharts);
        window.removeEventListener("scroll", this.drawAll);
    }
};
</script>
```

**128. JS 触发事件**

```javascript
// 创建事件.
let event = document.createEvent("HTMLEvents");
// 初始化一个点击事件，可以冒泡，无法被取消
event.initEvent("click", true, false);
let elm = document.getElementById("wq");
// 设置事件监听.
elm.addEventListener(
  "click",
  e => {
    console.log(e);
  },
  false
);
// 触发事件监听
elm.dispatchEvent(event);
```

**129. 优化重排重绘**

- 重排与重绘的代价非常昂贵。如果操作需要进行多次重排与重绘，建议先让元素脱离文档流，处理完毕后再让元素回归文档流，这样浏览器只会进行两次重排与重绘（脱离时和回归时）。

**130. VsCode 保存格式化代码的配置和我用的插件**

> [参考这里](https://blog.csdn.net/weixin_36222137/article/details/80040758)

- 真正起作用的其实还是`vetur`
- `eslint`，`prettier-Code formatter`， `vetur` 这三个插件必须安装，其他的插件根据自己的习惯

```json
{
  "workbench.colorTheme": "Ysgrifennwr",
  "workbench.iconTheme": "vscode-icons",
  "search.followSymlinks": false,
  "prettier.tabWidth": 4,
  "editor.lineNumbers": "on", //开启行数提示
  "editor.quickSuggestions": {
    //开启自动显示建议
    "other": true,
    "comments": true,
    "strings": true
  },
  "editor.formatOnSave": true, //每次保存自动格式化
  "eslint.autoFixOnSave": true, // 每次保存的时候将代码按eslint格式进行修复
  "prettier.eslintIntegration": true, //让prettier使用eslint的代码格式进行校验
  "vetur.format.defaultFormatter.html": "js-beautify-html", //格式化.vue中html
  "vetur.format.defaultFormatter.js": "vscode-typescript", //让vue中的js按编辑器自带的ts格式进行格式化
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      "wrap_attributes": "force" //属性强制折行不一定对齐
    }
  },
  "eslint.validate": [
    //开启对.vue文件中错误的检查
    "javascript",
    "javascriptreact",
    {
      "language": "html",
      "autoFix": true
    },
    {
      "language": "vue",
      "autoFix": true
    }
  ]
}
```

- 我用的插件

```html
Auto Close Tag Auto Rename Tag canvas-snippets Chinese Class autocomplete for
HTML Color Info Css Peek Document This Eslint HTML Boilerplate HTML CSS Support
HTML Snippets HTMLHint htmltagwrap Image Preview JavaScript (ES6) snippets
language-stylus Live server Node.js Modules Intellisense Prettier formatter SCSS
interlliSense stylus vetur vscode-faker vscode-icons vue 2 Snippets Vue Peek Vue
VSCode Snippets VueHelper Ysgrifennwr Color Theme // 最爱的猪蹄
```

**130. IE 中 left 等不支持 unset 默认 auto**

> 这几天 github 卡爆了 更新不上去

**131. async 的 await 要接收一个 promise 对象哦**

**132. 不要忘了 let 可以解决异步循环 i 的问题**

**133. scrollTo scroolTop**

- 火狐 谷歌的 DOM 可以有 scrollTo()
- 而 IE 只有 window 有 scrollTo() DOM 要用 scrollTop

**134. IE11 中的 overflow**

- 如果你设置了 overflow-x： hidden overflow-y: auto
- 你再设置 overfow: hidden 的时候是无效的
- 你要设置 overflow-x： hidden overflow-y： hidden

**135. 超详细的数组方法总结 给力！**
[JavaScript 数组的十八般武艺](https://segmentfault.com/a/1190000015908109)

**136. css 小技巧之改变 png 图片的颜色**

> [不定期更新的 CSS 奇淫技巧](https://juejin.im/post/5b607a0b6fb9a04fd260aa70)

- 就是通过 filter 属性啦

```html
<style>
  .icon-color {
    display: inline-block;
    width: 144px;
    height: 144px;
    background: url("https://user-gold-cdn.xitu.io/2018/7/31/164f0e6745afe2ba?w=144&h=144&f=png&s=2780")
      no-repeat center / cover;
    overflow: hidden;
  }
  .icon-color:after {
    content: "";
    display: block;
    height: 100%;
    transform: translateX(-100%);
    background: inherit;
    filter: drop-shadow(144px 0 0 #42b983); // 需要修改的颜色值
  }
</style>

<i class="icon-color"></i>
```

**137. form 表单中只有一个 input 输入框时**

- form 表单中只有一个 input 输入框时， `W3C`规定会触发提交事件，需要组织表单的提交
- vue 中 element-ui 中使用 `@submit.native.prevent`阻止提交

**138. 使用 form 表单的一些坑**

- 生效就是触发提交
- 如果表单里有一个 type=”submit”的按钮，回车键生效。
- 如果表单里只有一个 type=”text”的 input，不管按钮是什么 type，回车键生效。
- 如果按钮不是用 input，而是用 button，并且没有加 type，IE 下默认为 type=button，FX 默认为 type=submit。
- 其他表单元素如 textarea、select 不影响，radio checkbox 不影响触发规则，但本身在 FX 下会响应回车键，在 IE 下不响应。
- type=”image”的 input，效果等同于 type=”submit”，不知道为什么会设计这样一种 type，不推荐使用，应该用 CSS 添加背景图合适些
-

```javascript
// 我在一个form表单中  写了个没有type的button  当 inupt 按回车时  触发了这个button的click事件  把这个 button 声明为type=button就行了
```

**139. 正确监听退出全屏的姿势**

- 不要用 windows 的 resize 事件 当浏览器 F11 全屏后，用户按着 esc 关闭全屏，resize 事件是没法监听到的。

```javascript
document.addEventListener("fullscreenchange", toggleChange);
document.addEventListener("webkitfullscreenchange", toggleChange);
document.addEventListener("mozfullscreenchange", toggleChange);
document.addEventListener("MSFullscreenChange", toggleChange);

function toggleChange() {
  console.log("magic");
}
```

**140. 相同的代码打包到一个 chunk 中**

- webpack 会合并相同的代码 减少我们的包的体积
- 首屏可以使用懒加载去加载组件和插件 利用 chunk 分割

**141. vue 中监听鼠标滚轮用`@wheel`指令**

**142. 如何判断文字溢出（DOM 溢出同理）了**

- 当前 dom 的 `scrollWidth` 和 `offsetWidth` 做比较

**143. 当对象中的 key 为数字时，会自动按着从小到大的顺序排序**

- 当有人说 Map 结构比 Object 结构好的时候，你就可以拿这个场景告诉他 并不一定哦

**144. @vue/cli（vue-cli3）中含有 TypeScript 开箱即用 非常方便**

- 拥抱新 cli 以下是一个小 demo
- Home.vue

```vue
<template>
  <div class="home">
    <HelloWorld
      msg="Welcome to Your Vue.js + TypeScript App"
      :num="6666"
      @reset="resetMsg"
    />
    <h1 @click="handleClick($event, '666')">{{ computedMsg }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import test from "./test";

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  private msg: string = "Hello, World!";

  get computedMsg(): string {
    return this.msg + "7777";
  }

  beforeCreate() {
    test.$alert("haha");
  }

  handleClick(event: object, name: string) {
    this.msg = "666";
    // console.log(event, name);
  }

  resetMsg(data: any) {
    console.log(data, "父组件收到啦");
  }
}
</script>
```

- HelloWorld.vue

```vue
<template>
  <div class="hello" @click="resetMsg({ name: 'lqk' })">
    {{ num }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
  @Prop({ default: 6, type: Number })
  private num!: number;
  count: number = 0;

  @Emit("reset")
  resetMsg(data: object) {
    console.log("父组件收到没");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
```

**145. 小程序云开发（数据库）开始公测了**

**146. 百度地图和页面滚动的一个场景**

- 需求： 鼠标滚轮在百度地图上滚动时，页面不随之滚动
- 问题：

1.  最开始使用的是鼠标进入父元素（此处为`.content`）时，`.content`设置为`overflow:hidden`
2.  鼠标离开`.content`时，`.content`设置为`overflow:auto`
3.  这种做法能满足需求 但是会有抖动的问题
4.  后来发现了一个更大的问题 快速在百度地图上滚动滚轮的后 再次让`.content`设置为`overflow:auto`，虽然滚动条还在，但是滚动失效了！！！

- 解决方案

1.  换了种思路 鼠标进入`.content`的时候，让`document`监听`mousewheel`和`DOMMouseScroll`事件 并阻止默认事件
2.  鼠标移除`.content`的时候移除`mousewheel`和`DOMMouseScroll`的事件监听
3.  很完美 不会有抖动的问题也不会无法滚动了

```javascript
methods: {
   autoHtml () {
       document.removeEventListener('mousewheel', this.stopWheel)
       document.removeEventListener('DOMMouseScroll', this.stopWheel)
   },
stopWheel (event) {
       event.preventDefault()
   },
hiddenHtml () {
	document.addEventListener('mousewheel', this.stopWheel)
	document.addEventListener('DOMMouseScroll', this.stopWheel)
},
}
```

**147. echarts 时间轴的图数据一定要按着顺序来排列 不然画出的图可能会有问题**

**148. 写某个模块的时候尽量想全面点 比如没数据怎么展示**

**149. webpack 引入 min.css 的时候要当心**

- 我自己写的一个动画 被 webpack 打包后变成了 `@keyframes a`
- 然后我引入的有一个`css`文件，它也经过压缩处理了 也有一个 `@keyframes a`
- 然后就冲突了
- 后来更换了没压缩的`css`文件引入进来了 `webpack`也会压缩的就是不会别名处理了

**150. a == 1 && a == 2 && a == 3 成立**

> [从 (a==1&&a==2&&a==3) 成立中看 javascript 的隐式类型转换](https://yq.aliyun.com/articles/399499) 看这篇文章
> [你所忽略的 js 隐式转换](https://juejin.im/post/5a7172d9f265da3e3245cbca)

- 方法 1

```javascript
var a = {
  i: 1,
  toString() {
    return a.i, a.i++;
  },
};
a == 1 && a == 2 && a == 3; // true
```

- 原理

1. 符合对象类型再喝基础值类型进行表达式操作时，会基于“场景”自动调用`toString`或是`valueOf`方法，以最为'恰当'的方式，自动完成表达式的计算
2. 全等表达式会比较数据类型，符合对象类型不会进行隐式转换，即不执行`toString`或`valueOf`方法直接参与比较计算

- 方法 2

```javascript
a = [1, 2, 3];
a.join = a.shift;
a == 1 && a == 2 && a == 3;
```

- 更奇葩的

```javascript
var aﾠ = 1;
var a = 2;
var ﾠa = 3;
if (aﾠ == 1 && a == 2 && ﾠa == 3) {
  console.log("Why hello there!");
}
// Why hello there!
```

**151. keep-alive 和 beforeDestory**

- 当组件使用`keep-alive`的时候，组件的生命周期`beforeDestory`不再生效，应使用`deactivated`或者`beforeRouterLeave`代替

**152. 数据驱动慎用清空列表(优化小细节)**

- 场景介绍

```javascript
// 列表页 每次获取新数据清空列表
this.list = [];
this.loadData();
```

- 造成的影响

```html
如果设备比较卡 或者网络比较慢 会造成列表页空白或显示暂无数据（看你交互方式）
用户体验不好 看起来一闪一闪的
```

- 我的解决办法 -> 请求完毕后咋成功回调里直接覆盖数据

```javascript
loadData().then(res => {
  Array.isArray(res.contentList) && (this.list = res.contentList);
});
```

**153. webpack 通过命令行去设置不同的请求接口**

```json
{
  "scripts": {
    "dev": "node build/dev-server.js",
    "xia": "node build/dev-server.js",
    "me": "node build/dev-server.js",
    "niu": "node build/dev-server.js",
    "build": "node build/build.js",
    "lint": "eslint --ext .js,.vue src",
    "mock": "babel-node build/mock-server.js --presets es2015,stage-0",
    "mockdev": "npm run dev & npm run mock"
  }
}
```

```javascript
// config/index.js
let HOST = "http://192.168.1.112:9000";
// 1
// const HOST = "http://192.168.1.63:9000";
// 2
// const HOST = 'http://192.168.1.59:9000'
// 测试服务器
// const HOST = 'http://192.168.1.112:9000'
// 这个路由是本地服务器路由
// const HOST = 'http://localhost:3001'

// packagejson里面有script里的标识 判断启用哪个接口去对接
const ENVIRONMENT = process.env.npm_lifecycle_event;

if (ENVIRONMENT.indexOf("xia") > -1) {
  HOST = "http://192.168.1.59:9000";
} else if (ENVIRONMENT.indexOf("niu") > -1) {
  HOST = "http://192.168.1.63:9000";
} else if (ENVIRONMENT.indexOf("me") > -1) {
  HOST = "http://localhost:3001";
}
```

**154. Object.freeze 提升性能**

- 由于 `Object.freeze()` 会把对象冻结，所以比较适合展示类的场景，如果你的数据属性需要改变，可以重新替换成一个新的 `Object.freeze()` 的对象。

**155. 多行文字文字中间出现不对齐**

```css
word-break: break-all;
text-align: left;
```

**156.vueli3 的配置文件另一种写法**

```javascript
configureWebpack: confing => {
  config.resolve = {
    extensions: [".js", ".vue", ".json", ".css"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src"),
    },
  };
};
```

**157. JS 中字符字节的问题**

> 摘自 [ECMAScript 6 入门——字符串的扩展](http://es6.ruanyifeng.com/#docs/string)

- JavaScript 内部，字符以 UTF-16 的格式储存，每个字符固定为 2 个字节。对于那些需要 4 个字节储存的字符（Unicode 码点大于 0xFFFF 的字符），JavaScript 会认为它们是两个字符。

```javascript
var s = "𠮷";

s.length; // 2
s.charAt(0); // ''
s.charAt(1); // ''
s.charCodeAt(0); // 55362
s.charCodeAt(1); // 57271
```

**158. 日期替换**

```javascript
let str = "2018-09-19 00:00:00";
str.replace(/(\d{4})-(\d{2})-(\d{2})\s\d{2}\:\d{2}\:\d{2}/g, "$1年$2月$3日");
str.replace(/(.+?)\-(.+?)\-(\d{2}).+/, "$1年$2月$3日");
// "2018年09月19日"
```

**159. git 修改仓库地址**

> 迁移仓库地址也是这样

- 方法有三种：
- 修改命令

```git
git remote set-url origin [url]
例如：git remote set-url origin gitlab@gitlab.chumob.com:php/hasoffer.git
```

- 先删后加

```git
git remote rm origin
git remote add origin [url]
```

- 直接修改 config 文件

**160. 一个比较显眼的交互动画曲线**

- 动画曲线是有回弹效果的

```css
cubic-bezier(0.3, 0, 0.2, 2)
```

**161. element-ui render select**

```javascript
typeRenderFuc (h, { column, $index }) {
            const $this = this
            return h(
                'el-select',
                {
                    attrs: {
                        clearable: true,
                        placeholder: '请选择类型',
                        value: $this.searchBody.type
                    },
                    on: {
					// 竟然是input 触发的改变。。。
                        input (v) {
                            console.log(v)
                        }
                    }
                },
                [this.getTypeListDom(h)]
            )
        },
        getTypeListDom (h) {
            let arr = []
            this.typeList.forEach((v, k) => {
                arr.push(
                    h(
                        'el-option',
                        {
                            attrs: {
                                key: k,
                                label: v.label,
                                value: v.value
                            },
                            on: {
                                click (e) {
                                    console.log(e)
                                }
                            }
                        }

                    )
                )
            })
            return arr
        },
```

**162. rem 导致 table 的 border 不见**

```stylus
getBorder() {
    content: '';
    display: block;
    position: absolute;
    left: 0%;
    top: 0%;
    width: 200%;
    height: 200%;
    border: 2px solid #DFDFDF;
    transform-origin: 0 0;
    transform: scale(0.5);
}
table {
        border-collapse: collapse;
        width: 100%;
        font-size: 24px;
        position: relative;

        &:after {
            getBorder();
            border-left: none;
            border-bottom: none;
        }

        td {
            height: 56px;
            padding: 0 10px;
            vertical-align: middle;
            position: relative;

            &::after {
                getBorder();
                border-top: none;
                border-right: none;
            }
        }
    }
```

**163. vscode CPU 占用率 100%**

- 干掉 `SCSS IntelliSense`这个插件！！！

**164. 动态切换 video，等 audio 标签的 src 时 一定要通过 dom 添加的方式去切换， 然后再 play 直接 play 貌似也行**

**165. 少用`overflow:scroll`**

- PC 百分百有滚动条
- 移动端有部分机型会出现滚动条

**166. 阿里云服务器配置过程**

1. 下载一个 putty
2. 安装后配置 输入主机公有 IP 端口 22（linux 的 3389 是 windows） ssh 确定
3. 输入你的账号密码 然后安装宝塔 `yum install -y wget && wget -O install.sh http://download.bt.cn/install/install.sh && sh install.sh`
4. 安装完后会有账号密码 记下就好 然后复制链接到网址里打开
5. 配置的有 Apache 我们可以使用它代理 node `https://blog.csdn.net/gaoxuaiguoyi/article/details/50927661`
6. 配置的文件在 网站 设置里面 的配置文件 配置项是

```txt
<VirtualHost *:80>
    ServerAdmin webmaster@example.com
    DocumentRoot "/www/wwwroot/www.hsrj.group"
    ServerName f15a8819.www.hsrj.group
    ServerAlias 47.107.116.163
    errorDocument 404 /404.html
    ErrorLog "/www/wwwlogs/www.hsrj.group-error_log"
    CustomLog "/www/wwwlogs/www.hsrj.group-access_log" combined

    ProxyRequests off

    <Proxy *>
      Order deny,allow
      Allow from all
    </Proxy>

    <Location ></Location>
      ProxyPass http://127.0.0.1:3003/
      ProxyPassReverse http://127.0.0.1:3003/
    </Location>

    #DENY FILES
     <Files ~ (\.user.ini|\.htaccess|\.git|\.svn|\.project|LICENSE|README.md)$>
       Order allow,deny
       Deny from all
    </Files>

    #PHP
    <FilesMatch \.php$>
            SetHandler "proxy:unix:/tmp/php-cgi-00.sock|fcgi://localhost"
    </FilesMatch>

    #PATH
    <Directory "/www/wwwroot/www.hsrj.group">
        SetOutputFilter DEFLATE
        Options FollowSymLinks
        AllowOverride All
        Require all granted
        DirectoryIndex index.php index.html index.htm default.php default.html default.htm
    </Directory>
</VirtualHost>
```

**167. ftp 无法上传时 可以使用 ssh**

- 输入主机地址 账号 密码 即可

**168. 阿里云前端上传的一段 mixins**

```javascript
import * as ossApi from "@services/oss";
export default {
  mounted() {},
  methods: {
    // 先获取签名之类的
    $file_getUploadUrl(data) {
      return ossApi.getUploadUrl(data);
    },
    $file_upLoad(file, type = "TRACE") {
      return new Promise((resolve, reject) => {
        this.$file_getUploadUrl({ type })
          .then(res => {
            res = res.data;
            let data = new FormData();
            data.append("key", res.key);
            data.append("success_action_status", "200");
            data.append("OSSAccessKeyId", res.OSSAccessKeyId);
            data.append("Signature", res.Signature);
            data.append("policy", res.policy);
            data.append("file", file);

            this.$http
              .post(`${res.url}/`, data)
              .then(uploadRes => {
                resolve({
                  data: uploadRes.data,
                  status: uploadRes.status,
                  fileId: res.key,
                });
              })
              .catch(err => {
                reject(err);
              });
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 删除文件
    $file_delete(fileId) {
      return ossApi.deleteById({ fileId });
    },
    $file_download(fileId, type) {
      return ossApi.getDownloadUrl({ fileId, type });
    },
  },
};
```

**169. 差点忘了一个技能 iframe 页面通信**

- 父页面

```html
<html>
  <head>
    <script type="text/javascript">
      function say() {
        alert("parent.html");
      }
      function callChild() {
        myFrame.window.say();
        myFrame.window.document.getElementById("button").value = "调用结束";
      }
    </script>
  </head>
  <body>
    <input
      id="button"
      type="button"
      value="调用child.html中的函数say()"
      onclick="callChild()"
    />
    <iframe name="myFrame" src="child.html"></iframe>
  </body>
</html>
```

- 子页面

```html
<html>
  <head>
    <script type="text/javascript">
      function say() {
        alert("child.html");
      }
      function callParent() {
        parent.say();
        parent.window.document.getElementById("button").value = "调用结束";
      }
    </script>
  </head>
  <body>
    <input
      id="button"
      type="button"
      value="调用parent.html中的say()函数"
      onclick="callParent()"
    />
  </body>
</html>
```

- 跨域父子页面通信方法

```txt
如果iframe所链接的是外部页面，因为安全机制就不能使用同域名下的通信方式了。
父页面向子页面传递数据

实现的技巧是利用location对象的hash值，通过它传递通信数据。在父页面设置iframe的src后面多加个data字符串，然后在子页面中通过某种方式能即时的获取到这儿的data就可以了，例如：

1. 在子页面中通过setInterval方法设置定时器，监听location.href的变化即可获得上面的data信息

2. 然后子页面根据这个data信息进行相应的逻辑处理
子页面向父页面传递数据

实现技巧就是利用一个代理iframe，它嵌入到子页面中，并且和父页面必须保持是同域，然后通过它充分利用上面第一种通信方式的实现原理就把子页面的数据传递给代理iframe，然后由于代理的iframe和主页面是同域的，所以主页面就可以利用同域的方式获取到这些数据。使用 window.top或者window.parent.parent获取浏览器最顶层window对象的引用。
```

**170. vue beforeDestory 另一种用法**

```js
this.$once("hook:beforeDestroy", function () {
  clearTimeout(timeId);
});
```

**171. new Date() 转时间戳**

```javascript
let date = new Date();
console.log(date);
date = +date; // +转时间戳
console.log(date);
```

**172. 获取域名和端口**

```javascript
export const getBaseUrl = url => {
  var reg = /^((\w+):\/\/([^/:]*)(?::(\d+))?)(.*)/;
  reg.exec(url);
  return RegExp.$1;
};
```

**128. 拷贝文字**

```javascript
//复制文字
GlobalFunction.prototype.copyText = function (text) {
  let dom = document.createElement("input");
  dom.value = text;
  document.querySelector("html").appendChild(dom);
  dom.select();
  this.selectText(dom, 0, text.length);
  document.execCommand("Copy");
  dom.remove();
};
//复制文字选中兼容苹果Safari
GlobalFunction.prototype.selectText = function (
  textbox,
  startIndex,
  stopIndex
) {
  if (textbox.createTextRange) {
    //ie
    var range = textbox.createTextRange();
    range.collapse(true);
    range.moveStart("character", startIndex); //起始光标
    range.moveEnd("character", stopIndex - startIndex); //结束光标
    range.select(); //不兼容苹果
  } else {
    //firefox/chrome
    textbox.setSelectionRange(startIndex, stopIndex);
    textbox.focus();
  }
};
```

**129. fetch 是原生的 可不是插件 但是有基于 fetch 封装的插件 区别下 它的`护垫`是 xhr**

**130. vuecli cssLoader stylus 注意**

```javascript
{
  css: {
    loaderOptions: {
      stylus: {
        "resolve url": true,
		// 这里的文件只能写方法和变量 不然每个组件都会生成style 很坑
        import: ["./src/theme", "./src/assets/styl/utils"]
      }
    }
  }
}
```

**131. 一些学习资料**

```
* https://www.pentesterlab.com/exercises/
* http://overthewire.org/wargames/
* http://www.hackthissite.org/
* http://smashthestack.org/
* http://www.win.tue.nl/~aeb/linux/hh/hh.html
* http://www.phrack.com/
* http://pen-testing.sans.org/blog/2012/04/26/got-meterpreter-pivot
* http://www.offensive-security.com/metasploit-unleashed/PSExec_Pass_The_Hash
* https://securusglobal.com/community/2013/12/20/dumping-windows-credentials/
* https://www.netspi.com/blog/entryid/140/resources-for-aspiring-penetration-testers
  (这个博客的其他文章也都非常优秀)
* https://www.corelan.be/ (start at Exploit writing tutorial part 1)
* http://websec.wordpress.com/2010/02/22/exploiting-php-file-inclusion-overview/
一个小技巧，在大部分的系统中，apache access日志是只有root权限才可以读取的。不过你依然可以进行包含，使用/proc/self/fd/10或者apache访问日志使用的其他fd。
* http://www.dest-unreach.org/socat/

The Web Application Hacker's Handbook
* Hacking: The Art of Exploitation
* The Database Hacker's Handbook* The Art of Software Security Assessment* A Bug Hunter's Diary
* Underground: Tales of Hacking, Madness, and Obsession on the Electronic Frontier
* TCP/IP Illustrated
```

**132. 超帅的加载动画，虽然你不会写，你可以学你可以抄啊。。。**

- https://epic-spinners.epicmax.co/#/

**133. webpakc 插件 - DllPlugin**

> [浅探 webpack 优化](https://segmentfault.com/a/1190000017218108)

- DllPlugin 是用来干什么的呢？DllPlugin 会将第三方包到一个单独文件，并且生成一个映射的 json 文件，打包的生成的文件就是一个依赖库，这个依赖不会随着你的业务代码改变而被重新打包，只有当它自身依赖的包发生变化时才会需要重新打包依赖库，接下来来看具体配置吧：

**134. 静态页面、伪静态页面、SPA、SSR、预渲染之间的联系**

- 查阅资料得知 爬虫对 URL 和查看网页源码时候查看到的 DOM 结构有很强的依赖关系
- SPA 页面众所周知查看网页源码后，除了你写的`index.html`里面的内容 没有生成的真实 DOM 结构（通过 JS 动态增删，部分搜索引擎拿不到这些），而且 url 不用`history`模式，生成的都带#号，完全不利于 SEO
- 而 SSR 服务端渲染，就拿`Nuxt`来说，可以生成真正的静态页和伪静态页（在服务端生成或者你本地生成后传到服务端里），查看源码的时候，能看到生成的 DOM 结构，而不再仅仅是`index.html`里面的内容，而且 URL 不带#号等，所以利于 SEO 优化
- 预渲染使用的原理类似于服务端渲染，生成真正的静态 html， 有个插件 叫做`PrerenderSpaPlugin` 可以做预渲染

  > 摘自 https://segmentfault.com/q/1010000012069735

  1. 预渲染在构建阶段就已经生成了匹配预渲染路径的 html 文件，你的每个路由都可以作为入口文件。
  2. 预渲染后其对应文件夹下都有一个 index.html，作为路口文件，之后在跳转走的是前端路由，并不再请求 html 文件。
  3. 首屏预渲染对还需要请求易变数据的页面不太合适，因为展示的 html 很可能是上次预渲染的 html，等到请求完毕返回数据后再展示最新的 html 会引起客户的误解和疑惑。
  4. 让你配路由是因为，若你一开始访问的不是首页，是其他路由，那么请求其他路由下已经预渲染好的 index.html，否则如果不做预渲染，会请求你的根节点的 index.html，再根据路由匹配，链到你请求的路由下的页面

- 静态页和伪静态页简单来讲就是静态页会生成真正的 HTML 文件，伪静态不会真正生成 HTML 文件 1. 静态页面访问最快；维护较为麻烦。 2. 动态页面占用空间小、维护简单；访问速度慢，如果访问的人多，会对数据库造成压力。 3. 使用纯静态和伪静态对于 SEO(Search Engine Optimization:搜索引擎优化)没有什么本质的区别。 4. 使用伪静态将占用一定量的 CPU 占用率，大量使用会导致 CPU 超负荷。 5. 详情了解和区别可查看[静态页面、动态页面和伪静态页面的区别](https://www.cnblogs.com/software1113/p/4671384.html)，以上四条均摘自该文章

**134. 从输入 URL 到页面加载的过程？如何由一道题完善自己的前端知识体系！**
[从输入 URL 到页面加载的过程？如何由一道题完善自己的前端知识体系！](https://segmentfault.com/a/1190000013662126)

**135. 缓动动画**

> 最近在写 nuxt 的项目 等写完了来个总结

```javascript
// targetScroll 目标滚动距离 理由setTimeout控制 最好用 requestAnimtaionFrame
lazyMove(targetScroll) {
  this.request.timeId = setTimeout(() => {
	const curScroll = window.scrollY
	const toScroll = (targetScroll - curScroll) / 2
	// 向上滚动  当前的距离 1000 目标距离0  下一次 就是-500
	// 所以目标滚动距离 - 当前滚动距离是 负数
	// 向下滚动的话 当前距离 1000  目标距离 2000 下一次 就是 +500
	// 所以目标滚动距离 - 当前滚动距离 正数
	// 最后我们要滚动的距离就是 当前的滚动距离 + 下一次的（正/负）滚动距离
	// 你的目标滚动位置是不会变得 所以下次调用还是穿这个目标滚动距离 再算下一次的距离
	if (Math.abs(curScroll - targetScroll) <= 2) {
	  window.scrollTo(0, targetScroll)
	  clearTimeout(this.request.timeId)
	} else {
	  // 下一次的滚动距离 如果是向上 那就减去 向下 那就加上
	  window.scrollTo(0, curScroll + toScroll)
	  this.lazyMove(targetScroll)
	}
  }, 30)
```

**136. vuecli3 引入第三方插件 如 JQ 百度地图**

```javascript
chainWebpack: config => {
  config.externals({ BMap: "BMap" });
};
```

**137. nuxt 设置 proxy**

> nuxt.config.js

```javascript
{
  plugins: [
    { src: '@/plugins/element-ui', srr: true },
    '@/plugins/i18n',
    '@/plugins/axios'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // credentials: true,
	// 如果你的接口有域名 就不需要baseUrl 你的baseURl一定要和你的服务器地址一致 不然首次进入会无法获取数据 这个坑搞了我好久 托马的
    baseURL: HOST,
    // prefix: '/pub'
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true
  },
  proxy: {
    '/pub': {
      target: HOST
    }
  },
}
```

- 这是`plugins/axios`中的内容 可以参考@nuxt/axios 的文档做拦截 很方便

```javascript
export default function ({ $axios, redirect }) {
  $axios.onRequest(config => {
    // console.log('Making request to ' + config.url)
  });
  $axios.onError(error => {
    console.log(error);
    const code = parseInt(error.response && error.response.status);
    if (code === 400) {
      redirect("/400");
    }
  });

  $axios.onResponse(response => {
    // console.log(response)
  });
}
```

**138. VS Code IntelliSense AI 提示 API**

> [VS Code IntelliSense 介绍](https://www.infoq.cn/article/CoSe1R7VL6MrAh8g-h7l?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com&tdsourcetag=s_pcqq_aiomsg)

- IntelliCode 通过推荐常用的自动完成列表项来增强 VS Code IntelliSense，这些列表项是通过 IntelliCode 基于数千个真实的开源项目进行训练学习而生成的。目标是通过在自动完成列表的顶部放置最有可能使用的语言或 API 选项来节省开发人员的时间。

**139. nuxt 的 eslint 规则也太好用了**

> 放在`.eslintrc.js`中

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: "babel-eslint",
  },
  extends: ["plugin:vue/recommended", "plugin:prettier/recommended"],
  // required to lint *.vue files
  plugins: ["vue", "prettier"],
  // add your custom rules here
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
};
```

**140. Ueditor 图片直传 OSS**

> 参考 (ueditor 前端直传 OSS)[https://blog.csdn.net/u013684276/article/details/80143343#commentBox] 这个讲的比较全 很棒

- ueditor.all.js 修改这个 好找

```javascript
// 大概 24566行

// 干掉这一段

// domUtils.on(iframe, 'load', callback);
// form.action = utils.formatUrl(imageActionUrl + (imageActionUrl.indexOf('?') == -1 ? '?':'&') + params);
// form.submit();

// 然后自己改造下
_ajax({
	url: '/api/oss/getUploadUrl',
	headers: {
		Authorization: JSON.stringify({
					deviceType: ,
					// 我们项目要传token
					token:
				}),
		'Content-Type':'application/x-www-form-urlencolde'
	},
	sucBack: function(res){
		try {
			 res = JSON.parse(res).body
			 _sendFile(res)
		} catch (error) {

		}
	}
})
// 将图片发送给oss 获取fileId
function _sendFile(data){
	var fData = new FormData();
	fData.append("key", data.key);
	fData.append("success_action_status", "200");
	fData.append("OSSAccessKeyId", data.OSSAccessKeyId);
	fData.append("Signature", data.Signature);
	fData.append("policy", data.policy);
	fData.append("file", input.files[0]);
	_ajax({
		url: '/api/oss/getFileId',// + data.url,
		data: fData,
		sucBack: function(res){
			try {
				res = JSON.parse(res).body
				_getImgLink(res.fileId)
			} catch (error) {
				console.log(error)
			}
		},
		errBack: function(err){
			console.log(err)
		}
	})
}

// 根据fileId获取图片链接
function _getImgLink(id){
	_ajax({
		url: '/api/oss/getImg?fileId=' + id,
		type: 'get',
		sucBack: function(res){
			try {
			// 最后这里是添加到编辑器中的  根据场景需求自己调整
				res= JSON.parse(res).body
				var link = res.link;
				loader = me.document.getElementById(loadingId);
				loader.setAttribute('src', link);
				loader.setAttribute('_src', link);
				loader.setAttribute('title', '');
				loader.setAttribute('alt', '');
				loader.removeAttribute('id');
				domUtils.removeClasses(loader, 'loadingclass');
			} catch (error) {

			}

		},
		errBack: function(err){
			console.log(err)
		}
	})
}

// ajax封装
function _ajax(options){
	var option = options || {}
	option.type = options.type || 'post'
	option.data = options.data || null
	option.url = options.url || ''
	option.headers = options.headers || null
	option.data = options.data || null
	option.sucBack = options.sucBack || null
	option.errBack = options.errBack || null

	var xhr = new XMLHttpRequest()

	xhr.onerror = function(error){
		typeof option.errBack === 'function' && option.errBack(error)
	}

	xhr.open(option.type, option.url, true)

	if(option.headers){
		for( i in option.headers ){
			if( option.headers.hasOwnProperty( i ) ){
				xhr.setRequestHeader( i, option.headers[i] )
			}
		}
	}

	xhr.send(option.data)

	xhr.onreadystatechange = function stateChange() {
		if (xhr.readyState === 4) {
			if (xhr.status === 304 || (xhr.status >= 200 && xhr.status < 300)) {
				typeof option.sucBack === 'function' && option.sucBack(xhr.responseText)
			}
		}
	}
}

```

**141. JS 获取浏览器缩放比例**
// 翻斗鱼的源码看到的

```javascript
define("douyu/com/zoom", [
  "jquery",
  "shark/observer",
  "shark/util/cookie/1.0",
  "shark/util/storage/1.0",
  "douyu/context",
  "douyu/com/zoom-dp",
], function (e, i, t, n, o, a) {
  var s = {
      storageName: "zoomtip",
      storageVal: "1",
      storageTime: 604800,
      isPop: !1,
      init: function () {
        this.handleCookie(),
          this.pop(),
          i.on("mod.layout.screen.change", function (e) {
            s.detect() && s.pop();
          });
      },
      handleCookie: function () {
        t.get(this.storageName) &&
          (t.remove(this.storageName),
          n.set(this.storageName, this.storageVal, this.storageTime));
      },
      detect: function () {
        return (
          (this.ua = navigator.userAgent.toLowerCase()),
          -1 == this.ua.indexOf("windows") ? !1 : !n.get(this.storageName)
        );
      },
      cal: function () {
        var e = 0,
          i = window.screen;
        return (
          void 0 !== window.devicePixelRatio
            ? (e = window.devicePixelRatio)
            : ~this.ua.indexOf("msie")
            ? i.deviceXDPI &&
              i.logicalXDPI &&
              (e = i.deviceXDPI / i.logicalXDPI)
            : void 0 !== window.outerWidth &&
              void 0 !== window.innerWidth &&
              (e = window.outerWidth / window.innerWidth),
          e && (e = Math.round(100 * e)),
          (99 !== e && 101 !== e) || (e = 100),
          e
        );
      },
      resize: function () {
        var i = this.cal();
        if (this.isPop && i && 100 == i) return void this.close();
        var t = 540,
          n = 432,
          o = (100 * t) / i,
          a = (100 * n) / i;
        e(".pop-zoom-container").css({
          width: o + "px",
          height: a + "px",
          marginLeft: -o / 2 + "px",
          marginTop: -a / 2 + "px",
        });
      },
      pop: function () {
        var t = this.cal();
        if (!n.get(this.storageName) && !this.isPop && 100 !== t) {
          var a =
              o.get("sys.web_url") +
              "app/douyu/res/com/sg-zoom-error.png?20160823",
            s = [
              '<div class="pop-zoom-container">',
              '<div class="pop-zoom">',
              '<img class="pop-zoom-bg" src="',
              a,
              '">',
              '<div class="pop-zoom-close">close</div>',
              '<div class="pop-zoom-hide"></div>',
              "</div>",
              "</div>",
            ].join("");
          e("body").append(s),
            this.bindEvt(),
            (this.isPop = !this.isPop),
            i.trigger("dys.com.zoom.pop.show");
        }
        this.resize();
      },
      close: function () {
        e(".pop-zoom-container").remove(),
          (this.isPop = !this.isPop),
          i.trigger("dys.com.zoom.pop.close");
      },
      bindEvt: function () {
        var t = this;
        e(".pop-zoom-close").on("click", function () {
          t.close();
        }),
          e(".pop-zoom-hide").on("click", function () {
            n.set(t.storageName, t.storageVal, t.storageTime),
              i.trigger("dys.com.zoom.pop.zoomtip"),
              t.close();
          });
      },
    },
    r = function () {
      s.detect() && s.init();
    };
  e(r);
});
```

- 最后提出来

```javascript
var getScreenScaleNum = function () {
  var e = 0,
    i = window.screen;
  return (
    void 0 !== window.devicePixelRatio
      ? (e = window.devicePixelRatio)
      : ~this.ua.indexOf("msie")
      ? i.deviceXDPI && i.logicalXDPI && (e = i.deviceXDPI / i.logicalXDPI)
      : void 0 !== window.outerWidth &&
        void 0 !== window.innerWidth &&
        (e = window.outerWidth / window.innerWidth),
    e && (e = Math.round(100 * e)),
    (99 !== e && 101 !== e) || (e = 100),
    e
  );
};
```

**142. vuecli3 按需引入 elementui**

- babel.config.js

```javascript
module.exports = {
  presets: ["@vue/app"],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
  ],
};
```

- 然后建立一个 js 文件 放 elementui 引入的组件
- 然后 mian.js 引入这个 js 文件

**143. 箭头函数的几种写法**

```javascript
    异步函数声明： async
     function foo() {}
    异步函数表达式： const
     foo = async function () {};
    异步函数定义：let
     obj = { async foo() {} }
    异步箭头函数： const
     foo = async () => {};
```

**144. 有空看看 MDN 的 css 文档**

**145. 当你想判断包含关系时**

- 少量的用 `||`，量大的试试 `includes`、`indexOf`、`search`、`正则`…… 你的代码量会更少，更优雅
- indexOf 方法有两个缺点，一是不够语义化，它的含义是找到参数值的第一个出现位置，所以要去比较是否不等于-1，表达起来不够直观。二是，它内部使用严格相等运算符（===）进行判断，这会导致对 NaN 的误判。摘自——es6 阮一峰

**146. 没事去 codepen 看看人家写的 css3 交互效果鸭**

**147. 移动端长按弹窗的逻辑，不需要松开即可弹窗**

```vue
<script>
export default {
  data() {
    return {
      // 在滚动中  就不触发点击
      scrollStatus: false,
      timeId: null,
      holdTime: 1500,
      clickTimeDate: null,
    };
  },
  methods: {
    handleClickStart(item, index) {
      this.scrollStatus = false;
      clearTimeout(this.timeId);
      this.timeId = setTimeout(() => {
        this.beforeDelete(item.objectId, index);
      }, this.holdTime);
      this.clickTimeDate = Date.parse(new Date());
    },
    handleClickMove() {
      this.scrollStatus = true;
    },
    handleClickEnd(item) {
      if (this.scrollStatus === true) {
        clearTimeout(this.timeId);
        return;
      }
      const timeRange = Date.parse(new Date()) - this.clickTimeDate;
      if (timeRange < this.holdTime) {
        clearTimeout(this.timeId);
        this.goDetail(item);
      }
    },
    goDetail(data) {
      if (data.website) {
        window.open(data.website);
      } else {
        // this.$store.commit("setActivityContent", data.content);
        this.$router.push({ path: "/activity/detail", query: { id: data.id } });
      }
    },
  },
};
</script>
```

**148. 如何编写优化的 JavaScript**

> [JavaScript 是如何工作的：深入 V8 引擎&编写优化代码的 5 个技巧 ](https://segmentfault.com/a/1190000017369465)

- 对象属性的顺序：始终以相同的顺序实例化对象属性，以便可以共享隐藏的类和随后优化的代码。
- 动态属性： 因为在实例化之后向对象添加属性将强制执行隐藏的类更改，并降低之前隐藏类所优化的所有方法的执行速度，所以在其构造函数中分配所有对象的属性。
- 方法：重复执行相同方法的代码将比仅执行一次的多个不同方法（由于内联缓存）的代码运行得更快。
- 数组：避免稀疏数组，其中键值不是自增的数字，并没有存储所有元素的稀疏数组是哈希表。这种数组中的元素访问开销较高。另外，尽量避免预分配大数组。最好是按需增长。最后，不要删除数组中的元素，这会使键值变得稀疏。
- 标记值：V8 使用 32 位表示对象和数值。由于数值是 31 位的，它使用了一位来区分它是一个对象（flag = 1）还是一个称为 SMI（SMall Integer）整数（flag = 0）。那么，如果一个数值大于 31 位，V8 会将该数字装箱，把它变成一个双精度数，并创建一个新的对象来存放该数字。尽可能使用 31 位有符号数字，以避免对 JS 对象的高开销的装箱操作。

**149. Vue 使用百度分享组件销毁后，重新建立组件分享功能不显示或失效**

- 使用百度分享的`init`方法

```javascript
/* eslint-disable */
export default {
  mounted() {
    // 关键代码在这里  如果已经加载了 就init它  没有加载 就初始化
    window._bd_share_main ? window._bd_share_main.init() : this.initShare();
  },
  methods: {
    initShare() {
      window._bd_share_config = {
        common: {
          bdSnsKey: {},
          bdText: "",
          bdMini: "2",
          bdMiniList: false,
          bdPic: "",
          bdStyle: "1",
          bdSize: "24",
        },
        share: {},
        selectShare: {
          bdContainerClass: null,
          bdSelectMiniList: ["weixin", "tsina", "qzone"],
        },
      };
      const $el = document.querySelector("#baiduShare");
      $el && document.body.removeChild($el);
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.id = "baiduShare";
      s.src = "";
      document.body.appendChild(s);
    },
  },
};
```

**150. Vue Router 新窗口打开**

```javascript
const routeData = this.$router.resolve({
  path: lang ? `/${lang}/news/detail` : `news/detail`,
  query: { id },
});
window.open(routeData.href, "_blank");
```

**151. webpack 按需引入组件、函数的写法** 1.
``javascript
// before
import { toast } from "./toastify";
toast("Hello World");

// after
import("./toastify").then(module => {
module.toast("Hello World");
});

````

2.
```javascript
syncLoadEcharts () {
	return new Promise((resolve, reject) => {
		require.ensure(
			[],
			function () {
				echarts = require('echarts/lib/echarts')
				require('echarts/lib/chart/line')
				// 引入提示框和标题组件
				require('echarts/lib/component/tooltip')
				require('echarts/lib/component/title')
				resolve('success')
			},
			'syncEcharts'
		)
	})
},
````

**152. 少用 ID,会增加全局变量**

```html
<!-- 全局 DOM 变量 -->
<!-- 由于浏览器历史遗留问题，在创建带有 id 属性的 DOM 元素的时候也会创建同名的全局变量： -->
<!-- windows下的全局变量不会被ID的全局变量覆盖 -->

<div id="foo">
  <div>
    <scripts>
      console.log(foo) // 打印出DOM元素 const el = document.createElement('div')
      el.id = 'scrollX' document.body.appendChild(el) window.scrollX // 0
    </scripts>
  </div>
</div>
```

**153. 不要忘了背景色使用渐变色和纯色可以叠加的**

- IE9 不支持渐变色 然后你要使用渐变色的话可以叠加写在一起

```css
background-color: rgba(255, 255, 255, 1);
background-image: linear-gradient(
  180deg,
  rgba(233, 233, 233, 1),
  rgba(255, 255, 255, 1)
);
```

**154. nuxt 如何针对低版本 IE 去提示用户**

- nuxt 根目录可以建立一个 app.html,默认的内容在文章中可以找到 你可以在里面写上你要提示的内容 还有首屏加载 不过貌似不需要在 slow3g 模式下测试了 并没有出现

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head>
    {{ HEAD }}
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

**155. sourceTree 挺好用的 git 版本管理工具**

- 不要怕建利分支，多建利分支，比如一条主分支 一条开发分支 一条 bug 修复分支……
- 每改一个功能用`sourceTree`提交一次，不一定推到远程，让你的代码都有记录可寻，方便维护和更改

**156. asiox 和 oss 上传有一个需要注意点**

- 如果你上传提示 405 而且什么都对， 你要检查下你的`"Content-Type`

```javascript
if (/htkj001\.oss|rryn/.test(config.url)) {
  config.headers["Content-Type"] = false;
} else {
  config.headers["Content-Type"] = "application/x-www-form-urlencoded";
}
```

**157. pointer-events: none 禁止鼠标事件**

> (高性能滚动 scroll 及页面渲染优化)[http://web.jobbole.com/86158/]

- 大部分人可能都不认识这个属性，嗯，那么它是干什么用的呢？

- pointer-events 是一个 CSS 属性，可以有多个不同的值，属性的一部分值仅仅与 SVG 有关联，这里我们只关注 pointer-events: none 的情况，大概的意思就是禁止鼠标行为，应用了该属性后，譬如鼠标点击，hover 等功能都将失效，即是元素不会成为鼠标事件的 target。

- 可以就近 F12 打开开发者工具面板，给 <body>标签添加上 pointer-events: none 样式，然后在页面上感受下效果，发现所有鼠标事件都被禁止了。

- 那么它有什么用呢？

- pointer-events: none 可用来提高滚动时的帧频。的确，当滚动时，鼠标悬停在某些元素上，则触发其上的 hover 效果，然而这些影响通常不被用户注意，并多半导致滚动出现问题。对 body 元素应用 pointer-events: none ，禁用了包括 hover 在内的鼠标事件，从而提高滚动性能。

```css
.disable-hover {
  pointer-events: none;
}
```

- 大概的做法就是在页面滚动的时候, 给 添加上 .disable-hover 样式，那么在滚动停止之前, 所有鼠标事件都将被禁止。当滚动结束之后，再移除该属性。

**158. 移动端滚动懒加载等各种**

> (前端技术周刊 2018-12-24：移动无限加载)[https://segmentfault.com/a/1190000017893879]

1. 滚动事件

   - (移动 Web 的滚动)[http://www.alloyteam.com/2017/04/secrets-of-mobile-web-scroll-bars-and-drop-refresh/]
   - (高性能滚动及页面渲染优化)[http://web.jobbole.com/86158/]
   - (移动端滚动事件大起底)[https://github.com/merrier/mobile-scroll-events]

2. 懒加载

   - (Lazyload 三种实现方式)[https://zhuanlan.zhihu.com/p/25455672]
   - (懒加载和预加载)[https://www.jianshu.com/p/4876a4fe7731]

3. 无限滚动
   - (React 之无限滚动)[https://zhuanlan.zhihu.com/p/32075662]
   - (Vue.js 一个超长列表无限滚动加载的解决方案)[https://juejin.im/entry/5819993fbf22ec0068aab054]
   - (设计高性能无限滚动加载，了解高效页面秘密)[https://zhuanlan.zhihu.com/p/25767226]
   - (设计模式之享元模式)[https://www.cnblogs.com/TomXu/archive/2012/04/09/2379774.html]

**159. 移动端如果时间设置成 2019/01/21 24:00:00 会报错**

- 设置成 23:59:59

**160. 数组分割**

```javascript
let newArr = [];
const length = arr.length;
for (let i = 0; i < length; i += 3) {
  newArr.push(arr.slice(i, i + 3));
}
this.dataList = newArr;
console.log(this.dataList);
```

**161. translate(3d)也不见得哪里都适用**

- 大量 DOM 的场景下， 用 translate3d 做滚动的时候，火狐会出现滚动卡顿，谷歌不会
- 改用 scrollTo 做滚动完美解决这个问题
- 值得思考

**162. html5 微数据**

```html
<meta itemprop="name" content="原来科技真的可以改变生活,好炫!" />
<meta itemprop="description" content="原来科技真的可以改变生活，好炫！" />
<meta
  itemprop="image"
  content="http://qqpublic.qpic.cn/qq_public_cover/0/0-10000-DB4036C9AF4028EA19729430313D4960_vsmcut/200"
/>
```

**163. vue-cli `import` 中大小写的有意思之处**

> 未测试是 es6 的规则还是 vue-cli 或者 webpack 的关系

- import AppUseChart from './appUseChart' 默认当成文件夹 会查找里面的 index.vue
- 而 import AppUseChart from './AppUseChart' 会当成.vue 组件

**164. git 默认对文件名啥的是不区分大小写的 记得区分**

```shell
git config core.ignorecase false
```

**165. react-router4 react 嵌套路由实现的两种方式以及路由过渡动画的实现方式**

- [react-router4 react 嵌套路由实现的两种方式以及路由过渡动画的实现方式](https://blog.csdn.net/qq_37540004/article/details/88331990)

**166. React 或 Vue 中如果函数不依赖于的组件（没有 this 上下文），则可以在组件外部定义它。 组件的所有实例都将使用相同的函数引用，因为该函数在所有情况下都是相同的。**

> [Web 性能优化：缓存 React 事件来提高性能](https://segmentfault.com/a/1190000018423895)

- 在 JavaScript 中，函数的处理方式是相同的。如果 React 接收到具有不同内存地址的相同函数，它将重新呈现。如果 React 接收到相同的函数引用，则不会。

```javascript
class SomeComponent extends React.PureComponent {
  get instructions() {
    if (this.props.do) {
      return "click the button: ";
    }
    return "Do NOT click the button: ";
  }

  render() {
    return (
      <div>
        {this.instructions}
        <Button onClick={() => alert("!")} />
      </div>
    );
  }
}
```

- 这是一个非常简单的组件。 有一个按钮，当它被点击时，就 alert。 instructions 用来表示是否点击了按钮，这是通过 SomeComponent 的 prop 的 do={true} 或 do={false} 来控制。

- 这里所发生的是，每当重新渲染 SomeComponent 组件(例如 do 从 true 切换到 false)时，按钮也会重新渲染，尽管每次 onClick 方法都是相同的，但是每次渲染都会被重新创建。

- 每次渲染时，都会在内存中创建一个新函数(因为它是在 render 函数中创建的)，并将对内存中新地址的新引用传递给 <Button />，虽然输入完全没有变化，该 Button 组件还是会重新渲染。

**167. vuecli3 给 jsloader 加 include**

```javascript
config.module
  .rule("js")
  .include.add(resolve("test"))
  .add(resolve("src"))
  .add(resolve("/node_modules/element-ui/packages"))
  .add(resolve("/node_modules/element-ui/src"));
```

**168. GOjs 流程图增删编辑**

```javascript
// 以下方法都是通过绑定的click事件触发
// 增加
function addCounter(e, obj) {
  var node = obj.part;
  var data = node.data;
  myDiagram.model.addNodeData({
    key: Date.parse(new Date()),
    name: "George V",
    gender: "M",
    birthYear: "1865",
    deathYear: "1936",
    reign: "1910-1936",
    parent: data.key,
  });
  myDiagram.rebuildParts();
}
// 减去
function minusCounter(e, obj) {
  var node = obj.part;
  myDiagram.remove(node);
  myDiagram.rebuildParts();
}

/*
 // 编辑 通过以下任意方法获取数据列表
  myDiagram.model.nodeDataArray
  myDiagram.model.linkDataArray
  //修改完成调用以下方法完成重建
  myDiagram.rebuildParts()
*/
```

**169. Git pull(拉取) fetch(获取)区别**

- 使用 git 直接提交的话 直接 push
- 获取最新版本 有两种 拉取 和 获取 pull 和 fetch
- git pull 从远程拉取最新版本 到本地 自动合并 merge git pull origin master
- git fetch 从远程获取最新版本 到本地 不会自动合并 merge git fetch origin master git log -p master ../origin/master - git merge orgin/master
- 实际使用中 使用 git fetch 更安全 在 merge 之前可以看清楚 更新情况 再决定是否合并

**170. react 如果不需要刷新视图， 尽量少用 setState 去更改变量，因为每次 setState 都会去尝试刷新视图，耗费性能，可以通过变量来操作**

> https://segmentfault.com/a/1190000018549047

- setState 调用后，组件的 render 方法也会自动调用，这就是为什么你能在页面看到新数据。但是无论你 setState 修改的是什么，哪怕是页面里没有的一个数据，render 都会被触发，并且父组件渲染中会嵌套渲染自组件。

**171. addEventListener 的 中的 passive 可以优化滚动 如果你不需要 preventDefault**

- options 可选
- 一个指定有关 listener 属性的可选参数对象。可用的选项如下：

- 1.  capture: Boolean，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。
  2.  once: Boolean，表示 listener 在添加之后最多只调用一次。如果是 true， listener 会在其被调用之后自动移除。
  3.  passive: Boolean，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。
  4.  mozSystemGroup: 只能在 XBL 或者是 Firefox' chrome 使用，这是个 Boolean，表示 listener 被添加到 system group。

**172. @contextmenu.prevent vue 中使用这个可以阻止右键菜单**

**173. png 透明图片中有字，如何给这个图中的字加阴影？**

- 用`css3`的`filter`的`drop-shadow`属性

```css
filter: drop-shadow(2px 2px 4px #ccc);
```

**174. 如果图片需要遮罩，记得把遮罩的 dom 放在图片 dom 前面 不然图片会先加载出来 而遮罩不会 会看着一瞬间没遮罩**

**175. border 方式画三角形可以画各种角度的和宽度的哦**

**176. html 中 url 路径请求的六种方式：无斜杠、单斜杠（/）、点+单斜杠（./）、点点+单斜杠（../）、多个点点+单斜杠（../../）、全路径**

- 没有斜杠，跳转到和自己（rootPath.html）同目录下的 layout 页面
- 单斜杠加前有一点，跳转到和自己（rootPath.html）同目录下的 layout 页面 `总结：方式一和方式二效果是相同的`。
- 单斜杠，跳转到整个网站根目录下
- 两点加单斜杠，跳转到上一级目录
- 多个两点加单斜杠连续用，每一次“../”往上跳转一级,有几个“
- 全路径方法：路径+项目名+文件在 wbapp 下的位置

**177. 单页面过渡动画过渡过程要设置 absolute 还要有位置，这样才不会抖动**

```css
.ht-filter-enter-active,
.ht-filter-leave-active {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  transform: translate3d(0, 0, 0);
  transition: opacity 0.5s, filter 0.5s;
}
.ht-filter-enter,
.ht-filter-leave-to {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  transform: translate3d(0, 0, 0);
  filter: blur(8px);
  opacity: 0;
}
```

**178. 如果 UI 框架提供的有 scss 等可以修改主题的工具 尽量从那个里面修改**

**179. `:first-child……`等伪类选择器必须在都是相同兄弟节点中使用**

```html
<body>
  <p />
  <span />
  <span />
  <p />
</body>

上面这种无效 下面这种有效

<body>
  <p />
  <p />
  <p />
  <p />
</body>
```

**180. box-shadow 底部阴影**

```css
box-shadow: 0 8px 20px #666; /* 第一个左右偏移 第二个上下偏移 第三个阴影的量 第四个颜色 */
```

**181. routerview 和 key 配合 很巧妙**

- 使用得当可以避免不同路由同组件不渲染

**182. stylus 和 scss 的写 hack 的方法是啥来着，就是那块已原生 css 的方式编译**

**183. 网页全屏的功能 最外层的盒子 margin 会不占宽度的**

**184. vue 中有时候清除某个列表 在赋值前再清除会有效点**

```javascript
// 有效清空 不会导致数据遗留
loadData().then(res => {
  this.dataList = [];
  this.dataList = res.map(v => {
    v.name = 1;
    return v;
  });
});

// 有时候会无效清空 导致数据遗留
this.dataList = [];
loadData().then(res => {
  this.dataList = res.map(v => {
    v.name = 1;
    return v;
  });
});
```

**182. 右键菜单和百度 rightclick 的冲突**

- 百度 rightclick 调用自定义右键菜单，菜单利用 document 监听点击事件判断是否含有特定 class 来自动关闭弹窗，在火狐中打不开弹窗，因为触发点击的是 svg，而 svg 没有特定的 class 于是就在菜单中加上判断如果是右键点击的不隐藏 解决冲突

**183. 横向滚动盒子的 css**

```css
height: 200px;
width: 100%;
overflow-x: auto;
overflow-y: hidden;
white-space: nowrap;
```

**184. vscode 用户代码片段的功能**

- 在首选项中打开用户代码片段
- 找到 vue
- 输入(\$0 是当前鼠标位置)

```json
{
  "Print to console": {
    "prefix": "vue",
    "body": [
      "<template>",
      "  <div>$0</div>",
      "</template>",
      "",
      "<script>",
      "export default {",
      "  data () {",
      "    return {",
      "    };",
      "  },",

      "  computed: {},",
      "  methods: {}",
      "}",
      "",
      "</script>",
      "<style lang=''>",
      "</style>"
    ],
    "description": "Log output to console"
  }
}
```

- 然后保存这个文件
- 新建一个 vue 文件，输入`vue`然后按`enter`即可

```vue
<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>
<style lang=""></style>
```

**185. +-等操作符的优先级大于三元运算符的优先级 不注意容易出错**

**186. 火狐、IE 盒子高度写 100%的时候 overflow:auto; padding 有值 滚动的时候 不计算 padding **

- height 100% 改成 auto 即可
- 具体原因未知 猜想 ？？？ 想不明白。。。

```css
.ht-scroll-contain {
  // 不要写 100%  100%在火狐和IE中会忽略padding的高度
  height: auto;
  width: 100%;
  overflow: auto;
}
```

**187. Vue 利用 store 调用不同组件的方法时，在刷新网页时可能没法同步，需要加延迟**

**188. 阿里网页支付跳转**

```javascript
confirmPay(data) {
      this.pageLoading = true;
      const newTab = window.open();
      const div = document.createElement("div");
      aliPayApi
        .getPayPage({
          dePoint: data.dePoint,
          feesSetMealBeans: this.getSendData()
        })
        .then(res => {
          res = res.data;
          div.innerHTML = res.orderInfo;
          newTab.document.body.appendChild(div);
          newTab.document.forms[0].submit();
          this.pageLoading = false;

          this.back();
        })
        .catch(() => {
          this.pageLoading = false;
        });
    }
```

**189. 使用 mqtt**

> 只是 demo 代码 实际需求看情况改

- 客户端

```javascript
const mqtt = require("mqtt");
export default {
  data() {
    return {
      client: null,
    };
  },
  created() {
    this.createClient();
  },
  methods: {
    createClient() {
      console.log("create");
      this.client = mqtt.connect("mqtt://127.0.0.1:7410", {
        connectTimeout: 5000,
      });
      this.client.on("connect", () => {
        // persence 和  /hello/word 相当于监听的路由 不在这里写 收不到信息
        this.client.subscribe("presence", err => {
          if (!err) {
            this.client.publish("presence", "Hello mqtt");
          }
        });

        this.client.subscribe("/hello/world", err => {
          if (!err) {
            this.client.publish("/hello/world", "Hello word");
          }
        });
      });
      // 当有消息传递过来 topic就是监听的路由
      this.client.on("message", function (topic, message) {
        // message is Buffer
        console.log(topic, message.toString(), "msg");
        // this.client.end();
      });
      this.client.on("error", error => {
        // message is Buffer
        console.log(error);
        this.client.end();
      });
    },
  },
};
```

- 服务端 用的 node

```javascript
var mosca = require("mosca");
// 连接的数据库 这里只用模拟没连数据库
var ascoltatore = {
  //using ascoltatore
  type: "mongo",
  url: "mongodb://localhost:27017/mqtt",
  pubsubCollection: "ascoltatori",
  mongo: {},
};

var settings = {
  port: 1884,
  // 直接请求1884端口不能用  要加 http 或者https(没试,看你请求链接)
  // 第三方的话 开通websocket就可以访问了
  http: {
    port: 7410,
  },
  //   backend: ascoltatore
};

var message = {
  topic: "/hello/world",
  payload: "abcde", // or a Buffer
  qos: 0, // 0, 1, or 2
  retain: false, // or true
};

var server = new mosca.Server(settings);

server.on("clientConnected", function (client) {
  // 推送消息
  server.publish(message, function () {
    console.log("done!");
  });
});

// fired when a message is received
server.on("published", function (packet, client) {
  console.log("Published", packet.payload.toString());
});

// server.on('clientDisconnected', function(client) {
//     console.log('Client Disconnected:', client.id)
// })

server.on("ready", setup);

// fired when the mqtt server is ready
function setup() {
  console.log("Mosca server is up and running");
}
```

**190. window.URL.createObjectURL**

**191. 百度地图等需要根据 key 来引入不同大量图片的解决方案**

- 比如我有十几二十种 key，每个 key 对应一个图片，后端返回不同的 key，我要展示不同的图片，而且如果图片不存在，那么展示一个默认图片。
- 如果一个一个 require 图片进来，很麻烦，不科学，不自动，于是我想到了一种解决方案，将图片放入 public 文件夹（静态资源不用 laoder 加载）

```javascript
// 基础图片路径 这个是放在public文件夹下的  public/images/gateway....
// 这里一定要用相对路径 用绝对路径的话 打包之后会受路径影响不显示 亲测
const basicImg = "images/gateway/basic.png";
const imgUrl = "images/gateway/";
// 然后图片的命名与后端传来的key对应 比如 key是gateway 你的图片名字就是 gateway.png

// 那么如何判断图片能否正常加载呢？  就用new Image 去构造一个图片对象
export default {
  methods: {
    // 这个方法用来检测图片是否可用
    createImg(src) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = src;
        img.onload = () => {
          img = null;
          resolve();
        };
        img.onerror = () => {
          img = null;
          reject(new Error("没有图片"));
        };
      });
    },
    // 将图片生成markder 这里面有我相关的业务逻辑
    async createMarker(data) {
      const lng = data.longitude;
      const lat = data.latitude;
      let iconImg = null;
      const url = imgUrl + data.type + ".png";
      await this.createImg(url)
        .then(() => {
          iconImg = url;
        })
        .catch(() => {
          iconImg = basicImg;
        });
      let marker = new BMap.Marker(new BMap.Point(lng, lat), {
        icon: new BMap.Icon(iconImg, new BMap.Size(100, 100)),
        enableClicking: true,
      }); // 创建标注
      marker.htData = data;
      marker.removeEventListener("click", this.showTerminalWindow);
      marker.addEventListener("click", this.showTerminalWindow);
      return marker;
    },
    // 这里有个注意点 我踩了个坑 自己不理解async   async返回的也是个promise对象  哈哈
    addMarkerToMap(arr) {
      const newArr = arr.filter(v => {
        return v.longitude && v.latitude;
      });
      this.markerWindow = [];
      newArr.forEach((v, k) => {
        // 一开始直接添加到map中 都是空的 async返回的也是个promise 哦！
        this.createMarker(v)
          .then(markder => {
            this.map.addOverlay(markder);
          })
          .catch(() => {});
      });
    },
  },
};
```

- 另外 如果我们需要 key 引入图片的话可以使用这种方式

```vue
<template>
  <img
    :src="require(`@img/service/${item.feesStandardCode}.png`)"
    :alt="item.feesStandardName"
  />
</template>
```

- 或者

```vue
<template>
  <div
    :style="{
      background: require(`@img/service/${item.feesStandardCode}.png`),
    }"
    :alt="item.feesStandardName"
  />
</template>
```

**192. vue 按钮权限控制的一个思路**

> [从 0 到 1 搭建 element 后台框架之权限篇](https://segmentfault.com/a/1190000019000771)

- 按钮级别的权限说实话一般都通过数据接口来控制是否展示，点击等等情况。如果光有前端来控制绝对不是可行之道。
- 项目中按钮权限注册全局自定义指令来完成的。首先 src 下面新建一个 directive 文件夹，用于注册全局指令。在文件夹下新建一个 premissionBtn.js。如果对自定义指令不熟的话可以查阅官方文档。
- 全局指令

```javascript
import Vue from "vue";
import store from "@/store/store";
//注册一个v-allowed指令
Vue.directive("allowed", {
  inserted: function (el, bingding) {
    let roles = store.getters.roles;
    //判断权限
    if (Array.isArray(roles) && roles.length > 0) {
      let allow = bingding.value.some(item => {
        return roles.includes(item);
      });
      if (!allow) {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }
    }
  },
});
```

- 引用

```javascript
import "./directive/premissionBtn";
```

- 那自定义指令如何使用呢？

```html
<div class="premissionBtn">
  <el-button type="primary" v-allowed="['admin']"
    >我是只有admin的时候才能显示</el-button
  >
  <br />
  <el-button type="info" v-allowed="['user']"
    >我是只有user的时候才能显示</el-button
  >
  <br />
  <el-button type="warning" v-allowed="['admin','user']"
    >我是admin或者user才能显示</el-button
  >
  <br />
  <el-button type="danger">任何角色都可以显示</el-button>
</div>
```

**193. vue/react 使用 JSDoc、jsconfig.json 完成 vscode 对于 webpack 的 alias 引入的 js 方法的提示**

> [csdn 该篇文章链接](https://blog.csdn.net/qq_37540004/article/details/89602242)

TS 有个好处就是你引入方法会告诉你参数是什么类型返回什么类型，而我们不需要 TS 也可以完成这项提示任务。

- 首先你需要阅读[JSDoc 的文档](http://usejsdoc.org/)和[jsconfig.json](https://code.visualstudio.com/docs/languages/jsconfig)的配置，你也可以百度下中文的文档
- 之后是写配置文件，比如我的 webpack 的 alias 配置如下, common 中是我的公共方法

```javascript
chainWebpack: config => {
  config.resolve.alias.set("@common", resolve("src/common"));
};
```

- 我如果在项目中使用`@common/utils`引入我需要的方法时，在不配置 jsconfig.json 的情况下，vscode 是不会提示我引入这个 js 文件中有多少方法的，使用`jsconfig.json`就可以帮助`vscode`完成这项艰巨的任务
- jsconfig 的基本配置如下，这里的路径和你的 alias 路径相同即可

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@assets/*": ["src/assets/*"],
      "@common/*": ["src/common/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

- 方法的提示怎么编写呢？用好 JSDoc 就行了。

```javascript
/**
 *
 * @param {String} msg 提示的消息
 */
export const ht_notify_error = msg => {
  ht_notify({
    title: "非常抱歉...",
    message: msg,
    type: "error",
  });
};
```

- 之后你在文件中引入这个方法时就会提示这些信息了，亲自试试吧！

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190427152206396.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190427152219234.png)
我 alias 引入的 js 文件中的方法也提示了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190427153320777.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)
jsconfig.json 所在位置为项目根目录
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190427153352662.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)

##### 还可以自动引入，首先你需要引入 utils 这个文件， 比如`import {xxx} from "@common/utils"` 你在 create 周期里打其中一个未引入的方法，这个方法名会自动添加到{}之中

##### ctrl + 鼠标点击方法也会跳转到方法所在的文件之中

##### 方法描述信息可以写在一开头，不知道@description 为啥不能用

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190428131824841.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019042813193982.png)

##### 提示换行

```javascript
/**
 * 获取当前日期的时间戳返回对应日期
 *
 * 1 => "2017--09-08 09:25:21"
 *
 * 2 => "2017-09-08"
 *
 * year  获取当前年份
 *
 * month  获取当前月份
 *
 * day  获取当前几号
 * @param {Number | String} option 传入的对象
 * @param {Date | Number | String} option.time 需要被处理的时间
 * @param {Number | String} option.type 被处理的类型
 * */
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190428132454209.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)

**194. vueli3 不一定要用 chain configureWebpack 也是一样的**

**195. 如何根据 url 链接字符串获取 href、protocol、host、search、hash 等属性**

- iframe 直接把 url 赋值给 location.href 会从当前页面跳转到 url 的页面，如果我们在当前页面新建一个 iframe 并给它的 src 赋值这个 url ，似乎可以通过 iframe 的 window.location 拿到 url 的各个属性。
- 我们创建了一个 a 元素，并给它的 href 赋值了 url ，可以打印出这个 a 元素的对象，其中就包括 url 的这些属性。
- 利用 a 元素来解析 url 算是奇淫巧技吧，其实现代浏览器提供了一个创建的 URL 对象的构造函数—URL()，直接把 url 当作参数传入，就会返回一个 URL 对象。

**196. URL.createObjectURL()创建后不用了记得用 URL.revokeObjectURL()释放掉 **

**197. vuerouter 的路由导航一般只生效在页面级组件 **

**198. prehooks 的钩子配置 husky 可以在上传 git 的时候检测代码格式**

> [git commit 前检测 husky 与 pre-commit](https://www.jianshu.com/p/f0d31f92bfab)

**199. Function.prototype -》 ƒ () { [native code] } 它的 prototype 不是个标准对象**

**200. vue store commit 同时触发多个的时候，只会响应一个？？什么原因 ？有时间研究下**

**201. 百度地图地块坐标虽然你传给后台的是百度地图获取的坐标，但是在去画地块的时候，一定要再次 new BMap.Point(lng, lat);**

**202. vue keepalive 的页面它的 watch 会一直监听！贼恐怖**

**203. `text-transform`这个 css 属性可以更改英文的大小写**

**204. vue-router router-link 阻止跳转的一个方案**

1. 利用`tag`属性，将 router-link 渲染成 a 或别的跳转功能标签之外的标签（修改默认右键菜单也行）
2. 不需要跳转的 to 属性设置一个固定的路由链接
3. 在页面级组件中，利用路由守卫拦截 2 中的路由连接即可

**205. transition 动画过程中多个子重叠优先级问题（鼠标右移和左移显示效果不一样）**

- 大概就是这样一个场景 一个列表 五个 li 然后鼠标放上去放大 放大后的要遮住旁边的 li 鼠标从左往右的时候，即将开始动画的在即将结束动画的 DOM 结构之上，而从右往左，是结束的在上面 开始的在下面，于是利用 z-index 的方案来解决了这个问题

```css
li {
  position: relative;
  z-index: 1;
  display: inline-block;
  width: 227px;
  height: 290px;
  text-align: center;
  margin-right: 24px;
  background: linear-gradient(
    180deg,
    rgba(83, 77, 51, 1),
    rgba(198, 184, 119, 1)
  );
  border-radius: 8px;
  transition: transform 0.4s linear, box-shadow 0.4s linear;
  &:hover {
    transform: scale(1.3);
    box-shadow: 0 0 60px #000;
    z-index: 2;
  }
}
```

**206. 静态作用域动态作用域**

> [JavaScript 深入之词法作用域和动态作用域](https://github.com/mqyqingfeng/Blog/issues/3)

- 因为 JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了。
- 而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的。

```javascript
var value = 1;

function foo() {
  console.log(value);
}

function bar() {
  var value = 2;
  foo();
}

bar();

// 结果是 ???
```

- 假设 JavaScript 采用静态作用域，让我们分析下执行过程：

- 执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value，如果没有，就根据书写的位置，查找上面一层的代码，也就是 value 等于 1，所以结果会打印 1。

- 假设 JavaScript 采用动态作用域，让我们分析下执行过程：

- 执行 foo 函数，依然是从 foo 函数内部查找是否有局部变量 value。如果没有，就从调用函数的作用域，也就是 bar 函数内部查找 value 变量，所以结果会打印 2。

- 前面我们已经说了，JavaScript 采用的是静态作用域，所以这个例子的结果是 1。

**207. 阿里网页支付有的浏览器可以有的浏览器不可以**

- 我们项目的原因是表单没有设置`acceptCharset = "UTF-8"`

**208. vue 多层传递数据和事件 $attrs/$listeners**

> https://www.cnblogs.com/mengfangui/p/9995470.html

- 组件传值一般是通过 props 传值的。inheritAttrs 默认值为 true，true 的意思是将父组件中除了 props 外的属性添加到子组件的根节点上(说明，即使设置为 true，子组件仍然可以通过\$attr 获取到 props 意外的属性)
- inheritAttrs:false 后（请将 fatherDom.vue 添加 inheritAttrs:false），coo 属性就不会显示在 fatherDom 根节点上了。但是怎么获取到 coo 呢？这时就通过\$attrs 获取到到 coo。
- 爷爷

```vue
<Father :datas="666" />
```

- 父

```vue
<Child v-bind="$attrs" v-on="$listeners" />
```

- 子

```vue
<div>{{datas}}</div>
{ props: [datas]}
```

**209. box-shadow 的控制可以精确到像素级**

> [CSS3 box-shadow 盒阴影图形生成技术](https://www.zhangxinxu.com/wordpress/2013/11/css-css3-box-shadow-%E7%9B%92%E9%98%B4%E5%BD%B1-%E5%9B%BE%E5%BD%A2%E7%94%9F%E6%88%90%E6%8A%80%E6%9C%AF/)

```css
box-shadow: 30px 15px #8e1a19, 45px 15px #ac0500, 75px 15px #f73f0c, 90px 15px
    #fa5f27, 15px 30px #740100, 30px 30px #8e0500, 45px 30px #8e1918, 60px 30px
    #ca1300, 75px 30px #f34f2b, 90px 30px #df351f, 105px 30px #f77c2a, 15px 45px
    #4b0000, 30px 45px #690100, 45px 45px #8e0f0b, 60px 45px #bf1000, 75px 45px
    #f84010, 90px 45px #f04222, 105px 45px #fa5724, 15px 60px #451312, 30px 60px
    #5a0100, 45px 60px #840e0c, 60px 60px #a51d1a, 75px 60px #ed2805, 90px 60px
    #d9321e, 105px 60px #f44622, 30px 75px #3b0000, 45px 75px #5d1a1b, 60px 75px
    #8e1a19, 75px 75px #a80700, 90px 75px #b90a00, 45px 90px #3d0000, 60px 90px
    #551415, 75px 90px #670100, 60px 105px #340000;
```

**210. 同一个浏览器多个 tab 页面如何登入同一个项目不同角色**

- localstorage 配合用户 id 方案，不行 即便可以通过用户 id 区分用户的 token，但是一旦刷新，这个用户的 id 就不知道了（id 用本地存储存下来也无法鉴别），除非重新登录，
- sessionstorage 后端 token 没失效，用户需要重新登录，新页面打开 token 也失效
- cookie 和 localstorage 一样道理
- 如果要做需要后端配合 静默登录

**211. vue extends extend minxins mixin**

- extends 和 mixins 是用在单页面（不一定准确）中
- extends 可以继承 vue 文件
- mixins 继承 js 文件
- extend mixin 是全局的 具体区别和用法看文档 还是和带 s 的有差别的
- extends 只能继承一个 mixins 可以继承多个
- extends 并不能继承 template 因为 组件没暴露 template 哈哈

**222. &times 被替换成 x 的解决办法**

> [&times 被替换成 x 的解决办法](https://www.cnblogs.com/wobeinianqing/p/7067547.html)

- 将统一资源定位器中的&替换成`&amp;` 注意带上分号。

**223. vue 中如果接口返回的字段和你默认的字段中有缺失， 不能直接赋值，会不能修改**

- 比如你的默认字段是

```js
form = {
  name: "",
  password: "",
};
```

- 但是接口返回的没有`password`，如果你`this.form = res.data`会导致`password`无法编辑，老版本不会这样
- 你可以给 res 补充上这个字段 或者用`Object.assign`

**223. elementui 的 dlg 隐藏时并不会销毁，记得在隐藏时移除一些不必要的监听**

**224. 页面可以再接口获取完成之后再渲染，减少页面重绘次数，期间用 loading 显示**

**225. es6 class extends 的 super**

- 子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错。这是因为子类自己的 this 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用 super 方法，子类就得不到 this 对象
- 其实 super(…) 做的事情就是生成一个 this。因为在原型继承中，如果一个类要继承自另一个类，那就得先实例化一次它的父类作为作为子类的原型。如果不做这件事，子类的原型就不能确定，当然也就无法创建 this。所以如果在 constructor 中没有 super(…) 就企图获取 this 就会报错

**226. 小程序企业版需要很多资质**

- 视频如果没有特殊需求可以传到腾讯视频用腾讯的插件 `txs-video`
- 企业小程序很多分类需要资质审核，企业要有一些相关资质才可以
- 很坑。。。

**227. 为什么 vue-cli 中只需要实例化一次 vue?**

- export default 的是一个对象 Object，然后父组件通过 components 属性注册，其实是内部调用了 Vue.extend 方法，把这个 Object 传入，然后得到的也是一个 Vue 的实例。为啥用 Vue.extend 而不是直接 new Vue，因为他们要建立父子关系，形成一个 Vue 的组件树。
- 组件里的 data 必须是一个方法，因为组件是多个实例，如果 data 是一个同一个 object，那么一个组件的修改会影响另一个，因此它必须返回一个方法。

**228. background-image 切换时配合 transition 也是有动画的**

**229. threejs 可以播放全景视频，全景视频直播还没测试**

**230. 深拷贝的注意点**

1. 对象的属性值是函数时，无法拷贝。
2. 原型链上的属性无法获取
3. 不能正确的处理 Date 类型的数据
4. 不能处理 RegExp
5. 会忽略 symbol
6. 会忽略 undefined

```javascript
function deepClone(obj) {
  //递归拷贝
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Date) return new Date(obj);
  if (obj === null || typeof obj !== "object") {
    //如果不是复杂数据类型，直接返回
    return obj;
  }
  /**
   * 如果obj是数组，那么 obj.constructor 是 [Function: Array]
   * 如果obj是对象，那么 obj.constructor 是 [Function: Object]
   */
  let t = new obj.constructor();
  for (let key in obj) {
    //如果 obj[key] 是复杂数据类型，递归
    if (obj.hasOwnProperty(key)) {
      //是否是自身的属性
      t[key] = deepClone(obj[key]);
    }
  }
  return t;
}
```

**231. 好的产品 er 太重要了，不然只会让你做重复无用功。。。。吐槽**

**232. 天地图的卫星图比较全**

**233. vue 的自定义指令 bind 在 dom 不变的时候不会再触发了，可以通过移除 dom 去触发 虽然损失点性能**

**234. 移动端返回页面不刷新解决方案**

> [https://www.jianshu.com/p/a8ecfb73a22a](移动端点击返回键，页面不刷新解决方案)

```javascript
// 点击浏览器返回按钮，404页面刷新
window.addEventListener("pageshow", function (event) {
  //event.persisted属性为true时，表示当前文档是从往返缓存中获取
  if (event.persisted) location.reload();
});
```

**235. es5 实现 class 有感**

- 源码

```javascript
/**
作者：yeyan1996
链接：https://juejin.im/post/5cef46226fb9a07eaf2b7516
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
*/
function inherit(subType, superType) {
  subType.prototype = Object.create(superType.prototype, {
    constructor: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: subType,
    },
  });
  Object.setPrototypeOf(subType, superType);
}
```

- ES6 的 class 内部是基于寄生组合式继承，它是目前最理想的继承方式，通过 Object.create 方法创造一个空对象，并将这个空对象继承 Object.create 方法的参数，再让子类（subType）的原型对象等于这个空对象，就可以实现子类实例的原型等于这个空对象，而这个空对象的原型又等于父类原型对象（superType.prototype）的继承关系
- 而 Object.create 支持第二个参数，即给生成的空对象定义属性和属性描述符/访问器描述符，我们可以给这个空对象定义一个 constructor 属性更加符合默认的继承行为，同时它是不可枚举的内部属性（enumerable:false）
- 而 ES6 的 class 允许子类继承父类的静态方法和静态属性，而普通的寄生组合式继承只能做到实例与实例之间的继承，对于类与类之间的继承需要额外定义方法，这里使用 Object.setPrototypeOf 将 superType 设置为 subType 的原型（`Sub.__proto__ === Super // true`），从而能够从父类中继承静态方法和静态属性
- 静态方法和静态属性用 es5 实现就是如下，这些方法实例不可继承

```javascript
function Super(){};
Super.speak = function(){console.log('woff!!!'， this)}
Super.name = 'xxx'
// 类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
// 静态属性指的是 Class 本身的属性，即Class.propName，而不是定义在实例对象（this）上的属性。
```

- 实例代码

```javascript
function inherit(subType, superType) {
  subType.prototype = Object.create(superType.prototype, {
    constructor: {
      enumerable: false,
      configurable: true,
      writable: true,
      value: subType,
    },
  });
  // 注释掉这里  Sub.speak()将会报undefined
  //       Object.setPrototypeOf(subType, superType)
}

function Super() {}
Super.speak = function () {
  console.log("666", this);
};

function Sub() {}

inherit(Sub, Super);

var s = new Sub();
```

**236. 火狐 drapstart 不生效可能因为你没传 dataTransfer**

**237. fileReader 可以读 text 文本奥！**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <input type="file" onchange="fileChange(event)" />
    <textarea name="" id="textContent" cols="30" rows="10"></textarea>
    <script>
      function fileChange(event) {
        var file = event.target.files[0];
        if (file && /text/.test(file.type)) {
          var fileRead = new FileReader();
          fileRead.onload = function (result) {
            var $el = document.getElementById("textContent");
            $el.value = this.result;
          };
          fileRead.readAsText(file, "gbk");
        }
      }
    </script>
  </body>
</html>
```

**238. input 搜索一定要抽出来抽出来！不然让你去个首尾空格的要从 axios 处理，不好，又吃一个这亏**

**239. 规范 git 提交信息，请使用 commitlint**

> [git commit 提交规范 & 规范校验](https://blog.csdn.net/y491887095/article/details/80594043) > [如何写好 Git commit messages](https://www.cnblogs.com/cpselvis/p/6423874.html) > [git commit 规范指南](https://www.jianshu.com/p/201bd81e7dc9?utm_source=oschina-app)

```text
用于说明 commit 的类别，只允许使用下面7个标识。

    feat：新功能（feature）
    fix：修补bug
    docs：文档（documentation）
    style： 格式（不影响代码运行的变动）
    refactor：重构（即不是新增功能，也不是修改bug的代码变动）
    test：增加测试
    chore：构建过程或辅助工具的变动



如果type为feat和fix，则该 commit 将肯定出现在 Change log 之中。
```

**240. axios 设置 baseurl 后，会多请求一次因为啥？我发现的场景是 baseURL 设置成了当前域名**

- 在源码里打印，axios-lib-core 的 requrest 方法中，打印传来的 config 参数，第一次打印出来的是 vue 的方法，然后 axios 进行了 merge 合并，url 变成了 baseURL，所以就请求了这次，为啥第一次传进来的是 vue？？ 研究中

**241. focus 状态下的 dom，按键盘的 enter 键会触发 click 事件**

- 解决方案就是 让这个 dom blur 可以通过 documnet.activeElement 来获得当前 focus 的 DOM

**242. Object.assign 和 Object.create 的一些理解**

- assign 不继承原型 浅拷贝的**proto**是 Object 而 Object.create 的 proto 指向它继承来的那个对象 从而让整个原型链串起来
- assign 可以合并 浅拷贝俩对象 而 create 就是继承

**243. Array.prototype.methods.apply()的妙用**

- Array.prototype.concat.apply([], [1,2,[3,4,[5,6]]]) // [1, 2, 3, 4, Array(2)] 可以铺平 2 维数组
- Array.prototype.push.apply() 可以合并数组

**244. vue 源码阅读笔记 beforeMount，mounted 和 beforeUpdate**

> https://ustbhuangyi.github.io/vue-analysis/prepare/ 看肥神的课程啊

- created 周期执行之后，判断是否存在 el，不管 el 是啥，只要有值就进行下一步，执行`vm.$mount`
- 而`$mount`根据 vue 的执行环境，有不同的逻辑，我看的是 web 执行环境的，所以`$mount`封装在了`platforms/web/index.js`，在这里判断 el 是否存在，不存在设置为`undefined`，之后调用`mountComponent`方法， `mountComponent`方法在`core/instance/lifecycle`
- 我们再来看`mountComponent`方法，先把 el 赋值给`vm.$el`，之后判断`render`函数可有，没有的话，渲染个空 dom（这就是为啥报错了渲染的是空的），如果是开发环境，报错。不管有没有报错接下来都会触发`beforeMount`周期。
- 在之后就是设置 updateComponent 方法，根据是否需要性能展示，有不同的处理逻辑，但最后都会调用`vm._update`方法。
- `vm._update`方法封装在`lifecycle.js`中的，`vm._update`接受一个 vnode 和服务端渲染相关的标识,看其核心，`vm.__path__`。
- `vm.__path__`就是`Vue.prototype.__path__`，也是根据执行环境不同，有不同的处理方式，我们看的是 web 环境，所以在`platforms/web/runtime/index.js`中，可以看到`Vue.prototype.__patch__ = inBrowser ? patch : noop`,这个`patch`方法在`platforms/web/runtime/patch.js`中。
- `patch.js`中做的事大概可以概括为暴露`createPatchFunction`方法，`createPatchFunction`方法使用了`event style dom-props class attrs transition ref 和directives`这些包，它的执行结果就是把 vnode 转换成 html，其中有`scoped`的处理和`keep-alive`的处理。
- 再回到`mountComponent`方法中，添加好`update`要做的事情之后，会创建一个`watcher`，在触发变化的时候，观察者会判断是否已经`mounted`并且没有`destoryed`组件，去执行`beforeUpdate`周期。
- 创建好 watcher 之后，让服务端渲染的标示给`false`（服务端用这个干嘛的？），之后判断如果`vm.$vnode == null`,那么久代表 dom 已经可以操作，让`_isMounted`等于`true`，触发`mounted`周期
- 为啥`vm.$vnode == null`？ `vm.$vnode` 表示 Vue 实例的父虚拟 Node，所以它为 Null 则表示当前是根 Vue 的实例。(摘自肥神)

**245. axios 的 canceltoken 在多个相同请求的场景中的使用**

> 参考[axios 取消接口请求](https://www.jianshu.com/p/22b49e6ad819)

- 业务场景分析： 一个列表页，每行包含很多个业务信息，其中有两个字段`剩余流量`，`已用流量`是后端要查询移动那边的接口，查移动的接口很慢，于是考虑把查列表和查数据流量的接口拆分开，于是就有了现在的业务场景。待请求完列表的接口后，先把列表的数据渲染到页面上，之后再请求数据流量的接口，查到数据流量的数据后，通过`vm.$set`将流量数据和列表数据拼在一起，这样用户在进页面的时候不会感觉到等待很久，提升用户体验。但是也带来了一个问题，数据流量还没查到，用户搜索，点下一页等操作**触发重新获取列表数据**，这个时候需要**取消掉未请求结束的获取流量的请求**，于是就用到了`cancelToken`来取消 axios 的请求。
- 由于是同时多个请求，我们可以定义一个数组`arr`，用来管理每个请求的 canceltoken
- 假设有 10 个请求，每个请求设置一个 canceltoken 加入到`arr`中
- 请求结束，从数组中移除这个 canceltoken
- 如果请求数据流量的没结束，从新获取列表数据了，那么久清除`arr`中所有的请求链接

**245. element-ui 的 tooltip/popover 显示的时候 dom 变化，宽度没变**

- 查源码 使用`updatePopper`方法即可

```javascript
// 因为一开始是一个加载圈 后来填了数据 但是 tooltip没有更新dom结构 通过这个方法去更新
this.$nextTick(() => {
  setTimeout(() => {
    // popover 就是 <popover ref="popover">
    this.$refs.popover && this.$refs.popover.updatePopper();
    // 加延迟因为nextTick不准确 回头翻翻源码
  }, 16.67);
});
```

**246. js 微任务 宏任务**

> [这一次，彻底弄懂 JavaScript 执行机制](https://juejin.im/post/59e85eebf265da430d571f89)

- 1. 同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入 Event Table 并注册函数。
  2. 当指定的事情完成时，Event Table 会将这个函数移入 Event Queue。
  3. 主线程内的任务执行完毕为空，会去 Event Queue 读取对应的函数，进入主线程执行。 4.上述过程会不断重复，也就是常说的 Event Loop(事件循环)。

```javascript
let data = [];
$.ajax({
  url: www.javascript.com,
  data: data,
  success: () => {
    console.log("发送成功!");
  },
});
console.log("代码执行结束");

// ajax进入Event Table，注册回调函数success。
// 执行console.log('代码执行结束')。
// ajax事件完成，回调函数success进入Event Queue。
// 主线程从Event Queue读取回调函数success并执行。
```

- macro-task(宏任务)：包括整体代码 script，setTimeout，setInterval
- micro-task(微任务)：Promise，process.nextTick

**247. MathMl**

- MathML 是数学标记语言，是一种基于 XML（标准通用标记语言的子集）的标准，用来在互联网上书写数学符号和公式的置标语言。

**248. trigger 在 vue 中的实现**

```javascript
function trigger(el, type) {
  const e = document.createEvent("HTMLEvents");
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}
```

**249. IE9 input 的 backspace、delete 和右键操作兼容**

- input 的 backspace、delete 可以通过 keyup 解决
- 右键复制粘贴和剪切可以通过监听 document 的 selectionChange 解决

```javascript
document.addEventListener("selectionchange", () => {
  // 获取当前focus/激活的元素
  const el = document.activeElement;
  // 如果vmodel存在  触发一下input事件  干嘛用的？
  if (el && el.vmodel) {
    trigger(el, "input");
  }
});
```

**249. IE10&11 给 textarea 设置 placeholder 时的兼容**

```javascript
// #7138: IE10 & 11 fires input event when setting placeholder on
// IE10 11 或触发input事件在textarea设置placeholder的时候
// <textarea>... block the first input event and remove the blocker
// 阻塞第一个input事件然后移除立即移除阻塞来解决
// immediately.
/* istanbul ignore if */
if (
  isIE &&
  !isIE9 &&
  el.tagName === "TEXTAREA" &&
  key === "placeholder" &&
  value !== "" &&
  !el.__ieph
) {
  const blocker = e => {
    // 阻止事件冒泡并且阻止相同事件的其他侦听器被调用。
    e.stopImmediatePropagation();
    el.removeEventListener("input", blocker);
  };
  el.addEventListener("input", blocker);
  // $flow-disable-line
  el.__ieph = true; /* IE placeholder patched */
}
el.setAttribute(key, value);
```

**250. \u202D 隐藏字符**

```javascript
"\u202D3777308808";
// "‭3777308808"
```

**250. 一个按照顺序异步执行的解决方案引发的 event loop 的思考**

```javascript
let p = Promise.resolve();
for (let i = 0; i < 5; i++) {
  p = p.then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(i);
        resolve();
      }, 500);
    });
  });
}
p.then(() => {
  console.log("完成");
});
// 0 1 2 3 4 完成
```

- **一阶段宏任务**
- 代码开始 p 的状态是 resolve
- 在第一~五次 for 循环的时候，`()=>{return new Promise...}`被加入到一阶段微任务队列中，此时微任务队列[then(()=>{return new Promise}) * 5]
- for 执行完之后，执行 then(()=>{console.log('完成')})，由于这是一个微任务，所以它加入到了一阶段微任务队列的最后一位，这时微任务队列是[then(()=>{return new Promise}) * 5, then(()=>{console.log('完成')})]
- **一阶段微任务**
- 宏任务执行完毕，执行第一个微任务，由于第一个 p 是 Promise.resolve()，所以执行微任务队列中第一个 then 回调，执行结果中有一个宏任务，放入第二阶段宏任务中。第一个微任务结束的时候，p 变为了 peading 状态（因为 return 的是一个新的 promise），所以剩下几个微任务并不能触发响应，不打印，此时微任务队列[then(()=>{return new Promise}) * 4, then(()=>{console.log('完成')})]，接下来执行第二阶段宏任务
- **二阶段宏任务**
- setTimeout(()=>{console.log(0);resolve()}),打印 0，返回一个 resolve 状态，这时 p 又变为了 resolve 状态
- 而根据 event queue 的机制，宏任务执行完毕之后，会检查微任务是否还有没执行的，这时从微任务队列中拿到第一个微任务（因为微任务执行后就从队伍中移除了，如果不移除的话，这是第二个微任务）。
- 这个微任务执行完毕后，它又会创建一个宏任务，而 p 又变成了 peading 状态，就是第三阶段宏任务，这个微任务执行完毕之后，执行余下的微任务，但是因为 p 的状态是 peading，并没有有所触发，所以执行第三阶段宏任务
- **第三阶段宏任务**
- setTiemout 打印 1，以此类推，直到第五次打印的结果为 4，for 循环所带来的 event queue 已经结束，setTimeout 宏任务执行完后返回的 resolve 触发了微任务队列的最后一位成员，所以打印了**完成**

**251. jsx 中使用$attrs $listeners**

```javascript
const attributes = {
  attrs: this.$attrs,
  on: this.$listeners,
};
return <div {...attributes}>232</div>;
```

**252. 模拟一个 new**

```javascript
// 创建一个新对象
// j将构造函数的作用域赋值给新对象  this就指向了这个
// 执行构造函数中的代码
// f返回这个对象

function _new() {
  const Constructor = Array.prototype.shift.call(arguments);
  const obj = new Object();
  obj.__proto__ = Constructor.prototype;
  Constructor.apply(obj, arguments);
  return obj;
}

var Dog = function (name) {
  this.name = name;
};
Dog.prototype.bark = function () {
  console.log("wangwang");
};
Dog.prototype.sayName = function () {
  console.log("my name is " + this.name);
};

var simao = _new(Dog, "simao");

simao instanceof Dog; // true
```

**252. 又一个考察宏任务微任务的题**

```javascript
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
console.log("script start");
setTimeout(function () {
  console.log("setTimeout");
}, 0);
async1();
new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});
console.log("script end");
```

- **一轮宏任务**
- 整体执行 script start
- 遇到 setTimeout 放入宏任务
- 遇到 async1 不要被迷惑，async 只是个标识符 虽然返回的是个 promise 但是这里并没有回调 还是一轮宏任务中的
- 输出 async1 start
- 遇到 await 也不要迷惑 它等待一个 promise 的回调 遇到函数直接输出 但是 async2 有个 async，所以他是个 promise 对象 由于它内部没有 resolve 和 reject 所以可以直接执行 但是就决定了这个是个微任务 会放入微任务中执行 由于这一阶段并没有执行到 所以会阻塞 他的执行结果 所以可以看做 async2().then(()=>{console.log('async1 end')}) 放入微任务 这是第一个微任务
- 所以 async2 正常执行 输出 async2
- 接着执行 输出 promise1 然后变成 有了个 promise 的状态但是 then 还是微任务放入微任务队列
- 接着输出 script end
- 所以一轮宏任务执行完后 输出的是 script start、 async1 start、 async2、 promise1、 script end
- **一轮微任务**
- 第一个微任务 执行 输出 async1 end
- 第二个微任务 输出 promise2
- **二轮宏任务**
- 输出 setTimeout

**253. vue 过滤用户输入的对应值**

```javascript
const decodingMap = {
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&amp;": "&",
  "&#10;": "\n",
  "&#9;": "\t",
  "&#39;": "'",
};
```

**254. 一直以为输入多个空格浏览器只解析成一个是就是这样的，其实不是**

- 可以使用 white-space 更改
- 给自己一个警醒，写东西一定要想为啥会是这样，而不是它就是这样的。

**255. word 转 html 的一个思路**

1. 将 word 文档通过 wps/word 打开，另存为 html 文件
2. html 文件先别打开，鼠标右键使用记事本打开
3. 点击另存为，在下方编码中选择`utf-8`格式 并保存
4. 在页面中找到 meta 中的编码，改为`utf-8`
5. 将导航部分使用`nav`标签包裹，删除多余的`dom`
6. 引入`index.css`,`index.js`即可(自己写的样式和滚动逻辑之类的)

**256. nodejs 调用 tiny 的接口压图片**

```javascript
const fs = require("fs");
const path = require("path");
const tinify = require("tinify");
// 在这里填入key  免费的一个月只有500张 别想用我的 hhh
tinify.key = "";

// root是文件目录
const root = "./index.files/",
  exts = [".jpg", ".png"],
  max = 5200000; // 5MB == 5242848.754299136

fileList(root);

// 获取文件列表
function fileList(folder) {
  fs.readdir(folder, (err, files) => {
    if (err) console.error(err);
    files.forEach(file => {
      fileFilter(folder + file);
    });
  });
}

// 过滤文件格式，返回所有jpg,png图片
function fileFilter(file) {
  fs.stat(file, (err, stats) => {
    if (err) return console.error(err);
    if (
      // 必须是文件，小于5MB，后缀 jpg||png
      stats.size <= max &&
      stats.isFile() &&
      exts.includes(path.extname(file))
    ) {
      const source = tinify.fromFile(file);
      source.toFile(file);
    }
    if (stats.isDirectory()) fileList(file + "/");
  });
}
```

**257. 解决多个数字的百分比相加不是 100 的问题——使用最大余额法**

> [百度 echarts 饼图百分比的计算规则---最大余额法 ](https://qjzd.net/topic/59a3fee2b9fded0f2581c257)

```javascript
/**
 *
 * 给定一个精度值，计算某一项在一串数据中占据的百分比，确保百分比总和是1（100%）
 * 使用最大余额法
 * Get a data of given precision, assuring the sum of percentages
 * in valueList is 1.
 * The largest remainer method is used.
 * https://en.wikipedia.org/wiki/Largest_remainder_method
 *
 * @param {Array.<number>} valueList a list of all data 一列数据
 * @param {number} idx index of the data to be processed in valueList 索引值（数组下标）
 * @param {number} precision integer number showing digits of precision 精度值
 * @return {number} percent ranging from 0 to 100 返回百分比从0到100
 */
function getPercentWithPrecision(valueList, idx, precision) {
  if (!valueList[idx]) {
    return 0;
  }

  var sum = valueList.reduce(function (acc, val) {
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  if (sum === 0) {
    return 0;
  }
  console.log("sum", sum);
  // sum 9
  var digits = Math.pow(10, precision); // digits 100
  console.log("digits", digits);
  var votesPerQuota = valueList.map(function (val) {
    return ((isNaN(val) ? 0 : val) / sum) * digits * 100; // 扩大比例，这样可以确保整数部分是已经确定的议席配额，小数部分是余额
  });
  console.log("votesPerQuota", votesPerQuota);
  // votesPerQuota [ 2222.222222222222, 4444.444444444444, 3333.333333333333 ] 每一个项获得的议席配额，整数部分是已经确定的议席配额，小数部分是余额
  var targetSeats = digits * 100; // targetSeats 10000 全部的议席
  console.log("targetSeats", targetSeats);
  var seats = votesPerQuota.map(function (votes) {
    // Assign automatic seats.
    return Math.floor(votes);
  });
  console.log("seats", seats);
  // seats [ 2222, 4444, 3333 ] 获取配额的整数部分
  var currentSum = seats.reduce(function (acc, val) {
    return acc + val;
  }, 0);
  console.log("currentSum", currentSum);
  // 9999 表示已经配额了9999个议席，还剩下一个议席
  var remainder = votesPerQuota.map(function (votes, idx) {
    return votes - seats[idx];
  });
  console.log("remainder", remainder);
  // [ 0.2222222222221717, 0.4444444444443434, 0.33333333333303017 ]得到每一项的余额
  // Has remainding votes. 如果还有剩余的坐席就继续分配
  while (currentSum < targetSeats) {
    // Find next largest remainder. 找到下一个最大的余额
    var max = Number.NEGATIVE_INFINITY;
    var maxId = null;
    for (var i = 0, len = remainder.length; i < len; ++i) {
      if (remainder[i] > max) {
        max = remainder[i];
        maxId = i;
      }
    }
    // max: 0.4444444444443434, maxId 1
    // Add a vote to max remainder.
    ++seats[maxId]; // 第二项，即4的占比的坐席增加1
    remainder[maxId] = 0;
    ++currentSum; // 总的已分配的坐席数也加1
  }

  return seats[idx] / digits;
}
```

**258. nodebb wss 报错解决**
https://blog.csdn.net/qq_37540004/article/details/99058160

**259. vscode 快捷操作**

- https://code.visualstudio.com/docs/getstarted/tips-and-tricks#vscode

**260. 多个 await 命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。**

```javascript
// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```

**261. encodeURI encodeURIComponent**

- 最大区别 符号的转变 URI 一般只改空格

```javascript
encodeURIComponent(
  "http://127.0.0.1:5501/examples/webgl_loader_3ds_demo.html "
);
// "http%3A%2F%2F127.0.0.1%3A5501%2Fexamples%2Fwebgl_loader_3ds_demo.html%20"

encodeURI("http://127.0.0.1:5501/examples/webgl_loader_3ds_demo.html ");
// "http://127.0.0.1:5501/examples/webgl_loader_3ds_demo.html%20"
```

**262. Threejs 模型重叠闪动问题**
[threejs- z-fighting 问题（模型的重叠部位便不停的闪烁起来。这便是 Z-Fighting 问题）](https://www.cnblogs.com/lst619247/p/9098845.html?tdsourcetag=s_pcqq_aiomsg)

**263. 在使用新语法的时候，看下自己的 babel 是否支持转这个新语法**

- 可看这个帖子 https://segmentfault.com/a/1190000020392040，这个坑还是有必要踩一下。

**264. Vue 如果模板展示的含有插槽，写在插槽外的部分是不会被渲染的**

```vue
<template>
  <HtTable :showTitle="false">
    <template v-slot:tableContain>
      <UpdateBottomAdvDlg
        :visible.sync="dlg.visible"
        :id="dlg.id"
        :datas="dlg.datas"
      ></UpdateBottomAdvDlg>
    </template>

    // 如果这里没插槽 写在这里的话 就不会被渲染
  </HtTable>
</template>
```

**265. 基本类型和基本包装类型**
https://www.cnblogs.com/runhua/p/9588769.html

**266. ES5 的继承和 ES6 的继承有什么区别？**
https://segmentfault.com/a/1190000020391424#articleHeader5

**267. es5 构造函数和 es6 类区别**
https://www.jianshu.com/p/209decedfaf6

```
    ES5的构造函数的原型上的属性和方法可以遍历/ES6 不能够遍历
    ES6的类必须通过new调用，构造函数则可以不用
    类不存在变量提升
    ES6的类没有私有方法和私有属性（正在提议中）
    class多了一个静态方法（static）,里面的this指向的是类本身，静态方法可以被子类继承
    ES6的静态属性和静态方法
    ES6 类多了一个new Target 可以判定new 的构造函数
```

**268. input file 选择文件的时候类型的坑**

- 部分机型不支持`accept=".jpg .png "`之类的写法，会提示无可用操作，尽量改成`image/*`

**269. html video 标签视频铺满解决方案**

- 目前就使用`object-fit` 不过 IE 兼容性不好

**270. threejs 法向量值小数不精确很多位 可以等比放大解决**

**271. threejs 加载 3D 地图思路应该是使用 geojson**

**272. vue3.0 项目构建用到的两个工具 rollup 和 lerna**

- rollup 类似于 webpack 的功能 https://www.rollupjs.com/guide/introduction/
- lerna 是管理 package 的工具 https://juejin.im/post/5a989fb451882555731b88c2

**273. 清除微信浏览器缓存土方法**

- 退出微信号重登 hhhhhhhh

**274. shift + esc 可以查看谷歌内存占用的信息**

**275. Unable to preventDefault inside passive event listener due to target being treated as passive.**

- 关于 passive event listener 的一次踩坑 https://juejin.im/post/5ad804c1f265da504547fe68

**276. Threejs 的精灵用不了动态 gif 图**

**277. Threejs 的 css3Drender 可以使用 dom 渲染到 3d 场景里面 有空学习下写个 demo **

> http://www.mamicode.com/info-detail-2771330.html

**278. ckplayer 不显示控制栏在 ckplayerjs 的 step 的第 29 个**
!!!什么神仙配置
`setup: '1,1,1,1,1,2,0,1,0,0,0,1,200,0,2,1,0,1,1,1,1,10,3,0,0,2,3000,0,'+showControl +',2,0,1,1,1,1,1,1,250,0,90,0,0,0',`

**279. 当 dom 已经全屏的时候，如果需要 video 再全屏，怎么解决**

- 将 video 铺满全屏即可。。。。阻止 video 的全屏事件或者控制条的显示 自己盖一个上去
- 为什么要这样，因为如果不手动铺满，让 video 全屏的话，退出全屏 dom 的全屏也会没有了 影响体验

**280. threejs 使用 EffectComposer 无法透明显示背景**

- 可以给背景加到 scene.background 里 但是会受到辉光效果影响 还在找后续解决放案
- outlinepass 同样有这个问题 https://github.com/mrdoob/three.js/issues/16483 outlinepass 的解决方案是把源码里的

```javascript
var currentBackground = this.renderScene.background;
改成;
var currentBackground = new THREE.Color(0xff0000);
或者改成透明图片;
```

- 新版本的有个 demo https://threejs.org/examples/?q=selective#webgl_postprocessing_unreal_bloom_selective 选择某个地方辉光的 可以研究下

**281. 为什么有些链接打开是预览图片而有些是下载**

> https://stackoverflow.com/questions/20508788/do-i-need-content-type-application-octet-stream-for-file-download

- 主要原因 `Content-Type`和`Content-Disposition`

**282. threejs css2dRender 移动的时候抖动**

- 只需在 translate 改变的 div 中加上 transform translateZ(0)

**283. 一次触发拼多多移动端登录按钮可用的经历**

- 群里有个小伙伴问

```text
小白请教个问题：
比如这个网站http://mobile.yangkeduo.com/login.html
给手机号那个input执行js赋值document.getElementById('user-mobile').value='15888888888';
然后再手动触发各种事件blur，change等，都没有效果
发送按钮一直是灰色，而且通过查看表元素，并没有真正修改value的值，请教大家什么原因，该怎么实现呢？
```

- 翻阅源码后，该网站用的 react 编写的，触发的事件被 react 的事件管理
- 先根据 input 的 id 在控制台搜源码，发现该 dom 只绑定了 change 和 blur 事件，change 又找到了

```javascript
{
	key: "handlePhoneChange",
	value: function(t) {
	    this.phoneNumber = t.target.value && t.target.value.trim(),
	    this.clearError()
}
```

- 遂猜测 t 是 event 对象（明摆着）
- 接着查该 dom 的属性，发现了`__reactEventHandlers$vn2qg9nk8zg` 里面有`onChange`
- 于是将`__reactEventHandlers$vn2qg9nk8zg`保存为全局变量`temp1`

```javascript
const $dom = document.getElementById("user-mobile");
$dom.value = "123456789";
temp1.onChange({ target: $dom });
```

- 一番操作，获取验证码按钮不经过手动触发点亮了

**284. 天地图和百度地图坐标转化**

- https://blog.csdn.net/rrrrroy_Ha/article/details/89374211

**285. undefined.xxx || ''这种形式还是会报错 - -**

**286. threejs 在单页面应用中，占用的内存很难清除**

- 能调用 dispose 的调用 dispose
- 很多层的要遍历 remove 掉

**287. canvas 点击获取图片颜色值核心代码**
`ctx.getImageData()`

**288. cesium 的渲染回调是个好东西很方便**

```javascript
new CallbackProperty(() => {
   return xxxx;
}, false),
```

**289. cesium 做 3Dgis 系统很棒**

- 学习 threejs 和 cesium 这类一定要先看 demo

**290. 求多边形重心**

```javascript
function getHalfArea(p0, p1, p2) {
  var area = 0.0;
  area =
    p0.longitude * p1.latitude +
    p1.longitude * p2.latitude +
    p2.longitude * p0.latitude -
    p1.longitude * p0.latitude -
    p2.longitude * p1.latitude -
    p0.longitude * p2.latitude;
  return area / 2;
}

function getPolygonAreaCenter(points) {
  let sum_x = 0;
  let sum_y = 0;
  let sum_area = 0;
  let p0 = points[0];
  let p1 = points[1];
  let length = points.length;
  for (let i = 2; i < length; i++) {
    let p2 = points[i];
    let area = getHalfArea(p0, p1, p2);
    sum_area += area;
    sum_x += (p0.longitude + p1.longitude + p2.longitude) * area;
    sum_y += (p0.latitude + p1.latitude + p2.latitude) * area;
    p1 = p2;
  }
  let xx = sum_x / sum_area / 3;
  let yy = sum_y / sum_area / 3;
  return { x: xx, y: yy };
}

getPolygonAreaCenter([{longitude: 117.240752, latitude: 31.819288}...]) // {x: 中心点, y: 中心点}
```

**291. es6 阮一峰的书搜索排名不是第一了，记录下网址**

- http://es6.ruanyifeng.com/
- 另外，es6 Array 只加了少许一两个方法

**292. 获取当前月份的前六个月**

```javascript
function getDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const allMonth = year * 12 + month;
  for (let i = allMonth - 6; i < allMonth; i++) {
    console.log(`${Math.floor(i / 12)}-${(i % 12) + 1}`);
  }
}
```

**293. cesium 有 removeAll remove add 等方法很好用**

**294. TS 是趋势，应该拥抱他**

- https://segmentfault.com/a/1190000021344428 TS 笔记小结

**295. 利用 column 实现瀑布流**

> 昨天忘了更新了，忙项目。。

- DOM 结构

```html
<div :class="['column-container', { 'all-data': showAllData }]">
  <div :class="['gateways-list']">
    <template v-for="(item, index) in gateways">
      <transition
        tag="div"
        name="el-zoom-in-center"
        :key="item.model._id || index"
      >
        <!--内容-->
        <div class="bg-contain">...</div>
      </transition>
    </template>
  </div>
</div>
<style lang="scss">
  .column-container {
    &.all-data {
      z-index: 4;
      width: 464px;
      overflow: auto;
      .gateways-list {
        columns: 215px 2;
        column-gap: 0;
        .bg-contain {
          margin-bottom: 10px;
          transform: translate(0, 0) !important;
          position: static;
          break-inside: avoid;
          // float: left;
        }
      }
    }
  }
</style>
```

**296. `user-select:none;`拖拽时加上这个很方便，用户不会选择到东西**

```javascript
    handleMouseDown(event) {
      const { clientX, clientY } = event;
      // 获取盒子的  因为是相对于盒子做的偏移
      const $parent = document.querySelector("#cesiumContainer");
      const $parentBounding = $parent.getBoundingClientRect();
      this.parentX = $parentBounding.left;
      this.parentY = $parentBounding.top;
      // 获取本身相对于屏幕的位置 计算出点击的偏移
      const $bouding = this.$refs.contain.getBoundingClientRect();
      this.offsetX = clientX - $bouding.left;
      this.offsetY = clientY - $bouding.top;
      this.addEvent();
    },
    handleMouseUp() {
      this.removeEvent();
    },
    addEvent() {
      document.addEventListener("mousemove", this.handleMove);
      document.addEventListener("mouseup", this.handleMouseUp);
    },
    removeEvent() {
      document.removeEventListener("mousemove", this.handleMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
    },
    handleMove(event) {
      const { clientX, clientY } = event;
      this.pageX = clientX - this.parentX - this.offsetX;
      this.pageY = clientY - this.parentY - this.offsetY;
    }
```

**297. 如果要计算尺寸的 dom 结构有动画，动画可能会对计算值有影响**

> 今天写 slider 拖拽，有 transform 移动的时候，计算总有偏差，包一层盒子是有原因的。

**298. cesium 的遮挡问题可以使用 disableDepthTestDistance 来解决**

- 这个值就是高度，简单来讲 在这个高度范围内 这个优先级是最高的
- 比如 point1 disableDepthTestDistance 设置为 50,
- point2 disableDepthTestDistance 设置为 100
- 在 100 以外是按默认方式去遮挡，而在 100 以内就是他俩谁大谁在上面

**299. 通用的模块封装暴露规则**

```javascript
var DracoDecoderModule = function (DracoDecoderModule) {};
if (typeof exports === "object" && typeof module === "object")
  module.exports = DracoDecoderModule;
else if (typeof define === "function" && define["amd"])
  define([], function () {
    return DracoDecoderModule;
  });
else if (typeof exports === "object")
  exports["DracoDecoderModule"] = DracoDecoderModule;
```

**300. 项目开始前的规划很重要，如何拆分模块，代码等**

- 不要写一半擦发现这样设计不好，尽量想好再开工！

**301. window.history 和 popstate 事件可以监听浏览器返回**

**302. 长假期间不要忘了充电**

**303. 火狐浏览器在搜索栏输入`about:config`再输入`general.useragent.override`可以修改浏览器标识**

- 比如修改成微信访问的标识`Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12A365 MicroMessenger/5.4.1 NetType/WIFI`就可以访问限制微信访问的页面了。

**304. h(1-6)标签会继承有效父元素的字体大小，但是会基于这个大小放大一定倍数，除非 H 标签被设置了字体大小**

**305. 学习从三个地方思考 如:为什么要有 promise promise 解决了哪些问题 如何解决的**

**306. SVG 可以去画 DOM 之间的连线，很实用**

**307. Cesium 计算面积**

```javascript
// 角度转化为弧度(rad)
const radiansPerDegree = Math.PI / 180.0;
// 弧度转化为角度
const degreesPerRadian = 180.0 / Math.PI;

// 计算面积
    // points是 [{lng, lat,},...]
    // positions 是 [Cartesian3, Cartesian3...]
	// 单位平方公里
   function getAreaNum(points, positions) {
      let res = 0;
      //拆分三角曲面

      for (let i = 0, l = points.length; i < l - 2; i++) {
        let j = (i + 1) % points.length;
        let k = (i + 2) % points.length;
        let totalAngle = this.getAngle(points[i], points[j], points[k]);

        let dis_temp1 = this.getDistance(positions[i], positions[j]);
        let dis_temp2 = this.getDistance(positions[j], positions[k]);
        res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
      }

      return (res / 1000000.0).toFixed(4);
    },

    /*角度*/
    function getAngle(p1, p2, p3) {
      let bearing21 = this.getBearing(p2, p1);
      let bearing23 = this.getBearing(p2, p3);
      let angle = bearing21 - bearing23;
      if (angle < 0) {
        angle += 360;
      }
      return angle;
    },
    /*方向*/
    function getBearing(from, to) {
      let lat1 = from.lat * radiansPerDegree;
      let lon1 = from.lng * radiansPerDegree;
      let lat2 = to.lat * radiansPerDegree;
      let lon2 = to.lng * radiansPerDegree;
      let angle = -Math.atan2(
        Math.sin(lon1 - lon2) * Math.cos(lat2),
        Math.cos(lat1) * Math.sin(lat2) -
          Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
      );
      if (angle < 0) {
        angle += Math.PI * 2.0;
      }
      angle = angle * degreesPerRadian; //角度
      return angle;
    },
    // 获取亮点之间距离
    function getDistance(point1, point2) {
      let point1cartographic = Cartographic.fromCartesian(point1);
      let point2cartographic = Cartographic.fromCartesian(point2);
      /**根据经纬度计算出距离**/
      let geodesic = new EllipsoidGeodesic();
      geodesic.setEndPoints(point1cartographic, point2cartographic);
      let s = geodesic.surfaceDistance;
      //返回两点之间的距离
      s = Math.sqrt(
        Math.pow(s, 2) +
          Math.pow(point2cartographic.height - point1cartographic.height, 2)
      );
      return s;
    }
```

**308. Cesium 加载 Draco 压缩后的模型**

> 走了很多弯路

1. 首先找到`node_modules/cesium/ThirdParty`目录
2. 找到`draco_decoder.wasm`文件。
3. 在项目根目录下的`public`目录下新建`ThirdParty`，将`draco_decoder.wasm`复制进去，然后加载模型的时候什么都不用改，还是

```javascript
model: {
  url: "模型目录";
}
```

4. 就可以加载`Draco`压缩后的 gltf 模型了。
5. 其实就只解析压缩模型的`js`目录问题

**309. cesium 拖拽模型思路**

1. 模型中心点已知，mousedown 点击模型获取当前点击点
2. 算出点击点的世界坐标 然后减去模型中心点的世界坐标
3. mousemove 的时候 当前坐标减去 2 步骤算出的差值 xyz 值都要
4. mouseup 还原初始值不要忘了

**310. nvm 设置淘宝镜像**

1. 验证 nvm 是否安装成功：在 cmd 输入 nvm version，有提示 nvm 版本信息，即安装 成功

2. 然后输入 nvm root，查看到 nvm 的路径信息，我的是 C:\Users\Administrator\AppData\Roaming\nvm，所以在资源管理器上打开这个路径，找到里面的 settings.txt，并打开
3. 在文本的最后一行中加入这两行代码

```text
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

4. 然后保存
5. 保存文件之后，关掉 cmd，再重新打开 cmd，输入：nvm install [version]，就会启用淘宝镜像自动下载安装对应的 node 和 npm 版本。

**311. scss 根据颜色生成对应的 class 名字**

```scss
$colorList: 2dd382, 2dd358, eb6120;
$jing: "#";
@each $type in $colorList {
  .td-#{$type} {
    background: #{$jing}#{$type};
  }
}
```

**312. 图片防盗链的原理一般是通过判断请求的 referer 来判断是否来自自己的服务器，根据这点也可以去破解**

**313. 上线紫金山庄查车牌系统总结**

1. pm2 使用 npm 命令

```shell
 pm2 start  npm --name test -- run dev

 pm2 start npm --name test -- start
```

2. mongodb 数据库也是分角色的 最大的 admin 有所有权限，然后你每加一个数据库都要给这个数据库分配角色才行

**314. 翻墙后无法 node 请求墙外站点** 1.用 shadowsocks 能正常浏览网页，但是用 node 脚本请求的时候无法访问，于是查到这篇文章[翻墙后无法 node 请求墙外站点](https://cnodejs.org/topic/593d631a325c502917ef0881),找到原因，原来是因为`node不会自动通过代理服务器访问，`，又看到`ShadowSocks会产生代理连接，在你的nodejs程序里指定网路走这个代理即可，任何网络操作的库都可以设置代理，另外参考翻墙后。` 2. 于是查`如何用Shadowsocks(R)代理非浏览器软件`，找到这篇[如何用 Shadowsocks(R)代理非浏览器软件](<https://vimcaw.github.io/blog/2018/03/12/%E5%A6%82%E4%BD%95%E7%94%A8Shadowsocks(R)%E4%BB%A3%E7%90%86%E9%9D%9E%E6%B5%8F%E8%A7%88%E5%99%A8%E8%BD%AF%E4%BB%B6%E3%80%81%E6%B8%B8%E6%88%8F/>) 3. 复制请求头，然后把 proxy 写上`http://127.0.0.1:1080`即可

```javascript
const request = require("request");

function action(index) {
  request(
    {
      url: "https://hongzhi.li/",
      method: "get",
      proxy: "http://127.0.0.1:1080",
      headers: {
        // ":authority": "hongzhi.li",
        // ":method": "GET",
        // ":path": "/",
        // ":scheme": "https",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        cookie:
          "__cfduid=dfbcf9cd7cd04cf561e2e420830530db71585626448; _ga=GA1.2.1145598630.1585626450; _gid=GA1.2.378198327.1585626450",
        pragma: "no-cache",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "cross-site",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": 1,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
      },
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("请求成功" + index); // 请求成功的处理逻辑
      } else {
        console.log("error");
      }
    }
  );
}

let index = 1;
// setInterval(() => {
//   index++;

// }, 20);
action(index);
```

**315. gltf-pipeline 使用 draco 算法压缩报错，没有明确提示**

- 可能是模型没有三角化处理，让建模把所有模型三角化。

**316. vue 自定义 v-model**

-

```javascript

model: {
    prop: '这个是传进来的props，比如你v-modle="text",那你的props里面就要写个text',
    event: '这个是触发的事件名字，比如你写了个input 你@input="$emit('testEvent')",那你这里就要写上testEvent'
}

```

- 子

```vue
<template>
  <el-select @change="handleSelectChange" :value="selected">
    <el-option :value="1">1</el-option>
    <el-option :value="2">2</el-option>
  </el-select>
</template>

<script>
export default {
  model: {
    prop: "selected",
    event: "change",
  },
  props: {
    selected: {
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    handleSelectChange(value) {
      this.$emit("change", value);
    },
  },
};
</script>
<style lang=""></style>
```

- 父

```vue
<template>
  <div>
    {{ testValue }}
    <ht-select v-model="testValue"></ht-select>
  </div>
</template>

<script>
import SelectVue from "./Select";

export default {
  components: {
    "ht-select": SelectVue,
  },
  data() {
    return {
      testValue: "1",
    };
  },
};
</script>
<style lang="scss"></style>
```

**317. 骨架屏**

1. 作为 spa 中路由切换的 loading,结合组件的生命周期和 ajax 请求返回的时机来使用.
2. 作为首屏渲染的优化.

**318. windows 系统想使用 shell 命令可以用 git**

**319. 面试题平时看到好的要收藏下来，然后找工作前一个月仔细看看背背，平时难记的多看看，不用天天抱着面试题背**

**320. 面试的部门通过了，如果遇到认识中途让你转部门，一定要问下面试你的人，或者部门里的人，有可能是人事在暗箱操作。**

**321. 通过 dom 获取 vue / react 的组件对象**

- vue 在 dom 对象中是`__vue__`
- react 在 dom 对象中是`__reactInternalInstance 加一串 has`

**322. 有些域名收录会很差，买的时候注意啦！**

**323. Hook 很好用，早学早用，香~**

**324. 找工作一定要多找几家，都是双向选择，有可能你是备胎，所以你也要把公司当备胎**

**325. JS 遗留问题，变量提升**

> https://www.cnblogs.com/Hexa-gram/p/7944645.html

- 在 js 中存在这样一种机制，在程序正式执行之前，会将 var 声明的变量和 function 声明的函数预读到当前作用域的顶部
- 虽然 let 和 const 解决了这个问题，注意代码规范也不会遇到这个问题 但是有时候还是会问到 复习的时候注意下

**326. threejs 做地块的时候，可以搞个透明的 shapes 和实体 shapes 一起就可以点击了**

**327. threejs uv 变化和点击移动摄像机**

- 让贴图循环 然后每次渲染更改 uv 值
- 移动摄像机可以用 tweenjs 移动过去 也可以用 threejs 的曲线函数然后获取点 让摄像机移动这些点就行了

**328. threejs 通过控制器移动镜头效果**

```javascirpt
handleMouseDown(event) {
      this.controls.coupleCenters = true;
      let x = null;
      let y = null;
      if (event.changedTouches) {
        x = event.changedTouches[0].pageX;
        y = event.changedTouches[0].pageY;
      } else {
        x = event.clientX;
        y = event.clientY;
      }
      this.mouse.x = (x / this.width) * 2 - 1;
      this.mouse.y = -(y / this.height) * 2 + 1;
      this.checkIntersection();
    },
    checkIntersection() {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      var intersects = this.raycaster.intersectObjects(this.spriteArr, true);
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        const point = intersects[0].point;
        const name = obj.name;
        if (/^\w+$/i.test(name)) {
          this.animateCamera(
            { x: point.x - 2, y: point.y - 2, z: point.z - 2 },
            point
          );

          // this.changeCameraPosition(point);
          // 由于group中的对象获取不到世界坐标 所以通过终端的数组去获取世界坐标
          obj.children.length <= 0
            ? this.initDiv(obj)
            : this.loadDetail(obj, name);
        }
      }
    },

    animateCamera(position, target) {
      this.controls.enable = false;
      let camera = this.camera;
      let controls = this.controls;
      let tween = new TWEEN.Tween({
        px: camera.position.x, // 起始相机位置x
        py: camera.position.y, // 起始相机位置y
        pz: camera.position.z, // 起始相机位置z
        tx: controls.target.x, // 控制点的中心点x 起始目标位置x
        ty: controls.target.y, // 控制点的中心点y 起始目标位置y
        tz: controls.target.z // 控制点的中心点z 起始目标位置z
      });
      tween.to(
        {
          px: position.x,
          py: position.y,
          pz: position.z,
          tx: target.x,
          ty: target.y,
          tz: target.z
        },
        1000
      );
      tween.onUpdate(function() {
        camera.position.x = this.px;
        camera.position.y = this.py;
        camera.position.z = this.pz;
        controls.target.x = this.tx;
        controls.target.y = this.ty;
        controls.target.z = this.tz;
        // console.log(camera.position, controls.target);
        // controls.update()
      });
      tween.easing(TWEEN.Easing.Cubic.InOut);
      tween.onComplete(() => {
        controls.target = target;
        this.controls.enable = false;
        console.log("结束");
      });
      tween.start();
    },
```

**329. webpack 加了 hash 上线还是没变化？？？**

> [浏览器静态资源缓存问题](https://www.jianshu.com/p/914607715804)

- 很可能是服务端缓存了 index.html

```text
location = /index.html {
    add_header Cache-Control "no-cache, no-store";
}
# Expire rules for static content

# cache.appcache, your document html and data
location ~* \.(?:manifest|appcache|html?|xml|json)$ {
  expires -1;
  # access_log logs/static.log; # I don't usually include a static log
}

# Feed
location ~* \.(?:rss|atom)$ {
  expires 1h;
  add_header Cache-Control "public";
}

# Media: images, icons, video, audio, HTC
location ~* \.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc)$ {
  expires 1M;
  access_log off;
  add_header Cache-Control "public";
}
#ps: nginx也可以通过 expires 指令来设置浏览器的Header, 使用本指令可以控制HTTP应答中的“Expires”和“Cache-Control”的头标（起到控制页面缓存的作用）。
例如  js css缓存一年：
# CSS and Javascript
location ~* \.(?:css|js)$ {
  expires 1y;
  access_log off;
  add_header Cache-Control "public";
}
```

**329. axios 上传进度条**

- 原生一样适用

```javascript
var form = new FormData();
form.append("file", vm.$refs.upload.files[0]);
form.append("id", id);
form.append("type", type);
var config = {
  onUploadProgress: progressEvent => {
    var complete =
      (((progressEvent.loaded / progressEvent.total) * 100) | 0) + "%";
    this.progress = complete;
  },
};
axios.post(`api/uploadFile`, form, config).then(res => {
  if (res.data.status === "success") {
    console.log("上传成功");
  }
});
```

**330. 多试着写正则，很有用的**

**331. 拥抱 hooks 太好用了**

**332. postman 中的 basic auth 在 axios 是{auth:{}}这个参数**

```javascript
//登录
export function login(params) {
  return fetch({
    url: LOGIN,
    method: "post",
    params,
    auth: {
      username: "web",
      password: "web",
    },
  });
}
```

**333. js 没有重载**

- 同名函数会被后面的覆盖
- 函数表达式是运行到这里才会被执行
- 函数声明式是一开始就被提升到顶部

**334. vue2 中不想数据被 vue 监听，又想在 template 中用可以这样写**

```javascript
 export default {
    data(){
      this.list = [...]
      return {}
    }
}
```

**335. 后端返回的数据不要做类型判断，如果数据格式错误就应该报错，如果一定要做异常数据格式判断，要加个提示，不要为了健壮性让该报错的地方不报错**

**336. mac os 生成树结构**
Mac 没有自带的 tree 命令，需要额外安装才可以，操作方法有两种：

一、用 find 命令模拟 tree 效果
1、mac 下默认是没有 tree 命令的，不过我们可以使用 find 命令模拟出 tree 命令的效果，如显示当前目录的 tree 的命令：
$ find . -print | sed -e 's;[^/]\*/;|\_**\_;g;s;\_\_**|; |;g'

2、当然你也可以写一个别名来快速执行该命令，运行如下命令，将上面这个命令写到~/.bash_profile 里，以后直接运行 tree 命令就更方便了:
alias tree="find . -print | sed -e 's;[^/]\*/;|\_**\_;g;s;\_\_**|; |;g'"

二、安装 tree
因为安装 tree 需要用 brew 命令，所以先安装 Homebrew
1、安装 Homebrew https://brew.sh/index_zh-cn.html
在终端输入下面指令
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

2、安装 tree

**337. 项目配置 git 提交检查**

1. 安装依赖

```shell
npm i -D husky lint-staged @commitlint/cli @commitlint/config-conventional
```

2. 根目录创建`commitlint.config.js`

```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
```

3. 修改`package.json`

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,vue}": ["npm run lint", "git add"]
  }
}
```

**338. 在忙也不要忘了学习**

**339. vue computed 传参**

```javascript
computed: {
  text() {
    return function (index) {
      return this.Ratedata[index].currentRate.toFixed(0) + '%';
    }
  }
}


const getActiveStatus = computed(() => index => {
  return activeIndex.value === index;
});
```

**340. services 层应该处理一些数据**

- 避免与业务层耦合度高，举个例子

```javascript
import axios from "@/libs/http";
import { formatDataByType } from "@libs/assist";
import * as types from "@/api/types";

export const getDurgTypeList = params => {
  return axios
    .get(types.GETRootTypeList, params)
    .then(res => formatDataByType(res.data));
};

export const getDrugTypeByIdAndKeyword = params => {
  return axios
    .get(types.GETDrugTypeByIdAndKeyword, params)
    .then(res => formatDataByType(res.data));
};
```

**341. $attrs 只能接收父 props 中没有的，而且不是响应式的**

**342. 当子路由不是菜单如何优雅的进行高亮**

```vue
<template>
  <el-scrollbar class="layout-aside__scrollbar">
    <el-menu :default-active="activeMenu" router>
      <template v-for="item in routes">
        <el-submenu
          :key="item.path"
          :index="item.path"
          v-if="Array.isArray(item.children) && item.children.length > 0"
        >
          <template slot="title">
            <MenuContain :item="item" />
          </template>
          <MenuItem
            v-for="child in item.children"
            :child="child"
            :key="child.path"
            :index="child.path"
          />
        </el-submenu>
        <MenuItem v-else :child="item" :key="item.path" :index="item.path" />
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { computed } from "@vue/composition-api";
import routes from "@router/menuList";
import MenuItem from "./MenuItem";
import MenuContain from "./MenuContain";

export default {
  components: { MenuItem, MenuContain },
  setup(props, { root }) {
    // 设置默认高亮的菜单
    const activeMenu = computed(() => {
      const { meta, path } = root.$route;
      // 这种针对于子路由不是菜单但是又需要高亮菜单的情况
      return meta.activeMenu ? meta.activeMenu : path;
    });

    return {
      routes,
      activeMenu,
    };
  },
};
</script>

<style lang="scss"></style>
```

**343. 弹窗的 visible 维护新思路**

- 以前是父传 props 到子的 el-dialog 组件，子再 emit update 改变父
- 新的思路是用 hooks 想出来的 通过一个外部变量维护 visible 父子通过改变这个变量去控制显示隐藏 就避免了 emit props 这些东西

```js
import { useDialog } from "@hooks/index";
import { ref, onBeforeUnmount } from "@vue/composition-api";

// 在外部管理 它会始终存在直到组件销毁 相当于一个小型vuex
// 我们只通过方法去改变而不能直接改变
const visible = ref(false);

export default function usePackageDialog() {
  const { handleChangeVisible } = useDialog(visible);
  // 组件因为在这里维护的并不会被销毁 所以等销毁后变为false
  // 不能设为null 销毁不掉
  onBeforeUnmount(() => handleChangeVisible(false));

  return {
    visible,
    handleChangeVisible,
  };
}
```

**344. 不知道什么时候开始火狐已经兼容多行省略文本了**

```scss
@mixin textRowEllipsis($row) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $row;
  overflow: hidden;
}
```

**345. vuehook 数据共享可以写在 use 方法外面而方法共享可以使用观察者模式**

```javascript
/**
 * 一个简易的观察者对象
 */
export class Subject {
  constructor() {
    this.observes = [];
  }

  /**
   * 添加一个观察者 key是观察者的id 避免重复 updateFn是回调函数
   * @param {string} key
   * @param {function} updateFn
   */
  addObserve(key, updateFn) {
    const index = this.observes.findIndex(v => v.key === key);
    const observe = { key, updateFn };
    index > -1
      ? this.observes.splice(index, 1, observe)
      : this.observes.push(observe);
  }

  removeAll(SSS) {
    this.observes = [SSS];
  }

  notify() {
    this.observes.forEach(v => v.updateFn());
  }
}
```

**346. onbeforeunload 来显示离开提示**

```js
import { onUnmounted } from "@vue/composition-api";

export default function useBeforeunload() {
  window.onbeforeunload = function () {
    return "确定离开吗？";
  };

  onUnmounted(() => remove());

  function remove() {
    console.log("un");
    window.onbeforeunload = null;
  }
  return { remove };
}
```

**346. 如果几个组件共用一个数据联动 一定要写在 vuex 或者别的能统一管理里面**

**347. 如果产品设计了一款 3 个以上的组件共用一个数据源还要在同个页面联动的产品，一定要拒绝**

- 虽说数据驱动 但是处理起来极度恶心 深坑

**348. 又遇到了数组高阶循环的问题**

1. forEach 循环删除数组 用的 splice，发现清空的时候删不干净，因为删掉一项数组长度就变了，所以总会漏掉
2. 解决方案：用 delte 删除 删完之后 arr = arr.filter(v=>v)

**349. new Date 的奇淫技巧**

- new Date(2014,4,0).toLocaleString()
- "2014/4/30 上午 12:00:00"
- new Date(2014,4,1).toLocaleString()
- "2014/5/1 上午 12:00:00"

**350. scss 根据颜色数组生成类型 class**

```scss
$colorList: (
    type: "primary",
    color: $primaryColor,
  ), (
    type: "success",
    color: $successColor,
  ),
  (
    type: "warning",
    color: $warningColor,
  ), (
    type: "danger",
    color: $dangerColor,
  ),
  (
    type: "info",
    color: $infoColor,
  );

@for $i from 1 through length($colorList) {
  $item: nth($colorList, $i);
  &.#{map-get($item, type)} {
    background: map-get($item, color);
  }
}
```

**351. elementui 打包之后图标偶尔乱码**

> [elementui 生产环境图标加载时偶而乱码](https://blog.csdn.net/palmer_kai/article/details/105728156)

- 如果加载资源没问题的情况下，就是 dart-sass 造成的，打包之后看 app.css el-icon 的里面是不是不能识别的乱码

```shell
npm uninstall sass
npm install node-sass
```

- 之后再打包看到正常了 不是乱码

**352. vue render 函数、jsx 渲染 html 标签**

```javascript
render(h, data) {
   return h("div", {
      domProps: {
          innerHTML: data.row.instanceExeParams // 这里是要渲染的数据
      }
   })
}
```

```javascript
render() {
   return (
      <div id="cropper">
        <div {...{
          domProps: {
            innerHTML: this.previewHTML
          }
          }}>
        </div>
      </div >
    )
  }
  // -------------
  render (createElement) {
     return (
         <button domPropsInnerHTML={htmlContent}></button>
     )
 }
```

**353. mac 动态壁纸是用的是 heic 格式的图片**
这个图片大概内容是一个 json 配置文件加上一些图片，live 图片貌似也是基于这个。
相关资料

1. [https://www.jianshu.com/p/377f31da0c5d](如何自己动手制作macOS系统Heic动态壁纸)
2. [https://zhuanlan.zhihu.com/p/35847861](HEIF/heic图片文件解析)
3. [https://itnext.io/macos-mojave-dynamic-wallpaper-fd26b0698223?gi=dbd14796f401](macOS Mojave dynamic wallpaper. How Apple built dynamic wallpapers? And… | by Marcin Czachurski | ITNEXT)
4. [https://github.com/asvinours/jpeg-to-heif](JPEG image to HEIF image)

**354. scss 如何别写 BEM 规范代码**

```scss
.person {
  @at-root #{&}__hand {
    color: red;
    @at-root #{&}--left {
      color: yellow;
    }
  }
  @at-root #{&}--female {
    color: blue;
    @at-root #{&}__hand {
      color: green;
    }
  }
}
```

提取公共项编写

```scss
@mixin atRoot($modify) {
  @at-root #{&}#{$modify} {
    @content;
  }
}
#app {
  position: relative;
  @include atRoot(__hand) {
    background: red;
  }
}
```

**355. vuerouter 的 base 要开 history 模式貌似才行**

**367. 使用 keepalive 配合全局变量控制弹窗显示的一个问题**

- 当使用了 keep-alive 的时候，el-dialog 组件如果添加到了 body 上，会被缓存下来
- 如果多个 keepalive 页面共用了这个弹窗，那么就会生成很多个相同弹窗不会被销毁
- 如果你是每个路由去单独控制当前路由的这个弹窗那么不会有问题
- 如果你是用 vuex 或者别的全局变量去控制弹窗的显隐，那么就会同时打开这些弹窗，看起来像只打开了一个，其实打开了多个
- 可能最上层的弹窗并没有被传值，导致出错
- 可以通过生命周期去销毁这个组件达到清除缓存的作用

**368. 组件拆分太细了，跨组件传递数据会很麻烦，无形中增加开发难度**

- 可以尝试只抽离复用组件 页面逻辑用 hooks 抽开 mixins 就算了太乱

**369. ?.叫可选链 xxx!.是 ts 的判断，这个属性一定存在的判断**

**370. chrome 浏览器查看 placeholder 样式**

- 在控制台的 setting 中勾选`show user agent shadow DOM`即可
- 另外在做 contenteditable 的 dom 元素时，可以使用设置 placeholder

```css
.input-box:empty::before {
  content: attr(placeholder);
  color: #c0c4cc;
  opacity: 0.8;
}
```

**371. el-select 多选内容不能撑开**

- 在 change 和 tag-remove 中调用此方法

```js
let cacheTagWidthObj = {};

/**
 * 重新计算宽度
 */
function hanldeDiseaseChoicedChange() {
  setTimeout(() => {
    const { $el } = refs.diagnoseSelect;
    if (!$el) {
      return;
    }
    const tagList = Array.from($el.querySelectorAll(".el-tag"));
    let maxWidth = Math.max(
      ...tagList.map(v => {
        const text = v.textContent;
        const cacheWidth = cacheTagWidthObj[text];
        if (isId(cacheWidth)) {
          return cacheWidth;
        } else {
          const { offsetWidth } = v;
          cacheTagWidthObj[v.textContent] = offsetWidth;
          return offsetWidth;
        }
      })
    );
    const minWidth = maxWidth < 192 ? 192 : maxWidth + 20;
    diseaseSelectWidth.value = minWidth + 55;
  }, 0);
}
```

**372. toLocaleString 的妙用**

```javascript
new Date().toLocaleString("ja-JP-u-ca-chinese");
// "一,二三四,五六七,八九〇"

new Number(1234567890).toLocaleString("zh-Hans-CN-u-nu-hanidec");
("庚子年7月24日 16:36:57");

let num = 223232332;
num.toLocaleString();
// '223,232,332'
```

**373. div 加上 tabindex 就可以出发键盘事件了**

**373. getClientRects 可以获取内联元素有多少行**

**374. if 与局部全局变量的关系**

> https://www.zhihu.com/question/265381252

1. if 里的函数声明首先会定义一个全局同名变量 a=undefined

2. if 里的函数赋值会提升到块作用域顶部

3. 执行到函数声明语句时,会把块作用域里的 a 赋值到全局同名变量 a

4. 基于行为诡异，不同浏览器实现不同，建议在 if 里用函数表达式代替函数声明

```javascript
var a = 0;
console.log(window.a, a); // undefined undefined 对应解释1
if (true) {
  console.log(window.a, a); // undefined function a(){} 对应解释2
  a = 0.5;
  console.log(window.a, a); // undefined 0.5
  a = 1;
  console.log(window.a, a); // undefined 1 对应解释2
  function a() {} // 对应解释3
  a = 21;
  console.log(window.a, a); // 1 21
  a = 30;
  console.log(window.a, a); // 1 30
}

console.log(a);
```

**375. 如果是自己的不同项目基本上都能同域**

- 使用 nginx 分发
- 子域名
- 同域名不同路径

**376. node 输出彩色字**

> https://www.jb51.net/article/175493.htm

其原理最重要的一个知识点就是 ANSI Escape code.

ASCII 编码中有些字符是不能用来在终端中打印显示的，比如'\a' 0x7 代表响铃，'\n' 0x0A 代表换行，这些字符被称为控制符。

而其中的一个控制符 '\e' 0x1B 比较特殊，这个字符代表 ESC ，即键盘上 ESC 按键的作用。ESC 是单词 escape 的缩写，即逃逸的意思。文本中出现这个控制符，表示接下来的字符是 ANSI Escape code 编码。

而 ANSI Escape code 编码中有专门控制字符颜色的控制符，例如：\e[31;44;4;1m

\e 控制符的 16 进制码为 0x1B ， 8 进制码为 033

其意义如下：
\e 代表开始 ANSI Escape code
[ 代表转义序列开始符 CSI，Control Sequence Introducer
31;44;4;1 代表以; 分隔的文本样式控制符，其中 31 代表文本前景色为红色，44 代表背景为蓝色，4 代表下划线，1 代表加粗
m 代表结束控制符序列

```javascript
const NODE_EMPTY_TEXT_STYLE = "\x1B[0m";

// 一开始是 \033 这种eslint会报错 在严格模式下不准使用八进制之类的
// 将 \033改为\x1B就行了
console.log(`
${"\x1B[41;32;1;30m"} 注意 ${NODE_EMPTY_TEXT_STYLE}
项目拆分成${"\x1B[91;1m"}多入口${NODE_EMPTY_TEXT_STYLE}了，访问地址出现变动
${"\x1B[31m"}1.${NODE_EMPTY_TEXT_STYLE}能力平台 协议://域名:端口/index.html
${"\x1B[32m"}2.${NODE_EMPTY_TEXT_STYLE}体验平台 协议://域名:端口/index.html
${"\x1B[33m"}3.${NODE_EMPTY_TEXT_STYLE}AI门户   协议://域名:端口/door.html

${"\x1B[42;31;1m"} 例如 ${NODE_EMPTY_TEXT_STYLE}
访问AI门户  http://localhost:8080/door.html
 `);
```

**377. tweenjs 能做好多动画好用**

**378. window.onload ondocumentready**

- onload 会等页面 dom 静态资源加载完毕 html 里的 后面再加的不算
- ondocumentread 只是等待 dom 完毕

**379. 前端脚手架生成工具可以使用 Yeoman 和 plop**

**380. tab 按键阻止默认事件的一些点**

- tab 切换的时候 有时候会失去焦点 或焦点不在 el 上 可以 el.focus 加上 el.click 强制聚焦

**381. 虚拟机能解决一部分问题，但是还是真实的系统试一下比较好**

**382. 什么时候 JS 的权限再高点就好了**

**383. 写代码多考虑维护性 因为以后需求改你就哭了**

**384. 用 split 处理业务逻辑的时候一定小小心 保证这个分隔符是唯一的**

**385. 使用多行文本溢出的时候不要用 padding-bottom**

- 不然会再显示出来

**386. 父元素 opacity 之后子元素会一直受到影响**

**387. elementui 的折叠面板想要点击头部不去展开收起可以自定义一个头部并阻止冒泡**

**388. 富文本编辑器想保证原有样式可以使用 iframe**

- 但是又带来很多问题，比如里面内容宽度超出 iframe 、 iframe 高度
- 超链接跳转

**389. chrome 浏览器滚动条样式还是可以调调的**

**390. antv G6 踩坑记录**

1. 分辨率改变重绘,自适应布局

```js
const { width, height } = $el.getBoundingClientRect();
graph.changeSize(width, height);
```

2. 清空 `graph.clear()`
3. 销毁 `graph.destory()`
4. 数据如何更新？

```js
// 直接修改数据源， 然后调用 graph.changeData()
activeItem.label = diseaseName;
activeItem.diseaseId = abilityId;
graph.changeData();
```

5. 设置 disabled 和 active 状态

```javascript
graph.findAll("node", node => {
  const nodeId = node._cfg.id;
  graph.setItemState(nodeId, "disabled", true);
});
```

6. 键盘事件

```javascript
const key2Event = {
  Backspace: deleteNode,
  Enter: insertBrother,
  Tab: insertChild,
  "ctrl-z": handleCancel,
  "ctrl-y": handleDeCancel,
  "ctrl-c": handleCopyNode,
  "ctrl-v": handlePasteNode,
};
/**
 * 键盘事件的逻辑
 * @param {*} key2Event
 * @param {*} getEditStatus
 */
export default function useKeyEvent(key2Event, getEditStatus) {
  let ctrolActiveStatus = false;
  /**
   * 触发键盘事件快捷操作
   */
  const ctrlArr = ["Meta", "Control"];
  function handlekeyDown(event) {
    if (getEditStatus()) {
      return;
    }
    // event.preventDefault();
    let key = event.key;
    // 兼容苹果笔记本和windows系统 键盘差异
    if (key === "Delete") {
      key = "Backspace";
    }
    // 阻止tab（避免切换点击区域）、 ctrl+z、 ctrl+y、ctrl+c、ctrl+v默认事件  重写了这几个行为
    if (
      key === "Tab" ||
      (ctrolActiveStatus && ["z", "y", "c", "v"].includes(key))
    ) {
      event.preventDefault();
    }

    // 是否点击了ctrl 或common键
    ctrlArr.includes(key) && (ctrolActiveStatus = true);

    key = `${ctrolActiveStatus ? "ctrl-" : ""}${key}`;
    const fn = key2Event[key];
    typeof fn === "function" && fn();
  }

  function handleKeyUp(event) {
    const key = event.key;
    ctrlArr.includes(key) && (ctrolActiveStatus = false);
  }

  return {
    ctrolActiveStatus,
    handlekeyDown,
    handleKeyUp,
  };
}
```

7. 自定义 dom-node 如何自适应布局

```js
// 我们的业务场景是宽度固定 然后高度根据输入的文字自适应 我们每行高度是26 每行最多7个字 所以用7来分割算出来高度  渲染的时候拿不到dom高度 只能这样推算了
// 思路就是 自定义node中的宽高与layout中的宽高保持一致
// 之后布局就不会有遮挡了
// 然后更新宽高调用graph.refreshItem(id); 这个方法

// 定义一个自定义node
G6.registerNode("dom-node", {
  setState(name, value, item) {
    const group = item.getContainer();
    const shape = group.get("children")[0]; // 顺序根据 draw 时确定
    shape.attrs[name] = value;
  },
  draw: (cfg, group) => {
    return group.addShape("dom", {
      attrs: {
        x: 0,
        y: 0,
        // 核心 26是每行高度
        height: Math.ceil(cfg.label.length / 7) * 26 || 26,
        width: 120,

        html() {
          return `<p 
	      contenteditable
              data-id=${cfg.id} 
	      title="${cfg.label}">
	      ${cfg.label}
	      </p>`;
        },
        name: "p-shape",
      },
    });
  },
});

// 实例化
const { width, height } = refs.contain.getBoundingClientRect();
graph = new G6.TreeGraph({
  container: "mountNode", // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
  width, // Number，必须，图的宽度
  height, // Number，必须，图的高度
  // 必须设置为svg  不然自定义node不出来
  renderer: "svg",
  modes: {
    default: [
      {
        type: "collapse-expand",
        onChange: function onChange(item, collapsed) {
          const data = item.get("model").data;
          data.collapsed = collapsed;
          return true;
        },
      },
      "drag-canvas",
      "zoom-canvas",
    ],
  },
  // 定义布局
  layout: {
    type: "compactBox",
    direction: "LR",
    // 核心
    getHeight: node => {
      return Math.ceil(node.label.length / 7) * 26 || 26;
    },
    getWidth: () => {
      return 120;
    },
    getHGap: () => {
      return 40;
    },
    getVGap: () => {
      return 20;
    },
  },
  defaultNode: {
    type: "dom-node",
    anchorPoints: [
      [0, 0.5],
      [1, 0.5],
    ],
    style: {
      fill: "#cee3fc",
      stroke: "#C6E5FF",
    },
  },
});

//  之后改变p标签里的文字 就调用这个方法  id是p树的子节点
graph.refreshItem(id);
```

8. node 的增删改查要注意动画时间

**391. 规范的环境名称**

- dev:开发环境
- qa:测试环境
- online:生产环境
- pl: 预上线
- grey: 灰度

**392. axios create 的使用场景是创建多个实例 然后根据不同的实例访问不同的服务配置**

**393. 没去过大公司一定要去体验下，工作流程、福利、小公司真的很难比**

**394. 可选链能用就用避免多次数据判断 方便 还有?? 避免隐式转换 很 nice**

**395. 记一次 node 和 nginx 配合**

1. 首先服务端装好 npm、 pm2、nrm
2. 本地调试好 expess 代码 将代码上传到服务器
3. pm2 启动 express 服务
4. 修改 nginx 配置 可以 include 一个

```conf
server {
        listen       3333;
        server_name   172.31.242.57;
	    client_max_body_size 100m;

		proxy_set_header Host $host;
        proxy_set_header Cookie $http_cookie;

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root html;
        }

		#root /disk1/cdss/web/dist;
		#index index.html;

        location /imts/ {
		    proxy_pass http://localhost:2233/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;

        }

        location / {
			add_header 'Access-Control-Allow-Origin' '*';
			include  uwsgi_params;
			proxy_pass http://172.31.200.110:8701/;
			proxy_set_header Host $http_host;
			proxy_set_header Cookie $http_cookie;

			client_max_body_size 10m;
        }
    }
```

5. 然后重启 nginx
   进入 nginx 的 sbin 目录 `./nginx -s reload -c /disk1/jjlei/env/nginx/conf/nginx.conf` 输入这个
6. 访问即可

**396. 将 vue 页面打包成 npm 包思路**

1. 搞个入口文件 比如`package/index.js`

```javascript
import PaintedChart from "@/views/statistic/index.js";

const components = [PaintedChart];

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

/* istanbul ignore if */
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  PaintedChart,
};
```

2. `package.json`打包 build 命令改为 ` "build": "vue-cli-service build --target lib --name cdssChart ./package/index.js"`

- cdssChart 是 npm 包名
- ./package/index.js 是打包入口

3. 给 vue 页面添加一个 index.js 让页面暴露出去 在`src/views/statistic/`目录下

```JavaScript
import PaintedChart from '@/views/statistic/index.js';

const components = [PaintedChart];

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  PaintedChart
};

```

4. 然后运行 npm run build 发布到私有 npm 上就行了

**397. 对于高频繁的请求的优化**

1. 如果有个同步文件的操作向服务器发送请求，用户每点击一次，需要发送一个，对服务器压力高，可以使用代理模式，缓存操作，等待一段时间之后集中发送

```js
const proxyFile = (function () {
  let cache = [];
  let timer = null;
  return function (id) {
    cache.push(id);
    if (timer) {
      return;
    }
    timer = setTimeout(function () {
      // 传递。。。
      clearTimeout(timer);
      cache.length = 0;
      timer = null;
    }, 200);
  };
})();
```

**398. 多页面的时候可以使用环境变量控制 run 哪个项目，比较方便**

1. devserve 配置 open 和 openPage 利用环境变量控制 openPage 即可拉

**399. webpack5 上手**

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 通过 npm 安装
const webpack = require("webpack"); // 访问内置的插件
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const config = {
  // 构建目标 默认是node  要改成web 热更新才有用
  target: "web",
  entry: "./src/main.js",
  output: {
    filename: "render.js",
    path: path.resolve(__dirname, "dist"),
    scriptType: "text/javascript",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      scriptLoading: "blocking",
      inject: "head",
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "public"), // boolean | string | array, static file location
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    noInfo: true, // only errors & warns on hot reload
    open: true,
    compress: true,
    overlay: true,
    inline: true,
    // ...
  },
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "source-map";
  }
  if (argv.mode === "production") {
    //...
    config.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin()],
    };
  }
  return config;
};
```

**400. 做人要善良，不要为难同行，该有的备注和项目流程都要有**

**401. content-visibility**

> [content-visibility——只需一行 CSS 代码，让长列表网页的渲染性能提升几倍以上](https://blog.csdn.net/lgdaren/article/details/111505497) > [content-visibility 新的 css 属性，可显著提升渲染性能](https://blog.csdn.net/u011497228/article/details/112320285)

1. 解决长列表渲染性能瓶颈问题，原理就是只渲染可视区域
2. 已知问题 如图片等异步撑开网页的会导致浏览器计算区域出现问题 可以使用 contain-intrinsic-size 来撑开高度
3. 兼容性差 可以用 JS 计算可视区域实现

**402. 新项目规范一定要定好并且严格遵守**

1. 这样多人合作这个项目的时候 代码才会有统一分割

**403. 什么是 HLS**

- HLS (HTTP Live Streaming)，Apple 的动态码率自适应技术。主要用于 PC 和 Apple 终端的音视频服务。包括一个 m3u(8)的索引文件，TS 媒体分片文件和 key 加密串文件
- 就是说 H5 是一种 HTML 的新标准，这种新标准支持原生的 video 标签和 video 控件。因为 video 控件标签又支持 HLS 协议播放。 所以得以实现在手机移动端的网页播放。H5 是解决网页播放问题，HLS 解决的是移动端播放问题。 两者的结合使得手机移动端的网页播放得以完美的实现。 从而实现了所有观看直播和点播视频的大众无需再下载任何插件就可以欣赏视频内容。
- [浏览器不支持 flash 插件之后，h5 播放 rtmp 直播流的解决方案](https://blog.csdn.net/weixin_40777510/article/details/106693408)
- https://bbs.csdn.net/topics/396612447

**404. 为什么网页最多只能播放 6 个视频**

- 只能播放 6 个是 http1.1 的限制，nginx 配置 http2.0 就好了

**405. options 请求常常出现在 cors 预检请求**

1. [mdn-options](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/OPTIONS)

**406. vue3 v-onclick 默认都是带上.native 的**

- 事件在`emits`里面的才是自定义事件 这样不会触发两次

**407. nginx 配置 443 一直没法访问遇到的一个小错误**

```.conf
server{
  # 一开始没加443 所以不行
	 listen       443 ssl;
                server_name ncp.iflyhealth.com;
                ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;
        #ssl_certificate   /usr/local/nginx/ssl/iflyhealth.com.cer;
        #ssl_certificate_key   /usr/local/nginx/ssl/iflyhealth.com.key;
        ssl_certificate   /usr/local/nginx/ssl/server.cer;
        ssl_certificate_key   /usr/local/nginx/ssl/server.key;

        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; #按照这个协议配置

        proxy_set_header Host $host;
        proxy_set_header Cookie $http_cookie;

				location / {
					alias /home/avator-demo/;
					try_files $uri $uri/ @router;
					if ($request_filename ~* .*\.(?:htm|html)$)
					{
						add_header Cache-Control "no-cache, no-store";
					}
				}
	}
```

**408. node_modules/node-sass/vendor 报错**

- 执行`npm rebuild node-sass`就行了

**409. 禁止 chrome 浏览器的翻译功能**

- `<meta name="google" content="notranslate" />`

**410. websocket 客户端断网服务端是收不到消息的，需要用心跳机制**

**411. 细节，使用 ref 包装对象的时候，不要先在外面定义一个对象，而是直接 ref 声明**

- proxy 实现响应式其实是将一个 raw 对象（原始对象）包装了一层，产生了一个新的对象，这个对象跟原始对象是不相等的，也就是说，可能会存在原始对象占用内存并且无法释放的问题，所以建议你们在将一个对象声明响应式时，尽量不要用任何的变量去引用原始对象，而是直接将该对象放在 reactive 中

```js
// 「不太推荐的做法」
import { reactive } from "vue";
export default {
  setup() {
    let obj = { name: "零一", age: 23 }; // 原始对象
    const state = reactive(obj); // 将obj包装成响应式

    return { state };
  },
};
```

```js
import { reactive } from "vue";
export default {
  setup() {
    // 不再先声明原始对象
    const state = reactive({ name: "零一", age: 23 });

    return { state };
  },
};
```

**411. 最近在做 uniapp 小程序 忙的没更新 997**

> 这是一些踩的坑和经验 UI 框架是 uview 还么开发完

1. sass-loader 的版本 @10.1.1 sass-loader 请使用低于 @11.0.0 的版本
2. 用 ref(null)的形式定义 ref 实例的时候会报错，虽然不影响使用。
3. 自定义 tabbar 的方式是先从微信官网拉一个自定义 tabbar 的项目，然后从这个自定义项目中复制`custom-tab-bar`放到`src`目录下。注意 pages.json 中的 tabBar.custom 要设为 true，同时开启`usingComponents`，而且要使用原生小程序代码编写！
4. 自定义 tabbar 切换的时候先不要设置图标，通过全局数据存储当前跳转的 index，在每个 tabbar 主页面的 onshow 再去切换
5. 重置样式需要在页面级别去写 组件组别不行
6. tabs 组件引入页面真机报错 不能用
7. 由于没有当前组件的 this composition-api 在做 ui 的时候并不好用
8. 使用 scroll-into-view 的时候需要给子设置:id="item.id"
9. 底部横条的兼容方案 https://ask.dcloud.net.cn/article/35564
10. 修改内容 热更新报错 必须重启 恶心至极 重启电脑解决
11. uniapp 中的:key 极其重要 直接影响值的获取
12. u-button 自带节流 延迟 500ms 绝了！
13. Array size is not a small enough positive integer 部分手机（包括部分安卓机）不支持 n in Number 的写法，只支持 n in Array，所以会报数组错误
14. https://www.cnblogs.com/ljx20180807/p/9907922.html 地图定位
15. setup 里的数据不需要响应式的时候，设置为引用类型就可以在 onload 等周期里更新数据了
16. data(){这里的 this。xxx return {}} 会冲突
17. 小程序 navigate 传参的时候 如果里面有链接 记得 encode 一下 不然传参会被截断
18. https://www.jianshu.com/p/0853e36925e3 订阅消息的踩坑记录
19. onshow 周期打包成网页的时候子组件并没有渲染，而在小程序时候子组件是渲染过得
20. form 校验规则 rules 无法通过 props 传递， [参见](https://www.uviewui.com/components/form.html#form%E7%BB%84%E4%BB%B6%E7%BB%91%E5%AE%9Amodel%E5%8F%82%E6%95%B0)
21. onLoad 和 uni.getLaunchOptionsSync 两个方法拿到的参数，不是一致的： 当从其他页面（小程序）跳转过来的时候，两次(本小程序在后台没有结束的话)传参不一致，则 onload 会被触发两次，且两次的参数正确，而 uni.getLaunchOptionsSync 方法拿到的是第一次的参数。
22. sass-loader 的版本 @10.1.1 sass-loader 请使用低于 @11.0.0 的版本
23. 用 ref(null)的形式定义 ref 实例的时候会报错，虽然不影响使用。
24. 自定义 tabbar 的方式是先从微信官网拉一个自定义 tabbar 的项目，然后从这个自定义项目中复制`custom-tab-bar`放到`src`目录下。注意 pages.json 中的 tabBar.custom 要设为 true，同时开启`usingComponents`，而且要使用原生小程序代码编写！
25. 自定义 tabbar 切换的时候先不要设置图标，通过全局数据存储当前跳转的 index，在每个 tabbar 主页面的 onshow 再去切换
26. 重置样式需要在页面级别去写 组件组别不行
27. tabs 组件引入页面真机报错 不能用
28. 由于没有当前组件的 this composition-api 在做 ui 的时候并不好用
29. 使用 scroll-into-view 的时候需要给子设置:id="item.id"
30. 底部横条的兼容方案 https://ask.dcloud.net.cn/article/35564
31. 修改内容 热更新报错 必须重启 恶心至极 重启电脑解决
32. uniapp 中的:key 极其重要 直接影响值的获取
33. u-button 自带节流 延迟 500ms 绝了！
34. Array size is not a small enough positive integer 部分手机（包括部分安卓机）不支持 n in Number 的写法，只支持 n in Array，所以会报数组错误
35. https://www.cnblogs.com/ljx20180807/p/9907922.html 地图定位
36. setup 里的数据不需要响应式的时候，设置为引用类型就可以在 onload 等周期里更新数据了
37. data(){这里的 this。xxx return {}} 会冲突
38. 小程序 navigate 传参的时候 如果里面有链接 记得 encode 一下 不然传参会被截断
39. https://www.jianshu.com/p/0853e36925e3 订阅消息的踩坑记录
40. onshow 周期打包成网页的时候子组件并没有渲染，而在小程序时候子组件是渲染过得
41. form 校验规则 rules 无法通过 props 传递， [参见](https://www.uviewui.com/components/form.html#form%E7%BB%84%E4%BB%B6%E7%BB%91%E5%AE%9Amodel%E5%8F%82%E6%95%B0)
42. onLoad 和 uni.getLaunchOptionsSync 两个方法拿到的参数，不是一致的： 当从其他页面（小程序）跳转过来的时候，两次(本小程序在后台没有结束的话)传参不一致，则 onload 会被触发两次，且两次的参数正确，而 uni.getLaunchOptionsSync 方法拿到的是第一次的参数。
43. upload， 正式版调用需要单独设置域名，微信后台-》开发-》开发管理-》开发设置-》服务器域名下的 uploadFile 合法域名， 需要配置，否则体验版没问题，正式版上传会失败
44. 如果是多环境的 某个代码只能某个环境使用 一定要考虑加上条件编译控制
45. u-avatar 里面传 url 的时候，打包 h5，相对路径（整个项目的 public 是相对的）会出错， 得到的路径会有页面的路径，不能正常使用
46. modal 框在 ios 下会有个白边 是 u-mode-center-box 这个样式影响的
47. h5 中 先 crate 再 load 再 show 视频全屏会频繁触发 show 周期 注意了

48. 因为 npm 上面的 postcss-px-to-viewport 包并不支持 include 的用法，需要使用 github 上面的包
49. https://blog.csdn.net/qq_35430000/article/details/116117367
50. ```js
    {
      'postcss-px-to-viewport': {
            viewportWidth: rootValue * 10,
            viewportHeight: 1920,
            unitPrecision: 5,
            viewportUnit: 'vw',
            // fontViewportUnit:'px',
            // propList: ['!font*'],
            selectorBlackList: [
              '.usepixel',
              '.ignore',
              '.hairlines',
              'van-circle__layer'
            ],
            minPixelValue: 1,
            mediaQuery: false,
            include: /mobile/
          }
    }
    ```
51. uniapp 的选择器如果要跨组件的话 要 `.class（选择器） >>> xxx` .class 要为当前组件能选到的选择器
52. 如果组件循环引用了 h5 端 可能无法渲染 使用懒加载可以 但是懒加载在小程序端不能很好的渲染

**412. postcss-px-to-viewport npm 下载不支持 include exclude**

**413. 小程序的 webview 自动播放视频部分安卓手机不支持**

> 骨折在家休息了一个多月，难得的暑假 很羡慕老师的职业

1. 可以使用微信 js 的 sdk`ready`之后触发播放 部分手机支持

```js
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>demo</title>
  </head>
  <body>
    <video width="320" height="240" autoplay muted controls>
      <source src="https://www.runoob.com/try/demo_source/movie.mp4" type="video/mp4" />
      <source src="https://www.runoob.com/try/demo_source/movie.ogg" type="video/ogg" />
      您的浏览器不支持 HTML5 video 标签。
    </video>
    <script src="https://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <script>
        wx.config({
                debug: false,
                appId: '111',
                timestamp: '111',
                nonceStr: '111',
                signature: '111',
                jsApiList: []
        })
        wx.ready(()=> {
            let video = document.querySelectorAll("video")[0];
            video.play();
        });
    </script>
  </body>
</html>

```

**414. JS 高程第四版比第三版多了很多内容 要好好看看消化消化**

**415. 原始值包装类型**

1. ECMAScript 提供了 3 种特殊的引用类型：Boolean、Number 和 String。
   这些类型具有本章介绍的其他引用类型一样的特点，但也具有与各自原始类型对应的特殊行为。每当用
   到某个原始值的方法或属性时，后台都会创建一个相应原始包装类型的对象，从而暴露出操作原始值的
   各种方法。
2. (1) 创建一个 String 类型的实例；
3. (2) 调用实例上的特定方法；
4. (3) 销毁实例。

**416. 单例内置对象**

1. ECMA-262 对内置对象的定义是“任何由 ECMAScript 实现提供、与宿主环境无关，并在 ECMAScript
   程序开始执行时就存在的对象”。如 `Object`、`Array`、`String`、`Global`、`Math`等等

**417. 定型数组**

1. 定型数组（typed array）是 ECMAScript 新增的结构，目的是提升向原生库传输数据的效率。实际上，
   JavaScript 并没有“TypedArray”类型，它所指的其实是一种特殊的包含数值类型的数组。
2. ArrayBuffer ArrayBuffer()是一个普通的 JavaScript 构造函数，可用于在内存中分配特定数量的字节空间。
3. 第一种允许你读写 ArrayBuffer 的视图是 DataView。这个视图专为文件 I/O 和网络 I/O 设计，其
   API 支持对缓冲数据的高度控制，但相比于其他类型的视图性能也差一些。DataView 对缓冲内容没有
   任何预设，也不能迭代。
4. 定型数组是另一种形式的 ArrayBuffer 视图。虽然概念上与 DataView 接近，但定型数组的区别
   在于，它特定于一种 ElementType 且遵循系统原生的字节序。相应地，定型数组提供了适用面更广的
   API 和更高的性能。设计定型数组的目的就是提高与 WebGL 等原生库交换二进制数据的效率。由于定
   型数组的二进制表示对操作系统而言是一种容易使用的格式，JavaScript 引擎可以重度优化算术运算、
   按位运算和其他对定型数组的常见操作，因此使用它们速度极快。

**418. 选择 Object 还是 Map**

1.  内存占用
    Object 和 Map 的工程级实现在不同浏览器间存在明显差异，但存储单个键/值对所占用的内存数量
    都会随键的数量线性增加。批量添加或删除键/值对则取决于各浏览器对该类型内存分配的工程实现。
    `不同浏览器的情况不同，但给定固定大小的内存，Map 大约可以比 Object 多存储 50%的键/值对。`
2.  插入性能
    向 Object 和 Map 中插入新键/值对的消耗大致相当，不过插入 Map 在所有浏览器中一般会稍微快
    一点儿。对这两个类型来说，插入速度并不会随着键/值对数量而线性增加。`如果代码涉及大量插入操 作，那么显然 Map 的性能更佳。`
3.  查找速度
    与插入不同，从大型 Object 和 Map 中查找键/值对的性能差异极小，但如果只包含少量键/值对，
    则 Object 有时候速度更快。在把 Object 当成数组使用的情况下（比如使用连续整数作为属性），浏
    览器引擎可以进行优化，在内存中使用更高效的布局。这对 Map 来说是不可能的。对这两个类型而言，
    查找速度不会随着键/值对数量增加而线性增加。`如果代码涉及大量查找操作，那么某些情况下可能选 择 Object 更好一些。`
4.  删除性能
    使用 delete 删除 Object 属性的性能一直以来饱受诟病，目前在很多浏览器中仍然如此。为此，
    出现了一些伪删除对象属性的操作，包括把属性值设置为 undefined 或 null。但很多时候，这都是一
    种讨厌的或不适宜的折中。而对大多数浏览器引擎来说，Map 的 delete()操作都比插入和查找更快。
    `如果代码涉及大量删除操作，那么毫无疑问应该选择 Map。`
5.  顺序
    Map 会维护插入值的顺序 Object 会根据默认规则排序

**419. Set 和 Map**

1. Map 是键值对，Set 是值的集合，当然键和值可以是任何的值；
2. Map 可以通过 get 方法获取值，而 set 不能因为它只有值；
3. 都能通过迭代器进行 for...of 遍历；
4. Set 的值是唯一的可以做数组去重，Map 由于没有格式限制，可以做数据存储
5. map 和 set 都是 stl 中的关联容器，map 以键值对的形式存储，key=value 组成 pair，是一组映射关系。set 只有值，可以认为只有一个数据，并且 set 中元素不可以重复且自动排序。

**420. Set、WeakSet、Map、WeakMap**

> [Set 、WeakSet、Map、WeakMap 用法](https://blog.csdn.net/qq_41257129/article/details/98592964)

1. Set
   成员唯一且不重复
   [value, value]，只有键值，没有键名
   可以遍历，方法有：add、delete、has
2. WeakSet
   成员都是对象
   成员都是弱引用，可以被垃圾回收机制回收，可以用来保存 DOM 节点，不容易造成内存泄漏
   不能遍历，方法有 add、delete、has
   在 WeakSet 的实例中，如果向 add()、has()和 delete()这三个方法传入非对象参数都会导致程序报错
   WeakSet 集合是不可遍历的，所以不能被用于 for-of 循环
   WeakSet 集合不暴露任何迭代器
   WeakSet 没有 size 属性，也没有 forEach 方法
3. Map
   本质上是键值对的集合，类似集合
   可以遍历，方法很多可以跟各种数据格式转换
4. WeakMap
   只接受对象作为键名（null 除外），不接受其他类型的值作为键名
   键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
   不能遍历，方法有 get、set、has、delete
   Weakpack 只接受对象作为键名（null 除外）,不接受其他类型的值作为键名。
   WeakMap 的键名所指向的对象不计入垃圾回收机制。它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此所有引用的对象的其他引用都被清除，垃圾回收站就会释放该对象所占用的内存。
   WeakMap 没有遍历操作(即没有 key()、values()和 entries()方法)，也没有 size 属性。
   WeakMap 无法清空，即不支持 delete()方法。

**421. 前端通过 js 获取手机型号**

1. https://www.cnblogs.com/alisleepy/p/11200325.html
2. https://github.com/joyqi/mobile-device-js/blob/master/device.js
3. https://github.com/hgoebl/mobile-detect.js

**422. jsdoc 对象如何描述**

```js
import useIFlyCollector from "@hooks/useIFlyCollector";
import { XINJIANG_GET_USER_INFO } from "@js/idataEventName";
import useMobileDetect from "@hooks/useMobileDetect";
import { getWechatVersion } from "@js/utils";

/**
 * @typedef Options 链接里携带的参数
 * @property {number|string} patAge 就诊人年龄
 * @property {number|string} patAge 就诊人年龄
 * @property {string} patSex 就诊人性别
 * @property {number} patId 就诊人id
 * @property {string} patName 就诊人名称
 */

/**
 * @typedef Returns 函数返回的描述
 * @property {function} sendUserInfo 向idata发送埋点数据
 * @returns {undefined}
 */

/**
 * 新疆埋点的逻辑
 * @returns {Returns}
 */
export default function useIflyCollectorData() {
  const { os, model } = useMobileDetect();

  /**
   * @param {Options} op 链接里携带的参数
   * @returns {void} 无
   */
  function sendUserInfo(op) {
    const { IFlyCollector } = useIFlyCollector();
    IFlyCollector.onEvent(XINJIANG_GET_USER_INFO, {
      mobile: model,
      os,
      wechatVersion: getWechatVersion(),
      patAge: op.patAge,
      patSex: op.patSex,
      patId: op.patId,
      patName: op.patName,
    });
  }
  return {
    sendUserInfo,
  };
}
```

**423. 移动端测试可以使用阿里云等平台云测试，比较方便**
使用步骤：
1、 初次使用需要绑定支付宝实名认证，购买【移动企业服务功能（免费）】，登录阿里云移动研发平台 EMAS https://emas.console.aliyun.com/#/overview
2、 创建并进入工作空间，选择【移动测试】二级页面，进入在选择菜单【远程真机】，搜索相关测试真机点击使用
3、 点击使用后进入详情页面，选择对应系统浏览器访问 H5 即可测试功能
使用时注意右上角计时(图片右上角)，如果测试完成或中断，需要手动点击退出停止计时

**424. uniapp 生成 h5 的时候 public 里的其他 html 模板不会带走**

1. 使用多入口可以带入

**425. iNodeClinet 报 libCoreUtils.dylib 将对您的电脑造成伤害**

1. 关闭 sip 电脑关机 然后 按着 commond + r 然后点开机 按 10s 左右 然后送掉 进入 recover 模式
2. 然后打开终端 输入 csrutil disable 回车 重启 ok

**426. uglify 压缩 js 的一个注意点**

1. 如果你比较的是 nodeenv 的变量引用的话 那么压缩的时候会保留这段代码 如

```js
const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  // xxx 压缩之后里的代码会保留
}

// 如果你直接比较
if (process.env.NODE_ENV === "production") {
  // 这里的代码压缩后会删除 如果结果是false
}
```

**427. iframe 链接改变会在历史栈里记录**

- 某些场景为了避免这种可以销毁 iframe 重新生成

**428. 大量数据 正则性能不一定有数组等原生方法好**

```js
const text = new Array(10000)
  .fill(1)
  .map(v => {
    return "哈哈哈哈哈哈哈哈哈哈或;";
  })
  .join("");
console.time("a");
text.replace(/;/g, "<br>");
console.timeEnd("a");
// a: 2.648681640625 ms

console.time("a");
text.split(";").join(";<br>");
console.timeEnd("a");
// a: 1.241943359375 ms
```

**429. line-height 默认高度是根据用户端决定的**

- 桌面浏览器一般默认 1.2

**430. segmentfault 的 404 效果**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .box-404-wrap {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .box-404-wrap .box {
        margin: 0 auto;
        padding: 4rem 1.25rem;
        background-color: #fff;
        width: 546px;
        border-radius: 0.25rem;
      }

      .box-404-wrap .box .text-wrap {
        position: relative;
        width: 100%;
        height: 7.1875rem;
        text-align: center;
        z-index: 3;
      }

      .box-404-wrap .box .text-wrap h1 {
        position: absolute;
        text-align: center;
        width: 100%;
        font-size: 6rem;
        font-weight: 700;
        margin: 0;
        animation: shake 0.6s ease-in-out infinite alternate;
        user-select: none;
      }

      .box-404-wrap .box .text-wrap h1:before {
        content: attr(data-t);
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0.34em);
        height: 0.1em;
        line-height: 0.5em;
        width: 100%;
        animation: scan 0.5s ease-in-out 367ms infinite alternate, glitch-anim
            0.3s ease-in-out infinite alternate;
        overflow: hidden;
        opacity: 0.7;
      }

      .box-404-wrap .box .text-wrap h1:after {
        content: attr(data-t);
        position: absolute;
        top: -28px;
        left: 50%;
        transform: translate(-50%, 0.34em);
        height: 0.5em;
        line-height: 0.1em;
        width: 100%;
        animation: scan 665ms ease-in-out 422ms infinite alternate, glitch-anim
            0.3s ease-in-out infinite alternate;
        overflow: hidden;
        opacity: 0.8;
      }

      @media only screen and (max-width: 480px) {
        .box-404-wrap .box .box {
          width: 100%;
        }
      }

      .box-404-wrap .box .clearfix:after,
      .box-404-wrap .box .clearfix:before {
        content: " ";
        display: table;
      }

      .box-404-wrap .box .clearfix:after {
        clear: both;
      }

      @keyframes scan {
        0%,
        20%,
        to {
          height: 0;
          transform: translate(-50%, 0.44em);
        }

        10%,
        15% {
          height: 1em;
          line-height: 0.2em;
          transform: translate(-55%, 0.3em);
        }
      }

      @keyframes attn {
        0%,
        to {
          opacity: 1;
        }

        30%,
        35% {
          opacity: 0.4;
        }
      }

      @keyframes shake {
        0%,
        to {
          transform: translate(-1px);
        }

        10% {
          transform: translate(2px, 1px);
        }

        30% {
          transform: translate(-3px, 2px);
        }

        35% {
          transform: translate(2px, -3px);
          filter: blur(4px);
        }

        45% {
          transform: translate(2px, 2px) skewY(-8deg) scaleX(0.96);
          filter: blur(0);
        }

        50% {
          transform: translate(-3px, 1px);
        }
      }

      @keyframes glitch-anim {
        0% {
          clip: rect(96px, 9999px, 68px, 0);
        }

        10% {
          clip: rect(76px, 9999px, 13px, 0);
        }

        20% {
          clip: rect(45px, 9999px, 100px, 0);
        }

        30% {
          clip: rect(36px, 9999px, 18px, 0);
        }

        40% {
          clip: rect(46px, 9999px, 49px, 0);
        }

        50% {
          clip: rect(100px, 9999px, 45px, 0);
        }

        60% {
          clip: rect(87px, 9999px, 93px, 0);
        }

        70% {
          clip: rect(2px, 9999px, 33px, 0);
        }

        80% {
          clip: rect(83px, 9999px, 22px, 0);
        }

        90% {
          clip: rect(31px, 9999px, 14px, 0);
        }

        to {
          clip: rect(90px, 9999px, 1px, 0);
        }
      }
    </style>
  </head>
  <body>
    <div class="box-404-wrap">
      <div class="box">
        <div class="d-flex flex-column align-items-center">
          <div class="text-wrap"><h1 data-t="404" class="h1">404</h1></div>
          <div class="text-center mt-2">
            当前页面无法访问，可能没权限或已删除 <br />
            长老们，去别处看看吧 彡(-_-;)彡
          </div>
          <div class="mt-4"><a href="/" class="btn btn-primary">回首页</a></div>
        </div>
      </div>
    </div>
  </body>
</html>
```

**431. 如果用户没刷新页面而发版本了会遇到 chunk 加载不到的问题**

1. router.error 增加提示

```js
/**
 * 当chunk加载失败时的匹配
 */
export const chunkLoadErrorPattern = /^Loading chunk/gi;

/**
 * 当chunk发生改变时
 */
export const CHUNK_LOAD_ERROR_MSG = "页面资源发生改变，请刷新页面~";

router.onError(function (error) {
  const { message } = error;
  // 当路由chunk加载失败时提示用户刷新页面
  if (message.match(chunkLoadErrorPattern)) {
    notifyInfo(CHUNK_LOAD_ERROR_MSG);
  }
  throw error;
});
```

**432. js 动态插入 link 标签是不会生效的要把 rel=stylesheet 加上**

1. 可以 ajax 请求到然后添加 style 进去

**433. svg 转 base64**

```js
function svgToImage(svg: string): string {
  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}
```

**434. UUID NanoID 与浏览器生成 UUID**

1. [为什么 NanoID 正在取代 UUID？](https://juejin.cn/post/7039960318897815565)
2. `对于web应用而言使用原生URL.createObjectURL(new Blob()).substr(-36)获取UUID，相对与引入一整个库来说节约更多的资源。实际生产过程中，应该也不会有每秒需要生成上万次的场景，所以性能实际上在使用较少的时候几乎没有差别。 但是也许用在其他一些语言的应用上会就不错的表现。`
3. URL.createObjectURL(new Blob()).substr(-36)
4. revokeObjectURL 最好及时释放掉生成的链接

**435. uniapp 中 webview 在 h5 环境要考虑兼容性**

1. webview 在 h5 是 iframe 有很多在 iframe 条件下不跳转

**436. 利用 getboundingclientrect 和 window.scrollY 计算锚点**

1. 小程序为例

```js
function scrollToLastItem(selector = "", getDomQuery) {
  // hooks中没有this 所以从外部取
  const query = getDomQuery();
  query.selectViewport().scrollOffset();
  query.select(selector).boundingClientRect();
  query.exec(res => {
    const lastIndex = res.length - 1;
    const scrollData = res[lastIndex - 1];
    const domData = res[lastIndex];
    if (scrollData && domData) {
      scrollTo(scrollData.scrollTop + domData.top - 150);
    }
  });
}
```

**437. 内容安全策略(csp)可以限制访问策略很好用**

- https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP
- Content-Security-Policy

**438. readonly 与 disabled 的区别**

1. readonly 属性规定输入字段为只读。
   只读字段是不能修改的。不过，用户仍然可以使用 tab 键切换到该字段，还可以选中或拷贝其文本。
   readonly 属性可以防止用户对值进行修改，直到满足某些条件为止（比如选中了一个复选框）。然后，需要使用 JavaScript 消除 readonly 值，将输入字段切换到可编辑状态。
   readonly 属性可与 <input type="text"> 或 <input type="password"> 配合使用。

2. disabled 属性规定应该禁用 input 元素。
   被禁用的 input 元素既不可用，也不可点击。可以设置 disabled 属性，直到满足某些其他的条件为止（比如选择了一个复选框等等）。然后，就需要通过 JavaScript 来删除 disabled 值，将 input 元素的值切换为可用。
   注释：disabled 属性无法与 <input type="hidden"> 一起使用。

**439. react 中 wheel 如果要阻止滚动,需要监听原生滚动**
**440. react 中如果想获取 useState 值改变 准确的方法 最好使用 useEffect**
**441. ract 的 memo useMemo useCallback 不是用的越多越好的**
**442. canvas 指定区域指定颜色更换**

```js
 /**
   * 替换某个canvas的某个区域中的颜色a为颜色b
   * @param ctx canvas的context对象
   * @param left 起始x坐标
   * @param top 起始y坐标
   * @param width 从起始x坐标开始 多宽
   * @param height 从起始坐标y开始 多高
   * @param colorArr 颜色a 为像素点数组 如 [r,g,b,a] 注意a是255
   * @param replaceColorArr 颜色b 如 [r,g,b,a] 注意a是255
   */
  replaceCanvasAreaColor(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    width: number,
    height: number,
    colorArr: number[],
    replaceColorArr: number[]
  ) {
    const imgData = ctx.getImageData(left, top, width, height);
    const buff = imgData.data;
    for (let i = 0, l = imgData.width * imgData.height * 4; i < l; i += 4) {
      const item = [buff[i], buff[i + 1], buff[i + 2], buff[i + 3]];
      if (item[0] === colorArr[0] && item[1] === colorArr[1] && item[2] === colorArr[2] && item[3] === colorArr[3]) {
        buff[i] = replaceColorArr[0];
        buff[i + 1] = replaceColorArr[1];
        buff[i + 2] = replaceColorArr[2];
        buff[i + 3] = replaceColorArr[3];
      }
    }
    ctx.putImageData(imgData, left, top);
  }
```

**443. 一些不在意的 meta 标签**

1.  <meta http-equiv="refresh" content="10"> 网站自动刷新
2.  <input type="text" spellcheck="true" lang="en">
3.  <p translate="no">Brand name</p> meta中也有

**444. blocklyJS 可以拖拽生成代码**

1. 可以查阅他的 google 论坛获取帮助

**445. unplugin-vue-components 可以自动引入 很方便**

**446. ts 索引签名**
可以用于 obj 的 key 定义类型

```ts
type MenuData = { [path: string]: { id: string; name: string }[] };

function deepGetMenuData(menuList: NavItem[], menuData: MenuData) {
  if (Array.isArray(menuList)) {
    menuList.forEach(item => {
      const { path, name, children } = item;
      menuData[path] = [
        {
          id: path,
          name,
        },
      ];
      deepGetMenuData(children, menuData);
    });
  }
}
```

**447. ts 中循环 enum**

1. 不能用 for in ，里面的变量会识别成 i
2. 要使用

```ts
/**
 * 配合饿了么的颜色类型和自己扩展的
 */
enum COLOR_TYPE {
  PRIMARY = "primary",
  SUCCESS = "success",
  WARNING = "warning",
  INFO = "info",
  DANGER = "danger",
  PURPLE = "purple",
}

/**
 * 标签的颜色列表
 */
const tagColorList: COLOR_TYPE[] = [];
Object.entries(COLOR_TYPE).forEach(([key, val]) => {
  if (key !== COLOR_TYPE.INFO) {
    tagColorList.push(val);
  }
});

export { COLOR_TYPE, tagColorList };
```

**448. element-plus 按需引入自定义主题遇到的问题**

1. `@import` 被废弃了
2. ElementPlusResolver 要使用 importStyle: "sass", 如果自动引入里面也用了 要两个都用
3. 有个坏处就是你全局加的如果有别的 scss 改动别的 scss element 的也会编译一次。

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { join } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { SCSS_DIR_PATH, PROGRAM_NAME } from "./src/assets/ts/config";

function resolve(dir) {
  return join(__dirname, dir);
}

const elementPlusResolverInstance = ElementPlusResolver({
  importStyle: "sass",
});

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "${SCSS_DIR_PATH}/element-ui-var.scss" as *;
        `,
      },
    },
  },
  plugins: [
    Components({
      resolvers: [elementPlusResolverInstance],
      dts: "./src/components.d.ts",
    }),

    AutoImport({
      resolvers: [elementPlusResolverInstance],

      dts: "./src/auto-imports.d.ts",
    }),
  ],
});
```

**449. vite import.met.env undefined**

> http://events.jianshu.io/p/4973bd983e96

There's a chicken-egg problem here: Vite expects to resolve .env files from project root, but project root can be made different by the config file.
So if we resolve .env before resolving the config file, we can only resolve it from CWD, which would then break the case where the user puts .env files in a nested root specified via config.
摘自 Evan You 的回复

必须以 VITE 开头

```js
// dotenv 需要单独npm install
export default ({ mode }) => {
  require('dotenv').config({ path: `./.env.${mode}` });
  // now you can access config with process.env.{configName}
  return defineConfig({
      plugins: [vue()],
      base:process.env.VITE_APP_NAME
  })
}

// 第二种方式
import { loadEnv } from 'vite'
export default ({ mode }) => {
  return defineConfig({
          plugins: [vue()],
          base:loadEnv(mode, process.cwd()).VITE_APP_NAME
      })
}
```

**450. auto-import 插件**

1. 这个插件还会引入你自己编写的插件作为类型 有时间查查如何配置的

**451. ts 当返回两种类型时，如何使用不报错？**

> 就是用户自定义的类型保护拉！

```ts
function isTableItemType(data: TreeItemType | TableItem): data is TableItem {
  return typeof (data as TableItem).scriptName === "string";
}

/**
 * 获取脚本或者分类名称
 */
function getTreeItemName(isLeaf: boolean, data: TreeItemType | TableItem) {
  if (isTableItemType(data)) {
    console.log("是tableItem类型");
  }
  return isLeaf ? (data as TableItem).scriptName : (data as TreeItemType).name;
}
```

1. 如 `type Content = 类型1|类型2`，类型 1 类型 2 返回的类型不同 代码里使用 Content 就会导致两种返回值没法确定。。

**452. v-for 使用 v-model 要使用 index 的方式取值**

**453. axios 与 application/x-www-form-urlencoded**

1. 使用 application/x-www-form-urlencoded 类型时 要使用 URLSearchParams()传参
2. 因为 axios 会默认序列化 JavaScript 对象为 JSON

**454. element-plus 按需引入 Message 相关没样式**

> https://blog.csdn.net/Delete_89x/article/details/126430049

```js
import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-notification.css";
import "element-plus/theme-chalk/el-message-box.css";
```

**455. last-of-type 可以设置同级含有不同元素的样式**

**456. 当数据为固定数组时，利用 ts 生成枚举类型**

1.

```ts
/**
 * 分页的带大小设置
 */
export const pageSizes = [10, 20, 30, 40] as const;

/**
 * pagination作为搜索项的类型
 */
export interface PaginationSearchParams {
  // 10 | 20 | 30 | 40
  pageSize: (typeof pageSizes)[number];
}
```

2.

```ts
type ValueOf<T> = T[keyof T];

const obj = {
  1: "111",
  2: "222",
} as const;
// 如果不加as const  labellist 是string

type LabelList = ValueOf<typeof obj>; // '111' | '222'
type ValueList = keyof typeof obj; // 1 | 2
```

**457. vite 使用 monaco-editor 如何汉化**

> [How to localize in esm? #1514](https://github.com/microsoft/monaco-editor/issues/1514)

```vue
<template>
  <div ref="divRef" style="height: 500px; width: 500px"></div>
</template>

<script lang="ts" setup>
// 主要是这个loader的作用
import loader from "@monaco-editor/loader";
import * as monaco from "monaco-editor";

const divRef = ref();

loader.config({ monaco });
loader.config({
  "vs/nls": {
    // availableLanguages: { "*": "de" },
    availableLanguages: { "*": "zh-cn" },
  },
});

loader.init().then(monacoInstance => {
  // 初始化编辑器
  monacoInstance.editor.create(divRef.value, {
    value: "321313123",
  });
});
</script>

<style lang="scss"></style>
```

**458. flex 布局最后一个靠右或者靠左的时候可以用 margin-left:auto 来解决**

1. flex 布局中经常有其他元素靠左排列，最后一个元素靠右排列的设计。简单的在最后一个元素中添加 margin-left:auto 的样式，就可以实现
2. MDN 中给出了说明 flex、inline-flex 中，在水平方向上有空余空间的情况下，空余的空间会被平均分配给水平方向上写有 margin-left:auto 属性的元素的外边距

**459. vue compute 定义类型**

```ts
const tag2Component: ComputedRef<{ [x: number]: typeof ComponentColumn }> =
  computed(() => {
    return {
      [REFER_TYPE.COMPONENT]: ComponentColumn,
      [REFER_TYPE.TASK]:
        props.type === REFER_TYPE.SCRIPT ? ScriptColumn : TaskColumn,
    };
  });
```

**460. flex 布局为什么 flex:1 宽度不一致**

> [【转载】flex:1 不等分的问题](https://www.jianshu.com/p/291b63908bdc)

1. 因为 依照 flex 的自动调整计算规范是不包含 padding 的。w3 规范这里的部分提到 flexItem 的可用空间要减去 margin、border、padding。所以想要均分的话，需要套个 margin、border、padding 一样的 div。

**461. flex 布局当宽度不固定时，文字如何溢出隐藏？**

> https://blog.csdn.net/qq_31150171/article/details/122461592

1. 父元素 width:0 即可,要设置溢出...的元素不能再是 flex 布局了

**452. ts 将对象里的类型变为|null**

```ts
type WithNull<T extends object> = {
  [P in keyof T]: T[P] | null;
};
```

**453. vue 的动画 xx-leave-active**

1. 在这个 class 中添加 position:absolute 和具体的位置样式可以避免抖动

**454. backdrop-filter**

1. 属性可以让你为一个元素后面区域添加图形效果（如模糊或颜色偏移）。因为它适用于元素背后的所有元素，为了看到效果，必须使元素或其背景至少部分透明。

```css
background-image: radial-gradient(transparent 1px, var(--bg-color) 1px);
background-size: 4px 4px;
backdrop-filter: saturate(50%) blur(4px);
```

**455. vue3 createApp 创建动态组件**

> 如果你的 createapp 用 template 方式渲染 打包后就不渲染了 要么 render 要么这种引入组件进来

```ts
import { App, createApp } from "vue";
import { Dialog, Button } from "@components/index";
import { MODAL_WIDTH } from "@/assets/ts/modal";

export enum REJECT_TYPE {
  CANCEL = "cancel",
  CLOSE = "close",
}

export default function useCancelYesNoMsgBox() {
  let instance: any;
  let app: App<Element>;
  const root = document.createElement("div");

  function init(content: string) {
    return new Promise((resolve, reject) => {
      app = createApp({
        // template: 'template不能用 开发环境好的 但是打包后就不渲染了',
        // render函数可以渲染
        // render(){}
        components: {
          Dialog,
          Button,
        },
        setup(props, ctx) {
          const visible = ref(true);

          return {
            content,
            visible,
            MODAL_WIDTH,
            handleConfirm() {
              visible.value = false;
              resolve("");
              destory();
            },
            handleCancel() {
              visible.value = false;
              reject(REJECT_TYPE.CANCEL);
              destory();
            },
            handleCloseDialog() {
              visible.value = false;
              reject(REJECT_TYPE.CLOSE);
              destory();
            },
          };
        },
      });
      // 推荐使用这种方式 CancelYesNoMsgDialog就是单文件vue组件
      // 后面一个参数是传递给这个组件的props
      app = createApp(CancelYesNoMsgDialog, {
        content,
        onClose() {
          reject(REJECT_TYPE.CLOSE);
          destory();
        },
        onConfirm() {
          resolve("");
          destory();
        },
        onCancel() {
          reject(REJECT_TYPE.CANCEL);
          destory();
        },
      });

      const body = document.body || document.getElementsByTagName("body")[0];
      instance = app.mount(root);
      body.appendChild(instance.$el);
    });
  }

  function destory() {
    setTimeout(() => {
      if (instance && app) {
        // console.log(instance.$el, "--", root, app);
        app.unmount();
        instance = null;
      }
    }, 300);
  }

  return {
    init,
    destory,
  };
}
```

**456. 再踩正则 g 的坑**

1. 如果你是`export`一个正则表达式，是全局匹配的，而不是每次初始化一个正则表达式，会有匹配出现反结果的可能
2. 因为 export 之后 import 相当于一直引用这个正则对象而一直引用同一个正则对象 然后 g 会有个 lastindex 内置属性
3. 初始为 0 匹配后 lastindex 设置为匹配内容在字符串中的索引 如果找不到就会设置为 0
4. 如果这时候别的字符串开始匹配 索引在字符串中找不到 那么用 g 就会有问题了 可能会返回 false

**457. vite 拆包，分配 hash**

```ts
import fs from "fs";
import { BuildOptions } from "vite";

/**
 * 不加hash值的包
 */
const noHashChunkNames = [
  "vue",
  "axios",
  "mavonEditor",
  "monacoEditor",
  "blockly",
  "keyboardjs",
  "mitt",
  "cssMode",
  "htmlMode",
  "jsonMode",
  "tsMode",
  "cronParser",
  "elementPlus",
  "svgFiles",
];

/**
 * 不加hash值的静态资源
 */
const noHashAssetsNames = ["mavonEditor.css", "monacoEditor.css", "axios.css"];

/**
 * monacoEditor打包后会将依赖语言打包进来
 * 在这里控制拆到别的文件中去 有空研究下怎么去除这些的
 * 目前虽然打包了但是实际没有加载这些 不影响
 */
const monacoLanguages = fs.readdirSync(
  "node_modules/monaco-editor/min/vs/basic-languages"
);

/**
 * 将svg文件打包到一起
 */
const svgVueFilePaths: string[] = [
  /**
   * 公共svg
   */
  ...fs.readdirSync("src/assets/svg").map(filename => {
    return `src/assets/svg/${filename}`;
  }),
  /**
   * editor中的svg
   */
  ...fs.readdirSync("src/views/editor/assets/svg").map(filename => {
    return `src/views/editor/assets/svg/${filename}`;
  }),
];

const build: BuildOptions = {
  rollupOptions: {
    // output: {
    // entryFileNames: `assets/[name].js`,
    // chunkFileNames: `assets/[name].js`
    // assetFileNames: `assets/[name].[ext]`,
    // },
    // 拆包
    // https://rollupjs.org/guide/en/#big-list-of-options
    output: {
      chunkFileNames(chunkInfo) {
        const { name } = chunkInfo;
        if (monacoLanguages.includes(name)) {
          return "assets/monaco-languages/[name].js";
        }

        return noHashChunkNames.includes(name)
          ? "assets/[name].js"
          : "assets/[name]-[hash].js";
      },
      assetFileNames(chunkInfo) {
        const { name } = chunkInfo;
        return noHashAssetsNames.includes(name || "") ||
          /\.(ttf|png|eot|svg|woff|woff2)$/.test(name || "")
          ? "assets/[name].[ext]"
          : "assets/[name]-[hash].[ext]";
      },
    },
    manualChunks: {
      vue: ["vue", "vue-router"],
      axios: ["axios"],
      mavonEditor: ["mavon-editor", "mavon-editor/dist/css/index.css"],
      monacoEditor: ["monaco-editor"],
      blockly: ["blockly"],
      keyboardjs: ["keyboardjs"],
      mitt: ["mitt"],
      cronParser: ["cron-parser"],
      elementPlus: ["element-plus", "@element-plus/icons-vue"],
      echarts: ["echarts"],
      vueJsonViewer: ["vue-json-viewer"],
      svgFiles: svgVueFilePaths,
    },
  },
};

export default build;
```

**458. vite 因为 AutoImport 点击页面重新渲染问题解决**

```ts
import fs from "fs";
import { DepOptimizationOptions } from "vite";

/**
 * 强制预构建 避免每次进路由时重新加载
 * 首次加载会变慢
 * 如果你进入路由发现页面重新加载了 看下控制台是因为什么加载的  new dependencies optimized: xxx
 * 然后把xxx放到这里来就能强制预构建 避免这个问题了
 */
const optimizeDepKeys: string[] = ["keyboardjs", "vue-json-viewer"];
/**
 * 强制与构建element的组件
 * 因为饿了么的组件按需加载 会导致进入某个路由页面重新加载
 */
fs.readdirSync("node_modules/element-plus/es/components").forEach(dirname => {
  fs.access(
    `node_modules/element-plus/es/components/${dirname}/style/css.mjs`,
    err => {
      if (!err) {
        optimizeDepKeys.push(
          `element-plus/es/components/${dirname}/style/index`
        );
      }
    }
  );
});

const optimizeDeps: DepOptimizationOptions = {
  include: optimizeDepKeys,
};

export default optimizeDeps;
```

**459. ts 泛型报不存在 xxx 属性时**

```ts
type TData = {
  sysLevel: SYS_LEVEL;
  appId?: number | string;
  industryId?: number | string;
  classifyCode: string;
};

export default function useTypeTreeSearchAll<T extends TData, K>({});
```

**460. monacoEditor 打包后没有右键粘贴**

> https://github.com/node-red/node-red-nodes/issues/946

1. 由于浏览器安全限制，粘贴仅在使用 localhost 或 https URL 时可用。

**461. vue 多根节点如果频繁 v-if 切换 在生产会报 insertbefore null 的错误**

1. 可以改成 v-show

**460. macos pyenv 设置无效**

1. 安装后进入`~ ./zshrc`设置环境变量即可

```vim
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
```

**461. unplugin-auto-import 引入后 eslint 不识别问题解决**

1. vue.config.js

```js
const AutoImport = require("unplugin-auto-import/webpack");
module.exports = {
  configureWebpack: {
    plugins: [
      AutoImport({
        // 自动引入
        imports: [
          {
            vue: [
              "ref",
              "reactive",
              "computed",
              "watch",
              "onMounted",
              "onUnmounted",
              "defineEmits",
              "defineProps",
              "withDefaults",
              "onBeforeUnmount",
            ],
          },
        ],
        dts: "./src/auto-imports.d.ts",
        eslintrc: {
          // 默认false, true启用。生成一次就可以，避免每次工程启动都生成，一旦生成配置文件之后，最好把enable关掉，即改成false
          enabled: true,
          //否则这个文件每次会在重新加载的时候重新生成，这会导致eslint有时会找不到这个文件。当需要更新配置文件的时候，再重新打开
          filepath: "./.eslintrc-auto-import.json", // 生成json文件,可以不配置该项，默认就是将生成在根目录
          globalsPropValue: true,
        },
      }),
    ],
  },
};
```

2. .eslintrc.js

```js
module.exports = {
  // ...
  extends: [
    // ...
    ".eslintrc-auto-import.json",
  ],
  // ...
};
```

**462. REMOTE HOST IDENTIFICATION HAS CHANGED!**

1. 命令行`ssh-keygen -R github.com` 之后就行了
2. 意思大概是.ssh/known_hosts 下的 Host key 不匹配造成的，事实上很多时候会出现这个问题，先来了解一下 known_hosts 记录的是什么？
   每次使用 SSH 连接远端服务器，SSH 会把你每个你访问过计算机的公钥 public key 都记录在~/.ssh/known_hosts。当下次访问相同计算机时，OpenSSH 会核对公钥。如果公钥不同，OpenSSH 会发出警告， 避免你受到 DNS Hijack，man-in-the-middle attack 之类的攻击。

**463. 从 excel 提取 json 数据的思路**

1. excel 另存为 csv
2. csv2json 转成 json
3. 拿到 json 自己处理数据格式

**464. 知道图片比例，图片宽度和高不固定图片加载后如何避免抖动**

1. 父级盒子设置高度 0，然后设置 padding-bottom 达到图片宽高比即可

```html
<header class="page-header">
  <h1 class="hidden">{{ PROGRAM_NAME }}</h1>
  <img :src="require('@images/banner.png')" :title="PROGRAM_NAME" />
</header>
```

```scss
.page {
  &-header {
    height: 0;
    padding-bottom: 38.7%;
    background: $bgColorLargeDeep;
    img {
      display: block;
      width: 100%;
    }
  }
}
```

**465. 不同环境名称**

1. dev（Development environment）：开发环境。用于开发者调试使用。
2. test：测试环境。
3. sit（System Integration Test）：系统集成测试。
4. uat（User Acceptance environment）：用户验收测试环境。生产环境下的软件测试者测试使用。预发布环境。
5. pre：灰度环境。灰度测试环境就是生产环境，生产数据，所影响的也是生产环境，只是范围比测试环境更广，更真实。其实就是小范围的生产环境。类似于游戏内测。
6. fat（Feature Acceptance Test environment）：功能验收测试环境。软件测试者测试使用。
7. prod（Production environment）：生产环境。正式线上环境。

**466. 企业微信小程序扫码授权无限提示授权**

1. 在当前设备登录自己的微信 然后授权跳到自己的微信上就行了
2. 不要使用扫码的方式

**467. 利用 sourcetree 修改 commit 信息**

1. 最好修改的 commit 没有推送到远程
2. 修改 a 的 commit 需要右键 a 的上一次提交 交互式变基 编辑

**468. 小程序点击关闭按钮只是隐藏**

1. 是不会重置变量之类的的 如果你每次进入页面重置某个变量 全局属性 就要当心了

**469. canvas clip 为什么要 store restore**

1.  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要 save 上下文的原因

**470. 小程序 canvasToTempFilePath 部分 iphone 没生成图**

1. 需要加加延迟
2. 画布过大在 ios 上会显示空白
3. 初始化画布大小必须同步，异步也会导致 ios 空白

**471. src 图片链接 403**

> [如何解决访问外部图片返回 403 Forbidden 错误](https://zhuanlan.zhihu.com/p/113500478)

1. 一般是防盗链设置，对应破解法
2. 一是让后端或 oss 的跨域白名单里配上当前域名
3. 二是使用图片中转缓存网站
4. 三是加 `<meta name="referrer" content="no-referrer" />`

**472. 后端返回 id 很长，精度会缺失，需要让后端改为字符串**
-> 1645485922393248031
-< 1645485922393248000

**473. :adjust-position="false"可以防止小程序键盘弹起带着页面顶上去**

**474. 小程序订阅消息授权如何清除？**

1. 通过微信开发者工具清除授权缓存就行了 前提是你能开发这个小程序

**475. 小程序动态设置 page 元素的样式**

```vue
<template>
  <page-meta :page-style="pageStyle"></page-meta>
</template>

<script setup>
const pageStyle = ref("background: #00000; transition: all .3s");

const { setup, handleChangeSetup } = useSetup(setupNum => {
  pageStyle.value = `background:${
    setupNum === 1 ? "#e22b27" : "#000"
  };  transition: all .3s`;
});
</script>
```

**476. 绘制圆形头像**

```js
/**
 * 绘制用户信息
 */
function drawUserInfo() {
  return new Promise((resolve, reject) => {
    const image = canvas.createImage();
    image.src = ""; // 图片路径
    image.onload = function () {
      ctx.save();
      // 绘制第一个圆
      ctx.beginPath();
      //圆心x、y的坐标，半径，起始角，结束角，顺时针画
      ctx.arc(
        getPxWithPixelRatio(45),
        getPxWithPixelRatio(45),
        getPxWithPixelRatio(21),
        0,
        Math.PI * 2,
        false
      );
      //将圆形剪切
      ctx.clip();
      //再画一个不存在的圆，避免画出来的微信头像有个黑圆圈
      ctx.beginPath();
      ctx.arc(0, 0, 0, 0, Math.PI * 2, false);
      ctx.drawImage(
        image,
        getPxWithPixelRatio(24),
        getPxWithPixelRatio(24),
        getPxWithPixelRatio(42),
        getPxWithPixelRatio(42)
      );
      ctx.stroke();
      ctx.restore();

      resolve();
    };
    image.onError = function () {
      reject();
    };
  });
}
```

**477. safrai 浏览器 z-index 无效，失效**
ios -webkit-overflow-scrolling:touch 是导致失效原因之一
ios 端 z-index 失效，无效问题解决办法 transform: translateZ(1000px); /_这里是给 safari 用的_/

**478. jsDoc 引入**

- import('./use-scene').SceneItem.type

**479. 后端一次性返回大量数据需要渲染的一个处理方案**

1. 生成一个灰度图，前端利用`getImageData`读图上的点 然后渲染
2. 栅格数据灰度化并前端转换展示 https://blog.csdn.net/gisshixisheng/article/details/121688008

**480. APNG（Animated Portable Network Graphics）**
APNG（Animated Portable Network Graphics）是一种支持动画的图像格式，它是 PNG（Portable Network Graphics）的扩展。与 GIF 动画相比，APNG 具有更好的图像质量和更高的色彩深度。
APNG 使用 PNG 文件格式，并通过在文件中存储多个帧来创建动画。每个帧都是完整的 PNG 图像，可以包含透明度信息和其他 PNG 所支持的特性。
在现代的 Web 开发中，APNG 通常用于在网页上显示动画效果。然而，需要注意的是，并非所有的浏览器都原生支持 APNG 格式。某些浏览器可能无法正确显示或播放 APNG 图像。为了兼容性，可以使用其他技术，如 CSS 动画或 JavaScript 库（如 APNG.js）来实现动画效果。
总结起来，APNG 是一种用于创建动画的图像格式，它使用 PNG 文件格式并存储多个帧来创建动画效果。它在 Web 开发中被广泛使用，但需注意浏览器对其支持的情况。
如有任何进一步的问题，请随时提问。

**481. 小程序 vconsole 复制也需要申明隐私政策**

**482. 小程序分包使用了后行断言的坑**

1. 由于后行断言部分解析器不支持，所以会导致分包在部分机型上崩溃，无法引入 慎用！

**483. 小程序 async onShow 会阻塞页面渲染进程 慎用 async！**

**484. 记一次 vite 项目改造成 qiankun 架构项目**

1. 双方都是 hash 模式路由
2. 使用`registerMicroApps`注册子应用一直报错，后改为`loadMicroApp`手动加载解决报错以及路由各种问题
3. 子应用是 vite 的使用`vite-plugin-qiankun`插件配置环境

```ts
{
  plugins: [
		// ……
		qiankun('genGenerator', {
			// 微应用名字，与主应用注册的微应用名字保持一致
			useDevMode: true
		})
	],
}
```

4. 主应用内容区域嵌套子应用

```vue
<template>
  <section id="gen-generator">
    <section id="subApp"></section>
  </section>
</template>

<script lang="ts" setup>
import { loadMicroApp } from "qiankun";
import { MicroApp } from "qiankun/es/interfaces";
import { onMounted, onUnmounted, onUpdated } from "vue";
import { useRoute } from "vue-router";

let microApp: MicroApp | null = null;
const route = useRoute();

onMounted(() => {
  microApp = loadMicroApp({
    name: "genGenerator",
    entry: `http://localhost:3000${route.path}`,
    container: "#gen-generator",
  });
});

onUpdated(() => {
  microApp?.update && microApp?.update({});
});

onUnmounted(() => {
  microApp?.unmount();
  microApp = null;
});
</script>

<style lang="scss"></style>
```

**485. uniapp 的安卓录音转 pcm 调用讯飞语音转写**

```js
import CryptoJS from "crypto-es";
import { ref } from "vue";
const recorderManager = uni.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();
let webSocketInstance = null;
const SAMPLE_RATE = 16000;
const API_KEY = "";
const API_SECRET = "";
const APP_ID = "";
/**
 * 获取公共配置
 * @returns
 */
function getBaseSendData() {
  return {
    format: `audio/L16;rate=${SAMPLE_RATE}`,
    // 录制的是mp3文件需要何种格式解析 lame  pcm使用raw
    encoding: "raw",
  };
}

/**
 * 数据转化
 * @param {*} buffer
 * @returns
 */
function toString(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

/**
 *
 * @returns
 */
export default function useIflytekSpeech() {
  const renderText = ref("");
  let voicePath = "";

  function uploadMp3File(filePath) {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: "..../recognition/getPcmUrl",
        filePath,
        name: "mp3",
        header: { "Content-Type": "multipart/form-data" }, // 设置请求头
        success: res => {
          resolve(res);
        },
        fail: err => {
          console.log(err);
          reject(err);
        },
      });
    });
  }

  function getPcmData(pcmPath) {
    return new Promise((resolve, reject) => {
      uni.downloadFile({
        url: pcmPath,
        success: res => {
          resolve(res);
        },
        fail: err => {
          console.log(err);
          reject(err);
        },
      });
    });
  }

  recorderManager.onStop(async function (res) {
    console.log("recorder stop" + JSON.stringify(res));
    voicePath = res.tempFilePath;
    const fileData = await uploadMp3File(voicePath);
    console.log("获取到了", fileData.data);
    const pcmData = await getPcmData(fileData.data);
    console.log("huoqule", pcmData);
    plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function (fs) {
      // fs.root是根目录操作对象DirectoryEntry
      fs.root.getFile(
        pcmData.tempFilePath,
        { create: true },
        function (fileEntry) {
          fileEntry.file(function (file) {
            console.log("读取到了文件信息", file.fullPath);
            const fileReader = new plus.io.FileReader();
            fileReader.readAsDataURL(file); // 以URL格式读取文件
            fileReader.onloadend = function (evt) {
              let base64 = evt.target.result.split(",")[1]; // 获取base64字符串
              const arrayBuffer = uni.base64ToArrayBuffer(base64); // 转换为arrayBuffer格式

              console.log("读取的文件流", evt.target.result.length);
              // const arrayBuffer = uni.base64ToArrayBuffer(evt.target.result);
              console.log("读取的文件流， arrayBuffer", arrayBuffer.length);

              const audioString = toString(arrayBuffer);
              let offset = 0;
              console.log("文件读取成功", audioString.length);
              while (offset < audioString.length) {
                const subString = audioString.substring(offset, offset + 1280);
                offset += 1280;
                const isEnd = offset >= audioString.length;
                uni.sendSocketMessage({
                  data: JSON.stringify({
                    data: {
                      status: isEnd ? 2 : 1,
                      audio: btoa(subString),
                      ...getBaseSendData(),
                    },
                  }),
                });
              }
            };
          });
        }
      );
    });
  });

  function renderResult(resultData) {
    let resultText = "";
    let resultTextTemp = "";
    // 识别结束
    let jsonData = JSON.parse(resultData);
    if (jsonData.data && jsonData.data.result) {
      let data = jsonData.data.result;
      let str = "";
      let ws = data.ws;
      for (let i = 0; i < ws.length; i++) {
        str = str + ws[i].cw[0].w;
      }
      // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
      // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
      if (data.pgs) {
        resultText = "";
        if (data.pgs === "apd") {
          // 将resultTextTemp同步给resultText
          resultText = resultTextTemp;
        }
        // 将结果存储在resultTextTemp中
        resultTextTemp = resultText + str;
      } else {
        // resultText.value = resultText.value + str;
        resultText = str;
      }
      console.log("识别结果:", resultTextTemp || resultText || "");
      // console.log('str',str);
      // console.log('resultTextTemp',resultTextTemp);
      //    console.log("resultText.value", resultText.value);
    }
    if (jsonData.code === 0 && jsonData.data.status === 2) {
      uni.closeSocket();
    }
    if (jsonData.code !== 0) {
      uni.closeSocket();
      console.error(jsonData);
    }
  }

  function getWebSocketUrl() {
    // 请求地址根据语种不同变化
    var url = "wss://iat-api.xfyun.cn/v2/iat";
    var host = "iat-api.xfyun.cn";
    var apiKey = API_KEY;
    var apiSecret = API_SECRET;
    var date = new Date().toGMTString();
    var algorithm = "hmac-sha256";
    var headers = "host date request-line";
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
    var signature = CryptoJS.enc.Base64.stringify(signatureSha);
    var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    var authorization = btoa(authorizationOrigin);
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    return url;
  }

  function connectWebSocket() {
    const websocketUrl = getWebSocketUrl();

    // 避免断开重连后多次监听
    if (!webSocketInstance) {
      uni.onSocketOpen(function (res) {
        console.log("WebSocket连接已打开！");
        const params = {
          common: {
            app_id: APP_ID,
          },
          business: {
            language: "zh_cn",
            domain: "iat",
            accent: "mandarin",
            vad_eos: 5000,
            dwa: "wpgs",
          },
          data: {
            status: 0,
            ...getBaseSendData(),
          },
        };
        uni.sendSocketMessage({
          data: JSON.stringify(params),
        });
      });

      uni.onSocketError(function (res) {
        console.log("WebSocket连接打开失败，请检查！", res);
      });

      uni.onSocketClose(function (res) {
        console.log("WebSocket 已关闭！");
      });

      uni.onSocketMessage(function (res) {
        // console.log("收到服务器内容：" + res.data);
        renderResult(res.data);
      });
    }

    webSocketInstance = uni.connectSocket({
      url: websocketUrl,
      fail() {
        console.log("websocket建立失败");
      },
    });
  }

  function startRecord() {
    console.log("开始录音");
    recorderManager.start({
      sampleRate: SAMPLE_RATE,
      format: "mp3",
    });
  }

  function endRecord() {
    console.log("录音结束");
    recorderManager.stop();
  }

  function playVoice() {
    console.log("播放录音");
    innerAudioContext.src = voicePath;
    innerAudioContext.play();
  }

  return {
    connectWebSocket,
    startRecord,
    endRecord,
    playVoice,
    renderText,
  };
}
```

**486. js 判定 markdown 标签是否闭合了**

````ts
const States = {
  text: 0, // 文本状态
  codeStartSm: 1, // 小代码块状态 `xx`
  codeStartBig: 2, // 大代码块状态 ```xxx```
};

/**
 * 判断 markdown 文本中是否有未闭合的代码块
 * @param text
 * @returns {boolean}
 */
export function isInCode(text) {
  let state = States.text;
  let source = text;
  let inStart = true; // 是否处于文本开始状态，即还没有消费过文本
  while (source) {
    // 当文本被解析消费完后，就是个空字符串了，就能跳出循环
    let char = source.charAt(0); // 取第 0 个字
    switch (state) {
      case States.text:
        if (/^\n?```/.test(source)) {
          // 以 ``` 或者 \n``` 开头。表示大代码块开始。
          // 一般情况下，代码块前面都需要换行。但是如果是在文本的开头，就不需要换行。
          if (inStart || source.startsWith("\n")) {
            state = States.codeStartBig;
          }
          source = source.replace(/^\n?```/, "");
        } else if (char === "\\") {
          // 遇到转义符，跳过下一个字符
          source = source.slice(2);
        } else if (char === "`") {
          // 以 ` 开头。表示小代码块开始。
          state = States.codeStartSm;
          source = source.slice(1);
        } else {
          // 其他情况，直接消费当前字符
          source = source.slice(1);
        }
        inStart = false;
        break;
      case States.codeStartSm:
        if (char === "`") {
          // 遇到第二个 `，表示代码块结束
          state = States.text;
          source = source.slice(1);
        } else if (char === "\\") {
          // 遇到转义符，跳过下一个字符
          source = source.slice(2);
        } else {
          // 其他情况，直接消费当前字符
          source = source.slice(1);
        }
        break;
      case States.codeStartBig:
        if (/^\n```/.test(source)) {
          // 遇到第二个 ```，表示代码块结束
          state = States.text;
          source = source.replace(/^\n```/, "");
        } else {
          // 其他情况，直接消费当前字符
          source = source.slice(1);
        }
        break;
    }
  }
  return state !== States.text;
}
````

**487. 对象解构赋值 null 会替代默认值**

```js
let obj = { data: null };
// undefined
const { data = [] } = obj;
// undefined
data;
// null
obj.data = undefined;
// undefined
const { data1 = [] } = obj;
// undefined
data1;
// []
```

**488. unocss tailwindcss 的一些写法**

1. `!important` 在你的 class 前面加个`！` 如 `!text-16`
2. 媒体查询 `sm-max-lg:w-60` `lg:w-60`
3. 背景渐变`bg-gradient-to-r from-[#c973ff] via-purple-500 to-[#f62ea4]`

**489. ts 将数组的值作为类型**

```ts
export const promptTypeList = [
  "写作",
  "音乐",
  "营销",
  "健康",
  "游戏",
  "娱乐",
  "教育",
  "烹饪",
  "编码",
  "产品管理",
  "商业",
  "越狱",
  "其他",
] as const;

export interface CollectItem {
  id?: number;
  title: string;
  type: (typeof promptTypeList)[number];
  content: string;
}
```

** 490. @apply vscode 不识别 **

> https://github.com/unocss/unocss/issues/2401

Guys, the solution:
.vscode/settings.json

```json
{
  "css.customData": [".vscode/unocss.json"]
}
```

.vscode/unocss.json

```json
{
  "version": 1.1,
  "atDirectives": [
    {
      "name": "@apply"
    },
    {
      "name": "@screen"
    }
  ]
}
```

gitignore

```text
!.vscode/unocss.json
!.vscode/settings.json
```

**491. 枚举类型用字符串变量包着就变成值的类型了**

> 触发了分布式条件分发

```ts
/**
 * 颜色的类型
 */
export type ColorType = `${COLOR_TYPE}`;
// type ColorType = "primary" | "success" | "danger" | "warning" | "default"
```

**492. uniapp 微信小程序对接讯飞语音转写**

> https://blog.csdn.net/qq_33525941/article/details/106257929?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-6.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Edefault-6.control&login=from_csdn

1. 核心 pcm 转写

```js
const searchoptions = {
  duration: 60000, //指定录音的时长，单位 ms
  sampleRate: 8000, //采样率
  numberOfChannels: 1, //录音通道数
  encodeBitRate: 48000, //编码码率
  format: "PCM", //音频格式
  frameSize: 1, //指定帧大小，单位 KB
};
recorderManager.onFrameRecorded(res => {
  //每帧触发
  const { frameBuffer } = res;
  const int16Arr = new Int8Array(res.frameBuffer);
  const base64 = wx.arrayBufferToBase64(int16Arr);
  const sendsty =
    '{"data":{"status":1,"format":"audio/L16;rate=8000","encoding":"raw","audio":"' +
    base64 +
    '"}}';
});
```

2. 坑点 电脑编辑器录制 pcm 无法转写 要用真机

**493. 网页上的复制不仅仅能复制文字啊**

1. 看这篇内容https://juejin.cn/post/7348634049681293312 突然才想起来还能复制文件流

**494. nuxt3 一些坑**

> 最近在写 nuxt3 的一个项目 好多坑啊

1. pages 和 layouts 目录中不要写与页面无关的.vue 文件，会被解析成路由访问
2. 鉴权是通过 auth 中间件进行的
3. router.push 以及 nuxtlink 跳转时，不会触发服务端渲染，所以还要在只有客户端渲染时，手动调用客户端的 fetch 函数拉取数据
4. 客户端渲染时，使用 v-loading 有时候设置 false 后，loading 没有被清除，不知道什么 bug
5. fetch 有两个方法，一个是在客户端请求的方法一个是在服务端渲染请求的方法
6. 自定义 404 页面是通过 error.vue 页面控制的，但是这个页面不经过 app.vue 的逻辑，所以 app.vue 中拉取的数据在这里也要拉取

**495. download 标签生效规则**

1. download 标签只有同源下或 blob: file:协议下的资源才能更改文件名

**496. git 改变已经提交的 commit 作者**

- 要修改已经 commit 的提交信息，包括提交人的信息，你可以使用 git commit --amend 命令。如果你只想修改提交信息而不改变作者，可以使用-m 选项。如果需要修改作者，可以使用--author 选项。

- 以下是修改最近一次提交的命令：

`git commit --amend --author="New Author Name <email@address.com>"`

- 如果你需要修改更早的提交，可以使用交互式 rebase：

`git rebase -i HEAD~N  # N是你需要编辑的提交之前的提交数量`

- 在打开的文本编辑器中，找到你想要修改的提交，将该行的 pick 改为 edit，然后保存退出。

- 接下来，Git 会停在那个提交上，允许你修改它。当你做了你需要的任何修改后，运行以下命令来完成提交修改：

```shell
git commit --amend --author="New Author Name <email@address.com>"
git rebase --continue
```

-如果在修改过程中遇到冲突，解决冲突后，运行：

```shell
git add .
git rebase --continue
```

一旦完成，你可能需要使用`git push --force`来强制推送到远程仓库，因为你改变了历史。注意，这种操作应该在确保没有其他人正在基于你的分支工作的情况下进行，因为它会影响所有人的历史。

**497. flex 兄弟元素一个居中一个靠右**

```css
.container {
  display: flex;
  justify-content: flex-end; /* 使右边的元素靠右对齐 */
}

.centered {
  flex-grow: 1; /* 使左边的元素占据剩余空间 */
  text-align: center; /* 文字居中 */
}

.right {
  /* 右边元素不需要额外样式，默认就是靠右 */
}
```

**498. bpmnjs 禁用**

```js
this.bpmnViewer = new Viewer({
  container: this.canvas,
  additionalModules: [
    MoveModule, // 可以调整元素
    ModelingModule, // 基础工具 MoveModule、SetColor 等依赖于此
    MoveCanvasModule, // 移动整个画布
    {
      paletteProvider: ["value", ""], //禁用/清空左侧工具栏
      labelEditingProvider: ["value", ""], //禁用节点编辑
      contextPadProvider: ["value", ""], //禁用图形菜单
      bendpoints: ["value", {}], //禁用连线拖动
      zoomScroll: ["value", ""], //禁用滚动
      moveCanvas: ["value", ""], //禁用拖动整个流程图
      move: ["value", ""], //禁用单个图形拖动
    },
  ],
});
let url = "/static/name_gu5yee5o.bpmn20.xml";
let xmlDoc = this.checkXMLDocObj(url);
this.createNewDiagram(xmlDoc);
```
