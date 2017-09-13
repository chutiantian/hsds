var Order = {};

Order = {
	data: {},
	payway: "1",
	index:"0",
	activeClass: "select-selected",
	title: "",
	titleType: "",
	Box: function() {
		layer.open({
			type: 1,
			title: this.title,
			move: false,
			skin: 'layui-layer-rim', //加上边框
			area: ['500px', '380px'], //宽高
			content:'<form method="post" action="" id="loginform">' +
				'<div id="login">' +
				'<div class="div1">'+
				'<span class="location">所在地区：</span>' +
				'<section class="js-area"></section>' +
				'<ul id="street">' +
				'<li>其他</li>'+				
				'</ul>' +
				'<ul class="street-ul">' +				
				'</ul>' +
				'</div>'+
				'<div>' +
				'<span>详细地址：</span>' +
				'<input type="text" id="addAddress" />' +
				'</div>' +
				'<div>' +
				'<span>收货人：</span>' +
				'<input type="text" id="addReceiver" />' +
				'</div>' +
				'<div>' +
				'<span>手机号：</span>' +
				'<input type="text" id="addReceiveTel" />' +
				'</div>' +
				'<p class="default-add"><input type="checkbox" />是否设置默认地址</p>' +
				'<div>' +
				'<button type="button" class="buttongro">保存并使用</button>' +
				'</div>' +
				'</div>' +
				'</form>'
		})
	},
	GetQueryString: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return encodeURI(r[2]);
		return '';
	},	
	regtest: function(ret) {
	},
	init: function() {
		step.goStep(2);
		this.getData(); //获取数据
		this.bindEvents() //事件绑定
	},
	getData: function() {
		Handlebars.registerHelper("transformOrderType", function(orderType) {
			if(orderType == 1) {
				return '京 东'
			}
			if(orderType == 2) {
				return '苏 宁'
			}
		});
//		var idS = {
//			"ids": this.GetQueryString('ids').split('-').join(','),
//		};
//		if(idS.ids.length != 0) {
			$.ajax({
				"type": "GET",
				//"data": idS,
				cache: false,
				//"url": baseUrl + "cart/queryOrderConfirmInfo",
				"url":"../js/json/order-confirm.json",
				"success": $.proxy(this.getDataSuccess, this),
			});
//		} else {
//			console.log("参数错误")
//		};
	},
	getDataSuccess: function(result) {		
		this.data = result;
		this.shippingAddressTemplateRender();
		this.invoiceHeadingRender(this.data);
		this.goodsListRender(this.data);
		this.amountPayable(this.data);
		this.shippingInfo(this.data);
	},
	//收货地址渲染()
	shippingAddressTemplateRender: function() {
		var get = $("#shippingaddressOne").html();
		var template = Handlebars.compile(get);
		var getStr = template(this.data.ebOmReceiveList[0]);
		$(".addr-cuurent").html(getStr);	
		$(".mor-addS").css("display","none");
		$(".mor-add").css("display","block");
		//点击删除
		$(".addr-delete").on("click", $.proxy(this.deleteAddLi, this));
		//点击修改
		$(".addr-revise").on("click", $.proxy(this.receiveUpdate, this));
	},
	//更多地址()
	shippingAddressTemplateRenderM: function() {
		if(this.data.ebOmReceiveList.length<=1){
			layer.msg("暂无更多地址");
			return
		}
		var get = $("#shippingaddress").html();
		var template = Handlebars.compile(get);
		var getStr = template(this.data.ebOmReceiveList);
		$(".addr-cuurent").html(getStr);
		$(".mor-addS").css("display","block");
		$(".mor-add").css("display","none");
		$(".addr-ico").attr("style", "background-position: -11px 1px");
		var firstLi = $(".more-li").eq(0);
		firstLi.attr("style", "border:1px solid #008bf7;background:#e7f3fe;cursor: pointer;");
		$(".more-li").hover(function(e){
			//firstLi.attr("style", "border:none;background:#fff;");
			//$(".more-li").attr("style","border:2px solid #158ef4;background:#fff;cursor: pointer;")			
			$(e.currentTarget).attr("style", "border:1px solid #fff;background:#e7f3fe;cursor: pointer;");	
			firstLi.attr("style", "border:1px solid #008bf7;background:#e7f3fe;cursor: pointer;");
		},function(e){
			$(this).attr("style", "border:1px solid #fff;background:#fff;");
			firstLi.attr("style", "border:1px solid #008bf7;background:#e7f3fe;cursor: pointer;");
		})
		//点击地址所在li
		$(".more-li").on("click", $.proxy(this.changeLiStyle, this));
		//点击删除
		$(".addr-delete").on("click", $.proxy(this.deleteAddLi, this));
		//点击修改
		$(".addr-revise").on("click", $.proxy(this.receiveUpdate, this));				
	},
	//发票抬头()
	invoiceHeadingRender: function(data) {
		if(data.ebOmInvoice != null) {
			$(".input").attr("placeholder", data.ebOmInvoice.invoiceHeading);
		};
	},
	//商品列表()
	goodsListRender: function(data) {
		var getl = $("#goods-list-template").html();
		var template = Handlebars.compile(getl);
		var getlStr = template(data.goods);
		$(".w1160").html(getlStr);
	},
	//应付金额()
	amountPayable: function(data) {
		var sum = 0;
		for(i = 0; i < data.goods.length; i++) {
			sum += parseInt(data.goods[i].subtotal*100);
		}
		$(".pay-text").html("￥" + sum/100);
	},
	//收货信息()
	shippingInfo: function(data) {
		var get = $("#goods-info-template").html();
		var template = Handlebars.compile(get);
		var getStr = template(data.ebOmReceiveList[0]);
		$(".goods-info").html(getStr);
	},
	//收货地址所在Li点击事件
	changeLiStyle: function(e) {
//		e.stopPropagation(e);		
		$(".more-li").attr("style", "border:0px solid #ccc");
		var index = $(e.target).parent().index();
		var oneCode = this.data.ebOmReceiveList[index].oneStatus;
		var twoCode = this.data.ebOmReceiveList[index].twoStatus;
		var threeCode = this.data.ebOmReceiveList[index].threeStatus;
		var value = {
			"oneStatus":oneCode,
			"twoStatus":twoCode,
			"threeStatus":threeCode,
			"receiveAddress": $(e.target).parent().find(".receiveAddress").html(),
			"receiver": $(e.target).parent().find(".span1").html(),
			"receiveTel": $(e.target).parent().find(".span3").html(),
			"isDefault": "1",
			"id": this.data.ebOmReceiveList[index].id
		};
		this.ajaxChooseUpdate(value)		
	},
	ajaxChooseUpdate:function(value){
		$.ajax({
			type: "POST",
			cache:false,
			url: baseUrl + "receive/update",
			contentType: 'application/json',
			data: JSON.stringify(value),
			success: $.proxy(this.getData,this)
		})
	},
	//删除事件
	deleteAddLi: function(e) {
		e.stopPropagation(e);
		var index = $(e.target).parent().index();
		var id = this.data.ebOmReceiveList[index].id;
		$(e.target).parent().remove();		
		this.receiveDelete(id)
	},
	receiveDelete:function(id){
		var idS = [id];
		$.ajax({
			type: "POST",
			cache:false,
			url: baseUrl + "receive/delete",
			contentType: 'application/json',
			data:JSON.stringify(idS),
			success: $.proxy(this.getData,this)
		})
	},
	//修改事件
	addCode:{
		provinceRegionCode:"",
		cityRegionCode:"",
		areaRegionCode:""
	},
	index:"",
	receiveUpdate: function(e) {
		e.stopPropagation(e);
		this.title = "修改收货地址";
		this.titleType = "revise";
		//弹框显示
		this.Box();
		//修改接口的参数
		var val = {
			"receiveAddress": $(e.target).parent().find(".receiveAddress").text(),
			"receiver": $(e.target).parent().find(".span1").text(),
			"receiveTel": $(e.target).parent().find(".span3").text()
		};
		var index = $(e.target).parent().index();
		this.index=index;		
		var oneCode = this.data.ebOmReceiveList[index].oneStatus;
		var twoCode = this.data.ebOmReceiveList[index].twoStatus;
		var threeCode = this.data.ebOmReceiveList[index].threeStatus;
		//获取相应修改的省市区
		var oneName = this.data.ebOmReceiveList[index].oneName;
		var twoName = this.data.ebOmReceiveList[index].twoName;
		var threeName = this.data.ebOmReceiveList[index].threeName;
		
		this.addCode.provinceRegionCode = oneCode;
		this.addCode.cityRegionCode = twoCode;
		this.addCode.areaRegionCode = threeCode;
		//初始省市区对象
//		if(!this.province) {
			this.province = new Province(".js-area");
			this.city = new City(".js-area");
			this.area = new Area(".js-area");
			
			$(this.province).on("change",$.proxy(this.handleProvinceChange),this);
			$(this.city).on("change",$.proxy(this.handleCityChange),this);
//		}
		
		this.province.setTitle(oneName);
		this.handleProvinceChange({regionCode:oneCode});
		//$(this.province).trigger(new Event("change",{regionCode:oneCode}))
		
		this.city.setTitle(twoName);
		this.handleCityChange({regionCode:twoCode});
		//$(this.city).trigger(new Event("change",{regionCode:twoCode}))
		
		this.area.setTitle(threeName);
		
		$("#addAddress").val(val.receiveAddress);
		$("#addReceiver").val(val.receiver);
		$("#addReceiveTel").val(val.receiveTel);						
	},
	
	//新增事件
	receiveSave: function() {
		var ebOmReceiveListLength=this.data.ebOmReceiveList.length;
		if(ebOmReceiveListLength>=10){
			alert("最多只能新增十条地址！！！")
		}else{
			this.title="新增收货地址";
			this.titleType="add";
			//弹框显示
			this.Box();			
		};
		//初始省市区对象
//		if(!this.province) {
			this.province = new Province(".js-area");
			this.city = new City(".js-area");
			this.area = new Area(".js-area");
			//监听省份对象触发的改变事件
			$(this.province).on("change",$.proxy(this.handleProvinceChange),this);
			//监听城市对象触发的改变事件
			$(this.city).on("change",$.proxy(this.handleCityChange),this);			
//		}
	},
	//省份改变执行
	handleProvinceChange: function(obj) {
		this.city.changeCity(obj);
		this.city.reset();
		this.area.reset();
	},
	//城市改变执行
	handleCityChange: function(obj){
		this.area.ChangeArea(obj);
		this.area.reset();
	},
	
	handleButtonClick: function() {		
		if(this.titleType == "add") {						
			var ret = {
				"oneStatus":"",
				"twoStatus":"",
				"threeStatus":"",
				"receiveAddress": "", //详细地址
				"receiver": "", //收货人
				"receiveTel": "", //手机号
				"isDefault": "" //是否默认										
			};			
			ret.oneStatus = this.addCode.provinceRegionCode;
			ret.twoStatus = this.addCode.cityRegionCode;
			ret.threeStatus = this.addCode.areaRegionCode;
			
			ret.receiveAddress = $("#addAddress").val();
			ret.receiver = $("#addReceiver").val();
			ret.receiveTel = $("#addReceiveTel").val();
			if($("#province li").text()=="请选择省份"){
				layer.msg("请选择省份");
				return
			}
			if($("#city li").text()=="请选择城市"){
				layer.msg("请选择城市")
				return
			}
			if($("#area li").text()=="请选择地区"){
				layer.msg("请选择地区");	
				return
			}
			//---------------是否勾选默认判断----------------
			if($("input[type='checkbox']").is(':checked')) {
				ret.isDefault = 1
			} else {
				ret.isDefault = 0
			}
			//---------------保存并使用新增收货地址参数验证-------------			
			if(!ret.receiveAddress) {
				layer.msg("请输入详细地址");
				return;
			}
			if(!ret.receiver) {
				layer.msg("请输入收货人");
				return;
			}
			if(!ret.receiveTel) {
				layer.msg("请输入收货人手机号");
				return;
			};
			if(/^1[3|4|5|8]\d{9}$/.test(ret.receiveTel)) {

			} else {
				layer.msg("手机号格式错误");
				return;
			};
			this.ajaxSave(ret);
			layer.closeAll();						
		} else {
			var ret = {
				"oneStatus":"",
				"twoStatus":"",
				"threeStatus":"",
				"id": "", //地址主键
				"receiveAddress": "", //详细地址
				"receiver": "", //收货人
				"receiveTel": "", //手机号
				"isDefault": "" //是否默认
			};			
			ret.oneStatus = this.addCode.provinceRegionCode;
			ret.twoStatus = this.addCode.cityRegionCode;
			ret.threeStatus = this.addCode.areaRegionCode;
			ret.id = this.data.ebOmReceiveList[this.index].id;
			ret.receiveAddress = $("#addAddress").val();
			ret.receiver = $("#addReceiver").val();
			ret.receiveTel = $("#addReceiveTel").val();
			if($("#province li").text()=="请选择省份"){
				layer.msg("请选择省份");
				return
			}
			if($("#city li").text()=="请选择城市"){
				layer.msg("请选择城市")
				return
			}
			if($("#area li").text()=="请选择地区"){
				layer.msg("请选择地区");	
				return
			}
			//---------------是否勾选默认判断----------------
			if($("input[type='checkbox']").is(':checked')) {
				ret.isDefault = 1
			} else {
				ret.isDefault = 0
			}
			//---------------保存并使用新增收货地址参数验证-------------
			
			if(!ret.receiveAddress) {
				layer.msg("请输入详细地址");
				return;
			}
			if(!ret.receiver) {
				layer.msg("请输入收货人");
				return;
			}
			if(!ret.receiveTel) {
				layer.msg("请输入收货人手机号");
				return;
			};
			if(/^1[3|4|5|8]\d{9}$/.test(ret.receiveTel)) {

			} else {
				layer.msg("手机号格式错误");
				return;
			};
			this.ajaxUpdate(ret);
			layer.closeAll();
		};		
	},
	ajaxSave:function(ret){
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: baseUrl + "receive/save",
			data: JSON.stringify(ret),
			success: $.proxy(this.getData,this)
		})
	},
	ajaxUpdate:function(ret){
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: baseUrl + "receive/update",
			data: JSON.stringify(ret),
			success: $.proxy(this.getData,this)
		})
	},
	//支付方式
	returnPayWay: function(e) {
		var myBotton = $(e.target);
		this.payway = myBotton.index() + 1;
		if(myBotton.hasClass(this.activeClass)) {
			return;
		} else {
			$(".button-group").removeClass(this.activeClass);
			myBotton.addClass(this.activeClass);
		}
	},
	//提交
	orderSuccess: function() {
		$(".order-btn").attr({"disabled":"disabled","style":"background:#ccc"});
		var successData = {};
		var length=this.data.goods.length;
		//-------提交订单成功参数 ---------
		var obj={};
		var arr=[];
		for (var i=0;i<length;i++) {				
			obj={
				"cartId":this.data.goods[i].id,//商品主键
				"cartNum":this.data.goods[i].cartNum//商品数量
			};
			arr[arr.length]=obj
		};	
		var successret = {
			"oneStatus":this.data.ebOmReceiveList[0].oneStatus,//省编码
			"twoStatus":this.data.ebOmReceiveList[0].twoStatus,//市编码
			"threeStatus":this.data.ebOmReceiveList[0].threeStatus,//县编码
			"receiveAddress": this.data.ebOmReceiveList[0].receiveAddress, //详细地址
			"receiver": this.data.ebOmReceiveList[0].receiver, //收货人
			"receiveTel": this.data.ebOmReceiveList[0].receiveTel, //手机号
			"invoiceHeading": this.data.ebOmInvoice?this.data.ebOmInvoice.invoiceHeading:"", //发票抬头名称
			"payWay": this.payway||1, //支付方式
			"dataList":arr
		};
		this.ajaxSubmitOrders(successret)			
	},
	ajaxSubmitOrders:function(successret){
		$.ajax({
			//"type": "POST",
			//"data": JSON.stringify(successret),
			//"url": baseUrl + "order/submitOrders",
			"url":"../js/json/submit-order.json",
			"contentType": 'application/json',
			"success":$.proxy(this.orderComplateRender,this)
		});							
	},
	orderComplateRender:function(res){
		successData = res.data.success;
		failedData = res.data.failed;	
		if(res.code==0){
			var tpl = Handlebars.compile($("#t-order-failed").html());
			$(".main").html(tpl(failedData));						
		}else if(res.code==1){
			if(!failedData){
				var tpl = Handlebars.compile($("#t-order-success").html());
				$(".main").html(tpl(successData));
//			}else{					
//				
//				var tpl = Handlebars.compile($("#t-order-success").html());
//				$(".main").html(tpl(successData));
			}else{
				var tpl = Handlebars.compile($("#t-order-success-failed").html());
				$(".main").html(tpl(res.data));
			}
		}else{
			layer.msg("服务器错误,请刷新页面")
		};
		step.goStep(3);		
	},	
	bindEvents: function() {
		//点击更多地址
		$(".mor-add").on("click", $.proxy(this.shippingAddressTemplateRenderM,this));
		//点击收起更多地址
		$(".mor-addS").on("click", $.proxy(this.shippingAddressTemplateRender,this));				
		//点击新增
		$(".mod").on("click", $.proxy(this.receiveSave,this));
		//点击支付方式
		$(".button-group").on("click", $.proxy(this.returnPayWay,this));
		//点击提交
		$(".order-btn").on("click", $.proxy(this.orderSuccess,this));
		// 绑定保存地址
		$("body").on("click", '.buttongro',  $.proxy(this.handleButtonClick,this));
	},
};
//省份对象
function Province(container){
	this.container = $(container);
	this.createDom();
	this.getData();
	this.bindEvents();
};
Province.prototype={
	data:{},
	show:false,
	//创建元素
	createDom: function() {
		this.elem = $('<ul id="province"><li>请选择省份</li></ul><ul class="province-ul"></ul>');
		this.container.append(this.elem);
	},
	//获取省份数据
	getData:function(){
		var this_ = this;
		$.ajax({
			//type: "post",
			dataType:'json',
			//url: baseUrl + "deliveraddresscontroller/queryonelevel",
			url:"../js/json/province.json",
			success: function(data){
				this_.data=data	
			}
		})
	},
	bindEvents:function(){
		var this_ = this;
		$("#province li").on("click",$.proxy(this.getProvData,this));//点击请选择
		$(".province-ul").on("click","li",function(){
			this_.handleProvinceClick($(this));
		});//点击省
	},
	//是否渲染省
	getProvData:function(event){	
		if(event.stopPropagation){
		    event.stopPropagation();
		}else{
		    event.cancelBubble=true;
		}
//		if(!this.show){			
			this.provinceTemplateRender();
			if($(".city-ul").find("li")){
				$(".city-ul").attr("style","display:none;")
			}
			if($(".area-ul").find("li")){
				$(".area-ul").attr("style","display:none;")
			}
			
//		}else{
//			$(".province-ul").css("display","none");			
//		};
//		this.show = !this.show;
	},
	//渲染省份
	provinceTemplateRender:function(){		
		this.elem.find(".province-ul").css("display","block");
		var get = $("#province-template").html();
		var template = Handlebars.compile(get);
		var getStr = template(this.data.ebOmDeliveraddress);
		$(".province-ul").html(getStr);
		$(".province-ul").attr("style","border:1px solid #ccc;");
		$(".province-ul li").hover(function(){
			$(this).attr("style","background:#168ff3;color:#fff");			
		},function(){
			$(this).attr("style","background:#fff;")
		});			
	},
	//点击省
	handleProvinceClick: function(span){
		$("#province li").text(span.text());
		$(".province-ul").attr("style","display:none;");
		//保存所点省份的标志码
		var provinceRegionCode= span.attr("value");
		//点击保存地址时的省份参数
		Order.addCode.provinceRegionCode = provinceRegionCode;
		//获取城市数据的参数
		var obj={
			"regionCode":provinceRegionCode, 
		};
		//省份对象向外触发事件（传参obj）
		//$(this).trigger(new Event("change", obj));
		Order.handleProvinceChange(obj);
	},
	//设置点击修改时的默认显示
	setTitle: function(provice){
		$("#province li").text(provice);
	}	
};

