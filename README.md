# upload

> 上传文件，图片，图片预览，多文件，文件夹
> 利用input type=“file”上传，依赖axios模块

## 使用

```vue
<upload
  ref="yourRef"
  url="api" <!-- 用到了axios拦截，这里直接写api.js中配置的key-->
  multiple
  :data="{
    hah: 'asd',
    name: nameWhat
  }">
  <template v-slot:upd-wrapper>
    <button @click.prevent="$refs.yourRef.click()">upload</button> |
    <button @click.prevent="$refs.yourRef.submit()">sub</button>
  </template>
</upload>

```

## 功能
- 具名插槽
- 文件个数
  * 单文件
  * 多文件
- 文件夹
- 过滤
- api
- 参数
- 自动上传


### props

```js
  url: String, // api, 组件用到了axios，会统一走axios拦截
  autoUpload: Boolean, // 是否自动上传，默认false
  webkitdirectory: webkitdirectory, // 文件夹，默认false
  multiple: multiple, // 多文件，默认false
  size: Number, // 文件最大上传限制
  limitNum: Number, // 限制文件上传个数
  accept: String, // 文件上传格式，多个格式可以以任意形式拼接
  filter: Function(files), // 除了size和格式的更多父组件过滤，return过滤的文件列表
  fileKey: String, //上传时文件的字段，默认为file

  drag: Boolean, // 默认为false，是否允许
  beforeDrag: Function(callback) // 拦截drop动作执行,callback：Function，是执行上传动作的函数
```

### $emit

```js
  // failFiles---
  // size和accept过滤不能通过的列表, 格式为 [[fileName, errorText], []]
  // 单个文件失败时候传回Array中第一条的转字符串：’文件名：失败原因‘
  failFiles: function(Array),

  limitError: function(), // 上传文件个数超过限制，并阻止上传

  progress: function(progressNumber, fileName), // 单个文件上传进度
  uploadFinnal: function(response, fileName), // 单个文件上传结束
  start: function(Boolean), // 开始执行上传任务
  end: function(Boolean), // 上传任务结束
  'single-file': function(file) // 上传单个文件时候立即返回文件相关内容
```

### 事件

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


### 执行过程

- 触发input点击事件, 出现电脑文件管理器，选择文件后确定
- 触发input的change事件，得到上传的文件数组
- 过滤，得到目标数组
- 选择性执行上传，此时文件存在于浏览器内存中
  + 延时上传
    * 填写表单，提交
  + 直接上传


### 文件列表展示

- 失败列表
  + 过滤失败 failFiles
  + 上传失败 单个文件上传后 在uploadFinnal中 (response, fileName)

- 上传进度
  + 单个文件上传后 在uploadFinnal中 (response, fileName) 过滤成功和失败


### 故障排查

- 组件插槽内容 button标签点击事件 需要阻止冒泡 @click.prevent="submit"
