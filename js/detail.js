$(document).ready(function() {

	//--------------小图片展示----------------

	$.ajax({
		//"url": baseUrl + "goods/goodsdetail?goodsId=" + GetQueryString("goodsid"),
		"url":"../js/json/detail.json",
		"type":"get",
	}).done(function(data) {
		$(".breadcrumb-span2").html(data.goodsDetail[0].purchaseCatalogName);
		$(".breadcrumb-span2").on("click",function(){
			window.history.go(-1)
		})
		//-------------商品详情模板----------------
		var gtt = $("#goodsDetail-templete").html();
		var template = Handlebars.compile(gtt);
		var gttStr = template(data);
		$("#content").html(gttStr);
		
		var gdt = $("#goodsDesc-templete").html();
		var template = Handlebars.compile(gdt);
		var gdtStr = template(data);
		$("#goodsDesc").html(gdtStr);
		//------------图片懒加载------------
		$("#goodsDesc img").lazyload({
			placeholder: "../img/loading.png",
			effect: "fadeIn"
		});

		var dpt = $("#detailParam-templete").html(); //规格参数模板
		var template = Handlebars.compile(dpt);
		var dptStr = template(data);
		$("#detailParam").html(dptStr);

		//------页面重新加载，让大图始终对应第一张小图------
		var firstSrc = data.goodsDetail[0].goodsPicture[0].picturePath;
		$(".bigImg").find("img").attr("src", firstSrc);
	}).done(function() {
		//----------------放大镜展示----------------
		$(".smallImg").hover(function() {
			var src = $(this).attr("src")
			$(".bigImg").find("img").attr("src", src)
		});
		$(".bigImg").find("img").hover(function() {
			$("#bigView").find("img").attr("src", this.src)

		});
		if($("#wrap").find("li").length > 5) {
			$(".smallImgUp").find("img").attr("src", "../img/gotop2.gif");
			//----------------点击图片滑动---------------
			var countTop = 0;
			$(".smallImgUp").find("img").click(function() {
				countTop++;
				var top = -67 * countTop;
				$("#wrap").animate({
					top: top
				}, 200);

				if((countTop + 5) == $("#wrap").find("li").length) {
					var src = $(".smallImgUp").find("img").attr("src");
					$(".smallImgUp").find("img").attr("src", src);
					$(".smallImgDown").find("img").attr("src", "../img/gobottom2.gif")
					countTop = $("#wrap").find("li").length - 6;
				};
				if((countTop + 5) < $("#wrap").find("li").length) {
					$(".smallImgUp").find("img").attr("src", "../img/gotop2.gif");
					$(".smallImgDown").find("img").attr("src", "../img/gobottom2.gif")
				}
			});
			$(".smallImgDown").find("img").click(function() {
				if(countTop > -1) {
					countTop--;
				}
				var top = -67 * (countTop + 1);
				$("#wrap").animate({
					top: top
				}, 200);
				if(countTop == -1) {
					$(".smallImgDown").find("img").attr("src", "../img/gobottom.gif")

				} else {
					$(".smallImgUp").find("img").attr("src", "../img/gotop2.gif");
				}
			});
		}

		// 解决 ie6 select框 问题
		$.fn.decorateIframe = function(options) {}
		$.fn.decorateIframe.defaults = {
			iframeId: "decorateIframe1",
			iframeZIndex: -1,
			width: 0,
			height: 0
		}
		//大视窗看图
		function mouseover(e) {
			if($("#winSelector").css("display") == "none") {
				$("#winSelector,#bigView").show();
			}
			$("#winSelector").css(fixedPosition(e));
			e.stopPropagation();
		}

		function mouseOut(e) {
			if($("#winSelector").css("display") != "none") {
				$("#winSelector,#bigView").hide();
			}
			e.stopPropagation();
		}
		$("#midimg").mouseover(mouseover); //中图事件
		$("#midimg,#winSelector").mousemove(mouseover).mouseout(mouseOut); //选择器事件

		var $divWidth = $("#winSelector").width(); //选择器宽度
		var $divHeight = $("#winSelector").height(); //选择器高度
		var $imgWidth = $("#midimg").width(); //中图宽度
		var $imgHeight = $("#midimg").height(); //中图高度
		var $viewImgWidth = $viewImgHeight = $height = null; //IE加载后才能得到 大图宽度 大图高度 大图视窗高度

		function changeViewImg() {
			$("#bigView img").attr("src", $("#midimg").attr("src"));
		}
		changeViewImg();
		$("#bigView").scrollLeft(0).scrollTop(0);

		function fixedPosition(e) {
			if(e == null) {
				return;
			}
			var $imgLeft = $("#midimg").offset().left; //中图左边距
			var $imgTop = $("#midimg").offset().top; //中图上边距
			X = e.pageX - $imgLeft - $divWidth / 2; //selector顶点坐标 X
			Y = e.pageY - $imgTop - $divHeight / 2; //selector顶点坐标 Y
			X = X < 0 ? 0 : X;
			Y = Y < 0 ? 0 : Y;
			X = X + $divWidth > $imgWidth ? $imgWidth - $divWidth : X;
			Y = Y + $divHeight > $imgHeight ? $imgHeight - $divHeight : Y;

			if($viewImgWidth == null) {
				$viewImgWidth = $("#bigView img").outerWidth();
				$viewImgHeight = $("#bigView img").height();
				if($viewImgWidth < 200 || $viewImgHeight < 200) {
					$viewImgWidth = $viewImgHeight = 800;
				}
				$height = $divHeight * $viewImgHeight / $imgHeight;
				$("#bigView").width($divWidth * $viewImgWidth / $imgWidth);
				$("#bigView").height($height);
			}
			var scrollX = X * $viewImgWidth / $imgWidth;
			var scrollY = Y * $viewImgHeight / $imgHeight;
			$("#bigView img").css({
				"left": scrollX * -1,
				"top": scrollY * -1
			});
			$("#bigView").css({
				"top": 75,
				"left": 430
			});

			return {
				left: X,
				top: Y
			};
		}
		//放大镜代码结束						
	});
	
	
	//-------------------商品评价------------------	
	var paramData = {
		"page": 1, //当前页码
		"limit": "10", //每页条数
		"goodsId": GetQueryString("goodsid"), //提供常成使用的查询字段
	};
	var goodsEvaluate = function(evaluate){
		$.ajax({
			type: "GET",
			//url: baseUrl + "goods/goodsEvaluate",
			//data: paramData,
			url: "../js/json/goods-evaluate.json",
			success: function(resultdata) {
				evaluate(resultdata);
			},
			error:function(){
				alert('请求超时')
			}
		});
		function evaluate(resultdata){
			var getll = $("#goodsEvaluate-templete").html(); //商品评价模板
			var template = Handlebars.compile(getll);
			var getStrl = template(resultdata.page.List);
			$("#goods-Evaluate").html(getStrl);
			//评价等级	
			var list = resultdata.page.List;
			for(var k=0;k<list.length;k++){
				var arrI = $("#"+list[k].goods_id).find("i");
				for(var j=0;j<list[k].evaluate_level;j++){					
					$(arrI[j]).addClass("Start");
				};	
			}
			
			//分页
			orgpageInit('changeNo', '.paginorange', resultdata.page.totalPage, paramData.page);
		};
	};
	goodsEvaluate();		
	function changeNo(pageNo) {
    var r = /^[1-9]*[1-9][0-9]*$/;
    if (!r.test(pageNo)) {
        layer.msg('页码只能是数字！');
        return false;
    };
    $('.pageIndex').val(pageNo);
    paramData.page = pageNo
       $('body').scrollTop('405');
    goodsEvaluate()
}

	//handerbar模板渲染开始
	~(function() {
		var GoodsDetail = function() {
			this.tplId = "";
			this.tpl = "";
			this.tplDetailRight = "";

		}
		GoodsDetail.prototype = {
			init: function() {
				this.tplDetailRight = $("#t-detail-right").text();

			},
			showRightInfo: function() {
				var tpl = Handlebars.compile(this.tplDetailRight);
				$(".detail-info").html(tpl([]));
			}
		};

		if(!window.HUI) {
			window.HUI = {};
		}
		HUI.goodsDetail = new GoodsDetail();
	})();
})

var detailTabs = function(arg) {
	this.id = arg.id;
	this.sClass = arg.selected;
	this.dom = {};
	this.domsTitle = {};
	this.domsContent = {};
}
detailTabs.prototype = {
	init: function() {
		var dom = $("#" + this.id),
			domsTitle = $(".tabtitle >li"),
			domsContent = $(".tabcontent >div");
		this.dom = dom;
		this.domsTitle = domsTitle;
		this.domsContent = domsContent;
		this.bindEvent();
	},
	bindEvent: function() {
		var that = this;
		this.domsTitle.bind("click", function(e) {
			var id = $(e.target).attr("tabid");
			id = id * 1;
			that.show(id);
		});
	},
	show: function(id) {
		this.domsTitle.removeClass(this.sClass);
		this.domsContent.hide();
		this.domsTitle.eq(id).addClass(this.sClass);
		this.domsContent.eq(id).show();
	}
}
if(!window.HUI) {
	window.HUI = {};
}
HUI.Tabs = detailTabs;

$(function() {
	var goodsDetail = HUI.goodsDetail;
	goodsDetail.init();
	var tabs = new HUI.Tabs({
		id: "tab1",
		selected: "detail-tab-selected"
	});
	tabs.init();
});