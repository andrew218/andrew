var EventTools = new Object;
EventTools.addEventHandler = function(b, c, a) {
	if (b.addEventListener) {
		b.addEventListener(c, a, false)
	} else {
		if (b.attachEvent) {
			b.attachEvent("on" + c, a)
		} else {
			b["on" + c] = a
		}
	}
};
EventTools.removeEventHandler = function(b, c, a) {
	if (b.removeEventListener) {
		b.removeEventListener(c, a, false)
	} else {
		if (b.detachEvent) {
			b.detachEvent("on" + c, a)
		} else {
			b["on" + c] = null
		}
	}
};
EventTools.formatEvent = function(b) {
	if (typeof b.charCode == "undefined") {
		b.charCode = (b.type == "keypress") ? b.keyCode : 0;
		b.isChar = (b.charCode > 0)
	}
	if (b.srcElement && !b.target) {
		b.eventPhase = 2;
		var a = getDocumentScroll();
		b.pageX = b.clientX + a.scrollLeft - document.body.clientLeft;
		b.pageY = b.clientY + a.scrollTop - document.body.clientTop;
		if (!b.preventDefault) {
			b.preventDefault = function() {
				this.returnValue = false
			}
		}
		if (b.type == "mouseout") {
			b.relatedTarget = b.toElement
		} else {
			if (b.type == "mouseover") {
				b.relatedTarget = b.fromElement
			}
		}
		if (!b.stopPropagation) {
			b.stopPropagation = function() {
				this.cancelBubble = true
			}
		}
		if (typeof b.button == " undefined ") {
			b.button = b.which
		}
		b.target = b.srcElement;
		b.time = (new Date).getTime()
	}
	return b
};
EventTools.getEvent = function() {
	if (window.event) {
		return this.formatEvent(window.event)
	} else {
		return EventTools.getEvent.caller.arguments[0]
	}
};
function checkExp(b, a) {
	return a.match(b)
}
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "")
};
function isWXNumber(a) {
	if (a == null || a == "") {
		return false
	}
	if (!checkExp(/^[+-]?\d+(\.\d+)?$/g, a)) {
		return false
	}
	return true
}
String.prototype.getBytesLength = function() {
	return this.replace(/[^\x00-\xff]/gi, "--").length
};
var XMLHttpREPORT = {
	_objPool : [],
	_getInstance : function() {
		for ( var a = 0; a < this._objPool.length; a++) {
			if (this._objPool[a].readyState == 0
					|| this._objPool[a].readyState == 4) {
				return this._objPool[a]
			}
		}
		this._objPool[this._objPool.length] = this._createObj();
		return this._objPool[this._objPool.length - 1]
	},
	_createObj : function() {
		if (window.XMLHttpRequest) {
			var a = new XMLHttpRequest()
		} else {
			var a = new ActiveXObject("Microsoft.XMLHTTP")
		}
		if (a.readyState == null) {
			a.readyState = 0;
			a.addEventListener("load", function() {
				a.readyState = 4;
				if (typeof a.onreadystatechange == "function") {
					a.onreadystatechange()
				}
			}, false)
		}
		return a
	},
	sendReq : function(method, url, data, callbackmethod, onErrorMethod,
			dataObj) {
		var objXMLHttp = this._createObj();
		with (objXMLHttp) {
			try {
				if (url.indexOf("?") > 0) {
					url += "&randnum=" + Math.random()
				} else {
					url += "?randnum=" + Math.random()
				}
				open(method, url, true);
				setRequestHeader("Content-Type",
						"application/x-www-form-urlencoded;charset=utf-8");
				send(data);
				onreadystatechange = function() {
					if (objXMLHttp.readyState == 4) {
						if (objXMLHttp.status == 200
								|| objXMLHttp.status == 304) {
							if (callbackmethod != null) {
								callbackmethod(objXMLHttp, dataObj)
							}
						} else {
							if (onErrorMethod != null) {
								onErrorMethod(objXMLHttp, dataObj)
							}
						}
					}
				}
			} catch (e) {
				alert(e)
			} finally {
			}
		}
	}
};
function sendAsynRequestToServer(e, b, d, a) {
	if (e == null || e == "") {
		return
	}
	var f = e.split("?");
	if (f == null || f.length <= 1) {
		f[1] = ""
	} else {
		if (f.length >= 2) {
			if (f.length > 2) {
				for ( var c = 2; c < f.length; c = c + 1) {
					f[1] = f[1] + "?" + f[c]
				}
			}
		}
	}
	XMLHttpREPORT.sendReq("POST", f[0], f[1], b, d, a)
}
function getDocumentSize() {
	if (document.compatMode == "BackCompat" && document.body) {
		return {
			width : document.body.clientWidth,
			height : document.body.clientHeight
		}
	} else {
		return {
			width : document.documentElement.clientWidth,
			height : document.documentElement.clientHeight
		}
	}
}
function getDocumentScroll() {
	var c = 0, b = 0, a = 0, d = 0;
	if (document.compatMode == "BackCompat" && document.body || isChrome) {
		c = document.body.scrollTop;
		b = document.body.scrollLeft;
		a = document.body.scrollWidth;
		d = document.body.scrollHeight
	} else {
		if (document.documentElement) {
			c = document.documentElement.scrollTop;
			b = document.documentElement.scrollLeft;
			a = document.documentElement.scrollWidth;
			d = document.documentElement.scrollHeight
		}
	}
	return {
		scrollTop : c,
		scrollLeft : b,
		scrollWidth : a,
		scrollHeight : d
	}
}
function getAllParentScrollOffsetValue(a) {
	var c = 0;
	var b = 0;
	a = a.offsetParent;
	while (a != null) {
		if (a.scrollLeft) {
			c += a.scrollLeft
		}
		if (a.scrollTop) {
			b += a.scrollTop
		}
		a = a.parentNode
	}
	return {
		scrollWidth : c,
		scrollHeight : b
	}
}
function getElementAbsolutePosition(d) {
	if (!d) {
		return null
	}
	var c = d;
	var b = c.offsetHeight;
	var g = c.offsetWidth;
	var f = 0;
	var e = 0;
	while (c != null) {
		f += c.offsetLeft;
		if (c.className == "cls-fixed-headerInner" && isIE) {
			if (c.style.right != null && c.style.right != "") {
				f = f - parseInt(c.style.right)
			}
		}
		e += c.offsetTop;
		c = c.offsetParent
	}
	var a = getAllParentScrollOffsetValue(d);
	if (a) {
		f = f - a.scrollWidth;
		e = e - a.scrollHeight
	}
	a = getDocumentScroll();
	if (a) {
		f = f + a.scrollLeft;
		e = e + a.scrollTop
	}
	return {
		top : e,
		left : f,
		width : g,
		height : b
	}
}
function removeSubStr(g, f, e, d) {
	if (g == null || g == "" || f == null || f == "" || e == null || e == "") {
		return g
	}
	if (d == null) {
		d = ""
	}
	var b = g.indexOf(f);
	while (b >= 0) {
		var c = g.substring(0, b);
		g = g.substring(b + f.length);
		b = g.indexOf(e);
		if (b < 0) {
			g = c;
			break
		}
		var a = g.substring(b + e.length);
		if (a == "") {
			g = c;
			break
		}
		g = c + d + a;
		b = g.indexOf(f)
	}
	return g
}
function getSubStrValue(e, d, c) {
	if (e == null || e == "" || d == null || d == "" || c == null || c == "") {
		return ""
	}
	var b = e.indexOf(d);
	if (b < 0) {
		return ""
	}
	var a = e.substring(b + d.length);
	b = a.indexOf(c);
	if (b >= 0) {
		a = a.substring(0, b)
	}
	return a
}
function isPositiveInteger(b) {
	if (b == null || b == "") {
		return false
	}
	var a = "^[1-9][0-9]*$";
	return b.match(a)
}
function paramdecode(a) {
	if (a == null || a == "") {
		return a
	}
	a = a.replace(/wx_QUOTE_wx/g, "'");
	a = a.replace(/wx_DBLQUOTE_wx/g, '"');
	a = a.replace(/wx_DOLLAR_wx/g, "$");
	return a
}
function jsonParamEncode(a, c) {
	if (a == null || a == "") {
		return a
	}
	var b = null;
	if (!c) {
		b = new RegExp("'", "g");
		a = a.replace(b, "wx_json_QUOTE_wx");
		b = new RegExp('"', "g");
		a = a.replace(b, "wx_json_DBLQUOTE_wx")
	}
	b = new RegExp("\n", "g");
	a = a.replace(b, "wx_json_NEWLINE_wx");
	return a
}
function jsonParamDecode(a) {
	if (a == null || a == "") {
		return a
	}
	var b = new RegExp("wx_json_QUOTE_wx", "g");
	a = a.replace(b, "'");
	b = new RegExp("wx_json_DBLQUOTE_wx", "g");
	a = a.replace(b, '"');
	b = new RegExp("wx_json_NEWLINE_wx", "g");
	a = a.replace(b, "\n");
	return a
}
function isEmptyMap(a) {
	if (a == null) {
		return true
	}
	for ( var b in a) {
		return false
	}
	return true
}
function getElementBgColor(b) {
	var a = b.style.backgroundColor;
	if (a != null && a != "") {
		return a
	}
	if (document.defaultView && document.defaultView.getComputedStyle) {
		var c = document.defaultView.getComputedStyle(b, null);
		if (c) {
			a = c.backgroundColor
		}
	} else {
		if (b.currentStyle) {
			a = b.currentStyle.backgroundColor
		}
	}
	if (a != null && a != "") {
		return a
	}
	return b.bgColor
}
function getParentElementObj(c, b) {
	if (!c || !b) {
		return null
	}
	var a = c.parentNode;
	if (!a) {
		return null
	}
	if (a.tagName == b) {
		return a
	} else {
		return getParentElementObj(a, b)
	}
}
function isElementOrChildElement(b, c) {
	while (b != null) {
		try {
			if (b.getAttribute("id") == c) {
				return true
			}
		} catch (a) {
			break
		}
		b = b.parentNode
	}
	return false
}
function getObjectByJsonString(jsonStr) {
	if (jsonStr == null || jsonStr == "" || jsonStr == "null") {
		return null
	}
	jsonStr = paramdecode(jsonStr);
	jsonStr = jsonParamEncode(jsonStr, true);
	var obj = eval("(" + jsonStr + ")");
	return obj
}
function postlinkurl(a, f) {
	if (a == null || a == "") {
		return
	}
	var i = document;
	var g = i.createElement("Form");
	g.method = "post";
	if (f === true) {
		g.setAttribute("target", "_blank")
	}
	a = paramdecode(a);
	var b = splitUrlAndParams(a, true);
	var c = b[0];
	var j = b[1];
	if (j != null) {
		var h;
		for ( var d in j) {
			if (d == null || d == "") {
				continue
			}
			h = j[d];
			if (h == null) {
				h = ""
			}
			var e = i.createElement("input");
			e.setAttribute("name", d);
			e.setAttribute("value", h);
			e.setAttribute("type", "hidden");
			g.appendChild(e)
		}
	}
	g.action = c;
	i.body.appendChild(g);
	g.submit();
	i.body.removeChild(g)
}
function replaceUrlParamValue(d, a, c, b) {
	if (d == null || d == "") {
		return d
	}
	if (a == null || a == "") {
		return d
	}
	d = removeSubStr(d, "?" + a + "=", "&", "?");
	d = removeSubStr(d, "&" + a + "=", "&", "&");
	if (c != null) {
		if (d.indexOf("?") > 0) {
			d = d + "&"
		} else {
			d = d + "?"
		}
		if (b !== true) {
			c = encodeURIComponent(c)
		}
		d = d + a + "=" + c
	}
	return d
}
function getParamValueFromUrl(c, a) {
	if (c == null || c == "") {
		return ""
	}
	if (a == null || a == "") {
		return ""
	}
	var b = getSubStrValue(c, "?" + a + "=", "&");
	if (b == "") {
		b = getSubStrValue(c, "&" + a + "=", "&")
	}
	return b
}
function splitUrlAndParams(a, k) {
	if (a == null || a == "") {
		return null
	}
	var l = new Array();
	var j = a.indexOf("?");
	if (j == 0) {
		return null
	}
	if (j < 0) {
		l[0] = a;
		l[1] = null;
		return l
	}
	var m = a.substring(j + 1);
	a = a.substring(0, j);
	if (m == "") {
		l[0] = a;
		l[1] = null;
		return l
	}
	var e = new Object();
	var c = m.split("&");
	var b, g, h;
	for ( var d = 0, f = c.length; d < f; d = d + 1) {
		b = c[d];
		if (b == null || b == "") {
			continue
		}
		j = b.indexOf("=");
		if (j == 0) {
			continue
		}
		if (j > 0) {
			g = b.substring(0, j);
			h = b.substring(j + 1);
			if (k) {
				h = decodeURIComponent(h)
			}
		} else {
			g = b;
			h = ""
		}
		e[g] = h
	}
	l[0] = a;
	l[1] = e;
	return l
}
function wx_ltrim(c, b) {
	if (c == null || c == "") {
		return c
	}
	if (b == null || b == "") {
		b = " "
	}
	var a = c.indexOf(b);
	while (a == 0) {
		c = c.substring(b.length);
		a = c.indexOf(b)
	}
	return c
}
function wx_rtrim(c, b) {
	if (c == null || c == "") {
		return c
	}
	if (b == null || b == "") {
		b = " "
	}
	var a = c.lastIndexOf(b);
	while (a >= 0 && a == c.length - b.length) {
		c = c.substring(0, c.length - b.length);
		a = c.lastIndexOf(b)
	}
	return c
}
function wx_trim(b, a) {
	b = wx_ltrim(b, a);
	b = wx_rtrim(b, a);
	return b
}
function getPropertyValueFromHtmlProperties(c, h) {
	var b = new Array();
	b[0] = c;
	b[1] = "";
	if (h == null || h == "" || c == null || c == "") {
		return b
	}
	c = " " + c;
	var a = c.toLowerCase().indexOf(" " + h + "=");
	if (a < 0) {
		return b
	}
	var e = "";
	var g = c.substring(0, a);
	var f = wx_trim(c.substring(a + (" " + h + "=").length));
	if (f.length > 0) {
		var d = f.substring(0, 1);
		if (d != "'" && d != '"') {
			d = " ";
			f = wx_trim(f)
		} else {
			f = f.substring(1)
		}
		a = f.indexOf(d);
		if (a < 0) {
			e = f.substring(0, f.length);
			f = ""
		} else {
			e = f.substring(0, a);
			f = f.substring(a + 1)
		}
	}
	b[0] = g + " " + f;
	b[1] = e;
	return b
}
function isArray(a) {
	return Object.prototype.toString.call(a) == "[object Array]"
}
function convertToArray(b) {
	if (b == null) {
		return null
	}
	if (isArray(b)) {
		return b
	}
	var a = new Array();
	a[a.length] = b;
	return a
}
function splitTextValues(g, e, a) {
	var d = g.search(e);
	if (d < 0) {
		return null
	}
	var b = g.substring(d, d + a);
	var f = "";
	if (d > 0) {
		f = g.substring(0, d)
	}
	var c = g.substring(d + a);
	return {
		start : f,
		mid : b,
		end : c
	}
}
function parseStringToArray(f, c, a) {
	if (f == null || f == "" || c == null) {
		return null
	}
	if (c == "") {
		return f
	}
	var e = new Array();
	var d = f.split(c);
	for ( var b = 0; b < d.length; b++) {
		if (d[b] == null || d[b] == "") {
			continue
		}
		if (a === false && wx_trim(d[b]) == "") {
			continue
		}
		e[e.length] = d[b]
	}
	return e
}
function parseTagContent(g, c, b) {
	if (g == null || g.indexOf(c) < 0 || g.indexOf(b) < 0) {
		return null
	}
	var a = g.indexOf(c);
	var h = g.substring(0, a);
	g = g.substring(a + c.length);
	a = g.indexOf(b);
	if (a < 0) {
		return null
	}
	var f = g.substring(0, a);
	var d = g.substring(a + b.length);
	var e = new Array();
	e[0] = f;
	e[1] = h + d;
	return e
}
function removeAllHtmlTag(a) {
	if (a == null) {
		return null
	}
	return a.replace(/<.*?>/gi, "")
}
var WX_TOOLS_LOADED = true;
