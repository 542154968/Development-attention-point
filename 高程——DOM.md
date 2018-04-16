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

## 焦点管理
- document.activeElement
- 这个属性始终会引用DOM中当前获得了焦点的元素
- 默认情况下，文档刚刚加载完成时，doucment.activeElement中保存的是document.body元素的引用。文档加载期间，document.activeElement的值为null
- document.hasFocus();
- 用于确定文档是否获得了焦点

## HTMLDocument变化
**readyState属性**
- IE4提出，HTML5纳入标准
- 两个值： loading——正在加载文档 complete——已经加载完文档
```javascript
if( document.readyState == "complete" ){
    // 执行操作
}
```

**兼容模式**
- 从IE6开始区分渲染页面的模式是标准的还是混杂的。
- IE6给document添加了一个名为compatMode的属性，值是浏览器采用了哪种渲染模式
- 标准模式下 document.compatMode的值是`CSS1Compat`
- 混杂模式下 document.compatMode的值是`BackCompat`

**head属性**
- HTML5增加了docuemnt.head属性
```javascript
// 兼容写法
var head = document.head || document.getElementsByTagName("head")[0]
```

**字符集属性**
- document.charset
- 如果文档没有使用默认的字符集，那charset和defaultCharset属性的值可能会不一样
```javascript
if( document.charset != document.defaultCharset ){
    // 
}
```

**自定义数据属性**
- 为元素添加非标准的属性必须要写成data-的形式，目的是伪元素提供与渲染无关的信息，或者提供语义信息
```html
<div id="myDiv" data-appid = "123456" ></div>
<script>
    var div = document.getElmentById("myDiv");
    var appId = div.dataset.appId;
    console.log( appId )
    div.dataset.appId = 2446;
</script>
```
- 全浏览器支持

## 插入标记
**innerHTML**
- 不多讲
- 插入script时，必须为其制定defer属性，必须位于有作用域的元素之后 很多问题 插入script 和link
- 在IE8中 可以通过 window.toStaticHTML()方法去除脚本节点和事件处理程序属性
- 自己也要注意处理

