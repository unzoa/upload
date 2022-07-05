<template>
  <div
    ref="updWrapper"
    class="upload-container"
    style="width: 100%; height: 100%;"
    >
    <form ref="formContainer">
      <input
        ref="fileInput"
        type="file"
        hidden
        :webkitdirectory="webkitdirectory"
        :multiple="multiple"
        @change="change($event)">
    </form>

    <slot></slot>
  </div>
</template>

<script>
/* eslint-disable */
import Axios from 'axios'

function upload (Interface, formData, config) {
  return new Promise(resolve => {
    Axios.post(Interface, formData, config)
      .then(res => resolve(res) )
      .catch(res => resolve(res) )
  })
}

export default {
  name: 'Upload',

  props: {
    // 必须
    url: String,

    // 自动上传
    autoUpload: Boolean,

    data: {
      type: Object,
      default: function () {
        return {}
      }
    },

    // 过滤
    limit: Number,
    size: Number,
    accept: String,
    // 更多过滤
    filter: Function,

    // 多文件 or 文件夹
    webkitdirectory: Boolean,
    multiple: Boolean,

    // 拖拽
    drag: Boolean,
    beforeDrag: Function,

    // 如果api接收文件的key不是file
    fileKey: { type: String, default: 'file'  },
  },

  data () {
    return {
      filterSuccessList: [],
      count: -1
    }
  },

  methods: {
    click () {
      this.$refs.fileInput.click()
    },

    change (e) {
      const files = e.target.files
      this.transFiles(files)
    },

    /**
     * 判断是否通过数量限制
     * return
     * true 允许进行下一步
     * false 超过限制
     * */
    passLimitNum (files) {
      // 未限制
      if (!this.limit) return true

      // 根据限制数量进行判断
      if (files.length > this.limit) {
        this.$emit('on-limit-error')
        return false
      } else {
        return true
      }
    },

    dragger () {
      if (!this.drag) return false

      document.addEventListener('drop', function (e) { // 拖离
        e.preventDefault()
      })
      document.addEventListener('dragleave', function (e) { // 拖后放
        e.preventDefault()
      })
      document.addEventListener('dragenter', function (e) { // 拖进
        e.preventDefault()
      })
      document.addEventListener('dragover', function (e) { // 拖来拖去
        e.preventDefault()
      })


      const dom = this.$refs.updWrapper

      dom.addEventListener('dragover', e => {
        e.stopPropagation()
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      })

      dom.addEventListener('drop', e => {
        e.stopPropagation()
        e.preventDefault()

        const files = Array.from(e.dataTransfer.files)

        if (this.passLimitNum(files) === false) return false

        this.beforeDrag
          ? this.beforeDrag( () => this.transFiles(files) )
          : this.transFiles(files)
      })
    },

    transFiles (files) {
      if (this.passLimitNum(files) === false) return false


      // 不通过 size和格式 过滤的文件
      let failList = []
      const filesFilter = Array.from(files).filter(file => {
        const sizeBol = this.size
          ? file.size <= this.size
          : true

        const acceptBol = this.accept
          ? this.accept.includes((file.name.split('.').reverse()[0]).toLowerCase())
          : true

        let failText = ''
        switch (true) {
          case !(sizeBol || acceptBol): failText = '文件过大且格式不正确'; break
          case !sizeBol: failText = '文件过大'; break
          case !acceptBol: failText = '文件格式不正确'; break
        }

        !(sizeBol && acceptBol) && failList.push({
          file_name: file.name,
          message: failText
        })

        return sizeBol && acceptBol
      })

      // 更多过滤
      const filterSuccessList = this.filter ? this.filter(filesFilter, failList) : filesFilter

      // 通知：不通过过滤的文件
      if (failList.length) this.$emit('fail-list', failList)

      if (filterSuccessList.length === 0) {
        this.$emit('on-switch', false)
        return false
      }


      // 准备进入上传列队
      this.filterSuccessList = filterSuccessList
      this.count = filterSuccessList.length
      this.$emit('on-total', this.count)


      // 用于页面展示选中的图片
      const that = this
      function fileToBase64 (filelist) {
        filelist
          .filter(file => {
            return file.type.includes('image')
          })
          .forEach(file => {
            var fr = new FileReader()
            fr.readAsDataURL(file)
            fr.onloadend = function (e) {
              that.$emit('on-img-preview', e.target.result)
            }
          })
      }
      fileToBase64(this.filterSuccessList)


      // 清空form
      this.$refs.formContainer.reset()


      // 或开始上传
      this.autoUpload && this.submit()
    },

    // 异步任务
    submit () {
      // 通知：队列开始
      this.$emit('on-switch', true)


      // 开始异步上传任务
      this.filterSuccessList.forEach(file => {
        const fd = new FormData()
        fd.append(this.fileKey, file)

        Object.entries(this.data).forEach(([k, v]) => {
          fd.append(k, JSON.stringify(v))
        })

        this.uploadAct(fd)
      })
    },

    // 同步任务列队：单个任务完成后，才进行下一个任务
    async syncSubmit () {
      const file = this.filterSuccessList[0]

      if (!file) return false

      const fd = new FormData()
      fd.append(this.fileKey, file)

      Object.entries(this.data).forEach(val => {
        fd.append(val[0], val[1])
      })

      await this.uploadAct(fd)

      this.filterSuccessList.shift()

      this.syncSubmit()
    },

    async uploadAct (formData) {
      const fileName = formData.get(this.fileKey).name

      const config = {
        onUploadProgress: progressEvent => {
          const complete = (progressEvent.loaded / progressEvent.total * 100 | 0)

          // 通知: 完成进度
          this.$emit('on-progress', Number(complete), fileName)
        }
      }

      return upload(this.url, formData, config)
        .then(res => {
          // 通知: 完成一个
          this.$emit('on-success', res, fileName)

          this.count--
          this.$emit('on-count', this.count)

          // 通知：全部完成
          this.count === 0 && this.$emit('on-switch', false)
        })
    }
  },

  mounted () {
    this.dragger()
  }
}
</script>
