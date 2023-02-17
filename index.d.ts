/// <reference lib="es2015" />

export = UploadCalc

declare class UploadCalc {
  filterSuccessList: UploadCalc.FilesArr
  count: number
  fileKey: string

  inputDom: UploadCalc.InputDom
  webkitdirectory: boolean // 文件夹
  multiple: boolean // 多文件
  accept: string // 接收格式

  constructor(
    public id: string,
    public url?: string,
    public options: UploadCalc.Options,
    public cb: UploadCalc.Callback
  ) { }

  click (): void
  change(e: Event): void
  submit (): void
  syncSubmit (): void

  init (): void
  transFiles(files: UploadCalc.Files): void
  accessLimitNum(files: UploadCalc.Files): boolean
  uploadEvent (formData: FormData): Promise<Response>
  dragger (): void
}

declare namespace UploadCalc {
  type InputDom = HTMLInputElement | null
  type Files = FileList | null
  type FilesArr = File[] | null
  type FilesMessagelist = Array<object>
  interface Callback {
    filter?: (fileList: FilesArr, originFilterFailList: FilesMessagelist) => FilesArr // 更多过滤条件处理

    failMessageList?: (failMessageList: FilesMessagelist) => void // 失败文件数组
    onSwitch?: (isSwitch: boolean) => void // 是否开始任务
    onTotal?: (count: number) => void // 总上传数量
    onImgPreview?: (file: any) => void // 上传图片预览
    onSuccess?: (response: object, fileName: string) => void
    onCount?: (count: number) => void
    onProgress?: (progress: number) => void
    onAccessLimitNum?: (isAccess: boolean) => void
    beforeDrag?: () => Promise<number> // 拖拽进来后，在处理文件前
  }

  interface Options {
    data?: object // 上传携带参数
    limit?: number // 限制上传个数
    size?: number // 限制上传文件大小
    autoUpload?: boolean // 是否自动上传
    dragAble?: boolean // 是否能退拽
    dragWrapperId?: string // 拽到的容器id
  }
}
