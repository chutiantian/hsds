/**
 * Created by 11 on 2017/7/26.
 */
// 判断浏览器
function isBrowser() {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    return Sys;
}

$(window).load(function () {
    /*初始化滚动条*/
    $(".left-bar").mCustomScrollbar({
        set_width: false,
        set_height: false,
        horizontalScroll: false,
        scrollInertia: 550,
        scrollEasing: "easeOutCirc",

        autoDraggerLength: true,
        scrollButtons: {
            enable: false,
            scrollType: "continuous",
            scrollSpeed: 20,
            scrollAmount: 40
        },
        advanced: {
            updateOnBrowserResize: true,
            updateOnContentResize: false,
            autoExpandHorizontalScroll: false,
            autoScrollOnFocus: true
        },
        callbacks: {
            onScrollStart: function () {
                $('#catalog-list li ul').hide()
            },
            onScroll: function () {
            },
            onTotalScroll: function () {
            },
            onTotalScrollBack: function () {
            },
            onTotalScrollOffset: 0,
            whileScrolling: false,
            whileScrollingInterval: 30
        }
    });
    $('.hmb-search button').click(function () {
        if (!$.trim($(this).siblings('input').val())) {
            layer.msg('请填写搜索关键词', {
                time: 2000, //2s后自动关闭
            });
            return false;
        }
        var _val = $(this).siblings('input').val();
        var hrefurl = '';
        if (GetQueryString('goodsSource')) {
            var sourceName = decodeURI(decodeURI(GetQueryString('sourceName'))) || '';
            console.log(sourceName)
            hrefurl += 'product.html?goodsName=' + _val + '&status=byGoodsName&goodsSource=' + GetQueryString('goodsSource') + '&sourceName=' + sourceName;
        } else {
            hrefurl = 'product.html?goodsName=' + _val + '&status=byGoodsName';
        }

        window.location.href = hrefurl;
    })
    /*是否显示目录*/
    if (!$('#isindex').val()) {
        $('.classify').hover(function () {
            $('.catalog').css({'height': '484px', 'overflow': 'visible'})
        }, function () {
            $('.catalog').css({'height': '0px', 'overflow': 'hidden'})
        })
    } else {
        $('.catalog').css({'height': '484px', 'overflow': 'visible'})
    }

    $('.catalog').on("mouseenter mouseleave", function (event) {
        event.preventDefault();
        if (event.type == "mouseenter") {        	
            $('.lbf-child-catalog').show();
        } else if (event.type == "mouseleave") {
            event.preventDefault();
            $('.lbf-child-catalog').hide();
          	$(this).find('li').removeClass('hover')
        }
    })
    $('.catalog').on("mouseenter mouseleave", 'li.catalog-li', function (event) {
        event.preventDefault();
        if (event.type == "mouseenter") {
        	$(this).addClass('hover').siblings().removeClass('hover')
            $('.lbf-child-catalog ul').eq($(this).index()).show().siblings().hide();
            //鼠标悬浮
        } else if (event.type == "mouseleave") {
        }
    })
})
$(function () {
	/*登陆*/
	$('.htc-left button').click(function(){
		
		layer.open({
		  type: 1,
		  title :'登陆',
		  move: false,
		  skin: 'layui-layer-rim', //加上边框
		  area: ['420px', '300px'], //宽高
		  content: '<div id="login"><div><span>用户名：</span><input type="text" name="username"></div><div><span>密码：</span><input type="text" name="username"></div><div><button>登录</button></div><p>首次登录，请使用默认密码</p></div>'
		});
	})
    $("img").lazyload({effect: "fadeIn"});
 	//   var posturl='http://192.168.21.66:8080/GovSceneEb/purchasecatalog/getPurchasecatalog';
    var posturl=baseUrl+'purchasecatalog/getPurchasecatalog';
 	  getdata({
	    	url:posturl,//接口地址
	    	template:'catalogs-template',//模板id
	    	dom:'catalogs',//填充dom
	    	type:'GET'//传输方式
    	});
})

/*ajax get data*/


/**
 * 公共方法
 * 获取数据
 *template：handlerbars 模板ID
 *url：请求地址
 *fromdata：向后台传参json串{name：'aa',age:'18',...}
 */
function getdata(obj) {	
    var data,lay;
    var callack1 = obj.callback||function(){};
    $.ajax({
        type: obj.type,
        url: obj.url, 
        dataType: 'json',
        timeout : 10000,
        data: obj.fromdata,
        async: true,
         beforeSend: function(){
	      lay=layer.load(1, {
			  shade: [0.5,'#000']	
			});	
	    },
	    complete: function(XMLHttpRequest,status){
		    layer.close(lay)
		    if(status=='timeout'){//超时,status还有success,error等值的情况
	　　　　　  layer.msg("请求超时");
	　　　　}
	    },
        success: function (result) {
        	//layer.closeAll()
            data = result;
            if(obj.pram){         	 	
            	data=Object.assign(data,obj.pram)	 
           	}
          	filldom(obj.template, data, obj.dom);
          	if(obj.ispage){
          		
          	}
          	$(".left-bar").mCustomScrollbar("update");
          	callack1(result);
        },
        error: function () {
            console.log("参数错误");
        }
    });
}

 
/**
 * 公共方法
 * 获取数据
 *template：handlerbars 模板ID
 *data：向handlebars传输的json data
 *dom：最终填充的dom
 */
