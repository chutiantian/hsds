 var opt = {
  page:1,//当前页码
  limit:5,//每页条数
  programCode:"",//商品名称、订单编号、计划单号
  orderStatus:""//订单状态
};

$(function(){
  init(opt);

// 点击搜索按钮向后台发送用户输入的数据
  $('.icon-sousuo').click(function(){
    // 获取用户输入数据
    opt.programCode = $.trim($('.search').val());
    request();
  });
  $('.order-status-list').on('click', 'li', function () {
    var flag = $(this).text();
    switch (flag) {
      case '提交订单':
        opt.orderStatus = 0;
        request();
        break;
      case '确认订单':
        opt.orderStatus = 1;
        request();
        break;
      case '商品出货':
        opt.orderStatus = 2;
        request();
        break;
      case '商品收货':
        opt.orderStatus = 3;
        request();
        break;
      case '订单完成':
        opt.orderStatus = 4;
        request();
        break;
    }
    console.log(opt);
  })
});
function init(opt){
  //var posturl = baseUrl+'order/queryOrderList';
  var posturl = '../js/json/order.json';
  getdata(posturl, opt,'',fillgoodslist);//获取json数据
  function fillgoodslist(data){
    filldom('order-list', data, 'order-detail-list');
    orgpageInit('changeNo', '.paginorange', data.data.totalPage, opt.page);

    if (data.code != "1" || data.data.list.length == 0) {
      $('#order-detail-list').hide();
      $('.sorry').show();
      $('.paginorange').hide();
    }else{
      $('#order-detail-list').show();
      $('.sorry').hide();
    }

  }
}
// 向后台发送请求，重新渲染页面
 function request() {
   var posturl = '../js/json/order.json'
   options = JSON.stringify(opt);
   getdata(posturl,opt,'',fillgoodsmsg);
   function fillgoodsmsg(data) {
     filldom('order-list', data, 'order-detail-list');
     orgpageInit('changeNo', '.paginorange', data.data.totalPage, opt.page);

     if (data.code != "1" || data.data.list.length == 0) {
       $('#order-detail-list').hide();
       $('.sorry').show();
       $('.paginorange').hide();
     }else{
       $('#order-detail-list').show();
       $('.sorry').hide();
     }

   }
 }
function changeNo(pageNo){
  var r=/^[1-9]*[1-9][0-9]*$/; if(!r.test(pageNo)){layer.msg('页码只能是数字！');return false;
  }
  $('.pageIndex').val(pageNo);
  opt.page=pageNo;
  init(opt)
}

