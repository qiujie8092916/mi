$(function(){
	mainBannerSwitcher()
	headNav()
	quickView("single")
	quickView("recommand")
	
	analysisData("hardware")
	analysisData("match", {"hot": "热门", "ear": "耳机音箱", "charge": "电源", "battery": "电池储存卡"})
	analysisData("parts", {"hot": "热门", "case": "保护套", "film": "贴膜", "others": "其他配件"})
	analysisData("circum", {"hot": "热门", "clothes": "服装", "rabbit": "米兔", "life": "生活周边", 			"luggage": "箱包"})
	
	hotproductData()
	contentData()
	
	effectResult()
})


/**********************/
var mainBannerSwitcher = function(){
	var banner = $(".banner").children("li")
	var ul_points = $(".points")
	var li_point = ul_points.children("li")
	var i_points = ul_points.find("a")
	var leftBtn = $(".leftBtn")
	var rightBtn = $(".rightBtn")
	
	var now = 0
	$(banner[now]).css("opacity", 1)
	
	for(var j = 0; j < banner.length; j++){
		if(j === now){
			$(banner[j]).css("opacity", 1)
		} else{
			$(banner[j]).css("opacity", 0)
		}
	}
	
	$.each(i_points, function(i, e){
		e.index = i
		$(e).on("click", function(){
			now = this.index
			for(var j = 0; j < banner.length; j++){
				if(j === now){
					$(banner[j]).css("opacity", 1)
					$(i_points[j]).addClass("active").removeClass("point")
				} else{
					$(banner[j]).css("opacity", 0)
					$(i_points[j]).addClass("point").removeClass("active")
				}
			}
		})
	})
	
	leftBtn.on("click", function(){
		now--
		if(now < 0){now = banner.length-1}
		$(i_points[now]).trigger("click")
	})
}


/***********************/
var quickView = function(className){
	ajax("data.json", function(data){
		var json_result = JSON.parse(data)
		var li_append = ""
		var resolution = 160
		if(className === "recommand"){resolution = 140}
		for(var i = 0; i < json_result[className].length; i++){
			li_append += '<li><a href class="thumb">\
											<img src="images/'+json_result[className][i]["images"]+'" width="'+resolution+'" height="'+resolution+'"/></a>\
											<a href class="name">'+json_result[className][i]["name"]+'</a>'
			if(json_result[className][i]["desc"]){
				li_append += '<p class="desc">'+json_result[className][i]["desc"]+'</p>'
			}
			li_append += 	 '<p class="price">'+json_result[className][i]["price"]+'元</p>'
			if(json_result[className][i]["rank"]){
				li_append += 	 '<p class="rank">'+json_result[className][i]["rank"]+'人评价</p>'
			}
			li_append += 	'</li>'
		}
		$("."+className+"-main ul").append(li_append)
		
		if(className === "single"){
			$("."+className+"-main ul").children("li").each(function(i){
				if(i == 0 || i == 5){
					$(this).css("border-top", "1px solid #ffac13")
				} else if(i == 1 || i == 6){
					$(this).css("border-top", "1px solid #83c44e")
				} else if(i == 2 || i == 7){
					$(this).css("border-top", "1px solid #2196f3")
				} else if(i == 3 || i == 8){
					$(this).css("border-top", "1px solid #e53935")
				} else if(i == 4 || i == 9){
					$(this).css("border-top", "1px solid #00c0a5")
				}
				$(this).css("background", "#fafafa")
			})
		} else{
			$("."+className+"-main ul").children("li").each(function(i){
				$(this).css("background", "#fff")
				$(this).hover(function(){
					$(this).addClass("item-up-active")
				}, function(){
					$(this).removeClass("item-up-active")
				})
			})
		}
		
		singleSwitcher(className, json_result[className].length)
	})
}


