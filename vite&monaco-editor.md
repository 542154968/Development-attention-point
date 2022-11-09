# 介绍

1. 本文主要是自己使用`vite`配合`monaco-editor`的相关问题以及解决方案的记载。

## 中文化

```vue
<template>
  <div ref="divRef" style="height: 500px; width: 500px"></div>
</template>

<script lang="ts" setup>
// 主要是这个loader的作用
import loader from "@monaco-editor/loader";
import * as monaco from "monaco-editor";

const divRef = ref();

loader.config({ monaco });
loader.config({
  "vs/nls": {
    // availableLanguages: { "*": "de" },
    availableLanguages: { "*": "zh-cn" },
  },
});

loader.init().then(monacoInstance => {
  // 初始化编辑器
  monacoInstance.editor.create(divRef.value, {
    value: "321313123",
  });
});
</script>

<style lang="scss"></style>
```

## 复制、粘贴、剪切、格式化、全选、撤销、重做、底部添加、指定位置添加

```ts
import { getClipboardText } from "@/assets/ts/utils";
import * as monaco from "monaco-editor";

// editor.getActions() 获取所有的快捷操作
enum EDITOR_ACTION {
  // 格式化文档
  FORMAT = "editor.action.formatDocument",
  COPY = "editor.action.clipboardCopyWithSyntaxHighlightingAction",
  PASTE = "editor.action.clipboardPasteAction",
  DELETE = "deleteInsideWord",
  // 撤销
  UNDO = "undo",
  // 反撤销
  REDO = "redo",
}

export default function useQuickAction(
  getEditor: () => monaco.editor.IStandaloneCodeEditor
) {
  /**
   * 格式化文档
   */
  function formatDocument() {
    getEditor()?.getAction(EDITOR_ACTION.FORMAT).run();
  }

  /**
   * 复制
   */
  function copy() {
    getEditor()?.getAction(EDITOR_ACTION.COPY).run();
  }

  /**
   * 剪切
   */
  function shear() {
    copy();
    deleteWord();
  }

  /**
   * 粘贴
   */
  async function paste() {
    const text = await getClipboardText();
    const editor = getEditor();
    const selection = editor?.getSelection();
    selection &&
      editor.executeEdits("", [
        {
          range: new monaco.Range(
            selection.endLineNumber,
            selection.endColumn,
            selection.endLineNumber,
            selection.endColumn
          ),
          text,
        },
      ]);
  }

  /**
   * 删除
   */
  function deleteWord() {
    getEditor()?.getAction(EDITOR_ACTION.DELETE).run();
  }

  /**
   * 全选
   */
  function selectAll() {
    getEditor()?.setSelection(new monaco.Range(0, 0, Infinity, Infinity));
  }

  /**
   * 重做
   */
  function redo() {
    getEditor()?.trigger("", EDITOR_ACTION.REDO, "");
  }

  /**
   * 撤销
   */
  function undo() {
    getEditor()?.trigger("", EDITOR_ACTION.UNDO, "");
  }

  /**
   * 底部塞入文本
   */
  function append(text: string) {
    const editor = getEditor();
    const model = editor.getModel();
    if (model) {
      editor.pushUndoStop();
      editor.executeEdits("", [
        {
          range: new monaco.Range(Infinity, Infinity, Infinity, Infinity),
          text,
        },
      ]);
      editor.revealLine(Infinity);
      editor.focus();
      editor.pushUndoStop();
    }
  }

  /**
   * 在光标位置插入一段文本并聚焦
   * @param insertText
   * @returns
   */
  function insertTextToMousePosition(
    insertText: string,
    position?: monaco.Position
  ) {
    const editor = getEditor();
    editor.focus();
    if (!position) {
      position = editor.getPosition() || undefined;
    }
    // 2 插入
    if (!position) {
      return;
    }
    editor.pushUndoStop();
    editor.executeEdits(null, [
      {
        range: new monaco.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        text: insertText,
      },
    ]);

    const arr = insertText.split("\n");
    const lastKey = arr.length - 1;
    const curLineNum = position.lineNumber + lastKey;
    // 3 设置新的光标位置
    editor.setPosition(
      new monaco.Position(curLineNum, arr[lastKey].length + 1)
    );
    // 聚焦
    editor.focus();
    // 滚动到当前行
    editor.revealLine(curLineNum);
    editor.pushUndoStop();
  }

  return {
    copy,
    paste,
    formatDocument,
    redo,
    deleteWord,
    selectAll,
    undo,
    shear,
    append,
    insertTextToMousePosition,
  };
}
```

## 拖拽生成代码

> https://github.com/microsoft/monaco-editor/issues/1050

1. 开启`dropIntoEditor:{enabled: true}`，默认是开启的 可以看到触发拖拽的时候会有一条虚线
2. 默认会获取`dataTransfer`中的`text/plain` 如果你的业务逻辑中不需要调用接口 直接赋值文字 就可以直接在 dragstart 的时候塞入数据到`dataTranser`中就行了
3. 如果你数据是异步获取的你可以让`dragstart`中`dataTransfer`不传递任何数据，然后`monaco`的`editor`实例监听`onDropIntoEditor`方法 这个方法的回调参数`drop`会返回`DragEvent`和`Position`两个类型的参数，`Position`就是当前虚线光标的位置，拿到位置数据后，就可以塞入了，拿到位置对象后，调用上面的`insertTextToMousePosition`方法，就能塞入文本了
4. 我使用的版本中，`monaco.editor.IStandaloneCodeEditor`没有`onDropIntoEditor`类型，所以我自己扩展了一下
5. `pushUndoStop`这个方法相当于增加撤销的停止 相当于撤销的间隔

```ts
type Editor = monaco.editor.IStandaloneCodeEditor & {
  onDropIntoEditor(arg0: (drop: DropIntoEditor) => void): void;
};
```

### demo

1. monaco-editor.vue

```vue
<script lang="ts" setup>
/**  ...  */

type Editor = monaco.editor.IStandaloneCodeEditor & {
  onDropIntoEditor(arg0: (drop: DropIntoEditor) => void): void;
};

let editor: Editor;
editor = monacoInstance.editor.create(el, {});

// 监听drop
editor.onDropIntoEditor(drop => {
  emit("dropIntoEditor", drop);
});
/**  ...  */
</script>
```
