<template>
    <div>
        <nav-header></nav-header>
        <div class="cartTitle">
            <ul>
              <li class="w_1">
                <!-- <input type='checkbox' v-bind:checked="checkAllFlag"  @click="toggleCheckAll"/> -->
              </li>
              <li class="w_2">商品图片</li>
              <li class="w_3">商品名称</li>
              <li class="w_4">单价</li>
              <li class="w_5">数量</li>
              <li class="w_6">小计</li>
              <li>操作</li>
            </ul>
          </div>

          <div class="cartWrap cle" v-for="item in cartList">
            <div class="line"></div>
            <div class="goodsWrap">
              <ul>
                <li class="w_1">
                    <input type='checkbox' @click="editCart('check',item)" v-model="item.checked"/>
                </li>
                <li class="w_2">
                  <img :src="'/static/'+item.productImage" :alt="item.productName" />
                </li>
                <li class="w_3">{{item.productName}}</li>
                <li class="w_4">{{item.salePrice | currency('￥')}}</li>
                <li class="w_5">
                  <div class="enterGoodsNum">
                    <input class="minsBtn" type='button' value='-' @click="editCart('minus',item)"/>
                    <input class="enterNum" type='text' :value="item.productNum" />
                    <input class="addBtn" type='button' value='+' @click="editCart('add',item)"/>
                  </div>
                </li>
                <li class="w_6">{{(item.salePrice*item.productNum) | currency('￥')}}</li>
                <li @click="delGoodsFn(item.productId)">删除</li>
              </ul>
          </div>
        </div>

        <div class="cartFooter">
          <input type='checkbox' class="footerCheck" v-bind:checked="checkAllFlag"  @click="toggleCheckAll"/>
          <label class="mt22 fl mr10">全选</label>
          <p class="mt22 fl">删除选中的商品</p>

          <div class="footerA">已选择<i>{{totalNum}}</i>件商品</div>
          <div class="footerB">总价：<i>{{totalPrice | currency('￥')}}</i></div>
          <router-link class="gotoPay" to="/addressMenu">去结算</router-link>
        </div>

        <!--点击删除时的确认框  -->
        <div class="delWrap" v-show="isShow">
          <p>你确认要删除此条数据吗？</p>
          <div class="btnGroup">
            <div>
                <label @click="delGoodsSuc">确认</label>
            </div>
            <div>
                <em @click="isShow=false">取消</em>
            </div>
          </div>
        </div>
        <!-- 弹出层遮罩 -->
      <div class="layer-mask" v-show="isShow"></div>
    </div>
</template>

<script>
import './../assets/css/cart.css'
import NavHeader from '@/components/NavHeader'
import axios from 'axios'
// 定义过滤器
import {currency} from './../util/currency'

export default {
    data(){
        return {
            cartList:'',
            isShow:false,
            productId:''
            
        }
    },
    components:{
        NavHeader
    },
    // 过滤器
    filters:{
        currency:currency
    },

    mounted(){
        this.init();
    },

    computed:{
          checkAllFlag(){
            return this.checkedCount == this.cartList.length;
          },
          checkedCount(){
            var i = 0;
            this.cartList.forEach((item)=>{
              if(item.checked==true)i++;
            })
            return i;
          },
          totalPrice(){
              var money = 0;
              this.cartList.forEach((item)=>{
                  if(item.checked==true){
                      money += parseFloat(item.salePrice) * parseInt(item.productNum) 
                  }
              })
              return money;
          },
          totalNum(){
              var num = 0;
              this.cartList.forEach((item)=>{
                  if(item.checked==true){
                      num += parseInt(item.productNum) 
                  }
              })
              return num;
          }
    },

    methods:{

        // 获取购物车列表信息
        init(){
            axios.get('/users/cartList')
                .then( (response) => {
                    let res = response.data;
                    this.cartList = res.result;
                } );
        },

        // 点击删除时让对话框显示
        delGoodsFn(productId){
            this.isShow = true;
            this.productId = productId;
        },
        // 确认删除购物车数据
        delGoodsSuc(){
            // console.log(this.productId)

            axios.post('/users/delCart',{
                productId:this.productId
            })
                .then( (response) => {
                    let res = response.data;
                    // console.log(res.status)
                    if(res.status=="0"){
                        this.isShow = false;
                        this.init();
                    }

                } )
        },
        // 点击加减和选中功能发生事件
        editCart(flag,item){
            if(flag=="add"){
                item.productNum++;
            }else
            if(flag=="minus"){
                if(item.productNum<=1){
                    return;
                }
                    item.productNum--;
            }else{
                // item.checked = item.checked==true?false:true;
                item.checked = !item.checked
            }
            // console.log(item.checked)
            axios.post('/users/cartEdit',{
                productId:item.productId,
                productNum:item.productNum,
                checked:item.checked
            })
                .then( (response) => {
                    let res = response.data;

                } )
        },

        // 点击全选按钮的实现
        toggleCheckAll(){
            var flag = !this.checkAllFlag;
            this.cartList.forEach( (item) => {
                item.checked = flag;
            } );
            console.log()
            axios.post('/users/editCheckAll',{
                checkAll:flag
            })
                .then( (response) => {
                    let res = response.data;
                    if(res.status=='0'){
                        // console.log("save success");
                    }
                } )

        }
        
    }
}
</script>
<style>

/*弹出层遮罩*/
.layer-mask
{
    z-index: 99999;
    position: fixed;
    top : 0;
    left: 0;
    width: 100%;
    height: 100%;

    background: #000;
    opacity: 0.5;
}
.delWrap{
    z-index : 100000;
    position: fixed;
    top : 0;
    left : 0;
    right : 0;
    bottom: 0;
    margin: auto;

    width: 500px;
    height: 300px;
    background: #fff;
}
.delWrap p{
    margin:60px 100px;
    font-size:18px;
}
.btnGroup div{
    width:120px;
    height:30px;
    border:1px solid #F00;
    margin-left:80px;
    margin-top:80px;
    float:left;
    border-radius:7px;

}
.btnGroup div label{
    font-size:18px;
    padding-left:40px;
    line-height:30px;
    color:#000;
    cursor:pointer;
}
.btnGroup em{
    font-size:18px;
    padding-left:40px;
    line-height:30px;
    color:#000;
    cursor:pointer;
}
</style>

