var d = document,
webkit = "onwebkitanimationend" in window,
rg = /^(?=[\da-f]$)/;

function hsl(h, s, l) {
	if (h.h > -1) {
		s = h.s;
		l = h.l;
		h = h.h;
	}
	if (h<=1 & h>0 | s<=1 & s>0 | l<=1 & l>0) {
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

	return "rgb("+ [
		~~(r + .5),
		~~(g + .5),
		~~(b + .5)].join(", ")
	+")";
}




/**
 * @see http://github.com/DmitryBaranovskiy/raphael/blob/master/raphael.js
 */
function hsl2rgb(h, s, l) {
	if (h.h > -1) {
		s = h.s;
		l = h.l;
		h = h.h;
	}	
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


/**
 * >>> rgb2hex(255, 0, 153)
 * "#ff0099"
 * >>> rgb2hex({r: 5.123, g: 1.987, b: 3.871})
 * "#050103"
 * 
 * @param {Object|string} red
 * @param {string} green
 * @param {string} blue
 * @return {string}
 * @see http://jsperf.com/rgb-decimal-to-hex/5
 */
function rgb2hex(red, green, blue) {
	if (red.r > -1) {
		green = red.g;
		blue = red.b;
		red = red.r;
	}
	return "#" + (0x1000000 | blue | (green << 8) | (red << 16)).toString(16).slice(1);
}


/**
 * >>> hex2rgb("#ff0099")
 * {r:255, g:0, b:153}
 * 
 * @param {string} hex
 * @return {Object}
 * @see http://gist.github.com/547670
 */
function hex2rgb(hex) {
	var h = parseInt(hex.slice(1), 16);
	return {
		r: h >>> 16,
		g: (h >>> 8) & 0xff,
		b: h & 0xff
	}
}


function hsb2hsl(h, s, b) {
	if (h.h > -1) {
		s = h.s;
		b = h.b;
		h = h.h;
	}

	if (h > 1 | s > 1 | b > 1) {
		h /= 360;
		s /= 100;
		b /= 100;
	}

	if (!b || !s && b == 1)
		return {h:h, s:s, l:b};

	var hsl = {h:h};
	hsl.l = (2 - s) * b;
	hsl.s = s * b;

	if (hsl.l <= 1 && hsl.l > 0)
		hsl.s /= hsl.l;
	else
		hsl.s /= 2 - hsl.l;

	hsl.l /= 2;

	if (hsl.s > 1)
		hsl.s = 1;
	
	return hsl;
}

function hsl2hsb(h, s, l) {
	if (h.h > -1) {
		s = h.s;
		l = h.l;
		h = h.h;
	}
	if (h > 1 | s > 1 | l > 1) {
		h /= 360;
		s /= 100;
		l /= 100;
	}
	var hsb = {h: h};
	if (!l && !s) {
		hsb.s = hsb.b = 0;
	} else {
		l *= 2;
		s *= (l <= 1)? l : 2 - l;
		hsb.b = (l + s) / 2;
		hsb.s = (2 * s) / (l + s);
	}
	return hsb
}

function rgb2hsb(r, g, b) {
	if (r.r > -1) {
		g = r.g;
		b = r.b;
		r = r.r;
	}
	if (r > 1 || g > 1 || b > 1) {
		r /= 255;
		g /= 255;
		b /= 255;
	}
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b),
		hue,
		saturation;
	if (min == max) {
		return {h: 0, s: 0, b: max};
	} else {
		var delta = (max - min);
		saturation = delta / max;
		if (r == max) {
			hue = (g - b) / delta;
		} else if (g == max) {
			hue = 2 + ((b - r) / delta);
		} else {
			hue = 4 + ((r - g) / delta);
		}
		hue /= 6;
		if (hue < 0)
			hue++;
		else if (hue > 1)
			hue--;
	}
	return {h: hue, s: saturation, b: max};
}


function offsetX(event){
	return "offsetX" in event ? event.offsetX + (webkit ? 0 : 10)
         : event.clientX - event.target.getBoundingClientRect().left + 10;
}
function offsetY(event){
	return "offsetY" in event ? event.offsetY + (webkit ? 0 : 10)
         : event.clientY - event.target.getBoundingClientRect().top + 10;
}

function $(id) {
	return d.getElementById(id)
}

function p3(text) {
	var a = text.match(/\d+/g).map(function(d){
		return parseFloat(d)
	});
	return text[0] == "h" ? {
		h: a[0],
		s: a[1],
		l: a[2]
	} : {
		r: a[0],
		g: a[1],
		b: a[2]
	}
}

