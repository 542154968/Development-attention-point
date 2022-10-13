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

## 复制、粘贴、剪切、格式化、全选、撤销、重做

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

  return {
    copy,
    paste,
    formatDocument,
    redo,
    deleteWord,
    selectAll,
    undo,
    shear,
  };
}
```

## 拖拽
> https://github.com/microsoft/monaco-editor/issues/1050