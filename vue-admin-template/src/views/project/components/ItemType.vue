<template>
  <router-link :to="{
    name: 'reptileTypeShow',
    params: {
      rid: item.rid
    }
  }">
    <div class="item">
      <h2>{{ item.name }}</h2>
      <p>{{ item.describe || '没有任何描述' }}</p>

      <div class="control-btns">
        <router-link :to="{
          name: 'reptileTypeUpdate',
          params: {
            rid: item.rid
          }
        }">
          <svg-icon class="edit-icon" icon-class="edit" />
        </router-link>
        <el-popconfirm
          icon="el-icon-info"
          iconColor="red"
          title="你确认删除吗？此操作会将分类下所有爬虫删除"
          @onConfirm="confirm(item.rid)"
        >
          <svg-icon @click.stop.prevent slot="reference" class="delete-icon" icon-class="delete" />
        </el-popconfirm>
      </div>

      <div class="time">
        {{ item.created_at | timeFilter }}
      </div>
    </div>
  </router-link>
</template>

<script>
import { destroy } from '@/api/reptileType'
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
    confirm(rid){
      destroy(rid).then(res => {
        this.$notify.success('删除成功');
        this.$emit('delete');
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>