import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import request from './utils/request'
import storage from './utils/storage'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import api from './api'
import store from './store'

// console.log('环境变量：', import.meta.env);

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 添加全局
app.config.globalProperties.$request = request;
app.config.globalProperties.$api = api;
app.config.globalProperties.$storage = storage;
app.use(router).use(store).use(ElementPlus).mount('#app');
