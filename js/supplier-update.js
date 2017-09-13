var opt = {
    id:"",
};
function init(opt) {
    var posturl = baseUrl+'suppliecontroller/list';
    getdata(posturl, opt,'',refershoplist);//获取json数据
    function refershoplist(data){
        filldom('supplier-list', data, 'supplier-add-box');
    }
}

$(function () {
    init(opt);
});

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
function filldom(template, data, dom) {
    var myTemplate = Handlebars.compile($("#" + template).html());
    $('#' + dom).html(myTemplate(data));
}