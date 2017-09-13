$(function () {
    // 页面渲染

    var domData = '';
    var year = new Date().getFullYear();
    init();

    function render(data, tplIdSelector, domSelector) {
        if (data.code != "1") {
            console.log('数据加载失败');
            return;
        }
        var handle = Handlebars.compile($(tplIdSelector).html());
        var html = handle(data.data);
        $(domSelector).html(html);
    };

    function getParamOpt() {
        var opt = {};
        opt.programCode = $.trim($('#programCode').val());
        opt.programName = $.trim($('#programName').val());
        opt.govCname = $.trim($('#bdgagencyName').val());
        opt.acctyear = $.trim($('#acctyear').val());
        var text = $.trim($('#purchaseState span').text());
        if (text == '全部') {
            opt.purchaseState = '';
        }
        if (text == '采购中') {
            opt.purchaseState = 0
        }
        if (text == '已完成') {
            opt.purchaseState = 1
        }
        return opt;
    };

    function init(opt, currPage) {
        var options = $.extend({
            page: currPage || 1,
            limit: 1,
            programCode: '',
            programName: '',
            govCname: '',
            acctyear: year,
            purchaseState: '',
        }, opt)
        getdata('/js/json/plan.json', options, 'get', function (data) {
            domData = data.data;
            render(data, '#plan-tpl', '.purchasing-con');
            orgpageInit('changeNo', '.paginorange', data.data.totalPage, currPage);
        });
        $(window).scrollTop(0);
    };
    //确定查询条件
    $('.confirm').on('click', function () {
        var options = getParamOpt();
        init(options);
    });
    //重置
    $('.reset').on('click', function () {
        $('#programCode').val('');
        $('#programName').val('');
        $('#bdgagencyName').val('');
        $('#acctyear').val(year);
        $('#purchaseState span').text('全部')
    });
    //时间控件
    $('[data-toggle="datepicker"]').datepicker({
        language: "zh-CN",
        startDate: '2015',
        endDate: year,
        format: "yyyy",
        yearSuffix: '年',
        autoHide: true,
        autoPick: true,
    });

//    下拉
    $('#purchaseState').on('click', function () {
        $('.drop-menu').show();
    });
    $('.menu').on('mouseleave', function () {
        $('.drop-menu').hide();
    });
    $('.drop-menu li').on('click', function () {
        var $text = $(this).text();
        $('#purchaseState span').html($text);
        $('.drop-menu').hide();
    });
//    查看订单

    $('.purchasing-con').on('click', '.view', function () {
        var programItemId = $(this).attr('program-item-id');
        var purchaseHeadingId = $(this).attr('purchase-heading-id')
        var data = {
            programItemId: programItemId,
            purchaseHeadingId: purchaseHeadingId
        }
        location.href = './order-detail.html?' + qs(data);
    });
    //按单价选择商品
    $('.purchasing-con').on('click', '.single-price', function () {
        var $indexF = $($(this).parentsUntil('li')[3]).attr('index');
        var $indexS = $(this).attr('index');
        var data = domData.list[$indexF].purchaseheadingList[$indexS];
        var queryData = {
            programcode: data.id,
            programitemid: data.programItemId,
            catalogcode: data.systemCatalogCode,
            cataname: data.purchaseListName,
            unitprice: data.unitprice,
            cartnum: data.num,
            status: 'byPurchaseCatalog'
        };
        location.href = './product.html?' + qs(queryData);
    });
    window.init = init;
    window.getParamOpt = getParamOpt;
})

//分页回调
function changeNo(pageNo) {
    var r = /^[1-9]*[1-9][0-9]*$/;
    if (!r.test(pageNo)) {
        layer.msg('页码只能是数字！');
        return false;
    }
    $('.pageIndex').val(pageNo);
    var option = getParamOpt();
    init(option, pageNo)
};

