 var opt = {
   infoname:"",
   page:1,
   limit:20
 };

$(function(){
  init(opt);
});

function init(opt){
  //var posturl = baseUrl+'info/list';
  var posturl = '../js/json/notice.json';
  getdata(posturl, opt,'',fillnoticelist);//获取json数据
  function fillnoticelist(data){
    filldom('notice-list', data, 'notice-box');
    orgpageInit('changeNo', '.paginorange', data.page.totalPage, opt.page);
    //console.log(data.page);
    //console.log(data.page.totalPage);
  }
}
function changeNo(pageNo){
  var r=/^[1-9]*[1-9][0-9]*$/; if(!r.test(pageNo)){layer.msg('页码只能是数字！');return false;
  }
  $('.pageIndex').val(pageNo);
  opt.page=pageNo;
  init(opt)
}

