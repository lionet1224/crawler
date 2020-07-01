<template>
  <div class="dashboard-container">
    <panel-group :reptileLog="reptileLog" />
    
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-button @click="type = 'month'" :type="type == 'month' ? 'primary' : ''">近30天</el-button>
      <el-button @click="type = 'year'" :type="type == 'year' ? 'primary' : ''">今年</el-button>
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 14}" :xl="{span: 14}" style="padding-right:8px;margin-bottom:30px;">
        <reptile-log-table />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="10">
        <schedule-table />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import ReptileLogTable from './components/ReptileLogTable'
import ScheduleTable from './components/ScheduleTable'
import { log } from '@/api/reptileLog'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  watch: {
    type(){
      this.loadLog();
    }
  },
  data(){
    return {
      lineChartData: {
        successData: [],
        errorData: [],
        date: []
      },
      reptileLog: {error: 0, success: 0},
      type: 'month'
    }
  },
  components: {
    PanelGroup,
    LineChart,
    ReptileLogTable,
    ScheduleTable
  },
  methods: {
    loadLog(){
      log({ type: this.type }).then(res => {
        let date = Object.keys(res.data.date).sort((a, b) => {
          a = a.split('-');
          b = b.split('-');
          if(a[0] == b[0]) return a[1] - b[1];
          return a[0] - b[0];
        })
        let result = {
          date,
          successData: date.map(item => res.data.date[item].success),
          errorData: date.map(item => res.data.date[item].error)
        }
        this.reptileLog = res.data.meta;
        this.lineChartData = result;
      })
    }
  },
  mounted(){
    this.loadLog();
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
