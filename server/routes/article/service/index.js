const mysqlConnect = require('../../../lib/db')
const jwt = require('jsonwebtoken')
const httpResponse = require('../../../utils/http-response')
// const { APP_ID, APP_SECRET } = require('../../../config/env')
const bcrypt = require('bcryptjs')

class articlesService {
  /*
   * 新增文章
   */
  async create(req, res, next) {
    const { body } = req
    console.log('body==>', body)
    try {
      let resData
      const { title, content, time, author } = body
      const getAuthorId = await mysqlConnect('user')
        .where({ username: author })
        .first()

      const article = await mysqlConnect('articles').insert({
        title,
        content,
        created_at: time,
        author_id: getAuthorId.id
      })
      console.log('article==>', article)
      if (article[0] === 0) {
        resData = httpResponse(article, 'Create failed')
        return res.status(409).json(resData)
      }
      resData = httpResponse(article, 'Create successfully')
      return res.status(200).json(resData)
    } catch (error) {
      const resData = httpResponse(null, error.message)
      return res.status(500).json(resData)
    }
  }

  async getLists(req, res, next) {
    const { body } = req
    try {
      let resData
      // const { page, limit } = body
      const getArticles = await mysqlConnect('articles')
        .select()
        .orderBy('created_at', 'desc')
      // .offset((page - 1) * limit)
      // .limit(limit)
      console.log('getArticles==>', getArticles)
      if (getArticles === null || getArticles.length <= 0) {
        resData = httpResponse(null, 'No articles found')
        return res.status(409).json(resData)
      }
      resData = httpResponse(getArticles, 'Get lists successfully')
      return res.status(200).json(resData)
    } catch (error) {
      const resData = httpResponse(null, error.message)
      return res.status(500).json(resData)
    }
  }
}

module.exports = new articlesService()
