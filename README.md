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
