<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="分类名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="分类描述">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">
          {{ type | typeFilter }}
        </el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { info, update, create } from '@/api/reptileType'

export default {
  filters: {
    typeFilter(type){
      const typesName = {
        'reptileTypeUpdate': '更新',
        'reptileTypeCreate': '创建'
      }
      return typesName[type];
    }
  },
  data() {
    return {
      type: '',
      pid: '',
      form: {
        name: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      if(this.type == 'reptileTypeUpdate'){
        update({
          rid: this.rid,
          name: this.form.name,
          describe: this.form.desc
        }).then(res => {
          this.$notify.success('更新成功');
          this.onCancel();
        })
      } else {
        create({
          pid: this.pid,
          name: this.form.name,
          describe: this.form.desc
        }).then(res => {
          this.$notify.success('创建成功');
          this.$router.push({
            name: 'projectShow',
            params: {
              pid: this.pid
            }
          })
        })
      }
    },
    onCancel() {
      // this.$router.push({
      //   name: 'projectList'
      // });
      this.$router.go(-1)
    }
  },
  mounted(){
    this.type = this.$route.name;
    this.rid = this.$route.params.rid;
    this.pid = this.$route.params.pid;

    if(this.type == 'reptileTypeUpdate'){
      info(this.rid).then(res => {
        this.form.name = res.data.name;
        this.form.desc = res.data.describe;
      })
    }
  }
}
</script>

<style scoped>
.app-container{
  width: 50%;
  padding-top: 50px;
}
.line{
  text-align: center;
}
</style>

