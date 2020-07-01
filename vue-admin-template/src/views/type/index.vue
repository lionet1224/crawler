<template>
  <div class="app-container">
    <h2>{{ type.name }}</h2>
    <p class="time">
      RID: {{ type.rid }} <br/>
      创建于: {{ type.created_at }}
      更新于: {{ type.updated_at }}
    </p>
    <p class="describe">{{ type.describe }}</p>

    <router-link :to="{
      name: 'reptileTypeUpdate',
      params: {
        rid: type.rid || 'notfound'
      }
    }">
      <el-button type="primary" icon="el-icon-edit" circle></el-button>
    </router-link>
    <el-button @click="deleteType(type.rid)" type="danger" icon="el-icon-delete" circle></el-button>
    <router-link :to="{
      name: 'reptileCreate',
      params: {
        rid: type.rid || 'notfound'
      }
    }">
      <el-button round>创建爬虫</el-button>
    </router-link>

    <el-divider></el-divider>

    <reptile-table @update="fetchData" :list="list"></reptile-table>
  </div>
</template>

<script>
import { info, destroy } from '@/api/reptileType'
import { formatTime } from '@/utils'
import ReptileTable from './components/ReptileTable'

export default {
  filters: {
    timeFilter(time){
      return formatTime(new Date(time));
    },
  },
  data() {
    return {
      list: null,
      type: {}
    }
  },
  created() {
    this.rid = this.$route.params.rid;
    this.fetchData()
  },
  methods: {
    fetchData() {
      info(this.rid).then(res => {
        this.type = res.data;
        this.list = res.data.reptile;
      })
    },
    deleteType(rid){
      this.$confirm('你确认要删除这个分类吗？此操作会将所有爬虫删除！', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '放弃'
      })
      .then(() => {
        destroy(rid).then(res => {
          this.$notify.success('删除成功');
          this.$router.push({
            name: 'projectList'
          })
        })
      })
      .catch(action => {
      });
    }
  },
  components: {
    ReptileTable
  }
}
</script>

<style lang="scss" scoped>
h2{
  font-size: 28px;
  color: #555;
}
.describe{
  color: #666;
}
.time{
  font-size: 12px;
  color: #666;
}
.project-items{
  .project-item{
    margin-bottom: 32px;
  }

  .item{
    height: 148px;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    padding: 0 20px;

    p{
      word-wrap: break-word;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .time{
      position: absolute;
      right: 15px;
      bottom: 15px;
      font-size: 12px;
    }

    &:hover .control-btns{
      opacity: 1;
    }

    .control-btns{
      position: absolute;
      right: 15px;
      top: 15px;
      opacity: 0;
      transition: .4s;

      .svg-icon.edit-icon:hover{
        color: #409EFF;
      }

      .svg-icon.delete-icon:hover{
        color: #f4516c;
      }

      svg{
        margin-left: 5px;
        transition: .4s;
      }
    }
  }
}
</style>