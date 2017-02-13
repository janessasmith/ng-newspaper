/*
  Create by BaiZhiming 2016-4-08
  ueditorForAtlas
  图集稿编辑器
*/
'use strict';
angular.module("util.ueditorForAtlas", [])
    .directive("ueditorForAtlas", ["$window", "$timeout", "$sce", "$compile", function($window, $timeout, $sce, $compile) {
        return {
            restrict: 'E',
            scope: {
                list: "=",
            },
            replace: true,
            template: "<div><script id='ueditor' style='width:100%;position:relative'></script><div class='trs_ueditor_selectionNum'>选中字数统计</div></div>",
            link: function(scope, element, attrs, ctrl) {
                var editorToolBar = {
                    toolbars: [
                        [
                            'source' /*0*/ , 'undo' /*1*/ , 'redo' /*2*/ , '|' /*3*/ , 'cut' /*4*/ , 'copy' /*5*/ , 'paste' /*6*/ , '|' /*7*/ , 'customstyle' /*8*/ , 'fontfamily' /*9*/ , 'fontsize' /*10*/ , 'forecolor' /*11*/ , 'bold' /*12*/ , 'italic' /*13*/ , 'underline' /*14*/ , 'strikethrough' /*15*/ , 'subscript' /*16*/ , 'backcolor' /*17*/ , '|' /*18*/ , 'justifyleft' /*19*/ , 'justifycenter' /*20*/ , 'justifyright' /*21*/ , 'justifyjustify' /*22*/ , '|' /*23*/ , 'insertorderedlist' /*24*/ , 'insertunorderedlist' /*25*/ , 'directionalityltr' /*26*/ , 'directionalityrtl' /*27*/ , 'lineheight' /*28*/ , /* 'background', 'backgroundimg', */ '|' /*29*/ , 'formatmatch' /*30*/ , 'searchreplace' /*31*/ , /*'insertframe' 32, 'pagebreak'*/ /*33*/ /*, 'simpleupload'*/ , /*'insertimage'*/ /*34, */ /*'insertvideo' ,*/
                            'inserttable' /*35*/ , 'insertrow' /*36*/ , 'insertcol' /*37*/ , 'inserttitle' /*38*/ , 'insertparagraphbeforetable' /*39*/ /*  */ /*40*/ , 'removeformat' /*41*/ , 'autotypeset' /*42*/ , 'link' /*43*/ , 'unlink' /*44*/ , 'indent' /*45*/,'pasteplain'
                        ]
                    ],
                    labelMap: {
                        'anchor': '',
                        'undo': '',
                        'cut': '剪切',
                        'copy': '复制',
                        'paste': '粘贴',
                        'backgroundimg': '背景图'
                    },
                    //如果自定义，最好给p标签如下的行高，要不输入中文时，会有跳动感
                    initialStyle: 'p{line-height:1.5em}', //编辑器层级的基数,可以用来改变字体等
                    maximumWords: 100000,
                    autoHeightEnabled: true,
                    allowDivTransToP: false,
                    topOffset: 47,
                    enableContextMenu: false,
                    pasteplain: true
                };
                var ue = UE.getEditor('ueditor', editorToolBar);
                ue.ready(function() {
                    var domUtils = baidu.editor.dom.domUtils;
                    // ue.setHeight(200);
                    //ue.setContent(scope.list.HTMLCONTENT.replace(/\u0020/g, "u3000"));
                    ue.setContent(scope.list.HTMLCONTENT);
                    scope.list.DOCWORDSCOUNT = ue.getContentTxt().replace(/\n/g, "").length; //兼容大数据取稿字数算法不同问题
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
                    var promise_keyup;
                    var promise_contentChange;
                    ue.addListener("keyup", function() { //实时双向绑定开始
                        bindContent(promise_keyup);
                    });
                    ue.addListener("contentChange", function() { //实时双向绑定开始
                        bindContent(promise_contentChange);
                    });
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
                           /* var e = event;
                            var sh = $window.pageYOffset || $window.document.documentElement.scrollTop || $window.document.body.scrollTop || 0;
                            position.left = (e.clientX - 40 < 0) ? e.clientX + 20 : e.clientX - 40;
                            position.top = (e.clientY - 40 < 0) ? e.clientY + sh + 20 : e.clientY + sh - 40;*/
                            selectionNumDiv.html("已选中" + selectionStr.replace(/&nbsp;/g, "").replace(/\u00a0/g, "").replace(/\u3000/g, "").replace(/\n/, "").length + "个字");
                            showSelectionNum(position);
                        } else {
                            hideSelectionNum();
                        }
                    }
                });
                /**
                 * [initStatus bindContent]绑定数据和编辑器内容
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
                        scope.list.DOCWORDSCOUNT = preContent.replace(/\n/g, "").length;
                    }, 500);
                    return promise;
                }
            }
        };
    }]);
