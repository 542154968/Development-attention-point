# @vue/composition-api分享

该`API`现已稳定！

💡 当迁移到 Vue 3 时，只需简单的将 `@vue/composition-api` 替换成 `vue` 即可。你现有的代码几乎无需进行额外的改动。



## 动机与目的

- 更好的逻辑复用与代码组织
  1. 随着功能的增长，复杂组件的代码变得越来越难以阅读和理解。
  2. 目前缺少一种简洁且低成本的机制来提取和重用多个组件之间的逻辑。
- 更好的类型推导
  `Vue` 当前的` API` 在集成 `TypeScript` 时遇到了不小的麻烦，其主要原因是 `Vue` 依靠一个简单的` this` 上下文来暴露` property`，我们现在使用` this` 的方式是比较微妙的。（比如 `methods` 选项下的函数的 `this` 是指向组件实例的，而不是这个 `methods` 对象）。
- `mixins` 带来的问题
  1. 渲染上下文中暴露的 `property` 来源不清晰。例如在阅读一个运用了多个 `mixin` 的模板时，很难看出某个 `property` 是从哪一个 `mixin` 中注入的。
  2. 命名空间冲突。`Mixin` 之间的 `property` 和方法可能有冲突，同时高阶组件也可能和预期的 `prop` 有命名冲突。
  3. 性能方面，高阶组件和无渲染组件需要额外的有状态的组件实例，从而使得性能有所损耗。



## 安装与使用
- `vue create app`创建`vue 2.x`项目或现有`vue 2.x`项目

- npm / yarn
  1. 安装
      ```shell
      npm install @vue/composition-api
      # or
      yarn add @vue/composition-api
      ```
      
  2. 使用

      ```javascript
      import Vue from 'vue'
      import VueCompositionAPI from '@vue/composition-api'
      
      Vue.use(VueCompositionAPI)
      
      // 在组件中
      import { ref, reactive } from '@vue/composition-api'
      ```

      

- cdn

  1. 安装

     ```html
     <!-- 在 Vue 之后引入 @vue/composition-api ，插件将会自动完成安装。 -->
     
     <script src="https://cdn.jsdelivr.net/npm/vue@2.6"></script>
     <script src="https://cdn.jsdelivr.net/npm/@vue/composition-api@1.0.0-beta.3"></script>
     
     <!-- @vue/composition-api 将会暴露在全局变量 window.VueCompositionAPI 中。 -->
     ```

  2. 使用

     1. 方式1

     ```javascript
     const { ref, reactive } = window.VueCompositionAPI;
     ```

     2. 方式2
   在`vue.config.js`中，配置`externals`，之后与`npm`的使用方式相同
        只不或引入是`import VueCompositionAPI from "VueCompositionAPI";   `
     
     ```javascript
     module.exports = {
       configureWebpack: config => {
         config.externals = {
           vue: "Vue",
           VueCompositionAPI: "VueCompositionAPI"
         };
       }
     };
     ```



## 与现有的 API 配合

组合式 API 完全可以和现有的基于选项的 API 配合使用。

- 组合式 API 会在 2.x 的选项 (`data`、`computed` 和 `methods`) 之前解析，并且不能提前访问这些选项中定义的 property。
- `setup()` 函数返回的 property 将会被暴露给 `this`。它们在 2.x 的选项中可以访问到。



## setup

`setup` 函数是一个新的组件选项。作为在组件内使用 Composition API 的入口点。

- **调用时机**
  创建组件实例，然后初始化 `props` ，紧接着就调用`setup` 函数。从生命周期钩子的视角来看，它会在 `beforeCreate` 钩子之前被调用

- **模板中使用**
  如果 `setup` 返回一个对象，则对象的属性将会被合并到组件模板的渲染上下文

- **参数**

  该函数接收 `props` 作为其第一个参数， 不能结构props，会失去响应式。

  ```js
  export default {
    props: {
      name: String,
    },
    setup(props) {
      console.log(props.name)
    },
  }
  ```

   第二个参数提供一个上下文对象，可以解构。这些API大家都知道就不一一介绍了，`root`是组件的实例。`attrs` 和 `slots` 都是内部组件实例上对应项的代理，可以确保在更新后仍然是最新值。所以可以解构，无需担心后面访问到过期的值。
  ![image-20200710173426685](/Users/liqiankun/Library/Application Support/typora-user-images/image-20200710173426685.png)

## API介绍



### reactive

先看一个简单的单页面文件

