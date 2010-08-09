var OFFSET = 10;

var first_hsl = $("first_hsl");
var first_rgb_hex = $("first_rgb_hex");
var first_rgb = $("first_rgb");
var first_sample = $("first_sample");
var last = $("last");

var bg = $("bg");
var paper = $("paper");
var c = $("c");
var black_layer = $("black_layer");


function updateColor(RGB) {
	
}

function setHue(h) {
	bg.setAttribute("fill", hsl(h, 100, 50))
}

function changeHSL(text) {
	if (!text) return;
	first_sample.style.backgroundColor = text;

	var triple = parseTriple(text);
	var hsv = hsl_to_hsb(triple[0], triple[1], triple[2]);
	setHue(hsv.h);
	moveCircle(hsv.s*255/100, (100 - hsv.v)*255/100);

	var RGB = hsl2rgb(triple[0], triple[1], triple[2]);
	first_rgb.value = rgb(Math.round(RGB.r), Math.round(RGB.g), Math.round(RGB.b));
	first_rgb_hex.value = RGB.hex;

	first_hsl.hsv = hsv;
}

function changeRGB(text) {
	first_sample.style.backgroundColor = text;
	var triple = parseTriple(text);
	var HSB = rgb2hsb(triple[0], triple[1], triple[2]);
	first_rgb_hex.value = rgb2hex.apply(null, triple);
	setHue(HSB.h * 360);
	moveCircle(HSB.s*255, (1 - HSB.b)*255);

	var HSL = hsb_to_hsl(HSB.h, HSB.s, HSB.b);
	first_hsl.value = hsl(HSL.h, HSL.s, HSL.l);
}


first_hsl.onkeyup = function(){
	changeHSL(first_hsl.value.trim());
};

first_rgb.onkeyup = function(){
	changeRGB(first_rgb.value);
};

first_hsl.onkeyup();


function moveCircle(x, y) {
	x = Math.min(x, black_layer.width.baseVal.value);
	x = Math.max(0, x);
	y = Math.min(y, black_layer.height.baseVal.value);
	y = Math.max(0, y);
	x += OFFSET;
	y += OFFSET;
	c.setAttribute("cx", x);
	c.setAttribute("cy", y);
}


var out = $("out");

var pressed = false;
var pointer_x, pointer_y;
var start_x, start_y;
var cx, cy;

var focused;
document.onfocus=function(e){
	focused=e.target;
};

document.onblur=function(){
	focused=null;
};


function updateSB(x, y) {
	var s = (x - OFFSET)/255;
	var b = 1 - (y - OFFSET)/255;
	var HSL = hsb_to_hsl(first_hsl.hsv.v, s, b);
	first_sample.style.backgroundColor = hsl(first_hsl.hsv.h, HSL.s, HSL.l);

	var RGB = hsl2rgb(HSL.h, HSL.s, HSL.l);

	first_rgb.value = rgb(RGB.r, RGB.g, RGB.b);
	first_rgb_hex.value = RGB.hex;
	first_hsl.value = hsl(first_hsl.hsv.h, Math.round(HSL.s), Math.round(HSL.l))
}

function updateCirclePosition(e) {
	if (!pressed) return;

	var delta_x = e.pageX - start_x;
	var delta_y = e.pageY - start_y;

	var x = cx + delta_x;
	var y = cy + delta_y;

	if (x < OFFSET)
		x = OFFSET;
	else if (x > OFFSET + black_layer.width.baseVal.value)
		x = OFFSET + black_layer.width.baseVal.value;

	if (y < OFFSET)
		y = OFFSET;
	else if (y > OFFSET + black_layer.height.baseVal.value)
		y = OFFSET + black_layer.width.baseVal.value;

	c.setAttribute("cx", x);
	c.setAttribute("cy", y);

	updateSB(x, y)
}

black_layer.onmousedown = function(e){
	pressed = true;
	cx = e.offsetX;
	cy = e.offsetY;
	moveCircle(cx, cy);
	updateSB(cx, cy);
	start_x = pointer_x = e.pageX;
	start_y = pointer_y = e.pageY;
	return false;
};

document.onmousemove = function(e) {
	if (pressed) {
		updateCirclePosition(e);
	}
};

document.onmouseup = function(e) {
	updateCirclePosition(e);
	pressed = false;
};


changeHSL(first_hsl.value);
