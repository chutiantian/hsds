var MUTI = {
    data: {} // 数据
};

var id = GetQueryString('id');
var opt1 = {
  id:id//订单主键
};

  //var posturl = baseUrl+'order/queryEvaluateInfo';
  var posturl = '../js/json/comment-add.json';
  getdata(posturl, opt1,'',fillgoodslist);//获取json数据
  function fillgoodslist(data){
    MUTI.data = data;
    filldom('my-order-list', data.data, 'my-order-box');
  }

$(function () {
  // 输入框字数递减
  $('#my-order-box ').on('input propertychange','.coment-content',function(){
    var conLength=$(this).val().length;
    $(this).siblings().find('i').html(300-conLength);
  });
  //评论星星
  var beforeClickedIndex = -1;
  var clickNum = 0; //点击同一颗星次数
  $(document).on('mouseover','i[cjmark]',function(){
    var num = $(this).index();
    var pmark = $(this).parents('.revinp');
    var list = $(this).parent().find('i');
    for(var i=0;i<=num;i++){
      list.eq(i).attr('class','level_solid');
    }
  });
  $(document).on('mouseout','i[cjmark]',function(){
    var pmark = $(this).parents('.revinp');
    var mark = pmark.siblings('input');
    var val = parseInt(mark.val());
    var list = $(this).parent().find('i');
    for(var i=val,len=list.length-1;i<=len;i++){
      list.eq(i).attr('class','level_hollow');
    }
  });
  //点击星星
  $(document).on('click','i[cjmark]',function(){
    var num = $(this).index();
    var pmark = $(this).parents('.revinp');
    var mark = pmark.siblings('input');
    mark.val(num+1);

      var a = $(".store-grade").find(".revinp");
      var storeStar = a.find(".level").children('.level_solid').length;

      if(num == beforeClickedIndex) { //两次点击同一颗星星 该星星颜色变化
          clickNum++;
          if(clickNum % 2 == 1) {
              $(this).removeClass('level_solid').addClass('level_hollow');
          } else {
              $(this).addClass('level_solid').removeClass('level_solid');
          }
      } else {
          clickNum = 0;
          beforeClickedIndex = num;
      }
  })
});

function getStars(dom) {
  var starsLength = $(dom + ' .level').children("i.level_solid").length;
}

function getParamOpt(data) {
  var opt = {
    id:'',//订单主键
    evaluation:'',//店铺服务评分
    orderitemList: [
    ]
  };

   	 var a = $(".store-grade").find(".revinp");
  	 var storeStar = a.find(".level").children('.level_solid').length;
   	 opt.evaluation = storeStar;//店铺服务评分
     opt.id = data.data.id;//订单主键

    $(".details-box .goods-row").each(function(index, item) {
      var target = $(this).find(".revinp");
      var stars = target.find(".level").children('.level_solid').length;
      var evaluateDesc = $.trim($(this).find('.coment-content').val());
      opt.orderitemList.push({
        goodsId: data.data.orderitemList[index].goodsId,//商品主键
        orderId: data.data.orderitemList[index].orderId,//订单主键
        evaluateLevel: stars,//评价等级
        evaluateDesc: evaluateDesc//评价描述
      })
    });
    return opt;
}

// 点击确定
$('.sure').click(function(){

    var a = $(".store-grade").find(".revinp");
    var storeStar = a.find(".level").children('.level_solid').length;

    if(!$('.coment-content').val()){
        layer.msg('请填写评价', {
            time: 1000 //20s后自动关闭
        });
    }else if(storeStar == 0){
        layer.msg('请填写店铺服务评分', {
            time: 1000 //20s后自动关闭
        });
    }else{
        var options = getParamOpt(MUTI.data);
        // init(options);

        var posturl = baseUrl+'order/saveEvaluateInfo';
        options=JSON.stringify(options);
        getdata(posturl, options,'POST',fillgoodslist,1);//获取json数据
        function fillgoodslist(data){
            location.href='comment.html';
        }
    }
});

// 点击取消
$('.cencle').click(function () {
  location.href = 'comment-add.html'
});




