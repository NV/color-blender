/**
 * @param {String|Object} key
 * @param {String} [value]
 */
Element.prototype.attr = function(key, value) {
	if (typeof key == "object")
		for (var k in key)
			if (key.hasOwnProperty(k))
				this.setAttribute(k, String(key[k]));

	else if (typeof value == "undefined")
		return this.getAttribute(key);
	else
		this.setAttribute(key, value);
};

var SVGNS = "http://www.w3.org/2000/svg";

/**
 * @param {String} name of Element
 * @param {Object} attributes
 * @param {Array} [children]
 * @return {Element}
 */
function $s(name, attributes, children) {
	var element = document.createElementNS(SVGNS, name);
	attributes && element.attr(attributes);
	if (children) {
		for (var i=0; i<children.length; i++) {
			element.appendChild(children[i])
		}
	}
	return element;
}

var I = [
	{
		hsl: $("hsl_0"),
		hex: $("hex_0"),
		rgb: $("rgb_0"),
		s: $("s_0")
	},
	{
		hsl: $("hsl_1"),
		hex: $("hex_1"),
		rgb: $("rgb_1"),
		s: $("s_1")
	}
];

var B = [
	{
		hsl: $("hsl-0"),
		hex: $("hex-0"),
		rgb: $("rgb-0"),
		s: $("b-0")
	}
];

var H = [
	$s("g", {id:"h_0", stroke:"#666"}, [
		$s("line", {x1:10, x2:20}),
		$s("circle", {r:5, cx:25, "fill-opacity": .2})
	]),
	$s("g", {id:"h_1", stroke:"#666"}, [
		$s("line", {x1:10, x2:20}),
		$s("rect", {x:20.5, y:-5.5, width:9, height:10, "fill-opacity": .2})
	])
];

var Hs = [{},{}];
var Rs = [{},{}];
var ip = $("ip");
var n = 0;
var pd;
var s_x, s_y;
var xy;
var h_pd;
var h_y;
var h_s_y;

var bg = $s("rect", {width:255, height:255, fill:"#F00", id:"bg"});

var hue_g = [];
for (i=0; i<101; i+=5) {
	hue_g.push($s("stop", {offset: i/100, "stop-color": hsl2rgb(i/100, 1, .5).hex}));
}

var M = [
	$s("circle", {id:"m_0", transform:"translate(0.5, 0.5)", r:7, fill:"none", stroke:"#FFF", "stroke-width":1}),
	$s("rect", {id:"m_1", transform:"translate(-5.5, -5.5)", x:0, y:0, width:12, height:12, fill:"none", stroke:"#FFF", "stroke-width":1})
];

var a = $s("rect", {id:"a", width:255, height:255, opacity:0});
var b = $s("rect", {id:"b", opacity:0, width:20, height:255});

var svg = $s("svg", {xmlns:SVGNS, version:1.1, width:400, height:300}, [
	$s("defs", 0, [
		$s("linearGradient", {id:"w"}, [
			$s("stop", {offset:0, "stop-color":"#FFF"}),
			$s("stop", {offset:1, "stop-color":"#FFF", "stop-opacity":0})
		]),
		$s("linearGradient", {id:"z", x1:0, y1:1, x2:0, y2:0}, [
			$s("stop", {offset:0, "stop-color":"#000"}),
			$s("stop", {offset:1, "stop-color":"#000", "stop-opacity":0})
		]),
		$s("linearGradient", {id:"g", x1:0, y1:1, x2:0, y2:0}, hue_g)
	]),
	$s("g", {transform:"translate(10, 10)"}, [
		bg,
		$s("rect", {width:255, height:255, fill:"url(#w)"}),
		$s("rect", {width:255, height:255, fill:"url(#z)"}),
		M[1],
		M[0],
		a
	]),
	$s("g", {transform:"translate(275, 10)"}, [
		$s("rect", {fill:"url(#g)", width:20, height:255}),
		H[0],
		H[1],
		b
	])
]);

d.body.appendChild(svg);

ip.addEventListener("focus", function(e){
	n = e.target.id.split("_")[1] || n;
}, !0);


function sH(h) {
	if (h > 1)
		h /= 360;

	H[n].y = (1 - h) * 255;
	H[n].setAttribute("transform", "translate(0,"+ H[n].y + ")");

	bg.setAttribute("fill", rgb(hsl2rgb(h, 1, .5)));	
}

function sC(a, value, dontUpdateMarker) {
	a.s.style.background = a.s.nextSibling.style.background = value;
	!dontUpdateMarker && M[n].setAttribute("fill", value);
}

