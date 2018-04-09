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
