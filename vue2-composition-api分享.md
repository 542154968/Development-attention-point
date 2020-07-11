# @vue/composition-api分享

该`API`现已稳定！本文主要是按照官方文档加上自己的理解编写，如若有误，烦请指正！

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

   第二个参数提供一个上下文对象，可以解构。这些API大家都知道就不一一介绍了，`root`是**根组件**的实例。`attrs` 和 `slots` 都是内部组件实例上对应项的代理，可以确保在更新后仍然是最新值。所以可以解构，无需担心后面访问到过期的值。
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

- **immediate等**
  监听路由变化

  ```js
  import { watch } from "@vue/composition-api";
  
  export default {
    setup(props, { refs, root }) {
      const { $route } = root;
  
      watch(
        () => $route,
        (to, from) => {
          console.log(to, from);
        },
        { immediate: true }
      );
  
      return {};
    }
  };
  ```

- **watch是可以停止的**

  ```js
  import { watch } from "@vue/composition-api";
  
  export default {
    setup() {
  
      const stopWatch = watch('xxxx');
      
      // 执行即可停止监听
      // watch返回一个函数 function(){ stop() }
      stopWatch()
  
      return {};
    }
  };
  ```



### watchEffect

立即执行传入的一个函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数。

```js
import { ref, watchEffect } from "@vue/composition-api";
export default {
  setup() {
    const count = ref(0);

    watchEffect(() => console.log(count.value)); // -> 打印出 0

    setTimeout(() => {
      count.value++; // -> 打印出 1
    }, 100);

    return {};
  }
};
```

#### 停止侦听

当 `watchEffect` 在组件的 `setup()` 函数或生命周期钩子被调用时， 侦听器会被链接到该组件的生命周期，并在组件卸载时自动停止。

在一些情况下，也可以显式调用返回值以停止侦听：

```js
const stop = watchEffect(() => {
  /* ... */
})

// 之后
stop()
```

#### 清除副作用

有时副作用函数会执行一些异步的副作用, 这些响应需要在其失效时清除（即完成之前状态已改变了）。所以侦听副作用传入的函数可以接收一个 `onInvalidate` 函数作入参, 用来注册清理失效时的回调。当以下情况发生时，这个**失效回调**会被触发:

- 副作用即将重新执行时
- 侦听器被停止 (如果在 `setup()` 或 生命周期钩子函数中使用了 `watchEffect`, 则在卸载组件时)

```js
watchEffect((onInvalidate) => {
  const token = performAsyncOperation(id.value)
  onInvalidate(() => {
    // id 改变时 或 停止侦听时
    // 取消之前的异步操作
    token.cancel()
  })
})
```

####  副作用刷新时机

Vue 的响应式系统会缓存副作用函数，并异步地刷新它们，这样可以避免同一个 tick 中多个状态改变导致的不必要的重复调用。在核心的具体实现中, 组件的更新函数也是一个被侦听的副作用。当一个用户定义的副作用函数进入队列时, 会在所有的组件更新后执行：

```html
<template>
  <div>{{ count }}</div>
</template>

<script>
	import { ref, watchEffect } from "@vue/composition-api"';
  export default {
    setup() {
      const count = ref(0)

      watchEffect(() => {
        console.log(count.value)
      })

      return {
        count,
      }
    },
  }
</script>
```

在这个例子中：

- `count` 会在初始运行时同步打印出来
- 更改 `count` 时，将在组件**更新后**执行副作用。

请注意，初始化运行是在组件 `mounted` 之前执行的。因此，如果你希望在编写副作用函数时访问 DOM（或模板 ref），请在 `onMounted` 钩子中进行：

```js
onMounted(() => {
  watchEffect(() => {
    // 在这里可以访问到 DOM 或者 template refs
  })
})
```

如果副作用需要同步或在组件更新之前重新运行，我们可以传递一个拥有 `flush` 属性的对象作为选项（默认为 `'post'`）：

```js
// 同步运行
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'sync',
  }
)

// 组件更新前执行
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'pre',
  }
)
```





## 响应式系统工具集

### unref

如果参数是一个 ref 则返回它的 `value`，否则返回参数本身。它是 `val = isRef(val) ? val.value : val` 的语法糖。

```js
function useFoo(x: number | Ref<number>) {
  const unwrapped = unref(x) // unwrapped 一定是 number 类型
}
```



### toRef

`toRef` 可以用来为一个 reactive 对象的属性创建一个 ref。这个 ref 可以被传递并且能够保持响应性。

当您要将一个 prop 中的属性作为 ref 传给组合逻辑函数时，`toRef` 就派上了用场：

```js
export default {
  setup(props) {
    useSomeFeature(toRef(props, 'foo'))
  },
}
```



