/*
  Create by BaiZhiming 2015-11-03
*/
'use strict';
var closeMas;
angular.module("util.ueditor", ['util.ueditorConfig', 'util.ueditorServiceModule']).directive("ueditor", ["$timeout", "$sce", "$q", "$modal", "$interval", "localStorageService", "trsUeditorConfigService", "trsconfirm", "ueditorService", "globleParamsSet", "$compile", "$window", function($timeout, $sce, $q, $modal, $interval, localStorageService, trsUeditorConfigService, trsconfirm, ueditorService, globleParamsSet, $compile, $window) {
    return {
        restrict: 'E',
        scope: {
            list: "=",
            type: "@",
            versionid: "="
        },
        replace: true,
        //templateUrl: './lib/ueditor/ueditor.html',
        template: "<div><script id='ueditor' style='width:100%;position:relative'></script><div class='trs_ueditor_selectionNum'>选中字数统计</div></div>",
        link: function(scope, element, attrs, ctrl) {
            /* require(['./lib/ueditor2/ueditor.config', './lib/ueditor2/ueditor.all'], function() {*/
            var tempArrary = [];
            var editorToolBar = {
                toolbars: [
                    [
                        'source' /*0*/ ,
                        'undo' /*1*/ ,
                        'redo' /*2*/ ,
                        '|' /*3*/ ,
                        'cut' /*4*/ ,
                        'copy' /*5*/ ,
                        'paste' /*6*/ ,
                        '|' /*7*/ ,
                        'customstyle' /*8*/ ,
                        'fontfamily' /*9*/ ,
                        'fontsize' /*10*/ ,
                        'forecolor' /*11*/ ,
                        'bold' /*12*/ ,
                        'italic' /*13*/ ,
                        'underline' /*14*/ ,
                        'strikethrough' /*15*/ ,
                        'subscript' /*16*/ ,
                        'backcolor' /*17*/ ,
                        '|' /*18*/ ,
                        'justifyleft' /*19*/ ,
                        'justifycenter' /*20*/ ,
                        'justifyright' /*21*/ ,
                        'justifyjustify' /*22*/ ,
                        '|' /*23*/ ,
                        'insertorderedlist' /*24*/ ,
                        'insertunorderedlist' /*25*/ ,
                        'directionalityltr' /*26*/ ,
                        'directionalityrtl' /*27*/ ,
                        'lineheight' /*28*/ ,
                        /* 'background', 'backgroundimg', */
                        '|' /*29*/ ,
                        'formatmatch' /*30*/ ,
                        'searchreplace' /*31*/ ,
                        'insertframe' /*32*/ ,
                        'insertimage' /*33*/ , /*'insertvideo' ,*/
                        'link' /*34*/ ,
                        'unlink' /*35*/ ,
                        'inserttable' /*36*/ ,
                        'insertrow' /*37*/ ,
                        'insertcol' /*38*/ ,
                        'inserttitle' /*39*/ ,
                        'insertparagraphbeforetable' /*40*/ ,
                        'fullscreen' /*41*/ ,
                        'removeformat' /*42*/ ,
                        'autotypeset' /*43*/ ,
                        'indent' /*44*/ ,
                        'pasteplain' /*45*/
                    ]
                ],
                labelMap: {
                    'anchor': '',
                    'undo': '',
                    'cut': '剪切',
                    'copy': '复制',
                    'paste': '粘贴',
                    'backgroundimg': '背景图',
                    'allowCopyImg': true //自定义百度编辑器配置项，禁止拷贝图片到编辑器
                },
                //如果自定义，最好给p标签如下的行高，要不输入中文时，会有跳动感
                initialStyle: 'p{line-height:1.5em}', //编辑器层级的基数,可以用来改变字体等
                maximumWords: 100000,
                autoHeightEnabled: true,
                topOffset: 47,
                enableContextMenu: false,
                allowDivTransToP: false,
                imageScaleEnabled: false,
                pasteplain: true
                    //pageBreakTag:'\<trs_page_separator pagetitle=\"\" firstpagetitle=\"\"\>\<\/trs_page_separator\>'
            };
            if (scope.type === "newsPaper") {
                editorToolBar.toolbars[0].splice(35, 1);
                editorToolBar.toolbars[0].splice(34, 1);
                //遂宁日报报纸可以上传图片
                //editorToolBar.toolbars[0].splice(33, 1);
                editorToolBar.toolbars[0].splice(32, 1);
                editorToolBar.labelMap.allowCopyImg = false;
                //字数统计浮标
            }
            var ue = UE.getEditor('ueditor', editorToolBar);
            ue.ready(function() {
                scope.list.HTMLCONTENT = ueditorService.replaceHtmlBlank(scope.list.HTMLCONTENT); //将半角空格换为全角空格
                ue.setContent(scope.list.HTMLCONTENT);
                //纯文本正文及字数
                var preContent = ue.getContent().replace(/\n/g, "");
                var dom = document.createElement("div");
                dom.innerHTML = preContent;
                preContent = dom.innerText.replace(/\u00a0/g, ' ');
                scope.list.DOCWORDSCOUNT = preContent.replace(/\n/g, "").replace(/\u0020/g, "").replace(/\u3000/g, "").length; //兼容大数据取稿字数算法不同问题
                //纯文本正文及字数
                var preResult = $sce.getTrustedHtml("<div class='display_none ueditorMyWordContent'>您已输入{{list.DOCWORDSCOUNT}}个字符</div>");
                var result = $compile(preResult)(scope);
                element.find(".edui-toolbar").append(result);
                var destroyWatch = scope.$watch("list.DOCWORDSCOUNT", function(newValue) {
                    if (newValue) {
                        $timeout(function() {
                            result.removeClass("display_none");
                            destroyWatch();
                        });

                    }
                });
                ue.getOpt('lang');
                //ue.setHeight(500);
                var promise_keyup;
                var promise_contentChange;
                var promise_mouseup;
                ue.addListener("keyup", function() { //实时双向绑定开始
                    bindContent(promise_keyup);
                });
                ue.addListener("contentChange", function() { //实时双向绑定开始
                    bindContent(promise_contentChange);
                });
                //计算显示字数，并显示出来
                var iframe = domUtils.getWindow(ue.document).frameElement;
                domUtils.on(ue.body, "mouseup", function(event) {
                    selectionNumPop(event);
                });
                domUtils.on(ue.body, "keydown", function(event) {
                    selectionNumPop(event);
                });
                ue.addListener("selectionchange", function() {
                    var selectionStr = this.selection.getText();
                    if (selectionStr.length === 0) {
                        hideSelectionNum();
                    }
                });
                /**
                 * [showSelectionNum methodname]显示选中字数统计
                 * @return {[type]} [description] null
                 */
                function showSelectionNum(position) {
                    var selectionNumDiv = $(document).find(".trs_ueditor_selectionNum");
                    selectionNumDiv.css("left", position.left + "px");
                    selectionNumDiv.css("top", position.top + "px");
                    selectionNumDiv.fadeIn("fast");
                }
                /**
                 * [hideSelectionNum methodname]显示选中字数统计
                 * @return {[type]} [description] null
                 */
                function hideSelectionNum() {
                    $(document).find(".trs_ueditor_selectionNum").fadeOut('fast');
                }
                /**
                 * [showSelectionNum methodname]显示选中字数统计
                 * @return {[type]} [description] null
                 */
                function selectionNumPop(event) {
                    var selectionStr = ue.selection.getText();
                    if (selectionStr.length !== 0) {
                        var selectionNumDiv = $(document).find(".trs_ueditor_selectionNum");
                        var position = {};
                        /*var e = event;
                        var sh = $window.pageYOffset || $window.document.documentElement.scrollTop || $window.document.body.scrollTop || 0;
                        position.left = (e.clientX - 40 < 0) ? e.clientX + 20 : e.clientX - 40;
                        position.top = (e.clientY - 40 < 0) ? e.clientY + sh + 20 : e.clientY + sh - 40;*/
                        selectionNumDiv.html("已选中" + selectionStr.replace(/&nbsp;/g, "").replace(/\u00a0/g, "").replace(/\u3000/g, "").replace(/\n/, "").length + "个字");
                        showSelectionNum(position);
                    } else {
                        hideSelectionNum();
                    }
                }
                compareLocalAndServe().then(function() {
                    scope.promise = $interval(localcache, globleParamsSet.asaveVersionIntervaltime());
                });
                //MLFWEB-5014 修复全屏的bug
                ue.addListener('fullscreenchanged', function(type, bfullscreen) {
                    var $iframeHolder = $('.edui-editor-iframeholder');
                    $iframeHolder.css("width", "100%");
                    //全屏需要出滚动条
                    //$timeout(function() {
                    //});
                    //
                    var doc = $iframeHolder.find("iframe")[0].contentWindow.document;
                    doc.body.style.overflow = bfullscreen ? 'auto' : 'auto';

                    $timeout(function() {
                        ue.execCommand("inserthtml", "<trsfullscreen></trsfullscreen>");
                        var doms = doc.getElementsByTagName('trsfullscreen');

                        for (var index = 0; index < doms.length; index++) {
                            doms[index].parentNode.removeChild(doms[index]);
                        }

                        ue.fireEvent("contentChange");
                    });
                });
            });
            scope.$on("$destroy", function() {
                $interval.cancel(scope.promise); //销毁定时事件
            });
            /**
             * [initStatus methodname]绑定数据和编辑器内容
             * @return {[type]} [description] null
             */
            function bindContent(promise) {
                if (promise) {
                    $timeout.cancel(promise);
                    promise = null;
                }
                promise = $timeout(function() {
                    var preContent = ue.getContent().replace(/\n/g, "");
                    var dom = document.createElement("div");
                    dom.innerHTML = preContent;
                    preContent = dom.innerText.replace(/\u00a0/g, ' ');
                    scope.list.DOCWORDSCOUNT = preContent.replace(/\n/g, "").replace(/\u0020/g, "").replace(/\u3000/g, "").length; //兼容大数据取稿字数算法不同问题
                }, 500);
                return promise;
            }
            /**
             * [localcache methodname]本地保存
             * @return {[type]} [description] null
             */
            function localcache() {
                ueditorService.saveToLocal(scope.list.METADATAID, scope.versionid);
            }
            /**
             * [compareLocalAndServe methodname]比较本地和服务器正文版本是否相同
             * @return {[type]} [description] null
             */
            function compareLocalAndServe() {
                scope.versionid = scope.versionid === "" ? "0" : scope.versionid;
                var deffer = $q.defer();
                var htmlContent = ue.getContent();
                var localContentArray = localStorageService.get("ueLocalVersion");
                var localContent;
                if (localContentArray === null) {
                    deffer.resolve();
                } else {
                    for (var i = 0; i < localContentArray.length; i++) {
                        if (localContentArray[i].ID === (scope.list.METADATAID + "") && (angular.isUndefined(scope.versionid) || angular.isUndefined(localContentArray[i].VERSIONID) || localContentArray[i].VERSIONID === scope.versionid)) {
                            localContent = localContentArray[i].CONTENT;
                        }
                    }
                    if (angular.isUndefined(localContent)) {
                        deffer.resolve();
                    } else if (htmlContent === localContent) {
                        deffer.resolve();
                    } else if (htmlContent !== localContent) {
                        var tipInfo = scope.list.METADATAID === 0 ? "您有未保存的稿件正文，是否恢复到编辑区？" : "检测到服务器稿件正文与本地稿件正文有差异，是否恢复本地版本正文？";
                        trsconfirm.alertType(tipInfo, "", "info", true, function() {
                            ue.setContent(localContent);
                            deffer.resolve();
                        }, function() {
                            deffer.resolve();
                        });
                    }
                }
                return deffer.promise;
            }
            scope.$watch("list.METADATAID", function(newValue, oldValue) { //新建稿件时，将ID为0的本地版本内容迁到新生成的ID的稿件正文中
                var newId = newValue + "";
                var oldId = oldValue + "";
                if (newId !== oldId && oldId === "0") {
                    var localContentArray = localStorageService.get("ueLocalVersion");
                    var newContent = "";
                    for (var i = 0; i < localContentArray.length; i++) {
                        if (localContentArray[i].ID === "0") {
                            newContent = localContentArray[i].CONTENT;
                            localContentArray.splice(i, 1);
                            break;
                        }
                    }
                    localStorageService.set("ueLocalVersion", localContentArray);
                }
            });
            UE.registerUI('pagebreak', function(editor, uiName) {
                editor.registerCommand(uiName, {
                    execCommand: function() {
                        ue.execCommand('insertHtml', '<trs_page_separator pagetitle="" firstpagetitle=""/>');
                        ue.fireEvent('contentchange');
                    }
                });
                var btn = new UE.ui.Button({
                    name: "pagebreak",
                    title: "插入分页",
                    cssRules: 'background-position: -460px -40px;',
                    onclick: function() {
                        editor.execCommand(uiName);
                    }
                });
                return btn;
            });
            /*UE.registerUI('contentformat', function(editor, uiName) {
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName, {
                    execCommand: function() {
                        var htmlContent = editor.getContent();
                        htmlContent = htmlContent.replace(/(<p|div[^>]*>)(&nbsp;| )+/ig, "$1&nbsp;&nbsp;");
                        editor.setContent(htmlContent);
                    }
                });*/

            //创建一个button
            /*var btn = new UE.ui.Button({
                //按钮的名字
                name: "contentformat",
                //提示
                title: "段首缩进",
                //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
                cssRules: 'background-position: -559px -39px;',
                //点击时执行的命令
                onclick: function() {
                    //这里可以不用执行命令,做你自己的操作也可

                    var htmlContent = editor.getContent();

                    //首行缩进，处理div,p标记*/
            //     htmlContent = htmlContent.replace(/(<(?:p|div)[^>]*>(?:<(?:span|b)[^>]*>)*)(?:&nbsp;| |　)*/ig, "$1　　");

            //首行缩进，处理br后面的换行缩进
            //    htmlContent = htmlContent.replace(/(<br[^>]*>)(?:&nbsp;| |　)*/ig, "$1　　");

            /*          editor.setContent(htmlContent);
                    }
                });

                //因为你是添加button,所以需要返回这个button
                return btn;
            });*/



            UE.registerUI('button', function(editor, uiName) {
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName, {
                    execCommand: function() {
                        var flag = false;
                        var content = "";
                        var storage = localStorageService.get("ueLocalVersion");
                        if (storage !== null) {
                            for (var i = 0; i < storage.length; i++) {
                                if (storage[i].ID === scope.list.METADATAID + "") {
                                    content = storage[i].CONTENT;
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        if (flag) {
                            trsconfirm.alertType("确定要恢复到该本地版本?", "", "info", true, function() {
                                ue.setContent(content);
                            });
                        } else {
                            trsconfirm.alertType("您本地没有本地版本", "", "error", false);
                        }
                    }
                });

                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: "恢复本地版本",
                    //提示
                    title: "恢复本地版本",
                    //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -559px -39px;',
                    //点击时执行的命令
                    onclick: function() {
                        //这里可以不用执行命令,做你自己的操作也可
                        editor.execCommand(uiName);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            } /*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/ );
            //上传视频按钮
            /*UE.registerUI('button2', function(editor, uiName) {
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName, {
                    execCommand: function() {
                        ueditorService.insertVideo(function(data) {
                            ue.ready(function() {
                                //插入带视频或音频的iframe
                                for (var i = 0; i < data.length; i++) {
                                    var content = ue.getContent();
                                    var src = "";
                                    var typeMedia = ""; //音频视频类型
                                    var imgUrl = ""; //缩略图地址
                                    for (var j in data[i]) {
                                        data[i][j] = decodeURIComponent(data[i][j]);
                                        if (j === "playUrl") {
                                            src = data[i][j] + "&typeMedia=" + (data[i]["typeMedia"] === "A" ? "music" : "video");
                                        } else if (j === "masId") {
                                            imgUrl = globleParamsSet.getMasUrl() + "/mas/openapi/pages.do?method=exThumb&appKey=" + globleParamsSet.getMasConfig() + "&id=" + data[i][j] + "&size=L";
                                        } else if (j === "typeMedia") {
                                            typeMedia = data[i][j] === "A" ? "music" : "video";
                                        }
                                    }
                                    //ue.setContent(content + "<br/><iframe src='" + src + "' typeMedia='" + typeMedia + "' imgUrl='" + imgUrl + "' width='320' height='200'></iframe>");
                                    var html = "<iframe src='" + src + "' typeMedia='" + typeMedia + "' imgUrl='" + imgUrl + "' width='320' height='200'></iframe>";
                                    ue.execCommand('insertHtml', html);
                                    localStorageService.remove("ue.video");
                                    localStorageService.remove("page.video");
                                }
                                //插入带视频或音频的iframe
                            });

                        });
                    }
                });

                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: "插入视频或音频",
                    //提示
                    title: "插入视频或音频",
                    //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -321px -140px;',
                    //点击时执行的命令
                    onclick: function() {
                        //这里可以不用执行命令,做你自己的操作也可
                        editor.execCommand(uiName);
                    }
                });

                //因为你是添加button,所以需要返回这个button
                return scope.type === "newsPaper" ? "" : btn;
            });*/
            //图片工具条代码开始
            var domUtils = baidu.editor.dom.domUtils;
            var popup = new baidu.editor.ui.Popup({
                editor: ue,
                content: '',
                className: 'edui-bubble',
                _onImgEditButtonClick: function(name) {
                    this.hide();
                    ue.ui._dialogs[name] && ue.ui._dialogs[name].open();

                },
                //圖片裁剪
                _onImgclipping: function() {
                    this.hide();
                    var img = popup.anchorEl;
                    var image = {
                        PERPICURL: $(img).attr("src"),
                        APPFILE: angular.isDefined($(img).attr("oldsrc")) ? $(img).attr("oldsrc") : $(img).attr("uploadpic")
                    };
                    scope.photoFileName = image.APPFILE;
                    var modalInstance = $modal.open({
                        template: '<iframe src="/wcm/app/photo/photo_compress_mlf.jsp?photo=..%2F..%2Ffile%2Fread_image.jsp%3FFileName%3D' + image.APPFILE + '&index=0" width="1210px" height="600px"></iframe>',
                        windowClass: 'photoCropCtrl',
                        backdrop: false,
                        controller: "trsPhotoCropCtrl",
                        resolve: {
                            params: function() {
                                return image;
                            }
                        }
                    });
                    editCallback = function(params) {
                        var myImg = new Image();
                        var myWidth = "";
                        var sFileName = params.imageName || params.FN;
                        var imageUrl = "/wcm/file/read_image.jsp?FileName=" + sFileName; //文件没有保存之后，是U0开头

                        if (sFileName.match(/^W0/)) {
                            imageUrl = ["/webpic/", sFileName.substring(0, 8), "/", sFileName.substring(0, 10), "/", sFileName].join("");
                            imageUrl += "?r=" + new Date().getTime(); //添加水印之后，图片名称不变，防止图片不刷新
                        }

                        myImg.src = imageUrl;
                        myImg.onload = function() {
                            //如果原图很大的话，添加水印之后，图片就变小了，这个不合理。
                            //应该是水印后图片超过了编辑器中图片的大小，则需要减小之编辑器图片大小
                            //myHeight = myImg.naturalWidth > 550 ? 550 : 'auto';                            
                            //myWidth = myImg.width > 550 ? 550 : 'auto';
                            var offsetWidth = parseInt(img.offsetWidth, 10);
                            myWidth = myImg.width > offsetWidth ? (offsetWidth + "px") : 'auto';
                            domUtils.setAttributes(img, {
                                "src": imageUrl,
                                "uploadpic": sFileName,
                                "_src": imageUrl,
                                width: myWidth,
                                height: 'auto'
                            });
                            img.style.width = myWidth;
                            img.style.height = 'auto';
                            ue.fireEvent('contentchange');
                            editPhotoCallback();
                        };
                    };
                },
                /*扩展方法，设置图片区域自定义尺寸*/
                _onImgResize: function(value) {
                    value = value.replace("px", "");
                    if (isNaN(value)) {
                        this.hide();
                        return;
                    } else {
                        var img = popup.anchorEl;
                        var percent = 0;
                        if (img.naturalWidth > 0) {
                            percent = img.naturalHeight / img.naturalWidth;
                        }
                        domUtils.setStyles(img, {
                            'width': value + 'px',
                            'height': (value * percent == 0 ? '' : value * percent + 'px')
                        });
                    }
                    domUtils.on(document.body, "keydown");
                    this.hide();
                },
                _enterEvent: function(_dom) {
                    /*domUtils.on(document.body, "keydown", function(evt) {
                        if (evt.keyCode == 13) { //回车事件
                            popup._onImgResize(_dom.value);
                        }
                    });*/
                    popup._onImgResize(_dom.value + "px");
                },
                /*扩展方法，设置图片区域指定尺寸*/
                _onImgSetSize: function(value) {
                    var img = popup.anchorEl;

                    //img.src = "";
                    //img.setAttribute("uploadpic", "");

                    var percent = 0;
                    if (img.naturalWidth > 0) {
                        percent = img.naturalHeight / img.naturalWidth;
                    }

                    if (img && img.tagName == "IMG") {
                        switch (value) {
                            case 'small':
                                domUtils.setStyles(img, {
                                    'width': '100px',
                                    'height': (100 * percent == 0 ? '' : 100 * percent + 'px')
                                });
                                break;
                            case 'middle':
                                domUtils.setStyles(img, {
                                    'width': '300px',
                                    'height': (300 * percent == 0 ? '' : 300 * percent + 'px')
                                });
                                break;
                            case 'big':
                                domUtils.setStyles(img, {
                                    'width': '500px',
                                    'height': (500 * percent == 0 ? '' : 500 * percent + 'px')
                                });
                                break;
                            case 'original':
                                domUtils.setStyles(img, {
                                    'width': (img.naturalWidth ? img.naturalWidth + 'px' : ''),
                                    'height': (img.naturalHeight ? img.naturalHeight + 'px' : '')
                                });
                                break;
                            case 'border':
                                if (img.border != "1px") {
                                    img.border = "1px";
                                } else {
                                    img.border = "";
                                }

                                break;
                        }
                    }
                    ue.fireEvent("contentChange");
                    //this.hide();
                },
            });
            popup.render();
            UE.plugins["addborder"] = function() {
                var me = this;
                //创建一个改变图片边框的命令
                me.commands["addborder"] = {
                    execCommand: function() {
                        //获取当前选区
                        var range = me.selection.getRange();
                        //选区没闭合的情况下操作
                        if (!range.collapsed) {
                            //图片判断
                            var img = range.getClosedNode();
                            if (img && img.tagName == "IMG") {
                                //点击切换图片边框
                                img.style.border = img.style.borderWidth == "5px" ? "1px" : "5px solid red";
                            }
                        }
                    }
                };
                //注册一个触发命令的事件，同学们可以在任意地放绑定触发此命令的事件
                me.addListener('selectionchange', function(t, causeByUi) {
                    if (!causeByUi) return;
                    var html = '',
                        str = "",
                        img = ue.selection.getRange().getClosedNode(),
                        dialogs = ue.ui._dialogs;
                    if (img && img.tagName == 'IMG') {
                        var dialogName = 'insertimageDialog';
                        if (img.className.indexOf("edui-faked-video") != -1 || img.className.indexOf("edui-upload-video") != -1) {
                            dialogName = "insertvideoDialog"
                        }
                        if (img.className.indexOf("edui-faked-webapp") != -1) {
                            dialogName = "webappDialog"
                        }
                        if (img.src.indexOf("http://api.map.baidu.com") != -1) {
                            dialogName = "mapDialog"
                        }
                        if (img.className.indexOf("edui-faked-music") != -1) {
                            dialogName = "musicDialog"
                        }
                        if (img.src.indexOf("http://maps.google.com/maps/api/staticmap") != -1) {
                            dialogName = "gmapDialog"
                        }
                        if (img.getAttribute("anchorname")) {
                            dialogName = "anchorDialog";
                            html = popup.formatHtml(
                                '<nobr>' + ue.getLang("property") + ': <span onclick=$$._onImgEditButtonClick("anchorDialog") class="edui-clickable">' + editor.getLang("modify") + '</span>&nbsp;&nbsp;' +
                                '<span onclick=$$._onRemoveButtonClick(\'anchor\') class="edui-clickable">' + editor.getLang("delete") + '</span></nobr>');
                        }
                        if (img.getAttribute("word_img")) {
                            //todo 放到dialog去做查询
                            ue.word_img = [img.getAttribute("word_img")];
                            dialogName = "wordimageDialog"
                        }
                        str = '<nobr>' +
                            '&nbsp;<span><input onchange=$$._enterEvent(this) onclick=this.focus();this.select(); type="text" style="width:40px" value="' + img.clientWidth + '">px</span>&nbsp;&nbsp;' +
                            '<span onclick=$$._onImgSetSize("small") class="edui-clickable smallpic">' + "▪" + '</span>' +
                            '<span onclick=$$._onImgSetSize("middle") class="edui-clickable normal">' + "■" + '</span>' +
                            '<span onclick=$$._onImgSetSize("big") class="edui-clickable bigpic">' + "█" + '</span>' +
                            '<span onclick=$$._onImgSetSize("original") class="edui-clickable ori-pic">' + '原始大小' + '</span>&nbsp;&nbsp;' +
                            '<span onclick=$$._onImgSetSize("border") class="edui-clickable pic-border">' + "边框" + '</span>&nbsp;&nbsp;' +
                            '<span onclick=$$._onImgclipping() class="edui-clickable pic-cut">' + "裁剪" + '</span>&nbsp;&nbsp;' +
                            '<span onclick="$$._onImgEditButtonClick(\'' + dialogName + '\');" class="edui-clickable pic-pro">' + '属性' + '</span></nobr>';
                        /*
                        str = '<nobr>' + editor.getLang("property") + ': ' +
                            '<span onclick=$$._onImgSetFloat("none") class="edui-clickable">' + editor.getLang("default") + '</span>&nbsp;&nbsp;' +
                            '<span onclick=$$._onImgSetFloat("left") class="edui-clickable">' + editor.getLang("justifyleft") + '</span>&nbsp;&nbsp;' +
                            '<span onclick=$$._onImgSetFloat("right") class="edui-clickable">' + editor.getLang("justifyright") + '</span>&nbsp;&nbsp;' +
                            '<span onclick=$$._onImgSetFloat("center") class="edui-clickable">' + editor.getLang("justifycenter") + '</span>&nbsp;&nbsp;' +
                            '<span onclick="$$._onImgEditButtonClick(\'' + dialogName + '\');" class="edui-clickable">' + editor.getLang("modify") + '</span></nobr>';
                        */
                        !html && (html = popup.formatHtml(str));
                        if (html) {
                            popup.getDom('content').innerHTML = html;
                            popup.anchorEl = img;
                            popup.showAnchor(popup.anchorEl);
                        } else {
                            popup.hide();
                        }

                    }
                });
            };
            //图片工具条代码结束

        }
    };
}]);
