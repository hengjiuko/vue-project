var mongoose = require( 'mongoose' )
var Schema = mongoose.Schema;

// 定义模式
var productSchema = new Schema({
    "productId":{type:String},
    "productName":String,
    "salePrice":Number,
    "checked":Boolean,         //第一次写字符串类型，选中状态一直搞不对，查错用了好长时间
    "productNum":Number,
    "productImage":String
});

// 使用模式"编译"模型，Good第一个字母大写去寻找数据库集合
module.exports = mongoose.model('Good',productSchema);