/**********************/
var singleSwitcher = function(className, totalNum){
	var ul = $("."+className+"-main ul")
	var leftBtn = $("."+className).find(".subtitle .left")
	var rightBtn = $("."+className).find(".subtitle .right")
	ul.css("left", 0)
	var stop = false
	
	leftBtn.on("click", function(){
		if(this.className.indexOf("disable") === -1 && !stop){
			stop = true
			var offsetLeft = tab(className, ul, "left")
			setAble(className, ul, offsetLeft)
			stop = false
		}
	})

	rightBtn.on("click", function(){
		if(this.className.indexOf("disable") === -1 && !stop){
			stop = true
			var offsetLeft = tab(className, ul, "right")
			setAble(className, ul, offsetLeft)
			stop = false
		}
	})
		
	var tab = function(className, ul, direction){	//滚动动画
		var cur = parseInt(ul.css("left"))
		var direct = 0
		if(direction === "right"){direct = -1} 
		else if(direction === "left"){direct = 1}
		
		var snippetWidth = $("."+className+"-main").width() + parseInt($(ul.children("li")[0]).css("marginRight"))
		var offsetLeft = cur + direct * snippetWidth
		offsetLeft = calculate(ul.width(), snippetWidth, direction, offsetLeft)
		ul.animate({"left": offsetLeft}, 400)
		return offsetLeft
	}
	
	var setAble = function(className, ul, offsetLeft){	//disable情况
		var leftBtn = $("."+className).find(".subtitle .left")
		var rightBtn = $("."+className).find(".subtitle .right")
		if(offsetLeft >= 0){
			leftBtn.addClass("disable")
			rightBtn.removeClass("disable")
		} else if(offsetLeft <= (-1) * (ul.width() - ($(ul.children("li")[0]).width() + parseInt($(ul.		 	children("li")[0]).css("marginRight")))*5)){
			rightBtn.addClass("disable")
			leftBtn.removeClass("disable")
		} else{
			leftBtn.removeClass("disable")
			rightBtn.removeClass("disable")
		}
	}
	
	setAble(className, ul, parseInt(ul.css("left")))

	if(className === "single"){
		var timer = setInterval(function(){
			clearInterval(timer)
			rightBtn.trigger("click")
			setTimeout(function(){
				leftBtn.trigger("click")
			}, 3000)
		}, 6000)
	}
}


/***********防止轮播点击过快 造成偏移量bug: 动画中连续点击视无效***********/
var calculate = function(totalWitdh, snippetWidth, direct, offsetLeft){
	var piece = totalWitdh / snippetWidth
	var array = new Array()
	for(var i = 0; i <= piece; i++){
		array[i] = -i * snippetWidth
	}
	for(var i = 0; i < array.length-1; i++){
		if(array[i] > offsetLeft && array[i+1] < offsetLeft){
			if(direct === "left"){
				offsetLeft = array[i+1]
			} else if(direct === "right"){
				offsetLeft = array[i]
			}
		}
	}
	return offsetLeft
}

/**********************/
var headNav = function(){
	$(".nav_ul").children(".nav_list").each(function(i, e){
		var li_display = $(".all-width")
		this.index = i
		
		$(this).hover(function(){
			var that = this
			ajax("data.json", function(data){
				var li_array = new Array()
				var json_result = JSON.parse(data)
				$.each(json_result.head_nav, function(ii, ee){
					li_array[ii] = ''
					li_array[ii] += '<div class="display-ol">\
															<div class="display">\
																<ul>'
					for(var j = 0; j < json_result.head_nav[ii]['img'].length; j++){
						if(j === 0){
							li_array[ii] += '<li class="first">'
						} else{
							li_array[ii] += '<li>'
						}
						li_array[ii] += 	'<img src="'+json_result.head_nav[ii]['img'][j]+'" width="160" height="110"/>\
															<p class="name"><a href>'+json_result.head_nav[ii]['name'][j]+'</a></p>'
						if(json_result.head_nav[ii]['price'][j]){
							li_array[ii] += '<p class="price">'+json_result.head_nav[ii]['price'][j]+'起</p>'
						}
						li_array[ii] +=	'</li>'
					}
					li_array[ii] += '</ul></div></div>'
				})
				
				li_display.empty()
				li_display.append(li_array[that.index])
				
				if(li_display.is(":empty")){
					if(li_display.css("display") !== "none")
						li_display.slideUp("fast")
				} else{
					li_display.slideDown("fast")
				}
			})
		}, function(){
			$(document).mouseover(function(e){
				if($(e.target).html() != $(".all-width").html() 
				&& $(e.target).parents(".all-width").length <= 0
				&& $(e.target).html() != $(".nav_ul").html()
				&& $(e.target).parents(".nav_ul").length <= 0){
					li_display.slideUp("fast")
				}
			})
		})
	})
	
	ajax("data.json", function(data){
		var json_result = JSON.parse(data)
		var li_append = ''
		
		for(var i = 0; i < json_result.keyword.name.length; i++){
			li_append += '<li>\
										<a href>'+json_result.keyword.name[i]+'\
										<span class="result">约有'+json_result.keyword.result[i]+'件</span></a>\
									</li>'
		}
		$(".search-form .keyword ul").append(li_append)
	})

	$(".search-form #search-input").focus(function(){
		$(".search-form").addClass("search-form-focus")
		$(".search-hot-word").animate({"opacity": 0}, 300, function(){
			$(".search-hot-word").hide()
		})
		$(".keyword").show()
	})
	
	$(".search-form #search-input").blur(function(){
		$(".search-form").removeClass("search-form-focus")
		$(".search-hot-word").show()
		$(".search-hot-word").animate({"opacity": 1}, 300)
		$(".keyword").hide()
	})
}


