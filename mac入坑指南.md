# 工具



## Nvm

### 激活nvm

source ~/.bash_profile 用这个激活nvm

### 给nvm设置淘宝镜像

```shell
# 指定 nvm 的镜像需要在环境配置中增加 NVM_NODEJS_ORG_MIRROR ,我这里的 terminal shell 是 oh-my-zsh 所以编辑环境文件：
vim ~/.zshrc
# 在最后增加：
export NVM_NODEJS_ORG_MIRROR=http://npm.taobao.org/mirrors/node
# 然后使环境生效：
source ~/.zshrc
# 如果怀疑环境配置文件是否生效可以将改配置打印出来
echo $NVM_NODEJS_ORG_MIRROR
```

### 每次启动都需要重新激活nvm

[Mac 每次都要执行source ~/.bash_profile 配置的环境变量才生效](https://blog.csdn.net/science_Lee/article/details/79214127)



## Terminla 终端

### 使用代理

1. Clash 复制终端命令 粘贴到终端里 就可以使用代理了



## Iterm2 && oh-my-zsh



1. [Mac 终端 oh-my-zsh 配置](https://www.jianshu.com/p/64344229778a)

2. 显示所有文件

   ```javascript
   // Command+Shift+. 可以显示隐藏文件、文件夹，再按一次，恢复隐藏；
   // finder下使用Command+Shift+G 可以前往任何文件夹，包括隐藏文件夹。
   ```

3. [iterm2美化](https://blog.biezhi.me/2018/11/build-a-beautiful-mac-terminal-environment.html )



### 出现的问题

1. 安装字体的时候后不成功，原因是`caskroom/fonts was moved. Tap homebrew/cask-fonts instead. `使用以下代替

   ```shell
   # 新的仓库地址
   brew tap homebrew/cask-fonts
   # 安装字体
   brew cask install font-hack-nerd-font
   ```

2. 当前主题设置 https://github.com/Powerlevel9k/powerlevel9k



