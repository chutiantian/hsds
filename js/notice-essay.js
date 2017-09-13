
var id = GetQueryString('id');
var opt = {
  id:id
};
$(function(){
  init(opt);
});
function init(opt) {
  //var posturl = baseUrl+'info/info';
  var posturl = '../js/json/notice-essay.json';
  getdata(posturl, opt,'',fillnoticelist);//获取json数据
  function fillnoticelist(data){
    filldom('notice-essay', data, 'essay-box');
  }
}
