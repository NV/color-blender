var I = [
	{
		hsl: $("hsl_0"),
		hex: $("hex_0"),
		rgb: $("rgb_0"),
		sample: $("sample_0")
	},
	{
		hsl: $("hsl_1"),
		hex: $("hex_1"),
		rgb: $("rgb_1"),
		sample: $("sample_1")
	}
];

var M = [
	$("m_0"),
	$("m_1")
];

var H = [
	$("hue_0"),
	$("hue_1")
];

var B = [
	{
		hsl: $("hsl-0"),
		hex: $("hex-0"),
		rgb: $("rgb-0"),
		sample: $("b-0")
	}
];

var HSBs = [{},{}];

var inputs = $("inputs");
var bg = $("bg");
var black_layer = $("black_layer");
var hue_selector = $("hue_selector");


var n = 0;
inputs.addEventListener("focus", function(e){
	n = e.target.id.split("_")[1] || n;
}, !0);


function setHue(h) {
	if (h > 1)
		h /= 360;

	H[n].y = (1 - h % 1) * 255;
	H[n].setAttribute("transform", "translate(0,"+ H[n].y + ")");

	bg.setAttribute("fill", hsl(h, 1, .5));	
}

function updateColor(type, value) {
	I[n].sample.style.backgroundColor = value;

	if (type == "hsl") {

		var triple = parseTriple(value);
		var HSB = hsl2hsb(triple[0], triple[1], triple[2]);
		setHue(HSB.h);
		moveCircle(HSB.s*255, (1 - HSB.b)*255);

		var RGB = hsl2rgb(triple[0], triple[1], triple[2]);
		I[n].rgb.value = rgb(RGB);
		I[n].hex.value = RGB.hex;

	} else if (type == "rgb") {

		triple = parseTriple(value);
		HSB = rgb2hsb(triple[0], triple[1], triple[2]);
		I[n].hex.value = rgb2hex.apply(null, triple);
		setHue(HSB.h);
		moveCircle(HSB.s*255, (1 - HSB.b)*255);

		var HSL = hsb2hsl(HSB.h, HSB.s, HSB.b);
		I[n].hsl.value = hsl(HSL);

	} else if (type == "hex") {
		triple = hex2rgb(value);
		HSB = rgb2hsb(triple[0], triple[1], triple[2]);
		I[n].rgb.value = rgb.apply(null, triple);
		setHue(HSB.h);
		moveCircle(HSB.s*255, (1 - HSB.b)*255);

		HSL = hsb2hsl(HSB.h, HSB.s, HSB.b);
		I[n].hsl.value = hsl(HSL);
	}

	HSBs[n] = HSB;
	blend();
}

inputs.onkeyup = function(e){
	var element = e.target;
	var value = element.value;
	var id = element.id.split("_");
	if (id[1] && element.prevValue != value) {
		element.prevValue = value;
		n = id[1];
		updateColor(id[0], value);
	}
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
	var m = M[n];
	m.setAttribute(m.cx ? "cx" : "x", x);
	m.setAttribute(m.cy ? "cy" : "y", y);
	return [x, y];
}


var out = $("out");
var pressed;
var start_x, start_y;
var xy;


function updateSB(x, y) {
	HSBs[n].s = x/255;
	HSBs[n].b = 1 - y/255;
	var HSL = hsb2hsl(HSBs[n]);
	I[n].sample.style.backgroundColor = I[n].hsl.value = hsl(HSL);

	var RGB = hsl2rgb(HSL.h, HSL.s, HSL.l);
	I[n].rgb.value = rgb(RGB);
	I[n].hex.value = RGB.hex;

	blend()
}

function updateCirclePosition(e) {
	var delta_x = e.pageX - start_x;
	var delta_y = e.pageY - start_y;

	var _xy = moveCircle(xy[0] + delta_x, xy[1] + delta_y);

	updateSB(_xy[0], _xy[1]);
}

black_layer.onmousedown = function(e){
	pressed = true;
	
	if (e.button)
		n = 1;
	else
		n = 0;

	xy = [e.offsetX - 10, e.offsetY - 10];

	updateSB(xy[0], xy[1]);

	xy = moveCircle(xy);
	start_x = e.pageX;
	start_y = e.pageY;

	return false;
};

black_layer.oncontextmenu = M[1].oncontextmenu = M[0].oncontextmenu = hue_selector.oncontextmenu = function(){
	return false;
};

document.onmouseup = function() {
	pressed = h_pressed = 0;
};


hue_selector.onclick = function(e){
	updateHue(1 - (e.offsetY - 10) / 255);
};

function updateHue(h){
	h = Math.max(Math.min(1, h), 0);
	setHue(h);
	HSBs[n].h = h;
	var HSL = hsb2hsl(HSBs[n]);
	I[n].sample.style.background = I[n].hsl.value = hsl(HSL);
	var RGB = hsl2rgb(HSL);
	I[n].rgb.value = rgb(RGB);
	blend()
}

function blend(){
	var c = {
		h: (HSBs[0].h + HSBs[1].h) / 2,
		s: (HSBs[0].s + HSBs[1].s) / 2,
		b: (HSBs[0].b + HSBs[1].b) / 2
	};
	var HSL = hsb2hsl(c);
	B[0].sample.style.background = B[0].hsl.value = hsl(HSL);
	var RGB = hsl2rgb(HSL);
	B[0].rgb.value = rgb(RGB);
	B[0].hex.value = RGB.hex;
}


var h_pressed, h_y, h_start_y;
H[0].onmousedown = H[1].onmousedown = function(e) {
	n = e.target.id.split("_")[1];
	h_y = H[n].y;
	h_pressed = 1;
	h_start_y = e.pageY;
};

document.onmousemove = function(e) {
	if (pressed) {
		updateCirclePosition(e);
	} else if (h_pressed) {
		var delta = e.pageY - h_start_y;
		updateHue(1 - (h_y + delta) / 255)
	}
};

n = 0;
updateColor("hsl", I[0].hsl.value);
n = 1;
updateColor("hsl", I[1].hsl.value);
