/**
 * Created by bzm on 2015/9/23.
 */
'use strict';
var trs_theLocation = window.location.href;
var trs_toSiteid = trs_theLocation.substr(trs_theLocation.indexOf("siteid") + 7);
var trs_siteid = trs_toSiteid.substring(0, trs_toSiteid.indexOf("&"));
var trs_toTempid = trs_toSiteid.substr(trs_toSiteid.indexOf("tempid") + 7);
var trs_tempid = trs_toTempid.substring(0, trs_toTempid.indexOf("&"));
var trs_toObjectid = trs_toTempid.substr(trs_toTempid.indexOf("objectid") + 9);
var trs_objectid = trs_toObjectid.substring(0, trs_toObjectid.indexOf("&"));
var trs_toObjecttype = trs_toObjectid.substr(trs_toObjectid.indexOf("objecttype") + 11);
var trs_objecttype = trs_toObjecttype.substring(0, trs_toObjecttype.indexOf("&"));
var trs_toChannelid = trs_toObjecttype.substr(trs_toObjecttype.indexOf("channelid") + 10);
var trs_channelid = trs_toChannelid.substring(0, trs_toChannelid.indexOf("&"));
var trs_toIsFragment = trs_toChannelid.substr(trs_toChannelid.indexOf("isfragment") + 11);
var trs_isFragment;
if (trs_toIsFragment.indexOf("#") > 0) {
    trs_isFragment = trs_toIsFragment.substring(0, trs_toIsFragment.indexOf("#"));
} else {
    trs_isFragment = trs_toIsFragment;
}
var rootDirectory = trs_theLocation.substring(0, trs_theLocation.indexOf("/p"));
jQuery().ready(function() {
    if (trs_isFragment !== 'true') {
        return;
    }


    var $$widgetid;

    function getWidgetIdentify($$widgetid) {
        //var widgetIdentify = jQuery('.widget-identify_'+$$widgetid);
        /*if (widgetIdentify.size() > 0) {
            return widgetIdentify;
        }*/

        jQuery(document.body).append('<div class="widget-identify" id="widget-identify_' + $$widgetid + '"><div class="edit"></div></div>');
        var widgetIdentify = jQuery('#widget-identify_' + $$widgetid);
        widgetIdentify.find('.edit').click(function() {
            editWidget($$widgetid);
        });
        return widgetIdentify;
    }

    function showWidgetIdentify(widget) {
        $$widgetid = widget.attr("widget");

        var offset = widget.offset();
        var width = widget.width();
        var height = widget.height();
        if(height===0||height===null){
            width= widget.children(":first").width();
            height = widget.children(":first").height();
        }

        var widgetIdentify = getWidgetIdentify($$widgetid);
        widgetIdentify.css({
            left: offset.left - 2 + 'px',
            top: offset.top - 2 + 'px',
            width: width + 4 + 'px',
            height: height + 4 + 'px'
        });

        widgetIdentify.show();
    }

    function hideWidgetIdentify() {
        getWidgetIdentify().hide();
    }


    function editWidget($$widgetid) {
        layer.open({
            type: 2,
            title: false,
            shadeClose: false,
            closeBtn: false,
            shade: 0.5,
            maxmin: false, //开启最大化最小化按钮
            area: ['75%', '85%'],
            content: [rootDirectory + '/mediacube/visualEditing.html?widgetId=' + $$widgetid + "&siteid=" + trs_siteid + "&tempid=" + trs_tempid + "&objectid=" + trs_objectid + "&objecttype=" + trs_objecttype + "&channelid=" + trs_channelid + "?" + Math.random(), 'no']
        });
    }

    jQuery("div[widget]").each(function(i) {
        //console.log($(this).attr("widget"));
        showWidgetIdentify(jQuery(this));
    });
    /*var lastWidget;
    jQuery(document).mousemove(function(event) {
        var target = event.target;
        var widget = jQuery(target).closest("div[widget]");
        //console.log(target.tagName + ":" + widget.html());

        if (!lastWidget && widget.size() > 0) {
            lastWidget = widget;
            showWidgetIdentify(widget);
            return;
        }

        if (widget.size() <= 0 && lastWidget) {
            var bounding = lastWidget[0].getBoundingClientRect();
            var clientX = event.clientX;
            var clientY = event.clientY;

            if (clientX < bounding.left || clientX > bounding.right || clientY < bounding.top || clientY > bounding.bottom) {
                //鼠标离开widget范围时渲染消失开始
                hideWidgetIdentify();
                lastWidget = null;
                //鼠标离开widget范围时渲染消失结束
            }

            return;
        }
    });*/


    //兼容jquery低版本
    jQuery.fn.off = jQuery.fn.off || jQuery.fn.unbind;
    jQuery.fn.on = jQuery.fn.on || jQuery.fn.bind;

    jQuery(jQuery("div[widget]")).each(function(i) {
        if (true) return;

        //获取widgetId开始
        //var widgetId = jQuery(this).attr("widget");
        //获取widgetId结束

        jQuery(this).mouseenter(function() {
                //鼠标进入widget范围是进行渲染开始
                showWidgetIdentify(jQuery(this));
                //鼠标进入widget范围是进行渲染结束
            })
            .mouseleave(function(event) {
                var bounding = this.getBoundingClientRect();
                var clientX = event.clientX;
                var clientY = event.clientY;
                //console.log("clientX:" + clientX + ";clientY:" + clientY + ";left:" + bounding.left + ";top:" + bounding.top);

                if (clientX < bounding.left || clientX > bounding.right || clientY < bounding.top || clientY > bounding.bottom) {
                    //鼠标离开widget范围时渲染消失开始
                    hideWidgetIdentify();
                    //鼠标离开widget范围时渲染消失结束
                }

            });
    });
});
