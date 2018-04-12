# 节点层次
- DOM可以将任何HTML或XML文档描绘成一个由多层节点构成的结构。
- 节点氛围几种不同的类型，每种类型分别表示文档中不同的信息及标记。
- 每个节点都拥有各自的特点、数据和方法，另外也与其他节点存在某种关系。
- 节点之间的关系构成了层次，而所有页面标记则表现为一个以特定节点为根节点的树形结构。

```HTML
<html>
    <head>
        <title>Sample Page</title>
    </head>
    <body>
        <p>Hello World!</p>
    </body>
</html>
```

- `文档节点`是每个文档的根节点，上面那个栗子中，文档节点只有一个子节点，即<html>元素，我们称之为文档元素。
- 文档元素是文档的最外层元素，文档中的其他所有元素都包含在文档元素中。
- 每个文档只能有一个文档元素。
- 在HTML页面中，文档元素始终都是<html>元素。
- 在XML中，没有预定义的元素，因此任何元素都能成为文档元素。
- HTML元素通过元素节点表示
- 特性(attribute)通过特性节点表示
- 文档类型通过文档类型节点表示
- 注释则通过注释节点表示
- 总共有12种节点类型，这些类型都继承自一个基类型    

## Node类型
- DOM1级定义了一个Node接口，该接口将由DOM中的所有节点类型实现。
- 这个Node接口在JS中作为Node类型实现的
- 除了IE之外，在其他所有浏览器中都可以访问到和这个类型
- JS中的所有节点类型都继承自Node类型，因此所有及诶单类型都共享着相同的基本属性和方法。
- 有12个常量 Node.  不打了 
- 为了保证兼容性，最好还是将nodeType属性与数字值进行比较
```javascript
if( someNode.nodeType == 1 ){
    alert( "Node is an element" )
}
```

### nodeName 和 nodeValue属性
- 要了解节点的具体信息，可以使用nodeName和nodeValue属性。这两个属性的值完全取决于节点的类型
- 在使用这两个值以前，最好先检测下节点类型
```javascript
if( someNode.nodeType == 1 ){
    value = someNode.nodeName // nodeName的值是元素的标签名
}
```

### 节点关系
- 每个节点都有一个`childNodes`属性，其中保存着一个`NodeList`对象。
- NodeList是一种类数组对象，用于保存一组有序的节点，可以通过位置来访问这些节点。
- 虽然可以通过方括号语法来访问NodeList的值，而且这个对象也有length属性，但它并不是Array的实例。
- NodeList对象的独特之处在于，他实际上是基于DOM结构动态执行查询的结果，因此DOM结构的变化能够自动反映在NodeList对象中
- 它是一个有生命呼吸的对象不是第一次访问他们的某个瞬间拍下的快照。
```javascript
var firstChild = someNode.childNodes[0];
var secondChild = someNode.childNodes.item(1);
var count = someNode.childNodes.length;
```
- 如果在IE8之后
```javascript
var arrayOfNodes = Array.prototype.slice.call( someNode.childNodes, 0 );
```
- IE8及更早版本将NodeList实现为一个COM对象，我们不能像使用JS对象那样使用这种对象，因此上面的代码会导致错误。
- 兼容写法
```javascript
function convertToArray( nodes ){
    var array = null;
    try {
        // 针对非IE
        array = Array.prototype.slice.call( nodes, 0 )
    } catch(err){
        array = new Array();
        for( var i = 0, l = nodes.length; i < l; i++ ){
            array.push( nodes[i] )
        }
    }
    return array;
}
```
- 每个节点都有个parentNode属性，该属性指向文档树中的父节点。
- 包含在childNodes里诶保重的所有节点都具有相同的父节点，因此他们的parentNode属性都指向同一个节点。
- 包含在childNodes列表中的每个节点相互之间都是同胞节点。
- 通过使用列表中每个节点的`previousSibling`（上一个兄弟节点）和`nextSibling`（相邻的下一个兄弟节点）属性，可以访问同一列表中的其他节点。不存在就返回`null`
- 父节点的`firstChild`和`lastChild`属性分别指向其`childNodes`里诶保重的第一个和最后一个节点。

