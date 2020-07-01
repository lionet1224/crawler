<template>
  <el-row :gutter="30" class="project-items">
    <el-col v-for="(item, i) in list" :xs="12" :sm="12" :lg="6" :key="i" class="project-item">
      <component @delete="$emit('delete')" :is="type | typeFilter" :item="item"></component>
    </el-col>
  </el-row>
</template>

<script>
import ItemProject from './ItemProject'
import ItemType from './ItemType'

export default {
  filters: {
    typeFilter(type){
      const typesData = {
        project: 'ItemProject',
        type: 'ItemType'
      }
      return typesData[type];
    }
  },
  props: {
    list: {
      type: Array,
    },
    type: {
      type: String,
      default: 'project'
    }
  },
  components: {
    ItemProject,
    ItemType
  }
}
</script>

<style lang="scss" scoped>
.project-items{
  .project-item{
    margin-bottom: 32px;
  }
}

::v-deep .item {
  height: 148px;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
  padding: 0 20px;

  p {
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .time {
    position: absolute;
    right: 15px;
    bottom: 15px;
    font-size: 12px;
  }

  &:hover .control-btns {
    opacity: 1;
  }

  .control-btns {
    position: absolute;
    right: 15px;
    top: 15px;
    opacity: 0;
    transition: 0.4s;

    .svg-icon.edit-icon:hover {
      color: #409eff;
    }

    .svg-icon.delete-icon:hover {
      color: #f4516c;
    }

    svg {
      margin-left: 5px;
      transition: 0.4s;
    }
  }
}
</style>