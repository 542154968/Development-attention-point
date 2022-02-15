# TS 学习笔记

## 技巧

### 技巧 1 —— 重写 window 属性

```ts
interface MyWindow extends Window {
  _webAnalyst: {
    queueName: string;
    l?: number;
  };
  _wa: WaFuc;
}
```

### 技巧 2 —— 定义一个带属性的函数

```ts
interface WaFuc {
  (...args: string[]): void;
  q: argsType;
}
// 生成的就是
/*
function test(){}
test.q = xxx
*/
```

### 技巧 3 —— 改写类型

```ts
window as unknown as MyWindow;
```

### 技巧 4 —— 获取某个实例/对象等类型,利用 InstanceType

```ts
const childRef: Ref<null | InstanceType<typeof Child>> = ref(null);
```
