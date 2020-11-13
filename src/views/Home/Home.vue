<template>
  <div>
    <!-- 顶部标题栏 -->
    <div class="home_title">
      <div>
        <img src="../../assets/logo.png" alt="" />
        <span>山理在线打印系统</span>
      </div>
      <a-button type="danger" @click="logout"> 退出 </a-button>
    </div>

    <!-- 页面主体 -->
    <div class="home_content">
      <a-layout id="components-layout-demo-side" style="min-height: 100vh">
        <a-layout-sider v-model="collapsed" collapsible>
          <div class="logo" />
          <a-menu
            theme="dark"
            :default-selected-keys="[pageIndex]"
            mode="inline"
          >
            <a-menu-item
              :key="item.index"
              v-for="item in menuList"
              @click="menuClick(item.index)"
            >
              <a-icon type="pie-chart" />
              <span>{{ item.title }}</span>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout>
          <router-view></router-view>
        </a-layout>
      </a-layout>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collapsed: false,
      // 导航菜单内容
      menuList: [
        { id: 0, index: "welcome", title: "首页" },
        { id: 1, index: "print", title: "打印" },
        { id: 2, index: "history", title: "历史订单" },
      ],
      // 存储当前所在页面的索引
      pageIndex: "welcome",
    };
  },
  created() {
    this.pageIndex = window.sessionStorage.getItem("pageIndex") || "welcome";
  },
  destroyed() {
    window.sessionStorage.clear("pageIndex")
  },
  methods: {
    // 退出用户
    logout() {
      window.sessionStorage.clear();
      this.$message.success("退出成功！");
      this.$router.push("/login");
    },

    // 菜单导航点击
    menuClick(index) {
      // 将index存入缓存中
      window.sessionStorage.setItem("pageIndex", index);
      this.$router.push("/" + index);
    },
  },
};
</script>

<style lang="less" scoped>
.home_title {
  width: 100%;
  height: 60px;
  background-color: #036564;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;

  div {
    display: flex;
    align-items: center;

    img {
      height: 50px;
      background-color: #fff;
      border-radius: 50%;
      margin: 10px;
    }

    span {
      margin-left: 20px;
      font-size: 25px;
      color: #fff;
      font-weight: bold;
    }
  }
}

</style>
