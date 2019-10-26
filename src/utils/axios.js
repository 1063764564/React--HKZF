import React from 'react'
import axios from 'axios'

import { BASE_URL } from './url'

axios.defaults.baseURL = BASE_URL

React.Component.prototype.$axios = axios

export { axios }