```vue
<template>
  <div @click="increment">{{ state.count }}</div>
</template>

<script>
import { reactive } from "@vue/composition-api";

export default {
  setup() {
    // 依赖收集
    const state = reactive({
      count: 0
    });

    /**
     * 增加state.count的值
     */
    function increment() {
      state.count++;
    }
		
    return {
      state,
      increment
    };
  }
};
</script>
```

`reactive` 几乎等价于 2.x 中现有的 `Vue.observable()` API，且为了避免与` RxJS` 中的 observable 混淆而做了重命名。这里返回的 `state` 是一个所有 Vue 用户都应该熟悉的响应式对象。

**注意**

1. `reactive()` 会返回一个**修改过的**原始的对象，此行为与 Vue 2 中的 `Vue.observable` 一致，而在`vue3`中，`reactive()` 会返回一个新的的代理对象。

2. 使用组合函数时必须始终保持对这个所返回对象的引用以保持响应性。这个对象不能被解构或展开，可以使用`toRefs`Api去解决这个问题

   ```js
   function useMousePosition() {
     const pos = reactive({
       x: 0,
       y: 0,
     })
   
     // ...
     return toRefs(pos)
   }
   
   // x & y 现在是 ref 形式了!
   const { x, y } = useMousePosition()
   ```

### ref

还是一个简单的单页面文件，功能与`reactive`的例子一样

```vue
<template>
  <div @click="increment">{{ count }}</div>
</template>

<script>
import { ref } from "@vue/composition-api";

export default {
  setup() {
    // 依赖收集
    const count = ref(0);

    /**
     * 增加count的值
     */
    function increment() {
      count.value++;
    }

    return {
      count,
      increment
    };
  }
};
</script>
```

看出来差别了吗？`count`的增加有个`value`！

- 为什么会有这个`value`？
  由于` JavaScript` 中基础类型是**值传递**而非引用传递，一个响应式的值一旦作为 `property` 被赋值或从一个函数返回，而失去了响应性之后，也就失去了用途。为了确保始终可以读取到最新的计算结果，我们需要将这个值上包裹到一个对象中再返回。另外我们同样需要劫持对这个对象 `.value` property 的读/写操作，现在我们可以通过引用来传递计算值，也不需要担心其响应式特性会丢失了。当然代价就是：为了获取最新的值，我们每次都需要写 `.value`。

- 那为什么在`template`模板中，又不需要写`.value`了呢？
  在渲染过程中，Vue 会直接使用其内部的值，也就是说在模板中你可以把 `{{ count.value }}` 直接写为 `{{ count }}` 。

**注意**

1. 不要使用数组直接存取`ref`对象

   ```javascript
   const state = reactive({
     list: [ref(0)],
   })
   // 不会自动展开, 须使用 `.value`
   state.list[0].value === 0 // true
   
   state.list.push(ref(1))
   // 不会自动展开, 须使用 `.value`
   state.list[1].value === 1 // true
   ```

2. 不要在数组中使用含有 `ref` 的普通对象

   ```javascript
   const a = reactive({
     count: ref(0),
   })
   const b = reactive({
     list: [a],
   })
   // 自动展开
   b.list[0].count === 0 // true
   
   b.list.push(
     reactive({
       count: ref(1),
     })
   )
   // 自动展开
   b.list[1].count === 1; // true
   ```

3. 在数组中，应该总是将 `ref` 存放到 `reactive` 对象中

   ```javascript
   const a = reactive({
     count: ref(0),
   })
   const b = reactive({
     list: [a],
   })
   // 自动展开
   b.list[0].count === 0 // true
   
   b.list.push(
     reactive({
       count: ref(1),
     })
   )
   // 自动展开
   b.list[1].count === 1; // true
   ```

以上的场景应该很少会遇到，但是也不能不排除，一般来说在业务中，这样使用数组就行了。

- 使用`ref`定义数组
  
  ```javascript
  const list = ref([]);
  list.value.push('xxx');
  list.value[3] = 'xxx';
  ```
  
- 使用`reactive`定义数组

  ```javascript
  const state = reactive({
    list: []
  });
  state.list.push('xxx');
  state.list[3] = 'xxx';
  ```



### Ref VS Reactive

1. 就像你在普通 JavaScript 中区别声明基础类型变量与对象变量时一样区别使用 `ref` 和 `reactive`。我们推荐你在此风格下结合 IDE 使用类型系统。
2. 所有的地方都用 `reactive`，然后记得在组合函数返回响应式对象时使用 `toRefs`。这降低了一些关于 ref 的心智负担，但并不意味着你不需要熟悉这个概念。

笼统的来讲就是两种风格，看个人爱好。



