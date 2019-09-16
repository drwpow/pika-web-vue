function t(t) {
  return Object.prototype.toString.call(t).indexOf("Error") > -1;
}

function e(t, e) {
  return e instanceof t || e && (e.name === t.name || e._name === t._name);
}

function r(t, e) {
  for (var r in e) t[r] = e[r];

  return t;
}

var n = {
  name: "RouterView",
  functional: !0,
  props: {
    name: {
      type: String,
      default: "default"
    }
  },
  render: function (t, e) {
    var n = e.props,
        o = e.children,
        i = e.parent,
        a = e.data;
    a.routerView = !0;

    for (var c = i.$createElement, u = n.name, s = i.$route, p = i._routerViewCache || (i._routerViewCache = {}), f = 0, h = !1; i && i._routerRoot !== i;) {
      var l = i.$vnode && i.$vnode.data;
      l && (l.routerView && f++, l.keepAlive && i._inactive && (h = !0)), i = i.$parent;
    }

    if (a.routerViewDepth = f, h) return c(p[u], a, o);
    var d = s.matched[f];
    if (!d) return p[u] = null, c();
    var v = p[u] = d.components[u];
    a.registerRouteInstance = function (t, e) {
      var r = d.instances[u];
      (e && r !== t || !e && r === t) && (d.instances[u] = e);
    }, (a.hook || (a.hook = {})).prepatch = function (t, e) {
      d.instances[u] = e.componentInstance;
    }, a.hook.init = function (t) {
      t.data.keepAlive && t.componentInstance && t.componentInstance !== d.instances[u] && (d.instances[u] = t.componentInstance);
    };

    var y = a.props = function (t, e) {
      switch (typeof e) {
        case "undefined":
          return;

        case "object":
          return e;

        case "function":
          return e(t);

        case "boolean":
          return e ? t.params : void 0;
      }
    }(s, d.props && d.props[u]);

    if (y) {
      y = a.props = r({}, y);
      var m = a.attrs = a.attrs || {};

      for (var g in y) v.props && g in v.props || (m[g] = y[g], delete y[g]);
    }

    return c(v, a, o);
  }
};

