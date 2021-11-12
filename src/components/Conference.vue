 <template>
  <div id="Conference">
    <div class="header_wrap">
      <h2 class="title">{{ detailInfo.title }} [ {{ detailInfo.conferenceStartTime }} ]</h2>
      <div class="icon_wrap">
        <img src="@/assets/images/conference/people.svg" alt="participants" class="iconImg" title="참석자" @click="tooltip('participants')">
        <transition name="fade" mode="out-in">
          <!-- <tooltip v-if="tooltipId === 'participants'" :tooltipType="'participants'" :title="'참석자 [총: ' + _numberOfParticipants + '명]'" :dataObject="_participantsList"> -->
          <tooltip v-if="tooltipId === 'participants'" :tooltipType="'participants'" :readyAttendee="_participants" :totalAttendee="_conferenceTotalAttendeeList" :conferenceLeader="_conferenceLeaderInfo">
          </tooltip>
        </transition>
        <!-- <img src="@/assets/images/conference/people.svg" alt="participants" class="iconImg" title="미참석자" @click="tooltip('participants')"> -->
        <!-- <transition name="fade" mode="out-in">
          <tooltip v-if="tooltipId === 'participants'" :tooltipType="'participants'" :dataObject="_participants" :conferenceLeader="_conferenceLeaderInfo"></tooltip>
        </transition> -->
        <img src="@/assets/images/conference/board.svg" alt="board" class="iconImg" title="회의자료" @click="tooltip('fileList')">
        <img src="@/assets/images/conference/link.svg" alt="link" class="iconImg" title="링크" @click="copyClipboard()">
        <img src="@/assets/images/conference/talk.svg" alt="talk" class="iconImg" title="피플톡" @click="openSendPeopleTalk('all')">
        <img src="@/assets/images/conference/refresh.svg" alt="refresh" class="iconImg refresh" title="새로고침" @click="refresh">
        <img src="@/assets/images/conference/power.svg" alt="power" class="iconImg power" title="나가기" @click="exitVideoConfernce" v-if="_leaderRole">

        <img src="@/assets/images/conference/line.svg" alt="line" class="line">
        <img src="@/assets/images/conference/monitor.svg" alt="monitor" class="iconImg monitor" title="화면비율" @click="() => isRatioOpen = !isRatioOpen">
      </div>
      <transition name="fade" mode="out-in">
        <div class="ratio_wrap" v-if="isRatioOpen">
          <img :src="require(`@/assets/images/conference/${leftRatio === '100' ? 'active' : 'default'}/100_0.svg`)" alt="100_0" class="ratioImg" title="100_0" @click="setRatio('100', '0')">
          <img :src="require(`@/assets/images/conference/${leftRatio === '70' ? 'active' : 'default'}/70_30.svg`)" alt="70_30" class="ratioImg" title="70_30" @click="setRatio('70', '30')">
          <img :src="require(`@/assets/images/conference/${leftRatio === '50' ? 'active' : 'default'}/50_50.svg`)" alt="50_50" class="ratioImg" title="50_50" @click="setRatio('50', '50')">
          <img :src="require(`@/assets/images/conference/${leftRatio === '30' ? 'active' : 'default'}/30_70.svg`)" alt="30_70" class="ratioImg" title="30_70" @click="setRatio('30', '70')">
          <img :src="require(`@/assets/images/conference/${leftRatio === '0' ? 'active' : 'default'}/0_100.svg`)" alt="0_100" class="ratioImg" title="0_100" @click="setRatio('0', '100')">
        </div>
      </transition>
      <transition name="fade" mode="out-in">
        <div class="file_wrap" v-if="isFileOpen">
          <p v-for="(item, index) in detailInfo.fileAtteachList" :key="index" class="file-item" @click="setPDFFileId(item.fileId)">{{ item.fileName }}</p>
        </div>
      </transition>
    </div>
    <div class="contents_wrap">
      <div class="left_wrap" :style="`width: ${leftRatio}%; display: ${leftRatio === '0' ? 'none' : 'block'};`">
        <div id="meet1"></div>
      </div>
      <div class="right_wrap" :style="`width: calc(${rightRatio}% - 10px); display: ${rightRatio === '0' ? 'none' : 'block'};`">
        <ConferencePDF :detailId="_detailId" :leaderRole="_leaderRole" :fileId="_selectPDFFileId"></ConferencePDF>
      </div>
    </div>
    <ModalSendPeopleTalk :sendPeopleTalk="sendPeopleTalk" />
    <ModalCopyURL :copy="selectCopy" />
  </div>
</template>

<script src='https://conference2.peoplelife.co.kr/external_api.js'></script>
<script>
import ModalSendPeopleTalk from './ModalSendPeopleTalk'
import ModalCopyURL from './ModalCopyURL'
import ConferencePDF from './ConferencePDF'

