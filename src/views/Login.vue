<template>
  <div class="login_wrap">
    <!-- 登录框 -->
    <a-form-model
      class="login_form"
      ref="loginForm"
      :model="loginForm"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="username" label="用户名：" prop="username">
        <a-input placeholder="请输入用户名" v-model="loginForm.username" />
      </a-form-model-item>

      <a-form-model-item ref="password" label="密码：" prop="password">
        <a-input-password
          placeholder="请输入密码"
          v-model="loginForm.password"
        />
      </a-form-model-item>
      <a-form-model-item>
        <a-button
          class="btn_login"
          type="primary"
          size="large"
          @click="onSubmit"
        >
          登录
        </a-button>
        <a-button class="btn_register" type="primary" size="large" ghost>
          注册
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelCol: { span: 4, offset: 2 },
      wrapperCol: { offset: 2, span: 14 },
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur",
          },
          {
            min: 3,
            max: 15,
            message: "长度在3 ~ 15个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.loginForm.validate(async (valid) => {
        const { data: res } = await this.$http.post(
          "/user/logins",
          this.loginForm
        );
        if (res.code !== 200) {
          return this.$message.error("登录失败！");
        }
        let token = res.token;
        window.sessionStorage.setItem("token", token);
        this.$message.success("登录成功！");
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_wrap {
  width: 50%;
  height: 50%;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.55);
  position: relative;
  top: 150px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.65);
  border-radius: 30px;

  .btn_login {
    margin-top: 20px;
    margin-left: 40%;
    margin-right: 5%;
  }
}
</style>