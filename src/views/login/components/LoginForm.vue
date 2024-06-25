<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="用户名：admin / user">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="密码：123456" show-password autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item v-if="captchaEnabled" prop="code">
      <div class="rowBC" style="width: 100%">
        <span class="svg-container">
          <svg-icon icon-class="validCode" class="el-input__icon input-icon" />
        </span>
        <el-input v-model="loginForm.captchaCode" placeholder="验证码" @keyup.enter="login(loginFormRef)" />
        <img v-if="codeUrl" :src="codeUrl" class="login-code-img" @click="getCode" />
      </div>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)"> 重置 </el-button>
    <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login(loginFormRef)">
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeMount, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { getTimeState } from "@/utils";
import { Login } from "@/api/interface";
import { ElNotification } from "element-plus";
import { loginApi, getCaptchaApi } from "@/api/modules/login";
import { getCurrentUserInfo } from "@/api/modules/user";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
// import md5 from "md5";
// import bcryptjs from "bcryptjs";

const captchaEnabled = ref(true);
const codeUrl = ref("");
const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  captchaCode: [{ required: true, message: "验证码不能为空", trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({
  username: "",
  password: "",
  captchaCode: "",
  captchaId: ""
});
//获取code
const getCode = () => {
  getCaptchaApi().then(({ data }) => {
    if (data.captchaEnabled) {
      captchaEnabled.value = true;
      // codeUrl.value = `data:image/gif;base64,${data.img}`
      codeUrl.value = `${data.img}`;
      loginForm.captchaId = data.captchaId;
    } else {
      captchaEnabled.value = false;
    }
  });
};
// Get CurrentUserInfo
const getUserInfo = async () => {
  const { data } = await getCurrentUserInfo();
  userStore.setUserInfo({
    name: data.user_name,
    tenant: data.tenant,
    roles: data.roles,
    permissions: data.permissions
  });
};

// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      const plainPassword = loginForm.password;
      // const hashPassword = bcryptjs.hashSync(loginForm.password, 10)
      // const hashPassword = bcryptjs.hashSync(loginForm.password, 16);
      // const md5Password = md5(loginForm.password);
      const { data } = await loginApi({ ...loginForm, password: plainPassword });
      userStore.setToken(data.access_token);
      // Get User Info
      // userStore.setUserInfo({
      //   name: "S1"
      // });
      await getUserInfo();

      // 2.添加动态路由
      await initDynamicRouter();

      // 3.清空 tabs、keepAlive 数据
      tabsStore.setTabs([]);
      keepAliveStore.setKeepAliveName([]);

      // 4.跳转到首页
      router.push(HOME_URL);
      ElNotification({
        title: getTimeState(),
        message: "欢迎登录 S1 Admin",
        type: "success",
        duration: 3000
      });
    } finally {
      loading.value = false;
    }
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    e = (window.event as KeyboardEvent) || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});
//定时刷新验证码
let timeInterId;
const reloadCode = () => {
  timeInterId = setInterval(() => {
    getCode();
  }, 60000);
};
onUnmounted(() => {
  clearInterval(timeInterId);
});

onBeforeMount(() => {
  getCode();
  reloadCode();
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
