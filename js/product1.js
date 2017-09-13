var dataArr, breadcrumb = '', goodsArr = [], oldHtml = $('.goods-list').html();
var option = {
    status: '',
    goodsName: '',
    catalogCode: '',
    goodsSource: '',
    goodsPrice: '',
    upPrice: '',
    downPrice: '',
    unitprice: '',
    goodsBrandId: '',
    param: '',
    orderBy: '',
    page: 1,
    limit: '20',
};
// var posturl='http://192.168.21.66:8080/GovSceneEb/goods/goodslist';
  var posturl=baseUrl+'goods/goodslist';
function initall(opt) {
/* var msgarr={};
    if (option.unitprice) {
        var unitprice = GetQueryString('unitprice') ? (parseInt(GetQueryString('unitprice') * 0.8) + '-' + GetQueryString('unitprice')) : '';
        msgarr.unitprice = unitprice || false;
         msgarr.unitprice1 = 2;
    }

 getdata(posturl, opt, 'productmenu-templete',  'productmenu',msgarr,function(){
	 	$('.brand-item').width() * $('.brand-item').length > $('.select-left').width() ? $('span.more').css('display', 'inline-block') : $('span.more').css('display', 'none')
	 })*/
	biuuu._ajax(posturl,"get",opt,'json',biuuu.succfunction,biuuu.failfunction);
}

function init(opt) {
		 $.ajax({
		        type: "GET",
		        url: posturl,
		        dataType: 'json',
		        timeout : 30000,
		        data: opt,
		        async: true,
		         beforeSend: function(){
			      layer.load(1, {
					  shade: [0.5,'#000']	
					});	
			    },
			    complete: function(XMLHttpRequest,status){
			    	 layer.closeAll()
				    if(status=='timeout'){
				     
			　　　　　  layer.msg("请求超时");
			　　　　}
			    },
		        success: function (result) {
		           layer.closeAll()
		           var data = result;		           
		          	filldom('productlist-templete', data, 'productlist');
	          	    dataArr = [];
				    dataArr = data.page.list;
				    orgpageInit('changeNo', '.paginorange', data.page.totalPage, opt.page);

		        },
		        error: function () {
		            console.log("参数错误");
		        }
		    });

    $.each(goodsArr, function (i, item) {
        var id = item.id;
        $('.contrast').each(function (index, value) {
            if (id == $(this).attr('cid')) {
                $(this).prop('checked', true);
            }
        })
    })
}

function changeNo(pageNo) {
    var r = /^[1-9]*[1-9][0-9]*$/;
    if (!r.test(pageNo)) {
        layer.msg('页码只能是数字！');
        return false;
    }

    $('.pageIndex').val(pageNo);
    option.page = pageNo
    init(option)
}

