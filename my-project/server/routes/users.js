var express = require('express');
var router = express.Router();
var User = require('../models/user');
require('./../util/util')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 登录接口
router.post('/login',function(req,res,next){
    var param = {
        userName:req.body.userName,
        userPwd:req.body.userPwd
    }

    User.findOne(param,function(err,doc){
        if(err){
            res.json({
                status:"1",
                msg:err.message
            });
        }else{
            if(doc){
                res.cookie("userId",doc.userId,{
                    path:'/',
                    maxAge:1000*60*60
                });
                res.cookie("userName",doc.userName,{
                    path:'/',
                    maxAge:1000*60*60
                });
                res.json({
                    status:"0",
                    msg:'',
                    result:{
                        userName:doc.userName
                    }
                });
            }
        }
    });
});

// 登出接口
router.post('/logout',function(req,res,next){
    res.cookie("userId","",{
        post:'/',
        maxAge:-1
    });

    res.json({
        status:"0",
        msg:'',
        result:''
    })
});

// 用户校验,刷新后登录依然存在
router.get('/checkLogin',function(req,res,next){
    if(req.cookies.userId){
        res.json({
            status:"0",
            msg:"",
            result:req.cookies.userName || ""
        });
    }else{
            res.json({
                status:"1",
                msg:"未登录",
                result:""
            });
        }
});

// 查询当前用户购物车数据
router.get('/cartList',function(req,res,next){
    var userId = req.cookies.userId;
    User.findOne({userId:userId},function(err,doc){
        if(err){
            res.json({
                status:"1",
                msg:err.message,
                result:'' 
            });
        }else{
            if(doc){
                res.json({
                    status:"0",
                    msg:'',
                    result:doc.cartList
                }); 
            }
        }
    })
});

// 删除购物车数据接口
router.post('/delCart',function(req,res,next){
    var userId = req.cookies.userId,  productId = req.body.productId;
    // console.log(productId)
    User.update({userId:userId},{
        $pull:{
            'cartList':{                     //为什么这块要加引号
                'productId':productId
            }
        }
    },function(err,doc){
        if(err){
            res.json({
                status:"1",
                msg:err.message,
                result:''
            });
        }else{
            res.json({
                status:"0",
                mas:'',
                result:'suc'
            });
        }
    })
});

// 商品修改功能(点击加减号实现)接口
router.post('/cartEdit',function(req,res,next){
    var userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
//     console.log("123")
console.log(checked)
    User.update({"userId":userId,"cartList.productId":productId},{
        "cartList.$.productNum":productNum,
        "cartList.$.checked":checked
    },function(err,doc){
        if(err){
            res.json({
                status:"1",
                msg:err.message,
                result:""
            });
        }else{
            res.json({
                status:"0",
                msg:"",
                result:"suc"
            });
        }
    });
});

// 点击全选按钮的购物车总价，总数的改变
router.post('/editCheckAll',function(req,res,next){
    let userId = req.cookies.userId,
    checkAll = req.body.checkAll;
    User.findOne({userId:userId},function(err,user){
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            });
        }else{
            if(user){
                user.cartList.forEach( (item) => {
                    item.checked = checkAll;
                } );
                user.save(function(err1,doc){
                    if(err1){
                        res.json({
                            status:'1',
                            msg:err1.message,
                            result:''
                        })
                    }else{
                        res.json({
                            status:'0',
                            msg:'',
                            result:'suc'
                        })
                    }
                })
            }
        }
    })
});

// 获取地址
router.get('/addressList',function(req,res,next){
    let userId = req.cookies.userId;
    User.findOne({userId:userId},function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            })
        }else{
            if(doc){
                res.json({
                    status:'0',
                    msg:'',
                    result:doc.addressList
                })
            }
        }
    })
});

// 提交地址信息 (这块用了很长时间，一直把数据存不进去)
router.post('/addressInfo',function(req,res,next){
    let userId = req.cookies.userId, streetName = req.body.streetName, tel = req.body.tel
    // console.log(streetName)
    User.findOne({userId:userId},function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            })
        }else{
                var platform = '122';
                var r1 = Math.floor(Math.random()*10);
                var r2 = Math.floor(Math.random()*10); 
                var addressId = platform+r1+r2; 

                var address = {
                    addressId:addressId,
                    stressName:streetName,
                    tel:tel
                }
                // console.log(address)
                doc.addressInfo.push(address)
                doc.save(function(err1,doc1){
                    if(err1){
                        res.json({
                            status:'1',
                            msg:err1.message,
                            result:''
                        })
                    }else{
                        res.json({
                            status:'0',
                            msg:'',
                            result:{
                                addressId:address.addressId,
                                streetName:address.stressName,
                                tel:address.tel
                            }
                                
                        })
                    }
                })
            
        }

                                   
    })
})

// 提交订单信息
router.post("/payMent", function (req,res,next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId,
    orderTotal = req.body.orderTotal;
  User.findOne({userId:userId}, function (err,doc) {
     if(err){
        res.json({
            status:"1",
            msg:err.message,
            result:''
        });
     }else{
       var address = '';
       var goodsList = [];
       //获取当前用户的地址信息
       doc.addressInfo.forEach((item)=>{
          if(addressId==item.addressId){
            address = item;
          }
       })
       //获取用户购物车的购买商品
       doc.cartList.filter((item)=>{
         if(item.checked==true){
           goodsList.push(item);
         }
       });

       var platform = '622';
       var r1 = Math.floor(Math.random()*10);
       var r2 = Math.floor(Math.random()*10);

       var sysDate = new Date().Format('yyyyMMddhhmmss');
       var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
       var orderId = platform+r1+sysDate+r2;
       var order = {
          orderId:orderId,
          orderTotal:orderTotal,
          addressInfo:address,
          goodsList:goodsList,
          orderStatus:'1',
          createDate:createDate
       };

       doc.orderList.push(order);

       doc.save(function (err1,doc1) {
          if(err1){
            res.json({
              status:"1",
              msg:err.message,
              result:''
            });
          }else{
            res.json({
              status:"0",
              msg:'',
              result:{
                orderId:order.orderId,
                orderTotal:order.orderTotal
              }
            });
          }
       });
     }
  })
});

//根据订单Id查询订单信息
router.get("/orderDetail", function (req,res,next) {
  var userId = req.cookies.userId,orderId = req.param("orderId");
  console.log(orderId)
  User.findOne({userId:userId}, function (err,userInfo) {
      if(err){
          res.json({
             status:'1',
             msg:err.message,
             result:''
          });
      }else{
         var orderList = userInfo.orderList;
         if(orderList.length>0){
           var orderTotal = 0;
           orderList.forEach((item)=>{
              if(item.orderId == orderId){
                orderTotal = item.orderTotal;
              }
           });
           if(orderTotal>0){
             res.json({
               status:'0',
               msg:'',
               result:{
                 orderId:orderId,
                 orderTotal:orderTotal
               }
             })
           }else{
             res.json({
               status:'120002',
               msg:'无此订单',
               result:''
             });
           }
         }else{
           res.json({
             status:'120001',
             msg:'当前用户未创建订单',
             result:''
           });
         }
      }
  })
});
 
module.exports = router;
