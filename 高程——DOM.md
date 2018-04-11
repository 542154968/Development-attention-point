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
