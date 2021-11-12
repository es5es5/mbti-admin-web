<template>
  <div id="pdf">
    <button @click="makePDF">PDF</button>
    <div id="screen">
      <div v-for="index in 4" :key="index">
        <section>
          <div>PDF SECTION {{ index }}</div>
          <div>PDF SECTION {{ index }}</div>
          <div>PDF SECTION {{ index }}</div>
          <div>PDF SECTION {{ index }}</div>
          <div>PDF SECTION {{ index }}</div>
          <div>PDF SECTION {{ index }}</div>
          <div>PDF SECTION {{ index }}</div>
        </section>
        <div class="division" data-html2canvas-ignore="true" :key="`${index}_division`"></div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  name: 'PDF',
  mounted () {
  },
  data () {
    return {
      propTitle: 'mypdf'
    }
  },
  methods: {
    async makePDF () {
      const selector = document.getElementById('screen')
      window.html2canvas = html2canvas // Vue.js 특성상 window 객체에 직접 할당해야한다.
      const that = this
      const pdf = new JsPDF('p', 'mm', 'a4')
      const canvas = pdf.canvas
      const pageWidth = 210 // 캔버스 너비 mm
      const pageHeight = 295 // 캔버스 높이 mm
      canvas.width = pageWidth

      const ele = selector
      const width = ele.offsetWidth //  셀렉트한 요소의 px 너비
      const height = ele.offsetHeight //  셀렉트한 요소의 px 높이
      const imgHeight = pageWidth * height / width //  이미지 높이값 px to mm 변환

      if (!ele) {
        console.warn(selector + ' is not exist.')
        return false
      }

      html2canvas(ele).then(function (canvas) {
        let position = 0
        const imgData = canvas.toDataURL('image/jpeg')
        pdf.addImage(imgData, 'jpeg', 0, position, pageWidth, imgHeight, undefined, 'slow')

        // Paging 처리
        let heightLeft = imgHeight // 페이징 처리를 위해 남은 페이지 높이 세팅.
        heightLeft -= pageHeight
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          if (imgHeight + position < 50) break
          pdf.addPage()
          pdf.addImage(imgData, 'jpeg', 0, position, pageWidth, imgHeight)
          heightLeft -= pageHeight
        }

        pdf.save(that.propTitle.toLowerCase() + '.pdf')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#pdf {
  padding: 20px 0;
  height: 100vh;
  background-color: #5F5F5F;
  font-size: 16px;
  @media (max-width: 80em) { font-size: 16px; }
  @media (max-width: 64em) { font-size: 16px; }
  @media (max-width: 48em) { font-size: 16px; }
  @media (max-width: 35.5em) { font-size: 16px; }
  overflow: scroll;
}

#screen {
  width: 210mm;
  margin: 0 auto;

  section {
    padding: 20px;
    background-color: #fff;
    height: 295mm;
  }

  .division {
    padding: 10px 0;
    background-color: #5F5F5F;
  }
}
</style>
