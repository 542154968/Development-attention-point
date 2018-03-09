# 0 - n 的随机数
```javascript
    Math.floor(Math.random() * (n + 1));
```
# Max - Min 的随机数
```javascript
// 一、min ≤ r ≤ max
function RandomNumBoth(Min,Max){
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}

// 二、min ≤ r < max
function RandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.floor(Rand * Range); //舍去
    return num;
}

// 三、min < r ≤ max
function RandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    if(Math.round(Rand * Range)==0){       
        return Min + 1;
    }
    var num = Min + Math.round(Rand * Range);
    return num;
}

// 四、min < r < max 
function RandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    if( Math.round(Rand * Range)==0 ){
        return Min + 1;
    } else if(Math.round(Rand * Max)==Max){
        index++;
        return Max - 1;
    }else{
        var num = Min + Math.round(Rand * Range) - 1;
        return num;
    }
 }
```

# 数组打乱排序
```javascript
function shuffle(array) {
    var _array = array.concat();
    for (var i = _array.length; i--; ) {
        // 产生 0 - i 的随机数
        var j = Math.floor(Math.random() * (i + 1));
        var temp = _array[i];
        _array[i] = _array[j];
        _array[j] = temp;
    }
    return _array;
}
```
# 深拷贝
```javascript
var extend = (function() { var isObjFunc = function(name) { var toString = Object.prototype.toString return function() { return toString.call(arguments[0]) === '[object ' + name + ']' } } var isObject = isObjFunc('Object'), isArray = isObjFunc('Array'), isBoolean = isObjFunc('Boolean') return function extend() { var index = 0,isDeep = false,obj,copy,destination,source,i if(isBoolean(arguments[0])) { index = 1 isDeep = arguments[0] } for(i = arguments.length - 1;i>index;i--) { destination = arguments[i - 1] source = arguments[i] if(isObject(source) || isArray(source)) { console.log(source) for(var property in source) { obj = source[property] if(isDeep && ( isObject(obj) || isArray(obj) ) ) { copy = isObject(obj) ? {} : [] var extended = extend(isDeep,copy,obj) destination[property] = extended }else { destination[property] = source[property] } } } else { destination = source } } return destination } })()


作者：文兴
链接：https://www.jianshu.com/p/04b1d88dabf2
來源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

#浅拷贝
```javascript
var extend = function(destination,source) {
    for(var property in source) {
        destination[property] = source[property]
    }
    return destination
}
```
