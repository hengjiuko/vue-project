<template>
    <div>
        <div class="orderSuccess">
            <img src="/static/ok-2.png"/>
            <div class="orderWrap">
                <span>Order ID :{{orderId}}</span>
                <span>Order total :{{orderTotal | currency('￥')}}</span>
                <div>
                  <router-link class="btn btn--m" to="/cart">Cart List</router-link>
                </div>
                <div>
                  <router-link class="btn btn--m" to="/">Goods List</router-link>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
    import {currency} from './../util/currency'
    import axios from 'axios'
    export default{
        data(){
            return{
                orderId:'',
                orderTotal:0
            }
        },
        filters:{
            currency:currency
        },
        mounted(){
            var orderId = this.$route.query.orderId;
            // console.log("orderId:"+orderId);
            if(!orderId){
              return;
            }
            axios.get("/users/orderDetail",{
                params:{
                  orderId:orderId
                }
            }).then((response)=>{
              // console.log(response)
                let res = response.data;
                if(res.status=='0'){
                    this.orderId = orderId;
                    this.orderTotal = res.result.orderTotal;
                }
            });
        }
    }
</script>
<style>
    .orderSuccess{
        position: fixed;
        top : 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #eee;
        opacity: 0.5;
    }
    .orderSuccess img{
        width:150px;
        height:200px;
        margin-left:670px;
        margin-top:30px;
    }
    .orderWrap{
        position: fixed;
        top : 0;
        left : 0;
        right : 0;
        bottom: 0;
        margin: auto;
        width: 500px;
        height: 150px;
        background: #fff;
        padding-top:150px;
    }
    .orderWrap span{
        padding-left:60px;
    }
    .orderTo{

        /*margin-top:200px;*/
        margin-left:700px;
        /*padding-right:120px;*/
    }
    .orderWrap div{
        margin-top:20px;
        margin-left:190px;
        font-size:18px;
    }
    

</style>
