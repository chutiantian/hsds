function initall(o){biuuu._ajax(posturl,"get",o,"json",biuuu.succfunction,biuuu.failfunction)}function init(o){$.ajax({type:"GET",url:posturl,dataType:"json",timeout:3e4,data:o,async:!0,beforeSend:function(){layer.load(1,{shade:[.5,"#000"]})},complete:function(o,i){layer.closeAll(),"timeout"==i&&layer.msg("请求超时")},success:function(i){layer.closeAll();var t=i;filldom("productlist-templete",t,"productlist"),dataArr=[],dataArr=t.page.list,orgpageInit("changeNo",".paginorange",t.page.totalPage,o.page)},error:function(){console.log("参数错误")}}),$.each(goodsArr,function(o,i){var t=i.id;$(".contrast").each(function(o,i){t==$(this).attr("cid")&&$(this).prop("checked",!0)})})}function changeNo(o){if(!/^[1-9]*[1-9][0-9]*$/.test(o))return layer.msg("页码只能是数字！"),!1;$(".pageIndex").val(o),option.page=o,init(option)}var dataArr,breadcrumb="",goodsArr=[],oldHtml=$(".goods-list").html(),option={status:"",goodsName:"",catalogCode:"",goodsSource:"",goodsPrice:"",upPrice:"",downPrice:"",unitprice:"",goodsBrandId:"",param:"",orderBy:"",page:1,limit:"20"},posturl=baseUrl+"goods/goodslist";$(function(){breadcrumb+='<span><a href="index.html">首页</a></span>',option.catalogCode=GetQueryString("catalogCode")||"",option.goodsName=decodeURI(decodeURI(GetQueryString("goodsName")))||"",option.isprogram=GetQueryString("isprogram")||"",option.goodsSource=GetQueryString("goodsSource")||"",option.status=GetQueryString("status")||"";var o=decodeURI(decodeURI(GetQueryString("cataname")))||"",i=decodeURI(decodeURI(GetQueryString("sourceName")))||"";GetQueryString("programCode");option.unitprice=GetQueryString("unitprice"),option.goodsSource&&(breadcrumb+="<span>&nbsp;&gt;&nbsp;</span>",breadcrumb+='<span><a href="product.html?goodsSource='+option.goodsSource+"&sourceName="+i+'">'+i+"</a></span>"),breadcrumb+="<span>&nbsp;&gt;&nbsp;</span>",breadcrumb+="<span>"+option.goodsName+o+"</span>",$(".breadcrumb").html(breadcrumb),initall(option),init(option),$(".price-list").on("click",".price-item.goods-price",function(o){o.stopPropagation();var i=$(o.target).is("li.price-item"),t=$(o.target).is("i.iconfont"),n=$(this).data("goodsprice");i&&(option.goodsPrice=n,option.downPrice="",option.upPrice="",init(option),$(this).children(".iconfont").show().parents(".price-item").siblings().hide(),$(this).css({background:"#0592F1"}).css({color:"#fff"}).css({"padding-left":"10px"}),$(".text").css({display:"none"})),t&&(option.goodsPrice="",init(option),$(this).children(".iconfont").hide().parents("li.price-item").css({background:"transparent"}).css({color:"#0592F1"}).siblings().show(),$(".text").css({display:"inline-block"}),$(".brand-list").scrollTop(0))}),$("#productmenu").on("click",".unprice",function(){option.goodsPrice="",option.downPrice=$(".downPrice").val(),option.upPrice=$(".upPrice").val(),init(option)}),$("#productmenu").on("click",".brand-list .brand-item",function(o){o.stopPropagation();var i=$(o.target).is("li.brand-item"),t=$(o.target).is("i.iconfont"),n=$(this).data("goodsbrand");console.log(n),i&&(option.goodsBrandId=n,init(option),$(this).children(".iconfont").show().parents(".brand-item").siblings().hide(),$(this).css({background:"#0592F1"}).css({color:"#fff"}).css({"padding-left":"10px"}),$(".more").css({display:"none"}),$(".brand-list").css({height:"30px","overflow-y":"hidden"})),t&&(option.goodsBrandId="",init(option),$(this).children(".iconfont").hide().parents("li.brand-item").css({background:"transparent"}).css({color:"#0592F1"}).siblings().show(),$(".more").css({display:"inline-block"}),$(".all, .brand-list").css({"line-height":"3"}),$(".btn-more").css({"margin-top":"0px"}))}),$(".product-top-left button").click(function(){$(this).addClass("active").siblings().removeClass("active");var o=$(this).data("orderby");option.orderBy=o,init(option)}),$("#productmenu").on("click",".btn-more",function(o){$(".btn-more .iconfont").toggleClass("icon-more icon-shouqi"),$(".btn-more .iconfont").is(".icon-more")?($(".brand-list").css({height:"30px","overflow-y":"hidden"}),$(".btn-more").css({"margin-top":"0px"})):($(".brand-list").css({height:"100px","overflow-y":"auto"}),$(".btn-more").css({"margin-top":"10px"}))}),$("#productmenu").on("click",".input-msg .icon-sousuo",function(o){if(!$.trim($(".input-msg input").val()))return layer.msg("请填写品牌信息",{time:2e3}),!1;$(".input-msg input").hide(),$(".input-msg .icon-sousuo").hide(),$(".input-msg .oth-ct").text($(".input-msg input").val()).css({"padding-left":"10px"}),option.param=$(".input-msg input").val(),init(option),$(".input-msg .input-val").show(),$(".input-msg .input-val .icon-close").css({display:"inline-block"})}),$(".input-msg .input-val .icon-close").click(function(){$(".input-msg input").show(),$(".input-msg .icon-sousuo").show(),$(".input-msg .input-val").hide(),$(".input-msg input").val(""),option.param="",init(option)});var t={renderNew:function(){$.each(goodsArr,function(o,i){var t='<div class="fl pic"><img src='+i.imagePath+' alt="../img/goods.png" width="72" height="60"></div><div class="fl goods-des"><p class=goods-price>&yen;'+i.goodsPrice+'</p><p class="goods-summary">'+i.goodsName+'</p></div><span class="goods-src-jd"></span><a href="javascript:;" idx='+o+' class="del">删除</a>';$(".contrast-product").eq(o).html(t)})},renderOld:function(){$(".goods-list").html(oldHtml)},del:function(o){goodsArr.splice(o,1),0!==goodsArr.length?(this.renderOld(),this.renderNew()):$(".contrast-container").slideUp("slow")}};$("#productlist").on("click",".comparison-click",function(){$(this).children(".contrast").click()}),$("#productlist").on("click",".product-item .contrast",function(o){o.stopPropagation();var i=$(this).attr("cid"),n=$(this).prop("checked"),i=$(this).attr("cid"),n=$(this).prop("checked");if(n){if(goodsArr.length>=4)return $(this).prop("checked",!1),void layer.msg("不可以超过4个商品",{time:2e3});$.each(dataArr,function(o,n){this.id==i&&(goodsArr.push(dataArr[o]),t.renderNew())}),$(".contrast-container").slideDown("slow")}if(!n){var s;$.each(goodsArr,function(o,t){i==this.id&&(s=o)}),t.del(s)}}),$(".contrast-container").on("click",".del",function(){var o=$(this).attr("idx"),i=goodsArr[o].id;$(".contrast").each(function(o,t){i==$(this).attr("cid")&&$(this).prop("checked",!1)}),t.del(o)}),$(".btn-close").click(function(){$(".contrast").prop("checked",!1),t.renderOld(),goodsArr=[],$(".contrast-container").slideUp("slow")}),$(".btn-clear").click(function(){$(".btn-close").trigger("click")}),$(".btn-contrast").click(function(){if(1==goodsArr.length)return void layer.msg("最少两个商品",{time:2e3});var o=[];if($.each(goodsArr,function(i){o.push(goodsArr[i].id)}),option.unitprice)var i=window.location.search+"&isComeFrom=true&ids="+o.join("-");else var i=window.location.search+"&ids="+o.join("-");location.href="./comparison.html"+i})});