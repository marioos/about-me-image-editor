/** @preserve jQuery jCrop */
(function(n) {
    n.Jcrop = function(t, i) {
        function h(n) {
            return Math.round(n) + "px"
        }

        function ft(n) {
            return r.baseClass + "-" + n
        }

        function bi() {
            return n.fx.step.hasOwnProperty("backgroundColor")
        }

        function et(t) {
            var i = n(t).offset();
            return [i.left, i.top]
        }

        function nt(n) {
            return [n.pageX - b[0], n.pageY - b[1]]
        }

        function ni(t) {
            typeof t != "object" && (t = {});
            r = n.extend(r, t);
            n.each(["onChange", "onSelect", "onRelease", "onDblClick"], function(n, t) {
                typeof r[t] != "function" && (r[t] = function() {
                })
            })
        }

        function ti(n, t, i) {
            if (b = et(e), p.setCursor(n === "move" ? n : n + "-resize"), n === "move")
                return p.activateHandlers(di(t), pt, i);
            var u = s.getFixed(),
                    r = ii(n),
                    f = s.getCorner(ii(r));
            s.setPressed(s.getCorner(r));
            s.setCurrent(f);
            p.activateHandlers(ki(n, u), pt, i)
        }

        function ki(n, t) {
            return function(i) {
                if (r.aspectRatio)
                    switch (n) {
                        case "e":
                            i[1] = t.y + 1;
                            break;
                        case "w":
                            i[1] = t.y + 1;
                            break;
                        case "n":
                            i[0] = t.x + 1;
                            break;
                        case "s":
                            i[0] = t.x + 1
                    }
                else
                    switch (n) {
                        case "e":
                            i[1] = t.y2;
                            break;
                        case "w":
                            i[1] = t.y2;
                            break;
                        case "n":
                            i[0] = t.x2;
                            break;
                        case "s":
                            i[0] = t.x2
                    }
                s.setCurrent(i);
                u.update()
            }
        }

        function di(n) {
            var t = n;
            return gt.watchKeys(),
                    function(n) {
                        s.moveOffset([n[0] - t[0], n[1] - t[1]]);
                        t = n;
                        u.update()
                    }
        }

        function ii(n) {
            switch (n) {
                case "n":
                    return "sw";
                case "s":
                    return "nw";
                case "e":
                    return "nw";
                case "w":
                    return "ne";
                case "ne":
                    return "sw";
                case "nw":
                    return "se";
                case "se":
                    return "nw";
                case "sw":
                    return "ne"
            }
        }

        function ri(n) {
            return function(t) {
                return r.disabled ? !1 : n === "move" && !r.allowMove ? !1 : (b = et(e), ut = !0, ti(n, nt(t)), t.stopPropagation(), t.preventDefault(), !1)
            }
        }

        function ui(n, t, i) {
            var r = n.width(),
                    u = n.height();
            r > t && t > 0 && (r = t, u = t / n.width() * n.height());
            u > i && i > 0 && (u = i, r = i / n.height() * n.width());
            l = n.width() / r;
            a = n.height() / u;
            n.width(r).height(u)
        }

        function ot(n) {
            return {
                x: n.x * l,
                y: n.y * a,
                x2: n.x2 * l,
                y2: n.y2 * a,
                w: n.w * l,
                h: n.h * a
            }
        }

        function pt() {
            var n = s.getFixed();
            n.w > r.minSelect[0] && n.h > r.minSelect[1] ? (u.enableHandles(), u.done()) : u.release();
            p.setCursor(r.allowSelect ? "crosshair" : "default")
        }

        function fi(n) {
            if (r.disabled || !r.allowSelect)
                return !1;
            ut = !0;
            b = et(e);
            u.disableHandles();
            p.setCursor("crosshair");
            var t = nt(n);
            return s.setPressed(t), u.update(), p.activateHandlers(gi, pt, n.type.substring(0, 5) === "touch"), gt.watchKeys(), n.stopPropagation(), n.preventDefault(), !1
        }

        function gi(n) {
            s.setCurrent(n);
            u.update()
        }

        function ei() {
            var t = n("<div><\/div>").addClass(ft("tracker"));
            return ai && t.css({
                opacity: 0,
                backgroundColor: "white"
            }), t
        }

        function nr(n) {
            w.removeClass().addClass(ft("holder")).addClass(n)
        }

        function tr(n, t) {
            function b() {
                window.setTimeout(k, d)
            }
            var c = n[0] / l,
                    y = n[1] / a,
                    p = n[2] / l,
                    w = n[3] / a,
                    k;
            if (!dt) {
                var o = s.flipCoords(c, y, p, w),
                        h = s.getFixed(),
                        e = [h.x, h.y, h.x2, h.y2],
                        i = e,
                        d = r.animationDelay,
                        g = o[0] - e[0],
                        nt = o[1] - e[1],
                        tt = o[2] - e[2],
                        it = o[3] - e[3],
                        f = 0,
                        rt = r.swingSpeed;
                c = i[0];
                y = i[1];
                p = i[2];
                w = i[3];
                u.animMode(!0);
                k = function() {
                    return function() {
                        f += (100 - f) / rt;
                        i[0] = Math.round(c + f / 100 * g);
                        i[1] = Math.round(y + f / 100 * nt);
                        i[2] = Math.round(p + f / 100 * tt);
                        i[3] = Math.round(w + f / 100 * it);
                        f >= 99.8 && (f = 100);
                        f < 100 ? (si(i), b()) : (u.done(), u.animMode(!1), typeof t == "function" && t.call(v))
                    }
                }();
                b()
            }
        }

        function oi(n) {
            si([n[0] / l, n[1] / a, n[2] / l, n[3] / a]);
            r.onSelect.call(v, ot(s.getFixed()));
            u.enableHandles()
        }

        function si(n) {
            s.setPressed([n[0], n[1]]);
            s.setCurrent([n[2], n[3]]);
            u.update()
        }

        function ir() {
            return ot(s.getFixed())
        }

        function rr() {
            return s.getFixed()
        }

        function ur(n) {
            ni(n);
            bt()
        }

        function hi() {
            r.disabled = !0;
            u.disableHandles();
            u.setCursor("default");
            p.setCursor("default")
        }

        function ci() {
            r.disabled = !1;
            bt()
        }

        function fr() {
            u.done();
            p.activateHandlers(null, null)
        }

        function er() {
            w.remove();
            c.show();
            c.css("visibility", "visible");
            n(t).removeData("Jcrop")
        }

        function or(n, t) {
            u.release();
            hi();
            var i = new Image;
            i.onload = function() {
                var u = i.width,
                        s = i.height,
                        h = r.boxWidth,
                        c = r.boxHeight;
                e.width(u).height(s);
                e.attr("src", n);
                k.attr("src", n);
                ui(e, h, c);
                o = e.width();
                f = e.height();
                k.width(o).height(f);
                d.width(o + rt * 2).height(f + rt * 2);
                w.width(o).height(f);
                g.resize(o, f);
                ci();
                typeof t == "function" && t.call(v)
            };
            i.src = n
        }

        function wt(n, t, i) {
            var u = t || r.bgColor;
            r.bgFade && bi() && r.fadeTime && !i ? n.animate({
                backgroundColor: u
            }, {
                queue: !1,
                duration: r.fadeTime
            }) : n.css("backgroundColor", u)
        }

        function bt(n) {
            r.allowResize ? n ? u.enableOnly() : u.enableHandles() : u.disableHandles();
            p.setCursor(r.allowSelect ? "crosshair" : "default");
            u.setCursor(r.allowMove ? "move" : "default");
            r.hasOwnProperty("trueSize") && (l = r.trueSize[0] / o, a = r.trueSize[1] / f);
            r.hasOwnProperty("setSelect") && (oi(r.setSelect), u.done(), delete r.setSelect);
            g.refresh();
            r.bgColor != pi && (wt(r.shade ? g.getShades() : w, r.shade ? r.shadeColor || r.bgColor : r.bgColor), pi = r.bgColor);
            st != r.bgOpacity && (st = r.bgOpacity, r.shade ? g.refresh() : u.setBgOpacity(st));
            ht = r.maxSize[0] || 0;
            ct = r.maxSize[1] || 0;
            lt = r.minSize[0] || 0;
            at = r.minSize[1] || 0;
            r.hasOwnProperty("outerImage") && (e.attr("src", r.outerImage), delete r.outerImage);
            u.refresh()
        }
        var r = n.extend({}, n.Jcrop.defaults),
                b, li = navigator.userAgent.toLowerCase(),
                ai = /msie/.test(li),
                vi = /msie [1-6]\./.test(li),
                vt, e, v;
        typeof t != "object" && (t = n(t)[0]);
        typeof i != "object" && (i = {});
        ni(i);
        var kt = {
            border: "none",
            visibility: "visible",
            margin: 0,
            padding: 0,
            position: "absolute",
            top: 0,
            left: 0
        }, c = n(t),
                yi = !0;
        t.tagName == "IMG" ? (c[0].width != 0 && c[0].height != 0 ? (c.width(c[0].width), c.height(c[0].height)) : (vt = new Image, vt.src = c[0].src, c.width(vt.width), c.height(vt.height)), e = c.clone().removeAttr("id").css(kt).show(), e.width(c.width()), e.height(c.height()), c.after(e).hide()) : (e = c.css(kt).show(), yi = !1, r.shade === null && (r.shade = !0));
        ui(e, r.boxWidth, r.boxHeight);
        var o = e.width(),
                f = e.height(),
                w = n("<div />").width(o).height(f).addClass(ft("holder")).css({
            position: "relative",
            backgroundColor: r.bgColor
        }).insertAfter(c).append(e);
        r.addClass && w.addClass(r.addClass);
        var k = n("<div />"),
                yt = n("<div />").width("100%").height("100%").css({
            zIndex: 310,
            position: "absolute",
            overflow: "hidden"
        }),
        tt = n("<div />").width("100%").height("100%").css("zIndex", 320),
                it = n("<div />").css({
            position: "absolute",
            zIndex: 600
        }).dblclick(function() {
            var n = s.getFixed();
            r.onDblClick.call(v, n)
        }).insertBefore(e).append(yt, tt);
        yi && (k = n("<img />").attr("src", e.attr("src")).css(kt).width(o).height(f), yt.append(k));
        vi && it.css({
            overflowY: "hidden"
        });
        var rt = r.boundary,
                d = ei().width(o + rt * 2).height(f + rt * 2).css({
            position: "absolute",
            top: h(-rt),
            left: h(-rt),
            zIndex: 290
        }).mousedown(fi),
                pi = r.bgColor,
                st = r.bgOpacity,
                ht, ct, lt, at, l, a, ut, dt, wi;
        b = et(e);
        var y = function() {
            function n() {
                var i = {}, u = ["touchstart", "touchmove", "touchend"],
                        f = document.createElement("div"),
                        t, n, r;
                try {
                    for (t = 0; t < u.length; t++)
                        n = u[t], n = "on" + n, r = n in f, r || (f.setAttribute(n, "return;"), r = typeof f[n] == "function"), i[u[t]] = r;
                    return i.touchstart && i.touchend && i.touchmove
                } catch (e) {
                    return !1
                }
            }

            function t() {
                return r.touchSupport === !0 || r.touchSupport === !1 ? r.touchSupport : n()
            }
            return {
                createDragger: function(n) {
                    return function(t) {
                        return r.disabled ? !1 : n === "move" && !r.allowMove ? !1 : (b = et(e), ut = !0, ti(n, nt(y.cfilter(t)), !0), t.stopPropagation(), t.preventDefault(), !1)
                    }
                },
                newSelection: function(n) {
                    return fi(y.cfilter(n))
                },
                cfilter: function(n) {
                    return n.pageX = n.originalEvent.changedTouches[0].pageX, n.pageY = n.originalEvent.changedTouches[0].pageY, n
                },
                isSupported: n,
                support: t()
            }
        }(),
                s = function() {
                    function p(r) {
                        r = h(r);
                        u = n = r[0];
                        i = t = r[1]
                    }

                    function w(n) {
                        n = h(n);
                        v = n[0] - u;
                        y = n[1] - i;
                        u = n[0];
                        i = n[1]
                    }

                    function b() {
                        return [v, y]
                    }

                    function k(r) {
                        var e = r[0],
                                s = r[1];
                        0 > n + e && (e -= e + n);
                        0 > t + s && (s -= s + t);
                        f < i + s && (s += f - (i + s));
                        o < u + e && (e += o - (u + e));
                        n += e;
                        u += e;
                        t += s;
                        i += s
                    }

                    function d(n) {
                        var t = s();
                        switch (n) {
                            case "ne":
                                return [t.x2, t.y];
                            case "nw":
                                return [t.x, t.y];
                            case "se":
                                return [t.x2, t.y2];
                            case "sw":
                                return [t.x, t.y2]
                        }
                    }

                    function s() {
                        if (!r.aspectRatio)
                            return g();
                        var v = r.aspectRatio,
                                b = r.minSize[0] / l,
                                w = r.maxSize[0] / l,
                                nt = r.maxSize[1] / a,
                                k = u - n,
                                d = i - t,
                                tt = Math.abs(k),
                                it = Math.abs(d),
                                rt = tt / it,
                                s, h, y, p;
                        return w === 0 && (w = o * 10), nt === 0 && (nt = f * 10), rt < v ? (h = i, y = it * v, s = k < 0 ? n - y : y + n, s < 0 ? (s = 0, p = Math.abs((s - n) / v), h = d < 0 ? t - p : p + t) : s > o && (s = o, p = Math.abs((s - n) / v), h = d < 0 ? t - p : p + t)) : (s = u, p = tt / v, h = d < 0 ? t - p : t + p, h < 0 ? (h = 0, y = Math.abs((h - t) * v), s = k < 0 ? n - y : y + n) : h > f && (h = f, y = Math.abs(h - t) * v, s = k < 0 ? n - y : y + n)), s > n ? (s - n < b ? s = n + b : s - n > w && (s = n + w), h = h > t ? t + (s - n) / v : t - (s - n) / v) : s < n && (n - s < b ? s = n - b : n - s > w && (s = n - w), h = h > t ? t + (n - s) / v : t - (n - s) / v), s < 0 ? (n -= s, s = 0) : s > o && (n -= s - o, s = o), h < 0 ? (t -= h, h = 0) : h > f && (t -= h - f, h = f), c(e(n, t, s, h))
                    }

                    function h(n) {
                        return n[0] < 0 && (n[0] = 0), n[1] < 0 && (n[1] = 0), n[0] > o && (n[0] = o), n[1] > f && (n[1] = f), [Math.round(n[0]), Math.round(n[1])]
                    }

                    function e(n, t, i, r) {
                        var u = n,
                                f = i,
                                e = t,
                                o = r;
                        return i < n && (u = i, f = n), r < t && (e = r, o = t), [u, e, f, o]
                    }

                    function g() {
                        var s = u - n,
                                h = i - t,
                                r;
                        return ht && Math.abs(s) > ht && (u = s > 0 ? n + ht : n - ht), ct && Math.abs(h) > ct && (i = h > 0 ? t + ct : t - ct), at / a && Math.abs(h) < at / a && (i = h > 0 ? t + at / a : t - at / a), lt / l && Math.abs(s) < lt / l && (u = s > 0 ? n + lt / l : n - lt / l), n < 0 && (u -= n, n -= n), t < 0 && (i -= t, t -= t), u < 0 && (n -= u, u -= u), i < 0 && (t -= i, i -= i), u > o && (r = u - o, n -= r, u -= r), i > f && (r = i - f, t -= r, i -= r), n > o && (r = n - f, i -= r, t -= r), t > f && (r = t - f, i -= r, t -= r), c(e(n, t, u, i))
                    }

                    function c(n) {
                        return {
                            x: n[0],
                            y: n[1],
                            x2: n[2],
                            y2: n[3],
                            w: n[2] - n[0],
                            h: n[3] - n[1]
                        }
                    }
                    var n = 0,
                            t = 0,
                            u = 0,
                            i = 0,
                            v, y;
                    return {
                        flipCoords: e,
                        setPressed: p,
                        setCurrent: w,
                        getOffset: b,
                        moveOffset: k,
                        getCorner: d,
                        getFixed: s
                    }
                }(),
                g = function() {
                    function nt(n, t) {
                        i.left.css({
                            height: h(t)
                        });
                        i.right.css({
                            height: h(t)
                        })
                    }

                    function v() {
                        return y(s.getFixed())
                    }

                    function y(n) {
                        i.top.css({
                            left: h(n.x),
                            width: h(n.w),
                            height: h(n.y)
                        });
                        i.bottom.css({
                            top: h(n.y2),
                            left: h(n.x),
                            width: h(n.w),
                            height: h(f - n.y2)
                        });
                        i.right.css({
                            left: h(n.x2),
                            width: h(o - n.x2)
                        });
                        i.left.css({
                            width: h(n.x)
                        })
                    }

                    function l() {
                        return n("<div />").css({
                            position: "absolute",
                            backgroundColor: r.shadeColor || r.bgColor
                        }).appendTo(t)
                    }

                    function p() {
                        c || (c = !0, t.insertBefore(e), v(), u.setBgOpacity(1, 0, 1), k.hide(), b(r.shadeColor || r.bgColor, 1), u.isAwake() ? a(r.bgOpacity, 1) : a(1, 1))
                    }

                    function b(n, t) {
                        wt(g(), n, t)
                    }

                    function d() {
                        c && (t.remove(), k.show(), c = !1, u.isAwake() ? u.setBgOpacity(r.bgOpacity, 1, 1) : (u.setBgOpacity(1, 1, 1), u.disableHandles()), wt(w, 0, 1))
                    }

                    function a(n, i) {
                        c && (r.bgFade && !i ? t.animate({
                            opacity: 1 - n
                        }, {
                            queue: !1,
                            duration: r.fadeTime
                        }) : t.css({
                            opacity: 1 - n
                        }))
                    }

                    function tt() {
                        r.shade ? p() : d();
                        u.isAwake() && a(r.bgOpacity)
                    }

                    function g() {
                        return t.children()
                    }
                    var c = !1,
                            t = n("<div />").css({
                        position: "absolute",
                        zIndex: 240,
                        opacity: 0
                    }),
                    i = {
                        top: l(),
                        left: l().height(f),
                        right: l().height(f),
                        bottom: l()
                    };
                    return {
                        update: v,
                        updateRaw: y,
                        getShades: g,
                        setBgColor: b,
                        enable: p,
                        disable: d,
                        resize: nt,
                        refresh: tt,
                        opacity: a
                    }
                }(),
                u = function() {
                    function nt(t) {
                        var i = n("<div />").css({
                            position: "absolute",
                            opacity: r.borderOpacity
                        }).addClass(ft(t));
                        return yt.append(i), i
                    }

                    function c(t, i) {
                        var r = n("<div />").mousedown(ri(t)).css({
                            cursor: t + "-resize",
                            position: "absolute",
                            zIndex: i
                        }).addClass("ord-" + t);
                        return y.support && r.bind("touchstart.jcrop", y.createDragger(t)), tt.append(r), r
                    }

                    function rt(n) {
                        var t = r.handleSize,
                                i = c(n, d++).css({
                            opacity: r.handleOpacity
                        }).addClass(ft("handle"));
                        return t && i.width(t).height(t), i
                    }

                    function ut(n) {
                        return c(n, d++).addClass("jcrop-dragbar")
                    }

                    function et(n) {
                        for (var t = 0; t < n.length; t++)
                            ni[n[t]] = ut(n[t])
                    }

                    function ht(n) {
                        for (var t, i = 0; i < n.length; i++) {
                            switch (n[i]) {
                                case "n":
                                    t = "hline";
                                    break;
                                case "s":
                                    t = "hline bottom";
                                    break;
                                case "e":
                                    t = "vline right";
                                    break;
                                case "w":
                                    t = "vline"
                            }
                            kt[n[i]] = nt(t)
                        }
                    }

                    function ct(n) {
                        for (var t = 0; t < n.length; t++)
                            gt[n[t]] = rt(n[t])
                    }

                    function lt(n, t) {
                        r.shade || k.css({
                            top: h(-t),
                            left: h(-n)
                        });
                        it.css({
                            top: h(t),
                            left: h(n)
                        })
                    }

                    function at(n, t) {
                        it.width(Math.round(n)).height(Math.round(t))
                    }

                    function l() {
                        var n = s.getFixed();
                        s.setPressed([n.x, n.y]);
                        s.setCurrent([n.x2, n.y2]);
                        a()
                    }

                    function a(n) {
                        if (t)
                            return p(n)
                    }

                    function p(n) {
                        var i = s.getFixed();
                        at(i.w, i.h);
                        lt(i.x, i.y);
                        r.shade && g.updateRaw(i);
                        t || vt();
                        n ? r.onSelect.call(v, ot(i)) : r.onChange.call(v, ot(i))
                    }

                    function o(n, i, u) {
                        (t || i) && (r.bgFade && !u ? e.animate({
                            opacity: n
                        }, {
                            queue: !1,
                            duration: r.fadeTime
                        }) : e.css("opacity", n))
                    }

                    function vt() {
                        it.show();
                        r.shade ? g.opacity(st) : o(st, !0);
                        t = !0
                    }

                    function pt() {
                        i();
                        it.hide();
                        r.shade ? g.opacity(1) : o(1);
                        t = !1;
                        r.onRelease.call(v)
                    }

                    function wt() {
                        u && tt.show()
                    }

                    function w() {
                        return u = !0, r.allowResize ? (tt.show(), !0) : void 0
                    }

                    function i() {
                        u = !1;
                        tt.hide()
                    }

                    function b(n) {
                        n ? (dt = !0, i()) : (dt = !1, w())
                    }

                    function bt() {
                        b(!1);
                        l()
                    }
                    var t, d = 370,
                            kt = {}, gt = {}, ni = {}, u = !1,
                            f;
                    return r.dragEdges && n.isArray(r.createDragbars) && et(r.createDragbars), n.isArray(r.createHandles) && ct(r.createHandles), r.drawBorders && n.isArray(r.createBorders) && ht(r.createBorders), n(document).bind("touchstart.jcrop-ios", function(t) {
                        n(t.currentTarget).hasClass("jcrop-tracker") && t.stopPropagation()
                    }), f = ei().mousedown(ri("move")).css({
                        cursor: "move",
                        position: "absolute",
                        zIndex: 360
                    }), y.support && f.bind("touchstart.jcrop", y.createDragger("move")), yt.append(f), i(), {
                        updateVisible: a,
                        update: p,
                        release: pt,
                        refresh: l,
                        isAwake: function() {
                            return t
                        },
                        setCursor: function(n) {
                            f.css("cursor", n)
                        },
                        enableHandles: w,
                        enableOnly: function() {
                            u = !0
                        },
                        showHandles: wt,
                        disableHandles: i,
                        animMode: b,
                        setBgOpacity: o,
                        done: bt
                    }
                }(),
                p = function() {
                    function c(i) {
                        d.css({
                            zIndex: 450
                        });
                        i ? n(document).bind("touchmove.jcrop", p).bind("touchend.jcrop", w) : h && n(document).bind("mousemove.jcrop", o).bind("mouseup.jcrop", t)
                    }

                    function l() {
                        d.css({
                            zIndex: 290
                        });
                        n(document).unbind(".jcrop")
                    }

                    function o(n) {
                        return i(nt(n)), !1
                    }

                    function t(n) {
                        return n.preventDefault(), n.stopPropagation(), ut && (ut = !1, f(nt(n)), u.isAwake() && r.onSelect.call(v, ot(s.getFixed())), l(), i = function() {
                        }, f = function() {
                        }), !1
                    }

                    function a(n, t, r) {
                        return ut = !0, i = n, f = t, c(r), !1
                    }

                    function p(n) {
                        return i(nt(y.cfilter(n))), !1
                    }

                    function w(n) {
                        return t(y.cfilter(n))
                    }

                    function b(n) {
                        d.css("cursor", n)
                    }
                    var i = function() {
                    }, f = function() {
                    }, h = r.trackDocument;
                    return h || d.mousemove(o).mouseup(t).mouseout(t), e.before(d), {
                        activateHandlers: a,
                        setCursor: b
                    }
                }(),
                gt = function() {
                    function f() {
                        r.keySupport && (t.show(), t.focus())
                    }

                    function o() {
                        t.hide()
                    }

                    function i(n, t, i) {
                        r.allowMove && (s.moveOffset([t, i]), u.updateVisible(!0));
                        n.preventDefault();
                        n.stopPropagation()
                    }

                    function h(n) {
                        if (n.ctrlKey || n.metaKey)
                            return !0;
                        wi = n.shiftKey ? !0 : !1;
                        var t = wi ? 10 : 1;
                        switch (n.keyCode) {
                            case 37:
                                i(n, -t, 0);
                                break;
                            case 39:
                                i(n, t, 0);
                                break;
                            case 38:
                                i(n, 0, -t);
                                break;
                            case 40:
                                i(n, 0, t);
                                break;
                            case 27:
                                r.allowSelect && u.release();
                                break;
                            case 9:
                                return !0
                        }
                        return !1
                    }
                    var t = n('<input type="radio" />').css({
                        position: "fixed",
                        left: "-120px",
                        width: "12px"
                    }).addClass("jcrop-keymgr"),
                            c = n("<div />").css({
                        position: "absolute",
                        overflow: "hidden"
                    }).append(t);
                    return r.keySupport && (t.keydown(h).blur(o), vi || !r.fixedSupport ? (t.css({
                        position: "absolute",
                        left: "-20px"
                    }), c.append(t).insertBefore(e)) : t.insertBefore(e)), {
                        watchKeys: f
                    }
                }();
        return y.support && d.bind("touchstart.jcrop", y.newSelection), tt.hide(), bt(!0), v = {
            setImage: or,
            animateTo: tr,
            setSelect: oi,
            setOptions: ur,
            tellSelect: ir,
            tellScaled: rr,
            setClass: nr,
            disable: hi,
            enable: ci,
            cancel: fr,
            release: u.release,
            destroy: er,
            focus: gt.watchKeys,
            getBounds: function() {
                return [o * l, f * a]
            },
            getWidgetSize: function() {
                return [o, f]
            },
            getScaleFactor: function() {
                return [l, a]
            },
            getOptions: function() {
                return r
            },
            ui: {
                holder: w,
                selection: it
            }
        }, ai && w.bind("selectstart", function() {
            return !1
        }), c.data("Jcrop", v), v
    };
    n.fn.Jcrop = function(t, i) {
        var r;
        return this.each(function() {
            if (n(this).data("Jcrop")) {
                if (t === "api")
                    return n(this).data("Jcrop");
                n(this).data("Jcrop").setOptions(t)
            } else
                this.tagName == "IMG" ? n.Jcrop.Loader(this, function() {
                    n(this).css({
                        display: "block",
                        visibility: "hidden"
                    });
                    r = n.Jcrop(this, t);
                    n.isFunction(i) && i.call(r)
                }) : (n(this).css({
                    display: "block",
                    visibility: "hidden"
                }), r = n.Jcrop(this, t), n.isFunction(i) && i.call(r))
        }), this
    };
    n.Jcrop.Loader = function(t, i, r) {
        function e() {
            f.complete ? (u.unbind(".jcloader"), n.isFunction(i) && i.call(f)) : window.setTimeout(e, 50)
        }
        var u = n(t),
                f = u[0];
        u.bind("load.jcloader", e).bind("error.jcloader", function() {
            u.unbind(".jcloader");
            n.isFunction(r) && r.call(f)
        });
        f.complete && n.isFunction(i) && (u.unbind(".jcloader"), i.call(f))
    };
    n.Jcrop.defaults = {
        allowSelect: !0,
        allowMove: !0,
        allowResize: !0,
        trackDocument: !0,
        baseClass: "jcrop",
        addClass: null,
        bgColor: "transparent",
        bgOpacity: .6,
        bgFade: !1,
        borderOpacity: .4,
        handleOpacity: .5,
        handleSize: null,
        aspectRatio: 0,
        keySupport: !0,
        createHandles: ["n", "s", "e", "w", "nw", "ne", "se", "sw"],
        createDragbars: ["n", "s", "e", "w"],
        createBorders: ["n", "s", "e", "w"],
        drawBorders: !0,
        dragEdges: !0,
        fixedSupport: !0,
        touchSupport: null,
        shade: null,
        boxWidth: 0,
        boxHeight: 0,
        boundary: 2,
        fadeTime: 400,
        animationDelay: 20,
        swingSpeed: 3,
        minSelect: [0, 0],
        maxSize: [0, 0],
        minSize: [0, 0],
        onChange: function() {
        },
        onSelect: function() {
        },
        onDblClick: function() {
        },
        onRelease: function() {
        }
    }
})(jQuery);