# 工作中遇到的坑和思考
## 有不同意见欢迎指正交流
### 前排推荐  https://github.com/topics/javascript   关注JS开源框架动态
### 勤于总结和思考

**1. ajax请求的结果要和后端约定好返回的数据格式。** 
- 比如：成功与否code、提示信息msg、详细的返回数据data。如果每次格式不一致会导致出错。一个场景：后端在当前接口直接返回数据 `response = [1, 2, 3]` ，而后端验证登录过期后返回的数据格式是` response = { code: 2, msg: "登录过期", data: "" } `，这个时候如果你的异常处理没有做好，就可能会出错。

**2. 注意代码的复用（切记）**
- 写逻辑的时候经常能抽离出公用代码，比如一个公共的方法、一个公共的逻辑、能抽离的一定要抽离！不要觉得抽离很难，就是把会变的设置成变量，传递进方法中就行。这样你后期维护的时候会省很多事
 ```javascript
    /* 比如一个计算方法封装到公共的JS中 */
    
    function addResult(a, b, c){
        return a * b - c
    }
    
    /* 如果项目中多次用到这个方法 你就可以直接调用这个函数 */
    
    // 页面a
    addResult( 9, 5, 5 );
    // 页面b
    addResult( 9, 9, 6 );
    
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
        returnNum ( num ) {
            isNaN( num ) && ( num = 0 );
            return Number( num );
        }
    };
    let logic = {
        // 你的逻辑函数
    };
```

**3. 做好异常检测**
- 善用 `try{} catch(){}`
- 数据类型验证
- 后端返回的数据类型验证，不要觉得后端每次返回的类型都是对的。比如有时候空的时候，后端没返回 ` "" `,返回的是 `null`，你的页面就可能报错。
- 传入公共函数中的参数类型验证
- 现在比较流行的 `TypeScript` 就是强类型的JS 是JS的超集 数据验证等 很强大 
- 等等……

**4. 写完界面和逻辑一定要在常用浏览器中跑一下看看是否有兼容性问题**

**5. 静态资源管理**
> 如果项目中使用的有webpack等打包工具 可以避免这个问题 如果没有使用 就要注意了

