<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="名称" width="80">
      <template slot-scope="scope">
        {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column label="cron" min-width="100" align="center">
      <template slot-scope="scope">
        {{ scope.row.cron }}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.nomarl | statusFilter">
          {{ row.nomarl ? '启动' : '未启动' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="上次运行时间" min-width="100" align="center">
      <template slot-scope="{row}">
        {{ row.log[0] && row.log[0].created_at | timeFilter }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { list } from '@/api/schedule'
import { formatTime } from '@/utils'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '2': 'danger'
      }
      return statusMap[status ? 1 : 2]
    },
    timeFilter(time){
      if(!time) return '未执行';
      return formatTime(new Date(time));
    },
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      list().then(res => {
        this.list = res.data
      })
    }
  }
}
</script>
