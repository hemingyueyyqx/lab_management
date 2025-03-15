<script setup lang="ts">
import { ref, type Ref } from "vue";
import { cloneDeep } from "lodash-es";
import type { Course, User } from "@/types/index";
import { TEACHER, LABADMIN, ADMIN } from "@/services/Const";
import {
  ElDialog,
  ElCheckbox,
  ElCheckboxGroup,
  ElMessageBox,
  ElMessage,
} from "element-plus";
import { useCalendarStore } from "@/stores/CalendarStore";
import { AdminService } from "@/services/AdminService";
import AdminHeader from "@/components/layout/Header.vue";
import { timeFormatConversion } from "@/utils/timeFormat";
import { exportFile, importFile } from "@/utils/excel";

const calendarStore = useCalendarStore();
//课程信息数组
let users = ref();
//是否处于加载状态
const loading = ref(true);
//选中的复选框
let idArr = [];
//控制添加课程
const addUserOpen = ref(false);
//控制编辑弹窗
const editUserOpen = ref(false);
//添加课程表单
const form = ref<User>({});
//编辑课程表单
const editForm = ref<User>({});
// 表格字段配置
const fieldConfig = ref([
  {
    label: "ID", // 标签
    model: "id", // 字段名
    is_export: false, // 是否导出该字段
  },
  {
    label: "姓名", // 标签
    model: "name", // 字段名
    is_export: true, // 是否导出该字段
  },
  {
    label: "账号", // 标签
    model: "account", // 字段名
    is_export: true, // 是否导出该字段
  },
  {
    label: "联系方式", // 标签
    model: "telephone", // 字段名
    is_export: true, // 是否导出该字段
  },
  {
    label: "角色", // 标签
    model: "role", // 字段名
    is_export: true, // 是否导出该字段
  },
  {
    label: "创建时间", // 标签
    model: "createTime", // 字段名
    is_export: true, // 是否导出该字段
  },
  {
    label: "更新时间", // 标签
    model: "updateTime", // 字段名
    is_export: true, // 是否导出该字段
  },
]);
//1、获取所有用户信息
async function fetchData() {
  try {
    loading.value = true;
    users = await AdminService.listUsersService();
    console.log("**********");
    console.log(users.value);
    loading.value = false;
  } catch (error) {
    console.error("Error:", error);
  }
}
//调用1
fetchData();
const selected = (data) => {
  console.log("selected", data);

  idArr = []; //重置

  data.forEach((value: any) => {
    idArr.push(value.id);
  });

  console.log("idArr:", idArr);
};

//删除所选用户
const del = () => {
  console.log("del:", idArr);
  ElMessageBox.confirm(`确定要删除所选用户吗?`, "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("删除多个用户");
      const code = await AdminService.deleteUserService(idArr);
      if (code < 300) {
        // location.reload(); // 刷新页面
        fetchData();
      }
    })
    .catch(() => {});
};
//删除当前行的用户
const deleteCourse = (row: any) => {
  //弹提示框提示确定要删除当前课程吗
  ElMessageBox.confirm(`确定要删除名称为${row.name}这个用户吗?`, "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("删除用户");
      console.log(row);
      const code = await AdminService.deleteUserService(row.id);
      if (code < 300) {
        // location.reload(); // 刷新页面
        fetchData();
      }
    })
    .catch(() => {});
};
//新增
const add = () => {
  //弹出对话框
  console.log("添加用户");
  addUserOpen.value = true;
};

// 添加用户提交按钮
const submit = async () => {
  //   const semester = calendarStore.getSemester();
  //   console.log(semester);
  //   form.value.semester = semester;
  console.log("form的值是");
  console.log("form:", form.value);
  try {
    const code = await AdminService.addUserService(form.value);
    if (code < 300) {
      addUserOpen.value = false;
      // location.reload(); // 刷新页面
      fetchData();
      ElMessage.success("添加成功");
    } else {
      addUserOpen.value = false;

      throw new Error(`添加失败，状态码: ${code}`);
    }
  } catch (error) {
    console.error("添加课程失败:", error);
  }
};

