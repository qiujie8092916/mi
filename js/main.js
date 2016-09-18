$(function(){
	bannerSwitcher()
	head_2()
	singleFillData()
	singleSwitcher()
	
	hardwareData()
	matchData()
	
	effectResult()
})


var bannerSwitcher = function(){
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
	
	/*
	rightBtn.on("click", function(){
		now++
		if(now > banner.length-1){now = 0}
		$(i_points[now]).trigger("click")
	})
	
	var timer = setInterval(function(){
		rightBtn.trigger("click")
	}, 2500)*/
}


/***********************/
var singleFillData = function(){
	ajax("data.json", function(data){
		var json_result = JSON.parse(data)
		var li_append = ""
		for(var i = 0; i < json_result.single.images.length; i++){
			li_append += '<li class="li-'+(i+1)+'"><a href class="thumb">\
											<img src="'+json_result.single.images[i]+'" width="160" height="160"/></a>\
											<a href class="name">'+json_result.single.name[i]+'</a>\
											<p class="desc">'+json_result.single.desc[i]+'</p>\
											<p class="price">'+json_result.single.price[i]+'元</p>\
										</li>'
		}
		$(".single-main ul").append(li_append)
	})
}

/**********************/
var singleSwitcher = function(){
	var ul = $(".single-main ul")
	var leftBtn = $(".subtitle .left")
	var rightBtn = $(".subtitle .right")
	
	leftBtn.on("click", function(){
		if(this.className.indexOf("disable") === -1){
			var li = ul.children("li")
			ul.animate({"left": 0}, 500)
			$(this).addClass("disable")
			$(".subtitle .right").removeClass("disable")
		}
	})


	rightBtn.on("click", function(){
		if(this.className.indexOf("disable") === -1){
			var li = ul.children("li")
			ul.animate({"left": -($(li[0]).width() + parseInt($(li[0]).css("marginRight")))*5}, 500)
			$(this).addClass("disable")
			$(".subtitle .left").removeClass("disable")
		}
	})

	var timer = setInterval(function(){
		rightBtn.trigger("click")
		setTimeout(function(){
			leftBtn.trigger("click")
		}, 3000)
	}, 6000)
}


var head_2 = function(){
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
var hardwareData = function(){
	ajax("data.json", function(data){
		var json_result = JSON.parse(data)
		var li_append = ''
		
		for(var i = 0; i < json_result.hardware.length; i++){
			li_append += '<li class="main-item-2">\
											<a href class="item-lg-p">\
												<img src="images/'+json_result.hardware[i]["images"]+'" width="160" height="160" />\
											</a>\
											<a href class="item-name">'+json_result.hardware[i]["name"]+'</a>\
											<p class="item-desc">'+json_result.hardware[i]["desc"]+'</p>\
											<p class="item-price">'+json_result.hardware[i]["price"]+'元</p>'
			if(json_result.hardware[i]["feature"] !== undefined){
				li_append += '<div class="item-feature">'+json_result.hardware[i]["feature"]+'</div>\
										</li>'
			} else{
				li_append += '</li>'
			}
		}
		$(".hardware").find(".right-main-ul").append(li_append)
		
		$(".item-feature").each(function(){
			if(this.innerHTML === "免邮费"){
				$(this).addClass("orange")
			} else if(this.innerHTML === "新品"){
				$(this).addClass("green")
			} else{
				$(this).addClass("red")
			}
		})
		
		$(".right-main-ul li").hover(function(){
			$(this).addClass("item-up-shadow-active")
		}, function(){
			$(this).removeClass("item-up-shadow-active")
		})
		
	})					
}


/**********************/
var matchData = function(){
	ajax("data.json", function(data){
		var json_result = JSON.parse(data)
		var li_append = ''
		
		for(var i = 0; i < json_result.match.length; i++){
			if(json_result.match[i]["tiny"] == 1){
				li_append += '<li class="main-item-1 small-li">\
												<a href class="item-sm-p">\
													<img src="images/'+json_result.match[i]["images"]+'" width="80" height="80" />\
												</a>\
												<a href class="item-name">'+json_result.match[i]["name"]+'</a>\
												<p class="item-price">'+json_result.match[i]["price"]+'元</p>\
											</li>\
											<li class="main-item-1 small-li">\
												<a href class="more">浏览更多<small>热门</small></a>\
												<a href class="view-more"><i class="iconfont">&#xe60c;</i></a>\
											</li>'
			} else{
				li_append += '<li class="main-item-2">\
												<a href class="item-lg-p">\
													<img src="images/'+json_result.match[i]["images"]+'" width="160" height="160" />\
												</a>\
												<a href class="item-name">'+json_result.match[i]["name"]+'</a>'
				if(json_result.match[i]["old"] !== undefined){
					li_append	+=	'<p class="item-price">'+json_result.match[i]["price"]+'元\
													<del>'+json_result.match[i]["old"]+'元</del>\
												</p>'
				} else{
					li_append	+=	'<p class="item-price">'+json_result.match[i]["price"]+'元</p>'
				}
				li_append	+=		'<p class="item-rank">'+json_result.match[i]["rank"]+'</p>\
												<div class="item-comment">\
													<a href>\
														<p class="item-comment-content">'+json_result.match[i]["comment"]+'</p>\
														<p class="item-comment-author">来自于 '+json_result.match[i]["user"]+'  的评价</p>\
													</a>\
												</div>'
				
				
				if(json_result.match[i]["feature"] !== undefined){
					li_append += '<div class="item-feature">'+json_result.match[i]["feature"]+'</div>\
											</li>'
				} else{
					li_append += '</li>'
				}
			}
		}
		$(".match").find(".right-main-ul").append(li_append)
		
		$(".item-feature").each(function(){
			if(this.innerHTML === "免邮费"){
				$(this).addClass("orange")
			} else if(this.innerHTML === "新品"){
				$(this).addClass("green")
			} else{
				$(this).addClass("red")
			}
		})
		
		$(".right-main-ul li").hover(function(){
			$(this).addClass("item-up-shadow-active")
		}, function(){
			$(this).removeClass("item-up-shadow-active")
		})
	})
}


/**********************/
var effectResult = function(){
	$(".recommand a").hover(function(){
		$(this).addClass("item-up-shadow-active")
	}, function(){
		$(this).removeClass("item-up-shadow-active")
	})
}
