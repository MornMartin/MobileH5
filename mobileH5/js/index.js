(function(){
	/*
	* 清除浏览器默认行为
	* */
	console.log('by Martin')
	var wrap = document.getElementById('wrap');
	wrap.addEventListener('touchstart',function (e) {
	    e.preventDefault();
	})
	// 获取屏幕尺寸
	var vH = window.innerHeight||document.documentElement.clientHeight||document.body.offsetHeight;
	var vW = window.innerWidth||document.documentElement.clientWidth||document.body.offsetWidth;
	// 设置根字体大小;
	var doc = document.documentElement;
		doc.style.fontSize = vW/7.5 + 'px';
	// 缩放内容页；
	var box = document.querySelectorAll('.scale-box');
	var scale = vH/(vW/7.5 * 13.34);
		box.forEach(e=>{
			e.style.transform = 'scale('+scale+')';
		})
	// 创建页面管理对象
	var flip = new Flip(document.querySelectorAll('.page'),vH);
		// 初始化页面
		flip.queue.forEach((item,index)=>{
			item.style.zIndex = flip.queue.length - index;
		})
		flip.queue[0].style.transform = 'scale(1)';
		// 监听当前第几页；
		flip.listenNowPage();
		// 当翻页完成时
		flip.addEvent('flipped',function(e){
			this.nowPage = this.queue[this.index]
			this.queue.forEach(e=>{
				e.className = 'page';
			})
			this.nowPage.className += ' nowPage';
			// 第三页转场的特殊处理
			if (this.index === 2) {
				let path = this.nowPage.querySelectorAll('.path')
					path.forEach((e,index)=>{
						e.style.transition = '.3s linear '+ index*0.07 +'s';
						e.style.opacity = 1;
					})
				let text = this.nowPage.querySelectorAll('.numb')
					text.forEach(e=>{
						let target = parseInt(e.dataset.target)
						let count = 0;
						let timer = setInterval(function(){
							if (count > target) {
								clearInterval(timer);
							}else{
								e.innerHTML = (count++) + '%';
							}
						},70)
					})
			}
			let arr = document.querySelector('.arrow');
			if (this.index === this.queue.length-1) {
				arr.style.display = 'none'
			}else{
				arr.style.display = 'block'
			}
			// 第四页转场的特殊处理
			if (this.index === 3) {
				let nubEle = this.nowPage.querySelectorAll('.t-t-cont mark')
				let target = [1,6,3,5,3,5]
				nubEle.forEach(e=>{
					e.innerHTML = 0;
				})
				function toChange(index){
					let count = 0;
					if (index >= 0) {
						let timer = setInterval(function(){
							if (count >= target[index]) {
								clearInterval(timer)
								toChange(--index);
							}else{
								nubEle[index].innerHTML = ++count;
							}
						},50)
					}
				}
				toChange(nubEle.length-1)
			}
		})
	// 创建屏幕滑动监测对象
	var slideScreen = new SlideScreen();
		// 触摸时
		slideScreen.addEvent('start',event=>{
			// 检测滚动与翻页
		})
		// 滑动手指时
		slideScreen.addEvent('moving',e=>{
		})
		// 抬起手指时
		slideScreen.addEvent('end',e=>{
			var dis = e.dis.y;
			if (dis < 0 && flip.index !== flip.queue.length-1) {
				// 下页
				flip.toFlipNext(dis)
				return;
			}
			if (dis > 0 && flip.index !== 0) {
				// 上页
				flip.toFlipPre(dis)
			}
		});


	// 生成中国地图
	var chinaMap  = new Svg(document.querySelector('#map'));
		chinaMap.init(chinaMapConfig)
		chinaMap.nameSpace(function(){
			for(var s in chinaMapConfig.shapes){
				let path = chinaMap.path(chinaMapConfig.shapes[s],'map-shape '+s)
				chinaMap.svgEle.appendChild(path)
			}
			chinaMapConfig.points.forEach(e=>{
				let point = chinaMap.circle(e,'map-point')
					point.style.animation = 'mapPoints 3s '+parseInt(Math.random()*3)+'s linear infinite'
				chinaMap.svgEle.appendChild(point);
			})
		})
	// 客户标签
	var pie = new Svg(document.querySelector('#pie'));
		pie.init(pieConfig)
		// 生成扇形图
		pieConfig.path.forEach((e,index)=>{
			let path = pie.path(e)
				path.style.fill = pieConfig.colors[index]
			pie.svgEle.appendChild(path)
		})
		// 生成线条
		pieConfig.line.forEach((e,index)=>{
			let line = pie.line(e)
				line.style.stroke = pieConfig.colors[index];
			pie.svgEle.appendChild(line);
		})
		// 百分比数字
		pieConfig.text.forEach(e=>{
			let text = pie.text(e,'numb');
			let inner = parseInt(text.innerHTML);
				text.innerHTML =  '0%';
				text.dataset.target = e.value;
				text.style.fontSize = '18px';
				pie.svgEle.appendChild(text);
		})
		// 补圈和标题
		pie.nameSpace(function(){
			let circle = pie.circle(pieConfig.circle)
				circle.style.fill = '#1e2f45';
			let title = pie.text(pieConfig.title)
				title.setAttribute('fontSize',18)
				title.style.fontSize = '18px'
			pie.svgEle.appendChild(circle)
			pie.svgEle.appendChild(title)
			// 生成对照
			var pieTagsCont = document.querySelector('.c-tag-cont');
			pieConfig.tags.forEach((e,index)=>{
				var div = document.createElement('div');
					div.className = 'c-tag-item clearFix'
					var icoin = document.createElement('span');
						icoin.className = 'icoin';
						icoin.style.background = pieConfig.colors[index]
					var text = document.createElement('span');
						text.innerHTML = e;
					div.appendChild(icoin)
					div.appendChild(text)
				pieTagsCont.appendChild(div)
			})
		})
	// 年龄统计
	var trapeze = new Svg(document.getElementById('trapeze'));
		trapeze.init(trapezeConfig)
		trapezeConfig.path.forEach((e,index)=>{
			let path = trapeze.path(e)
				path.style.fill = trapezeConfig.colors[index];
			trapeze.svgEle.appendChild(path)
		})
		trapezeConfig.text.forEach(e=>{
			let text = trapeze.text(e)
				text.style.fontSize = 18;
				text.style.fill = '#fff';
			trapeze.svgEle.appendChild(text)
		})
		trapeze.nameSpace(function(){
			var tagBox = document.querySelector('.t-a-tags');
			trapezeConfig.text.forEach((e,index)=>{
				var tag = document.createElement('div');
					tag.className = 't-a-tag';
					var icoin = document.createElement('span');
						icoin.className = 'icoin';
						icoin.style.background = trapezeConfig.colors[index]
					var text = document.createElement('span');
						text.innerHTML = e.value;
					tag.appendChild(icoin)
					tag.appendChild(text)
				tagBox.appendChild(tag)
			})
		})
	// 交易统计
	var cash = new Svg(document.getElementById('cash'))
		cash.init(cashConfig)
		cash.nameSpace(function () {
			// 创建标线
			for (var i = 0; i < 7; i++) {
				var linePos = 'M 71 '+ (23 + i*28) +' L 688 ' + (23 + i*28)
				let line = cash.line(linePos,'line')
					line.style.stroke = '#385b77';
					line.style.strokeWidth = 1;
				cash.svgEle.appendChild(line)
				var textConfig = {
					y:(23 + i*28),
					x:45,
					value:(6- i)*100
				}
				let text = cash.text(textConfig)
					text.style.fontSize = 12;
					text.style.fill = '#ddd';
				cash.svgEle.appendChild(text)
			}
		})
		cashConfig.rect.forEach((e,index)=>{
			let rect = cash.rect(e);
				rect.style.fill = cashConfig.colors[index]
			cash.svgEle.appendChild(rect)
		});
	// 创建浮动文字
	var box = document.querySelector('.c-from .content');
	var data = custormersConfig;
	data.pos.forEach((e,index)=>{
		let text = floatText(e,data.menber[index])
			text.style.zIndex = getFontZindex(e.font);
			text.className = 'float-text';
			text.style.fontSize = getFontSize(e.font);
			text.style.color = getFontColor(e.font);
			text.style.animation = 'floatText 8s '+ (Math.random()*2) +'s linear infinite';
		box.appendChild(text)
	})
	function getFontSize(fontMark){
		switch (fontMark){
			case 'xl':
				return '.52rem';
			case 'l':
				return '.46rem';
			case 'm':
				return '.38rem';
			case 's':
				return '.32rem';
		}
	}
	function getFontZindex(fontMark){
		switch (fontMark){
			case 'xl':
				return '9';
			case 'l':
				return '8';
			case 'm':
				return '7';
			case 's':
				return '6';
		}
	}
	function getFontColor(fontMark){
		switch (fontMark){
			case 'xl':
				return '#ffed22';
			case 'l':
				return '#d60d3e';
			case 'm':
				return '#0daed5';
			case 's':
				return '#b237c6';
		}
	}
	function floatText(posData,text){
		var span = document.createElement('span');
			span.style.left = posData.x/100 + 'rem';
			span.style.top = posData.y/100 + 'rem';
			span.innerHTML = text;
		return span;
	}
	window.addEventListener('load',function(){
		let wrap = document.getElementById('wrap');
		let playBtn = document.getElementById('audio');
		let audio = document.createElement('audio');
			audio.src = 'audio/audio.mp3';
			audio.setAttribute('autobuffer',true);
			audio.setAttribute('loop','loop')
			audio.style.display = 'none';
			// 自动播放
			audio.addEventListener('canplay',function(){
				audio.play();
			});
            document.addEventListener('touchstart',function(){
            	audio.play();
            },{once:true})
			document.addEventListener("WeixinJSBridgeReady", function () {
                audio.play();
            }, false);
            // 播放状态映射
			audio.addEventListener('play',function(){
				playBtn.className = 'audio play'
			})
			audio.addEventListener('pause',function(){
				playBtn.className = 'audio paused'
			})
			// 播放控制
			playBtn.addEventListener('touchstart',play)
			playBtn.addEventListener('mousedown',play)
			wrap.appendChild(audio)
			function play(){
				if (audio.paused) {
					audio.play()
				}else{
					audio.pause()
				}
			}
	})
})();
