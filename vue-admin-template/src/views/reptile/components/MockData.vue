<template>
  <el-tabs v-loading="loading" v-model="tab">
    <el-tab-pane :lazy="true" label="Results" name="result">
      <template v-if="data.result">
        <json-editor :value="data.result"></json-editor>
      </template>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="Headers" name="headers">
      <template v-if="data.headers">
        <json-editor :value="data.headers"></json-editor>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'

export default {
  props: {
    data: {
      type: Object
    },
    loading: Boolean
  },
  data(){
    return {
      tab: 'result'
    }
  },
  mounted(){
  },
  components: {
    JsonEditor
  }
}
</script>

<style>

</style>