- 静态资源存在缓存的问题。一个场景就是页面`index.html`中增加了一个公共方法`addNum`，公共方法写在`common.js`中。当用户访问这个页面时，`common.js`并没有得到更新，`addNum is not defined`报错了。我们目前使用的方案就是后端在文件后面添加版本号`common.js?v=xxxxx`，这个版本号可以让后端通过获取文件修改时间来添加，这样就起到了版本控制的效果，最好的方式其实是`common.dde65x.js`这种。v版本的方式有的浏览器还是会无视，但是大部分都没问题。 
- 图片压缩。 图片压缩的话webpack有插件。我们可以使用 [Tiny](https://tinypng.com/) 这个在线压缩的网站来压缩我们的图片。
- css压缩、整理、美化 [CSS在线压缩/整理/格式化工具](https://tool.lu/css/), 很多编译器的插件都有这个功能啦，就不做太多介绍。
- js压缩、整理、混淆 [JS在线压缩/整理/格式化工具](https://tool.lu/js/), 很多编译器的插件都有这个功能啦，就不做太多介绍。

**6. 需求**
- 尽量需求明确后再开始写项目，避免返工。
- 不清楚的需求一定要问清楚，不要怕问。问清楚总比犯错强。

**7. es5块级作用域**
- es5和它之前js并没有明确的模块化和块级作用域规范，现在有es6的`export/import`、`{}`块级作用域等。很方便的，不要抗拒新技术，拥抱它你会爱上它。
- 如果你的项目中技术栈比较落后，没有模块化工具比如 `require.js`、`sea.js`等。你可以使用`闭包`、`匿名函数`模拟一个块级作用域。
- 使用babel写es6在项目中也是一个不错的选择，babel可以单独使用的，不用配合webpack
```javascript
    var glob = {
        // 全局函数 用来实现作用域间的通信
        // 这里定义全局的属性和一些别的
    };
    (function(){
        // 作用域1 这是业务逻辑A的部分 
    })();
    (function(){
        // 作用域2 这是业务逻辑B的部分
    })();
    
    // 注意了 闭包中的变量不会被垃圾回收机制删除 用完记得null一下

```

**8. input也是有长度限制的**
- 在一次项目中，我使用隐藏的`input`来存放`base64`的图片，传递给后端后，图片只有一半了，被截取了。使用的`POST`传输。

**9. z-index的优先级**
- 子元素的`z-index`受父元素影响。如果父元素的`z-index`是2，子元素的`z-index`是`66666`。那么子元素的`66666`只在当前父级下的同级和子集生效，父级以上和父级的兄弟元素仍示`z-index: 66666`为`z-index: 2`。

**10. 神奇的`<pre>`标签**
- `<pre>` 标签可定义预格式化的文本。
- 被包围在 `<pre>` 标签 元素中的文本通常会保留空格和换行符。而文本也会呈现为等宽字体。
- 一个场景： 比如我要解析出来的文本保留用户在`textarea`中输入的换行等，就可以使用这个标签。
-   1. `pre`元素是块级元素，但是只能包含文本或行内元素。也就是说，任何块级元素（常见为可以导致段落断开的标签）都不能位于pre元素中。
    2. `pre`元素中允许的文本可以包含物理样式和基于内容的样式变化，还有链接、图像和水平分隔线。当把其他标签，比如`<a>`标签放到`<pre>`块中时，就像放在HTML/XHTML文档的其他部分中一样即可。
    3. 制表符tab在`<pre>`标签定义的块当中可以起到应有的作用，每个制表符占据8个字符的位置，但并不推荐使用tab，因为在不同的浏览器中，tab的表现形式各不相同。在用`<pre>`标签格式化的文档段中使用**空格**，可以确保文本正确的水平位置。
    4. 如果希望使用`<pre>`标签来定义计算机源代码，比如HTML源代码，请使用符号实体来表示特殊字符。一般将`<pre>`标签与`<code>`标签结合起来使用，以获得更加精确的语义，用于标记页面中需要呈现的源代码。
    5. 如果想要把某一段规定好的文本格式放在HTML中，那么就要利用`<pre>`元素的特性。
    
- 可以使用`white-space`的 `pre`、 `pre-line`、 `pre-wrap` 属性达到相同的效果

**11. 规范**
- 最好弄清楚w3c规范
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

 - substring 有个神奇的地方 就是 start， end ，两个参数  谁小 谁就是 start
 ```javascript
	var str = 'My name is: Jerry . My age is: 12 . : :666 .';
	str.substring( 0, 5 )
	"My na"
	var str = 'My name is: Jerry . My age is: 12 . : :666 .';
	str.substring( 5, 0 )
	"My na"
 ```
 - substr 和 slice 如果遇到负数 会 和 length 相加 
 ```javascript
	var str = 'My name is: Jerry . My age is: 12 . : :666 .';
	str.slice( 0, 5 )
	"My na"
	var str = 'My name is: Jerry . My age is: 12 . : :666 .';
	str.slice( 0, -5 )
	"My name is: Jerry . My age is: 12 . : :"
	str.length
	44
	str.slice(0, 39)
	"My name is: Jerry . My age is: 12 . : :"
 ```
- 从定义上看： substring和slice是同类的，参数都是字符串的某个｛开始｝位置到某个｛结束｝位置（但｛结束｝位置的字符不包括在结果中）；而substr则是字符串的某个｛开始｝位置起，数length个长度的字符才结束。－－ 共性：从start开始，如果没有第2个参数，都是直到字符串末尾
- substring和slice的区别则是，slice可以接受“负数”，表示从字符串尾部开始计数； 而substring则把负数或其它无效的数，当作0。
- substr的start也可接受负数，也表示从字符串尾部计数，这点和slice相同；但substr的length则不能小于1，否则返回空字符串。

**14. 通过promise判断滚动事件是scrollTo触发的还是鼠标滚动触发的**
```javascript
	status = false;
	function timeout( long ){
		return new Promise( function( resolve, reject ){
			window.scrollTo( 0, long )
			setTimeout( resolve, 0 )
		} )
	};

	$(document).click( function(){
		status = true;
		timeout( 200 ).then( function(){
			status = false;
		} )
	} );

	$(window).scroll( function(){
		if( status == 'true' ){
			console.log( '点击事件触发的' )
		}else if( status == 'false' ){
			console.log( '滚动事件触发的' )
		}
	} )
```

**15. 函数的参数可以是个表达式（任意类型）**
```javascript
function timeout( a ){
	console.log(a)
};
timeout( window.scrollTo(0, 200), 6 ) // undefined
```
**16. window.status**
- 全局定义status是不行的 它是个保留字 定义任何都是字符串 
- status属性在IE，火狐，Chrome，和Safari默认配置是不能正常工作。要允许脚本来改变状态栏文本，用户必须把配置屏幕首选项设置为false dom.disable_window_status_change。

**17. 一个有趣的JS面试题目**
```javascript
	function a(xxx){
		this.x=xxx
		return this
	}
	x = a(5)
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
- 给 label指定for 对应input或者别的form元素 即使label不包裹着for 也会触发该元素的聚焦 for把两个不包裹的元素关联了起来
- 而label包裹上的元素不需要写for也可以聚焦

**19. JS中的Label**
- start 在ES5中并没有建立作用域
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

**20. setTimeout严格上来讲并不是全局函数**
- `setTimeout`是`window`的一个方法，如果把`window`当做全局对象来看待的话，他就是全局函数。严格来讲，它不是。全局函数与内置对象的属性或方法不是一个概念。全局函数他不属于任何一个内置对象。JS中包含以下7个全局函数`escape()eval()isFinite()isNaN()parseFloat()parseInt()unescape()`

**21. 一个朋友提的场景需求而引发的Array.sort()方法思考**
```javascript
// 比如一个数组 
let arr = [1, 23, 4, 5, 6, 8, 9, 1,0 ,11, 5, 666, -1, -1, -1 ];
// 需求是 按照升序排列 但是-1必须在最后

arr.sort( (a, b)=>{
	a < 0 && (a = Number.POSITIVE_INFINITY);
	b < 0 && (b = Number.POSITIVE_INFINITY);
	return a - b
} )

arr.sort( (a, b)=>{
  a < 0 || b < 0 && ( a *= -1, b *=-1 );
  return a - b
} )

// 位运算
arr.sort( (a, b) => !~a || !~b ? b : a - b ) 

// sort方法会修改原始数组 使用之前最好拷贝一下原数组
```

**22. 如果你要处理多列或多行之间的计算或别的问题**
- 如果是数据驱动很好处理
- 如果是JQ 计算的时候最好给每列或每行要用到的起个class类名，根绝这个类名去查找计算。这样会避免列或行的增删带来的问题。比如你用eq去找的，但是增加了一列，减少了一列。或者你按着input的name名字去找，后端给你改了名字咋搞呢。

**23. 一个iframe跨域的场景**
- 今天遇到一个场景，父页面A、Iframe页面B和Iframe页面C，B页面提交后通过A页面关闭打开的Iframe
- 父页面A用来操作关闭当前Iframe和刷新A页面中的列表
- Iframe-B中需要上传图片，而上传图片的组件是公共Iframe-C
- 但是Iframe-C的域名和A、B页面不同，产生了跨域问题
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

**24. IE8的异步上传文件方案**
- 基本思路很简单，提交上传文件表单时，让浏览器转移到iframe处理响应信息，响应信息嵌入一段js代码，这段js代码调用当前页面的一个方法就可以实现回调，类似于xss攻击。这时就要用到form表单的target属性，我们这里只需要用到iframename的值，iframename指的是iframe的name属性，意思是转移到iframe处理响应信息。
- 父页面
```html
<form action="excel/uploadExcel" target="testForm" method="POST" enctype="multipart/form-data">
	<input type="file" name="file">
	<input type="submit" value="submit">
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
- iframe页面
```html
<script>
	window.parent.uploadFileCallback( '数据1'， '数据2' )
</script>
```

**25. isNaN( ) 会把被检测的内容先转成数字类型**
> [MDN-isNaN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN)

```javascript
var str = '';
isNaN( str ); // false
Number( str ); // 0

var num = 0;
isNaN( num ); // false

//isNaN() 底层会将字符串先转成数字类型 
isNaN( '666' ) // false
```

**26. 对象拍平方法**

> 我自己写的只能拍平2层 最下面是大猫大牛写的

- 三层的情况
```javascript
var m = { "a": 1, "b": { "c": 2, "d": [3, 4] }, "e": { f: { g: "6" } } };
var obj = {};
function planeHouse( m, child ){
    Object.keys(m).forEach( function( v, k ){
        if( Object.prototype.toString.call( m[v] ) === "[object Object]" ){
		// 如果当前还是一个对象 递归调用 传入child  v是m[v]的子key  obj[b.c] obj[b.d]
		planeHouse( m[v], v )
        }else{
		child ? obj[child+'.'+v] = m[v]  : obj[v] = m[v]
        }

    } )
}

planeHouse( m ) // {a: 1, b.c: 2, b.d: Array(2), f.g: "6"}
```
- 两层的情况
```javascript
var m = { "a": 1, "b": { "c": 2, "d": [3, 4] } };
var obj = {};
function planeHouse( m, child ){
    Object.keys(m).forEach( function( v, k ){
        if( Object.prototype.toString.call( m[v] ) === "[object Object]" ){
			// 如果当前还是一个对象 递归调用 传入child  v是m[v]的子key  obj[b.c] obj[b.d]
			planeHouse( m[v], v )
        }else{
			child ? obj[child+'.'+v] = m[v]  : obj[v] = m[v]
        }

    } )
}

planeHouse( m ) // {a: 1, b.c: 2, b.d: Array(2)}
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
**27. Blob对象**
> [MDN-Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)

- Blob 对象表示一个不可变、原始数据的类文件对象。Blob 表示的不一定是JavaScript原生格式的数据。文件接口基于Blob，继承了blob的功能并将其扩展使其支持用户系统上的文件。
- 要从其他非blob对象和数据构造一个Blob，请使用 Blob() 构造函数。要创建包含另一个blob数据的子集blob，请使用 slice()方法。要获取用户文件系统上的文件对应的Blob对象，请参阅 文件文档。

**28. Postcss-cli的简单使用**
- 今天把项目中的css单独使用postcss优化了一下 
1. npm i -g|-D postcss-cli 安装postcss-cli
2. npm i -g autoprefixer 安装插件
3. cd node_modules/.bin 一定要进入这个文件夹
4. 在3进入的文件夹中 根据相对路径找到你要优化的css （我的是放在了根目录的css文件中）
5. postcss ../../css/common.css -o ../../css/outcommon.css -u autoprefixer
6. 然后你就拿到了加了兼容的新的css样式
- 还有很多插件（现在貌似200+）还没用到 有时间一起研究

**29. IOS9和低版本安卓 不支持 let！**

**30. IOS的时间格式 必须是 2018/03/24 19:11:00**
- IOS的时间格式 必须是 2018/03/24 19:11:00
- IOS的时间格式 必须是 2018/03/24 19:11:00
- IOS的时间格式 必须是 2018/03/24 19:11:00

**31. Vue开发微信网页遇到的一些问题**
- 前几天做一个专题，本来有个老的模板，可以直接套，但是我想用VUE，于是给自己找了个大麻烦，熬到凌晨，还加了班，最后因为微信的配置问题和甲方比较催促，不得不放弃了。讲一下期间遇到的问题，等这个项目忙完了，接着研究，不能遗留这些问题。
- 1. Vue bus的状态没有实时更改，不得不采用props传值的麻烦方式，具体在弹窗的那里 —— 待解决。
  2. 微信wx.config 签名无效一直报错（这是我最后放弃使用vue的原因，实在是来不及了）所以你使用Vue开发微信的时候一定要提前做个demo测试一下，貌似通过`URL.split('#')[0]`这样传递给后端去做签名就行了
  3. 如何使用内网穿透调试微信。
  4. 桌面右下角的网络查看属性IPV4的ip并不准确 还是要用`cmd`-`ipconfig`
  5. Vue `beforeEach`的全局路由导航中 如果没有进入登录页面（获取用户信息存储到Store中） 你在这个周期里用Store取值是拿不到的，所以要做个路由名称的判断(当时脑子确实写浆糊了 几近崩溃 很难受)
  6. IOS的时间格式 必须是 `2018/03/24 19:11:00`
  7. IOS<=9和老版本的安卓的系统 不支持`let`
  8. 关于微信的授权： 
  	+ 我们的后端是通过URL的hash值将用户授权后的信息传递给我
	+ 首先你要做个Vue的登录页
	+ 思路是 这个登录页中，`mouted`或者`creadted`周期中判断url中是否有后端传来的hash，我们定的是data，如果取到了这个hash并且有内容，就存储到`store`中
	+ 在这个组件中首先要跳转到后端的授权链接假如是`http://www.shou.com`
	+ 然后后端接到这个请求链接后，将参数附加在URL中 `http://www.shou.com?data={"user": {"openid": "ssxffqfsf"}}`
	+ 然后后端还会重定向回我们的页面，然后我们再次进入这个登录组件，这个时候就取到了后端给我们的hash然后就可以进入我们的项目了
  
**32. table表格中的表格如果使用relative定位会导致表格边框消失**
- 在IE、火狐中都测出该问题
- 解决思路： 给td中套一个div，给这个div设置相对定位，内容写在相对定位的DIV中。
- 可看帖子 [解决IE浏览器下：td标签上有position: relative;与background-color属性时td边框消失](https://blog.csdn.net/littlebeargreat/article/details/71123979)
- 另一种思路，看场景。 不要给td背景色 给tr背景色 当:hover当前行的时候就不会出现边框问题了

**33. 一个横着铺开的ul列表的样式**
```css
.tabs .tabs-navbar .tabs-nav{
    height: 30px;
    white-space: nowrap;
    overflow: hidden;
}   
.tabs .tabs-navbar .nav-tabs>li{
    display: inline-block;
    float: none;
} 
```
**34. table使用 table-layout: fixed;带来的问题**
- table使用table-layout: fixed;然后使用colspan rowspan 会使子表格中设置宽度失效，这个时候可以用
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

**35. JQ $(dom).html()保存的html中没有input和textarea的值**
- 监听textarea和input的input事件 赋值在DOM结构上即可
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
> 传送门 [DOM操作成本到底高在哪儿？](https://segmentfault.com/a/1190000014070240?utm_source=feed-content)

- **reflow(回流)**: 根据Render Tree布局(几何属性)，意味着元素的内容、结构、位置或尺寸发生了变化，需要重新计算样式和渲染树；
- **repaint(重绘)**: 意味着元素发生的改变只影响了节点的一些样式（背景色，边框颜色，文字颜色等），只需要应用新样式绘制这个元素就可以了；
- reflow回流的成本开销要高于repaint重绘，一个节点的回流往往回导致子节点以及同级节点的回流；
- **引起reflow回流**
    1. 页面第一次渲染（初始化）
    2. DOM树变化（如：增删节点）
    3. Render树变化（如：padding改变）
    4. 浏览器窗口resize
    5. 获取元素的某些属性：
    6. 浏览器为了获得正确的值也会提前触发回流，这样就使得浏览器的优化失效了，这些属性包括offsetLeft、offsetTop、offsetWidth、offsetHeight、 scrollTop/Left/Width/Height、clientTop/Left/Width/Height、调用了getComputedStyle()或者IE的currentStyle
	
- **引起repaint重绘**
	1. reflow回流必定引起repaint重绘，重绘可以单独触发
	2. 背景色、颜色、字体改变（注意：字体大小发生变化时，会触发回流）

- **优化方式**

    1. 避免逐个修改节点样式，尽量一次性修改
    2. 使用DocumentFragment将需要多次修改的DOM元素缓存，最后一次性append到真实DOM中渲染
    3. 可以将需要多次修改的DOM元素设置display: none，操作完再显示。（因为隐藏元素不在render树内，因此修改隐藏元素不会触发回流重绘）
    4. 避免多次读取某些属性（见上）
    5. 将复杂的节点元素脱离文档流，降低回流成本

- **为什么一再强调将css放在头部，将js文件放在尾部**
	+ DOMContentLoaded 和 load
		1. DOMContentLoaded 事件触发时，仅当DOM加载完成，不包括样式表，图片...
		2. load 事件触发时，页面上所有的DOM，样式表，脚本，图片都已加载完成
	+ CSS 资源阻塞渲染
		1. 构建Render树需要DOM和CSSOM，所以HTML和CSS都会阻塞渲染。所以需要让CSS尽早加载（如：放在头部），以缩短首次渲染的时间。
	+ JS 资源
		1. 阻塞浏览器的解析，也就是说发现一个外链脚本时，需等待脚本下载完成并执行后才会继续解析HTML
			- 这和之前文章提到的浏览器线程有关，浏览器中js引擎线程和渲染线程是互斥的，详见[《从setTimeout-setInterval看JS线程》](https://segmentfault.com/a/1190000013702430#articleHeader2)
		2. 普通的脚本会阻塞浏览器解析，加上defer或async属性，脚本就变成异步，可等到解析完毕再执行
			- async异步执行，异步下载完毕后就会执行，不确保执行顺序，一定在onload前，但不确定在DOMContentLoaded事件的前后
			- defer延迟执行，相对于放在body最后（理论上在DOMContentLoaded事件前）


**37. 滚动的图片视差效果demo**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>滚动的图片视差效果demo</title>
    <style>
        body{
            margin: 0;
            background: url('../images/timg.jpg')no-repeat;
            background-size: 100% 100%;
	    /*这个属性把背景图固定住*/
            background-attachment: fixed;
        }
        header, footer{
            height: 800px;
            background: #fff;
        }
        section{
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

**38. NVM安装后，以前装的Node的环境变量没了**
- 自己没好好看安装的提示文字吧
- 第一个安装路径是NVM的安装路径
- 第二个安装路径是你已经安装的Node环境的安装路径，比如我的node在安装NVM之前装在D:\node\, NVM安装的第二个路径就要是这个路径下，这样你的Node环境变量就不会丢失了

**39. 移动端web页面上使用软键盘时如何让其显示“前往”（GO）而不是换行？**
- 用一个 form 表单包裹住就会显示前往，单独的一个 input 就会提示换行。

**40. vue使用bootstrap的响应式布局**
1. http://v3.bootcss.com/customize/ 到这里去定制bootstrap  所有的都不勾选 只勾选 grid
2. 下载下来 引入到你的vue项目用
3. 和使用bootstarp一样布局吧 亲测好用

**41. VUE权限控制——动态路由的方案**
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

**43. 关于toString和valueof的面试题**
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

**44. ‘false‘如何转成布尔后仍然是false**
```javascript
const str = 'false';
Boolean(str) // true
JSON.parse(str) // false  
// 使用JSON.parse()最好try-catch 避免报错
```

**45. 字符串不会隐式转换的**
```javascript
'0' == ''
false
'0' == false
true
'' == false
true
```

**46. 一个数组交叉合并题**
```javascript
const arr = [ ["1", "2", "3"], [ "a", "b" ] ];
for( let i = 0, l = arr[0].length; i < l ; i++ ){
	newArr.push( arr[0][i] + arr[1][0], arr[0][i] + arr[1][1] )
}
// ["1a", "1b", "2a", "2b", "3a", "3b"]
```

**47. 函数柯里化**
```javascript
// 固定参数实现
const result = x => y => z => x * y * z;
result(3)(4)(4) // 48;
// 柯里化实现
function curry(fn) {
	const len = fn.length;
	return function curried() {
		const args = Array.prototype.slice.call(arguments);
		if (args.length >= len) {
			return fn.apply(this, args);
		}            
		return function () {
			return curried.apply(this, args.concat(Array.prototype.slice.call(arguments)));
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
arr[4] = 'a';
console.log(arr) // [ emptyx3, 4 ]
// 如果要循环出来 需要用for 使用forEach 等一些高阶函数 会过滤空的数组
```

**49. Array.sort()**
- Array.sort()默认是按照字符集排序的
```javascript
let arr = [6, 1,0, 8, 9, 10, 15, 20, 9];
// 字符集
arr.sort() // (9) [0, 1, 10, 15, 20, 6, 8, 9, 9];

// 老老实实回调不能少
arr.sort((a, b) => {
	return a - b;
})

```

**50. 数组含有[0001]这种类型的问题**
```javascript
var arr = [['0001', '0010'], ['0020', '0300'], ['0301', '0400']]
console.log(JSON.stringify(arr)) // [["0001","0010"],["0020","0300"],["0301","0400"]]

var arr = [[0001, 0010], [0020, 0300], [0301, 0400]]
console.log( JSON.stringify( arr ) ) // [[1,8],[16,192],[193,256]]

```

**51. 正则g的问题**
> [原文](https://blog.csdn.net/jackie_tsai/article/details/52102363)

-在创建正则表达式对象时如果使用了“g”标识符或者设置它了的global属性值为ture时，那么新创建的正则表达式对象将使用模式对要将要匹配的字符串进行全局匹配。在全局匹配模式下可以对指定要查找的字符串执行多次匹配。每次匹配使用当前正则对象的lastIndex属性的值作为在目标字符串中开始查找的起始位置。 lastIndex属性的初始值为0，找到匹配的项后lastIndex的值被重置为匹配内容的下一个字符在字符串中的位置索引，用来标识下次执行匹配时开始查找的位置。如果找不到匹配的项lastIndex的值会被设置为0。 当没有设置正则对象的全局匹配标志时lastIndex属性的值始终为0，每次执行匹配仅查找字符串中第一个匹配的项。可以通过regex.lastIndex来访问在执行匹配相应的lastIndex 属性的值。
- 多次使用同一个g正则匹配同个字符串可能会出现问题

**52. animation-fill-mode: forwards 影响z-index关系**
- #content > .modal #content包裹着modal弹窗 
- modal的遮罩层和#content是兄弟节点关系
- #content 是absolute定位 但是没有设置z-index modalz-index是1050 遮罩层是1040
- 当使用animation-fill-mode: forwards时 modal的z-index失效 或是受#content的无z-index影响 导致遮罩挡着弹窗 具体原因 还不清楚

**53. 传统a链接跳转的网页也可以加过度动画的**
- 具体动画看你怎么加喽  体验也很棒
```html
<head>
	<style>
		.content{
			opacity: 0;
			transition: opacity 0.5s;
		}
		.content.active{
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
		var content = document.querySelector('.content');
		content.classList.add( 'active' ) // 这个 classList IE10才行
	</script>
</body>
```

**54. net::ERR_BLOCKED_BY_CLIENT**
- 可能是用户装了什么过滤插件  把当前域名加到浏览器白名单或插件白名单就行了

**55. 抽象的组件到底是用一个公共DOM还是多个DOM**
- 推荐多个DOM  如果用一个公共DOM容易出问题 当然看组件的复杂度和业务逻辑 
- 比如一个下拉列表组件 还是用多个dom吧 就是生成多个DOM结构 
- 可以使用 .el + 随机数的方式生成class名字 
- 但是要注意生成的随机数不要保存在this.引用类型中 会造成状态共享的问题！！！

**56. 接口、css、JS中不要出现 ad或者广告一类的英文词语**
- 为啥 会被无情地屏蔽 哈哈哈

**57. Blob对象了解下**
[MDN-Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)

**58. :active在移动端不生效**
> [解决方案](https://blog.csdn.net/freshlover/article/details/43735273)

-看来在iOS系统的移动设备中，需要在按钮元素或body/html上绑定一个touchstart事件才能激活:active状态
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
*{ -webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-tap-highlight-color: transparent; /* For some Androids */ } 
```

**60. Vue和Elementui写后台页面，路由和组件划分的问题**
- 如果我们有两个导航栏，hader（头） 和 aside（左侧）和一个主体区域contain
- 想实现 切换头的导航 aside和contain要切换
- 切换aside的导航 只切换contian
- index组件和me组件的内容 **即便一样也要拆开**
```vue
<template>
    <div class="container-fluid index">
        <v-header />
        <v-aside />
        <transition name="el-fade-in-linear" >
            <router-view class="container-fluid"></router-view>
        </transition>
    </div>
</template>
```
- header部分的导航看做父路由，如果两个导航内的结构和代码一样的话也要拆分开，不然路由的组件不会重新渲染，比如/index,/me,即便component的内容相同，也要写成
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
- 导致component不会重新渲染， aside的导航栏的active获取就出了问题
- 这样，切换header的时候 aside和contain就切换了
- 切换aside 只切换contain

**61. 牢记一点： VUE切换路由，相同的组件不会重新渲染！**

**62. 了解下鸭式辩型**
- 他和鸭子一样的习性，就认为他是鸭子

**63. 在vue中灵活运用原生JS**
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
    } catch (x) { // 因为这个x的关系， 外部的x不可访问了 而y仍然可以访问
        var x = 1, y = 2; 
        console.log(x);
    }
    console.log(x);
    console.log(y);
})();

1
undefined
2
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

**65. FormData配合JQ ajax**
> [通过Ajax使用FormData对象无刷新上传文件](https://www.cnblogs.com/zzgblog/p/5417969.html)

- Ajax的processData设置为false。因为data值是FormData对象，不需要对数据做处理。（第二种方式中<form>标签加enctyp　　e="multipart/form-data"属性。）
- cache设置为false，上传文件不需要缓存。
- contentType设置为false。因为是由<form>表单构造的FormData对象，且已经声明了属性enctype="mutipart/form-data"，所以这里设置为false。

**66. 图片预览**
- URL.createObjectURL(blob);
- FileReader()

**67. webview不支持input:file 需要安卓重写底层**

**68. webview如果不开启DOM缓存，localStorage等将失效**

**69. 美化select input 等 移动端原表单组件**
> [MDN-appearance](https://developer.mozilla.org/zh-CN/docs/Web/CSS/-moz-appearance)
```css
select{
/* 看起来是个按钮 */
  appearance:button;
  -moz-appearance:button;
  -webkit-appearance:button;
  border:none;
}
/* 去除点击高亮 */
*{ 
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-tap-highlight-color: transparent; 
}
```

**70. webview中用户不选照片仍会返回一个file对象**
- 可以通过file的size来判断是否有图片

**71. VUE使用viewerJS**
> [viewerJS传送门](https://github.com/fengyuanchen/viewerjs)

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
console.log( this.$refs.passInput ) // 显示的是vue组件 然后我找到了挂载的el
console.log( this.$refs.passInput.$el ) // 显示的是当前DOM 
this.$refs.passInput.$el.querySelector('input').focus() // 然后在找到input focus
```

**74. Vue-cli api请求架构的建议**

- 请求的接口单独管理 —— api.js
```javascript
/*api.js*/
export const CONTEXT = '';

export const FILE_LIST = CONTEXT + '/api/file/list';
```

- 请求的方法单独管理 —— fetch.js
```javascript
/*fetch.js*/
// 我们封装的fetch.js
import axios from 'axios';
import {Message} from 'element-ui';
import auth from './auth';
const model = process.env.NODE_ENV === 'development';

//设置用户信息action
export default function fetch(options, type) {
  let token = '';
  if (options.url.indexOf('api') > 0) {
    token = JSON.stringify({
      deviceType: 'WEB',
      token: 'Basic  ' + auth.getToken()
    });
  }
  //console.log('token is ' + token);
  return new Promise((resolve, reject) => {
    // https://github.com/mzabriskie/axios
    //创建一个axios实例
    const instance = axios.create({
      headers: {
        'Authorization': token
      }
    })
    //请求处理
    instance(options)
      .then(({
        data: data
      }) => {
        //console.log(data);
        var status = data.status;
        var msg = data.msgContent;
        var body = data.body;

        //请求成功时,根据业务判断状态
        if (status === 200) {
          //console.log(11);
          resolve({
            data: body
          })
        } else if (status === 300) {
          if( model ){
            Message.warning(msg)
          }else{
            setUserInfo(null)
            router.replace({name: "login"})
            Message.warning(msg)
          }
        }
      })
      .catch((error) => {
        //请求失败时,根据业务判断状态
        if (error.response) {
          let resError = error.response
          let resCode = resError.status
          let resMsg = error.message;
          // 判断是否是开发模式 开发模式调用本地模拟数据
          if( model ){
            let mockData = getMockData(JSON.stringify(options.url))
            resolve({
              data: mockData
            });
          }else{
            Message.error('操作失败！错误原因 ' + resMsg)
            reject({code: resCode, msg: resMsg})
          }
        }
      })
  })
}
```

- 具体到某个模块的请求 —— list.js
```javascript
import * as api from '../api'
import fetch from '../common/fetch'

export function getList (data) {
  return fetch({
    url: api.FILE_LIST,
    method: 'post',
    data
  })
}
```

**75. nodemon——node的热更新**
> [node中的express框架，nodemon设置修改代码后服务自动重启](https://blog.csdn.net/a419419/article/details/78831869)

- -g 安装 nodemon
- 当前根目录下配置`nodemon.json`
```json
{
    "restartable": "rs",
    "ignore": [
        ".git",
        ".svn",
        "node_modules/**/node_modules"
    ],
    "verbose": true,
    "execMap": {
        "js": "node --harmony"
    },
    "watch": [

    ],
    "env": {
        "NODE_ENV": "development"
    },
    "ext": "js json"
}
```
- 配置项介绍
```html
restartable-设置重启模式
ignore-设置忽略文件
verbose-设置日志输出模式，true 详细模式
execMap-设置运行服务的后缀名与对应的命令
{
“js”: “node –harmony”
}
表示使用 nodemon 代替 node
watch-监听哪些文件的变化，当变化的时候自动重启
ext-监控指定的后缀文件名
```
- 修改app.js文件，记得注稀最后一行的：module.exports = app;
```javascript
var debug = require('debug')('my-application'); // debug模块
app.set('port', process.env.PORT || 3000); // 设定监听端口

//启动监听
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

//module.exports = app;//这是 4.x 默认的配置，分离了 app 模块,将它注释即可，上线时可以重新改回来
```
- 启动服务 
```javascript
nodemon app.js
```

**75. js触发window的resize事件**
```javascript
export const triggerResize = ()=>{
  if( document.createEvent) {
    var event = document.createEvent ("HTMLEvents");
    event.initEvent("resize", true, true);
    window.dispatchEvent(event);
  } else if(document.createEventObject){
    window.fireEvent("onresize");
  } 
}
```

**76. 字节换算**
```javascript
export const bytesToSize = (bytes) => {
  if (bytes === 0) return '0 B';
  var k = 1000, // or 1024
      sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));

 return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}
```

**77. Vue监听store中的state**
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

**78. Vue使用 highcharts的扩展**
- 最主要的是引入扩展包

```javascript
import Highcharts from 'highcharts/highstock'; // 必须
import HighchartsMore from 'highcharts/highcharts-more'; // 必须
import SolidGauge from 'highcharts/modules/solid-gauge.js'
HighchartsMore(Highcharts)
SolidGauge(Highcharts);
```


```vue
<template>
    <div>
        <div id="highCharts" style="width: 400px; height: 300px;"></div>
    </div>
</template>

<script>
    import Highcharts from 'highcharts/highstock';
    import HighchartsMore from 'highcharts/highcharts-more';
    import SolidGauge from 'highcharts/modules/solid-gauge.js'
    HighchartsMore(Highcharts)
    SolidGauge(Highcharts);

    Highcharts.setOptions({
        chart: {
            type: 'solidgauge'
        },
        title: null,
        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
            }
        },
        tooltip: {
            enabled: false
        },
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
                lineWidth: 0,
                minorTickInterval: null,
                tickPixelInterval: 400,
                tickWidth: 0,
                title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    });



    export default {
        mounted(){
           this.init();
        },
        data(){
            return {
                
            }    
        },
        methods:{
            init(){
                this.draw();
            },
            draw(){
                new Highcharts.chart('highCharts', {
                    yAxis: {
                        min: 0,
                        max: 200,
                        title: {
                            text: '速度'
                        }
                    },
                    credits: {
                            enabled: false
                    },
                    series: [{
                            name: '速度',
                            data: [80],
                            dataLabels: {
                                    format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                                    '<span style="font-size:12px;color:silver">km/h</span></div>'
                            },
                            tooltip: {
                                    valueSuffix: ' km/h'
                            }
                    }]
                });
            }
        }
    }
</script>

<style lang="stylus">
     
</style>

```

**78. 只期待后来的你能快乐 那就是后来的我想要的**
- 今天什么都没学，就只想说这么一句话。

**79. Vue引入了公共样式的style少用scoped**
- 如果引用了公共样式，公共样式同样会加scoped  会造成重复代码

**80. echarts的响应式**
- echart.resize()
- option.grid.containLabel // 这个参数非常棒

**81. addEventListener的第三个参数已经是一个对象了，不再是简单的true，false**
> [MDN-EventTarget.addEventListener()](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

**82. 简单的防抖写法**
- 节流是事件不再触发多少秒后触发回调函数
- 防抖是事件频繁触发中每多少秒触发一次回调函数

```javascript
// 简单的节流函数
function throttle(func, wait, mustRun) {
    var timeout,
        startTime = new Date();
 
    return function() {
        var context = this,
            args = arguments,
            curTime = new Date();
 
        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if(curTime - startTime >= mustRun){
            func.apply(context,args);
            startTime = curTime;
        // 没达到触发间隔，重新设定定时器
        }else{
            timeout = setTimeout(func, wait);
        }
    };
};
// 实际想绑定在 scroll 事件上的 handler
function realFunc(){
    console.log("Success");
}
// 采用了节流函数
window.addEventListener('scroll',throttle(realFunc,500,1000));
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
- 这道题的答案是：2、4、1、1、2、3、3。
-这里考察声明提前的题目在代码中已经标出，这里声明getName方法的两个语句：
```javascript
var getName = function () { alert (4) };
function getName() { alert (5) }
```
-实际上在解析的时候是这样的顺序：
```javascript
function getName() { alert (5) }
var getName;
getName = function () { alert (4) };
```
- 如果我们在代码中间再加两个断点：
```javascript
getName(); // 5
var getName = function () { alert (4) };
getName(); // 4
function getName() { alert (5) }
```
- 在第一次getName时，function的声明和var的声明都被提前到了第一次getName的前面，而getName的赋值操作并不会提前，单纯使用var的声明也不会覆盖function所定义的变量，因此第一次getName输出的是function声明的5；
而第二次getName则是发生在赋值语句的后面，因此输出的结果是4，所以实际代码的执行顺序是这样：
```javascript
function getName() { alert (5) }
var getName;
getName(); // 5
getName = function () { alert (4) };
getName(); // 4
```

**84. 数组方法的32场演唱会**
> 摘抄自 @大转转FE

```html
来跟我一起唱
判断是不是数组，isArray最靠谱。
按照条件来判断，every/some给答案
是否包含此元素，includes最快速。
find/findIndex很相似，按条件给第一个值。
indexOf/lastIndexOf也很强，有没有来在哪忙。
from和of，都能用来生数组。
concat当红娘，数组结婚她帮忙。
filter瘦身有一套，不想要的都不要。
map整容有实力，改头换面出新意。
slice就像买切糕，想切哪来就下刀。
自力更生很重要，copyWithin自己搞。
fill就像填大坑，想往哪扔往哪扔。
搬山摸金四兄弟，pop、push、shift、unshift不难记。
造反其实很容易，reverse一下看好戏。
sort排序有技巧，能小大来能大小。
splice要认识，能插能删有本事。
forEach最熟悉，有人说它是万能滴。
keys、values、entries，遍历数组新方式。
算总账，不要慌，reduce、reduceRight帮你忙。
toString，join变字符，toLocaleString不常用。
当里个当，当里个当，数组32方法，猥琐发育不要浪，嘿！不要浪！
```

**85. Object对象如果key是数字，会按照数字从小到大排列**
```javascript
const object3 = { 100: 'a', 2: 'b', 7: 'c' };
console.log( object3 );
// {2: "b", 7: "c", 100: "a"}
```

**86. Object.definePrototy 用法的一道题**
```javascript
var foo = ( function(){
	var o = {
		a: 1,
		b: 2
	};
	return function( key ){
		return o[key]
	}
} )();
// 不改变以上函数  取出o的所有属性

Object.defineProperty( Object.prototype, '_getAll', {
	get(){
		return this;
	}
})
let obj = foo('_getAll');
// 避免污染
delete Object.prototype._getAll;
Object.keys( obj )
```

**87、 OS X 快捷键**
```html
control + a ：移到命令行首，HOME
control + e ：移到命令行尾，End

control + f ：按字符前移（右向）
control + b ：按字符后移（左向）

option + f ：按单词前移（右向）
option + b ：按单词后移（左向）

control + u ：从光标处删除至命令行首
control + k ：从光标处删除至命令行尾

control + w ：从光标处删除至字首等同于option + backspace
option + d ：从光标处删除至字尾

control + l : Clean

control + d ：删除光标处的字符
control + h ：删除光标前的字符

control + y ：粘贴至光标后

option + c ：从光标处更改为首字母大写的单词
option + u ：从光标处更改为全部大写的单词
option + l ：从光标处更改为全部小写的单词

control + t ：交换光标处和之前的字符
option + t ：交换光标处和之前的单词
```

**88. 一个简单的模板引擎**
```javascript
let data = {
	'up': '运行了',
	'Exited': '关闭了',
	'month': '月',
	'days': '天',
	'hours': '小时',
	'minutes': '分钟',
	'secondes': '秒',
	'ago': '',
	'Less than a second': '少于一秒',
	'About a minute': '大概一分钟',
}

var str = '系统{%up%}, 15{%days%}';
var regex = /\{%([^{]+)%\}/g;
var match = null;
while( match = regex.exec( str ) ){
	// console.log( match )
	match.index -= match[0].length;
	console.log( match[0] )
	str = str.replace( match[0], data[match[1]] );
	regex.lastIndex = 0
}
console.log(str )  
```

**89. 获取对象中所有的id**
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

**90. ajax请求到的blob对象下载**
```javascript
/**
 * 下载传入的文件流
 * @param { Blob } blob 文件流
 * @param { String } file_name 生成的文件名称 
 */
export const download_blob = ( blob, file_name ) => {
  return new Promise( (resolve, reject) => {
    try {
      const BLOB = new Blob([blob])
      if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = file_name;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(BLOB);
          document.body.appendChild(elink);
          elink.click(); 
          // trigger 不触发下载 trigger( elink, 'click' )
          // 删除引用 释放URL 对象
          URL.revokeObjectURL(elink.href);
          document.body.removeChild(elink);
        // IE10+下载  
      } else { 
          navigator.msSaveBlob(BLOB, file_name)
      }
      resolve({ status: 'success', content: '' })
    } catch (error) {
      reject({ status: 'error', content: error })
    }
  })
}


axios({}).then( res => {
                download_blob( res, Date.parse(new Date()) + '.xls' ).then( data => {
                    console.log( data )
                }).catch( err => {
                    console.log( err )
                })
            }).catch( err => {
                console.log( err )
            })

```

**91. 前端下载文件常见的两种方式**
- ajax
```javascript
// 请求的responsetype设置为 responseType: 'blob'
// 剩下的参考90那条
```
- form表单下载
> 参考 [隐藏form表单下载文件](https://blog.csdn.net/java_trainee/article/details/73647806)

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

**94. vue-cli3.0 webpack插件设置**
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
- PC站网页的分辨率 1920 1377 等 都要兼容照顾

**96. 善用webpack得alias**
- 虽然有点晚了，但是不要再写那么麻烦的`../../../`了
- 一个 alias变量多么方便

**97. 为何不尝试学习下express呢**
- 前后端分离的项目中，你完全可以使用express等来模拟数据
- 可以模拟真实环境，比如利用延迟达到网络不好的异常检测，分页查询数据，不同的值返回不同的数据……
- 很简单的，不需要查询数据库！认真脸！不需要查询数据库！你直接返回json字符串就行了

**99. OS系统是真的好看**
- 平心而论，UI效果比Windows确实好，好友推荐给我了一款软件叫`mactype`，用来在Windows上做类似OS的美化

**100. 如何不写域名的情况下修改端口**
```javascript
io.connect("http://192.168.1.122:8080");
// 改成我们自己的
io.connect(":9101"); // http://localhost:9101
```

**101. Vue Highcharts 双饼图需要引入的**
```javascript
// 只有这一个就好啦
import Highcharts from 'highcharts'
```

**102. linear-gradient可以用在很多地方的**
```css
.box{
	height: 400px; width: 400px;
	border: 30px solid transparent;
	border-image: linear-gradient(45deg,red,blue) 10%
}
```

**103. 禁止缩放的时候（meta）部分浏览器就已经解决300毫秒延迟的问题了**
> [移动端点击300ms延迟问题和解决](https://blog.csdn.net/qq_34986769/article/details/62046696)

**104. VsCode 配置eslint和prettier保存格式化代码**
```json
{
  "prettier.eslintIntegration": true,
  "eslint.autoFixOnSave": true,
  "editor.formatOnSave": true
}

```

**105. 请用JS计算1-10000之间有几个零**
```javascript
let arr = [];
for( let i = 1, l = 10000; i <= l; i++){
	arr.push(i)
}
arr.join().match(/0/g) // 2893
```

**106. 一个比较全面的前端面试题集合**
- [前端面试题（1）Html](https://segmentfault.com/a/1190000014994737)
- [前端面试题（2）CSS](https://segmentfault.com/a/1190000014994892)
- [前端面试题（3）JavaScript现代化开发](https://segmentfault.com/a/1190000015150912)
- [前端面试题（4）JavaScript知识点](https://segmentfault.com/a/1190000015162142)
- [前端面试题（5）安全性能优化](https://segmentfault.com/a/1190000015275832)
- [前端面试题（6）HTML语义化标签](https://segmentfault.com/a/1190000013901244)
- [前端面试题（7）href url src](https://segmentfault.com/a/1190000013845173)

**107. 今天踩得IE的几个坑**
- IE没有`window.scrollY` 使用document来获取滚动高度
```javascript
export const getScrollTop = function () {
    let scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}
```
- IE的new Date("2018-05-06 00:00:00")报错 要改成斜线
- IE的Date.parse("2018-05-06 00:00:00")报错 要改成斜线

**108. promiseAll 使用的时候也是要多考虑的**
- 比如我有三个请求 使用了promiseAll之后 其中一个请求报500了  整个promiseall的回调会走向catch 其他正确的不再执行了

**109. transform和z-index的关系 了解下**
- 今天做项目再次遇到了z-index失效的问题 上次是因为animation 这次是因为 transform 
- [z-index和transform,你真的了解吗？](https://blog.csdn.net/fanhu6816/article/details/52523815)

**110. IOS系统下浏览器滚动漏黑底 别担心 iNoBounce来帮您**
> [iNoBounce](https://github.com/lazd/iNoBounce)

- 亲测可行
```html
<!doctype html>
<html>

<head>
	<title>iNoBounce Example - Full</title>
	<!-- Ensure correct presentation on iOS -->
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<meta name="apple-mobile-web-app-capable" content="yes">
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
		<li>List Item 3</li>更多li。。。
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
  return flattened.some(item => Array.isArray(item)) ? 
    flattenArray(flattened) : flattened;
}
const arr = [11, [22, 33], [44, [55, 66, [77, [88]], 99]]];
const flatArr = flattenArray(arr); 
//=> [11, 22, 33, 44, 55, 66, 77, 88, 99]
```

**112. compositionstart和compositionend**
- 今天遇到一个场景，共有六个inpu，点删除按键删空这个之后，让上一个input聚焦
- 于是遇到了一个问题
- 搜狗输入法输入的状态下，如果这个input不是第一个而且是空的，在没有输入进去的情况下，按删除键取到的$val是空的，会造成聚焦上一个input，从而再按删除的时候，删除上一个input的值，导致光标乱跳
- 通过composition的状态可以确定用户是否输入完毕，之后再进行之后的逻辑
```vue
<template>
<div class="seria-item" v-for="( item, index ) in seriaNums" :key="index">
	<input v-model.trim="seriaNums[index]" class="ht-input small seria" ref="seriaInput" @compositionstart="composition=false" @compositionend="composition=true" @keyup.delete="seriaDelete($event, index)" @input="seriaChange($event, index)">
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

> [我自己亲测可跑的demo 没图片，可以自己随便找几个图片](https://github.com/542154968/Development-attention-point/blob/master/webpack3.x%E7%9A%84%E4%B8%80%E4%BA%9Bdemo/%E7%99%BE%E5%BA%A6%E5%9C%B0%E5%9B%BE%E6%A0%B9%E6%8D%AE%E5%8C%BA%E5%9F%9F%E8%81%9A%E5%90%88%E7%82%B9%E7%9A%84demo.md)

- 是  根据地图的缩放zoom值  分级 （省 市 区/ 乡镇 街道） 
- 根据这个值 来获得后端返回的每个级别的数据 然后写个自定义的标注在该级别点的坐标上
- 一二三级都是统计数据  第四级是详细的点数据

**114. 小程序数据请求的注意点（待验证）**
> [《腾讯游戏人生》微信小程序开发总结](https://segmentfault.com/a/1190000015393890)

- 请求不支持设置header的refer；
- 请求url不允许带自定义端口，只能是默认80端口；
- 请求content-type默认为'application/json'，如需用POST请求则需改为'application/x-www-form-urlencoded'或'multipart/form-data'，否则后台请求里得不到post数据；
- 后台接收请求php里最好用json_decode（file_get_contents("php://input")）方式获取完整的post数据，否则如果传递较为复杂的多层post数据结构体，直接用$_POST等可能导致获取数据格式异常或失败

**115. 在移动端遇到的一个VUE数据渲染的问题**
- 场景是一个table列表，分页
- 遇到的问题是 第一页的第一条的mobile手机号数据，再跳转第二页后，仍保留。PC上没有这个问题
- 解决方法是，加个setTimeout，等待VUE的数据切换完成之后再渲染

**116. input是没有伪类元素的哦**

**117. 如果后端返回你的日期对象是这样的2018-05-08T01:16:11.000+0000**
- 注意了 这个时区不是我们这里的时区，会造成时间偏差 需要先`new Date()`一下这个时间，之后再转换成你要的格式。

**118. -apple-system, BlinkMacSystemFont,**
- -apple-system 是在以 WebKit 为内核的浏览器（如 Safari）中，调用 Apple（苹果公司）系统（iOS, macOS, watchOS, tvOS）中默认字体（现在一般情况下，英文是 San Francisco，中文是苹方）
- BlinkMacSystemFont 是在 Chrome 中实现调用 Apple 的系统字体

**119. UglifyJsPlugin报错？**
- 看看是哪个文件夹的es6没有被babel转义 一包含就有效

**120. JS动画帧与速度的关系**
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

setInterval( function(){
	// 避免计算不精确的小数问题
	s = ~~(s) + onceMoveloNG;	
}, 16.7 )
```

**121. vue style scoped 想对设置了scoped的子组件里的元素进行控制可以使用`>>>`或者`deep`**
```vue
<template>
  <div id="app">
    <gHeader></gHeader>
  </div>
</template>

<style lang="css" scoped>
  .gHeader /deep/ .name{ //第一种写法
    color:red;
  }
  .gHeader >>> .name{   //二种写法
    color:red;
  }
</style>
```
- 一些预处理程序例如sass不能解析>>>属性，这种情况下可以用deep，它是>>>的别名，工作原理相同。
- 使用v-html动态创建的DOM内容，不受设置scoped的样式影响，但你依然可以使用深选择器进行控制

**122. 如何不通过控制台编辑DOM就能修改网页？**
> [document.designMode](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/designMode)

- `document.designMode`了解下

**123. vue mixins 太好用了**
- 简单来讲就是合并vue的代码的 可以把script中的data、methods、生命周期等抽离出去
- 就像抽离公共方法一样

**124. vue directives 好用**
- 我觉得它更大的用处是分离数据渲染和UI渲染
- 场景是 进度条 宽度是靠width的css来控制的 比如现在宽度是20% 然后我刷新数据之后，因为这个值是20% 再次取得的数据还是20% 导致宽度变化的css动画就不再触发了 
- 通过自定义指令 分割了UI渲染和数据渲染部分 简化了代码量 更加清晰

```vue
export default {
directives: {
    frame: {
        bind(el, binding, vNode) {
                el.style.width = `0%`;
                setTimeout(_ => {
                    el.style.width = `${binding.value}%`;
                }, 20);
        },
        update(el, binding, vNode) {
                el.style.width = `0%`;
                setTimeout(_ => {
                    el.style.width = `${binding.value}%`;
                }, 100);
            }
        }
    },
}
```

**125. 今天遇到的一个下往上找到所有的父级Id的场景问题**
- 由于element的tree组件没全选的情况下，父级的Id取不到，所以有了从下往上找到所有的父级Id的场景需求
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
				children: [{
					parentId: 2,
					id: 3
				}]
			}
		]
	},
	{
		parentId: 0,
		id: 4,
		children: [
			{
				parentId: 4,
				id: 5,
				children: [{
					parentId: 5,
					id: 6
				}]
			}
		]
	},
]

let m = new Map();
let iKnowIds = [3, 6];

function arr2Map(arr) {
	for (let i = 0, l = arr.length; i < l; i++) {
		let item = arr[i];
		m.set(item.id, item.parentId)
		if (Array.isArray(item.children) && item.children.length > 0) {
			arr2Map(item.children)
		}
	}
}
// 先变成map结构
arr2Map(arr);

function deepMap(key, allIds) {
	let parentId = m.get(key);
	if (parentId !== 0) {
		allIds.push(parentId);
		deepMap(parentId, allIds)
	}
}

function getIds(key) {
	let allIds = [];
	deepMap(key, allIds)
	console.log(allIds)
}
```

**126. vue引入百度地图的两种方式**
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
export default {
    mounted(){
        this.MP().then( BMap => { this.initMap( BMap ) } )
    },
    methods: {
        MP() {
            return new Promise(function(resolve, reject) {
                window.init = function() {
                    resolve(BMap);
                };
                var script = document.createElement("script");
                script.type = "text/javascript";
		// 注意这里的callback 
                script.src =
                    "http://api.map.baidu.com/api?v=3.0&ak=HWzRuiQHQj1QrMifGGxxxx&callback=init";
                script.onerror = reject;
                document.head.appendChild(script);
            });
        },
	initMap(Map){
	    // 初始化地图
	}
    }
}

缺点 
可能是我引入方式有问题 
每次都会增加script标签
造成重复的百度地图的Map对象加入 
```

**127. echarts、HighCharts按需加载**
- echarts
```javascript
const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
```

- Highcharts（这个商业化要收费）
```javascript
import HighchartsMore from "highcharts/highcharts-more";
import SolidGauge from "highcharts/modules/solid-gauge.js";
HighchartsMore(Highcharts);
SolidGauge(Highcharts);
```

- 终极版真正按需加载 懒加载
> 场景是滚动到某个距离 加载echarts

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

**128. JS触发事件**
```javascript
// 创建事件.
  let event = document.createEvent('HTMLEvents');
  // 初始化一个点击事件，可以冒泡，无法被取消
  event.initEvent('click', true, false);
  let elm = document.getElementById('wq')
  // 设置事件监听.
  elm.addEventListener('click', (e) => {
    console.log(e)
  }, false);
  // 触发事件监听
  elm.dispatchEvent(event);
```

**129. 优化重排重绘**
- 重排与重绘的代价非常昂贵。如果操作需要进行多次重排与重绘，建议先让元素脱离文档流，处理完毕后再让元素回归文档流，这样浏览器只会进行两次重排与重绘（脱离时和回归时）。

**130. VsCode保存格式化代码的配置和我用的插件**
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
    "editor.quickSuggestions": { //开启自动显示建议
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
            "wrap_attributes": "force", //属性强制折行不一定对齐
        }
    },
    "eslint.validate": [ //开启对.vue文件中错误的检查
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
    ],
}
```
- 我用的插件
```html
Auto Close Tag
Auto Rename Tag
canvas-snippets
Chinese
Class autocomplete for HTML 
Color Info
Css Peek
Document This
Eslint
HTML Boilerplate
HTML CSS Support
HTML Snippets
HTMLHint
htmltagwrap
Image Preview
JavaScript (ES6) snippets
language-stylus
Live server
Node.js Modules Intellisense
Prettier formatter
SCSS interlliSense
stylus
vetur
vscode-faker
vscode-icons
vue 2 Snippets
Vue Peek
Vue VSCode Snippets
VueHelper
Ysgrifennwr Color Theme // 最爱的猪蹄
```


**130. IE中 left等不支持unset 默认auto**
> 这几天github卡爆了 更新不上去 

**131. async的await要接收一个promise对象哦**

**132. 不要忘了let可以解决异步循环i的问题**

**133. scrollTo scroolTop**
- 火狐 谷歌的DOM可以有scrollTo()
- 而IE 只有window 有scrollTo() DOM要用scrollTop

**134. IE11中的overflow**
- 如果你设置了 overflow-x： hidden  overflow-y: auto
- 你再设置 overfow: hidden的时候是无效的
- 你要设置 overflow-x： hidden overflow-y： hidden

**135. 超详细的数组方法总结 给力！**
[JavaScript数组的十八般武艺](https://segmentfault.com/a/1190000015908109)

**136. css小技巧之改变png图片的颜色**
> [不定期更新的CSS奇淫技巧](https://juejin.im/post/5b607a0b6fb9a04fd260aa70)

- 就是通过filter属性啦

```html
<style>
.icon-color{
	display: inline-block;
	width: 144px;
	height: 144px;
	background: url('https://user-gold-cdn.xitu.io/2018/7/31/164f0e6745afe2ba?w=144&h=144&f=png&s=2780') no-repeat center / cover;
	overflow: hidden;
}
.icon-color:after{
	content: '';
	display: block;
	height: 100%;
	transform: translateX(-100%);
	background: inherit;
	filter: drop-shadow(144px 0 0 #42b983); // 需要修改的颜色值
}
</style>

<i class="icon-color"></i>

```

**137. form表单中只有一个input输入框时**
- form表单中只有一个input输入框时， `W3C`规定会触发提交事件，需要组织表单的提交 
- vue中element-ui中使用 `@submit.native.prevent`阻止提交

**138. 使用form表单的一些坑**
- 生效就是触发提交
- 如果表单里有一个type=”submit”的按钮，回车键生效。
- 如果表单里只有一个type=”text”的input，不管按钮是什么type，回车键生效。
- 如果按钮不是用input，而是用button，并且没有加type，IE下默认为type=button，FX默认为type=submit。
- 其他表单元素如textarea、select不影响，radio checkbox不影响触发规则，但本身在FX下会响应回车键，在IE下不响应。
- type=”image”的input，效果等同于type=”submit”，不知道为什么会设计这样一种type，不推荐使用，应该用CSS添加背景图合适些
- 

```javascript
// 我在一个form表单中  写了个没有type的button  当 inupt 按回车时  触发了这个button的click事件  把这个 button 声明为type=button就行了
```


**139. 正确监听退出全屏的姿势**
- 不要用windows的resize事件 当浏览器F11全屏后，用户按着esc关闭全屏，resize事件是没法监听到的。

```javascript
document.addEventListener('fullscreenchange', toggleChange)
document.addEventListener('webkitfullscreenchange', toggleChange)
document.addEventListener('mozfullscreenchange', toggleChange)
document.addEventListener('MSFullscreenChange', toggleChange)

function toggleChange(){
	console.log('magic')
}

```

**140. 相同的代码打包到一个chunk中**
- webpack会合并相同的代码 减少我们的包的体积
- 首屏可以使用懒加载去加载组件和插件 利用chunk分割

**141. vue中监听鼠标滚轮用`@wheel`指令**

**142. 如何判断文字溢出（DOM溢出同理）了**
- 当前dom的 `scrollWidth` 和 `offsetWidth` 做比较

**143. 当对象中的key为数字时，会自动按着从小到大的顺序排序**
- 当有人说Map结构比Object结构好的时候，你就可以拿这个场景告诉他 并不一定哦

**144. @vue/cli（vue-cli3）中含有TypeScript 开箱即用 非常方便**
- 拥抱新cli 以下是一个小demo
- Home.vue
```vue
<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"
      :num="6666"
      @reset="resetMsg" />
    <h1 @click="handleClick($event, '666')">{{computedMsg}}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import test from "./test";

@Component({
  components: {
    HelloWorld
  }
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
  <div class="hello"
    @click="resetMsg({name: 'lqk'})">
    {{num}}
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
<style scoped>

</style>

```

**145. 小程序云开发（数据库）开始公测了**

**146. 百度地图和页面滚动的一个场景**
- 需求： 鼠标滚轮在百度地图上滚动时，页面不随之滚动
- 问题：
 1. 最开始使用的是鼠标进入父元素（此处为`.content`）时，`.content`设置为`overflow:hidden` 
 2. 鼠标离开`.content`时，`.content`设置为`overflow:auto`
 3. 这种做法能满足需求 但是会有抖动的问题 
 4. 后来发现了一个更大的问题 快速在百度地图上滚动滚轮的后 再次让`.content`设置为`overflow:auto`，虽然滚动条还在，但是滚动失效了！！！
- 解决方案
 1. 换了种思路 鼠标进入`.content`的时候，让`document`监听`mousewheel`和`DOMMouseScroll`事件 并阻止默认事件
 2. 鼠标移除`.content`的时候移除`mousewheel`和`DOMMouseScroll`的事件监听
 3. 很完美 不会有抖动的问题也不会无法滚动了
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
 
**147. echarts时间轴的图数据一定要按着顺序来排列 不然画出的图可能会有问题**

**148. 写某个模块的时候尽量想全面点 比如没数据怎么展示**

**149. webpack引入min.css的时候要当心**
- 我自己写的一个动画 被webpack打包后变成了 `@keyframes a`
- 然后我引入的有一个`css`文件，它也经过压缩处理了 也有一个 `@keyframes a` 
- 然后就冲突了
- 后来更换了没压缩的`css`文件引入进来了 `webpack`也会压缩的就是不会别名处理了

**150. a == 1 && a == 2 && a == 3 成立**
> [从 (a==1&&a==2&&a==3) 成立中看javascript的隐式类型转换](https://yq.aliyun.com/articles/399499) 看这篇文章
[你所忽略的js隐式转换](https://juejin.im/post/5a7172d9f265da3e3245cbca)

- 方法1
```javascript
var a = {
	i: 1,
	toString(){
		return (a.i, a.i++)
	}
}
a == 1 && a == 2 && a == 3 // true
```
- 原理
1. 符合对象类型再喝基础值类型进行表达式操作时，会基于“场景”自动调用`toString`或是`valueOf`方法，以最为'恰当'的方式，自动完成表达式的计算
2. 全等表达式会比较数据类型，符合对象类型不会进行隐式转换，即不执行`toString`或`valueOf`方法直接参与比较计算

- 方法2
```javascript
a = [1, 2, 3]
a.join = a.shift
a ==1 && a== 2 && a==3
```
- 更奇葩的
```javascript
var aﾠ = 1;
var a = 2;
var ﾠa = 3;
if(aﾠ==1 && a== 2 &&ﾠa==3) {
    console.log("Why hello there!")
}
// Why hello there!
```

**151. keep-alive和beforeDestory**
- 当组件使用`keep-alive`的时候，组件的生命周期`beforeDestory`不再生效，应使用`deactivated`或者`beforeRouterLeave`代替

**152. 数据驱动慎用清空列表(优化小细节)**
- 场景介绍
```javascript
// 列表页 每次获取新数据清空列表
this.list = [];
this.loadData()
```
- 造成的影响
```html
如果设备比较卡 或者网络比较慢
会造成列表页空白或显示暂无数据（看你交互方式）
用户体验不好 看起来一闪一闪的
```
- 我的解决办法 -> 请求完毕后咋成功回调里直接覆盖数据
```javascript
loadData().then(res=>{
    Array.isArray(res.contentList) && (this.list = res.contentList)
})
```

**153. webpack通过命令行去设置不同的请求接口**
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
let HOST = 'http://192.168.1.112:9000'
// 1
// const HOST = "http://192.168.1.63:9000";
// 2
// const HOST = 'http://192.168.1.59:9000'
// 测试服务器
// const HOST = 'http://192.168.1.112:9000'
// 这个路由是本地服务器路由
// const HOST = 'http://localhost:3001'

// packagejson里面有script里的标识 判断启用哪个接口去对接
const ENVIRONMENT = process.env.npm_lifecycle_event

if (ENVIRONMENT.indexOf('xia') > -1) {
    HOST = 'http://192.168.1.59:9000'
} else if (ENVIRONMENT.indexOf('niu') > -1) {
    HOST = 'http://192.168.1.63:9000'
} else if (ENVIRONMENT.indexOf('me') > -1) {
    HOST = 'http://localhost:3001'
}
```

**154. Object.freeze 提升性能**
- 由于 `Object.freeze()` 会把对象冻结，所以比较适合展示类的场景，如果你的数据属性需要改变，可以重新替换成一个新的 `Object.freeze()` 的对象。

**155. 多行文字文字中间出现不对齐**
```css
word-break: break-all;
text-align: left;
```

**156.vueli3的配置文件另一种写法**
```javascript
configureWebpack: confing =>{
    config.resolve = {
	    extensions: ['.js', '.vue', '.json', '.css'],
		alias : {
		   'vue$': 'vue/dist/vue.esm.js',
		   '@': resolve('src')
		}
	}
}
```

**157. JS中字符字节的问题**
> 摘自 [ECMAScript 6 入门——字符串的扩展](http://es6.ruanyifeng.com/#docs/string)

- JavaScript 内部，字符以 UTF-16 的格式储存，每个字符固定为2个字节。对于那些需要4个字节储存的字符（Unicode 码点大于0xFFFF的字符），JavaScript 会认为它们是两个字符。
```javascript
var s = "𠮷";

s.length // 2
s.charAt(0) // ''
s.charAt(1) // ''
s.charCodeAt(0) // 55362
s.charCodeAt(1) // 57271
```

**158. 日期替换**
```javascript
let str = '2018-09-19 00:00:00'
str.replace(/(\d{4})-(\d{2})-(\d{2})\s\d{2}\:\d{2}\:\d{2}/g, '$1年$2月$3日')
str.replace(/(.+?)\-(.+?)\-(\d{2}).+/,"$1年$2月$3日")
// "2018年09月19日"
```

**159. git修改仓库地址**
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
- 直接修改config文件 

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

**162. rem导致table的border不见**
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

**164. 动态切换video，等 audio标签的src时 一定要通过dom添加的方式去切换， 然后再play 直接play貌似也行**

**165. 少用`overflow:scroll`**
- PC百分百有滚动条
- 移动端有部分机型会出现滚动条

**166. 阿里云服务器配置过程**
1. 下载一个putty
2. 安装后配置 输入主机公有IP 端口22（linux的 3389是windows） ssh  确定
3. 输入你的账号密码  然后安装宝塔 `yum install -y wget && wget -O install.sh http://download.bt.cn/install/install.sh && sh install.sh`
4. 安装完后会有账号密码 记下就好 然后复制链接到网址里打开
5. 配置的有Apache 我们可以使用它代理node `https://blog.csdn.net/gaoxuaiguoyi/article/details/50927661`
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

**167. ftp无法上传时 可以使用ssh**
- 输入主机地址  账号 密码 即可

**168. 阿里云前端上传的一段mixins**
```javascript
import * as ossApi from '@services/oss'
export default {
    mounted () {},
    methods: {
        // 先获取签名之类的
        $file_getUploadUrl (data) {
            return ossApi.getUploadUrl(data)
        },
        $file_upLoad (file, type = 'TRACE') {
            return new Promise((resolve, reject) => {
                this.$file_getUploadUrl({ type })
                    .then(res => {
                        res = res.data
                        let data = new FormData()
                        data.append('key', res.key)
                        data.append('success_action_status', '200')
                        data.append('OSSAccessKeyId', res.OSSAccessKeyId)
                        data.append('Signature', res.Signature)
                        data.append('policy', res.policy)
                        data.append('file', file)

                        this.$http
                            .post(`${res.url}/`, data)
                            .then(uploadRes => {
                                resolve({
                                    data: uploadRes.data,
                                    status: uploadRes.status,
                                    fileId: res.key
                                })
                            })
                            .catch(err => {
                                reject(err)
                            })
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        // 删除文件
        $file_delete (fileId) {
            return ossApi.deleteById({ fileId })
        },
        $file_download (fileId, type) {
            return ossApi.getDownloadUrl({ fileId, type })
        }
    }
}
```

**169. 差点忘了一个技能 iframe页面通信**
- 父页面
```html
<html>
<head>
    <script type="text/javascript">
        function say(){
            alert("parent.html");
        }
        function callChild(){
            myFrame.window.say();
            myFrame.window.document.getElementById("button").value="调用结束";
        }
    </script>
</head>
<body>
    <input id="button" type="button" value="调用child.html中的函数say()" onclick="callChild()"/>
    <iframe name="myFrame" src="child.html"></iframe>
</body>
</html>
```
- 子页面
```html
<html>
<head>
    <script type="text/javascript">
        function say(){
            alert("child.html");
        }
        function callParent(){
            parent.say();
            parent.window.document.getElementById("button").value="调用结束";
        }
    </script>
</head>
<body>
    <input id="button" type="button" value="调用parent.html中的say()函数" onclick="callParent()"/>
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

**170. vue beforeDestory另一种用法**
```js
this.$once('hook:beforeDestroy', function () {
    clearTimeout(timeId)
})
```

**171. new Date() 转时间戳**
```javascript
let date = new Date()
console.log(date)
date = +date // +转时间戳
console.log(date)
```

**172. 获取域名和端口**
```javascript
export const getBaseUrl = url => {
    var reg = /^((\w+):\/\/([^/:]*)(?::(\d+))?)(.*)/
    reg.exec(url)
    return RegExp.$1
}
```

**128. 拷贝文字**
```javascript
//复制文字
        GlobalFunction.prototype.copyText=function(text){
            let dom = document.createElement('input');
            dom.value = text;
            document.querySelector('html').appendChild(dom);
            dom.select();
            this.selectText(dom,0,text.length);
            document.execCommand("Copy");
            dom.remove();
        }
        //复制文字选中兼容苹果Safari
        GlobalFunction.prototype.selectText=function (textbox, startIndex, stopIndex) {
            if(textbox.createTextRange) {//ie
                var range = textbox.createTextRange();
                range.collapse(true);
                range.moveStart('character', startIndex);//起始光标
                range.moveEnd('character', stopIndex - startIndex);//结束光标
                range.select();//不兼容苹果
            }else{//firefox/chrome
                textbox.setSelectionRange(startIndex, stopIndex);
                textbox.focus();
            }
        }

```

**129. fetch是原生的 可不是插件 但是有基于fetch封装的插件 区别下 它的`护垫`是xhr**

**130. vuecli cssLoader stylus注意**
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

**133. webpakc插件 - DllPlugin**
> [浅探webpack优化](https://segmentfault.com/a/1190000017218108)

- DllPlugin是用来干什么的呢？DllPlugin会将第三方包到一个单独文件，并且生成一个映射的json文件，打包的生成的文件就是一个依赖库，这个依赖不会随着你的业务代码改变而被重新打包，只有当它自身依赖的包发生变化时才会需要重新打包依赖库，接下来来看具体配置吧：

**134. 静态页面、伪静态页面、SPA、SSR、预渲染之间的联系**
- 查阅资料得知 爬虫对URL和查看网页源码时候查看到的DOM结构有很强的依赖关系
- SPA页面众所周知查看网页源码后，除了你写的`index.html`里面的内容 没有生成的真实DOM结构（通过JS动态增删，部分搜索引擎拿不到这些），而且url不用`history`模式，生成的都带#号，完全不利于SEO
- 而SSR服务端渲染，就拿`Nuxt`来说，可以生成真正的静态页和伪静态页（在服务端生成或者你本地生成后传到服务端里），查看源码的时候，能看到生成的DOM结构，而不再仅仅是`index.html`里面的内容，而且URL不带#号等，所以利于SEO优化
- 预渲染使用的原理类似于服务端渲染，生成真正的静态html， 有个插件 叫做`PrerenderSpaPlugin` 可以做预渲染
    > 摘自 https://segmentfault.com/q/1010000012069735

    1. 预渲染在构建阶段就已经生成了匹配预渲染路径的html文件，你的每个路由都可以作为入口文件。
    2. 预渲染后其对应文件夹下都有一个index.html，作为路口文件，之后在跳转走的是前端路由，并不再请求html文件。
    3. 首屏预渲染对还需要请求易变数据的页面不太合适，因为展示的html很可能是上次预渲染的html，等到请求完毕返回数据后再展示最新的html会引起客户的误解和疑惑。
    4. 让你配路由是因为，若你一开始访问的不是首页，是其他路由，那么请求其他路由下已经预渲染好的index.html，否则如果不做预渲染，会请求你的根节点的index.html，再根据路由匹配，链到你请求的路由下的页面

- 静态页和伪静态页简单来讲就是静态页会生成真正的HTML文件，伪静态不会真正生成HTML文件
	1. 静态页面访问最快；维护较为麻烦。
	2. 动态页面占用空间小、维护简单；访问速度慢，如果访问的人多，会对数据库造成压力。
	3. 使用纯静态和伪静态对于SEO(Search Engine Optimization:搜索引擎优化)没有什么本质的区别。
	4. 使用伪静态将占用一定量的CPU占用率，大量使用会导致CPU超负荷。
	5. 详情了解和区别可查看[静态页面、动态页面和伪静态页面的区别](https://www.cnblogs.com/software1113/p/4671384.html)，以上四条均摘自该文章

**134. 从输入URL到页面加载的过程？如何由一道题完善自己的前端知识体系！**
[从输入URL到页面加载的过程？如何由一道题完善自己的前端知识体系！](https://segmentfault.com/a/1190000013662126)

**135. 缓动动画**
> 最近在写nuxt的项目 等写完了来个总结

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

**136. vuecli3引入第三方插件 如JQ 百度地图**
```javascript
chainWebpack: config => {
	config.externals({ BMap: "BMap" });
}
```

**137. nuxt设置proxy**
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
- 这是`plugins/axios`中的内容 可以参考@nuxt/axios的文档做拦截  很方便
```javascript
export default function({ $axios, redirect }) {
  $axios.onRequest(config => {
    // console.log('Making request to ' + config.url)
  })
  $axios.onError(error => {
    console.log(error)
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })

  $axios.onResponse(response => {
    // console.log(response)
  })
}

```

**138. VS Code IntelliSense AI提示API**
> [VS Code IntelliSense介绍](https://www.infoq.cn/article/CoSe1R7VL6MrAh8g-h7l?utm_medium=hao.caibaojian.com&utm_source=hao.caibaojian.com&tdsourcetag=s_pcqq_aiomsg)

- IntelliCode 通过推荐常用的自动完成列表项来增强 VS Code IntelliSense，这些列表项是通过 IntelliCode 基于数千个真实的开源项目进行训练学习而生成的。目标是通过在自动完成列表的顶部放置最有可能使用的语言或 API 选项来节省开发人员的时间。


**139. nuxt的eslint规则也太好用了**
> 放在`.eslintrc.js`中

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: ['plugin:vue/recommended', 'plugin:prettier/recommended'],
  // required to lint *.vue files
  plugins: ['vue', 'prettier'],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
```

**140. Ueditor图片直传OSS**
>  参考 (ueditor 前端直传OSS)[https://blog.csdn.net/u013684276/article/details/80143343#commentBox] 这个讲的比较全 很棒

- ueditor.all.js 修改这个  好找
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

**141. JS获取浏览器缩放比例**
// 翻斗鱼的源码看到的
```javascript
 define("douyu/com/zoom", ["jquery", "shark/observer", "shark/util/cookie/1.0", "shark/util/storage/1.0", "douyu/context", "douyu/com/zoom-dp"], function (e, i, t, n, o, a) {
        var s = {
                storageName: "zoomtip",
                storageVal: "1",
                storageTime: 604800,
                isPop: !1,
                init: function () {
                    this.handleCookie(), this.pop(), i.on("mod.layout.screen.change", function (e) {
                        s.detect() && s.pop()
                    })
                }, handleCookie: function () {
                    t.get(this.storageName) && (t.remove(this.storageName), n.set(this.storageName, this.storageVal, this.storageTime))
                }, detect: function () {
                    return this.ua = navigator.userAgent.toLowerCase(), -1 == this.ua.indexOf("windows") ? !1 : !n.get(this.storageName)
                }, cal: function () {
                    var e = 0,
                        i = window.screen;
                    return void 0 !== window.devicePixelRatio ? e = window.devicePixelRatio : ~this.ua.indexOf("msie") ? i.deviceXDPI && i.logicalXDPI && (e = i.deviceXDPI / i.logicalXDPI) : void 0 !== window.outerWidth && void 0 !== window.innerWidth && (e = window.outerWidth / window.innerWidth), e && (e = Math.round(100 * e)), 99 !== e && 101 !== e || (e = 100), e
                }, resize: function () {
                    var i = this.cal();
                    if (this.isPop && i && 100 == i) return void this.close();
                    var t = 540,
                        n = 432,
                        o = 100 * t / i,
                        a = 100 * n / i;
                    e(".pop-zoom-container").css({
                        width: o + "px",
                        height: a + "px",
                        marginLeft: -o / 2 + "px",
                        marginTop: -a / 2 + "px"
                    })
                }, pop: function () {
                    var t = this.cal();
                    if (!n.get(this.storageName) && !this.isPop && 100 !== t) {
                        var a = o.get("sys.web_url") + "app/douyu/res/com/sg-zoom-error.png?20160823",
                            s = ['<div class="pop-zoom-container">', '<div class="pop-zoom">', '<img class="pop-zoom-bg" src="', a, '">', '<div class="pop-zoom-close">close</div>', '<div class="pop-zoom-hide"></div>', "</div>", "</div>"].join("");
                        e("body").append(s), this.bindEvt(), this.isPop = !this.isPop, i.trigger("dys.com.zoom.pop.show")
                    }
                    this.resize()
                }, close: function () {
                    e(".pop-zoom-container").remove(), this.isPop = !this.isPop, i.trigger("dys.com.zoom.pop.close")
                }, bindEvt: function () {
                    var t = this;
                    e(".pop-zoom-close").on("click", function () {
                        t.close()
                    }), e(".pop-zoom-hide").on("click", function () {
                        n.set(t.storageName, t.storageVal, t.storageTime), i.trigger("dys.com.zoom.pop.zoomtip"), t.close()
                    })
                }
            },
            r = function () {
                s.detect() && s.init()
            };
        e(r)
    })
```
- 最后提出来
```javascript
var getScreenScaleNum = function () { 
	var e = 0, i = window.screen; 
	return void 0 !== window.devicePixelRatio ? e = window.devicePixelRatio : ~this.ua.indexOf("msie") ? i.deviceXDPI && i.logicalXDPI && (e = i.deviceXDPI / i.logicalXDPI) : void 0 !== window.outerWidth && void 0 !== window.innerWidth && (e = window.outerWidth / window.innerWidth), e && (e = Math.round(100 * e)), 99 !== e && 101 !== e || (e = 100), e 
}
```

**142. vuecli3按需引入elementui**
- babel.config.js
```javascript
module.exports = {
  presets: ["@vue/app"],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ]
  ]
};
```
- 然后建立一个js文件 放elementui引入的组件
- 然后mian.js 引入这个js文件

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

**144. 有空看看MDN的css文档**

**145. 当你想判断包含关系时**
- 少量的用 `||`，量大的试试 `includes`、`indexOf`、`search`、`正则`…… 你的代码量会更少，更优雅 
- indexOf方法有两个缺点，一是不够语义化，它的含义是找到参数值的第一个出现位置，所以要去比较是否不等于-1，表达起来不够直观。二是，它内部使用严格相等运算符（===）进行判断，这会导致对NaN的误判。摘自——es6阮一峰

**146. 没事去codepen看看人家写的css3交互效果鸭**

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
      clickTimeDate: null
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
  }
};
</script>
```

**148. 如何编写优化的JavaScript**
> [JavaScript是如何工作的：深入V8引擎&编写优化代码的5个技巧 ](https://segmentfault.com/a/1190000017369465)

- 对象属性的顺序：始终以相同的顺序实例化对象属性，以便可以共享隐藏的类和随后优化的代码。
- 动态属性： 因为在实例化之后向对象添加属性将强制执行隐藏的类更改，并降低之前隐藏类所优化的所有方法的执行速度，所以在其构造函数中分配所有对象的属性。
- 方法：重复执行相同方法的代码将比仅执行一次的多个不同方法（由于内联缓存）的代码运行得更快。
- 数组：避免稀疏数组，其中键值不是自增的数字，并没有存储所有元素的稀疏数组是哈希表。这种数组中的元素访问开销较高。另外，尽量避免预分配大数组。最好是按需增长。最后，不要删除数组中的元素，这会使键值变得稀疏。
- 标记值：V8 使用 32 位表示对象和数值。由于数值是 31 位的，它使用了一位来区分它是一个对象（flag = 1）还是一个称为 SMI（SMall Integer）整数（flag = 0）。那么，如果一个数值大于 31 位，V8会将该数字装箱，把它变成一个双精度数，并创建一个新的对象来存放该数字。尽可能使用 31 位有符号数字，以避免对 JS 对象的高开销的装箱操作。

**149. Vue使用百度分享组件销毁后，重新建立组件分享功能不显示或失效**
- 使用百度分享的`init`方法
```javascript
/* eslint-disable */
export default {
  mounted() {
  // 关键代码在这里  如果已经加载了 就init它  没有加载 就初始化
    window._bd_share_main ? window._bd_share_main.init() : this.initShare()
  },
  methods: {
    initShare() {
      window._bd_share_config = {
        "common": {
          "bdSnsKey": {},
          "bdText": "",
          "bdMini": "2",
          "bdMiniList": false,
          "bdPic": "",
          "bdStyle": "1",
          "bdSize": "24"
        },
        "share": {},
        "selectShare": {
          "bdContainerClass": null,
          "bdSelectMiniList": ["weixin", "tsina", "qzone"]
        }
      };
      const $el = document.querySelector('#baiduShare')
      $el && document.body.removeChild($el)
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.id = 'baiduShare'
      s.src = ''
      document.body.appendChild(s);

    }
  }
}
```

**150. Vue Router 新窗口打开**
```javascript
const routeData = this.$router.resolve({
  path: lang ? `/${lang}/news/detail` : `news/detail`,
  query: { id }
})
window.open(routeData.href, '_blank')
```

**151. webpack按需引入组件、函数的写法**
1.
``javascript
// before
import { toast } from "./toastify";
toast("Hello World");

// after
import("./toastify").then(module => {
  module.toast("Hello World");
});
```

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
```

**152. 少用ID,会增加全局变量**
```html
<!-- 全局 DOM 变量 -->
<!-- 由于浏览器历史遗留问题，在创建带有 id 属性的 DOM 元素的时候也会创建同名的全局变量： -->
<!-- windows下的全局变量不会被ID的全局变量覆盖 -->

<div id='foo'><div>
<scripts>
   console.log(foo)     // 打印出DOM元素
	
	const el = document.createElement('div')
	el.id = 'scrollX'
	document.body.appendChild(el)
	window.scrollX // 0
</scripts>
```

**153. 不要忘了背景色使用渐变色和纯色可以叠加的**
- IE9不支持渐变色 然后你要使用渐变色的话可以叠加写在一起
```css
background-color: rgba(255, 255, 255, 1);
background-image: linear-gradient(180deg, rgba(233, 233, 233, 1), rgba(255, 255, 255, 1));
```
**154. nuxt如何针对低版本IE去提示用户**
- nuxt根目录可以建立一个app.html,默认的内容在文章中可以找到 你可以在里面写上你要提示的内容 还有首屏加载 不过貌似不需要在slow3g模式下测试了 并没有出现
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

**155. sourceTree 挺好用的 git版本管理工具**
- 不要怕建利分支，多建利分支，比如一条主分支 一条开发分支 一条bug修复分支……
- 每改一个功能用`sourceTree`提交一次，不一定推到远程，让你的代码都有记录可寻，方便维护和更改

**156. asiox 和 oss 上传有一个需要注意点**
- 如果你上传提示 405  而且什么都对， 你要检查下你的`"Content-Type`
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
- 设置成23:59:59

**160. 数组分割**
```javascript
let newArr = []
const length = arr.length
for (let i = 0; i < length; i += 3) {
	newArr.push(arr.slice(i, i + 3))
}
this.dataList = newArr
console.log(this.dataList)
```

**161. translate(3d)也不见得哪里都适用**
- 大量DOM的场景下， 用translate3d做滚动的时候，火狐会出现滚动卡顿，谷歌不会 
- 改用scrollTo做滚动完美解决这个问题
- 值得思考

**162. html5 微数据**
```html
<meta itemprop="name" content="原来科技真的可以改变生活,好炫!" />
<meta itemprop="description" content="原来科技真的可以改变生活，好炫！" />
<meta itemprop="image" content="http://qqpublic.qpic.cn/qq_public_cover/0/0-10000-DB4036C9AF4028EA19729430313D4960_vsmcut/200" />
```

**163. vue-cli `import` 中大小写的有意思之处**
> 未测试是es6的规则还是vue-cli或者webpack的关系

- import AppUseChart from './appUseChart' 默认当成文件夹 会查找里面的index.vue 
- 而import AppUseChart from './AppUseChart' 会当成.vue组件

**164. git默认对文件名啥的是不区分大小写的 记得区分**
```shell
git config core.ignorecase false
```

**165. react-router4  react嵌套路由实现的两种方式以及路由过渡动画的实现方式**
- [react-router4 react嵌套路由实现的两种方式以及路由过渡动画的实现方式](https://blog.csdn.net/qq_37540004/article/details/88331990)


**166. React或Vue中如果函数不依赖于的组件（没有 this 上下文），则可以在组件外部定义它。 组件的所有实例都将使用相同的函数引用，因为该函数在所有情况下都是相同的。**
> [Web 性能优化：缓存 React 事件来提高性能](https://segmentfault.com/a/1190000018423895)

- 在 JavaScript 中，函数的处理方式是相同的。如果 React 接收到具有不同内存地址的相同函数，它将重新呈现。如果 React 接收到相同的函数引用，则不会。
```javascript
class SomeComponent extends React.PureComponent {
  get instructions () {
    if (this.props.do) {
      return 'click the button: '
    }
    return 'Do NOT click the button: '
  }

  render() {
    return (
      <div>
        {this.instructions}
        <Button onClick={() => alert('!')} />
      </div>
    )
  }
}
```
- 这是一个非常简单的组件。 有一个按钮，当它被点击时，就 alert。 instructions 用来表示是否点击了按钮，这是通过 SomeComponent 的 prop 的 do={true} 或 do={false} 来控制。

- 这里所发生的是，每当重新渲染 SomeComponent 组件(例如 do 从 true 切换到 false)时，按钮也会重新渲染，尽管每次 onClick 方法都是相同的，但是每次渲染都会被重新创建。

- 每次渲染时，都会在内存中创建一个新函数(因为它是在 render 函数中创建的)，并将对内存中新地址的新引用传递给 <Button />，虽然输入完全没有变化，该 Button 组件还是会重新渲染。

**167. vuecli3 给jsloader加include**
```javascript
config.module
      .rule("js")
      .include.add(resolve("test"))
      .add(resolve("src"))
      .add(resolve("/node_modules/element-ui/packages"))
      .add(resolve("/node_modules/element-ui/src"));
```

**168. GOjs流程图增删编辑**
```javascript
// 以下方法都是通过绑定的click事件触发 
// 增加
function addCounter(e, obj) {
	var node = obj.part
	var data = node.data
	myDiagram.model.addNodeData({
		key: Date.parse(new Date()),
		name: 'George V',
		gender: 'M',
		birthYear: '1865',
		deathYear: '1936',
		reign: '1910-1936',
		parent: data.key
	})
	myDiagram.rebuildParts()
}
// 减去
function minusCounter(e, obj) {
	var node = obj.part
	myDiagram.remove(node)
	myDiagram.rebuildParts()
}

/*
 // 编辑 通过以下任意方法获取数据列表
  myDiagram.model.nodeDataArray
  myDiagram.model.linkDataArray
  //修改完成调用以下方法完成重建
  myDiagram.rebuildParts()
*/
```

**169. Git  pull(拉取) fetch(获取)区别**
- 使用git  直接提交的话   直接 push
- 获取最新版本  有两种  拉取 和 获取 pull 和 fetch
- git pull     从远程拉取最新版本 到本地  自动合并 merge            git pull origin master
- git  fetch   从远程获取最新版本 到本地   不会自动合并 merge    git fetch  origin master       git log  -p master ../origin/master     - git  merge orgin/master
- 实际使用中  使用git fetch 更安全    在merge之前可以看清楚 更新情况  再决定是否合并

**170. react如果不需要刷新视图， 尽量少用setState去更改变量，因为每次setState都会去尝试刷新视图，耗费性能，可以通过变量来操作**
> https://segmentfault.com/a/1190000018549047

- setState 调用后，组件的 render 方法也会自动调用，这就是为什么你能在页面看到新数据。但是无论你 setState 修改的是什么，哪怕是页面里没有的一个数据，render 都会被触发，并且父组件渲染中会嵌套渲染自组件。

**171. addEventListener的 中的 passive 可以优化滚动 如果你不需要preventDefault**

- options 可选
- 一个指定有关 listener 属性的可选参数对象。可用的选项如下：

 - 1. capture:  Boolean，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。
   2. once:  Boolean，表示 listener 在添加之后最多只调用一次。如果是 true， listener 会在其被调用之后自动移除。
   3. passive: Boolean，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。
   4. mozSystemGroup: 只能在 XBL 或者是 Firefox' chrome 使用，这是个 Boolean，表示 listener 被添加到 system group。

**172. @contextmenu.prevent vue中使用这个可以阻止右键菜单**

**173. png透明图片中有字，如何给这个图中的字加阴影？**
- 用`css3`的`filter`的`drop-shadow`属性
```css
filter: drop-shadow(2px 2px 4px #ccc);
```

**174. 如果图片需要遮罩，记得把遮罩的dom放在图片dom前面 不然图片会先加载出来 而遮罩不会 会看着一瞬间没遮罩**

**175. border方式画三角形可以画各种角度的和宽度的哦**

**176. html中url路径请求的六种方式：无斜杠、单斜杠（/）、点+单斜杠（./）、点点+单斜杠（../）、多个点点+单斜杠（../../）、全路径**
- 没有斜杠，跳转到和自己（rootPath.html）同目录下的layout页面
- 单斜杠加前有一点，跳转到和自己（rootPath.html）同目录下的layout页面 `总结：方式一和方式二效果是相同的`。
- 单斜杠，跳转到整个网站根目录下
- 两点加单斜杠，跳转到上一级目录
- 多个两点加单斜杠连续用，每一次“../”往上跳转一级,有几个“
- 全路径方法：路径+项目名+文件在wbapp下的位置

**177. 单页面过渡动画过渡过程要设置absolute还要有位置，这样才不会抖动**
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

**178. 如果UI框架提供的有scss等可以修改主题的工具 尽量从那个里面修改**

**179. `:first-child……`等伪类选择器必须在都是相同兄弟节点中使用**
```html
<body>
	<p/>
	<span/>
	<span/>
	<p/>
</body>

上面这种无效
下面这种有效

<body>
	<p/>
	<p/>
	<p/>
	<p/>
</body>
```

**180. box-shadow底部阴影**
```css
box-shadow: 0 8px 20px #666; /* 第一个左右偏移 第二个上下偏移 第三个阴影的量 第四个颜色 */
```

**181. routerview 和 key配合 很巧妙**
- 使用得当可以避免不同路由同组件不渲染

**182. stylus和scss的写hack的方法是啥来着，就是那块已原生css的方式编译**

**183. 网页全屏的功能 最外层的盒子margin会不占宽度的**

**184. vue中有时候清除某个列表 在赋值前再清除会有效点**
```javascript
// 有效清空 不会导致数据遗留
loadData().then(res=>{
	this.dataList = []
	this.dataList = res.map(v=>{ v.name = 1; return v})
})

// 有时候会无效清空 导致数据遗留
this.dataList = []
loadData().then(res=>{	
	this.dataList = res.map(v=>{ v.name = 1; return v})
})

```

**182. 右键菜单和百度rightclick的冲突**
- 百度rightclick调用自定义右键菜单，菜单利用document监听点击事件判断是否含有特定class来自动关闭弹窗，在火狐中打不开弹窗，因为触发点击的是svg，而svg没有特定的class  于是就在菜单中加上判断如果是右键点击的不隐藏 解决冲突

**183. 横向滚动盒子的css**
```css
height: 200px;
width: 100%;
overflow-x: auto;
overflow-y: hidden;
white-space: nowrap;
```

**184. vscode用户代码片段的功能**
- 在首选项中打开用户代码片段
- 找到vue
- 输入($0是当前鼠标位置)
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
- 新建一个vue文件，输入`vue`然后按`enter`即可
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
  methods: {}
};
</script>
<style lang=""></style>

```

**185. +-等操作符的优先级大于三元运算符的优先级 不注意容易出错**

**186. 火狐、IE 盒子高度写100%的时候 overflow:auto; padding有值 滚动的时候 不计算padding **
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

**187. Vue利用store调用不同组件的方法时，在刷新网页时可能没法同步，需要加延迟**

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

**189. 使用mqtt**
> 只是demo代码 实际需求看情况改

- 客户端
```javascript
const mqtt = require("mqtt");
export default {
  data() {
    return {
      client: null
    };
  },
  created() {
    this.createClient();
  },
  methods: {
    createClient() {
      console.log("create");
      this.client = mqtt.connect("mqtt://127.0.0.1:7410", {
        connectTimeout: 5000
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
      this.client.on("message", function(topic, message) {
        // message is Buffer
        console.log(topic, message.toString(), "msg");
        // this.client.end();
      });
      this.client.on("error", error => {
        // message is Buffer
        console.log(error);
        this.client.end();
      });
    }
  }
};
```
- 服务端 用的node
```javascript
var mosca = require('mosca')
// 连接的数据库 这里只用模拟没连数据库
var ascoltatore = {
    //using ascoltatore
    type: 'mongo',
    url: 'mongodb://localhost:27017/mqtt',
    pubsubCollection: 'ascoltatori',
    mongo: {}
}

var settings = {
    port: 1884,
    // 直接请求1884端口不能用  要加 http 或者https(没试,看你请求链接)
    // 第三方的话 开通websocket就可以访问了
    http: {
        port: 7410
    }
    //   backend: ascoltatore
}

var message = {
    topic: '/hello/world',
    payload: 'abcde', // or a Buffer
    qos: 0, // 0, 1, or 2
    retain: false // or true
}

var server = new mosca.Server(settings)

server.on('clientConnected', function(client) {
	// 推送消息
    server.publish(message, function() {
        console.log('done!')
    })
})

// fired when a message is received
server.on('published', function(packet, client) {
    console.log('Published', packet.payload.toString())
})

// server.on('clientDisconnected', function(client) {
//     console.log('Client Disconnected:', client.id)
// })

server.on('ready', setup)

// fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running')
}

```

**190. window.URL.createObjectURL**

**191. 百度地图等需要根据key来引入不同大量图片的解决方案**
- 比如我有十几二十种key，每个key对应一个图片，后端返回不同的key，我要展示不同的图片，而且如果图片不存在，那么展示一个默认图片。
- 如果一个一个require图片进来，很麻烦，不科学，不自动，于是我想到了一种解决方案，将图片放入public文件夹（静态资源不用laoder加载）
```javascript
// 基础图片路径 这个是放在public文件夹下的  public/images/gateway....
// 这里一定要用相对路径 用绝对路径的话 打包之后会受路径影响不显示 亲测
const basicImg = "images/gateway/basic.png";
const imgUrl = "images/gateway/";
// 然后图片的命名与后端传来的key对应 比如 key是gateway 你的图片名字就是 gateway.png

// 那么如何判断图片能否正常加载呢？  就用new Image 去构造一个图片对象
export default {
	methods:{
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
			  iconImg = url
			})
			.catch(() => {
			  iconImg = basicImg;
			});
		      let marker = new BMap.Marker(new BMap.Point(lng, lat), {
			icon: new BMap.Icon(iconImg, new BMap.Size(100, 100)),
			enableClicking: true
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
	}	
}
```
- 另外 如果我们需要key引入图片的话可以使用这种方式
```vue
<template>
	<img :src="require(`@img/service/${item.feesStandardCode}.png`)"
            :alt="item.feesStandardName" />
</template>
```
- 或者
```vue
<template>
	<div :style="{background: require(`@img/service/${item.feesStandardCode}.png`)}"
            :alt="item.feesStandardName" />
</template>
```

**192. vue按钮权限控制的一个思路**
> [从0到1搭建element后台框架之权限篇](https://segmentfault.com/a/1190000019000771)

- 按钮级别的权限说实话一般都通过数据接口来控制是否展示，点击等等情况。如果光有前端来控制绝对不是可行之道。
- 项目中按钮权限注册全局自定义指令来完成的。首先src下面新建一个directive文件夹，用于注册全局指令。在文件夹下新建一个premissionBtn.js。如果对自定义指令不熟的话可以查阅官方文档。
- 全局指令
```javascript
import Vue from 'vue'
    import store from '@/store/store'
    //注册一个v-allowed指令
     Vue.directive('allowed', {
        inserted: function (el, bingding) {
            let roles = store.getters.roles
            //判断权限
            if (Array.isArray(roles) && roles.length > 0) {
                let allow = bingding.value.some(item => {
                    return roles.includes(item)
                })
                if (!allow) {
                    if (el.parentNode) {
                        el.parentNode.removeChild(el)
                    }
                }
            }
        }
    })
```
- 引用
```javascript
 import './directive/premissionBtn'
```
- 那自定义指令如何使用呢？
```html
 <div class="premissionBtn">
        <el-button type="primary" v-allowed="['admin']">我是只有admin的时候才能显示</el-button>
        <br>
        <el-button type="info" v-allowed="['user']">我是只有user的时候才能显示</el-button>
        <br>
        <el-button type="warning" v-allowed="['admin','user']">我是admin或者user才能显示</el-button>
        <br>
        <el-button type="danger">任何角色都可以显示</el-button>
    </div>
```

**193. vue/react使用JSDoc、jsconfig.json 完成vscode对于webpack的alias引入的js方法的提示**
> [csdn该篇文章链接](https://blog.csdn.net/qq_37540004/article/details/89602242)

TS有个好处就是你引入方法会告诉你参数是什么类型返回什么类型，而我们不需要TS也可以完成这项提示任务。

- 首先你需要阅读[JSDoc的文档](http://usejsdoc.org/)和[jsconfig.json](https://code.visualstudio.com/docs/languages/jsconfig)的配置，你也可以百度下中文的文档
- 之后是写配置文件，比如我的webpack的alias配置如下, common中是我的公共方法
```javascript
chainWebpack: config => {
	 config.resolve.alias
      .set("@common", resolve("src/common"))
}
```
- 我如果在项目中使用`@common/utils`引入我需要的方法时，在不配置jsconfig.json的情况下，vscode是不会提示我引入这个js文件中有多少方法的，使用`jsconfig.json`就可以帮助`vscode`完成这项艰巨的任务
- jsconfig的基本配置如下，这里的路径和你的alias路径相同即可
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
- 方法的提示怎么编写呢？用好JSDoc就行了。
```javascript
/**
 *
 * @param {String} msg 提示的消息
 */
export const ht_notify_error = msg => {
  ht_notify({
    title: "非常抱歉...",
    message: msg,
    type: "error"
  });
};
```
- 之后你在文件中引入这个方法时就会提示这些信息了，亲自试试吧！


![在这里插入图片描述](https://img-blog.csdnimg.cn/20190427152206396.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190427152219234.png)
我 alias引入的js文件中的方法也提示了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190427153320777.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)
jsconfig.json 所在位置为项目根目录
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190427153352662.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3NTQwMDA0,size_16,color_FFFFFF,t_70)

##### 还可以自动引入，首先你需要引入utils这个文件， 比如`import {xxx} from "@common/utils"` 你在create周期里打其中一个未引入的方法，这个方法名会自动添加到{}之中

##### ctrl + 鼠标点击方法也会跳转到方法所在的文件之中

##### 方法描述信息可以写在一开头，不知道@description为啥不能用
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

**194. vueli3不一定要用chain  configureWebpack也是一样的**

**195. 如何根据url链接字符串获取href、protocol、host、search、hash等属性**
- iframe 直接把url赋值给location.href会从当前页面跳转到 url 的页面，如果我们在当前页面新建一个iframe并给它的src赋值这个 url ，似乎可以通过iframe的window.location拿到url的各个属性。
- 我们创建了一个a元素，并给它的href赋值了 url ，可以打印出这个a元素的对象，其中就包括 url 的这些属性。
- 利用a元素来解析 url 算是奇淫巧技吧，其实现代浏览器提供了一个创建的URL对象的构造函数—URL()，直接把url当作参数传入，就会返回一个URL对象。

**196.  URL.createObjectURL()创建后不用了记得用URL.revokeObjectURL()释放掉 **

**197.  vuerouter的路由导航一般只生效在页面级组件 **

**198. prehooks的钩子配置 husky 可以在上传git的时候检测代码格式**
> [git commit前检测husky与pre-commit](https://www.jianshu.com/p/f0d31f92bfab)

**199. Function.prototype -》 ƒ () { [native code] } 它的prototype不是个标准对象**

**200. vue store commit 同时触发多个的时候，只会响应一个？？什么原因 ？有时间研究下**

**201. 百度地图地块坐标虽然你传给后台的是百度地图获取的坐标，但是在去画地块的时候，一定要再次 new BMap.Point(lng, lat);**

**202. vue keepalive的页面它的watch会一直监听！贼恐怖**

**203. `text-transform`这个css属性可以更改英文的大小写**

**204. vue-router  router-link阻止跳转的一个方案**
1. 利用`tag`属性，将router-link渲染成a或别的跳转功能标签之外的标签（修改默认右键菜单也行）
2. 不需要跳转的to属性设置一个固定的路由链接
3. 在页面级组件中，利用路由守卫拦截2中的路由连接即可

**205. transition动画过程中多个子重叠优先级问题（鼠标右移和左移显示效果不一样）**
- 大概就是这样一个场景 一个列表 五个li 然后鼠标放上去放大 放大后的要遮住旁边的li  鼠标从左往右的时候，即将开始动画的在即将结束动画的DOM结构之上，而从右往左，是结束的在上面 开始的在下面，于是利用z-index的方案来解决了这个问题
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
> [JavaScript深入之词法作用域和动态作用域](https://github.com/mqyqingfeng/Blog/issues/3)

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
- 假设JavaScript采用静态作用域，让我们分析下执行过程：

- 执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value，如果没有，就根据书写的位置，查找上面一层的代码，也就是 value 等于 1，所以结果会打印 1。

- 假设JavaScript采用动态作用域，让我们分析下执行过程：

- 执行 foo 函数，依然是从 foo 函数内部查找是否有局部变量 value。如果没有，就从调用函数的作用域，也就是 bar 函数内部查找 value 变量，所以结果会打印 2。

- 前面我们已经说了，JavaScript采用的是静态作用域，所以这个例子的结果是 1。

**207. 阿里网页支付有的浏览器可以有的浏览器不可以**
- 我们项目的原因是表单没有设置`acceptCharset = "UTF-8"`

**208. vue多层传递数据和事件 $attrs/$listeners**
> https://www.cnblogs.com/mengfangui/p/9995470.html

- 组件传值一般是通过props传值的。inheritAttrs默认值为true，true的意思是将父组件中除了props外的属性添加到子组件的根节点上(说明，即使设置为true，子组件仍然可以通过$attr获取到props意外的属性)
- inheritAttrs:false后（请将fatherDom.vue添加inheritAttrs:false），coo属性就不会显示在fatherDom根节点上了。但是怎么获取到coo呢？这时就通过$attrs获取到到coo。
- 爷爷
```vue
<Father :datas="666" />
```
- 父
```vue
<Child v-on="$attrs" v-on="$listeners"/>
```
- 子
```vue
<div>{{datas}}</div>
{
props: [datas]}
```

**209. box-shadow的控制可以精确到像素级**
> [CSS3 box-shadow盒阴影图形生成技术](https://www.zhangxinxu.com/wordpress/2013/11/css-css3-box-shadow-%E7%9B%92%E9%98%B4%E5%BD%B1-%E5%9B%BE%E5%BD%A2%E7%94%9F%E6%88%90%E6%8A%80%E6%9C%AF/)

```css
box-shadow: 30px 15px #8e1a19, 45px 15px #ac0500, 75px 15px #f73f0c, 90px 15px #fa5f27, 15px 30px #740100, 30px 30px #8e0500, 45px 30px #8e1918, 60px 30px #ca1300, 75px 30px #f34f2b, 90px 30px #df351f, 105px 30px #f77c2a, 15px 45px #4b0000, 30px 45px #690100, 45px 45px #8e0f0b, 60px 45px #bf1000, 75px 45px #f84010, 90px 45px #f04222, 105px 45px #fa5724, 15px 60px #451312, 30px 60px #5a0100, 45px 60px #840e0c, 60px 60px #a51d1a, 75px 60px #ed2805, 90px 60px #d9321e, 105px 60px #f44622, 30px 75px #3b0000, 45px 75px #5d1a1b, 60px 75px #8e1a19, 75px 75px #a80700, 90px 75px #b90a00, 45px 90px #3d0000, 60px 90px #551415, 75px 90px #670100, 60px 105px #340000;
```

**210. 同一个浏览器多个tab页面如何登入同一个项目不同角色**
- localstorage配合用户id方案，不行 即便可以通过用户id区分用户的token，但是一旦刷新，这个用户的id就不知道了（id用本地存储存下来也无法鉴别），除非重新登录，
- sessionstorage 后端token没失效，用户需要重新登录，新页面打开token也失效
- cookie和localstorage一样道理
- 如果要做需要后端配合 静默登录

**211. vue extends extend minxins mixin**
- extends  和 mixins 是用在单页面（不一定准确）中
- extends可以继承vue文件 
- mixins继承js文件
- extend mixin 是全局的 具体区别和用法看文档 还是和带s的有差别的
- extends只能继承一个  mixins可以继承多个
- extends并不能继承template  因为 组件没暴露template 哈哈

**222. &times被替换成x 的解决办法**
> [&times被替换成x 的解决办法](https://www.cnblogs.com/wobeinianqing/p/7067547.html)

- 将统一资源定位器中的&替换成`&amp;` 注意带上分号。

**223. vue中如果接口返回的字段和你默认的字段中有缺失， 不能直接赋值，会不能修改**
- 比如你的默认字段是
```js
form={
	name:'',
	password: ''
}
```
- 但是接口返回的没有`password`，如果你`this.form = res.data`会导致`password`无法编辑，老版本不会这样
- 你可以给res补充上这个字段 或者用`Object.assign`

**223. elementui的dlg隐藏时并不会销毁，记得在隐藏时移除一些不必要的监听**

**224. 页面可以再接口获取完成之后再渲染，减少页面重绘次数，期间用loading显示**

**225. es6 class extends 的 super**
- 子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象
- 其实 super(…) 做的事情就是生成一个 this。因为在原型继承中，如果一个类要继承自另一个类，那就得先实例化一次它的父类作为作为子类的原型。如果不做这件事，子类的原型就不能确定，当然也就无法创建 this。所以如果在 constructor 中没有 super(…) 就企图获取 this 就会报错

**226. 小程序企业版需要很多资质**
- 视频如果没有特殊需求可以传到腾讯视频用腾讯的插件 `txs-video`
- 企业小程序很多分类需要资质审核，企业要有一些相关资质才可以
- 很坑。。。

**227. 为什么vue-cli中只需要实例化一次vue?**
- export default 的是一个对象 Object，然后父组件通过 components 属性注册，其实是内部调用了 Vue.extend 方法，把这个 Object 传入，然后得到的也是一个 Vue 的实例。为啥用 Vue.extend 而不是直接new Vue，因为他们要建立父子关系，形成一个 Vue 的组件树。
- 组件里的 data 必须是一个方法，因为组件是多个实例，如果 data 是一个同一个 object，那么一个组件的修改会影响另一个，因此它必须返回一个方法。

**228. background-image切换时配合transition也是有动画的**

**229. threejs可以播放全景视频，全景视频直播还没测试**

**230. 深拷贝的注意点**
1. 对象的属性值是函数时，无法拷贝。
2. 原型链上的属性无法获取
3. 不能正确的处理 Date 类型的数据
4. 不能处理 RegExp
5. 会忽略 symbol
6. 会忽略 undefined
```javascript
function deepClone(obj) { //递归拷贝
    if(obj instanceof RegExp) return new RegExp(obj);
    if(obj instanceof Date) return new Date(obj);
    if(obj === null || typeof obj !== 'object') {
        //如果不是复杂数据类型，直接返回
        return obj;
    }
    /**
     * 如果obj是数组，那么 obj.constructor 是 [Function: Array]
     * 如果obj是对象，那么 obj.constructor 是 [Function: Object]
     */
    let t = new obj.constructor();
    for(let key in obj) {
        //如果 obj[key] 是复杂数据类型，递归
        if(obj.hasOwnProperty(key)){//是否是自身的属性
            t[key] = deepClone(obj[key]);
        }
    }
    return t;
}
```

**231. 好的产品er太重要了，不然只会让你做重复无用功。。。。吐槽**

**232. 天地图的卫星图比较全**
