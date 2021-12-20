<template>
  <div class="upload-container" ref="updWrapper">
    <form ref="formContainer">
      <input
        ref="fileInput"
        type="file"
        hidden
        :webkitdirectory="webkitdirectory"
        :multiple="multiple"
        @change="change($event)">

      <slot></slot>
    </form>
  </div>
</template>

<script>
/* eslint-disable */

import Axios from 'axios'
export default {
  name: 'upload-component',

  props: {
    url: String,
    size: Number,
    limitNum: Number,
    accept: String,

    webkitdirectory: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },

    drag: { type: Boolean, default: false },
    beforeDrag: {
      type: Function
    },

    filter: {
      type: Function
    },

    fileKey: { default: 'file', type: String },

    data: {
      type: Object,
      default: function () {
        return {}
      }
    },

    autoUpload: { type: Boolean, default: false }
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
      let files = e.target.files

      if (files.length) {
        this.$emit('btnDisabled', true)
      }

      if (files.length === 1) {
        this.$emit('single-file', files[0])
      }

      this.transFiles(files)
    },

    limitNumEvent (files) {
      if (files.length > this.limitNum) {
        this.$emit('limitError')
        return false
      }
    },

    transFiles (files) {
      // 当传了限制文件数量 limitNum 才执行limitNumEvent
      if (this.limitNum && this.limitNumEvent(files) === false) {
        return false
      }

      let failFiles = [] // 不通过size和格式过滤的文件
      files = Array.from(files).filter(file => {
        let sizeBol = this.size ? file.size <= this.size : true
        let acceptBol = this.accept ? this.accept.includes((file.name.split('.').reverse()[0]).toLowerCase()) : true

        let failText = ''
        switch (true) {
          case !(sizeBol || acceptBol):
            failText = '文件过大且格式不正确'
            break

          case !sizeBol: failText = '文件过大'; break
          case !acceptBol: failText = '文件格式不正确'; break
        }
        !(sizeBol && acceptBol) && failFiles.push([file.name, failText])
        return sizeBol && acceptBol
      })
      if (failFiles.length) {
        this.$emit(
          'failFiles',
          failFiles.length > 1
            ? failFiles
            : {
              message: failFiles[0].join(': '),
              status: 400
            }
        )
      }

      this.filterSuccessList = this.filter ? this.filter(files) : files

      this.count = this.filterSuccessList.length

      if (this.count === 0) {
        this.$emit('end', true)
        return false
      }

      // 用于页面展示选中的图片
      this.fileToBase64(this.filterSuccessList)

      // 清空form
      this.$refs.formContainer.reset()

      // 或开始上传
      this.autoUpload && this.submit()
    },

    fileToBase64 (file) {
      let that = this
      file.forEach(res => {
        var fr = new FileReader()
        fr.readAsDataURL(res)
        fr.onloadend = function (e) {
          that.$emit('showImg', e.target.result)
        }
      })
    },

    submit () {
      this.$emit('start', true)

      this.count = this.filterSuccessList.length

      this.filterSuccessList.forEach((file, index) => {
        let fd = new FormData()
        fd.append(this.fileKey, file)

        Object.entries(this.data).forEach(val => {
          fd.append(val[0], val[1])
        })

        this.uploadAct(fd)
      })
    },

    async syncSubmit () {
      let file = this.filterSuccessList[0]

      if (!file) {
        return false
      }

      let fd = new FormData()
      fd.append(this.fileKey, file)

      Object.entries(this.data).forEach(val => {
        fd.append(val[0], val[1])
      })

      await this.uploadAct(fd)

      this.filterSuccessList.shift()

      this.syncSubmit()
    },

    uploadAct (formData) {
      let fileName = formData.get(this.fileKey).name

      let config = {
        onUploadProgress: progressEvent => {
          let complete = (progressEvent.loaded / progressEvent.total * 100 | 0)

          this.$emit('progress', Number(complete), fileName) // 通知父组件完成进度
        }
      }

      return this.upload(this.url, formData, config)
        .then(res => {
          this.$emit('uploadFinnal', res, fileName) // 通知父组件完成

          this.count--
          this.count === 0 && this.$emit('end', true)
        })
    },

    upload (Interface, formData, config) {
      return new Promise(resolve => {
        Axios.post(Interface, formData, config)
          .then(res => {
            resolve(res)
          }).catch(res => {
            resolve(res)
          })
      })
    },

    dragger () {
      if (this.drag) {
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

        let dom = this.$refs.updWrapper // document.querySelector('.upload-container')

        dom.addEventListener('dragover', e => {
          e.stopPropagation()
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
        })

        dom.addEventListener('drop', e => {
          e.stopPropagation()
          e.preventDefault()

          var files = Array.from(e.dataTransfer.files)

          if (this.limitNum && this.limitNumEvent(files) === false) {
            return false
          }

          this.beforeDrag
            ? this.beforeDrag(() => {
              this.transFiles(files)
            })
            : this.transFiles(files)
        })
      }
    }
  },

  mounted () {
    this.dragger()
  }
}
</script>
