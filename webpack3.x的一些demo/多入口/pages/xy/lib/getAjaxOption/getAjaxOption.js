//闭包限定命名空间
(function ($) {
    $.fn.extend({
        getAjaxOption: function (options,dynaData) {
            //检测用户传进来的参数是否合法
            if (!isValid(options)) return this;
            var opts = $.extend({}, defaluts, options);

           
            $(document).on('click',function(event){
                event = window.event || event; 
                var target = $(event.srcElement || event.target);  
                var is_select = opts.container_class+' *,'+opts.container_class+','+opts.target_class+' *,'+opts.target_class;
                if(!target.is(is_select)){
                    $(opts.container_class).hide();
                }
            })
            return this.each(function () { 
                var $this = $(this);
                if(!$this.hasClass(opts.target_class.slice(1))){ 
                    $this.parent().css('position','relative');
                    $this.addClass(opts.target_class.slice(1))
                         .after('<div class="'+opts.container_class.slice(1)+'">'+
                                    '<div class="'+opts.container_class.slice(1)+'-box">'+
                                        '<div class="'+opts.no_data_class.slice(1)+'">'+opts.no_data_msg+'</div>'+
                                    '</div>'+
                                '</div>');
                    $this.parent().find(opts.container_class).on('click',opts.option_class,function(){
                        opts.clickCallback($this,this,opts);
                    })
                }
                $this.off('input').on('input',function(){
                    var data = {};
                    data[opts.ajax_keyword_name] = $.trim($this.val());
                    data = $.extend({}, opts.ajax_data, data);
                    if(dynaData){
                        data = $.extend({}, data, dynaData);
                    }
                    if( data[opts.ajax_keyword_name].length <=0 ){ return false; }
                    $.ajax({
                        type:opts.ajax_type,
                        url :opts.ajax_url,
                        data: data,
                        success: function(response){
                            opts.successCallback($this,response,opts);
                        }
                    });
                })
                
            });
        }
    });
    //默认参数
    var defaluts = {
        // 容器dom
        container_class:'.container-options',
        target_class:'.ajaxOptionThis', 
        option_class:'.item',
        no_data_class:'.no-data',
        no_data_msg:'未找到相关数据',
        ajax_url:'http://xaapi.xafc.com/House/Searchkeyword/v1_0?',
        ajax_type:'get',
        ajax_data:{
            city : 'hf',
            kwflag : 1
        },
        ajax_keyword_name:'kw',
        clickCallback:clickCallback,
        successCallback:successCallback,
    };
    function clickCallback($this,that,opts) {
        var cur_id = $(that).attr('data-id');
        var house_select = $this.parent().parent().find('[name^=house_select]');
        var isValid = true;
        if(house_select && house_select.length != 0){
            $.each(house_select,function(k,v){
                if( cur_id == $(v).val() ){
                    isValid = false;
                }
            });
        }
        if(!isValid){
            dangerMsg.show('请勿重复选择楼盘');
            return false;
        }
        $this.parent().after('<span class="label label-bq">'+
                '<span>'+$(that).text()+'</span>'+
                '<input type="hidden" name="house_select[]" value="'+$(that).attr('data-id')+'" />'+
                '<i class="close"> ×</i>'+
            '</span>'
        );
        $this.val('').focus();
        $this.parent().find(opts.container_class).hide();
    }   
    function successCallback($this,response,opts) {
        $this.parent().find(opts.container_class).show().find(opts.option_class).remove();
        if(response.data == "no result"){
            $('.no-data',opts.container_class).show();
        }else{
            $('.no-data',opts.container_class).hide();
            var list = '';
            for (var i=0; i<response.data.list.length; i++){
                list += '<div class="'+opts.option_class.slice(1)+'" data-id="'+response.data.list[i].houseid+'">'+response.data.list[i].housename+'</div>';                             
            }
            $(opts.container_class+'-box').append(list);
        }
    }
    function isValid(options) {
        return !options || (options && typeof options === "object") ? true : false;
    }
})(window.jQuery);