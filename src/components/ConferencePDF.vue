<template>
  <div id="pdf">
    <div class="nopdf_wrap" v-if="fileList.length === 0">
      <img src="@/assets/images/conference/nopdf.png" alt="nopdf" class="nopdfImg">
      <p class="nopdfText">회의자료가 없습니다.</p>
    </div>
    <div class="pdf_wrap">
      <pdf
        :src="pdf.url"
        :page="pdf.currentPage"
        @num-pages="pdf.pageCount = $event"
        @page-loaded="pdf.currentPage = $event"
      ></pdf>
      <div class="page_wrap leader" v-if="_leaderRole">
        <img src="@/assets/images/conference/pdf/left.svg" class="pdf-arrow" alt="left" @click="setPage('prev')">
        <input type="text" v-model="pdf.currentPage" class="pdf-current" @input="setPage('input')">
        <span class="pdf-total" @click="getPresentationState"><span class="pdf-separator">/</span>{{ pdf.pageCount }}</span>
        <img src="@/assets/images/conference/pdf/right.svg" class="pdf-arrow" alt="right" @click="setPage('next')">
      </div>
      <div class="page_wrap participant" v-else>
        <span class="pdf-total">{{ pdf.currentPage }} / {{ pdf.pageCount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

export default {
  name: 'ConferencePDF',
  created () {
    this.getRoom()
  },
  mounted () {
    this.connect()
  },
  computed: {
    _fileId () { return this.fileId },
    _detailId () { return this.detailId },
    _leaderRole () { return this.leaderRole },
  },
  watch: {
    _fileId () {
      this.selectPDFFileId = this.fileId
      this.setPDFUrl()
    }
  },
  props: {
    fileId: {
      type: String,
      required: true,
      default: () => ''
    },
    detailId: {
      type: String,
      required: true,
      default: () => ''
    },
    leaderRole: {
      type: Boolean,
      required: true,
      default: () => false
    }
  },
  data () {
    return {
      selectPDFFileId: '',
      detailInfo: {},
      fileList: [],
      pdf: {
        url: '',
        pageCount: 1,
        currentPage: 1,
        fileId: ''
      },
      participantsCurrentPDFPages: [],
      socket: null,
      stompClient: null,
      connected: false,
    }
  },
  methods: {
    getRoom () {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-conference/detail/${this._detailId}`
      this.$http({
        method: 'get',
        url: apiURL
      }).then(result => {
        this.detailInfo = result.data.contents
        this.attendeeList = result.data.contents.attendeeInfoList
        this.fileList = result.data.contents.fileAtteachList
        if (this.fileList.length > 0) {
          this.selectPDFFileId = this.fileList[0].fileId
          Object.assign(this.pdf, {
            url: `${this.ENV_OTCSUPPORT}/video-conference/attachFile/download/${this.selectPDFFileId}`,
            fileId: this.selectPDFFileId
          })
        }
      }).catch(error => {
        console.error(error)
      })
    },
    getPresentationState () {
      this.pdf.slideId = '3d5defaa-e015-48e8-822e-ee574cc3091b'
      this.pdf.slideUrl = '//api.dev.inplat.kr/pines-otc-manage/api/video-conference/attachFile/download/3d5defaa-e015-48e8-822e-ee574cc3091b'
      this.pdf.currentPage = 3
      // const apiURL = `${this.ENV_PRESENTATION_REST}/presentations/state?roomId=${this._detailId}`

      // this.$http({
      //   method: 'get',
      //   url: apiURL
      // }).then(result => {
      //   console.log('getPresentationState', result.data)
      //   this.pdf.slideId = result.data.slideId
      //   this.pdf.slideUrl = result.data.slideUrl
      //   this.pdf.currentPage = result.data.slidePage
      //   console.log(this.pdf.currentPage)
      //   this.connect()
      // }).catch(error => {
      //   console.error(error)
      // })
    },
    connect () {
      this.socket = new SockJS(this.ENV_PRESENTATION_WS)
      this.stompClient = Stomp.over(this.socket)
      const stompClientAck = Stomp.over(new SockJS(this.ENV_PRESENTATION_WS))

      // 발표자
      if (this._leaderRole) {
        stompClientAck.connect(
          {}, // headers
          frame => {
            console.log('/slides/ack frame', frame)

            stompClientAck.subscribe(
              `/topic/rooms/${this._detailId}/slides/ack`,
              res => {
                const resBody = JSON.parse(res.body)
                if (!this.participantsCurrentPDFPages.some(item => item.userId === resBody.userId)) {
                  this.participantsCurrentPDFPages.push(JSON.parse(res.body))
                } else {
                  this.participantsCurrentPDFPages.forEach((item, index) => {
                    if (item.userId === resBody.userId) {
                      Object.assign(this.participantsCurrentPDFPages[index], resBody)
                    }
                  })
                }
              }
            )
          },
          error => {
            console.error(error)
            setTimeout(() => {
              this.connect()
            }, 3000)
          }
        )

        this.stompClient.connect(
          {}, // headers
          frame => {
            this.connected = true
            console.log('/slides frame', frame)

            this.stompClient.subscribe(
              `/topic/rooms/${this._detailId}/slides`,
              res => {
                console.debug('/slides JSON.parse(res.body)', JSON.parse(res.body))

                // if (this.roomCheck(res.body.roomId)) {
                this.setPDFSocket(JSON.parse(res.body))

                if (res.body) {
                  const data = {
                    roomId: this._detailId,
                    userId: `${this.mixinUser.nameBase} ${this.mixinUser.employeeNumber}`,
                    slideId: this.pdf.fileId,
                    slideUrl: this.pdf.url,
                    slidePage: this.pdf.currentPage
                  }
                  console.log(data)
                  this.stompClient.send(
                    '/api/slides/ack',
                    JSON.stringify(data)
                  )
                }
                // }
                // this.participantsCurrentPDFPages.push(res.body)
              }
            )
          },
          error => {
            this.connected = false
            console.error(error)
            setTimeout(() => {
              this.connect()
            }, 1000)
          }
        )
      } else {
        this.stompClient.connect(
          {}, // headers
          frame => {
            this.connected = true
            console.log('frame', frame)

            this.stompClient.subscribe(
              `/topic/rooms/${this._detailId}/slides`,
              res => {
                console.debug('/slides JSON.parse(res.body)', JSON.parse(res.body))

                // if (this.roomCheck(res.body.roomId)) {
                this.setPDFSocket(JSON.parse(res.body))
                if (res.body) {
                  const data = {
                    roomId: this._detailId,
                    userId: `${this.mixinUser.nameBase} ${this.mixinUser.employeeNumber}`,
                    slideId: this.pdf.fileId,
                    slideUrl: this.pdf.url,
                    slidePage: this.pdf.currentPage
                  }
                  console.log(data)
                  this.stompClient.send(
                    '/api/slides/ack',
                    JSON.stringify(data)
                  )
                }
              }
            )
          },
          error => {
            this.connected = false
            console.error(error)
            setTimeout(() => {
              this.connect()
            }, 1000)
          }
        )
      }
    },
    setPDFUrl () {
      Object.assign(this.pdf, {
        url: `${this.ENV_OTCSUPPORT}/video-conference/attachFile/download/${this.selectPDFFileId}`,
        currentPage: 1,
        fileId: this.selectPDFFileId
      })
      this.send()
    },
    setPDFSocket (resBody) {
      if (resBody) {
        Object.assign(this.pdf, {
          url: resBody.slideUrl,
          currentPage: resBody.slidePage,
          fileId: resBody.slideId
        })
        this.selectPDFFileId = resBody.slideId
      }
    },
    send () {
      if (!(this._leaderRole || this._isManager)) return false

      const data = {
        roomId: this._detailId,
        userId: this.mixinUser.employeeNumber,
        slideId: this.pdf.fileId,
        slideUrl: this.pdf.url,
        slidePage: this.pdf.currentPage
      }
      console.log(data)
      this.stompClient.send(
        '/api/slides',
        JSON.stringify(data)
      )
    },
    setPage (value) {
      switch (value) {
        case 'next':
          if (this.pdf.currentPage < this.pdf.pageCount) {
            this.pdf.currentPage++
            this.send()
          }
          break
        case 'prev':
          if (this.pdf.currentPage > 1) {
            this.pdf.currentPage--
            this.send()
          }
          break
      }
    },
  }
}
</script>

<style lang="scss" scoped>
#pdf {
  height: calc(100vh - 63px) !important;
  background-color: rgba(196, 196, 196, 0.1);
}

.nopdf_wrap {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .nopdfImg { display: inline-block; }
  .nopdfText {
    margin-top: 10px;
    font-weight: 350;
    font-size: 12px;
  }
}

.pdf_wrap {
  position: relative;

  &:hover {
    .page_wrap {
      display: block;
    }
  }

  .page_wrap{
    background-color: $background;
    display: none;
    position: absolute;
    bottom: 10px;
    right: 10px;
    height: 30px;
    border-radius: 3px;
    padding: 3px;
    vertical-align: middle;

    &.leader {
      .pdf-arrow {
        @include hover;
        display: inline-block;
        height: 24px;
      }

      .pdf-current {
        display: inline-block;
        vertical-align: top;
        height: 24px;
        width: 30px;
        text-align: center;
        padding: 0;
        line-height: 24px;
        font-size: 16px;
      }

      .pdf-separator {
        margin: 0 10px;
        color: $border;
        font-size: 12px;
      }

      .pdf-total {
        display: inline-block;
        line-height: 24px;
        vertical-align: top;
        height: 24px;
        width: 30px;
        text-align: center;
        padding: 0;
        font-size: 16px;
        margin-right: 15px;
      }
    }

    &.participant {
      .pdf-total {
        display: inline-block;
        line-height: 24px;
        vertical-align: top;
        height: 24px;
        width: auto;
        text-align: center;
        padding: 0;
        font-size: 16px;
        margin: 0 10px;
      }
    }
  }
}
</style>
