const config = require("../config/config.default");
const r = require("redis");
const { resolve } = require("core-js/fn/promise");

let { redis } = config({});

class Redis {
	constructor() {
    this.data = null
		this.use = redis.enable;
	}

	load(config) {
		if(!this.use) return false;
    this.data = r.createClient(config)
		this.data.auth(config.password, () => {
			console.log("redis auth success");
		});
    this.data.on('error', err => {
      console.error('redis错误: ' + err);
    })
	}

	set(key, val, expire) {
		if (!this.use) return false;
		return new Promise(async (resolve, reject) => {
			this.data.set(key, val, async () => {
				expire && (await this.expire(key, expire));
				resolve();
			});
		});
	}

	get(key) {
		if (!this.use) return false;
		return new Promise(async (resolve, reject) => {
			await this.data.get(key, (err, res) => {
				if (err) reject(err);
				else resolve(res);
			});
		});
	}

	del(key) {
		if (!this.use) return false;
		return new Promise(async (resolve, reject) => {
			this.data.del(key, () => {
				resolve();
			});
		});
	}

	expire(key, expire) {
		if (!this.use) return false;
		return new Promise(async (resolve, reject) => {
			await this.data.expire(key, expire);
			resolve();
		});
	}

	getId(key){
		if(!this.use) return false;
		return new Promise(async (resolve, reject) => {
			let k = await this.get(key);
			if(!k){
				resolve(null)
				return;
			}
			let v = await this.get(k);
			resolve(v);
		})
	}
}

let data = new Redis();

data.load({
  ...redis
})

module.exports = data;