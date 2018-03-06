
/*
* SlideScreen
* 名称：监测屏幕滑动
* 语法：new SlideScreen();
* 参数：无
* 返回值：Object 屏幕滑动事件对象
* */
function SlideScreen() {
    var _this = this;
    this.isDrag = false;
    this.dis = {x:0,y:0}
    EventEmmit.call(this,['start','moving','end'])
    document.addEventListener('touchstart',function (e) {
        // 仅能单指拖动
        if (e.touches.length>1) {
            return;
        }
        _this.start(e);
    })
    document.addEventListener('mousedown',function (e) {
        _this.start(e);
    })
    document.addEventListener('touchmove',function (e) {
        // 仅能单指拖动
        if (e.touches.length>1) {
            return;
        }
        _this.moving(e);
    })
    document.addEventListener('mousemove',function (e) {
        _this.moving(e);
    })
    document.addEventListener('touchend',function (e) {
        // 仅能单指拖动
        if (e.touches.length>1) {
            return;
        }
        _this.end(e);
    })
    document.addEventListener('mouseup',function (e) {
        _this.end(e);
    })
    SlideScreen.prototype.start = function (e) {
        this.isDrag = true;
        let temp = this.fixEventObj(e);
        this.startPoint = {x:temp.x,y:temp.y}
        this.dis = {
            'x':0,
            'y':0
        }
        this.trigger('start',this);
    }
    SlideScreen.prototype.moving = function (e) {
        if (this.isDrag === false) {
            return;
        }
        let temp = this.fixEventObj(e);
        this.nowPoint = {
            'x':temp.x,
            'y':temp.y
        }
        this.dis = {
            'x':this.nowPoint.x - this.startPoint.x,
            'y':this.nowPoint.y  - this.startPoint.y
        }
        this.trigger('moving',this);
    }
    SlideScreen.prototype.end = function (e) {
        this.isDrag = false;
        this.trigger('end',this);
    }
    SlideScreen.prototype.fixEventObj = function (e) {
        let value = {x:0,y:0};
        if (e.targetTouches) {
            value.x = e.targetTouches[0].clientX;
            value.y = e.targetTouches[0].clientY;
        }else{
            value.x = e.clientX;
            value.y = e.clientY;
        }
        return value;
    }
    Object.assign(SlideScreen.prototype,EventEmmit.prototype)
}
/*
* EventEmmit
* 名称：事件继承
* 语法：EventEmmit.call (this,events)
* 参数：this 构造函数执行环境的this，events 定义事件的名称格式为Array;
* 返回值：无；
* */
function EventEmmit (events){
    events.forEach(function(item){
        this['on' + item] = {};
    },this)
    // 渲染事件函数
    EventEmmit.prototype.trigger = function (eventName,e) {
        var fns = this.getEventFns (eventName);
        fns.forEach(function(item){
            item.call(this,e);
        },this)
    }
    // 添加事件函数
    EventEmmit.prototype.addEvent = function (eventName,fn) {
        if (typeof(fn) === 'function') {
            this.getNowEventPack(eventName,true,fn);
        }
    }
    // 移除事件函数
    EventEmmit.prototype.removeEvent = function(eventName,fn){
        if (typeof(fn) === 'function') {
            this.getNowEventPack(eventName,false,fn);
        }
    }
    // 找到对应的事件函数包
    EventEmmit.prototype.getNowEventPack = function (eventName, isAddEvent, fn) {
        var attrs = eventName.split('.');
        attrs[0] = 'on' + attrs[0];
        var nowOpera = this;
        var index = 0;
        function fillAttr(index){
            if (index < attrs.length) {
                var attr = attrs.slice(index,index+1).toString()
                if (!nowOpera[attr]) {
                    // 创建eventPacks
                    nowOpera[attr] = {};
                    nowOpera[attr].callBack = [];
                }
                // 找到当前eventPack
                nowOpera = nowOpera[attr];
                fillAttr (index+1);
            }else{
                // 当前eventPack下是否有函数数组；
                if (nowOpera.callBack) {
                }else{
                    nowOpera.callBack = [];
                }
                // 判断删除还是创建事件函数
                if (isAddEvent) {
                    nowOpera.callBack.push(fn);
                }else{
                    // 删除的时候，如果传了有名函数就定下删除；
                    var fnName = fn.name;
                    if (fnName) {
                        nowOpera.callBack = nowOpera.callBack.filter(function(fn){
                            return fn.name != fnName;
                        })
                    }else{
                        nowOpera.callBack.length = 0;
                    }
                }

            }
        }
        fillAttr (index);
    }
    // 找到符合条件的事件函数集合
    EventEmmit.prototype.getEventFns = function(eventName){
        var fns = [];
        var nowEventPack = this['on' + eventName];
        function circleSearch (nowEventPack){
            for(attr in nowEventPack){
                var now = nowEventPack[attr]
                if (Array.isArray(now)) {
                    fns = fns.concat(now);
                }else if (typeof(now)&&!Array.isArray(now)) {
                    circleSearch (now)
                }
            }
        }
        circleSearch(nowEventPack);
        return fns;
    }
}
/*
* Flip
* 名称：新建翻页管理
* 语法：new Flip(elements,vH);
* 参数：elements 页面元素 vH 视口高度
* 返回值：Object 页面管理对象；
* */
function Flip(elements,vH){
    var _this = this;
    this.queue = [...elements];
    this.index = 0;
    EventEmmit.call(this,['flipped'])
    Flip.prototype.listenNowPage = function(){
        this.queue.forEach((ele,index)=>{
            ele.addEventListener('touchstart',e=>{
                this.index = index;
                this.nowPage = ele;
            })
            ele.addEventListener('mousedown',e=>{
                this.index = index;
                this.nowPage = ele;
            })
        },this)
    }
    Flip.prototype.toFlipNext = function (dis) {
        // 下一页
        if (Math.abs(dis)/vH < 0.1) {
            // 距离不够
        }else{
            this.nowPage.style.transform = 'translateY('+(-vH)+'px)';
            this.queue[this.index+1].style.transform = 'scale(1)';
            this.index++;
            this.trigger('flipped',this);
        }
    }
    Flip.prototype.toFlipPre = function (dis){
        // 上一页
        if (Math.abs(dis)/vH < 0.1) {
            // 距离不够;
        }else{
            this.nowPage.style.transform = ' scale(.9)';
            this.queue[this.index - 1].style.transform = 'translateY(0)';
            this.index--;
            this.trigger('flipped',this);
        }
    }
    Object.assign(Flip.prototype,EventEmmit.prototype)
}
// 绘制svg