function uC(type, value) {
	if (type == "hsl") {

		var HSL = p3(value);
		var HSB = hsl2hsb(HSL);
		sH(HSB.h);
		mM(HSB.s*255, (1 - HSB.b)*255);

		var RGB = hsl2rgb(HSL);
		I[n].rgb.value = rgb(RGB);
		I[n].hex.value = RGB.hex;

	} else if (type == "rgb") {

		RGB = p3(value);
		HSB = rgb2hsb(RGB);
		I[n].hex.value = rgb2hex(RGB);
		sH(HSB.h);
		mM(HSB.s*255, (1 - HSB.b)*255);

		HSL = hsb2hsl(HSB);
		I[n].hsl.value = hsl(HSL);

	} else if (type == "hex") {
		RGB = hex2rgb(value);
		HSB = rgb2hsb(RGB);
		I[n].rgb.value = rgb(RGB);
		sH(HSB.h);
		mM(HSB.s*255, (1 - HSB.b)*255);

		HSL = hsb2hsl(HSB);
		I[n].hsl.value = hsl(HSL);
	}

	sC(I[n], rgb(RGB));
	Hs[n] = HSB;
	Rs[n] = RGB;
	blend();
}

ip.onkeyup = function(e){
	var element = e.target;
	var value = element.value;
	var id = element.id.split("_");
	if (id[1] && element.prevValue != value) {
		element.prevValue = value;
		n = id[1];
		uC(id[0], value);
	}
};


function mM(x, y) {
	x = Math.max(Math.min(x, a.getAttribute("width")), 0);
	y = Math.max(Math.min(y, a.getAttribute("height")), 0);
	x = ~~(x + .5);
	y = ~~(y + .5);
	var m = M[n];
	m.setAttribute(m.cx ? "cx" : "x", x);
	m.setAttribute(m.cy ? "cy" : "y", y);
	return [x, y];
}

function uSB(x, y) {
	Hs[n].s = x/255;
	Hs[n].b = 1 - y/255;
	var HSL = hsb2hsl(Hs[n]);
	I[n].hsl.value = hsl(HSL);

	var RGB = hsl2rgb(HSL.h, HSL.s, HSL.l);
	I[n].rgb.value = rgb(RGB);
	I[n].hex.value = RGB.hex;
	sC(I[n], RGB.hex);
	Rs[n] = RGB;

	blend()
}

function uP(e) {
	var delta_x = e.pageX - s_x;
	var delta_y = e.pageY - s_y;

	var _xy = mM(xy[0] + delta_x, xy[1] + delta_y);

	uSB(_xy[0], _xy[1]);
}

a.onmousedown = function(e){
	pd = true;
	
	n = (e.button || e.ctrlKey) ? 1 : 0;

	xy = [offsetX(e) - 10, offsetY(e) - 10];

	uSB(xy[0], xy[1]);

	xy = mM(xy[0], xy[1]);
	s_x = e.pageX;
	s_y = e.pageY;
	return !1;
};

a.oncontextmenu = b.oncontextmenu = function(){
	return false;
};

d.onmouseup = function() {
	pd = h_pd = 0;
};


b.onmousedown = function(e){
	n = (e.button || e.ctrlKey) ? 1 : 0;
	updateHue(1 - (offsetY(e) - 10) / 255);
};

function updateHue(h){
	h = Math.max(Math.min(1, h), 0);
	sH(h);
	Hs[n].h = h;
	var HSL = hsb2hsl(Hs[n]);
	I[n].hsl.value = hsl(HSL);
	var RGB = hsl2rgb(HSL);
	sC(I[n], RGB.hex);
	I[n].rgb.value = rgb(RGB);
	Rs[n] = RGB;
	blend()
}

function blend(){
	var c = {
		r: (Rs[0].r + Rs[1].r) / 2,
		g: (Rs[0].g + Rs[1].g) / 2,
		b: (Rs[0].b + Rs[1].b) / 2
	};

	B[0].rgb.value = rgb(c);
	c.hex = rgb2hex(c);
	B[0].hex.value = c.hex;
	sC(B[0], c.hex, 1);

	var HSB = rgb2hsb(c);
	B[0].hsl.value = hsl(hsb2hsl(HSB));
}

H[0].onmousedown = H[1].onmousedown = function(e) {
	n = e.target.parentNode.id.split("_")[1];
	h_y = H[n].y;
	h_pd = 1;
	h_s_y = e.pageY;
	return !1;
};

d.onmousemove = function(e) {
	pd ? uP(e) :
    h_pd && updateHue(1 - (h_y + e.pageY - h_s_y) / 255);
};

n = 1;
uC("rgb", I[1].rgb.value);
n = 0;
uC("rgb", I[0].rgb.value);
