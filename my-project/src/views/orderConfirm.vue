<template>
    <div>
        <h1>订单确认</h1>
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
              <!-- <li>操作</li> -->
            </ul>
        </div>

        <div class="cartWrap cle" v-for="item in cartList" v-if="item.checked==true">
            <div class="line"></div>
            <div class="goodsWrap">
              <ul>
                <!-- <li class="w_1">
                    <input type='checkbox' />
                </li> -->
                <li class="imageWrap">
                    <img :src="'/static/'+item.productImage" :alt="item.productName" />
                </li>
                <li class="w_3">{{item.productName}}</li>
                <li class="w_4">{{(item.salePrice) | currency('￥')}}</li>
                <li class="w_5">
                  <div class="enterGoodsNum">
                     <span>x{{item.productNum}}</span>
                  </div>
                </li>
                <li class="w_6">{{(item.salePrice*item.productNum) | currency('￥')}}</li>
              </ul>
            </div>
        </div>
        <div class="orderFooter">
          <div class="footerNum">共<i>{{orderNum}}</i>件商品</div>
          <div class="footerMoney">总价：<i>{{orderTotal | currency('￥')}}</i></div>
          <div class="footerPay" @click="payMent">去结算</div>
          <!-- <router-link class="footerPay" to="/orderSuccess">去结算</router-link> -->
        </div> 
      </div>

        
</template>

<script>
import './../assets/css/orderConfirm.css'
import axios from 'axios'
// 定义过滤器
import {currency} from './../util/currency'

export default {
    data(){
        return {
            cartList:[],
            orderNum:0,
            orderTotal:0,
            addressId:''
        }
    },
    mounted(){
        this.init();
    },
    filters:{
        currency:currency
    },
    methods:{
        init(){
            axios.get('/users/cartList')
                .then( (response) => {
                    let res = response.data;
                    this.cartList = res.result;
                    this.cartList.forEach( (item) => {
                        if(item.checked == true){
                            // console.log(item.productNum)
                            this.orderNum += item.productNum;
                            this.orderTotal += item.salePrice * item.productNum; 
                        }
                    } );
                } )
        },
        payMent(){
              this.addressId = location.hash.substring(25,30)
              // console.log(this.addressId)
              axios.post("/users/payMent",{
                addressId:this.addressId,
                orderTotal:this.orderTotal
              }).then((response)=>{
                  let res = response.data;
                  if(res.status=="0"){
                      this.$router.push({
                          path:'/orderSuccess?orderId='+res.result.orderId
                      })
                  }
              })
          }
    }
}
</script>
<style>
h1{
    text-align:center;
    font-size:30px;
    margin:30px;
}

</style>

