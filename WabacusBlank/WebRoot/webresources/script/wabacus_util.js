var SAVING_ROWDATA_SEPERATOR = "_ROTAREPES_ATADWOR_GNIVAS_";
var SAVING_COLDATA_SEPERATOR = "_ROTAREPES_ATADLOC_GNIVAS_";
var SAVING_NAMEVALUE_SEPERATOR = "_ROTAREPES_EULAVEMAN_GNIVAS_";
var COL_NONDISPLAY_PERMISSION_PREX = "[NOISSIMREP_YALPSIDNON]";
var ReportFamily = {
	LIST : "list",
	DETAIL : "detail",
	EDITABLELIST : "editablelist",
	EDITABLELIST2 : "editablelist2",
	LISTFORM : "listform",
	EDITABLEDETAIL2 : "editabledetail2",
	EDITABLEDETAIL : "editabledetail",
	FORM : "form"
};
var WX_ROWSELECT_TYPE = {
	single : "single",
	multiple : "multiple",
	radiobox : "radiobox",
	checkbox : "checkbox",
	single_radiobox : "single-radiobox",
	multiple_checkbox : "multiple-checkbox",
	alltypes : {
		single : true,
		multiple : true,
		radiobox : true,
		checkbox : true,
		"single-radiobox" : true,
		"multiple-checkbox" : true
	}
};
var WX_selectedTrObjs;
var ART_DIALOG_OBJ = null;
function getWXInputBoxChildNode(e) {
	var c = e.childNodes;
	if (!c || c.length == 0) {
		return null
	}
	for ( var b = 0, a = c.length; b < a; b++) {
		if (c.item(b).nodeType != 1) {
			continue
		}
		if (isWXInputBoxNode(c.item(b))) {
			return c.item(b)
		}
		var d = getWXInputBoxChildNode(c.item(b));
		if (d != null) {
			return d
		}
	}
	return null
}
function isWXInputBoxNode(a) {
	if (a == null || a.nodeType != 1) {
		return false
	}
	var b = a.getAttribute("id");
	if (b == null || b.indexOf("_guid_") < 0) {
		return false
	}
	return b.indexOf("_wxcol_") > 0 || b.indexOf("_wxcondition_") > 0
}
function getInputBoxChildNode(d) {
	var c = d.childNodes;
	if (!c || c.length == 0) {
		return null
	}
	for ( var b = 0, a = c.length; b < a; b++) {
		if (c.item(b).nodeType != 1) {
			continue
		}
		return c.item(b)
	}
	return null
}
function getComponentMetadataObj(c) {
	if (c == null || c == "") {
		return null
	}
	var a = document.getElementById(c + "_metadata");
	if (a == null) {
		return null
	}
	var b = new Object();
	b.pageid = a.getAttribute("pageid");
	b.componentid = a.getAttribute("componentid");
	b.componentguid = c;
	b.refreshComponentGuid = a.getAttribute("refreshComponentGuid");
	b.componentTypeName = a.getAttribute("componentTypeName");
	b.metaDataSpanObj = a;
	return b
}
function getReportMetadataObj(a) {
	if (a == null || a == "") {
		return null
	}
	var c = getComponentMetadataObj(a);
	if (c == null) {
		return null
	}
	c.reportid = c.componentid;
	c.reportguid = a;
	c.reportfamily = c.metaDataSpanObj.getAttribute("reportfamily");
	var b = c.metaDataSpanObj.getAttribute("isSlaveReport");
	if (b == "true") {
		c.slave_reportid = c.reportid
	} else {
		c.slave_reportid = null
	}
	return c
}
function getInputboxMetadataObj(a) {
	if (a == null || a == "") {
		return null
	}
	if (a.lastIndexOf("__") > 0) {
		a = a.substring(0, a.lastIndexOf("__"))
	}
	return document.getElementById("span_" + a + "_span")
}
function getComponentUrl(a, d, f) {
	var b = document.getElementById(a + "_url_id");
	var e = b.getAttribute("value");
	if (f != null && f != "") {
		e = document.getElementById(getComponentGuidById(a, f) + "_url_id")
				.getAttribute("value")
	}
	if (!e || e == "") {
		wx_warn("\u83b7\u53d6\u7ec4\u4ef6URL\u5931\u8d25\uff0c\u6ca1\u6709\u53d6\u5230\u5176\u539f\u59cburl");
		return null
	}
	e = paramdecode(e);
	var c = b.getAttribute("ancestorPageUrls");
	if (c != null && c != "") {
		e = replaceUrlParamValue(e, "ancestorPageUrls", c)
	}
	if (d != null && d != "") {
		e = replaceUrlParamValue(e, "refreshComponentGuid", d)
	}
	if (f != null && f != "") {
		e = replaceUrlParamValue(e, "SLAVE_REPORTID", f)
	}
	return e
}
function resetComponentUrl(d, l, c, j) {
	if (c == null || c == "") {
		return c
	}
	var n = document;
	var o = getComponentGuidById(d, l);
	var f = getComponentMetadataObj(o);
	if (f == null) {
		return c
	}
	if (f.componentTypeName == "application.report") {
		var m = getReportMetadataObj(o);
		if (j == null || j == "" || j.indexOf("navigate") >= 0) {
			var e = null, b = null;
			if (j != null && j.indexOf("navigate.false") >= 0) {
				var b = m.metaDataSpanObj.getAttribute("navigate_reportid");
				if (b != null && b != "") {
					e = getParamValueFromUrl(c, b + "_PAGENO")
				}
			}
			c = removeReportNavigateInfosFromUrl(c, m, null);
			if (e != null && b != null) {
				c = c + "&" + b + "_DYNPAGENO=" + e
			}
		}
		if (j == null || j == "" || j.indexOf("searchbox") >= 0) {
			c = removeReportConditionBoxValuesFromUrl(c, m)
		}
	} else {
		if (f.componentTypeName == "container.tabspanel") {
			c = replaceUrlParamValue(c, l + "_selectedIndex", null)
		}
	}
	var g = f.metaDataSpanObj.getAttribute("childComponentIds");
	if (g != null && g != "") {
		var a = g.split(";");
		for ( var h = 0, k = a.length; h < k; h++) {
			if (a[h] == null || a[h] == "") {
				continue
			}
			c = resetComponentUrl(d, a[h], c)
		}
	}
	return c
}
function getInputboxParentElementObjByTagName(c, d) {
	if (c == null || d == null || d == "") {
		return null
	}
	if (c.dataObj != null && c.dataObj.parentTdObj != null) {
		return c.dataObj.parentTdObj
	}
	var a = c.parentNode;
	if (a == null) {
		return null
	}
	if (a.tagName != d) {
		return getInputboxParentElementObjByTagName(a, d)
	}
	if (d == "FONT") {
		var b = a.getAttribute("id");
		if (b == null || b.indexOf("font_") < 0 || b.indexOf("_guid_") < 0) {
			return getInputboxParentElementObjByTagName(a, d)
		}
	} else {
		if (d == "TD") {
			var e = a.getAttribute("id");
			if (e == null || e.indexOf("_td") < 0 || e.indexOf("_guid_") < 0) {
				return getInputboxParentElementObjByTagName(a, d)
			}
		}
	}
	return a
}
function getInputboxParentElementObj(c) {
	if (c == null) {
		return null
	}
	if (c.dataObj != null && c.dataObj.parentTdObj != null) {
		return c.dataObj.parentTdObj
	}
	var a = c.parentNode;
	if (a == null) {
		return null
	}
	if (a.tagName == "FONT") {
		var b = a.getAttribute("id");
		if (b != null && b.indexOf("font_") == 0 && b.indexOf("_guid_") > 0) {
			return a
		}
	} else {
		if (a.tagName == "TD") {
			var d = a.getAttribute("id");
			if (d != null && d.indexOf("_td") > 0 && d.indexOf("_guid_") > 0) {
				return a
			}
		}
	}
	return getInputboxParentElementObj(a)
}
function getReportguidByParentElementObj(a) {
	if (a == null) {
		return null
	}
	var b = null;
	if (a.tagName == "FONT") {
		b = a.getAttribute("name");
		if (b.indexOf("font_") != 0) {
			return null
		}
		b = b.substring("font_".length)
	} else {
		b = getReportGuidByInputboxId(a.getAttribute("id"))
	}
	return b
}
function getInputboxIdByParentElementObj(b) {
	if (b == null) {
		return null
	}
	var c = getReportguidByParentElementObj(b);
	b = getUpdateColSrcObj(b, c, b);
	var d = null;
	if (b.tagName == "FONT") {
		d = b.getAttribute("inputboxid")
	} else {
		if (b.tagName == "TD") {
			var e = b.getAttribute("id");
			var a = e.lastIndexOf("__td");
			if (a <= 0) {
				return null
			}
			if (a == e.length - "__td".length) {
				d = e.substring(0, a)
			} else {
				d = e.substring(0, a) + "__" + e.substring(a + "__td".length)
			}
		}
	}
	return d
}
function getRowIndexByRealInputboxId(b) {
	var d = -1;
	var a = b.lastIndexOf("__");
	if (a > 0) {
		var c = b.substring(a + 2);
		if (c != null && c != "") {
			d = parseInt(c, 10)
		}
	}
	return d
}
function wx_getAllColValueByParentElementObjs(h, c) {
	if (h == null || h.length == 0) {
		return null
	}
	var d = null, f, g, b;
	for ( var e = 0, a = h.length; e < a; e = e + 1) {
		f = h[e];
		b = f.getAttribute("value_name");
		if (b == null || b == "") {
			continue
		}
		if (c != null && c[b] != "true" && c[b] !== true) {
			continue
		}
		g = new Object();
		g.name = b;
		g.value = wx_getColValue(f);
		g.oldvalue = f.getAttribute("oldvalue");
		if (d == null) {
			d = new Object()
		}
		d[b] = g
	}
	return d
}
function wx_getAllSiblingColValuesByInputboxid(b, e) {
	if (b == null || b == "") {
		return null
	}
	var f = b.lastIndexOf("__") > 0 ? b.substring(b.lastIndexOf("__") + 2) : "";
	var a = getReportGuidByInputboxId(b);
	var d = f != "" ? document.getElementById(a + "_tr_" + f) : null;
	var c;
	if (d != null) {
		c = wx_getListReportColValuesInRow(d, createGetColDataObjByString(e))
	} else {
		c = getEditableReportColValues(getPageIdByComponentGuid(a),
				getComponentIdByGuid(a), createGetColDataObjByString(e), null)
	}
	return c
}
function createGetColDataObjByString(e) {
	if (e == null || e == "") {
		return null
	}
	var c = new Object();
	var a = e.split(";");
	var d = false;
	for ( var b = 0; b < a.length; b++) {
		if (a[b] == null || a[b] == "") {
			continue
		}
		c[a[b]] = true;
		d = true
	}
	return d ? c : null
}
function wx_getColValue(h) {
	if (h == null) {
		return null
	}
	var j = h.getAttribute("value_name");
	if (j == null || j == "") {
		return null
	}
	var g = h.getAttribute("value");
	if (h.tagName == "TD" && h.parentNode.tagName == "TR"
			&& h.parentNode.getAttribute("wx_not_in_currentpage") === "true") {
		return g
	}
	var c = getReportguidByParentElementObj(h);
	if (c != null && c != "") {
		var m = getReportMetadataObj(c);
		if (m != null) {
			var n = getInputboxIdByParentElementObj(h);
			if (n != null && n != "") {
				var f = getInputboxMetadataObj(n);
				if (f != null && f.getAttribute("displayonclick") !== "true") {
					var d = getUpdateColDestObj(h, c, null);
					if (d == null) {
						g = getInputBoxValueById(n)
					} else {
						g = getInputBoxLabelById(n)
					}
				}
			}
			var b = m.metaDataSpanObj.getAttribute(j + "_ongetvaluemethods");
			var a = getObjectByJsonString(b);
			if (a != null && a.methods != null) {
				var e = a.methods;
				if (e.length > 0) {
					for ( var k = 0, l = e.length; k < l; k++) {
						g = e[k].method(h, g)
					}
				}
			}
		}
	}
	return g
}
function getUpdateColDestObj(h, b, k) {
	var a = h.getAttribute("updatecolDest");
	if (a == null || a == "") {
		return k
	}
	var j = getReportMetadataObj(b);
	if (j == null) {
		return k
	}
	var d = j.reportfamily;
	var c = null;
	if (d == ReportFamily.EDITABLELIST2 || d == ReportFamily.LISTFORM) {
		var g = h.parentNode;
		c = g.getElementsByTagName("TD")
	} else {
		if (d == ReportFamily.EDITABLEDETAIL2) {
			var f = getParentElementObj(h, "TABLE");
			c = f.getElementsByTagName("TD")
		} else {
			if (d == ReportFamily.EDITABLEDETAIL || d == ReportFamily.FORM) {
				c = document.getElementsByName("font_" + b)
			}
		}
	}
	if (c == null) {
		return k
	}
	for ( var e = 0; e < c.length; e++) {
		if (c[e].getAttribute("value_name") == a) {
			return c[e]
		}
	}
	return k
}
function getUpdateColSrcObj(g, a, k) {
	var h = g.getAttribute("updatecolSrc");
	if (h == null || h == "") {
		return k
	}
	var b = null;
	var j = getReportMetadataObj(a);
	if (j == null) {
		return k
	}
	var c = j.reportfamily;
	if (c == ReportFamily.EDITABLELIST2 || c == ReportFamily.LISTFORM) {
		var f = g.parentNode;
		b = f.getElementsByTagName("TD")
	} else {
		if (c == ReportFamily.EDITABLEDETAIL2) {
			var e = getParentElementObj(g, "TABLE");
			b = e.getElementsByTagName("TD")
		} else {
			if (c == ReportFamily.EDITABLEDETAIL || c == ReportFamily.FORM) {
				b = document.getElementsByName("font_" + a)
			}
		}
	}
	if (b == null) {
		return k
	}
	for ( var d = 0; d < b.length; d++) {
		if (b[d].getAttribute("value_name") == h) {
			return b[d]
		}
	}
	return k
}
function getComponentGuidById(a, b) {
	if (b == null || b == "" || b == a) {
		return a
	}
	return a + WX_GUID_SEPERATOR + b
}
function getComponentIdByGuid(b) {
	if (b == null || b == "") {
		return null
	}
	var a = b.lastIndexOf(WX_GUID_SEPERATOR);
	if (a > 0) {
		return b.substring(a + WX_GUID_SEPERATOR.length)
	}
	return b
}
function getPageIdByComponentGuid(b) {
	if (b == null || b == "") {
		return null
	}
	var a = b.lastIndexOf(WX_GUID_SEPERATOR);
	if (a > 0) {
		return b.substring(0, a)
	}
	return b
}
function getReportGuidByInputboxId(d) {
	if (d == null || d == "") {
		return null
	}
	var b = d.indexOf(WX_GUID_SEPERATOR);
	var a = d.substring(0, b);
	var c = d.substring(b + WX_GUID_SEPERATOR.length);
	b = c.indexOf("_wxcol_");
	if (b <= 0) {
		b = c.indexOf("_wxcondition_")
	}
	if (b <= 0) {
		wx_alert("\u8f93\u5165\u6846ID\uff1a" + d
				+ "\u4e0d\u5408\u6cd5\uff0c\u6ca1\u6709\u5305\u542breportguid");
		return null
	}
	c = c.substring(0, b);
	return a + WX_GUID_SEPERATOR + c
}
function createTipElementObj(a) {
	var d = {
		owner : a,
		myContainer : null,
		timer : null
	};
	var c = document.createElement("span");
	c.className = "spanTipContainer";
	c.setAttribute("id", "id_" + parseInt((Math.random() * 100000))
			+ parseInt((Math.random() * 100000)));
	c.onmouseover = function() {
		this.clearIntervalFlag = false
	};
	c.onmouseout = function() {
		this.clearIntervalFlag = true
	};
	var b = getNearestParentComonentContentDivObj(a);
	if (b == null) {
		document.body.appendChild(c)
	} else {
		b.appendChild(c)
	}
	d.myContainer = c;
	d.show = function(l, k) {
		if (this.myContainer == null) {
			return
		}
		this.myContainer.innerHTML = l;
		if (k == null) {
			k = new Object()
		}
		var f = this.owner;
		if (f == null) {
			return
		}
		var m = getElementAbsolutePosition(f);
		this.myContainer.style.display = "block";
		this.myContainer.style.position = "absolute";
		if (k.width != null && k.width != "") {
			if (parseInt(k.width) == 0) {
				this.myContainer.style.width = m.width + "px"
			} else {
				this.myContainer.style.width = k.width
			}
		} else {
			try {
				this.myContainer.style.width = ""
			} catch (j) {
			}
		}
		if (k.height != null && k.height != "") {
			if (parseInt(k.height) == 0) {
				this.myContainer.style.height = m.height + "px"
			} else {
				this.myContainer.style.height = k.height
			}
		} else {
			try {
				this.myContainer.style.height = ""
			} catch (j) {
			}
		}
		if (k.color != null && k.color != "") {
			this.myContainer.style.color = k.color
		} else {
			try {
				this.myContainer.style.color = ""
			} catch (j) {
			}
		}
		if (k.bgcolor != null && k.bgcolor != "") {
			this.myContainer.style.backgroundColor = k.bgcolor
		} else {
			try {
				this.myContainer.style.backgroundColor = ""
			} catch (j) {
			}
		}
		if (k.position == "left") {
			var i = m.left - this.myContainer.offsetWidth;
			if (i < 0) {
				i = 0
			}
			this.myContainer.style.left = i + "px";
			this.myContainer.style.top = m.top + "px"
		} else {
			if (k.position == "right") {
				var i = m.left + m.width;
				this.myContainer.style.left = i + "px";
				this.myContainer.style.top = m.top + "px"
			} else {
				if (k.position == "top") {
					this.myContainer.style.left = m.left + "px";
					var h = m.top - this.myContainer.offsetHeight;
					if (h < 0) {
						h = 0
					}
					this.myContainer.style.top = h + "px"
				} else {
					if (k.position == "inner") {
						this.myContainer.style.left = m.left + "px";
						this.myContainer.style.top = m.top + "px"
					} else {
						this.myContainer.style.left = m.left + "px";
						this.myContainer.style.top = (m.top + m.height) + "px"
					}
				}
			}
		}
		this.myContainer.clearIntervalFlag = true;
		if (this.interval != null) {
			clearInterval(this.interval);
			this.interval = null
		}
		if (k.hide == null || parseInt(k.hide, 10) == 0) {
			WX_tipObjs_hideOnclick[this.myContainer.id] = this.myContainer;
			document.body.onmousedown = checkAndHideTipOnClick
		} else {
			if (parseInt(k.hide, 10) > 0) {
				var g = this.myContainer;
				this.interval = setInterval(function() {
					hideTipContainer(g)
				}, parseInt(k.hide, 10) * 1000)
			}
		}
	};
	return d
}
var WX_tipObjs_hideOnclick = new Object();
function checkAndHideTipOnClick(c) {
	var b = c ? c.target : event.srcElement;
	var d = false;
	var a;
	for ( var e in WX_tipObjs_hideOnclick) {
		a = WX_tipObjs_hideOnclick[e];
		if (a == null) {
			delete WX_tipObjs_hideOnclick[e]
		} else {
			if (isTipContainerOrChild(a, b)) {
				d = true
			} else {
				hideTipContainer(a)
			}
		}
	}
	if (d) {
		document.body.onmousedown = checkAndHideTipOnClick
	} else {
		document.body.onmousedown = null
	}
}
function isTipContainerOrChild(b, a) {
	if (b == null) {
		return false
	}
	while (a != null) {
		try {
			if (a.getAttribute("id") == b.getAttribute("id")) {
				return true
			}
		} catch (c) {
		}
		a = a.parentNode
	}
	return false
}
function hideTipContainer(b, a) {
	if (b == null) {
		return
	}
	if (a != null && parseInt(a) > 0) {
		b.clearIntervalFlag = true;
		if (b.interval != null) {
			clearInterval(b.interval)
		}
		b.interval = setInterval(function() {
			hideTipContainer(b)
		}, parseInt(a))
	} else {
		if (b.clearIntervalFlag !== false) {
			b.innerHTML = "";
			b.style.display = "none";
			b.enablehide = null;
			if (b.getAttribute("id") != null) {
				delete WX_tipObjs_hideOnclick[b.getAttribute("id")]
			}
			if (b.interval != null) {
				clearInterval(b.interval);
				b.interval = null
			}
		} else {
		}
	}
}
function getNearestParentComonentContentDivObj(a) {
	while (a != null) {
		if (a == document.body || a.tagName == "DIV" && a.id != null
				&& a.id.indexOf("WX_CONTENT_" == 0)) {
			return a
		}
		a = a.parentNode
	}
	return null
}
jQuery.fn.showLoading = function(n) {
	var m;
	var b = {
		addClass : "",
		beforeShow : "",
		afterShow : "",
		hPos : "center",
		vPos : "center",
		indicatorZIndex : 5001,
		overlayZIndex : 5000,
		parent : "",
		marginTop : 0,
		marginLeft : 0,
		overlayWidth : null,
		overlayHeight : null
	};
	jQuery.extend(b, n);
	var a = jQuery("<div></div>");
	var h = jQuery("<div></div>");
	if (b.indicatorID) {
		m = b.indicatorID
	} else {
		m = jQuery(this).attr("id")
	}
	jQuery(a).attr("id", "loading-indicator-" + m);
	jQuery(a).addClass("loading-indicator");
	if (b.addClass) {
		jQuery(a).addClass(b.addClass)
	}
	jQuery(h).css("display", "none");
	jQuery(document.body).append(h);
	jQuery(h).attr("id", "loading-indicator-" + m + "-overlay");
	jQuery(h).addClass("loading-indicator-overlay");
	if (b.addClass) {
		jQuery(h).addClass(b.addClass + "-overlay")
	}
	var c, k;
	var i = jQuery(this).css("border-top-width");
	var l = jQuery(this).css("border-left-width");
	i = isNaN(parseInt(i)) ? 0 : i;
	l = isNaN(parseInt(l)) ? 0 : l;
	var g = jQuery(this).offset().left + parseInt(l);
	var e = jQuery(this).offset().top + parseInt(i);
	if (b.overlayWidth !== null) {
		c = b.overlayWidth
	} else {
		c = parseInt(jQuery(this).width())
				+ parseInt(jQuery(this).css("padding-right"))
				+ parseInt(jQuery(this).css("padding-left"))
	}
	if (b.overlayHeight !== null) {
		k = b.overlayWidth
	} else {
		k = parseInt(jQuery(this).height())
				+ parseInt(jQuery(this).css("padding-top"))
				+ parseInt(jQuery(this).css("padding-bottom"))
	}
	jQuery(h).css("width", c.toString() + "px");
	jQuery(h).css("height", k.toString() + "px");
	jQuery(h).css("left", g.toString() + "px");
	jQuery(h).css("position", "absolute");
	jQuery(h).css("top", e.toString() + "px");
	jQuery(h).css("z-index", b.overlayZIndex);
	if (b.overlayCSS) {
		jQuery(h).css(b.overlayCSS)
	}
	jQuery(a).css("display", "none");
	jQuery(document.body).append(a);
	jQuery(a).css("position", "absolute");
	jQuery(a).css("z-index", b.indicatorZIndex);
	var f = e;
	if (b.marginTop) {
		f += parseInt(b.marginTop)
	}
	var j = g;
	if (b.marginLeft) {
		j += parseInt(b.marginTop)
	}
	if (b.hPos.toString().toLowerCase() == "center") {
		jQuery(a).css(
				"left",
				(j + ((jQuery(h).width() - parseInt(jQuery(a).width())) / 2))
						.toString()
						+ "px")
	} else {
		if (b.hPos.toString().toLowerCase() == "left") {
			jQuery(a).css(
					"left",
					(j + parseInt(jQuery(h).css("margin-left"))).toString()
							+ "px")
		} else {
			if (b.hPos.toString().toLowerCase() == "right") {
				jQuery(a).css(
						"left",
						(j + (jQuery(h).width() - parseInt(jQuery(a).width())))
								.toString()
								+ "px")
			} else {
				jQuery(a).css("left", (j + parseInt(b.hPos)).toString() + "px")
			}
		}
	}
	if (b.vPos.toString().toLowerCase() == "center") {
		jQuery(a).css(
				"top",
				(f + ((jQuery(h).height() - parseInt(jQuery(a).height())) / 2))
						.toString()
						+ "px")
	} else {
		if (b.vPos.toString().toLowerCase() == "top") {
			jQuery(a).css("top", f.toString() + "px")
		} else {
			if (b.vPos.toString().toLowerCase() == "bottom") {
				jQuery(a)
						.css(
								"top",
								(f + (jQuery(h).height() - parseInt(jQuery(a)
										.height()))).toString()
										+ "px")
			} else {
				jQuery(a).css("top", (f + parseInt(b.vPos)).toString() + "px")
			}
		}
	}
	if (b.css) {
		jQuery(a).css(b.css)
	}
	var d = {
		overlay : h,
		indicator : a,
		element : this
	};
	if (typeof (b.beforeShow) == "function") {
		b.beforeShow(d)
	}
	jQuery(h).show();
	jQuery(a).show();
	if (typeof (b.afterShow) == "function") {
		b.afterShow(d)
	}
	return this
};
jQuery.fn.hideLoading = function(a) {
	var b = {};
	jQuery.extend(b, a);
	if (b.indicatorID) {
		indicatorID = b.indicatorID
	} else {
		indicatorID = jQuery(this).attr("id")
	}
	jQuery(document.body).find("#loading-indicator-" + indicatorID).remove();
	jQuery(document.body)
			.find("#loading-indicator-" + indicatorID + "-overlay").remove();
	return this
};
var WX_UTIL_LOADED = true;
