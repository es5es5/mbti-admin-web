<template>
  <div>
    <div class="action_wrap">
      <button type="button" class="btn action" @click="setAction('고객정보 활용동의')">고객정보 활용동의</button>
      <button type="button" class="btn action" @click="setAction('보장분석')">보장분석 불러오기</button>
      <button type="button" class="btn action" @click="setAction('상품설명 자료 보내기')">상품설명 자료 보내기</button>
      <button type="button" class="btn action" @click="setAction('모바일 청약')">모바일 청약</button>
      <button type="button" class="btn action" @click="setAction('file')">기타 파일 보내기</button>
    </div>
    <transition name="fade" mode="out-in">
      <div class="preview_wrap" v-if="preview.type === '고객정보 활용동의'" key="고객정보 활용동의">
        <p class="previewTitle">{{ preview.title }}</p>
        <div class="preview">
          <div class="container">
            <div class="box">
              <img v-if="preview.img !== ''" :src="require(`@/assets/images/conference/preview/${preview.img}.png`)" class="previewImg back" alt="고객정보활용동의">
              <transition name="fade" mode="out-in">
                <!-- <img v-if="isSign" :src="require(`@/assets/images/conference/preview/sign.png`)" class="front" alt="sign"> -->
                <span class="front-name" alt="name">{{ consult.customerInfo != null ? consult.customerInfo.customerName : '' }}<br>{{ mixinUser.nameBase }}</span>
              </transition>
              <transition name="fade" mode="out-in">
                <img v-if="isSign" :src="signImg" class="front" alt="sign">
              </transition>
            </div>
          </div>
        </div>
        <button type="button" class="btn small action" @click="setSign">새로고침</button>
        <button type="button" class="btn primary small action" @click="openModalPushBohumClinicFiles">보내기</button>
      </div>
      <div class="preview_wrap" v-else-if="preview.type === '보장분석'" key="보장분석">
        <!-- <p class="previewTitle">{{ preview.title }}</p> -->
        <div class="search_wrap">
          <input type="text" placeholder="고객명" v-model="clientSerachForm.name">
          <input type="text" placeholder="휴대전화" v-model="clientSerachForm.phone">
          <button type="button" class="btn small search" @click="getClient">검색</button>
        </div>
        <div class="table_wrap table-hover">
          <table>
            <caption>보장분석 리스트</caption>
            <colgroup>
              <col style="width: 10rem;">
              <col style="width: 10rem;">
              <col style="width: 10rem;">
              <col style="width: 10rem;">
            </colgroup>
            <thead>
              <tr>
                <th scope="col"><span>고객명</span></th>
                <th scope="col"><span>연락처</span></th>
                <th scope="col"><span>분석일</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in clientList" :key="index">
                <td><span>{{ item.name }}</span></td>
                <td><span>{{ item.phone }}</span></td>
                <td><span>{{ item.analysisDate }}</span></td>
              </tr>
              <no-data-message :list="clientList" :colspan="3"></no-data-message>
            </tbody>
          </table>
        </div>
        <input type="file" multiple accept=".pdf" name="file" id="upload_file" ref="file" @change="uploadFile">
        <button type="button" class="btn primary small action" @click="postFileInfo('PROPOSAL')" :disabled="fileList.length < 1">보내기</button>
        <div class="attach_files" v-for="(item, index) in fileList" :key="index">
          <a href="#" class="file_name" @click="downloadFile(item.fileId)" :key="index">{{ item.fileName }}</a>
        </div>
      </div>
      <div class="preview_wrap" v-else-if="preview.type === '상품설명 자료 보내기'" key="상품설명 자료 보내기">
        <input type="file" multiple accept=".pdf" name="file" id="upload_file" ref="file" @change="uploadFile">
        <button type="button" class="btn primary small action" @click="postFileInfo('PRODUCT')" :disabled="fileList.length < 1">보내기</button>
        <div class="attach_files" v-for="(item, index) in fileList" :key="index">
          <a href="#" class="file_name" @click="downloadFile(item.fileId)" :key="index">{{ item.fileName }}</a>
        </div>
      </div>
      <div class="preview_wrap" v-else-if="preview.type === '모바일 청약'" key="모바일 청약">
        <div class="search_wrap">
          <label for="보험사">보험사</label>
          <select name="보험사" id="보험사" v-model="mobile.previewImg">
            <option value="현대해상_모바일">현대해상</option>
            <option value="메리츠화재_모바일">메리츠화재</option>
          </select>
        </div>
        <img v-if="mobile.previewImg !== ''" :src="require(`@/assets/images/conference/preview/${mobile.previewImg}.png`)" class="previewImg" alt="고객정보활용동의" @click="openImage">
      </div>
      <div class="preview_wrap" v-else-if="preview.type === 'file'" key="file" >
        <input type="file" multiple accept=".pdf" name="file" id="upload_file" ref="file" @change="uploadFile">
        <button type="button" class="btn primary small action" @click="postFileInfo('ETC')" :disabled="fileList.length < 1">보내기</button>
        <div class="attach_files" v-for="(item, index) in fileList" :key="index">
          <a href="#" class="file_name" @click="downloadFile(item.fileId)" :key="index">{{ item.fileName }}</a>
        </div>
      </div>
      <div v-else key="else"></div>
    </transition>
    <ModalPushBohumClinicFiles :customerId="this.consult.customerId"/>
  </div>
