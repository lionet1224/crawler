<template>
  <div class="app-container">
    <el-table
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="名称">
        <template slot-scope="scope">
          <img v-if="scope.row.logo" :src="$assetPath + scope.row.logo" alt="">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.describe }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="150" align="center">
        <template slot-scope="scope">
          <el-tag @click="updateStatus(scope.row)" class="update" :type="scope.row.status | statusFilter">{{ scope.row.status == 1 ? '开启' : '关闭' }}</el-tag>
          <el-tag @click="updatePublic(scope.row)" class="update" :type="scope.row.public | statusFilter">{{ scope.row.public == 1 ? '公开' : '私有' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user ? scope.row.user.username : '用户已删除' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updated_at" label="操作" width="160">
        <template slot-scope="scope">
          <router-link :to="{
            name: 'reptileUpdate',
            params: {
              rid: scope.row.rid
            }
          }">
            <el-button icon="el-icon-edit" circle></el-button>
          </router-link>
          <el-button @click="handleCopy(scope.row.rid, $event)" icon="el-icon-document-copy" circle></el-button>
          <el-button style="margin-left:3px" @click="destroy(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { update, destroy } from '@/api/reptile'
import clip from '@/utils/clipboard' // use clipboard directly

export default {
  props: {
    list: {
      type: Array
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '2': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    updateStatus(data){
      update({ 
        rid: data.rid,
        status: data.status == 1 ? 2 : 1
      }).then(res => {
        this.$emit('update')
      })
    },
    updatePublic(data){
      update({ 
        rid: data.rid,
        public: data.public == 1 ? 2 : 1
      }).then(res => {
        this.$emit('update')
      })
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    destroy(data){
      this.$confirm(`你确认要删除<${data.name}>爬虫吗？`, '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '放弃'
      })
      .then(() => {
        destroy(data.rid).then(res => {
          this.$notify.success('删除成功');
          this.$emit('update');
        })
      })
      .catch(action => {
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  padding: 0;

  img{
    height: 30px;
    border-radius: 50%;
    vertical-align: middle;
  }
}

.update{
  cursor: pointer;
}
</style>