function Svg(svgEle) {
    this.svgEle = svgEle;
    Svg.prototype.init = function (config) {
        // svg元素样式
        let svgW = config.width;
        let svgH = config.height;
        let boxSize = {
            'width':svgEle.parentNode.offsetWidth,
            'height':svgEle.parentNode.offsetHeight
        }
        let scale = Math.min(boxSize.width/svgW,boxSize.height/svgH);
        svgEle.style.transform = 'scale('+scale+')'
        svgEle.style.width = svgW + 'px';
        svgEle.style.height = svgH + 'px';
        svgEle.style.background = config.bg;
    };
    Svg.prototype.path = function(pathData,className='path') {
        let path = document.createElementNS("http://www.w3.org/2000/svg","path")
            path.setAttribute('d',pathData)
            path.setAttribute('class',className);
        return path;
    };
    Svg.prototype.text = function (textData,className = 'text') {
        let text = document.createElementNS("http://www.w3.org/2000/svg","text");
            text.innerHTML = textData.value;
            text.setAttribute('x',textData.x)
            text.setAttribute('y',textData.y)
            text.setAttribute('class',className)
        return text;
    };
    Svg.prototype.line = function (lineData,className = 'line') {
        return this.path(lineData,className);
    }
    Svg.prototype.rect = function (rectData,className = 'rect') {
        let rect = document.createElementNS("http://www.w3.org/2000/svg","rect")
        for(var s in rectData){
            rect.setAttribute(s,rectData[s])
        }
        rect.setAttribute('class',className)
        return rect;
    }
    Svg.prototype.circle = function (circleData,className='circle'){
        let circle = document.createElementNS("http://www.w3.org/2000/svg","circle")
        for(var s in circleData){
            circle.setAttribute(s,circleData[s])
        }
        circle.setAttribute('class',className)
        return circle;
    }
    Svg.prototype.nameSpace = function(callBack = function(){}){
        callBack();
    }
}