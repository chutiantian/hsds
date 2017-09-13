
var id = GetQueryString('id');
var programItemId = GetQueryString('programItemId');
var purchaseHeadingId = GetQueryString('purchaseHeadingId');

var opt = {
  id:id,//订单主键
  programItemId:programItemId,//采购计划id
  purchaseHeadingId:purchaseHeadingId//采购品目id
};

$(function(){
  init(opt);
  // 点击查看历史比价
  $('.history-compare').click(function(){
    var options = getParamOpt();
    console.log(options);
  });
});
function init(opt) {
  //var posturl = baseUrl+'order/queryOrderInfo';
  var posturl = '../js/json/order-detail.json';
  getdata(posturl, opt,'',fillgoodslist);//获取json数据
  function fillgoodslist(data){
    filldom('order-detail-list', data.data, 'order-detail-box');
    //console.log(data);

    var status = data.data.orderStatus;
    var way = data.data.payWay;
    var type = data.data.orderType;
    console.log(status);
    console.log(way);
    console.log(type);

    if(status == 0){
      $(".state-txt").text('提交订单');
      $(".ftx-03").text('订单正在审核中，请耐心等待！');
      $(".icon-refer,.proce1").css({'color':'#FC9809'});
      $(".txt11").css({'color':'#666'});
    }
    else if(status == 1){
      $(".state-txt").text('确认订单');
      $(".ftx-03").text('订单已确认，请耐心等待！');
      $(".icon-refer,.icon-pay,.proce1,.proce2").css({'color':'#FC9809'});
      $(".txt11,.txt12").css({'color':'#666'});
    }
    else if(status == 2){
      $(".state-txt").text('商品出货');
      $(".ftx-03").text('订单已发货，请耐心等待！');
      $(".icon-refer,.icon-pay,.icon-outstock,.proce1,.proce2,.proce3").css({'color':'#FC9809'});
      $(".txt11,.txt12,.txt13").css({'color':'#666'});
    }
    else if(status == 4){
      $(".state-txt").text('商品收货');
      $(".ftx-03").text('请耐心等待！');
      $(".icon-refer,.icon-pay,.icon-outstock,.icon-che2,.proce1,.proce2,.proce3,.proce4").css({'color':'#FC9809'});
      $(".txt11,.txt12,.txt13,.txt14").css({'color':'#666'});
    }
    else if(status == 5){
      $(".state-txt").text('订单完成');
      $(".ftx-03").text('订单已完成，欢迎您对本次交易进行评价！');
      $(".icon-refer,.icon-pay,.icon-outstock,.icon-che2,.proce1,.proce2,.proce3,.proce4").css({'color':'#FC9809'});
      $(".succ").css({'background':'#FC9809'});
      $(".icon-succ").css({'color':'#fff'});
      $(".txt11,.txt12,.txt13,.txt14,.txt15").css({'color':'#666'});
    }
  }

}

