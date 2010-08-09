function max(){
	return Math.max.apply(Math, arguments)
}

function min(){
	return Math.min.apply(Math, arguments)
}

function hsl(h, s, l) {
	return "hsl("+
		Math.round(h) + ", " +
		Math.round(s) + "%, " +
		Math.round(l) +"%)";
}
function rgb(r, g, b) {
	return "rgb("+
		Math.round(r) + "," +
		Math.round(g) + "," +
		Math.round(b) +")";
}


var rg = /^(?=[\da-f]$)/;

/**
 * @see http://github.com/DmitryBaranovskiy/raphael/blob/master/raphael.js
 */
function hsl2rgb(h, s, l) {
	if (h > 1 || s > 1 || l > 1) {
		h /= 255;
		s /= 255;
		l /= 255;
	}
	var rgb = {},
		channels = ["r", "g", "b"],
		t2, t1, t3, r, g, b;
	if (!s) {
		rgb = {
			r: l,
			g: l,
			b: l
		};
	} else {
		if (l < .5) {
			t2 = l * (1 + s);
		} else {
			t2 = l + s - l * s;
		}
		t1 = 2 * l - t2;
		for (var i = 0, ii = channels.length; i < ii; i++) {
			t3 = h + 1 / 3 * -(i - 1);
			t3 < 0 && t3++;
			t3 > 1 && t3--;
			if (t3 * 6 < 1) {
				rgb[channels[i]] = t1 + (t2 - t1) * 6 * t3;
			} else if (t3 * 2 < 1) {
				rgb[channels[i]] = t2;
			} else if (t3 * 3 < 2) {
				rgb[channels[i]] = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
			} else {
				rgb[channels[i]] = t1;
			}
		}
	}
	rgb.r *= 255;
	rgb.g *= 255;
	rgb.b *= 255;
	rgb.hex = rgb2hex(rgb);
	return rgb;
}

function rgb2hex(r, g, b) {
	if (typeof r == "object") {
		g = r.g;
		b = r.b;
		r = r.r;
	}
	r = (~~r).toString(16);
	g = (~~g).toString(16);
	b = (~~b).toString(16);
	r = r.replace(rg, "0");
	g = g.replace(rg, "0");
	b = b.replace(rg, "0");
	return "#" + r + g + b;
}

function hsv_to_hsl(h, s, v) {
	if (v === 0 || s === 0 && v === 1)
		return {h:h, s:s, l:v};

	var hsl = {h:h};
	hsl.l = (2 - s) * v;
	hsl.s = s * v;

	if (hsl.l <= 1 && hsl.l > 0)
		hsl.s /= hsl.l;
	else
		hsl.s /= 2 - hsl.l;

	hsl.l /= 2;

	return hsl;
}

function hsb_to_hsl(h, s, b) {
	var hsl = hsv_to_hsl(h, s, b);
	hsl.s *= 100;
	hsl.l *= 100;
	return hsl
}

function hsl_to_hsv(h, s, l) {
	var hsv = {h: h};
	if (l === 0 && s === 0) {
		hsv.s = hsv.v = 0
	} else {
		l *= 2;
		s *= (l <= 1)? l : 2 - l;
		hsv.v = (l + s) / 2;
		hsv.s = (2 * s) / (l + s);
	}
	return hsv
}

function hsl_to_hsb(h, s, l) {
	var hsv = hsl_to_hsv(h, s/100, l/100);
	hsv.v *= 100;
	hsv.s *= 100;
	return hsv
}

function rgb2hsb(red, green, blue) {
	if (red > 1 || green > 1 || blue > 1) {
		red /= 255;
		green /= 255;
		blue /= 255;
	}
	var mx = max(red, green, blue),
		mn = min(red, green, blue),
		hue,
		saturation,
		brightness = mx;
	if (mn == mx) {
		return {h: 0, s: 0, b: mx};
	} else {
		var delta = (mx - mn);
		saturation = delta / mx;
		if (red == mx) {
			hue = (green - blue) / delta;
		} else if (green == mx) {
			hue = 2 + ((blue - red) / delta);
		} else {
			hue = 4 + ((red - green) / delta);
		}
		hue /= 6;
		hue < 0 && hue++;
		hue > 1 && hue--;
	}
	return {h: hue, s: saturation, b: brightness};
}


function $(id) {
	return document.getElementById(id)
}

if (!MouseEvent.prototype.offsetX) {
	MouseEvent.prototype.__defineGetter__("offsetX", function(){
		var x = parseInt(this.target.getAttribute("x")) || 0;
		return this.clientX - this.target.getBoundingClientRect().left + x;
	})
}
if (!MouseEvent.prototype.offsetY) {
	MouseEvent.prototype.__defineGetter__("offsetY", function(){
		var y = parseInt(this.target.getAttribute("y")) || 0;
		return this.clientY - this.target.getBoundingClientRect().top + y;
	})
}

/**
 * @param {string} text such as "rgb(1,2,0)"
 * @return {Array} [1, 2, 0]
 */
function parseTriple(text) {
	return text.match(/\d+/g).map(function(d){
		return parseFloat(d)
	});
}