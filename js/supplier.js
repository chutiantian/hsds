function init(t){function e(e){filldom("supplier-list",e,"supplier-list-box"),orgpageInit("changeNo",".paginorange",e.data.totalPage,t.page)}getdata(baseUrl+"suppliecontroller/list",t,"",e)}function changeNo(t){if(!/^[1-9]*[1-9][0-9]*$/.test(t))return layer.msg("页码只能是数字！"),!1;$(".pageIndex").val(t),opt.page=t,init(opt)}function getdata(t,e,n,o,a){n=n||"GET";var i;i=a?"application/json":"application/x-www-form-urlencoded";var l;$.ajax({type:n,contentType:i,url:t,dataType:"json",timeout:1e4,data:e,async:!0,beforeSend:function(){l=layer.load(1,{shade:[.5,"#000"]})},complete:function(t,e){layer.close(l),"timeout"==e&&layer.msg("请求超时")},success:function(t){null!=o&&"function"==typeof o&&o(t)},error:function(){console.log("请求超时")}})}function filldom(t,e,n){var o=Handlebars.compile($("#"+t).html());$("#"+n).html(o(e))}var opt={id:"",page:"1",limit:"10"};$(function(){init(opt),$(".btn-add").click(function(){location.href="supplier-add.html"}),$(".update").click(function(){function t(t){location.href="supplier-update.html"}var e=$(this).attr("uid");opt.id=e,getdata(baseUrl+"suppliecontroller/update",opt,"POST",t)})});