//城市对象
function City(container){
	this.container = $(container);
	this.createDom();
	this.bindEvents();
};
City.prototype={
	elem:"",
	data:{},
	show:false,
	createDom: function() {
		this.elem = $('<ul id="city"><li>请选择城市</li></ul><ul class="city-ul"></ul>');
		this.container.append(this.elem);
	},
	changeCity: function(obj) {

		this.getData(obj);
	},
	//获取城市数据
	getData:function(obj){
		var this_ = this;
		$.ajax({
			//type: "post",
			dataType:'json',
			//data:obj,
			//url: baseUrl + "deliveraddresscontroller/querylevels",
			url:"../js/json/city.json",
			success: function(data){
				this_.data=data;
			}	
		})
	},
	bindEvents:function(){	
		var this_ = this;
		$("#city li").on("click",$.proxy(this.getCityData,this));//点击请选择
		$(".city-ul").on("click","li",function(){
			this_.handleCitySelect($(this));
		});//点击
	},
	//设置点击修改时的默认显示
	setTitle: function(city){
		$("#city li").text(city);
	},
	//点击城市列表
	handleCitySelect: function(span){
		
		$("#city li").text(span.text());
		$(".city-ul").attr("style","display:none;")
		//获取所点城市标志码
		
		var cityRegionCode=span.attr("value");
		//点击保存地址时的城市参数
		Order.addCode.cityRegionCode = cityRegionCode;
		var obj={
			"regionCode":cityRegionCode, 
		};
		//城市对象向外触发改变事件
		//$(this).trigger(new Event("change",obj))
		Order.handleCityChange(obj)
	},
	getCityData:function(event){
		if($("#province").text()=="请选择省份"){
			layer.msg("请选择省份");
			return;
		}
		if(event.stopPropagation){
		    event.stopPropagation();
		}else{
		    event.cancelBubble=true;
		}
		//新增时点击选择是否渲染城市
//		if(!this.show){
			this.cityTemplateRender();
			if($(".province-ul").find("li")){
				$(".province-ul").attr("style","display:none;")
			}
			if($(".area-ul").find("li")){
				$(".area-ul").attr("style","display:none;")
			}
//		}else{
//			$(".city-ul").css("display","none");			
//		}
//		this.show = !this.show;		
	},
	//渲染城市
	cityTemplateRender:function(){
		this.elem.find(".city-ul").css("display","block");
		var get = $("#city-template").html();
		var template = Handlebars.compile(get);
		var getStr = template(this.data.ebOmDeliveraddress);
		$(".city-ul").html(getStr);
		$(".city-ul").attr("style","border:1px solid #ccc;");
		$(".city-ul li").hover(function(){
			$(this).attr("style","background:#168ff3;color:#fff");		
		},function(){
			$(this).attr("style","background:#fff;")
		});				
	},
	reset: function(){
		$("#city").find("li").html("请选择城市")
	}
};
//地区对象
function Area(container){
	this.container = $(container);
	this.createDom();
	this.bindEvents();
};
Area.prototype={
	elem:"",	
	data:{},
	createDom: function() {
		this.elem = $('<ul id="area"><li>请选择地区</li></ul><ul class="area-ul"></ul>');
		this.container.append(this.elem);
	},
	ChangeArea: function(obj){
		this.getData(obj);
	},	
	getData:function(obj){
		var this_ = this;
		$.ajax({
			//type: "post",
			dataType:'json',
			//data:obj,
			//url: baseUrl + "deliveraddresscontroller/querylevels",
			url:"../js/json/area.json",
			success: function(data){
				this_.data=data
			}
		})
	},
	bindEvents:function(){
		var this_ = this;
		$("#area li").on("click",$.proxy(this.getAreaData,this));//点击请选择
		$(".area-ul").on("click","li",function(){
			this_.handleAreaChange($(this));
		});//点击
	},
	getAreaData:function(event){
		if($("#city").text()=="请选择城市"){
			layer.msg("请选择城市");
			return;
		}
		if(event.stopPropagation){
		    event.stopPropagation();
		}else{
		    event.cancelBubble=true;
		}
//		if(!this.show){			
			this.areaTemplateRender();
			if($(".province-ul").find("li")){
				$(".province-ul").attr("style","display:none;")
			}
			if($(".city-ul").find("li")){
				$(".city-ul").attr("style","display:none;")
			}
//		}else{
//			$(".area-ul").css("display","none");			
//		}
//		this.show = !this.show;			
	},
	//渲染地区
	areaTemplateRender:function(){
		$(".area-ul").attr("style","display:block;");
		var get = $("#city-template").html();
		var template = Handlebars.compile(get);
		var getStr = template(this.data.ebOmDeliveraddress);
		$(".area-ul").html(getStr);
		$(".area-ul").attr("style","border:1px solid #ccc;");
		$(".area-ul li").hover(function(){
			$(this).attr("style","background:#168ff3;color:#fff");		
		},function(){
			$(this).attr("style","background:#fff;")
		});
	},
	//点击地区
	handleAreaChange: function(span){
		$("#area li").text(span.text());
		$(".area-ul").attr("style","display:none;");	
		var areaRegionCode=span.attr("value");
		//点击保存地址时的地区参数
		Order.addCode.areaRegionCode = areaRegionCode;		
	},
	//设置点击修改时的默认显示
	setTitle: function(area){
		$("#area li").text(area);
	},				
	reset: function(){
		$("#area").find("li").html("请选择地区")
	}
};

$(document).ready(function() {	
	Order.init();	
});
$(document).on('click',function(){
	$(".province-ul").hide();
	$(".city-ul").hide();
	$(".area-ul").hide();
})