function filldom(template, data, dom) {
    var  myTemplate= Handlebars.compile($("#" + template).html()); 
    $('#' + dom).html(myTemplate(data));
}

// 传参

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return encodeURI(r[2]);
    return '';
}

/*
*解析对象成查询字符串
* 传入对象data
* */
function qs(data) {
    var str = '';
    for (var k in data) {
        if (!!data[k]) {
            str += k + '=' + data[k] + '&';
        }
    }
    return str.slice(0, -1)
};
/*临时处理url*/
function qss(data) {
    var str = '';
    for (var k in data) {
        if (!!data[k]) {
            str += k + '=' + data[k] + '@';
        }
    }
    return str.slice(0, -1)
};

/*分页*/
function orgpageInit(i, a, e, t) {
    e *= 1, t *= 1;
    var r = 0,
        n = 0;
    if ($(a).empty(), isNaN(e) || 0 >= e) return !1;
    if (isNaN(t) && (t = 1), t > e && (t = e), 1 == t ? ($(a).append('<li class="disabled"><a class="colordis" href="javascript:void(0)">首页</a></li>'), $(a).append('<li class="disabled"><a class="colordis" href="javascript:void(0)">上一页</a></li>')) : ($(a).append('<li><a href="javascript:void(0)" data-page="1">首页</a></li>'), $(a).append('<li><a href="javascript:void(0)" data-page="' + (t - 1) + '">上一页</a></li>')), t > 1) {
        var l = 2;
        l = e - t > 2 ? l = 2 : 4 - (e - t), r = t > l ? r = l : t - 1;
        for (var o = 0; r > o; o++) $(a).append('<li><a href="javascript:void(0)" data-page="' + (t - r + o) + '">' + (t - r + o) + "</a></li>")
    }
    if ($(a).append('<li class="active"><a href="javascript:void(0)">' + t + "</a></li>"), e > t) {
        var s = 2;
        s = 0 > s - t ? s = 2 : 5 - t, n = e - t > s ? n = s : e - t;
        for (var o = 1; n >= o; o++) $(a).append('<li><a href="javascript:void(0)" data-page="' + (t + o) + '">' + (t + o) + "</a></li>")
    }
    t == e || 1 == e ? ($(a).append('<li class="disabled"><a class="colordis" href="javascript:void(0)">下一页</a></li>'), $(a).append('<li class="disabled"><a class="colordis" href="javascript:void(0)">末页</a></li>')) : ($(a).append('<li><a href="javascript:void(0)" data-page="' + (t + 1) + '">下一页</a></li>'), $(a).append('<li><a href="javascript:void(0)" data-page="' + e + '">末页</a></li>'));
    $(a).find("a").on('click', function (event) {
        event.preventDefault();
        if ($(this).parent('li').hasClass('disabled') ||
            $(this).parent('li').hasClass('active')) {
            return false;
        }
        ;
        if (typeof i == 'string') {
            "function" == typeof window[i] && window[i]($(this).attr('data-page'));
        } else if (typeof i == 'function') {
            i($(this).attr('data-page'));
        }
        ;
    });
    var c = "";
    return c += '<div class="paginmsg">', c += "共<span>" + e + "页</span>", 1 == e ? ($(a).append(c), !1) : (c += '，跳转第<input class="skipnum" type="text" />页', c += '<button class="pageskip">确定</button>', c += "</div>", $(a).append(c), void $(a).find(".pageskip").on("click", function () {
        var t = $(a).find(".skipnum").val(),
            r = /^[1-9]*[1-9][0-9]*$/;
        if (!r.test(t)) return layer.msg('页码只能是整数'), !1;
        if (t > e) return layer.msg('页码超过总页数！'), !1;
        if (typeof i == 'string') {
            "function" == typeof window[i] && window[i].apply(null, [t]);
        } else if (typeof i == 'function') {
            i(t);
        }
        ;

    }))
}

//HandlebarsHelper
Handlebars.registerHelper('eq', function (v1, v2, opts) {
    if (v1 == v2)
        return opts.fn(this);
    else
        return opts.inverse(this);
});
/*
* 时间转换 传入毫秒值
* */

Handlebars.registerHelper("transformTime", function (t) {
    if(!t){
        return
    }
    return new Date(t).toJSON().split('.')[0].replace(/[TZ]/g, " ")
});
/*
* 判断商家来源
* */
Handlebars.registerHelper("transformOrderType", function (orderType) {
    if (orderType == 1) {
        return '京 东'
    }
    if (orderType == 2) {
        return '苏 宁'
    }
});

 Handlebars.registerHelper("handindex", function (index, options) {
            return parseInt(index);
        });

