<template>
  <div>
    <el-dialog :lock-scroll="false" class="dialog" center title="账号密码登录" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="账号" :label-width="formLabelWidth" prop="email">
          <el-input placeholder="请输入账号" @keyup.enter.native="login" v-model="form.email"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input placeholder="请输入密码" @keyup.enter.native="login" v-model="form.password" autocomplete="off"
                    show-password></el-input>
        </el-form-item>
      </el-form>
      <el-button type="success" class="loginBtn" @click="login" round>登录</el-button>

      <div class="regitstBtn">
        <span class="regist" @click="handleRegister(1)">账号注册</span>
        <span class="forget" @click="handleRegister(2)">忘记密码</span>
      </div>

      <div>
        <div class="social-login-title">社交账号登录</div>
        <div class="social-login-wrapper">
          <a v-show="isShow(2)" @click="qqLogin">
            <svg-icon icon-class="qq"/>
          </a>

          <a v-show="isShow(4)" @click="openAuthLogin('gitee')">
            <svg-icon icon-class="gitee"/>
          </a>
          <a v-show="isShow(3)" @click="openAuthLogin('weibo')">
            <svg-icon icon-class="weibo"/>
          </a>
          <a v-show="isShow(5)" @click="openWechat">
            <svg-icon icon-class="wechat"/>
          </a>
          <a v-show="isShow(6)" @click="openAuthLogin('github')">
            <svg-icon icon-class="github"/>
          </a>
        </div>
      </div>
    </el-dialog>

    <!-- 微信登录 -->
    <el-dialog :lock-scroll="false" class="dialog" title="微信扫码登录" center :visible.sync="wechatLoginFlag"
               :before-close="close">
      <el-image class="wxImg" src="http://img.shiyit.com/wechatQr.jpg">
        <div slot="error" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
      <div style="text-align: center;">
        <p>
          扫码关注公众号，回复验证码完成登录
        </p>
        <p>
          登录验证码： <span style="color: red;margin-right: 5px;">{{ this.wechatLoginCode }}</span>
          <i style="cursor: url(http://127.0.0.1:8800/shiyi/file/link.cur),pointer;" @click="getWecahtLoginCode()"
             class="el-icon-refresh"></i>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bacKLogin">返回登录</el-button>
      </div>
    </el-dialog>

    <!-- 邮箱注册 -->
    <el-dialog :lock-scroll="false" class="dialog " title="邮箱注册" center :visible.sync="emailRegistFlag">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-position="left">
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input class="input" placeholder="请输入邮箱" v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth" prop="password">
          <el-input class="input" placeholder="请输入昵称" v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input class="input" placeholder="请输入密码" v-model="form.password" autocomplete="off"
                    show-password></el-input>
        </el-form-item>
        <el-form-item label="验证码" :label-width="formLabelWidth" prop="code">
          <div style="display: flex;">
            <el-input class="input" placeholder="请输入验证码" v-model="form.code" autocomplete="off"></el-input>
            <a v-if="showSendBtnFlag" class="send" @click="handleSendEmailCode">发送</a>
            <a v-else class="send">{{ countdown }}s</a>
          </div>
        </el-form-item>
      </el-form>

      <el-button type="danger" class="loginBtn" @click="register" round>注册</el-button>

      <div class="goLoginBtn">
        已有账号，<a @click="bacKLogin">去登录</a>
      </div>
    </el-dialog>


    <!-- 忘记密码 -->
    <el-dialog :lock-scroll="false" class="dialog " title="忘记密码" center :visible.sync="forgetFlag">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-position="left">
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input class="input" placeholder="请输入邮箱" v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="password">
          <el-input class="input" placeholder="请输入密码" v-model="form.password" autocomplete="off"
                    show-password></el-input>
        </el-form-item>
        <el-form-item label="验证码" :label-width="formLabelWidth" prop="code">
          <div style="display: flex;">
            <el-input class="input" placeholder="请输入验证码" v-model="form.code" autocomplete="off"></el-input>
            <a v-if="showSendBtnFlag" class="send" @click="handleSendEmailCode">发送</a>
            <a v-else class="send">{{ countdown }}s</a>
          </div>
        </el-form-item>
      </el-form>

      <el-button type="primary" class="loginBtn" @click="login" round>修改</el-button>

      <div class="goLoginBtn">
        已有账号，<a @click="bacKLogin">去登录</a>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import {emailLogin, wxIsLogin, openAuthUrl, getWechatLoginCode, sendEmailCode, emailRegister} from "@/api";
