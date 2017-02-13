'use strict';
var editor = UE.getEditor('editor');

$(document).ready(function() {
    /*var editor = UE.getEditor('editor');*/
    setTimeout(function() {
        var tool_tab = $(".ueditorTab").find("ul").find("li");
        /*	var tool_con = $("#toolbar_con").children();*/
        tool_tab.click(function() {
            var zt = $(this).index();
            //tool_con.eq(zt).show().siblings().hide();
            $(this).addClass("tab_act").siblings().removeClass("tab_act");
            switch (zt) {
                case 0:
                    $(".edui-editor-toolbarboxinner").show().css("height", "auto");
                    $(".edui-editor-toolbarboxinner").children().hide();
                    $(".edui-editor-toolbarboxinner").children().first().show();
                    break;
                case 1:
                    $(".edui-editor-toolbarboxinner").show();
                    $(".edui-editor-toolbarboxinner").children().hide();
                    $(".edui-editor-toolbarboxinner").children().eq(1).show();
                    break;
                case 2:
                    //调用编辑器全屏按钮
                    if (editor.ui) {
                        editor.ui.setFullScreen(!editor.ui.isFullScreen());
                    }
                    //对全屏后样式的调整
                    tool_tab.eq(0).addClass("tab_act").siblings().removeClass("tab_act");
                    $("#edui2").show();
                    $("#edui2").siblings().hide();
                    break;
                case 3:
                    alert("切换为手机编辑器");
                    break;
            }
        });
    }, 1000)
});
//全屏时页面的调整
editor.addListener('fullscreenchanged', function(cmd, isFullScreen) {
    if (isFullScreen) {
        $(".toolbar_tab").css("width", "100%");
        $(".toolbarimg img").css("margin-left", "10px");
        $("#ueditor_0").contents().find(".view1").css({
            "margin-left": "10px",
            "margin-top": "0px"
                /*,"height":"auto"*/
        });
        //智能辅助相关样式显示
        $(".data").css({
            "position": "absolute",
            "top": "130px",
            "left": "65%",
            "z-index": "1200"
        });
        $(".data").css("backgroundColor", "white");

        //如果编辑器iframe嵌套在页面中，全屏需要调整add by SJ
        if (window.parent && window.parent != window) {
            var meEditor = window.parent.window.document.getElementById("iframeId");
            $(meEditor).css("position", "absolute").css("top", "0px").css("left", "0px").css("height", 677);
        }
    } else {
        $(".toolbar_tab").css("width", "69%");
        $(".toolbarimg img").css("margin", "0 auto").css("margin-top", "6px").css("margin-bottom", "6px");
        $("#ueditor_0").contents().find(".view1").css("margin", "0 auto");
        //智能辅助相关样式显示
        $(".data").css({
            "position": "relative",
            "top": "",
            "left": ""
        });
        $(".data").css("backgroundColor", "#ecf3f7");
        //如果编辑器iframe嵌套在页面中，全屏需要调整add by SJ
        if (window.parent && window.parent != window) {
            var meEditor = window.parent.window.document.getElementById("iframeId");
            $(meEditor).css("position", "relative");
        }
    }
});
