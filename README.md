# upload-calc

>上传单文件、多文件、文件夹（图片/图片预览），接收多参数，多种计算回调。

## 功能

```
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

## 安装

```bash
npm i upload-calc
```

## 使用案例

```js
import upload from 'upload-calc'

const upd = new upload('upd', 'http://xxx/api/file_upload/', {
  data: {
    task_number: 'task_1676530245'
  },
  dragAble: true,
  dragWrapperId: 'dg'
}, {
  failMessageList (list) {
    console.log(list)
  },
  onProgress (progress) {
    console.log(progress)
  },
  beforeDrag () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(0)
      }, 1000);
    })
  }
})
```

```html
<div id="dg" style="width: 500px; height: 500px; background-color: #999;">
  <form>
    <input
      id="upd"
      hidden
      type="file"
      multiple
      @change="upd.change"
      />
    <el-button @click="upd.click()">选择文件</el-button>
    <el-button @click="upd.syncSubmit()">同步上传</el-button>
  </form>
</div>
```
**注意：**调用upd函数必须加(), 如上面upd.click() upd.syncSubmit()


## 使用说明

```js
new upload(inputId, apiUrl, options{}, callback{})
```
## options{}

参数|说明|类型|默认值|可选值
:---|:---|:---|:---|:---
data| 携带参数 | Object | {} | -
limit| 限制个数 | Number | - | -
size| 单文件限制大小 /byte | Number | - | -
autoUpload| 是否自动上传 | Boolean | false | true
dragAble| 拖拽上传 | Boolean | false | true
dragWrapperId | 拽到的容器id | String | - | -


## callback{}

参数|说明|类型|参数格式
:---|:---|:---|:---
filter| 自定义过滤函数 | Function(fileList, originFilterFailList) | -
failMessageList|过滤不能通过的列表|function(failList)|[{file_name: '', message: ''}]
onSwitch|上传队列任务的开始/结束|function(Boolean)| true:开始，false：结束
onTotal| 总量 | function(num) | -
onImgPreview| 上传文件中有图片，则返回图片给预览 |function(img)|-
onSuccess|单个文件上传结束|function(response, fileName)|(ajax_body, '文件名')
onCount| 剩余总量 | function(num) | -
onProgress|单个文件上传进度|function(progressNumber, fileName)|(0~100, '文件名')
onAccessLimitNum|上传文件个数超过限制，并阻止上传|function(Boolean)| false
beforeDrag| 拖拽上传前拦截 | Function(updCallback) | -

## Events

事件名 | 说明
:---|:---
click|input点击事件
change|input文件变化事件
submit|异步提交文件
syncSubmit|同步提交文件
