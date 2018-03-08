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
