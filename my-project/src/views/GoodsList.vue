<template>
  <div>
      <nav-header></nav-header>
      <nav-main></nav-main>
      <div class="goodsList">
          <div class="goodsListWrap">         
            <ul>
              <li v-for="item in goodsList">
                <div class="pic">
                  <a href="#"><img :src="'static/' + item.productImage" alt=""></a>
                </div>
                <div class="main">
                  <div class="name">{{item.productName}}</div>
                  <div class="price">{{item.salePrice}}</div>
                  <div class="btn">
                    <a href="javascript:;" class="cartBtn" @click="addCart(item.productId)">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
      </div>
      <!-- 弹出层遮罩 -->
      <div class="layer-mask" v-show="layerMask"></div>

      <!-- 没登录加购物车时显示 -->
      <div class="noAddCartWrap" v-show="isShow">
          <p>请先登录,否则无法加入到购物车中!</p>
          <div>
              <label @click="closeBtn">关闭</label>
          </div>
      </div>

      <!-- 登录后加购物车时显示 -->
      <div class="addCartWrap" v-show="isHave">
          <p>加入购物车成功</p>
          <div class="btnGroup">
            <div>
                <a  href="javascript:;" @click="goOnShop">继续购物</a> 
            </div>
            <div>
                <router-link class="seeCart"  to="/cart">查看购物车</router-link> 
            </div>
          </div>
      </div>
      <nav-footer></nav-footer>
  </div>
</template>

<script>
import '@/assets/css/style.css'
import NavHeader from '@/components/NavHeader'
import NavMain from '@/components/NavMain'
import NavFooter from '@/components/NavFooter'
import axios from 'axios'

export default {
    data(){
        return {
            goodsList:[],
            isShow:false,
            isHave:false,
            layerMask:false
        }
    },
    components:{
        NavHeader,
        NavMain,
        NavFooter
    },
    mounted(){
        axios.get('/goods/list')
            .then( (_res) => {
                // console.log(_goods.data.result.list)
                this.goodsList = _res.data.result.list
            } );
    },
    methods:{
        addCart(productId){
            axios.post('/goods/addCart',{
                productId:productId
            })
                .then( (response) => {
                    let res = response.data
                  // console.log(res)
                    if(res.status=="0"){
                        this.isHave = true;
                        this.layerMask = true;
                    }else{
                        this.isShow = true;
                        this.layerMask = true;
                    }
                } )
        },
        closeBtn(){
            this.isShow = false;
            this.layerMask = false;
        },
        goOnShop(){
            this.isHave = false;
            this.layerMask = false;          
        }
    }


}
</script>
<style>
/*弹出层遮罩*/
.layer-mask
{
    /*display: none;*/
    z-index: 99999;
    position: fixed;
    top : 0;
    left: 0;
    width: 100%;
    height: 100%;

    background: #000;
    opacity: 0.5;
}
.noAddCartWrap{
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
.noAddCartWrap p{
    margin:60px 100px;
    font-size:18px;
}
.noAddCartWrap div{
    width:200px;
    height:35px;
    border:1px solid #F00;
    margin: auto;
    margin-top:120px;
}
.noAddCartWrap div label{
    padding-left:75px;
    line-height:35px;
}
.addCartWrap{
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
.addCartWrap p{
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
.btnGroup div a{
    font-size:18px;
    padding-left:20px;
    line-height:30px;
    color:#000;
}
.btnGroup .seeCart{
    font-size:18px;
    padding-left:20px;
    line-height:30px;
    color:#000;
}
</style>

