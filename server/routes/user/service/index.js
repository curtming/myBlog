const mysqlConnect = require('../../../lib/db')
// const LOG = require('../../../common/log/index')
const jwt = require('jsonwebtoken')
const httpResponse = require('../../../utils/http-response')
// const { APP_ID, APP_SECRET } = require('../../../config/env')
const bcrypt = require('bcryptjs')

class userService {
  /*
   * 用户注册
   */
  async userRegister(req, res, next) {
    const { body } = req
    try {
      let resData
      const { username, password } = body
      const userExists = await mysqlConnect('user').where({ username }).first()
      if (userExists) {
        resData = httpResponse(userExists, 'Username already exists')
        return res.status(409).json(resData)
      }
      // console.log('ps==>', bcrypt.hashSync(password, 10))
      let registerRes = await mysqlConnect('user').insert({
        username: username,
        password: bcrypt.hashSync(password, 10)
      })
      console.log('registerRes', registerRes)
      if (registerRes[0] === 0) {
        resData = httpResponse(registerRes, 'Username already exists')
        return res.status(409).json(resData)
      }
      resData = httpResponse(registerRes, 'Create successfully')
      return res.status(200).json(resData)
    } catch (error) {
      const resData = httpResponse(null, error.message)
      res.status(500).json(resData)
    }
  }

  async userLogin(req, res, next) {
    const { body } = req
    try {
      console.log('userLogin')
      let userRes = await mysqlConnect('user').where('username', body.username)
      const user = userRes[0] ?? userRes
      let resData
      // console.log(
      //   '=====',
      //   user,
      //   body.password,
      //   bcrypt.hashSync(body.password, 10)
      // )

      if (!user) {
        resData = httpResponse(user.username, 'Invalid username')
        return res.status(401).json(resData)
      }
      if (bcrypt.compareSync(body.password, user.password)) {
        let token = jwt.sign({ data: user.username }, 'secret', {
          expiresIn: '6h'
        })
        resData = httpResponse({user: user.username}, 'Login successfully')
        return res.status(200).json({ ...resData, token })
      } else {
        resData = httpResponse('Invalid username or password')
        return res.status(401).json(resData)
      }
    } catch (error) {
      const resData = httpResponse(null, error.message)
      res.status(500).json(resData)
    }
  }
}

module.exports = new userService()
