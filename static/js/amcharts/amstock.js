if (!AmCharts)var AmCharts = {};
AmCharts.inheriting = {};
AmCharts.Class = function (a) {
    var b = function () {
        arguments[0] !== AmCharts.inheriting && (this.events = {}, this.construct.apply(this, arguments))
    };
    a.inherits ? (b.prototype = new a.inherits(AmCharts.inheriting), b.base = a.inherits.prototype, delete a.inherits) : (b.prototype.createEvents = function () {
        for (var a = 0, b = arguments.length; a < b; a++)this.events[arguments[a]] = []
    }, b.prototype.listenTo = function (a, b, c) {
        a.events[b].push({handler: c, scope: this})
    }, b.prototype.addListener = function (a, b, c) {
        this.events[a].push({handler: b, scope: c})
    },
        b.prototype.removeListener = function (a, b, c) {
            a = a.events[b];
            for (b = a.length - 1; 0 <= b; b--)a[b].handler === c && a.splice(b, 1)
        }, b.prototype.fire = function (a, b) {
        for (var c = this.events[a], g = 0, h = c.length; g < h; g++) {
            var k = c[g];
            k.handler.call(k.scope, b)
        }
    });
    for (var c in a)b.prototype[c] = a[c];
    return b
};
AmCharts.charts = [];
AmCharts.addChart = function (a) {
    AmCharts.charts.push(a)
};
AmCharts.removeChart = function (a) {
    for (var b = AmCharts.charts, c = b.length - 1; 0 <= c; c--)b[c] == a && b.splice(c, 1)
};
AmCharts.IEversion = 0;
-1 != navigator.appVersion.indexOf("MSIE") && document.documentMode && (AmCharts.IEversion = Number(document.documentMode));
if (document.addEventListener || window.opera)AmCharts.isNN = !0, AmCharts.isIE = !1, AmCharts.dx = 0.5, AmCharts.dy = 0.5;
document.attachEvent && (AmCharts.isNN = !1, AmCharts.isIE = !0, 9 > AmCharts.IEversion && (AmCharts.dx = 0, AmCharts.dy = 0));
window.chrome && (AmCharts.chrome = !0);
AmCharts.handleResize = function () {
    for (var a = AmCharts.charts, b = 0; b < a.length; b++) {
        var c = a[b];
        c && c.div && c.handleResize()
    }
};
AmCharts.handleMouseUp = function (a) {
    for (var b = AmCharts.charts, c = 0; c < b.length; c++) {
        var d = b[c];
        d && d.handleReleaseOutside(a)
    }
};
AmCharts.handleMouseMove = function (a) {
    for (var b = AmCharts.charts, c = 0; c < b.length; c++) {
        var d = b[c];
        d && d.handleMouseMove(a)
    }
};
AmCharts.resetMouseOver = function () {
    for (var a = AmCharts.charts, b = 0; b < a.length; b++) {
        var c = a[b];
        c && (c.mouseIsOver = !1)
    }
};
AmCharts.onReadyArray = [];
AmCharts.ready = function (a) {
    AmCharts.onReadyArray.push(a)
};
AmCharts.handleLoad = function () {
    for (var a = AmCharts.onReadyArray, b = 0; b < a.length; b++)(0, a[b])()
};
AmCharts.useUTC = !1;
AmCharts.updateRate = 40;
AmCharts.uid = 0;
AmCharts.getUniqueId = function () {
    AmCharts.uid++;
    return "AmChartsEl-" + AmCharts.uid
};
AmCharts.isNN && (document.addEventListener("mousemove", AmCharts.handleMouseMove, !0), window.addEventListener("resize", AmCharts.handleResize, !0), document.addEventListener("mouseup", AmCharts.handleMouseUp, !0), window.addEventListener("load", AmCharts.handleLoad, !0));
AmCharts.isIE && (document.attachEvent("onmousemove", AmCharts.handleMouseMove), window.attachEvent("onresize", AmCharts.handleResize), document.attachEvent("onmouseup", AmCharts.handleMouseUp), window.attachEvent("onload", AmCharts.handleLoad));
AmCharts.clear = function () {
    var a = AmCharts.charts;
    if (a)for (var b = 0; b < a.length; b++)a[b].clear();
    AmCharts.charts = null;
    AmCharts.isNN && (document.removeEventListener("mousemove", AmCharts.handleMouseMove, !0), window.removeEventListener("resize", AmCharts.handleResize, !0), document.removeEventListener("mouseup", AmCharts.handleMouseUp, !0), window.removeEventListener("load", AmCharts.handleLoad, !0));
    AmCharts.isIE && (document.detachEvent("onmousemove", AmCharts.handleMouseMove), window.detachEvent("onresize", AmCharts.handleResize),
        document.detachEvent("onmouseup", AmCharts.handleMouseUp), window.detachEvent("onload", AmCharts.handleLoad))
};
AmCharts.AmChart = AmCharts.Class({
    construct: function () {
        this.version = "2.10.7";
        AmCharts.addChart(this);
        this.createEvents("dataUpdated", "init", "rendered");
        this.height = this.width = "100%";
        this.dataChanged = !0;
        this.chartCreated = !1;
        this.previousWidth = this.previousHeight = 0;
        this.backgroundColor = "#FFFFFF";
        this.borderAlpha = this.backgroundAlpha = 0;
        this.color = this.borderColor = "#000000";
        this.fontFamily = "Verdana";
        this.fontSize = 11;
        this.numberFormatter = {precision: -1, decimalSeparator: ".", thousandsSeparator: ","};
        this.percentFormatter =
        {precision: 2, decimalSeparator: ".", thousandsSeparator: ","};
        this.labels = [];
        this.allLabels = [];
        this.titles = [];
        this.marginRight = this.marginLeft = this.autoMarginOffset = 0;
        this.timeOuts = [];
        var a = document.createElement("div"), b = a.style;
        b.overflow = "hidden";
        b.position = "relative";
        b.textAlign = "left";
        this.chartDiv = a;
        a = document.createElement("div");
        b = a.style;
        b.overflow = "hidden";
        b.position = "relative";
        b.textAlign = "left";
        this.legendDiv = a;
        this.balloon = new AmCharts.AmBalloon;
        this.balloon.chart = this;
        this.titleHeight = 0;
        this.prefixesOfBigNumbers = [{number: 1E3, prefix: "k"}, {number: 1E6, prefix: "M"}, {
            number: 1E9,
            prefix: "G"
        }, {number: 1E12, prefix: "T"}, {number: 1E15, prefix: "P"}, {number: 1E18, prefix: "E"}, {
            number: 1E21,
            prefix: "Z"
        }, {number: 1E24, prefix: "Y"}];
        this.prefixesOfSmallNumbers = [{number: 1E-24, prefix: "y"}, {number: 1E-21, prefix: "z"}, {
            number: 1E-18,
            prefix: "a"
        }, {number: 1E-15, prefix: "f"}, {number: 1E-12, prefix: "p"}, {number: 1E-9, prefix: "n"}, {
            number: 1E-6,
            prefix: "\u03bc"
        }, {number: 0.001, prefix: "m"}];
        this.panEventsEnabled = !1;
        AmCharts.bezierX =
            3;
        AmCharts.bezierY = 6;
        this.product = "amcharts"
    }, drawChart: function () {
        this.drawBackground();
        this.redrawLabels();
        this.drawTitles()
    }, drawBackground: function () {
        AmCharts.remove(this.background);
        var a = this.container, b = this.backgroundColor, c = this.backgroundAlpha, d = this.set, e = this.updateWidth();
        this.realWidth = e;
        var f = this.updateHeight();
        this.realHeight = f;
        this.background = b = AmCharts.polygon(a, [0, e - 1, e - 1, 0], [0, 0, f - 1, f - 1], b, c, 1, this.borderColor, this.borderAlpha);
        d.push(b);
        if (b = this.backgroundImage)this.path && (b =
            this.path + b), this.bgImg = a = a.image(b, 0, 0, e, f), d.push(a)
    }, drawTitles: function () {
        var a = this.titles;
        if (AmCharts.ifArray(a)) {
            var b = 20, c;
            for (c = 0; c < a.length; c++) {
                var d = a[c], e = d.color;
                void 0 === e && (e = this.color);
                var f = d.size;
                isNaN(d.alpha);
                var g = this.marginLeft, e = AmCharts.text(this.container, d.text, e, this.fontFamily, f);
                e.translate(g + (this.realWidth - this.marginRight - g) / 2, b);
                g = !0;
                void 0 !== d.bold && (g = d.bold);
                g && e.attr({"font-weight": "bold"});
                b += f + 6;
                this.freeLabelsSet.push(e)
            }
        }
    }, write: function (a) {
        var b = this.balloon;
        b && !b.chart && (b.chart = this);
        a = "object" != typeof a ? document.getElementById(a) : a;
        a.innerHTML = "";
        this.div = a;
        a.style.overflow = "hidden";
        a.style.textAlign = "left";
        var b = this.chartDiv, c = this.legendDiv, d = this.legend, e = c.style, f = b.style;
        this.measure();
        var g, h;
        if (d)switch (d.position) {
            case "bottom":
                a.appendChild(b);
                a.appendChild(c);
                break;
            case "top":
                a.appendChild(c);
                a.appendChild(b);
                break;
            case "absolute":
                g = document.createElement("div");
                h = g.style;
                h.position = "relative";
                h.width = a.style.width;
                h.height = a.style.height;
                a.appendChild(g);
                e.position = "absolute";
                f.position = "absolute";
                void 0 !== d.left && (e.left = d.left + "px");
                void 0 !== d.right && (e.right = d.right + "px");
                void 0 !== d.top && (e.top = d.top + "px");
                void 0 !== d.bottom && (e.bottom = d.bottom + "px");
                d.marginLeft = 0;
                d.marginRight = 0;
                g.appendChild(b);
                g.appendChild(c);
                break;
            case "right":
                g = document.createElement("div");
                h = g.style;
                h.position = "relative";
                h.width = a.style.width;
                h.height = a.style.height;
                a.appendChild(g);
                e.position = "relative";
                f.position = "absolute";
                g.appendChild(b);
                g.appendChild(c);
                break;
            case "left":
                g = document.createElement("div");
                h = g.style;
                h.position = "relative";
                h.width = a.style.width;
                h.height = a.style.height;
                a.appendChild(g);
                e.position = "absolute";
                f.position = "relative";
                g.appendChild(b);
                g.appendChild(c);
                break;
            case "outside":
                a.appendChild(b)
        } else a.appendChild(b);
        this.listenersAdded || (this.addListeners(), this.listenersAdded = !0);
        this.initChart()
    }, createLabelsSet: function () {
        AmCharts.remove(this.labelsSet);
        this.labelsSet = this.container.set();
        this.freeLabelsSet.push(this.labelsSet)
    },
    initChart: function () {
        this.divIsFixed = AmCharts.findIfFixed(this.chartDiv);
        this.previousHeight = this.divRealHeight;
        this.previousWidth = this.divRealWidth;
        this.destroy();
        var a = 0;
        document.attachEvent && !window.opera && (a = 1);
        this.dmouseX = this.dmouseY = 0;
        var b = document.getElementsByTagName("html")[0];
        b && window.getComputedStyle && (b = window.getComputedStyle(b, null)) && (this.dmouseY = AmCharts.removePx(b.getPropertyValue("margin-top")), this.dmouseX = AmCharts.removePx(b.getPropertyValue("margin-left")));
        this.mouseMode =
            a;
        this.container = new AmCharts.AmDraw(this.chartDiv, this.realWidth, this.realHeight);
        if (AmCharts.VML || AmCharts.SVG)a = this.container, this.set = a.set(), this.gridSet = a.set(), this.graphsBehindSet = a.set(), this.bulletBehindSet = a.set(), this.columnSet = a.set(), this.graphsSet = a.set(), this.trendLinesSet = a.set(), this.axesLabelsSet = a.set(), this.axesSet = a.set(), this.cursorSet = a.set(), this.scrollbarsSet = a.set(), this.bulletSet = a.set(), this.freeLabelsSet = a.set(), this.balloonsSet = a.set(), this.balloonsSet.setAttr("id",
            "balloons"), this.zoomButtonSet = a.set(), this.linkSet = a.set(), this.drb(), this.renderFix()
    }, measure: function () {
        var a = this.div, b = this.chartDiv, c = a.offsetWidth, d = a.offsetHeight, e = this.container;
        a.clientHeight && (c = a.clientWidth, d = a.clientHeight);
        var f = AmCharts.removePx(AmCharts.getStyle(a, "padding-left")), g = AmCharts.removePx(AmCharts.getStyle(a, "padding-right")), h = AmCharts.removePx(AmCharts.getStyle(a, "padding-top")), k = AmCharts.removePx(AmCharts.getStyle(a, "padding-bottom"));
        isNaN(f) || (c -= f);
        isNaN(g) ||
        (c -= g);
        isNaN(h) || (d -= h);
        isNaN(k) || (d -= k);
        f = a.style;
        a = f.width;
        f = f.height;
        -1 != a.indexOf("px") && (c = AmCharts.removePx(a));
        -1 != f.indexOf("px") && (d = AmCharts.removePx(f));
        a = AmCharts.toCoordinate(this.width, c);
        f = AmCharts.toCoordinate(this.height, d);
        if (a != this.previousWidth || f != this.previousHeight)b.style.width = a + "px", b.style.height = f + "px", e && e.setSize(a, f), this.balloon.setBounds(2, 2, a - 2, f);
        this.realWidth = a;
        this.realHeight = f;
        this.divRealWidth = c;
        this.divRealHeight = d
    }, destroy: function () {
        this.chartDiv.innerHTML =
            "";
        this.clearTimeOuts()
    }, clearTimeOuts: function () {
        var a = this.timeOuts;
        if (a) {
            var b;
            for (b = 0; b < a.length; b++)clearTimeout(a[b])
        }
        this.timeOuts = []
    }, clear: function (a) {
        AmCharts.callMethod("clear", [this.chartScrollbar, this.scrollbarV, this.scrollbarH, this.chartCursor]);
        this.chartCursor = this.scrollbarH = this.scrollbarV = this.chartScrollbar = null;
        this.clearTimeOuts();
        this.container && (this.container.remove(this.chartDiv), this.container.remove(this.legendDiv));
        a || AmCharts.removeChart(this)
    }, setMouseCursor: function (a) {
        "auto" ==
        a && AmCharts.isNN && (a = "default");
        this.chartDiv.style.cursor = a;
        this.legendDiv.style.cursor = a
    }, redrawLabels: function () {
        this.labels = [];
        var a = this.allLabels;
        this.createLabelsSet();
        var b;
        for (b = 0; b < a.length; b++)this.drawLabel(a[b])
    }, drawLabel: function (a) {
        if (this.container) {
            var b = a.y, c = a.text, d = a.align, e = a.size, f = a.color, g = a.rotation, h = a.alpha, k = a.bold, l = AmCharts.toCoordinate(a.x, this.realWidth), b = AmCharts.toCoordinate(b, this.realHeight);
            l || (l = 0);
            b || (b = 0);
            void 0 === f && (f = this.color);
            isNaN(e) && (e = this.fontSize);
            d || (d = "start");
            "left" == d && (d = "start");
            "right" == d && (d = "end");
            "center" == d && (d = "middle", g ? b = this.realHeight - b + b / 2 : l = this.realWidth / 2 - l);
            void 0 === h && (h = 1);
            void 0 === g && (g = 0);
            b += e / 2;
            c = AmCharts.text(this.container, c, f, this.fontFamily, e, d, k, h);
            c.translate(l, b);
            0 !== g && c.rotate(g);
            a.url && (c.setAttr("cursor", "pointer"), c.click(function () {
                AmCharts.getURL(a.url)
            }));
            this.labelsSet.push(c);
            this.labels.push(c)
        }
    }, addLabel: function (a, b, c, d, e, f, g, h, k, l) {
        a = {
            x: a, y: b, text: c, align: d, size: e, color: f, alpha: h, rotation: g, bold: k,
            url: l
        };
        this.container && this.drawLabel(a);
        this.allLabels.push(a)
    }, clearLabels: function () {
        var a = this.labels, b;
        for (b = a.length - 1; 0 <= b; b--)a[b].remove();
        this.labels = [];
        this.allLabels = []
    }, updateHeight: function () {
        var a = this.divRealHeight, b = this.legend;
        if (b) {
            var c = this.legendDiv.offsetHeight, b = b.position;
            if ("top" == b || "bottom" == b)a -= c, 0 > a && (a = 0), this.chartDiv.style.height = a + "px"
        }
        return a
    }, updateWidth: function () {
        var a = this.divRealWidth, b = this.divRealHeight, c = this.legend;
        if (c) {
            var d = this.legendDiv, e = d.offsetWidth,
                f = d.offsetHeight, d = d.style, g = this.chartDiv.style, c = c.position;
            if ("right" == c || "left" == c)a -= e, 0 > a && (a = 0), g.width = a + "px", "left" == c ? g.left = e + "px" : d.left = a + "px", d.top = (b - f) / 2 + "px"
        }
        return a
    }, getTitleHeight: function () {
        var a = 0, b = this.titles;
        if (0 < b.length) {
            var a = 15, c;
            for (c = 0; c < b.length; c++)a += b[c].size + 6
        }
        return a
    }, addTitle: function (a, b, c, d, e) {
        isNaN(b) && (b = this.fontSize + 2);
        a = {text: a, size: b, color: c, alpha: d, bold: e};
        this.titles.push(a);
        return a
    }, addListeners: function () {
        var a = this, b = a.chartDiv;
        AmCharts.isNN && (a.panEventsEnabled &&
        "ontouchstart"in document.documentElement && (b.addEventListener("touchstart", function (b) {
            a.handleTouchMove.call(a, b);
            a.handleTouchStart.call(a, b)
        }, !0), b.addEventListener("touchmove", function (b) {
            a.handleTouchMove.call(a, b)
        }, !0), b.addEventListener("touchend", function (b) {
            a.handleTouchEnd.call(a, b)
        }, !0)), b.addEventListener("mousedown", function (b) {
            a.handleMouseDown.call(a, b)
        }, !0), b.addEventListener("mouseover", function (b) {
            a.handleMouseOver.call(a, b)
        }, !0), b.addEventListener("mouseout", function (b) {
            a.handleMouseOut.call(a,
                b)
        }, !0));
        AmCharts.isIE && (b.attachEvent("onmousedown", function (b) {
            a.handleMouseDown.call(a, b)
        }), b.attachEvent("onmouseover", function (b) {
            a.handleMouseOver.call(a, b)
        }), b.attachEvent("onmouseout", function (b) {
            a.handleMouseOut.call(a, b)
        }))
    }, dispDUpd: function () {
        var a;
        this.dispatchDataUpdated && (this.dispatchDataUpdated = !1, a = "dataUpdated", this.fire(a, {
            type: a,
            chart: this
        }));
        this.chartCreated || (a = "init", this.fire(a, {type: a, chart: this}));
        this.chartRendered || (a = "rendered", this.fire(a, {type: a, chart: this}), this.chartRendered = !0)
    }, drb: function () {
        var a = this.product, b = a + ".com", c = window.location.hostname.split("."), d;
        2 <= c.length && (d = c[c.length - 2] + "." + c[c.length - 1]);
        AmCharts.remove(this.bbset);
        if (d != b) {
            var b = b + "/?utm_source=swf&utm_medium=demo&utm_campaign=jsDemo" + a, e = "chart by ", c = 145;
            "ammap" == a && (e = "tool by ", c = 125);
            d = AmCharts.rect(this.container, c, 20, "#FFFFFF", 1);
            e = AmCharts.text(this.container, e + a + ".com", "#000000", "Verdana", 11, "start");
            e.translate(7, 9);
            d = this.container.set([d, e]);
            "ammap" == a && d.translate(this.realWidth -
                c, 0);
            this.bbset = d;
            this.linkSet.push(d);
            d.setAttr("cursor", "pointer");
            d.click(function () {
                window.location.href = "http://" + b
            });
            for (a = 0; a < d.length; a++)d[a].attr({cursor: "pointer"})
        }
    }, validateSize: function () {
        var a = this;
        a.measure();
        var b = a.legend;
        if ((a.realWidth != a.previousWidth || a.realHeight != a.previousHeight) && 0 < a.realWidth && 0 < a.realHeight) {
            a.sizeChanged = !0;
            if (b) {
                clearTimeout(a.legendInitTO);
                var c = setTimeout(function () {
                    b.invalidateSize()
                }, 100);
                a.timeOuts.push(c);
                a.legendInitTO = c
            }
            a.marginsUpdated = "xy" !=
            a.chartType ? !1 : !0;
            clearTimeout(a.initTO);
            c = setTimeout(function () {
                a.initChart()
            }, 150);
            a.timeOuts.push(c);
            a.initTO = c
        }
        a.renderFix();
        b && b.renderFix()
    }, invalidateSize: function () {
        this.previousHeight = this.previousWidth = NaN;
        this.invalidateSizeReal()
    }, invalidateSizeReal: function () {
        var a = this;
        a.marginsUpdated = !1;
        clearTimeout(a.validateTO);
        var b = setTimeout(function () {
            a.validateSize()
        }, 5);
        a.timeOuts.push(b);
        a.validateTO = b
    }, validateData: function (a) {
        this.chartCreated && (this.dataChanged = !0, this.marginsUpdated = "xy" !=
        this.chartType ? !1 : !0, this.initChart(a))
    }, validateNow: function () {
        this.listenersAdded = !1;
        this.write(this.div)
    }, showItem: function (a) {
        a.hidden = !1;
        this.initChart()
    }, hideItem: function (a) {
        a.hidden = !0;
        this.initChart()
    }, hideBalloon: function () {
        var a = this;
        a.hoverInt = setTimeout(function () {
            a.hideBalloonReal.call(a)
        }, 80)
    }, cleanChart: function () {
    }, hideBalloonReal: function () {
        var a = this.balloon;
        a && a.hide()
    }, showBalloon: function (a, b, c, d, e) {
        var f = this;
        clearTimeout(f.balloonTO);
        f.balloonTO = setTimeout(function () {
            f.showBalloonReal.call(f,
                a, b, c, d, e)
        }, 1)
    }, showBalloonReal: function (a, b, c, d, e) {
        this.handleMouseMove();
        var f = this.balloon;
        f.enabled && (f.followCursor(!1), f.changeColor(b), c || f.setPosition(d, e), f.followCursor(c), a && f.showBalloon(a))
    }, handleTouchMove: function (a) {
        this.hideBalloon();
        var b = this.chartDiv;
        a.touches && (a = a.touches.item(0), this.mouseX = a.pageX - AmCharts.findPosX(b), this.mouseY = a.pageY - AmCharts.findPosY(b))
    }, handleMouseOver: function (a) {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !0
    }, handleMouseOut: function (a) {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !1
    }, handleMouseMove: function (a) {
        if (this.mouseIsOver) {
            var b = this.chartDiv;
            a || (a = window.event);
            var c, d;
            if (a) {
                this.posX = AmCharts.findPosX(b);
                this.posY = AmCharts.findPosY(b);
                switch (this.mouseMode) {
                    case 1:
                        c = a.clientX - this.posX;
                        d = a.clientY - this.posY;
                        if (!this.divIsFixed) {
                            var b = document.body, e, f;
                            b && (e = b.scrollLeft, y1 = b.scrollTop);
                            if (b = document.documentElement)f = b.scrollLeft, y2 = b.scrollTop;
                            e = Math.max(e, f);
                            f = Math.max(y1, y2);
                            c += e;
                            d += f
                        }
                        break;
                    case 0:
                        this.divIsFixed ? (c = a.clientX - this.posX, d = a.clientY -
                            this.posY) : (c = a.pageX - this.posX, d = a.pageY - this.posY)
                }
                a.touches && (a = a.touches.item(0), c = a.pageX - this.posX, d = a.pageY - this.posY);
                this.mouseX = c - this.dmouseX;
                this.mouseY = d - this.dmouseY
            }
        }
    }, handleTouchStart: function (a) {
        this.handleMouseDown(a)
    }, handleTouchEnd: function (a) {
        AmCharts.resetMouseOver();
        this.handleReleaseOutside(a)
    }, handleReleaseOutside: function (a) {
    }, handleMouseDown: function (a) {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !0;
        a && a.preventDefault && a.preventDefault()
    }, addLegend: function (a, b) {
        AmCharts.extend(a,
            new AmCharts.AmLegend);
        var c;
        c = "object" != typeof b ? document.getElementById(b) : b;
        this.legend = a;
        a.chart = this;
        c ? (a.div = c, a.position = "outside", a.autoMargins = !1) : a.div = this.legendDiv;
        c = this.handleLegendEvent;
        this.listenTo(a, "showItem", c);
        this.listenTo(a, "hideItem", c);
        this.listenTo(a, "clickMarker", c);
        this.listenTo(a, "rollOverItem", c);
        this.listenTo(a, "rollOutItem", c);
        this.listenTo(a, "rollOverMarker", c);
        this.listenTo(a, "rollOutMarker", c);
        this.listenTo(a, "clickLabel", c)
    }, removeLegend: function () {
        this.legend = void 0;
        this.legendDiv.innerHTML = ""
    }, handleResize: function () {
        (AmCharts.isPercents(this.width) || AmCharts.isPercents(this.height)) && this.invalidateSizeReal();
        this.renderFix()
    }, renderFix: function () {
        if (!AmCharts.VML) {
            var a = this.container;
            a && a.renderFix()
        }
    }, getSVG: function () {
        if (AmCharts.hasSVG)return this.container
    }
});
AmCharts.Slice = AmCharts.Class({
    construct: function () {
    }
});
AmCharts.SerialDataItem = AmCharts.Class({
    construct: function () {
    }
});
AmCharts.GraphDataItem = AmCharts.Class({
    construct: function () {
    }
});
AmCharts.Guide = AmCharts.Class({
    construct: function () {
    }
});
AmCharts.toBoolean = function (a, b) {
    if (void 0 === a)return b;
    switch (String(a).toLowerCase()) {
        case "true":
        case "yes":
        case "1":
            return !0;
        case "false":
        case "no":
        case "0":
        case null:
            return !1;
        default:
            return Boolean(a)
    }
};
AmCharts.removeFromArray = function (a, b) {
    var c;
    for (c = a.length - 1; 0 <= c; c--)a[c] == b && a.splice(c, 1)
};
AmCharts.getStyle = function (a, b) {
    var c = "";
    document.defaultView && document.defaultView.getComputedStyle ? c = document.defaultView.getComputedStyle(a, "").getPropertyValue(b) : a.currentStyle && (b = b.replace(/\-(\w)/g, function (a, b) {
        return b.toUpperCase()
    }), c = a.currentStyle[b]);
    return c
};
AmCharts.removePx = function (a) {
    return Number(a.substring(0, a.length - 2))
};
AmCharts.getURL = function (a, b) {
    if (a)if ("_self" != b && b)if ("_top" == b && window.top)window.top.location.href = a; else if ("_parent" == b && window.parent)window.parent.location.href = a; else {
        var c = document.getElementsByName(b)[0];
        c ? c.src = a : window.open(a)
    } else window.location.href = a
};
AmCharts.formatMilliseconds = function (a, b) {
    if (-1 != a.indexOf("fff")) {
        var c = b.getMilliseconds(), d = String(c);
        10 > c && (d = "00" + c);
        10 <= c && 100 > c && (d = "0" + c);
        a = a.replace(/fff/g, d)
    }
    return a
};
AmCharts.ifArray = function (a) {
    return a && 0 < a.length ? !0 : !1
};
AmCharts.callMethod = function (a, b) {
    var c;
    for (c = 0; c < b.length; c++) {
        var d = b[c];
        if (d) {
            if (d[a])d[a]();
            var e = d.length;
            if (0 < e) {
                var f;
                for (f = 0; f < e; f++) {
                    var g = d[f];
                    if (g && g[a])g[a]()
                }
            }
        }
    }
};
AmCharts.toNumber = function (a) {
    return "number" == typeof a ? a : Number(String(a).replace(/[^0-9\-.]+/g, ""))
};
AmCharts.toColor = function (a) {
    if ("" !== a && void 0 !== a)if (-1 != a.indexOf(",")) {
        a = a.split(",");
        var b;
        for (b = 0; b < a.length; b++) {
            var c = a[b].substring(a[b].length - 6, a[b].length);
            a[b] = "#" + c
        }
    } else a = a.substring(a.length - 6, a.length), a = "#" + a;
    return a
};
AmCharts.toCoordinate = function (a, b, c) {
    var d;
    void 0 !== a && (a = String(a), c && c < b && (b = c), d = Number(a), -1 != a.indexOf("!") && (d = b - Number(a.substr(1))), -1 != a.indexOf("%") && (d = b * Number(a.substr(0, a.length - 1)) / 100));
    return d
};
AmCharts.fitToBounds = function (a, b, c) {
    a < b && (a = b);
    a > c && (a = c);
    return a
};
AmCharts.isDefined = function (a) {
    return void 0 === a ? !1 : !0
};
AmCharts.stripNumbers = function (a) {
    return a.replace(/[0-9]+/g, "")
};
AmCharts.extractPeriod = function (a) {
    var b = AmCharts.stripNumbers(a), c = 1;
    b != a && (c = Number(a.slice(0, a.indexOf(b))));
    return {period: b, count: c}
};
AmCharts.resetDateToMin = function (a, b, c, d) {
    void 0 === d && (d = 1);
    var e, f, g, h, k, l, m;
    AmCharts.useUTC ? (e = a.getUTCFullYear(), f = a.getUTCMonth(), g = a.getUTCDate(), h = a.getUTCHours(), k = a.getUTCMinutes(), l = a.getUTCSeconds(), m = a.getUTCMilliseconds(), a = a.getUTCDay()) : (e = a.getFullYear(), f = a.getMonth(), g = a.getDate(), h = a.getHours(), k = a.getMinutes(), l = a.getSeconds(), m = a.getMilliseconds(), a = a.getDay());
    switch (b) {
        case "YYYY":
            e = Math.floor(e / c) * c;
            f = 0;
            g = 1;
            m = l = k = h = 0;
            break;
        case "MM":
            f = Math.floor(f / c) * c;
            g = 1;
            m = l = k = h = 0;
            break;
        case "WW":
            0 ===
            a && 0 < d && (a = 7);
            g = g - a + d;
            m = l = k = h = 0;
            break;
        case "DD":
            m = l = k = h = 0;
            break;
        case "hh":
            h = Math.floor(h / c) * c;
            m = l = k = 0;
            break;
        case "mm":
            k = Math.floor(k / c) * c;
            m = l = 0;
            break;
        case "ss":
            l = Math.floor(l / c) * c;
            m = 0;
            break;
        case "fff":
            m = Math.floor(m / c) * c
    }
    AmCharts.useUTC ? (a = new Date, a.setUTCFullYear(e), a.setUTCMonth(f), a.setUTCDate(g), a.setUTCHours(h), a.setUTCMinutes(k), a.setUTCSeconds(l), a.setUTCMilliseconds(m)) : a = new Date(e, f, g, h, k, l, m);
    return a
};
AmCharts.getPeriodDuration = function (a, b) {
    void 0 === b && (b = 1);
    var c;
    switch (a) {
        case "YYYY":
            c = 316224E5;
            break;
        case "MM":
            c = 26784E5;
            break;
        case "WW":
            c = 6048E5;
            break;
        case "DD":
            c = 864E5;
            break;
        case "hh":
            c = 36E5;
            break;
        case "mm":
            c = 6E4;
            break;
        case "ss":
            c = 1E3;
            break;
        case "fff":
            c = 1
    }
    return c * b
};
AmCharts.roundTo = function (a, b) {
    if (0 > b)return a;
    var c = Math.pow(10, b);
    return Math.round(a * c) / c
};
AmCharts.toFixed = function (a, b) {
    var c = String(Math.round(a * Math.pow(10, b)));
    if (0 < b) {
        var d = c.length;
        if (d < b) {
            var e;
            for (e = 0; e < b - d; e++)c = "0" + c
        }
        d = c.substring(0, c.length - b);
        "" === d && (d = 0);
        return d + "." + c.substring(c.length - b, c.length)
    }
    return String(c)
};
AmCharts.intervals = {
    s: {nextInterval: "ss", contains: 1E3},
    ss: {nextInterval: "mm", contains: 60, count: 0},
    mm: {nextInterval: "hh", contains: 60, count: 1},
    hh: {nextInterval: "DD", contains: 24, count: 2},
    DD: {nextInterval: "", contains: Infinity, count: 3}
};
AmCharts.getMaxInterval = function (a, b) {
    var c = AmCharts.intervals;
    return a >= c[b].contains ? (a = Math.round(a / c[b].contains), b = c[b].nextInterval, AmCharts.getMaxInterval(a, b)) : "ss" == b ? c[b].nextInterval : b
};
AmCharts.formatDuration = function (a, b, c, d, e, f) {
    var g = AmCharts.intervals, h = f.decimalSeparator;
    if (a >= g[b].contains) {
        var k = a - Math.floor(a / g[b].contains) * g[b].contains;
        "ss" == b && (k = AmCharts.formatNumber(k, f), 1 == k.split(h)[0].length && (k = "0" + k));
        ("mm" == b || "hh" == b) && 10 > k && (k = "0" + k);
        c = k + "" + d[b] + "" + c;
        a = Math.floor(a / g[b].contains);
        b = g[b].nextInterval;
        return AmCharts.formatDuration(a, b, c, d, e, f)
    }
    "ss" == b && (a = AmCharts.formatNumber(a, f), 1 == a.split(h)[0].length && (a = "0" + a));
    ("mm" == b || "hh" == b) && 10 > a && (a = "0" + a);
    c = a + "" +
        d[b] + "" + c;
    if (g[e].count > g[b].count)for (a = g[b].count; a < g[e].count; a++)b = g[b].nextInterval, "ss" == b || "mm" == b || "hh" == b ? c = "00" + d[b] + "" + c : "DD" == b && (c = "0" + d[b] + "" + c);
    ":" == c.charAt(c.length - 1) && (c = c.substring(0, c.length - 1));
    return c
};
AmCharts.formatNumber = function (a, b, c, d, e) {
    a = AmCharts.roundTo(a, b.precision);
    isNaN(c) && (c = b.precision);
    var f = b.decimalSeparator;
    b = b.thousandsSeparator;
    var g;
    g = 0 > a ? "-" : "";
    a = Math.abs(a);
    var h = String(a), k = !1;
    -1 != h.indexOf("e") && (k = !0);
    0 <= c && !k && (h = AmCharts.toFixed(a, c));
    var l = "";
    if (k)l = h; else {
        var h = h.split("."), k = String(h[0]), m;
        for (m = k.length; 0 <= m; m -= 3)l = m != k.length ? 0 !== m ? k.substring(m - 3, m) + b + l : k.substring(m - 3, m) + l : k.substring(m - 3, m);
        void 0 !== h[1] && (l = l + f + h[1]);
        void 0 !== c && (0 < c && "0" != l) && (l = AmCharts.addZeroes(l,
            f, c))
    }
    l = g + l;
    "" === g && (!0 === d && 0 !== a) && (l = "+" + l);
    !0 === e && (l += "%");
    return l
};
AmCharts.addZeroes = function (a, b, c) {
    a = a.split(b);
    void 0 === a[1] && 0 < c && (a[1] = "0");
    return a[1].length < c ? (a[1] += "0", AmCharts.addZeroes(a[0] + b + a[1], b, c)) : void 0 !== a[1] ? a[0] + b + a[1] : a[0]
};
AmCharts.scientificToNormal = function (a) {
    var b;
    a = String(a).split("e");
    var c;
    if ("-" == a[1].substr(0, 1)) {
        b = "0.";
        for (c = 0; c < Math.abs(Number(a[1])) - 1; c++)b += "0";
        b += a[0].split(".").join("")
    } else {
        var d = 0;
        b = a[0].split(".");
        b[1] && (d = b[1].length);
        b = a[0].split(".").join("");
        for (c = 0; c < Math.abs(Number(a[1])) - d; c++)b += "0"
    }
    return b
};
AmCharts.toScientific = function (a, b) {
    if (0 === a)return "0";
    var c = Math.floor(Math.log(Math.abs(a)) * Math.LOG10E);
    Math.pow(10, c);
    mantissa = String(mantissa).split(".").join(b);
    return String(mantissa) + "e" + c
};
AmCharts.randomColor = function () {
    return "#" + ("00000" + (16777216 * Math.random() << 0).toString(16)).substr(-6)
};
AmCharts.hitTest = function (a, b, c) {
    var d = !1, e = a.x, f = a.x + a.width, g = a.y, h = a.y + a.height, k = AmCharts.isInRectangle;
    d || (d = k(e, g, b));
    d || (d = k(e, h, b));
    d || (d = k(f, g, b));
    d || (d = k(f, h, b));
    d || !0 === c || (d = AmCharts.hitTest(b, a, !0));
    return d
};
AmCharts.isInRectangle = function (a, b, c) {
    return a >= c.x - 5 && a <= c.x + c.width + 5 && b >= c.y - 5 && b <= c.y + c.height + 5 ? !0 : !1
};
AmCharts.isPercents = function (a) {
    if (-1 != String(a).indexOf("%"))return !0
};
AmCharts.dayNames = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");
AmCharts.shortDayNames = "Sun Mon Tue Wed Thu Fri Sat".split(" ");
AmCharts.monthNames = "January February March April May June July August September October November December".split(" ");
AmCharts.shortMonthNames = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
AmCharts.getWeekNumber = function (a) {
    a = new Date(a);
    a.setHours(0, 0, 0);
    a.setDate(a.getDate() + 4 - (a.getDay() || 7));
    var b = new Date(a.getFullYear(), 0, 1);
    return Math.ceil(((a - b) / 864E5 + 1) / 7)
};
AmCharts.formatDate = function (a, b) {
    var c, d, e, f, g, h, k, l, m = AmCharts.getWeekNumber(a);
    AmCharts.useUTC ? (c = a.getUTCFullYear(), d = a.getUTCMonth(), e = a.getUTCDate(), f = a.getUTCDay(), g = a.getUTCHours(), h = a.getUTCMinutes(), k = a.getUTCSeconds(), l = a.getUTCMilliseconds()) : (c = a.getFullYear(), d = a.getMonth(), e = a.getDate(), f = a.getDay(), g = a.getHours(), h = a.getMinutes(), k = a.getSeconds(), l = a.getMilliseconds());
    var n = String(c).substr(2, 2), s = d + 1;
    9 > d && (s = "0" + s);
    var q = e;
    10 > e && (q = "0" + e);
    var t = "0" + f;
    b = b.replace(/W/g, m);
    m = g;
    24 ==
    m && (m = 0);
    var p = m;
    10 > p && (p = "0" + p);
    b = b.replace(/JJ/g, p);
    b = b.replace(/J/g, m);
    m = g;
    0 === m && (m = 24);
    p = m;
    10 > p && (p = "0" + p);
    b = b.replace(/HH/g, p);
    b = b.replace(/H/g, m);
    m = g;
    11 < m && (m -= 12);
    p = m;
    10 > p && (p = "0" + p);
    b = b.replace(/KK/g, p);
    b = b.replace(/K/g, m);
    m = g;
    0 === m && (m = 12);
    12 < m && (m -= 12);
    p = m;
    10 > p && (p = "0" + p);
    b = b.replace(/LL/g, p);
    b = b.replace(/L/g, m);
    m = h;
    10 > m && (m = "0" + m);
    b = b.replace(/NN/g, m);
    b = b.replace(/N/g, h);
    h = k;
    10 > h && (h = "0" + h);
    b = b.replace(/SS/g, h);
    b = b.replace(/S/g, k);
    k = l;
    10 > k && (k = "00" + k);
    100 > k && (k = "0" + k);
    h = l;
    10 > h && (h = "00" +
        h);
    b = b.replace(/QQQ/g, k);
    b = b.replace(/QQ/g, h);
    b = b.replace(/Q/g, l);
    b = 12 > g ? b.replace(/A/g, "am") : b.replace(/A/g, "pm");
    b = b.replace(/YYYY/g, "@IIII@");
    b = b.replace(/YY/g, "@II@");
    b = b.replace(/MMMM/g, "@XXXX@");
    b = b.replace(/MMM/g, "@XXX@");
    b = b.replace(/MM/g, "@XX@");
    b = b.replace(/M/g, "@X@");
    b = b.replace(/DD/g, "@RR@");
    b = b.replace(/D/g, "@R@");
    b = b.replace(/EEEE/g, "@PPPP@");
    b = b.replace(/EEE/g, "@PPP@");
    b = b.replace(/EE/g, "@PP@");
    b = b.replace(/E/g, "@P@");
    b = b.replace(/@IIII@/g, c);
    b = b.replace(/@II@/g, n);
    b = b.replace(/@XXXX@/g,
        AmCharts.monthNames[d]);
    b = b.replace(/@XXX@/g, AmCharts.shortMonthNames[d]);
    b = b.replace(/@XX@/g, s);
    b = b.replace(/@X@/g, d + 1);
    b = b.replace(/@RR@/g, q);
    b = b.replace(/@R@/g, e);
    b = b.replace(/@PPPP@/g, AmCharts.dayNames[f]);
    b = b.replace(/@PPP@/g, AmCharts.shortDayNames[f]);
    b = b.replace(/@PP@/g, t);
    return b = b.replace(/@P@/g, f)
};
AmCharts.findPosX = function (a) {
    var b = a, c = a.offsetLeft;
    if (a.offsetParent) {
        for (; a = a.offsetParent;)c += a.offsetLeft;
        for (; (b = b.parentNode) && b != document.body;)c -= b.scrollLeft || 0
    }
    return c
};
AmCharts.findPosY = function (a) {
    var b = a, c = a.offsetTop;
    if (a.offsetParent) {
        for (; a = a.offsetParent;)c += a.offsetTop;
        for (; (b = b.parentNode) && b != document.body;)c -= b.scrollTop || 0
    }
    return c
};
AmCharts.findIfFixed = function (a) {
    if (a.offsetParent)for (; a = a.offsetParent;)if ("fixed" == AmCharts.getStyle(a, "position"))return !0;
    return !1
};
AmCharts.findIfAuto = function (a) {
    return a.style && "auto" == AmCharts.getStyle(a, "overflow") ? !0 : a.parentNode ? AmCharts.findIfAuto(a.parentNode) : !1
};
AmCharts.findScrollLeft = function (a, b) {
    a.scrollLeft && (b += a.scrollLeft);
    return a.parentNode ? AmCharts.findScrollLeft(a.parentNode, b) : b
};
AmCharts.findScrollTop = function (a, b) {
    a.scrollTop && (b += a.scrollTop);
    return a.parentNode ? AmCharts.findScrollTop(a.parentNode, b) : b
};
AmCharts.formatValue = function (a, b, c, d, e, f, g, h) {
    if (b) {
        void 0 === e && (e = "");
        var k;
        for (k = 0; k < c.length; k++) {
            var l = c[k], m = b[l];
            void 0 !== m && (m = f ? AmCharts.addPrefix(m, h, g, d) : AmCharts.formatNumber(m, d), a = a.replace(RegExp("\\[\\[" + e + "" + l + "\\]\\]", "g"), m))
        }
    }
    return a
};
AmCharts.formatDataContextValue = function (a, b) {
    if (a) {
        var c = a.match(/\[\[.*?\]\]/g), d;
        for (d = 0; d < c.length; d++) {
            var e = c[d], e = e.substr(2, e.length - 4);
            void 0 !== b[e] && (a = a.replace(RegExp("\\[\\[" + e + "\\]\\]", "g"), b[e]))
        }
    }
    return a
};
AmCharts.massReplace = function (a, b) {
    for (var c in b)if (b.hasOwnProperty(c)) {
        var d = b[c];
        void 0 === d && (d = "");
        a = a.replace(c, d)
    }
    return a
};
AmCharts.cleanFromEmpty = function (a) {
    return a.replace(/\[\[[^\]]*\]\]/g, "")
};
AmCharts.addPrefix = function (a, b, c, d, e) {
    var f = AmCharts.formatNumber(a, d), g = "", h, k, l;
    if (0 === a)return "0";
    0 > a && (g = "-");
    a = Math.abs(a);
    if (1 < a)for (h = b.length - 1; -1 < h; h--) {
        if (a >= b[h].number && (k = a / b[h].number, l = Number(d.precision), 1 > l && (l = 1), c = AmCharts.roundTo(k, l), !e || k == c)) {
            f = g + "" + c + "" + b[h].prefix;
            break
        }
    } else for (h = 0; h < c.length; h++)if (a <= c[h].number) {
        k = a / c[h].number;
        l = Math.abs(Math.round(Math.log(k) * Math.LOG10E));
        k = AmCharts.roundTo(k, l);
        f = g + "" + k + "" + c[h].prefix;
        break
    }
    return f
};
AmCharts.remove = function (a) {
    a && a.remove()
};
AmCharts.copyProperties = function (a, b) {
    for (var c in a)a.hasOwnProperty(c) && "events" != c && (void 0 !== a[c] && "function" != typeof a[c]) && (b[c] = a[c])
};
AmCharts.recommended = function () {
    var a = "js";
    document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") || swfobject && swfobject.hasFlashPlayerVersion("8") && (a = "flash");
    return a
};
AmCharts.getEffect = function (a) {
    ">" == a && (a = "easeOutSine");
    "<" == a && (a = "easeInSine");
    "elastic" == a && (a = "easeOutElastic");
    return a
};
AmCharts.extend = function (a, b) {
    for (var c in b)void 0 !== b[c] && (a.hasOwnProperty(c) || (a[c] = b[c]))
};
AmCharts.fixNewLines = function (a) {
    if (9 > AmCharts.IEversion && 0 < AmCharts.IEversion) {
        var b = RegExp("\\n", "g");
        a && (a = a.replace(b, "<br />"))
    }
    return a
};
AmCharts.deleteObject = function (a, b) {
    if (a) {
        if (void 0 === b || null === b)b = 20;
        if (0 != b)if ("[object Array]" === Object.prototype.toString.call(a))for (var c = 0; c < a.length; c++)AmCharts.deleteObject(a[c], b - 1), a[c] = null; else try {
            for (c in a)a[c] && ("object" == typeof a[c] && AmCharts.deleteObject(a[c], b - 1), "function" != typeof a[c] && (a[c] = null))
        } catch (d) {
        }
    }
};
AmCharts.changeDate = function (a, b, c, d, e) {
    var f = -1;
    void 0 === d && (d = !0);
    void 0 === e && (e = !1);
    !0 === d && (f = 1);
    switch (b) {
        case "YYYY":
            a.setFullYear(a.getFullYear() + c * f);
            d || e || a.setDate(a.getDate() + 1);
            break;
        case "MM":
            a.setMonth(a.getMonth() + c * f);
            d || e || a.setDate(a.getDate() + 1);
            break;
        case "DD":
            a.setDate(a.getDate() + c * f);
            break;
        case "WW":
            a.setDate(a.getDate() + 7 * c * f + 1);
            break;
        case "hh":
            a.setHours(a.getHours() + c * f);
            break;
        case "mm":
            a.setMinutes(a.getMinutes() + c * f);
            break;
        case "ss":
            a.setSeconds(a.getSeconds() + c * f);
            break;
        case "fff":
            a.setMilliseconds(a.getMilliseconds() + c * f)
    }
    return a
};
AmCharts.Bezier = AmCharts.Class({
    construct: function (a, b, c, d, e, f, g, h, k, l) {
        "object" == typeof g && (g = g[0]);
        "object" == typeof h && (h = h[0]);
        f = {fill: g, "fill-opacity": h, "stroke-width": f};
        void 0 !== k && 0 < k && (f["stroke-dasharray"] = k);
        isNaN(e) || (f["stroke-opacity"] = e);
        d && (f.stroke = d);
        d = "M" + Math.round(b[0]) + "," + Math.round(c[0]);
        e = [];
        for (k = 0; k < b.length; k++)e.push({x: Number(b[k]), y: Number(c[k])});
        1 < e.length && (b = this.interpolate(e), d += this.drawBeziers(b));
        l ? d += l : AmCharts.VML || (d += "M0,0 L0,0");
        this.path = a.path(d).attr(f)
    },
    interpolate: function (a) {
        var b = [];
        b.push({x: a[0].x, y: a[0].y});
        var c = a[1].x - a[0].x, d = a[1].y - a[0].y, e = AmCharts.bezierX, f = AmCharts.bezierY;
        b.push({x: a[0].x + c / e, y: a[0].y + d / f});
        var g;
        for (g = 1; g < a.length - 1; g++) {
            var h = a[g - 1], k = a[g], d = a[g + 1], c = d.x - k.x, d = d.y - h.y, h = k.x - h.x;
            h > c && (h = c);
            b.push({x: k.x - h / e, y: k.y - d / f});
            b.push({x: k.x, y: k.y});
            b.push({x: k.x + h / e, y: k.y + d / f})
        }
        d = a[a.length - 1].y - a[a.length - 2].y;
        c = a[a.length - 1].x - a[a.length - 2].x;
        b.push({x: a[a.length - 1].x - c / e, y: a[a.length - 1].y - d / f});
        b.push({
            x: a[a.length - 1].x,
            y: a[a.length - 1].y
        });
        return b
    }, drawBeziers: function (a) {
        var b = "", c;
        for (c = 0; c < (a.length - 1) / 3; c++)b += this.drawBezierMidpoint(a[3 * c], a[3 * c + 1], a[3 * c + 2], a[3 * c + 3]);
        return b
    }, drawBezierMidpoint: function (a, b, c, d) {
        var e = Math.round, f = this.getPointOnSegment(a, b, 0.75), g = this.getPointOnSegment(d, c, 0.75), h = (d.x - a.x) / 16, k = (d.y - a.y) / 16, l = this.getPointOnSegment(a, b, 0.375);
        a = this.getPointOnSegment(f, g, 0.375);
        a.x -= h;
        a.y -= k;
        b = this.getPointOnSegment(g, f, 0.375);
        b.x += h;
        b.y += k;
        c = this.getPointOnSegment(d, c, 0.375);
        h = this.getMiddle(l,
            a);
        f = this.getMiddle(f, g);
        g = this.getMiddle(b, c);
        l = " Q" + e(l.x) + "," + e(l.y) + "," + e(h.x) + "," + e(h.y);
        l += " Q" + e(a.x) + "," + e(a.y) + "," + e(f.x) + "," + e(f.y);
        l += " Q" + e(b.x) + "," + e(b.y) + "," + e(g.x) + "," + e(g.y);
        return l += " Q" + e(c.x) + "," + e(c.y) + "," + e(d.x) + "," + e(d.y)
    }, getMiddle: function (a, b) {
        return {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}
    }, getPointOnSegment: function (a, b, c) {
        return {x: a.x + (b.x - a.x) * c, y: a.y + (b.y - a.y) * c}
    }
});
AmCharts.Cuboid = AmCharts.Class({
    construct: function (a, b, c, d, e, f, g, h, k, l, m, n, s) {
        this.set = a.set();
        this.container = a;
        this.h = Math.round(c);
        this.w = Math.round(b);
        this.dx = d;
        this.dy = e;
        this.colors = f;
        this.alpha = g;
        this.bwidth = h;
        this.bcolor = k;
        this.balpha = l;
        this.colors = f;
        s ? 0 > b && 0 === m && (m = 180) : 0 > c && 270 == m && (m = 90);
        this.gradientRotation = m;
        0 === d && 0 === e && (this.cornerRadius = n);
        this.draw()
    }, draw: function () {
        var a = this.set;
        a.clear();
        var b = this.container, c = this.w, d = this.h, e = this.dx, f = this.dy, g = this.colors, h = this.alpha, k =
            this.bwidth, l = this.bcolor, m = this.balpha, n = this.gradientRotation, s = this.cornerRadius, q = g, t = g;
        "object" == typeof g && (q = g[0], t = g[g.length - 1]);
        var p, r, u, v, w, A, x, B, y;
        if (0 < e || 0 < f)x = t, t = AmCharts.adjustLuminosity(q, -0.2), t = AmCharts.adjustLuminosity(q, -0.2), p = AmCharts.polygon(b, [0, e, c + e, c, 0], [0, f, f, 0, 0], t, h, 0, 0, 0, n), 0 < m && (y = AmCharts.line(b, [0, e, c + e], [0, f, f], l, m, k)), r = AmCharts.polygon(b, [0, 0, c, c, 0], [0, d, d, 0, 0], t, h, 0, 0, 0, 0, n), r.translate(e, f), 0 < m && (u = AmCharts.line(b, [e, e], [f, f + d], l, 1, k)), v = AmCharts.polygon(b,
            [0, 0, e, e, 0], [0, d, d + f, f, 0], t, h, 0, 0, 0, n), w = AmCharts.polygon(b, [c, c, c + e, c + e, c], [0, d, d + f, f, 0], t, h, 0, 0, 0, n), 0 < m && (A = AmCharts.line(b, [c, c + e, c + e, c], [0, f, d + f, d], l, m, k)), t = AmCharts.adjustLuminosity(x, 0.2), x = AmCharts.polygon(b, [0, e, c + e, c, 0], [d, d + f, d + f, d, d], t, h, 0, 0, 0, n), 0 < m && (B = AmCharts.line(b, [0, e, c + e], [d, d + f, d + f], l, m, k));
        1 > Math.abs(d) && (d = 0);
        1 > Math.abs(c) && (c = 0);
        b = 0 === d ? AmCharts.line(b, [0, c], [0, 0], l, m, k) : 0 === c ? AmCharts.line(b, [0, 0], [0, d], l, m, k) : 0 < s ? AmCharts.rect(b, c, d, g, h, k, l, m, s, n) : AmCharts.polygon(b, [0,
            0, c, c, 0], [0, d, d, 0, 0], g, h, k, l, m, n);
        d = 0 > d ? [p, y, r, u, v, w, A, x, B, b] : [x, B, r, u, v, w, p, y, A, b];
        for (p = 0; p < d.length; p++)(r = d[p]) && a.push(r)
    }, width: function (a) {
        this.w = a;
        this.draw()
    }, height: function (a) {
        this.h = a;
        this.draw()
    }, animateHeight: function (a, b) {
        var c = this;
        c.easing = b;
        c.totalFrames = 1E3 * a / AmCharts.updateRate;
        c.rh = c.h;
        c.frame = 0;
        c.height(1);
        setTimeout(function () {
            c.updateHeight.call(c)
        }, AmCharts.updateRate)
    }, updateHeight: function () {
        var a = this;
        a.frame++;
        var b = a.totalFrames;
        a.frame <= b && (b = a.easing(0, a.frame, 1, a.rh -
            1, b), a.height(b), setTimeout(function () {
            a.updateHeight.call(a)
        }, AmCharts.updateRate))
    }, animateWidth: function (a, b) {
        var c = this;
        c.easing = b;
        c.totalFrames = 1E3 * a / AmCharts.updateRate;
        c.rw = c.w;
        c.frame = 0;
        c.width(1);
        setTimeout(function () {
            c.updateWidth.call(c)
        }, AmCharts.updateRate)
    }, updateWidth: function () {
        var a = this;
        a.frame++;
        var b = a.totalFrames;
        a.frame <= b && (b = a.easing(0, a.frame, 1, a.rw - 1, b), a.width(b), setTimeout(function () {
            a.updateWidth.call(a)
        }, AmCharts.updateRate))
    }
});
AmCharts.AmLegend = AmCharts.Class({
    construct: function () {
        this.createEvents("rollOverMarker", "rollOverItem", "rollOutMarker", "rollOutItem", "showItem", "hideItem", "clickMarker", "rollOverItem", "rollOutItem", "clickLabel");
        this.position = "bottom";
        this.borderColor = this.color = "#000000";
        this.borderAlpha = 0;
        this.markerLabelGap = 5;
        this.verticalGap = 10;
        this.align = "left";
        this.horizontalGap = 0;
        this.spacing = 10;
        this.markerDisabledColor = "#AAB3B3";
        this.markerType = "square";
        this.markerSize = 16;
        this.markerBorderThickness = 1;
        this.marginBottom =
            this.marginTop = 0;
        this.marginLeft = this.marginRight = 20;
        this.autoMargins = !0;
        this.valueWidth = 50;
        this.switchable = !0;
        this.switchType = "x";
        this.switchColor = "#FFFFFF";
        this.rollOverColor = "#CC0000";
        this.reversedOrder = !1;
        this.labelText = "[[title]]";
        this.valueText = "[[value]]";
        this.useMarkerColorForLabels = !1;
        this.rollOverGraphAlpha = 1;
        this.textClickEnabled = !1;
        this.equalWidths = !0;
        this.dateFormat = "DD-MM-YYYY";
        this.backgroundColor = "#FFFFFF";
        this.backgroundAlpha = 0;
        this.showEntries = !0
    }, setData: function (a) {
        this.data = a;
        this.invalidateSize()
    }, invalidateSize: function () {
        this.destroy();
        this.entries = [];
        this.valueLabels = [];
        AmCharts.ifArray(this.data) && this.drawLegend()
    }, drawLegend: function () {
        var a = this.chart, b = this.position, c = this.width, d = a.divRealWidth, e = a.divRealHeight, f = this.div, g = this.data;
        isNaN(this.fontSize) && (this.fontSize = a.fontSize);
        if ("right" == b || "left" == b)this.maxColumns = 1, this.marginLeft = this.marginRight = 10; else if (this.autoMargins) {
            this.marginRight = a.marginRight;
            this.marginLeft = a.marginLeft;
            var h = a.autoMarginOffset;
            "bottom" == b ? (this.marginBottom = h, this.marginTop = 0) : (this.marginTop = h, this.marginBottom = 0)
        }
        c = void 0 !== c ? AmCharts.toCoordinate(c, d) : a.realWidth;
        "outside" == b ? (c = f.offsetWidth, e = f.offsetHeight, f.clientHeight && (c = f.clientWidth, e = f.clientHeight)) : (f.style.width = c + "px", f.className = "amChartsLegend");
        this.divWidth = c;
        this.container = new AmCharts.AmDraw(f, c, e);
        this.lx = 0;
        this.ly = 8;
        b = this.markerSize;
        b > this.fontSize && (this.ly = b / 2 - 1);
        0 < b && (this.lx += b + this.markerLabelGap);
        this.titleWidth = 0;
        if (b = this.title)a = AmCharts.text(this.container,
            b, this.color, a.fontFamily, this.fontSize, "start", !0), a.translate(this.marginLeft, this.marginTop + this.verticalGap + this.ly + 1), a = a.getBBox(), this.titleWidth = a.width + 15, this.titleHeight = a.height + 6;
        this.index = this.maxLabelWidth = 0;
        if (this.showEntries) {
            for (a = 0; a < g.length; a++)this.createEntry(g[a]);
            for (a = this.index = 0; a < g.length; a++)this.createValue(g[a])
        }
        this.arrangeEntries();
        this.updateValues()
    }, arrangeEntries: function () {
        var a = this.position, b = this.marginLeft + this.titleWidth, c = this.marginRight, d = this.marginTop,
            e = this.marginBottom, f = this.horizontalGap, g = this.div, h = this.divWidth, k = this.maxColumns, l = this.verticalGap, m = this.spacing, n = h - c - b, s = 0, q = 0, t = this.container, p = t.set();
        this.set = p;
        t = t.set();
        p.push(t);
        var r = this.entries, u, v;
        for (v = 0; v < r.length; v++) {
            u = r[v].getBBox();
            var w = u.width;
            w > s && (s = w);
            u = u.height;
            u > q && (q = u)
        }
        var A = w = 0, x = f;
        for (v = 0; v < r.length; v++) {
            var B = r[v];
            this.reversedOrder && (B = r[r.length - v - 1]);
            u = B.getBBox();
            var y;
            this.equalWidths ? y = f + A * (s + m + this.markerLabelGap) : (y = x, x = x + u.width + f + m);
            y + u.width > n && (0 <
            v && 0 != A) && (w++, A = 0, y = f, x = y + u.width + f + m, skipNewRow = !0);
            B.translate(y, (q + l) * w);
            A++;
            !isNaN(k) && A >= k && (A = 0, w++);
            t.push(B)
        }
        u = t.getBBox();
        k = u.height + 2 * l - 1;
        "left" == a || "right" == a ? (h = u.width + 2 * f, g.style.width = h + b + c + "px") : h = h - b - c - 1;
        c = AmCharts.polygon(this.container, [0, h, h, 0], [0, 0, k, k], this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        p.push(c);
        p.translate(b, d);
        c.toBack();
        b = f;
        if ("top" == a || "bottom" == a || "absolute" == a || "outside" == a)"center" == this.align ? b = f + (h - u.width) / 2 : "right" == this.align &&
        (b = f + h - u.width);
        t.translate(b, l + 1);
        this.titleHeight > k && (k = this.titleHeight);
        a = k + d + e + 1;
        0 > a && (a = 0);
        g.style.height = Math.round(a) + "px"
    }, createEntry: function (a) {
        if (!1 !== a.visibleInLegend) {
            var b = this.chart, c = a.markerType;
            c || (c = this.markerType);
            var d = a.color, e = a.alpha;
            a.legendKeyColor && (d = a.legendKeyColor());
            a.legendKeyAlpha && (e = a.legendKeyAlpha());
            !0 === a.hidden && (d = this.markerDisabledColor);
            var f = this.createMarker(c, d, e);
            this.addListeners(f, a);
            e = this.container.set([f]);
            this.switchable && e.setAttr("cursor",
                "pointer");
            var g = this.switchType;
            if (g) {
                var h;
                h = "x" == g ? this.createX() : this.createV();
                h.dItem = a;
                !0 !== a.hidden ? "x" == g ? h.hide() : h.show() : "x" != g && h.hide();
                this.switchable || h.hide();
                this.addListeners(h, a);
                a.legendSwitch = h;
                e.push(h)
            }
            g = this.color;
            a.showBalloon && (this.textClickEnabled && void 0 !== this.selectedColor) && (g = this.selectedColor);
            this.useMarkerColorForLabels && (g = d);
            !0 === a.hidden && (g = this.markerDisabledColor);
            var d = AmCharts.massReplace(this.labelText, {"[[title]]": a.title}), k = this.fontSize, l = this.markerSize;
            if (f && l <= k) {
                var m = 0;
                if ("bubble" == c || "circle" == c)m = l / 2;
                c = m + this.ly - k / 2 + (k + 2 - l) / 2;
                f.translate(m, c);
                h && h.translate(m, c)
            }
            var n;
            d && (d = AmCharts.fixNewLines(d), n = AmCharts.text(this.container, d, g, b.fontFamily, k, "start"), n.translate(this.lx, this.ly), e.push(n), b = n.getBBox().width, this.maxLabelWidth < b && (this.maxLabelWidth = b));
            this.entries[this.index] = e;
            a.legendEntry = this.entries[this.index];
            a.legendLabel = n;
            this.index++
        }
    }, addListeners: function (a, b) {
        var c = this;
        a && a.mouseover(function () {
            c.rollOverMarker(b)
        }).mouseout(function () {
            c.rollOutMarker(b)
        }).click(function () {
            c.clickMarker(b)
        })
    },
    rollOverMarker: function (a) {
        this.switchable && this.dispatch("rollOverMarker", a);
        this.dispatch("rollOverItem", a)
    }, rollOutMarker: function (a) {
        this.switchable && this.dispatch("rollOutMarker", a);
        this.dispatch("rollOutItem", a)
    }, clickMarker: function (a) {
        this.switchable ? !0 === a.hidden ? this.dispatch("showItem", a) : this.dispatch("hideItem", a) : this.textClickEnabled && this.dispatch("clickMarker", a)
    }, rollOverLabel: function (a) {
        a.hidden || (this.textClickEnabled && a.legendLabel && a.legendLabel.attr({fill: this.rollOverColor}),
            this.dispatch("rollOverItem", a))
    }, rollOutLabel: function (a) {
        if (!a.hidden) {
            if (this.textClickEnabled && a.legendLabel) {
                var b = this.color;
                void 0 !== this.selectedColor && a.showBalloon && (b = this.selectedColor);
                this.useMarkerColorForLabels && (b = a.lineColor, void 0 === b && (b = a.color));
                a.legendLabel.attr({fill: b})
            }
            this.dispatch("rollOutItem", a)
        }
    }, clickLabel: function (a) {
        this.textClickEnabled ? a.hidden || this.dispatch("clickLabel", a) : this.switchable && (!0 === a.hidden ? this.dispatch("showItem", a) : this.dispatch("hideItem", a))
    },
    dispatch: function (a, b) {
        this.fire(a, {type: a, dataItem: b, target: this, chart: this.chart})
    }, createValue: function (a) {
        var b = this, c = b.fontSize;
        if (!1 !== a.visibleInLegend) {
            var d = b.maxLabelWidth;
            b.equalWidths || (b.valueAlign = "left");
            "left" == b.valueAlign && (d = a.legendEntry.getBBox().width);
            var e = d;
            if (b.valueText) {
                var f = b.color;
                b.useMarkerColorForValues && (f = a.color, a.legendKeyColor && (f = a.legendKeyColor()));
                !0 === a.hidden && (f = b.markerDisabledColor);
                var g = b.valueText, d = d + b.lx + b.markerLabelGap + b.valueWidth, h = "end";
                "left" ==
                b.valueAlign && (d -= b.valueWidth, h = "start");
                f = AmCharts.text(b.container, g, f, b.chart.fontFamily, c, h);
                f.translate(d, b.ly);
                b.entries[b.index].push(f);
                e += b.valueWidth + 2 * b.markerLabelGap;
                f.dItem = a;
                b.valueLabels.push(f)
            }
            b.index++;
            f = b.markerSize;
            f < c + 7 && (f = c + 7, AmCharts.VML && (f += 3));
            c = b.container.rect(b.markerSize, 0, e, f, 0, 0).attr({
                stroke: "none",
                fill: "#ffffff",
                "fill-opacity": 0.005
            });
            c.dItem = a;
            b.entries[b.index - 1].push(c);
            c.mouseover(function () {
                b.rollOverLabel(a)
            }).mouseout(function () {
                b.rollOutLabel(a)
            }).click(function () {
                b.clickLabel(a)
            })
        }
    },
    createV: function () {
        var a = this.markerSize;
        return AmCharts.polygon(this.container, [a / 5, a / 2, a - a / 5, a / 2], [a / 3, a - a / 5, a / 5, a / 1.7], this.switchColor)
    }, createX: function () {
        var a = this.markerSize - 3, b = {
            stroke: this.switchColor,
            "stroke-width": 3
        }, c = this.container, d = AmCharts.line(c, [3, a], [3, a]).attr(b), a = AmCharts.line(c, [3, a], [a, 3]).attr(b);
        return this.container.set([d, a])
    }, createMarker: function (a, b, c) {
        var d = this.markerSize, e = this.container, f, g = this.markerBorderColor;
        g || (g = b);
        var h = this.markerBorderThickness, k = this.markerBorderAlpha;
        switch (a) {
            case "square":
                f = AmCharts.polygon(e, [0, d, d, 0], [0, 0, d, d], b, c, h, g, k);
                break;
            case "circle":
                f = AmCharts.circle(e, d / 2, b, c, h, g, k);
                f.translate(d / 2, d / 2);
                break;
            case "line":
                f = AmCharts.line(e, [0, d], [d / 2, d / 2], b, c, h);
                break;
            case "dashedLine":
                f = AmCharts.line(e, [0, d], [d / 2, d / 2], b, c, h, 3);
                break;
            case "triangleUp":
                f = AmCharts.polygon(e, [0, d / 2, d, d], [d, 0, d, d], b, c, h, g, k);
                break;
            case "triangleDown":
                f = AmCharts.polygon(e, [0, d / 2, d, d], [0, d, 0, 0], b, c, h, g, k);
                break;
            case "bubble":
                f = AmCharts.circle(e, d / 2, b, c, h, g, k, !0), f.translate(d /
                    2, d / 2)
        }
        return f
    }, validateNow: function () {
        this.invalidateSize()
    }, updateValues: function () {
        var a = this.valueLabels, b = this.chart, c;
        for (c = 0; c < a.length; c++) {
            var d = a[c], e = d.dItem;
            if (void 0 !== e.type) {
                var f = e.currentDataItem;
                if (f) {
                    var g = this.valueText;
                    e.legendValueText && (g = e.legendValueText);
                    e = g;
                    e = b.formatString(e, f);
                    d.text(e)
                } else d.text(" ")
            } else f = b.formatString(this.valueText, e), d.text(f)
        }
    }, renderFix: function () {
        if (!AmCharts.VML) {
            var a = this.container;
            a && a.renderFix()
        }
    }, destroy: function () {
        this.div.innerHTML =
            "";
        AmCharts.remove(this.set)
    }
});
AmCharts.AmBalloon = AmCharts.Class({
    construct: function () {
        this.enabled = !0;
        this.fillColor = "#CC0000";
        this.fillAlpha = 1;
        this.borderThickness = 2;
        this.borderColor = "#FFFFFF";
        this.borderAlpha = 1;
        this.cornerRadius = 6;
        this.maximumWidth = 220;
        this.horizontalPadding = 8;
        this.verticalPadding = 5;
        this.pointerWidth = 10;
        this.pointerOrientation = "V";
        this.color = "#FFFFFF";
        this.textShadowColor = "#000000";
        this.adjustBorderColor = !1;
        this.showBullet = !0;
        this.show = this.follow = !1;
        this.bulletSize = 3;
        this.textAlign = "middle"
    }, draw: function () {
        var a =
            this.pointToX, b = this.pointToY, c = this.textAlign;
        if (!isNaN(a)) {
            var d = this.chart, e = d.container, f = this.set;
            AmCharts.remove(f);
            AmCharts.remove(this.pointer);
            this.set = f = e.set();
            d.balloonsSet.push(f);
            if (this.show) {
                var g = this.l, h = this.t, k = this.r, l = this.b, m = this.textShadowColor;
                this.color == m && (m = void 0);
                var n = this.balloonColor, s = this.fillColor, q = this.borderColor;
                void 0 != n && (this.adjustBorderColor ? q = n : s = n);
                var t = this.horizontalPadding, n = this.verticalPadding, p = this.pointerWidth, r = this.pointerOrientation, u = this.cornerRadius,
                    v = d.fontFamily, w = this.fontSize;
                void 0 == w && (w = d.fontSize);
                d = AmCharts.text(e, this.text, this.color, v, w, c);
                f.push(d);
                var A;
                void 0 != m && (A = AmCharts.text(e, this.text, m, v, w, c, !1, 0.4), f.push(A));
                v = d.getBBox();
                m = v.height + 2 * n;
                v = v.width + 2 * t;
                window.opera && (m += 2);
                var x, w = w / 2 + n;
                switch (c) {
                    case "middle":
                        x = v / 2;
                        break;
                    case "left":
                        x = t;
                        break;
                    case "right":
                        x = v - t
                }
                d.translate(x, w);
                A && A.translate(x + 1, w + 1);
                "H" != r ? (x = a - v / 2, c = b < h + m + 10 && "down" != r ? b + p : b - m - p) : (2 * p > m && (p = m / 2), c = b - m / 2, x = a < g + (k - g) / 2 ? a + p : a - v - p);
                c + m >= l && (c = l - m);
                c < h &&
                (c = h);
                x < g && (x = g);
                x + v > k && (x = k - v);
                0 < u || 0 === p ? (q = AmCharts.rect(e, v, m, s, this.fillAlpha, this.borderThickness, q, this.borderAlpha, this.cornerRadius), this.showBullet && (e = AmCharts.circle(e, this.bulletSize, s, this.fillAlpha), e.translate(a, b), this.pointer = e)) : (l = [], u = [], "H" != r ? (g = a - x, g > v - p && (g = v - p), g < p && (g = p), l = [0, g - p, a - x, g + p, v, v, 0, 0], u = b < h + m + 10 && "down" != r ? [0, 0, b - c, 0, 0, m, m, 0] : [m, m, b - c, m, m, 0, 0, m]) : (h = b - c, h > m - p && (h = m - p), h < p && (h = p), u = [0, h - p, b - c, h + p, m, m, 0, 0], l = a < g + (k - g) / 2 ? [0, 0, x < a ? 0 : a - x, 0, 0, v, v, 0] : [v, v, x + v > a ? v : a -
                x, v, v, 0, 0, v]), q = AmCharts.polygon(e, l, u, s, this.fillAlpha, this.borderThickness, q, this.borderAlpha));
                f.push(q);
                q.toFront();
                A && A.toFront();
                d.toFront();
                a = 1;
                9 > AmCharts.IEversion && this.follow && (a = 6);
                f.translate(x - a, c);
                f = d.getBBox();
                this.bottom = c + f.y + f.height + 2 * n + 2;
                this.yPos = f.y + c
            }
        }
    }, followMouse: function () {
        if (this.follow && this.show) {
            var a = this.chart.mouseX, b = this.chart.mouseY - 3;
            this.pointToX = a;
            this.pointToY = b;
            if (a != this.previousX || b != this.previousY)if (this.previousX = a, this.previousY = b, 0 === this.cornerRadius)this.draw();
            else {
                var c = this.set;
                if (c) {
                    var d = c.getBBox(), a = a - d.width / 2, e = b - d.height - 10;
                    a < this.l && (a = this.l);
                    a > this.r - d.width && (a = this.r - d.width);
                    e < this.t && (e = b + 10);
                    c.translate(a, e)
                }
            }
        }
    }, changeColor: function (a) {
        this.balloonColor = a
    }, setBounds: function (a, b, c, d) {
        this.l = a;
        this.t = b;
        this.r = c;
        this.b = d
    }, showBalloon: function (a) {
        this.text = a;
        this.show = !0;
        this.draw()
    }, hide: function () {
        this.follow = this.show = !1;
        this.destroy()
    }, setPosition: function (a, b, c) {
        this.pointToX = a;
        this.pointToY = b;
        c && (a == this.previousX && b == this.previousY ||
        this.draw());
        this.previousX = a;
        this.previousY = b
    }, followCursor: function (a) {
        var b = this;
        (b.follow = a) ? (b.pShowBullet = b.showBullet, b.showBullet = !1) : void 0 !== b.pShowBullet && (b.showBullet = b.pShowBullet);
        clearInterval(b.interval);
        var c = b.chart.mouseX, d = b.chart.mouseY;
        !isNaN(c) && a && (b.pointToX = c, b.pointToY = d - 3, b.interval = setInterval(function () {
            b.followMouse.call(b)
        }, 40))
    }, destroy: function () {
        clearInterval(this.interval);
        AmCharts.remove(this.set);
        this.set = null;
        AmCharts.remove(this.pointer);
        this.pointer = null
    }
});
AmCharts.AmCoordinateChart = AmCharts.Class({
    inherits: AmCharts.AmChart, construct: function () {
        AmCharts.AmCoordinateChart.base.construct.call(this);
        this.createEvents("rollOverGraphItem", "rollOutGraphItem", "clickGraphItem", "doubleClickGraphItem", "rightClickGraphItem", "clickGraph");
        this.plotAreaFillColors = "#FFFFFF";
        this.plotAreaFillAlphas = 0;
        this.plotAreaBorderColor = "#000000";
        this.plotAreaBorderAlpha = 0;
        this.startAlpha = 1;
        this.startDuration = 0;
        this.startEffect = "elastic";
        this.sequencedAnimation = !0;
        this.colors =
            "#FF6600 #FCD202 #B0DE09 #0D8ECF #2A0CD0 #CD0D74 #CC0000 #00CC00 #0000CC #DDDDDD #999999 #333333 #990000".split(" ");
        this.balloonDateFormat = "MMM DD, YYYY";
        this.valueAxes = [];
        this.graphs = []
    }, initChart: function () {
        AmCharts.AmCoordinateChart.base.initChart.call(this);
        this.createValueAxes();
        AmCharts.VML && (this.startAlpha = 1);
        var a = this.legend;
        a && a.setData(this.graphs)
    }, createValueAxes: function () {
        if (0 === this.valueAxes.length) {
            var a = new AmCharts.ValueAxis;
            this.addValueAxis(a)
        }
    }, parseData: function () {
        this.processValueAxes();
        this.processGraphs()
    }, parseSerialData: function () {
        AmCharts.AmSerialChart.base.parseData.call(this);
        var a = this.graphs, b, c = {}, d = this.seriesIdField;
        d || (d = this.categoryField);
        this.chartData = [];
        var e = this.dataProvider;
        if (e) {
            var f = !1, g, h = this.categoryAxis;
            if (h) {
                var f = h.parseDates, k = h.forceShowField;
                g = h.categoryFunction
            }
            var l, m;
            f && (b = AmCharts.extractPeriod(h.minPeriod), l = b.period, m = b.count);
            var n = {};
            this.lookupTable = n;
            var s;
            for (s = 0; s < e.length; s++) {
                var q = {}, t = e[s];
                b = t[this.categoryField];
                q.category = g ? g(b,
                    t, h) : String(b);
                k && (q.forceShow = t[k]);
                n[t[d]] = q;
                f && (b = h.categoryFunction ? h.categoryFunction(b, t, h) : b instanceof Date ? "fff" == h.minPeriod ? AmCharts.useUTC ? new Date(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate(), b.getUTCHours(), b.getUTCMinutes(), b.getUTCSeconds(), b.getUTCMilliseconds()) : new Date(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds(), b.getMilliseconds()) : new Date(b) : new Date(b), b = AmCharts.resetDateToMin(b, l, m), q.category = b, q.time = b.getTime());
                var p = this.valueAxes;
                q.axes = {};
                q.x = {};
                var r;
                for (r = 0; r < p.length; r++) {
                    var u = p[r].id;
                    q.axes[u] = {};
                    q.axes[u].graphs = {};
                    var v;
                    for (v = 0; v < a.length; v++) {
                        b = a[v];
                        var w = b.id, A = b.periodValue;
                        if (b.valueAxis.id == u) {
                            q.axes[u].graphs[w] = {};
                            var x = {};
                            x.index = s;
                            b.dataProvider && (t = c);
                            x.values = this.processValues(t, b, A);
                            this.processFields(b, x, t);
                            x.category = q.category;
                            x.serialDataItem = q;
                            x.graph = b;
                            q.axes[u].graphs[w] = x
                        }
                    }
                }
                this.chartData[s] = q
            }
        }
        for (c = 0; c < a.length; c++)b = a[c], b.dataProvider && this.parseGraphData(b)
    }, processValues: function (a, b, c) {
        var d =
        {}, e, f = !1;
        "candlestick" != b.type && "ohlc" != b.type || "" === c || (f = !0);
        e = Number(a[b.valueField + c]);
        isNaN(e) || (d.value = e);
        f && (c = "Open");
        e = Number(a[b.openField + c]);
        isNaN(e) || (d.open = e);
        f && (c = "Close");
        e = Number(a[b.closeField + c]);
        isNaN(e) || (d.close = e);
        f && (c = "Low");
        e = Number(a[b.lowField + c]);
        isNaN(e) || (d.low = e);
        f && (c = "High");
        e = Number(a[b.highField + c]);
        isNaN(e) || (d.high = e);
        return d
    }, parseGraphData: function (a) {
        var b = a.dataProvider, c = a.seriesIdField;
        c || (c = this.seriesIdField);
        c || (c = this.categoryField);
        var d;
        for (d =
                 0; d < b.length; d++) {
            var e = b[d], f = this.lookupTable[String(e[c])], g = a.valueAxis.id;
            f && (g = f.axes[g].graphs[a.id], g.serialDataItem = f, g.values = this.processValues(e, a, a.periodValue), this.processFields(a, g, e))
        }
    }, addValueAxis: function (a) {
        a.chart = this;
        this.valueAxes.push(a);
        this.validateData()
    }, removeValueAxesAndGraphs: function () {
        var a = this.valueAxes, b;
        for (b = a.length - 1; -1 < b; b--)this.removeValueAxis(a[b])
    }, removeValueAxis: function (a) {
        var b = this.graphs, c;
        for (c = b.length - 1; 0 <= c; c--) {
            var d = b[c];
            d && d.valueAxis == a &&
            this.removeGraph(d)
        }
        b = this.valueAxes;
        for (c = b.length - 1; 0 <= c; c--)b[c] == a && b.splice(c, 1);
        this.validateData()
    }, addGraph: function (a) {
        this.graphs.push(a);
        this.chooseGraphColor(a, this.graphs.length - 1);
        this.validateData()
    }, removeGraph: function (a) {
        var b = this.graphs, c;
        for (c = b.length - 1; 0 <= c; c--)b[c] == a && (b.splice(c, 1), a.destroy());
        this.validateData()
    }, processValueAxes: function () {
        var a = this.valueAxes, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.chart = this;
            c.id || (c.id = "valueAxis" + b + "_" + (new Date).getTime());
            if (!0 ===
                this.usePrefixes || !1 === this.usePrefixes)c.usePrefixes = this.usePrefixes
        }
    }, processGraphs: function () {
        var a = this.graphs, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.chart = this;
            c.valueAxis || (c.valueAxis = this.valueAxes[0]);
            c.id || (c.id = "graph" + b + "_" + (new Date).getTime())
        }
    }, formatString: function (a, b) {
        var c = b.graph, d = c.valueAxis;
        d.duration && b.values.value && (d = AmCharts.formatDuration(b.values.value, d.duration, "", d.durationUnits, d.maxInterval, d.numberFormatter), a = a.split("[[value]]").join(d));
        a = AmCharts.massReplace(a,
            {"[[title]]": c.title, "[[description]]": b.description, "<br>": "\n"});
        a = AmCharts.fixNewLines(a);
        return a = AmCharts.cleanFromEmpty(a)
    }, getBalloonColor: function (a, b) {
        var c = a.lineColor, d = a.balloonColor, e = a.fillColors;
        "object" == typeof e ? c = e[0] : void 0 !== e && (c = e);
        if (b.isNegative) {
            var e = a.negativeLineColor, f = a.negativeFillColors;
            "object" == typeof f ? e = f[0] : void 0 !== f && (e = f);
            void 0 !== e && (c = e)
        }
        void 0 !== b.color && (c = b.color);
        void 0 === d && (d = c);
        return d
    }, getGraphById: function (a) {
        return this.getObjById(this.graphs, a)
    },
    getValueAxisById: function (a) {
        return this.getObjById(this.valueAxes, a)
    }, getObjById: function (a, b) {
        var c, d;
        for (d = 0; d < a.length; d++) {
            var e = a[d];
            e.id == b && (c = e)
        }
        return c
    }, processFields: function (a, b, c) {
        if (a.itemColors) {
            var d = a.itemColors, e = b.index;
            b.color = e < d.length ? d[e] : AmCharts.randomColor()
        }
        d = "lineColor color alpha fillColors description bullet customBullet bulletSize bulletConfig url labelColor".split(" ");
        for (e = 0; e < d.length; e++) {
            var f = d[e], g = a[f + "Field"];
            g && (g = c[g], AmCharts.isDefined(g) && (b[f] = g))
        }
        b.dataContext =
            c
    }, chooseGraphColor: function (a, b) {
        if (void 0 == a.lineColor) {
            var c;
            c = this.colors.length > b ? this.colors[b] : AmCharts.randomColor();
            a.lineColor = c
        }
    }, handleLegendEvent: function (a) {
        var b = a.type;
        if (a = a.dataItem) {
            var c = a.hidden, d = a.showBalloon;
            switch (b) {
                case "clickMarker":
                    d ? this.hideGraphsBalloon(a) : this.showGraphsBalloon(a);
                    break;
                case "clickLabel":
                    d ? this.hideGraphsBalloon(a) : this.showGraphsBalloon(a);
                    break;
                case "rollOverItem":
                    c || this.highlightGraph(a);
                    break;
                case "rollOutItem":
                    c || this.unhighlightGraph();
                    break;
                case "hideItem":
                    this.hideGraph(a);
                    break;
                case "showItem":
                    this.showGraph(a)
            }
        }
    }, highlightGraph: function (a) {
        var b = this.graphs, c, d = 0.2;
        this.legend && (d = this.legend.rollOverGraphAlpha);
        if (1 != d)for (c = 0; c < b.length; c++) {
            var e = b[c];
            e != a && e.changeOpacity(d)
        }
    }, unhighlightGraph: function () {
        var a;
        this.legend && (a = this.legend.rollOverGraphAlpha);
        if (1 != a) {
            a = this.graphs;
            var b;
            for (b = 0; b < a.length; b++)a[b].changeOpacity(1)
        }
    }, showGraph: function (a) {
        a.hidden = !1;
        this.dataChanged = !0;
        this.marginsUpdated = !1;
        this.chartCreated &&
        this.initChart()
    }, hideGraph: function (a) {
        this.dataChanged = !0;
        this.marginsUpdated = !1;
        a.hidden = !0;
        this.chartCreated && this.initChart()
    }, hideGraphsBalloon: function (a) {
        a.showBalloon = !1;
        this.updateLegend()
    }, showGraphsBalloon: function (a) {
        a.showBalloon = !0;
        this.updateLegend()
    }, updateLegend: function () {
        this.legend && this.legend.invalidateSize()
    }, resetAnimation: function () {
        var a = this.graphs;
        if (a) {
            var b;
            for (b = 0; b < a.length; b++)a[b].animationPlayed = !1
        }
    }, animateAgain: function () {
        this.resetAnimation();
        this.validateNow()
    }
});
AmCharts.AmRectangularChart = AmCharts.Class({
    inherits: AmCharts.AmCoordinateChart, construct: function () {
        AmCharts.AmRectangularChart.base.construct.call(this);
        this.createEvents("zoomed");
        this.marginRight = this.marginBottom = this.marginTop = this.marginLeft = 20;
        this.verticalPosition = this.horizontalPosition = this.depth3D = this.angle = 0;
        this.heightMultiplier = this.widthMultiplier = 1;
        this.zoomOutText = "Show all";
        this.zoomOutButton = {backgroundColor: "#b2e1ff", backgroundAlpha: 1};
        this.trendLines = [];
        this.autoMargins = !0;
        this.marginsUpdated = !1;
        this.autoMarginOffset = 10
    }, initChart: function () {
        AmCharts.AmRectangularChart.base.initChart.call(this);
        this.updateDxy();
        var a = !0;
        !this.marginsUpdated && this.autoMargins && (this.resetMargins(), a = !1);
        this.updateMargins();
        this.updatePlotArea();
        this.updateScrollbars();
        this.updateTrendLines();
        this.updateChartCursor();
        this.updateValueAxes();
        a && (this.scrollbarOnly || this.updateGraphs())
    }, drawChart: function () {
        AmCharts.AmRectangularChart.base.drawChart.call(this);
        this.drawPlotArea();
        if (AmCharts.ifArray(this.chartData)) {
            var a =
                this.chartCursor;
            a && a.draw();
            a = this.zoomOutText;
            "" !== a && a && this.drawZoomOutButton()
        }
    }, resetMargins: function () {
        var a = {}, b;
        if ("serial" == this.chartType) {
            var c = this.valueAxes;
            for (b = 0; b < c.length; b++) {
                var d = c[b];
                d.ignoreAxisWidth || (d.setOrientation(this.rotate), d.fixAxisPosition(), a[d.position] = !0)
            }
            (b = this.categoryAxis) && !b.ignoreAxisWidth && (b.setOrientation(!this.rotate), b.fixAxisPosition(), b.fixAxisPosition(), a[b.position] = !0)
        } else {
            d = this.xAxes;
            c = this.yAxes;
            for (b = 0; b < d.length; b++) {
                var e = d[b];
                e.ignoreAxisWidth ||
                (e.setOrientation(!0), e.fixAxisPosition(), a[e.position] = !0)
            }
            for (b = 0; b < c.length; b++)d = c[b], d.ignoreAxisWidth || (d.setOrientation(!1), d.fixAxisPosition(), a[d.position] = !0)
        }
        a.left && (this.marginLeft = 0);
        a.right && (this.marginRight = 0);
        a.top && (this.marginTop = 0);
        a.bottom && (this.marginBottom = 0);
        this.fixMargins = a
    }, measureMargins: function () {
        var a = this.valueAxes, b, c = this.autoMarginOffset, d = this.fixMargins, e = this.realWidth, f = this.realHeight, g = c, h = c, k = e - c;
        b = f - c;
        var l;
        for (l = 0; l < a.length; l++)b = this.getAxisBounds(a[l],
            g, k, h, b), g = b.l, k = b.r, h = b.t, b = b.b;
        if (a = this.categoryAxis)b = this.getAxisBounds(a, g, k, h, b), g = b.l, k = b.r, h = b.t, b = b.b;
        d.left && g < c && (this.marginLeft = Math.round(-g + c));
        d.right && k > e - c && (this.marginRight = Math.round(k - e + c));
        d.top && h < c + this.titleHeight && (this.marginTop = Math.round(this.marginTop - h + c + this.titleHeight));
        d.bottom && b > f - c && (this.marginBottom = Math.round(b - f + c));
        this.initChart()
    }, getAxisBounds: function (a, b, c, d, e) {
        if (!a.ignoreAxisWidth) {
            var f = a.labelsSet, g = a.tickLength;
            a.inside && (g = 0);
            if (f)switch (f = a.getBBox(),
                a.position) {
                case "top":
                    a = f.y;
                    d > a && (d = a);
                    break;
                case "bottom":
                    a = f.y + f.height;
                    e < a && (e = a);
                    break;
                case "right":
                    a = f.x + f.width + g + 3;
                    c < a && (c = a);
                    break;
                case "left":
                    a = f.x - g, b > a && (b = a)
            }
        }
        return {l: b, t: d, r: c, b: e}
    }, drawZoomOutButton: function () {
        var a = this, b = a.container.set();
        a.zoomButtonSet.push(b);
        var c = a.color, d = a.fontSize, e = a.zoomOutButton;
        e && (e.fontSize && (d = e.fontSize), e.color && (c = e.color));
        c = AmCharts.text(a.container, a.zoomOutText, c, a.fontFamily, d, "start");
        d = c.getBBox();
        c.translate(29, 6 + d.height / 2);
        e = AmCharts.rect(a.container,
            d.width + 40, d.height + 15, e.backgroundColor, e.backgroundAlpha);
        b.push(e);
        a.zbBG = e;
        void 0 !== a.pathToImages && (e = a.container.image(a.pathToImages + "lens.png", 0, 0, 16, 16), e.translate(7, d.height / 2 - 1), e.toFront(), b.push(e));
        c.toFront();
        b.push(c);
        e = b.getBBox();
        b.translate(a.marginLeftReal + a.plotAreaWidth - e.width, a.marginTopReal);
        b.hide();
        b.mouseover(function () {
            a.rollOverZB()
        }).mouseout(function () {
            a.rollOutZB()
        }).click(function () {
            a.clickZB()
        }).touchstart(function () {
            a.rollOverZB()
        }).touchend(function () {
            a.rollOutZB();
            a.clickZB()
        });
        for (e = 0; e < b.length; e++)b[e].attr({cursor: "pointer"});
        a.zbSet = b
    }, rollOverZB: function () {
        this.zbBG.show()
    }, rollOutZB: function () {
        this.zbBG.hide()
    }, clickZB: function () {
        this.zoomOut()
    }, zoomOut: function () {
        this.updateScrollbar = !0;
        this.zoom()
    }, drawPlotArea: function () {
        var a = this.dx, b = this.dy, c = this.marginLeftReal, d = this.marginTopReal, e = this.plotAreaWidth - 1, f = this.plotAreaHeight - 1, g = this.plotAreaFillColors, h = this.plotAreaFillAlphas, k = this.plotAreaBorderColor, l = this.plotAreaBorderAlpha;
        this.trendLinesSet.clipRect(c,
            d, e, f);
        "object" == typeof h && (h = h[0]);
        g = AmCharts.polygon(this.container, [0, e, e, 0], [0, 0, f, f], g, h, 1, k, l, this.plotAreaGradientAngle);
        g.translate(c + a, d + b);
        g.node.setAttribute("class", "amChartsPlotArea");
        this.set.push(g);
        0 !== a && 0 !== b && (g = this.plotAreaFillColors, "object" == typeof g && (g = g[0]), g = AmCharts.adjustLuminosity(g, -0.15), e = AmCharts.polygon(this.container, [0, a, e + a, e, 0], [0, b, b, 0, 0], g, h, 1, k, l), e.translate(c, d + f), this.set.push(e), a = AmCharts.polygon(this.container, [0, 0, a, a, 0], [0, f, f + b, b, 0], g, h, 1, k, l), a.translate(c,
            d), this.set.push(a))
    }, updatePlotArea: function () {
        var a = this.updateWidth(), b = this.updateHeight(), c = this.container;
        this.realWidth = a;
        this.realWidth = b;
        c && this.container.setSize(a, b);
        a = a - this.marginLeftReal - this.marginRightReal - this.dx;
        b = b - this.marginTopReal - this.marginBottomReal;
        1 > a && (a = 1);
        1 > b && (b = 1);
        this.plotAreaWidth = Math.round(a);
        this.plotAreaHeight = Math.round(b)
    }, updateDxy: function () {
        this.dx = Math.round(this.depth3D * Math.cos(this.angle * Math.PI / 180));
        this.dy = Math.round(-this.depth3D * Math.sin(this.angle *
                Math.PI / 180));
        this.d3x = Math.round(this.columnSpacing3D * Math.cos(this.angle * Math.PI / 180));
        this.d3y = Math.round(-this.columnSpacing3D * Math.sin(this.angle * Math.PI / 180))
    }, updateMargins: function () {
        var a = this.getTitleHeight();
        this.titleHeight = a;
        this.marginTopReal = this.marginTop - this.dy + a;
        this.marginBottomReal = this.marginBottom;
        this.marginLeftReal = this.marginLeft;
        this.marginRightReal = this.marginRight
    }, updateValueAxes: function () {
        var a = this.valueAxes, b = this.marginLeftReal, c = this.marginTopReal, d = this.plotAreaHeight,
            e = this.plotAreaWidth, f;
        for (f = 0; f < a.length; f++) {
            var g = a[f];
            g.axisRenderer = AmCharts.RecAxis;
            g.guideFillRenderer = AmCharts.RecFill;
            g.axisItemRenderer = AmCharts.RecItem;
            g.dx = this.dx;
            g.dy = this.dy;
            g.viW = e - 1;
            g.viH = d - 1;
            g.marginsChanged = !0;
            g.viX = b;
            g.viY = c;
            this.updateObjectSize(g)
        }
    }, updateObjectSize: function (a) {
        a.width = (this.plotAreaWidth - 1) * this.widthMultiplier;
        a.height = (this.plotAreaHeight - 1) * this.heightMultiplier;
        a.x = this.marginLeftReal + this.horizontalPosition;
        a.y = this.marginTopReal + this.verticalPosition
    },
    updateGraphs: function () {
        var a = this.graphs, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.x = this.marginLeftReal + this.horizontalPosition;
            c.y = this.marginTopReal + this.verticalPosition;
            c.width = this.plotAreaWidth * this.widthMultiplier;
            c.height = this.plotAreaHeight * this.heightMultiplier;
            c.index = b;
            c.dx = this.dx;
            c.dy = this.dy;
            c.rotate = this.rotate;
            c.chartType = this.chartType
        }
    }, updateChartCursor: function () {
        var a = this.chartCursor;
        a && (a.x = this.marginLeftReal, a.y = this.marginTopReal, a.width = this.plotAreaWidth - 1, a.height = this.plotAreaHeight -
            1, a.chart = this)
    }, updateScrollbars: function () {
    }, addChartCursor: function (a) {
        AmCharts.callMethod("destroy", [this.chartCursor]);
        a && (this.listenTo(a, "changed", this.handleCursorChange), this.listenTo(a, "zoomed", this.handleCursorZoom));
        this.chartCursor = a
    }, removeChartCursor: function () {
        AmCharts.callMethod("destroy", [this.chartCursor]);
        this.chartCursor = null
    }, zoomTrendLines: function () {
        var a = this.trendLines, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.valueAxis.recalculateToPercents ? c.set && c.set.hide() : (c.x = this.marginLeftReal +
                this.horizontalPosition, c.y = this.marginTopReal + this.verticalPosition, c.draw())
        }
    }, addTrendLine: function (a) {
        this.trendLines.push(a)
    }, removeTrendLine: function (a) {
        var b = this.trendLines, c;
        for (c = b.length - 1; 0 <= c; c--)b[c] == a && b.splice(c, 1)
    }, adjustMargins: function (a, b) {
        var c = a.scrollbarHeight;
        "top" == a.position ? b ? this.marginLeftReal += c : this.marginTopReal += c : b ? this.marginRightReal += c : this.marginBottomReal += c
    }, getScrollbarPosition: function (a, b, c) {
        a.position = b ? "bottom" == c || "left" == c ? "bottom" : "top" : "top" == c || "right" ==
        c ? "bottom" : "top"
    }, updateChartScrollbar: function (a, b) {
        if (a) {
            a.rotate = b;
            var c = this.marginTopReal, d = this.marginLeftReal, e = a.scrollbarHeight, f = this.dx, g = this.dy;
            "top" == a.position ? b ? (a.y = c, a.x = d - e) : (a.y = c - e + g, a.x = d + f) : b ? (a.y = c + g, a.x = d + this.plotAreaWidth + f) : (a.y = c + this.plotAreaHeight + 1, a.x = this.marginLeftReal)
        }
    }, showZB: function (a) {
        var b = this.zbSet;
        b && (a ? b.show() : b.hide(), this.zbBG.hide())
    }, handleReleaseOutside: function (a) {
        AmCharts.AmRectangularChart.base.handleReleaseOutside.call(this, a);
        (a = this.chartCursor) &&
        a.handleReleaseOutside()
    }, handleMouseDown: function (a) {
        AmCharts.AmRectangularChart.base.handleMouseDown.call(this, a);
        var b = this.chartCursor;
        b && b.handleMouseDown(a)
    }, handleCursorChange: function (a) {
    }
});
AmCharts.TrendLine = AmCharts.Class({
    construct: function () {
        this.createEvents("click");
        this.isProtected = !1;
        this.dashLength = 0;
        this.lineColor = "#00CC00";
        this.lineThickness = this.lineAlpha = 1
    }, draw: function () {
        var a = this;
        a.destroy();
        var b = a.chart, c = b.container, d, e, f, g, h = a.categoryAxis, k = a.initialDate, l = a.initialCategory, m = a.finalDate, n = a.finalCategory, s = a.valueAxis, q = a.valueAxisX, t = a.initialXValue, p = a.finalXValue, r = a.initialValue, u = a.finalValue, v = s.recalculateToPercents;
        h && (k && (d = h.dateToCoordinate(k)), l && (d =
            h.categoryToCoordinate(l)), m && (e = h.dateToCoordinate(m)), n && (e = h.categoryToCoordinate(n)));
        q && !v && (isNaN(t) || (d = q.getCoordinate(t)), isNaN(p) || (e = q.getCoordinate(p)));
        s && !v && (isNaN(r) || (f = s.getCoordinate(r)), isNaN(u) || (g = s.getCoordinate(u)));
        isNaN(d) || (isNaN(e) || isNaN(f) || isNaN(f)) || (b.rotate ? (h = [f, g], e = [d, e]) : (h = [d, e], e = [f, g]), f = a.lineColor, d = AmCharts.line(c, h, e, f, a.lineAlpha, a.lineThickness, a.dashLength), e = AmCharts.line(c, h, e, f, 0.005, 5), c = c.set([d, e]), c.translate(b.marginLeftReal, b.marginTopReal),
            b.trendLinesSet.push(c), a.line = d, a.set = c, e.mouseup(function () {
            a.handleLineClick()
        }).mouseover(function () {
            a.handleLineOver()
        }).mouseout(function () {
            a.handleLineOut()
        }), e.touchend && e.touchend(function () {
            a.handleLineClick()
        }))
    }, handleLineClick: function () {
        var a = {type: "click", trendLine: this, chart: this.chart};
        this.fire(a.type, a)
    }, handleLineOver: function () {
        var a = this.rollOverColor;
        void 0 !== a && this.line.attr({stroke: a})
    }, handleLineOut: function () {
        this.line.attr({stroke: this.lineColor})
    }, destroy: function () {
        AmCharts.remove(this.set)
    }
});
AmCharts.AmSerialChart = AmCharts.Class({
    inherits: AmCharts.AmRectangularChart, construct: function () {
        AmCharts.AmSerialChart.base.construct.call(this);
        this.createEvents("changed");
        this.columnSpacing = 5;
        this.columnSpacing3D = 0;
        this.columnWidth = 0.8;
        this.updateScrollbar = !0;
        var a = new AmCharts.CategoryAxis;
        a.chart = this;
        this.categoryAxis = a;
        this.chartType = "serial";
        this.zoomOutOnDataUpdate = !0;
        this.skipZoom = !1;
        this.minSelectedTime = 0
    }, initChart: function () {
        AmCharts.AmSerialChart.base.initChart.call(this);
        this.updateCategoryAxis();
        this.dataChanged && (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
        var a = this.chartCursor;
        a && a.updateData();
        var a = this.countColumns(), b = this.graphs, c;
        for (c = 0; c < b.length; c++)b[c].columnCount = a;
        this.updateScrollbar = !0;
        this.drawChart();
        this.autoMargins && !this.marginsUpdated && (this.marginsUpdated = !0, this.measureMargins())
    }, validateData: function (a) {
        this.marginsUpdated = !1;
        this.zoomOutOnDataUpdate && !a && (this.endTime = this.end = this.startTime = this.start = NaN);
        AmCharts.AmSerialChart.base.validateData.call(this)
    },
    drawChart: function () {
        AmCharts.AmSerialChart.base.drawChart.call(this);
        var a = this.chartData;
        if (AmCharts.ifArray(a)) {
            var b = this.chartScrollbar;
            b && b.draw();
            if (0 < this.realWidth && 0 < this.realHeight) {
                var a = a.length - 1, c, b = this.categoryAxis;
                if (b.parseDates && !b.equalSpacing) {
                    if (b = this.startTime, c = this.endTime, isNaN(b) || isNaN(c))b = this.firstTime, c = this.lastTime
                } else if (b = this.start, c = this.end, isNaN(b) || isNaN(c))b = 0, c = a;
                this.endTime = this.startTime = this.end = this.start = void 0;
                this.zoom(b, c)
            }
        } else this.cleanChart();
        this.dispDUpd();
        this.chartCreated = !0
    }, cleanChart: function () {
        AmCharts.callMethod("destroy", [this.valueAxes, this.graphs, this.categoryAxis, this.chartScrollbar, this.chartCursor])
    }, updateCategoryAxis: function () {
        var a = this.categoryAxis;
        a.id = "categoryAxis";
        a.rotate = this.rotate;
        a.axisRenderer = AmCharts.RecAxis;
        a.guideFillRenderer = AmCharts.RecFill;
        a.axisItemRenderer = AmCharts.RecItem;
        a.setOrientation(!this.rotate);
        a.x = this.marginLeftReal;
        a.y = this.marginTopReal;
        a.dx = this.dx;
        a.dy = this.dy;
        a.width = this.plotAreaWidth -
            1;
        a.height = this.plotAreaHeight - 1;
        a.viW = this.plotAreaWidth - 1;
        a.viH = this.plotAreaHeight - 1;
        a.viX = this.marginLeftReal;
        a.viY = this.marginTopReal;
        a.marginsChanged = !0
    }, updateValueAxes: function () {
        AmCharts.AmSerialChart.base.updateValueAxes.call(this);
        var a = this.valueAxes, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b], d = this.rotate;
            c.rotate = d;
            c.setOrientation(d);
            d = this.categoryAxis;
            if (!d.startOnAxis || d.parseDates)c.expandMinMax = !0
        }
    }, updateData: function () {
        this.parseData();
        var a = this.graphs, b, c = this.chartData;
        for (b = 0; b <
        a.length; b++)a[b].data = c;
        0 < c.length && (this.firstTime = this.getStartTime(c[0].time), this.lastTime = this.getEndTime(c[c.length - 1].time))
    }, getStartTime: function (a) {
        var b = this.categoryAxis;
        return AmCharts.resetDateToMin(new Date(a), b.minPeriod, 1, b.firstDayOfWeek).getTime()
    }, getEndTime: function (a) {
        var b = AmCharts.extractPeriod(this.categoryAxis.minPeriod);
        return AmCharts.changeDate(new Date(a), b.period, b.count, !0).getTime() - 1
    }, updateMargins: function () {
        AmCharts.AmSerialChart.base.updateMargins.call(this);
        var a = this.chartScrollbar;
        a && (this.getScrollbarPosition(a, this.rotate, this.categoryAxis.position), this.adjustMargins(a, this.rotate))
    }, updateScrollbars: function () {
        this.updateChartScrollbar(this.chartScrollbar, this.rotate)
    }, zoom: function (a, b) {
        var c = this.categoryAxis;
        c.parseDates && !c.equalSpacing ? this.timeZoom(a, b) : this.indexZoom(a, b)
    }, timeZoom: function (a, b) {
        var c = this.maxSelectedTime;
        isNaN(c) || (b != this.endTime && b - a > c && (a = b - c, this.updateScrollbar = !0), a != this.startTime && b - a > c && (b = a + c, this.updateScrollbar = !0));
        var d = this.minSelectedTime;
        if (0 < d && b - a < d) {
            var e = Math.round(a + (b - a) / 2), d = Math.round(d / 2);
            a = e - d;
            b = e + d
        }
        var f = this.chartData, e = this.categoryAxis;
        if (AmCharts.ifArray(f) && (a != this.startTime || b != this.endTime)) {
            var g = e.minDuration(), d = this.firstTime, h = this.lastTime;
            a || (a = d, isNaN(c) || (a = h - c));
            b || (b = h);
            a > h && (a = h);
            b < d && (b = d);
            a < d && (a = d);
            b > h && (b = h);
            b < a && (b = a + g);
            b - a < g / 5 && (b < h ? b = a + g / 5 : a = b - g / 5);
            this.startTime = a;
            this.endTime = b;
            c = f.length - 1;
            g = this.getClosestIndex(f, "time", a, !0, 0, c);
            f = this.getClosestIndex(f, "time",
                b, !1, g, c);
            e.timeZoom(a, b);
            e.zoom(g, f);
            this.start = AmCharts.fitToBounds(g, 0, c);
            this.end = AmCharts.fitToBounds(f, 0, c);
            this.zoomAxesAndGraphs();
            this.zoomScrollbar();
            a != d || b != h ? this.showZB(!0) : this.showZB(!1);
            this.updateColumnsDepth();
            this.dispatchTimeZoomEvent()
        }
    }, indexZoom: function (a, b) {
        var c = this.maxSelectedSeries;
        isNaN(c) || (b != this.end && b - a > c && (a = b - c, this.updateScrollbar = !0), a != this.start && b - a > c && (b = a + c, this.updateScrollbar = !0));
        if (a != this.start || b != this.end) {
            var d = this.chartData.length - 1;
            isNaN(a) &&
            (a = 0, isNaN(c) || (a = d - c));
            isNaN(b) && (b = d);
            b < a && (b = a);
            b > d && (b = d);
            a > d && (a = d - 1);
            0 > a && (a = 0);
            this.start = a;
            this.end = b;
            this.categoryAxis.zoom(a, b);
            this.zoomAxesAndGraphs();
            this.zoomScrollbar();
            0 !== a || b != this.chartData.length - 1 ? this.showZB(!0) : this.showZB(!1);
            this.updateColumnsDepth();
            this.dispatchIndexZoomEvent()
        }
    }, updateGraphs: function () {
        AmCharts.AmSerialChart.base.updateGraphs.call(this);
        var a = this.graphs, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.columnWidth = this.columnWidth;
            c.categoryAxis = this.categoryAxis
        }
    },
    updateColumnsDepth: function () {
        var a, b = this.graphs, c;
        AmCharts.remove(this.columnsSet);
        this.columnsArray = [];
        for (a = 0; a < b.length; a++) {
            c = b[a];
            var d = c.columnsArray;
            if (d) {
                var e;
                for (e = 0; e < d.length; e++)this.columnsArray.push(d[e])
            }
        }
        this.columnsArray.sort(this.compareDepth);
        if (0 < this.columnsArray.length) {
            b = this.container.set();
            this.columnSet.push(b);
            for (a = 0; a < this.columnsArray.length; a++)b.push(this.columnsArray[a].column.set);
            c && b.translate(c.x, c.y);
            this.columnsSet = b
        }
    }, compareDepth: function (a, b) {
        return a.depth >
        b.depth ? 1 : -1
    }, zoomScrollbar: function () {
        var a = this.chartScrollbar, b = this.categoryAxis;
        a && this.updateScrollbar && (b.parseDates && !b.equalSpacing ? a.timeZoom(this.startTime, this.endTime) : a.zoom(this.start, this.end), this.updateScrollbar = !0)
    }, updateTrendLines: function () {
        var a = this.trendLines, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.chart = this;
            c.valueAxis || (c.valueAxis = this.valueAxes[0]);
            c.categoryAxis = this.categoryAxis
        }
    }, zoomAxesAndGraphs: function () {
        if (!this.scrollbarOnly) {
            var a = this.valueAxes, b;
            for (b = 0; b <
            a.length; b++)a[b].zoom(this.start, this.end);
            a = this.graphs;
            for (b = 0; b < a.length; b++)a[b].zoom(this.start, this.end);
            this.zoomTrendLines();
            (b = this.chartCursor) && b.zoom(this.start, this.end, this.startTime, this.endTime)
        }
    }, countColumns: function () {
        var a = 0, b = this.valueAxes.length, c = this.graphs.length, d, e, f = !1, g, h;
        for (h = 0; h < b; h++) {
            e = this.valueAxes[h];
            var k = e.stackType;
            if ("100%" == k || "regular" == k)for (f = !1, g = 0; g < c; g++)d = this.graphs[g], d.hidden || (d.valueAxis != e || "column" != d.type) || (!f && d.stackable && (a++, f = !0), d.stackable ||
            a++, d.columnIndex = a - 1);
            if ("none" == k || "3d" == k)for (g = 0; g < c; g++)d = this.graphs[g], d.hidden || (d.valueAxis != e || "column" != d.type) || (d.columnIndex = a, a++);
            if ("3d" == k) {
                for (h = 0; h < c; h++)d = this.graphs[h], d.depthCount = a;
                a = 1
            }
        }
        return a
    }, parseData: function () {
        AmCharts.AmSerialChart.base.parseData.call(this);
        this.parseSerialData()
    }, getCategoryIndexByValue: function (a) {
        var b = this.chartData, c, d;
        for (d = 0; d < b.length; d++)b[d].category == a && (c = d);
        return c
    }, handleCursorChange: function (a) {
        this.updateLegendValues(a.index)
    }, handleCursorZoom: function (a) {
        this.updateScrollbar = !0;
        this.zoom(a.start, a.end)
    }, handleScrollbarZoom: function (a) {
        this.updateScrollbar = !1;
        this.zoom(a.start, a.end)
    }, dispatchTimeZoomEvent: function () {
        if (this.prevStartTime != this.startTime || this.prevEndTime != this.endTime) {
            var a = {type: "zoomed"};
            a.startDate = new Date(this.startTime);
            a.endDate = new Date(this.endTime);
            a.startIndex = this.start;
            a.endIndex = this.end;
            this.startIndex = this.start;
            this.endIndex = this.end;
            this.startDate = a.startDate;
            this.endDate = a.endDate;
            this.prevStartTime = this.startTime;
            this.prevEndTime =
                this.endTime;
            var b = this.categoryAxis, c = AmCharts.extractPeriod(b.minPeriod).period, b = b.dateFormatsObject[c];
            a.startValue = AmCharts.formatDate(a.startDate, b);
            a.endValue = AmCharts.formatDate(a.endDate, b);
            a.chart = this;
            a.target = this;
            this.fire(a.type, a)
        }
    }, dispatchIndexZoomEvent: function () {
        if (this.prevStartIndex != this.start || this.prevEndIndex != this.end) {
            this.startIndex = this.start;
            this.endIndex = this.end;
            var a = this.chartData;
            if (AmCharts.ifArray(a) && !isNaN(this.start) && !isNaN(this.end)) {
                var b = {
                    chart: this, target: this,
                    type: "zoomed"
                };
                b.startIndex = this.start;
                b.endIndex = this.end;
                b.startValue = a[this.start].category;
                b.endValue = a[this.end].category;
                this.categoryAxis.parseDates && (this.startTime = a[this.start].time, this.endTime = a[this.end].time, b.startDate = new Date(this.startTime), b.endDate = new Date(this.endTime));
                this.prevStartIndex = this.start;
                this.prevEndIndex = this.end;
                this.fire(b.type, b)
            }
        }
    }, updateLegendValues: function (a) {
        var b = this.graphs, c;
        for (c = 0; c < b.length; c++) {
            var d = b[c];
            isNaN(a) ? d.currentDataItem = void 0 : d.currentDataItem =
                this.chartData[a].axes[d.valueAxis.id].graphs[d.id]
        }
        this.legend && this.legend.updateValues()
    }, getClosestIndex: function (a, b, c, d, e, f) {
        0 > e && (e = 0);
        f > a.length - 1 && (f = a.length - 1);
        var g = e + Math.round((f - e) / 2), h = a[g][b];
        if (1 >= f - e) {
            if (d)return e;
            d = a[f][b];
            return Math.abs(a[e][b] - c) < Math.abs(d - c) ? e : f
        }
        return c == h ? g : c < h ? this.getClosestIndex(a, b, c, d, e, g) : this.getClosestIndex(a, b, c, d, g, f)
    }, zoomToIndexes: function (a, b) {
        this.updateScrollbar = !0;
        var c = this.chartData;
        if (c) {
            var d = c.length;
            0 < d && (0 > a && (a = 0), b > d - 1 && (b = d - 1),
                d = this.categoryAxis, d.parseDates && !d.equalSpacing ? this.zoom(c[a].time, this.getEndTime(c[b].time)) : this.zoom(a, b))
        }
    }, zoomToDates: function (a, b) {
        this.updateScrollbar = !0;
        var c = this.chartData;
        if (this.categoryAxis.equalSpacing) {
            var d = this.getClosestIndex(c, "time", a.getTime(), !0, 0, c.length), c = this.getClosestIndex(c, "time", b.getTime(), !1, 0, c.length);
            this.zoom(d, c)
        } else this.zoom(a.getTime(), b.getTime())
    }, zoomToCategoryValues: function (a, b) {
        this.updateScrollbar = !0;
        this.zoom(this.getCategoryIndexByValue(a),
            this.getCategoryIndexByValue(b))
    }, formatString: function (a, b) {
        var c = b.graph;
        if (-1 != a.indexOf("[[category]]")) {
            var d = b.serialDataItem.category;
            if (this.categoryAxis.parseDates) {
                var e = this.balloonDateFormat, f = this.chartCursor;
                f && (e = f.categoryBalloonDateFormat);
                -1 != a.indexOf("[[category]]") && (e = AmCharts.formatDate(d, e), -1 != e.indexOf("fff") && (e = AmCharts.formatMilliseconds(e, d)), d = e)
            }
            a = a.replace(/\[\[category\]\]/g, String(d))
        }
        c = c.numberFormatter;
        c || (c = this.numberFormatter);
        d = b.graph.valueAxis;
        (e = d.duration) && !isNaN(b.values.value) && (d = AmCharts.formatDuration(b.values.value, e, "", d.durationUnits, d.maxInterval, c), a = a.replace(RegExp("\\[\\[value\\]\\]", "g"), d));
        d = "value open low high close total".split(" ");
        e = this.percentFormatter;
        a = AmCharts.formatValue(a, b.percents, d, e, "percents\\.");
        a = AmCharts.formatValue(a, b.values, d, c, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
        a = AmCharts.formatValue(a, b.values, ["percents"], e);
        -1 != a.indexOf("[[") && (a = AmCharts.formatDataContextValue(a, b.dataContext));
        return a = AmCharts.AmSerialChart.base.formatString.call(this, a, b)
    }, addChartScrollbar: function (a) {
        AmCharts.callMethod("destroy", [this.chartScrollbar]);
        a && (a.chart = this, this.listenTo(a, "zoomed", this.handleScrollbarZoom));
        this.rotate ? void 0 === a.width && (a.width = a.scrollbarHeight) : void 0 === a.height && (a.height = a.scrollbarHeight);
        this.chartScrollbar = a
    }, removeChartScrollbar: function () {
        AmCharts.callMethod("destroy", [this.chartScrollbar]);
        this.chartScrollbar = null
    }, handleReleaseOutside: function (a) {
        AmCharts.AmSerialChart.base.handleReleaseOutside.call(this,
            a);
        AmCharts.callMethod("handleReleaseOutside", [this.chartScrollbar])
    }
});
AmCharts.AmRadarChart = AmCharts.Class({
    inherits: AmCharts.AmCoordinateChart, construct: function () {
        AmCharts.AmRadarChart.base.construct.call(this);
        this.marginRight = this.marginBottom = this.marginTop = this.marginLeft = 0;
        this.chartType = "radar";
        this.radius = "35%"
    }, initChart: function () {
        AmCharts.AmRadarChart.base.initChart.call(this);
        this.dataChanged && (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
        this.drawChart()
    }, updateData: function () {
        this.parseData();
        var a = this.graphs, b;
        for (b = 0; b < a.length; b++)a[b].data =
            this.chartData
    }, updateGraphs: function () {
        var a = this.graphs, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.index = b;
            c.width = this.realRadius;
            c.height = this.realRadius;
            c.x = this.marginLeftReal;
            c.y = this.marginTopReal;
            c.chartType = this.chartType
        }
    }, parseData: function () {
        AmCharts.AmRadarChart.base.parseData.call(this);
        this.parseSerialData()
    }, updateValueAxes: function () {
        var a = this.valueAxes, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.axisRenderer = AmCharts.RadAxis;
            c.guideFillRenderer = AmCharts.RadarFill;
            c.axisItemRenderer = AmCharts.RadItem;
            c.autoGridCount = !1;
            c.x = this.marginLeftReal;
            c.y = this.marginTopReal;
            c.width = this.realRadius;
            c.height = this.realRadius
        }
    }, drawChart: function () {
        AmCharts.AmRadarChart.base.drawChart.call(this);
        var a = this.updateWidth(), b = this.updateHeight(), c = this.marginTop + this.getTitleHeight(), d = this.marginLeft, b = b - c - this.marginBottom;
        this.marginLeftReal = d + (a - d - this.marginRight) / 2;
        this.marginTopReal = c + b / 2;
        this.realRadius = AmCharts.toCoordinate(this.radius, a, b);
        this.updateValueAxes();
        this.updateGraphs();
        a = this.chartData;
        if (AmCharts.ifArray(a)) {
            if (0 < this.realWidth && 0 < this.realHeight) {
                a = a.length - 1;
                d = this.valueAxes;
                for (c = 0; c < d.length; c++)d[c].zoom(0, a);
                d = this.graphs;
                for (c = 0; c < d.length; c++)d[c].zoom(0, a);
                (a = this.legend) && a.invalidateSize()
            }
        } else this.cleanChart();
        this.dispDUpd();
        this.chartCreated = !0
    }, formatString: function (a, b) {
        var c = b.graph;
        -1 != a.indexOf("[[category]]") && (a = a.replace(/\[\[category\]\]/g, String(b.serialDataItem.category)));
        c = c.numberFormatter;
        c || (c = this.numberFormatter);
        a = AmCharts.formatValue(a, b.values,
            ["value"], c, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
        return a = AmCharts.AmRadarChart.base.formatString.call(this, a, b)
    }, cleanChart: function () {
        AmCharts.callMethod("destroy", [this.valueAxes, this.graphs])
    }
});
AmCharts.AxisBase = AmCharts.Class({
    construct: function () {
        this.viY = this.viX = this.y = this.x = this.dy = this.dx = 0;
        this.axisThickness = 1;
        this.axisColor = "#000000";
        this.axisAlpha = 1;
        this.gridCount = this.tickLength = 5;
        this.gridAlpha = 0.15;
        this.gridThickness = 1;
        this.gridColor = "#000000";
        this.dashLength = 0;
        this.labelFrequency = 1;
        this.showLastLabel = this.showFirstLabel = !0;
        this.fillColor = "#FFFFFF";
        this.fillAlpha = 0;
        this.labelsEnabled = !0;
        this.labelRotation = 0;
        this.autoGridCount = !0;
        this.valueRollOverColor = "#CC0000";
        this.offset =
            0;
        this.guides = [];
        this.visible = !0;
        this.counter = 0;
        this.guides = [];
        this.ignoreAxisWidth = this.inside = !1;
        this.minGap = 75;
        this.titleBold = !0
    }, zoom: function (a, b) {
        this.start = a;
        this.end = b;
        this.dataChanged = !0;
        this.draw()
    }, fixAxisPosition: function () {
        var a = this.position;
        "H" == this.orientation ? ("left" == a && (a = "bottom"), "right" == a && (a = "top")) : ("bottom" == a && (a = "left"), "top" == a && (a = "right"));
        this.position = a
    }, draw: function () {
        var a = this.chart;
        void 0 === this.titleColor && (this.titleColor = a.color);
        isNaN(this.titleFontSize) &&
        (this.titleFontSize = a.fontSize + 1);
        this.allLabels = [];
        this.counter = 0;
        this.destroy();
        this.fixAxisPosition();
        this.labels = [];
        var b = a.container, c = b.set();
        a.gridSet.push(c);
        this.set = c;
        b = b.set();
        a.axesLabelsSet.push(b);
        this.labelsSet = b;
        this.axisLine = new this.axisRenderer(this);
        this.autoGridCount && ("V" == this.orientation ? (a = this.height / 35, 3 > a && (a = 3)) : a = this.width / this.minGap, this.gridCount = Math.max(a, 1));
        this.axisWidth = this.axisLine.axisWidth;
        this.addTitle()
    }, setOrientation: function (a) {
        this.orientation = a ? "H" :
            "V"
    }, addTitle: function () {
        var a = this.title;
        if (a) {
            var b = this.chart;
            this.titleLabel = AmCharts.text(b.container, a, this.titleColor, b.fontFamily, this.titleFontSize, "middle", this.titleBold)
        }
    }, positionTitle: function () {
        var a = this.titleLabel;
        if (a) {
            var b, c, d = this.labelsSet, e = {};
            0 < d.length() ? e = d.getBBox() : (e.x = 0, e.y = 0, e.width = this.viW, e.height = this.viH);
            d.push(a);
            var d = e.x, f = e.y;
            AmCharts.VML && (this.rotate ? d -= this.x : f -= this.y);
            var g = e.width, e = e.height, h = this.viW, k = this.viH;
            a.getBBox();
            var l = 0, m = this.titleFontSize /
                2, n = this.inside;
            switch (this.position) {
                case "top":
                    b = h / 2;
                    c = f - 10 - m;
                    break;
                case "bottom":
                    b = h / 2;
                    c = f + e + 10 + m;
                    break;
                case "left":
                    b = d - 10 - m;
                    n && (b -= 5);
                    c = k / 2;
                    l = -90;
                    break;
                case "right":
                    b = d + g + 10 + m - 3, n && (b += 7), c = k / 2, l = -90
            }
            this.marginsChanged ? (a.translate(b, c), this.tx = b, this.ty = c) : a.translate(this.tx, this.ty);
            this.marginsChanged = !1;
            0 !== l && a.rotate(l)
        }
    }, pushAxisItem: function (a, b) {
        var c = a.graphics();
        0 < c.length() && (b ? this.labelsSet.push(c) : this.set.push(c));
        (c = a.getLabel()) && this.labelsSet.push(c)
    }, addGuide: function (a) {
        this.guides.push(a)
    },
    removeGuide: function (a) {
        var b = this.guides, c;
        for (c = 0; c < b.length; c++)b[c] == a && b.splice(c, 1)
    }, handleGuideOver: function (a) {
        clearTimeout(this.chart.hoverInt);
        var b = a.graphics.getBBox(), c = b.x + b.width / 2, b = b.y + b.height / 2, d = a.fillColor;
        void 0 === d && (d = a.lineColor);
        this.chart.showBalloon(a.balloonText, d, !0, c, b)
    }, handleGuideOut: function (a) {
        this.chart.hideBalloon()
    }, addEventListeners: function (a, b) {
        var c = this;
        a.mouseover(function () {
            c.handleGuideOver(b)
        });
        a.mouseout(function () {
            c.handleGuideOut(b)
        })
    }, getBBox: function () {
        var a =
            this.labelsSet.getBBox();
        AmCharts.VML || (a = {x: a.x + this.x, y: a.y + this.y, width: a.width, height: a.height});
        return a
    }, destroy: function () {
        AmCharts.remove(this.set);
        AmCharts.remove(this.labelsSet);
        var a = this.axisLine;
        a && AmCharts.remove(a.set);
        AmCharts.remove(this.grid0)
    }
});
AmCharts.ValueAxis = AmCharts.Class({
    inherits: AmCharts.AxisBase, construct: function () {
        this.createEvents("axisChanged", "logarithmicAxisFailed", "axisSelfZoomed", "axisZoomed");
        AmCharts.ValueAxis.base.construct.call(this);
        this.dataChanged = !0;
        this.gridCount = 8;
        this.stackType = "none";
        this.position = "left";
        this.unitPosition = "right";
        this.recalculateToPercents = this.includeHidden = this.includeGuidesInMinMax = this.integersOnly = !1;
        this.durationUnits = {DD: "d. ", hh: ":", mm: ":", ss: ""};
        this.scrollbar = !1;
        this.baseValue = 0;
        this.radarCategoriesEnabled = !0;
        this.gridType = "polygons";
        this.useScientificNotation = !1;
        this.axisTitleOffset = 10;
        this.minMaxMultiplier = 1
    }, updateData: function () {
        0 >= this.gridCount && (this.gridCount = 1);
        this.totals = [];
        this.data = this.chart.chartData;
        "xy" != this.chart.chartType && (this.stackGraphs("smoothedLine"), this.stackGraphs("line"), this.stackGraphs("column"), this.stackGraphs("step"));
        this.recalculateToPercents && this.recalculate();
        this.synchronizationMultiplier && this.synchronizeWithAxis ? this.foundGraphs = !0 : (this.foundGraphs = !1, this.getMinMax())
    },
    draw: function () {
        AmCharts.ValueAxis.base.draw.call(this);
        var a = this.chart, b = this.set;
        "duration" == this.type && (this.duration = "ss");
        !0 === this.dataChanged && (this.updateData(), this.dataChanged = !1);
        if (this.logarithmic && (0 >= this.getMin(0, this.data.length - 1) || 0 >= this.minimum))this.fire("logarithmicAxisFailed", {
            type: "logarithmicAxisFailed",
            chart: a
        }); else {
            this.grid0 = null;
            var c, d, e = a.dx, f = a.dy, g = !1, h = this.logarithmic, k = a.chartType;
            if (isNaN(this.min) || isNaN(this.max) || !this.foundGraphs || Infinity == this.min || -Infinity ==
                this.max)g = !0; else {
                var l = this.labelFrequency, m = this.showFirstLabel, n = this.showLastLabel, s = 1, q = 0, t = Math.round((this.max - this.min) / this.step) + 1, p;
                !0 === h ? (p = Math.log(this.max) * Math.LOG10E - Math.log(this.minReal) * Math.LOG10E, this.stepWidth = this.axisWidth / p, 2 < p && (t = Math.ceil(Math.log(this.max) * Math.LOG10E) + 1, q = Math.round(Math.log(this.minReal) * Math.LOG10E), t > this.gridCount && (s = Math.ceil(t / this.gridCount)))) : this.stepWidth = this.axisWidth / (this.max - this.min);
                c = 0;
                1 > this.step && -1 < this.step && (c = this.getDecimals(this.step));
                this.integersOnly && (c = 0);
                c > this.maxDecCount && (c = this.maxDecCount);
                var r = this.precision;
                isNaN(r) || (c = r);
                this.max = AmCharts.roundTo(this.max, this.maxDecCount);
                this.min = AmCharts.roundTo(this.min, this.maxDecCount);
                var u = {};
                u.precision = c;
                u.decimalSeparator = a.numberFormatter.decimalSeparator;
                u.thousandsSeparator = a.numberFormatter.thousandsSeparator;
                this.numberFormatter = u;
                var v, w = this.guides, A = w.length;
                if (0 < A) {
                    var x = this.fillAlpha;
                    for (d = this.fillAlpha = 0; d < A; d++) {
                        var B = w[d], y = NaN, z = B.above;
                        isNaN(B.toValue) ||
                        (y = this.getCoordinate(B.toValue), v = new this.axisItemRenderer(this, y, "", !0, NaN, NaN, B), this.pushAxisItem(v, z));
                        var C = NaN;
                        isNaN(B.value) || (C = this.getCoordinate(B.value), v = new this.axisItemRenderer(this, C, B.label, !0, NaN, (y - C) / 2, B), this.pushAxisItem(v, z));
                        isNaN(y - C) || (v = new this.guideFillRenderer(this, C, y, B), this.pushAxisItem(v, z), v = v.graphics(), B.graphics = v, B.balloonText && this.addEventListeners(v, B))
                    }
                    this.fillAlpha = x
                }
                w = !1;
                for (d = q; d < t; d += s)v = AmCharts.roundTo(this.step * d + this.min, c), -1 != String(v).indexOf("e") &&
                (w = !0, String(v).split("e"));
                this.duration && (this.maxInterval = AmCharts.getMaxInterval(this.max, this.duration));
                for (d = q; d < t; d += s)if (q = this.step * d + this.min, q = AmCharts.roundTo(q, this.maxDecCount + 1), !this.integersOnly || Math.round(q) == q)if (isNaN(r) || Number(AmCharts.toFixed(q, r)) == q) {
                    !0 === h && (0 === q && (q = this.minReal), 2 < p && (q = Math.pow(10, d)), w = -1 != String(q).indexOf("e") ? !0 : !1);
                    this.useScientificNotation && (w = !0);
                    this.usePrefixes && (w = !1);
                    w ? (v = -1 == String(q).indexOf("e") ? q.toExponential(15) : String(q), v = v.split("e"),
                        c = Number(v[0]), v = Number(v[1]), c = AmCharts.roundTo(c, 14), 10 == c && (c = 1, v += 1), v = c + "e" + v, 0 === q && (v = "0"), 1 == q && (v = "1")) : (h && (c = String(q).split("."), u.precision = c[1] ? c[1].length : -1), v = this.usePrefixes ? AmCharts.addPrefix(q, a.prefixesOfBigNumbers, a.prefixesOfSmallNumbers, u, !0) : AmCharts.formatNumber(q, u, u.precision));
                    this.duration && (v = AmCharts.formatDuration(q, this.duration, "", this.durationUnits, this.maxInterval, u));
                    this.recalculateToPercents ? v += "%" : (c = this.unit) && (v = "left" == this.unitPosition ? c + v : v + c);
                    Math.round(d /
                        l) != d / l && (v = void 0);
                    if (0 === d && !m || d == t - 1 && !n)v = " ";
                    c = this.getCoordinate(q);
                    this.labelFunction && (v = this.labelFunction(q, v, this));
                    v = new this.axisItemRenderer(this, c, v);
                    this.pushAxisItem(v);
                    if (q == this.baseValue && "radar" != k) {
                        var H, J, A = this.viW, x = this.viH, q = this.viX;
                        v = this.viY;
                        "H" == this.orientation ? 0 <= c && c <= A + 1 && (H = [c, c, c + e], J = [x, 0, f]) : 0 <= c && c <= x + 1 && (H = [0, A, A + e], J = [c, c, c + f]);
                        H && (c = AmCharts.fitToBounds(2 * this.gridAlpha, 0, 1), c = AmCharts.line(a.container, H, J, this.gridColor, c, 1, this.dashLength), c.translate(q,
                            v), this.grid0 = c, a.axesSet.push(c), c.toBack())
                    }
                }
                d = this.baseValue;
                this.min > this.baseValue && this.max > this.baseValue && (d = this.min);
                this.min < this.baseValue && this.max < this.baseValue && (d = this.max);
                h && d < this.minReal && (d = this.minReal);
                this.baseCoord = this.getCoordinate(d);
                a = {type: "axisChanged", target: this, chart: a};
                a.min = h ? this.minReal : this.min;
                a.max = this.max;
                this.fire("axisChanged", a);
                this.axisCreated = !0
            }
            h = this.axisLine.set;
            a = this.labelsSet;
            this.positionTitle();
            "radar" != k ? (k = this.viX, d = this.viY, b.translate(k,
                d), a.translate(k, d)) : h.toFront();
            !this.visible || g ? (b.hide(), h.hide(), a.hide()) : (b.show(), h.show(), a.show())
        }
    }, getDecimals: function (a) {
        var b = 0;
        isNaN(a) || (a = String(a), -1 != a.indexOf("e-") ? b = Number(a.split("-")[1]) : -1 != a.indexOf(".") && (b = a.split(".")[1].length));
        return b
    }, stackGraphs: function (a) {
        var b = this.stackType;
        "stacked" == b && (b = "regular");
        "line" == b && (b = "none");
        "100% stacked" == b && (b = "100%");
        this.stackType = b;
        var c = [], d = [], e = [], f = [], g, h = this.chart.graphs, k, l, m, n, s = this.baseValue, q = !1;
        if ("line" == a ||
            "step" == a || "smoothedLine" == a)q = !0;
        if (q && ("regular" == b || "100%" == b))for (n = 0; n < h.length; n++)m = h[n], m.hidden || (l = m.type, m.chart == this.chart && (m.valueAxis == this && a == l && m.stackable) && (k && (m.stackGraph = k), k = m));
        for (k = this.start; k <= this.end; k++) {
            var t = 0;
            for (n = 0; n < h.length; n++)if (m = h[n], !m.hidden && (l = m.type, m.chart == this.chart && (m.valueAxis == this && a == l && m.stackable) && (l = this.data[k].axes[this.id].graphs[m.id], g = l.values.value, !isNaN(g)))) {
                var p = this.getDecimals(g);
                t < p && (t = p);
                isNaN(f[k]) ? f[k] = Math.abs(g) : f[k] +=
                    Math.abs(g);
                f[k] = AmCharts.roundTo(f[k], t);
                m = m.fillToGraph;
                q && m && (m = this.data[k].axes[this.id].graphs[m.id]) && (l.values.open = m.values.value);
                "regular" == b && (q && (isNaN(c[k]) ? (c[k] = g, l.values.close = g, l.values.open = this.baseValue) : (isNaN(g) ? l.values.close = c[k] : l.values.close = g + c[k], l.values.open = c[k], c[k] = l.values.close)), "column" != a || isNaN(g) || (l.values.close = g, 0 > g ? (l.values.close = g, isNaN(d[k]) ? l.values.open = s : (l.values.close += d[k], l.values.open = d[k]), d[k] = l.values.close) : (l.values.close = g, isNaN(e[k]) ?
                    l.values.open = s : (l.values.close += e[k], l.values.open = e[k]), e[k] = l.values.close)))
            }
        }
        for (k = this.start; k <= this.end; k++)for (n = 0; n < h.length; n++)m = h[n], m.hidden || (l = m.type, m.chart == this.chart && (m.valueAxis == this && a == l && m.stackable) && (l = this.data[k].axes[this.id].graphs[m.id], g = l.values.value, isNaN(g) || (c = 100 * (g / f[k]), l.values.percents = c, l.values.total = f[k], "100%" == b && (isNaN(d[k]) && (d[k] = 0), isNaN(e[k]) && (e[k] = 0), 0 > c ? (l.values.close = AmCharts.fitToBounds(c + d[k], -100, 100), l.values.open = d[k], d[k] = l.values.close) :
            (l.values.close = AmCharts.fitToBounds(c + e[k], -100, 100), l.values.open = e[k], e[k] = l.values.close)))))
    }, recalculate: function () {
        var a = this.chart.graphs, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            if (c.valueAxis == this) {
                var d = "value";
                if ("candlestick" == c.type || "ohlc" == c.type)d = "open";
                var e, f, g = this.end + 2, g = AmCharts.fitToBounds(this.end + 1, 0, this.data.length - 1), h = this.start;
                0 < h && h--;
                var k;
                for (k = this.start; k <= g && (f = this.data[k].axes[this.id].graphs[c.id], e = f.values[d], isNaN(e)); k++);
                for (d = h; d <= g; d++) {
                    f = this.data[d].axes[this.id].graphs[c.id];
                    f.percents = {};
                    var h = f.values, l;
                    for (l in h)f.percents[l] = "percents" != l ? 100 * (h[l] / e) - 100 : h[l]
                }
            }
        }
    }, getMinMax: function () {
        var a = !1, b = this.chart, c = b.graphs, d;
        for (d = 0; d < c.length; d++) {
            var e = c[d].type;
            ("line" == e || "step" == e || "smoothedLine" == e) && this.expandMinMax && (a = !0)
        }
        a && (0 < this.start && this.start--, this.end < this.data.length - 1 && this.end++);
        "serial" == b.chartType && (!0 !== b.categoryAxis.parseDates || a || this.end < this.data.length - 1 && this.end++);
        a = this.minMaxMultiplier;
        this.min = this.getMin(this.start, this.end);
        this.max =
            this.getMax();
        a = (this.max - this.min) * (a - 1);
        this.min -= a;
        this.max += a;
        a = this.guides.length;
        if (this.includeGuidesInMinMax && 0 < a)for (b = 0; b < a; b++)c = this.guides[b], c.toValue < this.min && (this.min = c.toValue), c.value < this.min && (this.min = c.value), c.toValue > this.max && (this.max = c.toValue), c.value > this.max && (this.max = c.value);
        isNaN(this.minimum) || (this.min = this.minimum);
        isNaN(this.maximum) || (this.max = this.maximum);
        this.min > this.max && (a = this.max, this.max = this.min, this.min = a);
        isNaN(this.minTemp) || (this.min = this.minTemp);
        isNaN(this.maxTemp) || (this.max = this.maxTemp);
        this.minReal = this.min;
        this.maxReal = this.max;
        0 === this.min && 0 === this.max && (this.max = 9);
        this.min > this.max && (this.min = this.max - 1);
        a = this.min;
        b = this.max;
        c = this.max - this.min;
        d = 0 === c ? Math.pow(10, Math.floor(Math.log(Math.abs(this.max)) * Math.LOG10E)) / 10 : Math.pow(10, Math.floor(Math.log(Math.abs(c)) * Math.LOG10E)) / 10;
        isNaN(this.maximum) && isNaN(this.maxTemp) && (this.max = Math.ceil(this.max / d) * d + d);
        isNaN(this.minimum) && isNaN(this.minTemp) && (this.min = Math.floor(this.min /
                d) * d - d);
        0 > this.min && 0 <= a && (this.min = 0);
        0 < this.max && 0 >= b && (this.max = 0);
        "100%" == this.stackType && (this.min = 0 > this.min ? -100 : 0, this.max = 0 > this.max ? 0 : 100);
        c = this.max - this.min;
        d = Math.pow(10, Math.floor(Math.log(Math.abs(c)) * Math.LOG10E)) / 10;
        this.step = Math.ceil(c / this.gridCount / d) * d;
        c = Math.pow(10, Math.floor(Math.log(Math.abs(this.step)) * Math.LOG10E));
        c = c.toExponential(0).split("e");
        d = Number(c[1]);
        9 == Number(c[0]) && d++;
        c = this.generateNumber(1, d);
        d = Math.ceil(this.step / c);
        5 < d && (d = 10);
        5 >= d && 2 < d && (d = 5);
        this.step =
            Math.ceil(this.step / (c * d)) * c * d;
        1 > c ? (this.maxDecCount = Math.abs(Math.log(Math.abs(c)) * Math.LOG10E), this.maxDecCount = Math.round(this.maxDecCount), this.step = AmCharts.roundTo(this.step, this.maxDecCount + 1)) : this.maxDecCount = 0;
        this.min = this.step * Math.floor(this.min / this.step);
        this.max = this.step * Math.ceil(this.max / this.step);
        0 > this.min && 0 <= a && (this.min = 0);
        0 < this.max && 0 >= b && (this.max = 0);
        1 < this.minReal && 1 < this.max - this.minReal && (this.minReal = Math.floor(this.minReal));
        c = Math.pow(10, Math.floor(Math.log(Math.abs(this.minReal)) *
            Math.LOG10E));
        0 === this.min && (this.minReal = c);
        0 === this.min && 1 < this.minReal && (this.minReal = 1);
        0 < this.min && 0 < this.minReal - this.step && (this.minReal = this.min + this.step < this.minReal ? this.min + this.step : this.min);
        c = Math.log(b) * Math.LOG10E - Math.log(a) * Math.LOG10E;
        this.logarithmic && (2 < c ? (this.minReal = this.min = Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E)), this.max = Math.pow(10, Math.ceil(Math.log(Math.abs(b)) * Math.LOG10E))) : (b = Math.pow(10, Math.floor(Math.log(Math.abs(this.min)) * Math.LOG10E)) / 10, a =
            Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E)) / 10, b < a && (this.minReal = this.min = 10 * a)))
    }, generateNumber: function (a, b) {
        var c = "", d;
        d = 0 > b ? Math.abs(b) - 1 : Math.abs(b);
        var e;
        for (e = 0; e < d; e++)c += "0";
        return 0 > b ? Number("0." + c + String(a)) : Number(String(a) + c)
    }, getMin: function (a, b) {
        var c, d;
        for (d = a; d <= b; d++) {
            var e = this.data[d].axes[this.id].graphs, f;
            for (f in e)if (e.hasOwnProperty(f)) {
                var g = this.chart.getGraphById(f);
                if (g.includeInMinMax && (!g.hidden || this.includeHidden)) {
                    isNaN(c) && (c = Infinity);
                    this.foundGraphs = !0;
                    g = e[f].values;
                    this.recalculateToPercents && (g = e[f].percents);
                    var h;
                    if (this.minMaxField)h = g[this.minMaxField], h < c && (c = h); else for (var k in g)g.hasOwnProperty(k) && ("percents" != k && "total" != k) && (h = g[k], h < c && (c = h))
                }
            }
        }
        return c
    }, getMax: function () {
        var a, b;
        for (b = this.start; b <= this.end; b++) {
            var c = this.data[b].axes[this.id].graphs, d;
            for (d in c)if (c.hasOwnProperty(d)) {
                var e = this.chart.getGraphById(d);
                if (e.includeInMinMax && (!e.hidden || this.includeHidden)) {
                    isNaN(a) && (a = -Infinity);
                    this.foundGraphs = !0;
                    e = c[d].values;
                    this.recalculateToPercents && (e = c[d].percents);
                    var f;
                    if (this.minMaxField)f = e[this.minMaxField], f > a && (a = f); else for (var g in e)e.hasOwnProperty(g) && ("percents" != g && "total" != g) && (f = e[g], f > a && (a = f))
                }
            }
        }
        return a
    }, dispatchZoomEvent: function (a, b) {
        var c = {type: "axisZoomed", startValue: a, endValue: b, target: this, chart: this.chart};
        this.fire(c.type, c)
    }, zoomToValues: function (a, b) {
        if (b < a) {
            var c = b;
            b = a;
            a = c
        }
        a < this.min && (a = this.min);
        b > this.max && (b = this.max);
        c = {type: "axisSelfZoomed"};
        c.chart = this.chart;
        c.valueAxis = this;
        c.multiplier = this.axisWidth / Math.abs(this.getCoordinate(b) - this.getCoordinate(a));
        c.position = "V" == this.orientation ? this.reversed ? this.getCoordinate(a) : this.getCoordinate(b) : this.reversed ? this.getCoordinate(b) : this.getCoordinate(a);
        this.fire(c.type, c)
    }, coordinateToValue: function (a) {
        if (isNaN(a))return NaN;
        var b = this.axisWidth, c = this.stepWidth, d = this.reversed, e = this.rotate, f = this.min, g = this.minReal;
        return !0 === this.logarithmic ? Math.pow(10, (e ? !0 === d ? (b - a) / c : a / c : !0 === d ? a / c : (b - a) / c) + Math.log(g) * Math.LOG10E) :
            !0 === d ? e ? f - (a - b) / c : a / c + f : e ? a / c + f : f - (a - b) / c
    }, getCoordinate: function (a) {
        if (isNaN(a))return NaN;
        var b = this.rotate, c = this.reversed, d = this.axisWidth, e = this.stepWidth, f = this.min, g = this.minReal;
        !0 === this.logarithmic ? (a = Math.log(a) * Math.LOG10E - Math.log(g) * Math.LOG10E, b = b ? !0 === c ? d - e * a : e * a : !0 === c ? e * a : d - e * a) : b = !0 === c ? b ? d - e * (a - f) : e * (a - f) : b ? e * (a - f) : d - e * (a - f);
        b = this.rotate ? b + (this.x - this.viX) : b + (this.y - this.viY);
        return Math.round(b)
    }, synchronizeWithAxis: function (a) {
        this.synchronizeWithAxis = a;
        this.removeListener(this.synchronizeWithAxis,
            "axisChanged", this.handleSynchronization);
        this.listenTo(this.synchronizeWithAxis, "axisChanged", this.handleSynchronization)
    }, handleSynchronization: function (a) {
        var b = this.synchronizeWithAxis;
        a = b.min;
        var c = b.max, b = b.step, d = this.synchronizationMultiplier;
        d && (this.min = a * d, this.max = c * d, this.step = b * d, a = Math.pow(10, Math.floor(Math.log(Math.abs(this.step)) * Math.LOG10E)), a = Math.abs(Math.log(Math.abs(a)) * Math.LOG10E), this.maxDecCount = a = Math.round(a), this.draw())
    }
});
AmCharts.CategoryAxis = AmCharts.Class({
    inherits: AmCharts.AxisBase, construct: function () {
        AmCharts.CategoryAxis.base.construct.call(this);
        this.minPeriod = "DD";
        this.equalSpacing = this.parseDates = !1;
        this.position = "bottom";
        this.startOnAxis = !1;
        this.firstDayOfWeek = 1;
        this.gridPosition = "middle";
        this.markPeriodChange = this.boldPeriodBeginning = !0;
        this.safeDistance = 30;
        this.centerLabelOnFullPeriod = !0;
        this.periods = [{period: "ss", count: 1}, {period: "ss", count: 5}, {period: "ss", count: 10}, {
            period: "ss",
            count: 30
        }, {
            period: "mm",
            count: 1
        }, {period: "mm", count: 5}, {period: "mm", count: 10}, {period: "mm", count: 30}, {
            period: "hh",
            count: 1
        }, {period: "hh", count: 3}, {period: "hh", count: 6}, {period: "hh", count: 12}, {
            period: "DD",
            count: 1
        }, {period: "DD", count: 2}, {period: "DD", count: 3}, {period: "DD", count: 4}, {
            period: "DD",
            count: 5
        }, {period: "WW", count: 1}, {period: "MM", count: 1}, {period: "MM", count: 2}, {
            period: "MM",
            count: 3
        }, {period: "MM", count: 6}, {period: "YYYY", count: 1}, {period: "YYYY", count: 2}, {
            period: "YYYY",
            count: 5
        }, {period: "YYYY", count: 10}, {period: "YYYY", count: 50},
            {period: "YYYY", count: 100}];
        this.dateFormats = [{period: "fff", format: "JJ:NN:SS"}, {period: "ss", format: "JJ:NN:SS"}, {
            period: "mm",
            format: "JJ:NN"
        }, {period: "hh", format: "JJ:NN"}, {period: "DD", format: "MMM DD"}, {
            period: "WW",
            format: "MMM DD"
        }, {period: "MM", format: "MMM"}, {period: "YYYY", format: "YYYY"}];
        this.nextPeriod = {};
        this.nextPeriod.fff = "ss";
        this.nextPeriod.ss = "mm";
        this.nextPeriod.mm = "hh";
        this.nextPeriod.hh = "DD";
        this.nextPeriod.DD = "MM";
        this.nextPeriod.MM = "YYYY"
    }, draw: function () {
        AmCharts.CategoryAxis.base.draw.call(this);
        this.generateDFObject();
        var a = this.chart.chartData;
        this.data = a;
        if (AmCharts.ifArray(a)) {
            var b, c = this.chart, d = this.start, e = this.labelFrequency, f = 0;
            b = this.end - d + 1;
            var g = this.gridCount, h = this.showFirstLabel, k = this.showLastLabel, l, m = "", m = AmCharts.extractPeriod(this.minPeriod);
            l = AmCharts.getPeriodDuration(m.period, m.count);
            var n, s, q, t, p;
            n = this.rotate;
            var r = this.firstDayOfWeek, u = this.boldPeriodBeginning, a = AmCharts.resetDateToMin(new Date(a[a.length - 1].time + 1.05 * l), this.minPeriod, 1, r).getTime(), v;
            this.endTime >
            a && (this.endTime = a);
            if (this.parseDates && !this.equalSpacing) {
                this.timeDifference = this.endTime - this.startTime;
                d = this.choosePeriod(0);
                e = d.period;
                n = d.count;
                s = AmCharts.getPeriodDuration(e, n);
                s < l && (e = m.period, n = m.count, s = l);
                q = e;
                "WW" == q && (q = "DD");
                this.stepWidth = this.getStepWidth(this.timeDifference);
                var g = Math.ceil(this.timeDifference / s) + 1, w = m = AmCharts.resetDateToMin(new Date(this.startTime - s), e, n, r).getTime();
                q == e && (1 == n && this.centerLabelOnFullPeriod) && (t = s * this.stepWidth);
                this.cellWidth = l * this.stepWidth;
                b = Math.round(m / s);
                d = -1;
                b / 2 == Math.round(b / 2) && (d = -2, m -= s);
                var A = c.firstTime;
                if (0 < this.gridCount)for (b = d; b <= g; b++) {
                    a = A + s * (b + 0.1 + Math.floor((w - A) / s));
                    a = AmCharts.resetDateToMin(new Date(a), e, n, r).getTime();
                    l = (a - this.startTime) * this.stepWidth;
                    p = !1;
                    this.nextPeriod[q] && (p = this.checkPeriodChange(this.nextPeriod[q], 1, a, m));
                    v = !1;
                    p && this.markPeriodChange ? (m = this.dateFormatsObject[this.nextPeriod[q]], v = !0) : m = this.dateFormatsObject[q];
                    u || (v = !1);
                    m = AmCharts.formatDate(new Date(a), m);
                    if (b == d && !h || b == g && !k)m = " ";
                    this.labelFunction && (m = this.labelFunction(m, new Date(a), this));
                    m = new this.axisItemRenderer(this, l, m, !1, t, 0, !1, v);
                    this.pushAxisItem(m);
                    m = a
                }
            } else if (!this.parseDates) {
                if (this.cellWidth = this.getStepWidth(b), b < g && (g = b), f += this.start, this.stepWidth = this.getStepWidth(b), 0 < g)for (u = Math.floor(b / g), l = f, l / 2 == Math.round(l / 2) && l--, 0 > l && (l = 0), g = 0, b = l; b <= this.end + 2; b++)if (0 <= b && b < this.data.length ? (q = this.data[b], m = q.category) : m = "", b / u == Math.round(b / u) || q.forceShow) {
                    l = this.getCoordinate(b - f);
                    r = 0;
                    "start" == this.gridPosition &&
                    (l -= this.cellWidth / 2, r = this.cellWidth / 2);
                    if (b == d && !h || b == this.end && !k)m = void 0;
                    Math.round(g / e) != g / e && (m = void 0);
                    g++;
                    t = this.cellWidth;
                    n && (t = NaN);
                    this.labelFunction && (m = this.labelFunction(m, q, this));
                    m = AmCharts.fixNewLines(m);
                    m = new this.axisItemRenderer(this, l, m, !0, t, r, void 0, !1, r);
                    this.pushAxisItem(m)
                }
            } else if (this.parseDates && this.equalSpacing) {
                f = this.start;
                this.startTime = this.data[this.start].time;
                this.endTime = this.data[this.end].time;
                this.timeDifference = this.endTime - this.startTime;
                d = this.choosePeriod(0);
                e = d.period;
                n = d.count;
                s = AmCharts.getPeriodDuration(e, n);
                s < l && (e = m.period, n = m.count, s = l);
                q = e;
                "WW" == q && (q = "DD");
                this.stepWidth = this.getStepWidth(b);
                g = Math.ceil(this.timeDifference / s) + 1;
                m = AmCharts.resetDateToMin(new Date(this.startTime - s), e, n, r).getTime();
                this.cellWidth = this.getStepWidth(b);
                b = Math.round(m / s);
                d = -1;
                b / 2 == Math.round(b / 2) && (d = -2, m -= s);
                l = this.start;
                l / 2 == Math.round(l / 2) && l--;
                0 > l && (l = 0);
                t = this.end + 2;
                t >= this.data.length && (t = this.data.length);
                s = !1;
                s = !h;
                this.previousPos = -1E3;
                20 < this.labelRotation &&
                (this.safeDistance = 5);
                if (this.data[l].time != AmCharts.resetDateToMin(new Date(this.data[l].time), e, n, r).getTime())for (r = 0, w = m, b = l; b < t; b++)a = this.data[b].time, this.checkPeriodChange(e, n, a, w) && (r++, 2 <= r && (l = b, b = t), w = a);
                for (b = l; b < t; b++)if (a = this.data[b].time, this.checkPeriodChange(e, n, a, m)) {
                    l = this.getCoordinate(b - this.start);
                    p = !1;
                    this.nextPeriod[q] && (p = this.checkPeriodChange(this.nextPeriod[q], 1, a, m));
                    v = !1;
                    p && this.markPeriodChange ? (m = this.dateFormatsObject[this.nextPeriod[q]], v = !0) : m = this.dateFormatsObject[q];
                    m = AmCharts.formatDate(new Date(a), m);
                    if (b == d && !h || b == g && !k)m = " ";
                    s ? s = !1 : (u || (v = !1), l - this.previousPos > this.safeDistance * Math.cos(this.labelRotation * Math.PI / 180) && (this.labelFunction && (m = this.labelFunction(m, new Date(a), this)), m = new this.axisItemRenderer(this, l, m, void 0, void 0, void 0, void 0, v), r = m.graphics(), this.pushAxisItem(m), this.previousPos = l + r.getBBox().width));
                    m = a
                }
            }
            for (b = 0; b < this.data.length; b++)if (h = this.data[b])k = this.parseDates && !this.equalSpacing ? Math.round((h.time - this.startTime) * this.stepWidth +
                this.cellWidth / 2) : this.getCoordinate(b - f), h.x[this.id] = k;
            h = this.guides.length;
            for (b = 0; b < h; b++)k = this.guides[b], r = r = r = g = u = NaN, d = k.above, k.toCategory && (r = c.getCategoryIndexByValue(k.toCategory), isNaN(r) || (u = this.getCoordinate(r - f), m = new this.axisItemRenderer(this, u, "", !0, NaN, NaN, k), this.pushAxisItem(m, d))), k.category && (r = c.getCategoryIndexByValue(k.category), isNaN(r) || (g = this.getCoordinate(r - f), r = (u - g) / 2, m = new this.axisItemRenderer(this, g, k.label, !0, NaN, r, k), this.pushAxisItem(m, d))), k.toDate && (this.equalSpacing ?
                (r = c.getClosestIndex(this.data, "time", k.toDate.getTime(), !1, 0, this.data.length - 1), isNaN(r) || (u = this.getCoordinate(r - f))) : u = (k.toDate.getTime() - this.startTime) * this.stepWidth, m = new this.axisItemRenderer(this, u, "", !0, NaN, NaN, k), this.pushAxisItem(m, d)), k.date && (this.equalSpacing ? (r = c.getClosestIndex(this.data, "time", k.date.getTime(), !1, 0, this.data.length - 1), isNaN(r) || (g = this.getCoordinate(r - f))) : g = (k.date.getTime() - this.startTime) * this.stepWidth, r = (u - g) / 2, m = "H" == this.orientation ? new this.axisItemRenderer(this,
                g, k.label, !1, 2 * r, NaN, k) : new this.axisItemRenderer(this, g, k.label, !1, NaN, r, k), this.pushAxisItem(m, d)), u = new this.guideFillRenderer(this, g, u, k), g = u.graphics(), this.pushAxisItem(u, d), k.graphics = g, g.index = b, k.balloonText && this.addEventListeners(g, k)
        }
        this.axisCreated = !0;
        c = this.x;
        f = this.y;
        this.set.translate(c, f);
        this.labelsSet.translate(c, f);
        this.positionTitle();
        (c = this.axisLine.set) && c.toFront()
    }, choosePeriod: function (a) {
        var b = AmCharts.getPeriodDuration(this.periods[a].period, this.periods[a].count), c =
            Math.ceil(this.timeDifference / b), d = this.periods;
        return this.timeDifference < b && 0 < a ? d[a - 1] : c <= this.gridCount ? d[a] : a + 1 < d.length ? this.choosePeriod(a + 1) : d[a]
    }, getStepWidth: function (a) {
        var b;
        this.startOnAxis ? (b = this.axisWidth / (a - 1), 1 == a && (b = this.axisWidth)) : b = this.axisWidth / a;
        return b
    }, getCoordinate: function (a) {
        a *= this.stepWidth;
        this.startOnAxis || (a += this.stepWidth / 2);
        return Math.round(a)
    }, timeZoom: function (a, b) {
        this.startTime = a;
        this.endTime = b
    }, minDuration: function () {
        var a = AmCharts.extractPeriod(this.minPeriod);
        return AmCharts.getPeriodDuration(a.period, a.count)
    }, checkPeriodChange: function (a, b, c, d) {
        c = new Date(c);
        var e = new Date(d), f = this.firstDayOfWeek;
        d = b;
        "DD" == a && (b = 1);
        c = AmCharts.resetDateToMin(c, a, b, f).getTime();
        b = AmCharts.resetDateToMin(e, a, b, f).getTime();
        return "DD" == a && c - b <= AmCharts.getPeriodDuration(a, d) ? !1 : c != b ? !0 : !1
    }, generateDFObject: function () {
        this.dateFormatsObject = {};
        var a;
        for (a = 0; a < this.dateFormats.length; a++) {
            var b = this.dateFormats[a];
            this.dateFormatsObject[b.period] = b.format
        }
    }, xToIndex: function (a) {
        var b =
            this.data, c = this.chart, d = c.rotate, e = this.stepWidth;
        this.parseDates && !this.equalSpacing ? (a = this.startTime + Math.round(a / e) - this.minDuration() / 2, c = c.getClosestIndex(b, "time", a, !1, this.start, this.end + 1)) : (this.startOnAxis || (a -= e / 2), c = this.start + Math.round(a / e));
        var c = AmCharts.fitToBounds(c, 0, b.length - 1), f;
        b[c] && (f = b[c].x[this.id]);
        d ? f > this.height + 1 && c-- : f > this.width + 1 && c--;
        0 > f && c++;
        return c = AmCharts.fitToBounds(c, 0, b.length - 1)
    }, dateToCoordinate: function (a) {
        return this.parseDates && !this.equalSpacing ? (a.getTime() -
        this.startTime) * this.stepWidth : this.parseDates && this.equalSpacing ? (a = this.chart.getClosestIndex(this.data, "time", a.getTime(), !1, 0, this.data.length - 1), this.getCoordinate(a - this.start)) : NaN
    }, categoryToCoordinate: function (a) {
        return this.chart ? (a = this.chart.getCategoryIndexByValue(a), this.getCoordinate(a - this.start)) : NaN
    }, coordinateToDate: function (a) {
        return this.equalSpacing ? (a = this.xToIndex(a), new Date(this.data[a].time)) : new Date(this.startTime + a / this.stepWidth)
    }
});
AmCharts.RecAxis = AmCharts.Class({
    construct: function (a) {
        var b = a.chart, c = a.axisThickness, d = a.axisColor, e = a.axisAlpha, f = a.offset, g = a.dx, h = a.dy, k = a.viX, l = a.viY, m = a.viH, n = a.viW, s = b.container;
        "H" == a.orientation ? (d = AmCharts.line(s, [0, n], [0, 0], d, e, c), this.axisWidth = a.width, "bottom" == a.position ? (a = c / 2 + f + m + l - 1, c = k) : (a = -c / 2 - f + l + h, c = g + k)) : (this.axisWidth = a.height, "right" == a.position ? (d = AmCharts.line(s, [0, 0, -g], [0, m, m - h], d, e, c), a = l + h, c = c / 2 + f + g + n + k - 1) : (d = AmCharts.line(s, [0, 0], [0, m], d, e, c), a = l, c = -c / 2 - f + k));
        d.translate(c,
            a);
        b.axesSet.push(d);
        this.set = d
    }
});
AmCharts.RecItem = AmCharts.Class({
    construct: function (a, b, c, d, e, f, g, h, k) {
        b = Math.round(b);
        void 0 == c && (c = "");
        k || (k = 0);
        void 0 == d && (d = !0);
        var l = a.chart.fontFamily, m = a.fontSize;
        void 0 == m && (m = a.chart.fontSize);
        var n = a.color;
        void 0 == n && (n = a.chart.color);
        var s = a.chart.container, q = s.set();
        this.set = q;
        var t = a.axisThickness, p = a.axisColor, r = a.axisAlpha, u = a.tickLength, v = a.gridAlpha, w = a.gridThickness, A = a.gridColor, x = a.dashLength, B = a.fillColor, y = a.fillAlpha, z = a.labelsEnabled, C = a.labelRotation, H = a.counter, J = a.inside,
            W = a.dx, U = a.dy, sa = a.orientation, R = a.position, T = a.previousCoord, P = a.viH, la = a.viW, da = a.offset, ea, fa;
        g ? (z = !0, isNaN(g.tickLength) || (u = g.tickLength), void 0 != g.lineColor && (A = g.lineColor), void 0 != g.color && (n = g.color), isNaN(g.lineAlpha) || (v = g.lineAlpha), isNaN(g.dashLength) || (x = g.dashLength), isNaN(g.lineThickness) || (w = g.lineThickness), !0 === g.inside && (J = !0), isNaN(g.labelRotation) || (C = g.labelRotation), isNaN(g.fontSize) || (m = g.fontSize), g.position && (R = g.position)) : "" === c && (u = 0);
        fa = "start";
        e && (fa = "middle");
        var X =
            C * Math.PI / 180, V, I = 0, G = 0, $ = 0, D = V = 0;
        "V" == sa && (C = 0);
        var Y;
        z && (Y = AmCharts.text(s, c, n, l, m, fa, h), D = Y.getBBox().width);
        if ("H" == sa) {
            if (0 <= b && b <= la + 1 && (0 < u && (0 < r && b + k <= la + 1) && (ea = AmCharts.line(s, [b + k, b + k], [0, u], p, r, w), q.push(ea)), 0 < v && (fa = AmCharts.line(s, [b, b + W, b + W], [P, P + U, U], A, v, w, x), q.push(fa))), G = 0, I = b, g && 90 == C && (I -= m), !1 === d ? (fa = "start", G = "bottom" == R ? J ? G + u : G - u : J ? G - u : G + u, I += 3, e && (I += e / 2, fa = "middle"), 0 < C && (fa = "middle")) : fa = "middle", 1 == H && (0 < y && !g && T < la) && (d = AmCharts.fitToBounds(b, 0, la), T = AmCharts.fitToBounds(T,
                    0, la), V = d - T, 0 < V && (fill = AmCharts.rect(s, V, a.height, B, y), fill.translate(d - V + W, U), q.push(fill))), "bottom" == R ? (G += P + m / 2 + da, J ? 0 < C ? (G = P - D / 2 * Math.sin(X) - u - 3, I += D / 2 * Math.cos(X)) : G -= u + m + 3 + 3 : 0 < C ? (G = P + D / 2 * Math.sin(X) + u + 3, I -= D / 2 * Math.cos(X)) : G += u + t + 3 + 3) : (G += U + m / 2 - da, I += W, J ? 0 < C ? (G = D / 2 * Math.sin(X) + u + 3, I -= D / 2 * Math.cos(X)) : G += u + 3 : 0 < C ? (G = -(D / 2) * Math.sin(X) - u - 6, I += D / 2 * Math.cos(X)) : G -= u + m + 3 + t + 3), "bottom" == R ? V = (J ? P - u - 1 : P + t - 1) + da : ($ = W, V = (J ? U : U - u - t + 1) - da), f && (I += f), U = I, 0 < C && (U += D / 2 * Math.cos(X)), Y && (R = 0, J && (R = D / 2 * Math.cos(X)),
                U + R > la + 2 || 0 > U))Y.remove(), Y = null
        } else {
            0 <= b && b <= P + 1 && (0 < u && (0 < r && b + k <= P + 1) && (ea = AmCharts.line(s, [0, u], [b + k, b + k], p, r, w), q.push(ea)), 0 < v && (fa = AmCharts.line(s, [0, W, la + W], [b, b + U, b + U], A, v, w, x), q.push(fa)));
            fa = "end";
            if (!0 === J && "left" == R || !1 === J && "right" == R)fa = "start";
            G = b - m / 2;
            1 == H && (0 < y && !g) && (d = AmCharts.fitToBounds(b, 0, P), T = AmCharts.fitToBounds(T, 0, P), X = d - T, fill = AmCharts.polygon(s, [0, a.width, a.width, 0], [0, 0, X, X], B, y), fill.translate(W, d - X + U), q.push(fill));
            G += m / 2;
            "right" == R ? (I += W + la + da, G += U, J ? (I -= u + 4, f || (G -=
                m / 2 + 3)) : (I += u + 4 + t, G -= 2)) : J ? (I += u + 4 - da, f || (G -= m / 2 + 3), g && (I += W, G += U)) : (I += -u - t - 4 - 2 - da, G -= 2);
            ea && ("right" == R ? ($ += W + da + la, V += U, $ = J ? $ - t : $ + t) : ($ -= da, J || ($ -= u + t)));
            f && (G += f);
            J = -3;
            "right" == R && (J += U);
            Y && (G > P + 1 || G < J) && (Y.remove(), Y = null)
        }
        ea && ea.translate($, V);
        !1 === a.visible && (ea && ea.remove(), Y && (Y.remove(), Y = null));
        Y && (Y.attr({"text-anchor": fa}), Y.translate(I, G), 0 !== C && Y.rotate(-C), a.allLabels.push(Y), " " != c && (this.label = Y));
        a.counter = 0 === H ? 1 : 0;
        a.previousCoord = b;
        0 === this.set.node.childNodes.length && this.set.remove()
    },
    graphics: function () {
        return this.set
    }, getLabel: function () {
        return this.label
    }
});
AmCharts.RecFill = AmCharts.Class({
    construct: function (a, b, c, d) {
        var e = a.dx, f = a.dy, g = a.orientation, h = 0;
        if (c < b) {
            var k = b;
            b = c;
            c = k
        }
        var l = d.fillAlpha;
        isNaN(l) && (l = 0);
        k = a.chart.container;
        d = d.fillColor;
        "V" == g ? (b = AmCharts.fitToBounds(b, 0, a.viH), c = AmCharts.fitToBounds(c, 0, a.viH)) : (b = AmCharts.fitToBounds(b, 0, a.viW), c = AmCharts.fitToBounds(c, 0, a.viW));
        c -= b;
        isNaN(c) && (c = 4, h = 2, l = 0);
        0 > c && "object" == typeof d && (d = d.join(",").split(",").reverse());
        "V" == g ? (a = AmCharts.rect(k, a.width, c, d, l), a.translate(e, b - h + f)) : (a = AmCharts.rect(k,
            c, a.height, d, l), a.translate(b - h + e, f));
        this.set = k.set([a])
    }, graphics: function () {
        return this.set
    }, getLabel: function () {
    }
});
AmCharts.RadAxis = AmCharts.Class({
    construct: function (a) {
        var b = a.chart, c = a.axisThickness, d = a.axisColor, e = a.axisAlpha, f = a.x, g = a.y;
        this.set = b.container.set();
        b.axesSet.push(this.set);
        var h = a.axisTitleOffset, k = a.radarCategoriesEnabled, l = a.chart.fontFamily, m = a.fontSize;
        void 0 === m && (m = a.chart.fontSize);
        var n = a.color;
        void 0 === n && (n = a.chart.color);
        if (b) {
            this.axisWidth = a.height;
            a = b.chartData;
            var s = a.length, q;
            for (q = 0; q < s; q++) {
                var t = 180 - 360 / s * q, p = f + this.axisWidth * Math.sin(t / 180 * Math.PI), r = g + this.axisWidth * Math.cos(t /
                        180 * Math.PI);
                0 < e && (p = AmCharts.line(b.container, [f, p], [g, r], d, e, c), this.set.push(p));
                if (k) {
                    var u = "start", p = f + (this.axisWidth + h) * Math.sin(t / 180 * Math.PI), r = g + (this.axisWidth + h) * Math.cos(t / 180 * Math.PI);
                    if (180 == t || 0 === t)u = "middle", p -= 5;
                    0 > t && (u = "end", p -= 10);
                    180 == t && (r -= 5);
                    0 === t && (r += 5);
                    t = AmCharts.text(b.container, a[q].category, n, l, m, u);
                    t.translate(p + 5, r);
                    this.set.push(t);
                    t.getBBox()
                }
            }
        }
    }
});
AmCharts.RadItem = AmCharts.Class({
    construct: function (a, b, c, d, e, f, g) {
        void 0 === c && (c = "");
        var h = a.chart.fontFamily, k = a.fontSize;
        void 0 === k && (k = a.chart.fontSize);
        var l = a.color;
        void 0 === l && (l = a.chart.color);
        var m = a.chart.container;
        this.set = d = m.set();
        var n = a.axisColor, s = a.axisAlpha, q = a.tickLength, t = a.gridAlpha, p = a.gridThickness, r = a.gridColor, u = a.dashLength, v = a.fillColor, w = a.fillAlpha, A = a.labelsEnabled;
        e = a.counter;
        var x = a.inside, B = a.gridType, y;
        b -= a.height;
        var z;
        f = a.x;
        var C = a.y;
        g ? (A = !0, isNaN(g.tickLength) ||
        (q = g.tickLength), void 0 != g.lineColor && (r = g.lineColor), isNaN(g.lineAlpha) || (t = g.lineAlpha), isNaN(g.dashLength) || (u = g.dashLength), isNaN(g.lineThickness) || (p = g.lineThickness), !0 === g.inside && (x = !0)) : c || (t /= 3, q /= 2);
        var H = "end", J = -1;
        x && (H = "start", J = 1);
        var W;
        A && (W = AmCharts.text(m, c, l, h, k, H), W.translate(f + (q + 3) * J, b), d.push(W), this.label = W, z = AmCharts.line(m, [f, f + q * J], [b, b], n, s, p), d.push(z));
        b = a.y - b;
        c = [];
        h = [];
        if (0 < t) {
            if ("polygons" == B) {
                y = a.data.length;
                for (k = 0; k < y; k++)l = 180 - 360 / y * k, c.push(b * Math.sin(l / 180 * Math.PI)),
                    h.push(b * Math.cos(l / 180 * Math.PI));
                c.push(c[0]);
                h.push(h[0]);
                t = AmCharts.line(m, c, h, r, t, p, u)
            } else t = AmCharts.circle(m, b, "#FFFFFF", 0, p, r, t);
            t.translate(f, C);
            d.push(t)
        }
        if (1 == e && 0 < w && !g) {
            g = a.previousCoord;
            if ("polygons" == B) {
                for (k = y; 0 <= k; k--)l = 180 - 360 / y * k, c.push(g * Math.sin(l / 180 * Math.PI)), h.push(g * Math.cos(l / 180 * Math.PI));
                y = AmCharts.polygon(m, c, h, v, w)
            } else y = AmCharts.wedge(m, 0, 0, 0, -360, b, b, g, 0, {
                fill: v,
                "fill-opacity": w,
                stroke: 0,
                "stroke-opacity": 0,
                "stroke-width": 0
            });
            d.push(y);
            y.translate(f, C)
        }
        !1 === a.visible &&
        (z && z.hide(), W && W.hide());
        a.counter = 0 === e ? 1 : 0;
        a.previousCoord = b
    }, graphics: function () {
        return this.set
    }, getLabel: function () {
        return this.label
    }
});
AmCharts.RadarFill = AmCharts.Class({
    construct: function (a, b, c, d) {
        b -= a.axisWidth;
        c -= a.axisWidth;
        var e = Math.max(b, c);
        b = c = Math.min(b, c);
        c = a.chart.container;
        var f = d.fillAlpha, g = d.fillColor, e = Math.abs(e - a.y);
        b = Math.abs(b - a.y);
        var h = Math.max(e, b);
        b = Math.min(e, b);
        e = h;
        h = -d.angle;
        d = -d.toAngle;
        isNaN(h) && (h = 0);
        isNaN(d) && (d = -360);
        this.set = c.set();
        void 0 === g && (g = "#000000");
        isNaN(f) && (f = 0);
        if ("polygons" == a.gridType) {
            d = [];
            var k = [], l = a.data.length, m;
            for (m = 0; m < l; m++)h = 180 - 360 / l * m, d.push(e * Math.sin(h / 180 * Math.PI)), k.push(e *
                Math.cos(h / 180 * Math.PI));
            d.push(d[0]);
            k.push(k[0]);
            for (m = l; 0 <= m; m--)h = 180 - 360 / l * m, d.push(b * Math.sin(h / 180 * Math.PI)), k.push(b * Math.cos(h / 180 * Math.PI));
            this.fill = AmCharts.polygon(c, d, k, g, f)
        } else this.fill = AmCharts.wedge(c, 0, 0, h, d - h, e, e, b, 0, {
            fill: g,
            "fill-opacity": f,
            stroke: 0,
            "stroke-opacity": 0,
            "stroke-width": 0
        });
        this.set.push(this.fill);
        this.fill.translate(a.x, a.y)
    }, graphics: function () {
        return this.set
    }, getLabel: function () {
    }
});
AmCharts.AmGraph = AmCharts.Class({
    construct: function () {
        this.createEvents("rollOverGraphItem", "rollOutGraphItem", "clickGraphItem", "doubleClickGraphItem", "rightClickGraphItem", "clickGraph");
        this.type = "line";
        this.stackable = !0;
        this.columnCount = 1;
        this.columnIndex = 0;
        this.centerCustomBullets = this.showBalloon = !0;
        this.maxBulletSize = 50;
        this.minBulletSize = 0;
        this.balloonText = "[[value]]";
        this.hidden = this.scrollbar = this.animationPlayed = !1;
        this.columnWidth = 0.8;
        this.pointPosition = "middle";
        this.depthCount = 1;
        this.includeInMinMax = !0;
        this.negativeBase = 0;
        this.visibleInLegend = !0;
        this.showAllValueLabels = !1;
        this.showBalloonAt = "close";
        this.lineThickness = 1;
        this.dashLength = 0;
        this.connect = !0;
        this.lineAlpha = 1;
        this.bullet = "none";
        this.bulletBorderThickness = 2;
        this.bulletAlpha = this.bulletBorderAlpha = 1;
        this.bulletSize = 8;
        this.hideBulletsCount = this.bulletOffset = 0;
        this.labelPosition = "top";
        this.cornerRadiusTop = 0;
        this.cursorBulletAlpha = 1;
        this.gradientOrientation = "vertical";
        this.dy = this.dx = 0;
        this.periodValue = "";
        this.y = this.x = 0
    }, draw: function () {
        var a =
            this.chart, b = a.container;
        this.container = b;
        this.destroy();
        var c = b.set(), d = b.set();
        this.behindColumns ? (a.graphsBehindSet.push(c), a.bulletBehindSet.push(d)) : (a.graphsSet.push(c), a.bulletSet.push(d));
        this.bulletSet = d;
        if (!this.scrollbar) {
            var e = a.marginLeftReal, a = a.marginTopReal;
            c.translate(e, a);
            d.translate(e, a)
        }
        b = b.set();
        AmCharts.remove(this.columnsSet);
        c.push(b);
        this.set = c;
        this.columnsSet = b;
        this.columnsArray = [];
        this.ownColumns = [];
        this.allBullets = [];
        this.animationArray = [];
        AmCharts.ifArray(this.data) &&
        (c = !1, "xy" == this.chartType ? this.xAxis.axisCreated && this.yAxis.axisCreated && (c = !0) : this.valueAxis.axisCreated && (c = !0), !this.hidden && c && this.createGraph())
    }, createGraph: function () {
        var a = this, b = a.chart;
        "inside" == a.labelPosition && (a.labelPosition = "bottom");
        a.startAlpha = b.startAlpha;
        a.seqAn = b.sequencedAnimation;
        a.baseCoord = a.valueAxis.baseCoord;
        a.fillColors || (a.fillColors = a.lineColor);
        void 0 === a.fillAlphas && (a.fillAlphas = 0);
        void 0 === a.bulletColor && (a.bulletColor = a.lineColor, a.bulletColorNegative = a.negativeLineColor);
        void 0 === a.bulletAlpha && (a.bulletAlpha = a.lineAlpha);
        a.bulletBorderColor || (a.bulletBorderAlpha = 0);
        clearTimeout(a.playedTO);
        if (!isNaN(a.valueAxis.min) && !isNaN(a.valueAxis.max)) {
            switch (a.chartType) {
                case "serial":
                    a.createSerialGraph();
                    "candlestick" == a.type && 1 > a.valueAxis.minMaxMultiplier && a.positiveClip(a.set);
                    break;
                case "radar":
                    a.createRadarGraph();
                    break;
                case "xy":
                    a.createXYGraph(), a.positiveClip(a.set)
            }
            a.playedTO = setTimeout(function () {
                a.setAnimationPlayed.call(a)
            }, 500 * a.chart.startDuration)
        }
    }, setAnimationPlayed: function () {
        this.animationPlayed = !0
    }, createXYGraph: function () {
        var a = [], b = [], c = this.xAxis, d = this.yAxis;
        this.pmh = d.viH + 1;
        this.pmw = c.viW + 1;
        this.pmy = this.pmx = 0;
        var e;
        for (e = this.start; e <= this.end; e++) {
            var f = this.data[e].axes[c.id].graphs[this.id], g = f.values, h = g.x, k = g.y, g = c.getCoordinate(h), l = d.getCoordinate(k);
            !isNaN(h) && !isNaN(k) && (a.push(g), b.push(l), (h = this.createBullet(f, g, l, e)) || (h = 0), k = this.labelText) && (f = this.createLabel(f, g, l, k), this.allBullets.push(f), this.positionLabel(g, l, f, this.labelPosition, h))
        }
        this.drawLineGraph(a, b);
        this.launchAnimation()
    },
    createRadarGraph: function () {
        var a = this.valueAxis.stackType, b = [], c = [], d, e, f;
        for (f = this.start; f <= this.end; f++) {
            var g = this.data[f].axes[this.valueAxis.id].graphs[this.id], h;
            h = "none" == a || "3d" == a ? g.values.value : g.values.close;
            if (isNaN(h))this.drawLineGraph(b, c), b = [], c = []; else {
                var k = this.y - (this.valueAxis.getCoordinate(h) - this.height), l = 180 - 360 / (this.end - this.start + 1) * f;
                h = k * Math.sin(l / 180 * Math.PI);
                k *= Math.cos(l / 180 * Math.PI);
                b.push(h);
                c.push(k);
                (l = this.createBullet(g, h, k, f)) || (l = 0);
                var m = this.labelText;
                m && (g = this.createLabel(g, h, k, m), this.allBullets.push(g), this.positionLabel(h, k, g, this.labelPosition, l));
                isNaN(d) && (d = h);
                isNaN(e) && (e = k)
            }
        }
        b.push(d);
        c.push(e);
        this.drawLineGraph(b, c);
        this.launchAnimation()
    }, positionLabel: function (a, b, c, d, e) {
        var f = c.getBBox();
        switch (d) {
            case "left":
                a -= (f.width + e) / 2 + 2;
                break;
            case "top":
                b -= (e + f.height) / 2 + 1;
                break;
            case "right":
                a += (f.width + e) / 2 + 2;
                break;
            case "bottom":
                b += (e + f.height) / 2 + 1
        }
        c.translate(a, b)
    }, createSerialGraph: function () {
        var a = this.chart, b = this.id, c = this.index, d =
                this.data, e = this.chart.container, f = this.valueAxis, g = this.type, h = this.columnWidth, k = this.width, l = this.height, m = this.y, n = this.rotate, s = this.columnCount, q = AmCharts.toCoordinate(this.cornerRadiusTop, h / 2), t = this.connect, p = [], r = [], u, v, w = this.chart.graphs.length, A, x = this.dx / this.depthCount, B = this.dy / this.depthCount, y = f.stackType, z = this.labelPosition, C = this.start, H = this.end, J = this.scrollbar, W = this.categoryAxis, U = this.baseCoord, sa = this.negativeBase, R = this.columnIndex, T = this.lineThickness, P = this.lineAlpha,
            la = this.lineColor, da = this.dashLength, ea = this.set;
        "above" == z && (z = "top");
        "below" == z && (z = "bottom");
        var fa = z, X = 270;
        "horizontal" == this.gradientOrientation && (X = 0);
        this.gradientRotation = X;
        var V = this.chart.columnSpacing, I = W.cellWidth, G = (I * h - s) / s;
        V > G && (V = G);
        var $, D, Y, Wa = l + 1, Xa = k + 1, Pa = 0, Ya = 0, Za, $a, Qa, Ra, Cb = this.fillColors, Fa = this.negativeFillColors, ya = this.negativeLineColor, Ga = this.fillAlphas, Ha = this.negativeFillAlphas;
        "object" == typeof Ga && (Ga = Ga[0]);
        "object" == typeof Ha && (Ha = Ha[0]);
        var Sa = f.getCoordinate(f.min);
        f.logarithmic && (Sa = f.getCoordinate(f.minReal));
        this.minCoord = Sa;
        this.resetBullet && (this.bullet = "none");
        if (!J && ("line" == g || "smoothedLine" == g || "step" == g) && (1 == d.length && ("step" != g && "none" == this.bullet) && (this.bullet = "round", this.resetBullet = !0), Fa || void 0 != ya)) {
            var Ca = sa;
            Ca > f.max && (Ca = f.max);
            Ca < f.min && (Ca = f.min);
            f.logarithmic && (Ca = f.minReal);
            var ta = f.getCoordinate(Ca), ob = f.getCoordinate(f.max);
            n ? (Wa = l, Xa = Math.abs(ob - ta), Za = l, $a = Math.abs(Sa - ta), Ra = Ya = 0, f.reversed ? (Pa = 0, Qa = ta) : (Pa = ta, Qa = 0)) : (Xa = k, Wa =
                Math.abs(ob - ta), $a = k, Za = Math.abs(Sa - ta), Qa = Pa = 0, f.reversed ? (Ra = m, Ya = ta) : Ra = ta + 1)
        }
        var ua = Math.round;
        this.pmx = ua(Pa);
        this.pmy = ua(Ya);
        this.pmh = ua(Wa);
        this.pmw = ua(Xa);
        this.nmx = ua(Qa);
        this.nmy = ua(Ra);
        this.nmh = ua(Za);
        this.nmw = ua($a);
        9 > AmCharts.IEversion && 0 < AmCharts.IEversion && (this.nmy = this.nmx = 0, this.nmh = this.height);
        h = "column" == g ? (I * h - V * (s - 1)) / s : I * h;
        1 > h && (h = 1);
        var N;
        if ("line" == g || "step" == g || "smoothedLine" == g) {
            if (0 < C)for (N = C - 1; -1 < N; N--)if ($ = d[N], D = $.axes[f.id].graphs[b], Y = D.values.value) {
                C = N;
                break
            }
            if (H <
                d.length - 1)for (N = H + 1; N < d.length; N++)if ($ = d[N], D = $.axes[f.id].graphs[b], Y = D.values.value) {
                H = N;
                break
            }
        }
        H < d.length - 1 && H++;
        var ga = [], ha = [], Ia = !1;
        if ("line" == g || "step" == g || "smoothedLine" == g)if (this.stackable && "regular" == y || "100%" == y || this.fillToGraph)Ia = !0;
        for (N = C; N <= H; N++) {
            $ = d[N];
            D = $.axes[f.id].graphs[b];
            D.index = N;
            var L, M, K, aa, na = NaN, F = NaN, E = NaN, Q = NaN, O = NaN, Ja = NaN, za = NaN, Ka = NaN, Aa = NaN, Z = NaN, ca = NaN, oa = NaN, pa = NaN, S = NaN, ab = NaN, bb = NaN, ia = NaN, ja = void 0, va = Cb, La = Ga, ma = la, ka, qa;
            void 0 != D.color && (va = D.color);
            D.fillColors &&
            (va = D.fillColors);
            isNaN(D.alpha) || (La = D.alpha);
            var ra = D.values;
            f.recalculateToPercents && (ra = D.percents);
            if (ra) {
                S = this.stackable && "none" != y && "3d" != y ? ra.close : ra.value;
                if ("candlestick" == g || "ohlc" == g)S = ra.close, bb = ra.low, za = f.getCoordinate(bb), ab = ra.high, Aa = f.getCoordinate(ab);
                ia = ra.open;
                E = f.getCoordinate(S);
                isNaN(ia) || (O = f.getCoordinate(ia));
                if (!J)switch (this.showBalloonAt) {
                    case "close":
                        D.y = E;
                        break;
                    case "open":
                        D.y = O;
                        break;
                    case "high":
                        D.y = Aa;
                        break;
                    case "low":
                        D.y = za
                }
                var na = $.x[W.id], wa = Math.floor(I / 2),
                    Ma = wa;
                "start" == this.pointPosition && (na -= I / 2, wa = 0, Ma = I);
                J || (D.x = na);
                -1E5 > na && (na = -1E5);
                na > k + 1E5 && (na = k + 1E5);
                n ? (F = E, Q = O, O = E = na, isNaN(ia) && !this.fillToGraph && (Q = U), Ja = za, Ka = Aa) : (Q = F = na, isNaN(ia) && !this.fillToGraph && (O = U));
                S < ia && (D.isNegative = !0, Fa && (va = Fa), Ha && (La = Ha), void 0 != ya && (ma = ya));
                switch (g) {
                    case "line":
                        isNaN(S) ? t || (this.drawLineGraph(p, r, ga, ha), p = [], r = [], ga = [], ha = []) : (D.isNegative = S < sa ? !0 : !1, p.push(F), r.push(E), Z = F, ca = E, oa = F, pa = E, !Ia || (isNaN(O) || isNaN(Q)) || (ga.push(Q), ha.push(O)));
                        break;
                    case "smoothedLine":
                        isNaN(S) ?
                        t || (this.drawSmoothedGraph(p, r, ga, ha), p = [], r = [], ga = [], ha = []) : (D.isNegative = S < sa ? !0 : !1, p.push(F), r.push(E), Z = F, ca = E, oa = F, pa = E, !Ia || (isNaN(O) || isNaN(Q)) || (ga.push(Q), ha.push(O)));
                        break;
                    case "step":
                        isNaN(S) ? t || (v = NaN, this.drawLineGraph(p, r, ga, ha), p = [], r = [], ga = [], ha = []) : (D.isNegative = S < sa ? !0 : !1, n ? (isNaN(u) || (p.push(u), r.push(E - wa)), r.push(E - wa), p.push(F), r.push(E + Ma), p.push(F), !Ia || (isNaN(O) || isNaN(Q)) || (ga.push(Q), ha.push(O - wa), ga.push(Q), ha.push(O + Ma))) : (isNaN(v) || (r.push(v), p.push(F - wa)), p.push(F -
                            wa), r.push(E), p.push(F + Ma), r.push(E), !Ia || (isNaN(O) || isNaN(Q)) || (ga.push(Q - wa), ha.push(O), ga.push(Q + Ma), ha.push(O))), u = F, v = E, Z = F, ca = E, oa = F, pa = E);
                        break;
                    case "column":
                        ka = ma;
                        void 0 != D.lineColor && (ka = D.lineColor);
                        if (!isNaN(S)) {
                            S < sa ? (D.isNegative = !0, Fa && (va = Fa), void 0 != ya && (ma = ya)) : D.isNegative = !1;
                            var pb = f.min, qb = f.max;
                            if (!(S < pb && ia < pb || S > qb && ia > qb))if (n) {
                                "3d" == y ? (M = E - 0.5 * (h + V) + V / 2 + B * R, L = Q + x * R) : (M = E - (s / 2 - R) * (h + V) + V / 2, L = Q);
                                K = h;
                                Z = F;
                                ca = M + h / 2;
                                oa = F;
                                pa = M + h / 2;
                                M + K > l && (K = l - M);
                                0 > M && (K += M, M = 0);
                                aa = F - Q;
                                var Db = L;
                                L =
                                    AmCharts.fitToBounds(L, 0, k);
                                aa += Db - L;
                                aa = AmCharts.fitToBounds(aa, -L, k - L + x * R);
                                if (M < l && 0 < K && (ja = new AmCharts.Cuboid(e, aa, K, x - a.d3x, B - a.d3y, va, La, T, ka, P, X, q, n), "bottom" != z))if (z = f.reversed ? "left" : "right", 0 > S)z = f.reversed ? "right" : "left"; else if ("regular" == y || "100%" == y)Z += this.dx
                            } else {
                                "3d" == y ? (L = F - 0.5 * (h + V) + V / 2 + x * R, M = O + B * R) : (L = F - (s / 2 - R) * (h + V) + V / 2, M = O);
                                K = h;
                                Z = L + h / 2;
                                ca = E;
                                oa = L + h / 2;
                                pa = E;
                                L + K > k + R * x && (K = k - L + R * x);
                                0 > L && (K += L, L = 0);
                                aa = E - O;
                                var Eb = M;
                                M = AmCharts.fitToBounds(M, this.dy, l);
                                aa += Eb - M;
                                aa = AmCharts.fitToBounds(aa,
                                    -M + B * R, l - M);
                                if (L < k + R * x && 0 < K)if (ja = new AmCharts.Cuboid(e, K, aa, x - a.d3x, B - a.d3y, va, La, T, ka, this.lineAlpha, X, q, n), 0 > S && "middle" != z)z = "bottom"; else if (z = fa, "regular" == y || "100%" == y)ca += this.dy
                            }
                            if (ja && (qa = ja.set, qa.translate(L, M), this.columnsSet.push(qa), (D.url || this.showHandOnHover) && qa.setAttr("cursor", "pointer"), !J)) {
                                "none" == y && (A = n ? (this.end + 1 - N) * w - c : w * N + c);
                                "3d" == y && (n ? (A = (w - c) * (this.end + 1 - N), Z += x * this.columnIndex, oa += x * this.columnIndex, D.y += x * this.columnIndex) : (A = (w - c) * (N + 1), Z += 3, ca += B * this.columnIndex +
                                    7, pa += B * this.columnIndex, D.y += B * this.columnIndex));
                                if ("regular" == y || "100%" == y)z = "middle", A = n ? 0 < ra.value ? (this.end + 1 - N) * w + c : (this.end + 1 - N) * w - c : 0 < ra.value ? w * N + c : w * N - c;
                                this.columnsArray.push({column: ja, depth: A});
                                D.x = n ? M + K / 2 : L + K / 2;
                                this.ownColumns.push(ja);
                                this.animateColumns(ja, N, F, Q, E, O);
                                this.addListeners(qa, D)
                            }
                        }
                        break;
                    case "candlestick":
                        if (!isNaN(ia) && !isNaN(S)) {
                            var Ta, cb;
                            ka = ma;
                            void 0 != D.lineColor && (ka = D.lineColor);
                            if (n) {
                                if (M = E - h / 2, L = Q, K = h, M + K > l && (K = l - M), 0 > M && (K += M, M = 0), M < l && 0 < K) {
                                    var db, eb;
                                    S > ia ? (db =
                                        [F, Ka], eb = [Q, Ja]) : (db = [Q, Ka], eb = [F, Ja]);
                                    !isNaN(Ka) && !isNaN(Ja) && (E < l && 0 < E) && (Ta = AmCharts.line(e, db, [E, E], ka, P, T), cb = AmCharts.line(e, eb, [E, E], ka, P, T));
                                    aa = F - Q;
                                    ja = new AmCharts.Cuboid(e, aa, K, x, B, va, Ga, T, ka, P, X, q, n)
                                }
                            } else if (L = F - h / 2, M = O + T / 2, K = h, L + K > k && (K = k - L), 0 > L && (K += L, L = 0), aa = E - O, L < k && 0 < K) {
                                var ja = new AmCharts.Cuboid(e, K, aa, x, B, va, La, T, ka, P, X, q, n), fb, gb;
                                S > ia ? (fb = [E, Aa], gb = [O, za]) : (fb = [O, Aa], gb = [E, za]);
                                !isNaN(Aa) && !isNaN(za) && (F < k && 0 < F) && (Ta = AmCharts.line(e, [F, F], fb, ka, P, T), cb = AmCharts.line(e, [F, F], gb,
                                    ka, P, T))
                            }
                            ja && (qa = ja.set, ea.push(qa), qa.translate(L, M - T / 2), (D.url || this.showHandOnHover) && qa.setAttr("cursor", "pointer"), Ta && (ea.push(Ta), ea.push(cb)), Z = F, ca = E, oa = F, pa = E, J || (D.x = n ? M + K / 2 : L + K / 2, this.animateColumns(ja, N, F, Q, E, O), this.addListeners(qa, D)))
                        }
                        break;
                    case "ohlc":
                        if (!(isNaN(ia) || isNaN(ab) || isNaN(bb) || isNaN(S))) {
                            S < ia && (D.isNegative = !0, void 0 != ya && (ma = ya));
                            var hb, ib, jb;
                            if (n) {
                                var kb = E - h / 2, kb = AmCharts.fitToBounds(kb, 0, l), rb = AmCharts.fitToBounds(E, 0, l), lb = E + h / 2, lb = AmCharts.fitToBounds(lb, 0, l);
                                ib =
                                    AmCharts.line(e, [Q, Q], [kb, rb], ma, P, T, da);
                                0 < E && E < l && (hb = AmCharts.line(e, [Ja, Ka], [E, E], ma, P, T, da));
                                jb = AmCharts.line(e, [F, F], [rb, lb], ma, P, T, da)
                            } else {
                                var mb = F - h / 2, mb = AmCharts.fitToBounds(mb, 0, k), sb = AmCharts.fitToBounds(F, 0, k), nb = F + h / 2, nb = AmCharts.fitToBounds(nb, 0, k);
                                ib = AmCharts.line(e, [mb, sb], [O, O], ma, P, T, da);
                                0 < F && F < k && (hb = AmCharts.line(e, [F, F], [za, Aa], ma, P, T, da));
                                jb = AmCharts.line(e, [sb, nb], [E, E], ma, P, T, da)
                            }
                            ea.push(ib);
                            ea.push(hb);
                            ea.push(jb);
                            Z = F;
                            ca = E;
                            oa = F;
                            pa = E
                        }
                }
                if (!J && !isNaN(S)) {
                    var tb = this.hideBulletsCount;
                    if (this.end - this.start <= tb || 0 === tb) {
                        var Da = this.createBullet(D, oa, pa, N);
                        Da || (Da = 0);
                        var ub = this.labelText;
                        if (ub) {
                            var ba = this.createLabel(D, 0, 0, ub), xa = 0, Ba = 0, vb = ba.getBBox(), Ua = vb.width, Va = vb.height;
                            switch (z) {
                                case "left":
                                    xa = -(Ua / 2 + Da / 2 + 3);
                                    break;
                                case "top":
                                    Ba = -(Va / 2 + Da / 2 + 3);
                                    break;
                                case "right":
                                    xa = Da / 2 + 2 + Ua / 2;
                                    break;
                                case "bottom":
                                    n && "column" == g ? (Z = U, 0 > S ? (xa = -6, ba.attr({"text-anchor": "end"})) : (xa = 6, ba.attr({"text-anchor": "start"}))) : (Ba = Da / 2 + Va / 2, ba.x = -(Ua / 2 + 2));
                                    break;
                                case "middle":
                                    "column" == g && (n ? (Ba = -(Va /
                                        2) + this.fontSize / 2, xa = -(F - Q) / 2 - x, 0 > aa && (xa += x), Math.abs(F - Q) < Ua && !this.showAllValueLabels && (ba.remove(), ba = null)) : (Ba = -(E - O) / 2, 0 > aa && (Ba -= B), Math.abs(E - O) < Va && !this.showAllValueLabels && (ba.remove(), ba = null)))
                            }
                            if (ba) {
                                if (isNaN(ca) || isNaN(Z))ba.remove(), ba = null; else if (Z += xa, ca += Ba, ba.translate(Z, ca), n) {
                                    if (0 > ca || ca > l)ba.remove(), ba = null
                                } else {
                                    var wb = 0;
                                    "3d" == y && (wb = x * R);
                                    if (0 > Z || Z > k + wb)ba.remove(), ba = null
                                }
                                ba && this.allBullets.push(ba)
                            }
                        }
                        if ("column" == g && "regular" == y || "100%" == y) {
                            var xb = f.totalText;
                            if (xb) {
                                var Ea =
                                    this.createLabel(D, 0, 0, xb, f.totalTextColor);
                                this.allBullets.push(Ea);
                                var yb = Ea.getBBox(), zb = yb.width, Ab = yb.height, Na, Oa, Bb = f.totals[N];
                                Bb && Bb.remove();
                                n ? (Oa = E, Na = 0 > S ? F - zb / 2 - 2 : F + zb / 2 + 3) : (Na = F, Oa = 0 > S ? E + Ab / 2 : E - Ab / 2 - 3);
                                Ea.translate(Na, Oa);
                                f.totals[N] = Ea;
                                n ? (0 > Oa || Oa > l) && Ea.remove() : (0 > Na || Na > k) && Ea.remove()
                            }
                        }
                    }
                }
            }
        }
        if ("line" == g || "step" == g || "smoothedLine" == g)"smoothedLine" == g ? this.drawSmoothedGraph(p, r, ga, ha) : this.drawLineGraph(p, r, ga, ha), J || this.launchAnimation();
        this.bulletsHidden && this.hideBullets()
    }, animateColumns: function (a,
                                 b, c, d, e, f) {
        var g = this;
        c = g.chart.startDuration;
        0 < c && !g.animationPlayed && (g.seqAn ? (a.set.hide(), g.animationArray.push(a), a = setTimeout(function () {
            g.animate.call(g)
        }, 1E3 * c / (g.end - g.start + 1) * (b - g.start)), g.timeOuts.push(a)) : g.animate(a))
    }, createLabel: function (a, b, c, d, e) {
        var f = this.chart, g = a.labelColor;
        void 0 == g && (g = this.color);
        void 0 == g && (g = f.color);
        void 0 != e && (g = e);
        e = this.fontSize;
        void 0 === e && (this.fontSize = e = f.fontSize);
        a = f.formatString(d, a, this);
        a = AmCharts.cleanFromEmpty(a);
        f = AmCharts.text(this.container,
            a, g, f.fontFamily, e);
        f.translate(b, c);
        this.bulletSet.push(f);
        return f
    }, positiveClip: function (a) {
        a.clipRect(this.pmx, this.pmy, this.pmw, this.pmh)
    }, negativeClip: function (a) {
        a.clipRect(this.nmx, this.nmy, this.nmw, this.nmh)
    }, drawLineGraph: function (a, b, c, d) {
        var e = this;
        if (1 < a.length) {
            var f = e.set, g = e.container, h = g.set(), k = g.set();
            f.push(k);
            f.push(h);
            var l = e.lineAlpha, m = e.lineThickness, n = e.dashLength, f = e.fillAlphas, s = e.lineColor, q = e.fillColors, t = e.negativeLineColor, p = e.negativeFillColors, r = e.negativeFillAlphas,
                u = e.baseCoord;
            0 != e.negativeBase && (u = e.valueAxis.getCoordinate(e.negativeBase));
            s = AmCharts.line(g, a, b, s, l, m, n, !1, !0);
            h.push(s);
            h.click(function () {
                e.handleGraphClick()
            });
            void 0 !== t && (l = AmCharts.line(g, a, b, t, l, m, n, !1, !0), k.push(l));
            if (0 < f || 0 < r)if (l = a.join(";").split(";"), m = b.join(";").split(";"), "serial" == e.chartType && (0 < c.length ? (c.reverse(), d.reverse(), l = a.concat(c), m = b.concat(d)) : e.rotate ? (m.push(m[m.length - 1]), l.push(u), m.push(m[0]), l.push(u), m.push(m[0]), l.push(l[0])) : (l.push(l[l.length - 1]), m.push(u),
                    l.push(l[0]), m.push(u), l.push(a[0]), m.push(m[0]))), 0 < f && (a = AmCharts.polygon(g, l, m, q, f, 0, 0, 0, this.gradientRotation), h.push(a)), p || void 0 !== t)isNaN(r) && (r = f), p || (p = t), g = AmCharts.polygon(g, l, m, p, r, 0, 0, 0, this.gradientRotation), k.push(g), k.click(function () {
                e.handleGraphClick()
            });
            e.applyMask(k, h)
        }
    }, applyMask: function (a, b) {
        var c = a.length();
        "serial" != this.chartType || this.scrollbar || (this.positiveClip(b), 0 < c && this.negativeClip(a))
    }, drawSmoothedGraph: function (a, b, c, d) {
        if (1 < a.length) {
            var e = this.set, f = this.container,
                g = f.set(), h = f.set();
            e.push(h);
            e.push(g);
            var k = this.lineAlpha, l = this.lineThickness, e = this.dashLength, m = this.fillAlphas, n = this.fillColors, s = this.negativeLineColor, q = this.negativeFillColors, t = this.negativeFillAlphas, p = this.baseCoord, r = new AmCharts.Bezier(f, a, b, this.lineColor, k, l, n, 0, e);
            g.push(r.path);
            void 0 !== s && (k = new AmCharts.Bezier(f, a, b, s, k, l, n, 0, e), h.push(k.path));
            0 < m && (l = a.join(";").split(";"), r = b.join(";").split(";"), k = "", 0 < c.length ? (c.reverse(), d.reverse(), l = a.concat(c), r = b.concat(d)) : (this.rotate ?
                (k += " L" + p + "," + b[b.length - 1], k += " L" + p + "," + b[0]) : (k += " L" + a[a.length - 1] + "," + p, k += " L" + a[0] + "," + p), k += " L" + a[0] + "," + b[0]), c = new AmCharts.Bezier(f, l, r, NaN, 0, 0, n, m, e, k), g.push(c.path), q || void 0 !== s) && (t || (t = m), q || (q = s), a = new AmCharts.Bezier(f, a, b, NaN, 0, 0, q, t, e, k), h.push(a.path));
            this.applyMask(h, g)
        }
    }, launchAnimation: function () {
        var a = this, b = a.chart.startDuration;
        if (0 < b && !a.animationPlayed) {
            var c = a.set, d = a.bulletSet;
            AmCharts.VML || (c.attr({opacity: a.startAlpha}), d.attr({opacity: a.startAlpha}));
            c.hide();
            d.hide();
            a.seqAn ? (b = setTimeout(function () {
                a.animateGraphs.call(a)
            }, 1E3 * a.index * b), a.timeOuts.push(b)) : a.animateGraphs()
        }
    }, animateGraphs: function () {
        var a = this.chart, b = this.set, c = this.bulletSet, d = this.x, e = this.y;
        b.show();
        c.show();
        var f = a.startDuration, a = a.startEffect;
        b && (this.rotate ? (b.translate(-1E3, e), c.translate(-1E3, e)) : (b.translate(d, -1E3), c.translate(d, -1E3)), b.animate({
            opacity: 1,
            translate: d + "," + e
        }, f, a), c.animate({opacity: 1, translate: d + "," + e}, f, a))
    }, animate: function (a) {
        var b = this.chart, c = this.container,
            d = this.animationArray;
        !a && 0 < d.length && (a = d[0], d.shift());
        c = c[AmCharts.getEffect(b.startEffect)];
        b = b.startDuration;
        a && (this.rotate ? a.animateWidth(b, c) : a.animateHeight(b, c), a.set.show())
    }, legendKeyColor: function () {
        var a = this.legendColor, b = this.lineAlpha;
        void 0 === a && (a = this.lineColor, 0 === b && (b = this.fillColors) && (a = "object" == typeof b ? b[0] : b));
        return a
    }, legendKeyAlpha: function () {
        var a = this.legendAlpha;
        void 0 === a && (a = this.lineAlpha, 0 === a && this.fillAlphas && (a = this.fillAlphas), 0 === a && (a = this.bulletAlpha),
        0 === a && (a = 1));
        return a
    }, createBullet: function (a, b, c, d) {
        d = this.container;
        var e = this.bulletOffset, f = this.bulletSize;
        isNaN(a.bulletSize) || (f = a.bulletSize);
        if (!isNaN(this.maxValue)) {
            var g = a.values.value;
            isNaN(g) || (f = g / this.maxValue * this.maxBulletSize)
        }
        f < this.minBulletSize && (f = this.minBulletSize);
        this.rotate ? b += e : c -= e;
        var h;
        if ("none" != this.bullet || a.bullet) {
            var k = this.bulletColor;
            a.isNegative && void 0 !== this.bulletColorNegative && (k = this.bulletColorNegative);
            void 0 !== a.color && (k = a.color);
            e = this.bullet;
            a.bullet &&
            (e = a.bullet);
            var g = this.bulletBorderThickness, l = this.bulletBorderColor, m = this.bulletBorderAlpha, n = k, s = this.bulletAlpha, k = a.alpha;
            isNaN(k) || (s = k);
            k = 0;
            switch (e) {
                case "round":
                    h = AmCharts.circle(d, f / 2, n, s, g, l, m);
                    break;
                case "square":
                    h = AmCharts.polygon(d, [0, f, f, 0], [0, 0, f, f], n, s, g, l, m);
                    b -= f / 2;
                    c -= f / 2;
                    k = -f / 2;
                    break;
                case "triangleUp":
                    h = AmCharts.triangle(d, f, 0, n, s, g, l, m);
                    break;
                case "triangleDown":
                    h = AmCharts.triangle(d, f, 180, n, s, g, l, m);
                    break;
                case "triangleLeft":
                    h = AmCharts.triangle(d, f, 270, n, s, g, l, m);
                    break;
                case "triangleRight":
                    h =
                        AmCharts.triangle(d, f, 90, n, s, g, l, m);
                    break;
                case "bubble":
                    h = AmCharts.circle(d, f / 2, n, s, g, l, m, !0)
            }
        }
        g = e = 0;
        if (this.customBullet || a.customBullet)l = this.customBullet, a.customBullet && (l = a.customBullet), l && (h && h.remove(), "function" == typeof l ? (h = new l, h.chart = this.chart, a.bulletConfig && (h.availableSpace = c, h.graph = this, a.bulletConfig.minCoord = this.minCoord - c, h.bulletConfig = a.bulletConfig), h.write(d), h = h.set) : (this.chart.path && (l = this.chart.path + l), h = d.image(l, 0, 0, f, f), this.centerCustomBullets && (b -= f / 2, c -= f / 2,
            e -= f / 2, g -= f / 2)));
        h && ((a.url || this.showHandOnHover) && h.setAttr("cursor", "pointer"), "serial" == this.chartType && (b - e < k || b - e > this.width || c < -f / 2 || c - g > this.height) && (h.remove(), h = null), h && (this.bulletSet.push(h), h.translate(b, c), this.addListeners(h, a), this.allBullets.push(h)));
        return f
    }, showBullets: function () {
        var a = this.allBullets, b;
        this.bulletsHidden = !1;
        for (b = 0; b < a.length; b++)a[b].show()
    }, hideBullets: function () {
        var a = this.allBullets, b;
        this.bulletsHidden = !0;
        for (b = 0; b < a.length; b++)a[b].hide()
    }, addListeners: function (a,
                               b) {
        var c = this;
        a.mouseover(function () {
            c.handleRollOver(b)
        }).mouseout(function () {
            c.handleRollOut(b)
        }).touchend(function () {
            c.handleRollOver(b)
        }).touchstart(function () {
            c.handleRollOver(b)
        }).click(function () {
            c.handleClick(b)
        }).dblclick(function () {
            c.handleDoubleClick(b)
        }).contextmenu(function () {
            c.handleRightClick(b)
        })
    }, handleRollOver: function (a) {
        if (a) {
            var b = this.chart, c = {
                type: "rollOverGraphItem",
                item: a,
                index: a.index,
                graph: this,
                target: this,
                chart: this.chart
            };
            this.fire("rollOverGraphItem", c);
            b.fire("rollOverGraphItem",
                c);
            clearTimeout(b.hoverInt);
            c = this.showBalloon;
            b.chartCursor && "serial" == this.chartType && (c = !1, !b.chartCursor.valueBalloonsEnabled && this.showBalloon && (c = !0));
            c && (c = b.formatString(this.balloonText, a, a.graph), c = AmCharts.cleanFromEmpty(c), a = b.getBalloonColor(this, a), b.balloon.showBullet = !1, b.balloon.pointerOrientation = "V", b.showBalloon(c, a, !0))
        }
    }, handleRollOut: function (a) {
        this.chart.hideBalloon();
        a && (a = {
            type: "rollOutGraphItem",
            item: a,
            index: a.index,
            graph: this,
            target: this,
            chart: this.chart
        }, this.fire("rollOutGraphItem",
            a), this.chart.fire("rollOutGraphItem", a))
    }, handleClick: function (a) {
        if (a) {
            var b = {type: "clickGraphItem", item: a, index: a.index, graph: this, target: this, chart: this.chart};
            this.fire("clickGraphItem", b);
            this.chart.fire("clickGraphItem", b);
            AmCharts.getURL(a.url, this.urlTarget)
        }
        this.handleGraphClick()
    }, handleGraphClick: function () {
        var a = {type: "clickGraph", graph: this, target: this, chart: this.chart};
        this.fire("clickGraph", a);
        this.chart.fire("clickGraph", a)
    }, handleRightClick: function (a) {
        a && (a = {
            type: "rightClickGraphItem",
            item: a, index: a.index, graph: this, target: this, chart: this.chart
        }, this.fire("rightClickGraphItem", a), this.chart.fire("rightClickGraphItem", a))
    }, handleDoubleClick: function (a) {
        a && (a = {
            type: "doubleClickGraphItem",
            item: a,
            index: a.index,
            graph: this,
            target: this,
            chart: this.chart
        }, this.fire("doubleClickGraphItem", a), this.chart.fire("doubleClickGraphItem", a))
    }, zoom: function (a, b) {
        this.start = a;
        this.end = b;
        this.draw()
    }, changeOpacity: function (a) {
        var b = this.set;
        b && b.setAttr("opacity", a);
        if (b = this.ownColumns) {
            var c;
            for (c =
                     0; c < b.length; c++) {
                var d = b[c].set;
                d && d.setAttr("opacity", a)
            }
        }
        (b = this.bulletSet) && b.setAttr("opacity", a)
    }, destroy: function () {
        AmCharts.remove(this.set);
        AmCharts.remove(this.bulletSet);
        var a = this.timeOuts;
        if (a) {
            var b;
            for (b = 0; b < a.length; b++)clearTimeout(a[b])
        }
        this.timeOuts = []
    }
});
AmCharts.ChartCursor = AmCharts.Class({
    construct: function () {
        this.createEvents("changed", "zoomed", "onHideCursor", "draw", "selected");
        this.enabled = !0;
        this.cursorAlpha = 1;
        this.selectionAlpha = 0.2;
        this.cursorColor = "#CC0000";
        this.categoryBalloonAlpha = 1;
        this.color = "#FFFFFF";
        this.type = "cursor";
        this.zoomed = !1;
        this.zoomable = !0;
        this.pan = !1;
        this.animate = !0;
        this.categoryBalloonDateFormat = "MMM DD, YYYY";
        this.categoryBalloonEnabled = this.valueBalloonsEnabled = !0;
        this.rolledOver = !1;
        this.cursorPosition = "middle";
        this.bulletsEnabled =
            this.skipZoomDispatch = !1;
        this.bulletSize = 8;
        this.selectWithoutZooming = this.oneBalloonOnly = !1
    }, draw: function () {
        var a = this;
        a.destroy();
        var b = a.chart, c = b.container;
        a.rotate = b.rotate;
        a.container = c;
        c = c.set();
        c.translate(a.x, a.y);
        a.set = c;
        b.cursorSet.push(c);
        c = new AmCharts.AmBalloon;
        c.chart = b;
        a.categoryBalloon = c;
        c.cornerRadius = 0;
        c.borderThickness = 0;
        c.borderAlpha = 0;
        c.showBullet = !1;
        var d = a.categoryBalloonColor;
        void 0 === d && (d = a.cursorColor);
        c.fillColor = d;
        c.fillAlpha = a.categoryBalloonAlpha;
        c.borderColor = d;
        c.color =
            a.color;
        a.rotate && (c.pointerOrientation = "H");
        if (a.valueBalloonsEnabled)for (c = 0; c < b.graphs.length; c++)d = new AmCharts.AmBalloon, d.chart = b, AmCharts.copyProperties(b.balloon, d), b.graphs[c].valueBalloon = d;
        "cursor" == a.type ? a.createCursor() : a.createCrosshair();
        a.interval = setInterval(function () {
            a.detectMovement.call(a)
        }, 40)
    }, updateData: function () {
        var a = this.chart;
        this.data = a.chartData;
        this.firstTime = a.firstTime;
        this.lastTime = a.lastTime
    }, createCursor: function () {
        var a = this.chart, b = this.cursorAlpha, c = a.categoryAxis,
            d = c.position, e = c.inside, f = c.axisThickness, g = this.categoryBalloon, h, k, l = a.dx, m = a.dy, n = this.x, s = this.y, q = this.width, t = this.height, a = a.rotate, p = c.tickLength;
        g.pointerWidth = p;
        a ? (h = [0, q, q + l], k = [0, 0, m]) : (h = [l, 0, 0], k = [m, 0, t]);
        this.line = b = AmCharts.line(this.container, h, k, this.cursorColor, b, 1);
        this.set.push(b);
        a ? (e && (g.pointerWidth = 0), "right" == d ? e ? g.setBounds(n, s + m, n + q + l, s + t + m) : g.setBounds(n + q + l + f, s + m, n + q + 1E3, s + t + m) : e ? g.setBounds(n, s, q + n, t + s) : g.setBounds(-1E3, -1E3, n - p - f, s + t + 15)) : (g.maxWidth = q, c.parseDates &&
        (p = 0, g.pointerWidth = 0), "top" == d ? e ? g.setBounds(n + l, s + m, q + l + n, t + s) : g.setBounds(n + l, -1E3, q + l + n, s + m - p - f) : e ? g.setBounds(n, s, q + n, t + s - p) : g.setBounds(n, s + t + p + f - 1, n + q, s + t + p + f));
        this.hideCursor()
    }, createCrosshair: function () {
        var a = this.cursorAlpha, b = this.container, c = AmCharts.line(b, [0, 0], [0, this.height], this.cursorColor, a, 1), a = AmCharts.line(b, [0, this.width], [0, 0], this.cursorColor, a, 1);
        this.set.push(c);
        this.set.push(a);
        this.vLine = c;
        this.hLine = a;
        this.hideCursor()
    }, detectMovement: function () {
        var a = this.chart;
        if (a.mouseIsOver) {
            var b =
                a.mouseX - this.x, c = a.mouseY - this.y;
            0 < b && b < this.width && 0 < c && c < this.height ? (this.drawing ? this.rolledOver || a.setMouseCursor("crosshair") : this.pan && (this.rolledOver || a.setMouseCursor("move")), this.rolledOver = !0, this.setPosition()) : this.rolledOver && (this.handleMouseOut(), this.rolledOver = !1)
        } else this.rolledOver && (this.handleMouseOut(), this.rolledOver = !1)
    }, getMousePosition: function () {
        var a, b = this.width, c = this.height;
        a = this.chart;
        this.rotate ? (a = a.mouseY - this.y, 0 > a && (a = 0), a > c && (a = c)) : (a = a.mouseX - this.x, 0 >
        a && (a = 0), a > b && (a = b));
        return a
    }, updateCrosshair: function () {
        var a = this.chart, b = a.mouseX - this.x, c = a.mouseY - this.y, d = this.vLine, e = this.hLine, b = AmCharts.fitToBounds(b, 0, this.width), c = AmCharts.fitToBounds(c, 0, this.height);
        0 < this.cursorAlpha && (d.show(), e.show(), d.translate(b, 0), e.translate(0, c));
        this.zooming && (a.hideXScrollbar && (b = NaN), a.hideYScrollbar && (c = NaN), this.updateSelectionSize(b, c));
        a.mouseIsOver || this.zooming || this.hideCursor()
    }, updateSelectionSize: function (a, b) {
        AmCharts.remove(this.selection);
        var c = this.selectionPosX, d = this.selectionPosY, e = 0, f = 0, g = this.width, h = this.height;
        isNaN(a) || (c > a && (e = a, g = c - a), c < a && (e = c, g = a - c), c == a && (e = a, g = 0));
        isNaN(b) || (d > b && (f = b, h = d - b), d < b && (f = d, h = b - d), d == b && (f = b, h = 0));
        0 < g && 0 < h && (c = AmCharts.rect(this.container, g, h, this.cursorColor, this.selectionAlpha), c.translate(e + this.x, f + this.y), this.selection = c)
    }, arrangeBalloons: function () {
        var a = this.valueBalloons, b = this.x, c = this.y, d = this.height + c;
        a.sort(this.compareY);
        var e;
        for (e = 0; e < a.length; e++) {
            var f = a[e].balloon;
            f.setBounds(b,
                c, b + this.width, d);
            f.draw();
            d = f.yPos - 3
        }
        this.arrangeBalloons2()
    }, compareY: function (a, b) {
        return a.yy < b.yy ? 1 : -1
    }, arrangeBalloons2: function () {
        var a = this.valueBalloons;
        a.reverse();
        var b, c = this.x, d, e;
        for (e = 0; e < a.length; e++) {
            var f = a[e].balloon;
            b = f.bottom;
            var g = f.bottom - f.yPos;
            0 < e && b - g < d + 3 && (f.setBounds(c, d + 3, c + this.width, d + g + 3), f.draw());
            f.set && f.set.show();
            d = f.bottom
        }
    }, showBullets: function () {
        AmCharts.remove(this.allBullets);
        var a = this.container, b = a.set();
        this.set.push(b);
        this.set.show();
        this.allBullets =
            b;
        var b = this.chart.graphs, c;
        for (c = 0; c < b.length; c++) {
            var d = b[c];
            if (!d.hidden && d.balloonText) {
                var e = this.data[this.index].axes[d.valueAxis.id].graphs[d.id], f = e.y;
                if (!isNaN(f)) {
                    var g, h;
                    g = e.x;
                    this.rotate ? (h = f, f = g) : h = g;
                    d = AmCharts.circle(a, this.bulletSize / 2, this.chart.getBalloonColor(d, e), d.cursorBulletAlpha);
                    d.translate(h, f);
                    this.allBullets.push(d)
                }
            }
        }
    }, destroy: function () {
        this.clear();
        AmCharts.remove(this.selection);
        this.selection = null;
        var a = this.categoryBalloon;
        a && a.destroy();
        this.destroyValueBalloons();
        AmCharts.remove(this.set)
    }, clear: function () {
        clearInterval(this.interval)
    }, destroyValueBalloons: function () {
        var a = this.valueBalloons;
        if (a) {
            var b;
            for (b = 0; b < a.length; b++)a[b].balloon.hide()
        }
    }, zoom: function (a, b, c, d) {
        var e = this.chart;
        this.destroyValueBalloons();
        this.zooming = !1;
        var f;
        this.rotate ? this.selectionPosY = f = e.mouseY : this.selectionPosX = f = e.mouseX;
        this.start = a;
        this.end = b;
        this.startTime = c;
        this.endTime = d;
        this.zoomed = !0;
        var g = e.categoryAxis, e = this.rotate;
        f = this.width;
        var h = this.height;
        g.parseDates && !g.equalSpacing ? (a = d - c + g.minDuration(), a = e ? h / a : f / a) : a = e ? h / (b - a) : f / (b - a);
        this.stepWidth = a;
        this.setPosition();
        this.hideCursor()
    }, hideObj: function (a) {
        a && a.hide()
    }, hideCursor: function (a) {
        void 0 === a && (a = !0);
        this.hideObj(this.set);
        this.hideObj(this.categoryBalloon);
        this.hideObj(this.line);
        this.hideObj(this.vLine);
        this.hideObj(this.hLine);
        this.hideObj(this.allBullets);
        this.destroyValueBalloons();
        this.selectWithoutZooming || AmCharts.remove(this.selection);
        this.previousIndex = NaN;
        a && this.fire("onHideCursor",
            {type: "onHideCursor", chart: this.chart, target: this});
        this.drawing || this.chart.setMouseCursor("auto")
    }, setPosition: function (a, b) {
        void 0 === b && (b = !0);
        if ("cursor" == this.type) {
            if (AmCharts.ifArray(this.data)) {
                isNaN(a) && (a = this.getMousePosition());
                if ((a != this.previousMousePosition || !0 === this.zoomed || this.oneBalloonOnly) && !isNaN(a)) {
                    var c = this.chart.categoryAxis.xToIndex(a);
                    if (c != this.previousIndex || this.zoomed || "mouse" == this.cursorPosition || this.oneBalloonOnly)this.updateCursor(c, b), this.zoomed = !1
                }
                this.previousMousePosition =
                    a
            }
        } else this.updateCrosshair()
    }, updateCursor: function (a, b) {
        var c = this.chart, d = c.mouseX - this.x, e = c.mouseY - this.y;
        this.drawingNow && (AmCharts.remove(this.drawingLine), this.drawingLine = AmCharts.line(this.container, [this.x + this.drawStartX, this.x + d], [this.y + this.drawStartY, this.y + e], this.cursorColor, 1, 1));
        if (this.enabled) {
            void 0 === b && (b = !0);
            this.index = a;
            var f = c.categoryAxis, g = c.dx, h = c.dy, k = this.x, l = this.y, m = this.width, n = this.height, s = this.data[a];
            if (s) {
                var q = s.x[f.id], t = c.rotate, p = f.inside, r = this.stepWidth,
                    u = this.categoryBalloon, v = this.firstTime, w = this.lastTime, A = this.cursorPosition, x = f.position, B = this.zooming, y = this.panning, z = c.graphs, C = f.axisThickness;
                if (c.mouseIsOver || B || y || this.forceShow)if (this.forceShow = !1, y) {
                    var g = this.panClickPos, c = this.panClickEndTime, B = this.panClickStartTime, H = this.panClickEnd, k = this.panClickStart, d = (t ? g - e : g - d) / r;
                    if (!f.parseDates || f.equalSpacing)d = Math.round(d);
                    0 !== d && (g = {
                        type: "zoomed",
                        target: this
                    }, g.chart = this.chart, f.parseDates && !f.equalSpacing ? (c + d > w && (d = w - c), B + d < v && (d =
                        v - B), g.start = B + d, g.end = c + d, this.fire(g.type, g)) : H + d >= this.data.length || 0 > k + d || (g.start = k + d, g.end = H + d, this.fire(g.type, g)))
                } else {
                    "start" == A && (q -= f.cellWidth / 2);
                    "mouse" == A && c.mouseIsOver && (q = t ? e - 2 : d - 2);
                    if (t) {
                        if (0 > q)if (B)q = 0; else {
                            this.hideCursor();
                            return
                        }
                        if (q > n + 1)if (B)q = n + 1; else {
                            this.hideCursor();
                            return
                        }
                    } else {
                        if (0 > q)if (B)q = 0; else {
                            this.hideCursor();
                            return
                        }
                        if (q > m)if (B)q = m; else {
                            this.hideCursor();
                            return
                        }
                    }
                    0 < this.cursorAlpha && (v = this.line, t ? v.translate(0, q + h) : v.translate(q, 0), v.show());
                    this.linePos = t ? q + h :
                        q;
                    B && (t ? this.updateSelectionSize(NaN, q) : this.updateSelectionSize(q, NaN));
                    v = !0;
                    B && (v = !1);
                    this.categoryBalloonEnabled && v ? (t ? (p && ("right" == x ? u.setBounds(k, l + h, k + m + g, l + q + h) : u.setBounds(k, l + h, k + m + g, l + q)), "right" == x ? p ? u.setPosition(k + m + g, l + q + h) : u.setPosition(k + m + g + C, l + q + h) : p ? u.setPosition(k, l + q) : u.setPosition(k - C, l + q)) : "top" == x ? p ? u.setPosition(k + q + g, l + h) : u.setPosition(k + q + g, l + h - C + 1) : p ? u.setPosition(k + q, l + n) : u.setPosition(k + q, l + n + C - 1), f.parseDates ? (f = AmCharts.formatDate(s.category, this.categoryBalloonDateFormat),
                    -1 != f.indexOf("fff") && (f = AmCharts.formatMilliseconds(f, s.category)), u.showBalloon(f)) : u.showBalloon(s.category)) : u.hide();
                    z && this.bulletsEnabled && this.showBullets();
                    this.destroyValueBalloons();
                    if (z && this.valueBalloonsEnabled && v && c.balloon.enabled) {
                        this.valueBalloons = v = [];
                        if (this.oneBalloonOnly) {
                            h = Infinity;
                            for (f = 0; f < z.length; f++)r = z[f], r.showBalloon && (!r.hidden && r.balloonText) && (u = s.axes[r.valueAxis.id].graphs[r.id], w = u.y, isNaN(w) || (t ? Math.abs(d - w) < h && (h = Math.abs(d - w), H = r) : Math.abs(e - w) < h && (h = Math.abs(e -
                                w), H = r)));
                            this.mostCloseGraph && (H = this.mostCloseGraph)
                        }
                        for (f = 0; f < z.length; f++)if (r = z[f], (!this.oneBalloonOnly || r == H) && (r.showBalloon && !r.hidden && r.balloonText) && (u = s.axes[r.valueAxis.id].graphs[r.id], w = u.y, !isNaN(w))) {
                            q = u.x;
                            p = !0;
                            if (t) {
                                if (h = w, 0 > q || q > n)p = !1
                            } else if (h = q, q = w, 0 > h || h > m + g)p = !1;
                            p && (p = r.valueBalloon, x = c.getBalloonColor(r, u), p.setBounds(k, l, k + m, l + n), p.pointerOrientation = "H", p.changeColor(x), void 0 !== r.balloonAlpha && (p.fillAlpha = r.balloonAlpha), void 0 !== r.balloonTextColor && (p.color = r.balloonTextColor),
                                p.setPosition(h + k, q + l), r = c.formatString(r.balloonText, u, r), "" !== r && p.showBalloon(r), !t && p.set && p.set.hide(), v.push({
                                yy: w,
                                balloon: p
                            }))
                        }
                        t || this.arrangeBalloons()
                    }
                    b ? (g = {type: "changed"}, g.index = a, g.target = this, g.chart = this.chart, g.zooming = B, g.mostCloseGraph = H, g.position = t ? e : d, g.target = this, c.fire("changed", g), this.fire("changed", g), this.skipZoomDispatch = !1) : (this.skipZoomDispatch = !0, c.updateLegendValues(a));
                    this.previousIndex = a
                }
            }
        } else this.hideCursor()
    }, enableDrawing: function (a) {
        this.enabled = !a;
        this.hideCursor();
        this.rolledOver = !1;
        this.drawing = a
    }, isZooming: function (a) {
        a && a != this.zooming && this.handleMouseDown("fake");
        a || a == this.zooming || this.handleMouseUp()
    }, handleMouseOut: function () {
        if (this.enabled)if (this.zooming)this.setPosition(); else {
            this.index = void 0;
            var a = {type: "changed", index: void 0, target: this};
            a.chart = this.chart;
            this.fire("changed", a);
            this.hideCursor()
        }
    }, handleReleaseOutside: function () {
        this.handleMouseUp()
    }, handleMouseUp: function () {
        var a = this.chart, b = this.data, c;
        if (a) {
            var d = a.mouseX - this.x, e = a.mouseY -
                this.y;
            if (this.drawingNow) {
                this.drawingNow = !1;
                AmCharts.remove(this.drawingLine);
                c = this.drawStartX;
                var f = this.drawStartY;
                if (2 < Math.abs(c - d) || 2 < Math.abs(f - e))c = {
                    type: "draw",
                    target: this,
                    chart: a,
                    initialX: c,
                    initialY: f,
                    finalX: d,
                    finalY: e
                }, this.fire(c.type, c)
            }
            if (this.enabled && 0 < b.length) {
                if (this.pan)this.rolledOver = !1; else if (this.zoomable && this.zooming) {
                    c = this.selectWithoutZooming ? {type: "selected"} : {type: "zoomed"};
                    c.target = this;
                    c.chart = a;
                    if ("cursor" == this.type)this.rotate ? this.selectionPosY = e : this.selectionPosX =
                        e = d, 2 > Math.abs(e - this.initialMouse) && this.fromIndex == this.index || (this.index < this.fromIndex ? (c.end = this.fromIndex, c.start = this.index) : (c.end = this.index, c.start = this.fromIndex), e = a.categoryAxis, e.parseDates && !e.equalSpacing && (c.start = b[c.start].time, c.end = a.getEndTime(b[c.end].time)), this.skipZoomDispatch || this.fire(c.type, c)); else {
                        var g = this.initialMouseX, h = this.initialMouseY;
                        3 > Math.abs(d - g) && 3 > Math.abs(e - h) || (b = Math.min(g, d), f = Math.min(h, e), d = Math.abs(g - d), e = Math.abs(h - e), a.hideXScrollbar && (b = 0,
                            d = this.width), a.hideYScrollbar && (f = 0, e = this.height), c.selectionHeight = e, c.selectionWidth = d, c.selectionY = f, c.selectionX = b, this.skipZoomDispatch || this.fire(c.type, c))
                    }
                    this.selectWithoutZooming || AmCharts.remove(this.selection)
                }
                this.panning = this.zooming = this.skipZoomDispatch = !1
            }
        }
    }, showCursorAt: function (a) {
        var b = this.chart.categoryAxis;
        a = b.parseDates ? b.dateToCoordinate(a) : b.categoryToCoordinate(a);
        this.previousMousePosition = NaN;
        this.forceShow = !0;
        this.setPosition(a, !1)
    }, handleMouseDown: function (a) {
        if (this.zoomable ||
            this.pan || this.drawing) {
            var b = this.rotate, c = this.chart, d = c.mouseX - this.x, e = c.mouseY - this.y;
            if (0 < d && d < this.width && 0 < e && e < this.height || "fake" == a)this.setPosition(), this.selectWithoutZooming && AmCharts.remove(this.selection), this.drawing ? (this.drawStartY = e, this.drawStartX = d, this.drawingNow = !0) : this.pan ? (this.zoomable = !1, c.setMouseCursor("move"), this.panning = !0, this.panClickPos = b ? e : d, this.panClickStart = this.start, this.panClickEnd = this.end, this.panClickStartTime = this.startTime, this.panClickEndTime = this.endTime) :
            this.zoomable && ("cursor" == this.type ? (this.fromIndex = this.index, b ? (this.initialMouse = e, this.selectionPosY = this.linePos) : (this.initialMouse = d, this.selectionPosX = this.linePos)) : (this.initialMouseX = d, this.initialMouseY = e, this.selectionPosX = d, this.selectionPosY = e), this.zooming = !0)
        }
    }
});
AmCharts.SimpleChartScrollbar = AmCharts.Class({
    construct: function () {
        this.createEvents("zoomed");
        this.backgroundColor = "#D4D4D4";
        this.backgroundAlpha = 1;
        this.selectedBackgroundColor = "#EFEFEF";
        this.scrollDuration = this.selectedBackgroundAlpha = 1;
        this.resizeEnabled = !0;
        this.hideResizeGrips = !1;
        this.scrollbarHeight = 20;
        this.updateOnReleaseOnly = !1;
        9 > document.documentMode && (this.updateOnReleaseOnly = !0);
        this.dragIconWidth = 11;
        this.dragIconHeight = 18
    }, draw: function () {
        var a = this;
        a.destroy();
        a.interval = setInterval(function () {
                a.updateScrollbar.call(a)
            },
            40);
        var b = a.chart.container, c = a.rotate, d = a.chart, e = b.set();
        a.set = e;
        d.scrollbarsSet.push(e);
        var f, g;
        c ? (f = a.scrollbarHeight, g = d.plotAreaHeight) : (g = a.scrollbarHeight, f = d.plotAreaWidth);
        a.width = f;
        if ((a.height = g) && f) {
            var h = AmCharts.rect(b, f, g, a.backgroundColor, a.backgroundAlpha);
            a.bg = h;
            e.push(h);
            h = AmCharts.rect(b, f, g, "#000", 0.005);
            e.push(h);
            a.invisibleBg = h;
            h.click(function () {
                a.handleBgClick()
            }).mouseover(function () {
                a.handleMouseOver()
            }).mouseout(function () {
                a.handleMouseOut()
            }).touchend(function () {
                a.handleBgClick()
            });
            h = AmCharts.rect(b, f, g, a.selectedBackgroundColor, a.selectedBackgroundAlpha);
            a.selectedBG = h;
            e.push(h);
            f = AmCharts.rect(b, f, g, "#000", 0.005);
            a.dragger = f;
            e.push(f);
            f.mousedown(function (b) {
                a.handleDragStart(b)
            }).mouseup(function () {
                a.handleDragStop()
            }).mouseover(function () {
                a.handleDraggerOver()
            }).mouseout(function () {
                a.handleMouseOut()
            }).touchstart(function (b) {
                a.handleDragStart(b)
            }).touchend(function () {
                a.handleDragStop()
            });
            f = d.pathToImages;
            c ? (h = f + "dragIconH.gif", f = a.dragIconWidth, c = a.dragIconHeight) : (h = f +
                "dragIcon.gif", c = a.dragIconWidth, f = a.dragIconHeight);
            g = b.image(h, 0, 0, c, f);
            var h = b.image(h, 0, 0, c, f), k = 10, l = 20;
            d.panEventsEnabled && (k = 25, l = a.scrollbarHeight);
            var m = AmCharts.rect(b, k, l, "#000", 0.005), n = AmCharts.rect(b, k, l, "#000", 0.005);
            n.translate(-(k - c) / 2, -(l - f) / 2);
            m.translate(-(k - c) / 2, -(l - f) / 2);
            c = b.set([g, n]);
            b = b.set([h, m]);
            a.iconLeft = c;
            e.push(a.iconLeft);
            a.iconRight = b;
            e.push(b);
            c.mousedown(function () {
                a.leftDragStart()
            }).mouseup(function () {
                a.leftDragStop()
            }).mouseover(function () {
                a.iconRollOver()
            }).mouseout(function () {
                a.iconRollOut()
            }).touchstart(function (b) {
                a.leftDragStart()
            }).touchend(function () {
                a.leftDragStop()
            });
            b.mousedown(function () {
                a.rightDragStart()
            }).mouseup(function () {
                a.rightDragStop()
            }).mouseover(function () {
                a.iconRollOver()
            }).mouseout(function () {
                a.iconRollOut()
            }).touchstart(function (b) {
                a.rightDragStart()
            }).touchend(function () {
                a.rightDragStop()
            });
            AmCharts.ifArray(d.chartData) ? e.show() : e.hide();
            a.hideDragIcons()
        }
        e.translate(a.x, a.y);
        a.clipDragger(!1)
    }, updateScrollbarSize: function (a, b) {
        var c = this.dragger, d, e, f, g;
        this.rotate ? (d = 0, e = a, f = this.width + 1, g = b - a, c.setAttr("height", b - a), c.setAttr("y", e)) : (d = a,
            e = 0, f = b - a, g = this.height + 1, c.setAttr("width", b - a), c.setAttr("x", d));
        this.clipAndUpdate(d, e, f, g)
    }, updateScrollbar: function () {
        var a, b = !1, c, d, e = this.x, f = this.y, g = this.dragger, h = this.getDBox();
        c = h.x + e;
        d = h.y + f;
        var k = h.width, h = h.height, l = this.rotate, m = this.chart, n = this.width, s = this.height, q = m.mouseX, t = m.mouseY;
        a = this.initialMouse;
        m.mouseIsOver && (this.dragging && (m = this.initialCoord, l ? (a = m + (t - a), 0 > a && (a = 0), m = s - h, a > m && (a = m), g.setAttr("y", a)) : (a = m + (q - a), 0 > a && (a = 0), m = n - k, a > m && (a = m), g.setAttr("x", a))), this.resizingRight &&
        (l ? (a = t - d, a + d > s + f && (a = s - d + f), 0 > a ? (this.resizingRight = !1, b = this.resizingLeft = !0) : (0 === a && (a = 0.1), g.setAttr("height", a))) : (a = q - c, a + c > n + e && (a = n - c + e), 0 > a ? (this.resizingRight = !1, b = this.resizingLeft = !0) : (0 === a && (a = 0.1), g.setAttr("width", a)))), this.resizingLeft && (l ? (c = d, d = t, d < f && (d = f), d > s + f && (d = s + f), a = !0 === b ? c - d : h + c - d, 0 > a ? (this.resizingRight = !0, this.resizingLeft = !1, g.setAttr("y", c + h - f)) : (0 === a && (a = 0.1), g.setAttr("y", d - f), g.setAttr("height", a))) : (d = q, d < e && (d = e), d > n + e && (d = n + e), a = !0 === b ? c - d : k + c - d, 0 > a ? (this.resizingRight = !0, this.resizingLeft = !1, g.setAttr("x", c + k - e)) : (0 === a && (a = 0.1), g.setAttr("x", d - e), g.setAttr("width", a)))), this.clipDragger(!0))
    }, clipDragger: function (a) {
        var b = this.getDBox(), c = b.x, d = b.y, e = b.width, b = b.height, f = !1;
        if (this.rotate) {
            if (c = 0, e = this.width + 1, this.clipY != d || this.clipH != b)f = !0
        } else if (d = 0, b = this.height + 1, this.clipX != c || this.clipW != e)f = !0;
        f && (this.clipAndUpdate(c, d, e, b), a && (this.updateOnReleaseOnly || this.dispatchScrollbarEvent()))
    }, maskGraphs: function () {
    }, clipAndUpdate: function (a, b, c, d) {
        this.clipX =
            a;
        this.clipY = b;
        this.clipW = c;
        this.clipH = d;
        this.selectedBG.clipRect(a, b, c, d);
        this.updateDragIconPositions();
        this.maskGraphs(a, b, c, d)
    }, dispatchScrollbarEvent: function () {
        if (this.skipEvent)this.skipEvent = !1; else {
            var a = this.chart;
            a.hideBalloon();
            var b = this.getDBox(), c = b.x, d = b.y, e = b.width, b = b.height;
            this.rotate ? (c = d, e = this.height / b) : e = this.width / e;
            a = {type: "zoomed", position: c, chart: a, target: this, multiplier: e};
            this.fire(a.type, a)
        }
    }, updateDragIconPositions: function () {
        var a = this.getDBox(), b = a.x, c = a.y, d = this.iconLeft,
            e = this.iconRight, f, g, h = this.scrollbarHeight;
        this.rotate ? (f = this.dragIconWidth, g = this.dragIconHeight, d.translate((h - g) / 2, c - f / 2), e.translate((h - g) / 2, c + a.height - f / 2)) : (f = this.dragIconHeight, g = this.dragIconWidth, d.translate(b - g / 2, (h - f) / 2), e.translate(b + -g / 2 + a.width, (h - f) / 2))
    }, showDragIcons: function () {
        this.resizeEnabled && (this.iconLeft.show(), this.iconRight.show())
    }, hideDragIcons: function () {
        this.resizingLeft || (this.resizingRight || this.dragging) || (this.hideResizeGrips && (this.iconLeft.hide(), this.iconRight.hide()),
            this.removeCursors())
    }, removeCursors: function () {
        this.chart.setMouseCursor("auto")
    }, relativeZoom: function (a, b) {
        this.dragger.stop();
        this.multiplier = a;
        this.position = b;
        this.updateScrollbarSize(b, this.rotate ? b + this.height / a : b + this.width / a)
    }, destroy: function () {
        this.clear();
        AmCharts.remove(this.set)
    }, clear: function () {
        clearInterval(this.interval)
    }, handleDragStart: function () {
        var a = this.chart;
        this.dragger.stop();
        this.removeCursors();
        this.dragging = !0;
        var b = this.getDBox();
        this.rotate ? (this.initialCoord = b.y, this.initialMouse =
            a.mouseY) : (this.initialCoord = b.x, this.initialMouse = a.mouseX)
    }, handleDragStop: function () {
        this.updateOnReleaseOnly && (this.updateScrollbar(), this.skipEvent = !1, this.dispatchScrollbarEvent());
        this.dragging = !1;
        this.mouseIsOver && this.removeCursors();
        this.updateScrollbar()
    }, handleDraggerOver: function () {
        this.handleMouseOver()
    }, leftDragStart: function () {
        this.dragger.stop();
        this.resizingLeft = !0
    }, leftDragStop: function () {
        this.resizingLeft = !1;
        this.mouseIsOver || this.removeCursors();
        this.updateOnRelease()
    }, rightDragStart: function () {
        this.dragger.stop();
        this.resizingRight = !0
    }, rightDragStop: function () {
        this.resizingRight = !1;
        this.mouseIsOver || this.removeCursors();
        this.updateOnRelease()
    }, iconRollOut: function () {
        this.removeCursors()
    }, iconRollOver: function () {
        this.rotate ? this.chart.setMouseCursor("n-resize") : this.chart.setMouseCursor("e-resize");
        this.handleMouseOver()
    }, getDBox: function () {
        return this.dragger.getBBox()
    }, handleBgClick: function () {
        if (!this.resizingRight && !this.resizingLeft) {
            this.zooming = !0;
            var a, b, c = this.scrollDuration, d = this.dragger;
            a = this.getDBox();
            var e = a.height, f = a.width;
            b = this.chart;
            var g = this.y, h = this.x, k = this.rotate;
            k ? (a = "y", b = b.mouseY - e / 2 - g, b = AmCharts.fitToBounds(b, 0, this.height - e)) : (a = "x", b = b.mouseX - f / 2 - h, b = AmCharts.fitToBounds(b, 0, this.width - f));
            this.updateOnReleaseOnly ? (this.skipEvent = !1, d.setAttr(a, b), this.dispatchScrollbarEvent(), this.clipDragger()) : (b = Math.round(b), k ? d.animate({y: b}, c, ">") : d.animate({x: b}, c, ">"))
        }
    }, updateOnRelease: function () {
        this.updateOnReleaseOnly && (this.updateScrollbar(), this.skipEvent = !1, this.dispatchScrollbarEvent())
    },
    handleReleaseOutside: function () {
        if (this.set) {
            if (this.resizingLeft || this.resizingRight || this.dragging)this.updateOnRelease(), this.removeCursors();
            this.mouseIsOver = this.dragging = this.resizingRight = this.resizingLeft = !1;
            this.hideDragIcons();
            this.updateScrollbar()
        }
    }, handleMouseOver: function () {
        this.mouseIsOver = !0;
        this.showDragIcons()
    }, handleMouseOut: function () {
        this.mouseIsOver = !1;
        this.hideDragIcons()
    }
});
AmCharts.ChartScrollbar = AmCharts.Class({
    inherits: AmCharts.SimpleChartScrollbar, construct: function () {
        AmCharts.ChartScrollbar.base.construct.call(this);
        this.graphLineColor = "#BBBBBB";
        this.graphLineAlpha = 0;
        this.graphFillColor = "#BBBBBB";
        this.graphFillAlpha = 1;
        this.selectedGraphLineColor = "#888888";
        this.selectedGraphLineAlpha = 0;
        this.selectedGraphFillColor = "#888888";
        this.selectedGraphFillAlpha = 1;
        this.gridCount = 0;
        this.gridColor = "#FFFFFF";
        this.gridAlpha = 0.7;
        this.skipEvent = this.autoGridCount = !1;
        this.color = "#FFFFFF";
        this.scrollbarCreated = !1
    }, init: function () {
        var a = this.categoryAxis, b = this.chart;
        a || (this.categoryAxis = a = new AmCharts.CategoryAxis);
        a.chart = b;
        a.id = "scrollbar";
        a.dateFormats = b.categoryAxis.dateFormats;
        a.boldPeriodBeginning = b.categoryAxis.boldPeriodBeginning;
        a.axisItemRenderer = AmCharts.RecItem;
        a.axisRenderer = AmCharts.RecAxis;
        a.guideFillRenderer = AmCharts.RecFill;
        a.inside = !0;
        a.fontSize = this.fontSize;
        a.tickLength = 0;
        a.axisAlpha = 0;
        this.graph && (a = this.valueAxis, a || (this.valueAxis = a = new AmCharts.ValueAxis, a.visible = !1, a.scrollbar = !0, a.axisItemRenderer = AmCharts.RecItem, a.axisRenderer = AmCharts.RecAxis, a.guideFillRenderer = AmCharts.RecFill, a.labelsEnabled = !1, a.chart = b), b = this.unselectedGraph, b || (b = new AmCharts.AmGraph, b.scrollbar = !0, this.unselectedGraph = b, b.negativeBase = this.graph.negativeBase), b = this.selectedGraph, b || (b = new AmCharts.AmGraph, b.scrollbar = !0, this.selectedGraph = b, b.negativeBase = this.graph.negativeBase));
        this.scrollbarCreated = !0
    }, draw: function () {
        var a = this;
        AmCharts.ChartScrollbar.base.draw.call(a);
        a.scrollbarCreated || a.init();
        var b = a.chart, c = b.chartData, d = a.categoryAxis, e = a.rotate, f = a.x, g = a.y, h = a.width, k = a.height, l = b.categoryAxis, m = a.set;
        d.setOrientation(!e);
        d.parseDates = l.parseDates;
        d.rotate = e;
        d.equalSpacing = l.equalSpacing;
        d.minPeriod = l.minPeriod;
        d.startOnAxis = l.startOnAxis;
        d.viW = h;
        d.viH = k;
        d.width = h;
        d.height = k;
        d.gridCount = a.gridCount;
        d.gridColor = a.gridColor;
        d.gridAlpha = a.gridAlpha;
        d.color = a.color;
        d.autoGridCount = a.autoGridCount;
        d.parseDates && !d.equalSpacing && d.timeZoom(b.firstTime, b.lastTime);
        d.zoom(0, c.length - 1);
        if (l = a.graph) {
            var n = a.valueAxis, s = l.valueAxis;
            n.id = s.id;
            n.rotate = e;
            n.setOrientation(e);
            n.width = h;
            n.height = k;
            n.viW = h;
            n.viH = k;
            n.dataProvider = c;
            n.reversed = s.reversed;
            n.logarithmic = s.logarithmic;
            n.gridAlpha = 0;
            n.axisAlpha = 0;
            m.push(n.set);
            e ? n.y = g : n.x = f;
            var f = Infinity, g = -Infinity, q;
            for (q = 0; q < c.length; q++) {
                var t = c[q].axes[s.id].graphs[l.id].values, p;
                for (p in t)if (t.hasOwnProperty(p) && "percents" != p && "total" != p) {
                    var r = t[p];
                    r < f && (f = r);
                    r > g && (g = r)
                }
            }
            Infinity != f && (n.minimum = f);
            -Infinity != g &&
            (n.maximum = g + 0.1 * (g - f));
            f == g && (n.minimum -= 1, n.maximum += 1);
            void 0 != a.minimum && (n.minimum = a.minimum);
            void 0 != a.maximum && (n.maximum = a.maximum);
            n.zoom(0, c.length - 1);
            p = a.unselectedGraph;
            p.id = l.id;
            p.rotate = e;
            p.chart = b;
            p.chartType = b.chartType;
            p.data = c;
            p.valueAxis = n;
            p.chart = l.chart;
            p.categoryAxis = a.categoryAxis;
            p.valueField = l.valueField;
            p.openField = l.openField;
            p.closeField = l.closeField;
            p.highField = l.highField;
            p.lowField = l.lowField;
            p.lineAlpha = a.graphLineAlpha;
            p.lineColor = a.graphLineColor;
            p.fillAlphas = a.graphFillAlpha;
            p.fillColors = a.graphFillColor;
            p.connect = l.connect;
            p.hidden = l.hidden;
            p.width = h;
            p.height = k;
            s = a.selectedGraph;
            s.id = l.id;
            s.rotate = e;
            s.chart = b;
            s.chartType = b.chartType;
            s.data = c;
            s.valueAxis = n;
            s.chart = l.chart;
            s.categoryAxis = d;
            s.valueField = l.valueField;
            s.openField = l.openField;
            s.closeField = l.closeField;
            s.highField = l.highField;
            s.lowField = l.lowField;
            s.lineAlpha = a.selectedGraphLineAlpha;
            s.lineColor = a.selectedGraphLineColor;
            s.fillAlphas = a.selectedGraphFillAlpha;
            s.fillColors = a.selectedGraphFillColor;
            s.connect = l.connect;
            s.hidden = l.hidden;
            s.width = h;
            s.height = k;
            b = a.graphType;
            b || (b = l.type);
            p.type = b;
            s.type = b;
            c = c.length - 1;
            p.zoom(0, c);
            s.zoom(0, c);
            s.set.click(function () {
                a.handleBackgroundClick()
            }).mouseover(function () {
                a.handleMouseOver()
            }).mouseout(function () {
                a.handleMouseOut()
            });
            p.set.click(function () {
                a.handleBackgroundClick()
            }).mouseover(function () {
                a.handleMouseOver()
            }).mouseout(function () {
                a.handleMouseOut()
            });
            m.push(p.set);
            m.push(s.set)
        }
        m.push(d.set);
        m.push(d.labelsSet);
        a.bg.toBack();
        a.invisibleBg.toFront();
        a.dragger.toFront();
        a.iconLeft.toFront();
        a.iconRight.toFront()
    }, timeZoom: function (a, b) {
        this.startTime = a;
        this.endTime = b;
        this.timeDifference = b - a;
        this.skipEvent = !0;
        this.zoomScrollbar()
    }, zoom: function (a, b) {
        this.start = a;
        this.end = b;
        this.skipEvent = !0;
        this.zoomScrollbar()
    }, dispatchScrollbarEvent: function () {
        if (this.skipEvent)this.skipEvent = !1; else {
            var a = this.chart.chartData, b, c, d = this.dragger.getBBox();
            b = d.x;
            c = d.y;
            var e = d.width, f = d.height, d = this.chart;
            this.rotate ? (b = c, c = f) : c = e;
            e = {type: "zoomed", target: this};
            e.chart = d;
            var f = this.categoryAxis,
                g = this.stepWidth;
            if (f.parseDates && !f.equalSpacing) {
                if (a = d.firstTime, f.minDuration(), d = Math.round(b / g) + a, a = this.dragging ? d + this.timeDifference : Math.round((b + c) / g) + a, d > a && (d = a), d != this.startTime || a != this.endTime)this.startTime = d, this.endTime = a, e.start = d, e.end = a, e.startDate = new Date(d), e.endDate = new Date(a), this.fire(e.type, e)
            } else if (f.startOnAxis || (b += g / 2), c -= this.stepWidth / 2, d = f.xToIndex(b), b = f.xToIndex(b + c), d != this.start || this.end != b)f.startOnAxis && (this.resizingRight && d == b && b++, this.resizingLeft &&
            d == b && (0 < d ? d-- : b = 1)), this.start = d, this.end = this.dragging ? this.start + this.difference : b, e.start = this.start, e.end = this.end, f.parseDates && (a[this.start] && (e.startDate = new Date(a[this.start].time)), a[this.end] && (e.endDate = new Date(a[this.end].time))), this.fire(e.type, e)
        }
    }, zoomScrollbar: function () {
        var a, b;
        a = this.chart;
        var c = a.chartData, d = this.categoryAxis;
        d.parseDates && !d.equalSpacing ? (c = d.stepWidth, d = a.firstTime, a = c * (this.startTime - d), b = c * (this.endTime - d)) : (a = c[this.start].x[d.id], b = c[this.end].x[d.id],
            c = d.stepWidth, d.startOnAxis || (d = c / 2, a -= d, b += d));
        this.stepWidth = c;
        this.updateScrollbarSize(a, b)
    }, maskGraphs: function (a, b, c, d) {
        var e = this.selectedGraph;
        e && e.set.clipRect(a, b, c, d)
    }, handleDragStart: function () {
        AmCharts.ChartScrollbar.base.handleDragStart.call(this);
        this.difference = this.end - this.start;
        this.timeDifference = this.endTime - this.startTime;
        0 > this.timeDifference && (this.timeDifference = 0)
    }, handleBackgroundClick: function () {
        AmCharts.ChartScrollbar.base.handleBackgroundClick.call(this);
        this.dragging ||
        (this.difference = this.end - this.start, this.timeDifference = this.endTime - this.startTime, 0 > this.timeDifference && (this.timeDifference = 0))
    }
});
AmCharts.circle = function (a, b, c, d, e, f, g, h) {
    if (void 0 == e || 0 === e)e = 1;
    void 0 === f && (f = "#000000");
    void 0 === g && (g = 0);
    d = {fill: c, stroke: f, "fill-opacity": d, "stroke-width": e, "stroke-opacity": g};
    a = a.circle(0, 0, b).attr(d);
    h && a.gradient("radialGradient", [c, AmCharts.adjustLuminosity(c, -0.6)]);
    return a
};
AmCharts.text = function (a, b, c, d, e, f, g, h) {
    f || (f = "middle");
    "right" == f && (f = "end");
    AmCharts.isIE && 9 > AmCharts.IEversion && (b = b.replace("&amp;", "&"), b = b.replace("&", "&amp;"));
    c = {fill: c, "font-family": d, "font-size": e, opacity: h};
    !0 === g && (c["font-weight"] = "bold");
    c["text-anchor"] = f;
    return a.text(b, c)
};
AmCharts.polygon = function (a, b, c, d, e, f, g, h, k) {
    isNaN(f) && (f = 0);
    isNaN(h) && (h = e);
    var l = d, m = !1;
    "object" == typeof l && 1 < l.length && (m = !0, l = l[0]);
    void 0 === g && (g = l);
    e = {fill: l, stroke: g, "fill-opacity": e, "stroke-width": f, "stroke-opacity": h};
    f = AmCharts.dx;
    g = AmCharts.dy;
    h = Math.round;
    var l = "M" + (h(b[0]) + f) + "," + (h(c[0]) + g), n;
    for (n = 1; n < b.length; n++)l += " L" + (h(b[n]) + f) + "," + (h(c[n]) + g);
    a = a.path(l + " Z").attr(e);
    m && a.gradient("linearGradient", d, k);
    return a
};
AmCharts.rect = function (a, b, c, d, e, f, g, h, k, l) {
    isNaN(f) && (f = 0);
    void 0 === k && (k = 0);
    void 0 === l && (l = 270);
    isNaN(e) && (e = 0);
    var m = d, n = !1;
    "object" == typeof m && (m = m[0], n = !0);
    void 0 === g && (g = m);
    void 0 === h && (h = e);
    b = Math.round(b);
    c = Math.round(c);
    var s = 0, q = 0;
    0 > b && (b = Math.abs(b), s = -b);
    0 > c && (c = Math.abs(c), q = -c);
    s += AmCharts.dx;
    q += AmCharts.dy;
    e = {fill: m, stroke: g, "fill-opacity": e, "stroke-opacity": h};
    a = a.rect(s, q, b, c, k, f).attr(e);
    n && a.gradient("linearGradient", d, l);
    return a
};
AmCharts.triangle = function (a, b, c, d, e, f, g, h) {
    if (void 0 === f || 0 === f)f = 1;
    void 0 === g && (g = "#000");
    void 0 === h && (h = 0);
    d = {fill: d, stroke: g, "fill-opacity": e, "stroke-width": f, "stroke-opacity": h};
    b /= 2;
    var k;
    0 === c && (k = " M" + -b + "," + b + " L0," + -b + " L" + b + "," + b + " Z");
    180 == c && (k = " M" + -b + "," + -b + " L0," + b + " L" + b + "," + -b + " Z");
    90 == c && (k = " M" + -b + "," + -b + " L" + b + ",0 L" + -b + "," + b + " Z");
    270 == c && (k = " M" + -b + ",0 L" + b + "," + b + " L" + b + "," + -b + " Z");
    return a.path(k).attr(d)
};
AmCharts.line = function (a, b, c, d, e, f, g, h, k, l) {
    f = {fill: "none", "stroke-width": f};
    void 0 !== g && 0 < g && (f["stroke-dasharray"] = g);
    isNaN(e) || (f["stroke-opacity"] = e);
    d && (f.stroke = d);
    d = Math.round;
    l && (d = AmCharts.doNothing);
    l = AmCharts.dx;
    e = AmCharts.dy;
    g = "M" + (d(b[0]) + l) + "," + (d(c[0]) + e);
    for (h = 1; h < b.length; h++)g += " L" + (d(b[h]) + l) + "," + (d(c[h]) + e);
    if (AmCharts.VML)return a.path(g, void 0, !0).attr(f);
    k && (g += " M0,0 L0,0");
    return a.path(g).attr(f)
};
AmCharts.doNothing = function (a) {
    return a
};
AmCharts.wedge = function (a, b, c, d, e, f, g, h, k, l, m) {
    var n = Math.round;
    f = n(f);
    g = n(g);
    h = n(h);
    var s = n(g / f * h), q = AmCharts.VML, t = -359.5 - f / 100;
    -359.94 > t && (t = -359.94);
    e <= t && (e = t);
    var p = 1 / 180 * Math.PI, t = b + Math.cos(d * p) * h, r = c + Math.sin(-d * p) * s, u = b + Math.cos(d * p) * f, v = c + Math.sin(-d * p) * g, w = b + Math.cos((d + e) * p) * f, A = c + Math.sin((-d - e) * p) * g, x = b + Math.cos((d + e) * p) * h, p = c + Math.sin((-d - e) * p) * s, B = {
        fill: AmCharts.adjustLuminosity(l.fill, -0.2),
        "stroke-opacity": 0
    }, y = 0;
    180 < Math.abs(e) && (y = 1);
    d = a.set();
    var z;
    q && (t = n(10 * t), u = n(10 * u), w =
        n(10 * w), x = n(10 * x), r = n(10 * r), v = n(10 * v), A = n(10 * A), p = n(10 * p), b = n(10 * b), k = n(10 * k), c = n(10 * c), f *= 10, g *= 10, h *= 10, s *= 10, 1 > Math.abs(e) && (1 >= Math.abs(w - u) && 1 >= Math.abs(A - v)) && (z = !0));
    e = "";
    if (0 < k) {
        q ? (path = " M" + t + "," + (r + k) + " L" + u + "," + (v + k), z || (path += " A" + (b - f) + "," + (k + c - g) + "," + (b + f) + "," + (k + c + g) + "," + u + "," + (v + k) + "," + w + "," + (A + k)), path += " L" + x + "," + (p + k), 0 < h && (z || (path += " B" + (b - h) + "," + (k + c - s) + "," + (b + h) + "," + (k + c + s) + "," + x + "," + (k + p) + "," + t + "," + (k + r)))) : (path = " M" + t + "," + (r + k) + " L" + u + "," + (v + k), path += " A" + f + "," + g + ",0," + y +
            ",1," + w + "," + (A + k) + " L" + x + "," + (p + k), 0 < h && (path += " A" + h + "," + s + ",0," + y + ",0," + t + "," + (r + k)));
        path += " Z";
        var C = a.path(path, void 0, void 0, "1000,1000").attr(B);
        d.push(C);
        C = a.path(" M" + t + "," + r + " L" + t + "," + (r + k) + " L" + u + "," + (v + k) + " L" + u + "," + v + " L" + t + "," + r + " Z", void 0, void 0, "1000,1000").attr(B);
        k = a.path(" M" + w + "," + A + " L" + w + "," + (A + k) + " L" + x + "," + (p + k) + " L" + x + "," + p + " L" + w + "," + A + " Z", void 0, void 0, "1000,1000").attr(B);
        d.push(C);
        d.push(k)
    }
    q ? (z || (e = " A" + n(b - f) + "," + n(c - g) + "," + n(b + f) + "," + n(c + g) + "," + n(u) + "," + n(v) + "," +
        n(w) + "," + n(A)), f = " M" + n(t) + "," + n(r) + " L" + n(u) + "," + n(v) + e + " L" + n(x) + "," + n(p)) : f = " M" + t + "," + r + " L" + u + "," + v + (" A" + f + "," + g + ",0," + y + ",1," + w + "," + A) + " L" + x + "," + p;
    0 < h && (q ? z || (f += " B" + (b - h) + "," + (c - s) + "," + (b + h) + "," + (c + s) + "," + x + "," + p + "," + t + "," + r) : f += " A" + h + "," + s + ",0," + y + ",0," + t + "," + r);
    a = a.path(f + " Z", void 0, void 0, "1000,1000").attr(l);
    if (m) {
        b = [];
        for (c = 0; c < m.length; c++)b.push(AmCharts.adjustLuminosity(l.fill, m[c]));
        0 < b.length && a.gradient("linearGradient", b)
    }
    d.push(a);
    return d
};
AmCharts.adjustLuminosity = function (a, b) {
    a = String(a).replace(/[^0-9a-f]/gi, "");
    6 > a.length && (a = String(a[0]) + String(a[0]) + String(a[1]) + String(a[1]) + String(a[2]) + String(a[2]));
    b = b || 0;
    var c = "#", d, e;
    for (e = 0; 3 > e; e++)d = parseInt(a.substr(2 * e, 2), 16), d = Math.round(Math.min(Math.max(0, d + d * b), 255)).toString(16), c += ("00" + d).substr(d.length);
    return c
};
AmCharts.AmPieChart = AmCharts.Class({
    inherits: AmCharts.AmChart, construct: function () {
        this.createEvents("rollOverSlice", "rollOutSlice", "clickSlice", "pullOutSlice", "pullInSlice", "rightClickSlice");
        AmCharts.AmPieChart.base.construct.call(this);
        this.colors = "#FF0F00 #FF6600 #FF9E01 #FCD202 #F8FF01 #B0DE09 #04D215 #0D8ECF #0D52D1 #2A0CD0 #8A0CCF #CD0D74 #754DEB #DDDDDD #999999 #333333 #000000 #57032A #CA9726 #990000 #4B0C25".split(" ");
        this.pieAlpha = 1;
        this.pieBrightnessStep = 30;
        this.groupPercent = 0;
        this.groupedTitle =
            "Other";
        this.groupedPulled = !1;
        this.groupedAlpha = 1;
        this.marginLeft = 0;
        this.marginBottom = this.marginTop = 10;
        this.marginRight = 0;
        this.minRadius = 10;
        this.hoverAlpha = 1;
        this.depth3D = 0;
        this.startAngle = 90;
        this.angle = this.innerRadius = 0;
        this.outlineColor = "#FFFFFF";
        this.outlineAlpha = 0;
        this.outlineThickness = 1;
        this.startRadius = "500%";
        this.startDuration = this.startAlpha = 1;
        this.startEffect = "bounce";
        this.sequencedAnimation = !1;
        this.pullOutRadius = "20%";
        this.pullOutDuration = 1;
        this.pullOutEffect = "bounce";
        this.pullOnHover =
            this.pullOutOnlyOne = !1;
        this.labelsEnabled = !0;
        this.labelRadius = 30;
        this.labelTickColor = "#000000";
        this.labelTickAlpha = 0.2;
        this.labelText = "[[title]]: [[percents]]%";
        this.hideLabelsPercent = 0;
        this.balloonText = "[[title]]: [[percents]]% ([[value]])\n[[description]]";
        this.urlTarget = "_self";
        this.previousScale = 1;
        this.autoMarginOffset = 10;
        this.gradientRatio = []
    }, initChart: function () {
        AmCharts.AmPieChart.base.initChart.call(this);
        this.dataChanged && (this.parseData(), this.dispatchDataUpdated = !0, this.dataChanged = !1,
        this.legend && this.legend.setData(this.chartData));
        this.drawChart()
    }, handleLegendEvent: function (a) {
        var b = a.type;
        if (a = a.dataItem) {
            var c = a.hidden;
            switch (b) {
                case "clickMarker":
                    c || this.clickSlice(a);
                    break;
                case "clickLabel":
                    c || this.clickSlice(a);
                    break;
                case "rollOverItem":
                    c || this.rollOverSlice(a, !1);
                    break;
                case "rollOutItem":
                    c || this.rollOutSlice(a);
                    break;
                case "hideItem":
                    this.hideSlice(a);
                    break;
                case "showItem":
                    this.showSlice(a)
            }
        }
    }, invalidateVisibility: function () {
        this.recalculatePercents();
        this.initChart();
        var a = this.legend;
        a && a.invalidateSize()
    }, drawChart: function () {
        var a = this;
        AmCharts.AmPieChart.base.drawChart.call(a);
        var b = a.chartData;
        if (AmCharts.ifArray(b)) {
            if (0 < a.realWidth && 0 < a.realHeight) {
                AmCharts.VML && (a.startAlpha = 1);
                var c = a.startDuration, d = a.container, e = a.updateWidth();
                a.realWidth = e;
                var f = a.updateHeight();
                a.realHeight = f;
                var g = AmCharts.toCoordinate, h = g(a.marginLeft, e), k = g(a.marginRight, e), l = g(a.marginTop, f) + a.getTitleHeight(), m = g(a.marginBottom, f);
                a.chartDataLabels = [];
                a.ticks = [];
                var n, s, q, t =
                    AmCharts.toNumber(a.labelRadius), p = a.measureMaxLabel();
                a.labelText && a.labelsEnabled || (t = p = 0);
                n = void 0 === a.pieX ? (e - h - k) / 2 + h : g(a.pieX, a.realWidth);
                s = void 0 === a.pieY ? (f - l - m) / 2 + l : g(a.pieY, f);
                q = g(a.radius, e, f);
                a.pullOutRadiusReal = AmCharts.toCoordinate(a.pullOutRadius, q);
                q || (e = 0 <= t ? e - h - k - 2 * p : e - h - k, f = f - l - m, q = Math.min(e, f), f < e && (q /= 1 - a.angle / 90, q > e && (q = e)), a.pullOutRadiusReal = AmCharts.toCoordinate(a.pullOutRadius, q), q = 0 <= t ? q - 1.8 * (t + a.pullOutRadiusReal) : q - 1.8 * a.pullOutRadiusReal, q /= 2);
                q < a.minRadius && (q = a.minRadius);
                a.pullOutRadiusReal = g(a.pullOutRadius, q);
                g = g(a.innerRadius, q);
                g >= q && (g = q - 1);
                f = AmCharts.fitToBounds(a.startAngle, 0, 360);
                0 < a.depth3D && (f = 270 <= f ? 270 : 90);
                l = q - q * a.angle / 90;
                for (m = 0; m < b.length; m++)if (e = b[m], !0 !== e.hidden && 0 < e.percents) {
                    var k = 360 * -e.percents / 100, p = Math.cos((f + k / 2) / 180 * Math.PI), r = Math.sin((-f - k / 2) / 180 * Math.PI) * (l / q), h = {
                        fill: e.color,
                        stroke: a.outlineColor,
                        "stroke-width": a.outlineThickness,
                        "stroke-opacity": a.outlineAlpha
                    };
                    e.url && (h.cursor = "pointer");
                    h = AmCharts.wedge(d, n, s, f, k, q, l, g, a.depth3D,
                        h, a.gradientRatio);
                    a.addEventListeners(h, e);
                    e.startAngle = f;
                    b[m].wedge = h;
                    if (0 < c) {
                        var u = a.startAlpha;
                        a.chartCreated && (u = e.alpha);
                        h.setAttr("opacity", u)
                    }
                    e.ix = p;
                    e.iy = r;
                    e.wedge = h;
                    e.index = m;
                    if (a.labelsEnabled && a.labelText && e.percents >= a.hideLabelsPercent) {
                        var v = f + k / 2;
                        0 >= v && (v += 360);
                        k = t;
                        isNaN(e.labelRadius) || (k = e.labelRadius);
                        var p = n + p * (q + k), r = s + r * (q + k), w, u = 0;
                        if (0 <= k) {
                            var A;
                            90 >= v && 0 <= v ? (A = 0, w = "start", u = 8) : 360 >= v && 270 < v ? (A = 1, w = "start", u = 8) : 270 >= v && 180 < v ? (A = 2, w = "end", u = -8) : 180 >= v && 90 < v && (A = 3, w = "end", u = -8);
                            e.labelQuarter = A
                        } else w = "middle";
                        var v = a.formatString(a.labelText, e), x = e.labelColor;
                        void 0 == x && (x = a.color);
                        v = AmCharts.text(d, v, x, a.fontFamily, a.fontSize, w);
                        v.translate(p + 1.5 * u, r);
                        e.tx = p + 1.5 * u;
                        e.ty = r;
                        0 <= k ? h.push(v) : a.freeLabelsSet.push(v);
                        e.label = v;
                        a.chartDataLabels[m] = v;
                        e.tx = p;
                        e.tx2 = p + u
                    }
                    a.graphsSet.push(h);
                    (0 === e.alpha || 0 < c && !a.chartCreated) && h.hide();
                    f -= 360 * e.percents / 100;
                    0 >= f && (f += 360)
                }
                b = setTimeout(function () {
                    a.showLabels.call(a)
                }, 1E3 * c);
                a.timeOuts.push(b);
                0 < t && !a.labelRadiusField && a.arrangeLabels();
                a.pieXReal = n;
                a.pieYReal = s;
                a.radiusReal = q;
                a.innerRadiusReal = g;
                0 < t && a.drawTicks();
                a.chartCreated ? a.pullSlices(!0) : (c = setTimeout(function () {
                    a.pullSlices.call(a)
                }, 1200 * c), a.timeOuts.push(c));
                a.chartCreated || a.startSlices();
                a.setDepths()
            }
            (c = a.legend) && c.invalidateSize()
        } else a.cleanChart();
        a.dispDUpd();
        a.chartCreated = !0
    }, setDepths: function () {
        var a = this.chartData, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b], d = c.wedge, c = c.startAngle;
            90 >= c && 0 <= c || 360 >= c && 270 < c ? d.toFront() : (270 >= c && 180 < c || 180 >= c && 90 < c) && d.toBack()
        }
    },
    addEventListeners: function (a, b) {
        var c = this;
        a.mouseover(function () {
            c.rollOverSlice(b, !0)
        }).mouseout(function () {
            c.rollOutSlice(b)
        }).click(function () {
            c.clickSlice(b)
        }).contextmenu(function () {
            c.handleRightClick(b)
        })
    }, formatString: function (a, b) {
        a = AmCharts.formatValue(a, b, ["value"], this.numberFormatter, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
        a = AmCharts.formatValue(a, b, ["percents"], this.percentFormatter);
        a = AmCharts.massReplace(a, {
            "[[title]]": b.title, "[[description]]": b.description,
            "<br>": "\n"
        });
        a = AmCharts.fixNewLines(a);
        return a = AmCharts.cleanFromEmpty(a)
    }, drawTicks: function () {
        var a = this.chartData, b;
        for (b = 0; b < a.length; b++)if (this.chartDataLabels[b]) {
            var c = a[b], d = c.ty, e = this.radiusReal, d = AmCharts.line(this.container, [this.pieXReal + c.ix * e, c.tx, c.tx2], [this.pieYReal + c.iy * e, d, d], this.labelTickColor, this.labelTickAlpha);
            c.wedge.push(d);
            this.ticks[b] = d
        }
    }, arrangeLabels: function () {
        var a = this.chartData, b = a.length, c, d;
        for (d = b - 1; 0 <= d; d--)c = a[d], 0 !== c.labelQuarter || c.hidden || this.checkOverlapping(d,
            c, 0, !0, 0);
        for (d = 0; d < b; d++)c = a[d], 1 != c.labelQuarter || c.hidden || this.checkOverlapping(d, c, 1, !1, 0);
        for (d = b - 1; 0 <= d; d--)c = a[d], 2 != c.labelQuarter || c.hidden || this.checkOverlapping(d, c, 2, !0, 0);
        for (d = 0; d < b; d++)c = a[d], 3 != c.labelQuarter || c.hidden || this.checkOverlapping(d, c, 3, !1, 0)
    }, checkOverlapping: function (a, b, c, d, e) {
        var f, g, h = this.chartData, k = h.length, l = b.label;
        if (l) {
            if (!0 === d)for (g = a + 1; g < k; g++)(f = this.checkOverlappingReal(b, h[g], c)) && (g = k); else for (g = a - 1; 0 <= g; g--)(f = this.checkOverlappingReal(b, h[g], c)) &&
            (g = 0);
            !0 === f && 100 > e && (f = b.ty + 3 * b.iy, b.ty = f, l.translate(b.tx2, f), this.checkOverlapping(a, b, c, d, e + 1))
        }
    }, checkOverlappingReal: function (a, b, c) {
        var d = !1, e = a.label, f = b.label;
        a.labelQuarter != c || (a.hidden || b.hidden || !f) || (e = e.getBBox(), c = {}, c.width = e.width, c.height = e.height, c.y = a.ty, c.x = a.tx, a = f.getBBox(), f = {}, f.width = a.width, f.height = a.height, f.y = b.ty, f.x = b.tx, AmCharts.hitTest(c, f) && (d = !0));
        return d
    }, startSlices: function () {
        var a;
        for (a = 0; a < this.chartData.length; a++)0 < this.startDuration && this.sequencedAnimation ?
            this.setStartTO(a) : this.startSlice(this.chartData[a])
    }, setStartTO: function (a) {
        var b = this;
        a = setTimeout(function () {
            b.startSequenced.call(b)
        }, 500 * (b.startDuration / b.chartData.length) * a);
        b.timeOuts.push(a)
    }, pullSlices: function (a) {
        var b = this.chartData, c;
        for (c = 0; c < b.length; c++) {
            var d = b[c];
            d.pulled && this.pullSlice(d, 1, a)
        }
    }, startSequenced: function () {
        var a = this.chartData, b;
        for (b = 0; b < a.length; b++)if (!a[b].started) {
            this.startSlice(this.chartData[b]);
            break
        }
    }, startSlice: function (a) {
        a.started = !0;
        var b = a.wedge,
            c = this.startDuration;
        if (b && 0 < c) {
            0 < a.alpha && b.show();
            var d = AmCharts.toCoordinate(this.startRadius, this.radiusReal);
            b.translate(Math.round(a.ix * d), Math.round(a.iy * d));
            b.animate({opacity: a.alpha, translate: "0,0"}, c, this.startEffect)
        }
    }, showLabels: function () {
        var a = this.chartData, b;
        for (b = 0; b < a.length; b++)if (0 < a[b].alpha) {
            var c = this.chartDataLabels[b];
            c && c.show();
            (c = this.ticks[b]) && c.show()
        }
    }, showSlice: function (a) {
        isNaN(a) ? a.hidden = !1 : this.chartData[a].hidden = !1;
        this.hideBalloon();
        this.invalidateVisibility()
    },
    hideSlice: function (a) {
        isNaN(a) ? a.hidden = !0 : this.chartData[a].hidden = !0;
        this.hideBalloon();
        this.invalidateVisibility()
    }, rollOverSlice: function (a, b) {
        isNaN(a) || (a = this.chartData[a]);
        clearTimeout(this.hoverInt);
        this.pullOnHover && this.pullSlice(a, 1);
        var c = this.innerRadiusReal + (this.radiusReal - this.innerRadiusReal) / 2;
        a.pulled && (c += this.pullOutRadiusReal);
        1 > this.hoverAlpha && a.wedge && a.wedge.attr({opacity: this.hoverAlpha});
        var d = a.ix * c + this.pieXReal, c = a.iy * c + this.pieYReal, e = this.formatString(this.balloonText,
            a), f = AmCharts.adjustLuminosity(a.color, -0.15);
        this.showBalloon(e, f, b, d, c);
        d = {type: "rollOverSlice", dataItem: a, chart: this};
        this.fire(d.type, d)
    }, rollOutSlice: function (a) {
        isNaN(a) || (a = this.chartData[a]);
        a.wedge && a.wedge.attr({opacity: a.alpha});
        this.hideBalloon();
        a = {type: "rollOutSlice", dataItem: a, chart: this};
        this.fire(a.type, a)
    }, clickSlice: function (a) {
        isNaN(a) || (a = this.chartData[a]);
        this.hideBalloon();
        a.pulled ? this.pullSlice(a, 0) : this.pullSlice(a, 1);
        AmCharts.getURL(a.url, this.urlTarget);
        a = {
            type: "clickSlice",
            dataItem: a, chart: this
        };
        this.fire(a.type, a)
    }, handleRightClick: function (a) {
        isNaN(a) || (a = this.chartData[a]);
        a = {type: "rightClickSlice", dataItem: a, chart: this};
        this.fire(a.type, a)
    }, pullSlice: function (a, b, c) {
        var d = a.ix, e = a.iy, f = this.pullOutDuration;
        !0 === c && (f = 0);
        c = a.wedge;
        var g = this.pullOutRadiusReal;
        c && c.animate({translate: b * d * g + "," + b * e * g}, f, this.pullOutEffect);
        1 == b ? (a.pulled = !0, this.pullOutOnlyOne && this.pullInAll(a.index), a = {
            type: "pullOutSlice",
            dataItem: a,
            chart: this
        }) : (a.pulled = !1, a = {
            type: "pullInSlice",
            dataItem: a, chart: this
        });
        this.fire(a.type, a)
    }, pullInAll: function (a) {
        var b = this.chartData, c;
        for (c = 0; c < this.chartData.length; c++)c != a && b[c].pulled && this.pullSlice(b[c], 0)
    }, pullOutAll: function (a) {
        a = this.chartData;
        var b;
        for (b = 0; b < a.length; b++)a[b].pulled || this.pullSlice(a[b], 1)
    }, parseData: function () {
        var a = [];
        this.chartData = a;
        var b = this.dataProvider;
        if (void 0 !== b) {
            var c = b.length, d = 0, e, f, g;
            for (e = 0; e < c; e++) {
                f = {};
                var h = b[e];
                f.dataContext = h;
                f.value = Number(h[this.valueField]);
                (g = h[this.titleField]) || (g = "");
                f.title = g;
                f.pulled = AmCharts.toBoolean(h[this.pulledField], !1);
                (g = h[this.descriptionField]) || (g = "");
                f.description = g;
                f.labelRadius = Number(h[this.labelRadiusField]);
                f.url = h[this.urlField];
                f.visibleInLegend = AmCharts.toBoolean(h[this.visibleInLegendField], !0);
                g = h[this.alphaField];
                f.alpha = void 0 !== g ? Number(g) : this.pieAlpha;
                g = h[this.colorField];
                void 0 !== g && (f.color = AmCharts.toColor(g));
                f.labelColor = AmCharts.toColor(h[this.labelColorField]);
                d += f.value;
                f.hidden = !1;
                a[e] = f
            }
            for (e = b = 0; e < c; e++)f = a[e], f.percents =
                100 * (f.value / d), f.percents < this.groupPercent && b++;
            1 < b && (this.groupValue = 0, this.removeSmallSlices(), a.push({
                title: this.groupedTitle,
                value: this.groupValue,
                percents: 100 * (this.groupValue / d),
                pulled: this.groupedPulled,
                color: this.groupedColor,
                url: this.groupedUrl,
                description: this.groupedDescription,
                alpha: this.groupedAlpha
            }));
            for (e = 0; e < a.length; e++)this.pieBaseColor ? g = AmCharts.adjustLuminosity(this.pieBaseColor, e * this.pieBrightnessStep / 100) : (g = this.colors[e], void 0 === g && (g = AmCharts.randomColor())), void 0 ===
            a[e].color && (a[e].color = g);
            this.recalculatePercents()
        }
    }, recalculatePercents: function () {
        var a = this.chartData, b = 0, c, d;
        for (c = 0; c < a.length; c++)d = a[c], !d.hidden && 0 < d.value && (b += d.value);
        for (c = 0; c < a.length; c++)d = this.chartData[c], d.percents = !d.hidden && 0 < d.value ? 100 * d.value / b : 0
    }, removeSmallSlices: function () {
        var a = this.chartData, b;
        for (b = a.length - 1; 0 <= b; b--)a[b].percents < this.groupPercent && (this.groupValue += a[b].value, a.splice(b, 1))
    }, animateAgain: function () {
        var a = this;
        a.startSlices();
        var b = setTimeout(function () {
                a.pullSlices.call(a)
            },
            1200 * a.startDuration);
        a.timeOuts.push(b)
    }, measureMaxLabel: function () {
        var a = this.chartData, b = 0, c;
        for (c = 0; c < a.length; c++) {
            var d = this.formatString(this.labelText, a[c]), d = AmCharts.text(this.container, d, this.color, this.fontFamily, this.fontSize), e = d.getBBox().width;
            e > b && (b = e);
            d.remove()
        }
        return b
    }
});
AmCharts.AmXYChart = AmCharts.Class({
    inherits: AmCharts.AmRectangularChart, construct: function () {
        AmCharts.AmXYChart.base.construct.call(this);
        this.createEvents("zoomed");
        this.maxZoomFactor = 20;
        this.chartType = "xy"
    }, initChart: function () {
        AmCharts.AmXYChart.base.initChart.call(this);
        this.dataChanged && (this.updateData(), this.dataChanged = !1, this.dispatchDataUpdated = !0);
        this.updateScrollbar = !0;
        this.drawChart();
        this.autoMargins && !this.marginsUpdated && (this.marginsUpdated = !0, this.measureMargins());
        var a = this.marginLeftReal,
            b = this.marginTopReal, c = this.plotAreaWidth, d = this.plotAreaHeight;
        this.graphsSet.clipRect(a, b, c, d);
        this.bulletSet.clipRect(a, b, c, d);
        this.trendLinesSet.clipRect(a, b, c, d)
    }, createValueAxes: function () {
        var a = [], b = [];
        this.xAxes = a;
        this.yAxes = b;
        var c = this.valueAxes, d, e;
        for (e = 0; e < c.length; e++) {
            d = c[e];
            var f = d.position;
            if ("top" == f || "bottom" == f)d.rotate = !0;
            d.setOrientation(d.rotate);
            f = d.orientation;
            "V" == f && b.push(d);
            "H" == f && a.push(d)
        }
        0 === b.length && (d = new AmCharts.ValueAxis, d.rotate = !1, d.setOrientation(!1), c.push(d),
            b.push(d));
        0 === a.length && (d = new AmCharts.ValueAxis, d.rotate = !0, d.setOrientation(!0), c.push(d), a.push(d));
        for (e = 0; e < c.length; e++)this.processValueAxis(c[e], e);
        a = this.graphs;
        for (e = 0; e < a.length; e++)this.processGraph(a[e], e)
    }, drawChart: function () {
        AmCharts.AmXYChart.base.drawChart.call(this);
        AmCharts.ifArray(this.chartData) ? (this.chartScrollbar && this.updateScrollbars(), this.zoomChart()) : this.cleanChart();
        if (this.hideXScrollbar) {
            var a = this.scrollbarH;
            a && (this.removeListener(a, "zoomed", this.handleHSBZoom),
                a.destroy());
            this.scrollbarH = null
        }
        if (this.hideYScrollbar) {
            if (a = this.scrollbarV)this.removeListener(a, "zoomed", this.handleVSBZoom), a.destroy();
            this.scrollbarV = null
        }
        if (!this.autoMargins || this.marginsUpdated)this.dispDUpd(), this.chartCreated = !0, this.zoomScrollbars()
    }, cleanChart: function () {
        AmCharts.callMethod("destroy", [this.valueAxes, this.graphs, this.scrollbarV, this.scrollbarH, this.chartCursor])
    }, zoomChart: function () {
        this.toggleZoomOutButton();
        this.zoomObjects(this.valueAxes);
        this.zoomObjects(this.graphs);
        this.zoomTrendLines();
        this.dispatchAxisZoom()
    }, toggleZoomOutButton: function () {
        1 == this.heightMultiplier && 1 == this.widthMultiplier ? this.showZB(!1) : this.showZB(!0)
    }, dispatchAxisZoom: function () {
        var a = this.valueAxes, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            if (!isNaN(c.min) && !isNaN(c.max)) {
                var d, e;
                "V" == c.orientation ? (d = c.coordinateToValue(-this.verticalPosition), e = c.coordinateToValue(-this.verticalPosition + this.plotAreaHeight)) : (d = c.coordinateToValue(-this.horizontalPosition), e = c.coordinateToValue(-this.horizontalPosition +
                    this.plotAreaWidth));
                if (!isNaN(d) && !isNaN(e)) {
                    if (d > e) {
                        var f = e;
                        e = d;
                        d = f
                    }
                    c.dispatchZoomEvent(d, e)
                }
            }
        }
    }, zoomObjects: function (a) {
        var b = a.length, c;
        for (c = 0; c < b; c++) {
            var d = a[c];
            this.updateObjectSize(d);
            d.zoom(0, this.chartData.length - 1)
        }
    }, updateData: function () {
        this.parseData();
        var a = this.chartData, b = a.length - 1, c = this.graphs, d = this.dataProvider, e = 0, f, g;
        for (f = 0; f < c.length; f++)if (g = c[f], g.data = a, g.zoom(0, b), g = g.valueField) {
            var h;
            for (h = 0; h < d.length; h++) {
                var k = d[h][g];
                k > e && (e = k)
            }
        }
        for (f = 0; f < c.length; f++)g = c[f], g.maxValue =
            e;
        if (a = this.chartCursor)a.updateData(), a.type = "crosshair", a.valueBalloonsEnabled = !1
    }, zoomOut: function () {
        this.verticalPosition = this.horizontalPosition = 0;
        this.heightMultiplier = this.widthMultiplier = 1;
        this.zoomChart();
        this.zoomScrollbars()
    }, processValueAxis: function (a) {
        a.chart = this;
        a.minMaxField = "H" == a.orientation ? "x" : "y";
        a.minTemp = NaN;
        a.maxTemp = NaN;
        this.listenTo(a, "axisSelfZoomed", this.handleAxisSelfZoom)
    }, processGraph: function (a) {
        a.xAxis || (a.xAxis = this.xAxes[0]);
        a.yAxis || (a.yAxis = this.yAxes[0])
    }, parseData: function () {
        AmCharts.AmXYChart.base.parseData.call(this);
        this.chartData = [];
        var a = this.dataProvider, b = this.valueAxes, c = this.graphs, d;
        for (d = 0; d < a.length; d++) {
            var e = {axes: {}, x: {}, y: {}}, f = a[d], g;
            for (g = 0; g < b.length; g++) {
                var h = b[g].id;
                e.axes[h] = {};
                e.axes[h].graphs = {};
                var k;
                for (k = 0; k < c.length; k++) {
                    var l = c[k], m = l.id;
                    if (l.xAxis.id == h || l.yAxis.id == h) {
                        var n = {};
                        n.serialDataItem = e;
                        n.index = d;
                        var s = {}, q = Number(f[l.valueField]);
                        isNaN(q) || (s.value = q);
                        q = Number(f[l.xField]);
                        isNaN(q) || (s.x = q);
                        q = Number(f[l.yField]);
                        isNaN(q) || (s.y = q);
                        n.values = s;
                        this.processFields(l, n, f);
                        n.serialDataItem =
                            e;
                        n.graph = l;
                        e.axes[h].graphs[m] = n
                    }
                }
            }
            this.chartData[d] = e
        }
    }, formatString: function (a, b) {
        var c = b.graph.numberFormatter;
        c || (c = this.numberFormatter);
        a = AmCharts.formatValue(a, b.values, ["value", "x", "y"], c);
        -1 != a.indexOf("[[") && (a = AmCharts.formatDataContextValue(a, b.dataContext));
        return a = AmCharts.AmSerialChart.base.formatString.call(this, a, b)
    }, addChartScrollbar: function (a) {
        AmCharts.callMethod("destroy", [this.chartScrollbar, this.scrollbarH, this.scrollbarV]);
        if (a) {
            this.chartScrollbar = a;
            this.scrollbarHeight =
                a.scrollbarHeight;
            var b = "backgroundColor backgroundAlpha selectedBackgroundColor selectedBackgroundAlpha scrollDuration resizeEnabled hideResizeGrips scrollbarHeight updateOnReleaseOnly".split(" ");
            if (!this.hideYScrollbar) {
                var c = new AmCharts.SimpleChartScrollbar;
                c.skipEvent = !0;
                c.chart = this;
                this.listenTo(c, "zoomed", this.handleVSBZoom);
                AmCharts.copyProperties(a, c, b);
                c.rotate = !0;
                this.scrollbarV = c
            }
            this.hideXScrollbar || (c = new AmCharts.SimpleChartScrollbar, c.skipEvent = !0, c.chart = this, this.listenTo(c, "zoomed",
                this.handleHSBZoom), AmCharts.copyProperties(a, c, b), c.rotate = !1, this.scrollbarH = c)
        }
    }, updateTrendLines: function () {
        var a = this.trendLines, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.chart = this;
            c.valueAxis || (c.valueAxis = this.yAxes[0]);
            c.valueAxisX || (c.valueAxisX = this.xAxes[0])
        }
    }, updateMargins: function () {
        AmCharts.AmXYChart.base.updateMargins.call(this);
        var a = this.scrollbarV;
        a && (this.getScrollbarPosition(a, !0, this.yAxes[0].position), this.adjustMargins(a, !0));
        if (a = this.scrollbarH)this.getScrollbarPosition(a, !1,
            this.xAxes[0].position), this.adjustMargins(a, !1)
    }, updateScrollbars: function () {
        var a = this.scrollbarV;
        a && (this.updateChartScrollbar(a, !0), a.draw());
        if (a = this.scrollbarH)this.updateChartScrollbar(a, !1), a.draw()
    }, zoomScrollbars: function () {
        var a = this.scrollbarH;
        a && a.relativeZoom(this.widthMultiplier, -this.horizontalPosition / this.widthMultiplier);
        (a = this.scrollbarV) && a.relativeZoom(this.heightMultiplier, -this.verticalPosition / this.heightMultiplier)
    }, fitMultiplier: function (a) {
        a > this.maxZoomFactor && (a = this.maxZoomFactor);
        return a
    }, handleHSBZoom: function (a) {
        var b = this.fitMultiplier(a.multiplier);
        a = -a.position * b;
        var c = -(this.plotAreaWidth * b - this.plotAreaWidth);
        a < c && (a = c);
        this.widthMultiplier = b;
        this.horizontalPosition = a;
        this.zoomChart()
    }, handleVSBZoom: function (a) {
        var b = this.fitMultiplier(a.multiplier);
        a = -a.position * b;
        var c = -(this.plotAreaHeight * b - this.plotAreaHeight);
        a < c && (a = c);
        this.heightMultiplier = b;
        this.verticalPosition = a;
        this.zoomChart()
    }, handleAxisSelfZoom: function (a) {
        if ("H" == a.valueAxis.orientation) {
            var b = this.fitMultiplier(a.multiplier);
            a = -a.position * b;
            var c = -(this.plotAreaWidth * b - this.plotAreaWidth);
            a < c && (a = c);
            this.horizontalPosition = a;
            this.widthMultiplier = b
        } else b = this.fitMultiplier(a.multiplier), a = -a.position * b, c = -(this.plotAreaHeight * b - this.plotAreaHeight), a < c && (a = c), this.verticalPosition = a, this.heightMultiplier = b;
        this.zoomChart();
        this.zoomScrollbars()
    }, handleCursorZoom: function (a) {
        var b = this.widthMultiplier * this.plotAreaWidth / a.selectionWidth, c = this.heightMultiplier * this.plotAreaHeight / a.selectionHeight, b = this.fitMultiplier(b),
            c = this.fitMultiplier(c);
        this.horizontalPosition = (this.horizontalPosition - a.selectionX) * b / this.widthMultiplier;
        this.verticalPosition = (this.verticalPosition - a.selectionY) * c / this.heightMultiplier;
        this.widthMultiplier = b;
        this.heightMultiplier = c;
        this.zoomChart();
        this.zoomScrollbars()
    }, removeChartScrollbar: function () {
        AmCharts.callMethod("destroy", [this.scrollbarH, this.scrollbarV]);
        this.scrollbarV = this.scrollbarH = null
    }, handleReleaseOutside: function (a) {
        AmCharts.AmXYChart.base.handleReleaseOutside.call(this,
            a);
        AmCharts.callMethod("handleReleaseOutside", [this.scrollbarH, this.scrollbarV])
    }
});
AmCharts.AmStockChart = AmCharts.Class({
    construct: function () {
        this.version = "2.10.7";
        this.createEvents("zoomed", "rollOverStockEvent", "rollOutStockEvent", "clickStockEvent", "panelRemoved", "dataUpdated", "init", "rendered");
        this.colors = "#FF6600 #FCD202 #B0DE09 #0D8ECF #2A0CD0 #CD0D74 #CC0000 #00CC00 #0000CC #DDDDDD #999999 #333333 #990000".split(" ");
        this.firstDayOfWeek = 1;
        this.glueToTheEnd = !1;
        this.dataSetCounter = -1;
        this.zoomOutOnDataSetChange = !1;
        this.panels = [];
        this.dataSets = [];
        this.chartCursors = [];
        this.comparedDataSets =
            [];
        this.categoryAxesSettings = new AmCharts.CategoryAxesSettings;
        this.valueAxesSettings = new AmCharts.ValueAxesSettings;
        this.panelsSettings = new AmCharts.PanelsSettings;
        this.chartScrollbarSettings = new AmCharts.ChartScrollbarSettings;
        this.chartCursorSettings = new AmCharts.ChartCursorSettings;
        this.stockEventsSettings = new AmCharts.StockEventsSettings;
        this.legendSettings = new AmCharts.LegendSettings;
        this.balloon = new AmCharts.AmBalloon;
        this.previousEndDate = new Date(0);
        this.previousStartDate = new Date(0);
        this.dataSetCount =
            this.graphCount = 0;
        this.chartCreated = !1
    }, write: function (a) {
        this.chartRendered = !1;
        a = "object" != typeof a ? document.getElementById(a) : a;
        this.zoomOutOnDataSetChange && (this.endDate = this.startDate = void 0);
        a.innerHTML = "";
        this.div = a;
        this.measure();
        this.createLayout();
        this.updateDataSets();
        this.addDataSetSelector();
        this.addPeriodSelector();
        this.addPanels();
        this.addChartScrollbar();
        this.updatePanels();
        this.updateData();
        this.skipDefault || this.setDefaultPeriod()
    }, setDefaultPeriod: function (a) {
        var b = this.periodSelector;
        b && (this.animationPlayed = !1, b.setDefaultPeriod(a))
    }, validateSize: function () {
        var a, b = this.panels;
        this.measurePanels();
        for (a = 0; a < b.length; a++)panel = b[a], panel.invalidateSize()
    }, updateDataSets: function () {
        var a = this.dataSets;
        !this.mainDataSet && AmCharts.ifArray(a) && (this.mainDataSet = this.dataSets[0]);
        var b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.id || (this.dataSetCount++, c.id = "ds" + this.dataSetCount);
            void 0 === c.color && (c.color = this.colors.length - 1 > b ? this.colors[b] : AmCharts.randomColor())
        }
    }, updateEvents: function () {
        var a =
            this.mainDataSet;
        AmCharts.ifArray(a.stockEvents) && AmCharts.parseEvents(a, this.panels, this.stockEventsSettings, this.firstDayOfWeek, this)
    }, getLastDate: function (a) {
        return new Date(AmCharts.changeDate(new Date(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), a.getMilliseconds()), this.categoryAxesSettings.minPeriod, 1, !0).getTime() - 1)
    }, getFirstDate: function (a) {
        return new Date(AmCharts.resetDateToMin(new Date(a), this.categoryAxesSettings.minPeriod, 1, this.firstDayOfWeek))
    },
    updateData: function () {
        var a = this.mainDataSet;
        if (a) {
            var b = this.categoryAxesSettings;
            -1 == AmCharts.getItemIndex(b.minPeriod, b.groupToPeriods) && b.groupToPeriods.unshift(b.minPeriod);
            var c = a.dataProvider;
            if (AmCharts.ifArray(c)) {
                var d = a.categoryField;
                this.firstDate = this.getFirstDate(c[0][d]);
                this.lastDate = this.getLastDate(c[c.length - 1][d]);
                this.periodSelector && this.periodSelector.setRanges(this.firstDate, this.lastDate);
                a.dataParsed || (AmCharts.parseStockData(a, b.minPeriod, b.groupToPeriods, this.firstDayOfWeek),
                    a.dataParsed = !0);
                this.updateComparingData();
                this.updateEvents()
            } else this.lastDate = this.firstDate = void 0;
            this.glueToTheEnd && (this.startDate && this.endDate && this.lastDate) && (AmCharts.getPeriodDuration(b.minPeriod), this.startDate = new Date(this.startDate.getTime() + (this.lastDate.getTime() - this.endDate.getTime())), this.endDate = this.lastDate, this.updateScrollbar = !0);
            this.updatePanelsWithNewData()
        }
        a = {type: "dataUpdated", chart: this};
        this.fire(a.type, a)
    }, updateComparingData: function () {
        var a = this.comparedDataSets,
            b = this.categoryAxesSettings, c;
        for (c = 0; c < a.length; c++) {
            var d = a[c];
            d.dataParsed || (AmCharts.parseStockData(d, b.minPeriod, b.groupToPeriods, this.firstDayOfWeek), d.dataParsed = !0)
        }
    }, createLayout: function () {
        var a = this.div, b, c, d = this.periodSelector;
        d && (b = d.position);
        if (d = this.dataSetSelector)c = d.position;
        if ("left" == b || "left" == c)d = document.createElement("div"), d.style.cssFloat = "left", d.style.styleFloat = "left", d.style.width = "0px", d.style.position = "absolute", a.appendChild(d), this.leftContainer = d;
        if ("right" ==
            b || "right" == c)b = document.createElement("div"), b.style.cssFloat = "right", b.style.styleFloat = "right", b.style.width = "0px", a.appendChild(b), this.rightContainer = b;
        b = document.createElement("div");
        a.appendChild(b);
        this.centerContainer = b;
        a = document.createElement("div");
        b.appendChild(a);
        this.panelsContainer = a
    }, addPanels: function () {
        this.measurePanels();
        for (var a = this.panels, b = 0; b < a.length; b++)this.addStockPanel(a[b], b);
        this.panelsAdded = !0
    }, measurePanels: function () {
        this.measure();
        var a = this.chartScrollbarSettings,
            b = this.divRealHeight, c = this.panelsSettings.panelSpacing;
        a.enabled && (b -= a.height);
        (a = this.periodSelector) && !a.vertical && (a = a.offsetHeight, b -= a + c);
        (a = this.dataSetSelector) && !a.vertical && (a = a.offsetHeight, b -= a + c);
        a = this.panels;
        this.panelsContainer.style.height = b + "px";
        this.chartCursors = [];
        var d = 0, e, f;
        for (e = 0; e < a.length; e++) {
            f = a[e];
            var g = f.percentHeight;
            isNaN(g) && (g = 100 / a.length, f.percentHeight = g);
            d += g
        }
        this.panelsHeight = Math.max(b - c * (a.length - 1), 0);
        for (e = 0; e < a.length; e++)f = a[e], f.percentHeight = 100 * (f.percentHeight /
            d), f.panelBox && (f.panelBox.style.height = Math.round(f.percentHeight * this.panelsHeight / 100) + "px")
    }, addStockPanel: function (a, b) {
        var c = this.panelsSettings, d = document.createElement("div");
        d.className = "amChartsPanel";
        0 < b && !this.panels[b - 1].showCategoryAxis && (d.style.marginTop = c.panelSpacing + "px");
        a.panelBox = d;
        a.stockChart = this;
        a.id || (a.id = "stockPanel" + b);
        a.pathToImages = this.pathToImages;
        d.style.height = Math.round(a.percentHeight * this.panelsHeight / 100) + "px";
        d.style.width = "100%";
        this.panelsContainer.appendChild(d);
        0 < c.backgroundAlpha && (d.style.backgroundColor = c.backgroundColor);
        if (d = a.stockLegend)d.container = void 0, d.title = a.title, d.marginLeft = c.marginLeft, d.marginRight = c.marginRight, d.verticalGap = 3, d.position = "top", AmCharts.copyProperties(this.legendSettings, d), a.addLegend(d);
        a.zoomOutText = "";
        a.removeChartCursor();
        this.addCursor(a)
    }, enableCursors: function (a) {
        var b = this.chartCursors, c;
        for (c = 0; c < b.length; c++)b[c].enabled = a
    }, updatePanels: function () {
        var a = this.panels, b;
        for (b = 0; b < a.length; b++)this.updatePanel(a[b]);
        this.mainDataSet && this.updateGraphs();
        this.currentPeriod = void 0
    }, updatePanel: function (a) {
        a.seriesIdField = "amCategoryIdField";
        a.dataProvider = [];
        a.chartData = [];
        a.graphs = [];
        var b = a.categoryAxis, c = this.categoryAxesSettings;
        AmCharts.copyProperties(this.panelsSettings, a);
        AmCharts.copyProperties(c, b);
        b.parseDates = !0;
        a.zoomOutOnDataUpdate = !1;
        a.showCategoryAxis ? "top" == b.position ? a.marginTop = c.axisHeight : a.marginBottom = c.axisHeight : (a.categoryAxis.labelsEnabled = !1, a.chartCursor && (a.chartCursor.categoryBalloonEnabled = !1));
        var c = a.valueAxes, d = c.length, e;
        0 === d && (e = new AmCharts.ValueAxis, a.addValueAxis(e));
        b = new AmCharts.AmBalloon;
        AmCharts.copyProperties(this.balloon, b);
        a.balloon = b;
        c = a.valueAxes;
        d = c.length;
        for (b = 0; b < d; b++)e = c[b], AmCharts.copyProperties(this.valueAxesSettings, e);
        a.listenersAdded = !1;
        a.write(a.panelBox)
    }, zoom: function (a, b) {
        this.zoomChart(a, b)
    }, zoomOut: function () {
        this.zoomChart(this.firstDate, this.lastDate)
    }, updatePanelsWithNewData: function () {
        var a = this.mainDataSet;
        if (a) {
            var b = this.panels;
            this.currentPeriod = void 0;
            var c;
            for (c = 0; c < b.length; c++) {
                var d = b[c];
                d.categoryField = a.categoryField;
                0 === a.dataProvider.length && (d.dataProvider = [])
            }
            if (b = this.scrollbarChart) {
                c = this.categoryAxesSettings;
                d = c.minPeriod;
                b.categoryField = a.categoryField;
                if (0 < a.dataProvider.length) {
                    var e = this.chartScrollbarSettings.usePeriod;
                    b.dataProvider = e ? a.agregatedDataProviders[e] : a.agregatedDataProviders[d]
                } else b.dataProvider = [];
                e = b.categoryAxis;
                e.minPeriod = d;
                e.firstDayOfWeek = this.firstDayOfWeek;
                e.equalSpacing = c.equalSpacing;
                b.validateData()
            }
            0 <
            a.dataProvider.length && this.zoomChart(this.startDate, this.endDate)
        }
        this.panelDataInvalidated = !1
    }, addChartScrollbar: function () {
        var a = this.chartScrollbarSettings, b = this.scrollbarChart;
        b && (b.clear(), b.destroy());
        if (a.enabled) {
            var c = this.panelsSettings, d = this.categoryAxesSettings, b = new AmCharts.AmSerialChart;
            b.pathToImages = this.pathToImages;
            b.autoMargins = !1;
            this.scrollbarChart = b;
            b.id = "scrollbarChart";
            b.scrollbarOnly = !0;
            b.zoomOutText = "";
            b.panEventsEnabled = this.panelsSettings.panEventsEnabled;
            b.marginLeft =
                c.marginLeft;
            b.marginRight = c.marginRight;
            b.marginTop = 0;
            b.marginBottom = 0;
            var c = d.dateFormats, e = b.categoryAxis;
            e.boldPeriodBeginning = d.boldPeriodBeginning;
            c && (e.dateFormats = d.dateFormats);
            e.labelsEnabled = !1;
            e.parseDates = !0;
            var d = a.graph, f;
            d && (f = new AmCharts.AmGraph, f.valueField = d.valueField, f.periodValue = d.periodValue, f.type = d.type, f.connect = d.connect, b.addGraph(f));
            d = new AmCharts.ChartScrollbar;
            b.addChartScrollbar(d);
            AmCharts.copyProperties(a, d);
            d.scrollbarHeight = a.height;
            d.graph = f;
            this.removeListener(d,
                "zoomed", this.handleScrollbarZoom);
            this.listenTo(d, "zoomed", this.handleScrollbarZoom);
            f = document.createElement("div");
            f.style.height = a.height + "px";
            a = this.periodSelectorContainer;
            (d = this.periodSelector) ? "bottom" == d.position ? this.centerContainer.insertBefore(f, a) : this.centerContainer.appendChild(f) : this.centerContainer.appendChild(f);
            b.write(f)
        }
    }, handleScrollbarZoom: function (a) {
        if (this.skipScrollbarEvent)this.skipScrollbarEvent = !1; else {
            var b = a.endDate, c = {};
            c.startDate = a.startDate;
            c.endDate = b;
            this.updateScrollbar = !1;
            this.handleZoom(c)
        }
    }, addPeriodSelector: function () {
        var a = this.periodSelector;
        if (a) {
            var b = this.categoryAxesSettings.minPeriod;
            a.minDuration = AmCharts.getPeriodDuration(b);
            a.minPeriod = b;
            a.chart = this;
            var c = this.dataSetSelector, d, b = this.dssContainer;
            c && (d = c.position);
            var c = this.panelsSettings.panelSpacing, e = document.createElement("div");
            this.periodSelectorContainer = e;
            var f = this.leftContainer, g = this.rightContainer, h = this.centerContainer, k = this.panelsContainer, l = a.width + 2 * c + "px";
            switch (a.position) {
                case "left":
                    f.style.width =
                        a.width + "px";
                    f.appendChild(e);
                    h.style.paddingLeft = l;
                    break;
                case "right":
                    h.style.marginRight = l;
                    g.appendChild(e);
                    g.style.width = a.width + "px";
                    break;
                case "top":
                    k.style.clear = "both";
                    "top" == d ? h.insertAfter(e, b) : h.insertBefore(e, k);
                    e.style.paddingBottom = c + "px";
                    break;
                case "bottom":
                    e.style.marginTop = c + "px", "bottom" == d ? h.insertBefore(e, b) : h.appendChild(e)
            }
            this.removeListener(a, "changed", this.handlePeriodSelectorZoom);
            this.listenTo(a, "changed", this.handlePeriodSelectorZoom);
            a.write(e)
        }
    }, addDataSetSelector: function () {
        var a =
            this.dataSetSelector;
        if (a) {
            a.chart = this;
            a.dataProvider = this.dataSets;
            var b = a.position, c = this.panelsSettings.panelSpacing, d = document.createElement("div");
            this.dssContainer = d;
            var e = this.leftContainer, f = this.rightContainer, g = this.centerContainer, h = this.panelsContainer, c = a.width + 2 * c + "px";
            switch (b) {
                case "left":
                    e.style.width = a.width + "px";
                    e.appendChild(d);
                    g.style.paddingLeft = c;
                    break;
                case "right":
                    g.style.marginRight = c;
                    f.appendChild(d);
                    f.style.width = a.width + "px";
                    break;
                case "top":
                    h.style.clear = "both";
                    g.insertBefore(d,
                        h);
                    break;
                case "bottom":
                    g.appendChild(d)
            }
            a.write(d)
        }
    }, handlePeriodSelectorZoom: function (a) {
        var b = this.scrollbarChart;
        b && (b.updateScrollbar = !0);
        a.predefinedPeriod ? (this.predefinedStart = a.startDate, this.predefinedEnd = a.endDate) : this.predefinedEnd = this.predefinedStart = null;
        this.zoomChart(a.startDate, a.endDate)
    }, addCursor: function (a) {
        var b = this.chartCursorSettings;
        if (b.enabled) {
            var c = new AmCharts.ChartCursor;
            AmCharts.copyProperties(b, c);
            a.removeChartCursor();
            a.addChartCursor(c);
            this.removeListener(c, "changed",
                this.handleCursorChange);
            this.removeListener(c, "onHideCursor", this.hideChartCursor);
            this.removeListener(c, "zoomed", this.handleCursorZoom);
            this.listenTo(c, "changed", this.handleCursorChange);
            this.listenTo(c, "onHideCursor", this.hideChartCursor);
            this.listenTo(c, "zoomed", this.handleCursorZoom);
            this.chartCursors.push(c)
        }
    }, hideChartCursor: function () {
        var a = this.chartCursors, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.hideCursor(!1);
            (c = c.chart) && c.updateLegendValues()
        }
    }, handleCursorZoom: function (a) {
        var b = this.scrollbarChart;
        b && (b.updateScrollbar = !0);
        var b = {}, c;
        if (this.categoryAxesSettings.equalSpacing) {
            var d = this.mainDataSet.categoryField, e = this.mainDataSet.agregatedDataProviders[this.currentPeriod];
            c = new Date(e[a.start][d]);
            a = new Date(e[a.end][d])
        } else c = new Date(a.start), a = new Date(a.end);
        b.startDate = c;
        b.endDate = a;
        this.handleZoom(b)
    }, handleZoom: function (a) {
        this.zoomChart(a.startDate, a.endDate)
    }, zoomChart: function (a, b) {
        var c = this, d = c.firstDate, e = c.lastDate, f = c.currentPeriod, g = c.categoryAxesSettings, h = g.minPeriod, k =
            c.panelsSettings, l = c.periodSelector, m = c.panels, n = c.comparedGraphs, s = c.scrollbarChart, q = c.firstDayOfWeek;
        if (d && e) {
            a || (a = d);
            b || (b = e);
            if (f) {
                var t = AmCharts.extractPeriod(f);
                a.getTime() == b.getTime() && t != h && (b = AmCharts.changeDate(b, t.period, t.count), b.setTime(b.getTime() - 1))
            }
            a.getTime() < d.getTime() && (a = d);
            a.getTime() > e.getTime() && (a = e);
            b.getTime() < d.getTime() && (b = d);
            b.getTime() > e.getTime() && (b = e);
            g = AmCharts.getItemIndex(h, g.groupToPeriods);
            e = f;
            f = c.choosePeriod(g, a, b);
            c.currentPeriod = f;
            g = AmCharts.extractPeriod(f);
            AmCharts.getPeriodDuration(g.period, g.count);
            AmCharts.getPeriodDuration(h);
            1 > b.getTime() - a.getTime() && (a = new Date(b.getTime() - 1));
            h = new Date(a);
            h.getTime() == d.getTime() && (h = AmCharts.resetDateToMin(a, g.period, g.count, q));
            for (d = 0; d < m.length; d++) {
                t = m[d];
                if (f != e) {
                    var p;
                    for (p = 0; p < n.length; p++) {
                        var r = n[p].graph;
                        r.dataProvider = r.dataSet.agregatedDataProviders[f]
                    }
                    p = t.categoryAxis;
                    p.firstDayOfWeek = q;
                    p.minPeriod = f;
                    t.dataProvider = c.mainDataSet.agregatedDataProviders[f];
                    if (p = t.chartCursor)p.categoryBalloonDateFormat =
                        c.chartCursorSettings.categoryBalloonDateFormat(g.period), t.showCategoryAxis || (p.categoryBalloonEnabled = !1);
                    t.startTime = h.getTime();
                    t.endTime = b.getTime();
                    t.validateData(!0)
                }
                p = !1;
                t.chartCursor && t.chartCursor.panning && (p = !0);
                p || (t.startTime = void 0, t.endTime = void 0, t.zoomToDates(h, b));
                0 < k.startDuration && c.animationPlayed ? (t.startDuration = 0, t.animateAgain()) : 0 < k.startDuration && t.animateAgain()
            }
            c.animationPlayed = !0;
            AmCharts.extractPeriod(f);
            k = new Date(b);
            s && c.updateScrollbar && (s.zoomToDates(a, k), c.skipScrollbarEvent = !0, setTimeout(function () {
                c.resetSkip.call(c)
            }, 100));
            c.updateScrollbar = !0;
            c.startDate = a;
            c.endDate = b;
            l && l.zoom(a, b);
            if (a.getTime() != c.previousStartDate.getTime() || b.getTime() != c.previousEndDate.getTime())l = {type: "zoomed"}, l.startDate = a, l.endDate = b, l.chart = c, l.period = f, c.fire(l.type, l), c.previousStartDate = new Date(a), c.previousEndDate = new Date(b)
        }
        c.eventsHidden && c.showHideEvents(!1);
        c.chartCreated || (f = "init", c.fire(f, {type: f, chart: c}));
        c.chartRendered || (f = "rendered", c.fire(f, {type: f, chart: c}), c.chartRendered = !0);
        c.chartCreated = !0;
        c.animationPlayed = !0
    }, resetSkip: function () {
        this.skipScrollbarEvent = !1
    }, updateGraphs: function () {
        this.getSelections();
        if (0 < this.dataSets.length) {
            var a = this.panels;
            this.comparedGraphs = [];
            var b;
            for (b = 0; b < a.length; b++) {
                var c = a[b], d = c.valueAxes, e;
                for (e = 0; e < d.length; e++) {
                    var f = d[e];
                    f.prevLog && (f.logarithmic = f.prevLog);
                    f.recalculateToPercents = "always" == c.recalculateToPercents ? !0 : !1
                }
                d = this.mainDataSet;
                e = this.comparedDataSets;
                f = c.stockGraphs;
                c.graphs = [];
                var g;
                for (g = 0; g < f.length; g++) {
                    var h =
                        f[g];
                    if (!h.title || h.resetTitleOnDataSetChange)h.title = d.title, h.resetTitleOnDataSetChange = !0;
                    h.useDataSetColors && (h.lineColor = d.color, h.fillColors = void 0, h.bulletColor = void 0);
                    c.addGraph(h);
                    var k = !1;
                    "always" == c.recalculateToPercents && (k = !0);
                    var l = c.stockLegend, m, n;
                    l && (m = l.valueTextComparing, n = l.valueTextRegular);
                    if (h.comparable) {
                        var s = e.length;
                        0 < s && (h.valueAxis.logarithmic && "never" != c.recalculateToPercents) && (h.valueAxis.logarithmic = !1, h.valueAxis.prevLog = !0);
                        0 < s && "whenComparing" == c.recalculateToPercents &&
                        (h.valueAxis.recalculateToPercents = !0);
                        l && h.valueAxis && !0 === h.valueAxis.recalculateToPercents && (k = !0);
                        var q;
                        for (q = 0; q < s; q++) {
                            var t = e[q], p = h.comparedGraphs[t.id];
                            p || (p = new AmCharts.AmGraph, p.id = "comparedGraph" + q + "_" + t.id);
                            p.periodValue = h.periodValue;
                            p.dataSet = t;
                            h.comparedGraphs[t.id] = p;
                            p.seriesIdField = "amCategoryIdField";
                            p.connect = h.connect;
                            var r = h.compareField;
                            r || (r = h.valueField);
                            var u = !1, v = t.fieldMappings, w;
                            for (w = 0; w < v.length; w++)v[w].toField == r && (u = !0);
                            if (u) {
                                p.valueField = r;
                                p.title = t.title;
                                p.lineColor =
                                    t.color;
                                h.compareGraphType && (p.type = h.compareGraphType);
                                r = h.compareGraphLineThickness;
                                isNaN(r) || (p.lineThickness = r);
                                r = h.compareGraphDashLength;
                                isNaN(r) || (p.dashLength = r);
                                r = h.compareGraphLineAlpha;
                                isNaN(r) || (p.lineAlpha = r);
                                r = h.compareGraphCornerRadiusTop;
                                isNaN(r) || (p.cornerRadiusTop = r);
                                r = h.compareGraphCornerRadiusBottom;
                                isNaN(r) || (p.cornerRadiusBottom = r);
                                r = h.compareGraphBalloonColor;
                                isNaN(r) || (p.balloonColor = r);
                                if (r = h.compareGraphFillColors)p.fillColors = r;
                                if (r = h.compareGraphNegativeFillColors)p.negativeFillColors =
                                    r;
                                if (r = h.compareGraphFillAlphas)p.fillAlphas = r;
                                if (r = h.compareGraphNegativeFillAlphas)p.negativeFillAlphas = r;
                                if (r = h.compareGraphBullet)p.bullet = r;
                                if (r = h.compareGraphNumberFormatter)p.numberFormatter = r;
                                if (r = h.compareGraphBalloonText)p.balloonText = r;
                                r = h.compareGraphBulletSize;
                                isNaN(r) || (p.bulletSize = r);
                                r = h.compareGraphBulletAlpha;
                                isNaN(r) || (p.bulletAlpha = r);
                                p.visibleInLegend = h.compareGraphVisibleInLegend;
                                p.valueAxis = h.valueAxis;
                                l && (k && m ? p.legendValueText = m : n && (p.legendValueText = n));
                                c.addGraph(p);
                                this.comparedGraphs.push({
                                    graph: p,
                                    dataSet: t
                                })
                            }
                        }
                    }
                    l && (k && m ? h.legendValueText = m : n && (h.legendValueText = n))
                }
            }
        }
    }, choosePeriod: function (a, b, c) {
        var d = this.categoryAxesSettings, e = d.groupToPeriods, f = e[a], e = e[a + 1], g = AmCharts.extractPeriod(f), g = AmCharts.getPeriodDuration(g.period, g.count), h = b.getTime(), k = c.getTime(), d = d.maxSeries;
        return (k - h) / g > d && 0 < d && e ? this.choosePeriod(a + 1, b, c) : f
    }, handleCursorChange: function (a) {
        var b = a.target, c = a.position;
        a = a.zooming;
        var d = this.chartCursors, e;
        for (e = 0; e < d.length; e++) {
            var f = d[e];
            f != b && c && (f.isZooming(a), f.previousMousePosition =
                NaN, f.forceShow = !0, f.setPosition(c, !1))
        }
    }, getSelections: function () {
        var a = [], b = this.dataSets, c;
        for (c = 0; c < b.length; c++) {
            var d = b[c];
            d.compared && a.push(d)
        }
        this.comparedDataSets = a;
        b = this.panels;
        for (c = 0; c < b.length; c++)d = b[c], "never" != d.recalculateToPercents && 0 < a.length ? d.hideDrawingIcons(!0) : d.drawingIconsEnabled && d.hideDrawingIcons(!1)
    }, addPanel: function (a) {
        this.panels.push(a);
        AmCharts.removeChart(a);
        AmCharts.addChart(a)
    }, addPanelAt: function (a, b) {
        this.panels.splice(b, 0, a);
        AmCharts.removeChart(a);
        AmCharts.addChart(a)
    },
    removePanel: function (a) {
        var b = this.panels, c;
        for (c = b.length - 1; 0 <= c; c--)if (b[c] == a) {
            var d = {type: "panelRemoved", panel: a, chart: this};
            this.fire(d.type, d);
            b.splice(c, 1);
            a.destroy();
            a.clear()
        }
    }, validateData: function () {
        this.resetDataParsed();
        this.updateDataSets();
        this.mainDataSet.compared = !1;
        this.updateGraphs();
        this.updateData();
        var a = this.dataSetSelector;
        a && a.write(a.div)
    }, resetDataParsed: function () {
        var a = this.dataSets, b;
        for (b = 0; b < a.length; b++)a[b].dataParsed = !1
    }, validateNow: function () {
        this.skipDefault = !0;
        this.clear(!0);
        this.write(this.div)
    }, hideStockEvents: function () {
        this.showHideEvents(!1);
        this.eventsHidden = !0
    }, showStockEvents: function () {
        this.showHideEvents(!0);
        this.eventsHidden = !1
    }, showHideEvents: function (a) {
        var b = this.panels, c;
        for (c = 0; c < b.length; c++) {
            var d = b[c].graphs, e;
            for (e = 0; e < d.length; e++) {
                var f = d[e];
                !0 === a ? f.showBullets() : f.hideBullets()
            }
        }
    }, measure: function () {
        var a = this.div, b = a.offsetWidth, c = a.offsetHeight;
        a.clientHeight && (b = a.clientWidth, c = a.clientHeight);
        this.divRealWidth = b;
        this.divRealHeight =
            c
    }, clear: function (a) {
        var b = this.panels, c;
        if (b)for (c = 0; c < b.length; c++) {
            var d = b[c];
            a || (d.cleanChart(), d.destroy());
            d.clear(a)
        }
        (b = this.scrollbarChart) && b.clear();
        if (b = this.div)b.innerHTML = "";
        a || (this.div = null, AmCharts.deleteObject(this))
    }
});
AmCharts.StockEvent = AmCharts.Class({
    construct: function () {
    }
});
AmCharts.DataSet = AmCharts.Class({
    construct: function () {
        this.fieldMappings = [];
        this.dataProvider = [];
        this.agregatedDataProviders = [];
        this.stockEvents = [];
        this.compared = !1;
        this.showInCompare = this.showInSelect = !0
    }
});
AmCharts.PeriodSelector = AmCharts.Class({
    construct: function () {
        this.createEvents("changed");
        this.inputFieldsEnabled = !0;
        this.position = "bottom";
        this.width = 180;
        this.fromText = "From: ";
        this.toText = "to: ";
        this.periodsText = "Zoom: ";
        this.periods = [];
        this.inputFieldWidth = 100;
        this.dateFormat = "DD-MM-YYYY";
        this.hideOutOfScopePeriods = !0
    }, zoom: function (a, b) {
        this.inputFieldsEnabled && (this.startDateField.value = AmCharts.formatDate(a, this.dateFormat), this.endDateField.value = AmCharts.formatDate(b, this.dateFormat));
        this.markButtonAsSelected()
    },
    write: function (a) {
        var b = this;
        a.className = "amChartsPeriodSelector";
        b.div = a;
        a.innerHTML = "";
        var c = b.position, c = "top" == c || "bottom" == c ? !1 : !0;
        b.vertical = c;
        var d = 0, e = 0;
        if (b.inputFieldsEnabled) {
            var f = document.createElement("div");
            a.appendChild(f);
            var g = document.createTextNode(b.fromText);
            f.appendChild(g);
            c ? AmCharts.addBr(f) : (f.style.styleFloat = "left", f.style.display = "inline");
            var h = document.createElement("input");
            h.className = "amChartsInputField";
            h.style.textAlign = "center";
            h.onblur = function () {
                b.handleCalChange()
            };
            AmCharts.isNN && h.addEventListener("keypress", function (a) {
                b.handleCalendarChange.call(b, a)
            }, !0);
            AmCharts.isIE && h.attachEvent("onkeypress", function (a) {
                b.handleCalendarChange.call(b, a)
            });
            f.appendChild(h);
            b.startDateField = h;
            if (c)g = b.width - 6 + "px", AmCharts.addBr(f); else {
                var g = b.inputFieldWidth + "px", k = document.createTextNode(" ");
                f.appendChild(k)
            }
            h.style.width = g;
            h = document.createTextNode(b.toText);
            f.appendChild(h);
            c && AmCharts.addBr(f);
            h = document.createElement("input");
            h.className = "amChartsInputField";
            h.style.textAlign =
                "center";
            h.onblur = function () {
                b.handleCalChange()
            };
            AmCharts.isNN && h.addEventListener("keypress", function (a) {
                b.handleCalendarChange.call(b, a)
            }, !0);
            AmCharts.isIE && h.attachEvent("onkeypress", function (a) {
                b.handleCalendarChange.call(b, a)
            });
            f.appendChild(h);
            b.endDateField = h;
            c ? AmCharts.addBr(f) : d = h.offsetHeight + 2;
            g && (h.style.width = g)
        }
        f = b.periods;
        if (AmCharts.ifArray(f)) {
            g = document.createElement("div");
            c || (g.style.cssFloat = "right", g.style.styleFloat = "right", g.style.display = "inline");
            a.appendChild(g);
            c && AmCharts.addBr(g);
            a = document.createTextNode(b.periodsText);
            g.appendChild(a);
            b.periodContainer = g;
            var l;
            for (a = 0; a < f.length; a++)h = f[a], l = document.createElement("input"), l.type = "button", l.value = h.label, l.period = h.period, l.count = h.count, l.periodObj = h, l.className = "amChartsButton", c && (l.style.width = b.width - 1 + "px"), g.appendChild(l), b.addEventListeners(l), h.button = l;
            !c && l && (e = l.offsetHeight);
            b.offsetHeight = Math.max(d, e)
        }
    }, addEventListeners: function (a) {
        var b = this;
        AmCharts.isNN && a.addEventListener("click", function (a) {
            b.handlePeriodChange.call(b,
                a)
        }, !0);
        AmCharts.isIE && a.attachEvent("onclick", function (a) {
            b.handlePeriodChange.call(b, a)
        })
    }, getPeriodDates: function () {
        var a = this.periods, b;
        for (b = 0; b < a.length; b++)this.selectPeriodButton(a[b], !0)
    }, handleCalendarChange: function (a) {
        13 == a.keyCode && this.handleCalChange()
    }, handleCalChange: function () {
        var a = this.dateFormat, b = AmCharts.stringToDate(this.startDateField.value, a), a = this.chart.getLastDate(AmCharts.stringToDate(this.endDateField.value, a));
        try {
            this.startDateField.blur(), this.endDateField.blur()
        } catch (c) {
        }
        if (b &&
            a) {
            var d = {type: "changed"};
            d.startDate = b;
            d.endDate = a;
            d.chart = this.chart;
            this.fire(d.type, d)
        }
    }, handlePeriodChange: function (a) {
        this.selectPeriodButton((a.srcElement ? a.srcElement : a.target).periodObj)
    }, setRanges: function (a, b) {
        this.firstDate = a;
        this.lastDate = b;
        this.getPeriodDates()
    }, selectPeriodButton: function (a, b) {
        var c = a.button, d = c.count, e = c.period, f, g, h = this.firstDate, k = this.lastDate, l;
        h && k && ("MAX" == e ? (f = h, g = k) : "YTD" == e ? (f = new Date, f.setMonth(0, 1), f.setHours(0, 0, 0, 0), 0 === d && f.setDate(f.getDate() - 1), g =
            this.lastDate) : (l = AmCharts.getPeriodDuration(e, d), this.selectFromStart ? (f = h, g = new Date(h.getTime() + l)) : (f = new Date(k.getTime() - l), g = k)), a.startTime = f.getTime(), this.hideOutOfScopePeriods && (b && a.startTime < h.getTime() ? c.style.display = "none" : c.style.display = "inline"), f.getTime() > k.getTime() && (l = AmCharts.getPeriodDuration("DD", 1), f = new Date(k.getTime() - l)), f.getTime() < h.getTime() && (f = h), "YTD" == e && (a.startTime = f.getTime()), a.endTime = g.getTime(), b || (this.skipMark = !0, this.unselectButtons(), c.className = "amChartsButtonSelected",
            c = {type: "changed"}, c.startDate = f, c.endDate = g, c.predefinedPeriod = e, c.chart = this.chart, c.count = d, this.fire(c.type, c)))
    }, markButtonAsSelected: function () {
        if (!this.skipMark) {
            var a = this.chart, b = this.periods, c = a.startDate.getTime(), a = a.endDate.getTime();
            this.unselectButtons();
            var d;
            for (d = b.length - 1; 0 <= d; d--) {
                var e = b[d], f = e.button;
                e.startTime && e.endTime && (c == e.startTime && a == e.endTime) && (this.unselectButtons(), f.className = "amChartsButtonSelected")
            }
        }
        this.skipMark = !1
    }, unselectButtons: function () {
        var a = this.periods,
            b;
        for (b = a.length - 1; 0 <= b; b--)a[b].button.className = "amChartsButton"
    }, setDefaultPeriod: function () {
        var a = this.periods, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.selected && this.selectPeriodButton(c)
        }
    }
});
AmCharts.StockGraph = AmCharts.Class({
    inherits: AmCharts.AmGraph, construct: function () {
        AmCharts.StockGraph.base.construct.call(this);
        this.useDataSetColors = !0;
        this.periodValue = "Close";
        this.compareGraphType = "line";
        this.compareGraphVisibleInLegend = !0;
        this.comparedGraphs = {};
        this.comparable = this.resetTitleOnDataSetChange = !1;
        this.comparedGraphs = {}
    }
});
AmCharts.StockPanel = AmCharts.Class({
    inherits: AmCharts.AmSerialChart, construct: function () {
        AmCharts.StockPanel.base.construct.call(this);
        this.showCategoryAxis = !0;
        this.recalculateToPercents = "whenComparing";
        this.panelHeaderPaddingBottom = this.panelHeaderPaddingLeft = this.panelHeaderPaddingRight = this.panelHeaderPaddingTop = 0;
        this.trendLineAlpha = 1;
        this.trendLineColor = "#00CC00";
        this.trendLineColorHover = "#CC0000";
        this.trendLineThickness = 2;
        this.trendLineDashLength = 0;
        this.stockGraphs = [];
        this.drawingIconsEnabled = !1;
        this.iconSize = 18;
        this.autoMargins = this.allowTurningOff = this.eraseAll = this.erasingEnabled = this.drawingEnabled = !1
    }, initChart: function (a) {
        AmCharts.StockPanel.base.initChart.call(this, a);
        this.drawingIconsEnabled && this.createDrawIcons();
        if (a = this.chartCursor)this.removeListener(a, "draw", this.handleDraw), this.listenTo(a, "draw", this.handleDraw)
    }, addStockGraph: function (a) {
        this.stockGraphs.push(a);
        return a
    }, removeStockGraph: function (a) {
        var b = this.stockGraphs, c;
        for (c = b.length - 1; 0 <= c; c--)b[c] == a && b.splice(c,
            1)
    }, createDrawIcons: function () {
        var a = this, b = a.iconSize, c = a.container, d = a.pathToImages, e = a.realWidth - 2 * b - 1 - a.marginRight, f = AmCharts.rect(c, b, b, "#000", 0.005), g = AmCharts.rect(c, b, b, "#000", 0.005);
        g.translate(b + 1, 0);
        var h = c.image(d + "pencilIcon.gif", 0, 0, b, b);
        a.pencilButton = h;
        g.setAttr("cursor", "pointer");
        f.setAttr("cursor", "pointer");
        f.mouseup(function () {
            a.handlePencilClick()
        });
        var k = c.image(d + "pencilIconH.gif", 0, 0, b, b);
        a.pencilButtonPushed = k;
        a.drawingEnabled || k.hide();
        var l = c.image(d + "eraserIcon.gif",
            b + 1, 0, b, b);
        a.eraserButton = l;
        g.mouseup(function () {
            a.handleEraserClick()
        });
        f.touchend && (f.touchend(function () {
            a.handlePencilClick()
        }), g.touchend(function () {
            a.handleEraserClick()
        }));
        b = c.image(d + "eraserIconH.gif", b + 1, 0, b, b);
        a.eraserButtonPushed = b;
        a.erasingEnabled || b.hide();
        c = c.set([h, k, l, b, f, g]);
        c.translate(e, 1);
        this.hideIcons && c.hide()
    }, handlePencilClick: function () {
        var a = !this.drawingEnabled;
        this.disableDrawing(!a);
        this.erasingEnabled = !1;
        this.eraserButtonPushed.hide();
        a ? this.pencilButtonPushed.show() :
            (this.pencilButtonPushed.hide(), this.setMouseCursor("auto"))
    }, disableDrawing: function (a) {
        this.drawingEnabled = !a;
        var b = this.chartCursor;
        this.stockChart.enableCursors(a);
        b && b.enableDrawing(!a)
    }, handleEraserClick: function () {
        this.disableDrawing(!0);
        this.pencilButtonPushed.hide();
        if (this.eraseAll) {
            var a = this.trendLines, b;
            for (b = a.length - 1; 0 <= b; b--) {
                var c = a[b];
                c.isProtected || this.removeTrendLine(c)
            }
            this.validateNow()
        } else(this.erasingEnabled = a = !this.erasingEnabled) ? (this.eraserButtonPushed.show(), this.setTrendColorHover(this.trendLineColorHover),
            this.setMouseCursor("auto")) : (this.eraserButtonPushed.hide(), this.setTrendColorHover())
    }, setTrendColorHover: function (a) {
        var b = this.trendLines, c;
        for (c = b.length - 1; 0 <= c; c--) {
            var d = b[c];
            d.isProtected || (d.rollOverColor = a)
        }
    }, handleDraw: function (a) {
        var b = this.drawOnAxis;
        b || (b = this.valueAxes[0]);
        var c = this.categoryAxis, d = a.initialX, e = a.finalX, f = a.initialY;
        a = a.finalY;
        var g = new AmCharts.TrendLine;
        g.initialDate = c.coordinateToDate(d);
        g.finalDate = c.coordinateToDate(e);
        g.initialValue = b.coordinateToValue(f);
        g.finalValue =
            b.coordinateToValue(a);
        g.lineAlpha = this.trendLineAlpha;
        g.lineColor = this.trendLineColor;
        g.lineThickness = this.trendLineThickness;
        g.dashLength = this.trendLineDashLength;
        g.valueAxis = b;
        g.categoryAxis = c;
        this.addTrendLine(g);
        this.listenTo(g, "click", this.handleTrendClick);
        this.validateNow()
    }, hideDrawingIcons: function (a) {
        (this.hideIcons = a) && this.disableDrawing(a)
    }, handleTrendClick: function (a) {
        this.erasingEnabled && (a = a.trendLine, this.eraseAll || a.isProtected || this.removeTrendLine(a), this.validateNow())
    }
});
AmCharts.CategoryAxesSettings = AmCharts.Class({
    construct: function () {
        this.minPeriod = "DD";
        this.equalSpacing = !1;
        this.axisHeight = 28;
        this.tickLength = this.axisAlpha = 0;
        this.gridCount = 10;
        this.maxSeries = 150;
        this.groupToPeriods = "ss 10ss 30ss mm 10mm 30mm hh DD WW MM YYYY".split(" ");
        this.autoGridCount = !0
    }
});
AmCharts.ChartCursorSettings = AmCharts.Class({
    construct: function () {
        this.enabled = !0;
        this.bulletsEnabled = this.valueBalloonsEnabled = !1;
        this.categoryBalloonDateFormats = [{period: "YYYY", format: "YYYY"}, {
            period: "MM",
            format: "MMM, YYYY"
        }, {period: "WW", format: "MMM DD, YYYY"}, {period: "DD", format: "MMM DD, YYYY"}, {
            period: "hh",
            format: "JJ:NN"
        }, {period: "mm", format: "JJ:NN"}, {period: "ss", format: "JJ:NN:SS"}, {period: "fff", format: "JJ:NN:SS"}]
    }, categoryBalloonDateFormat: function (a) {
        var b = this.categoryBalloonDateFormats, c,
            d;
        for (d = 0; d < b.length; d++)b[d].period == a && (c = b[d].format);
        return c
    }
});
AmCharts.ChartScrollbarSettings = AmCharts.Class({
    construct: function () {
        this.height = 40;
        this.enabled = !0;
        this.color = "#FFFFFF";
        this.updateOnReleaseOnly = this.autoGridCount = !0;
        this.hideResizeGrips = !1
    }
});
AmCharts.LegendSettings = AmCharts.Class({
    construct: function () {
        this.marginBottom = this.marginTop = 0;
        this.usePositiveNegativeOnPercentsOnly = !0;
        this.positiveValueColor = "#00CC00";
        this.negativeValueColor = "#CC0000";
        this.autoMargins = this.equalWidths = this.textClickEnabled = !1
    }
});
AmCharts.PanelsSettings = AmCharts.Class({
    construct: function () {
        this.marginBottom = this.marginTop = this.marginRight = this.marginLeft = 0;
        this.backgroundColor = "#FFFFFF";
        this.backgroundAlpha = 0;
        this.panelSpacing = 8;
        this.panEventsEnabled = !1
    }
});
AmCharts.StockEventsSettings = AmCharts.Class({
    construct: function () {
        this.type = "sign";
        this.backgroundAlpha = 1;
        this.backgroundColor = "#DADADA";
        this.borderAlpha = 1;
        this.borderColor = "#888888";
        this.balloonColor = this.rollOverColor = "#CC0000"
    }
});
AmCharts.ValueAxesSettings = AmCharts.Class({
    construct: function () {
        this.tickLength = 0;
        this.showFirstLabel = this.autoGridCount = this.inside = !0;
        this.showLastLabel = !1;
        this.axisAlpha = 0
    }
});
AmCharts.getItemIndex = function (a, b) {
    var c = -1, d;
    for (d = 0; d < b.length; d++)a == b[d] && (c = d);
    return c
};
AmCharts.addBr = function (a) {
    a.appendChild(document.createElement("br"))
};
AmCharts.stringToDate = function (a, b) {
    var c = {}, d = [{pattern: "YYYY", period: "year"}, {pattern: "YY", period: "year"}, {
        pattern: "MM",
        period: "month"
    }, {pattern: "M", period: "month"}, {pattern: "DD", period: "date"}, {pattern: "D", period: "date"}, {
        pattern: "JJ",
        period: "hours"
    }, {pattern: "J", period: "hours"}, {pattern: "HH", period: "hours"}, {
        pattern: "H",
        period: "hours"
    }, {pattern: "KK", period: "hours"}, {pattern: "K", period: "hours"}, {
        pattern: "LL",
        period: "hours"
    }, {pattern: "L", period: "hours"}, {pattern: "NN", period: "minutes"}, {
        pattern: "N",
        period: "minutes"
    }, {pattern: "SS", period: "seconds"}, {pattern: "S", period: "seconds"}, {
        pattern: "QQQ",
        period: "milliseconds"
    }, {pattern: "QQ", period: "milliseconds"}, {pattern: "Q", period: "milliseconds"}], e = !0, f = b.indexOf("AA");
    -1 != f && (a.substr(f, 2), "pm" == a.toLowerCase && (e = !1));
    var f = b, g, h, k;
    for (k = 0; k < d.length; k++)h = d[k].period, c[h] = 0, "date" == h && (c[h] = 1);
    for (k = 0; k < d.length; k++)if (g = d[k].pattern, h = d[k].period, -1 != b.indexOf(g)) {
        var l = AmCharts.getFromDateString(g, a, f);
        b = b.replace(g, "");
        if ("KK" == g || "K" == g || "LL" ==
            g || "L" == g)e || (l += 12);
        c[h] = l
    }
    return new Date(c.year, c.month, c.date, c.hours, c.minutes, c.seconds, c.milliseconds)
};
AmCharts.getFromDateString = function (a, b, c) {
    c = c.indexOf(a);
    b = b.substr(c, a.length);
    "0" == b.charAt(0) && (b = b.substr(1, b.length - 1));
    b = Number(b);
    isNaN(b) && (b = 0);
    -1 != a.indexOf("M") && b--;
    return b
};
AmCharts.changeDate = function (a, b, c, d, e) {
    var f = -1;
    void 0 === d && (d = !0);
    void 0 === e && (e = !1);
    !0 === d && (f = 1);
    switch (b) {
        case "YYYY":
            a.setFullYear(a.getFullYear() + c * f);
            d || e || a.setDate(a.getDate() + 1);
            break;
        case "MM":
            a.setMonth(a.getMonth() + c * f);
            d || e || a.setDate(a.getDate() + 1);
            break;
        case "DD":
            a.setDate(a.getDate() + c * f);
            break;
        case "WW":
            a.setDate(a.getDate() + 7 * c * f + 1);
            break;
        case "hh":
            a.setHours(a.getHours() + c * f);
            break;
        case "mm":
            a.setMinutes(a.getMinutes() + c * f);
            break;
        case "ss":
            a.setSeconds(a.getSeconds() + c * f);
            break;
        case "fff":
            a.setMilliseconds(a.getMilliseconds() + c * f)
    }
    return a
};
AmCharts.parseStockData = function (a, b, c, d) {
    (new Date).getTime();
    var e = {}, f = a.dataProvider, g = a.categoryField;
    if (g) {
        var h = AmCharts.getItemIndex(b, c), k = c.length, l, m = f.length, n, s = {};
        for (l = h; l < k; l++)n = c[l], e[n] = [];
        var q = {}, t = a.fieldMappings, p = t.length;
        for (l = 0; l < m; l++) {
            var r = f[l], u = r[g], u = u instanceof Date ? "fff" == b ? AmCharts.useUTC ? new Date(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate(), u.getUTCHours(), u.getUTCMinutes(), u.getUTCSeconds(), u.getUTCMilliseconds()) : new Date(u.getFullYear(), u.getMonth(), u.getDate(),
                u.getHours(), u.getMinutes(), u.getSeconds(), u.getMilliseconds()) : new Date(u) : new Date(u), v = u.getTime(), w = {};
            for (n = 0; n < p; n++)w[t[n].toField] = r[t[n].fromField];
            var A;
            for (A = h; A < k; A++) {
                n = c[A];
                var x = AmCharts.extractPeriod(n), B = x.period, x = x.count;
                if (A == h || v >= s[n] || !s[n]) {
                    q[n] = {};
                    q[n][g] = new Date(u);
                    q[n].amCategoryIdField = String(AmCharts.resetDateToMin(u, B, x, d).getTime());
                    var y;
                    for (y = 0; y < p; y++) {
                        var z = q[n], C = t[y].toField, H = Number(w[C]);
                        z[C + "Count"] = 0;
                        z[C + "Sum"] = 0;
                        isNaN(H) || (z[C + "Open"] = H, z[C + "Sum"] = H, z[C +
                        "High"] = H, z[C + "Low"] = H, z[C + "Close"] = H, z[C + "Count"] = 1, z[C + "Average"] = H)
                    }
                    e[n].push(q[n]);
                    A > h && (z = new Date(u), z = AmCharts.changeDate(z, B, x, !0), z = AmCharts.resetDateToMin(z, B, x, d), s[n] = z.getTime());
                    if (A == h)for (var J in r)r.hasOwnProperty(J) && (q[n][J] = r[J])
                } else for (B = 0; B < p; B++)C = t[B].toField, z = q[n], l == m - 1 && (z[g] = new Date(u)), H = Number(w[C]), isNaN(H) || (isNaN(z[C + "Low"]) && (z[C + "Low"] = H), H < z[C + "Low"] && (z[C + "Low"] = H), isNaN(z[C + "High"]) && (z[C + "High"] = H), H > z[C + "High"] && (z[C + "High"] = H), z[C + "Close"] = H, z[C + "Sum"] +=
                    H, z[C + "Count"]++, z[C + "Average"] = z[C + "Sum"] / z[C + "Count"])
            }
        }
    }
    a.agregatedDataProviders = e
};
AmCharts.parseEvents = function (a, b, c, d, e) {
    var f = a.stockEvents, g = a.agregatedDataProviders, h = b.length, k, l, m, n, s, q, t;
    for (k = 0; k < h; k++)for (q = b[k], s = q.graphs, m = s.length, l = 0; l < m; l++)n = s[l], n.customBulletField = "amCustomBullet" + n.id + "_" + q.id, n.bulletConfigField = "amCustomBulletConfig" + n.id + "_" + q.id;
    for (var p in g)if (g.hasOwnProperty(p)) {
        var r = g[p], u = AmCharts.extractPeriod(p), v = r.length, w;
        for (w = 0; w < v; w++) {
            var A = r[w];
            k = A[a.categoryField];
            var x = k.getTime();
            l = u.period;
            m = u.count;
            var B;
            B = "fff" == l ? k.getTime() + 1 : AmCharts.resetDateToMin(AmCharts.changeDate(new Date(k),
                u.period, u.count), l, m, d).getTime();
            for (k = 0; k < h; k++)for (q = b[k], s = q.graphs, m = s.length, l = 0; l < m; l++) {
                n = s[l];
                var y = {};
                y.eventDispatcher = e;
                y.eventObjects = [];
                y.letters = [];
                y.descriptions = [];
                y.shapes = [];
                y.backgroundColors = [];
                y.backgroundAlphas = [];
                y.borderColors = [];
                y.borderAlphas = [];
                y.colors = [];
                y.rollOverColors = [];
                y.showOnAxis = [];
                for (t = 0; t < f.length; t++) {
                    var z = f[t], C = z.date.getTime();
                    n == z.graph && (C >= x && C < B) && (y.eventObjects.push(z), y.letters.push(z.text), y.descriptions.push(z.description), z.type ? y.shapes.push(z.type) :
                        y.shapes.push(c.type), void 0 !== z.backgroundColor ? y.backgroundColors.push(z.backgroundColor) : y.backgroundColors.push(c.backgroundColor), isNaN(z.backgroundAlpha) ? y.backgroundAlphas.push(c.backgroundAlpha) : y.backgroundAlphas.push(z.backgroundAlpha), isNaN(z.borderAlpha) ? y.borderAlphas.push(c.borderAlpha) : y.borderAlphas.push(z.borderAlpha), void 0 !== z.borderColor ? y.borderColors.push(z.borderColor) : y.borderColors.push(c.borderColor), void 0 !== z.rollOverColor ? y.rollOverColors.push(z.rollOverColor) : y.rollOverColors.push(c.rollOverColor),
                        y.colors.push(z.color), !z.panel && z.graph && (z.panel = z.graph.chart), y.showOnAxis.push(z.showOnAxis), y.date = new Date(z.date))
                }
                0 < y.shapes.length && (t = "amCustomBullet" + n.id + "_" + q.id, n = "amCustomBulletConfig" + n.id + "_" + q.id, A[t] = AmCharts.StackedBullet, A[n] = y)
            }
        }
    }
};
AmCharts.StockLegend = AmCharts.Class({
    inherits: AmCharts.AmLegend, construct: function () {
        AmCharts.StockLegend.base.construct.call(this);
        this.valueTextComparing = "[[percents.value]]%";
        this.valueTextRegular = "[[value]]"
    }, drawLegend: function () {
        var a = this;
        AmCharts.StockLegend.base.drawLegend.call(a);
        var b = a.chart;
        if (b.allowTurningOff) {
            var c = a.container, d = c.image(b.pathToImages + "xIcon.gif", b.realWidth - 17, 3, 17, 17), b = c.image(b.pathToImages + "xIconH.gif", b.realWidth - 17, 3, 17, 17);
            b.hide();
            a.xButtonHover = b;
            d.mouseup(function () {
                a.handleXClick()
            }).mouseover(function () {
                a.handleXOver()
            });
            b.mouseup(function () {
                a.handleXClick()
            }).mouseout(function () {
                a.handleXOut()
            })
        }
    }, handleXOver: function () {
        this.xButtonHover.show()
    }, handleXOut: function () {
        this.xButtonHover.hide()
    }, handleXClick: function () {
        var a = this.chart, b = a.stockChart;
        b.removePanel(a);
        b.validateNow()
    }
});
AmCharts.DataSetSelector = AmCharts.Class({
    construct: function () {
        this.createEvents("dataSetSelected", "dataSetCompared", "dataSetUncompared");
        this.position = "left";
        this.selectText = "Select:";
        this.comboBoxSelectText = "Select...";
        this.compareText = "Compare to:";
        this.width = 180;
        this.dataProvider = [];
        this.listHeight = 150;
        this.listCheckBoxSize = 14;
        this.rollOverBackgroundColor = "#b2e1ff";
        this.selectedBackgroundColor = "#7fceff"
    }, write: function (a) {
        var b = this, c;
        a.className = "amChartsDataSetSelector";
        b.div = a;
        a.innerHTML = "";
        var d = b.position, e;
        e = "top" == d || "bottom" == d ? !1 : !0;
        b.vertical = e;
        var f;
        e && (f = b.width + "px");
        var d = b.dataProvider, g, h;
        if (1 < b.countDataSets("showInSelect")) {
            c = document.createTextNode(b.selectText);
            a.appendChild(c);
            e && AmCharts.addBr(a);
            var k = document.createElement("select");
            f && (k.style.width = f);
            b.selectCB = k;
            a.appendChild(k);
            AmCharts.isNN && k.addEventListener("change", function (a) {
                b.handleDataSetChange.call(b, a)
            }, !0);
            AmCharts.isIE && k.attachEvent("onchange", function (a) {
                b.handleDataSetChange.call(b, a)
            });
            for (c =
                     0; c < d.length; c++)if (g = d[c], !0 === g.showInSelect) {
                h = document.createElement("option");
                h.text = g.title;
                h.value = c;
                g == b.chart.mainDataSet && (h.selected = !0);
                try {
                    k.add(h, null)
                } catch (l) {
                    k.add(h)
                }
            }
            b.offsetHeight = k.offsetHeight
        }
        if (0 < b.countDataSets("showInCompare") && 1 < d.length)if (e ? (AmCharts.addBr(a), AmCharts.addBr(a)) : (c = document.createTextNode(" "), a.appendChild(c)), c = document.createTextNode(b.compareText), a.appendChild(c), h = b.listCheckBoxSize, e) {
            AmCharts.addBr(a);
            f = document.createElement("div");
            a.appendChild(f);
            f.className = "amChartsCompareList";
            f.style.overflow = "auto";
            f.style.overflowX = "hidden";
            f.style.width = b.width - 2 + "px";
            f.style.maxHeight = b.listHeight + "px";
            for (c = 0; c < d.length; c++)g = d[c], !0 === g.showInCompare && g != b.chart.mainDataSet && (e = document.createElement("div"), e.style.padding = "4px", e.style.position = "relative", e.name = "amCBContainer", e.dataSet = g, e.style.height = h + "px", g.compared && (e.style.backgroundColor = b.selectedBackgroundColor), f.appendChild(e), k = document.createElement("div"), k.style.width = h + "px", k.style.height =
                h + "px", k.style.position = "absolute", k.style.backgroundColor = g.color, e.appendChild(k), k = document.createElement("div"), k.style.width = "100%", k.style.position = "absolute", k.style.left = h + 10 + "px", e.appendChild(k), g = document.createTextNode(g.title), k.style.whiteSpace = "nowrap", k.style.cursor = "default", k.appendChild(g), b.addEventListeners(e));
            AmCharts.addBr(a);
            AmCharts.addBr(a)
        } else {
            e = document.createElement("select");
            b.compareCB = e;
            f && (e.style.width = f);
            a.appendChild(e);
            AmCharts.isNN && e.addEventListener("change",
                function (a) {
                    b.handleCBSelect.call(b, a)
                }, !0);
            AmCharts.isIE && e.attachEvent("onchange", function (a) {
                b.handleCBSelect.call(b, a)
            });
            h = document.createElement("option");
            h.text = b.comboBoxSelectText;
            try {
                e.add(h, null)
            } catch (m) {
                e.add(h)
            }
            for (c = 0; c < d.length; c++)if (g = d[c], !0 === g.showInCompare && g != b.chart.mainDataSet) {
                h = document.createElement("option");
                h.text = g.title;
                h.value = c;
                g.compared && (h.selected = !0);
                try {
                    e.add(h, null)
                } catch (n) {
                    e.add(h)
                }
            }
            b.offsetHeight = e.offsetHeight
        }
    }, addEventListeners: function (a) {
        var b = this;
        AmCharts.isNN && (a.addEventListener("mouseover", function (a) {
            b.handleRollOver.call(b, a)
        }, !0), a.addEventListener("mouseout", function (a) {
            b.handleRollOut.call(b, a)
        }, !0), a.addEventListener("click", function (a) {
            b.handleClick.call(b, a)
        }, !0));
        AmCharts.isIE && (a.attachEvent("onmouseout", function (a) {
            b.handleRollOut.call(b, a)
        }), a.attachEvent("onmouseover", function (a) {
            b.handleRollOver.call(b, a)
        }), a.attachEvent("onclick", function (a) {
            b.handleClick.call(b, a)
        }))
    }, handleDataSetChange: function () {
        var a = this.selectCB, a =
            this.dataProvider[a.options[a.selectedIndex].value], b = this.chart;
        b.mainDataSet = a;
        b.zoomOutOnDataSetChange && (b.startDate = void 0, b.endDate = void 0);
        b.validateData();
        a = {type: "dataSetSelected", dataSet: a, chart: this.chart};
        this.fire(a.type, a)
    }, handleRollOver: function (a) {
        a = this.getRealDiv(a);
        a.dataSet.compared || (a.style.backgroundColor = this.rollOverBackgroundColor)
    }, handleRollOut: function (a) {
        a = this.getRealDiv(a);
        a.dataSet.compared || (a.style.removeProperty && a.style.removeProperty("background-color"), a.style.removeAttribute &&
        a.style.removeAttribute("backgroundColor"))
    }, handleCBSelect: function (a) {
        var b = this.compareCB, c = this.dataProvider, d, e;
        for (d = 0; d < c.length; d++)e = c[d], e.compared && (a = {
            type: "dataSetUncompared",
            dataSet: e
        }), e.compared = !1;
        c = b.selectedIndex;
        0 < c && (e = this.dataProvider[b.options[c].value], e.compared || (a = {
            type: "dataSetCompared",
            dataSet: e
        }), e.compared = !0);
        b = this.chart;
        b.validateData();
        a.chart = b;
        this.fire(a.type, a)
    }, handleClick: function (a) {
        a = this.getRealDiv(a).dataSet;
        !0 === a.compared ? (a.compared = !1, a = {
            type: "dataSetUncompared",
            dataSet: a
        }) : (a.compared = !0, a = {type: "dataSetCompared", dataSet: a});
        var b = this.chart;
        b.validateData();
        a.chart = b;
        this.fire(a.type, a)
    }, getRealDiv: function (a) {
        a || (a = window.event);
        a = a.currentTarget ? a.currentTarget : a.srcElement;
        "amCBContainer" == a.parentNode.name && (a = a.parentNode);
        return a
    }, countDataSets: function (a) {
        var b = this.dataProvider, c = 0, d;
        for (d = 0; d < b.length; d++)!0 === b[d][a] && c++;
        return c
    }
});
AmCharts.StackedBullet = AmCharts.Class({
    construct: function () {
        this.fontSize = 11;
        this.stackDown = !1;
        this.mastHeight = 8;
        this.shapes = [];
        this.backgroundColors = [];
        this.backgroundAlphas = [];
        this.borderAlphas = [];
        this.borderColors = [];
        this.colors = [];
        this.rollOverColors = [];
        this.showOnAxiss = [];
        this.textColor = "#000000";
        this.nextY = 0;
        this.size = 16
    }, parseConfig: function () {
        var a = this.bulletConfig;
        this.eventObjects = a.eventObjects;
        this.letters = a.letters;
        this.shapes = a.shapes;
        this.backgroundColors = a.backgroundColors;
        this.backgroundAlphas =
            a.backgroundAlphas;
        this.borderColors = a.borderColors;
        this.borderAlphas = a.borderAlphas;
        this.colors = a.colors;
        this.rollOverColors = a.rollOverColors;
        this.date = a.date;
        this.showOnAxiss = a.showOnAxis;
        this.axisCoordinate = a.minCoord
    }, write: function (a) {
        this.parseConfig();
        this.container = a;
        this.bullets = [];
        if (this.graph) {
            var b = this.graph.fontSize;
            b && (this.fontSize = b)
        }
        b = this.letters.length;
        (this.mastHeight + 2 * (this.fontSize / 2 + 2)) * b > this.availableSpace && (this.stackDown = !0);
        this.set = a.set();
        a = 0;
        var c;
        for (c = 0; c < b; c++)this.shape =
            this.shapes[c], this.backgroundColor = this.backgroundColors[c], this.backgroundAlpha = this.backgroundAlphas[c], this.borderAlpha = this.borderAlphas[c], this.borderColor = this.borderColors[c], this.rollOverColor = this.rollOverColors[c], this.showOnAxis = this.showOnAxiss[c], this.color = this.colors[c], this.addLetter(this.letters[c], a, c), this.showOnAxis || a++
    }, addLetter: function (a, b, c) {
        var d = this.container;
        b = d.set();
        var e = -1, f = this.stackDown;
        this.showOnAxis && (this.stackDown = this.graph.valueAxis.reversed ? !0 : !1);
        this.stackDown &&
        (e = 1);
        var g = 0, h = 0, k = 0, l, k = this.fontSize, m = this.mastHeight, n = this.shape, s = this.textColor;
        void 0 !== this.color && (s = this.color);
        void 0 === a && (a = "");
        a = AmCharts.text(d, a, s, this.chart.fontFamily, this.fontSize);
        d = a.getBBox();
        this.labelWidth = s = d.width;
        this.labelHeight = d.height;
        d = 0;
        switch (n) {
            case "sign":
                l = this.drawSign(b);
                g = m + 4 + k / 2;
                d = m + k + 4;
                1 == e && (g -= 4);
                break;
            case "flag":
                l = this.drawFlag(b);
                h = s / 2 + 3;
                g = m + 4 + k / 2;
                d = m + k + 4;
                1 == e && (g -= 4);
                break;
            case "pin":
                l = this.drawPin(b);
                g = 6 + k / 2;
                d = k + 8;
                break;
            case "triangleUp":
                l = this.drawTriangleUp(b);
                g = -k - 1;
                d = k + 4;
                e = -1;
                break;
            case "triangleDown":
                l = this.drawTriangleDown(b);
                g = k + 1;
                d = k + 4;
                e = -1;
                break;
            case "triangleLeft":
                l = this.drawTriangleLeft(b);
                h = k;
                d = k + 4;
                e = -1;
                break;
            case "triangleRight":
                l = this.drawTriangleRight(b);
                h = -k;
                e = -1;
                d = k + 4;
                break;
            case "arrowUp":
                l = this.drawArrowUp(b);
                a.hide();
                break;
            case "arrowDown":
                l = this.drawArrowDown(b);
                a.hide();
                d = k + 4;
                break;
            case "text":
                e = -1;
                l = this.drawTextBackground(b, a);
                g = this.labelHeight + 3;
                d = k + 10;
                break;
            case "round":
                l = this.drawCircle(b)
        }
        this.bullets[c] = l;
        this.showOnAxis ? (l = isNaN(this.nextAxisY) ?
            this.axisCoordinate : this.nextY, k = g * e, this.nextAxisY = l + e * d) : (l = this.nextY, k = g * e);
        a.translate(h, k);
        b.push(a);
        b.translate(0, l);
        this.addEventListeners(b, c);
        this.nextY = l + e * d;
        this.stackDown = f
    }, addEventListeners: function (a, b) {
        var c = this;
        a.click(function () {
            c.handleClick(b)
        }).mouseover(function () {
            c.handleMouseOver(b)
        }).touchend(function () {
            c.handleMouseOver(b, !0)
        }).mouseout(function () {
            c.handleMouseOut(b)
        })
    }, drawPin: function (a) {
        var b = -1;
        this.stackDown && (b = 1);
        var c = this.fontSize + 4;
        return this.drawRealPolygon(a,
            [0, c / 2, c / 2, -c / 2, -c / 2, 0], [0, b * c / 4, b * (c + c / 4), b * (c + c / 4), b * c / 4, 0])
    }, drawSign: function (a) {
        var b = -1;
        this.stackDown && (b = 1);
        var c = this.mastHeight * b, d = this.fontSize / 2 + 2, e = AmCharts.line(this.container, [0, 0], [0, c], this.borderColor, this.borderAlpha, 1), f = AmCharts.circle(this.container, d, this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        f.translate(0, c + d * b);
        a.push(e);
        a.push(f);
        this.set.push(a);
        return f
    }, drawFlag: function (a) {
        var b = -1;
        this.stackDown && (b = 1);
        var c = this.fontSize + 4, d = this.labelWidth +
            6, e = this.mastHeight, b = 1 == b ? b * e : b * e - c, e = AmCharts.line(this.container, [0, 0], [0, b], this.borderColor, this.borderAlpha, 1), c = AmCharts.polygon(this.container, [0, d, d, 0], [0, 0, c, c], this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        c.translate(0, b);
        a.push(e);
        a.push(c);
        this.set.push(a);
        return c
    }, drawTriangleUp: function (a) {
        var b = this.fontSize + 7;
        return this.drawRealPolygon(a, [0, b / 2, -b / 2, 0], [0, b, b, 0])
    }, drawArrowUp: function (a) {
        var b = this.size, c = b / 2, d = b / 4;
        return this.drawRealPolygon(a,
            [0, c, d, d, -d, -d, -c, 0], [0, c, c, b, b, c, c, 0])
    }, drawArrowDown: function (a) {
        var b = this.size, c = b / 2, d = b / 4;
        return this.drawRealPolygon(a, [0, c, d, d, -d, -d, -c, 0], [0, -c, -c, -b, -b, -c, -c, 0])
    }, drawTriangleDown: function (a) {
        var b = this.fontSize + 7;
        return this.drawRealPolygon(a, [0, b / 2, -b / 2, 0], [0, -b, -b, 0])
    }, drawTriangleLeft: function (a) {
        var b = this.fontSize + 7;
        return this.drawRealPolygon(a, [0, b, b, 0], [0, -b / 2, b / 2])
    }, drawTriangleRight: function (a) {
        var b = this.fontSize + 7;
        return this.drawRealPolygon(a, [0, -b, -b, 0], [0, -b / 2, b / 2, 0])
    }, drawRealPolygon: function (a,
                                  b, c) {
        b = AmCharts.polygon(this.container, b, c, this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        a.push(b);
        this.set.push(a);
        return b
    }, drawCircle: function (a) {
        shape = AmCharts.circle(this.container, this.fontSize / 2, this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        a.push(shape);
        this.set.push(a);
        return shape
    }, drawTextBackground: function (a, b) {
        var c = b.getBBox(), d = -c.width / 2 - 5, e = c.width / 2 + 5, c = -c.height - 12;
        return this.drawRealPolygon(a, [d, -5, 0, 5, e, e, d, d],
            [-5, -5, 0, -5, -5, c, c, -5])
    }, handleMouseOver: function (a, b) {
        b || this.bullets[a].attr({fill: this.rollOverColors[a]});
        var c = this.eventObjects[a], d = {
            type: "rollOverStockEvent",
            eventObject: c,
            graph: this.graph,
            date: this.date
        }, e = this.bulletConfig.eventDispatcher;
        d.chart = e;
        e.fire(d.type, d);
        c.url && this.bullets[a].setAttr("cursor", "pointer");
        this.chart.showBalloon(c.description, e.stockEventsSettings.balloonColor, !0)
    }, handleClick: function (a) {
        a = this.eventObjects[a];
        var b = {
            type: "clickStockEvent", eventObject: a, graph: this.graph,
            date: this.date
        }, c = this.bulletConfig.eventDispatcher;
        b.chart = c;
        c.fire(b.type, b);
        b = a.urlTarget;
        b || (b = c.stockEventsSettings.urlTarget);
        AmCharts.getURL(a.url, b)
    }, handleMouseOut: function (a) {
        this.bullets[a].attr({fill: this.backgroundColors[a]});
        a = {type: "rollOutStockEvent", eventObject: this.eventObjects[a], graph: this.graph, date: this.date};
        var b = this.bulletConfig.eventDispatcher;
        a.chart = b;
        b.fire(a.type, a)
    }
});
AmCharts.AmDraw = AmCharts.Class({
    construct: function (a, b, c) {
        AmCharts.SVG_NS = "http://www.w3.org/2000/svg";
        AmCharts.SVG_XLINK = "http://www.w3.org/1999/xlink";
        AmCharts.hasSVG = !!document.createElementNS && !!document.createElementNS(AmCharts.SVG_NS, "svg").createSVGRect;
        1 > b && (b = 10);
        1 > c && (c = 10);
        this.div = a;
        this.width = b;
        this.height = c;
        this.rBin = document.createElement("div");
        if (AmCharts.hasSVG) {
            AmCharts.SVG = !0;
            var d = this.createSvgElement("svg");
            d.style.position = "absolute";
            d.style.width = b + "px";
            d.style.height = c + "px";
            AmCharts.rtl && (d.setAttribute("direction", "rtl"), d.style.left = "auto", d.style.right = "0px");
            d.setAttribute("version", "1.1");
            a.appendChild(d);
            this.container = d;
            this.R = new AmCharts.SVGRenderer(this)
        } else AmCharts.isIE && AmCharts.VMLRenderer && (AmCharts.VML = !0, AmCharts.vmlStyleSheet || (document.namespaces.add("amvml", "urn:schemas-microsoft-com:vml"), b = document.createStyleSheet(), b.addRule(".amvml", "behavior:url(#default#VML); display:inline-block; antialias:true"), AmCharts.vmlStyleSheet = b), this.container =
            a, this.R = new AmCharts.VMLRenderer(this), this.R.disableSelection(a))
    }, createSvgElement: function (a) {
        return document.createElementNS(AmCharts.SVG_NS, a)
    }, circle: function (a, b, c, d) {
        var e = new AmCharts.AmDObject("circle", this);
        e.attr({r: c, cx: a, cy: b});
        this.addToContainer(e.node, d);
        return e
    }, setSize: function (a, b) {
        0 < a && 0 < b && (this.container.style.width = a + "px", this.container.style.height = b + "px")
    }, rect: function (a, b, c, d, e, f, g) {
        var h = new AmCharts.AmDObject("rect", this);
        AmCharts.VML && (e = 100 * e / Math.min(c, d), c += 2 * f,
            d += 2 * f, h.bw = f, h.node.style.marginLeft = -f, h.node.style.marginTop = -f);
        1 > c && (c = 1);
        1 > d && (d = 1);
        h.attr({x: a, y: b, width: c, height: d, rx: e, ry: e, "stroke-width": f});
        this.addToContainer(h.node, g);
        return h
    }, image: function (a, b, c, d, e, f) {
        var g = new AmCharts.AmDObject("image", this);
        g.attr({x: b, y: c, width: d, height: e});
        this.R.path(g, a);
        this.addToContainer(g.node, f);
        return g
    }, addToContainer: function (a, b) {
        b || (b = this.container);
        b.appendChild(a)
    }, text: function (a, b, c) {
        return this.R.text(a, b, c)
    }, path: function (a, b, c, d) {
        var e =
            new AmCharts.AmDObject("path", this);
        d || (d = "100,100");
        e.attr({cs: d});
        c ? e.attr({dd: a}) : e.attr({d: a});
        this.addToContainer(e.node, b);
        return e
    }, set: function (a) {
        return this.R.set(a)
    }, remove: function (a) {
        if (a) {
            var b = this.rBin;
            b.appendChild(a);
            b.innerHTML = ""
        }
    }, bounce: function (a, b, c, d, e) {
        return (b /= e) < 1 / 2.75 ? d * 7.5625 * b * b + c : b < 2 / 2.75 ? d * (7.5625 * (b -= 1.5 / 2.75) * b + 0.75) + c : b < 2.5 / 2.75 ? d * (7.5625 * (b -= 2.25 / 2.75) * b + 0.9375) + c : d * (7.5625 * (b -= 2.625 / 2.75) * b + 0.984375) + c
    }, easeInSine: function (a, b, c, d, e) {
        return -d * Math.cos(b / e * (Math.PI /
                2)) + d + c
    }, easeOutSine: function (a, b, c, d, e) {
        return d * Math.sin(b / e * (Math.PI / 2)) + c
    }, easeOutElastic: function (a, b, c, d, e) {
        a = 1.70158;
        var f = 0, g = d;
        if (0 === b)return c;
        if (1 == (b /= e))return c + d;
        f || (f = 0.3 * e);
        g < Math.abs(d) ? (g = d, a = f / 4) : a = f / (2 * Math.PI) * Math.asin(d / g);
        return g * Math.pow(2, -10 * b) * Math.sin((b * e - a) * 2 * Math.PI / f) + d + c
    }, renderFix: function () {
        var a = this.container, b = a.style, c;
        try {
            c = a.getScreenCTM() || a.createSVGMatrix()
        } catch (d) {
            c = a.createSVGMatrix()
        }
        a = 1 - c.e % 1;
        c = 1 - c.f % 1;
        0.5 < a && (a -= 1);
        0.5 < c && (c -= 1);
        a && (b.left = a + "px");
        c && (b.top = c + "px")
    }
});
AmCharts.AmDObject = AmCharts.Class({
    construct: function (a, b) {
        this.D = b;
        this.R = b.R;
        this.node = this.R.create(this, a);
        this.y = this.x = 0;
        this.scale = 1
    }, attr: function (a) {
        this.R.attr(this, a);
        return this
    }, getAttr: function (a) {
        return this.node.getAttribute(a)
    }, setAttr: function (a, b) {
        this.R.setAttr(this, a, b);
        return this
    }, clipRect: function (a, b, c, d) {
        this.R.clipRect(this, a, b, c, d)
    }, translate: function (a, b, c, d) {
        d || (a = Math.round(a), b = Math.round(b));
        this.R.move(this, a, b, c);
        this.x = a;
        this.y = b;
        this.scale = c;
        this.angle && this.rotate(this.angle)
    },
    rotate: function (a) {
        this.R.rotate(this, a);
        this.angle = a
    }, animate: function (a, b, c) {
        for (var d in a)if (a.hasOwnProperty(d)) {
            var e = d, f = a[d];
            c = AmCharts.getEffect(c);
            this.R.animate(this, e, f, b, c)
        }
    }, push: function (a) {
        if (a) {
            var b = this.node;
            b.appendChild(a.node);
            var c = a.clipPath;
            c && b.appendChild(c);
            (a = a.grad) && b.appendChild(a)
        }
    }, text: function (a) {
        this.R.setText(this, a)
    }, remove: function () {
        this.R.remove(this)
    }, clear: function () {
        var a = this.node;
        if (a.hasChildNodes())for (; 1 <= a.childNodes.length;)a.removeChild(a.firstChild)
    },
    hide: function () {
        this.setAttr("visibility", "hidden")
    }, show: function () {
        this.setAttr("visibility", "visible")
    }, getBBox: function () {
        return this.R.getBBox(this)
    }, toFront: function () {
        var a = this.node;
        if (a) {
            this.prevNextNode = a.nextSibling;
            var b = a.parentNode;
            b && b.appendChild(a)
        }
    }, toPrevious: function () {
        var a = this.node;
        a && this.prevNextNode && (a = a.parentNode) && a.insertBefore(this.prevNextNode, null)
    }, toBack: function () {
        var a = this.node;
        if (a) {
            this.prevNextNode = a.nextSibling;
            var b = a.parentNode;
            if (b) {
                var c = b.firstChild;
                c && b.insertBefore(a, c)
            }
        }
    }, mouseover: function (a) {
        this.R.addListener(this, "mouseover", a);
        return this
    }, mouseout: function (a) {
        this.R.addListener(this, "mouseout", a);
        return this
    }, click: function (a) {
        this.R.addListener(this, "click", a);
        return this
    }, dblclick: function (a) {
        this.R.addListener(this, "dblclick", a);
        return this
    }, mousedown: function (a) {
        this.R.addListener(this, "mousedown", a);
        return this
    }, mouseup: function (a) {
        this.R.addListener(this, "mouseup", a);
        return this
    }, touchstart: function (a) {
        this.R.addListener(this,
            "touchstart", a);
        return this
    }, touchend: function (a) {
        this.R.addListener(this, "touchend", a);
        return this
    }, contextmenu: function (a) {
        this.node.addEventListener ? this.node.addEventListener("contextmenu", a) : this.R.addListener(this, "contextmenu", a);
        return this
    }, stop: function (a) {
        (a = this.animationX) && AmCharts.removeFromArray(this.R.animations, a);
        (a = this.animationY) && AmCharts.removeFromArray(this.R.animations, a)
    }, length: function () {
        return this.node.childNodes.length
    }, gradient: function (a, b, c) {
        this.R.gradient(this,
            a, b, c)
    }
});
AmCharts.VMLRenderer = AmCharts.Class({
    construct: function (a) {
        this.D = a;
        this.cNames = {circle: "oval", rect: "roundrect", path: "shape"};
        this.styleMap = {
            x: "left",
            y: "top",
            width: "width",
            height: "height",
            "font-family": "fontFamily",
            "font-size": "fontSize",
            visibility: "visibility"
        };
        this.animations = []
    }, create: function (a, b) {
        var c;
        if ("group" == b)c = document.createElement("div"), a.type = "div"; else if ("text" == b)c = document.createElement("div"), a.type = "text"; else if ("image" == b)c = document.createElement("img"), a.type = "image"; else {
            a.type =
                "shape";
            a.shapeType = this.cNames[b];
            c = document.createElement("amvml:" + this.cNames[b]);
            var d = document.createElement("amvml:stroke");
            c.appendChild(d);
            a.stroke = d;
            var e = document.createElement("amvml:fill");
            c.appendChild(e);
            a.fill = e;
            e.className = "amvml";
            d.className = "amvml";
            c.className = "amvml"
        }
        c.style.position = "absolute";
        c.style.top = 0;
        c.style.left = 0;
        return c
    }, path: function (a, b) {
        a.node.setAttribute("src", b)
    }, setAttr: function (a, b, c) {
        if (void 0 !== c) {
            var d;
            8 === document.documentMode && (d = !0);
            var e = a.node, f = a.type,
                g = e.style;
            "r" == b && (g.width = 2 * c, g.height = 2 * c);
            "roundrect" != a.shapeType || "width" != b && "height" != b || (c -= 1);
            "cursor" == b && (g.cursor = c);
            "cx" == b && (g.left = c - AmCharts.removePx(g.width) / 2);
            "cy" == b && (g.top = c - AmCharts.removePx(g.height) / 2);
            var h = this.styleMap[b];
            void 0 !== h && (g[h] = c);
            "text" == f && ("text-anchor" == b && (a.anchor = c, h = e.clientWidth, "end" == c && (g.marginLeft = -h + "px"), "middle" == c && (g.marginLeft = -(h / 2) + "px", g.textAlign = "center"), "start" == c && (g.marginLeft = "0px")), "fill" == b && (g.color = c), "font-weight" == b && (g.fontWeight =
                c));
            if (g = a.children)for (h = 0; h < g.length; h++)g[h].setAttr(b, c);
            if ("shape" == f) {
                "cs" == b && (e.style.width = "100px", e.style.height = "100px", e.setAttribute("coordsize", c));
                "d" == b && e.setAttribute("path", this.svgPathToVml(c));
                "dd" == b && e.setAttribute("path", c);
                f = a.stroke;
                a = a.fill;
                "stroke" == b && (d ? f.color = c : f.setAttribute("color", c));
                "stroke-width" == b && (d ? f.weight = c : f.setAttribute("weight", c));
                "stroke-opacity" == b && (d ? f.opacity = c : f.setAttribute("opacity", c));
                "stroke-dasharray" == b && (g = "solid", 0 < c && 3 > c && (g = "dot"),
                3 <= c && 6 >= c && (g = "dash"), 6 < c && (g = "longdash"), d ? f.dashstyle = g : f.setAttribute("dashstyle", g));
                if ("fill-opacity" == b || "opacity" == b)0 === c ? d ? a.on = !1 : a.setAttribute("on", !1) : d ? a.opacity = c : a.setAttribute("opacity", c);
                "fill" == b && (d ? a.color = c : a.setAttribute("color", c));
                "rx" == b && (d ? e.arcSize = c + "%" : e.setAttribute("arcsize", c + "%"))
            }
        }
    }, attr: function (a, b) {
        for (var c in b)b.hasOwnProperty(c) && this.setAttr(a, c, b[c])
    }, text: function (a, b, c) {
        var d = new AmCharts.AmDObject("text", this.D), e = d.node;
        e.style.whiteSpace = "pre";
        e.innerHTML =
            a;
        this.D.addToContainer(e, c);
        this.attr(d, b);
        return d
    }, getBBox: function (a) {
        return this.getBox(a.node)
    }, getBox: function (a) {
        var b = a.offsetLeft, c = a.offsetTop, d = a.offsetWidth, e = a.offsetHeight, f;
        if (a.hasChildNodes()) {
            var g, h, k;
            for (k = 0; k < a.childNodes.length; k++) {
                f = this.getBox(a.childNodes[k]);
                var l = f.x;
                isNaN(l) || (isNaN(g) ? g = l : l < g && (g = l));
                var m = f.y;
                isNaN(m) || (isNaN(h) ? h = m : m < h && (h = m));
                l = f.width + l;
                isNaN(l) || (d = Math.max(d, l));
                f = f.height + m;
                isNaN(f) || (e = Math.max(e, f))
            }
            0 > g && (b += g);
            0 > h && (c += h)
        }
        return {
            x: b, y: c, width: d,
            height: e
        }
    }, setText: function (a, b) {
        var c = a.node;
        c && (c.innerHTML = b);
        this.setAttr(a, "text-anchor", a.anchor)
    }, addListener: function (a, b, c) {
        a.node["on" + b] = c
    }, move: function (a, b, c) {
        var d = a.node, e = d.style;
        "text" == a.type && (c -= AmCharts.removePx(e.fontSize) / 2 - 1);
        "oval" == a.shapeType && (b -= AmCharts.removePx(e.width) / 2, c -= AmCharts.removePx(e.height) / 2);
        a = a.bw;
        isNaN(a) || (b -= a, c -= a);
        isNaN(b) || isNaN(c) || (d.style.left = b + "px", d.style.top = c + "px")
    }, svgPathToVml: function (a) {
        var b = a.split(" ");
        a = "";
        var c, d = Math.round, e;
        for (e =
                 0; e < b.length; e++) {
            var f = b[e], g = f.substring(0, 1), f = f.substring(1), h = f.split(","), k = d(h[0]) + "," + d(h[1]);
            "M" == g && (a += " m " + k);
            "L" == g && (a += " l " + k);
            "Z" == g && (a += " x e");
            if ("Q" == g) {
                var l = c.length, m = c[l - 1], n = h[0], s = h[1], k = h[2], q = h[3];
                c = d(c[l - 2] / 3 + 2 / 3 * n);
                m = d(m / 3 + 2 / 3 * s);
                n = d(2 / 3 * n + k / 3);
                s = d(2 / 3 * s + q / 3);
                a += " c " + c + "," + m + "," + n + "," + s + "," + k + "," + q
            }
            "A" == g && (a += " wa " + f);
            "B" == g && (a += " at " + f);
            c = h
        }
        return a
    }, animate: function (a, b, c, d, e) {
        var f = this, g = a.node;
        if ("translate" == b) {
            var h = c.split(",");
            b = h[1];
            c = g.offsetTop;
            g = {
                obj: a,
                frame: 0, attribute: "left", from: g.offsetLeft, to: h[0], time: d, effect: e
            };
            f.animations.push(g);
            d = {obj: a, frame: 0, attribute: "top", from: c, to: b, time: d, effect: e};
            f.animations.push(d);
            a.animationX = g;
            a.animationY = d
        }
        f.interval || (f.interval = setInterval(function () {
            f.updateAnimations.call(f)
        }, AmCharts.updateRate))
    }, updateAnimations: function () {
        var a;
        for (a = this.animations.length - 1; 0 <= a; a--) {
            var b = this.animations[a], c = 1E3 * b.time / AmCharts.updateRate, d = b.frame + 1, e = b.obj, f = b.attribute;
            if (d <= c) {
                b.frame++;
                var g = Number(b.from),
                    h = Number(b.to) - g, b = this.D[b.effect](0, d, g, h, c);
                0 === h ? this.animations.splice(a, 1) : e.node.style[f] = b
            } else e.node.style[f] = Number(b.to), this.animations.splice(a, 1)
        }
    }, clipRect: function (a, b, c, d, e) {
        a = a.node;
        0 == b && 0 == c ? (a.style.width = d + "px", a.style.height = e + "px", a.style.overflow = "hidden") : a.style.clip = "rect(" + c + "px " + (b + d) + "px " + (c + e) + "px " + b + "px)"
    }, rotate: function (a, b) {
        if (0 != Number(b)) {
            var c = a.node, d = c.style, e = this.getBGColor(c.parentNode);
            d.backgroundColor = e;
            d.paddingLeft = 1;
            var e = b * Math.PI / 180, f = Math.cos(e),
                g = Math.sin(e), h = AmCharts.removePx(d.left), k = AmCharts.removePx(d.top), l = c.offsetWidth, c = c.offsetHeight, m = b / Math.abs(b);
            d.left = h + l / 2 - l / 2 * Math.cos(e) - m * c / 2 * Math.sin(e) + 3;
            d.top = k - m * l / 2 * Math.sin(e) + m * c / 2 * Math.sin(e);
            d.cssText = d.cssText + "; filter:progid:DXImageTransform.Microsoft.Matrix(M11='" + f + "', M12='" + -g + "', M21='" + g + "', M22='" + f + "', sizingmethod='auto expand');"
        }
    }, getBGColor: function (a) {
        var b = "#FFFFFF";
        if (a.style) {
            var c = a.style.backgroundColor;
            "" !== c ? b = c : a.parentNode && (b = this.getBGColor(a.parentNode))
        }
        return b
    },
    set: function (a) {
        var b = new AmCharts.AmDObject("group", this.D);
        this.D.container.appendChild(b.node);
        if (a) {
            var c;
            for (c = 0; c < a.length; c++)b.push(a[c])
        }
        return b
    }, gradient: function (a, b, c, d) {
        var e = "";
        "radialGradient" == b && (b = "gradientradial", c.reverse());
        "linearGradient" == b && (b = "gradient");
        var f;
        for (f = 0; f < c.length; f++) {
            var g = Math.round(100 * f / (c.length - 1)), e = e + (g + "% " + c[f]);
            f < c.length - 1 && (e += ",")
        }
        a = a.fill;
        90 == d ? d = 0 : 270 == d ? d = 180 : 180 == d ? d = 90 : 0 === d && (d = 270);
        8 === document.documentMode ? (a.type = b, a.angle = d) : (a.setAttribute("type",
            b), a.setAttribute("angle", d));
        e && (a.colors.value = e)
    }, remove: function (a) {
        a.clipPath && this.D.remove(a.clipPath);
        this.D.remove(a.node)
    }, disableSelection: function (a) {
        void 0 !== typeof a.onselectstart && (a.onselectstart = function () {
            return !1
        });
        a.style.cursor = "default"
    }
});
AmCharts.SVGRenderer = AmCharts.Class({
    construct: function (a) {
        this.D = a;
        this.animations = []
    }, create: function (a, b) {
        return document.createElementNS(AmCharts.SVG_NS, b)
    }, attr: function (a, b) {
        for (var c in b)b.hasOwnProperty(c) && this.setAttr(a, c, b[c])
    }, setAttr: function (a, b, c) {
        void 0 !== c && a.node.setAttribute(b, c)
    }, animate: function (a, b, c, d, e) {
        var f = this, g = a.node;
        "translate" == b ? (g = (g = g.getAttribute("transform")) ? String(g).substring(10, g.length - 1) : "0,0", g = g.split(", ").join(" "), g = g.split(" ").join(","), 0 === g && (g =
            "0,0")) : g = g.getAttribute(b);
        b = {obj: a, frame: 0, attribute: b, from: g, to: c, time: d, effect: e};
        f.animations.push(b);
        a.animationX = b;
        f.interval || (f.interval = setInterval(function () {
            f.updateAnimations.call(f)
        }, AmCharts.updateRate))
    }, updateAnimations: function () {
        var a;
        for (a = this.animations.length - 1; 0 <= a; a--) {
            var b = this.animations[a], c = 1E3 * b.time / AmCharts.updateRate, d = b.frame + 1, e = b.obj, f = b.attribute, g, h, k;
            d <= c ? (b.frame++, "translate" == f ? (g = b.from.split(","), f = Number(g[0]), g = Number(g[1]), h = b.to.split(","), k = Number(h[0]),
                h = Number(h[1]), k = 0 === k - f ? k : Math.round(this.D[b.effect](0, d, f, k - f, c)), b = 0 === h - g ? h : Math.round(this.D[b.effect](0, d, g, h - g, c)), f = "transform", b = "translate(" + k + "," + b + ")") : (g = Number(b.from), k = Number(b.to), k -= g, b = this.D[b.effect](0, d, g, k, c), 0 === k && this.animations.splice(a, 1)), this.setAttr(e, f, b)) : ("translate" == f ? (h = b.to.split(","), k = Number(h[0]), h = Number(h[1]), e.translate(k, h)) : (k = Number(b.to), this.setAttr(e, f, k)), this.animations.splice(a, 1))
        }
    }, getBBox: function (a) {
        if (a = a.node)try {
            return a.getBBox()
        } catch (b) {
        }
        return {
            width: 0,
            height: 0, x: 0, y: 0
        }
    }, path: function (a, b) {
        a.node.setAttributeNS(AmCharts.SVG_XLINK, "xlink:href", b)
    }, clipRect: function (a, b, c, d, e) {
        var f = a.node, g = a.clipPath;
        g && this.D.remove(g);
        var h = f.parentNode;
        h && (f = document.createElementNS(AmCharts.SVG_NS, "clipPath"), g = AmCharts.getUniqueId(), f.setAttribute("id", g), this.D.rect(b, c, d, e, 0, 0, f), h.appendChild(f), b = "#", AmCharts.baseHref && !AmCharts.isIE && (b = window.location.href + b), this.setAttr(a, "clip-path", "url(" + b + g + ")"), this.clipPathC++, a.clipPath = f)
    }, text: function (a, b,
                       c) {
        var d = new AmCharts.AmDObject("text", this.D);
        a = String(a).split("\n");
        var e = b["font-size"], f;
        for (f = 0; f < a.length; f++) {
            var g = this.create(null, "tspan");
            g.appendChild(document.createTextNode(a[f]));
            g.setAttribute("y", (e + 2) * f + e / 2);
            g.setAttribute("x", 0);
            d.node.appendChild(g)
        }
        d.node.setAttribute("y", e / 2);
        this.attr(d, b);
        this.D.addToContainer(d.node, c);
        return d
    }, setText: function (a, b) {
        var c = a.node;
        c && (c.removeChild(c.firstChild), c.appendChild(document.createTextNode(b)))
    }, move: function (a, b, c, d) {
        b = "translate(" +
            b + "," + c + ")";
        d && (b = b + " scale(" + d + ")");
        this.setAttr(a, "transform", b)
    }, rotate: function (a, b) {
        var c = a.node.getAttribute("transform"), d = "rotate(" + b + ")";
        c && (d = c + " " + d);
        this.setAttr(a, "transform", d)
    }, set: function (a) {
        var b = new AmCharts.AmDObject("g", this.D);
        this.D.container.appendChild(b.node);
        if (a) {
            var c;
            for (c = 0; c < a.length; c++)b.push(a[c])
        }
        return b
    }, addListener: function (a, b, c) {
        a.node["on" + b] = c
    }, gradient: function (a, b, c, d) {
        var e = a.node, f = a.grad;
        f && this.D.remove(f);
        b = document.createElementNS(AmCharts.SVG_NS,
            b);
        f = AmCharts.getUniqueId();
        b.setAttribute("id", f);
        if (!isNaN(d)) {
            var g = 0, h = 0, k = 0, l = 0;
            90 == d ? k = 100 : 270 == d ? l = 100 : 180 == d ? g = 100 : 0 === d && (h = 100);
            b.setAttribute("x1", g + "%");
            b.setAttribute("x2", h + "%");
            b.setAttribute("y1", k + "%");
            b.setAttribute("y2", l + "%")
        }
        for (d = 0; d < c.length; d++)g = document.createElementNS(AmCharts.SVG_NS, "stop"), h = 100 * d / (c.length - 1), 0 === d && (h = 0), g.setAttribute("offset", h + "%"), g.setAttribute("stop-color", c[d]), b.appendChild(g);
        e.parentNode.appendChild(b);
        c = "#";
        AmCharts.baseHref && !AmCharts.isIE &&
        (c = window.location.href + c);
        e.setAttribute("fill", "url(" + c + f + ")");
        a.grad = b
    }, remove: function (a) {
        a.clipPath && this.D.remove(a.clipPath);
        a.grad && this.D.remove(a.grad);
        this.D.remove(a.node)
    }
});
AmCharts.AmDSet = AmCharts.Class({
    construct: function (a) {
        this.create("g")
    }, attr: function (a) {
        this.R.attr(this.node, a)
    }, move: function (a, b) {
        this.R.move(this.node, a, b)
    }
});