## 操作节点
- 关系指针都是只读的。
- **appendChild()** 向childNodes列表的末尾添加一个节点。
- 添加节点后，childNodes的新增节点，父节点及以前的最后一个子节点的关系指针都会相应的得到更新
- 更新完后，appendChild()返回新增的节点
```javascript
var returnedNode = someNode.appendChild( newNode );
alert( returnNode = newNode ) // true
alert( soemNode.lastChild == newNode ) // true
```
- **insertBefore()** 把节点放在childNodes列表中某个特定位置上，而不是放在末尾。
- 两个参数： 要插入的节点和作为参照的节点。
- 插入节点后，被插入的节点会变化才能参照节点的前一个同胞节点( previousSibling ) 同事被方法返回
- 如果参照节点是null 则inserBefore()与appendChild()执行相同的操作。
```javascript
// 插入后成为最后一个子节点
returnedNode = someNode.insertBefore( newNode, null );

// 插入成为第一个子节点
var returnedNode = someNode.insertBefore( newNode, someNode.firstChild );

// 插入成为最后一个子节点前面
returnedNode = someNode.insertBefore( newNode, someNode.lastChild )
```
- **replaceChild()** 
- 参数： 要插入的节点和要替换的及诶单。要替换的节点将由这个方法返回并从文档树中被移除，同时由要插入的节点占据其位置。
- 使用该方法插入一个节点时，该节点的所有关系指针都会从被它替换的节点复制过来。尽管从技术上将，被替换的节点仍然还在文档中，单它在文档中已经没有了自己的位置 
```javascript
// 替换第一个节点
var returnedNode = someNode.replaceChild( newNode, someNode.firstChild )
// 替换最后一个子节点
returnedNode = soemNode.replaceChild( newNode, someNode.lastChild )
```
- **removeChild()**
- 只有一个参数，即要移除的节点， 被移除的节点将成为方法的返回值。
```javascript
var formerLastChild = someNode.removeChild( someNode.lastChild )
```
- 通过removeChild移除的节点仍为文档所有，只不过在文档中已经没有了自己的位置。

### 注意
- 前面介绍的四个方法都是某个节点的子节点，要使用这些方法必须先取得父节点（parentNode）。
- 并不是所有的节点都有子节点，如果在不支持子节点的节点使用该方法将会报错。

## 其他方法
**cloneNode()**
- 用于创建调用这个方法的节点的一个完全相同的副本
- cloneNode方法接受一个布尔值参数，表示是否执行深刻复制， 当参数为true时，执行深刻复制，也就是复制节点及其整个节点树
- 当参数为false时，执行浅复制，即只复制节点本身。复制后返回的节点副本属于文档所有，但并没有为它指定父节点。因此，这个节点副本就成为了一个孤儿，除非通过appendChild()、 insertBefore()或replaceChild()将它添加到文档中
```html
<ul>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 3</li>
</ul>
<script>
    // 若果我们已经将ul元素的引用保存在了变量myList中，name通常下列代码就可以看出使用cloneNode()方法的两种模式
    
    var deepList = myList.cloneNode( true );
    alert( deepList.childNodes.length ) // 3 (IE < 9) 或 7（其他浏览器); 可能会有些差异，主要因为IE8及更早版本与其他浏览器处理空白字符的方式不一样
                                                     
    var shallowList = myList.cloneNode( false );
    alert( shallowList.childNodes.length ) // 0 浅复制不包含子节点                                                  
</script>
```

**normalize()**
- 这个方法唯一的作用就是处理文档树中的文本节点
- 由于解析器的实现或DOM操作等原因，可能会出现文本节点不包含文本，或者接连出现连个文本几点的情况
- 当在某个节点上调用这个方法时，就会在该节点的后代节点中查找上述两种情况
- 如果找到了空文本节点，则删除它，如果找到相邻的文本节点，则将他们合并为一个文本节点。

## Document类型
- JS通过Document类型表示文档。
- 在浏览器中，document对象是HTMLDocument( 继承自Document类型 )的一个是心理，表示整个HTML页面
- document对象是window对象的一个属性，因此可以将其作为全局对象来访问
- 特征：
    1. nodeType 9
    2. nodeName "#document"
    3. nodeValue null
    4. parentNode null
    5. ownerDocument null
    6. 其子节点可能是一个DocumentType(最多一个) Element(最多一个) ProcessingInstruction 或 Comment
- Document类型可以表示HTML页面或者其它基于XML的文档。不过，最常见的应用还是作为HTMLDocument实例的doucment对象。
- 通过这个文档对象，不仅可以取得与页面有关的信息，而且还能操作页面的外观及其底层结构。

