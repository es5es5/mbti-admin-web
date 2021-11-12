<template>
  <div id="PrescriptionPDF">
    <button @click="makePDF" type="button" class="btn search">PDF</button>
    <div id="screen">
      <section>
        <div class="table_wrap">
          <table>
            <thead>
              <tr>
                <th colspan="20">지출 변화</th>
              </tr>
              <tr>
                <th></th>
                <th>변경 전</th>
                <th>변경 후</th>
                <th>차액</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>보험료</td>
                <td>129,500</td>
                <td>95,500</td>
                <td>- 34,000</td>
              </tr>
              <tr>
                <td>저축</td>
                <td>550,000</td>
                <td>850,000</td>
                <td>300,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="right_wrap">
          <canvas id="doughnut"></canvas>
          <canvas id="doughnut2"></canvas>
        </div>
      </section>
      <!-- <div class="division" data-html2canvas-ignore="true" :key="`${index}_division`"></div> -->
      <div class="division" data-html2canvas-ignore="true" :key="`1_division`"></div>
      <section>
        <div class="table_wrap">
          <table>
            <thead>
              <tr>
                <th colspan="20">다른 내용</th>
              </tr>
              <tr>
                <th></th>
                <th>변경 전</th>
                <th>변경 후</th>
                <th>차액</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>보험료</td>
                <td>129,500</td>
                <td>95,500</td>
                <td>- 34,000</td>
              </tr>
              <tr>
                <td>저축</td>
                <td>550,000</td>
                <td>850,000</td>
                <td>300,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <!-- <div v-for="index in 4" :key="index">
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
      </div> -->
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
import Chart from 'chart.js'

export default {
  name: 'PrescriptionPDF',
  mounted () {
    this.drawChartMain()
  },
  data () {
    return {
      propTitle: 'mypdf',
      doughnutData: {
        labels: ['보장성 보험', '저축성 보험'],
        datasets: [{
          label: '# of Votes',
          data: [0, 0],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      chart1Data: {
        // labels: ['변경 전', '변경 후'],
        labels: ['변경 전', '변경 후'],
        datasets: [{
          label: '금액(원)',
          data: [129500, 95500],
          clip: {
          },
          // base: 90000,
          backgroundColor: [
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            // 'rgba(255,99,132,1)',
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ]
        }]
      },
      chart2Data: {
        // labels: ['변경 전', '변경 후'],
        labels: ['변경 전', '변경 후'],
        datasets: [{
          label: '금액(원)',
          data: [550000, 850000],
          clip: {
          },
          // base: 90000,
          backgroundColor: [
            // 'rgba(255, 99, 132, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            // 'rgba(255,99,132,1)',
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ]
        }]
        // datasets: [{
        //   barPercentage: 0.5,
        //   barThickness: 10,
        //   maxBarThickness: 8,
        //   minBarLength: 2,
        //   data: [10, 20, 30, 40, 50, 60, 70]
        // }]
        // datasets: [
        //   {
        //     label: '금액 (원)',
        //     data: [5000, 5500],
        //     backgroundColor: [
        //       'rgba(255, 99, 132, 0.2)',
        //       'rgba(54, 162, 235, 0.2)'
        //       // 'rgba(255, 206, 86, 0.2)',
        //       // 'rgba(75, 192, 192, 0.2)',
        //       // 'rgba(153, 102, 255, 0.2)',
        //       // 'rgba(255, 159, 64, 0.2)'
        //     ],
        //     borderColor: [
        //       'rgba(255,99,132,1)',
        //       'rgba(54, 162, 235, 1)'
        //       // 'rgba(255, 206, 86, 1)',
        //       // 'rgba(75, 192, 192, 1)',
        //       // 'rgba(153, 102, 255, 1)',
        //       // 'rgba(255, 159, 64, 1)'
        //     ],
        //     borderWidth: 1
        //   }
        // ]
      }
    }
  },
  methods: {
    drawChartMain () {
      this.drawChart()
      this.drawChart2()
    },
    drawChart () {
      const ctx1 = document.getElementById('doughnut').getContext('2d')
      // const ctx1 = document.getElementById('doughnut')
      return new Chart(ctx1, {
        type: 'bar',
        data: this.chart1Data,
        options: {
          title: {
            display: true,
            text: '보험료 변화',
            fontSize: 20
          },
          legend: {
            display: false
            // position: 'top'
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 0,
                  max: 190000
                }
              }
            ]
          }
        }
      })
    },
    drawChart2 () {
      const ctx2 = document.getElementById('doughnut2').getContext('2d')
      // const ctx1 = document.getElementById('doughnut')
      return new Chart(ctx2, {
        type: 'bar',
        data: this.chart2Data,
        options: {
          title: {
            display: true,
            text: '저축금액 변화',
            fontSize: 20
          },
          legend: {
            display: false
            // position: 'top'
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 200000,
                  max: 1000000
                }
              }
            ]
          }
        }
      })
    },
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
#PrescriptionPDF {
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
