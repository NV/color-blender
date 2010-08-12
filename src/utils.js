function hsl(h, s, l) {
	if (h.h > -1) {
		s = h.s;
		l = h.l;
		h = h.h;
	}
	if (h < 1 | s < 1 | l < 1) {
		h *= 360;
		s *= 100;
		l *= 100;
	}
	return "hsl("+
		~~(h + .5) + ", " +
		~~(s + .5) + "%, " +
		~~(l + .5) + "%)";
}

function rgb(r, g, b) {
	if (r.r > -1) {
		g = r.g;
		b = r.b;
		r = r.r;
	}
	if (r < 1 | g < 1 | b < 1) {
		r *= 255;
		g *= 255;
		b *= 255;
	}

	return "rgb("+ [
		~~(r + .5),
		~~(g + .5),
		~~(b + .5)].join(", ")
	+")";
}


var rg = /^(?=[\da-f]$)/;

/**
 * @see http://github.com/DmitryBaranovskiy/raphael/blob/master/raphael.js
 */
function hsl2rgb(h, s, l) {
	if (h > 1 || s > 1 || l > 1) {
		h /= 360;
		s /= 100;
		l /= 100;
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

function hex2rgb(hex) {
	return [
		parseInt(hex.slice(1,3), 16),
		parseInt(hex.slice(3,5), 16),
		parseInt(hex.slice(5,7), 16)
	]
}

function hsb2hsl(h, s, b) {
	if (h > 1 | s > 1 | b > 1) {
		h /= 360;
		s /= 100;
		b /= 100;
	}

	if (b === 0 || s === 0 && b === 1)
		return {h:h, s:s, l:b};

	var hsl = {h:h};
	hsl.l = (2 - s) * b;
	hsl.s = s * b;

	if (hsl.l <= 1 && hsl.l > 0)
		hsl.s /= hsl.l;
	else
		hsl.s /= 2 - hsl.l;

	hsl.l /= 2;

	return hsl;
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
	var max = Math.max(red, green, blue),
		min = Math.min(red, green, blue),
		hue,
		saturation,
		brightness = max;
	if (min == max) {
		return {h: 0, s: 0, b: max};
	} else {
		var delta = (max - min);
		saturation = delta / max;
		if (red == max) {
			hue = (green - blue) / delta;
		} else if (green == max) {
			hue = 2 + ((blue - red) / delta);
		} else {
			hue = 4 + ((red - green) / delta);
		}
		hue /= 6;
		if (hue < 0)
			hue++;
		else if (hue > 1)
			hue--;
	}
	return {h: hue, s: saturation, b: brightness};
}


function $(id) {
	return document.getElementById(id)
}

if (!MouseEvent.prototype.offsetX) {
	MouseEvent.prototype.__defineGetter__("offsetX", function(){
		return this.clientX - this.target.getBoundingClientRect().left + 10;
	})
}
if (!MouseEvent.prototype.offsetY) {
	MouseEvent.prototype.__defineGetter__("offsetY", function(){
		return this.clientY - this.target.getBoundingClientRect().top + 10;
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

Array.prototype.__defineGetter__("last", function(){
	return this[this.length - 1];
});
