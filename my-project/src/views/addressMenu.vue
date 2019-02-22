<template>
  <div>
    <h1>配送地址</h1>
    <div class="addressWrap">
      <!-- 所选的地址 -->
        <!-- <ul><li>最终地址</li></ul> -->
        <div class="endAddress" >最终地址</div>
        <ul><li v-for="n in addressTitle">{{n}}</li></ul>
        <!-- 三个tab按钮 -->
        <ul>
            <li @click="eventTabA" ref="tabA">选择省</li>
            <li @click="eventTabB" ref="tabB" style="display:none">选择市</li>
            <li @click="eventTabC" ref="tabC" style="display:none">选择区</li>
        </ul>

        <!-- 省 -->
        <div class="nameList" ref="provinceRef">
            <ul>
                <li v-for="n in province" @click="provinceEvent(n)">{{n.name}}</li>
            </ul>
        </div>

        <!-- 市 -->
        <div class="nameList" ref="cityRef" style="display:none">
            <ul>
                <li v-for="n in city" @click="cityEvent(n)">{{n.name}}</li>
            </ul>
        </div>

        <!-- 区 -->
        <div class="nameList" ref="areaRef" style="display:none">
            <ul>
                <li v-for="n in area" @click="areaEvent(n)">{{n.name}}</li>
            </ul>
        </div>

    </div>
    <div class="telWrap">
        <h2>请写入电话号码:<input v-model="v_tel" type="text"/></h2>
    </div>
    <div class="payWrap">
        <span @click="insertInfo">提交数据</span>
    </div>
  </div> 
</template>

<script>
import axios from 'axios'

export default {
  name: 'addressMenu',
  data () {
    return {
      // msg: '配送地址',
      province:'',
      city:'',
      area:'',
      addressTitle : [],
      v_tel:'',
      streetName:'',
      addressId:''
    }
  },
  // 页面加载的时候发生
  mounted(){
      this.init();
  },
  methods:{
      init(){
        console.log()
          axios.get("/users/addressList")
          .then( (response) => {
              let res = response.data.result
              // console.log(res)
              this.province = res[0].province;
              this.city = res[1].city;
              this.area = res[2].area;

          } )
      },
      insertInfo(){
        for(var i=0; i<3;i++){
          this.streetName += this.addressTitle[i]
            
        }
          console.log(this.streetName)
              axios.post("/users/addressInfo",{
                  streetName:this.streetName,
                  tel:this.v_tel
              })
                  .then( (response) => {
                      let res = response.data;
                      // this.addressId = res.result.addressId;
                      this.streetName = res.result.streetName;
                      this.v_tel = res.result.tel;
                      // console.log(this.addressId)
                     this.$router.push({
                          path:'/orderConfirm?addressId='+res.result.addressId
                      }) 
                  } )
      },

      // 省的tab菜单
      provinceEvent( _n ){
          // console.log( _n )
          //vue实例共享同一个this，所以 this.$refs 能够获得此 vue 实例中所有的 ref 的引用 
          
          let _refs = this.$refs;
          this.addressTitle.push( _n.name );

          _refs.tabA.innerHTML = _n.name;
          _refs.tabB.style.display = 'block';
          _refs.tabB.innerHTML = '请选择市';

          _refs.provinceRef.style.display = 'none';
          _refs.cityRef.style.display = 'block';
      },

      // 市的tab菜单
      cityEvent( _n ){
          let _refs = this.$refs;
          this.addressTitle.push( _n.name );

          _refs.tabB.innerHTML = _n.name;
          _refs.tabC.style.display = 'block';
          _refs.tabC.innerHTML = '请选择区';

          _refs.cityRef.style.display = 'none';
          _refs.areaRef.style.display = 'block';
      },

      // 区的tab菜单
      areaEvent( _n ){
          let _refs = this.$refs;

          // this.addressTitle.splice(2,1);
          this.addressTitle.push( _n.name );

          _refs.tabC.innerHTML = _n.name;
          _refs.areaRef.style.display = 'none';
      },

      // 省市区的tab按钮
      eventTabA(){
           let _refs = this.$refs;

           _refs.tabA.innerHTML = '请选择省';
           _refs.tabB.style.display = 'none';
           _refs.tabC.style.display = 'none';

           _refs.provinceRef.style.display = 'block';
           _refs.cityRef.style.display = 'none';
           _refs.areaRef.style.display = 'none';

           this.addressTitle = [];
      },

       eventTabB(){
          let _refs = this.$refs;

          _refs.tabB.innerHTML = '请选择市';
          _refs.tabC.style.display = 'none';

          _refs.provinceRef.style.display = 'none';
          _refs.cityRef.style.display = 'block';
          _refs.areaRef.style.display = 'none';

          this.addressTitle.splice(1,2);
      },

       eventTabC(){
          let _refs = this.$refs;

          _refs.tabC.innerHTML = '请选择区';

          _refs.provinceRef.style.display = 'none';
          _refs.cityRef.style.display = 'none';
          _refs.areaRef.style.display = 'block';

          this.addressTitle.splice(2,1);
      }
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
      *{margin:0;padding:0;border:0;}
      ul,ol,li{list-style: none;}
      div h1{
          text-align:center;
          margin-top:50px;
          margin-bottom:30px;
          font-size:30px;
          color:#800080;

      }
      .endAddress{
          height:50px;margin-left:30px;margin-top:40px;font-size:24px;
      }
      .addressWrap ul.addressTitle{
          background: #fff;border:1px solid #000;margin:10px;padding:0;border-radius: 10px;
        }
      .addressWrap ul.addressTitle li{background: #fff;padding:0;margin:10px;}
      /**/
      .addressWrap{
        width:500px;height: 300px;background: #eee;border:1px solid #ddd;margin:0 auto;
      }
      .addressWrap ul{
        clear: both;padding: 10px;background: #C0C0C0;display: block;overflow: hidden;
      }
      .addressWrap ul li{
        font-size: 14px;padding:5px;
        float: left;margin-left: 10px;background: #ddd;cursor: pointer;
      }
      .addressWrap ul li:hover{
        background: #eee;
      }
      /**/
      .nameList{
        clear: both;margin:30px;background: #ADD8E6;padding: 10px;
      }
      .nameList ul{
        clear: both;padding: 10px;background: #ADD8E6;display: block;overflow: hidden;
      }
      .nameList ul li{
        font-size: 14px;padding:5px;
        float: left;margin-left: 10px;background: #ddd;cursor: pointer;
      }
      .nameList ul li:hover{
        background: #eee;
      }
      .payWrap{
          width:500px;
          height:60px;
          background:#F4A460;
          border-radius:5px;
          margin:0 auto;
          cursor:pointer;
      }
       .payWrap span{
          
          line-height:60px;
          
          font-size:20px;
          
          padding-left:200px;
      } 
      .telWrap{
          width:500px;
          height:50px;
          background:#eee;
          margin:0 auto;
      }
      .telWrap h2{
          padding-left:30px;
          font-size:20px;
      }
      .telWrap input{
          height:30px;
          margin-left:20px;
          padding-left:12px;
      }
</style>
