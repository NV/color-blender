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
var RGBs = [{},{}];

var inputs = $("inputs");
var bg = $("bg");
var a = $("a");
var hue_selector = $("hue_selector");


var n = 0;
inputs.addEventListener("focus", function(e){
	n = e.target.id.split("_")[1] || n;
}, !0);


function setHue(h) {
	if (h > 1)
		h /= 360;

	H[n].y = (1 - h) * 255;
	H[n].setAttribute("transform", "translate(0,"+ H[n].y + ")");

	bg.setAttribute("fill", hsl(h, 1, .5));	
}

function setColor(a, value, dontUpdateMarker) {
	a.sample.style.background = a.sample.nextSibling.style.background = value;
	if (!dontUpdateMarker) {
		M[n].setAttribute("fill", value);
	}
}

function updateColor(type, value) {
	setColor(I[n], value);

	if (type == "hsl") {

		var HSL = parseTriple(value);
		var HSB = hsl2hsb(HSL);
		setHue(HSB.h);
		moveCircle(HSB.s*255, (1 - HSB.b)*255);

		var RGB = hsl2rgb(HSL);
		I[n].rgb.value = rgb(RGB);
		I[n].hex.value = RGB.hex;

	} else if (type == "rgb") {

		RGB = parseTriple(value);
		HSB = rgb2hsb(RGB);
		I[n].hex.value = rgb2hex(RGB);
		setHue(HSB.h);
		moveCircle(HSB.s*255, (1 - HSB.b)*255);

		HSL = hsb2hsl(HSB);
		I[n].hsl.value = hsl(HSL);

	} else if (type == "hex") {
		RGB = hex2rgb(value);
		HSB = rgb2hsb(RGB);
		I[n].rgb.value = rgb(RGB);
		setHue(HSB.h);
		moveCircle(HSB.s*255, (1 - HSB.b)*255);

		HSL = hsb2hsl(HSB);
		I[n].hsl.value = hsl(HSL);
	}

	HSBs[n] = HSB;
	RGBs[n] = RGB;
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
	x = Math.min(x, a.width.baseVal.value);
	x = Math.max(0, x);
	y = Math.min(y, a.height.baseVal.value);
	y = Math.max(0, y);
	x = ~~(x + .5);
	y = ~~(y + .5);
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
	I[n].hsl.value = hsl(HSL);

	var RGB = hsl2rgb(HSL.h, HSL.s, HSL.l);
	I[n].rgb.value = rgb(RGB);
	I[n].hex.value = RGB.hex;
	setColor(I[n], RGB.hex);
	RGBs[n] = RGB;

	blend()
}

function updateCirclePosition(e) {
	var delta_x = e.pageX - start_x;
	var delta_y = e.pageY - start_y;

	var _xy = moveCircle(xy[0] + delta_x, xy[1] + delta_y);

	updateSB(_xy[0], _xy[1]);
}

a.onmousedown = function(e){
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

a.oncontextmenu = M[1].oncontextmenu = M[0].oncontextmenu = hue_selector.oncontextmenu = function(){
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
	I[n].hsl.value = hsl(HSL);
	var RGB = hsl2rgb(HSL);
	setColor(I[n], RGB.hex)
	I[n].rgb.value = rgb(RGB);
	RGBs[n] = RGB;
	blend()
}

function blend(){
	var c = {
		r: (RGBs[0].r + RGBs[1].r) / 2,
		g: (RGBs[0].g + RGBs[1].g) / 2,
		b: (RGBs[0].b + RGBs[1].b) / 2
	};

	B[0].rgb.value = rgb(c);
	c.hex = rgb2hex(c);
	B[0].hex.value = c.hex;
	setColor(B[0], c.hex, 1);

	var HSB = rgb2hsb(c);
	B[0].hsl.value = hsl(hsb2hsl(HSB));

}


var h_pressed, h_y, h_start_y;
H[0].onmousedown = H[1].onmousedown = function(e) {
	n = e.target.parentNode.id.split("_")[1];
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

n = 1;
updateColor("hsl", I[1].hsl.value);
n = 0;
updateColor("hsl", I[0].hsl.value);