/**********************/
var analysisData = function(className, tabObject){
	ajax("data.json", function(data){
		var json_result = JSON.parse(data)
		var li_append = ''
		
		$.each(json_result[className], function(key, value){
			var more = ""
			if(tabObject){
				$.each(tabObject, function(tabKey, tabVal){ if(key === tabKey){more = tabVal} })
				li_append += '<ul class="right-main-ul hidden '+key+'">'
			} else{
				li_append += '<ul class="right-main-ul '+key+'">'
			}

			for(var i = 0; i < value.length; i++){
				if(value[i]["tiny"] == 1){
					li_append += '<li class="main-item-1 small-li">\
													<a href class="item-sm-p">\
														<img src="images/'+value[i]["images"]+'" width="80" height="80" />\
													</a>\
													<a href class="item-name">'+value[i]["name"]+'</a>\
													<p class="item-price">'+value[i]["price"]+'元</p>\
												</li>\
												<li class="main-item-1 small-li">\
													<a href class="more">浏览更多<small>'+more+'</small></a>\
													<a href class="view-more"><i class="iconfont">&#xe60c;</i></a>\
												</li>'
				} else{
					li_append += '<li class="main-item-2">\
													<a href class="item-lg-p">\
														<img src="images/'+value[i]["images"]+'" width="160" height="160" />\
													</a>\
													<a href class="item-name">'+value[i]["name"]+'</a>'
					if(value[i]["desc"]){
						li_append += '<p class="item-desc">'+value[i]["desc"]+'</p>'
					}								
													
					if(value[i]["old"]){
						li_append	+=	'<p class="item-price">'+value[i]["price"]+'元\
														<del>'+value[i]["old"]+'元</del>\
													</p>'
					} else{
						li_append	+=	'<p class="item-price">'+value[i]["price"]+'元</p>'
					}
					
					if(value[i]["comment"] === undefined && value[i]["desc"] === undefined){
						li_append	+=	'<p class="item-rank">'+value[i]["rank"]+'人评价</p>'
					} else if(value[i]["comment"] && value[i]["desc"] === undefined){
						li_append	+=	'<p class="item-rank">'+value[i]["rank"]+'人评价</p>\
													<div class="item-comment">\
														<a href>\
															<p class="item-comment-content">'+value[i]["comment"]+'</p>\
															<p class="item-comment-author">来自于 '+value[i]["user"]+'  的评价</p>\
														</a>\
													</div>'
					}

					if(value[i]["feature"]){
						li_append += '<div class="item-feature">'+value[i]["feature"]+'</div>\
												</li>'
					} else{
						li_append += '</li>'
					}
				}
			}
			li_append += '</ul>'
		})
		
		$("."+className+"").find(".right-main").append(li_append)
		
		$(".item-feature").each(function(){
			if(this.innerHTML === "免邮费"){
				$(this).addClass("orange")
			} else if(this.innerHTML === "新品"){
				$(this).addClass("green")
			} else{
				$(this).addClass("red")
			}
		})
		if(tabObject){
			$(".right-main-ul.hot").removeClass("hidden")
		}
		
		$("."+className+" .right-main-ul li").hover(function(){
			$(this).addClass("item-up-shadow-active")
		}, function(){
			$(this).removeClass("item-up-shadow-active")
		})
	})
}