**outerHTML**
- 在读模式下，outerHTML返回调用它的元素及所有子节点的HTML标签。
- 在写模式下，outerHTML会根据指定的HTML字符串创建新的DOM子树，然后用这个DOM子树完全替换调用元素
> [参考](https://blog.csdn.net/html5_/article/details/23619103)

```html
<!DOCTYPE html>  
<html>  
<head>  
    <meta charset= 'utf-8'>  
    <title></title>  
</head>  
<body>  
    <div id="test1">这是div中的文字<span>这是span中的文字</span></div>  
  
    <script type="text/javascript">  
        console.log('innerHTML:'+test1.innerHTML);  
        console.log('outerHTML:'+test1.outerHTML);  
        console.log('innerText:'+test1.innerText);  
        console.log('outerText:'+test1.outerText);  
    </script>  
</body>  
</html> 

innerHTML:这是div中的文字<span>这是span中的文字</span>
outerHTML:<div id="test1">这是div中的文字<span>这是span中的文字</span></div>
innerText:这是div中的文字这是span中的文字
outerText:这是div中的文字这是span中的文字
```

**insertAdjacentHTML()方法**
- 最早在IE中出现的， 接收两个参数 插入位置和要插入的HTML文本
- 第一个参数
-   1. beforebegin 在当前元素之前插入一个紧邻的
    2. afterbegin 在当前元素之下插入一个新的子元素或在第一个子元素之前在插入新的子元素
    3. beforeend 在当前元素之下插入一个新的子元素或在最后一个子元素之后再插入新的子元素
    4. afterend 在当前元素之后插入一个紧邻的同辈元素
- IE8+  都支持

**scrollIntoView()**
- 可以在所有HTML元素上调用，通过滚动浏览器窗口或某个容器内的元素，调用元素就可以出现在视口中
- 传入true或不传入，窗口滚动之后会让调用元素的顶部与视口顶部尽可能平齐
- 传入false元素尽可能出现在视口中，可能的话，调用元素的底部会与视口顶部平齐 不过顶部不一定平齐
```javascript
document.forms[0].scrollIntoView();
```
- IE8+

## 专有扩展
**文档模式**
- 页面的文档模式决定了可以使用什么功能 页面的文档模式决定了你可以使用哪个级别的CSS 可以在JS中使用哪些API，以及如何对待文档类型
- 到了IE9 总共有四种文档模式
-   1. IE5 以混杂模式渲染页面 ie8+的功能都无法使用
    2. IE7 IE7标准模式 IE8+无法使用
    3. IE8 已IE8标准渲染 IE8中的新api都可使用 IE9+无法使用
    4. IE9 IE9
- <meta http-equiv="X-UA-Compatible" content="IE=IEVersion">  
- 最好使用 IE = Edge  始终已最新的文档模式来渲染
- var mode = document.documentMode // 返回模式

**children**
- 由于IE9之前的版本处理空白文本有差异，于是就出现了children属性
```javascript
var childCount = element.children.length
var firstChild = element.children[0]
```
- IE8及更早版本的children属性中也会包含注释节点 ie9之后只返回元素节点

**contains()**
- 检测某个节点是否是另一个节点的后代
- 所有浏览器都支持
```javascript
document.documentElement.contains( document.body ) // true
```
- 使用 DOM Level3 `compareDocumentPosition()` 也能够确定节点之间的关系
- IE9+ 
- 返回一个标识该关系的位掩码
-   1. 1 无关 给定的节点不在当前文档中
    2. 2 居前 给定的节点再DOM树中位于参考节点之前
    3. 4 居后 给定的结点在DOM数中位于参考节点之后
    4. 8 包含 给定的节点是参考节点的祖先
    5. 16 被包含 给定的节点是参考节点的后代
- 为模仿contains方法 应该关注的是掩码16 可对`compareDocumnetPosition` 的结果执行按位与，以确定参考节点（调用compareDocumentPosition方法的当前节点）是否包含给定的节点（传入的节点）
```javascript
var result = docuemnt.docuemntElement.compareDocumentPosition( document.body );
alert( !!( result & 16 ) ) // 20
```
- 执行上面的代码后，结果会变成20（表示居后的4加上表示被包含的16） 对掩码16执行按位操作会返回一个非零数值，而两个逻辑非操作会将该数值转换成布尔值
```javascript
function contains(refNode, otherNode){
    if (typeof refNode.contains == "function" &&
        (!client.engine.webkit || client.engine.webkit >= 522)){
        return refNode.contains(otherNode);
    } else if (typeof refNode.compareDocumentPosition == "function"){
        return !!(refNode.compareDocumentPosition(otherNode) & 16);
    } else {
        var node = otherNode.parentNode;
        do {
            if (node === refNode){
                return true;
            } else {
                node = node.parentNode;
            }
        } while (node !== null);
        return false;
    }
}
```

## 插入文本
- IE的innerText和outerText没有纳入HTML5规范

**innerText**
- 通过innerText属性可以操作元素中包含的所有文本内容，包括子文档树中的文本
- 在通过innerText读取值时，它会按照由浅入深的顺序，将子文档树中的所有文本拼接起来
- 在通过innerText写入值时，结果会删除元素的所有子节点，插入包含响应文本值的文本节点
- firefox 45 才开始支持 他有类似的 textContent
```javascript
function getInnerText(element){
    return ( typeof element.textContent == "string" ) ? 
            element.textContent : clement.innerText
}

function setInnerText(element, text){
    if( typeof element.textContent == "string" ){
        element.textContent = text;
    } else {
        element.innerText = text;
    }
}
```

**outerText**
- 读的模式下 和 innerText基本上没多大区别
- 写的模式下 outerText会替换整个元素，导致该元素从文档中被删除而无法访问

## 滚动
- scrollIntoViewIfNeeded(alignCenter): 只在当前元素在是口中不可见的情况下，才滚动浏览器窗口或容器元素，最终让它看见，如果当前元素在视口中课件，这个方法什么都不做
- scrollByLines(lineCount): 将元素的内容滚动指定的行高，lineCount可以是正值也可以是负值 非规范 S 和Chrome实现
- scrollByPage(pageCount): 将元素内容滚动到指定的页面高度
- scrollIntoView 和 scrollIntoViewIfNeeded作用的是元素容器  scrollByLines 和 scrollByPages 影响的是元素本身

# DOM2和DOM3
- DOM3 同时增强了既有类型，也引入了一些新类型  主要是命名空间

**Node类型的变化**
> 命名空间实际上没有什么用  混合两种语言的时候就有用了

- localName 不带命名空间前缀的节点名称
- namespaceURI 命名空间URI或者（未指定）情况下 null
- prefix 命名空间前缀或者（未指定）null
```html
<html xmlns="http://www.w3.org/1999/xhtml"> 
    <head> 
        <title>Example XHTML page</title> 
    </head> 
    <body> 
        <s:svg xmlns:s="http://www.w3.org/2000/svg" version="1.1" 
            viewBox="0 0 100 100" style="width:100%; height:100%"> 
            <s:rect x="0" y="0" width="100" height="100" style="fill:red"/> 
        </s:svg> 
    </body> 
</html>
对于<s:svg>而言
它的localName 是 svg
tagName 是 s:svg
namespaceURI 是 
prefix 是s    
```
- 更多方法就不介绍啦 很少用

## 其他方面变化

**DocumentType**
- publicId 
- systemId
- 上面两个DOM1中无法访问
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" 
"http://www.w3.org/TR/html4/strict.dtd"> 
对这个文档类型声明而言，publicId是"-//W3C//DTD HTML 4.01//EN"，而systemId是"http: 
//www.w3.org/TR/html4/strict.dtd"。在支持DOM2级的浏览器中，应该可以运行下列代码。
alert(document.doctype.publicId); 
alert(document.doctype.systemId);
```
- internalSubset 文档类型声明中的额外定义

**Document 类型的变化**
- 唯一与命名空间无关的是 importNode
- 从文档中去的一个节点，然后将其导入另一个文档，时期成为这个文档结构的一部分
- 每个节点都有一个ownerDocument属性，表示所属的文档
- 如果调用appendChild()时传入的节点属于不同的文档，则会导致错误
- 但在调用importNode()时传入不同文档的节点会返回一个新节点，这个新节点的所有权归当前文档所有
- 和element的cloneNode()方法非常相似 接受两个参数 要复制的节点合一表示是否赋值子节点对的布尔值

**defaultView**
- DOM2级视图模块添加了一个名为defaultView属性，其中保存着一个指针，指向拥有给定文档的窗口（或框架） 
- 除IE之外所有有浏览器都支持 IE中有个等价属性叫parentWindow(Opera也支持)
```javascript
var parentWindow = docuemnt.defaultView || document.parentWindow
```

**document.implementation**
- createDocumentType
-   1. 文档类型名称
    2. publicId
    3. stytemId
```javascript
var doctype = document.implementation.createDocumentType("html", 
                "-//W3C//DTD HTML 4.01//EN", 
                "http://www.w3.org/TR/html4/strict.dtd");
```    
- createDocument
-   1. 针对文档中元素的 namespaceURI
    2. 文档元素的标签名
    3. 新文档的文档类型
```javascript
var doctype = document.implementation.createDocumentType("html", 
" -//W3C//DTD XHTML 1.0 Strict//EN", 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"); 
var doc = document.implementation.createDocument("http://www.w3.org/1999/xhtml", 
"html", doctype); 
// 创建一个新的xhtml文档
```    

**document.implementation**
- DOM2级的HTML模块也新增了一个方法 叫 createHTMLDocument()
- 这个方法用途是创建一个完整的HTML文档 包括<html><head><title><body>
- 只接受一个参数 即新创建文档的标题返回新出的HTML文档  
```javascript
var htmldoc = docuemnt.implementation.createHTMLDocument("new doc")    
```    

## Node类型的变化

**isSupported 即将废弃**
> [MDN介绍](https://developer.mozilla.org/en-US/docs/Web/API/Node/isSupported)

- 用于确定当前节点具有什么能力 
- 两个参数 特姓名和特性版本号
- 如果浏览器实现了相应特性而且能够基于给定节点执行该特性 isSupported就返回一个true
- 但是浏览器的返回还是不一致  用能力检测吧 

**isSameNode  isEqualNode**
> [MDN介绍](https://developer.mozilla.org/en-US/docs/Web/API/Node/isSameNode)

- 很冷门 很多浏览器兼容未知
- 接受一个节点参数 并在传入节点与引用的节点相同或相等时返回true
- 相同： 两个节点引用的是同一个对象
- 相等： 连个节点是相同的类型，具有相等的属性，他们的attributes和childNodes属性也相等
```javascript
var div1 = docuemnt.createElement("div");
div1.setAttribute("class", "box")
var div2 = document.createElement("div");
div2.setAttribute("class", "box")

div1.isSameNode(div1) // true 相同  同一个对象
div1.isEqualNode(div2) // true 相等 完全一样
div.siSameNode(div2) // false 引用的不是同一个对象
```

**setUserData 该方法已经被废弃**
> [MDN介绍](https://developer.mozilla.org/en-US/docs/Web/API/Node/setUserData)

- DOM3级还针对DOM节点添加额外数据引入了新方法。 setUserData方法会将数据指定给节点
- 接受三个参数： 要设置的键、实际的数据（可以是任意类型）和处理函数
```javascript
docuemnt.body.setUserData("name", "Nicholas", function(){});
// 通过getUserData并传入相同的键，就可以取得该数据
var value = docuemnt.body.getUserData("name")
```

## 框架的变化
- 框架和内嵌框架飞别用HTMLFrameElement和THMLFrameElement表示， 他们在DOM2级中都有了一个新属性明教contentDocument
- 这个属性包含一个指针，指向表示框架内容的文档对象在此之前，无法直接通过元素取得这个文档对象，只能通过iframe集合
```javascript
var iframe = docuemng.getElementById("myIframe");
var iframeDoc = iframe.contentDocument // IE8之前无效
```
- IE8之前有个contentWindow的属性，该属性返回框架的window对象，而这个window对象又有一个doucumnet属性
```javascript
var iframe = document.getElementById("myiframe");
var iframeDoc = iframe.contentDocument || iframe.contentWindow.docuemnt
```

## 样式

**能力检测**
- DOM2级样式模块提供了一套能力检测的API
```javascript
var supportsDOM2CSS = document.implementation.hasFeature("CSS", "2.0");
var upportsDOM2CSS2 = document.implementation.hasFeature("css2", "2.0")
```

**访问样式**
- float是保留字，因此要用`cssFloat`访问  IE使用`styleFloat`
- `-`必须转成驼峰法  
- 最好都指定单位
- 如果没有为元素设置style特性 那么style对象中可能会包含一些默认值，这些默认值并不能准确的反映钙元素的样式信息
```javscript
var div = document.getElementsByTagName('div')[0];
div.style.bakcground //
div.style.background = "red"
```

**DOM样式属性和方法**
1. cssText 能够访问到style特性中的CSS代码
2. length 应用给元素的CSS属性的数量
3. parentRule CSS信息的CSSRule对象
4. getPropertyCSSValue(propertyName) 返回包含给定属性值的CSSValue对象
5. getPropertyPriority 如果给定属性使用了!important设置 则返回"important" 否则返回空字符串
6. getPropertyValue 返回给定属性的字符串内置
7. item 返回给定位置的CSS属性名称
8. removePorperty 从样式中删除指定属性
9. setProperty( propertyName, value, priority ) 将给定属性设置为相应的值并加上权重标志("important"或空字符串)

- cssText 读模式 cssText返回浏览器对style特性中css代码的内部表示， 写模式 重写真个style特性对的值
- length 将其与item方法配套使用 以便迭代在元素中定义的CSS属性
```javascript
var prop, value, i, len;
for( i = 0, len = myDiv.style.length; i < len; i++ ){
    prop = myDiv.style[i]; // 或者 myDiv.style.item();
    value = myDiv.style.getPropertyCSSValue(prop);
    console.log( prop + ":" + value.cssText + "(" + value.cssValueType + ")" );
}
```

**计算的样式**
- 虽然style对象能够提供支持style特性的任何元素的样式信息，但它不包含那些从其他样式表层叠而来并影响到当前元素的样式信息
- DOM2级增强了document.defaultView，提供了`getComputedStyle()`方法
- 这个方法接受两个参数 要取得计算样式的元素 和一个伪元素字符串（例如:after） 如果不需要伪元素信息，第二个参数可以是null
- getComputedStyle方法返回一个CSSStyleDeclaration对象（与style属性的类型相同）其中包含当前元素的所有计算的样式
```html
<!DOCTYPE html> 
<html> 
    <head> 
        <title>Computed Styles Example</title> 
        <style type="text/css"> 
        #myDiv { 
        background-color: blue; 
        width: 100px; 
        height: 200px; 
        } 
        </style> 
    </head> 
    <body> 
        <div id="myDiv" style="background-color: red; border: 1px solid black"></div> 
        <script>
            var myDiv = document.getElementById("myDiv"); 
            var computedStyle = document.defaultView.getComputedStyle(myDiv, null); 
            alert(computedStyle.backgroundColor);  // "red" 
            alert(computedStyle.width); // "100px" 
            alert(computedStyle.height); // "200px" 
            alert(computedStyle.border); // 在某些浏览器中是"1px solid black" 
        </script>
    </body> 
</html>
```
- 有些浏览器compitedStyle.boder不会返回值，因为不同浏览器解释综合(rollup)属性的方式不同，computedStyle.borderLeftWidth会返回值
- IE9+支持 低版本IE每个具有style属性的元素还有一个currentStyle属性，这个属性是CSSStyleDeclaration的实例，包含当前元素全部计算后的样式
```javascript
var myDiv = document.getElementById("myDiv");
var computedStyle = myDiv.currentStyle;
```

## 操作样式表
- `CSSStyleSheet`类型表示的是样式表，包括通过`<link>`元素包含的样式表和在`<style>`元素中定义的样式表，这两个元素本身分别是由HTMLLinkElement和HTMLStyleElement类型表示的
- CSSStyleSheet类型相对更加通用一些， 它指标是样式表，而不管这些牙膏你失败哦在HTML中是如何定义的
- 上述两个针对元素的类型允许修改HTML特性，单CSSStyleSheet独享则是一套只读的接口，有一个属性例外，使用下面的代码可以确定浏览器是否支持DOM2级样式表
```javascript
var supportsDOM2StyleSheets = documeng.implementation.hasFeature("StyleSheets", "2.0");
```
- CSSStyleSheet继承自StyleSheet 后者可以作为一个基础接口来定义非CSS样式表
-   1. disabled：表示样式表是否被禁用的布尔值。这个属性是可读/写的，将这个值设置为true可
以禁用样式表。
    2. href：如果样式表是通过<link>包含的，则是样式表的URL；否则，是null。
    3. media：当前样式表支持的所有媒体类型的集合。与所有DOM集合一样，这个集合也有一个
    length属性和一个item()方法。也可以使用方括号语法取得集合中特定的项。如果集合是空
    列表，表示样式表适用于所有媒体。在IE中，media是一个反映<link>和<style>元素media
    特性值的字符串。
    4. ownerNode：指向拥有当前样式表的节点的指针，样式表可能是在HTML中通过<link>或
    <style/>引入的（在XML中可能是通过处理指令引入的）。如果当前样式表是其他样式表通过
    @import导入的，则这个属性值为null。IE不支持这个属性。
    5. parentStyleSheet：在当前样式表是通过@import导入的情况下，这个属性是一个指向导入
    它的样式表的指针。
    6. title：ownerNode中title属性的值。
    7. type：表示样式表类型的字符串。对CSS样式表而言，这个字符串是"type/css"。
    除了disabled 属性之外，其他属性都是只读的。在支持以上所有这些属性的基础上，
    CSSStyleSheet类型还支持下列属性和方法：
    8. cssRules：样式表中包含的样式规则的集合。IE不支持这个属性，但有一个类似的rules属性。
    9. ownerRule：如果样式表是通过@import导入的，这个属性就是一个指针，指向表示导入的规
    则；否则，值为null。IE不支持这个属性。
    10. deleteRule(index)：删除cssRules集合中指定位置的规则。IE不支持这个方法，但支持
    一个类似的removeRule()方法。
    11. insertRule(rule,index)：向cssRules集合中指定的位置插入rule字符串。IE不支持这
    个方法，但支持一个类似的addRule()方法。
- 应用于文档的所有样式表是通过document.styleSheets集合来表示的，通过这个集合的length属性可以获知文档中样式表的数量，而通过方括号语法或item方法可以访问每一个样式表    
```javascript
var sheet = null;
for ( var i = 0, l = document.styleSheets.length; i < l; i++ ){
    sheet = document.styleSheets[i];
    alert(sheet.href)
}
```
- 所有浏览器都会包含`<style>`元素和rel特性被设置为"stylesheet"的`link`元素引入的样式表      
- IE和Opera也包含rel特性被设置为"alernate stylesheet"的link元素引入的样式表 但是我刚才火狐试了下取到的并不精确  
- **兼容写法** 通过link或style元素取得
```JAVASCRIPT
function getStyleSheet( element ){
    return element.sheet || element.styleSheet;    
}    
var link = document.getElementsByTagName("link")[0];
var sheet = getStylesheet(link)    
```    
    
**CSS规则**
-   1. cssText：返回整条规则对应的文本。由于浏览器对样式表的内部处理方式不同，返回的文本
    可能会与样式表中实际的文本不一样；Safari始终都会将文本转换成全部小写。IE不支持这个
    属性。
    2. parentRule：如果当前规则是导入的规则，这个属性引用的就是导入规则；否则，这个值为
    null。IE不支持这个属性。
    3. parentStyleSheet：当前规则所属的样式表。IE不支持这个属性。
    4. selectorText：返回当前规则的选择符文本。由于浏览器对样式表的内部处理方式不同，返回
    的文本可能会与样式表中实际的文本不一样（例如，Safari 3之前的版本始终会将文本转换成全
    部小写）。在Firefox、Safari、Chrome和IE中这个属性是只读的。Opera允许修改selectorText。
    5. style：一个CSSStyleDeclaration对象，可以通过它设置和取得规则中特定的样式值。
    6. type：表示规则类型的常量值。对于样式规则，这个值是1。IE不支持这个属性。
- 举个栗子
```html
<style>
    div.box{
        background-color: blue;
        width: 100px;
        height: 200px
    }
</style>
<script>
    va sheet = documeng.styleSheets[0];
    var rules = sheet.cssRules || sheet.rules;
    var rule = rules[0];   //取得第一条规则
    alert(rule.selectorText);   //"div.box" 
    alert(rule.style.cssText);   //完整的CSS代码
    alert(rule.style.backgroundColor);   //"blue" 
    alert(rule.style.width);   //"100px" 
    alert(rule.style.height);   //"200px" 
</script>
```

**创建规则**
- DOM规定，使用`insertRule()`方法向现有样式表中添加新规则
- 接受两个参数，规则文本和表示在哪里插入规则的索引
```javavscript
sheet.insertRule("body{background: silver}", 0)
```
- IE8级更早版本有个`addRule()`方法
```JAVSCRIPT
sheet.addRule("body", "background-color: sliver", 0) // 仅对IE有效 MDN没查到
```
- 据说最多可以使用addRule()添加4095条样式规则超出这个上限的调用将会导致错误
- **兼容写法**
```javascript
function insertRule( sheet, selectoreText, cssText, position ){
    if( sheet.inserRule ){
        sheet.insertRule(selectoreText + "{" + cssText + "}", position)
    }else if(sheet.addRule){
        sheet.addRule( selectoreText, cssText, position )
    }
}
```

**删除规则**
- `deleteRule()`  IE8- `removeRule()` 
- 接受一个参数 要删除的规则的位置
```javascript
function deleteRule( sheet, index ){
    if( sheet.deleteRule ){
        sheet.deleteRule(index)
    }else{
        sheeet.removeRule(index)
    }
}
```
- 添加和删除规则不是实际Web开发中常见做法 需要谨慎对待

## 元素大小
- DOM中没有规定如何确定页面中元素的大小，IE为此率先引入了一些属性，目前所有主要的浏览器都已经支持这些属性。

**偏移量——offset**
- 包括元素在屏幕上占用的所有可见的空间。元素的可见大小由其高度，宽度决定，包括所有内边距、滚动条和边框的大小（不包括**外边距**）
-   1. `offsetHeight`: 元素在垂直方向上占用的空间大小，以像素计。包括元素的高度、（可见的）水平滚动条的高度，上边框高度和下边框高度。
    2. `offsetWidth`: 元素在水平方向上占用的空间大小，以像素计。包括元素的宽度、（可见的）垂直滚动条的宽度，左边框宽度和有边框宽度。
    3. `offsetLeft`: 元素的左外边框至包含元素的左内边框之间的像素距离
    4. `offsetTop`: 元素的上外边框至包含元素的上内边框之间的像素距离
- `offsetLeft`和`offsetTop`属性与包含的元素有关，包含元素的引用保存在`offsetParent`属性中。
- offsetParent属性不一定与parentNode的值相等。
- 例如td元素的offsetParent是作为其祖先元素的table元素。因为table是在DOM层次中距td最近的一个具有大小的元素
- 要想知道某个元素叜页面上的偏移量，将这个元素的offsetLeft和offsetTop与其offsetParent的相同属性相加，如此循环至根元素，就可以得到一个基本准确的值。
```javascript
function getElementLeft(element){
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null){
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualLeft;
}

getElementLeft($('.collapse-button')[0])
1809 实际到页面的距离 
$('.collapse-button')[0].offsetLeft
1639 到父容器（offsetParent）的距离
```

```JavaScript
function getElementTop(element){
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null){
        actualTop += current. offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}
```
- 对于使用表格和内嵌框架布局的页面，由于不同浏览器实现这些元素的方式不同，因此得到的值就不太精确了。一般来说，页面中的所有元素都会被包含在几个<div>元素中，而这些<div>元素的offsetParent又是<body>元素，所以以上两个方法会返回与offsetLeft和offsetTop相同的值
- 所有这些偏移量属性都是只读的，而且每次访问他们都要重新计算，因此应该尽量避免重复计算这些属性，如果需要重复计算使用 **变量** 保存，以提高性能  
    
**客户区大小 clientWidth、clientHeight**
- 元素的客户区大小( `client dimension` )， 指的是元素内容及其内边距所占据的大小不包括border、外边距、滚动条。
```JavaScript
function getViewport(){
    // 检查浏览器是否运行在混杂模式 每次读取都是要重新计算的 
    if( document.compatMode == "BackCompat" ){
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        }
    } else {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
}
```
- 只读而且需要重新计算

**滚动大小**
- 包含滚动内容的元素的大小
- 有些元素（例如html元素），即使没有执行任何代码也能自动地添加滚动条，另外一些元素，则需要通过CSS的`overflow`属性进行设置才能滚动
-   1. scrollHeight 在没有滚动条的情况下，元素内容的总高度
    2. scrollWidth 在没有滚动条的情况下，元素内筒的总宽度
    3. scrollLeft 被隐藏在内容区域左侧的像素数。通过设置这个属性可以改变元素的滚动位置
    4. scrollTop 被隐藏在内容区域上方的像素数。通过这个属性可以改变元素的滚动位置
- `scrollWidth`和`scrollHeight`主要用于确定元素内容的实际大小。例如： 通常认为`<HTML>`元素是在Web浏览器的视口中滚动的元素（IE6之前的版本运行在混杂模式下时是`BODY`元素）。因此，带有垂直滚动条的页面总高度就是`document.documentElement.scrollHeight`
- 对于不包含滚动条的页面而言，`scrollWidth`和`scrrollHeight`与`clientHeight`和`clientWidth`之间的关系并不清晰，在这种情况下，基于`document.documentElement`查看这些属性胡子爱不同浏览器之间发现一些不一致的问题
