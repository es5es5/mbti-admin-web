<template>
  <div>
    <video
      controls="controls"
      data-setup="{}"
      class="video-js vjs-default-skin"
      :width="_width"
      :height="_height"
      >
      <source :src="_hlsUrl" type="application/x-mpegURL">
    </video>
  </div>
</template>

<script>
import 'video.js'

export default {
  name: 'RecordVideo',
  computed: {
    _width: () => window.innerWidth,
    _height: () => window.innerHeight,
    _hlsUrl () { return `https://conference-vod.peoplelife.co.kr/hls/${this.$route.params.hlsUrl}/master.m3u8` }
  }
}
</script>

<style>

</style>
