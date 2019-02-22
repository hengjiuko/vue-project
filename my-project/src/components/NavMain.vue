<template>
  <div>
      <div class="mainWrap">

            <div class="subNav">
                <ul>
                    <li>
                        <p @mouseover="tabAFn" @mouseout="tabALn">家用电器</p>
                        <div class="pupUpDiv" @mouseover="tabAFn" @mouseout="tabALn" v-show="isShow1">
                            <p>冰箱</p>
                            <p>电视</p>
                            <p>洗衣机</p>
                        </div>
                    </li>
                    <li>
                        <p @mouseover="tabBFn" @mouseout="tabBLn">手机</p>
                        <div class="pupUpDiv" @mouseover="tabBFn" @mouseout="tabBLn" v-show="isShow2">
                            <p>华为</p>
                            <p>小米</p>
                            <p>魅族</p>
                        </div>
                    </li>
                    <li>
                        <p @mouseover="tabCFn" @mouseout="tabCLn">电脑</p>
                        <div class="pupUpDiv" @mouseover="tabCFn" @mouseout="tabCLn" v-show="isShow3">
                            <p>神州</p>
                            <p>华为</p>
                            <p>小米电脑</p>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="sliderWrap" @mouseover="clear">
                <label @click="leftBtnEvent"><<</label>
                <ul ref="ulRefId" @mouseover="clear" @mouseout="run">
                    <li>
                        <img src="./../../static/img/bg1.jpg" />
                    </li>
                    <li>
                        <img src="./../../static/img/bg2.jpg" />
                    </li>
                    <li>
                        <img src="./../../static/img/bg3.jpg" />
                    </li>
                </ul>
                <span @click="rightBtnEvent">>></span>
                <!-- <div class="pointer">
                    <p></p>
                    <p class="redLi"></p>
                    <p></p>
                </div> -->
                <div class="pointerBg"></div>
            </div>

            <div class="adWrap mt10">
                <p class="fl">
                    <!-- <img src="images/temp/5.jpg" /> -->
                </p>
                <p class="fr">
                    <!-- <img src="images/temp/6.jpg" /> -->
                </p>
            </div>
        </div>
  </div>
</template>

<script>


export default {
    data(){
        return {
            isShow1:false,
            isShow2:false,
            isShow3:false,
            inx:0,
            invId:''

        }
    },
    mounted(){
        this.run();
    },
    methods:{
        tabAFn(){
            this.isShow1 = true
        },
        tabALn(){
            this.isShow1 = false
        },
         tabBFn(){
            this.isShow2 = true
        },
        tabBLn(){
            this.isShow2 = false
        },
        tabCFn(){
            this.isShow3 = true
        },
        tabCLn(){
            this.isShow3 = false
        },
        leftBtnEvent(){
          // console.log( '123' )
            this.inx++;
                if(this.inx>2){
                this.inx=0;
            }
            this.$refs.ulRefId.style.left = -(this.inx*995) + 'px';
        },
        rightBtnEvent(){
             // console.log( '123' )
            this.inx--;
               if(this.inx<0){
                   this.inx=2;
            }
            this.$refs.ulRefId.style.left = -(this.inx*995) + 'px';
        },
        run(){
            this.invId = setInterval(() => {
                this.rightBtnEvent()
            },2000)
        },
        clear(){
            clearInterval(this.invId)
        }

    }

}
</script>

