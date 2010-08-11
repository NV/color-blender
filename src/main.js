var hsl_0 = $("hsl_0");
var rgb_hex_0 = $("rgb-hex_0");
var rgb_0 = $("rgb_0");
var sample_0 = $("sample_0");

var hsl_last = $("hsl_last");
var rgb_hex_last = $("rgb-hex_last");
var rgb_last = $("rgb_last");
var sample_last = $("sample_last");

var hue_selector = $("hue_selector");
var hue_0 = $("hue_0");

var I = {
	0: {
		hsl: hsl_0,
		rgb_hex: rgb_hex_0,
		rgb: rgb_0,
		sample: sample_0
	},
	last: {
		hsl: hsl_last,
		rgb_hex: rgb_hex_last,
		rgb: rgb_last,
		sample: sample_last
	}
};

var markers = {
	0: $("marker_0"),
	last: $("marker_last")
};

var last = $("last");

var bg = $("bg");
var paper = $("paper");
var black_layer = $("black_layer");


var inputs = $("inputs");
inputs.onkeypress = function(e){
	var splitted = e.target.id.split("_");
	var n = splitted[1];
	setTimeout(function(){
		I[n].sample.style.background = e.target.value;
		var RGB = parseTriple(getComputedStyle(I[n].sample).backgroundColor);
	})
};

var n = 0;
inputs.addEventListener("focus", function(e){
	n = e.target.id.split("_")[1] || n;
}, !0);




function updateColor(n, text) {
	if (!text) return;
	I[n].style.backgroundColor = text;
}


function setHue(h) {
	bg.setAttribute("fill", hsl(h, 100, 50))
}

function changeHSL(text) {
	if (!text) return;
	I[n].sample.style.backgroundColor = text;

	var triple = parseTriple(text);
	var hsv = hsl_to_hsb(triple[0], triple[1], triple[2]);
	setHue(hsv.h);
	moveCircle(hsv.s*255/100, (100 - hsv.v)*255/100);

	var RGB = hsl2rgb(triple[0], triple[1], triple[2]);
	I[n].rgb.value = rgb(Math.round(RGB.r), Math.round(RGB.g), Math.round(RGB.b));
	I[n].rgb_hex.value = RGB.hex;

	I[n].hsl.hsv = hsv;
}

function changeRGB(text) {
	sample_0.style.backgroundColor = text;
	var triple = parseTriple(text);
	var HSB = rgb2hsb(triple[0], triple[1], triple[2]);
	rgb_hex_0.value = rgb2hex.apply(null, triple);
	setHue(HSB.h * 360);
	moveCircle(HSB.s*255, (1 - HSB.b)*255);

	var HSL = hsb_to_hsl(HSB.h, HSB.s, HSB.b);
	hsl_0.value = hsl(HSL.h, HSL.s, HSL.l);
}

function changeRGBhex(text) {
	sample_0.style.backgroundColor = text;
	var triple = hex2rgb(text);
	var HSB = rgb2hsb(triple[0], triple[1], triple[2]);
	rgb_0.value = rgb.apply(null, triple);

	setHue(HSB.h * 360);
	moveCircle(HSB.s*255, (1 - HSB.b)*255);

	var HSL = hsb_to_hsl(HSB.h, HSB.s, HSB.b);
	hsl_0.value = hsl(HSL.h, HSL.s, HSL.l);
}


function updateHSL(){
	changeHSL(hsl_0.value.trim())
}

updateHSL();

hsl_0.onkeyup = hsl_last.onkeyup = function(e){
	if (e.shiftKey && e.ctrlKey && e.metaKey) return;
	updateHSL()
};

rgb_0.onkeyup = function(e){
	if (e.shiftKey && e.ctrlKey && e.metaKey) return;
	changeRGB(rgb_0.value);
};

rgb_hex_0.onkeyup = function(e){
	if (e.shiftKey && e.ctrlKey && e.metaKey) return;
	changeRGBhex(rgb_hex_0.value);
};


function moveCircle(x, y) {
	if (x[1] > -1) {
		y = x[1];
		x = x[0];
	}
	x = Math.min(x, black_layer.width.baseVal.value);
	x = Math.max(0, x);
	y = Math.min(y, black_layer.height.baseVal.value);
	y = Math.max(0, y);
	var m = markers[n];
	m.setAttribute(m.cx ? "cx" : "x", x);
	m.setAttribute(m.cy ? "cy" : "y", y);
	return [x, y];
}


var out = $("out");

var pressed = 0;
var pointer_x, pointer_y;
var start_x, start_y;
var xy;


function updateSB(x, y) {
	var s = x/255;
	var b = 1 - y/255;
	var HSL = hsb_to_hsl(hsl_0.hsv.v, s, b);
	I[n].sample.style.backgroundColor = hsl(hsl_0.hsv.h, HSL.s, HSL.l);

	var RGB = hsl2rgb(HSL.h, HSL.s, HSL.l);

	I[n].rgb.value = rgb(RGB.r, RGB.g, RGB.b);
	I[n].rgb_hex.value = RGB.hex;
	I[n].hsl.value = hsl(hsl_0.hsv.h, Math.round(HSL.s), Math.round(HSL.l))
}

function updateCirclePosition(e) {
	if (!pressed) return;

	var delta_x = e.pageX - start_x;
	var delta_y = e.pageY - start_y;

	var _xy = moveCircle(xy[0] + delta_x, xy[1] + delta_y);

	updateSB(_xy[0], _xy[1])
}

black_layer.onmousedown = function(e){
	pressed = true;
	
	if (e.button)
		n = "last";
	else
		n = 0;

	xy = [e.offsetX - 10, e.offsetY - 10];

	updateSB(xy[0], xy[1]);

	xy = moveCircle(xy);
	start_x = e.pageX;
	start_y = e.pageY;

	return false;
};

black_layer.oncontextmenu = markers.last.oncontextmenu = markers[0].oncontextmenu = function(){
	return false;
};

document.onmousemove = function(e) {
	if (pressed) {
		updateCirclePosition(e);
	}
};

document.onmouseup = function() {
	pressed = false;
};


changeHSL(hsl_0.value);
var h_pressed;

hue_selector.onmousedown = function(e){
	h_pressed = true;
	var y = e.offsetY;
	hue_0.setAttribute("transform", "translate(0,"+(y-10)+")");
};