### 文档的子节点
- 虽然DOM标准规定Document节点的自及诶单可以是DocumentTYpe、 Element、 ProcessingInstruction 或Comment 但还有两个内置的访问器子节点的快捷方式。
**documentElement**
- `documentElement`  该属性始终指向HTML页面中的<html>元素。
    
- 另个一个就是通过 `childNodes`里诶包访问文档元素
- 单通过`documentElement`属性则能更快捷、更直接的访问该元素。
```html
<html>
    <body>
        <script>
            var html = document.documentElement // 取得对<html>的引用
            alert( html === document.childNodes[0] ) // true
            alert( html === document.firstChild ) // true
        </script>
    </body>
</html>
```
- 作为HTMLDocument的实例，document对象还有一个body属性，直接指向<body>元素
    
```javascript
    var body = document.body; // 取得对body的引用    
``` 
**DocumentType**
- Document另一个可能的子节点是`DocumentType`。通常将`<!DOCTYPE>`标签看成一个与文档其他部分不同的实体，可以通过doctype属性来访问它的信息
```javascript
var doctype = document.doctype; // 取得对<!DOCTYPE>的引用
```
- <IE8，如果存在文档类型声明，会将其错误地解释为一个注释并把它 当做 Comment节点；而document.doctype的值始终为null
- IE9+及firefox 如果在文档类型声明，则将其作为围挡的第一个子节点；documnt.doctype是一个DocumentType节点，也可以通过document.firstChild或document.childNodes[0]访问同一个节点
- Safari Chrome 和Opera 如果存在文档类型声明，则将其解析，但不作为文档的子节点。document.doctype是一个DocumentType节点，但该节点不会出现在document.childNodes中
- 由于浏览器对docuemnt.doctype的支持不一，因此这个属性的用处很有限

**注释的节点问题**
```html
<!--第一条注释-->
<html>
    <body>
    </body>
</html>
<!--第二条注释-->
```
- 这个页面看起来有3个子节点： 注释、<html>元素、注释。从逻辑上将，我们会认为document.childNodes中英爱包含与这3个子节点对应的3项。但是现实中的浏览器在处理位于<html>外部的主食方面存在如下差异
-   1. <IE8、Safari3.1及更高版本、Opera Chrome职位的一条注释创建节点不为第二条注释创建节点，结果第一条注释就会成为document.childNodes中的第一个子节点。
    2. IE9+会为每条注释创建一个节点
    3. Firefox以及Safari3.1之前的版本会完全你忽略这两条注释   
- 同样，浏览器间的这种不一致性也导致了位于<html>元素外部的注释没有什么用处           

### 文档信息
**documtn.title**
- 作为HTMLDocument的一个实例，document独享还有一些标准的Document对象所没有的属性，这些属性提供了document对象所表现的网页的一些信息。
```javascript
docuemnt.title = "new Title"
```
**document.domain document.URL document.referrer**
- URL 地址栏中的URL
- domain 取得域名
- referrer 去的来源页面的URL
- 三个属性中，只有domain是可设置的，但不能设置任何值。只能设置成主域名值。不能将这个属性设置为URL中不包含的域。
- 如果域名一开始是松散的(loose)，那么不能将它在设置为"紧绷的"（tight）
```javascript
// 假设页面来自于 p2p.wrox.com 域
document.domain = "wrox.com" // 松散的(成功)
docuemnt.domain = "p2p.wrox.com" // 紧绷的(出错)
```
## 查找元素
**document.getElementById**
- 接收一个参数，要取得元素的ID，如果找到相应的元素则返回该元素，如果不存在，返回Null，严格匹配包括大小写
```javascript
// #myDiv
document.getElementById("myDiv");
document.getElementById("mydiv") // IE7及更早版本之外的所有浏览器中都会返回Null
// IE8及较低版本不区分ID的大小写
```
- <IE7 低版本有个怪癖：name特性与给定ID匹配的表单元素也会被该方法返回，所以ID尽量和name不要相同

**document.getElementsByTagName**
- 接收一个参数，要取得元素的标签名，返回的是包含零或多个元素的NodeList
- 在HTML文档中，这个放啊会返回一个HTMLCollection对象，作为一个动态集合，该对象与NodeList非常类似，可以使用方括号语法item()方法来访问HTMLCollection对象中的项
- 这个对象中元素的数量可以通过length属性得到
- namedItem(): 使用这个方法可以通过元素的name特性取到集合中的项
```html
<img src="" name="myImg">
<script>
    var imgs = document.getElementsByTagName('img');
    var myImg = imgs.namedItem("myImg")
    // 还可以按名称访问
    var myImg = imgs["myImg"]
</script>
```

