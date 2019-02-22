<template>
  <div>
      <div class="header">
        <div class="headerNav">
            <ul>
                <li>中国大陆</li>
                <li v-text="nickName" v-if="nickName"></li>
                <li @click = "loginFn" v-if="!nickName" >请登录</li>
                <li @click="logout" v-if="nickName">退出</li>
                <li class="redLi">免费注册</li>
                <li>手机逛淘宝</li>
            </ul>
            <ul class="two">
                <li>淘宝网首页</li>
                <li>我的订单</li>
                <li>网站导航</li>
                <li>商品分类</li>
            </ul>
        
        </div>
        <div class="headerSearch">
            <img src="./../../static/img/img1.jpg">
            <input type="text" class="searchInput"  :value="msg" @focus="searchFn" @blur="noSearchFn"/>
            <input type="button" class="searchBtn"/>
        </div>
        <div class="headerColumn">
                <ul>
                    <!-- <li>首页</li> -->
                    <li>优惠卷</li>
                    <li>所有商品</li>
                    <li>本月推荐</li>
                    <li>发现好物</li>
                    <li>智能数码</li>
                </ul>
        </div>
    </div>
    <!-- 弹出层遮罩 -->
    <div class="layer-mask" v-show="isShow"></div>
    <!-- 弹出层窗体 -->
    <div class="layer-pop" v-show="isShow" >
        <!-- 弹出层关闭按钮 -->
        <div ref="layer-close" class="layer-close" @click="closeFn" >×</div>
        <!-- 弹出层内容区域 -->
        <div ref="layer-content" class="layer-content"  >
            <!-- 登录窗体 -->
            <div ref="loginHtml">
                <!-- 登录窗体 -->
                <div class="login">
                    <h4 class="title">登 录</h4>
                    <div class="item">
                        <label>账号</label>
                        <input id="username" class="input" v-model="userName" name="username" type="text"/>
                        <p class="error-msg"></p>
                    </div>
                    <div class="item">
                        <label>密码</label>
                        <input id="password" class="input" v-model="userPwd" name="password" type="password"/>
                    </div>
                    <div class="error" v-show="errorTip">用户名或密码错误</div>
                    <div class="item">
                        <label>&nbsp;</label>
                        <input id="loginSubmitBtn" type="submit" class="submit" value="登录" @click="login"/>
                    </div>
                </div>
            </div>

            
        </div>
    </div>

    
  </div>
</template>

<script>
import './../assets/css/login.css'
import axios from 'axios'

export default {
    data(){
        return {
            isShow:false,
            userName:'',
            userPwd:'',
            errorTip:false,
            nickName:'',
            msg:'搜索天猫全球官方店'
        }
    },
    mounted(){
        this.checkLogin();
    },
    methods:{

        // 搜索有焦点时显示
        searchFn(){
            this.msg = '';
        },

        // 搜索失去焦点时显示
        noSearchFn(){
            this.msg = '搜索天猫全球官方店'
        },

        // 点击请登录时显示登录框
        loginFn(){
            this.isShow=true;
        },

        // 点击x时关闭
        closeFn(){
            this.isShow=false;
        },

        // 登录时事件
        login(){
            if( !this.userName || !this.userPwd ){
                this.errorTip = true;
                return;
            }
            axios.post('/users/login',{
                userName:this.userName,
                userPwd:this.userPwd
            })
                .then( (response) => {
                    // console.log(response)
                    let res = response.data;
                    // console.log(res)
                    if(res.status=="0"){
                        this.errorTip = false;
                        this.isShow = false;
                        this.nickName = res.result.userName;
                    }else{
                        this.errorTip==true;
                    }
                } )
        },

        // 登出时事件
        logout(){
            axios.post('/users/logout')
                .then( (response) => {
                    let res = response.data;
                    if(res.status=="0"){
                        this.nickName = '';
                    }
                } )
        },

        // 校验事件，刷新后登录依然存在
        checkLogin(){
            axios.get("/users/checkLogin")
                .then( (response) => {
                    let res = response.data;
                    if(res.status=="0"){
                        this.nickName = res.result;
                    }
                } )
        }

        
    }

}
</script>

