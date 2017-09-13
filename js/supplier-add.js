$(function () {
    $('.btn-sure').click(function () {
        var shopName = $.trim($('#shop-name').val());
        var browse = $.trim($('#browse').val());
        var link = $.trim($('#link').val());
        var accountNumber = $.trim($('#account-number').val());
        var accountPassword = $.trim($('#account-password').val());
        var file = $.trim($('#file').val());
        if(!shopName){
            confirm("请输入商家名称！");
        }else if(!browse){
            confirm("请选择商家图标！");
        }else if(!link){
            confirm("请输入商家链接前缀！");
        }else if(!accountNumber){
            confirm("请输入商家账号！");
        }else if(!accountPassword){
            confirm("请输入账号密码！");
        }else if(!file){
            confirm("请选择服务承诺图片！");
        }else{
            $('.supplier-add-form').submit();
        }
    });
    $('.btn-cancel').click(function () {
        $('#image1 img').attr('src', "__PUBLIC__/images/tu.png");
    });

//图片上传预览
    document.getElementById('browse').onchange = function() {
        var imgFile = this.files[0];
        var fr = new FileReader();
        fr.onload = function() {
            document.getElementById('image1').getElementsByTagName('img')[0].src = fr.result;
        };
        fr.readAsDataURL(imgFile);
    };
});
