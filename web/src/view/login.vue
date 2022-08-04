<template>
  <div class="login animate__animated animate__bounceIn">
    <!-- 登录表单 -->
    <form class="login-main" action="#">
      <span v-if="!isShow" class="login-main-title animate__animated animate__fadeInDown">{{ init }}</span>
      <span v-else class="login-main-title animate__animated animate__fadeInDown">{{ title }}</span>
      <input ref="userInputRef" id="userInput" class="login-main-input" :class="userInputAuthFlag?'biling':''" type="text" placeholder="用户名" autocomplete="off" />
      <input ref="passwordRef" class="login-main-input"
      :class="pwdInputAuthFlag?'biling':''"  type="password" placeholder="密码" id="pwdInput" autocomplete="off" />
      <input
        ref="againPasswordRef"
        v-show="!isUnregistered"
        class="login-main-input animate__animated animate__fadeIn"
        :class="againPwdInputAuthFlag?'biling':''"
        type="password"
        placeholder="再次输入密码"
        id="pwdAgainInput"
        autocomplete="off"
      />
      <div class="">
        <el-checkbox label="7天内保持登录状态" v-model="remAcc" size="small"></el-checkbox>
        <el-checkbox label="展示密码" v-model="showPwd" size="small"></el-checkbox>
      </div>
      <button ref="submitBtnRef" class="login-main-button login-main-button-login" @click="login" style="cursor: pointer">
        <span class="btn-value">{{ btnValue }}</span>
      </button>
      <span ref="tipsRef" class="login-main-tips">可以通过输入想要的用户名直接注册</span>
    </form>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import {getUserInfo, userLogin, userRegister} from '@/api/index'
import {debounce} from '@/public/pts'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useRouter} from 'vue-router'

document.title = '登录页面'

const router = useRouter()

// 该账号是否被注册
const isUnregistered = ref<boolean>(true)
// 初始页面显示
const init = ref<string>('Login')
// 标题显示
const title = ref<string>('')
// 切换动画
const isShow = ref<boolean>(false)
// 7天保持登录
const remAcc = ref<boolean>(true)
// 按钮信息
const btnValue = ref<string>('登录')
// 展示密码
const showPwd = ref<boolean>(false)
// 用户名输入框DOM
const userInputRef = ref()
// 密码输入框DOM
const passwordRef = ref()
// 二次密码输入框DOM
const againPasswordRef = ref()
// 用户输入框验证不通过时变化input框class
const userInputAuthFlag = ref<boolean>(false)
// 密码输入框验证不通过时变化input框class
const pwdInputAuthFlag = ref<boolean>(false)
// 二次密码输入框验证不通过时变化input框class
const againPwdInputAuthFlag = ref<boolean>(false)
// 提交按钮
const submitBtnRef = ref()
// 提示信息
const tipsRef = ref()

// 监听title更改注册和登录状态
// watch(title, (newVal: string, oldVal: string) => {
watch(title, (newVal: string) => {
  const btn = submitBtnRef.value
  const tips = tipsRef.value
  isUnregistered.value = newVal !== '该用户未注册'
  btnValue.value = newVal === '该用户未注册' ? '注册' : '登录'
  btn?.classList.remove(newVal === '该用户未注册' ? 'login-main-button-login' : 'login-main-button-register')
  btn?.classList.add(newVal === '该用户未注册' ? 'login-main-button-register' : 'login-main-button-login')
  tips?.classList.remove(newVal === '该用户未注册' ? 'low-light' : 'high-light')
  tips?.classList.add(newVal === '该用户未注册' ? 'high-light' : 'low-light')
  showPwd.value = newVal === '该用户未注册'
})
// 监听showPwd更改密码展示状态
// watch(showPwd, (newVal, oldVal) => {
watch(showPwd, (newVal) => {
  const pwdInput = passwordRef.value
  const pwdAgainInput = againPasswordRef.value
  pwdInput.setAttribute('type', newVal ? 'text' : 'password')
  pwdAgainInput.setAttribute('type', newVal ? 'text' : 'password')
  // if (newVal) {
  //   pwdInput.setAttribute('type', 'text')
  //   pwdAgainInput.setAttribute('type', 'text')
  // } else {
  //   pwdInput.setAttribute('type', 'password')
  //   pwdAgainInput.setAttribute('type', 'password')
  // }
})

