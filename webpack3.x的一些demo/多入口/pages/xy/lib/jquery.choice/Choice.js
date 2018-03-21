(function ($) {
    $.fn.extend({
        "Choice": function (options) {
        	 //检测用户传进来的参数是否合法
            if (!isValid(options)) return this;
            var opts = $.extend({}, defaluts, options); 
            var screenCurArr = [];
            var _this = this;
            //创建弹框

            if ( $("#choiceModal").length === 0 ) { 
				$('body').append('<div class="modal fade" id="choiceModal"></div>');
			} 
            $('#choiceModal').load(opts.url,function(){
				$('#choiceModal').modal({backdrop:'static',keyboard:false});
				var str = '';

				$(_this).siblings(':not(".btn")').each(function(k,v){
					str += '<li data-id="'+$(v).find('.close').attr('data-id')+'" class="item"><span>'+$(v).find('span').first().text()+'</span><span class="close"> ×</span></li>';
					screenCurArr.push($(v).find('span').first().text())
				})
				$('#screen-num').text(screenCurArr.length);
				$('#screen-l').html(str);

				$('#screen-input').off('keyup').on('keyup',function(){
		    		var val = $(this).val();
		    		$('#screen-r').empty();
					var str = '';
					$.each(opts.arr,function(k,v){
						if(screenCurArr.indexOf(v.name)<0){
							if(v.name.indexOf(val) != -1){
								str += '<li data-id="'+v.id+'">'+v.name+'</li>';
							}
						}
					})
					if(!str){str = '<li class="noData">未查找到匹配数据！</li>'}
					$('#screen-r').html(str);
		    	});
		    	$('#screen-input').trigger('keyup');
		    	$('#screen-r').off('click').on('click','li',function(event){	
		    		event.stopPropagation();
		    		if(opts.upperLimit != 0 && screenCurArr.length >= opts.upperLimit){
		    			new $.zui.Messager('选择的人数超过上限（'+opts.upperLimit+'）', {
							type:'danger',
							icon:'exclamation-sign'
						}).show()
		    			return false;
		    		}
		    		if($(this).hasClass('noData')){return false;}
		    		screenCurArr.push($(this).text());
		    		$('#screen-num').text(screenCurArr.length);
		    		$('.screen-box .ul').prepend('<li data-id="'+$(this).attr('data-id')+'" class="item"><span>'+$(this).text()+'</span><span class="close"> ×</span></li>');
		    		$(this).remove();
		    	});
		    	$('#screen-l').off('click').on('click','.close',function(event){
		    		event.stopPropagation();
		    		var val = $(this).prev().text();
		    		for(var i=0; i< screenCurArr.length; i++) {
					    if(screenCurArr[i] == val) {
					      screenCurArr.splice(i, 1);
					    }
					  }
					$('#screen-num').text(screenCurArr.length);
					$('#screen-r').find('.noData').remove();
		    		$('#screen-r').prepend('<li>'+$(this).prev().text()+'</li>');
		    		$(this).closest('li').remove();
		    		$('#screen-input').val('');
					$('#screen-input').trigger('keyup');
		    	});
		    	$('#bc').off('click').on('click',function(event,callback){
		    		event.stopPropagation();
		    		var str = '';
					var arr = [];
					$('#screen-l .item').each(function(k,v){
						str += '<span class="label label-bq"><span>'+$(v).find('span').first().text()+'</span><i class="close" data-id="'+$(v).attr('data-id')+'"> ×</i></span>';
						arr.push($(v).attr('data-id'))
					});		
					$(_this).siblings(':not(".btn")').remove();
					$(_this).before(str);
					//回调
					if($.fn.Choice.callback){ $.fn.Choice.callback(arr,_this); }
					$('#choiceModal').modal('hide');
		    	});
			});
        }
    });
    //默认参数
    var defaluts = {
    	arr:[],
    	url:'./choice.html',
    	upperLimit:0	//上限，默认无上限
    };
   	//私有方法，检测参数是否合法
    function isValid(options) {
        return !options || (options && typeof options === "object") ? true : false;
    }
})(window.jQuery);