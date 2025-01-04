<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { CommonService } from "@/services/index";
import router from "@/router/index";
// 数据
let user = useUserStore();

//方法
function logout() {
  CommonService.logoutService();
}
</script>
<template>
  <div id="header">
    <div class="logo-box">logo</div>
    <div class="right-box">
      <div class="title">实验室预约系统</div>
      <div class="avater-box">
        <div class="menu-box">
          <div class="usermessage">
            <el-avatar
              id="emotion1"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
            <el-avatar
              id="emotion2"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            />
            <span class="usermessage-text"
              >{{ user.getUserName() }} {{ user.getRole() }}</span
            >
          </div>

          <ul>
            <li @click="logout()">退出登录</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
#header {
  background-color: #2b2c44;
  color: #fff;
  display: flex;
  justify-content: space-between;
}
.logo-box {
  width: 200px;
  text-align: center;
  line-height: 60px;
  font-style: 22px;
  font-weight: bold;
  color: #e73267;
}
.right-box {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}
.usermessage {
  display: flex;
  position: relative;
  width: 200px;
  text-align: center;
  color: #4f1717;
}
.usermessage-text {
  width: 170px;
  height: 30px;
  /* justify-self: center; */
  align-self: center;
}
.avater-box {
  /* margin-right: 10px; */
  /* position: relative; */
  right: 180px;
}

.iconfont {
  font-size: 26px !important;
  line-height: 50px;
  text-align: center;
}

.menu-box ul {
  width: 100%;
  height: 75%;
}

.menu-box ul li {
  list-style: none;
  padding: 15px;
}

.menu-box li i {
  color: #4f1717;
}

#emotion1,
#emotion2 {
  color: rgb(230, 205, 80);
  position: relative;
  top: 10px;
  font-size: 35px !important;
  /* animation: jitter 0.5s linear forwards; */
  margin-bottom: 40px;
}
#emotion1 {
  left: 6px;
  top: 5px;
}
#emotion2 {
  display: none;
}

.menu-box {
  width: 50px;
  height: 50px;

  position: fixed;
  right: 0px;
  top: 10px;
  z-index: 999;
  text-align: center;
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  /* 添加过渡 */
  transition: all 0.5s ease-out;
  overflow: hidden;
}
.menu-box .content {
  /* display: none; */
  padding-left: 5px;
  color: #797a7b;
  /* 设置文字不换行 */
  white-space: nowrap;
  transition: all 0.2s ease-out;
}
.menu-box:hover {
  width: 225px;
  height: 400px;

  border-top-left-radius: 60px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 60px;
  border-bottom-left-radius: 0px;
}

.menu-box:hover .usermessage {
  left: 30px;
}

/* hover时让文字出现 */
.menu-box:hover ul li p {
  display: block;
}

.menu-box:hover #emotion1 {
  display: none;
}

.menu-box:hover #emotion2 {
  display: block;
}

ul li {
  background-color: rgba(241, 238, 238, 0.5);
  color: #4f1717;
  cursor: pointer;
}

ul li:hover {
  background-color: rgba(160, 154, 154, 0.5);
}
/* 抖动动画 */
@keyframes jitter {
  0% {
    /* 缩放1.2倍，顺时针旋转10° */
    transform: scale(1.2) rotate(20deg);
  }

  50% {
    transform: scale(0.8) rotate(-20deg);
  }

  0% {
    transform: scale(1) rotate(0deg);
  }
}
</style>
