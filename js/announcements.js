$(function () { 

    function render(data, tplIdSelector, domSelector) {
        if (data.code != "1") {
            console.log('数据加载失败');
            return;
        }
        var handle = Handlebars.compile($(tplIdSelector).html());
        var html = handle(data.page);
        $(domSelector).html(html);
    };

    function init(opt, page) {
        var options = $.extend({
            infoname: "",//名字模糊查询  不传查全部
            page: page || 1,//页数
            limit: '5',//条目数
        }, opt)
        getdata(baseUrl + "/info/list", options, 'post', function (data) {
            render(data, "#announcements-tpl", "tbody");
            $('.piece-number').html(data.page.totalCount)
            orgpageInit('changeNo', '.paginorange', data.page.totalPage, data.page.currPage);
        })
    };

    function getQuery() {
        var infoname = $('#query').val();
        var opt = {
            infoname: infoname
        }
        return opt;
    };

    $('.add').on('click', function () {
        location.href = './info-publish.html'
    });
    $('.search').click(function () {
        if (!$.trim($('#query').val())) {
            layer.msg('请输入搜索条件');
            return;
        }
        init(getQuery());
    });
    $('.del').click(function () {
        var ids = [];
        $('input:checked').each(function (i, item) {
            ids.push($(this).attr("tid"))
        })
        getdata(baseUrl + 'info/delete', JSON.stringify(ids), 'post', function (data) {
            if (data.code != '1') {
                console.log('删除失败');
                return;
            }
            layer.msg('删除成功');
            init();
        }, true)
    })

    init();
    window.init = init;
    window.getQuery = getQuery;
})

function changeNo(pageNo) {
    var r = /^[1-9]*[1-9][0-9]*$/;
    if (!r.test(pageNo)) {
        layer.msg('页码只能是数字！');
        return false;
    }
    $('.pageIndex').val(pageNo);
    var opt = getQuery();
    init(opt, pageNo)
};
