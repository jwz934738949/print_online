<template>
  <div>
    <a-card title="欢迎界面" :bordered="false" class="welcome_content">
      <p>声明:尽可能将打印文档转换成PDF格式上传打印，否则容易造成系统页数误判，和打印格式错误。如有问题联系电话: 18333103051</p>
    </a-card>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.welcome_content {
  height: 615px;
  background: url("../../assets/mgdoubm.jpg") no-repeat 0 0;
  background-size: cover;

  p {
    font-size: 20px;
    font-family: monospace;
  }
}


</style>