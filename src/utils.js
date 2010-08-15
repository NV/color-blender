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


var rg = /^(?=[\da-f]$)/;

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

function rgb2hex(r, g, b) {
	if (r.r > -1) {
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
	return {
		r: parseInt(hex.slice(1,3), 16),
		g: parseInt(hex.slice(3,5), 16),
		b: parseInt(hex.slice(5,7), 16)
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
		saturation,
		brightness = max;
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

function parseTriple(text) {
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
