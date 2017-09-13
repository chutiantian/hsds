$(function(){
	var postdata={govid:''};
	getDrewAnalysis()//获取整体采购分析
	$('.menu-changeval').on('click','ul li',function(){
		if($(this).attr('data-govid')!=""){
			if(!$('#partnames').hasClass('showall')){
				$('#partnames').addClass('showall');
				$('#partnames').prepend('<li data-govid = "">全部</li>')
			}			
		}
		$(this).parent().siblings('button').find('span').text($(this).text());
		postdata.govid=$(this).attr('data-govid');
		getDrewAnalysis();
	})
	/*采购单位*/
     getdata('../js/json/partment.json','','',partment);//获取json数据
     function partment(data){
    	filldom('partnames-tpl', data, 'partnames');
     }	
	function getDrewAnalysis(){
	     getdata('../js/json/getAnalysis.json',postdata,'',getAnalysis);//获取json数据
	     function getAnalysis(data){
	     	var analysis=new drewAnalysis('drew-analysis');
	     	analysis.init(data);
	     	var tabhtml='';
	     	for(var i=0;i<12;i++){
	     		tabhtml+='<tr><td>'+data.dates[i]+'</td><td>'+data.discounts[i]+'</td><td>'+data.subductions[i]+'</td></tr>'
	     	}
	    	$('#exaldatatbd').html(tabhtml);
	     }	
	}
	
	
	/*订单数量对比*/
	     getdata('../js/json/pie.json','','',getOrderNum);//获取json数据
	     function getOrderNum(data){
	    
	     	if(data.code==1){
	     	var contrast1=new orderNum('drew-contrast1');
	     	contrast1.init(data)
	     	}
	     }	
	/*金额数量对比*/
	     getdata('../js/json/pie.json','','',getMoneyNum);//获取json数据
	     function getMoneyNum(data){
	     	if(data.code==1){
	     	var contrast2=new moneyNum('drew-contrast2');
	     	contrast2.init(data)
	     	}
	     }	
	     
	     $('button').click(function(){
	     	if(!$(this).hasClass('btn-active')){
	     		var _idx=$(this).index();
	     		$(this).addClass('btn-active').siblings('button').removeClass('btn-active');
	     		if(_idx==0){
	     			$('#drew-analysis').addClass('showdiv').siblings('#exaldata').removeClass('showdiv');
	     			$('.menu-down').hide().siblings('.menu-changeval').show();
	     		}else{
	     			$('#exaldata').addClass('showdiv').siblings('#drew-analysis').removeClass('showdiv')	
	     			$('.menu-down').show().siblings('.menu-changeval').hide();
	     		}
	     	 
	     	}
	     })
})


/*整体采购分析*/
function drewAnalysis(dom) {
    	  this.dom = dom;
  			this.myChart = echarts.init(document.getElementById(dom));
 			this.opts =  {
			    tooltip : {
			        trigger: 'axis',
			            axisPointer : {         
			            type : 'shadow'
			        },
			        textStyle:{
			            color:'#54240d',
			        },
			       backgroundColor:'rgba(255,255,255,0.8)',
			    },
			    legend: {
			        data:['采购金额', '节省金额'],
			        x: '80px',
			        y:  '30px'
			    },
			
			    calculable : false,
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			  color:['#ffa200','#2ebdff'],
			   xAxis : [
			        {
			            
			            data : []
			        }
			    ],
			    series : [
			        {
			            name:'采购金额',
			             barWidth:'30',
			            type:'bar',
			            stack: '1',			           
			            data:[]
			        },
			        {
			            name:'节省金额',
			            barWidth:'30',
			            type:'bar',
			            stack: '1',			           
			            data:[]
			        }
			    ]
			}
    }
 drewAnalysis.prototype.init = function(data){
	 this.opts.xAxis[0].data = data.dates;
	 this.opts.series[0].data = data.discounts;
	 this.opts.series[1].data = data.subductions;
   this.myChart.setOption(this.opts);
   window.onresize = this.myChart.resize;
}



function orderNum(dom) {
	this.dom = dom;
	this.myChart = echarts.init(document.getElementById(dom));
	this.opts =  {
   /* tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
  */
    calculable : false,
    series : [
        {
            name:'访问来源',
            type:'pie',
            center: ['50%', '50%'],
            radius : ['40%', '70%'],
            itemStyle : {
                normal : {
                    label : {
                          position: 'outside',
                    show: true,
                    formatter: "{d}%\n{b}",
                    textStyle: {
                        fontSize:14
                    }
                    },
                    labelLine : {
                          show : true,
                      length: 20,
                    }
                },
                emphasis : {
                    label : {
                        show : false,
                        position : 'center',
                        textStyle : {
                            fontSize : '30',
                            fontWeight : 'bold'
                        }
                    }
                }
            },
            data:[]
        }
    ]
};                 
}
 orderNum.prototype.init = function(data){

	 this.opts.series[0].data = data.nameAndCounts;
     this.myChart.setOption(this.opts);
   window.onresize = this.myChart.resize;
}


function contrast2(){
	
	var myChart = echarts.init(document.getElementById('drew-contrast2')); 
	option = {
   /* tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
  */
    calculable : false,
    series : [
        {
            name:'访问来源',
            type:'pie',
            center: ['50%', '50%'],
            radius : ['40%', '70%'],
            itemStyle : {
                normal : {
                    label : {
                          position: 'outside',
                    show: true,
                    formatter: "{d}%\n{b}",
                    textStyle: {
                        fontSize:14
                    }
                    },
                    labelLine : {
                          show : true,
                      length: 20,
                    }
                },
                emphasis : {
                    label : {
                        show : false,
                        position : 'center',
                        textStyle : {
                            fontSize : '30',
                            fontWeight : 'bold'
                        }
                    }
                }
            },
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
};
   myChart.setOption(option);     
                  
}

function moneyNum(dom) {
	this.dom = dom;
	this.myChart = echarts.init(document.getElementById(dom));
	this.opts =  {
   /* tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
  */
    calculable : false,
    series : [
        {
            name:'访问来源',
            type:'pie',
            center: ['50%', '50%'],
            radius : ['40%', '70%'],
            itemStyle : {
                normal : {
                    label : {
                          position: 'outside',
                    show: true,
                    formatter: "{d}%\n{b}",
                    textStyle: {
                        fontSize:14
                    }
                    },
                    labelLine : {
                          show : true,
                      length: 20,
                    }
                },
                emphasis : {
                    label : {
                        show : false,
                        position : 'center',
                        textStyle : {
                            fontSize : '30',
                            fontWeight : 'bold'
                        }
                    }
                }
            },
            data:[]
        }
    ]
};                 
}
 moneyNum.prototype.init = function(data){
	
	 this.opts.series[0].data = data.nameAndCounts;
     this.myChart.setOption(this.opts);
   window.onresize = this.myChart.resize;
}
 