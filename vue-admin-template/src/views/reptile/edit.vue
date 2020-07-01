<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item v-if="form.rid" class="rid" label="RID">
        {{ form.rid }}
      </el-form-item>
      <el-form-item label="爬虫名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="爬虫描述">
        <el-input v-model="form.describe" type="textarea" />
      </el-form-item>
      <el-form-item label="参数配置">
        <el-button @click="editFlag = true" type="primary">JSON配置</el-button>
        <!-- <el-button type="info">快捷配置</el-button> -->
        
        <el-drawer
          size="40%"
          :show-close="false"
          :visible.sync="editFlag"
          direction="rtl">
          <el-tabs class="upBox" type="card" v-model="tab">
            <el-tab-pane :lazy="true" label="JSON配置" name="json">
              <json-editor @changed="changed" :value="set"></json-editor>
              <el-button @click="mock" type="info" style="margin-top: 15px">模拟执行</el-button>
            </el-tab-pane>
            <el-tab-pane label="模拟执行" name="mock">
              <a class="mockHref" target="_blank" :href="mockData.originHref">请求地址: {{ mockData.originHref }}</a>
              <mock-data :loading="mockLoading" :data="mockData"></mock-data>
              <el-button @click="mock" type="info" style="margin-top: 15px">模拟执行</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-drawer>
      </el-form-item>
      <el-form-item label="LOGO">
        <el-upload
          class="avatar-uploader"
          action
          :http-request="uploadImg"
          :show-file-list="false">
          <img v-if="form.logo" :src="$assetPath + form.logo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="状态">
        <el-tag @click="form.status = form.status == 1 ? 2 : 1" class="update" :type="form.status | statusFilter">{{ form.status == 1 ? '开启' : '关闭' }}</el-tag>
        <el-tag @click="form.public = form.public == 1 ? 2 : 1" class="update" :type="form.public | statusFilter">{{ form.public == 1 ? '公开' : '私有' }}</el-tag>
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
import { info, update, create, mock } from '@/api/reptile'
import { upload } from '@/api/tool'
import JsonEditor from '@/components/JsonEditor'
import MockData from './components/MockData'

export default {
  filters: {
    typeFilter(type){
      const typesName = {
        'reptileUpdate': '更新',
        'reptileCreate': '创建'
      }
      return typesName[type];
    },
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '2': 'danger'
      }
      return statusMap[status]
    }
  },
  components: {
    JsonEditor,
    MockData
  },
  data() {
    return {
      editFlag: false,
      type: '',
      tab: 'json',
      mockData: {},
      mockLoading: false,
      form: {
        status: 1,
        public: 1
      },
      set: {
        href: '',
        type: 'dom'
      },
    }
  },
  methods: {
    onSubmit() {
      if(this.type == 'reptileUpdate'){
        update({
          ...this.form
        }).then(res => {
          this.$notify.success('更新成功');
          this.onCancel();
        })
      } else {
        create({
          ...this.form
        }).then(res => {
          this.$notify.success('创建成功');
          this.onCancel();
        })
      }
    },
    onCancel() {
      // this.$router.push({
      //   name: 'projectList'
      // });
      this.$router.go(-1)
    },
    uploadImg(fileObj){
      let formData = new FormData();
      formData.set("file", fileObj.file);
      upload(formData).then(res => {
        this.$set(this.form, 'logo', res.data.dir);
      })
    },
    changed(data){
      this.form.set = data;
    },
    mock(){
      this.tab = 'mock';
      this.mockLoading = true;
      this.mockData = {}
      mock(this.form.set).then(res => {
        this.mockLoading = false;
        this.mockData = res.data;
      }).catch(() => {
        this.mockLoading = false;
      })
    }
  },
  mounted(){
    this.type = this.$route.name;
    this.rid = this.$route.params.rid;

    if(this.type == 'reptileUpdate'){
      info(this.rid).then(res => {
        this.form = res.data;
        this.set = JSON.parse(res.data.set);
      })
      
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  width: 50%;
  padding-top: 50px;
}
.line{
  text-align: center;
}
.rid{
  color: #555;
}
.update{
  cursor: pointer;
}

.upBox{
  padding: 10px;
}

::v-deep #el-drawer__title{
  display: none;
}
.mockHref{
  padding-left: 5px;
  border-left: 2px solid rgb(221, 221, 221);
  font-size: 12px;
  color: rgb(146, 146, 146);
}
</style>