export default {
  name: 'Conference',
  created () {
    window.addEventListener('beforeunload', this.leaving)
    this.getAttendeeList()
  },
  mounted () {
    this.getRoom()
    this.getUser()
      .then(this.conferenceInit)
    this.getLeaderInfomation()
  },
  beforeDestroy () {
    this.API.dispose()
  },
  components: {
    ConferencePDF,
    ModalSendPeopleTalk,
    ModalCopyURL,
  },
  computed: {
    _participants () { return this.API._participants },
    _conferenceTotalAttendeeList () { return this.conferenceTotalAttendeeList },
    _selectPDFFileId () { return this.selectPDFFileId },
    _numberOfParticipants () { return this.API._numberOfParticipants },
    _leaderRole () { return this.$route.query.leader === this.mixinUser.employeeNumber },
    _detailId () { return this.$route.params.detailId },
    _isManager () { return this.$store.getters.getRoles.includes('EFA_MANAGER') || this.$store.getters.getRoles.includes('EFA_FA_SALES') || this.$store.getters.getRoles.includes('ROLE_ADMIN') || this.$store.getters.getRoles.includes('OTC_MANAGER') },
    _sendURL () { return `https://meet.peoplelife.co.kr/guest?roomName=${this._detailId}&userName=Guest` },
    _conferenceLeaderInfo () {
      if (this.conferenceLeader === null || this.conferenceLeader === undefined) {
        return ''
      } else {
        return this.conferenceLeader.nameBase + ' (' + this.conferenceLeader.newDeptName + ') [' + this.conferenceLeader.employeeNumber + ']'
      }
    }
  },
  data () {
    return {
      API: { numberOfParticipants: 0 },
      jitsiOptions: {},
      detailInfo: {
        id: '',
        conferenceStartTime: '',
        fileAtteachList: []
      },
      tooltipId: '',
      isRatioOpen: false,
      isFileOpen: false,
      leftRatio: '50',
      rightRatio: '50',
      sendPeopleTalk: {
        sendType: '',
        attendeeList: []
      },
      selectPDFFileId: '',
      selectCopy: {
        url: '',
        category: ''
      },
      conferenceLeader: {
      },
      conferenceTotalAttendeeList: []
    }
  },
  methods: {
    tooltip (type) {
      if (!type) { return false }
      switch (type) {
        case 'participants':
          if (this.tooltipId === 'participants') {
            this.tooltipId = ''
          } else {
            this.tooltipId = type
          }
          this.isFileOpen = false
          break
        case 'fileList':
          if (this.isFileOpen) {
            this.isFileOpen = false
          } else {
            this.isFileOpen = true
          }
          this.tooltipId = ''
          break
        default:
          this.tooltipId = ''
          this.isFileOpen = false
      }
    },
    leaving () { this.API.dispose() },
    setRatio (leftRatio, rightRatio) {
      this.leftRatio = leftRatio
      this.rightRatio = rightRatio
    },
    getRoom (status) {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-conference/detail/${this._detailId}`
      this.$http({
        method: 'get',
        url: apiURL
      }).then(result => {
        this.detailInfo = result.data.contents
        this.attendeeList = result.data.contents.attendeeInfoList
        const fileList = result.data.contents.fileAtteachList
        if (fileList.length > 0) {
          this.selectPDFFileId = fileList[0].fileId
        }
      }).catch(error => {
        console.error(error)
      })
    },
    getAttendeeList () {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-conference/attendee/lists/${this._detailId}`
      this.$http({
        method: 'get',
        url: apiURL
      }).then(result => {
        result.data.contents.forEach(member => {
          const attendeeInfo = member.employeeInfo.nameBase + ' (' + member.employeeInfo.newDeptName + ') [' + member.employeeInfo.employeeNumber + ']'
          this.conferenceTotalAttendeeList.push(attendeeInfo)
        })
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
    setPDFFileId (id) {
      this.selectPDFFileId = id
      this.isFileOpen = false
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
        // eslint-disable-next-line
        this.API = new JitsiMeetExternalAPI(
          this.getJitsiENV('회의').domain,
          this.jitsiOptions
        )
      })
    },
    openSendPeopleTalk (type) {
      this.tooltip('peopleTalk')
      this.sendPeopleTalk = {}
      this.sendPeopleTalk.sendType = type
      this.sendPeopleTalk.attendeeList = this.attendeeList
      this.$modal.show('ModalSendPeopleTalk')
    },
    copyClipboard () {
      this.tooltip('clipboard')
      // this.COMMON.copyClipboard(document.location.href)
      // this.$toast.success(
      //     '클립보드에 주소를 복사하였습니다',
      //     this.ToastSettings
      this.selectCopy.url = `https://meet.peoplelife.co.kr/guest?roomName=${this._detailId}`
      this.selectCopy.category = '영상회의'
      this.$modal.show('ModalCopyURL')
    },
    getSearchList () {
      let url = document.location.href;
      let qs = url.substring(url.indexOf('?') + 1).split('&');
      for(var i = 0, result = {}; i < qs.length; i++){
          qs[i] = qs[i].split('=');
          result[qs[i][0]] = decodeURIComponent(qs[i][1]);
      }
      return result;
    },
    getLeaderInfomation () {
      const data = {}
      const apiURL = `${this.ENV_PINES}/pines/member/employee`
      data.employeeNumber = this.getSearchList().leader
      this.$http({
        method: 'get',
        url: apiURL,
        data: data
      }).then(result => {
        this.conferenceLeader = result.data
      }).catch(error => {
        console.error(error)
      })
    },
    refresh () { this.$router.go() },
    exitVideoConfernce () {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-conference/update/${this._detailId}/status/3`
      this.$Progress.start()
      this.$http({
        method: 'post',
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
    }
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

  .file_wrap {
    z-index: 2000;
    position: absolute;
    right: 6px;
    top: 45px;

    padding: 6px;
    border: 1px solid border;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0px 4px 3px rgba(0, 0, 0, 0.2);

    .file-item {
      padding: 6px;
      font-size: 14px;

      &:hover {
        cursor: pointer;
        color: $primary;
      }
    }
  }
}

.contents_wrap {
  @include clearfix;
  padding: 10px;

  .left_wrap {
    float: left;
    width: 50%;
    transition: all .5s;
  }

  .right_wrap {
    position: relative;
    float: left;
    margin-left: 10px;
    height: calc(100vh - 63px);
    transition: all .5;
  }
}
</style>

<style lang="scss">
#meet1 { iframe { height: calc(100vh - 63px) !important; } }
</style>