### toRefs

把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref ，和响应式对象 property 一一对应。

当想要从一个组合逻辑函数中返回响应式对象时，用 `toRefs` 是很有效的，该 API 让消费组件可以 解构 / 扩展（使用 `...` 操作符）返回的对象，并不会丢失响应性：

```js
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2,
  })

  // 对 state 的逻辑操作

  // 返回时将属性都转为 ref
  return toRefs(state)
}

export default {
  setup() {
    // 可以解构，不会丢失响应性
    const { foo, bar } = useFeatureX()

    return {
      foo,
      bar,
    }
  },
}
```



### isRef

检查一个值是否为一个 ref 对象。



## 高级响应式系统 API

###  customRef

`customRef` 用于自定义一个 `ref`，可以显式地控制依赖追踪和触发响应，接受一个工厂函数，两个参数分别是用于追踪的 `track` 与用于触发响应的 `trigger`，并返回一个一个带有 `get` 和 `set` 属性的对象

- 使用自定义 ref 实现带防抖功能的 `v-model` ：

  ```html
  <input v-model="text" />
  ```

  ```js
  function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        },
      }
    })
  }
  
  export default {
    setup() {
      return {
        text: useDebouncedRef('hello'),
      }
    },
  }
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

**在列表中使用**

```vue
<template>
  <div class="about">
    <ul>
      <li v-for="i in 3" ref="liList" :key="i">{{ i }}</li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";

export default {
  setup() {
    const liList = ref([]);

    onMounted(() => console.log(liList.value));

    return { liList };
  }
};
</script>

```

另一种方式

```vue
<template>
  <div class="about">
    <ul>
      <li v-for="i in 3" ref="liList" :key="i">{{ i }}</li>
    </ul>
  </div>
</template>

<script>
import { onMounted } from "@vue/composition-api";

export default {
  setup(props, { refs }) {
    onMounted(() => console.log(refs.liList));

    return {};
  }
};
</script>

```



## 在setup中使用Vue-Router的API


```js
export default {
  setup(props, { root }) {
    
    const { $router, $route } = root;
    console.log($router, $route);
    
    // $router.push(...)
    // $route.path ...
    
  }
};
```



## 在setup中使用$nextTick等

```js
export default {
  setup(props, { root }) {
    
    const { $nextTick } = root;
    console.log($nextTick);
    
  }
};
```





## 在setup中使用Vuex的API

最简化版本的

假如我们的`vuex`是这样定义的

```js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: { count: 0 },
  mutations: {
    ["CHAGNE_COUNT"](state) {
      state.count++;
    }
  },
  actions: {},
  modules: {}
});

```

在`setup`中，我们可以这样使用

```vue
<template>
  <div class="about">
    {{ $store.state.count }}
  </div>
</template>

<script>
export default {
  setup(props, { root }) {
    const { $store } = root;

    $store.commit("CHAGNE_COUNT");

    return {};
  }
};
</script>

```

如何使用`mapState`、`mapGetters`、`mapActions`、`mapMutations`?

直接在`return`的对象中解耦即可

```vue
<template>
  <div class="about" @click="handleAddCount">
    {{ $store.state.count }}
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  setup() {
    return { ...mapMutations({ handleAddCount: "CHAGNE_COUNT" }) };
  }
};
</script>

```



## 组合式API



### 命名规范

我们建议使用 `use` 作为函数名的开头，以表示它是一个组合函数。



### 逻辑的提取与复用

我们创建一个`src/hooks/useMousePosition.js`的文件，内容如下

```js
import { ref, onMounted, onUnmounted } from "@vue/composition-api";

export default function useMousePosition() {
  const x = ref(0);
  const y = ref(0);

  function update(e) {
    x.value = e.pageX;
    y.value = e.pageY;
  }

  onMounted(() => {
    window.addEventListener("mousemove", update);
  });

  onUnmounted(() => {
    window.removeEventListener("mousemove", update);
  });

  return { x, y };
}

```

在单页面文件中使用

```vue
<template>
  <div class="about">当前位置x: {{ x }} - y:{{ y }}</div>
</template>

<script>
import useMousePosition from "../hooks/useMousePosition";
export default {
  setup() {
    const { x, y } = useMousePosition();
    return { x, y };
  }
};
</script>

