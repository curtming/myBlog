const knex = require('knex')
class ConnectMysql {
  constructor() {
    this.options = {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: process.env.MYSQL_REQUEST_PORT
    }
    console.log('options', this.options)
    this.connect = knex({
      client: 'mysql',
      connection: this.options
    })
  }
}

let mysqlConnect = new ConnectMysql().connect
// 建立MySQL连接, 默认创建pool

module.exports = mysqlConnect