import {setUrl, setToken} from '@/utils/cookieUtil'

import {mapState, mapMutations , mapActions} from 'vuex';

export default {
  data: function () {
    return {
      form: {
        email: null,
        password: null,
      },
      code: null,
      timer: null,
      wechatLoginFlag: false,
      emailRegistFlag: false,
      // showSendBtnFlag: true,
      forgetFlag: false,
      formLabelWidth: '80px',
      wechatLoginCode: null,
      // countdown: 60, // 倒计时初始值为 60 秒
      rules: {
        email: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      }
    };
  },

  computed: {
    dialogFormVisible: {
      set(value) {
        this.$store.state.loginFlag = value;
      },
      get() {
        return this.$store.state.loginFlag;
      }
    },
    // ...mapState('timer', ['showSendBtnFlag', 'countdown']),
    showSendBtnFlag() {
      return this.$store.state.timer.showSendBtnFlag;
    },
    countdown() {
      return this.$store.state.timer.countdown;
    },
  },
  methods: {
    ...mapMutations('timer', ['setShowSendBtnFlag', 'setCountdown']),
    ...mapActions('timer', ['startTimer']),
    handleSendEmailCode() {
      if (this.form.email == null || this.form.email == '') {
        this.$notify({
          title: '失败',
          message: '请输入邮箱',
          type: 'error'
        });
        return
      }
      sendEmailCode(this.form.email).then(res => {
        // 老版有bug,一切换计时器停止
        // this.timer = setInterval(() => {
        //     if (this.countdown > 0) {
        //         this.showSendBtnFlag = false
        //         this.countdown--;
        //     } else {
        //         this.showSendBtnFlag = true
        //         clearInterval(this.timer);
        //         this.timer = null;
        //         this.countdown = 60
        //     }
        // }, 1000);

        // 新版使用vuex全局计时器
        // 调用映射的 startTimer action
        this.startTimer();

        this.$notify({
          title: '成功',
          message: '验证码发送成功',
          type: 'success'
        });
      })
    },
    register() {
      var reg = /^[A-Za-z0-9\u4e00-\u9fa5_]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!reg.test(this.form.email)) {
        this.$notify({
          title: '失败',
          message: '邮箱格式不正确',
          type: 'error'
        })
        return false
      }
      if (this.form.code.trim().length !== 6) {
        this.$notify({ title: '失败', type: 'error', message: '请输入6位验证码' })
        return false
      }
      if (this.form.password.trim().length < 6) {
        this.$notify({ title: '失败', type: 'error', message: '密码不能少于6位' })
        return false
      }
      if (this.form.nickname.trim().length < 2) {
        this.$notify({ title: '失败', type: 'error', message: '昵称不能少于2位' })
        return false
      }
      const user = {
        email: this.form.email,
        password: this.form.password,
        nickname: this.form.nickname,
        code: this.form.code
      }
      emailRegister(user).then(res => {
        emailLogin({ email: user.email, password: user.password }).then(res => {
          this.username = ''
          this.password = ''
          this.nickname = ''
          this.$store.commit('login', res.data)
          this.$store.commit('closeModel')
          this.$notify({ title: '成功', type: 'success', message: '登录成功' })
        })
      }).catch(err => {
        this.$notify({ title: '失败', type: 'error', message: err.message })
      })
    },
    handleRegister(type) {
      this.$store.state.loginFlag = false;
      if (type == 1) {
        this.emailRegistFlag = true
      } else {
        this.forgetFlag = true
      }
    },
    close() {
      clearInterval(this.timer);
      this.$store.state.loginFlag = false;
      this.wechatLoginFlag = false
    },
    openWechat() {
      this.getWecahtLoginCode()
      this.wechatLoginFlag = true
      this.$store.state.loginFlag = false;
    },
    getWecahtLoginCode() {
      getWechatLoginCode().then(res => {
        this.wechatLoginCode = res.data
        this.$notify({
          title: '成功',
          message: '验证码获取成功',
          type: 'success'
        });
        this.countdown = 60
        this.timer = setInterval(() => {
          if (this.countdown > 0) {
            this.countdown--
            // 轮询判断用户是否已经登录
            wxIsLogin(this.wechatLoginCode).then(res => {
              setToken(res.data.token)
              this.$store.commit("setUserInfo", res.data)
              this.close()
              if (res.data.email == null) {
                this.$notify({
                  title: '警告',
                  message: '请绑定邮箱以便及时收到回复',
                  type: 'warning'
                });
              } else {
                this.$notify({
                  title: '成功',
                  message: '登录成功',
                  type: 'success'
                });
              }
              location.reload()
            })
          } else {
            // 倒计时结束，处理逻辑
            clearInterval(this.timer);
            this.wechatLoginCode = "验证码失效，请刷新获取"
          }
        }, 1000);
      })
    },
    bacKLogin() {
      clearInterval(this.timer);
      this.$store.state.loginFlag = true
      this.wechatLoginFlag = false
      this.forgetFlag = false
      this.emailRegistFlag = false
    },
    isShow(type) {
      return this.$store.state.webSiteInfo.loginTypeList.indexOf(type) != -1
    },
    //Enter事件
    handkeyEnter(event) {
      if (event.keyCode == 13) {
        this.login()
      }
    },
    login() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          //发送登录请求
          emailLogin(this.form).then(res => {
            setToken(res.data.token)
            this.$store.commit("setUserInfo", res.data)
            this.close()
            this.$notify({
              title: '成功',
              message: '登录成功',
              type: 'success'
            });
            location.reload()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    qqLogin() {
      //保留当前路径
      this.settingUrl()
      if (
          navigator.userAgent.match(
              /(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i
          )
      ) {
        // eslint-disable-next-line no-undef
        QC.Login.showPopup({
          appId: this.config.QQ_CLIENT_ID,
          redirectURI: this.config.QQ_REDIRECT_URL
        });
      } else {
        openAuthUrl("qq").then(res => {
          window.open(res.data);
        });
      }
    },
    openAuthLogin(source) {
      //保留当前路径
      this.settingUrl()
      openAuthUrl(source).then(res => {
        window.open(res.data);
      });
    },
    settingUrl() {
      if (this.$route.path == "/articleInfo") {
        setUrl("articleId=" + this.$route.query.articleId)
      } else {
        setUrl(this.$route.path)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog {
  @media screen and (max-width: 1118px) {
    /deep/ .el-dialog {
      width: 100%;
    }
  }

  @media screen and (min-width: 1119px) {
    /deep/ .el-dialog {
      width: 25%;
      border-radius: 10px;
    }
  }


  .wxImg {
    width: 50%;
    display: block;
    margin: 0 auto;
  }


  .loginBtn {
    margin-top: 30px;
    text-align: center;
    display: block;
    margin: 0 auto;
    width: 50%;
  }

  .regitstBtn {

    .regist,
    .forget {
      cursor: url(http://127.0.0.1:8800/shiyi/file/link.cur), pointer;

      &:hover {
        color: var(--theme-color);
      }
    }

    .forget {
      float: right;
    }
  }

  /deep/ .input input {
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;


  }

  .send {
    width: 18%;
    color: var(--text-color);
    font-size: 14px;
    border: none;
    background-color: var(--background-color);

    &:hover {
      color: var(--theme-color)
    }
  }

  .goLoginBtn {
    margin-top: 20px;

    a {
      color: red;
    }
  }

  .social-login-title {
    margin-top: 1.5rem;
    color: #b5b5b5;
    font-size: 0.75rem;
    text-align: center;

    &::before {
      content: "";
      display: inline-block;
      background-color: #d8d8d8;
      width: 60px;
      height: 1px;
      margin: 0 12px;
      vertical-align: middle;
    }

    &::after {
      content: "";
      display: inline-block;
      background-color: #d8d8d8;
      width: 60px;
      height: 1px;
      margin: 0 12px;
      vertical-align: middle;
    }
  }

  .social-login-wrapper {
    margin-top: 1rem;
    font-size: 2rem;
    text-align: center;

    a {
      text-decoration: none;
      margin-left: 20px;

      svg {
        width: 30px;
        height: 30px;
      }
    }
  }
}
</style>