/**********************/
var	hotproductData = function(){
	ajax("data.json", function(data){
		var json_result = JSON.parse(data)
		var li_append = ''
		
		for(var i = 0; i < json_result.hotproduct.length; i++){
			li_append += '<li><a href><img src="images/'+json_result.hotproduct[i]["images"]+'" width="296" height="220"></a>\
											<p class="comment"><a href>'+json_result.hotproduct[i]["comment"]+'<a href></p>\
											<p class="author">来自于 '+json_result.hotproduct[i]["author"]+' 的评价</p>\
											<p class="name"><a href>'+json_result.hotproduct[i]["name"]+'</a>\
												<span class="divid">|</span>\
												<span class="price">'+json_result.hotproduct[i]["price"]+'元</span>\
											</p>\
										</li>'
		}
		$(".hot_product").find(".main ul").append(li_append)
		
		$(".hot_product").find(".main ul li").hover(function(){
			$(this).addClass("item-up-shadow-active")
		}, function(){
			$(this).removeClass("item-up-shadow-active")
		})
	})
}


/**********************/
var	contentData = function(){
	ajax("data.json", function(data){
		var json_result = JSON.parse(data)
		
		$.each(json_result.content, function(key, value){
		//if(key === "book"){
			var li_append = '<ul>'
			var control = '<ol class="control">'
			for(var i = 0; i < value.length; i++){
				if(i !== value.length-1){li_append += '<li class="snippet">'}
				else{li_append += '<li class="more snippet">'}
				
				li_append += '<i class="iconfont left">&#xe60a;</i>\
											<i class="iconfont right">&#xe609;</i>'
				
				if(value[i]["name"]){
					li_append += '<h4 class="name"><a href>'+value[i]["name"]+'</a></h4>'
				}
				
				if(value[i]["desc"].indexOf("\n") !== -1){
					li_append += '<p class="desc"><a href>'+value[i]["desc"].substring(0, value[i]["desc"].indexOf("\n"))+'<br>'+value[i]["desc"].substring(value[i]["desc"].indexOf("\n"))+'</a></p>'
				} else{
					li_append += '<p class="desc"><a href>'+value[i]["desc"]+'</a></p>'
				}
				
				if(i !== value.length-1){
					if(value[i]["price"]){
						li_append += '<p class="price"><a href>'+value[i]["price"]+'</a></p>'
					} else{
						li_append += '<p class="price"></p>'
					}
				}
				
				if(value[i]["button"]){
					li_append += '<button class="button '+key+'">'+value[i]["button"]+'</button>'
				}
				
				li_append += '<a href class="img"><img src="images/'+value[i]["images"]+'" width="216" height="154"/></a></li>'
				control += '<li></li>'
			}
			control += '</ol>'
			li_append += '</ul>' + control
			$(".content").find(".main .module."+key).append(li_append)
		//}	
		})
		
		$(".content").find(".module").hover(function(){
			$(this).addClass("item-up-shadow-active")
		}, function(){
			$(this).removeClass("item-up-shadow-active")
		})
	})
}


/**********************/
var effectResult = function(){
	$(".main .ad a").hover(function(){
		$(this).addClass("item-up-shadow-active")
	}, function(){
		$(this).removeClass("item-up-shadow-active")
	})
	
	$(".subtitle-ul").children("li").each(function(index){
		$(this).hover(function(){
			var that = this
			$(that).parent(".subtitle-ul").children("li").each(function(){
				$(this).removeClass("subtitle-li-active")
			})
			var classname = that.className
			$(that).addClass("subtitle-li-active")
			
			$(that).parents(".module").find(".right-main").children("ul").each(function(){
				$(this).addClass("hidden")
			})
			$(that).parents(".module").find(".right-main").children("ul."+classname).removeClass("hidden")
		})
	})
}
