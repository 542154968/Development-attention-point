# 工作中遇到的坑和思考
## 有不同意见欢迎指正交流
### 前排推荐  https://github.com/topics/javascript   关注JS开源框架动态

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
