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
		hsl: $("b_hsl_0"),
		hex: $("b_hex_0"),
		rgb: $("b_rgb_0"),
		sample: $("b_0")
	}
]

var HSBs = [{},{}];

var inputs = $("inputs");
var bg = $("bg");
var black_layer = $("black_layer");

var hue_selector = $("hue_selector");


var n = 0;
inputs.addEventListener("focus", function(e){
	n = e.target.id.split("_")[1] || n;
}, !0);


function updateColor(n, text) {
	if (!text) return;
	I[n].style.backgroundColor = text;
}


function setHue(h) {
	if (h > 1)
		h /= 360;

	H[n].setAttribute("transform", "translate(0,"+ ((1 - h % 1) * 255) + ")");

	bg.setAttribute("fill", hsl(h, 1, .5));	
}

function changeHSL(element) {

	var n = element.id.split("_")[1];
	var text = element.value;

	if (!text) return;
	I[n].sample.style.backgroundColor = text;

	var triple = parseTriple(text);
	var HSB = hsl2hsb(triple[0], triple[1], triple[2]);
	setHue(HSB.h);
	moveCircle(HSB.s*255, (1 - HSB.b)*255);

	var RGB = hsl2rgb(triple[0], triple[1], triple[2]);
	I[n].rgb.value = rgb(RGB);
	I[n].hex.value = RGB.hex;

	HSBs[n] = HSB;
	blend()
}

function changeRGB(text) {
	I[n].sample.style.backgroundColor = text;
	var triple = parseTriple(text);
	var HSB = rgb2hsb(triple[0], triple[1], triple[2]);
	I[n].hex.value = rgb2hex.apply(null, triple);
	setHue(HSB.h * 360);
	moveCircle(HSB.s*255, (1 - HSB.b)*255);

	var HSL = hsb2hsl(HSB.h, HSB.s, HSB.b);
	I[n].hsl.value = hsl(HSL);

	HSBs[n] = HSB;
	blend()
}

function changeRGBhex(text) {
	I[n].sample.style.backgroundColor = text;
	var triple = hex2rgb(text);
	var HSB = rgb2hsb(triple[0], triple[1], triple[2]);
	I[n].rgb.value = rgb.apply(null, triple);

	setHue(HSB.h * 360);
	moveCircle(HSB.s*255, (1 - HSB.b)*255);

	var HSL = hsb2hsl(HSB.h, HSB.s, HSB.b);
	I[n].hsl.value = hsl(HSL);

	HSBs[n] = HSB;
	blend()
}



I[0].hsl.onkeyup = I[1].hsl.onkeyup = function(e){
	if (e.shiftKey && e.ctrlKey && e.metaKey) return;
	changeHSL(e.target);
};

I[0].rgb.onkeyup = I[1].rgb.onkeyup= function(e){
	if (e.shiftKey && e.ctrlKey && e.metaKey) return;
	changeRGB(e.target.value);
};

I[0].hex.onkeyup = I[1].hex.onkeyup = function(e){
	if (e.shiftKey && e.ctrlKey && e.metaKey) return;
	changeRGBhex(e.target.value);
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

var pressed = 0;
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
	if (!pressed) return;

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

black_layer.oncontextmenu = M[1].oncontextmenu = M[0].oncontextmenu = function(){
	return false;
};

document.onmousemove = function(e) {
	if (pressed) {
		updateCirclePosition(e);
	}
};

document.onmouseup = function() {
	pressed = 0;
};

var h_pressed;
hue_selector.onmousedown = function(e){
	h_pressed = true;
	if (e.button)
		n = 1;
	else
		n = 0;
	updateHue(1 - (e.offsetY - 10) / 255);
};

function updateHue(h){
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


n = 1;
changeHSL(I[1].hsl);
n = 0;
changeHSL(I[0].hsl);
