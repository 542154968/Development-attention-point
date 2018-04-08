# window对象
## 全局作用域
## 窗口关系及框架
- window.frame[0]
- window.frame['topFrame']
- window.parent
- window.top
- top.frame[0]
- 特别注意跨域问题

## 窗口位置
### screenLeft screenTop screenX screenY
- IE Safari Opear Chrome 提供了 screenLeft 和 screenTop属性，分别用于表示窗口相对于屏幕左边和上边
- Firefox在screenX和screenY属性中提供了相同的窗口位置信息，Safari和Chrome也同时支持这两个属性。Opera虽然也支持screenX和screenY属性，单与screenLeft和screenTop并不对应。
- 兼容代码
```javascript
var leftPos = ( typeof window.screenLeft === "number" ) ? window.screenLeft : window.screenX;
var topPos = ( typeof window.screenTop === "number" ) ? window.screenTop : window.screenY;
```
- 但是 仍然会有些计算不精确的小问题 浏览器的问题

### moveTo moveBy
- 将窗口精确地移动到一个新位置
- moveTo 接受两个参数， 新位置的X,Y值
- moveBy 接收的是在水平和垂直方向上移动的像素数
- 但是这两个方法可能被浏览器禁用

## 窗口大小
> 跨浏览器确定窗口大小不是一件简单的事情

### 获取可视区域大小
- IE9+ Firefox Safari Opera 和 Chrome均为此提供了四个属性—— `innerWidth`、 `innerHeight`、 `outerWidth`、 `outerHeight`
- 在IE9+ Safari 和 Firefox中， outerWidth 和 outerHeight返回浏览器窗口本身的尺寸（无论从最外层的window对象还是从某个框架访问）。
- 在Opera中，这两个属性的值表示页面视图容器的大小（无论是从最外层的window对象还是从某个框架访问）
- 在Opera中，这两个属性的值表示页面视图容器的大小。而innerWidth和innerHeight则表示该容器中页面视图区的大小（减去边框宽度）。
- 在Chrome中，outerWidth、outerHeight与innerWidth、innerHeight返回相同的值，即视口（viewport）大小而非浏览器窗口大小
- IE8及更糟的版本没有提供取得当前浏览器窗口尺寸的属性。不过，它通过DOM提供了页面可见区域的相关信息。
- 在IE Firefox Safari Opera 和 Chrome中，`document.documentElement.clientWidth` 和 `document.documentElement.clientHeight`中保存了页面视口的信息。
- 在IE6中， 这些属性必须在标准模式下才有效。如果是混杂模式，就必须通过`document.body.clientWidth`和`document.body.clientHeight`取得相同信息。
- 而对于混杂模式下的Chrome，则无论通过`document.documentElement`还是`document.body`中的`clientWidth`和`clientHeight`属性，都可以取得视口大小。
- 虽然最终无法确定浏览器窗口本身的大小，但却可以取得页面视口大小。
```javascript
var pageWidth = window.innerWidth,
    pageHeight = window.innerHeight;
if( typeof pageWidth != "number" ){
    if( document.compatMode == "CSS1Compat" ){
        pageWidth = document.documentElement.clientWidth;
        pageHeight = document.documentElement.clientHeight;
    } else {
        pageWidth = document.body.clientWidth;
        pageHeight = document.body.clientHeight;
    }
}    
```
### 调整浏览器窗口大小
- resizeTo() 接收浏览器窗口的新宽度和新高度
- resizeABy() 接收新窗口与原窗口的宽度和高度之差
- 只能在最外层window对象使用 IE7及更高版本中默认是金庸的

## 弹出关闭窗口
- window.open 详细参数看mdn
- window.close 一般是通过JS或者用户点击打开的才会执行
- 检测window.open的返回值可以确定弹出窗口是否被屏蔽
    1. 如果浏览器内置的屏蔽程序阻止的弹出窗口，那么window.open()很可能返回null
    2. 如果浏览器扩展或其他程序阻止弹出窗口，那么window.open()通常会抛出一个错误
    
## setTimeout setInterval 
> 注意不要传字符串 和 eval一个性质 如果传字符串

## 系统对话框

## location对象
- location对象既是window对象的属性，也是document对象的属性。
- 换句话说，window.location和document.loaction引用的是同一个对象。
- 参数
    1. hash 返回url中的hash 不存在返回空字符串
    2. host 服务器名称和端口号
    3. hostname 不带端口号的服务器名称
    4. href 返回当前加载页面的完整URL location.toString()方法也返回这个值
    5. pathname 返回url中的目录和（或）文件名
    6. port 返回url中指定的端口号。如果url中年不包含端口号，返回空字符串
    7. protocol 返回页面使用的协议 通常是HTTP https
    8. search 返回url的查询字符串。字符串以问号开头
- 查询字符串参数
```JavaScript
function getQueryStringArgs(){
    // 取得查询字符串并去掉开头的问号
    var qs = ( location.search.length > 0  ? location.search.substring(1) : "" ),
        args = {},
        items = qs.length ? qs.split("&") : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;
        
    // 逐个加到args对象中
    for( i = 0; i < len; i++ ){
        item = items[i].split("=");
        name = decodeURIComponent( item[0] );
        value = decodeURIComponent( item[1] );
        if( name.length ){
            args[name] = value;
        }
    }
    return args;
}
```
- assign() 立即打开新URL并在历史记录中生成一条新纪录
- replace() 打开的URL history不会记录 用户不能后退到上个页面

## navigator 对象

## 检测插件
- 非IE可以使用plugins数组来达到目的。
- 1. name： 插件的名字
  2. description： 插件的描述
  3. filename 插件的文件名
  4. length 插件所处理的MIME类型数量
```javascript
// 检测插件 在IE中无效
function hasPlugin( name ){
    var name = name.toLowerCase();
    for( var i = 0, l = navigator.plugins.length; i < l; i++ ){
        if( navigator.plugins[i].name.toLowerCase().indexOf(name) > -1 ){
            return true
        };
    }
    return false
}
alert( hasPlugin("Flash") )
```

## 检测IE中的插件
- 使用专有的ActiveXObject类型
- IE是以COM独享的方式实现插件的，而COM对象使用唯一标识符来标识，因此，要检查特定的插件，就必须知道其COM标识符。
```javascript
function hasIEPlugin( name ){
    try{
        new ActiveXObject( name );
        return true
    } catch (ex){
        return false
    }
}

// 检测 QuickTime
alert( hasIEPlugin( "QuickTime.QuickTime" ) )
```

## registerContentHandler() 和 registerProtocolHandler()
- 这两个方法可以让一个站点指明它可以处理特定类型的信息。

# history对象
