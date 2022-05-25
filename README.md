# upload

> 上传文件，图片，图片预览，多文件，文件夹
> 利用input type=“file”上传，依赖axios模块

## 安装

```bash
npm i @unzoa/upload
```

## 功能

```
- 默认插槽
- 拖拽上传
- 点击上传
- 自动上传
  - 上传拦截
- 文件个数
  * 单文件
  * 多文件
- 文件夹
- 过滤
  - 上传个数
  - size
  - 格式
  - 自定义过滤
- 额外参数
- 任务队列状态监听
- 上传进度监听
- 失败队列监听
- 图片预览
```

## 使用

> [sample.vue](https://github.com/unzoa/upload/blob/main/Sample.vue)

```js
  click: function, // 执行input type=“file”的点击
  // 使用案例：
  this.$refs.yourRef.click()

  submit: function, // 开始执行上传事件
  // 使用案例：
  this.$refs.yourRef.submit()

  syncSubmit: function, // 开始执行同步上传事件
  // 使用案例：
  this.$refs.yourRef.syncSubmit()
```

## props

参数|说明|类型|默认值|可选值
:---|:---|:---|:---|:---
url| 用了axios，需要在拦截中配置 | String | - | apiName/fullpath
autoUpload| 是否自动上传 | Boolean | false | true
data| 携带参数 | Object | {} | -
limit| 限制个数 | Number | - | -
size| 单文件限制大小 /byte | Number | - | -
accept| 文件格式，可多个 | String | - | -
filter| 自定义过滤函数 | Function | - | -
webkitdirectory| 上传文件夹 | Boolean | false | true
multiple| 上传多文件 | Boolean | false | true
drag| 拖拽上传 | Boolean | false | true
beforeDrag| 拖拽上传前拦截 | Function(updCallback) | - | -
fileKey| 上传文件的key | String | file | -



## $emit

参数|说明|类型|参数格式
:---|:---|:---|:---
on-switch|上传任务开关|function(Boolean)| true:开始，false：结束
on-progress|单个文件上传进度|function(progressNumber, fileName)|(0~100, '文件名')
on-success|单个文件上传结束|function(response, fileName)|(ajax_body, '文件名')
on-limit-error|上传文件个数超过限制，并阻止上传|function(Boolean)| false
fail-list|过滤不能通过的列表|function(failList)|[{file_name: '', message: ''}]
on-img-preview| 上传文件中有图片，则返回图片给预览 |function(img)|-
on-total| 总量 | function(num) | -
on-count| 剩余总量 | function(num) | -
