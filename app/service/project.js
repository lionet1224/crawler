const { NotFound, AuthFailed } = require('../../common/http-exception');

const Service = require('egg').Service;

class ProjectService extends Service{
  async create(data){
    const { Project } = this.ctx.model;

    const project = await Project.create({
      name: data.get('name'),
      pid: this.ctx.helper.createID(),
      describe: data.get('describe', null),
      user_id: this.ctx.auth.id
    })

    return project;
  }

  async delete(data){
    const { Project, ReptileType } = this.ctx.model;
    
    const project = await Project.findOne({
      where: {
        pid: data.get('pid')
      },
      include: [{
        model: ReptileType,
        as: 'type'
      }]
    });

    if(!project) throw new NotFound('这个项目不存在');

    if(project.type.length >= 1){
      throw new AuthFailed('无法删除，请将其下分类全部删除后再试');
    }

    await project.destroy();
  }

  async index(data){
    const { Project, User } = this.ctx.model;

    let size = 10;
    let page = parseInt(data.get('page', 1));

    const projects = await Project.findAndCountAll({
      attributes: {
        exclude: ['deleted_at', 'id', 'user_id']
      },
      // limit: size,
      // offset: (page - 1) * size,
      order: [['created_at', data.get('order', 'desc')]],
      include: [{
        model: User,
        as: 'user',
        attributes: ['uid', 'username', 'created_at', 'updated_at', 'portrait', 'scope']
      }]
    });

    return this.ctx.helper.listData(projects, size, page);
  }

  async update(data){
    const { Project } = this.ctx.model;

    const project = await Project.findOne({
      where: {
        pid: data.get('pid')
      }
    })

    if(!project) throw new NotFound('项目不存在');

    await project.update({
      name: data.get('name', project.name),
      describe: data.get('describe', project.describe)
    })

    return project;
  }

  async show(data){
    const { Project, User } = this.ctx.model;

    const project = await Project.findOne({
      where: {
        pid: data.get('pid')
      },
      attributes: {
        exclude: ['deleted_at', 'id', 'user_id']
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['uid', 'username', 'created_at', 'updated_at', 'portrait', 'scope']
      }]
    })

    if(!project) throw new NotFound('项目不存在');

    return project;
  }
}

module.exports = ProjectService;