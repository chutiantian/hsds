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
	var fromdata={'status':'hot'};
	//var url =baseUrl+"goods/goodslist";
	var url ='../js/json/hotgoods.json';
	var msglist=getdata(url,fromdata,'',fillhotgoods);//获取json数据
	function fillhotgoods(data){
		filldom('hotgoods-templete',data,'hotgoods');//热门商品 
	}
 	
})