// 点击登录，根据验证信息和是否注册来调用不同的API
const login = async (e: any) => {
  // 获取到用户输入框、密码输入框和登录按钮
  const userInput = userInputRef.value
  const pwdInput = passwordRef.value
  const pwdAgainInput = againPasswordRef.value
  // againPasswordRef

  // 阻止默认行为
  e.preventDefault()
  // 验证过程，###以后改成正则表达式
  let account = userInput.value
  let password = pwdInput.value
  if (account.length < 5) {
    ElMessage.error('用户名不能少于5位有效字符~')
    userInputAuthFlag.value = true
    setTimeout(() => {
      userInputAuthFlag.value = false
    }, 1500)
    return
  }
  if (password.length < 5) {
    ElMessage.error('用户密码不能少于5位有效字符~')
    pwdInputAuthFlag.value = true
    setTimeout(() => {
      pwdInputAuthFlag.value = false
    }, 1500)
    return
  }

  let info = {
    account,
    password,
    remAcc: remAcc.value,
  }

  // 测试用户名是否被注册
  if (!isUnregistered.value) {
    // 确认两次密码是否一致，不一致时重置输入框
    if (pwdAgainInput.value !== password) {
      ElMessage.error('两次输入密码不一致')
      pwdAgainInput.value = ''
      pwdInput.value = ''
      showPwd.value = true
      againPwdInputAuthFlag.value = true
      setTimeout(() => {
        againPwdInputAuthFlag.value = false
      }, 1500)
      return
    }
    // 再次确认是否要以该账号名称创建账号，创建后刷新页面（###以后是直接跳转到主页面）
    ElMessageBox.confirm(`确定要以${account}为账号名注册账号吗？`, '注册提示', {
      confirmButtonText: '确认',
      cancelButtonText: '我再想想',
      type: 'info',
    }).then(async () => {
      await userRegister(info)
      setTimeout(async () => {
        // 3秒跳转到主页
        await userLogin(info)
        router.push('/home')
      }, 3000)
    })
  } else {
    // 验证用户密码
    const {data: res} = await userLogin(info)
    if (!res) {
      pwdInput.value = ''
      return
    } else {
      // 跳转到主页
      router.push('/home')
    }
  }
}

// 输入用户名验证用户是否存在，改变title标题显示，切换注册或登录等
const watchTitle = () => {
  const userInput = userInputRef.value
  userInput.onkeyup = debounce(async () => {
    // 先置为false
    isShow.value = false
    const {data: res} = await getUserInfo(userInput.value)
    // 切换登录title
    if (userInput.value == '') {
      // 特判输入为空时
      title.value = 'Login'
      isUnregistered.value = false
    } else if (res.name) {
      isUnregistered.value = true
      title.value = `Hello~${res.name}`
    } else {
      isUnregistered.value = false
      title.value = '该用户未注册'
    }

    // 将得到的用户名展示，通过切换标签达到动画效果
    isShow.value = true
    // 将被保存用户名称的标题重置
    init.value = 'Login'
  }, 1000) as any
}

// 检查token是否存在，存在直接触发携带token的login
const initLogin = async () => {
  if (localStorage.getItem('token')) {
    const info = await userLogin()
    if (info.status == 200) {
      router.push('/home')
    }
  }
}

onMounted(() => {
  watchTitle()
  initLogin()
})
</script>

<style lang="less" scoped>
.login {
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &-main {
    background-color: white;
    padding: 1.5rem;
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0);
    display: flex;
    flex-direction: column;
    &-title {
      min-width: 12rem;
      box-sizing: border-box;
      margin: 2.5rem 0rem;
      text-align: center;
      font-weight: bold;
      font-size: 1.3rem;
    }
    &-input {
      border-radius: 3px;
      margin: 0.3rem 0;
      padding: 0.4rem;
      border: none;
      border: 2px solid rgba(0, 0, 0, 0);
      border-bottom: 2px solid rgb(190, 190, 190);
      &::placeholder {
        color: #666;
      }
      &:focus {
        outline: none;
        &::placeholder {
          color: white;
        }
      }
    }
    &-button {
      font-size: 0.625rem;
      padding: 0.4375rem;
      margin-top: 0.8rem;
      border: none;
      border-radius: 7px;
      color: white;
    }
    &-button-login {
      background: #4776e6; /* fallback for old browsers */
      background: -webkit-linear-gradient(to right, #8e54e9, #4776e6); /* Chrome 10-25, Safari 5.1-6 */
      background: linear-gradient(
        to right,
        #8e54e9,
        #4776e6
      ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
    &-button-register {
      background: #f2709c; /* fallback for old browsers */
      background: -webkit-linear-gradient(to top, #ff9472, #f2709c); /* Chrome 10-25, Safari 5.1-6 */
      background: linear-gradient(
        to top,
        #ff9472,
        #f2709c
      ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
    &-tips {
      margin: 0.625rem 0;
      text-align: center;
      font-size: 0.5rem;
      transition: 1s transform;
    }
    .biling {
      animation-name: biling;
      animation-duration: 1.5s;
    }
    .low-light {
      color: #333;
    }
    .high-light {
      color: #f2709c;
    }
  }
}
@keyframes biling {
  0% {
    border: 2px solid rgba(0, 0, 0, 0);
    border-bottom: 2px solid rgb(190, 190, 190);
  }
  15% {
    border: 2px solid #f2709c;
  }
  30% {
    border: 2px solid rgba(0, 0, 0, 0);
    border-bottom: 2px solid rgb(190, 190, 190);
  }
  45% {
    border: 2px solid #f2709c;
  }
  60% {
    border: 2px solid rgba(0, 0, 0, 0);
    border-bottom: 2px solid rgb(190, 190, 190);
  }
  75% {
    border: 2px solid #f2709c;
  }
  100% {
    border: 2px solid rgba(0, 0, 0, 0);
    border-bottom: 2px solid rgb(190, 190, 190);
  }
}
.disappear {
  opacity: 0;
}
</style>
