
var id = GetQueryString('id');
var opt = {
  id:id//订单主键
};

$(function () {
  init(opt);

});

function init(opt){
  //var posturl = baseUrl+'order/queryEvaluateInfo';
  var posturl = '../js/json/comment-detail.json';
  getdata(posturl, opt,'',fillgoodslist);//获取json数据
  function fillgoodslist(data){
    filldom('my-order-list', data.data, 'my-order-box');
    console.log(data);
  }
}

/**
 * 星星等级添加
 * @param  {[type]} v1    [description]
 * @param  {[type]} v2    [description]
 * @param  {[type]} opts) {             if (v1 [description]
 * @return {[type]}       [description]
 */
Handlebars.registerHelper('list', function (data, opts) {
  var str = '';
  for (var i = 0; i < data; i++) {
    str += '<i class="level_solid" cjmark=""></i>'
  }
  for (var j = 0; j < (5 - data); j++) {
    str += '<i class="level_hollow" cjmark=""></i>'
  }
  return str
});