/* 
 * justToolsTip v1.2
 * Simple customizable tooltip with confirm option and 3d effects
 * (c)2015 chemailbox@163.com, qq:977877
 */

(function($) {
    function justTools(options){
        var target = options.events.toElement || options.events.target;
        this.elem = $(target);
        this.set = options;
        this.obj = null;
    }
    justTools.prototype = {
        addAnimation: function(){
            switch(this.set.animation){
                case 'none':
                    break;
                case 'fadeIn':
                    this.obj.addClass('animated fadeIn');
                    break;
                case 'flipIn':
                    switch(this.set.gravity){
                        case 'top':
                            this.obj.addClass('animated flipInTop');
                            break;
                        case 'bottom':
                            this.obj.addClass('animated flipInBottom');
                            break;
                        case 'left':
                            this.obj.addClass('animated flipInLeft');
                            break;
                        case 'right':
                            this.obj.addClass('animated flipInRight');
                            break;
                    }
                    break;
                case 'moveInLeft':
                    this.obj.addClass('animated moveLeft');
                    break;
                case 'moveInTop':
                    this.obj.addClass('animated moveTop');
                    break;
                case 'moveInBottom':
                    this.obj.addClass('animated moveBottom');
                    break;
                case 'moveInRight':
                    this.obj.addClass('animated moveRight');
                    break;
            }
        },
        close:function(){
            this.obj.remove();
        },
        setPosition:function(){
            var setPos = {};
            var pos = { x: this.elem.offset().left, y: this.elem.offset().top };
            var wh = { w: this.elem.outerWidth(), h: this.elem.outerHeight() };
            var rightTmp = ( pos.x + wh.w / 2 ) + this.obj.outerWidth() / 2 ;
            var leftTmp = ( pos.x + wh.w / 2 ) - this.obj.outerWidth() / 2 ;
            //console.log(leftTmp)
            switch(this.set.gravity){
                case 'top':
                    if(rightTmp > $(window).width() ){
                        setPos = {
                            x: pos.x + wh.w - this.obj.outerWidth(),
                            y: pos.y - this.obj.outerHeight() - 10
                        };
                        this.obj.find(".just-" + this.set.gravity).css("left", this.obj.outerWidth() - wh.w/2 + "px")
                    }else if( leftTmp < 0 ){
                        setPos = {
                            x: pos.x,
                            y: pos.y - this.obj.outerHeight() - 10
                        };
                        this.obj.find(".just-" + this.set.gravity).css("left", wh.w/2 + "px")
                    }else{
                        setPos = {
                            x: pos.x - (this.obj.outerWidth() - wh.w)/2,
                            y: pos.y - this.obj.outerHeight() - 10
                        };
                    }
                    break;
                case 'bottom':
                    if(rightTmp > $(window).width() ){
                        setPos = {
                            x: pos.x + wh.w - this.obj.outerWidth(),
                            y: pos.y + wh.h + 10 
                        };
                        this.obj.find(".just-" + this.set.gravity).css("left", this.obj.outerWidth() - wh.w/2 + "px")
                    }else if( leftTmp < 0 ){
                        setPos = {
                            x: pos.x,
                            y: pos.y + wh.h + 10 
                        };
                        this.obj.find(".just-" + this.set.gravity).css("left", wh.w/2 + "px")
                    }else{
                        setPos = {
                            x: pos.x - (this.obj.outerWidth() - wh.w)/2,
                            y: pos.y + wh.h + 10 
                        };
                    }
                    break;
                case 'left':
                    setPos = {
                        x: pos.x - this.obj.outerWidth() - 10,
                        y: pos.y - (this.obj.outerHeight() - wh.h)/2
                    };
                    break;
                case 'right':
                    setPos = {
                        x: pos.x + wh.w + 10,
                        y: pos.y - (this.obj.outerHeight() - wh.h)/2
                    };
                    break;
            }
            this.obj.css({"left": setPos.x + "px", "top": setPos.y + "px"});
        },
        setEvent:function(){
            var self = this;

            if(self.set.events =="click" || self.set.events =="onclick" || self.set.events=="readystatechange"){
                self.obj.on("click", function(e){
                    e.stopPropagation();
                })
                $(document).one("click",function(){
                    self.obj.remove();
                });
            }
            if(this.set.events =="mouseover" || this.set.events =="onmouseover" || this.set.events =="mouseenter"){
                this.elem.on("mouseout, mouseleave",function(){
                    self.close();
                });
            }
        },
        setConfirmEvents:function(){
            var self = this;
            if(typeof this.set.onYes == "function"){
                $("#yes_"+this.set.id).on("click", function(){
                    if(self.set.onYes(self)==true){
                        self.close();
                    };
                })
            }
            if(typeof this.set.onNo == "function"){
                $("#no_"+this.set.id).on("click", function(){
                    self.close();
                    self.set.onNo(self);
                })
            }
        },
        addConfirm:function(){
            var yes = "";
            var no = "";
            if(typeof this.set.onYes == "function"){
                yes = "<button type='button' class='just-yes' id='yes_"+this.set.id+"'>"+ this.set.yes+"</button>";
            }
            if(typeof this.set.onNo == "function"){
                no = "<button type='button' class='just-no' id='no_"+this.set.id+"'>" + this.set.no +"</button>";
            }
            if(yes == "" && no == ""){
                return;
            }
            this.obj.append("<div class='just-confirm'>" + yes + no + "</div>");
            this.setConfirmEvents();
        },
        setContent:function(){
            this.obj = $("<div id=just_" + this.set.id + " class='just-tooltip " + this.set.theme + "'" +
                "style='width:" + this.set.width + "'><div class='just-con'>" + this.set.contents + "</div>" + "<span class='just-" + this.set.gravity + "'></span></div>");
            $("body").append(this.obj);
            this.addConfirm();
            this.setEvent();
            this.addAnimation();
        },
        /*
        getEvent:function(){
            if(window.event){return window.event};
            var func=this.getEvent.caller;              
            while(func!=null){      
                var arg0 = func.arguments[0];
                
                if(arg0){
                    console.log(arg0.constructor)
                   if((arg0.constructor==Event || arg0.constructor==MouseEvent)  
                     || (typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation)){      
                        return arg0;  
                    }  
                }  
                func = func.caller;  
            }
            return null;  
        },*/
        init:function(){
            //var e = this.getEvent(); //获取事件
            var e = this.set.events; //传入事件;
            e.stopPropagation(); //阻止冒泡
            this.set.events = e.type;
            this.setContent();
            this.setPosition();
            var self = this;
            $(window).one("resize",function(){
                self.setPosition();
            })
        }
    }
    $.justToolsTip = function(options){
        var defaults = {
            events:"", //必填
            height:"auto",
            width:"auto",
            contents:'',
            gravity: 'top',  //top, left, bottom, right
            theme: '',
            animation: 'none', //none, fadeIn, flipIn, moveInLeft, moveInTop, moveInBottom, moveInRight
            yes: '确定',
            no: '取消',
            onYes:null,//function(){}, //返回ture，关闭tools
            onNo:null,//function(){}
        }
        options = $.extend(defaults, options);
        options.id = new Date().getTime();
        var tooltip = new justTools(options);
        tooltip.init();
        return tooltip;
    }
})(jQuery);










