var OFFSET = 10;

var color_first_hsl = $("color_first_hsl");
var color_first_rgb_hex = $("color_first_rgb_hex");
var color_first_rgb = $("color_first_rgb");
var color_first_sample = $("color_first_sample");
var color_last = $("color_last");

var bg = $("bg");
var paper = $("paper");
var c = $("c");
var black_layer = $("black_layer")


function setHue(h) {
	bg.setAttribute("fill", hsl(h, 100, 50))
}

function changeHSL(text) {
	color_first_sample.style.backgroundColor = text;

	var triple = parseTriple(text);
	var hsv = hsl_to_hsb(triple[0], triple[1], triple[2]);
	setHue(hsv.h);
	moveCircle(hsv.s*255/100, (100 - hsv.v)*255/100);

	var RGB = hsl2rgb(triple[0], triple[1], triple[2]);
	color_first_rgb.value = rgb(Math.round(RGB.r), Math.round(RGB.g), Math.round(RGB.b));
	color_first_rgb_hex.value = RGB.hex;

	color_first_hsl.hsv = hsv;
}

function changeRGB(text) {
	color_first_sample.style.backgroundColor = text;
	var triple = parseTriple(text);
	var hsv = hsl_to_hsb(triple[0], triple[1], triple[2]);
	setHue(hsv.h);
	moveCircle(hsv.s*255/100, (100 - hsv.v)*255/100);
}


color_first_hsl.onkeyup = function(){
	changeHSL(color_first_hsl.value.trim())
}
color_first_rgb.onkeyup = function(){
	changeRGB(color_first_rgb.value)
}
color_first_hsl.onkeyup()

var pressed = false;


function moveCircle(x, y) {
	x = Math.min(x, black_layer.width.baseVal.value);
	x = Math.max(0, x);
	y = Math.min(y, black_layer.height.baseVal.value);
	y = Math.max(0, y);
	x += OFFSET
	y += OFFSET
	c.setAttribute("cx", x);
	c.setAttribute("cy", y);
}


var out = $("out");

var pointer_x, pointer_y;
var start_x, start_y;
var cx, cy;

function updateHL(x, y) {
	var s = (x - OFFSET)/255;
	var b = 1 - (y - OFFSET)/255;
	var HSL = hsb_to_hsl(color_first_hsl.hsv.v, s, b);
	color_first_sample.style.backgroundColor = hsl(color_first_hsl.hsv.h, HSL.s, HSL.l);

	color_first_hsl.value = hsl(color_first_hsl.hsv.h, Math.round(HSL.s), Math.round(HSL.l))
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

	updateHL(x, y)
}




black_layer.onmousedown = function(e){
	pressed = true;
	cx = e.offsetX;
	cy = e.offsetY;
	moveCircle(cx, cy);
	updateHL(cx, cy);
	start_x = pointer_x = e.pageX;
	start_y = pointer_y = e.pageY;
	return false;
}

document.onmousemove = function(e) {
	if (pressed) {
		updateCirclePosition(e);
	}
}

document.onmouseup = function(e) {
	updateCirclePosition(e);
	pressed = false;
//	console.log(e)
}