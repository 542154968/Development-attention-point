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
		var content = $('#content');
		xaMenu.find('.shrink').click(function(){
			xaMenu.find('i').removeClass('rotate90');
			if(MENU_HIDE_NUM){
				xaMenu.find('li').find('ul').stop(true).animate({
					height:'hide'
				},300,'linear');
				xaMenu.stop(true).animate({
					'width':'48px'
				},300,'linear');
				xaMenu.find('li.active i').first().addClass('active');
				if(xaMenuThree.length){
					content.stop(true).animate({
						'padding-left':'178px'
					},300,'linear');
					xaMenuThree.stop(true).animate({
						left:'48px'
					},300,'linear');
				}
				else if(timeAxis.length){
					content.stop(true).animate({
						'padding-left':'268px'
					},300,'linear');
					xaMenuThree.stop(true).animate({
						left:'48px'
					},300,'linear');
					timeAxis.stop(true).animate({
					 	left:'48px'
					})
				}else{
					content.stop(true).animate({
						'padding-left':'48px'
					},300,'linear');
				}

				MENU_HIDE_NUM = 0;	
			}else{
				xaMenu.find('li.active i').first().removeClass('active');
				xaMenu.find('li.active i').toggleClass('rotate90');
				xaMenu.stop(true).animate({
					'width':'170px'
				},300,'linear');
				xaMenu.find('li.active>ul').animate({
					height:'toggle'
				},300,'linear');
				if(xaMenuThree.length){
					content.stop(true).animate({
						'padding-left':'300px'
					},300)
					xaMenuThree.stop(true).animate({
						left:'170px'
					}, 300);	
				}
				else if(timeAxis.length){
					content.stop(true).animate({
						'padding-left':'390px'
					},300,'linear');
					timeAxis.stop(true).animate({
						left:'170px'
					},300,'linear');
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
				},300,'linear');
				xaMenu.find('li.active i').first().removeClass('active');
				if(xaMenuThree.length){
					content.stop(true).animate({
						'padding-left':'300px'
					},300,'linear')
					xaMenuThree.stop(true).animate({
						left:'170px'
					},300,'linear');
				}else{
					content.stop(true).animate({
						'padding-left':'170px'
					},300,'linear')
				}
				MENU_HIDE_NUM = 1;
			}
			that.parent('li').siblings('li').find('i').removeClass('rotate90');
			that.parent('li').siblings('li').find('ul').animate({
				height:'hide'
			},300)
			that.find('i').toggleClass('rotate90');
			that.next().stop().animate({
				height:'toggle'
			},300);
		})
	},
	// 导航下拉菜单
	dropMenu:function(){
		var avatar = $('.xa-navbar .avatar');
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
			var $that = $(this);
			$that.addClass('hover');
			$that.find('.icon-angle-down').addClass('rotate');
			hoverTimers = setTimeout(function(){
				$that.find('.dropdown-menu').stop(true,true).slideDown(200);
			},100)	
		});
		avatar.on('mouseleave',function(event) {
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
				if(!$(target).is('.table *,.modal *,.modal,.layui-layer-shade,.layui-layer-btn,.layui-layer-btn0,.layui-layer-ico,.atwho-container *,.atwho *')){
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
	            sProcessing: "加载中...",
	            sLengthMenu: "显示 _MENU_ 项结果",
	            sZeroRecords: "没有匹配结果",
	            sInfo: "共 _TOTAL_ 条记录",
	            sInfoEmpty: "显示第 0 至 0 项结果，共 0 项",
	            sInfoFiltered: "(由 _MAX_ 项结果过滤)",
	            sInfoPostFix: "",
	            sSearch: "搜索:",
	            sUrl: "",
	            sEmptyTable: "表中数据为空",
	            sLoadingRecords: "加载中...",
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

		var DATATABLE = $(elem).DataTable({
	        serverSide: true,
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
	        language: {
	            sProcessing: "加载中...",
	            sLengthMenu: "显示 _MENU_ 项结果",
	            sZeroRecords: "没有匹配结果",
	            sInfo: "共 _TOTAL_ 条记录",
	            sInfoEmpty: "显示第 0 至 0 项结果，共 0 项",
	            sInfoFiltered: "(由 _MAX_ 项结果过滤)",
	            sInfoPostFix: "",
	            sSearch: "搜索:",
	            sUrl: "",
	            sEmptyTable: "表中数据为空",
	            sLoadingRecords: "加载中...",
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
	tableGetAjax:function(event,method,ajaxUrl,data,callback,$arg){
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
        		callback(result,$arg);
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
		if(!type){ type = 2; }
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
	showConfirmModal:function(url,id,content,type,data,fn){
		// type为2时 ajax提交
		var modal = new $.zui.ModalTrigger({
			remote:'http://statics.xafc.com/work/v1/js/confirm.html',
			backdrop:'static',
			keyboard:false
		});
		modal.show(
			{
				shown: function() {
					var dom = $('#ConfirmModal');
					dom.find('.form').attr('action',url);
				    dom.find('.id').val(id);
				    dom.find('.content').html(content);
				    
				    if( type == 2 ){
				    	var btn = dom.find('[type=submit]');
				    	btn.prop('type','button');
				    	btn.off('click').on('click',function(){
				    		if(!data || !data instanceof String){
				    			return false;
				    		}
				    		$.get(url+'?'+data,function(result){
				    			if( fn ){ fn(result) }
				    			new $.zui.Messager('操作成功', {
							        icon: 'ok-sign',
							        type: 'success'
							    }).show();
				    			modal.close();
				    		})
				    	})
				    }
				}
			}
		);
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
function getFileHtml(url,vORe,callback,Name){
	if(!url){ return false; }
	var type = url.slice(url.lastIndexOf('.')+1).toLowerCase();
	var flieName = url.slice(url.lastIndexOf('/')+1);
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
			'<p>'+flieName+'</p>'+
			
			'<div class="upload-hover">'+
				'<div class="shadow">'+
					'<a href="'+url+'" target="_blank"><i class="icon-eye-open"></i></a>'+
				'</div>'+
			'</div>'+
		'</div>';
		if(vORe === 'edit'){
			html = '<div class="upload-box" data-url="'+url+'">'+
				'<i class="fileTypeIcon">'+
					'<img src="'+url+'" width="100%" height="100%">'+
					'<input type="hidden" name="'+Name+'[]" value="'+url+'"/>'+
				'</i>'+
				'<p>'+flieName+'</p>'+
				'<div class="upload-hover">'+
					'<div class="shadow">'+
						'<a href="'+url+'" target="_blank"><i class="icon-eye-open"></i></a>'+
						'<a href="javascript:;" onclick="delUploadImg('+"'"+url+"'"+','+callback+')"><i class="xafont xafont-recovery"></i></a>'+
					'</div>'+
				'</div>'+
			'</div>';
		}
	}else{
		var html = '<div class="upload-box">'+
			'<i class="icon icon-file-'+iconClass+' fileTypeIcon"></i>'+
			'<p>'+flieName+'</p>'+
			
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
				'<p>'+flieName+'</p>'+
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
		// console.log($(that).html().length)
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



	
