document.domain = document.domain.split('.').slice(-2).join('.');
//灞曠ずiframe
function openIframe(type,elem,path,mark,num,fn){
    // type         pic鍥剧墖/file 鏂囦欢锛屽瓧绗︿覆
    // elem         瑙﹀彂寮圭獥鐨勬寜閽甦om锛屽瓧绗︿覆
    // path         涓婁紶鐨勬枃浠跺す鐩綍 ['www','news','house','work','zhuanti','images']
    // mark         鏄惁鏄剧ず姘村嵃 0涓嶆樉绀� 1鏄剧ず
    // num          涓婁紶涓婇檺锛屾暟瀛�
    // fn           鑷畾涔夌殑涓婁紶瀹屾垚鍚庣殑鍥炶皟鍑芥暟锛岄粯璁unDefine锛屽彲涓嶅～锛屼富瑕佽В鍐抽〉闈㈠璋冪敤寮曞彂鐨勫啿绐�;
    if(type === 'pic'){
        title = '鍥剧墖'
    }else if(type === 'file'){
        title = '鏂囦欢'
    }else{
        console.error('鍙傛暟:绫诲瀷 閿欒');
        return false;
    }
    if(!elem){
        console.error('鍙傛暟:elem 閿欒');
        return false;
    }
    var default_path = ['www','news','house','work','zhuanti','images'];
    var i = 1;
    $.each(default_path,function(k,v){
    	if(default_path.indexOf(path) === -1){
    		i = 0;
    	}
    })
    if(!i){ 
        console.error('鍙傛暟:涓婁紶鐨勬枃浠跺す 閿欒');
        return false; 
    }
    if(!mark){ mark = 0};


    $(elem).off('click').on('click' , function(e){
        if(num == 0){ 
            layer.msg('瓒呭嚭瑙勫畾涓婁紶鏁伴噺');
            return false; 
        }
        if(!num){ num = 1 };
        layer.open({
            type: 2,
            title:  title+'涓婁紶',
            area: ['700px', '500px'],
            offset: '50px', 
            content: 'http://upload.xafc.com/upload.html#'+type+'#'+num+'#'+path+'#'+mark,
            btn:['鎻愪氦'],
            yes:function(index, layerdom) {
                $("#layui-layer-iframe"+index)[0].contentWindow.manualUpload(function(a,b,c){
                    
                    var returnValue = layer.getChildFrame('body', index);
                    alltxt = returnValue.find('.imgurl'); 
                    if(alltxt.eq(0).val()) {
                        if(fn){
                            fn(alltxt, e.target, type);
                        }else{
                            funDefine(alltxt, e.target, type);
                        }
                    } else {
                        layer.msg('璇蜂笂浼�'+title);
                    }
                    layer.close(index); 
                });
            }
        });
    });
}  
//鍒犻櫎鎿嶄綔
function delUploadImg(path,callback) {
    var isTF = confirm('鏄惁鍒犻櫎锛�');
    if(isTF){
        var data = {picimg:path,domain:'http://vip.xafc.com/'}
        $.ajax({
            type:"get",
            url:"http://upload.xafc.com/server/delPic.php",
            dataType:"jsonp",
            data: data, 
            jsonp:"callback",
            jsonpCallback:"success_jsonpCallback",
            success:function(json){
                var deleDom = $('[data-url="'+path+'"]');
                if(callback) callback(json,path,deleDom);     
            } 
        })
    }
}   