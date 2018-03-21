//导航 下拉菜单定时器
var hoverTimers = null;
//一级菜单状态
var MENU_HIDE_NUM = 1;
var DATATABLE = null;
var xa = {
	// 菜单
	xaMenu:function(){
		var xaMenu = $('.xa-menu');
		var xaMenuThree = $('.xa-menu-three');
		var timeAxis = $('.time-axis');
		var memberMenuThree = $('.xa-member-menu-three');
		var content = $('#content');
		xaMenu.find('.shrink').click(function(){
			xaMenu.find('i').removeClass('rotate180');
			if(MENU_HIDE_NUM){
				xaMenu.find('li').find('ul').stop(true).animate({
					height:'hide'
				},300);
				xaMenu.stop(true).animate({
					'width':'48px'
				},300);
				xaMenu.find('li.active i').first().addClass('active');
				if(xaMenuThree.length){
					content.stop(true).animate({
						'padding-left':'178px'
					},300);
					xaMenuThree.stop(true).animate({
						left:'48px'
					},300);
				}
				else if(timeAxis.length){
					content.stop(true).animate({
						'padding-left':'268px'
					},300);
					xaMenuThree.stop(true).animate({
						left:'48px'
					},300);
					timeAxis.stop(true).animate({
					 	left:'48px'
					},300)

				}else if(memberMenuThree.length){
					content.stop(true).animate({
						'padding-left':'318px'
					},300);
					xaMenuThree.stop(true).animate({
						left:'48px'
					},300);
					memberMenuThree.stop(true).animate({
					 	left:'48px'
					},300)

				}else{
					content.stop(true).animate({
						'padding-left':'48px'
					},300);
				}

				MENU_HIDE_NUM = 0;	
			}else{
				xaMenu.find('li.active i').first().removeClass('active');
				xaMenu.find('li.active i').toggleClass('rotate180');
				xaMenu.stop(true).animate({
					'width':'170px'
				},300);
				xaMenu.find('li.active>ul').animate({
					height:'toggle'
				},300);
				if(xaMenuThree.length){
					content.stop(true).animate({
						'padding-left':'300px'
					},300)
					xaMenuThree.stop(true).animate({
						left:'170px'
					},300);	
				}
				else if(timeAxis.length){
					content.stop(true).animate({
						'padding-left':'390px'
					},300);
					timeAxis.stop(true).animate({
						left:'170px'
					},300);
				}else if(memberMenuThree.length){
					content.stop(true).animate({
						'padding-left':'440px'
					},300);
					memberMenuThree.stop(true).animate({
						left:'170px'
					},300);
				}else{
					content.stop(true).animate({
						'padding-left':'170px'
					},300)
				}
				MENU_HIDE_NUM = 1;	
			}
		});
		xaMenu.find('li>div').click(function(event){
			var that = $(this);
			if(!MENU_HIDE_NUM) {
				xaMenu.stop(true).animate({
					'width':'170px'
				},300);
				xaMenu.find('li.active i').first().removeClass('active');
				if(xaMenuThree.length){
					content.stop(true).animate({
						'padding-left':'300px'
					},300)
					xaMenuThree.stop(true).animate({
						left:'170px'
					},300);
				}else{
					content.stop(true).animate({
						'padding-left':'170px'
					},300)
				}
				MENU_HIDE_NUM = 1;
			}
			that.parent('li').siblings('li').find('i').removeClass('rotate180');
			that.parent('li').siblings('li').find('ul').animate({
				height:'hide'
			},300)
			that.find('i').toggleClass('rotate180');
			that.next().stop().animate({
				height:'toggle'
			},300);
		})
	},
	// 导航下拉菜单
	dropMenu:function(){
		var avatar = $('.xa-navbar .avatar');
		var clickNum = 0;
		$('.nav-more').hover(function() {
			var $that = $(this);
			$that.addClass('hover');
			$that.find('.icon-angle-down').addClass('rotate');
			hoverTimers = setTimeout(function(){
				$that.find('.dropdown-menu').stop(true,true).slideDown(200);
			},100)	
		}, function() {
			var $that = $(this);
			clearTimeout(hoverTimers);
			hoverTimers = null;
			$that.find('.icon-angle-down').removeClass('rotate');
			$that.removeClass('hover');
			$that.find('.dropdown-menu').stop(true,true).slideUp(200);
		});
		avatar.click(function() {
			clickNum++;
			var $that = $(this);
			if(clickNum == 1){
				$that.addClass('hover');
				$that.find('.icon-angle-down').addClass('rotate');
				hoverTimers = setTimeout(function(){
					$that.find('.dropdown-menu').stop(true,true).slideDown(200);
				},100)	
			}else {
				clickNum = 0;
				clearTimeout(hoverTimers);
				hoverTimers = null;
				$that.find('.icon-angle-down').removeClass('rotate');
				$that.removeClass('hover');
				$that.find('.dropdown-menu').stop(true,true).slideUp(200);
			}
			
		});
		avatar.on('mouseleave',function(event) {
			clickNum = 0;
			var $that = $(this);
			clearTimeout(hoverTimers);
			hoverTimers = null;
			$that.find('.icon-angle-down').removeClass('rotate');
			$that.removeClass('hover');
			$that.find('.dropdown-menu').stop(true,true).slideUp(200);
		});
	},
	init:function(){
		this.xaMenu();
		this.dropMenu();
		// 为页面第一次加载完毕的 select初始化插件，之后生成的select需再次调用这方法，且元素不能相同
		if( $('select.chosenInit').length ) this.chosenInit('select.chosenInit');
		if( $('.datetimeInit-0').length )   this.datetimeInit('.datetimeInit-0',0);
		if( $('.datetimeInit-1').length )   this.datetimeInit('.datetimeInit-1',1);
		if( $('.datetimeInit'  ).length )   this.datetimeInit('.datetimeInit',2);
		// 为body绑定click事件，用于隐藏侧边弹出框 
		if($('.asideModal').length){
			$(document).click(function(event){
	        	var event= window.event || arguments.callee.caller.arguments[0];
	        	var target = event.target || window.event.target;
				// 判断点击位置不在表格范围内
				if(!$(target).is('.table *,.modal *,.modal,.layui-layer-shade,.layui-layer-btn,.layui-layer-btn0,.layui-layer-ico,.atwho-container *,.atwho *,.viewer-container,.viewer-container *	')){
					if($('.asideModal').hasClass('in')){
						$('.asideModal.in').modal('hide');
					}
				}
			})
		}
	},
	// dataTables初始化
	dtInit:function(elem,ajaxUrl,columnArr,drawCallback){
		DATATABLE = $(elem).DataTable({
	        serverSide: true,
	        processing: true,
	        ajax: ajaxUrl,
	        columns:columnArr,
	        paging:true,
	        pageLength: 10,
	        ordering: false,
	        order: [],
	        scrollX: true,
	        scrollY: true,
	        scrollCollapse: false,
	        autoWidth:false,
	        deferRender: true,
	        language: {
	            sProcessing: "数据加载中...",
	            sLengthMenu: "显示 _MENU_ 项结果",
	            sZeroRecords: "暂无匹配结果",
	            sInfo: "共 _TOTAL_ 条记录",
	            sInfoEmpty: "显示第 0 至 0 项结果，共 0 项",
	            sInfoFiltered: "(由 _MAX_ 项结果过滤)",
	            sInfoPostFix: "",
	            sSearch: "搜索:",
	            sUrl: "",
	            sEmptyTable: "没有数据",
	            sLoadingRecords: "",
	            sInfoThousands: ",",
	            oPaginate: {
	                sFirst: "首页",
	                sPrevious: "< 上一页",
	                sNext: "下一页 >",
	                sLast: "末页"
	            },
	            oAria: {
	                sSortAscending: ": 以升序排列此列",
	                sSortDescending: ": 以降序排列此列"
	            }
	        },
	        dom:
	        "<'row'<'col-xs-12'tr>>" +
	        "<'row'<'col-xs-5'i><'col-xs-7'p>>",
	        drawCallback:drawCallback
    	});
	},
	// dataTables初始化
	dataTables:function(elem,ajaxUrl,columnArr,drawCallback,option){
		option 			= option 			|| {};
		option.ordering = option.ordering 	|| false;
		option.order 	= option.order 		|| [];
		option.dom 		= option.dom 		|| "<'row'<'col-xs-12'tr>><'row'<'col-xs-5'i><'col-xs-7'p>>";
		option.pageLength = option.pageLength || 10;
		option.serverSide = option.serverSide === false ? false: true;
		option.language = option.language   || {};
        var language = {
            sProcessing: "数据加载中...",
            sLengthMenu: "显示 _MENU_ 项结果",
            sZeroRecords: "暂无匹配结果",
            sInfo: "共 _TOTAL_ 条记录",
            sInfoEmpty: "显示第 0 至 0 项结果，共 0 项",
            sInfoFiltered: "(由 _MAX_ 项结果过滤)",
            sInfoPostFix: "",
            sSearch: "搜索:",
            sUrl: "",
            sEmptyTable: "没有数据",
            sLoadingRecords: "",
            sInfoThousands: ",",
            oPaginate: {
                sFirst: "首页",
                sPrevious: "< 上一页",
                sNext: "下一页 >",
                sLast: "末页"
            },
            oAria: {
                sSortAscending: ": 以升序排列此列",
                sSortDescending: ": 以降序排列此列"
            }
        };
        language = $.extend({},language,option.language );
		var DATATABLE = $(elem).DataTable({
	        serverSide: option.serverSide,
	        processing: true,
	        ajax: ajaxUrl,
	        columns:columnArr,
	        paging:true,
	        pageLength: option.pageLength,
	        ordering: option.ordering,//是否开启排序
	        order: [],
	        scrollX: true,
	        scrollY: true,
	        scrollCollapse: false,
	        autoWidth:false,
	        deferRender: true,
	        language: language,
	        dom:option.dom,
	        drawCallback:drawCallback
    	});
    	return DATATABLE;
	},
	dtColumnSearch:function(elem,eventType,column,valElem){	
		$(elem).on(eventType,function(){
			var value = $(this).val();
			if(valElem){
				value = $(valElem).val();
			}
	        DATATABLE.columns(column).search(value).draw();
	    });
	},
	// 表格弹窗右侧弹出ajax
	tableGetAjax:function(event,method,ajaxUrl,data,callback,arg){
		if(event){
            var event= window.event || arguments.callee.caller.arguments[0];
            var target = event.target || window.event.target;
            if(target.nodeName == "I"){ target = $(target).parent('button')}
        }
        $.ajax({
        	type:method,
        	url:ajaxUrl,
        	data:data,
        	success:function(result){
        		callback(result,arg);
        	},
        	error:function(error){
        		callback(error,arg);
        	}
        })
	},
	// chosen初始化
	chosenInit:function(elem){
		$(elem).chosen({
	        no_results_text: '没有找到',    // 当检索时没有找到匹配项时显示的提示文本
	        disable_search_threshold: 10, // 10 个以下的选择项则不显示检索框
	        search_contains: true         // 从任意位置开始检索
	    });
	    $(elem).trigger('chosen:updated');
	},
	// bootstraps日期插件初始化
	datetimeInit:function(elem,type){	
		// type 0分钟 1小时 2日
		if(!type && type != 0){ type = 2; }
		var format = "yyyy-mm-dd hh:ii";
		switch(type){
			case 2: format = "yyyy-mm-dd"
		}
		$(elem).datetimepicker({
			language:  "zh-CN",
			weekStart: 1,
			todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: type,
			forceParse: 0,
			format: format
		});
	},
	/*弹出确认弹窗*/
	showConfirmModal:function($id,option){
		$id 			= $id 				|| '';
		option 			= option 			|| {};
		option.action 	= option.action 	|| '';
		option.submit 	= option.submit 	|| 'button';

		option.title 	= option.title 		|| '<i class="icon-info-sign"></i> 确认';
		option.content  = option.content 	|| '是否删除?';
		option.name 	= option.name 		|| 'id';
		option.width 	= option.width 		|| '';
		option.ajaxUrl 	= option.ajaxUrl 	|| '';
		option.ajaxType = option.ajaxType 	|| 'get';
		option.ajaxData = option.ajaxData 	|| {};

		option.done		= option.done 		|| function(){};
		option.fail		= option.fail 		|| function(){};
		option.always	= option.always 	|| function(){};

		option.dom 		= option.dom 		|| '';
		
		if($('#ConfirmModal').length){
			$('#ConfirmModal').remove();
		}
		var modal = '<div class="modal fade" id="ConfirmModal">'+
						'<form action="'+option.action+'">'+
	  						'<div class="modal-dialog modal-sm" style="width:'+option.width+'px">'+
	    						'<div class="modal-content">'+
	      							'<div class="modal-header">'+
	        							'<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>'+
								        '<h4 class="modal-title">'+option.title+'</h4>'+
								    '</div>'+
							      	'<div class="modal-body">'+
							        	'<div class="custom-content">'+option.content+'</div>'+
							        	'<input type="hidden" name="'+option.name+'" value="'+$id+'"/>'+
							      	'</div>'+
							      	'<div class="modal-footer">'+
							      		'<button type="'+option.submit+'" class="btn btn-ea5e13 confirm">确认</button>'+
							        	'<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
							      	'</div>'+
	    						'</div>'+
	  						'</div>'+
  						'<form>'+
					'</div>';
		$('body').append(modal);
		
		var confirmModal = $('#ConfirmModal');

		confirmModal.modal('show').on('shown.zui.modal', function() {
			if(option.submit === 'button'){
				var $id = confirmModal.find('[name='+option.name+']').val();
				option.ajaxData[option.name] = $id;
				if(!option.ajaxUrl){
					confirmModal.find('.confirm').off('click').on('click',function(){
						option.done(option.dom);
						confirmModal.modal('hide');
					})
					return false;
				}

				confirmModal.find('.confirm').off('click').on('click',function(){
					$.ajax({
						url:  option.ajaxUrl,
						type: option.ajaxType,
						data: option.ajaxData
					})
					.done(function(result) {
						option.done(option.dom,result);
						confirmModal.modal('hide');
					})
					.fail(function(error) {
						option.fail(option.dom,error);
					})
					.always(function() {
						option.always(option.dom);
					});	
				})
			}
		});
	}	
}


