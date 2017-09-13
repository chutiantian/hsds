    
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

$(function () {
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
        if (GetQueryString('goodssource')) {
            var sourcename = decodeURI(decodeURI(GetQueryString('sourcename'))) || '';
            hrefurl += 'product.html?goodsname=' + _val + '&status=byGoodsName&goodssource=' + GetQueryString('goodssource') + '&sourcename=' + sourcename;
        } else {
            hrefurl = 'product.html?goodsname=' + _val + '&status=byGoodsName';
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
        if (event.type == "mouseenter") {        	
          
        } else if (event.type == "mouseleave") {
            $('.lbf-child-catalog').hide();
            $('.lbf-third-catalog').hide();
          	$(this).find('li').removeClass('hover') 
        }
    })
    $('.catalog').on("mouseenter mouseleave", 'li.catalog-li', function (event) {
    	  $('.lbf-child-catalog').show();
        if (event.type == "mouseenter") {
        	$('.lbf-third-catalog').hide();
        	$(this).addClass('hover').siblings().removeClass('hover')
            $('.lbf-child-catalog ul').eq($(this).index()).show().siblings().hide();
            //鼠标悬浮
        } else if (event.type == "mouseleave") {
        }
    }) 
    $('.catalog').on("mouseenter mouseleave", '.lbf-child-catalog li', function (event) {   
    	
        if (event.type == "mouseenter") {
        	var _this=$(this);
        	var parindex=$('li.catalog-li.hover').index();
   
        	var isthird=$.trim($('.lbf-third-catalog div.pardiv').eq(parindex).find('ul').eq(_this.index()).html()).length;
        	 $('.lbf-third-catalog').show();
        	//$(this).addClass('hover').siblings().removeClass('hover');
           if(isthird<=0){
           		$('.lbf-third-catalog').hide();
           }else{
           	$('.lbf-third-catalog div.pardiv').eq(parindex).show().siblings().hide();
           	 $('.lbf-third-catalog div.pardiv').eq(parindex).find('ul').eq(_this.index()).show().siblings().hide(); 
           }           
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
		  content: '<form method="post" action="" id="loginform"><div id="login"><div><span>用户名：</span><input type="text" id="username" name="username"></div><div><span>密码：</span><input type="password" id="password" name="password"></div><div><button type="button" onclick="login()">登录</button></div><p>首次登录，请使用默认密码</p></div></form>'
		});
	})

    
 	 var posturl='../js/json/catalog.json'
     //var posturl=baseUrl+'purchasecatalog/getPurchasecatalog';
     getdata(posturl,'','',fillcatlog);//获取json数据
     function fillcatlog(data){
     	filldom('catalogs-template', data, 'catalogs');
    $(".left-bar").mCustomScrollbar();
     }
    
})
/*登录*/
function login(){
     	var username = $("#username").val();
		if(username==null || username.length<1){
			layer.msg("请输入用户名！");
			return false;
		}
		var pwd = $("#password").val();
		if(pwd==null || pwd.length<1){
			layer.msg("请输入密码！");
			return false;
		}
		 $("#loginform").attr("action",baseUrl+"login"); 
		
		$("#loginform").submit(); 
		return false;
}
 
/*ajax get data*/


/**
 * 公共方法
 * 获取数据
 *template：handlerbars 模板ID
 *url：请求地址
 *fromdata：向后台传参json串{name：'aa',age:'18',...}
 */
function getdata(url, fromdata,type,callback,flag) {
	type=type||'GET';
	var ContentType;
	flag ? ContentType='application/json': ContentType='application/x-www-form-urlencoded';
	var lay;
    $.ajax({
        type: type,
        contentType:ContentType,
        url: url,
        dataType: 'json',
       	timeout : 10000,
        data: fromdata,
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
            if(callback!=null){
				if (typeof (callback) == 'function') {
					callback(result);
			    }
			}
        },
        error: function () {
            console.log("请求超时");
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
    var myTemplate = Handlebars.compile($("#" + template).html());
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
/*获取参数跳转*/
function getparm(dom){
			var _this=$(dom)
			var parm=$.parseJSON(_this.attr('data-parm').replace(new RegExp("'","gm"),"\""));
			var hrefurl='',num=0;
			hrefurl+=_this.attr('data-posturl')
			$.each(parm,function(key,val){
				num==0 ? hrefurl+= '?'+key+'='+val : hrefurl+='&'+key+'='+val;
				num++;
			})
			 window.location.href=hrefurl;
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


Handlebars.registerHelper('link', function(text, url) {
  text = Handlebars.Utils.escapeExpression(text);
  url  = Handlebars.Utils.escapeExpression(url);

  var result = '<a href="' + url + '">' + text + '</a>';

  return new Handlebars.SafeString(result);
});