var o = /[!'()*]/g,
    i = function (t) {
  return "%" + t.charCodeAt(0).toString(16);
},
    a = /%2C/g,
    c = function (t) {
  return encodeURIComponent(t).replace(o, i).replace(a, ",");
},
    u = decodeURIComponent;

function s(t) {
  var e = {};
  return (t = t.trim().replace(/^(\?|#|&)/, "")) ? (t.split("&").forEach(function (t) {
    var r = t.replace(/\+/g, " ").split("="),
        n = u(r.shift()),
        o = r.length > 0 ? u(r.join("=")) : null;
    void 0 === e[n] ? e[n] = o : Array.isArray(e[n]) ? e[n].push(o) : e[n] = [e[n], o];
  }), e) : e;
}

function p(t) {
  var e = t ? Object.keys(t).map(function (e) {
    var r = t[e];
    if (void 0 === r) return "";
    if (null === r) return c(e);

    if (Array.isArray(r)) {
      var n = [];
      return r.forEach(function (t) {
        void 0 !== t && (null === t ? n.push(c(e)) : n.push(c(e) + "=" + c(t)));
      }), n.join("&");
    }

    return c(e) + "=" + c(r);
  }).filter(function (t) {
    return t.length > 0;
  }).join("&") : null;
  return e ? "?" + e : "";
}

var f = /\/?$/;

function h(t, e, r, n) {
  var o = n && n.options.stringifyQuery,
      i = e.query || {};

  try {
    i = l(i);
  } catch (t) {}

  var a = {
    name: e.name || t && t.name,
    meta: t && t.meta || {},
    path: e.path || "/",
    hash: e.hash || "",
    query: i,
    params: e.params || {},
    fullPath: y(e, o),
    matched: t ? v(t) : []
  };
  return r && (a.redirectedFrom = y(r, o)), Object.freeze(a);
}

function l(t) {
  if (Array.isArray(t)) return t.map(l);

  if (t && "object" == typeof t) {
    var e = {};

    for (var r in t) e[r] = l(t[r]);

    return e;
  }

  return t;
}

var d = h(null, {
  path: "/"
});

function v(t) {
  for (var e = []; t;) e.unshift(t), t = t.parent;

  return e;
}

function y(t, e) {
  var r = t.path,
      n = t.query;
  void 0 === n && (n = {});
  var o = t.hash;
  return void 0 === o && (o = ""), (r || "/") + (e || p)(n) + o;
}

function m(t, e) {
  return e === d ? t === e : !!e && (t.path && e.path ? t.path.replace(f, "") === e.path.replace(f, "") && t.hash === e.hash && g(t.query, e.query) : !(!t.name || !e.name) && t.name === e.name && t.hash === e.hash && g(t.query, e.query) && g(t.params, e.params));
}

function g(t, e) {
  if (void 0 === t && (t = {}), void 0 === e && (e = {}), !t || !e) return t === e;
  var r = Object.keys(t),
      n = Object.keys(e);
  return r.length === n.length && r.every(function (r) {
    var n = t[r],
        o = e[r];
    return "object" == typeof n && "object" == typeof o ? g(n, o) : String(n) === String(o);
  });
}

function b(t, e, r) {
  var n = t.charAt(0);
  if ("/" === n) return t;
  if ("?" === n || "#" === n) return e + t;
  var o = e.split("/");
  r && o[o.length - 1] || o.pop();

  for (var i = t.replace(/^\//, "").split("/"), a = 0; a < i.length; a++) {
    var c = i[a];
    ".." === c ? o.pop() : "." !== c && o.push(c);
  }

  return "" !== o[0] && o.unshift(""), o.join("/");
}

function w(t) {
  return t.replace(/\/\//g, "/");
}

var x = Array.isArray || function (t) {
  return "[object Array]" == Object.prototype.toString.call(t);
},
    k = U,
    R = C,
    E = function (t, e) {
  return S(C(t, e));
},
    O = S,
    _ = q,
    A = new RegExp(["(\\\\.)", "([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"), "g");

function C(t, e) {
  for (var r, n = [], o = 0, i = 0, a = "", c = e && e.delimiter || "/"; null != (r = A.exec(t));) {
    var u = r[0],
        s = r[1],
        p = r.index;
    if (a += t.slice(i, p), i = p + u.length, s) a += s[1];else {
      var f = t[i],
          h = r[2],
          l = r[3],
          d = r[4],
          v = r[5],
          y = r[6],
          m = r[7];
      a && (n.push(a), a = "");
      var g = null != h && null != f && f !== h,
          b = "+" === y || "*" === y,
          w = "?" === y || "*" === y,
          x = r[2] || c,
          k = d || v;
      n.push({
        name: l || o++,
        prefix: h || "",
        delimiter: x,
        optional: w,
        repeat: b,
        partial: g,
        asterisk: !!m,
        pattern: k ? T(k) : m ? ".*" : "[^" + $(x) + "]+?"
      });
    }
  }

  return i < t.length && (a += t.substr(i)), a && n.push(a), n;
}

function j(t) {
  return encodeURI(t).replace(/[\/?#]/g, function (t) {
    return "%" + t.charCodeAt(0).toString(16).toUpperCase();
  });
}

function S(t) {
  for (var e = new Array(t.length), r = 0; r < t.length; r++) "object" == typeof t[r] && (e[r] = new RegExp("^(?:" + t[r].pattern + ")$"));

  return function (r, n) {
    for (var o = "", i = r || {}, a = (n || {}).pretty ? j : encodeURIComponent, c = 0; c < t.length; c++) {
      var u = t[c];

      if ("string" != typeof u) {
        var s,
            p = i[u.name];

        if (null == p) {
          if (u.optional) {
            u.partial && (o += u.prefix);
            continue;
          }

          throw new TypeError('Expected "' + u.name + '" to be defined');
        }

        if (x(p)) {
          if (!u.repeat) throw new TypeError('Expected "' + u.name + '" to not repeat, but received `' + JSON.stringify(p) + "`");

          if (0 === p.length) {
            if (u.optional) continue;
            throw new TypeError('Expected "' + u.name + '" to not be empty');
          }

          for (var f = 0; f < p.length; f++) {
            if (s = a(p[f]), !e[c].test(s)) throw new TypeError('Expected all "' + u.name + '" to match "' + u.pattern + '", but received `' + JSON.stringify(s) + "`");
            o += (0 === f ? u.prefix : u.delimiter) + s;
          }
        } else {
          if (s = u.asterisk ? encodeURI(p).replace(/[?#]/g, function (t) {
            return "%" + t.charCodeAt(0).toString(16).toUpperCase();
          }) : a(p), !e[c].test(s)) throw new TypeError('Expected "' + u.name + '" to match "' + u.pattern + '", but received "' + s + '"');
          o += u.prefix + s;
        }
      } else o += u;
    }

    return o;
  };
}

function $(t) {
  return t.replace(/([.+*?=^!:${}()[\]|\/\\])/g, "\\$1");
}

function T(t) {
  return t.replace(/([=!:$\/()])/g, "\\$1");
}

function P(t, e) {
  return t.keys = e, t;
}

function L(t) {
  return t.sensitive ? "" : "i";
}

function q(t, e, r) {
  x(e) || (r = e || r, e = []);

  for (var n = (r = r || {}).strict, o = !1 !== r.end, i = "", a = 0; a < t.length; a++) {
    var c = t[a];
    if ("string" == typeof c) i += $(c);else {
      var u = $(c.prefix),
          s = "(?:" + c.pattern + ")";
      e.push(c), c.repeat && (s += "(?:" + u + s + ")*"), i += s = c.optional ? c.partial ? u + "(" + s + ")?" : "(?:" + u + "(" + s + "))?" : u + "(" + s + ")";
    }
  }

  var p = $(r.delimiter || "/"),
      f = i.slice(-p.length) === p;
  return n || (i = (f ? i.slice(0, -p.length) : i) + "(?:" + p + "(?=$))?"), i += o ? "$" : n && f ? "" : "(?=" + p + "|$)", P(new RegExp("^" + i, L(r)), e);
}

function U(t, e, r) {
  return x(e) || (r = e || r, e = []), r = r || {}, t instanceof RegExp ? function (t, e) {
    var r = t.source.match(/\((?!\?)/g);
    if (r) for (var n = 0; n < r.length; n++) e.push({
      name: n,
      prefix: null,
      delimiter: null,
      optional: !1,
      repeat: !1,
      partial: !1,
      asterisk: !1,
      pattern: null
    });
    return P(t, e);
  }(t, e) : x(t) ? function (t, e, r) {
    for (var n = [], o = 0; o < t.length; o++) n.push(U(t[o], e, r).source);

    return P(new RegExp("(?:" + n.join("|") + ")", L(r)), e);
  }(t, e, r) : function (t, e, r) {
    return q(C(t, r), e, r);
  }(t, e, r);
}

k.parse = R, k.compile = E, k.tokensToFunction = O, k.tokensToRegExp = _;
var I = Object.create(null);

function M(t, e, r) {
  e = e || {};

  try {
    var n = I[t] || (I[t] = k.compile(t));
    return e.pathMatch && (e[0] = e.pathMatch), n(e, {
      pretty: !0
    });
  } catch (t) {
    return "";
  } finally {
    delete e[0];
  }
}

function B(t, e, n, o) {
  var i = "string" == typeof t ? {
    path: t
  } : t;
  if (i._normalized) return i;
  if (i.name) return r({}, t);

  if (!i.path && i.params && e) {
    (i = r({}, i))._normalized = !0;
    var a = r(r({}, e.params), i.params);
    if (e.name) i.name = e.name, i.params = a;else if (e.matched.length) {
      var c = e.matched[e.matched.length - 1].path;
      i.path = M(c, a, e.path);
    }
    return i;
  }

  var u = function (t) {
    var e = "",
        r = "",
        n = t.indexOf("#");
    n >= 0 && (e = t.slice(n), t = t.slice(0, n));
    var o = t.indexOf("?");
    return o >= 0 && (r = t.slice(o + 1), t = t.slice(0, o)), {
      path: t,
      query: r,
      hash: e
    };
  }(i.path || ""),
      p = e && e.path || "/",
      f = u.path ? b(u.path, p, n || i.append) : p,
      h = function (t, e, r) {
    void 0 === e && (e = {});
    var n,
        o = r || s;

    try {
      n = o(t || "");
    } catch (t) {
      n = {};
    }

    for (var i in e) n[i] = e[i];

    return n;
  }(u.query, i.query, o && o.options.parseQuery),
      l = i.hash || u.hash;

  return l && "#" !== l.charAt(0) && (l = "#" + l), {
    _normalized: !0,
    path: f,
    query: h,
    hash: l
  };
}

var V,
    H = [String, Object],
    z = [String, Array],
    D = function () {},
    F = {
  name: "RouterLink",
  props: {
    to: {
      type: H,
      required: !0
    },
    tag: {
      type: String,
      default: "a"
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: z,
      default: "click"
    }
  },
  render: function (t) {
    var e = this,
        n = this.$router,
        o = this.$route,
        i = n.resolve(this.to, o, this.append),
        a = i.location,
        c = i.route,
        u = i.href,
        s = {},
        p = n.options.linkActiveClass,
        l = n.options.linkExactActiveClass,
        d = null == p ? "router-link-active" : p,
        v = null == l ? "router-link-exact-active" : l,
        y = null == this.activeClass ? d : this.activeClass,
        g = null == this.exactActiveClass ? v : this.exactActiveClass,
        b = c.redirectedFrom ? h(null, B(c.redirectedFrom), null, n) : c;
    s[g] = m(o, b), s[y] = this.exact ? s[g] : function (t, e) {
      return 0 === t.path.replace(f, "/").indexOf(e.path.replace(f, "/")) && (!e.hash || t.hash === e.hash) && function (t, e) {
        for (var r in e) if (!(r in t)) return !1;

        return !0;
      }(t.query, e.query);
    }(o, b);

    var w = function (t) {
      N(t) && (e.replace ? n.replace(a, D) : n.push(a, D));
    },
        x = {
      click: N
    };

    Array.isArray(this.event) ? this.event.forEach(function (t) {
      x[t] = w;
    }) : x[this.event] = w;
    var k = {
      class: s
    },
        R = !this.$scopedSlots.$hasNormal && this.$scopedSlots.default && this.$scopedSlots.default({
      href: u,
      route: c,
      navigate: w,
      isActive: s[y],
      isExactActive: s[g]
    });

    if (R) {
      if (1 === R.length) return R[0];
      if (R.length > 1 || !R.length) return 0 === R.length ? t() : t("span", {}, R);
    }

    if ("a" === this.tag) k.on = x, k.attrs = {
      href: u
    };else {
      var E = function t(e) {
        if (e) for (var r, n = 0; n < e.length; n++) {
          if ("a" === (r = e[n]).tag) return r;
          if (r.children && (r = t(r.children))) return r;
        }
      }(this.$slots.default);

      if (E) {
        E.isStatic = !1;
        var O = E.data = r({}, E.data);

        for (var _ in O.on = O.on || {}, O.on) {
          var A = O.on[_];
          _ in x && (O.on[_] = Array.isArray(A) ? A : [A]);
        }

        for (var C in x) C in O.on ? O.on[C].push(x[C]) : O.on[C] = w;

        (E.data.attrs = r({}, E.data.attrs)).href = u;
      } else k.on = x;
    }
    return t(this.tag, k, this.$slots.default);
  }
};

function N(t) {
  if (!(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey || t.defaultPrevented || void 0 !== t.button && 0 !== t.button)) {
    if (t.currentTarget && t.currentTarget.getAttribute) {
      var e = t.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(e)) return;
    }

    return t.preventDefault && t.preventDefault(), !0;
  }
}

var K = "undefined" != typeof window;

function J(t, e, r, n) {
  var o = e || [],
      i = r || Object.create(null),
      a = n || Object.create(null);
  t.forEach(function (t) {
    !function t(e, r, n, o, i, a) {
      var c = o.path;
      var u = o.name;
      var s = o.pathToRegexpOptions || {};

      var p = function (t, e, r) {
        r || (t = t.replace(/\/$/, ""));
        if ("/" === t[0]) return t;
        if (null == e) return t;
        return w(e.path + "/" + t);
      }(c, i, s.strict);

      "boolean" == typeof o.caseSensitive && (s.sensitive = o.caseSensitive);
      var f = {
        path: p,
        regex: Q(p, s),
        components: o.components || {
          default: o.component
        },
        instances: {},
        name: u,
        parent: i,
        matchAs: a,
        redirect: o.redirect,
        beforeEnter: o.beforeEnter,
        meta: o.meta || {},
        props: null == o.props ? {} : o.components ? o.props : {
          default: o.props
        }
      };
      o.children && o.children.forEach(function (o) {
        var i = a ? w(a + "/" + o.path) : void 0;
        t(e, r, n, o, f, i);
      });
      r[f.path] || (e.push(f.path), r[f.path] = f);
      if (void 0 !== o.alias) for (var h = Array.isArray(o.alias) ? o.alias : [o.alias], l = 0; l < h.length; ++l) {
        var d = {
          path: h[l],
          children: o.children
        };
        t(e, r, n, d, i, f.path || "/");
      }
      u && (n[u] || (n[u] = f));
    }(o, i, a, t);
  });

  for (var c = 0, u = o.length; c < u; c++) "*" === o[c] && (o.push(o.splice(c, 1)[0]), u--, c--);

  return {
    pathList: o,
    pathMap: i,
    nameMap: a
  };
}

function Q(t, e) {
  return k(t, [], e);
}

function X(t, e) {
  var r = J(t),
      n = r.pathList,
      o = r.pathMap,
      i = r.nameMap;

  function a(t, r, a) {
    var c = B(t, r, !1, e),
        s = c.name;

    if (s) {
      var p = i[s];
      if (!p) return u(null, c);
      var f = p.regex.keys.filter(function (t) {
        return !t.optional;
      }).map(function (t) {
        return t.name;
      });
      if ("object" != typeof c.params && (c.params = {}), r && "object" == typeof r.params) for (var h in r.params) !(h in c.params) && f.indexOf(h) > -1 && (c.params[h] = r.params[h]);
      return c.path = M(p.path, c.params), u(p, c, a);
    }

    if (c.path) {
      c.params = {};

      for (var l = 0; l < n.length; l++) {
        var d = n[l],
            v = o[d];
        if (Y(v.regex, c.path, c.params)) return u(v, c, a);
      }
    }

    return u(null, c);
  }

  function c(t, r) {
    var n = t.redirect,
        o = "function" == typeof n ? n(h(t, r, null, e)) : n;
    if ("string" == typeof o && (o = {
      path: o
    }), !o || "object" != typeof o) return u(null, r);
    var c = o,
        s = c.name,
        p = c.path,
        f = r.query,
        l = r.hash,
        d = r.params;

    if (f = c.hasOwnProperty("query") ? c.query : f, l = c.hasOwnProperty("hash") ? c.hash : l, d = c.hasOwnProperty("params") ? c.params : d, s) {
      i[s];
      return a({
        _normalized: !0,
        name: s,
        query: f,
        hash: l,
        params: d
      }, void 0, r);
    }

    return p ? a({
      _normalized: !0,
      path: M(function (t, e) {
        return b(t, e.parent ? e.parent.path : "/", !0);
      }(p, t), d),
      query: f,
      hash: l
    }, void 0, r) : u(null, r);
  }

  function u(t, r, n) {
    return t && t.redirect ? c(t, n || r) : t && t.matchAs ? function (t, e, r) {
      var n = a({
        _normalized: !0,
        path: M(r, e.params)
      });

      if (n) {
        var o = n.matched,
            i = o[o.length - 1];
        return e.params = n.params, u(i, e);
      }

      return u(null, e);
    }(0, r, t.matchAs) : h(t, r, n, e);
  }

  return {
    match: a,
    addRoutes: function (t) {
      J(t, n, o, i);
    }
  };
}

function Y(t, e, r) {
  var n = e.match(t);
  if (!n) return !1;
  if (!r) return !0;

  for (var o = 1, i = n.length; o < i; ++o) {
    var a = t.keys[o - 1],
        c = "string" == typeof n[o] ? decodeURIComponent(n[o]) : n[o];
    a && (r[a.name || "pathMatch"] = c);
  }

  return !0;
}

var W = K && window.performance && window.performance.now ? window.performance : Date;

function G() {
  return W.now().toFixed(3);
}

var Z = G();

function tt() {
  return Z;
}

function et(t) {
  return Z = t;
}

var rt = Object.create(null);

function nt() {
  var t = window.location.protocol + "//" + window.location.host,
      e = window.location.href.replace(t, "");
  window.history.replaceState({
    key: tt()
  }, "", e), window.addEventListener("popstate", function (t) {
    it(), t.state && t.state.key && et(t.state.key);
  });
}

function ot(t, e, r, n) {
  if (t.app) {
    var o = t.options.scrollBehavior;
    o && t.app.$nextTick(function () {
      var i = function () {
        var t = tt();
        if (t) return rt[t];
      }(),
          a = o.call(t, e, r, n ? i : null);

      a && ("function" == typeof a.then ? a.then(function (t) {
        pt(t, i);
      }).catch(function (t) {}) : pt(a, i));
    });
  }
}

function it() {
  var t = tt();
  t && (rt[t] = {
    x: window.pageXOffset,
    y: window.pageYOffset
  });
}

function at(t) {
  return ut(t.x) || ut(t.y);
}

function ct(t) {
  return {
    x: ut(t.x) ? t.x : window.pageXOffset,
    y: ut(t.y) ? t.y : window.pageYOffset
  };
}

function ut(t) {
  return "number" == typeof t;
}

var st = /^#\d/;

function pt(t, e) {
  var r,
      n = "object" == typeof t;

  if (n && "string" == typeof t.selector) {
    var o = st.test(t.selector) ? document.getElementById(t.selector.slice(1)) : document.querySelector(t.selector);

    if (o) {
      var i = t.offset && "object" == typeof t.offset ? t.offset : {};

      e = function (t, e) {
        var r = document.documentElement.getBoundingClientRect(),
            n = t.getBoundingClientRect();
        return {
          x: n.left - r.left - e.x,
          y: n.top - r.top - e.y
        };
      }(o, i = {
        x: ut((r = i).x) ? r.x : 0,
        y: ut(r.y) ? r.y : 0
      });
    } else at(t) && (e = ct(t));
  } else n && at(t) && (e = ct(t));

  e && window.scrollTo(e.x, e.y);
}

var ft,
    ht = K && (-1 === (ft = window.navigator.userAgent).indexOf("Android 2.") && -1 === ft.indexOf("Android 4.0") || -1 === ft.indexOf("Mobile Safari") || -1 !== ft.indexOf("Chrome") || -1 !== ft.indexOf("Windows Phone")) && window.history && "pushState" in window.history;

function lt(t, e) {
  it();
  var r = window.history;

  try {
    e ? r.replaceState({
      key: tt()
    }, "", t) : r.pushState({
      key: et(G())
    }, "", t);
  } catch (r) {
    window.location[e ? "replace" : "assign"](t);
  }
}

function dt(t) {
  lt(t, !0);
}

function vt(t, e, r) {
  !function n(o) {
    o >= t.length ? r() : t[o] ? e(t[o], function () {
      n(o + 1);
    }) : n(o + 1);
  }(0);
}

function yt(e) {
  return function (r, n, o) {
    var i = !1,
        a = 0,
        c = null;
    mt(e, function (e, r, n, u) {
      if ("function" == typeof e && void 0 === e.cid) {
        i = !0, a++;
        var s,
            p = wt(function (t) {
          var r;
          ((r = t).__esModule || bt && "Module" === r[Symbol.toStringTag]) && (t = t.default), e.resolved = "function" == typeof t ? t : V.extend(t), n.components[u] = t, --a <= 0 && o();
        }),
            f = wt(function (e) {
          var r = "Failed to resolve async component " + u + ": " + e;
          c || (c = t(e) ? e : new Error(r), o(c));
        });

        try {
          s = e(p, f);
        } catch (t) {
          f(t);
        }

        if (s) if ("function" == typeof s.then) s.then(p, f);else {
          var h = s.component;
          h && "function" == typeof h.then && h.then(p, f);
        }
      }
    }), i || o();
  };
}

function mt(t, e) {
  return gt(t.map(function (t) {
    return Object.keys(t.components).map(function (r) {
      return e(t.components[r], t.instances[r], t, r);
    });
  }));
}

function gt(t) {
  return Array.prototype.concat.apply([], t);
}

var bt = "function" == typeof Symbol && "symbol" == typeof Symbol.toStringTag;

function wt(t) {
  var e = !1;
  return function () {
    for (var r = [], n = arguments.length; n--;) r[n] = arguments[n];

    if (!e) return e = !0, t.apply(this, r);
  };
}

var xt = function (t) {
  function e(e) {
    t.call(this), this.name = this._name = "NavigationDuplicated", this.message = 'Navigating to current location ("' + e.fullPath + '") is not allowed', Object.defineProperty(this, "stack", {
      value: new t().stack,
      writable: !0,
      configurable: !0
    });
  }

  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e;
}(Error);

xt._name = "NavigationDuplicated";

var kt = function (t, e) {
  this.router = t, this.base = function (t) {
    if (!t) if (K) {
      var e = document.querySelector("base");
      t = (t = e && e.getAttribute("href") || "/").replace(/^https?:\/\/[^\/]+/, "");
    } else t = "/";
    "/" !== t.charAt(0) && (t = "/" + t);
    return t.replace(/\/$/, "");
  }(e), this.current = d, this.pending = null, this.ready = !1, this.readyCbs = [], this.readyErrorCbs = [], this.errorCbs = [];
};

function Rt(t, e, r, n) {
  var o = mt(t, function (t, n, o, i) {
    var a = function (t, e) {
      "function" != typeof t && (t = V.extend(t));
      return t.options[e];
    }(t, e);

    if (a) return Array.isArray(a) ? a.map(function (t) {
      return r(t, n, o, i);
    }) : r(a, n, o, i);
  });
  return gt(n ? o.reverse() : o);
}

function Et(t, e) {
  if (e) return function () {
    return t.apply(e, arguments);
  };
}

kt.prototype.listen = function (t) {
  this.cb = t;
}, kt.prototype.onReady = function (t, e) {
  this.ready ? t() : (this.readyCbs.push(t), e && this.readyErrorCbs.push(e));
}, kt.prototype.onError = function (t) {
  this.errorCbs.push(t);
}, kt.prototype.transitionTo = function (t, e, r) {
  var n = this,
      o = this.router.match(t, this.current);
  this.confirmTransition(o, function () {
    n.updateRoute(o), e && e(o), n.ensureURL(), n.ready || (n.ready = !0, n.readyCbs.forEach(function (t) {
      t(o);
    }));
  }, function (t) {
    r && r(t), t && !n.ready && (n.ready = !0, n.readyErrorCbs.forEach(function (e) {
      e(t);
    }));
  });
}, kt.prototype.confirmTransition = function (r, n, o) {
  var i = this,
      a = this.current,
      c = function (r) {
    !e(xt, r) && t(r) && (i.errorCbs.length ? i.errorCbs.forEach(function (t) {
      t(r);
    }) : console.error(r)), o && o(r);
  };

  if (m(r, a) && r.matched.length === a.matched.length) return this.ensureURL(), c(new xt(r));

  var u = function (t, e) {
    var r,
        n = Math.max(t.length, e.length);

    for (r = 0; r < n && t[r] === e[r]; r++);

    return {
      updated: e.slice(0, r),
      activated: e.slice(r),
      deactivated: t.slice(r)
    };
  }(this.current.matched, r.matched),
      s = u.updated,
      p = u.deactivated,
      f = u.activated,
      h = [].concat(function (t) {
    return Rt(t, "beforeRouteLeave", Et, !0);
  }(p), this.router.beforeHooks, function (t) {
    return Rt(t, "beforeRouteUpdate", Et);
  }(s), f.map(function (t) {
    return t.beforeEnter;
  }), yt(f));

  this.pending = r;

  var l = function (e, n) {
    if (i.pending !== r) return c();

    try {
      e(r, a, function (e) {
        !1 === e || t(e) ? (i.ensureURL(!0), c(e)) : "string" == typeof e || "object" == typeof e && ("string" == typeof e.path || "string" == typeof e.name) ? (c(), "object" == typeof e && e.replace ? i.replace(e) : i.push(e)) : n(e);
      });
    } catch (t) {
      c(t);
    }
  };

  vt(h, l, function () {
    var t = [];
    vt(function (t, e, r) {
      return Rt(t, "beforeRouteEnter", function (t, n, o, i) {
        return function (t, e, r, n, o) {
          return function (i, a, c) {
            return t(i, a, function (t) {
              "function" == typeof t && n.push(function () {
                !function t(e, r, n, o) {
                  r[n] && !r[n]._isBeingDestroyed ? e(r[n]) : o() && setTimeout(function () {
                    t(e, r, n, o);
                  }, 16);
                }(t, e.instances, r, o);
              }), c(t);
            });
          };
        }(t, o, i, e, r);
      });
    }(f, t, function () {
      return i.current === r;
    }).concat(i.router.resolveHooks), l, function () {
      if (i.pending !== r) return c();
      i.pending = null, n(r), i.router.app && i.router.app.$nextTick(function () {
        t.forEach(function (t) {
          t();
        });
      });
    });
  });
}, kt.prototype.updateRoute = function (t) {
  var e = this.current;
  this.current = t, this.cb && this.cb(t), this.router.afterHooks.forEach(function (r) {
    r && r(t, e);
  });
};

var Ot = function (t) {
  function e(e, r) {
    var n = this;
    t.call(this, e, r);
    var o = e.options.scrollBehavior,
        i = ht && o;
    i && nt();

    var a = _t(this.base);

    window.addEventListener("popstate", function (t) {
      var r = n.current,
          o = _t(n.base);

      n.current === d && o === a || n.transitionTo(o, function (t) {
        i && ot(e, t, r, !0);
      });
    });
  }

  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.go = function (t) {
    window.history.go(t);
  }, e.prototype.push = function (t, e, r) {
    var n = this,
        o = this.current;
    this.transitionTo(t, function (t) {
      lt(w(n.base + t.fullPath)), ot(n.router, t, o, !1), e && e(t);
    }, r);
  }, e.prototype.replace = function (t, e, r) {
    var n = this,
        o = this.current;
    this.transitionTo(t, function (t) {
      dt(w(n.base + t.fullPath)), ot(n.router, t, o, !1), e && e(t);
    }, r);
  }, e.prototype.ensureURL = function (t) {
    if (_t(this.base) !== this.current.fullPath) {
      var e = w(this.base + this.current.fullPath);
      t ? lt(e) : dt(e);
    }
  }, e.prototype.getCurrentLocation = function () {
    return _t(this.base);
  }, e;
}(kt);

function _t(t) {
  var e = decodeURI(window.location.pathname);
  return t && 0 === e.indexOf(t) && (e = e.slice(t.length)), (e || "/") + window.location.search + window.location.hash;
}

var At = function (t) {
  function e(e, r, n) {
    t.call(this, e, r), n && function (t) {
      var e = _t(t);

      if (!/^\/#/.test(e)) return window.location.replace(w(t + "/#" + e)), !0;
    }(this.base) || Ct();
  }

  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.setupListeners = function () {
    var t = this,
        e = this.router.options.scrollBehavior,
        r = ht && e;
    r && nt(), window.addEventListener(ht ? "popstate" : "hashchange", function () {
      var e = t.current;
      Ct() && t.transitionTo(jt(), function (n) {
        r && ot(t.router, n, e, !0), ht || Tt(n.fullPath);
      });
    });
  }, e.prototype.push = function (t, e, r) {
    var n = this,
        o = this.current;
    this.transitionTo(t, function (t) {
      $t(t.fullPath), ot(n.router, t, o, !1), e && e(t);
    }, r);
  }, e.prototype.replace = function (t, e, r) {
    var n = this,
        o = this.current;
    this.transitionTo(t, function (t) {
      Tt(t.fullPath), ot(n.router, t, o, !1), e && e(t);
    }, r);
  }, e.prototype.go = function (t) {
    window.history.go(t);
  }, e.prototype.ensureURL = function (t) {
    var e = this.current.fullPath;
    jt() !== e && (t ? $t(e) : Tt(e));
  }, e.prototype.getCurrentLocation = function () {
    return jt();
  }, e;
}(kt);

function Ct() {
  var t = jt();
  return "/" === t.charAt(0) || (Tt("/" + t), !1);
}

function jt() {
  var t = window.location.href,
      e = t.indexOf("#");
  if (e < 0) return "";
  var r = (t = t.slice(e + 1)).indexOf("?");

  if (r < 0) {
    var n = t.indexOf("#");
    t = n > -1 ? decodeURI(t.slice(0, n)) + t.slice(n) : decodeURI(t);
  } else r > -1 && (t = decodeURI(t.slice(0, r)) + t.slice(r));

  return t;
}

function St(t) {
  var e = window.location.href,
      r = e.indexOf("#");
  return (r >= 0 ? e.slice(0, r) : e) + "#" + t;
}

function $t(t) {
  ht ? lt(St(t)) : window.location.hash = t;
}

function Tt(t) {
  ht ? dt(St(t)) : window.location.replace(St(t));
}

var Pt = function (t) {
  function r(e, r) {
    t.call(this, e, r), this.stack = [], this.index = -1;
  }

  return t && (r.__proto__ = t), r.prototype = Object.create(t && t.prototype), r.prototype.constructor = r, r.prototype.push = function (t, e, r) {
    var n = this;
    this.transitionTo(t, function (t) {
      n.stack = n.stack.slice(0, n.index + 1).concat(t), n.index++, e && e(t);
    }, r);
  }, r.prototype.replace = function (t, e, r) {
    var n = this;
    this.transitionTo(t, function (t) {
      n.stack = n.stack.slice(0, n.index).concat(t), e && e(t);
    }, r);
  }, r.prototype.go = function (t) {
    var r = this,
        n = this.index + t;

    if (!(n < 0 || n >= this.stack.length)) {
      var o = this.stack[n];
      this.confirmTransition(o, function () {
        r.index = n, r.updateRoute(o);
      }, function (t) {
        e(xt, t) && (r.index = n);
      });
    }
  }, r.prototype.getCurrentLocation = function () {
    var t = this.stack[this.stack.length - 1];
    return t ? t.fullPath : "/";
  }, r.prototype.ensureURL = function () {}, r;
}(kt),
    Lt = function (t) {
  void 0 === t && (t = {}), this.app = null, this.apps = [], this.options = t, this.beforeHooks = [], this.resolveHooks = [], this.afterHooks = [], this.matcher = X(t.routes || [], this);
  var e = t.mode || "hash";

  switch (this.fallback = "history" === e && !ht && !1 !== t.fallback, this.fallback && (e = "hash"), K || (e = "abstract"), this.mode = e, e) {
    case "history":
      this.history = new Ot(this, t.base);
      break;

    case "hash":
      this.history = new At(this, t.base, this.fallback);
      break;

    case "abstract":
      this.history = new Pt(this, t.base);
  }
},
    qt = {
  currentRoute: {
    configurable: !0
  }
};

function Ut(t, e) {
  return t.push(e), function () {
    var r = t.indexOf(e);
    r > -1 && t.splice(r, 1);
  };
}

Lt.prototype.match = function (t, e, r) {
  return this.matcher.match(t, e, r);
}, qt.currentRoute.get = function () {
  return this.history && this.history.current;
}, Lt.prototype.init = function (t) {
  var e = this;

  if (this.apps.push(t), t.$once("hook:destroyed", function () {
    var r = e.apps.indexOf(t);
    r > -1 && e.apps.splice(r, 1), e.app === t && (e.app = e.apps[0] || null);
  }), !this.app) {
    this.app = t;
    var r = this.history;
    if (r instanceof Ot) r.transitionTo(r.getCurrentLocation());else if (r instanceof At) {
      var n = function () {
        r.setupListeners();
      };

      r.transitionTo(r.getCurrentLocation(), n, n);
    }
    r.listen(function (t) {
      e.apps.forEach(function (e) {
        e._route = t;
      });
    });
  }
}, Lt.prototype.beforeEach = function (t) {
  return Ut(this.beforeHooks, t);
}, Lt.prototype.beforeResolve = function (t) {
  return Ut(this.resolveHooks, t);
}, Lt.prototype.afterEach = function (t) {
  return Ut(this.afterHooks, t);
}, Lt.prototype.onReady = function (t, e) {
  this.history.onReady(t, e);
}, Lt.prototype.onError = function (t) {
  this.history.onError(t);
}, Lt.prototype.push = function (t, e, r) {
  var n = this;
  if (!e && !r && "undefined" != typeof Promise) return new Promise(function (e, r) {
    n.history.push(t, e, r);
  });
  this.history.push(t, e, r);
}, Lt.prototype.replace = function (t, e, r) {
  var n = this;
  if (!e && !r && "undefined" != typeof Promise) return new Promise(function (e, r) {
    n.history.replace(t, e, r);
  });
  this.history.replace(t, e, r);
}, Lt.prototype.go = function (t) {
  this.history.go(t);
}, Lt.prototype.back = function () {
  this.go(-1);
}, Lt.prototype.forward = function () {
  this.go(1);
}, Lt.prototype.getMatchedComponents = function (t) {
  var e = t ? t.matched ? t : this.resolve(t).route : this.currentRoute;
  return e ? [].concat.apply([], e.matched.map(function (t) {
    return Object.keys(t.components).map(function (e) {
      return t.components[e];
    });
  })) : [];
}, Lt.prototype.resolve = function (t, e, r) {
  var n = B(t, e = e || this.history.current, r, this),
      o = this.match(n, e),
      i = o.redirectedFrom || o.fullPath;
  return {
    location: n,
    route: o,
    href: function (t, e, r) {
      var n = "hash" === r ? "#" + e : e;
      return t ? w(t + "/" + n) : n;
    }(this.history.base, i, this.mode),
    normalizedTo: n,
    resolved: o
  };
}, Lt.prototype.addRoutes = function (t) {
  this.matcher.addRoutes(t), this.history.current !== d && this.history.transitionTo(this.history.getCurrentLocation());
}, Object.defineProperties(Lt.prototype, qt), Lt.install = function t(e) {
  if (!t.installed || V !== e) {
    t.installed = !0, V = e;

    var r = function (t) {
      return void 0 !== t;
    },
        o = function (t, e) {
      var n = t.$options._parentVnode;
      r(n) && r(n = n.data) && r(n = n.registerRouteInstance) && n(t, e);
    };

    e.mixin({
      beforeCreate: function () {
        r(this.$options.router) ? (this._routerRoot = this, this._router = this.$options.router, this._router.init(this), e.util.defineReactive(this, "_route", this._router.history.current)) : this._routerRoot = this.$parent && this.$parent._routerRoot || this, o(this, this);
      },
      destroyed: function () {
        o(this);
      }
    }), Object.defineProperty(e.prototype, "$router", {
      get: function () {
        return this._routerRoot._router;
      }
    }), Object.defineProperty(e.prototype, "$route", {
      get: function () {
        return this._routerRoot._route;
      }
    }), e.component("RouterView", n), e.component("RouterLink", F);
    var i = e.config.optionMergeStrategies;
    i.beforeRouteEnter = i.beforeRouteLeave = i.beforeRouteUpdate = i.created;
  }
}, Lt.version = "3.1.3", K && window.Vue && window.Vue.use(Lt);
export default Lt;