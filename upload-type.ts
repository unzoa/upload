export type InputDom = HTMLInputElement | null
export type Files = FileList | null
export type FilesArr = File[] | null
export type FilesMessagelist = Array<object>
export interface Callback {
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

export interface Options {
  data?: object // 上传携带参数
  limit?: number // 限制上传个数
  size?: number // 限制上传文件大小
  autoUpload?: boolean // 是否自动上传
  dragAble?: boolean // 是否能退拽
  dragWrapperId?: string // 拽到的容器id
}