</template>

<script>
import ModalPushBohumClinicFiles from './ModalPushBohumClinicFiles'
export default {
  name: 'ConsultAction',
  created () {
    this.getRoom()
  },
  computed: {
    _detailId () { return this.$route.params.detailId }
  },
  components: {
    ModalPushBohumClinicFiles
  },
  data () {
    return {
      signImg: '',
      isSign: false,
      preview: {
        type: '',
        title: '',
        img: ''
      },
      clientSerachForm: {
        name: '',
        phone: ''
      },
      consult: [],
      fileList: [],
      fileForm: {
        consultId: '',
        customerId: '',
        category: '',
        uploadFileIds: ''
      },
      mobile: {
        previewImg: ''
      },
      clientList: []
    }
  },
  methods: {
    // Preview
    setAction (type) {
      this.preview = {
        type,
        title: type,
        img: '고객정보 활용동의',
      }
      this.fileForm.uploadFileIds = ''
      switch (type) {
        case 'file':
          this.getFileList('ETC')
          break
        case '상품설명 자료 보내기':
          this.getFileList('PRODUCT')
          break
        case '보장분석':
          this.getFileList('PROPOSAL')
          break
        case '고객정보 활용동의':
          this.getFileList('SIGN')
          break
      }
    },
    setSign () {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-consult/files`
      const apiSerarch = `?sort=createtime,desc&customerId=${this.consult.customerId}&consultId=${this._detailId}&category=SIGN`
      this.$http({
        method: 'get',
        url: apiURL + apiSerarch
      }).then(result => {
        const file = result.data.contents
        if (file.length > 0) {
          this.signImg = `${this.ENV_OTCSUPPORT}/video-consult/files/${file[0].fileId}`
          this.isSign = true
          // this.$nextTick(() => { this.isSign = !this.isSign })
        }
      }).catch(error => {
        console.error(error)
      })
      // this.signImg = 'https://lh3.googleusercontent.com/proxy/ycXh4hIwB6pIzP2tqtoglyO1R7Op0Mjlpn3xT_lSqO45vGhHTzOdi9iglRxpQemTaYYYETWYTzjQLEiHoQoUB0U4fsKWU6i_i_gvP27Roiby01eqInFvhuOjbBpRcTBgF3IVUiZvrDfxO1TDsFQNhToVMfF7C7y-geWYr87C6j3U2MninD3jLAeMl1bkGRYRcx4oclW3_HSkzSFoNrlcN7TSUTO2VYFtegRDK_uz7tFxZg86obdhxY9LPisy-xJp0WaBHwnD3EuA8OXui1nSwd-Pzmrrf1PcIZuHyZpsoN0'
      // this.$nextTick(() => { this.isSign = !this.isSign })
    },
    getRoom (status) {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-consult/${this._detailId}`
      this.$http({
        method: 'get',
        url: apiURL
      }).then(result => {
        this.consult = result.data.contents
        this.clientSerachForm.name = this.consult.customerInfo.customerName
        this.clientSerachForm.phone = this.consult.customerInfo.phone
      }).catch(error => {
        console.error(error)
      })
    },
    getClient (category) {
      const apiURL = `${this.ENV_OTCSUPPORT}/customer/client`
      const apiSerarch = `?sort=writetime,desc&name=${this.clientSerachForm.name}&phone=${this.clientSerachForm.phone}`
      this.$http({
        method: 'get',
        url: apiURL + apiSerarch
      }).then(result => {
        this.clientList = result.data.contents
      }).catch(error => {
        console.error(error)
      })
    },
    getFileList (category) {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-consult/files`
      const apiSerarch = `?sort=createtime,desc&customerId=${this.consult.customerId}&consultId=${this._detailId}&category=${category}`
      this.$http({
        method: 'get',
        url: apiURL + apiSerarch
      }).then(result => {
        this.fileList = result.data.contents
      }).catch(error => {
        console.error(error)
      })
    },
    getSignImage () {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-consult/files`
      const apiSerarch = `?sort=createtime,desc&customerId=${this.consult.customerId}&consultId=&category=SIGN`
      this.$http({
        method: 'get',
        url: apiURL + apiSerarch
      }).then(result => {
        this.signImg = `${this.ENV_OTCSUPPORT}/video-consult/files/${this.result.data.contents[0].fileId}`
      }).catch(error => {
        console.error(error)
      })
    },
    uploadFile () {
      const data = new FormData()
      const files = this.$refs.file.files
      data.append('consultId', this.consult.id)
      data.append('customer', this.consult.customerId)
      data.append('category', 'ETC')
      const selectFileNames = []

      for (const i in files) {
        if (typeof files[i] === 'object') {
          data.append('uploadFiles', files[i])

          selectFileNames.push(files[i].name)
        }
      }
      this.$Progress.start()
      const apiURL = `${this.ENV_OTCSUPPORT}/video-consult/files-upload`
      this.$http({
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        url: apiURL,
        data: data
      }).then(result => {
        this.$Progress.finish()
        const savedFile = result.data.contents[0]
        this.fileList.push(savedFile)
        this.fileForm.uploadFileIds += `${savedFile.fileId},`
      }).catch(error => {
        console.error(error)
        this.$Progress.fail()
      })
    },
    downloadFile (fileId) {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-consult/files/${fileId}`
      window.open(apiURL)
    },
    postFileInfo (value) {
      const data = this.fileForm
      data.consultId = this.consult.id
      data.customerId = this.consult.customerId
      data.category = value
      const apiURL = `${this.ENV_OTCSUPPORT}/video-consult/files`
      this.$http({
        method: 'post',
        url: apiURL,
        data: data
      }).then(result => {
        this.openModalPushBohumClinicFiles()
        this.$Progress.finish()
      }).catch(error => {
        console.error(error)
        this.$Progress.fail()
      })
    },
    openModalPushBohumClinicFiles () {
      this.$modal.show('ModalPushBohumClinicFiles')
    }
  }
}
</script>

<style lang="scss" scoped>
.search_wrap {
  input { margin-right: 4px; }
  .search { margin: 0 0 0 4px; }
}

.action_wrap {
  text-align: center;
  padding: 0 10%;

  .action {
    width: 100%;
    margin: 6px auto;
  }
}

.preview_wrap {
  padding: 4px 8px;
  text-align: center;

  .previewTitle {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .container {
    * {
      margin: 0;
      padding: 0;
    }

    .box {
      position: relative;
      float: left;
      width: 354px;
      height: 504px;

      .previewImg {
        width: 354px;
        height: 504px;
      }
    }
  }

  .previewImg { width: 100%; }

  .front {
    position: absolute;
    width: 50px;
    height: 20px;
    bottom: 25px;
    right: 10px;
    z-index: 0;
  }

  .front-name {
    position: absolute;
    // width: 12px;
    // height: 20px;
    font-size: 3px;
    bottom: 17px;
    right: 248px;
  }

  .back {
    position: absolute;
    top: 0;
    left: 0;
  }

  .action {
    margin: 10px 4px;
  }
}
</style>