xa.init();



/*表单验证函数*/
function validator(elem){
	var msg = new $.zui.Messager({
    	type: 'danger',
    	icon: 'exclamation-sign'
	});
	$(elem).validator({	
	    msgMaker: false,
	    invalid: function(form, errors){
	       msg.show(errors[0]);
	    },
	    invalidClass:'has-error'
	}).on("click", "button.submit-btn", function(e){
	    $(e.delegateTarget).trigger("submit");
	});
}


/*文件各类型生成dom*/
function getFileHtml(url,vORe,callback,Name,opts){
	if(!url){ return false; }
	callback = callback || function(){};
	Name 	 = Name 	|| 'upload';
	opts 	 = opts 	|| {};

	var type = url.slice(url.lastIndexOf('.')+1).toLowerCase();
	var flieName = url.slice(url.lastIndexOf('/')+1);

	opts.flieName = opts.flieName || flieName;

	var iconClass = '';
	switch(type){
		case 'ppt': iconClass = 'powerpoint';break;
		case 'pptx': iconClass = 'powerpoint';break;
		case 'xls': iconClass = 'excel';break;
		case 'xlsx': iconClass = 'excel';break;
		case 'doc': iconClass = 'word';break;
		case 'docx': iconClass = 'word';break;
		case 'zip': iconClass = 'archive';break;
		case 'rar': iconClass = 'archive';break;
		case 'jpg': iconClass = 'no-image';break;
		case 'png': iconClass = 'no-image';break;
		case 'gif': iconClass = 'image';break;
	}
	if( iconClass === 'no-image' ){	//图片缩略图
		var html = '<div class="upload-box">'+
			'<i class="fileTypeIcon">'+
				'<img src="'+url+'" width="100%" height="100%">'+
			'</i>'+
			'<p>'+opts.flieName+'</p>'+
			
			'<div class="upload-hover">'+
				'<div class="shadow">'+
					'<a href="'+url+'" target="_blank"><i class="icon-eye-open"></i></a>'+
				'</div>'+
				
			'</div>'+
		'</div>';
		//'<div class="shadow">'+
		// 	'<a href="javascript:;" onclick="showViewer(this)"><i class="icon-eye-open"></i></a>'+
		// '</div>'+
		if(vORe === 'edit'){
			html = '<div class="upload-box" data-url="'+url+'">'+
				'<i class="fileTypeIcon">'+
					'<img src="'+url+'" width="100%" height="100%">'+
					'<input type="hidden" name="'+Name+'[]" value="'+url+'"/>'+
				'</i>'+
				'<p>'+opts.flieName+'</p>'+
				'<div class="upload-hover">'+
					'<div class="shadow">'+
						'<a href="'+url+'" target="_blank"><i class="icon-eye-open"></i></a>'+
						
						'<a href="javascript:;" onclick="delUploadImg('+"'"+url+"'"+','+callback+')"><i class="xafont xafont-recovery"></i></a>'+
					'</div>'+
				'</div>'+
			'</div>';
		}
		//'<a href="javascript:;" onclick="showViewer(this)"><i class="icon-eye-open"></i></a>'+
	}else{
		var html = '<div class="upload-box">'+
			'<i class="icon icon-file-'+iconClass+' fileTypeIcon"></i>'+
			'<p>'+opts.flieName+'</p>'+
			
			'<div class="upload-hover">'+
				'<div class="shadow">'+
					'<a href="https://view.officeapps.live.com/op/view.aspx?src='+url+'" target="_blank"><i class="icon-eye-open"></i></a>'+
					'<a href="'+url+'"><i class="icon-download-alt"></i></a>'+
				'</div>'+
			'</div>'+
		'</div>';
		if(vORe === 'edit'){
			html = '<div class="upload-box" data-url="'+url+'">'+
				'<i class="icon icon-file-'+iconClass+' fileTypeIcon"></i>'+
				'<p>'+opts.flieName+'</p>'+
				'<input type="hidden" name="'+Name+'[]" value="'+url+'"/>'+
				'<div class="upload-hover">'+
					'<div class="shadow">'+
						'<a href="https://view.officeapps.live.com/op/view.aspx?src='+url+'" target="_blank"><i class="icon-eye-open"></i></a>'+
						'<a href="javascript:;" onclick="delUploadImg('+"'"+url+"'"+','+callback+')"><i class="xafont xafont-recovery"></i></a>'+
					'</div>'+
				'</div>'+
			'</div>';
		}
	}
	return html;
}
$.fn.updateViewer = function (){
	var imgArr = $(this).find('img');
	var imgHtml = '';
	imgArr.each(function(index,el){
		var _src = $(el).attr('src');
		imgHtml += '<img src="'+_src+'">';
	})
	$('#viewer-js').html(imgHtml);
}
/*图片查看器  配合 ↑ 使用*/
function showViewer(event){
	var event= window.event || arguments.callee.caller.arguments[0];
	var target = event.target || window.event.target;
	var viewer = new Viewer(document.getElementById('viewer-js'), {
	    url: 'data-original',fullscreen:false,viewed: function() {
	        $('.viewer-container').click(function(event){
	            var target = event.target;
	            if(target.className == 'viewer-container viewer-fixed viewer-fade viewer-transition viewer-in')viewer.hide();
	        })
	    }
	});
	var index = $(target).parents('.upload-box').index();
	$('#viewer-js img').eq(index).trigger('click');
}
//at
function at(cla, people){

  	$(cla).focus(function(){

		var that = this;
		$(that).find('.placeholder').remove()
		$(that).find('br').remove()
	})
	$(cla).blur(function(){
		var that = this;
		$(that).find('.placeholder').remove()
		$(that).find('br').remove()
		if($(that).text().replace(/(^s*)|(s*$)/g, "").length == 0){
			$(that).html('');
			$(that).append('<span class="placeholder">请输入内容</span>')
		}	
	})


  var at_config = {
      at: "@",
      data: people,  //  
      insertTpl: '<span  class="at"><input type="hidden" name="at[]" value="${id}"> @${name}</span>',
      displayTpl: "<li > ${name} </li>",
      limit: 200
  }
  $(cla).atwho(at_config)
}  


/*日期格式化函数*/
Date.prototype.format = function(fmt) { 
    var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt; 
}  
/*计算多少天后的时间*/      
function getDaysDate(n,str){  
	str = str? str: 'yyyy-MM-dd hh:mm';
    var date =  new Date(), timestamp, newDate;  	  
    timestamp = date.getTime();  	  
    // 获取对应日期  
    newDate = new Date(timestamp + n * 24 * 3600 * 1000).format(str);  	  
    return newDate;
} 


// 调用iframe弹窗
function showIframeModal(option){
	option = option ? option: {};
	option.url = option.url ? option.url :'';
	option.width = option.width ? option.width :'90%';
	option.height = option.height ? option.height :'90%';
	option.height = option.height ? option.height :'90%';
	option.name = option.name ? option.name: 'iframeModal';
	$.zui.modalTrigger.show({
		name:  option.name,
		iframe:option.url,
		width: option.width,
		height:option.height,
		showHeader:true
	});
}
	