- "\*" 表示全部
```javascript
docuemnt.getElementsByTagName("*") // 返回页面中所有的元素
// 由于IE将注释实现为元素，因此IE中调用会返回所有注释节点
```

**getElementsByName**
- 只有HTMLDocument类型才有的方法，这个方法会返回带有给定name特性的所有元素

**特殊集合**
- docuemnt.anchors 文档中带有name特性的a元素
- docuemnt.applets 文档中所有<applets> 已废弃
- document.forms 文档中所有表单元素
- document.images 所有img元素
- document.links 所有带href特性的a   
    
**DOM一致性检测**
- document.implementation
- DOM一级职位该属性规定了一个方法——hasFeature()。参数1： 要检测的DOM功能的名称及版本号，如果浏览器支持给定名称和版本的功能，返回true
- 该方法也有缺陷，最好除了检测hasFeature之外还是用能力检测

**文档写入**
- docuemnt.write() 原样写入
- doucemnt.writeln() 字符串末尾加上换行符
- docuemnt.open和close 用于打开和关闭网页输出流

## Element类型
- Element类型用于表现XML或HTML元素，提供了对元素标签名，子节点及特性的访问
-   1. nodeType 值为1
    2. nodeName 值为元素标签名
    3. nodeValue 的值为null
    4. parentNode 可能是Document或Element
    5. 子节点类型比较多
    
- 要访问元素标签名，可以使用nodeNmae属性，也可以使用tagName属性，这两个属性会返回相同的值（使用后者主要是为了清晰可见）
```javascript
var div = document.getElementById('myDiv');
div.tagName // "DIV" // 在HTML中，标签名始终以全部大写表示，在XML中则与源码一直，当不确定在HTML还是XML中，最好都转换成小写
div.tagName.toLowerCase() // div
div.nodeName // true
```

**HTML元素**
- 所有HTML元素都有HTMLElement类型表示，不是直接通过这个类型也是通过它的子类型表示
- HTMLElement类型直接继承自Element并添加了一些属性
-   1. id 元素在文档中的唯一标识符
    2. title 有关元素的附加说明信息，一般通过工具提示条显示出来
    3. lang 元素内容的语言代码
    4. dir 语言的方向 ltr left-to-right rtl right-to-left
    5. className 与元素的calss特性对应，即为元素指定的CSS类
- 以上都是可读可修改的

**特性**
- getAttribute
- setAttribute
- removeAttribute
- 自定义属性应该加上data-前缀
- 只有公认的（非自定义的）特性才会以属性的形式添加到DOM对象中
- style和onclick等事件的会返回的不一致
- <IE7 setAttribute存在一些异常 蛇者clas和style没有效果设置事件处理也无效IE8才解决
- <IE6 不支持removeAttribute

**attributes**
- Element类型是使用attributes属性的唯一一个DOM节点类型
- attributes属性中包含一个NamedNodeMap， 与NodeList类似也是一个动态集合，元素的每一个特性都由一个Attr节点表示，每个节点都保存在NamedNodeMap对象中
-   1. getNamedItem 返回nodeName属性等于name的节点
    2. removeNamedItem 从列表中移除nodeNmae属性等于name的节点
    3. setNamedItem 想列表中添加节点 以节点的nodeName属性为索引
    4. item 返回位于数字pos位置处的节点
- 不太方便 大家还是用上面的特性

**创建元素**
- docuemnt.createElement()方法创建新元素
- 只接受一个参数——要创建的元素标签名 这个标签名在HTML中不区分大小写，而在XML中区分
- 使用该方法的同时，也为新元素设置了ownerDocuemnt属性，此时，还可以操作元素的特性，为它添加更多子节点及操作
```javascript
var div = document.createElement("div");
div.id = "myNewDiv";
div.className = "box"
```
- 创建好后并没有添加到文档树中，因此，设置这些特性不会影响浏览器的显示
- 可以使用 appendChild() insertBefore() 或 replaceChild()方法， 一但将元素添加到文档中，浏览器就会立即呈现该元素，此后，对这个元素的任何修改都会实时反映在浏览器中
- IE中可以为这个方法传入完整的元素标签，也可以包含属性
```javascript
var div = docuemnt.createElement("<div id=\"myNewDiv\" class=\"box\" ></div>")
```
- 这种方式有助于避开在IE7及更早版本中动态创建元素的某些问题
-   1. 不能设置动态创建的iframe元素的name特性
    2. 不鞥呢通过表单的reset方法重设动态创建的input元素
    3. 动态创建的type特性值为"reset"的<button>元素重设不了表单
    4. 动态创建的一批name相同的单选按钮彼此毫无关系
