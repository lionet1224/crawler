<template>
  <div class="app-container">
    <h2>{{ project.name }}</h2>
    <p class="time">
      创建于: {{ project.created_at }}
      更新于: {{ project.updated_at }}
    </p>
    <p class="describe">{{ project.describe }}</p>

    <router-link :to="{
      name: 'projectUpdate',
      params: {
        pid: project.pid || 'notfound'
      }
    }">
      <el-button type="primary" icon="el-icon-edit" circle></el-button>
    </router-link>
    <el-button @click="deleteProject(project.pid)" type="danger" icon="el-icon-delete" circle></el-button>
    <el-button round>
      <router-link :to="{
        name: 'reptileTypeCreate',
        params: {
          pid: project.pid || 'notfound'
        }
      }">创建分类</router-link>
    </el-button>

    <el-divider></el-divider>

    <item-list @delete="getType" :list="list" type="type"></item-list>
  </div>
</template>

<script>
import { info, destroy } from '@/api/project'
import { getList } from '@/api/reptileType'
import { formatTime } from '@/utils'
import ItemList from './components/ItemList'

export default {
  filters: {
    timeFilter(time){
      return formatTime(new Date(time));
    },
  },
  data() {
    return {
      list: null,
      project: {}
    }
  },
  created() {
    this.pid = this.$route.params.pid;
    this.fetchData()
  },
  methods: {
    fetchData() {
      info(this.pid).then(res => {
        this.project = res.data;
      })
      this.getType();
    },
    getType(){
      getList(this.pid).then(res => {
        this.list = res.data.list;
      })
    },
    deleteProject(pid){
      this.$confirm('你确认要删除这个项目吗？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '放弃'
      })
      .then(() => {
        destroy(pid).then(res => {
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
    ItemList
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