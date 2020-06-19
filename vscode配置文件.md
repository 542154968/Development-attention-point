{
  "workbench.colorTheme": "Ysgrifennwr",
  "workbench.iconTheme": "vscode-icons",
  "search.followSymlinks": false,
  "prettier.tabWidth": 2,
  "editor.tabSize": 2,
  // 开启行数提示
  "editor.lineNumbers": "on",
  "editor.quickSuggestions": {
    // 开启自动显示建议
    "other": true,
    "comments": true,
    "strings": true
  },
  // 开启eslint
  "eslint.format.enable": true,
  // 每次保存自动格式化
  // "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  // 格式化.vue中html
  "vetur.format.defaultFormatter.html": "js-beautify-html",
  // 让vue中的js按编辑器自带的ts格式进行格式化
  "vetur.format.defaultFormatter.js": "vscode-typescript",
  "vetur.format.defaultFormatterOptions": {
    "js-beautify-html": {
      "wrap_attributes": "force" //属性强制折行不一定对齐
    }
  },
  "eslint.validate": ["javascript", "vue", "html"],
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "prettier.arrowParens": "avoid",
  "files.associations": {
  
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
