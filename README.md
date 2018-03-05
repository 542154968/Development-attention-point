# 工作中遇到的坑和思考

**有不同意见欢迎指正交流**

> **2018-03-05**

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

**3. 做好异常判断**
- 善用 `try{} catch(){}`
- 数据类型验证
- 后端返回的数据类型验证，不要觉得后端每次返回的类型都是对的。比如有时候空的时候，后端没返回 ` "" `,返回的是 `null`，你的页面就可能报错。
- 传入公共函数中的参数
- 等等……

**4. 写完界面和逻辑一定要在常用浏览器中跑一下看看是否有兼容性问题**
