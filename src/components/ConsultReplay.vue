 <template>
  <div id="ConsultReplaykj">
    <div class="header_wrap">
      <h2 class="title">{{ detailInfo.customerInfo ? detailInfo.customerInfo.customerName : '' }} [ {{ detailInfo.consultDate }} ]</h2>
      <div class="icon_wrap">
        <img src="@/assets/images/conference/record.svg" alt="board" class="iconImg" title="녹화파일" @click="() => isRecordOpen = !isRecordOpen">
      </div>
      <transition name="fade" mode="out-in">
        <div class="record_wrap" v-if="isRecordOpen">
          <p v-for="(item, index) in recordList" :key="index" class="record-item" @click="setRecord(item.fileName)">{{ item.createtime | dateFormat('YYYY-MM-DD HH:mm') }}</p>
        </div>
      </transition>
    </div>
    <div class="contents_wrap">
      <iframe v-if="selectRecord !== ''" :src="`//${_location}/record/${selectRecord}`" frameborder="0" id="recIframe"></iframe>
      <div v-else class="norecord_wrap">
        <div>
          <img src="@/assets/images/conference/norecord.svg" alt="norecord" class="norecordImg">
          <p class="norecordText">녹화영상이 없습니다</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConferenceReplay',
  created () {
  },
  mounted () {
    this.getRoom()
    this.getRECList()
  },
  components: {
  },
  computed: {
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
      isRecordOpen: false,
      recordList: [],
      selectRecord: '',
    }
  },
  methods: {
    setRecord (fileName) {
      this.selectRecord = fileName
      this.isRecordOpen = false
    },
    getRoom () {
      const apiURL = `${this.ENV_OTCSUPPORT}/video-consult/${this._detailId}`
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
