<template>
  <main>
    <div class="detail_wrap">
      <form class="form" action="post" @submit.prevent>
        <fieldset>
          <legend>결제정보</legend>
          <div class="formRow row-4">
            <div class="column column-3">
              <label>모집인</label>
              <div class="custom">
                <input type="text" class="employee_name" placeholder="사원명">
                <input type="text" class="employee_number" placeholder="사번">
                <input type="text" class="employee_deptName" placeholder="부서">
              </div>
            </div>
            <div class="column">
              <label>비율</label>
              <input type="text">
            </div>
          </div>

          <div class="formRow row-4">
            <div class="column">
              <label for="">김루이</label>
              <input type="text">
            </div>
            <div class="column">
              <label for="">웅이</label>
              <input type="text">
            </div>
            <div class="column column-2">
              <label for="">히힣</label>
              <input type="text">
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>웅이정보</legend>
          <div class="formRow row-4">
            <div class="column">
              <label for="">김루이</label>
              <input type="text">
            </div>
            <div class="column">
              <label for="">웅이</label>
              <input type="text">
            </div>
            <div class="column column-2">
              <label for="">히힣</label>
              <input type="text">
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>웅이정보</legend>
          <div class="formRow row-4">
            <div class="column">
              <label for="">김루이</label>
              <input type="text">
            </div>
            <div class="column">
              <label for="">웅이</label>
              <input type="text">
            </div>
            <div class="column column-2">
              <label for="">히힣</label>
              <input type="text">
            </div>
          </div>
        </fieldset>
      </form>
      <br>
      <form class="form" action="post" @submit.prevent>
        <fieldset>
          <Legend>
            <template v-slot:title>고객 검색</template>
            <template v-slot:action>
              <button type="button" class="btn small">검색</button>
            </template>
          </Legend>
          <div class="formRow row-4">
            <div class="column column-3">
              <label>모집인</label>
              <div class="custom">
                <input type="text" class="employee_name" placeholder="사원명">
                <input type="text" class="employee_number" placeholder="사번">
                <input type="text" class="employee_deptName" placeholder="부서">
              </div>
            </div>
            <div class="column">
              <label>비율</label>
              <input type="text">
            </div>
          </div>

          <div class="formRow row-4">
            <div class="column">
              <label for="">김루이</label>
              <input type="text">
            </div>
            <div class="column">
              <label for="">웅이</label>
              <input type="text">
            </div>
            <div class="column column-2">
              <label for="">히힣</label>
              <input type="text">
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>웅이정보</legend>
          <div class="formRow row-4">
            <div class="column">
              <label for="">김루이</label>
              <input type="text">
            </div>
            <div class="column column-2">
              <label for="">히힣</label>
              <input type="text">
            </div>
            <div class="column">
              <label for="">웅이</label>
              <input type="text">
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>웅이정보</legend>
          <div class="formRow row-4">
            <div class="column">
              <label for="" class="required">김루이</label>
              <input type="text">
            </div>
            <div class="column">
              <label for="">웅이</label>
              <input type="text" disabled>
            </div>
            <div class="column column-2">
              <label for="" class="required">히힣</label>
              <input type="text">
            </div>
          </div>
        </fieldset>
      </form>

      <div class="action_wrap text-right">
        <button type="button" class="btn pull-left">목록으로</button>
        <button type="button" class="btn error">삭제</button>
        <button type="button" class="btn warning">수정</button>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'ContractDetail',
  created () {
  },
  mounted () {
  },
  props: {
    detailId: {
      type: String,
      require: true
    }
  },
  computed: {
  },
  data () {
    return {
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>