$(function () {

    //品牌更多按钮是否显示
    /*
     * 商品code:catalogCode
     * 搜索name：goodsName
     * 是否是采购计划过来的isprogram：true
     * 中标电商：goodsSource
     *
     * */
    breadcrumb += '<span><a href="index.html">首页</a></span>';
    option.catalogCode = GetQueryString('catalogCode') || '';
    option.goodsName = decodeURI(decodeURI(GetQueryString('goodsName'))) || '';
    option.isprogram = GetQueryString('isprogram') || '';
    option.goodsSource = GetQueryString('goodsSource') || '';
    option.status = GetQueryString('status') || '';
    var cataname = decodeURI(decodeURI(GetQueryString('cataname'))) || '';
    var sourceName = decodeURI(decodeURI(GetQueryString('sourceName'))) || '';
    var programCode = GetQueryString('programCode') || '';
    //option.unitprice=GetQueryString('unitprice')?(parseInt(GetQueryString('unitprice')*0.8)+'-'+ GetQueryString('unitprice')) : '';
    option.unitprice = GetQueryString('unitprice');
    if (option.goodsSource) {
        breadcrumb += '<span>&nbsp;&gt;&nbsp;</span>';
        breadcrumb += '<span><a href="product.html?goodsSource=' + option.goodsSource + '&sourceName=' + sourceName + '">' + sourceName + '</a></span>';
    }
    breadcrumb += '<span>&nbsp;&gt;&nbsp;</span>';
    breadcrumb += '<span>' + option.goodsName + cataname + '</span>';
    $('.breadcrumb').html(breadcrumb);
	initall(option)
    init(option);
    // 点击价格区间
    $(".price-list").on("click", ".price-item.goods-price", function (e) {
        e.stopPropagation();
        var liFlag1 = $(e.target).is("li.price-item");
        var iconFlag1 = $(e.target).is("i.iconfont");
        var goosPrice = $(this).data('goodsprice');
        if (liFlag1) {
            option.goodsPrice = goosPrice;
            option.downPrice = '';
            option.upPrice = '';
            init(option)
            $(this).children(".iconfont").show()
                .parents(".price-item").siblings().hide();
            $(this).css({'background': '#0592F1'})
                .css({'color': '#fff'})
                .css({'padding-left': '10px'});
            $('.text').css({'display': 'none'});
        }
        if (iconFlag1) {
            option.goodsPrice = '';
            init(option)
            $(this).children(".iconfont").hide()
                .parents("li.price-item").css({'background': 'transparent'})
                .css({'color': '#0592F1'})
                .siblings().show();
            $('.text').css({'display': 'inline-block'});
            $('.brand-list').scrollTop(0);
        }
    });

    //价格区间
    $('#productmenu').on('click','.unprice',function () {
        option.goodsPrice = '';
        option.downPrice = $('.downPrice').val();
        option.upPrice = $('.upPrice').val();
        init(option)
    })

    // 点击品牌
    $("#productmenu").on("click", ".brand-list .brand-item", function (e) {
        e.stopPropagation();
        var liFlag2 = $(e.target).is("li.brand-item");
        var iconFlag2 = $(e.target).is("i.iconfont");
        var goodsBrandId = $(this).data('goodsbrand');
        console.log(goodsBrandId)
        if (liFlag2) {
            option.goodsBrandId = goodsBrandId;
            init(option)
            $(this).children(".iconfont").show()
                .parents(".brand-item").siblings().hide();
            $(this).css({'background': '#0592F1'})
                .css({'color': '#fff'})
                .css({'padding-left': '10px'});
            $('.more').css({'display': 'none'});
            $(".brand-list").css({'height': '30px', 'overflow-y': 'hidden'});
        }
        if (iconFlag2) {
            option.goodsBrandId = '';
            init(option)
            $(this).children(".iconfont").hide()
                .parents("li.brand-item").css({'background': 'transparent'})
                .css({'color': '#0592F1'})
                .siblings().show();
            $('.more').css({'display': 'inline-block'});
            $(".all, .brand-list").css({'line-height': '3'});
            $(".btn-more").css({'margin-top': '0px'});
        }
    });

    /*页面渲染*/


    $('.product-top-left button').click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        var orderby = $(this).data('orderby');
        option.orderBy = orderby;
        init(option)
    });

    $("#productmenu").on("click", ".btn-more", function (e) {
        // 切换箭头
        $(".btn-more .iconfont").toggleClass("icon-more icon-shouqi");
        var flag = $(".btn-more .iconfont").is(".icon-more");

        if (flag) {
            $(".brand-list").css({
                'height': '30px',
                'overflow-y': 'hidden'
            });
            $(".btn-more").css({'margin-top': '0px'});
        } else {
            $(".brand-list")
                .css({
                    'height': '100px',
                    'overflow-y': 'auto'
                });
            $(".btn-more").css({'margin-top': '10px'});
            //$('.brand-list').scrollTop(0);
        }

    });

    // 点击其他搜索
     $("#productmenu").on("click", ".input-msg .icon-sousuo", function (e) {
        if (!$.trim($('.input-msg input').val())) {
            layer.msg('请填写品牌信息', {
                time: 2000, //2s后自动关闭
            });
            return false;
        }
        $('.input-msg input').hide();
        $('.input-msg .icon-sousuo').hide();
        $('.input-msg .oth-ct').text($('.input-msg input').val())
            .css({'padding-left': '10px'});
        option.param = $('.input-msg input').val();
        init(option);
        $('.input-msg .input-val').show();
        $('.input-msg .input-val .icon-close').css({'display': 'inline-block'});
    });

    $('.input-msg .input-val .icon-close').click(function () {
        $('.input-msg input').show();
        $('.input-msg .icon-sousuo').show();
        $('.input-msg .input-val').hide();
        $('.input-msg input').val('');
        option.param = '';
        init(option)
    });
    // 对比功能
    var comparisonMethod = {
        renderNew: function () {
            $.each(goodsArr, function (i, item) {
                var str = '<div class="fl pic"><img src=' + item.imagePath + ' alt="../img/goods.png" width="72" height="60"></div>' +
                    '<div class="fl goods-des">' +
                    '<p class=goods-price>&yen;' + item.goodsPrice + '</p>' +
                    '<p class="goods-summary">' + item.goodsName + '</p>' +
                    '</div>' +
                    '<span class="goods-src-jd"></span>' +
                    '<a href="javascript:;" idx=' + i + ' class="del">删除</a>';
                $(".contrast-product").eq(i).html(str);
            })
        },
        renderOld: function () {
            $('.goods-list').html(oldHtml);
        },
        del: function (idx) {
            goodsArr.splice(idx, 1);
            if (goodsArr.length !== 0) {
                this.renderOld();
                this.renderNew();
            } else {
                $(".contrast-container").slideUp("slow");
            }
        }
    };
    // 添加对比
     $("#productlist").on("click", ".comparison-click", function () {
     	$(this).children('.contrast').click()
     })
     $("#productlist").on("click", ".product-item .contrast", function (e) {
      		e.stopPropagation();
            var $id = $(this).attr('cid');
            var checked = $(this).prop('checked')
    	
        var $id = $(this).attr('cid');
        var checked = $(this).prop('checked');
        if (checked) {
            if (goodsArr.length >= 4) {
                $(this).prop('checked', false);
                layer.msg('不可以超过4个商品', {
                    time: 2000, //2s后自动关闭
                });
                return;
            }
            $.each(dataArr, function (i, item) {
                if (this.id == $id) {
                    goodsArr.push(dataArr[i]);
                    comparisonMethod.renderNew();
                }
            })
            $(".contrast-container").slideDown("slow");
        }
        if (!checked) {
            var idx;
            $.each(goodsArr, function (i, item) {
                if ($id == this.id) {
                    idx = i;
                }
            })
            comparisonMethod.del(idx);
        }
    });
    //删除
    $('.contrast-container').on('click', '.del', function () {
        var idx = $(this).attr('idx');
        var id = goodsArr[idx].id;
        $('.contrast').each(function (i, item) {
            if (id == $(this).attr('cid')) {
                $(this).prop('checked', false);
            }
        })
        comparisonMethod.del(idx);
    });
    //关闭
    $(".btn-close").click(function () {
        $(".contrast").prop('checked', false)
        comparisonMethod.renderOld();
        goodsArr = [];
        $(".contrast-container").slideUp("slow");
    });
    // 清空
    $(".btn-clear").click(function () {
        $('.btn-close').trigger("click")
    })
    // 加入对比
    $('.btn-contrast').click(function () {
        if (goodsArr.length == 1) {
            layer.msg('最少两个商品', {
                time: 2000, //2s后自动关闭
            });
            return;
        }
        var idurlarr = [];
        $.each(goodsArr, function (ex) {
            idurlarr.push(goodsArr[ex].id)
        })
        if(option.unitprice){
        	var comparurl = window.location.search + '&isComeFrom=true&ids=' + idurlarr.join('-');
        }else{
        	var comparurl = window.location.search + '&ids=' + idurlarr.join('-');
        }
      
        location.href = './comparison.html' + comparurl
    });
});

