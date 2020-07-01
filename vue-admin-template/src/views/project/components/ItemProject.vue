<template>
  <router-link :to="{
    name: 'projectShow',
    params: {
      pid: item.pid || 'notfound'
    }
  }">
    <div class="item">
      <h2>{{ item.name }}</h2>
      <p>{{ item.describe || '没有任何描述' }}</p>

      <div class="control-btns">
        <router-link :to="{
          name: 'projectUpdate',
          params: {
            pid: item.pid || 'notfound'
          }
        }">
          <svg-icon class="edit-icon" icon-class="edit" />
        </router-link>
        <svg-icon @click.prevent.stop="deleteData(item.pid || item.rid)" class="delete-icon" icon-class="delete" />
      </div>

      <div class="time">
        {{ item.created_at | timeFilter }}
      </div>
    </div>
  </router-link>
</template>

<script>
import { destroy } from '@/api/project'
import { formatTime } from '@/utils'

export default {
  filters: {
    timeFilter(time){
      return formatTime(new Date(time));
    },
  },
  props: {
    item: {
      type: Object
    }
  },
  methods: {
    deleteData(pid){
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
          this.$emit('delete');
        })
      })
      .catch(action => {
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>