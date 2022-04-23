import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import config from './config'

console.log('环境变量：', import.meta.env);
const app = createApp(App);

axios.get(config.mockApi + '/login').then((res) => {
  console.log(res.data);
})

app.use(router).use(ElementPlus).mount('#app');
