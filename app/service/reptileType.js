const { NotFound } = require('../../common/http-exception');
const { ADMIN } = require('../../common/auth');

const Service = require('egg').Service;

class ReptileTypeService extends Service{
  async create(data){
    const { ReptileType, Project } = this.ctx.model;

    const project = await Project.findOne({
      where: {
        pid: data.get('pid')
      }
    })

    if(!project) throw new NotFound('没有找到对应的项目');

    let reptileType = await ReptileType.create({
      rid: this.ctx.helper.createID(),
      name: data.get('name'),
      describe: data.get('describe', null),
      project_id: project.id
    });

    return reptileType;
  }

  async index(data){
    const { ReptileType, Project } = this.ctx.model;

    const project = await Project.findOne({
      where: {
        pid: data.get('pid')
      }
    })

    if(!project) throw new NotFound('项目不存在');

    let filter = {
      project_id: project.id
    }

    if(this.ctx.auth.scope < ADMIN){
      filter.public = 1;
    }

    let size = 10;
    let page = parseInt(data.get('page', 1));

    const types = await ReptileType.findAndCountAll({
      where: filter,
      // limit: size,
      // offset: (page - 1) * size,
      order: [['created_at', data.get('order', 'desc')]],
      attributes: {
        exclude: ['deleted_at', 'project_id', 'id']
      }
    });

    return this.ctx.helper.listData(types, size, page);
  }

  async show(data){
    const { ReptileType, Reptile, User } = this.ctx.model;

    let reptiles = {
      model: Reptile,
      as: 'reptile',
      attributes: ['rid', 'name', 'logo', 'describe', 'updated_at', 'status'],
      where: {
        public: 1
      },
    }
    let types = {
      where: {
        rid: data.get('rid')
      },
      attributes: ['rid', 'name', 'describe', 'updated_at']
    }

    if(this.ctx.auth.scope >= ADMIN){
      reptiles.attributes = {
        exclude: ['id', 'user_id', 'type_id', 'deleted_at', 'set']
      };
      types.attributes = {
        exclude: ['id', 'deleted_at', 'project_id']
      };

      reptiles.include = [{
        model: User,
        as: 'user',
        attributes: ['uid', 'username', 'created_at', 'updated_at', 'portrait', 'scope']
      }]
      reptiles.where = null;
    } else {
      types.where.public = 1;
    }
    
    const type = await ReptileType.findOne({
      ...types,
      include: [
        reptiles
      ]
    })

    if(!type) throw new NotFound('没有数据');

    if(this.ctx.auth.scope >= ADMIN){
      for(let item of type.reptile){
        let key = `reptile_${item.rid}`;
        let flag = await this.ctx.redis.get(key);
        item.setDataValue('cache', !!flag);
      }
    }

    return type;
  }

  async delete(data){
    const { ReptileType, Reptile } = this.ctx.model;

    const type = await ReptileType.findOne({
      where: {
        rid: data.get('rid')
      },
      include: [{
        model: Reptile,
        as: 'reptile'
      }]
    })

    if(!type) throw new NotFound('没有找到这个分类')

    type.reptile.map(async item => {
      await item.destroy();
    })

    await type.destroy();
  }

  async update(data){
    const { ReptileType } = this.ctx.model;

    const type = await ReptileType.findOne({
      where: {
        rid: data.get('rid')
      },
      attributes: {
        exclude: ['deleted_at', 'project_id']
      }
    })

    if(!type) throw new NotFound('分类不存在');

    await type.update({
      name: data.get('name', type.name),
      describe: data.get('describe', type.describe),
      public: data.get('public', type.public)
    })

    delete type.dataValues.id;

    return type;
  }
}

module.exports = ReptileTypeService;