### computed

传入一个 getter 函数，返回一个默认不可手动修改的 ref 对象。

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // 错误！
```

或者传入一个拥有 `get` 和 `set` 函数的对象，创建一个可手动修改的计算状态。

```js
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1
  },
})

plusOne.value = 1
console.log(count.value) // 0
```



### watch

`watch` API 完全等效于 2.x `this.$watch` （以及 `watch` 中相应的选项）。`watch` 需要侦听特定的数据源，并在回调函数中执行副作用。默认情况是懒执行的，也就是说仅在侦听的源变更时才执行回调。

- **侦听单个数据源**

  侦听器的数据源可以是一个拥有返回值的 getter 函数，也可以是 ref：

  ```js
  // 侦听一个 getter
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  
  // 直接侦听一个 ref
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

- **侦听多个数据源**

  `watcher` 也可以使用数组来同时侦听多个源：

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```







## 生命周期

可以直接导入 `onXXX` 一族的函数来注册生命周期钩子

```js
import {
  onMounted,
  onUpdated,
  onUnmounted
} from "@vue/composition-api";

export default {
  beforeRouteLeave(to, from, next) {
    //可以获取this
    //路由跳转，不适用此组件时触发
    console.log("beforeRouteLeave", this);
    next();
  },
  setup() {
    onMounted(() => console.log("onMounted"));

    onUpdated(() => console.log("onUpdated"));

    onUnmounted(() => console.log("onUnmounted"));

    return {};
  }
};

```






**与 2.x 版本生命周期相对应的组合式 API**

- `beforeCreate` -> 使用 `setup()`
- `created` -> 使用 `setup()`
- `beforeMount` -> `onBeforeMount`
- `mounted` -> `onMounted`
- `beforeUpdate` -> `onBeforeUpdate`
- `updated` -> `onUpdated`
- `beforeDestroy` -> `onBeforeUnmount`
- `destroyed` -> `onUnmounted`
- `errorCaptured` -> `onErrorCaptured`





## 依赖注入

- `provide` 和 `inject` 提供依赖注入，功能类似 2.x 的 `provide/inject`。两者都只能在当前活动组件实例的 `setup()` 中调用。

- `inject` 接受一个可选的的默认值作为第二个参数。如果未提供默认值，并且在 provide 上下文中未找到该属性，则 `inject` 返回 `undefined`。

**父组件**


```vue
<template>
  Dom结构
</template>

<script>
import { provide, ref } from "@vue/composition-api";
export default {
  setup() {
    // ref注入响应式对象
    provide("globalMsg", ref("给我的子孙后代捎句话"));
  }
};
</script>
```

**孙组件**

```vue
<template>
  Dom结构
</template>

<script>
import { inject } from "@vue/composition-api";
export default {
  setup() {
    // 默认值只有父级没有定义 provide("globalMsg") 的时候才有效，定义了没传值也不会显示默认值
    const globMsg = inject("globalMsg", '默认消息');
  }
};
</script>
```



## 模板Refs

 在 `Virtual DOM patch` 算法中，如果一个` VNode` 的 `ref` 对应一个渲染上下文中的 `ref`，则该 `VNode` 对应的元素或组件实例将被分配给该 `ref`。 这是在 `Virtual DOM` 的 `mount / patch` 过程中执行的，因此模板 `ref` 仅在渲染初始化后才能访问。

`ref` 被用在模板中时和其他 `ref` 一样：都是响应式的，并可以传递进组合函数（或从其中返回）。

```vue
<template>
  <div class="about">
    <h1 ref="h1Dom">This is an about page</h1>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
export default {
  setup() {
    const h1Dom = ref(null);

    onMounted(() => console.log(h1Dom.value)); // 打印出了DOM

    return {
      h1Dom
    };
  }
};
</script>
```

也可以通过以下这种方式获得`refs`引用，早期的`composition-api`只能通过这种方式获得引用~

```vue
<template>
  <div class="about">
    <h1 ref="h1Dom">This is an about page</h1>
  </div>
</template>

<script>
import { onMounted } from "@vue/composition-api";
export default {
  setup(props, { refs }) {

    onMounted(() => console.log(refs.h1Dom)); // 打印出了DOM

  }
};
</script>
```



## 缺失的 API

以下在 Vue 3 新引入的 API ，在本插件中暂不适用：

- `readonly`
- `shallowReadonly`
- `defineAsyncComponent`
- `onRenderTracked`
- `onRenderTriggered`
- `customRef`
- `isProxy`
- `isReadonly`
- `isVNode`