- 上述问题都可以通过这种方式解决 但是只能在IE中 
    
**元素子节点**
- 元素的childNodes属性中包含了它的所有子节点
- 不同浏览器中子节点数量不同，所以在执行某项操作前，都要先检查下nodeType属性
```javascript
for( var i = 0, l = element.childNodes.length; i < l; i++ ){
    if( element.childNodes[i].nodeType == 1 ){
    
    }
}
```
- 通过某个特定的标签名取得子节点或后代节点
```javascript
    var ul = docuemnt.getElementById("myList");
    var items = ul.getElementsByTagName("li")
```

## Text类型
- 文本节点由Text类型表示，包含的是可以照字面解释的纯文本内容。春文中可以包含转义后的HTML字符，但不能包含HTML代码
-   1. nodeType 3
    2. nodeName "#text"
    3. nodeValue 为节点所包含的文本
    4. parentNode是一个Element
    5.不支持（没）子节点
- 可以通过nodeValue属性或data属性访问Text接地那种包含的文本，两个属性更改，另一方都会反映出来。
-   1. appendData(text) 将text添加到节点末尾
    2. deleteData(offset, count) 从offset指定的位置开始删除count个字符
    3. insertData(offset, test) 在offset指定的位置插入text
    4. replaceData(offset, count, text) 用text替换从offset指定的位置开始到offsetcout为止处的文本
    5. splietText(offset) 从offset指定的位置将当前文本节点分成两个文本节点
    6. substringData(offset, count) 提取从offset指定的位置开始到offsetcount位置的字符串
- length 属性  nodeValue.length 和 data.length 相同的值
- 修改文本节点时还要注意，此时的字符串会经过HTML（取决于文档类型）编码

**创建文本节点**
- document.createTextNode()
- 同样可以设置ownerDocuemnt属性
- 同样是添加到文档树中才能看到
- 如果连个文本几点是相邻的同胞节点，那么这两个节点就会串联显示，中间不会有空格

**规范化文本节点**
- normalize() IE6中使用这个方法可能会崩溃IE6
- 如果一个包含两个或多个文本节点的父元素上调用normalize()方法，则会将所有文本节点合并成一个节点，结果节点的nodeValue等于将合并前每个文本节点的nodeValue值拼起来的值

**分割文本节点**
- splitText() 
- 按照指定位置分割文本节点

## Comment类型
- 是注释类型
-   1. nodeType 8
    2. nodeName "#comment"
    3. nodeValue 值为注释内容
    4. parentNode 可能是Docuemnt或Element
    5. 不支持（没有）子节点
- Comment类型与Text类型继承自相同的基类，因此它拥有除splitText()之外的所有字符串操作方法，与Text类型相似，也可以通过nodeValue或data属性来取得注释内容    

## CDATASection
- 基于XML文档，表示的是CDATA区域
- 与Comment类似，CDATASection类型继承自Text类型，因此拥有除solitText之外的所有字符串操作方法
-   1. nodeType 4
    2. nodeName "#cdata-section"
    3. nodeValue 是CDATA区域中的内容
    4. parentNode 可能是Docuemnt 或Element
    5. 不支持 没有子节点
    
## DocuemntType类型
## DocumentFragment类型
## Attr类型
- nodeType 2

# DOM操作

## 动态脚本
```javascript
var script = docuemnt.createElement("script");
script.type = "text/javascript";
script.src = "client.js"
docuemnt.bpdy.appendChild(script)
// script.appendChild( document.createTextNode("function(){alert(\"hi\")}") ) 这种在IE可能会报错
script.text = "function(){alert(\"hi\")}" // safari 3.0 之前可能会报错
// 兼容写法
var code = "function(){alert(\"hi\")}";
try {
    script.appendChild( document.createTextNode(code) )
} catch (ex){
    script.text = code;
}
```
## 动态样式
```javascript
var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "style.css";
var head = document.getElementsByTagName('head')[0];
head.appendChild( link )

var style = docuemnt.createElement("style"),
    code =  "body{color: #666}" ;
style.type = "text/css";
try{
    // IE 低版本会报错
    style.appendChild( document.createTerxtNode(code);
} catch(ex){
    style.styleSheet.cssText = code;
}
```

