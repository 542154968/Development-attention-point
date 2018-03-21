
$(function(){
	validator('form[name="indexAdd"], form[name="editAdd"]');
//{
//			"program":"尚泽大都会",
//			"status": "代理"
//			"city":"合肥",
//			"people":"张三",
//			"time":"2016-06-06 15:22:22",
//			"id": "1"
//		},
		
		// 配置项
		var	columns = [
			
			{ title:'项目名称', data:"program"},
			{ title:'类型', data:"status"},
			{ title:'城市', data:"city"},
			{ title: '项目负责人', data: 'programPeople'},
			{ title:'案场负责人', data:"people"},
			{ title:'创建时间', data:"time" },
			{ title:'操作', data:"id", orderable: false,
				render:function(data) {
					return '<button class="btn btn-table" type="button"  onclick="indexShowCase(this)" >案场管理</button>' +
							'<button class="btn btn-table" type="button"  onclick="editShowCase(this)" >编辑</button>'
				}
			}
		];
		
		//datatable的ajax请求
		var ajaxData = {
			url: require('./xy.json'),
			type: 'get',
			
		}
		// 初始化datatable
		var dataTable = xa.dataTables('#main_table', ajaxData, columns, updateData, {ordering: false})
		
		// xa.tableGetAjax(0,'get','http://up-test.xafc.com:9008/admn/api/get_leaveoffview/id/','id=0',updateDom);
		// 请求的回调
		function updateData(){}
	
		//级联选择初始化
		xa.chosenInit('.chosenAgain');
			
		$(window).resize(function(){
			dataTable.draw(false)
		})
			
		
		
		
	

    // 搜索类型
    dtColumnSearch('select[name="selectType"]', 'change', 1 )
    // 搜索城市
    dtColumnSearch('select[name="selectCity"]', 'change', 2 )
    // 所属负责人
    dtColumnSearch('select[name="selectCaser"]', 'change', 3)
    
    // select框的事件
    function dtColumnSearch(elem,eventType,column,valElem){	
		$(elem).on(eventType,function(){
			var value = $(this).val();
			if(valElem){
				value = $(valElem).val();
			}
			
	        dataTable.columns(column).search(value).draw();
	    });
	};
    
    
  		window.indexShowCase = function (that){
		    window.open('../../test/index.html')
  		}
  		
    	
//  	$('button.agree').click(function(){
//  		$('#indexAdd').modal()
//  	})
    	
    	
		window.indexAddModal = function (that){
    		$('#indexAdd').modal()
    	}
    	

    	
    	
    	window.editShowCase = function (that){
    		var data = dataTable.row($(that).parent()).data();
    		console.log(JSON.stringify(data))
    		var status = data.status;
    		if(status == '代理'){
    			status = 1;
    		}else if(status == '包销'){
    			status = 0;
    		}
    		$('#editAdd input[value = '+status+']').click();
    		$('#editAdd input[name = name').val(data.program);
    		$('#editAdd input[type = hidden').val(data.id)
    		$('#editAdd').modal()
    	}
    	
    	
    	$('#indexAdd ').on('input onprototypeChange', '.house-select', function(){
			$('.house-select').getAjaxOption({
				ajax_url:'电商小蜜蜂无数据模拟.json',
				successCallback: beerSuccess,
				clickCallback: beerClick,
				no_data_msg:'没有该项目',
			})
		})
		
		//
		function beerSuccess($this, response, opts){
			console.log(JSON.stringify(response))
			$this.parent().find(opts.container_class).show().find(opts.option_class).remove();
	        if(response.data == "no result"){
	            $('.no-data',opts.container_class).show();
	        }else{
	            $('.no-data',opts.container_class).hide();
	            var list = '';
	            for (var i=0; i<response.data.length; i++){
	                list += '<div class="'+opts.option_class.slice(1)+'" data-id="'+response.data[i].id+'">'+response.data[i].name+'</div>';                             
	            }
	            $(opts.container_class+'-box').append(list);
	        }
		}
		
		// 
		function beerClick($this,that,opts) {
	        var id = $(that).attr('data-id');
	        var name = $(that).text();
	        // alert(cur_id)
				$this.parent().parent().find(' .checkBeer').append(
					'<div class="item">'+
	        			'<div class="itemDetail" data-id="'+id+'">'+
	        				'<span>'+name +'</span> <strong>x</strong>'+
	        				'<input type="hidden" name="" id="" value="'+id+'" />'+
	        			'</div> '+
	        		'</div>'
				)
	        $this.val('').focus();
	        $this.parent().find(opts.container_class).hide();
	    }  

})


