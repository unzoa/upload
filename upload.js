/**
 * @author yuhongyu
 * @time 2023-02-17
 */

export default class Upload {
  filterSuccessList = []
  count = -1
  fileKey = 'file'

  inputDom = null
  webkitdirectory = false // 文件夹
  multiple = false // 多文件
  accept = '' // 接收格式

  constructor( id, url, options = {}, cb = {} ) {
    this.id = id
    this.url = url
    this.options = options
    this.cb = cb

    this.init()
    this.options.dragAble && this.dragger()
  }

  init() {
    this.inputDom = document.getElementById(this.id)
    const {
      webkitdirectory,
      multiple,
      accept,
    } = this.inputDom?.attributes

    this.webkitdirectory = webkitdirectory?.value === 'true' || webkitdirectory?.value === ''
    this.multiple = multiple?.value === 'true' || multiple?.value === ''
    this.accept = accept?.value
  }

  click() {
    this.inputDom?.click()
  }

  change(e) {
    const files = e.target.files
    this.transFiles(files)
  }

  transFiles(files) {
    if (!this.accessLimitNum(files)) return false

    // 不通过 size和格式 过滤的文件
    let failMessageList = []
    const filesFilter = files && Array.from(files).filter(file => {
      const sizeBol = this.options.size
        ? file.size <= this.options.size
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

      !(sizeBol && acceptBol) && failMessageList.push({
        file_name: file.name,
        message: failText
      })

      return sizeBol && acceptBol
    })

    // 更多过滤
    const filterSuccessList = this.cb.filter ? this.cb.filter(filesFilter, failMessageList) : filesFilter

    // 通知：不通过过滤的文件
    if (failMessageList.length) this.cb.failMessageList && this.cb.failMessageList(failMessageList)

    if (filterSuccessList?.length === 0) {
      this.cb.onSwitch && this.cb.onSwitch(false)
      return false
    }

    // 准备进入上传列队
    this.filterSuccessList = filterSuccessList
    this.count = filterSuccessList?.length || 0
    this.cb.onTotal && this.cb.onTotal(this.count)

    // 用于页面展示选中的图片
    const that = this
    function fileToBase64(filelist) {
      filelist &&
      filelist
        .filter(file => {
          return file.type.includes('image')
        })
        .forEach((file) => {
          var fr = new FileReader()
          fr.readAsDataURL(file)
          fr.onloadend = function (e) {
            that.cb.onImgPreview && that.cb.onImgPreview(e.target.result)
          }
        })
    }

    fileToBase64(this.filterSuccessList);

    // 清空form
    this.inputDom?.parentElement.reset()

    // 或开始上传
    this.options.autoUpload && this.submit()
  }

  accessLimitNum(files) {
    // 无限制
    if (this.options.limit === undefined) return true

    // 上传文件数量 大于 限制数量
    if (files?.length > this.options.limit) {
      this.cb.onAccessLimitNum && this.cb.onAccessLimitNum(false)
      return false
    }

    return true
  }

  // 异步任务
  submit() {
    // 通知：队列开始
    this.cb.onSwitch && this.cb.onSwitch(true)

    // 开始异步上传任务
    this.filterSuccessList &&
      this.filterSuccessList.forEach(file => {
        const fd = new FormData()
        fd.append(this.fileKey, file)

        Object.entries(this.options?.data || {}).forEach(([k, v]) => {
          fd.append(k, JSON.stringify(v))
        })

        this.uploadEvent(fd)
      })
  }

  // 同步任务列队：单个任务完成后，才进行下一个任务
  async syncSubmit() {
    const filterSuccessList = this.filterSuccessList || []
    const file = filterSuccessList[0]

    if (!file) return false

    const fd = new FormData()
    fd.append(this.fileKey, file)

    Object.entries(this.options.data || {}).forEach(val => {
      fd.append(val[0], val[1])
    })

    await this.uploadEvent(fd)

    filterSuccessList.shift()

    this.syncSubmit()
  }

  fetchEvent (formData) {
    return fetch(this.url, {
      method: "POST",
      body: formData
    })
      .then(fetchProgress({
        // implement onProgress method
        onProgress(progress) {
          console.log(progress)
        },
      }))
  }

  uploadEvent (formData) {
    const that = this
    const fileName = formData && formData.get(this.fileKey).name

    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest()
      request.open('POST', that.url)

      request.upload.addEventListener('progress', function (e) {
        let percent_completed = (e.loaded / e.total) * 100
        that.cb.onProgress && that.cb.onProgress(percent_completed)
      })

      // request finished event
      request.addEventListener('load', function (e) {
        // HTTP status message (200, 404 etc)
        // console.log(request.status);

        // request.response holds response from the server
        // console.log(request.response);

        // 通知: 完成一个
        that.cb.onSuccess && that.cb.onSuccess(request.response, fileName)

        that.count--
        that.cb.onCount && that.cb.onCount(that.count)

        // 通知：全部完成
        that.count === 0 && that.cb.onSwitch && that.cb.onSwitch(false)

        resolve(request.response)
      })

      // send POST request to server
      request.send(formData)
    })
  }

  dragger () {
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


    const dom = document.querySelector('#' + this.options.dragWrapperId)
    if (!dom) return

    dom.addEventListener('dragover', (e) => {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    })

    dom.addEventListener('drop', (e) => {
      e.stopPropagation()
      e.preventDefault()

      const files = e.dataTransfer.files

      if (this.accessLimitNum(files) === false) return false

      this.cb.beforeDrag
        ? this.cb.beforeDrag().then( () => this.transFiles(files) )
        : this.transFiles(files)
    })
  }
}
