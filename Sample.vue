<template>
  <div class="upload-sample">
    <div class="upd-wrapper">
      <Upload
        ref="test"
        url="https://xxxx.com/api/upload/"
        drag
        autoUpload
        multiple
        webkitdirectory
        :data="{
          a: 1
        }"
        :limit="10"
        :filter="more_filter"
        @on-progress="progress"
        @fail-list="failFiles"
        @on-limit-error="limitError"
        @on-img-preview="showImg"
        @on-switch="switchEvent"
        @on-total="totalNum"
        @on-count="countNum"
        >
        <button @click="$refs.test.click()">upload</button> |
        <button @click="$refs.test.submit()">sub</button>
      </Upload>
    </div>

    <div class="__aa">
      <p>loading: {{loading}}</p>

      <hr>
      <p>total:{{total}} / count:{{count}}</p>
      <p>总进度：{{ count !== '' ? (total - count) / total * 100 : 0 }}%</p>

      <hr>
      <p>单个文件（受是否是同步任务影响）</p>
      <p>file-name:{{fileName}}</p>
      <p>progress:{{progressNum}}</p>

      <hr>
      <p>fail-list</p>
      <ul>
        <li
          v-for="(i,j) in failList"
          :key="j">
          {{i}}
          </li>
      </ul>

      <hr>
      <p>img-preview</p>
      <ul>
        <li
          v-for="(i,j) in imgs"
          :key="j"
          style="display: inline;">
          <img :src="i" style="width: 50px; height: 50px; object-fit: cover;" />
          </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Upload from 'Upload.vue'

export default {
  name: 'upload-sample',

  components: {
    Upload
  },

  data () {
    return {
      loading: false,
      fileName: '',
      progressNum: 0,
      failList: [],
      imgs: [],
      total: '',
      count: ''
    }
  },

  mounted () {
  },

  methods: {
    progress (progressNumber, fileName) {
      this.fileName = fileName
      this.progressNum = progressNumber
    },

    failFiles (failList) {
      this.failList = failList
    },

    showImg (img) {
      this.imgs.push(img)
    },

    switchEvent (bol) {
      this.loading = bol
    },

    limitError () {
      alert('文件数量过多')
    },

    totalNum (num) {
      this.total = num
    },
    countNum (num) {
      this.count = num
    },

    more_filter (list, failList) {
      return list

      /* eslint-disable */
      const dispatchList = []

      list.forEach(file => {
        if (file.name.includes('md')) { // 测试过滤名字包含md的
          dispatchList.push(file)
        } else {
          failList.push({
            file_name: file.name,
            message: '过滤不合格！'
          })
        }
      })

      return dispatchList
    }
  }
}
</script>

<style scoped lang="scss">
  .upload-sample {
    position: relative;

    .upd-wrapper {
      height: 200px;
      border:1px solid #eee;

      > div {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
