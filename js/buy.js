var opt = {
    id: ""
};
$(function () {
    step.goStep(1);
    var posturl = '../js/json/buy.json';
    getdata(posturl, {}, "get", function (res) {
    //getdata(baseUrl + 'cart/queryCartList', {}, "get", function (res) {
        var buyList = new Buy(res);
        buyList.init();
        buyList.show();
    });

    function Buy(data) {
        this.tpl = "";
        this.tplId = "t-buy";
        this.data = data;
        this.selectIds = [];
        this.selectMap = {};
        if (this.data.code == 0 || this.data.data.length == 0) {
            $('.detail-h365').hide();
            $('.item-empty').show();
            $('.buy-btn').click(function () {
                location.href = './program.html';//跳转采购计划
            })
        }
    };
    Buy.prototype = {
        init: function () {
            this.tpl = Handlebars.compile($("#" + this.tplId).html());
            this.regHelper();
        },
        regHelper: function () {
            Handlebars.registerHelper("eq", function (v1, v2, opts) {
                if (v1 == v2) {
                    return opts.fn(this);
                } else {
                    return opts.inverse(this);
                }
            })
        },
        show: function () {
            var data = this.data.data;
            $(".buy-list").html(this.tpl(data));
            this.buildEvent();
            this.checkAll();
        },

        buildEvent: function () {
            var that = this;
            $(".buy-checkall").bind("click", function (e) {
                var dom = e.currentTarget;
                if (dom.checked) {
                    that.checkAll();
                } else {
                    that.checkClear();
                }
            });
            $(".buy-cut").bind("click", function (e) {
                that.reduceHander(e);
            });
            $(".buy-add").bind("click", function (e) {
                that.plusHander(e);
            });
            $(".buy-check").bind("click", function (e) {
                that.checkHander(e);
            });

            //删除单个商品
            $('.delete').bind("click", function (e) {
                var id = $(this).attr('did');
                opt.id = id;
                layer.confirm('确定删除此商品吗？', {
                        btn: ['确定', '取消']
                    }, function () {
                        //var posturl = baseUrl + 'cart/deleteCartList';
                        var arrs = [];
                        arrs.push(id);
                        var options = JSON.stringify(arrs);
                        getdata(posturl, options, 'POST', delgoodsmsg, '1');

                        function delgoodsmsg(data) {
                            if (data.code == 1) {
                                layer.msg('删除成功', {
                                    time: 1000 //20s后自动关闭
                                });
                                setTimeout(function () {
                                    window.location.reload()
                                }, 1000)
                            } else {
                                layer.msg('删除失败', {
                                    time: 1000 //20s后自动关闭
                                })
                            }
                        }


                    },
                    function () {
                        layer.msg('已取消', {
                            time: 1000 //20s后自动关闭
                        })
                    });
            });


            // 点击全部删除
            $('#deleteAll').bind("click", function (e) {
                if (selectedTotal.innerHTML != 0) {
                    var idarr = [];
                    $('input.buy-check:checked').each(function (i) {
                        idarr.push($(this).val());
                    });
                    layer.confirm('确定删除吗？', {
                        btn: ['确定', '取消'] //按钮
                    }, function () {
                        //var posturl = baseUrl + 'cart/deleteCartList';
                        var options = JSON.stringify(idarr);
                        getdata(posturl, options, 'POST', delgoodsmsg1, '1');

                        function delgoodsmsg1(data) {
                            if (data.code == 1) {
                                layer.msg('删除成功', {
                                    time: 1000 //20s后自动关闭
                                });
                                setTimeout(function () {
                                    window.location.reload()
                                }, 1000)
                            } else {
                                layer.msg('删除失败', {
                                    time: 1000 //20s后自动关闭
                                })
                            }
                        }

                    }, function () {
                        layer.msg('已取消', {
                            time: 1000 //1s后自动关闭
                        });
                    });
                } else {
                    layer.msg('请选择商品！', {time: 1000});
                }
            });

            // 点击结算
            $('.order-btn').bind('click', function () {

                var idarr = [];
                $('input.buy-check:checked').each(function (i) {
                    idarr.push($(this).val());
                });
                console.log(idarr);
                var confirmurl = 'ids=' + idarr.join('-');
                location.href = './order-confirm.html?' + confirmurl;
            })
        },
        checkAll: function () {
            $("input:checkbox").each(function () {
                $(this)[0].checked = true;
            });
            this.selectAll();
            this.showToltInfo();
        },
        checkClear: function () {
            $("input:checkbox").each(function () {
                $(this)[0].checked = false;
            });
            this.unSelectAll();
            this.showToltInfo();
        },
        delItem: function (dom) {
            var target = $(dom).parents('.sc').remove()
            this.updateCount();
        },
        delAllItem: function () {
            $('.sc').find('.buy-check:checked').parents('.sc').remove();
            this.updateCount();
        },
        selectedItem: function (id) {
            var that = this;
            $.each(this.data.data, function (i, e) {
                if (this.id == id) {
                    that.data.data[i].selected = 1;
                }
            });
        },
        unSelectedItem: function (id) {
            var that = this;
            $.each(this.data.data, function (i, e) {
                if (this.id == id) {
                    that.data.data[i].selected = 0;
                }
            });
        },
        selectAll: function () {
            var that = this;
            $.each(this.data.data, function (i, e) {
                that.data.data[i].selected = 1;
            });
        },
        unSelectAll: function () {
            var that = this;
            $.each(this.data.data, function (i, e) {
                that.data.data[i].selected = 0;
            });
        },
        addCountById: function (id) {
            //reduce
        },
        plusById: function (id) {
            var that = this;
            $.each(this.data.data, function (i, e) {
                if (e.id == id) {
                    that.data.data[i].cartNum = e.cartNum + 1;
                    that.data.data[i].subtotal = e.cartNum * e.cartPrice;
                }
            });
        },
        reduceById: function (id) {
            var that = this;
            $.each(this.data.data, function (i, e) {
                if (e.id == id) {
                    that.data.data[i].cartNum = e.cartNum - 1;
                    that.data.data[i].subtotal = e.cartNum * e.cartPrice;
                }
            });
        },
        delCountById: function (id) {
            $.each(this.data.data, function (i, n) {
                if (this.id == id) {
                    this.data.splice(i, 1);
                }
            });
        },
        getInfoById: function (id) {
            var ret = {};
            $.each(this.data.data, function (i, n) {
                if (this.id == id) {
                    ret = this;
                    return false;

                }
            });
            return ret;
        },
        getToltInfo: function () { //返回选中的价格
            var ret = {
                count: 0,
                countPrice: 0
            };
            $.map(this.data.data, function (e, i) {
                if (e.selected) {
                    ret.count = ret.count + 1;
                    ret.countPrice = ret.countPrice + e.subtotal * 1
                }
            });
            return ret;
        },
        showToltInfo: function () {
            this.updateCount();
        },

        reduceHander: function (e) {
            var dom = $(e.currentTarget);
            var domval = dom.next("input"),
                itemInfo = {},
                val = domval.val() * 1,
                id = dom.parent().parent().parent().find("input:checkbox").val();
            if (val < 2) {
                return;
            }
            itemInfo = this.getInfoById(id);
            this.reduceById(id);
            this.updateCount();
            domval.val(val - 1);
            dom.parent().parent().next().find(".buy-coutp").text((val - 1) * itemInfo.cartPrice);
        },
        plusHander: function (e) {
            var dom = $(e.currentTarget);
            var domval = dom.prev("input"),
                val = domval.val() * 1,
                id = dom.parent().parent().parent().find("input:checkbox").val(),
                itemInfo = this.getInfoById(id);
            this.plusById(id);
            this.updateCount();
            domval.val(val + 1);
            dom.parent().parent().next().find(".buy-coutp").text((val + 1) * itemInfo.cartPrice);

        },
        updateCount: function () {
            var countInfo = this.getToltInfo();
            //    countPrice=;
            $(".countNum").text(countInfo.count);
            $(".countPrice").text(countInfo.countPrice);

        },
        checkHander: function (e) {
            var dom = e.currentTarget;
            if (dom.checked) {
                this.selectedItem(dom.value);
            } else {
                this.unSelectedItem(dom.value);
            }
            this.itemCheckAll();
            this.updateCount();
        },
        itemCheckAll: function (e) {
            var len_all = $('.order-item .item-check').children('input').length;
            var len_checked = $('.order-item .item-check').children('input:checked').length;
            console.log(len_all);
            console.log(len_checked);
            if (len_all === len_checked) {
                // this.checkAll()
                $("input.buy-checkall").prop("checked", true)
            } else {
                // this.checkAll()
                $("input.buy-checkall").prop("checked", false)
            }
        }
    };
});

function getdata(url, fromdata, type, callback, flag) {
    type = type || 'GET';
    var ContentType;
    flag ? ContentType = 'application/json' : ContentType = 'application/x-www-form-urlencoded';
    var lay;
    $.ajax({
        type: type,
        contentType: ContentType,
        url: url,
        dataType: 'json',
        timeout: 10000,
        data: fromdata,
        async: true,
        beforeSend: function () {
            lay = layer.load(1, {
                shade: [0.5, '#000']
            });
        },
        complete: function (XMLHttpRequest, status) {
            layer.close(lay)
            if (status == 'timeout') {//超时,status还有success,error等值的情况
                layer.msg("请求超时");
            }
        },
        success: function (result) {
            if (callback != null) {
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