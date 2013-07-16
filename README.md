## 介绍
gazira 源于arale 提供一套成熟稳健快速的前端开发方案

## 安装
需要环境 nodejs, npm, git
* git clone https://github.com/caolvchong/gazira.git
* npm install

## 目录结构
<pre>
|-docs 文档
|-demo 例子
|-js 源码
    |-app 业务逻辑代码
    |-lib gazira库
|-public 公共资源
    |-js 部署代码
        |-dist 部署业务逻辑代码
        |-jquery
        |-seajs
        |-config.js seajs配置文件
    |-theme 样式
|-test 测试用例
|-Gruntfile.js 包含'jshint', 'qunit', 'transport', 'concat', 'uglify', 'clean', 'watch'等任务
|-package.json
</pre>

## 开发过程
* /js 目录为js开发目录，分为 工具库lib/ 和 业务逻辑app/
* 工具库的代码必须在 /test目录下写单元测试，目录结构和/js目录下的结构一一对应
* 提交代码前，请确保jshint，qunit通过后再提交