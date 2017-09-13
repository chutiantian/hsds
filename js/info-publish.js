$(function () {
    //日期控件
    $('[data-toggle="datepicker"]').datepicker({
        language: "zh-CN",
        endDate: new Date().getFullYear(),
        autoHide: true,
        autoPick: true,
    });
    var editor = CKEDITOR.replace('publish-con');


    function getParamOpt() {
        var opt = {
            infoType: 1,
            isTop: 0
        };
        opt.infoTitle = $.trim($('#announments-name').val());
        opt.infoOrg = $.trim($('#publish-org').val());
        opt.publlishTime = $.trim($('#pubulish-time').val());
        opt.infoContent = editor.getData();
        return opt;
    }
    $('.submit').click(function () {
        var data = JSON.stringify(getParamOpt());
        console.log(data);
        getdata(baseUrl + 'info/save', data, 'post', function (data) {
            if (data.code != '1') {
                console.log('添加失败');
                return
            }
            location.href = './announcements.html'
        }, true)
    });
    $('.cancel').click(function () {
        location.href = './announcements.html'
    })
})