<template>
  <div class="login-register">
    <div class="contain">
      <div class="big-box" :class="{ active: isLogin }">
        <el-form
          ref="ruleFormRef"
          :model="form"
          class="big-contain"
          key="bigContainLogin"
          v-if="isLogin"
          :rules="rules"
        >
          <div class="btitle">账户登录</div>
          <!-- prop="account"绑定校验规则 -->
          <el-form-item prop="account" class="input-container">
            <el-input placeholder="账号" v-model="form.account" />
          </el-form-item>

          <el-form-item prop="password" class="input-container">
            <!-- show-password 是一个属性，它的作用是为输入框添加一个 “显示密码” 的切换功能 -->
            <el-input
              placeholder="密码"
              v-model="form.password"
              type="password"
              show-password
            />
          </el-form-item>
          <el-button class="login-button" @click="handleLogin(ruleFormRef)"
            >登录</el-button
          >
        </el-form>
        <div class="big-contain" key="bigContainRegister" v-else>
          <span class="lab-span">实验室预约系统</span>
          <img
            class="lab-image"
            src="../../../img/实验室管理系统宣传封面.jpg"
            alt=""
          />
        </div>
      </div>
      <div class="small-box" :class="{ active: isLogin }">
        <div class="small-contain" key="smallContainRegister" v-if="isLogin">
          <div class="stitle">你好，朋友!</div>
          <p class="scontent">“实验室预约系统，让教学更简单！”</p>
          <button class="sbutton" @click="changeType">了解更多</button>
        </div>
        <div class="small-contain" key="smallContainLogin" v-else>
          <div class="stitle">欢迎回来!</div>
          <p class="scontent">与我们保持联系，请登录你的账户</p>
          <button class="sbutton" @click="changeType">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { RuleForm } from "@/types/index";
import {
  ElMessage,
  type ComponentSize,
  type FormInstance,
  type FormRules,
} from "element-plus";
import { CommonService } from "@/services";
import { fi } from "element-plus/es/locales.mjs";
// import { login } from "@/api/login";

//数据
// const store = useStore();
const isLogin = ref(false);
const ruleFormRef = ref<FormInstance>();
const form = ref({
  account: "2022222979",
  password: "123456",
});

const rules = ref<FormRules<RuleForm>>({
  account: [
    {
      required: true, //是否必须
      message: "账号不能为空",
      trigger: "blur", //失去焦点时进行验证
    },
    {
      min: 5,
      max: 10,
      message: "账号长度必须为5~10位",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true, //是否必须
      message: "密码不能为空",
      trigger: "blur", //失去焦点时进行验证
    },
    {
      min: 5,
      max: 16,
      message: "密码长度必须为5~16位",
      trigger: "blur",
    },
  ],
});
//方法
//切换登录页面的登录视图和展示视图
const changeType = () => {
  isLogin.value = !isLogin.value;
};

//登录按钮校验
//接收一个参数 formEl，其类型为 FormInstance | undefined，表示表单实例对象，这个参数可以是 FormInstance 类型（即表单实例），也可以是 undefined（表示没有传入表单实例）
const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;//如果 formEl 不存在，函数将直接返回，不执行后续的校验和登录逻辑。
  //formEl.validate 是 Element UI（或 ElementPlus）表单组件提供的一个方法，用于对表单进行校验。
// 它接收一个回调函数作为参数，该回调函数会在表单校验完成后被调用。
// 回调函数接收两个参数：
// valid：是一个布尔值，表示表单是否校验通过。如果所有表单项都满足校验规则，valid 为 true；否则为 false。
// fields：是一个对象，包含了所有校验不通过的表单项及其错误信息。
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await CommonService.loginService({
        account: form.value.account,
        password: form.value.password,
      });
      // console.log(res);
      // console.log("submit!");
      // console.log()
    } else {
      ElMessage.error("登陆失败!!!!" + fields);
      console.log("error submit!", fields);
    }
  });
};
// const handleLogin = async (formEl: FormInstance | undefined) => {
//   if (!formEl) return;
//   await formEl.validate(async (valid, fields) => {
//     if (valid) {
//       // const res = await login(form.value);
//       // console.log(res);
//       // console.log("submit!");
//       // console.log()
//     } else {
//       console.log("error submit!", fields);
//     }
//   });
// };
</script>

<style scoped>
.login-register {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
}

.contain {
  width: 60%;
  height: 60%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 0 3px #f0f0f0, 0 0 6px #f0f0f0;
}

.big-box {
  width: 70%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 30%;
  transform: translateX(0%);
  transition: all 1s;
}

.big-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.big-contain .lab-image {
  width: 100%;
  height: 100%;
  z-index: 1;
  position: relative;
}

.big-contain .lab-span {
  z-index: 2;
  position: absolute;
  left: 32%;
  top: 10%;
  font-size: 30px;
  font-weight: bolder;
  color: #fff;
  text-align: center;
}

.big-contain .lab-image {
  width: 100%;
  height: 100%;
  z-index: 1;
  position: relative;
}

.big-contain .lab-span {
  z-index: 2;
  position: absolute;
  left: 32%;
  top: 10%;
  font-size: 30px;
  font-weight: bolder;
  color: #fff;
  text-align: center;
}

.btitle {
  font-size: 1.5em;
  font-weight: bold;
  color: rgb(57, 167, 176);
  margin-bottom: 50px;
}

.el-input {
  width: 198.67px;
}

.login-button {
  width: 20%;
  height: 40px;
  border-radius: 24px;
  border: none;
  outline: none;
  background-color: rgb(57, 167, 176);
  color: #fff;
  font-size: 0.9em;
  cursor: pointer;
}

.small-box {
  width: 30%;
  height: 100%;
  background: linear-gradient(135deg, rgb(57, 167, 176), rgb(56, 183, 145));
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(0%);
  transition: all 1s;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}

.small-contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stitle {
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
}

.scontent {
  font-size: 0.8em;
  color: #fff;
  text-align: center;
  padding: 2em 4em;
  line-height: 1.7em;
}

.sbutton {
  width: 60%;
  height: 40px;
  border-radius: 24px;
  border: 1px solid #fff;
  outline: none;
  background-color: transparent;
  color: #fff;
  font-size: 0.9em;
  cursor: pointer;
}

.big-box.active {
  left: 0;
  transition: all 0.5s;
}

.small-box.active {
  left: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  transform: translateX(-100%);
  transition: all 1s;
}
</style>
