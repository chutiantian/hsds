window.onload = function () {
    (function () {
        var userAgent = navigator.userAgent;
        var opt = {
            loop: true,
            autoplay: 3000,
            speed: 1000,
            pagination: '.swiper-pagination',
            paginationAsRange: true
        };
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var IEVersion = parseFloat(RegExp["$1"]);
            if (IEVersion <= 8) {
                opt = {
                    loop: true,
                    autoplay: 3000,
                    speed: 1000 
                }
            }
        }
        var mySwiper = new Swiper('.swiper-container', opt)

    })()
}

$(function(){  
	var fromdata={status:'hot'};
	//var url ="http://192.168.21.66:8080/GovSceneEb/goods/goodslist";
    var url =baseUrl+"goods/goodslist";
    getdata({
    	url:url,
    	fromdata:fromdata,
    	template:'hotgoods-templete',
    	dom:'hotgoods',
    	type:'GET',
    	callback:callback,
    });//获取json数据
})
function callback(data){
	return data;
}
