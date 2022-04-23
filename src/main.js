import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import request from './utils/request'

console.log('环境变量：', import.meta.env);

const app = createApp(App);
// 添加全局
app.config.globalProperties.$request = request;
app.use(router).use(ElementPlus).mount('#app');
