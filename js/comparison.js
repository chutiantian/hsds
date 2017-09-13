(function ($) {
    var renderData = {};
    var idx = '';
    var queryData = {};
    var $mask = $('.comparison-mask');
    var $tip = $('.comparison-tip');
    var $joinCart = $('.join-cart');
    var isComeFrom = GetQueryString('isComeFrom');
    var historyCompare = GetQueryString('historyCompare');
    var ids = GetQueryString('ids').split('-').join(',');
    var orderitemId = GetQueryString('orderitemId');
    var cataname = decodeURI(decodeURI(GetQueryString('cataname')));
    var goodsName = decodeURI(decodeURI(GetQueryString('goodsname')));
    var programCode = GetQueryString('programcode');
    var catalogCode = GetQueryString('catalogcode');
    var unitprice = GetQueryString('unitprice');
    var programItemId = GetQueryString('programitemid');
    var cartNum = GetQueryString('cartnum');
    var url = historyCompare ? baseUrl + 'orderhis/queryOrderhisInfo' : baseUrl + 'goods/queryGoddsCompareList';
    !!ids && (queryData.ids = ids);
    !!orderitemId && (queryData.orderitemId = orderitemId);
    !isComeFrom && $joinCart.remove();
    !!isComeFrom && render({ code: "1", name: cataname || goodsName }, '#breadcrumb-tpl', '.breadcrumb');

    function render(data, tplIdSelector, domSelector) {
        if (data.code != "1") {
            console.log('加载失败');
            return;
        }
        var handle = Handlebars.compile($(tplIdSelector).html());
        var html = handle(data);
        $(domSelector).html(html);
    };
    Handlebars.registerHelper("transformOrderType", function (orderType) {
        if (orderType == 1) {
            return '京东'
        }
        if (orderType == 2) {
            return '苏宁'
        }
    });
    Handlebars.registerHelper("isShow", function (state) {
        if (state == 0) {
            return 'checked';
        }
        return false;
    });

    //获取加入购物车数据列表
    function getList() {
        var listArr = [];
        $('input:radio').each(function (i, item) {
            var itemObj = {};
            itemObj.id = $(this).val();
            // itemObj.sortNo = $(this).attr('idx');
            itemObj.isCheck = $(this).prop('checked') ? 1 : 0;
            listArr.push(itemObj);
        })
        return listArr;
    };
    //页面初始化
    getdata("/js/json/compare.json", queryData, 'get', function (data) {
        data.isComeFrom = isComeFrom;
        renderData = data;
        render(data, '#compare-tpl', '.comparison-con');
        render({ code: '1', data: data.orderhisList[0] }, '#join-cart-tpl', '.join-cart')
    })
    //面包屑跳转
    $('.breadcrumb').on('click', '.jump', function () {
        var jumpData = {
            programcode: programCode,
            catalogcode: catalogCode,
            cataname: cataname,
            goodsname: goodsName,
            unitprice: unitprice,
            status: 'byPurchaseCatalog'
        }
        location.href = './product.html?' + qs(jumpData);
    });
    // 选择功能
    $('.comparison-con').on('click', 'input', function () {
        if ($(this).attr('idx') != 0) {
            $mask.show();
            $tip.show();
            return;
        }
        render({ code: '1', data: renderData.orderhisList[0] }, '#join-cart-tpl', '.join-cart')
    });
    $('.confirm').on('click', function () {
        $mask.hide();
        $tip.hide();
        idx = $('input:checked').attr('idx');
        console.log(idx);
        console.log(renderData.orderhisList[idx])
        render({ code: '1', data: renderData.orderhisList[idx] }, '#join-cart-tpl', '.join-cart')
    });
    $('.cancel').on('click', function () {
        $mask.hide();
        $tip.hide();
        $('input:radio').eq(idx).prop('checked', 'checked')
    });

    //加入购物车
    function ballMove() {
        var num = parseInt($('.hmb-cart-tips i').html());
        num++;
        $('.redBall').animate({ top: 0 }, 800);
        $('.redBall').fadeOut('fast', function () {
            $('.hmb-cart-tips i').html(num);
        });
    };
    $(".join-cart").on('click', '.dec-tit,.join-product img', function (e) {
        var id = $(this).attr("gid")
        window.open("/detail.html")
    })
    $('.join-cart').on('click', '.join-btn', function () {
        var paramData = {
            purchaseHeadingId: programCode,
            programItemId: programItemId,
            systemCatalogCode: catalogCode,
            cartNum: (cartNum - 0) || 3,
            dataList: getList()
        };
        getdata("/js/json/join-cart.json", {}, 'get', function (data) {
            if (data.code != '1') {
                layer.msg(data.msg)
                return;
            }
            layer.msg("加入成功");
            $('.join-btn').html('加入成功').css({ background: '#ccc' }).attr("disabled", 'disabled');
            $('input:radio').attr("disabled", 'disabled');
            $('.redBall').show("fast");
            document.documentElement.scrollTop > 0 && $(document.documentElement).animate({ scrollTop: '0px' }, 1000, function () {
                ballMove()
            });
            window.pageYOffset && $(window).animate({ pageYOffset: '0px' }, 800, function () {
                ballMove()
            });
            document.body.scrollTop >= 0 && $(document.body).animate({ scrollTop: '0px' }, 800, function () {
                ballMove()
            });
        }, true)
    });
})(jQuery);