//重置密码
const resetPassword = (index: any, row: any) => {
  ElMessageBox.confirm(`确定要重置${row.name}的密码吗?`, "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("重置密码");
      console.log(row);
      await AdminService.resetPasswordService(row.account);
      // location.reload(); // 刷新页面
      fetchData();
    })
    .catch(() => {});
};
//导出excel
const exportExcel = async () => {
  ElMessage({
    message: "开始导出数据，请稍候！",
    type: "success",
  });
  // 导出数据查询参数
  const printParams = {
    size: 1000,
    page: 1,
  };
  // 获取需要导出的字段配置
  const export_fields = fieldConfig.value
    .filter((obj) => obj["is_export"])
    .map(({ label, model }) => ({ [model]: label }));

  try {
    // 从后端获取数据
    const response = await AdminService.listUsersService();
    console.log("response", response);

    const export_data = response.map((obj) => {
      const newObj = {};
      export_fields.forEach((field) => {
        const [key, value] = Object.entries(field)[0];
        if (key === "createTime" || key === "updateTime") {
          newObj[value] = timeFormatConversion(obj[key], "YYYY-MM-DD HH:mm:ss");
        } else if (key === "role") {
          if (obj[key] == "Sj08") {
            newObj[value] = "超级管理员";
          } else if (obj[key] == "Js09") {
            newObj[value] = "老师";
          } else {
            newObj[value] = "实验室管理员";
          }
        } else {
          newObj[value] = obj[key];
        }
      });
      return newObj;
    });
    let filename = "所有用户";
    exportFile(export_data, filename);
  } catch (error) {
    console.log(error);
    ElMessage.error("获取列表数据失败！");
  }
};
// 导入excel弹窗是否显示
const uploadDialogVisible = ref(false);
// 点击导入excel按钮事件
const importExcel = () => {
  uploadDialogVisible.value = true;
};
// 文件数据
const uploadData = ref([]);
// 文件上传事件
const handleChange = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    const content = reader.result;
    importFile(content)
      .then((data) => {
        console.log(data);
        uploadData.value = data;
      })
      .catch((response) => {
        //发生错误时执行的代码
        console.log(response);
        ElMessage.error("获取列表数据失败！");
      });
  };
  reader.readAsBinaryString(file.raw);
};
// 点击导入excel提交数据事件
// const submitUpload = () => {
//   uploadDialogVisible.value = false;
// };
// 点击导入excel提交数据事件
const submitUpload = async () => {
  try {
    for (const user of uploadData.value) {
      // 将中文键转换为英文键
      const convertedUser = convertKeys(user);

      // 处理角色的英文值
      if (convertedUser.role === "超级管理员") {
        convertedUser.role = "Sj08";
      } else if (convertedUser.role === "老师") {
        convertedUser.role = "Js09";
      } else if (convertedUser.role === "实验室管理员") {
        convertedUser.role = "lM07";
      }

      // 调用后端的添加用户接口
      await AdminService.addUserService(convertedUser);
    }
    uploadDialogVisible.value = false;
    ElMessage.success("用户导入成功！");
    // 刷新页面
    // location.reload();
    fetchData();
  } catch (error) {
    console.error("用户导入失败:", error);
    ElMessage.error(`用户导入失败:${error}`);
  }
};
const addUsers = async () => {
  try {
    // 创建一个包含所有请求 Promise 的数组
    const promises = uploadData.value.map((user) => {
      // 将中文键转换为英文键
      const convertedUser = convertKeys(user);

      // 处理角色的英文值
      if (convertedUser.role === "超级管理员") {
        convertedUser.role = "Sj08";
      } else if (convertedUser.role === "老师") {
        convertedUser.role = "Js09";
      } else if (convertedUser.role === "实验室管理员") {
        convertedUser.role = "lM07";
      }

      return AdminService.addUserService(convertedUser);
    });

    // 使用 Promise.all 并行处理所有请求
    await Promise.all(promises);

    // 所有请求都成功后给出提示信息
    alert("用户添加成功！");
  } catch (error) {
    // 若有任何一个请求失败，给出错误提示
    alert("添加用户时出现错误：" + error.message);
  }
};
// 定义中文键到英文键的映射
const keyMapping = {
  创建时间: "createTime",
  姓名: "name",
  更新时间: "updateTime",
  联系方式: "telephone",
  角色: "role",
  账号: "account",
};