## 创建表格  
- 太麻烦了  直接 innerHTML吧。。。

## 使用NodeList
- NodeList 近亲 NameNodeMap HTMLCollection  三个都是动态的 每当文档结构变化 他们都会得到更新
```javascript
// 这种由于divs每次都是动态获取的所以会无限循环 因为length是动态的
var divs = document.getElementsByTagName("div"),
    div;
for( i = 0; i < divs.length; i++ ){
    div = document.createElement("div");
    document.body.appendChild(div)
}

// 把length存起来即可
var divs = document.getElementsByTagName("div"),
    div;
for( i = 0, l = divs.length; i < l; i++ ){
    div = document.createElement("div");
    document.body.appendChild(div)
}
```

# DOM扩展

## querySlector()
- 接收一个CSS选择符， 返回该模式匹配的第一个元素，如果没有，返回null
- 通过Element类型调用querySelector方法时，只会在该元素后代元素的范围内查找匹配元素
- 如果传入了不被支持的选择符，querySelector会抛出错误
- IE8开始支持

## querySelectorAll()
- 接受一个css选择符 返回NodeList实例
- 如果没有找到匹配的元素 返回的是空的
- 如果传入了不被支持的选择符，querySelectorAll会抛出错误
- MDN上说IE不支持:SCOPED

## matchesSelector() matches()
- 一个参数，如果调用该元素与该选择符匹配，返回true 否则 返回false
- 所有浏览器都不支持 可以用浏览器私有
```javascript
// 兼容写法
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;            
        };
}
```

## 元素遍历
- 对于元素间的空格 IE9及之前版本不会返回文本节点，而其他所有浏览器都会返回文本节点，为了弥补差异同事保持DOM规范不变，新增了如下API
-   1. childElementCount 返回子元素（不包括文本节点和注释）的个数
    2. firstElementChild 指向第一个子元素 firstChild的元素版
    3. lastElementChild 指向对吼一个子元素 lastChild的元素版
    4. previousElementSibling 指向前一个同辈元素 previousSibling 的元素版
    5. nextElementSibling 指向后一个同辈元素 nextSibling的元素版
- IE9+ Firefox 3.5+ Safari 4+ Chrome Opera 10+    
- 利用这些元素不必担心空白文本节点，从而更方便的查找DOM元素了， 举个例子

- ```javascript
var i,
    len,
    child = element.firstChild;
while( child != element.lastChild ){
    // 检查是不是元素
    if( child.nodeType == 1 ){
        processChild(child)
    }
    child = child.nextSibling'
}   

// 使用 Element Traversal 新增的元素
var i,
    len,
    child = element.firstElementChild;
 while( child != element.lastElementChild ){
    processChild( child )
    child = child.nextElementSibling;
 };
``` 
```

# HTML5

## getElementsByClassName()方法
- 接收一个参数，即一个包含已获多个类名的字符串，返回带有指定类的所有元素的NodeList
- 传入多个类名时先后顺序不重要
```javascript
docuemnt.getElementById('#div').docuemnt.getElementsByClassName(" username current ")
```
- IE 9+ Firefox 3+ Safari 3.1+ Chrome Opera 9.5+

## classList
- 在操作类名时，需要通过className 属性添加、删除和替换类名。因为className是一个字符串，即使修改字符串的一部分，也必须每次都设置整个字符串的值
```html
<div class="bd user disabled">...</div>
<script>
// 删除user类
var className = div.className.split(/\s+/);
var pos = -1,
    i,
    len;
for( i = 0, len = classNames.length; i < len; i++ ){
    if( className[i] == "user" ){
        pos = i;
        break;                                             
    }                                         
}    
// 删除类名                                             
classNames.splice(i, 1);     
// 把剩下的类名拼成字符串重新设置
div.className = classNames.join(" ");                                             
</script>
```
- `classList`属性是心机和类型DOMTokenList的实例
- DOMTokenList有一个标识自己包含多少元素的length属性，而要取得每个元素可以使用item()方法，也可以使用方括号语法，还有如下方法
-   1. add 将给定的字符串值添加到列表中，如果值已经存在，就不添加了
    2. contains 标识列表中是否存在给定的值，如果存在返回true 否则返回false
    3. remove 从列表中删除给定的字符串
    4. toggle 如果列表中存在给定的值，删除它；如果列表中没有给定的值，添加它
- 很可惜 只有Firefox 3.6+ 和Chrome8.0 IE10+(不支持toggle) Opera11.5 Safari (WebKit)5.1 
