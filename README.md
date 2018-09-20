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
```css
cubic-bezier(0.3, 0, 0.2, 2)
```