// 转换中文键为英文键的函数
const convertKeys = (obj: any) => {
  const newObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = keyMapping[key] || key;
    newObj[newKey] = value;
  }
  return newObj;
};
</script>

<template>
  <div class="admin-container">
    <div class="header">
      <AdminHeader />
    </div>
    <div class="main">
      <el-button type="primary" @click="add">
        <el-icon><Plus /></el-icon>
        <span>添加用户</span>
      </el-button>
      <el-button type="danger" @click="del">
        <el-icon><Delete /></el-icon>
        <span>删除</span>
      </el-button>
      <el-button type="primary" @click="exportExcel">导出用户</el-button>
      <el-button type="success" @click="importExcel">批量添加用户</el-button>

      <el-table
        :data="users"
        :loading="loading"
        @selection-change="selected"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        style="margin: 3px 0"
      >
        <el-table-column type="selection" width=""></el-table-column>
        <!-- 新增的自增编号列 -->
        <el-table-column label="序号" width="">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="id" label="编号" width="80" /> -->
        <el-table-column prop="name" label="姓名" width="" />
        <el-table-column prop="account" label="账号" width="150" />
        <el-table-column prop="telephone" label="联系方式" width="" />
        <el-table-column prop="role" label="角色" width="">
          <template #default="scope">
            <!-- <span v-if="scope.row.role == ADMIN>超级管理员</span> -->
            <span v-if="scope.row.role == TEACHER">老师</span>
            <span v-if="scope.row.role == LABADMIN">实验室管理员</span>
            <span v-if="scope.row.role == ADMIN">超级管理员</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <!-- 传入当前行的索引（scope.$index）和整行数据（scope.row） -->
            <el-button
              size="small"
              type="primary"
              @click="resetPassword(scope.$index, scope.row)"
            >
              <el-icon><RefreshRight /></el-icon>
              <span>重置密码</span>
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteCourse(scope.row)"
            >
              <el-icon><Delete /></el-icon>
              <span>删除</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          layout="prev, pager, next, jumper, total"
          :page-size="5"
          :total="50"
        />
      </div>
    </div>
    <!-- <h3>按钮</h3> -->

    <!-- 添加课程模态框 -->
    <el-dialog v-model="addUserOpen" title="添加用户" width="500">
      <el-form :model="form">
        <el-form-item label="姓名">
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="请输入用户姓名"
          />
        </el-form-item>
        <el-form-item label="账号">
          <el-input
            v-model="form.account"
            autocomplete="off"
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item label="电话">
          <el-input
            v-model="form.telephone"
            autocomplete="off"
            placeholder="请输入联系方式"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" placeholder="请选择用户角色">
            <el-option label="老师" value="Js09" />
            <el-option label="实验室管理员" value="lM07" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserOpen = false">取消</el-button>
          <el-button type="primary" @click="submit"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="uploadDialogVisible" title="批量添加数据" width="40%">
      <el-form label-width="120px">
        <!-- <el-form-item label="模板下载：">
        <el-button type="info" @click="downloadTemplate">
          <el-icon>
            <Download/>
          </el-icon>
          点击下载
        </el-button>
      </el-form-item> -->
        <el-form-item label="文件上传：">
          <el-upload
            drag
            accept=".xls,.xlsx"
            :auto-upload="false"
            :on-change="handleChange"
          >
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                请上传.xls,.xlsx格式文件，文件最大为500kb
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload"> 导入 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px; /* 可根据需要调整顶部间距 */
}
.admin-container {
  display: flex;
  flex-direction: column;
}
.header {
  margin-bottom: 10px;
}
.main {
  padding: 10px;
}
</style>
