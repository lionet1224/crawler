class Reptile{
  constructor(){
    this.rules = [];
  }

  add(data){
    this.rules.push(data);
  }

  get(data, type){
    
  }
}

let reptile = new Reptile;

reptile.add({
  name: '笔趣阁',
  type: 'Book Detail',
  url: 'http://test.com/{id}',
  data: {
    bookTitle: 'h1'
  }
})

reptile.add({
  name: '笔趣阁',
  type: 'Book Shop',
  url: 'http://test.com/home',
  data: {
    list: 'li'
  }
})

module.exports = reptile;