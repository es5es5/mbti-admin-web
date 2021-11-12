 <template>
  <div id="Conference">
    <div class="header_wrap">
      <h2 class="title">{{ detailInfo.title }} [ {{ detailInfo.conferenceStartTime }} ]</h2>
      <div class="icon_wrap">
        <img src="@/assets/images/conference/record.svg" alt="board" class="iconImg" title="녹화파일" @click="() => isRecordOpen = !isRecordOpen">
        <img src="@/assets/images/conference/board.svg" alt="board" class="iconImg" title="회의자료" @click="() => isFileOpen = !isFileOpen">

        <img src="@/assets/images/conference/line.svg" alt="line" class="line">
        <img src="@/assets/images/conference/monitor.svg" alt="monitor" class="iconImg monitor" title="화면비율" @click="() => isRatioOpen = !isRatioOpen">
      </div>
      <transition name="fade" mode="out-in">
        <div class="record_wrap" v-if="isRecordOpen">
          <p v-for="(item, index) in recordList" :key="index" class="record-item" @click="setRecord(item.fileName)">{{ item.createtime | dateFormat('YYYY-MM-DD HH:mm') }}</p>
        </div>
      </transition>
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
        <iframe v-if="selectRecord !== ''" :src="`//${_location}/record/${selectRecord}`" frameborder="0" id="recIframe"></iframe>
        <div v-else class="norecord_wrap">
          <div>
            <img src="@/assets/images/conference/norecord.svg" alt="norecord" class="norecordImg">
            <p class="norecordText">녹화영상이 없습니다</p>
          </div>
        </div>
      </div>
      <div class="right_wrap" :style="`width: calc(${rightRatio}% - 10px); display: ${rightRatio === '0' ? 'none' : 'block'};`">
        <ConferencePDF :detailId="_detailId" :leaderRole="true" :fileId="_selectPDFFileId"></ConferencePDF>
      </div>
    </div>
  </div>
</template>

<script>
import ConferencePDF from './ConferencePDF'

export default {
  name: 'ConferenceReplay',
  created () {
  },
  mounted () {
    this.getRoom()
    this.getRECList()
  },
  components: {
    ConferencePDF
  },
  computed: {
    _selectPDFFileId () { return this.selectPDFFileId },
    _location () { return window.location.host },
    _leaderRole () { return this.$route.query.leader === this.mixinUser.employeeNumber },
    _detailId () { return this.$route.params.detailId },
    _isManager () { return this.$store.getters.getRoles.includes('EFA_MANAGER') || this.$store.getters.getRoles.includes('EFA_FA_SALES') || this.$store.getters.getRoles.includes('ROLE_ADMIN') || this.$store.getters.getRoles.includes('OTC_MANAGER') },
  },
  data () {
    return {
      detailInfo: {
        id: '',
        conferenceStartTime: '',
        fileAtteachList: []
      },
      isFileOpen: false,
      isRecordOpen: false,
      isRatioOpen: false,
      leftRatio: '50',
      rightRatio: '50',
      recordList: [],
      selectRecord: '',
    }
  },
  methods: {
    setRatio (leftRatio, rightRatio) {
      this.leftRatio = leftRatio
      this.rightRatio = rightRatio
    },
    setPDFFileId (id) {
      this.selectPDFFileId = id
      this.isFileOpen = false
    },
    setRecord (fileName) {
      this.selectRecord = fileName
      this.isRecordOpen = false
    },
    getRoom () {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-conference/detail/${this._detailId}`
      this.$http({
        method: 'get',
        url: apiURL
      }).then(result => {
        this.detailInfo = result.data.contents
        const fileList = result.data.contents.fileAtteachList
        if (fileList.length > 0) {
          this.selectPDFFileId = fileList[0].fileId
        }
      }).catch(error => {
        console.error(error)
      })
    },
    getRECList () {
      const data = {}
      const apiURL = `${this.ENV_OTCSUPPORT}/video-conference/record?page=0&size=1000000&sort=createtime,desc&conferenceId=${this._detailId}&service=`

      this.$http({
        method: 'get',
        url: apiURL,
        data
      }).then(result => {
        this.recordList = result.data.contents
        if (this.recordList.length > 0) this.selectRecord = this.recordList[0].fileName
      }).catch(error => {
        console.error(error)
      })
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

  .record_wrap {
    z-index: 2000;
    position: absolute;
    right: 66px;
    top: 45px;

    padding: 6px;
    border: 1px solid border;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0px 4px 3px rgba(0, 0, 0, 0.2);

    .record-item {
      display: block;
      font-size: 14px;
      padding: 4px 8px;

      &:hover {
        cursor: pointer;
        color: $primary;
      }
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
    background-color: rgba(196, 196, 196, 0.1);
    transition: all .5;
  }

  .norecord_wrap {
    position: relative;
    padding: 1px;

    .norecordImg {
      width: 10rem;
      position: absolute;
      top: calc(50vh - 63px);
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .norecordText {
      position: absolute;
      top: calc(50vh);
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>

<style lang="scss">
#recIframe {
  width: 100%;
  height: calc(100vh - 63px) !important;

  .video-js {
    width: 100% !important;
    height: 100vh !important;

    video {
      width: 100% !important;
    }
  }
}
</style>
