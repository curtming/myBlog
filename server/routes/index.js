const routes = {}
const routeLists = ['user', 'article']
routeLists.forEach((v) => {
  routes[`${v}Routes`] = require(`./${v}/index`)
})
console.log('routeLists==>', routeLists)
module.exports = { routes, routeLists }
