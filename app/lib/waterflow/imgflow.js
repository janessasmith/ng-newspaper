  $.fn.imgflow = function(option) {
    var _self = this;
    var timer;
    var def = {
      imgHeight: "200",
      rowSize: 4
    }
    def = $.extend(def, option);

    function initImageHt() {
      $(_self).find("img").css({
        "width": "auto",
        "height": def.imgHeight + "px"
      });
      $(_self).find("li").css({
        "width": "auto",
        "height": def.imgHeight + "px"
      });
    }

    function calcImgElWidth() {
      var imgLi = $(this).find("li"); //图片单元
      var wt = $(this).width(), //容器宽度
        rowCount = 0;
      var rWt = 0, //累加每行单元宽度
        rArr = [];
      $.each(imgLi, function(i, n) {
      
        $(n).show();
        var w = $(n).outerWidth(true); //图片单元
        rWt += w;
        rArr.push(n);
        if (rWt > wt) {
          var lastEl = rArr.pop();
          var sumLen = wt - rWt + $(lastEl).outerWidth(true);
          var d = Math.floor((sumLen) / rArr.length);
          var total = 0;
          $.each(rArr, function(j, m) {
            var marginWt = Number($(m).css("margin-left").replace("px", "")) || 0 + Number($(m).css("margin-right").replace("px", "")) || 0;
            var w2 = $(m).width() + d - marginWt;
            var imgEl = $(m).find("img").eq(0);

            total += $(m).width() + d;
            if (j == rArr.length - 1 && total != wt) {
              $(m).width(w2 + wt - total - 2);

              imgEl.css({
                "width": w2 + wt - total - 2 + "px",
                "height": "auto"
              });
            } else {
              if (w2 > imgEl.width()) {
                imgEl.css({
                  "width": w2 + "px",
                  "height": "auto"
                });
              }
              $(m).width(w2);
            }
          });
          rWt = $(lastEl).outerWidth(true);
          rArr.length = 0;
          rArr.push(lastEl);
          rowCount++;
          if (rowCount >= def.rowSize) {
            $(rArr[0]).hide();
          }
        } else if (rowCount >= def.rowSize) {
          $(rArr[0]).hide();
          $(n).hide();
        }
      });
    }

    $(window).bind("resize", function() {
      if (timer) {
        window.clearTimeout(timer);
      }
      initImageHt();
      timer = setTimeout(calcImgElWidth.call(_self), 500);
    });

    //图片加载完毕执行
    imagesLoaded($(_self), function(instance) {
      initImageHt();
      calcImgElWidth.call(_self);
      $(_self).css("visibility", "visible");
    });
  }