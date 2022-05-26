# vue-upload-calc

> 上传文件 图片 图片预览 多文件 文件夹。接收多参数，多种计算回调，**不提供UI显示**，需要您根据回调自行发挥。这里准备一个案例 [sample.vue](https://github.com/unzoa/upload/blob/main/Sample.vue)

## 安装

```bash
npm i vue-upload-calc
```

## 使用

> **不提供UI显示**，需要您根据回调自行发挥。案例 [sample.vue](https://github.com/unzoa/upload/blob/main/Sample.vue)

```js
  <Upload ref="updComponentRef" url="" props emit>
    // 您自己的UI，也可以不在插槽这里写

    // 执行input type=“file”的点击
    button this.$refs.updComponentRef.click()

    // 执行异步上传
    button this.$refs.updComponentRef.submit()

    // 执行同步上传
    button this.$refs.updComponentRef.syncSubmit()
  </Upload>
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

## props

参数|说明|类型|默认值|可选值
:---|:---|:---|:---|:---
url| 用了axios，如您有拦截，则自行配置 | String | - | apiName/fullpath
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
on-switch|上传队列任务的开始/结束|function(Boolean)| true:开始，false：结束
on-progress|单个文件上传进度|function(progressNumber, fileName)|(0~100, '文件名')
on-success|单个文件上传结束|function(response, fileName)|(ajax_body, '文件名')
on-limit-error|上传文件个数超过限制，并阻止上传|function(Boolean)| false
fail-list|过滤不能通过的列表|function(failList)|[{file_name: '', message: ''}]
on-img-preview| 上传文件中有图片，则返回图片给预览 |function(img)|-
on-total| 总量 | function(num) | -
on-count| 剩余总量 | function(num) | -
