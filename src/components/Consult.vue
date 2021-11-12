 <template>
  <div id="Conference">
    <div class="header_wrap">
      <h2 class="title">{{ detailInfo.customerInfo ? detailInfo.customerInfo.customerName : '고객' }}님 [ {{ detailInfo.consultDate }} {{ detailInfo.consultStartTime }} ]</h2>
      <div class="icon_wrap">
        <img src="@/assets/images/conference/link.svg" alt="link" class="iconImg" title="링크복사" @click="copyClipboard('consultLink')">
        <img src="@/assets/images/conference/signature.svg" alt="signature" class="iconImg" title="고객동의링크" @click="copyClipboard('sign')">
        <img src="@/assets/images/conference/refresh.svg" alt="refresh" class="iconImg refresh" title="새로고침">
        <img src="@/assets/images/conference/power.svg" alt="power" class="iconImg power" title="나가기" @click="exitVideoConsult">
      </div>
    </div>
    <div class="contents_wrap">
      <div class="left_wrap">
        <div id="meet1"></div>
      </div>
      <div class="right_wrap">
        <ConsultAction></ConsultAction>
      </div>
    </div>
    <ModalSendPeopleTalk :sendPeopleTalk="sendPeopleTalk" />
    <ModalCopyURL :copy="selectCopy" />
  </div>
</template>

<script src='https://conference1.peoplelife.co.kr/external_api.js'></script>
<script>
import ConsultAction from './ConsultAction'
import ModalSendPeopleTalk from './ModalSendPeopleTalk'
import ModalCopyURL from './ModalCopyURL'

export default {
  name: 'Cunsult',
  created () {
    window.addEventListener('beforeunload', this.leaving)
  },
  mounted () {
    this.getRoom()
    this.getUser()
      .then(this.conferenceInit)
  },
  beforeDestroy () {
    this.API.dispose()
  },
  computed: {
    _participants () { return this.API._participants },
    _numberOfParticipants () { return this.API._numberOfParticipants },
    _leaderRole () { return this.$route.query.leader === this.mixinUser.employeeNumber },
    _detailId () { return this.$route.params.detailId },
    _isManager () { return this.$store.getters.getRoles.includes('EFA_MANAGER') || this.$store.getters.getRoles.includes('EFA_FA_SALES') || this.$store.getters.getRoles.includes('ROLE_ADMIN') || this.$store.getters.getRoles.includes('OTC_MANAGER') },
    _sendURL () { return `https://meet.peoplelife.co.kr/guest?roomName=${this._detailId}&userName=Guest` }
  },
  components: {
    ModalSendPeopleTalk,
    ModalCopyURL,
    ConsultAction,
  },
  data () {
    return {
      API: {
        numberOfParticipants: 0
      },
      jitsiOptions: {},
      detailInfo: {
        id: '',
        conferenceStartTime: '',
        fileAtteachList: {}
      },
      isRatioOpen: false,
      leftRatio: '50',
      rightRatio: '50',
      sendPeopleTalk: {
        sendType: '',
        attendeeList: []
      },
      selectCopy: {
        url: '',
        category: ''
      },
    }
  },
  methods: {
    leaving () { this.API.dispose() },
    getRoom (status) {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-consult/${this._detailId}`
      this.$http({
        method: 'get',
        url: apiURL
      }).then(result => {
        this.detailInfo = result.data.contents
        this.attendeeList = result.data.contents.attendeeInfoList
      }).catch(error => {
        console.error(error)
      })
    },
    getUser () {
      return new Promise((resolve, reject) => {
        if (!this.$store.getters.getUser.employeeNumber) {
          const data = {}

          const apiURL = `${this.ENV_PINES}/auth/user`

          this.$http({
            method: 'get',
            url: apiURL,
            data: data
          }).then(result => {
            this.$store.commit('setUser', result.data.contents)
            return resolve()
          }).catch(error => {
            console.error(error)
          })
        } else {
          return resolve()
        }
      })
    },
    conferenceInit () {
      let TOOLBAR_BUTTONS = []
      if (this._leaderRole) {
        TOOLBAR_BUTTONS = this.TOOLBAR_BUTTONS_LEADER
      } else {
        TOOLBAR_BUTTONS = this.TOOLBAR_BUTTONS_NORMAL
      }
      this.$nextTick(() => {
        // Setting Options
        Object.assign(this.jitsiOptions, {
          roomName: this._detailId,
          width: '100%',
          height: window.innerHeight - 60,
          parentNode: document.querySelector('#meet1'),
          interfaceConfigOverwrite: {
            DEFAULT_BACKGROUND: '#f8f8f9',
            TOOLBAR_BUTTONS
          },
          jwt: this.createJWT(
            this.defaultHeader,
            {
              context: {
                user: {
                  avatar: null,
                  // avatar: 'https://robohash.org/john-doe',
                  name: `${this.mixinUser.nameBase} (${this.mixinUser.deptName}) [${this.mixinUser.employeeNumber}]`,
                  email: 'Hello@example.com'
                }
              },
              aud: 'conference',
              iss: 'conference',
              sub: 'peoplelife.co.kr',
              room: '*',
              moderator: true
            },
            'conference-secret-2020'
          )
        })

        // Jiti DOM Mounted
        this.API = new JitsiMeetExternalAPI(
          this.getJitsiENV('상담').domain, // Domain
          this.jitsiOptions
        )
      })
    },
    openSendPeopleTalk (type) {
      this.sendPeopleTalk = {}
      this.sendPeopleTalk.sendType = type
      this.sendPeopleTalk.attendeeList = this.attendeeList
      this.$modal.show('ModalSendPeopleTalk')
    },
    exitVideoConsult () {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-consult/${this._detailId}/status/3`
      this.$Progress.start()
      this.$http({
        method: 'put',
        url: apiURL
      }).then(result => {
        this.$emit('callback-search')
        this.$toast.success(
          '상담이 종료되었습니다.',
          this.ToastSettings
        )
        this.$emit('callback-create')
        this.$Progress.finish()
        window.close()
      }).catch(error => {
        console.error(error)
        this.$Progress.fail()
      })
    },
    copyClipboard (type) {
      if (type === 'consultLink') {
        // https://meet.peoplelife.co.kr/guest?roomName=621d7da5-2c91-474a-acbf-da8c3b4c838c&userName=Guest
        this.selectCopy.url = `https://meet.peoplelife.co.kr/guest?roomName=${this._detailId}`
        this.selectCopy.category = '영상상담'
      } else if (type === 'sign') {
        this.selectCopy.url = 'http://test.inplat.kr:10008/a230ea67-44dc-44ac-8a9e-09cd7359158e'
        this.selectCopy.category = '고객 개인정보활용 동의'
      } else {
        return false
      }
      this.$modal.show('ModalCopyURL')
      // let resultMsg = '클립보드에 영상상담 주소를 복사하였습니다.'
      // if(!type) { return false }
      // if(type === 'consultLink') {
      //   this.COMMON.copyClipboard(document.location.href)
      // } else if (type === 'sign') {
      //   resultMsg = '고객 동의 링크 주소를 복사하였습니다.'
      //   this.COMMON.copyClipboard('http://test.inplat.kr:10008/a230ea67-44dc-44ac-8a9e-09cd7359158e')
      // } else {
      //   this.$toast.error(
      //     '비정상적인 접근입니다',
      //     this.ToastSettings
      //   )
      //   return false
      // }
      // this.$toast.success(
      //   resultMsg,
      //   this.ToastSettings
      // )
    },
  }
}
</script>

