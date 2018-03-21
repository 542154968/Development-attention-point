(function(){
    var $iframe = $('iframe'),
        $body = $('html');
    
    // 加载动画
    $iframe.load(function () {
        $(this).parents('.item').removeClass('active')
    })
    
    // 移入设置不滚动
    $iframe.on( 'mouseover', function(){
    $body.css('overflow-y', 'hidden');
    
    } ).on( 'mouseout', function(){
        $body.css('overflow-y', 'auto');
    } )

})();