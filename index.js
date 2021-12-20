import upload from './upload.vue'

upload.install = vue => {
  vue.components(upload.name, upload)
}

export default upload