<style lang="scss" scoped>
.header_wrap {
  @include clearfix;
  position: relative;

  height: 40px;
  padding: 5px 10px;

  border-bottom: 1px solid #000;

  .title {
    display: inline-block;
    line-height: 30px;
    color: #444;
    font-size: 13px;
    font-weight: bold;
  }

  .icon_wrap {
    float: right;

    .iconImg:last-child {
      margin-right: 0;
    }

    .iconImg {
      @include hover;
      width: 30px;
      height: 30px;
      margin-right: 4px;
      padding: 8px;
      background-color: #eee;
      border-radius: 3px;

      &.refresh { background-color: $primary; }
      &.monitor { background-color: $primary; }
    }

    .line {
      padding: 4px;
      height: 30px;
      margin-right: 4px;
    }
  }

  .ratio_wrap {
    z-index: 2000;
    position: absolute;
    right: 6px;
    top: 45px;

    padding: 6px;
    border: 1px solid border;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0px 4px 3px rgba(0, 0, 0, 0.2);

    .ratioImg {
      @include hover;
      display: block;
      width: 30px;
      height: 30px;
      // padding: 8px;
    }
  }
}

.contents_wrap {
  @include clearfix;
  padding: 10px;

  .left_wrap {
    float: left;
    width: calc(100% - 380px);
    transition: all .5s;
  }
  .right_wrap {
    overflow-y: scroll;
    &::-webkit-scrollbar { display: none; } /* Hide scrollbar for Chrome, Safari and Opera */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    position: relative;
    float: left;
    width: 370px;
    margin-left: 10px;
    height: calc(100vh - 63px);
    background-color: rgba(196, 196, 196, 0.1);
    transition: all .5;

    .action_wrap {
      text-align: center;
      padding: 0 10%;

      .action {
        width: 100%;
        margin: 6px auto;
      }
    }
  }
}
</style>

<style lang="scss">
#meet1 { iframe { height: calc(100vh - 63px) !important; } }
</style>