```

类似的逻辑复用也可以通过诸如 `mixins`、高阶组件或是 (通过作用域插槽实现的) 无渲染组件的模式达成。网上已经有很多解释这些模式的信息了所以我们不再赘述。更高层面的想法是，相比于组合函数，这些模式都有各自的弊端：

- 渲染上下文中暴露的 property 来源不清晰。例如在阅读一个运用了多个 mixin 的模板时，很难看出某个 property 是从哪一个 mixin 中注入的。
- 命名空间冲突。Mixin 之间的 property 和方法可能有冲突，同时高阶组件也可能和预期的 prop 有命名冲突。
- 性能方面，高阶组件和无渲染组件需要额外的有状态的组件实例，从而使得性能有所损耗。

相比而言，组合式 API：

- 暴露给模板的 property 来源十分清晰，因为它们都是被组合逻辑函数返回的值。
- 不存在命名空间冲突，可以通过解构任意命名
- 不再需要仅为逻辑复用而创建的组件实例。






### `setup()` 函数现在只是简单地作为调用所有组合函数的入口

```js
export default {
  setup() {
    // 网络状态
    const { networkState } = useNetworkState()

    // 文件夹状态
    const { folders, currentFolderData } = useCurrentFolderData(networkState)
    const folderNavigation = useFolderNavigation({
      networkState,
      currentFolderData,
    })
    const { favoriteFolders, toggleFavorite } = useFavoriteFolders(
      currentFolderData
    )
    const { showHiddenFolders } = useHiddenFolders()
    const createFolder = useCreateFolder(folderNavigation.openFolder)

    // 当前工作目录
    resetCwdOnLeave()
    const { updateOnCwdChanged } = useCwdUtils()

    // 实用工具
    const { slicePath } = usePathUtils()

    return {
      networkState,
      folders,
      currentFolderData,
      folderNavigation,
      favoriteFolders,
      toggleFavorite,
      showHiddenFolders,
      createFolder,
      updateOnCwdChanged,
      slicePath,
    }
  },
}
```

- 每个逻辑关注点的代码现在都被组合进了一个组合函数。这大大减少了在处理大型组件时不断“跳转”的需要。
- 你还可以根据传递的参数清楚地看到组合函数之间的依赖关系。
- 最后的 return 语句作为单一出口确认暴露给模板的内容。
- 当然这只是举个例子，项目中实际情况随机应变



## 缺失的 API

以下在 Vue 3 新引入的 API ，在本插件中暂不适用：

- `readonly`
- `shallowReadonly`
- `defineAsyncComponent`
- `onRenderTracked`
- `onRenderTriggered`
- `isProxy`
- `isReadonly`
- `isVNode`



## JSX

截稿前，官方提供的`bable`插件仍存在`bug`，不能使用。



## todoList

目录结构

```shell
todoList
|____index.vue
|____hooks
| |____useDataList.js
| |____useLiEvent.js
```

index.vue

```vue
<template>
  <div>
    <div v-if="dataListLoadingStatus">加载中...</div>
    <ul v-else>
      <li v-for="item in dataList" :key="item.id" @click="handleClickLi(item)">
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script>
import useDataList from "./hooks/useDataList";
import useLiEvent from "./hooks/useLiEvent";

export default {
  setup() {
    const { dataList, loadingStatus: dataListLoadingStatus } = useDataList();
    const { handleClick: handleClickLi } = useLiEvent();

    return {
      dataList,
      dataListLoadingStatus,
      handleClickLi
    };
  }
};
</script>

<style></style>

```



useDataList.js

```js
import { ref, onMounted } from "@vue/composition-api";

/**
 * 获取模拟的数据列表
 * @returns {Array} dataList - 数据列表
 * @returns {Boolean} loadingStatus - 请求状态
 */
function useDataList() {
  /**
   * 加载状态
   */
  const loadingStatus = ref(false);
  /**
   * 数据列表
   */
  const dataList = ref([]);

  /**
   * 模拟获取数据列表
   */
  function getDataList() {
    changeLoadingStatus(true);

    setTimeout(() => {
      dataList.value = [
        { id: 1, text: "小红" },
        { id: 2, text: "小明" },
        { id: 3, text: "小黄" }
      ];

      changeLoadingStatus(false);
    }, 3000);
  }

  /**
   * 更改loading状态
   * @param {boolean} status 状态值
   * @returns {void}
   */
  function changeLoadingStatus(status) {
    loadingStatus.value = status;
  }

  onMounted(() => getDataList());

  return {
    dataList,
    loadingStatus
  };
}

export default useDataList;

```



UseLiEvent.js

```js
/**
 * 点击li的回调
 */
function useLiEvent() {
  /**
   * 点击之后的回调
   * @param {HTMLElement} item
   */
  function handleClick(item) {
    console.log(item);
  }

  return {
    handleClick
  };
}

export default useLiEvent;

```





## 鸣谢

- [@vue/composition-api](https://github.com/vuejs/composition-api/blob/master/README.zh-CN.md)

- [组合式 API 征求意见稿](https://composition-api.vuejs.org/zh/#%E6%A6%82%E8%BF%B0)


