import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import axios from "axios";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "./assets/css/global.css";

Vue.config.productionTip = false;

axios.defaults.baseURL = "http://47.95.4.133:8080";

// 添加请求拦截器，在拦截器中添加token字段验证用户身份
axios.interceptors.request.use((config) => {
  config.headers.token = window.sessionStorage.getItem("token");
  return config;
});

Vue.prototype.$http = axios;

// 将日期格式转为字符串
Vue.prototype.dateToString = function (date) {
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  let hour = date.getHours().toString();
  let minute = date.getMinutes().toString();

  if (month.length === 1) {
    month = "0" + month;
  }
  if (day.length === 1) {
    day = "0" + day;
  }
  if (hour.length === 1) {
    hour = "0" + hour;
  }
  if (minute.length === 1) {
    minute = "0" + minute;
  }
  return year + "-" + month + "-" + day + " " + hour + ":" + minute;
};

Vue.use(Antd);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
