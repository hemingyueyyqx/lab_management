<script setup lang="ts">
import type { User } from "@/types";
import { ref, nextTick, computed } from "vue";
import { AdminService } from "@/services/AdminService.ts";
import { TEACHER, ADMIN, LABADMIN } from "../../services/Const.ts";
import ElementPlus from "element-plus";

const users3: any = ref<User[]>([]);

const getUsers = async () => {
    const users2 = await AdminService.listUsersService();
    users3.value = users2; // 更新用户数据
    // await nextTick();
    console.log("=========================");
    console.log(users3.value);
};
getUsers();

const roleMap = (role) => {
    if (role === TEACHER) {
        return "老师";
    } else if (role === ADMIN) {
        return "管理员";
    } else {
        return "实验室管理员";
    }
};



console.log("-------------------------");
console.log(users3.value);
console.log("-------------------------");

console.log("=============================");

console.log("=============================");
const users = ref<User[]>([
    {
        id: "01JFXVYSMCG63TYK72DP1GBT25",
        name: "杨过",
        account: "1234567890",
        telephone: "12345678981",
        password: "1234",
    },
    {
        id: "01JFYCSSQ6CE38APA8F5JYD5RQ",
        name: "欧阳修",
        account: "1211367654",
        telephone: "14222622231",
        password: "1234",
    },
    {
        id: "01JGAKD271JNQ3128FBAVM4N7N",
        name: "张三",
        account: "1234867890",
        telephone: "12345678999",
        password: "1234",
    },
    {
        id: "01JGAKHA4H0TMVZKA20NYMZGYV",
        name: "郭靖",
        account: "1271367654",
        telephone: "12745678981",
        password: "1234",
    },
]);

const changePassword = async (user: User) => {
    if (user) {
        user.password = user.account;
        console.log(user);
        await AdminService.changePasswordService(user);
        alert(`用户 ${user.account} 的密码已被重置为 ${user.password}`);
    }
};

// =========================================================
const dialogVisible = ref(false);
const newUser = ref<User>({
    role: "",
    name: "",
    account: "",
    password: "",
    telephone: "",
});
const openModal = () => {
    console.log("打开了模态框");
    dialogVisible.value = true;
};
const resetForm = () => {
    newUser.value = {
        role: "",
        name: "",
        account: "",
        password: "",
        telephone: "",
    };
};
const handleAddUser = async () => {
    console.log("11--11");
    
    newUser.value.password = newUser.value.account;
    // console.log(newUser.value);
    await AdminService.addUserService(newUser.value);
    console.log("222--22");
    
    dialogVisible.value = false
    alert("添加成功");
};
</script>

<template>
    <div>
        <!-- <h1>管理员用户管理界面</h1> -->
        <!-- <div>
      ================================<br />
      {{ users3[0].account }}
      ================================<br />
    </div> -->
        <!-- 添加用户按钮 -->
        <el-button class="button" type="primary" @click="openModal">添加用户</el-button>
        <table border="1">
            <thead>
                <tr>
                    <th>角色</th>
                    <th>姓名</th>
                    <th>账号</th>
                    <th>电话</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users3" :key="user.id">
                    <td>{{ roleMap(user.role) }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.account }}</td>
                    <td>{{ user.telephone || "未提供" }}</td>
                    <td>
                        <button @click="changePassword({ id: user.id, account: user.account })">
                            重置密码
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- <button @click="addUser">添加新用户</button> -->
    </div>

    <div>


        <!-- 模态框 -->
        <el-dialog title="添加用户" v-model="dialogVisible" width="30%" @close="resetForm">
            <el-form :model="newUser" ref="userForm" label-width="100px">
                <el-form-item label="角色">
                    <el-input v-model="newUser.role" placeholder="请输入角色"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="newUser.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="newUser.account" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="电话号码">
                    <el-input v-model="newUser.telephone" placeholder="请输入电话号码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleAddUser">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
table {
    width: 80%;
    border-collapse: collapse;
    margin-left: 150px;
    margin-top: -90px;
}

th,
td {
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}
.button{
    margin-top: 20px;
    position: absolute;
    top: 50px;
    right: 30px;
}
</style>