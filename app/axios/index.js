import axios from 'axios'

const Axios = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' }
})

export default Axios
