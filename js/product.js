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
    goodsBrand: '',
    goodsBrandId: '',
    queryOption: true,
    queryGoods: true,
    param: '',
    orderBy: '',
    page: 1,
    limit: '20',
};
//var posturl = baseUrl + 'goods/goodslist';
var posturl='../js/json/product.json';
var posturl1='../js/json/brand.json'
function initall(opt) {
    opt.queryOption = true;
    opt.queryGoods = false;
    getdata(posturl1, opt, '', fillgoodsmenu);//获取json数据
    function fillgoodsmenu(data) {
        if (option.unitprice) {
            var unitprice = GetQueryString('unitprice') ? (parseInt(GetQueryString('unitprice') * 0.8) + '-' + GetQueryString('unitprice')) : '';
            data.unitprice = unitprice || false;
        }
        filldom('productmenu-templete', data, 'productmenu'); 
        var s = 0;
        $.each($('#productmenu li.brand-item'), function (ex) {
            s += parseInt($(this).width() + 25);
        })
        s > $('.select-left').width() ? $('span.more').css('display', 'inline-block') : $('span.more').css('display', 'none')
    }
}

function init(opt) {
    opt.queryGoods = true;
    opt.queryOption = false;
    getdata(posturl, opt, '', fillgoodslist);//获取json数据
    function fillgoodslist(data) {
        filldom('productlist-templete', data, 'productlist');        
        $("img").lazyload({placeholder: "../img/loading.png", effect: "fadeIn"});
        $.each(goodsArr, function (i, item) {
            var id = item.id;
            $('.contrast').each(function (index, value) {
                if (id == $(this).attr('cid')) {
                    $(this).prop('checked', true);
                }
            })
        });
        dataArr = [];
        dataArr = data.page.list;
        orgpageInit('changeNo', '.paginorange', data.page.totalPage, opt.page);
      		
    }


}

function changeNo(pageNo) {
    var r = /^[1-9]*[1-9][0-9]*$/;
    if (!r.test(pageNo)) {
        layer.msg('页码只能是数字！');
        return false;
    }

    $('.pageIndex').val(pageNo);
    option.page = pageNo
   	$(window).scrollTop('405');
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
    option.catalogCode = GetQueryString('catalogcode') || '';
    option.goodsName = decodeURI(decodeURI(GetQueryString('goodsname'))) || '';
    option.isprogram = GetQueryString('isprogram') || '';
    option.goodsSource = GetQueryString('goodssource') || '';
    option.status = GetQueryString('status') || '';
    var cataname = decodeURI(decodeURI(GetQueryString('cataname'))) || '';
    var sourcename = decodeURI(decodeURI(GetQueryString('sourcename'))) || '';
    var programcode = GetQueryString('programcode') || '';
    //option.unitprice=GetQueryString('unitprice')?(parseInt(GetQueryString('unitprice')*0.8)+'-'+ GetQueryString('unitprice')) : '';
    option.unitprice = GetQueryString('unitprice');
    if (option.goodsSource) {
        breadcrumb += '<span>&nbsp;&gt;&nbsp;</span>';
        breadcrumb += '<span><a href="product.html?goodssource=' + option.goodsSource + '&status=byGoodsName&sourcename=' + sourcename + '">' + sourcename + '</a></span>';
    }
    breadcrumb += '<span>&nbsp;&gt;&nbsp;</span>';
    breadcrumb += '<span>' + option.goodsName + cataname + '</span>';
    $('.breadcrumb').html(breadcrumb);

    initall(option);
    init(option);
    // 点击价格区间
    $("#productmenu").on("click", ".price-item.goods-price", function (e) {
        e.stopPropagation();
        var liFlag1 = $(e.target).is("li.price-item");
        var iconFlag1 = $(e.target).is("i.iconfont");
        var goosPrice = $(this).data('goodsprice');
        if (liFlag1) {
        	$('.select span.unlimited').removeClass('active')
            option.page = 1;
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
        	$('.select span.unlimited').addClass('active')
            option.page = 1;
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
    $('#productmenu').on('click', '.unprice', function () {
        option.goodsPrice = '';
        $('.select span.unlimited').removeClass('active')
        option.page = 1;
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
        if (liFlag2) {
        	$('.select-left span.all').removeClass('active')
            option.page = 1;
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
        	$('.select-left span.all').addClass('active')
            option.page = 1;
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
           if($(".btn-more .iconfont").hasClass("icon-shouqi")){
           	$(".btn-more .iconfont").removeClass("icon-shouqi").addClass('icon-more')
           }
    });

    /*页面渲染*/


    $('.product-top-left button').click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        var orderby = $(this).data('orderby');
        option.page = 1;
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
        option.page = 1;
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
        option.page = 1;
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
                    '<span class="goods-src-' + item.goodsSource + '"></span>' +
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
        if (option.unitprice) {
            var comparurl = window.location.search + '&isComeFrom=true&ids=' + idurlarr.join('-');
        } else {
            var comparurl = window.location.search + '&ids=' + idurlarr.join('-');
        }

        location.href = './comparison.html' + comparurl
    });
});


 