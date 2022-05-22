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

// 全局指令
app.directive('has', {
  beforeMount: (el, binding) => {
    // console.log(el, binding);
    // 获取按钮权限
    let actionList = storage.getItem("actionList")
    let value = binding.value;
    // 盘点列表中是否有对应按钮权限标识
    let hasPermission = actionList.includes(value)
    if (!hasPermission) {
      el.style = 'display:none';
      setTimeout(() => {
        el.parentNode.removeChild(el);
      }, 0);
    }
  }
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 添加全局
app.config.globalProperties.$request = request;
app.config.globalProperties.$api = api;
app.config.globalProperties.$storage = storage;
app.use(router).use(store).use(ElementPlus, { size: 'small' }).mount('#app');
