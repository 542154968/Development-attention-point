//更换负责人
function changeLead(that){
	$('#lead').modal()
}

// 废弃的弹框
function lose (that){
	$('#lose').modal()
}

// 归档的弹框
function ok (that){
	$('#ok').modal()
}

//点击废弃的确定
$('.loseConfirm').click(function(){
	window.location.href = "/crm/customer/index?do=custdel&id="+custid;
})

//点击归档的确定
$('.okConfirm').click(function(){
	var data = {
		id: 1
	}
	$.get('data.json', data, function(){
		$('#ok').modal('hide')
	})
})	

// 更换负责人
$('.leadConfirm').click(function(){
	var lead =  $('#lead select[name="selectLead"]').val()
	if(lead == undefined || lead == '0'){
		alert('请选择负责人')
		return false
	}
	window.location.href = "/crm/customer/index?do=changeuser&user="+lead+"&id="+custid;
})