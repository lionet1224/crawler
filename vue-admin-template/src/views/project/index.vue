<template>
  <div class="app-container">
    <item-list
      :list="list"
      type="project"
      @delete="fetchData"
    ></item-list>
  </div>
</template>

<script>
import { getList, destroy } from '@/api/project'
import ItemList from './components/ItemList'

export default {
  components: {
    ItemList
  },
  data() {
    return {
      list: null,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getList().then(res => {
        this.list = res.data.list
      })
    },
  }
}
</script>

<style lang="scss" scoped>
</style>