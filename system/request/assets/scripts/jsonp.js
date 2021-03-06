/**
 * @fileOverview 请求处理JSON-P数据。
 * @author aki xuld
 */


using("System.Request.Base");

Ajax.JSONP = Ajax.Request.extend({

    onReadyStateChange: function(exception){
        var me = this, script = me.script;
        if (script && (exception || !script.readyState || /loaded|complete/.test(script.readyState))) {
        
            // 删除全部绑定的函数。
            script.onload = script.onreadystatechange = null;
            
            // 删除当前脚本。
            script.parentNode.removeChild(script);
            
            // 删除回调。
            delete window[me.callback];
            
            try {
            
                if (exception === true) {
                    me.onTimeout(script);
                    exception = 'Request Timeout';
                }
                
                me.onComplete(script);
                
            }
            finally {
            
                script = me.script = null;
                
            }
        }
    },
    
    jsonp: 'callback',
    
    send: function(data){
        var me = this, url = me.url, script, t;
        
        if (me.script && !me.delay(data)) 
            return me;
        
        me.onStart(data);
        
        // 改成字符串。
        if (typeof data !== 'string') {
            
            data = me.toParam(data);
        }
        
        url = me.combineUrl(url, data);
        
        // 处理 callback=?
        var callback = me.callback || ( 'jsonp' + System.id++ );
        
        if(url.indexOf(me.jsonp + '=?') >= 0){
        	url = url.replace(me.jsonp + '=?', me.jsonp + '=' + callback);
        } else {
      		url = me.combineUrl(url, me.jsonp + "=" + callback);
      	}
        
        script = me.script = document.createElement("script");
        t = document.getElementsByTagName("script")[0];
        
        window[callback] = function(){
        	delete window[callback];
            me.onSuccess.apply(me, arguments);
        };
        
        script.src = url;
        script.type = "text/javascript";
        
        t.parentNode.insertBefore(script, t);
        
        if (me.timeouts > 0) {
            setTimeout(function(){
                me.onReadyStateChange(true);
            }, me.timeouts);
        }
        
        script.onload = script.onreadystatechange = function(){
            me.onReadyStateChange();
        };
    },
    
    abort: function(){
        this.onAbort();
        this.onReadyStateChange('Aborted');
    }
});

Ajax.getJSONP = function(url, data, onsuccess, timeouts, ontimeout, oncomplete){
    assert.isString(url, "Ajax.getJSONP(url, data, onsuccess, timeouts, ontimeout): 参数{url} 必须是一个地址。如果需要提交至本页，使用 location.href。");
    var emptyFn = Function.empty;
    new Ajax.JSONP({
        url: url,
        onSuccess: onsuccess || emptyFn,
        timeouts: timeouts,
        onTimeout: ontimeout || emptyFn,
        onComplete: oncomplete || emptyFn
    }).send(data);
};

