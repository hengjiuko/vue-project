var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('./../models/goods');

 //连接mongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

mongoose.connection.on("connected",function(){
    console.log("MongoDB connected success.")
});

mongoose.connection.on("error",function(){
    console.log("MongoDB connected fall.")
});

mongoose.connection.on("disconnected",function(){
    console.log("MongoDB connected disconnected.")
});

// 查询商品列表数据
router.get('/list',function(req,res,next){
    Goods.find({},function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            });
        }else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            });
        }
    })
})

// 加入到购物车
router.post('/addCart',function(req,res,next){
    var userId = "100000077",productId = req.body.productId;
    var User = require('../models/user');

    User.findOne({userId:userId},function(err,userDoc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            });
        }else{
            console.log("userDoc:" + userDoc);
            if(userDoc){
                let goodsItem = "";
                userDoc.cartList.forEach(function(item){
                    if(item.productId == productId){
                        goodsItem = item;
                        item.productNum++;
                    }
                });

                if(goodsItem){
                    userDoc.save(function(err2,doc2){
                        if(err2){
                            res.json({
                                status:'1',
                                msg:err2.message
                            });
                        }else{
                            res.json({
                                status:'0',
                                msg:'',
                                resule:'suc'
                            })
                        }
                    });
                }else{
                    Goods.findOne({productId:productId},function(err1,doc){
                        if(err1){
                            res.json({
                                status:'1',
                                msg:err1.message
                            });
                        }else{
                            if(doc){
                                doc.productNum = 1;
                                doc.checked = true;
                                userDoc.cartList.push(doc);
                                userDoc.save(function(err2,doc2){
                                    if(err2){
                                        res.json({
                                            status:'1',
                                            msg:err2.message
                                        });
                                    }else{
                                        res.json({
                                            status:'0',
                                            msg:'',
                                            resule:'suc'
                                        })
                                    }
                                });
                            }
                        }
                    });  
                }

            }
        }
    })
})

module.exports = router;
