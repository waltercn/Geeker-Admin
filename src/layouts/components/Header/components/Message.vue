<template>
  <div class="message">
    <el-popover placement="bottom" :width="310" trigger="click">
      <template #reference>
        <el-badge :value="`${total}`" class="item">
          <i :class="'iconfont icon-xiaoxi'" class="toolBar-icon"></i>
        </el-badge>
      </template>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="`通知(${notificationsTotal})`" name="first">
          <div class="message-list">
            <div v-for="item in notifications" :key="item.id" class="message-item">
              <img :src="iconsrc(item.icon)" alt="" class="message-icon" />
              <div class="message-content">
                <span class="message-title">{{ item.subject }}</span>
                <span class="message-date">{{ item.duration }} day(s) ago</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`消息(${messagesTotal})`" name="second">
          <div class="message-list">
            <!-- <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无消息</div> -->
            <div v-for="item in messages" :key="item.id" class="message-item">
              <img :src="iconsrc(item.icon)" alt="" class="message-icon" />
              <div class="message-content">
                <span class="message-title">{{ item.subject }}</span>
                <span class="message-date">{{ item.details }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`待办(${tasksTotal})`" name="third">
          <div class="message-list">
            <!-- <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无待办</div> -->
            <div v-for="item in tasks" :key="item.id" class="message-item">
              <img :src="iconsrc(item.icon)" alt="" class="message-icon" />
              <div class="message-content">
                <span class="message-title">{{ item.subject }}</span>
                <span class="message-date">{{ item.details }}</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, onUnmounted } from "vue";
import { getMessageList } from "@/api/modules/user";
import { User } from "@/api/interface";
const activeName = ref("first");
const notifications = ref<User.ResNotification[]>([]);
const messages = ref<User.ResMessage[]>([]);
const tasks = ref<User.ResTask[]>([]);
// Get Messages
const getMessages = async () => {
  const { data } = await getMessageList();
  notifications.value = data.notifications;
  messages.value = data.messages;
  tasks.value = data.tasks;
};
const iconsrc = function (icon) {
  return `/src/assets/images/${icon}`;
};
const notificationsTotal = computed(() => {
  return notifications.value.length;
});
const messagesTotal = computed(() => {
  return messages.value.length;
});
const tasksTotal = computed(() => {
  return tasks.value.length;
});
const total = computed(() => {
  return notifications.value.length + messages.value.length + tasks.value.length;
});
//定时刷新Messages
let timeInterId: NodeJS.Timer;
const reloadMessage = () => {
  timeInterId = setInterval(() => {
    getMessages();
  }, 60000);
};
onUnmounted(() => {
  clearInterval(timeInterId);
});
onBeforeMount(() => {
  getMessages();
  reloadMessage();
});
</script>

<style scoped lang="scss">
.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 45px;
}
.message-list {
  display: flex;
  flex-direction: column;
  .message-item {
    display: flex;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--el-border-color-light);
    &:last-child {
      border: none;
    }
    .message-icon {
      width: 40px;
      height: 40px;
      margin: 0 20px 0 5px;
    }
    .message-content {
      display: flex;
      flex-direction: column;
      .message-title {
        margin-bottom: 5px;
      }
      .message-date {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>
