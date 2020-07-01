<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="类型" min-width="50">
      <template slot-scope="scope">
        {{ scope.row.type | typeFilter }}
      </template>
    </el-table-column>
    <el-table-column label="名称" min-width="80">
      <template slot-scope="scope">
        {{ scope.row.reptile.name }}
      </template>
    </el-table-column>
    <el-table-column label="信息" min-width="150" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.proxy | statusFilter">
          代理
        </el-tag>
        <el-tag :type="row.cache | statusFilter">
          缓存
        </el-tag>
        <el-tag :type="row.data ? 1 : 2 | statusFilter">
          数据
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status == 1 ? '成功' : '失败' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="执行时间" width="100" align="center">
      <template slot-scope="scope">
        {{ scope.row.created_at | timeFilter }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { logList } from '@/api/reptileLog'
import { formatTime } from '@/utils'

export default {
  filters: {
    typeFilter(type){
      const typeMap = {
        schedule: '定时任务',
        request: '用户请求'
      }
      return typeMap[type]
    },
    timeFilter(time){
      return formatTime(new Date(time));
    },
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '2': 'danger'
      }
      return statusMap[status]
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
      logList().then(res => {
        this.list = res.data.list;
      })
    }
  }
}
</script>
