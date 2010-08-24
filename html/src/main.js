/**
 * @param {string|Object} key
 * @param {string} [value]
 */
Element.prototype.attr = function(key, value) {
	if (typeof key == "object")
		for (var k in key) {
			if (key.hasOwnProperty(k)) {
				this.attr(k, String(key[k]));
			}
		}
	else if (typeof value == "undefined")
		return this.getAttribute(key);
	else
		this.setAttribute(key, value);
};


var SVGNS = "http://www.w3.org/2000/svg";

/**
 * @param {string} name of Element
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

var chosen_colors = [
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

var blended_colors = [
	{
		hsl: $("hsl-0"),
		hex: $("hex-0"),
		rgb: $("rgb-0"),
		s: $("b-0")
	}
];

var hue_markers = [
	$s("g", {id:"h_0", stroke:"#333"}, [
		$s("line", {x1:10, x2:20}),
		$s("circle", {r:5, cx:25, "fill-opacity": .2})
	]),
	$s("g", {id:"h_1", stroke:"#333"}, [
		$s("line", {x1:10, x2:20}),
		$s("rect", {x:20.5, y:-5.5, width:9, height:10, "fill-opacity": .2})
	])
];

var HSBs = [{},{}];
var RGBs = [{},{}];
var inputs = $("inputs");
var current_color_index = 0;
var pressed = false;
var start_x, start_y;
var xy;
var hue_pressed;
var hue_y;
var hue_start_y;

var bg = $s("rect", {width:255, height:255, fill:"#F00", id:"bg"});

var hue_gradient = [];
for (var i=0; i<101; i+=5) {
	hue_gradient.push($s("stop", {offset: i/100, "stop-color": hsl2rgb(i/100, 1, .5).hex}));
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
		$s("linearGradient", {id:"g", x1:0, y1:1, x2:0, y2:0}, hue_gradient)
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
		hue_markers[0],
		hue_markers[1],
		b
	])
]);

d.body.appendChild(svg);

inputs.addEventListener("focus", function(e){
	current_color_index = e.target.id.split("_")[1] || current_color_index;
}, !0);


function setHue(h) {
	if (h > 1)
		h /= 360;

	hue_markers[current_color_index].y = (1 - h) * 255;
	hue_markers[current_color_index].attr("transform", "translate(0,"+ hue_markers[current_color_index].y + ")");

	bg.attr("fill", rgb(hsl2rgb(h, 1, .5)));
}

function setColor(element, value, dontUpdateMarker) {
	element.s.style.background = element.s.nextSibling.style.background = value;
	!dontUpdateMarker && M[current_color_index].attr("fill", value);
}

function updateColor(type, value) {
	if (type == "hsl") {

		var HSL = parseTriple(value);
		var HSB = hsl2hsb(HSL);
		setHue(HSB.h);
		moveMarker(HSB.s*255, (1 - HSB.b)*255);

		var RGB = hsl2rgb(HSL);
		chosen_colors[current_color_index].rgb.value = rgb(RGB);
		chosen_colors[current_color_index].hex.value = RGB.hex;

	} else if (type == "rgb") {

		RGB = parseTriple(value);
		HSB = rgb2hsb(RGB);
		chosen_colors[current_color_index].hex.value = rgb2hex(RGB);
		setHue(HSB.h);
		moveMarker(HSB.s*255, (1 - HSB.b)*255);

		HSL = hsb2hsl(HSB);
		chosen_colors[current_color_index].hsl.value = hsl(HSL);

	} else if (type == "hex") {
		RGB = hex2rgb(value);
		HSB = rgb2hsb(RGB);
		chosen_colors[current_color_index].rgb.value = rgb(RGB);
		setHue(HSB.h);
		moveMarker(HSB.s*255, (1 - HSB.b)*255);

		HSL = hsb2hsl(HSB);
		chosen_colors[current_color_index].hsl.value = hsl(HSL);
	}

	setColor(chosen_colors[current_color_index], rgb(RGB));
	HSBs[current_color_index] = HSB;
	RGBs[current_color_index] = RGB;
	blend();
}

inputs.onkeyup = function(e){
	var element = e.target;
	var value = element.value;
	var id = element.id.split("_");
	if (id[1] && element.prevValue != value) {
		element.prevValue = value;
		current_color_index = id[1];
		updateColor(id[0], value);
	}
};


function moveMarker(x, y) {
	x = Math.max(Math.min(x, a.getAttribute("width")), 0);
	y = Math.max(Math.min(y, a.getAttribute("height")), 0);
	x = ~~(x + .5);
	y = ~~(y + .5);
	var m = M[current_color_index];
	m.attr(m.cx ? "cx" : "x", x);
	m.attr(m.cy ? "cy" : "y", y);
	return [x, y];
}

function updateSB(x, y) {
	HSBs[current_color_index].s = x/255;
	HSBs[current_color_index].b = 1 - y/255;
	var HSL = hsb2hsl(HSBs[current_color_index]);
	chosen_colors[current_color_index].hsl.value = hsl(HSL);

	var RGB = hsl2rgb(HSL.h, HSL.s, HSL.l);
	chosen_colors[current_color_index].rgb.value = rgb(RGB);
	chosen_colors[current_color_index].hex.value = RGB.hex;
	setColor(chosen_colors[current_color_index], RGB.hex);
	RGBs[current_color_index] = RGB;

	blend()
}

function updateMarkerPosition(e) {
	var delta_x = e.pageX - start_x;
	var delta_y = e.pageY - start_y;

	var _xy = moveMarker(xy[0] + delta_x, xy[1] + delta_y);

	updateSB(_xy[0], _xy[1]);
}

a.onmousedown = function(e){
	pressed = true;
	
	current_color_index = (e.button || e.ctrlKey) ? 1 : 0;

	xy = [offsetX(e) - 10, offsetY(e) - 10];

	updateSB(xy[0], xy[1]);

	xy = moveMarker(xy[0], xy[1]);
	start_x = e.pageX;
	start_y = e.pageY;
	return !1;
};

a.oncontextmenu = b.oncontextmenu = function(){
	return false;
};

d.onmouseup = function() {
	pressed = hue_pressed = false;
};


b.onmousedown = function(e){
	current_color_index = (e.button || e.ctrlKey) ? 1 : 0;
	updateHue(1 - (offsetY(e) - 10) / 255);
};

function updateHue(h){
	h = Math.max(Math.min(1, h), 0);
	setHue(h);
	HSBs[current_color_index].h = h;
	var HSL = hsb2hsl(HSBs[current_color_index]);
	chosen_colors[current_color_index].hsl.value = hsl(HSL);
	var RGB = hsl2rgb(HSL);
	setColor(chosen_colors[current_color_index], RGB.hex);
	chosen_colors[current_color_index].rgb.value = rgb(RGB);
	RGBs[current_color_index] = RGB;
	blend()
}

function blend(){
	var c = {
		r: (RGBs[0].r + RGBs[1].r) / 2,
		g: (RGBs[0].g + RGBs[1].g) / 2,
		b: (RGBs[0].b + RGBs[1].b) / 2
	};

	blended_colors[0].rgb.value = rgb(c);
	c.hex = rgb2hex(c);
	blended_colors[0].hex.value = c.hex;
	setColor(blended_colors[0], c.hex, 1);

	var HSB = rgb2hsb(c);
	blended_colors[0].hsl.value = hsl(hsb2hsl(HSB));
}

hue_markers[0].onmousedown = hue_markers[1].onmousedown = function(e) {
	current_color_index = e.target.parentNode.id.split("_")[1];
	hue_y = hue_markers[current_color_index].y;
	hue_pressed = true;
	hue_start_y = e.pageY;
	return !1;
};

d.onmousemove = function(e) {
	pressed ? updateMarkerPosition(e) :
    hue_pressed && updateHue(1 - (hue_y + e.pageY - hue_start_y) / 255);
};

current_color_index = 1;
updateColor("rgb", chosen_colors[1].rgb.value);
current_color_index = 0;
updateColor("rgb", chosen_colors[0].rgb.value);
