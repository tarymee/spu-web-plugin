function Ut() {
  return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}
function be() {
  return Ut() + Ut() + "-" + Ut() + "-" + Ut() + "-" + Ut() + "-" + Ut() + Ut() + Ut();
}
function $s() {
  return be().replace(/-/g, "").slice(0, 16);
}
function Js(n) {
  let e = n > 0 ? new Date(n) : new Date(), s = e.getDate() < 10 ? "0" + e.getDate() : e.getDate(), r = e.getMonth() < 9 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1, i = e.getFullYear(), a = e.getHours() < 10 ? "0" + e.getHours() : e.getHours(), u = e.getMinutes() < 10 ? "0" + e.getMinutes() : e.getMinutes(), l = e.getSeconds() < 10 ? "0" + e.getSeconds() : e.getSeconds(), w = e.getMilliseconds() < 10 ? "0" + e.getMilliseconds() : e.getMilliseconds();
  return w < 100 && (w = "0" + w), {
    time: +e,
    year: i,
    month: r,
    day: s,
    hour: a,
    minute: u,
    second: l,
    millisecond: w
  };
}
function Gs(n) {
  return Object.prototype.toString.call(n) === "[object Number]";
}
function Xs(n) {
  return typeof n == "bigint";
}
function Je(n) {
  return typeof n == "string";
}
function Et(n) {
  return Object.prototype.toString.call(n) === "[object Array]";
}
function Gr(n) {
  return typeof n == "boolean";
}
function Xr(n) {
  return n === void 0;
}
function Wr(n) {
  return n === null;
}
function qn(n) {
  return typeof n == "symbol";
}
function Yt(n) {
  return Object.prototype.toString.call(n) === "[object Object]" || !Gs(n) && !Xs(n) && !Je(n) && !Gr(n) && !Et(n) && !Wr(n) && !Ws(n) && !Xr(n) && !qn(n);
}
function Ws(n) {
  return typeof n == "function";
}
function Qr(n) {
  const e = Object.prototype.toString.call(n);
  return e === "[object Window]" || e === "[object DOMWindow]" || e === "[object global]";
}
function Vr(n) {
  return n == null || typeof n == "string" || typeof n == "boolean" || typeof n == "number" || typeof n == "function" || typeof n == "symbol" || typeof n == "bigint" ? !1 : typeof Symbol < "u" && typeof n[Symbol.iterator] == "function";
}
function Kr(n) {
  return Object.prototype.toString.call(n).replace(/\[object (.*)\]/, "$1");
}
function Zr(n) {
  let e = Object.prototype.hasOwnProperty;
  if (!n || typeof n != "object" || n.nodeType || Qr(n))
    return !1;
  try {
    if (n.constructor && !e.call(n, "constructor") && !e.call(n.constructor.prototype, "isPrototypeOf"))
      return !1;
  } catch {
    return !1;
  }
  let s;
  for (s in n)
    ;
  return s === void 0 || e.call(n, s);
}
const Yr = /[\n\t]/g, ti = (n) => ({ "\n": "\\n", "	": "\\t" })[n];
function ei(n) {
  return typeof n != "string" ? n : String(n).replace(
    Yr,
    ti
  );
}
const ni = () => {
  const n = /* @__PURE__ */ new WeakSet();
  return (e) => {
    if (typeof e == "object" && e !== null) {
      if (n.has(e))
        return !0;
      n.add(e);
    }
    return !1;
  };
}, _s = (n, e = 0) => {
  let s = "";
  return Je(n) ? (e > 0 && (n = Qs(n, e)), s += '"' + ei(n) + '"') : qn(n) ? s += String(n).replace(/^Symbol\((.*)\)$/i, 'Symbol("$1")') : Ws(n) ? s += (n.name || "function") + "()" : Xs(n) ? s += String(n) + "n" : s += String(n), s;
}, An = (n, e, s = 0) => {
  var r, i;
  if (!Yt(n) && !Et(n)) {
    e.ret += _s(n, e.keyMaxLen);
    return;
  }
  if (e.circularFinder(n)) {
    let f = "";
    Et(n) ? f = "(Circular Array)" : Yt(n) && (f = `(Circular ${((r = n.constructor) == null ? void 0 : r.name) || "Object"})`), e.ret += e.standardJSON ? `"${f}"` : f;
    return;
  }
  let a = "", u = "";
  if (e.pretty) {
    for (let f = 0; f <= s; f++)
      a += "  ";
    u = `
`;
  }
  let l = "{", w = "}";
  Et(n) && (l = "[", w = "]"), e.ret += l + u;
  const p = ri(n);
  for (let f = 0; f < p.length; f++) {
    const v = p[f];
    e.ret += a;
    try {
      Et(n) || (Yt(v) || Et(v) || qn(v) ? e.ret += Object.prototype.toString.call(v) : Je(v) && e.standardJSON ? e.ret += '"' + v + '"' : e.ret += v, e.ret += ": ");
    } catch {
      continue;
    }
    try {
      const h = n[v];
      Et(h) ? e.maxDepth > -1 && s >= e.maxDepth ? e.ret += "Array(" + h.length + ")" : An(h, e, s + 1) : Yt(h) ? e.maxDepth > -1 && s >= e.maxDepth ? e.ret += (((i = h.constructor) == null ? void 0 : i.name) || "Object") + " {}" : An(h, e, s + 1) : e.ret += _s(h, e.keyMaxLen);
    } catch {
      e.ret += e.standardJSON ? '"(PARSE_ERROR)"' : "(PARSE_ERROR)";
    }
    if (e.keyMaxLen > 0 && e.ret.length >= e.keyMaxLen * 10) {
      e.ret += ", (...)";
      break;
    }
    f < p.length - 1 && (e.ret += ", "), e.ret += u;
  }
  e.ret += a.substring(0, a.length - 2) + w;
};
function vs(n, e = {
  maxDepth: -1,
  keyMaxLen: -1,
  pretty: !1,
  standardJSON: !1
}) {
  const s = Object.assign(
    {
      ret: "",
      maxDepth: -1,
      keyMaxLen: -1,
      pretty: !1,
      standardJSON: !1,
      circularFinder: ni()
    },
    e
  );
  return An(n, s), s.ret;
}
function si(n) {
  try {
    return self.Blob ? new self.Blob([n], { type: "text/plain" }).size : encodeURI(n).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length - 1;
  } catch {
    return 0;
  }
}
function je(n) {
  return n <= 0 ? "" : n >= 1e3 * 1e3 ? (n / 1e3 / 1e3).toFixed(1) + " MB" : n >= 1e3 * 1 ? (n / 1e3).toFixed(1) + " KB" : n + " B";
}
function Qs(n, e) {
  return n.length > e && (n = n.substring(0, e) + `...(${je(si(n))})`), n;
}
function ri(n) {
  return !Yt(n) && !Et(n) ? [] : Object.keys(n);
}
function ii(n = [], e = 1024 * 1024) {
  if (!n.length)
    return [];
  if (JSON.stringify(n).length <= e)
    return [n];
  let s = [], r = [], i = 0;
  for (let a = 0; a < n.length; a++) {
    const u = n[a], l = JSON.stringify(u).length;
    i + l < e ? (r.push(u), i += l) : r.length ? (s.push(r), r = [u], i = l) : (s.push([u]), i = 0);
  }
  return s;
}
const ai = (n) => typeof n == "object" ? (n.config && n.request && (n.config = void 0, n.request = void 0), n.status !== void 0 ? n.data ? (n.detail = typeof n.data == "object" ? JSON.stringify(n.data) : n.data, n = new Error(n.detail)) : n.body ? (n.detail = typeof n.body == "object" ? JSON.stringify(n.body) : n.body, n = new Error(n.detail)) : (n.message = `${n.statusText || n.bodyText || ""}`, n = new Error(n.message)) : n = new Error(JSON.stringify(n)), n) : new Error(n), $n = (n) => {
  var e;
  let s = null;
  n ? n && n instanceof Error ? s = n : s = ai(n) : (n = new Error("error"), s = n);
  const r = {
    message: "",
    detail: "",
    name: "",
    stack: []
  };
  if (r.message = s.message, r.name = s.name, r.detail = ((e = s.stack) == null ? void 0 : e.toString()) || s.message, s.stack) {
    let i = s.stack.split(/\n\s+at/);
    i.length && (i = i.slice(1)), r.stack = i;
  }
  return r;
}, On = (n) => new Promise((e) => {
  setTimeout(() => {
    e(void 0), n && n();
  }, 0);
}), we = () => {
  if (typeof wx < "u" && !window) {
    const n = getCurrentPages();
    return n.length ? n[n.length - 1].route : "applaunch";
  } else
    return window.location.href;
};
var oi = Object.defineProperty, ci = (n, e, s) => e in n ? oi(n, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : n[e] = s, I = (n, e, s) => (ci(n, typeof e != "symbol" ? e + "" : e, s), s);
class ui {
  constructor(e) {
    I(this, "limit"), I(this, "runningSize"), I(this, "taskList"), this.limit = e, this.taskList = [], this.runningSize = 0;
  }
  addTask(e) {
    this.taskList.push(e), this.run();
  }
  async run() {
    for (; this.taskList.length && this.runningSize < this.limit; ) {
      const e = this.taskList.shift();
      e && (this.runningSize++, await e(), this.runningSize--, this.run());
    }
  }
}
var Vs = /* @__PURE__ */ ((n) => (n[n.NORMAL = 0] = "NORMAL", n[n.HIGH = 1] = "HIGH", n[n.EMERGEN = 2] = "EMERGEN", n))(Vs || {});
class at {
  constructor(e, s, r) {
    I(this, "_level", 0), this.apaasTrack = e, this.type = s, r && (this._level = r);
  }
  getProperties() {
    return {};
  }
  setProperties(e) {
  }
  getEventLog(e) {
    const s = e || Date.now();
    return {
      ...this.apaasTrack.baseLog,
      types: this.type,
      logtime: String(s),
      epochnanos: String(s) + "000000",
      event: this.type,
      properties: this.getProperties(),
      url: we()
    };
  }
}
I(at, "eventOptions"), I(at, "initApaasTrackHook"), I(at, "startApaasTrackHook"), I(at, "destroyApaasTrackHook");
class hi extends at {
  constructor(e) {
    super(e, "init");
  }
  getProperties() {
    const e = this.apaasTrack.baseLog;
    return {
      system: e.system || "",
      systemver: e.systemver || "",
      manufacturer: e.manufacturer || "",
      browser: e.browser || "",
      browserver: e.browserver || "",
      terminalid: e.terminalid || "",
      client: e.client || "",
      clientver: e.clientver || ""
    };
  }
}
class li extends at {
  constructor(e) {
    super(e, "custom"), I(this, "info", {});
  }
  setCustomType(e) {
    this.type = e;
  }
  getProperties() {
    return {
      ...this.info
    };
  }
  setProperties(e) {
    this.info = e;
  }
}
const fe = {
  init: hi,
  custom: li
}, Ot = (n, e) => {
  const s = fe[e];
  return new s(n);
}, pi = (n, e, s) => {
  const r = s || Date.now(), i = Ot(n, e);
  return {
    ...n.baseLog,
    types: e,
    logtime: String(r),
    epochnanos: String(r) + "000000",
    event: e,
    properties: i.getProperties(),
    url: we()
  };
}, bs = (n, e, s) => {
  const r = s || Date.now();
  return {
    ...n.baseLog,
    types: e.type,
    logtime: String(r),
    epochnanos: String(r) + "000000",
    event: e.type,
    properties: e.getProperties(),
    url: we()
  };
}, Ks = (n, e) => {
  if (fe[n])
    throw Error(`\u8BE5\u4E8B\u4EF6${n} \u5DF2\u5B58\u5728\uFF0C\u6CE8\u518C\u5931\u8D25`);
  fe[n] = e;
};
class di {
  constructor(e, s) {
    I(this, "name", ""), I(this, "time", 0), I(this, "info", {}), e && (this.name = e), s && (this.info = s), this.time = Date.now();
  }
  get epochnanos() {
    return this.time * 1e6;
  }
  get attributes() {
    return this.getAttributes();
  }
  getAttributes() {
    return {};
  }
  getJson() {
    return {
      name: this.name,
      epochnanos: this.time * 1e6,
      attributes: this.getAttributes(),
      ...this.info
    };
  }
  setInfo(e) {
    this.info = e || {};
  }
}
class mi extends di {
  constructor() {
    super(...arguments), I(this, "name", "exception"), I(this, "exceptionType", ""), I(this, "exceptionMessage", ""), I(this, "exceptionStackTrace", "");
  }
  getAttributes() {
    return {
      "exception.type": this.exceptionType,
      "exception.message": this.exceptionMessage,
      "exception.stacktrace": this.exceptionStackTrace
    };
  }
  setInfo(e) {
    this.exceptionMessage = e.exceptionMessage, this.exceptionType = e.exceptionType, this.exceptionStackTrace = e.exceptionStackTrace;
  }
}
class Jn extends at {
  constructor(e, s, r) {
    super(e, "span"), I(this, "spanid", ""), I(this, "traceid", ""), I(this, "parentspanid", ""), I(this, "name", ""), I(this, "attributes", {}), I(this, "events", []), I(this, "statuscode", "OK"), I(this, "statusmessage", ""), I(this, "startTime", 0), I(this, "endTime", 0), this.name = s, this.traceid = be(), this.spanid = $s(), this.parentspanid = r || "", this.start();
  }
  trackLog() {
    this.apaasTrack.addLogByEvent(this);
  }
  createSpanEvent(e, s) {
    return new Jn(
      this.apaasTrack,
      e,
      s
    );
  }
  setAttribute(e) {
    const s = e.getAttributes();
    this.attributes = s;
  }
  addEvent(e) {
    this.events.push(e);
  }
  exception(e) {
    const s = new mi();
    let r = "", i = "", a = "";
    if (e instanceof Error) {
      const u = $n(e);
      r = u.detail, i = u.name, a = u.stack.join(",");
    } else
      r = e.exceptionMessage, i = e.exceptionType, a = e.exceptionStackTrace;
    s.setInfo({
      exceptionMessage: r,
      exceptionType: i,
      exceptionStackTrace: a
    }), this.events.push(s);
  }
  start() {
    this.startTime = Date.now();
  }
  end(e, s) {
    e && (this.statusmessage = e), s && (this.statuscode = s), this.endTime = Date.now();
  }
  getProperties() {
    return {
      traceid: this.traceid,
      spanid: this.spanid,
      parentspanid: this.parentspanid,
      name: this.name,
      attributes: this.attributes,
      events: this.events.map((e) => e.getJson()),
      statuscode: this.statuscode,
      statusmessage: this.statusmessage,
      startepochnanos: this.startTime * 1e6,
      endepochnanos: this.endTime * 1e6,
      duration: (this.endTime - this.startTime) * 1e6
    };
  }
}
const Ln = "1.0.17";
class hn {
  constructor(e) {
    I(this, "_version", Ln), I(this, "commonLog", null), I(this, "browserLog", null), I(this, "options"), this.options = e, typeof window < "u" && (window.__apaasTrackVersion__ = Ln), typeof wx < "u" && !window && (wx.__apaasTrackVersion__ = Ln), e.commonLog && this.initCommonLog(e.commonLog), this.runEventInitHooks();
  }
  registerEvent(e, s) {
    Ks(e, s), s.initApaasTrackHook && s.initApaasTrackHook(this), s.startApaasTrackHook && s.startApaasTrackHook(this);
  }
  get groupid() {
    var e;
    return (e = this.browserLog) == null ? void 0 : e.distinctid;
  }
  runEventInitHooks() {
    Object.values(fe).forEach(
      (e) => {
        e.initApaasTrackHook && e.initApaasTrackHook(this);
      }
    );
  }
  runEventStartHooks() {
    Object.values(fe).forEach(
      (e) => {
        e.startApaasTrackHook && e.startApaasTrackHook(this);
      }
    );
  }
  runEventDestroyHooks() {
    Object.values(fe).forEach(
      (e) => {
        e.destroyApaasTrackHook && e.destroyApaasTrackHook(this);
      }
    );
  }
  get anonymousid() {
    var e;
    return (e = this.browserLog) == null ? void 0 : e.anonymousid;
  }
  get distinctid() {
    var e;
    return (e = this.browserLog) == null ? void 0 : e.distinctid;
  }
  get baseLog() {
    return {
      ...this.browserLog,
      ...this.commonLog
    };
  }
  initCommonLog(e) {
    this.commonLog = e;
  }
  createEventLog(e, s) {
    return pi(this, e, s);
  }
  addLogByType(e, s) {
    const r = this.createEventLog(e, s);
    this.addLogToQueue(r);
  }
  addLogByEvent(e, s) {
    const r = bs(this, e, s);
    this.addLogToQueue(r);
  }
  createCustomEvent(e) {
    const s = Ot(this, "custom");
    return s.setCustomType(e), s;
  }
  createSpanEvent(e, s) {
    return new Jn(this, e, s);
  }
  addLogByCustomEvent(e, s = {}, r) {
    const i = this.createCustomEvent(e);
    i.setProperties(s);
    const a = bs(this, i, r);
    this.addLogToQueue(a);
  }
  executeInitEvent() {
    const e = Ot(this, "init");
    e.setProperties({
      groupid: this.groupid
    }), this.addLogByEvent(e);
  }
  updateCommonLog(e) {
    this.commonLog = {
      ...this.commonLog,
      ...e
    };
  }
  trackEvent(e, s = {}, r) {
    const i = Ot(this, e);
    i.setProperties(s), this.addLogByEvent(i, r);
  }
  start(...e) {
    this.executeInitEvent(), this.runEventStartHooks();
  }
  destroy() {
    this.runEventDestroyHooks();
  }
  transformLog(e) {
    return e;
  }
  async addLogToQueue(e, s = !1, r = !0) {
    r && (e = this.transformLog(e)), await this.sendLog(e, s);
  }
}
I(hn, "registerEvent", Ks);
class Hc {
  constructor(e) {
    I(this, "name", ""), I(this, "groupid", ""), this.name = e.name, this.groupid = e.groupid;
  }
  getJson() {
    return {
      name: this.name,
      attributes: this.getAttributes()
    };
  }
}
var fi = Object.defineProperty, gi = (n, e, s) => e in n ? fi(n, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : n[e] = s, b = (n, e, s) => (gi(n, typeof e != "symbol" ? e + "" : e, s), s), _i = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, zn = { exports: {} };
(function(n, e) {
  (function(s, r) {
    var i = "1.0.32", a = "", u = "?", l = "function", w = "undefined", p = "object", f = "string", v = "major", h = "model", _ = "name", y = "type", k = "vendor", T = "version", R = "architecture", tt = "console", M = "mobile", C = "tablet", V = "smarttv", J = "wearable", ht = "embedded", gt = 350, zt = "Amazon", re = "Apple", Se = "ASUS", Ge = "BlackBerry", Ht = "Browser", Jt = "Chrome", bn = "Edge", ie = "Firefox", Gt = "Google", Xe = "Huawei", Y = "LG", Tt = "Microsoft", Ft = "Motorola", ae = "Opera", Pe = "Samsung", Le = "Sharp", Xt = "Sony", It = "Xiaomi", Ee = "Zebra", We = "Facebook", wn = function(z, q) {
      var A = {};
      for (var W in z)
        q[W] && q[W].length % 2 === 0 ? A[W] = q[W].concat(z[W]) : A[W] = z[W];
      return A;
    }, Ct = function(z) {
      for (var q = {}, A = 0; A < z.length; A++)
        q[z[A].toUpperCase()] = z[A];
      return q;
    }, xe = function(z, q) {
      return typeof z === f ? Wt(q).indexOf(Wt(z)) !== -1 : !1;
    }, Wt = function(z) {
      return z.toLowerCase();
    }, yn = function(z) {
      return typeof z === f ? z.replace(/[^\d\.]/g, a).split(".")[0] : r;
    }, Qt = function(z, q) {
      if (typeof z === f)
        return z = z.replace(/^\s\s*/, a).replace(/\s\s*$/, a), typeof q === w ? z : z.substring(0, gt);
    }, lt = function(z, q) {
      for (var A = 0, W, O, ce, G, dt, _t; A < q.length && !dt; ) {
        var Ke = q[A], Ce = q[A + 1];
        for (W = O = 0; W < Ke.length && !dt; )
          if (dt = Ke[W++].exec(z), dt)
            for (ce = 0; ce < Ce.length; ce++)
              _t = dt[++O], G = Ce[ce], typeof G === p && G.length > 0 ? G.length === 2 ? typeof G[1] == l ? this[G[0]] = G[1].call(this, _t) : this[G[0]] = G[1] : G.length === 3 ? typeof G[1] === l && !(G[1].exec && G[1].test) ? this[G[0]] = _t ? G[1].call(this, _t, G[2]) : r : this[G[0]] = _t ? _t.replace(G[1], G[2]) : r : G.length === 4 && (this[G[0]] = _t ? G[3].call(this, _t.replace(G[1], G[2])) : r) : this[G] = _t || r;
        A += 2;
      }
    }, Be = function(z, q) {
      for (var A in q)
        if (typeof q[A] === p && q[A].length > 0) {
          for (var W = 0; W < q[A].length; W++)
            if (xe(q[A][W], z))
              return A === u ? r : A;
        } else if (xe(q[A], z))
          return A === u ? r : A;
      return z;
    }, Qe = {
      "1.0": "/8",
      "1.2": "/1",
      "1.3": "/3",
      "2.0": "/412",
      "2.0.2": "/416",
      "2.0.3": "/417",
      "2.0.4": "/419",
      "?": "/"
    }, Ve = {
      ME: "4.90",
      "NT 3.11": "NT3.51",
      "NT 4.0": "NT4.0",
      2e3: "NT 5.0",
      XP: ["NT 5.1", "NT 5.2"],
      Vista: "NT 6.0",
      7: "NT 6.1",
      8: "NT 6.2",
      "8.1": "NT 6.3",
      10: ["NT 6.4", "NT 10.0"],
      RT: "ARM"
    }, Mt = {
      browser: [
        [
          /\b(?:crmo|crios)\/([\w\.]+)/i
        ],
        [T, [_, "Chrome"]],
        [
          /edg(?:e|ios|a)?\/([\w\.]+)/i
        ],
        [T, [_, "Edge"]],
        [
          /(opera mini)\/([-\w\.]+)/i,
          /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
          /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
        ],
        [_, T],
        [
          /opios[\/ ]+([\w\.]+)/i
        ],
        [T, [_, ae + " Mini"]],
        [
          /\bopr\/([\w\.]+)/i
        ],
        [T, [_, ae]],
        [
          /(kindle)\/([\w\.]+)/i,
          /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,
          /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,
          /(ba?idubrowser)[\/ ]?([\w\.]+)/i,
          /(?:ms|\()(ie) ([\w\.]+)/i,
          /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
          /(weibo)__([\d\.]+)/i
        ],
        [_, T],
        [
          /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
        ],
        [T, [_, "UC" + Ht]],
        [
          /microm.+\bqbcore\/([\w\.]+)/i,
          /\bqbcore\/([\w\.]+).+microm/i
        ],
        [T, [_, "WeChat(Win) Desktop"]],
        [
          /micromessenger\/([\w\.]+)/i
        ],
        [T, [_, "WeChat"]],
        [
          /konqueror\/([\w\.]+)/i
        ],
        [T, [_, "Konqueror"]],
        [
          /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
        ],
        [T, [_, "IE"]],
        [
          /yabrowser\/([\w\.]+)/i
        ],
        [T, [_, "Yandex"]],
        [
          /(avast|avg)\/([\w\.]+)/i
        ],
        [[_, /(.+)/, "$1 Secure " + Ht], T],
        [
          /\bfocus\/([\w\.]+)/i
        ],
        [T, [_, ie + " Focus"]],
        [
          /\bopt\/([\w\.]+)/i
        ],
        [T, [_, ae + " Touch"]],
        [
          /coc_coc\w+\/([\w\.]+)/i
        ],
        [T, [_, "Coc Coc"]],
        [
          /dolfin\/([\w\.]+)/i
        ],
        [T, [_, "Dolphin"]],
        [
          /coast\/([\w\.]+)/i
        ],
        [T, [_, ae + " Coast"]],
        [
          /miuibrowser\/([\w\.]+)/i
        ],
        [T, [_, "MIUI " + Ht]],
        [
          /fxios\/([-\w\.]+)/i
        ],
        [T, [_, ie]],
        [
          /\bqihu|(qi?ho?o?|360)browser/i
        ],
        [[_, "360 " + Ht]],
        [
          /(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i
        ],
        [[_, /(.+)/, "$1 " + Ht], T],
        [
          /(comodo_dragon)\/([\w\.]+)/i
        ],
        [[_, /_/g, " "], T],
        [
          /(electron)\/([\w\.]+) safari/i,
          /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
          /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i
        ],
        [_, T],
        [
          /(metasr)[\/ ]?([\w\.]+)/i,
          /(lbbrowser)/i,
          /\[(linkedin)app\]/i
        ],
        [_],
        [
          /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
        ],
        [[_, We], T],
        [
          /safari (line)\/([\w\.]+)/i,
          /\b(line)\/([\w\.]+)\/iab/i,
          /(chromium|instagram)[\/ ]([-\w\.]+)/i
        ],
        [_, T],
        [
          /\bgsa\/([\w\.]+) .*safari\//i
        ],
        [T, [_, "GSA"]],
        [
          /headlesschrome(?:\/([\w\.]+)| )/i
        ],
        [T, [_, Jt + " Headless"]],
        [
          / wv\).+(chrome)\/([\w\.]+)/i
        ],
        [[_, Jt + " WebView"], T],
        [
          /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
        ],
        [T, [_, "Android " + Ht]],
        [
          /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
        ],
        [_, T],
        [
          /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i
        ],
        [T, [_, "Mobile Safari"]],
        [
          /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i
        ],
        [T, _],
        [
          /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
        ],
        [_, [T, Be, Qe]],
        [
          /(webkit|khtml)\/([\w\.]+)/i
        ],
        [_, T],
        [
          /(navigator|netscape\d?)\/([-\w\.]+)/i
        ],
        [[_, "Netscape"], T],
        [
          /mobile vr; rv:([\w\.]+)\).+firefox/i
        ],
        [T, [_, ie + " Reality"]],
        [
          /ekiohf.+(flow)\/([\w\.]+)/i,
          /(swiftfox)/i,
          /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
          /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
          /(firefox)\/([\w\.]+)/i,
          /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
          /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
          /(links) \(([\w\.]+)/i
        ],
        [_, T]
      ],
      cpu: [
        [
          /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i
        ],
        [[R, "amd64"]],
        [
          /(ia32(?=;))/i
        ],
        [[R, Wt]],
        [
          /((?:i[346]|x)86)[;\)]/i
        ],
        [[R, "ia32"]],
        [
          /\b(aarch64|arm(v?8e?l?|_?64))\b/i
        ],
        [[R, "arm64"]],
        [
          /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i
        ],
        [[R, "armhf"]],
        [
          /windows (ce|mobile); ppc;/i
        ],
        [[R, "arm"]],
        [
          /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i
        ],
        [[R, /ower/, a, Wt]],
        [
          /(sun4\w)[;\)]/i
        ],
        [[R, "sparc"]],
        [
          /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
        ],
        [[R, Wt]]
      ],
      device: [
        [
          /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
        ],
        [h, [k, Pe], [y, C]],
        [
          /\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i,
          /samsung[- ]([-\w]+)/i,
          /sec-(sgh\w+)/i
        ],
        [h, [k, Pe], [y, M]],
        [
          /\((ip(?:hone|od)[\w ]*);/i
        ],
        [h, [k, re], [y, M]],
        [
          /\((ipad);[-\w\),; ]+apple/i,
          /applecoremedia\/[\w\.]+ \((ipad)/i,
          /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
        ],
        [h, [k, re], [y, C]],
        [
          /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
        ],
        [h, [k, Xe], [y, C]],
        [
          /(?:huawei|honor)([-\w ]+)[;\)]/i,
          /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
        ],
        [h, [k, Xe], [y, M]],
        [
          /\b(poco[\w ]+)(?: bui|\))/i,
          /\b; (\w+) build\/hm\1/i,
          /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
          /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
          /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i
        ],
        [[h, /_/g, " "], [k, It], [y, M]],
        [
          /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i
        ],
        [[h, /_/g, " "], [k, It], [y, C]],
        [
          /; (\w+) bui.+ oppo/i,
          /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
        ],
        [h, [k, "OPPO"], [y, M]],
        [
          /vivo (\w+)(?: bui|\))/i,
          /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
        ],
        [h, [k, "Vivo"], [y, M]],
        [
          /\b(rmx[12]\d{3})(?: bui|;|\))/i
        ],
        [h, [k, "Realme"], [y, M]],
        [
          /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
          /\bmot(?:orola)?[- ](\w*)/i,
          /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
        ],
        [h, [k, Ft], [y, M]],
        [
          /\b(mz60\d|xoom[2 ]{0,2}) build\//i
        ],
        [h, [k, Ft], [y, C]],
        [
          /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
        ],
        [h, [k, Y], [y, C]],
        [
          /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
          /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
          /\blg-?([\d\w]+) bui/i
        ],
        [h, [k, Y], [y, M]],
        [
          /(ideatab[-\w ]+)/i,
          /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
        ],
        [h, [k, "Lenovo"], [y, C]],
        [
          /(?:maemo|nokia).*(n900|lumia \d+)/i,
          /nokia[-_ ]?([-\w\.]*)/i
        ],
        [[h, /_/g, " "], [k, "Nokia"], [y, M]],
        [
          /(pixel c)\b/i
        ],
        [h, [k, Gt], [y, C]],
        [
          /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i
        ],
        [h, [k, Gt], [y, M]],
        [
          /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
        ],
        [h, [k, Xt], [y, M]],
        [
          /sony tablet [ps]/i,
          /\b(?:sony)?sgp\w+(?: bui|\))/i
        ],
        [[h, "Xperia Tablet"], [k, Xt], [y, C]],
        [
          / (kb2005|in20[12]5|be20[12][59])\b/i,
          /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
        ],
        [h, [k, "OnePlus"], [y, M]],
        [
          /(alexa)webm/i,
          /(kf[a-z]{2}wi)( bui|\))/i,
          /(kf[a-z]+)( bui|\)).+silk\//i
        ],
        [h, [k, zt], [y, C]],
        [
          /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
        ],
        [[h, /(.+)/g, "Fire Phone $1"], [k, zt], [y, M]],
        [
          /(playbook);[-\w\),; ]+(rim)/i
        ],
        [h, k, [y, C]],
        [
          /\b((?:bb[a-f]|st[hv])100-\d)/i,
          /\(bb10; (\w+)/i
        ],
        [h, [k, Ge], [y, M]],
        [
          /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
        ],
        [h, [k, Se], [y, C]],
        [
          / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
        ],
        [h, [k, Se], [y, M]],
        [
          /(nexus 9)/i
        ],
        [h, [k, "HTC"], [y, C]],
        [
          /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
          /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
          /(alcatel|geeksphone|nexian|panasonic|sony(?!-bra))[-_ ]?([-\w]*)/i
        ],
        [k, [h, /_/g, " "], [y, M]],
        [
          /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
        ],
        [h, [k, "Acer"], [y, C]],
        [
          /droid.+; (m[1-5] note) bui/i,
          /\bmz-([-\w]{2,})/i
        ],
        [h, [k, "Meizu"], [y, M]],
        [
          /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
        ],
        [h, [k, Le], [y, M]],
        [
          /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,
          /(hp) ([\w ]+\w)/i,
          /(asus)-?(\w+)/i,
          /(microsoft); (lumia[\w ]+)/i,
          /(lenovo)[-_ ]?([-\w]+)/i,
          /(jolla)/i,
          /(oppo) ?([\w ]+) bui/i
        ],
        [k, h, [y, M]],
        [
          /(archos) (gamepad2?)/i,
          /(hp).+(touchpad(?!.+tablet)|tablet)/i,
          /(kindle)\/([\w\.]+)/i,
          /(nook)[\w ]+build\/(\w+)/i,
          /(dell) (strea[kpr\d ]*[\dko])/i,
          /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
          /(trinity)[- ]*(t\d{3}) bui/i,
          /(gigaset)[- ]+(q\w{1,9}) bui/i,
          /(vodafone) ([\w ]+)(?:\)| bui)/i
        ],
        [k, h, [y, C]],
        [
          /(surface duo)/i
        ],
        [h, [k, Tt], [y, C]],
        [
          /droid [\d\.]+; (fp\du?)(?: b|\))/i
        ],
        [h, [k, "Fairphone"], [y, M]],
        [
          /(u304aa)/i
        ],
        [h, [k, "AT&T"], [y, M]],
        [
          /\bsie-(\w*)/i
        ],
        [h, [k, "Siemens"], [y, M]],
        [
          /\b(rct\w+) b/i
        ],
        [h, [k, "RCA"], [y, C]],
        [
          /\b(venue[\d ]{2,7}) b/i
        ],
        [h, [k, "Dell"], [y, C]],
        [
          /\b(q(?:mv|ta)\w+) b/i
        ],
        [h, [k, "Verizon"], [y, C]],
        [
          /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i
        ],
        [h, [k, "Barnes & Noble"], [y, C]],
        [
          /\b(tm\d{3}\w+) b/i
        ],
        [h, [k, "NuVision"], [y, C]],
        [
          /\b(k88) b/i
        ],
        [h, [k, "ZTE"], [y, C]],
        [
          /\b(nx\d{3}j) b/i
        ],
        [h, [k, "ZTE"], [y, M]],
        [
          /\b(gen\d{3}) b.+49h/i
        ],
        [h, [k, "Swiss"], [y, M]],
        [
          /\b(zur\d{3}) b/i
        ],
        [h, [k, "Swiss"], [y, C]],
        [
          /\b((zeki)?tb.*\b) b/i
        ],
        [h, [k, "Zeki"], [y, C]],
        [
          /\b([yr]\d{2}) b/i,
          /\b(dragon[- ]+touch |dt)(\w{5}) b/i
        ],
        [[k, "Dragon Touch"], h, [y, C]],
        [
          /\b(ns-?\w{0,9}) b/i
        ],
        [h, [k, "Insignia"], [y, C]],
        [
          /\b((nxa|next)-?\w{0,9}) b/i
        ],
        [h, [k, "NextBook"], [y, C]],
        [
          /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i
        ],
        [[k, "Voice"], h, [y, M]],
        [
          /\b(lvtel\-)?(v1[12]) b/i
        ],
        [[k, "LvTel"], h, [y, M]],
        [
          /\b(ph-1) /i
        ],
        [h, [k, "Essential"], [y, M]],
        [
          /\b(v(100md|700na|7011|917g).*\b) b/i
        ],
        [h, [k, "Envizen"], [y, C]],
        [
          /\b(trio[-\w\. ]+) b/i
        ],
        [h, [k, "MachSpeed"], [y, C]],
        [
          /\btu_(1491) b/i
        ],
        [h, [k, "Rotor"], [y, C]],
        [
          /(shield[\w ]+) b/i
        ],
        [h, [k, "Nvidia"], [y, C]],
        [
          /(sprint) (\w+)/i
        ],
        [k, h, [y, M]],
        [
          /(kin\.[onetw]{3})/i
        ],
        [[h, /\./g, " "], [k, Tt], [y, M]],
        [
          /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
        ],
        [h, [k, Ee], [y, C]],
        [
          /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
        ],
        [h, [k, Ee], [y, M]],
        [
          /(ouya)/i,
          /(nintendo) ([wids3utch]+)/i
        ],
        [k, h, [y, tt]],
        [
          /droid.+; (shield) bui/i
        ],
        [h, [k, "Nvidia"], [y, tt]],
        [
          /(playstation [345portablevi]+)/i
        ],
        [h, [k, Xt], [y, tt]],
        [
          /\b(xbox(?: one)?(?!; xbox))[\); ]/i
        ],
        [h, [k, Tt], [y, tt]],
        [
          /smart-tv.+(samsung)/i
        ],
        [k, [y, V]],
        [
          /hbbtv.+maple;(\d+)/i
        ],
        [[h, /^/, "SmartTV"], [k, Pe], [y, V]],
        [
          /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
        ],
        [[k, Y], [y, V]],
        [
          /(apple) ?tv/i
        ],
        [k, [h, re + " TV"], [y, V]],
        [
          /crkey/i
        ],
        [[h, Jt + "cast"], [k, Gt], [y, V]],
        [
          /droid.+aft(\w)( bui|\))/i
        ],
        [h, [k, zt], [y, V]],
        [
          /\(dtv[\);].+(aquos)/i,
          /(aquos-tv[\w ]+)\)/i
        ],
        [h, [k, Le], [y, V]],
        [
          /(bravia[\w ]+)( bui|\))/i
        ],
        [h, [k, Xt], [y, V]],
        [
          /(mitv-\w{5}) bui/i
        ],
        [h, [k, It], [y, V]],
        [
          /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
          /hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i
        ],
        [[k, Qt], [h, Qt], [y, V]],
        [
          /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i
        ],
        [[y, V]],
        [
          /((pebble))app/i
        ],
        [k, h, [y, J]],
        [
          /droid.+; (glass) \d/i
        ],
        [h, [k, Gt], [y, J]],
        [
          /droid.+; (wt63?0{2,3})\)/i
        ],
        [h, [k, Ee], [y, J]],
        [
          /(quest( 2)?)/i
        ],
        [h, [k, We], [y, J]],
        [
          /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
        ],
        [k, [y, ht]],
        [
          /droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i
        ],
        [h, [y, M]],
        [
          /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i
        ],
        [h, [y, C]],
        [
          /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
        ],
        [[y, C]],
        [
          /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
        ],
        [[y, M]],
        [
          /(android[-\w\. ]{0,9});.+buil/i
        ],
        [h, [k, "Generic"]]
      ],
      engine: [
        [
          /windows.+ edge\/([\w\.]+)/i
        ],
        [T, [_, bn + "HTML"]],
        [
          /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
        ],
        [T, [_, "Blink"]],
        [
          /(presto)\/([\w\.]+)/i,
          /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
          /ekioh(flow)\/([\w\.]+)/i,
          /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
          /(icab)[\/ ]([23]\.[\d\.]+)/i
        ],
        [_, T],
        [
          /rv\:([\w\.]{1,9})\b.+(gecko)/i
        ],
        [T, _]
      ],
      os: [
        [
          /microsoft (windows) (vista|xp)/i
        ],
        [_, T],
        [
          /(windows) nt 6\.2; (arm)/i,
          /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,
          /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i
        ],
        [_, [T, Be, Ve]],
        [
          /(win(?=3|9|n)|win 9x )([nt\d\.]+)/i
        ],
        [[_, "Windows"], [T, Be, Ve]],
        [
          /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
          /cfnetwork\/.+darwin/i
        ],
        [[T, /_/g, "."], [_, "iOS"]],
        [
          /(mac os x) ?([\w\. ]*)/i,
          /(macintosh|mac_powerpc\b)(?!.+haiku)/i
        ],
        [[_, "Mac OS"], [T, /_/g, "."]],
        [
          /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i
        ],
        [T, _],
        [
          /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
          /(blackberry)\w*\/([\w\.]*)/i,
          /(tizen|kaios)[\/ ]([\w\.]+)/i,
          /\((series40);/i
        ],
        [_, T],
        [
          /\(bb(10);/i
        ],
        [T, [_, Ge]],
        [
          /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i
        ],
        [T, [_, "Symbian"]],
        [
          /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
        ],
        [T, [_, ie + " OS"]],
        [
          /web0s;.+rt(tv)/i,
          /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i
        ],
        [T, [_, "webOS"]],
        [
          /crkey\/([\d\.]+)/i
        ],
        [T, [_, Jt + "cast"]],
        [
          /(cros) [\w]+ ([\w\.]+\w)/i
        ],
        [[_, "Chromium OS"], T],
        [
          /(nintendo|playstation) ([wids345portablevuch]+)/i,
          /(xbox); +xbox ([^\);]+)/i,
          /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
          /(mint)[\/\(\) ]?(\w*)/i,
          /(mageia|vectorlinux)[; ]/i,
          /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
          /(hurd|linux) ?([\w\.]*)/i,
          /(gnu) ?([\w\.]*)/i,
          /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
          /(haiku) (\w+)/i
        ],
        [_, T],
        [
          /(sunos) ?([\w\.\d]*)/i
        ],
        [[_, "Solaris"], T],
        [
          /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
          /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
          /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i,
          /(unix) ?([\w\.]*)/i
        ],
        [_, T]
      ]
    }, ot = function(z, q) {
      if (typeof z === p && (q = z, z = r), !(this instanceof ot))
        return new ot(z, q).getResult();
      var A = z || (typeof s !== w && s.navigator && s.navigator.userAgent ? s.navigator.userAgent : a), W = q ? wn(Mt, q) : Mt;
      return this.getBrowser = function() {
        var O = {};
        return O[_] = r, O[T] = r, lt.call(O, A, W.browser), O.major = yn(O.version), O;
      }, this.getCPU = function() {
        var O = {};
        return O[R] = r, lt.call(O, A, W.cpu), O;
      }, this.getDevice = function() {
        var O = {};
        return O[k] = r, O[h] = r, O[y] = r, lt.call(O, A, W.device), O;
      }, this.getEngine = function() {
        var O = {};
        return O[_] = r, O[T] = r, lt.call(O, A, W.engine), O;
      }, this.getOS = function() {
        var O = {};
        return O[_] = r, O[T] = r, lt.call(O, A, W.os), O;
      }, this.getResult = function() {
        return {
          ua: this.getUA(),
          browser: this.getBrowser(),
          engine: this.getEngine(),
          os: this.getOS(),
          device: this.getDevice(),
          cpu: this.getCPU()
        };
      }, this.getUA = function() {
        return A;
      }, this.setUA = function(O) {
        return A = typeof O === f && O.length > gt ? Qt(O, gt) : O, this;
      }, this.setUA(A), this;
    };
    ot.VERSION = i, ot.BROWSER = Ct([_, T, v]), ot.CPU = Ct([R]), ot.DEVICE = Ct([h, k, y, tt, M, V, C, J, ht]), ot.ENGINE = ot.OS = Ct([_, T]), n.exports && (e = n.exports = ot), e.UAParser = ot;
    var Nt = typeof s !== w && (s.jQuery || s.Zepto);
    if (Nt && !Nt.ua) {
      var oe = new ot();
      Nt.ua = oe.getResult(), Nt.ua.get = function() {
        return oe.getUA();
      }, Nt.ua.set = function(z) {
        oe.setUA(z);
        var q = oe.getResult();
        for (var A in q)
          Nt.ua[A] = q[A];
      };
    }
  })(typeof window == "object" ? window : _i);
})(zn, zn.exports);
var Zs = { exports: {} }, Ys = { exports: {} };
(function() {
  var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", e = {
    rotl: function(s, r) {
      return s << r | s >>> 32 - r;
    },
    rotr: function(s, r) {
      return s << 32 - r | s >>> r;
    },
    endian: function(s) {
      if (s.constructor == Number)
        return e.rotl(s, 8) & 16711935 | e.rotl(s, 24) & 4278255360;
      for (var r = 0; r < s.length; r++)
        s[r] = e.endian(s[r]);
      return s;
    },
    randomBytes: function(s) {
      for (var r = []; s > 0; s--)
        r.push(Math.floor(Math.random() * 256));
      return r;
    },
    bytesToWords: function(s) {
      for (var r = [], i = 0, a = 0; i < s.length; i++, a += 8)
        r[a >>> 5] |= s[i] << 24 - a % 32;
      return r;
    },
    wordsToBytes: function(s) {
      for (var r = [], i = 0; i < s.length * 32; i += 8)
        r.push(s[i >>> 5] >>> 24 - i % 32 & 255);
      return r;
    },
    bytesToHex: function(s) {
      for (var r = [], i = 0; i < s.length; i++)
        r.push((s[i] >>> 4).toString(16)), r.push((s[i] & 15).toString(16));
      return r.join("");
    },
    hexToBytes: function(s) {
      for (var r = [], i = 0; i < s.length; i += 2)
        r.push(parseInt(s.substr(i, 2), 16));
      return r;
    },
    bytesToBase64: function(s) {
      for (var r = [], i = 0; i < s.length; i += 3)
        for (var a = s[i] << 16 | s[i + 1] << 8 | s[i + 2], u = 0; u < 4; u++)
          i * 8 + u * 6 <= s.length * 8 ? r.push(n.charAt(a >>> 6 * (3 - u) & 63)) : r.push("=");
      return r.join("");
    },
    base64ToBytes: function(s) {
      s = s.replace(/[^A-Z0-9+\/]/ig, "");
      for (var r = [], i = 0, a = 0; i < s.length; a = ++i % 4)
        a != 0 && r.push((n.indexOf(s.charAt(i - 1)) & Math.pow(2, -2 * a + 8) - 1) << a * 2 | n.indexOf(s.charAt(i)) >>> 6 - a * 2);
      return r;
    }
  };
  Ys.exports = e;
})();
var Hn = {
  utf8: {
    stringToBytes: function(n) {
      return Hn.bin.stringToBytes(unescape(encodeURIComponent(n)));
    },
    bytesToString: function(n) {
      return decodeURIComponent(escape(Hn.bin.bytesToString(n)));
    }
  },
  bin: {
    stringToBytes: function(n) {
      for (var e = [], s = 0; s < n.length; s++)
        e.push(n.charCodeAt(s) & 255);
      return e;
    },
    bytesToString: function(n) {
      for (var e = [], s = 0; s < n.length; s++)
        e.push(String.fromCharCode(n[s]));
      return e.join("");
    }
  }
}, ws = Hn;
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var vi = function(n) {
  return n != null && (tr(n) || bi(n) || !!n._isBuffer);
};
function tr(n) {
  return !!n.constructor && typeof n.constructor.isBuffer == "function" && n.constructor.isBuffer(n);
}
function bi(n) {
  return typeof n.readFloatLE == "function" && typeof n.slice == "function" && tr(n.slice(0, 0));
}
(function() {
  var n = Ys.exports, e = ws.utf8, s = vi, r = ws.bin, i = function(a, u) {
    a.constructor == String ? u && u.encoding === "binary" ? a = r.stringToBytes(a) : a = e.stringToBytes(a) : s(a) ? a = Array.prototype.slice.call(a, 0) : !Array.isArray(a) && a.constructor !== Uint8Array && (a = a.toString());
    for (var l = n.bytesToWords(a), w = a.length * 8, p = 1732584193, f = -271733879, v = -1732584194, h = 271733878, _ = 0; _ < l.length; _++)
      l[_] = (l[_] << 8 | l[_] >>> 24) & 16711935 | (l[_] << 24 | l[_] >>> 8) & 4278255360;
    l[w >>> 5] |= 128 << w % 32, l[(w + 64 >>> 9 << 4) + 14] = w;
    for (var y = i._ff, k = i._gg, T = i._hh, R = i._ii, _ = 0; _ < l.length; _ += 16) {
      var tt = p, M = f, C = v, V = h;
      p = y(p, f, v, h, l[_ + 0], 7, -680876936), h = y(h, p, f, v, l[_ + 1], 12, -389564586), v = y(v, h, p, f, l[_ + 2], 17, 606105819), f = y(f, v, h, p, l[_ + 3], 22, -1044525330), p = y(p, f, v, h, l[_ + 4], 7, -176418897), h = y(h, p, f, v, l[_ + 5], 12, 1200080426), v = y(v, h, p, f, l[_ + 6], 17, -1473231341), f = y(f, v, h, p, l[_ + 7], 22, -45705983), p = y(p, f, v, h, l[_ + 8], 7, 1770035416), h = y(h, p, f, v, l[_ + 9], 12, -1958414417), v = y(v, h, p, f, l[_ + 10], 17, -42063), f = y(f, v, h, p, l[_ + 11], 22, -1990404162), p = y(p, f, v, h, l[_ + 12], 7, 1804603682), h = y(h, p, f, v, l[_ + 13], 12, -40341101), v = y(v, h, p, f, l[_ + 14], 17, -1502002290), f = y(f, v, h, p, l[_ + 15], 22, 1236535329), p = k(p, f, v, h, l[_ + 1], 5, -165796510), h = k(h, p, f, v, l[_ + 6], 9, -1069501632), v = k(v, h, p, f, l[_ + 11], 14, 643717713), f = k(f, v, h, p, l[_ + 0], 20, -373897302), p = k(p, f, v, h, l[_ + 5], 5, -701558691), h = k(h, p, f, v, l[_ + 10], 9, 38016083), v = k(v, h, p, f, l[_ + 15], 14, -660478335), f = k(f, v, h, p, l[_ + 4], 20, -405537848), p = k(p, f, v, h, l[_ + 9], 5, 568446438), h = k(h, p, f, v, l[_ + 14], 9, -1019803690), v = k(v, h, p, f, l[_ + 3], 14, -187363961), f = k(f, v, h, p, l[_ + 8], 20, 1163531501), p = k(p, f, v, h, l[_ + 13], 5, -1444681467), h = k(h, p, f, v, l[_ + 2], 9, -51403784), v = k(v, h, p, f, l[_ + 7], 14, 1735328473), f = k(f, v, h, p, l[_ + 12], 20, -1926607734), p = T(p, f, v, h, l[_ + 5], 4, -378558), h = T(h, p, f, v, l[_ + 8], 11, -2022574463), v = T(v, h, p, f, l[_ + 11], 16, 1839030562), f = T(f, v, h, p, l[_ + 14], 23, -35309556), p = T(p, f, v, h, l[_ + 1], 4, -1530992060), h = T(h, p, f, v, l[_ + 4], 11, 1272893353), v = T(v, h, p, f, l[_ + 7], 16, -155497632), f = T(f, v, h, p, l[_ + 10], 23, -1094730640), p = T(p, f, v, h, l[_ + 13], 4, 681279174), h = T(h, p, f, v, l[_ + 0], 11, -358537222), v = T(v, h, p, f, l[_ + 3], 16, -722521979), f = T(f, v, h, p, l[_ + 6], 23, 76029189), p = T(p, f, v, h, l[_ + 9], 4, -640364487), h = T(h, p, f, v, l[_ + 12], 11, -421815835), v = T(v, h, p, f, l[_ + 15], 16, 530742520), f = T(f, v, h, p, l[_ + 2], 23, -995338651), p = R(p, f, v, h, l[_ + 0], 6, -198630844), h = R(h, p, f, v, l[_ + 7], 10, 1126891415), v = R(v, h, p, f, l[_ + 14], 15, -1416354905), f = R(f, v, h, p, l[_ + 5], 21, -57434055), p = R(p, f, v, h, l[_ + 12], 6, 1700485571), h = R(h, p, f, v, l[_ + 3], 10, -1894986606), v = R(v, h, p, f, l[_ + 10], 15, -1051523), f = R(f, v, h, p, l[_ + 1], 21, -2054922799), p = R(p, f, v, h, l[_ + 8], 6, 1873313359), h = R(h, p, f, v, l[_ + 15], 10, -30611744), v = R(v, h, p, f, l[_ + 6], 15, -1560198380), f = R(f, v, h, p, l[_ + 13], 21, 1309151649), p = R(p, f, v, h, l[_ + 4], 6, -145523070), h = R(h, p, f, v, l[_ + 11], 10, -1120210379), v = R(v, h, p, f, l[_ + 2], 15, 718787259), f = R(f, v, h, p, l[_ + 9], 21, -343485551), p = p + tt >>> 0, f = f + M >>> 0, v = v + C >>> 0, h = h + V >>> 0;
    }
    return n.endian([p, f, v, h]);
  };
  i._ff = function(a, u, l, w, p, f, v) {
    var h = a + (u & l | ~u & w) + (p >>> 0) + v;
    return (h << f | h >>> 32 - f) + u;
  }, i._gg = function(a, u, l, w, p, f, v) {
    var h = a + (u & w | l & ~w) + (p >>> 0) + v;
    return (h << f | h >>> 32 - f) + u;
  }, i._hh = function(a, u, l, w, p, f, v) {
    var h = a + (u ^ l ^ w) + (p >>> 0) + v;
    return (h << f | h >>> 32 - f) + u;
  }, i._ii = function(a, u, l, w, p, f, v) {
    var h = a + (l ^ (u | ~w)) + (p >>> 0) + v;
    return (h << f | h >>> 32 - f) + u;
  }, i._blocksize = 16, i._digestsize = 16, Zs.exports = function(a, u) {
    if (a == null)
      throw new Error("Illegal argument " + a);
    var l = n.wordsToBytes(i(a, u));
    return u && u.asBytes ? l : u && u.asString ? r.bytesToString(l) : n.bytesToHex(l);
  };
})();
const sn = "1.0.17";
//! © 2015 Nathan Rugg <nmrugg@gmail.com> | MIT
function wi(n) {
  var e = 1, s = 2, r = 3, i = {}, a = new Worker(n || "./lzma_worker-min.js");
  return a.onmessage = function(u) {
    u.data.action === r ? i[u.data.cbn] && typeof i[u.data.cbn].on_progress == "function" && i[u.data.cbn].on_progress(u.data.result) : i[u.data.cbn] && typeof i[u.data.cbn].on_finish == "function" && (i[u.data.cbn].on_finish(u.data.result, u.data.error), delete i[u.data.cbn]);
  }, a.onerror = function(u) {
    var l = new Error(u.message + " (" + u.filename + ":" + u.lineno + ")");
    for (var w in i)
      i[w].on_finish(null, l);
    console.error("Uncaught error in lzma_worker", l);
  }, function() {
    function u(l, w, p, f, v) {
      var h;
      do
        h = Math.floor(Math.random() * 1e7);
      while (typeof i[h] < "u");
      i[h] = {
        on_finish: f,
        on_progress: v
      }, a.postMessage({
        action: l,
        cbn: h,
        data: w,
        mode: p
      });
    }
    return {
      compress: function(l, w, p, f) {
        u(e, l, w, p, f);
      },
      decompress: function(l, w, p) {
        u(s, l, !1, w, p);
      },
      worker: function() {
        return a;
      }
    };
  }();
}
var Fn = function() {
  var n = 1, e = 3, s = typeof setImmediate == "function" ? setImmediate : setTimeout, r = 4294967296, i = [4294967295, -r], a = [0, -9223372036854776e3], u = [0, 0], l = [1, 0];
  function w(t, o) {
    postMessage({
      action: e,
      cbn: o,
      result: t
    });
  }
  function p(t) {
    var o = [];
    return o[t - 1] = void 0, o;
  }
  function f(t, o) {
    return _(t[0] + o[0], t[1] + o[1]);
  }
  function v(t, o) {
    return R(~~Math.max(Math.min(t[1] / r, 2147483647), -2147483648) & ~~Math.max(Math.min(o[1] / r, 2147483647), -2147483648), T(t) & T(o));
  }
  function h(t, o) {
    var c, d;
    return t[0] == o[0] && t[1] == o[1] ? 0 : (c = t[1] < 0, d = o[1] < 0, c && !d ? -1 : !c && d ? 1 : J(t, o)[1] < 0 ? -1 : 1);
  }
  function _(t, o) {
    var c, d;
    for (o %= 18446744073709552e3, t %= 18446744073709552e3, c = o % r, d = Math.floor(t / r) * r, o = o - c + d, t = t - d + c; t < 0; )
      t += r, o -= r;
    for (; t > 4294967295; )
      t -= r, o += r;
    for (o = o % 18446744073709552e3; o > 9223372032559809e3; )
      o -= 18446744073709552e3;
    for (; o < -9223372036854776e3; )
      o += 18446744073709552e3;
    return [t, o];
  }
  function y(t, o) {
    return t[0] == o[0] && t[1] == o[1];
  }
  function k(t) {
    return t >= 0 ? [t, 0] : [t + r, -r];
  }
  function T(t) {
    return t[0] >= 2147483648 ? ~~Math.max(Math.min(t[0] - r, 2147483647), -2147483648) : ~~Math.max(Math.min(t[0], 2147483647), -2147483648);
  }
  function R(t, o) {
    var c, d;
    return c = t * r, d = o, o < 0 && (d += r), [d, c];
  }
  function tt(t) {
    return t <= 30 ? 1 << t : tt(30) * tt(t - 30);
  }
  function M(t, o) {
    var c, d, m, g;
    if (o &= 63, y(t, a))
      return o ? u : t;
    if (t[1] < 0)
      throw new Error("Neg");
    return g = tt(o), d = t[1] * g % 18446744073709552e3, m = t[0] * g, c = m - m % r, d += c, m -= c, d >= 9223372036854776e3 && (d -= 18446744073709552e3), [m, d];
  }
  function C(t, o) {
    var c;
    return o &= 63, c = tt(o), _(Math.floor(t[0] / c), t[1] / c);
  }
  function V(t, o) {
    var c;
    return o &= 63, c = C(t, o), t[1] < 0 && (c = f(c, M([2, 0], 63 - o))), c;
  }
  function J(t, o) {
    return _(t[0] - o[0], t[1] - o[1]);
  }
  function ht(t, o) {
    return t.buf = o, t.pos = 0, t.count = o.length, t;
  }
  function gt(t, o, c, d) {
    return t.pos >= t.count ? -1 : (d = Math.min(d, t.count - t.pos), Jt(t.buf, t.pos, o, c, d), t.pos += d, d);
  }
  function zt(t) {
    return t.buf = p(32), t.count = 0, t;
  }
  function re(t) {
    var o = t.buf;
    return o.length = t.count, o;
  }
  function Se(t, o) {
    t.buf[t.count++] = o << 24 >> 24;
  }
  function Ge(t, o, c, d) {
    Jt(o, c, t.buf, t.count, d), t.count += d;
  }
  function Ht(t, o, c, d, m) {
    var g;
    for (g = o; g < c; ++g)
      d[m++] = t.charCodeAt(g);
  }
  function Jt(t, o, c, d, m) {
    for (var g = 0; g < m; ++g)
      c[d + g] = t[o + g];
  }
  function bn(t, o) {
    xr(o, 1 << t.s), o._numFastBytes = t.f, Br(o, t.m), o._numLiteralPosStateBits = 0, o._numLiteralContextBits = 3, o._posStateBits = 2, o._posStateMask = 3;
  }
  function ie(t, o, c, d, m) {
    var g, S;
    if (h(d, i) < 0)
      throw new Error("invalid length " + d);
    for (t.length_0 = d, g = q({}), bn(m, g), g._writeEndMark = typeof Fn.disableEndMark > "u", Cr(g, c), S = 0; S < 64; S += 8)
      Se(c, T(C(d, S)) & 255);
    t.chunker = (g._needReleaseMFStream = 0, g._inStream = o, g._finished = 0, z(g), g._rangeEncoder.Stream = c, Ke(g), W(g), A(g), g._lenEncoder._tableSize = g._numFastBytes + 1 - 2, ss(g._lenEncoder, 1 << g._posStateBits), g._repMatchLenEncoder._tableSize = g._numFastBytes + 1 - 2, ss(g._repMatchLenEncoder, 1 << g._posStateBits), g.nowPos64 = u, Be({}, g));
  }
  function Gt(t, o, c) {
    return t.output = zt({}), ie(t, ht({}, o), t.output, k(o.length), c), t;
  }
  function Xe(t, o, c, d) {
    var m;
    t._keepSizeBefore = o, t._keepSizeAfter = c, m = o + c + d, (t._bufferBase == null || t._blockSize != m) && (t._bufferBase = null, t._blockSize = m, t._bufferBase = p(t._blockSize)), t._pointerToLastSafePosition = t._blockSize - c;
  }
  function Y(t, o) {
    return t._bufferBase[t._bufferOffset + t._pos + o];
  }
  function Tt(t, o, c, d) {
    var m, g;
    for (t._streamEndWasReached && t._pos + o + d > t._streamPos && (d = t._streamPos - (t._pos + o)), ++c, g = t._bufferOffset + t._pos + o, m = 0; m < d && t._bufferBase[g + m] == t._bufferBase[g + m - c]; ++m)
      ;
    return m;
  }
  function Ft(t) {
    return t._streamPos - t._pos;
  }
  function ae(t) {
    var o, c, d;
    for (d = t._bufferOffset + t._pos - t._keepSizeBefore, d > 0 && --d, c = t._bufferOffset + t._streamPos - d, o = 0; o < c; ++o)
      t._bufferBase[o] = t._bufferBase[d + o];
    t._bufferOffset -= d;
  }
  function Pe(t) {
    var o;
    ++t._pos, t._pos > t._posLimit && (o = t._bufferOffset + t._pos, o > t._pointerToLastSafePosition && ae(t), Le(t));
  }
  function Le(t) {
    var o, c, d;
    if (!t._streamEndWasReached)
      for (; ; ) {
        if (d = -t._bufferOffset + t._blockSize - t._streamPos, !d)
          return;
        if (o = gt(t._stream, t._bufferBase, t._bufferOffset + t._streamPos, d), o == -1) {
          t._posLimit = t._streamPos, c = t._bufferOffset + t._posLimit, c > t._pointerToLastSafePosition && (t._posLimit = t._pointerToLastSafePosition - t._bufferOffset), t._streamEndWasReached = 1;
          return;
        }
        t._streamPos += o, t._streamPos >= t._pos + t._keepSizeAfter && (t._posLimit = t._streamPos - t._keepSizeAfter);
      }
  }
  function Xt(t, o) {
    t._bufferOffset += o, t._posLimit -= o, t._pos -= o, t._streamPos -= o;
  }
  var It = function() {
    var t, o, c, d = [];
    for (t = 0; t < 256; ++t) {
      for (c = t, o = 0; o < 8; ++o)
        (c & 1) != 0 ? c = c >>> 1 ^ -306674912 : c >>>= 1;
      d[t] = c;
    }
    return d;
  }();
  function Ee(t, o, c, d, m) {
    var g, S, B;
    o < 1073741567 && (t._cutValue = 16 + (d >> 1), B = ~~((o + c + d + m) / 2) + 256, Xe(t, o + c, d + m, B), t._matchMaxLen = d, g = o + 1, t._cyclicBufferSize != g && (t._son = p((t._cyclicBufferSize = g) * 2)), S = 65536, t.HASH_ARRAY && (S = o - 1, S |= S >> 1, S |= S >> 2, S |= S >> 4, S |= S >> 8, S >>= 1, S |= 65535, S > 16777216 && (S >>= 1), t._hashMask = S, ++S, S += t.kFixHashSize), S != t._hashSizeSum && (t._hash = p(t._hashSizeSum = S)));
  }
  function We(t, o) {
    var c, d, m, g, S, B, D, L, x, X, H, F, et, P, N, K, j, vt, st, bt, St;
    if (t._pos + t._matchMaxLen <= t._streamPos)
      P = t._matchMaxLen;
    else if (P = t._streamPos - t._pos, P < t.kMinMatchCheck)
      return Ct(t), 0;
    for (j = 0, N = t._pos > t._cyclicBufferSize ? t._pos - t._cyclicBufferSize : 0, d = t._bufferOffset + t._pos, K = 1, L = 0, x = 0, t.HASH_ARRAY ? (St = It[t._bufferBase[d] & 255] ^ t._bufferBase[d + 1] & 255, L = St & 1023, St ^= (t._bufferBase[d + 2] & 255) << 8, x = St & 65535, X = (St ^ It[t._bufferBase[d + 3] & 255] << 5) & t._hashMask) : X = t._bufferBase[d] & 255 ^ (t._bufferBase[d + 1] & 255) << 8, m = t._hash[t.kFixHashSize + X] || 0, t.HASH_ARRAY && (g = t._hash[L] || 0, S = t._hash[1024 + x] || 0, t._hash[L] = t._pos, t._hash[1024 + x] = t._pos, g > N && t._bufferBase[t._bufferOffset + g] == t._bufferBase[d] && (o[j++] = K = 2, o[j++] = t._pos - g - 1), S > N && t._bufferBase[t._bufferOffset + S] == t._bufferBase[d] && (S == g && (j -= 2), o[j++] = K = 3, o[j++] = t._pos - S - 1, g = S), j != 0 && g == m && (j -= 2, K = 1)), t._hash[t.kFixHashSize + X] = t._pos, st = (t._cyclicBufferPos << 1) + 1, bt = t._cyclicBufferPos << 1, F = et = t.kNumHashDirectBytes, t.kNumHashDirectBytes != 0 && m > N && t._bufferBase[t._bufferOffset + m + t.kNumHashDirectBytes] != t._bufferBase[d + t.kNumHashDirectBytes] && (o[j++] = K = t.kNumHashDirectBytes, o[j++] = t._pos - m - 1), c = t._cutValue; ; ) {
      if (m <= N || c-- == 0) {
        t._son[st] = t._son[bt] = 0;
        break;
      }
      if (D = t._pos - m, B = (D <= t._cyclicBufferPos ? t._cyclicBufferPos - D : t._cyclicBufferPos - D + t._cyclicBufferSize) << 1, vt = t._bufferOffset + m, H = F < et ? F : et, t._bufferBase[vt + H] == t._bufferBase[d + H]) {
        for (; ++H != P && t._bufferBase[vt + H] == t._bufferBase[d + H]; )
          ;
        if (K < H && (o[j++] = K = H, o[j++] = D - 1, H == P)) {
          t._son[bt] = t._son[B], t._son[st] = t._son[B + 1];
          break;
        }
      }
      (t._bufferBase[vt + H] & 255) < (t._bufferBase[d + H] & 255) ? (t._son[bt] = m, bt = B + 1, m = t._son[bt], et = H) : (t._son[st] = m, st = B, m = t._son[st], F = H);
    }
    return Ct(t), j;
  }
  function wn(t) {
    t._bufferOffset = 0, t._pos = 0, t._streamPos = 0, t._streamEndWasReached = 0, Le(t), t._cyclicBufferPos = 0, Xt(t, -1);
  }
  function Ct(t) {
    var o;
    ++t._cyclicBufferPos >= t._cyclicBufferSize && (t._cyclicBufferPos = 0), Pe(t), t._pos == 1073741823 && (o = t._pos - t._cyclicBufferSize, xe(t._son, t._cyclicBufferSize * 2, o), xe(t._hash, t._hashSizeSum, o), Xt(t, o));
  }
  function xe(t, o, c) {
    var d, m;
    for (d = 0; d < o; ++d)
      m = t[d] || 0, m <= c ? m = 0 : m -= c, t[d] = m;
  }
  function Wt(t, o) {
    t.HASH_ARRAY = o > 2, t.HASH_ARRAY ? (t.kNumHashDirectBytes = 0, t.kMinMatchCheck = 4, t.kFixHashSize = 66560) : (t.kNumHashDirectBytes = 2, t.kMinMatchCheck = 3, t.kFixHashSize = 0);
  }
  function yn(t, o) {
    var c, d, m, g, S, B, D, L, x, X, H, F, et, P, N, K, j;
    do {
      if (t._pos + t._matchMaxLen <= t._streamPos)
        F = t._matchMaxLen;
      else if (F = t._streamPos - t._pos, F < t.kMinMatchCheck) {
        Ct(t);
        continue;
      }
      for (et = t._pos > t._cyclicBufferSize ? t._pos - t._cyclicBufferSize : 0, d = t._bufferOffset + t._pos, t.HASH_ARRAY ? (j = It[t._bufferBase[d] & 255] ^ t._bufferBase[d + 1] & 255, B = j & 1023, t._hash[B] = t._pos, j ^= (t._bufferBase[d + 2] & 255) << 8, D = j & 65535, t._hash[1024 + D] = t._pos, L = (j ^ It[t._bufferBase[d + 3] & 255] << 5) & t._hashMask) : L = t._bufferBase[d] & 255 ^ (t._bufferBase[d + 1] & 255) << 8, m = t._hash[t.kFixHashSize + L], t._hash[t.kFixHashSize + L] = t._pos, N = (t._cyclicBufferPos << 1) + 1, K = t._cyclicBufferPos << 1, X = H = t.kNumHashDirectBytes, c = t._cutValue; ; ) {
        if (m <= et || c-- == 0) {
          t._son[N] = t._son[K] = 0;
          break;
        }
        if (S = t._pos - m, g = (S <= t._cyclicBufferPos ? t._cyclicBufferPos - S : t._cyclicBufferPos - S + t._cyclicBufferSize) << 1, P = t._bufferOffset + m, x = X < H ? X : H, t._bufferBase[P + x] == t._bufferBase[d + x]) {
          for (; ++x != F && t._bufferBase[P + x] == t._bufferBase[d + x]; )
            ;
          if (x == F) {
            t._son[K] = t._son[g], t._son[N] = t._son[g + 1];
            break;
          }
        }
        (t._bufferBase[P + x] & 255) < (t._bufferBase[d + x] & 255) ? (t._son[K] = m, K = g + 1, m = t._son[K], H = x) : (t._son[N] = m, N = g, m = t._son[N], X = x);
      }
      Ct(t);
    } while (--o != 0);
  }
  function Qt(t) {
    return t -= 2, t < 4 ? t : 3;
  }
  function lt(t) {
    return t < 4 ? 0 : t < 10 ? t - 3 : t - 6;
  }
  function Be(t, o) {
    return t.encoder = o, t.decoder = null, t.alive = 1, t;
  }
  function Qe(t) {
    if (!t.alive)
      throw new Error("bad state");
    if (t.encoder)
      Ve(t);
    else
      throw new Error("No decoding");
    return t.alive;
  }
  function Ve(t) {
    oe(t.encoder, t.encoder.processedInSize, t.encoder.processedOutSize, t.encoder.finished), t.inBytesProcessed = t.encoder.processedInSize[0], t.encoder.finished[0] && (Er(t.encoder), t.alive = 0);
  }
  var Mt = function() {
    var t, o, c, d = 2, m = [0, 1];
    for (c = 2; c < 22; ++c)
      for (o = 1 << (c >> 1) - 1, t = 0; t < o; ++t, ++d)
        m[d] = c << 24 >> 24;
    return m;
  }();
  function ot(t, o) {
    var c, d, m, g;
    t._optimumEndIndex = o, m = t._optimum[o].PosPrev, d = t._optimum[o].BackPrev;
    do
      t._optimum[o].Prev1IsChar && (is(t._optimum[m]), t._optimum[m].PosPrev = m - 1, t._optimum[o].Prev2 && (t._optimum[m - 1].Prev1IsChar = 0, t._optimum[m - 1].PosPrev = t._optimum[o].PosPrev2, t._optimum[m - 1].BackPrev = t._optimum[o].BackPrev2)), g = m, c = d, d = t._optimum[g].BackPrev, m = t._optimum[g].PosPrev, t._optimum[g].BackPrev = c, t._optimum[g].PosPrev = o, o = g;
    while (o > 0);
    return t.backRes = t._optimum[0].BackPrev, t._optimumCurrentIndex = t._optimum[0].PosPrev, t._optimumCurrentIndex;
  }
  function Nt(t) {
    t._state = 0, t._previousByte = 0;
    for (var o = 0; o < 4; ++o)
      t._repDistances[o] = 0;
  }
  function oe(t, o, c, d) {
    var m, g, S, B, D, L, x, X, H, F, et, P, N, K, j;
    if (o[0] = u, c[0] = u, d[0] = 1, t._inStream && (t._matchFinder._stream = t._inStream, wn(t._matchFinder), t._needReleaseMFStream = 1, t._inStream = null), !t._finished) {
      if (t._finished = 1, K = t.nowPos64, y(t.nowPos64, u)) {
        if (!Ft(t._matchFinder)) {
          O(t, T(t.nowPos64));
          return;
        }
        kn(t), N = T(t.nowPos64) & t._posStateMask, Q(t._rangeEncoder, t._isMatch, (t._state << 4) + N, 0), t._state = lt(t._state), S = Y(t._matchFinder, -t._additionalOffset), rs(ue(t._literalEncoder, T(t.nowPos64), t._previousByte), t._rangeEncoder, S), t._previousByte = S, --t._additionalOffset, t.nowPos64 = f(t.nowPos64, l);
      }
      if (!Ft(t._matchFinder)) {
        O(t, T(t.nowPos64));
        return;
      }
      for (; ; ) {
        if (x = ce(t, T(t.nowPos64)), F = t.backRes, N = T(t.nowPos64) & t._posStateMask, g = (t._state << 4) + N, x == 1 && F == -1)
          Q(t._rangeEncoder, t._isMatch, g, 0), S = Y(t._matchFinder, -t._additionalOffset), j = ue(t._literalEncoder, T(t.nowPos64), t._previousByte), t._state < 7 ? rs(j, t._rangeEncoder, S) : (H = Y(t._matchFinder, -t._repDistances[0] - 1 - t._additionalOffset), Hr(j, t._rangeEncoder, H, S)), t._previousByte = S, t._state = lt(t._state);
        else {
          if (Q(t._rangeEncoder, t._isMatch, g, 1), F < 4) {
            if (Q(t._rangeEncoder, t._isRep, t._state, 1), F ? (Q(t._rangeEncoder, t._isRepG0, t._state, 1), F == 1 ? Q(t._rangeEncoder, t._isRepG1, t._state, 0) : (Q(t._rangeEncoder, t._isRepG1, t._state, 1), Q(t._rangeEncoder, t._isRepG2, t._state, F - 2))) : (Q(t._rangeEncoder, t._isRepG0, t._state, 0), x == 1 ? Q(t._rangeEncoder, t._isRep0Long, g, 0) : Q(t._rangeEncoder, t._isRep0Long, g, 1)), x == 1 ? t._state = t._state < 7 ? 9 : 11 : (Sn(t._repMatchLenEncoder, t._rangeEncoder, x - 2, N), t._state = t._state < 7 ? 8 : 11), B = t._repDistances[F], F != 0) {
              for (L = F; L >= 1; --L)
                t._repDistances[L] = t._repDistances[L - 1];
              t._repDistances[0] = B;
            }
          } else {
            for (Q(t._rangeEncoder, t._isRep, t._state, 0), t._state = t._state < 7 ? 7 : 10, Sn(t._lenEncoder, t._rangeEncoder, x - 2, N), F -= 4, P = Tn(F), X = Qt(x), Re(t._posSlotEncoder[X], t._rangeEncoder, P), P >= 4 && (D = (P >> 1) - 1, m = (2 | P & 1) << D, et = F - m, P < 14 ? jr(t._posEncoders, m - P - 1, t._rangeEncoder, D, et) : (os(t._rangeEncoder, et >> 4, D - 4), as(t._posAlignEncoder, t._rangeEncoder, et & 15), ++t._alignPriceCount)), B = F, L = 3; L >= 1; --L)
              t._repDistances[L] = t._repDistances[L - 1];
            t._repDistances[0] = B, ++t._matchPriceCount;
          }
          t._previousByte = Y(t._matchFinder, x - 1 - t._additionalOffset);
        }
        if (t._additionalOffset -= x, t.nowPos64 = f(t.nowPos64, k(x)), !t._additionalOffset) {
          if (t._matchPriceCount >= 128 && W(t), t._alignPriceCount >= 16 && A(t), o[0] = t.nowPos64, c[0] = qr(t._rangeEncoder), !Ft(t._matchFinder)) {
            O(t, T(t.nowPos64));
            return;
          }
          if (h(J(t.nowPos64, K), [4096, 0]) >= 0) {
            t._finished = 0, d[0] = 0;
            return;
          }
        }
      }
    }
  }
  function z(t) {
    var o, c;
    t._matchFinder || (o = {}, c = 4, t._matchFinderType || (c = 2), Wt(o, c), t._matchFinder = o), Or(t._literalEncoder, t._numLiteralPosStateBits, t._numLiteralContextBits), !(t._dictionarySize == t._dictionarySizePrev && t._numFastBytesPrev == t._numFastBytes) && (Ee(t._matchFinder, t._dictionarySize, 4096, t._numFastBytes, 274), t._dictionarySizePrev = t._dictionarySize, t._numFastBytesPrev = t._numFastBytes);
  }
  function q(t) {
    var o;
    for (t._repDistances = p(4), t._optimum = [], t._rangeEncoder = {}, t._isMatch = p(192), t._isRep = p(12), t._isRepG0 = p(12), t._isRepG1 = p(12), t._isRepG2 = p(12), t._isRep0Long = p(192), t._posSlotEncoder = [], t._posEncoders = p(114), t._posAlignEncoder = Me({}, 4), t._lenEncoder = ns({}), t._repMatchLenEncoder = ns({}), t._literalEncoder = {}, t._matchDistances = [], t._posSlotPrices = [], t._distancesPrices = [], t._alignPrices = p(16), t.reps = p(4), t.repLens = p(4), t.processedInSize = [u], t.processedOutSize = [u], t.finished = [0], t.properties = p(5), t.tempPrices = p(128), t._longestMatchLength = 0, t._matchFinderType = 1, t._numDistancePairs = 0, t._numFastBytesPrev = -1, t.backRes = 0, o = 0; o < 4096; ++o)
      t._optimum[o] = {};
    for (o = 0; o < 4; ++o)
      t._posSlotEncoder[o] = Me({}, 6);
    return t;
  }
  function A(t) {
    for (var o = 0; o < 16; ++o)
      t._alignPrices[o] = Nr(t._posAlignEncoder, o);
    t._alignPriceCount = 0;
  }
  function W(t) {
    var o, c, d, m, g, S, B, D;
    for (m = 4; m < 128; ++m)
      S = Tn(m), d = (S >> 1) - 1, o = (2 | S & 1) << d, t.tempPrices[m] = Ur(t._posEncoders, o - S - 1, d, m - o);
    for (g = 0; g < 4; ++g) {
      for (c = t._posSlotEncoder[g], B = g << 6, S = 0; S < t._distTableSize; ++S)
        t._posSlotPrices[B + S] = Ye(c, S);
      for (S = 14; S < t._distTableSize; ++S)
        t._posSlotPrices[B + S] += (S >> 1) - 1 - 4 << 6;
      for (D = g * 128, m = 0; m < 4; ++m)
        t._distancesPrices[D + m] = t._posSlotPrices[B + m];
      for (; m < 128; ++m)
        t._distancesPrices[D + m] = t._posSlotPrices[B + Tn(m)] + t.tempPrices[m];
    }
    t._matchPriceCount = 0;
  }
  function O(t, o) {
    Yn(t), Mr(t, o & t._posStateMask);
    for (var c = 0; c < 5; ++c)
      Pn(t._rangeEncoder);
  }
  function ce(t, o) {
    var c, d, m, g, S, B, D, L, x, X, H, F, et, P, N, K, j, vt, st, bt, St, pt, he, tn, wt, Pt, Lt, ut, Rt, Z, E, jt, Kt, rt, it, ls, yt, Ae, Zt, Dt, le, Oe, U, nt, pe, ps, ds, ms, fs, gs;
    if (t._optimumEndIndex != t._optimumCurrentIndex)
      return et = t._optimum[t._optimumCurrentIndex].PosPrev - t._optimumCurrentIndex, t.backRes = t._optimum[t._optimumCurrentIndex].BackPrev, t._optimumCurrentIndex = t._optimum[t._optimumCurrentIndex].PosPrev, et;
    if (t._optimumCurrentIndex = t._optimumEndIndex = 0, t._longestMatchWasFound ? (F = t._longestMatchLength, t._longestMatchWasFound = 0) : F = kn(t), Lt = t._numDistancePairs, wt = Ft(t._matchFinder) + 1, wt < 2)
      return t.backRes = -1, 1;
    for (wt > 273 && (wt = 273), Dt = 0, x = 0; x < 4; ++x)
      t.reps[x] = t._repDistances[x], t.repLens[x] = Tt(t._matchFinder, -1, t.reps[x], 273), t.repLens[x] > t.repLens[Dt] && (Dt = x);
    if (t.repLens[Dt] >= t._numFastBytes)
      return t.backRes = Dt, et = t.repLens[Dt], Ce(t, et - 1), et;
    if (F >= t._numFastBytes)
      return t.backRes = t._matchDistances[Lt - 1] + 4, Ce(t, F - 1), F;
    if (D = Y(t._matchFinder, -1), j = Y(t._matchFinder, -t._repDistances[0] - 1 - 1), F < 2 && D != j && t.repLens[Dt] < 2)
      return t.backRes = -1, 1;
    if (t._optimum[0].State = t._state, rt = o & t._posStateMask, t._optimum[1].Price = $[t._isMatch[(t._state << 4) + rt] >>> 2] + Ze(ue(t._literalEncoder, o, t._previousByte), t._state >= 7, j, D), is(t._optimum[1]), vt = $[2048 - t._isMatch[(t._state << 4) + rt] >>> 2], Zt = vt + $[2048 - t._isRep[t._state] >>> 2], j == D && (le = Zt + _t(t, t._state, rt), le < t._optimum[1].Price && (t._optimum[1].Price = le, Ir(t._optimum[1]))), H = F >= t.repLens[Dt] ? F : t.repLens[Dt], H < 2)
      return t.backRes = t._optimum[1].BackPrev, 1;
    t._optimum[1].PosPrev = 0, t._optimum[0].Backs0 = t.reps[0], t._optimum[0].Backs1 = t.reps[1], t._optimum[0].Backs2 = t.reps[2], t._optimum[0].Backs3 = t.reps[3], X = H;
    do
      t._optimum[X--].Price = 268435455;
    while (X >= 2);
    for (x = 0; x < 4; ++x)
      if (Ae = t.repLens[x], !(Ae < 2)) {
        ls = Zt + dt(t, x, t._state, rt);
        do
          g = ls + Vt(t._repMatchLenEncoder, Ae - 2, rt), E = t._optimum[Ae], g < E.Price && (E.Price = g, E.PosPrev = 0, E.BackPrev = x, E.Prev1IsChar = 0);
        while (--Ae >= 2);
      }
    if (tn = vt + $[t._isRep[t._state] >>> 2], X = t.repLens[0] >= 2 ? t.repLens[0] + 1 : 2, X <= F) {
      for (ut = 0; X > t._matchDistances[ut]; )
        ut += 2;
      for (; L = t._matchDistances[ut + 1], g = tn + G(t, L, X, rt), E = t._optimum[X], g < E.Price && (E.Price = g, E.PosPrev = 0, E.BackPrev = L + 4, E.Prev1IsChar = 0), !(X == t._matchDistances[ut] && (ut += 2, ut == Lt)); ++X)
        ;
    }
    for (c = 0; ; ) {
      if (++c, c == H)
        return ot(t, c);
      if (st = kn(t), Lt = t._numDistancePairs, st >= t._numFastBytes)
        return t._longestMatchLength = st, t._longestMatchWasFound = 1, ot(t, c);
      if (++o, Kt = t._optimum[c].PosPrev, t._optimum[c].Prev1IsChar ? (--Kt, t._optimum[c].Prev2 ? (U = t._optimum[t._optimum[c].PosPrev2].State, t._optimum[c].BackPrev2 < 4 ? U = U < 7 ? 8 : 11 : U = U < 7 ? 7 : 10) : U = t._optimum[Kt].State, U = lt(U)) : U = t._optimum[Kt].State, Kt == c - 1 ? t._optimum[c].BackPrev ? U = lt(U) : U = U < 7 ? 9 : 11 : (t._optimum[c].Prev1IsChar && t._optimum[c].Prev2 ? (Kt = t._optimum[c].PosPrev2, jt = t._optimum[c].BackPrev2, U = U < 7 ? 8 : 11) : (jt = t._optimum[c].BackPrev, jt < 4 ? U = U < 7 ? 8 : 11 : U = U < 7 ? 7 : 10), Z = t._optimum[Kt], jt < 4 ? jt ? jt == 1 ? (t.reps[0] = Z.Backs1, t.reps[1] = Z.Backs0, t.reps[2] = Z.Backs2, t.reps[3] = Z.Backs3) : jt == 2 ? (t.reps[0] = Z.Backs2, t.reps[1] = Z.Backs0, t.reps[2] = Z.Backs1, t.reps[3] = Z.Backs3) : (t.reps[0] = Z.Backs3, t.reps[1] = Z.Backs0, t.reps[2] = Z.Backs1, t.reps[3] = Z.Backs2) : (t.reps[0] = Z.Backs0, t.reps[1] = Z.Backs1, t.reps[2] = Z.Backs2, t.reps[3] = Z.Backs3) : (t.reps[0] = jt - 4, t.reps[1] = Z.Backs0, t.reps[2] = Z.Backs1, t.reps[3] = Z.Backs2)), t._optimum[c].State = U, t._optimum[c].Backs0 = t.reps[0], t._optimum[c].Backs1 = t.reps[1], t._optimum[c].Backs2 = t.reps[2], t._optimum[c].Backs3 = t.reps[3], B = t._optimum[c].Price, D = Y(t._matchFinder, -1), j = Y(t._matchFinder, -t.reps[0] - 1 - 1), rt = o & t._posStateMask, d = B + $[t._isMatch[(U << 4) + rt] >>> 2] + Ze(ue(t._literalEncoder, o, Y(t._matchFinder, -2)), U >= 7, j, D), pt = t._optimum[c + 1], bt = 0, d < pt.Price && (pt.Price = d, pt.PosPrev = c, pt.BackPrev = -1, pt.Prev1IsChar = 0, bt = 1), vt = B + $[2048 - t._isMatch[(U << 4) + rt] >>> 2], Zt = vt + $[2048 - t._isRep[U] >>> 2], j == D && !(pt.PosPrev < c && !pt.BackPrev) && (le = Zt + ($[t._isRepG0[U] >>> 2] + $[t._isRep0Long[(U << 4) + rt] >>> 2]), le <= pt.Price && (pt.Price = le, pt.PosPrev = c, pt.BackPrev = 0, pt.Prev1IsChar = 0, bt = 1)), Pt = Ft(t._matchFinder) + 1, Pt = 4095 - c < Pt ? 4095 - c : Pt, wt = Pt, !(wt < 2)) {
        if (wt > t._numFastBytes && (wt = t._numFastBytes), !bt && j != D && (pe = Math.min(Pt - 1, t._numFastBytes), N = Tt(t._matchFinder, 0, t.reps[0], pe), N >= 2)) {
          for (nt = lt(U), it = o + 1 & t._posStateMask, he = d + $[2048 - t._isMatch[(nt << 4) + it] >>> 2] + $[2048 - t._isRep[nt] >>> 2], Rt = c + 1 + N; H < Rt; )
            t._optimum[++H].Price = 268435455;
          g = he + (ps = Vt(t._repMatchLenEncoder, N - 2, it), ps + dt(t, 0, nt, it)), E = t._optimum[Rt], g < E.Price && (E.Price = g, E.PosPrev = c + 1, E.BackPrev = 0, E.Prev1IsChar = 1, E.Prev2 = 0);
        }
        for (Oe = 2, yt = 0; yt < 4; ++yt)
          if (P = Tt(t._matchFinder, -1, t.reps[yt], wt), !(P < 2)) {
            K = P;
            do {
              for (; H < c + P; )
                t._optimum[++H].Price = 268435455;
              g = Zt + (ds = Vt(t._repMatchLenEncoder, P - 2, rt), ds + dt(t, yt, U, rt)), E = t._optimum[c + P], g < E.Price && (E.Price = g, E.PosPrev = c, E.BackPrev = yt, E.Prev1IsChar = 0);
            } while (--P >= 2);
            if (P = K, yt || (Oe = P + 1), P < Pt && (pe = Math.min(Pt - 1 - P, t._numFastBytes), N = Tt(t._matchFinder, P, t.reps[yt], pe), N >= 2)) {
              for (nt = U < 7 ? 8 : 11, it = o + P & t._posStateMask, m = Zt + (ms = Vt(t._repMatchLenEncoder, P - 2, rt), ms + dt(t, yt, U, rt)) + $[t._isMatch[(nt << 4) + it] >>> 2] + Ze(ue(t._literalEncoder, o + P, Y(t._matchFinder, P - 1 - 1)), 1, Y(t._matchFinder, P - 1 - (t.reps[yt] + 1)), Y(t._matchFinder, P - 1)), nt = lt(nt), it = o + P + 1 & t._posStateMask, St = m + $[2048 - t._isMatch[(nt << 4) + it] >>> 2], he = St + $[2048 - t._isRep[nt] >>> 2], Rt = P + 1 + N; H < c + Rt; )
                t._optimum[++H].Price = 268435455;
              g = he + (fs = Vt(t._repMatchLenEncoder, N - 2, it), fs + dt(t, 0, nt, it)), E = t._optimum[c + Rt], g < E.Price && (E.Price = g, E.PosPrev = c + P + 1, E.BackPrev = 0, E.Prev1IsChar = 1, E.Prev2 = 1, E.PosPrev2 = c, E.BackPrev2 = yt);
            }
          }
        if (st > wt) {
          for (st = wt, Lt = 0; st > t._matchDistances[Lt]; Lt += 2)
            ;
          t._matchDistances[Lt] = st, Lt += 2;
        }
        if (st >= Oe) {
          for (tn = vt + $[t._isRep[U] >>> 2]; H < c + st; )
            t._optimum[++H].Price = 268435455;
          for (ut = 0; Oe > t._matchDistances[ut]; )
            ut += 2;
          for (P = Oe; ; ++P)
            if (S = t._matchDistances[ut + 1], g = tn + G(t, S, P, rt), E = t._optimum[c + P], g < E.Price && (E.Price = g, E.PosPrev = c, E.BackPrev = S + 4, E.Prev1IsChar = 0), P == t._matchDistances[ut]) {
              if (P < Pt && (pe = Math.min(Pt - 1 - P, t._numFastBytes), N = Tt(t._matchFinder, P, S, pe), N >= 2)) {
                for (nt = U < 7 ? 7 : 10, it = o + P & t._posStateMask, m = g + $[t._isMatch[(nt << 4) + it] >>> 2] + Ze(ue(t._literalEncoder, o + P, Y(t._matchFinder, P - 1 - 1)), 1, Y(t._matchFinder, P - (S + 1) - 1), Y(t._matchFinder, P - 1)), nt = lt(nt), it = o + P + 1 & t._posStateMask, St = m + $[2048 - t._isMatch[(nt << 4) + it] >>> 2], he = St + $[2048 - t._isRep[nt] >>> 2], Rt = P + 1 + N; H < c + Rt; )
                  t._optimum[++H].Price = 268435455;
                g = he + (gs = Vt(t._repMatchLenEncoder, N - 2, it), gs + dt(t, 0, nt, it)), E = t._optimum[c + Rt], g < E.Price && (E.Price = g, E.PosPrev = c + P + 1, E.BackPrev = 0, E.Prev1IsChar = 1, E.Prev2 = 1, E.PosPrev2 = c, E.BackPrev2 = S + 4);
              }
              if (ut += 2, ut == Lt)
                break;
            }
        }
      }
    }
  }
  function G(t, o, c, d) {
    var m, g = Qt(c);
    return o < 128 ? m = t._distancesPrices[g * 128 + o] : m = t._posSlotPrices[(g << 6) + Rr(o)] + t._alignPrices[o & 15], m + Vt(t._lenEncoder, c - 2, d);
  }
  function dt(t, o, c, d) {
    var m;
    return o ? (m = $[2048 - t._isRepG0[c] >>> 2], o == 1 ? m += $[t._isRepG1[c] >>> 2] : (m += $[2048 - t._isRepG1[c] >>> 2], m += De(t._isRepG2[c], o - 2))) : (m = $[t._isRepG0[c] >>> 2], m += $[2048 - t._isRep0Long[(c << 4) + d] >>> 2]), m;
  }
  function _t(t, o, c) {
    return $[t._isRepG0[o] >>> 2] + $[t._isRep0Long[(o << 4) + c] >>> 2];
  }
  function Ke(t) {
    Nt(t), $r(t._rangeEncoder), ct(t._isMatch), ct(t._isRep0Long), ct(t._isRep), ct(t._isRepG0), ct(t._isRepG1), ct(t._isRepG2), ct(t._posEncoders), zr(t._literalEncoder);
    for (var o = 0; o < 4; ++o)
      ct(t._posSlotEncoder[o].Models);
    ts(t._lenEncoder, 1 << t._posStateBits), ts(t._repMatchLenEncoder, 1 << t._posStateBits), ct(t._posAlignEncoder.Models), t._longestMatchWasFound = 0, t._optimumEndIndex = 0, t._optimumCurrentIndex = 0, t._additionalOffset = 0;
  }
  function Ce(t, o) {
    o > 0 && (yn(t._matchFinder, o), t._additionalOffset += o);
  }
  function kn(t) {
    var o = 0;
    return t._numDistancePairs = We(t._matchFinder, t._matchDistances), t._numDistancePairs > 0 && (o = t._matchDistances[t._numDistancePairs - 2], o == t._numFastBytes && (o += Tt(t._matchFinder, o - 1, t._matchDistances[t._numDistancePairs - 1], 273 - o))), ++t._additionalOffset, o;
  }
  function Yn(t) {
    t._matchFinder && t._needReleaseMFStream && (t._matchFinder._stream = null, t._needReleaseMFStream = 0);
  }
  function Er(t) {
    Yn(t), t._rangeEncoder.Stream = null;
  }
  function xr(t, o) {
    t._dictionarySize = o;
    for (var c = 0; o > 1 << c; ++c)
      ;
    t._distTableSize = c * 2;
  }
  function Br(t, o) {
    var c = t._matchFinderType;
    t._matchFinderType = o, t._matchFinder && c != t._matchFinderType && (t._dictionarySizePrev = -1, t._matchFinder = null);
  }
  function Cr(t, o) {
    t.properties[0] = (t._posStateBits * 5 + t._numLiteralPosStateBits) * 9 + t._numLiteralContextBits << 24 >> 24;
    for (var c = 0; c < 4; ++c)
      t.properties[1 + c] = t._dictionarySize >> 8 * c << 24 >> 24;
    Ge(o, t.properties, 0, 5);
  }
  function Mr(t, o) {
    if (t._writeEndMark) {
      Q(t._rangeEncoder, t._isMatch, (t._state << 4) + o, 1), Q(t._rangeEncoder, t._isRep, t._state, 0), t._state = t._state < 7 ? 7 : 10, Sn(t._lenEncoder, t._rangeEncoder, 0, o);
      var c = Qt(2);
      Re(t._posSlotEncoder[c], t._rangeEncoder, 63), os(t._rangeEncoder, 67108863, 26), as(t._posAlignEncoder, t._rangeEncoder, 15);
    }
  }
  function Tn(t) {
    return t < 2048 ? Mt[t] : t < 2097152 ? Mt[t >> 10] + 20 : Mt[t >> 20] + 40;
  }
  function Rr(t) {
    return t < 131072 ? Mt[t >> 6] + 12 : t < 134217728 ? Mt[t >> 16] + 32 : Mt[t >> 26] + 52;
  }
  function Dr(t, o, c, d) {
    c < 8 ? (Q(o, t._choice, 0, 0), Re(t._lowCoder[d], o, c)) : (c -= 8, Q(o, t._choice, 0, 1), c < 8 ? (Q(o, t._choice, 1, 0), Re(t._midCoder[d], o, c)) : (Q(o, t._choice, 1, 1), Re(t._highCoder, o, c - 8)));
  }
  function Ar(t) {
    t._choice = p(2), t._lowCoder = p(16), t._midCoder = p(16), t._highCoder = Me({}, 8);
    for (var o = 0; o < 16; ++o)
      t._lowCoder[o] = Me({}, 3), t._midCoder[o] = Me({}, 3);
    return t;
  }
  function ts(t, o) {
    ct(t._choice);
    for (var c = 0; c < o; ++c)
      ct(t._lowCoder[c].Models), ct(t._midCoder[c].Models);
    ct(t._highCoder.Models);
  }
  function es(t, o, c, d, m) {
    var g, S, B, D, L;
    for (g = $[t._choice[0] >>> 2], S = $[2048 - t._choice[0] >>> 2], B = S + $[t._choice[1] >>> 2], D = S + $[2048 - t._choice[1] >>> 2], L = 0, L = 0; L < 8; ++L) {
      if (L >= c)
        return;
      d[m + L] = g + Ye(t._lowCoder[o], L);
    }
    for (; L < 16; ++L) {
      if (L >= c)
        return;
      d[m + L] = B + Ye(t._midCoder[o], L - 8);
    }
    for (; L < c; ++L)
      d[m + L] = D + Ye(t._highCoder, L - 8 - 8);
  }
  function Sn(t, o, c, d) {
    Dr(t, o, c, d), --t._counters[d] == 0 && (es(t, d, t._tableSize, t._prices, d * 272), t._counters[d] = t._tableSize);
  }
  function ns(t) {
    return Ar(t), t._prices = [], t._counters = [], t;
  }
  function Vt(t, o, c) {
    return t._prices[c * 272 + o];
  }
  function ss(t, o) {
    for (var c = 0; c < o; ++c)
      es(t, c, t._tableSize, t._prices, c * 272), t._counters[c] = t._tableSize;
  }
  function Or(t, o, c) {
    var d, m;
    if (!(t.m_Coders != null && t.m_NumPrevBits == c && t.m_NumPosBits == o))
      for (t.m_NumPosBits = o, t.m_PosMask = (1 << o) - 1, t.m_NumPrevBits = c, m = 1 << t.m_NumPrevBits + t.m_NumPosBits, t.m_Coders = p(m), d = 0; d < m; ++d)
        t.m_Coders[d] = Fr({});
  }
  function ue(t, o, c) {
    return t.m_Coders[((o & t.m_PosMask) << t.m_NumPrevBits) + ((c & 255) >>> 8 - t.m_NumPrevBits)];
  }
  function zr(t) {
    var o, c = 1 << t.m_NumPrevBits + t.m_NumPosBits;
    for (o = 0; o < c; ++o)
      ct(t.m_Coders[o].m_Encoders);
  }
  function rs(t, o, c) {
    var d, m, g = 1;
    for (m = 7; m >= 0; --m)
      d = c >> m & 1, Q(o, t.m_Encoders, g, d), g = g << 1 | d;
  }
  function Hr(t, o, c, d) {
    var m, g, S, B, D = 1, L = 1;
    for (g = 7; g >= 0; --g)
      m = d >> g & 1, B = L, D && (S = c >> g & 1, B += 1 + S << 8, D = S == m), Q(o, t.m_Encoders, B, m), L = L << 1 | m;
  }
  function Fr(t) {
    return t.m_Encoders = p(768), t;
  }
  function Ze(t, o, c, d) {
    var m, g = 1, S = 7, B, D = 0;
    if (o) {
      for (; S >= 0; --S)
        if (B = c >> S & 1, m = d >> S & 1, D += De(t.m_Encoders[(1 + B << 8) + g], m), g = g << 1 | m, B != m) {
          --S;
          break;
        }
    }
    for (; S >= 0; --S)
      m = d >> S & 1, D += De(t.m_Encoders[g], m), g = g << 1 | m;
    return D;
  }
  function is(t) {
    t.BackPrev = -1, t.Prev1IsChar = 0;
  }
  function Ir(t) {
    t.BackPrev = 0, t.Prev1IsChar = 0;
  }
  function Me(t, o) {
    return t.NumBitLevels = o, t.Models = p(1 << o), t;
  }
  function Re(t, o, c) {
    var d, m, g = 1;
    for (m = t.NumBitLevels; m != 0; )
      --m, d = c >>> m & 1, Q(o, t.Models, g, d), g = g << 1 | d;
  }
  function Ye(t, o) {
    var c, d, m = 1, g = 0;
    for (d = t.NumBitLevels; d != 0; )
      --d, c = o >>> d & 1, g += De(t.Models[m], c), m = (m << 1) + c;
    return g;
  }
  function as(t, o, c) {
    var d, m, g = 1;
    for (m = 0; m < t.NumBitLevels; ++m)
      d = c & 1, Q(o, t.Models, g, d), g = g << 1 | d, c >>= 1;
  }
  function Nr(t, o) {
    var c, d, m = 1, g = 0;
    for (d = t.NumBitLevels; d != 0; --d)
      c = o & 1, o >>>= 1, g += De(t.Models[m], c), m = m << 1 | c;
    return g;
  }
  function jr(t, o, c, d, m) {
    var g, S, B = 1;
    for (S = 0; S < d; ++S)
      g = m & 1, Q(c, t, o + B, g), B = B << 1 | g, m >>= 1;
  }
  function Ur(t, o, c, d) {
    var m, g, S = 1, B = 0;
    for (g = c; g != 0; --g)
      m = d & 1, d >>>= 1, B += $[((t[o + S] - m ^ -m) & 2047) >>> 2], S = S << 1 | m;
    return B;
  }
  function ct(t) {
    for (var o = t.length - 1; o >= 0; --o)
      t[o] = 1024;
  }
  var $ = function() {
    var t, o, c, d, m = [];
    for (o = 8; o >= 0; --o)
      for (d = 1 << 9 - o - 1, t = 1 << 9 - o, c = d; c < t; ++c)
        m[c] = (o << 6) + (t - c << 6 >>> 9 - o - 1);
    return m;
  }();
  function Q(t, o, c, d) {
    var m, g = o[c];
    m = (t.Range >>> 11) * g, d ? (t.Low = f(t.Low, v(k(m), [4294967295, 0])), t.Range -= m, o[c] = g - (g >>> 5) << 16 >> 16) : (t.Range = m, o[c] = g + (2048 - g >>> 5) << 16 >> 16), t.Range & -16777216 || (t.Range <<= 8, Pn(t));
  }
  function os(t, o, c) {
    for (var d = c - 1; d >= 0; --d)
      t.Range >>>= 1, (o >>> d & 1) == 1 && (t.Low = f(t.Low, k(t.Range))), t.Range & -16777216 || (t.Range <<= 8, Pn(t));
  }
  function qr(t) {
    return f(f(k(t._cacheSize), t._position), [4, 0]);
  }
  function $r(t) {
    t._position = u, t.Low = u, t.Range = -1, t._cacheSize = 1, t._cache = 0;
  }
  function Pn(t) {
    var o, c = T(V(t.Low, 32));
    if (c != 0 || h(t.Low, [4278190080, 0]) < 0) {
      t._position = f(t._position, k(t._cacheSize)), o = t._cache;
      do
        Se(t.Stream, o + c), o = 255;
      while (--t._cacheSize != 0);
      t._cache = T(t.Low) >>> 24;
    }
    ++t._cacheSize, t.Low = M(v(t.Low, [16777215, 0]), 8);
  }
  function De(t, o) {
    return $[((t - o ^ -o) & 2047) >>> 2];
  }
  function cs(t) {
    var o, c = [], d, m = 0, g, S = t.length;
    if (typeof t == "object")
      return t;
    for (Ht(t, 0, S, c, 0), g = 0; g < S; ++g)
      o = c[g], o >= 1 && o <= 127 ? ++m : !o || o >= 128 && o <= 2047 ? m += 2 : m += 3;
    for (d = [], m = 0, g = 0; g < S; ++g)
      o = c[g], o >= 1 && o <= 127 ? d[m++] = o << 24 >> 24 : !o || o >= 128 && o <= 2047 ? (d[m++] = (192 | o >> 6 & 31) << 24 >> 24, d[m++] = (128 | o & 63) << 24 >> 24) : (d[m++] = (224 | o >> 12 & 15) << 24 >> 24, d[m++] = (128 | o >> 6 & 63) << 24 >> 24, d[m++] = (128 | o & 63) << 24 >> 24);
    return d;
  }
  function us(t) {
    return t[1] + t[0];
  }
  function Jr(t, o, c, d) {
    var m = {}, g, S, B = typeof c > "u" && typeof d > "u";
    if (typeof c != "function" && (S = c, c = d = 0), d = d || function(L) {
      if (!(typeof S > "u"))
        return w(L, S);
    }, c = c || function(L, x) {
      if (!(typeof S > "u"))
        return postMessage({
          action: n,
          cbn: S,
          result: L,
          error: x
        });
    }, B) {
      for (m.c = Gt({}, cs(t), hs(o)); Qe(m.c.chunker); )
        ;
      return re(m.c.output);
    }
    try {
      m.c = Gt({}, cs(t), hs(o)), d(0);
    } catch (L) {
      return c(null, L);
    }
    function D() {
      try {
        for (var L, x = new Date().getTime(); Qe(m.c.chunker); )
          if (g = us(m.c.chunker.inBytesProcessed) / us(m.c.length_0), new Date().getTime() - x > 200)
            return d(g), s(D, 0), 0;
        d(1), L = re(m.c.output), s(c.bind(null, L), 0);
      } catch (X) {
        c(null, X);
      }
    }
    s(D, 0);
  }
  var hs = function() {
    var t = [
      { s: 16, f: 64, m: 0 },
      { s: 20, f: 64, m: 0 },
      { s: 19, f: 64, m: 1 },
      { s: 20, f: 64, m: 1 },
      { s: 21, f: 128, m: 1 },
      { s: 22, f: 128, m: 1 },
      { s: 23, f: 128, m: 1 },
      { s: 24, f: 255, m: 1 },
      { s: 25, f: 255, m: 1 }
    ];
    return function(o) {
      return t[o - 1] || t[6];
    };
  }();
  return typeof onmessage < "u" && (typeof window > "u" || typeof window.document > "u") && function() {
    onmessage = function(t) {
      t && t.data && t.data.action == n && Fn.compress(t.data.data, t.data.mode, t.data.cbn);
    };
  }(), {
    compress: Jr
  };
}();
const yi = async (n) => await Ti(n);
let en = null;
const ki = async (n) => (n = n || '"./lzma_worker-min.js"', en || (await yi(n) ? en = wi(n) : (console.error("lzma\u65E0\u6CD5\u627E\u5230" + n + ": \u65E0\u6CD5\u542F\u52A8worker\u6A21\u5F0F\uFF0C\u5C06\u542F\u7528\u6D4F\u89C8\u5668\u8BA1\u7B97\u6A21\u5F0F\uFF0C\u6027\u80FD\u53D7\u5F71\u54CD"), en = Fn), en)), Ti = (n) => new Promise((e, s) => {
  const r = new XMLHttpRequest();
  r.open("get", n, !0), r.addEventListener("error", (i) => {
    e(!1);
  }), r.addEventListener("load", (i) => {
    r.status === 200 && e(!0), e(!1);
  }), r.send();
}), Si = new ui(5);
let er = "";
const Pi = (n) => {
  er = n;
};
let ys = null;
const nr = (n) => {
  const e = typeof n == "string" ? n : JSON.stringify(n);
  let s = location.pathname;
  s = s.replace(/[^\/\/.]+\.(html|html)$/, "").replace("//", "/");
  const r = er || location.origin + s + "static/lzma_worker.js";
  return console.log("lzma_worker", r), new Promise(async (i) => {
    let a = Date.now();
    window.requestIdleCallback(async () => {
      ys = await ki(r), ys.compress(e, 5, (u, l) => {
        if (!u)
          throw Error("static/lzma_worker.js \u65E0\u6CD5\u52A0\u8F7D\uFF0C\u8BF7\u68C0\u67E5\u8BE5\u6587\u4EF6");
        console.log("compress finish", Date.now() - a);
        const w = [...u], p = new Int8Array(w.length);
        for (let f = 0; f < w.length; f++)
          p[f] = w[f];
        console.log("compress success", Date.now() - a), i(p);
      });
    });
  });
}, on = async (n, e, s) => new Promise((r, i) => {
  const a = new XMLHttpRequest();
  a.open("POST", n, !0), s ? (a.setRequestHeader("xw-body-encoding", "v1"), Si.addTask(() => new Promise((u, l) => {
    nr(e).then((w) => {
      a.send(w.buffer);
    }).finally(() => {
      u();
    });
  }))) : a.send(JSON.stringify(e)), a.onreadystatechange = () => {
  }, a.addEventListener("readystatechange", (u) => {
    a.readyState === 4 && a.status === 200 ? r(void 0) : a.status === 500 && i(a.statusText);
  }), a.addEventListener("error", (u) => {
    console.error("\u957F\u5EA6", JSON.stringify(e).length), i(u);
  });
}), Li = (n, e, s) => {
  window.navigator.sendBeacon !== void 0 ? s ? nr(e).then((r) => {
    window.navigator.sendBeacon(n, r.buffer);
  }) : window.navigator.sendBeacon(n, JSON.stringify(e)) : on(n, e, s);
};
class Ei {
  constructor() {
    b(this, "logs", []);
  }
  get length() {
    return this.logs.length;
  }
  async init() {
  }
  async push(e) {
    try {
      this.logs.push(e);
    } catch (s) {
      console.error(s);
    }
  }
  async compulsionSave() {
  }
  clearArray() {
    this.logs.length = 0;
  }
  async shift(e = 1) {
    let s = [[...this.logs]];
    return this.clearArray(), s;
  }
}
async function xi(n) {
  const e = new Ei();
  return await e.init(), e;
}
var Bi = typeof global == "object" && global && global.Object === Object && global;
const Ci = Bi;
var Mi = typeof self == "object" && self && self.Object === Object && self, Ri = Ci || Mi || Function("return this")();
const ln = Ri;
var Di = ln.Symbol;
const $t = Di;
var sr = Object.prototype, Ai = sr.hasOwnProperty, Oi = sr.toString, ze = $t ? $t.toStringTag : void 0;
function zi(n) {
  var e = Ai.call(n, ze), s = n[ze];
  try {
    n[ze] = void 0;
    var r = !0;
  } catch {
  }
  var i = Oi.call(n);
  return r && (e ? n[ze] = s : delete n[ze]), i;
}
var Hi = Object.prototype, Fi = Hi.toString;
function Ii(n) {
  return Fi.call(n);
}
var Ni = "[object Null]", ji = "[object Undefined]", ks = $t ? $t.toStringTag : void 0;
function Gn(n) {
  return n == null ? n === void 0 ? ji : Ni : ks && ks in Object(n) ? zi(n) : Ii(n);
}
function Xn(n) {
  return n != null && typeof n == "object";
}
var Ui = "[object Symbol]";
function pn(n) {
  return typeof n == "symbol" || Xn(n) && Gn(n) == Ui;
}
function qi(n, e) {
  for (var s = -1, r = n == null ? 0 : n.length, i = Array(r); ++s < r; )
    i[s] = e(n[s], s, n);
  return i;
}
var $i = Array.isArray;
const dn = $i;
var Ji = 1 / 0, Ts = $t ? $t.prototype : void 0, Ss = Ts ? Ts.toString : void 0;
function rr(n) {
  if (typeof n == "string")
    return n;
  if (dn(n))
    return qi(n, rr) + "";
  if (pn(n))
    return Ss ? Ss.call(n) : "";
  var e = n + "";
  return e == "0" && 1 / n == -Ji ? "-0" : e;
}
var Gi = /\s/;
function Xi(n) {
  for (var e = n.length; e-- && Gi.test(n.charAt(e)); )
    ;
  return e;
}
var Wi = /^\s+/;
function Qi(n) {
  return n && n.slice(0, Xi(n) + 1).replace(Wi, "");
}
function Ue(n) {
  var e = typeof n;
  return n != null && (e == "object" || e == "function");
}
var Ps = 0 / 0, Vi = /^[-+]0x[0-9a-f]+$/i, Ki = /^0b[01]+$/i, Zi = /^0o[0-7]+$/i, Yi = parseInt;
function Ls(n) {
  if (typeof n == "number")
    return n;
  if (pn(n))
    return Ps;
  if (Ue(n)) {
    var e = typeof n.valueOf == "function" ? n.valueOf() : n;
    n = Ue(e) ? e + "" : e;
  }
  if (typeof n != "string")
    return n === 0 ? n : +n;
  n = Qi(n);
  var s = Ki.test(n);
  return s || Zi.test(n) ? Yi(n.slice(2), s ? 2 : 8) : Vi.test(n) ? Ps : +n;
}
var ta = "[object AsyncFunction]", ea = "[object Function]", na = "[object GeneratorFunction]", sa = "[object Proxy]";
function ra(n) {
  if (!Ue(n))
    return !1;
  var e = Gn(n);
  return e == ea || e == na || e == ta || e == sa;
}
var ia = ln["__core-js_shared__"];
const En = ia;
var Es = function() {
  var n = /[^.]+$/.exec(En && En.keys && En.keys.IE_PROTO || "");
  return n ? "Symbol(src)_1." + n : "";
}();
function aa(n) {
  return !!Es && Es in n;
}
var oa = Function.prototype, ca = oa.toString;
function ua(n) {
  if (n != null) {
    try {
      return ca.call(n);
    } catch {
    }
    try {
      return n + "";
    } catch {
    }
  }
  return "";
}
var ha = /[\\^$.*+?()[\]{}|]/g, la = /^\[object .+?Constructor\]$/, pa = Function.prototype, da = Object.prototype, ma = pa.toString, fa = da.hasOwnProperty, ga = RegExp(
  "^" + ma.call(fa).replace(ha, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function _a(n) {
  if (!Ue(n) || aa(n))
    return !1;
  var e = ra(n) ? ga : la;
  return e.test(ua(n));
}
function va(n, e) {
  return n == null ? void 0 : n[e];
}
function ir(n, e) {
  var s = va(n, e);
  return _a(s) ? s : void 0;
}
function ba(n, e) {
  return n === e || n !== n && e !== e;
}
var wa = "[object Arguments]";
function xs(n) {
  return Xn(n) && Gn(n) == wa;
}
var ar = Object.prototype, ya = ar.hasOwnProperty, ka = ar.propertyIsEnumerable, Ta = xs(function() {
  return arguments;
}()) ? xs : function(n) {
  return Xn(n) && ya.call(n, "callee") && !ka.call(n, "callee");
};
const Sa = Ta;
var Pa = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, La = /^\w*$/;
function Ea(n, e) {
  if (dn(n))
    return !1;
  var s = typeof n;
  return s == "number" || s == "symbol" || s == "boolean" || n == null || pn(n) ? !0 : La.test(n) || !Pa.test(n) || e != null && n in Object(e);
}
var xa = ir(Object, "create");
const qe = xa;
function Ba() {
  this.__data__ = qe ? qe(null) : {}, this.size = 0;
}
function Ca(n) {
  var e = this.has(n) && delete this.__data__[n];
  return this.size -= e ? 1 : 0, e;
}
var Ma = "__lodash_hash_undefined__", Ra = Object.prototype, Da = Ra.hasOwnProperty;
function Aa(n) {
  var e = this.__data__;
  if (qe) {
    var s = e[n];
    return s === Ma ? void 0 : s;
  }
  return Da.call(e, n) ? e[n] : void 0;
}
var Oa = Object.prototype, za = Oa.hasOwnProperty;
function Ha(n) {
  var e = this.__data__;
  return qe ? e[n] !== void 0 : za.call(e, n);
}
var Fa = "__lodash_hash_undefined__";
function Ia(n, e) {
  var s = this.__data__;
  return this.size += this.has(n) ? 0 : 1, s[n] = qe && e === void 0 ? Fa : e, this;
}
function ee(n) {
  var e = -1, s = n == null ? 0 : n.length;
  for (this.clear(); ++e < s; ) {
    var r = n[e];
    this.set(r[0], r[1]);
  }
}
ee.prototype.clear = Ba;
ee.prototype.delete = Ca;
ee.prototype.get = Aa;
ee.prototype.has = Ha;
ee.prototype.set = Ia;
function Na() {
  this.__data__ = [], this.size = 0;
}
function mn(n, e) {
  for (var s = n.length; s--; )
    if (ba(n[s][0], e))
      return s;
  return -1;
}
var ja = Array.prototype, Ua = ja.splice;
function qa(n) {
  var e = this.__data__, s = mn(e, n);
  if (s < 0)
    return !1;
  var r = e.length - 1;
  return s == r ? e.pop() : Ua.call(e, s, 1), --this.size, !0;
}
function $a(n) {
  var e = this.__data__, s = mn(e, n);
  return s < 0 ? void 0 : e[s][1];
}
function Ja(n) {
  return mn(this.__data__, n) > -1;
}
function Ga(n, e) {
  var s = this.__data__, r = mn(s, n);
  return r < 0 ? (++this.size, s.push([n, e])) : s[r][1] = e, this;
}
function ye(n) {
  var e = -1, s = n == null ? 0 : n.length;
  for (this.clear(); ++e < s; ) {
    var r = n[e];
    this.set(r[0], r[1]);
  }
}
ye.prototype.clear = Na;
ye.prototype.delete = qa;
ye.prototype.get = $a;
ye.prototype.has = Ja;
ye.prototype.set = Ga;
var Xa = ir(ln, "Map");
const Wa = Xa;
function Qa() {
  this.size = 0, this.__data__ = {
    hash: new ee(),
    map: new (Wa || ye)(),
    string: new ee()
  };
}
function Va(n) {
  var e = typeof n;
  return e == "string" || e == "number" || e == "symbol" || e == "boolean" ? n !== "__proto__" : n === null;
}
function fn(n, e) {
  var s = n.__data__;
  return Va(e) ? s[typeof e == "string" ? "string" : "hash"] : s.map;
}
function Ka(n) {
  var e = fn(this, n).delete(n);
  return this.size -= e ? 1 : 0, e;
}
function Za(n) {
  return fn(this, n).get(n);
}
function Ya(n) {
  return fn(this, n).has(n);
}
function to(n, e) {
  var s = fn(this, n), r = s.size;
  return s.set(n, e), this.size += s.size == r ? 0 : 1, this;
}
function ne(n) {
  var e = -1, s = n == null ? 0 : n.length;
  for (this.clear(); ++e < s; ) {
    var r = n[e];
    this.set(r[0], r[1]);
  }
}
ne.prototype.clear = Qa;
ne.prototype.delete = Ka;
ne.prototype.get = Za;
ne.prototype.has = Ya;
ne.prototype.set = to;
var eo = "Expected a function";
function Wn(n, e) {
  if (typeof n != "function" || e != null && typeof e != "function")
    throw new TypeError(eo);
  var s = function() {
    var r = arguments, i = e ? e.apply(this, r) : r[0], a = s.cache;
    if (a.has(i))
      return a.get(i);
    var u = n.apply(this, r);
    return s.cache = a.set(i, u) || a, u;
  };
  return s.cache = new (Wn.Cache || ne)(), s;
}
Wn.Cache = ne;
var no = 500;
function so(n) {
  var e = Wn(n, function(r) {
    return s.size === no && s.clear(), r;
  }), s = e.cache;
  return e;
}
var ro = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, io = /\\(\\)?/g, ao = so(function(n) {
  var e = [];
  return n.charCodeAt(0) === 46 && e.push(""), n.replace(ro, function(s, r, i, a) {
    e.push(i ? a.replace(io, "$1") : r || s);
  }), e;
});
const oo = ao;
function co(n) {
  return n == null ? "" : rr(n);
}
function uo(n, e) {
  return dn(n) ? n : Ea(n, e) ? [n] : oo(co(n));
}
var ho = 1 / 0;
function lo(n) {
  if (typeof n == "string" || pn(n))
    return n;
  var e = n + "";
  return e == "0" && 1 / n == -ho ? "-0" : e;
}
function po(n, e) {
  e = uo(e, n);
  for (var s = 0, r = e.length; n != null && s < r; )
    n = n[lo(e[s++])];
  return s && s == r ? n : void 0;
}
function or(n, e, s) {
  var r = n == null ? void 0 : po(n, e);
  return r === void 0 ? s : r;
}
function mo(n, e) {
  for (var s = -1, r = e.length, i = n.length; ++s < r; )
    n[i + s] = e[s];
  return n;
}
var Bs = $t ? $t.isConcatSpreadable : void 0;
function fo(n) {
  return dn(n) || Sa(n) || !!(Bs && n && n[Bs]);
}
function cr(n, e, s, r, i) {
  var a = -1, u = n.length;
  for (s || (s = fo), i || (i = []); ++a < u; ) {
    var l = n[a];
    e > 0 && s(l) ? e > 1 ? cr(l, e - 1, s, r, i) : mo(i, l) : r || (i[i.length] = l);
  }
  return i;
}
function ur(n) {
  var e = n == null ? 0 : n.length;
  return e ? cr(n, 1) : [];
}
var go = function() {
  return ln.Date.now();
};
const xn = go;
var _o = "Expected a function", vo = Math.max, bo = Math.min;
function wo(n, e, s) {
  var r, i, a, u, l, w, p = 0, f = !1, v = !1, h = !0;
  if (typeof n != "function")
    throw new TypeError(_o);
  e = Ls(e) || 0, Ue(s) && (f = !!s.leading, v = "maxWait" in s, a = v ? vo(Ls(s.maxWait) || 0, e) : a, h = "trailing" in s ? !!s.trailing : h);
  function _(J) {
    var ht = r, gt = i;
    return r = i = void 0, p = J, u = n.apply(gt, ht), u;
  }
  function y(J) {
    return p = J, l = setTimeout(R, e), f ? _(J) : u;
  }
  function k(J) {
    var ht = J - w, gt = J - p, zt = e - ht;
    return v ? bo(zt, a - gt) : zt;
  }
  function T(J) {
    var ht = J - w, gt = J - p;
    return w === void 0 || ht >= e || ht < 0 || v && gt >= a;
  }
  function R() {
    var J = xn();
    if (T(J))
      return tt(J);
    l = setTimeout(R, k(J));
  }
  function tt(J) {
    return l = void 0, h && r ? _(J) : (r = i = void 0, u);
  }
  function M() {
    l !== void 0 && clearTimeout(l), p = 0, r = w = i = l = void 0;
  }
  function C() {
    return l === void 0 ? u : tt(xn());
  }
  function V() {
    var J = xn(), ht = T(J);
    if (r = arguments, i = this, w = J, ht) {
      if (l === void 0)
        return y(w);
      if (v)
        return clearTimeout(l), l = setTimeout(R, e), _(w);
    }
    return l === void 0 && (l = setTimeout(R, e)), u;
  }
  return V.cancel = M, V.flush = C, V;
}
class yo {
  constructor() {
    b(this, "logsObj"), b(this, "initPromise"), this.initPromise = this.init();
  }
  async init() {
    return this.logsObj = await xi(), this.logsObj;
  }
  get length() {
    var e, s;
    return (s = (e = this.logsObj) == null ? void 0 : e.length) != null ? s : 0;
  }
  getLogs() {
    var e;
    return ((e = this.logsObj) == null ? void 0 : e.logs) || [];
  }
  async cacheLog(e) {
    var s;
    await this.initPromise, await ((s = this.logsObj) == null ? void 0 : s.push(e));
  }
  async send(e) {
    var s;
    await this.initPromise;
    const r = await ((s = this.logsObj) == null ? void 0 : s.shift());
    r != null && r.length && await e(ur(r));
  }
  async sendByBeacon(e) {
    var s;
    await this.initPromise;
    const r = await ((s = this.logsObj) == null ? void 0 : s.shift());
    r != null && r.length && await e(r);
  }
}
function ko(n) {
  return gn(n, "String");
}
function To(n) {
  return gn(n, "Array");
}
function So(n) {
  return gn(n, "Object");
}
function Po(n) {
  return typeof n == "function";
}
function Cs(n, e = "Object") {
  return To(n) ? n.every((s) => gn(s, e)) : !1;
}
function gn(n, e = "Object") {
  return Object.prototype.toString.call(n) === `[object ${e}]`;
}
const Lo = window.indexedDB, Eo = /* @__PURE__ */ new Set(["add", "clear", "count", "delete", "get", "getAll", "getAllKeys", "getKey", "openCursor", "openKeyCursor", "put"]);
function xo(n, e, ...s) {
  return new Promise(async (r, i) => {
    try {
      const a = (await this.createTransaction(n)).objectStore(n);
      let u = a[e].call(a, ...s);
      u ? (u.onsuccess = function(l) {
        r(or(l, "target.result"));
      }, u.onerror = function(l) {
        console.log("---storeOperate onerror", n, e, l), i(l);
      }) : r(void 0);
    } catch (a) {
      i(a);
    }
  });
}
function Bo(n) {
  const e = this;
  let s = {};
  return Eo.forEach((r) => {
    s[r] = function(...i) {
      var a;
      return (a = e == null ? void 0 : e.manager) == null ? void 0 : a.pushTask(
        () => xo.call(e, n, r, ...i)
      );
    };
  }), s;
}
class Co {
  constructor() {
    b(this, "dbManagerMap", /* @__PURE__ */ new Map());
  }
  getOrCreateDBManager(e) {
    if (this.dbManagerMap.has(e))
      return this.dbManagerMap.get(e);
    const s = new Mo(e);
    return this.dbManagerMap.set(e, s), s;
  }
  get(e) {
    return this.getOrCreateDBManager(e);
  }
  clear(e) {
    const s = this.dbManagerMap.get(e);
    !s || (s.close(), this.dbManagerMap.delete(e));
  }
}
class Mo {
  constructor(e) {
    b(this, "initPromise", Promise.resolve()), b(this, "openStatus", ""), b(this, "version", 0), b(this, "dbName"), b(this, "db", null), b(this, "isClose", !0), b(this, "task", Promise.resolve()), this.dbName = e, this.init();
  }
  pushTask(e) {
    if (this.isClose) {
      console.log("----task error, IndexDB is close");
      return;
    }
    let s = this.task.then(() => {
      try {
        return Po(e) ? e() : e;
      } catch (r) {
        console.log("----task error", r);
      }
    });
    return this.task = s, s;
  }
  close() {
    const e = () => {
      this.openStatus = "", this.version = 0, this.db && (this.db.close(), this.db = null);
    };
    if (this.isClose)
      e();
    else {
      let s = this.pushTask(e);
      return this.isClose = !0, s;
    }
  }
  transTransactionParam(e) {
    return ko(e) ? [{ storeName: e }] : Cs(e, "String") ? e.map((s) => ({ storeName: s })) : So(e) ? [e] : Cs(e) ? e : (console.warn("[transTransactionParam]\u5165\u53C2\u683C\u5F0F\u4E0D\u6B63\u786E", e), []);
  }
  async transaction(e, s = "readonly") {
    await this.initPromise;
    const r = this.transTransactionParam(e);
    if (!r.length)
      return;
    const i = [];
    return r.forEach((a) => {
      !this.db || this.db.objectStoreNames.contains(a.storeName) || i.push((u) => {
        u.createObjectStore(a.storeName, a.option);
      });
    }), i.length > 0 && await this.upgradeneeded(i), Bo.bind({
      manager: this,
      createTransaction: async (a) => {
        if (await this.initPromise, !!this.db)
          return this.db.transaction(a, s);
      }
    });
  }
  init(e, s) {
    let r = this.initPromise;
    this.initPromise = new Promise(async (i, a) => {
      await r, await this.close();
      const u = Lo.open(this.dbName, e);
      let l = setTimeout(() => {
        a(new Error("[IndexDB\u8FDE\u63A5\u8D85\u65F6] name: " + this.dbName + " \u8BF7\u5C1D\u8BD5\u5237\u65B0\u6216\u91CD\u542F\u6D4F\u89C8\u5668"));
      }, 1e4);
      u.onsuccess = () => {
        clearTimeout(l), this.openStatus = "success", this.db = u.result;
        const w = this.db;
        this.isClose = !1;
        const p = w.version;
        this.version = w.version, w.onclose = () => {
          this.isClose = !0, console.log("[indexDB\u5173\u95ED]", p);
        }, console.log(`[indexDB\u521D\u59CB\u5316] 
onsuccess name: ` + this.dbName + ` 
version: ` + p), i();
      }, u.onupgradeneeded = (w) => {
        this.openStatus = "upgradeneeded";
        const p = or(w, "target.result");
        p ? (s && s(p), console.log("[indexDB\u521D\u59CB\u5316] onupgradeneeded name: " + this.dbName)) : console.error("[indexDB\u521D\u59CB\u5316\u5931\u8D25] onupgradeneeded name: " + this.dbName);
      }, u.onerror = (w) => {
        clearTimeout(l), console.error("[indexDB\u521D\u59CB\u5316\u5931\u8D25] name: " + this.dbName, w), i();
      };
    });
  }
  async upgradeneeded(e) {
    try {
      this.init(this.version + 1, function(s) {
        let r = e.length;
        for (; r--; )
          e[r](s);
      }), await this.initPromise;
    } catch (s) {
      console.error("[DBManager.upgradeneeded\u5931\u8D25]", s);
    }
  }
}
const Bn = new Co();
class Ro {
  constructor(e = "logs") {
    b(this, "logs", []), b(this, "thisSize", 0), b(this, "dbLength", 0), b(this, "dbName", "apaas-track"), b(this, "storeName", "logs"), b(this, "maxSize", 1024 * 1024), this.storeName = e;
  }
  get length() {
    return this.dbLength + this.logs.length;
  }
  async init() {
    let e = [];
    const s = await (await Bn.get(this.dbName)).transaction(this.storeName, "readonly");
    s && (e = await s(this.storeName).getAllKeys()), this.dbLength = e.length;
  }
  async push(e) {
    try {
      const s = JSON.stringify(e).length;
      this.thisSize + s >= this.maxSize ? (await this.save(), this.logs.push(e), this.thisSize = s, s >= this.maxSize && await this.save()) : (this.logs.push(e), this.thisSize += JSON.stringify(e).length);
    } catch (s) {
      console.error(s);
    }
  }
  async compulsionSave() {
    this.logs.length !== 0 && await this.save();
  }
  clearArray() {
    this.logs.length = 0, this.thisSize = 0;
  }
  async save() {
    try {
      const e = this.logs;
      if (e.length === 0)
        return;
      const s = await (await Bn.get(this.dbName)).transaction(this.storeName, "readwrite");
      s && (await s(this.storeName).add(e, Date.now()), this.dbLength++, this.clearArray());
    } catch (e) {
      console.error(e);
    }
  }
  async shift(e = 1) {
    let s = [];
    if (this.dbLength !== 0 && (s = await this.shiftDB(e)), e - s.length > 0 && this.logs.length > 0) {
      let r = [...this.logs];
      this.clearArray(), s.push(r);
    }
    return s;
  }
  async shiftDB(e) {
    try {
      let s = [];
      const r = await (await Bn.get(this.dbName)).transaction(this.storeName, "readwrite");
      if (r) {
        const i = r(this.storeName);
        let a = await i.getAllKeys();
        if (a.length === 0)
          return [];
        const u = this.getRange(e, a), l = [];
        u.forEach((p) => {
          l.push(i.get(p));
        }), s = await Promise.all(l);
        const w = [];
        u.forEach((p) => {
          w.push(i.delete(p));
        }), await Promise.all(w), a = await i.getAllKeys(), this.dbLength = a.length;
      }
      return s;
    } catch (s) {
      return console.error(s), [];
    }
  }
  getRange(e, s) {
    const r = [];
    for (let i = 0; i < e && i < s.length; i++)
      r.push(s[i]);
    return r;
  }
}
async function Do(n) {
  const e = new Ro(n);
  return await e.init(), e;
}
class Ao {
  constructor() {
    b(this, "logsDB"), b(this, "initPromise"), this.initPromise = this.init();
  }
  async init() {
    return this.logsDB = await Do(), this.logsDB;
  }
  get length() {
    var e, s;
    return (s = (e = this.logsDB) == null ? void 0 : e.length) != null ? s : 0;
  }
  getLogs() {
    var e;
    return ((e = this.logsDB) == null ? void 0 : e.logs) || [];
  }
  async cacheLog(e) {
    var s;
    await this.initPromise, await ((s = this.logsDB) == null ? void 0 : s.push(e));
  }
  async send(e) {
    var s;
    await this.initPromise;
    const r = await ((s = this.logsDB) == null ? void 0 : s.shift(5));
    r != null && r.length && e(ur(r));
  }
  async sendByBeacon(e) {
    var s;
    await this.initPromise, await ((s = this.logsDB) == null ? void 0 : s.compulsionSave());
  }
}
class Bt extends hn {
  constructor(e) {
    super(e), b(this, "options"), b(this, "logsSender"), b(this, "nextTickLogs", []), b(this, "isStart", !1), b(this, "listenPostMessageHandler"), this.options = e, this.initStorageData(), this.initBrowserLog(), e.commonLog && this.initCommonLog(e.commonLog), console.log("this.options.useIndexDB", this.options.useIndexDB), this.options.useIndexDB ? this.logsSender = new Ao() : this.logsSender = new yo();
  }
  initStorageData() {
    const e = JSON.parse(
      localStorage.getItem("apaas-track") || "{}"
    );
    e.anonymousid || (e.anonymousid = be()), e.logs || (e.logs = []), e.distinctid = be(), localStorage.setItem("apaas-track", JSON.stringify(e));
  }
  getStorageData() {
    return JSON.parse(
      localStorage.getItem("apaas-track") || "{}"
    );
  }
  updateStorageData(e) {
    localStorage.setItem("apaas-track", JSON.stringify(e));
  }
  get anonymousid() {
    var e;
    return ((e = this.browserLog) == null ? void 0 : e.anonymousid) || this.getStorageData().anonymousid;
  }
  get distinctid() {
    var e;
    return ((e = this.browserLog) == null ? void 0 : e.distinctid) || this.getStorageData().distinctid;
  }
  initBrowserLog() {
    const e = new zn.exports.UAParser();
    e.setUA(navigator.userAgent);
    const s = e.getResult(), r = s.os.version || "", i = s.os.name || "", a = s.browser.name || "", u = s.browser.version || "", l = navigator.vendor, w = Zs.exports(
      `${i}${r}${l}${a}${u}`
    ), p = location.href;
    this.browserLog = {
      system: i,
      systemver: r,
      manufacturer: l,
      browser: a,
      browserver: u,
      terminalid: w,
      anonymousid: this.anonymousid,
      distinctid: this.distinctid,
      url: p,
      logsdkver: sn
    };
  }
  start(...e) {
    if (this.isStart)
      return;
    let s = 0, r = 60 * 5 * 1e3, i = null, a = window.setInterval(() => {
      u();
    }, this.options.timer || 1e4);
    setTimeout(() => {
      u();
    }, 2e3);
    const u = () => {
      this.send().then(() => {
        s && (s = 0), i && (clearInterval(i), i = null), a || (a = window.setInterval(() => {
          u();
        }, this.options.timer || 1e4));
      }).catch((l) => {
        console.error("track send error", l), s++, s >= 5 && (a && clearInterval(a), a = null, i || (i = window.setInterval(() => {
          u();
        }, r)));
      });
    };
    super.start(), this.sendLegancyLogs(), this.isStart = !0, this.listenPostMessage();
  }
  getLegancyLogs() {
    return this.getStorageData().logs || [];
  }
  clearLegancyLogs() {
    const e = this.getStorageData();
    delete e.logs, this.updateStorageData(e);
  }
  sendLegancyLogs() {
    this.getLegancyLogs().forEach((e) => {
      this.addLogToQueue(e, !1, !1);
    }), this.clearLegancyLogs();
  }
  addToLegancyLog(e) {
    e = this.transformLog(e);
    const s = [...this.getLegancyLogs() || [], e], r = this.getStorageData();
    r.logs = s, this.updateStorageData(r);
  }
  listenPostMessage() {
    this.listenPostMessageHandler = (e) => {
      var s;
      const r = (e == null ? void 0 : e.data) || {};
      if (r.type === "getWebCommonParams") {
        const i = Array.from(document.querySelectorAll("iframe"));
        for (let a of i)
          (s = a == null ? void 0 : a.contentWindow) == null || s.postMessage(
            {
              type: "receiveWebCommonParams",
              data: {
                url: this.options.url,
                timer: this.options.timer || 1e4,
                zip: this.options.zip,
                commonLog: this.commonLog
              }
            },
            "*"
          );
      } else if (r.type === "sendApaasLog") {
        const i = r.data, { log: a, isImmediate: u } = i;
        this.sendLog(a, u);
      }
    }, window.addEventListener("message", this.listenPostMessageHandler);
  }
  divideLogsSend(e) {
    return this.options.useIndexDB ? on(this.options.url, e, this.getZip()) : Oo(e, {
      url: this.options.url,
      zip: this.getZip(),
      maxSize: this.getMaxSize()
    });
  }
  async sendByNextTick(e) {
    if (this.nextTickLogs.push(e), await On(), !this.nextTickLogs.length)
      return;
    const s = JSON.parse(JSON.stringify(this.nextTickLogs));
    this.divideLogsSend(this.nextTickLogs).catch((r) => {
      this.nextTickLogs = [...s, this.nextTickLogs];
    }), this.nextTickLogs.length = 0;
  }
  async send() {
    if (this.logsSender.length)
      try {
        await this.logsSender.send(this.divideLogsSend.bind(this));
      } catch {
      }
  }
  async sendLog(e, s = !1) {
    try {
      e = JSON.parse(JSON.stringify(e));
    } catch {
    }
    s ? this.sendByNextTick(e) : await this.logsSender.cacheLog(e);
  }
  getZip() {
    return this.options.zip !== void 0 ? this.options.zip : !0;
  }
  getMaxSize() {
    const e = this.options.zip !== void 0 ? this.options.zip : !0;
    return 1024 * 1024 / (e ? 2 : 1);
  }
  async sendByBeacon(e) {
    const s = async (r) => Li(
      `${this.options.url}`,
      r,
      e !== void 0 ? e : this.getZip()
    );
    this.logsSender.length && await this.logsSender.sendByBeacon(s.bind(this));
  }
}
function Oo(n, e) {
  const { url: s, zip: r, maxSize: i } = e;
  if (JSON.stringify(n).length <= i || n.length === 1)
    return on(s, n, r);
  {
    const a = ii(n, i), u = [];
    return a.forEach((l) => {
      u.push(on(s, l, r));
    }), Promise.all(u);
  }
}
class de extends at {
  constructor(e) {
    super(e, "click"), b(this, "paths", ""), b(this, "customProperties", {}), b(this, "name", "");
  }
  getProperties() {
    return {
      name: this.name,
      paths: this.paths,
      customProperties: this.customProperties
    };
  }
  setProperties(e) {
    e.paths && (this.paths = e.paths), e.name && (this.name = e.name), this.customProperties = e.customProperties;
  }
}
const zo = (n) => !n || n === document || n.tagName === "HTML" || !n.hasAttribute ? !1 : n.hasAttribute("apaas-track-click") && n.getAttribute("apaas-track-click") !== "false", Ms = (n) => {
  n.target;
  const e = n.composedPath();
  if (!e.length)
    return !1;
  for (let s = 0; s < e.length; s++) {
    const r = e[s];
    if (r === window)
      return !1;
    if (zo(r))
      return r;
  }
  return !1;
}, In = (n) => {
  const e = n.tagName, s = n.id, r = n.className, i = (l, w, p) => `${l}${w ? "#" + w : ""}${p ? "." + p : ""}`;
  let a = i(e, s, r) + " > ", u = n.parentElement;
  for (; u; ) {
    const l = u.tagName, w = u.id, p = u.className;
    a += i(l, w, p) + " > ", u = u.parentElement;
  }
  return a = a.replace(/\s>\s$/, ""), a && (a = a.split(" > ").reverse().join(" > ")), a;
}, Ho = (n, e) => {
  const s = (r, i) => r === i;
  if (n === document)
    return !0;
  {
    const r = e.target;
    if (s(n, r))
      return !0;
    let i = r.parentElement;
    if (!i)
      return !1;
    for (; i; ) {
      if (s(n, i))
        return !0;
      i = i.parentElement;
    }
    return !1;
  }
}, Fo = (n, e) => {
  const s = () => !0, r = (a) => Ms(a), i = (a) => {
    a.target;
    const u = (e == null ? void 0 : e.collectSelectors) || [];
    if (!u.length)
      return null;
    let l = [];
    for (let p = 0; p < u.length; p++) {
      const { selector: f, name: v } = u[p], h = document.querySelectorAll(f);
      !h || !h.length || h.forEach((_) => {
        l.push({
          name: v,
          selector: f,
          element: _
        });
      });
    }
    if (!l.length)
      return null;
    let w = [];
    for (let p = 0; p < l.length; p++) {
      const {
        element: f,
        name: v,
        selector: h
      } = l[p];
      f && Ho(f, a) && w.push({
        name: v,
        selector: h,
        element: f
      });
    }
    return w;
  };
  e && document.addEventListener(
    "click",
    (a) => {
      if (!((e == null ? void 0 : e.collectUrl) || s)(location))
        return;
      const u = ((e == null ? void 0 : e.collectElement) || r)(a), l = i(a);
      if (!u && (!l || !l.length))
        return;
      const w = Ms(a);
      if (w) {
        let p = {};
        const f = (e == null ? void 0 : e.customProperty) || [], v = w.attributes;
        let h = "";
        const _ = v.getNamedItem("apaas-track-click");
        if (_ && _.nodeName === "apaas-track-click") {
          const T = _.nodeValue;
          T && T !== "false" && T !== "true" && (h = T);
        }
        for (let T of v) {
          let R = T.nodeName;
          const tt = T.nodeValue;
          R.startsWith("data-apaastrack-") ? p[R.replace("data-apaastrack-", "")] = tt || "" : f.length && f.forEach((M) => {
            if (R === M) {
              const C = R.replace(
                /-[A-Za-z]/,
                (V) => V[1].toUpperCase()
              );
              p[C] = tt || "";
            }
          });
        }
        let y = "";
        e != null && e.trackElementPath && (y = In(w));
        const k = new de(n);
        k.setProperties({
          name: p.name || h,
          paths: y,
          customProperties: p
        }), n.addLogByEvent(k);
      }
      if (l && l.length)
        for (let p of l) {
          let f = "";
          e != null && e.trackElementPath && (f = In(
            p.element
          ));
          const v = new de(n);
          v.setProperties({
            name: p.name,
            paths: f,
            customProperties: {
              selector: p.selector,
              name: p.name
            }
          }), n.addLogByEvent(v);
        }
    },
    !0
  );
}, Io = (n, e, s, r) => {
  const i = {
    paths: "",
    customProperties: {}
  };
  "customProperties" in e ? i.customProperties = e.customProperties : i.customProperties = e;
  const a = Ot(n, "click");
  let u = e.paths || "";
  r && !u && (s == null ? void 0 : s.trackElementPath) && (u = In(r.target), i.paths = u), a.setProperties(i), n.addLogByEvent(a);
}, No = (n) => {
  n || (n = {}), de.eventOptions = n, de.initApaasTrackHook = (e) => {
    e.executeClickEvent = (s, r) => {
      Io(e, s, n, r);
    };
  }, de.startApaasTrackHook = (e) => {
    Fo(e, n);
  }, Bt.registerEvent("click", de);
}, ge = [], hr = (n) => {
  ge.length || window.addEventListener("pagehide", (...e) => {
    ge.forEach((s) => {
      s(...e);
    });
  }), ge.push(n);
}, jo = (n) => {
  for (let e = 0; e < ge.length; e++) {
    const s = ge[e];
    n === s && ge.splice(e, 1);
  }
}, At = [], Uo = (n) => {
  At.length || (document.addEventListener("click", (...e) => {
    At.forEach((s) => {
      s(...e);
    });
  }), document.addEventListener("mouseover", (...e) => {
    At.forEach((s) => {
      s(...e);
    });
  }), document.addEventListener("scroll", (...e) => {
    At.forEach((s) => {
      s(...e);
    });
  }), document.addEventListener("keydown", (...e) => {
    At.forEach((s) => {
      s(...e);
    });
  })), At.push(n);
}, qo = (n) => {
  for (let e = 0; e < At.length; e++) {
    const s = At[e];
    n === s && At.splice(e, 1);
  }
};
class Rs extends at {
  constructor(e) {
    super(e, "close");
  }
}
const $o = (n) => {
  hr((e) => {
    if (n) {
      n.sendByBeacon();
      const s = Ot(n, "close").getEventLog();
      n.addToLegancyLog(s);
    }
  });
}, Jo = () => {
  Rs.startApaasTrackHook = (n) => {
    $o(n);
  }, Bt.registerEvent("close", Rs);
};
class Ds extends at {
  constructor(e) {
    super(e, "entermain"), b(this, "groupid", ""), b(this, "localtime", ""), b(this, "cheatinfo", {});
  }
  getProperties() {
    return {
      groupid: this.groupid,
      localtime: this.localtime,
      cheatinfo: this.cheatinfo
    };
  }
  setProperties(e) {
    this.groupid = e.groupid, this.localtime = Date.now().toString();
  }
}
const Go = () => {
  Ds.initApaasTrackHook = (n) => {
    n.executeEnterMainEvent = () => {
      const e = Ot(n, "entermain");
      e.setProperties({
        groupid: n.groupid
      }), n.addLogByEvent(e);
    };
  }, hn.registerEvent("entermain", Ds);
}, Xo = (n, e = {}) => {
  Yt(e) || (e = {});
  let s = n ? n.split("?") : [];
  if (s.shift(), s.length > 0) {
    s = s.join("?").split("&");
    for (const r of s) {
      const i = r.split("=");
      try {
        e[i[0]] = decodeURIComponent(i[1]);
      } catch {
        e[i[0]] = i[1];
      }
    }
  }
  return e;
}, Ie = (n, e) => {
  let s = "";
  switch (n) {
    case "":
    case "text":
    case "json":
      if (Je(e))
        try {
          s = JSON.parse(e), s = vs(s, {
            maxDepth: 10,
            keyMaxLen: 1e4,
            pretty: !0,
            standardJSON: !0
          });
        } catch {
          s = Qs(String(e), 1e4);
        }
      else
        Yt(e) || Et(e) ? s = vs(e, {
          maxDepth: 10,
          keyMaxLen: 1e4,
          pretty: !0,
          standardJSON: !0
        }) : typeof e < "u" && (s = Object.prototype.toString.call(e));
      break;
    case "blob":
    case "document":
    case "arraybuffer":
    case "formdata":
    default:
      typeof e < "u" && (s = Object.prototype.toString.call(e));
      break;
  }
  return s;
}, lr = (n) => {
  if (!n)
    return null;
  let e = null;
  if (typeof n == "string")
    try {
      e = JSON.parse(n);
    } catch {
      const s = n.split("&");
      if (s.length === 1)
        e = n;
      else {
        e = {};
        for (let r of s) {
          const i = r.split("=");
          e[i[0]] = i[1] === void 0 ? "undefined" : i[1];
        }
      }
    }
  else if (Vr(n))
    if (e = {}, Et(n) && Gs(n[0]))
      e = n;
    else
      for (const [s, r] of n)
        e[s] = typeof r == "string" ? r : "[object Object]";
  else
    Zr(n) ? e = n : e = `[object ${Kr(n)}]`;
  return e;
}, As = (n = "") => (n.startsWith("//") && (n = `${new URL(window.location.href).protocol}${n}`), n.startsWith("http") ? new URL(n) : new URL(n, window.location.href));
class pr {
  constructor() {
    b(this, "id", ""), b(this, "name", ""), b(this, "method", ""), b(this, "url", ""), b(this, "status", 0), b(this, "statusText", ""), b(this, "cancelState", 0), b(this, "readyState", 0), b(this, "header", null), b(this, "responseType", ""), b(this, "requestType", "xhr"), b(this, "requestHeader", null), b(this, "response"), b(this, "responseSize", 0), b(this, "responseSizeText", ""), b(this, "startTime", 0), b(this, "startTimeText", ""), b(this, "endTime", 0), b(this, "costTime", 0), b(this, "getData", null), b(this, "postData", null), b(this, "postLength", 0), b(this, "actived", !1), b(this, "noVConsole", !1), b(this, "_XMLReq", null), this.id = be();
  }
}
class Wo {
  constructor(e, s, r) {
    b(this, "resp"), b(this, "item"), b(this, "onUpdateCallback"), this.resp = e, this.item = s, this.onUpdateCallback = r, this.mockReader();
  }
  set(e, s, r) {
    return Reflect.set(e, s, r);
  }
  get(e, s) {
    const r = Reflect.get(e, s);
    switch (s) {
      case "arrayBuffer":
      case "blob":
      case "formData":
      case "json":
      case "text":
        return () => (this.item.responseType = s.toLowerCase(), r.apply(e).then((i) => (this.item.response = Ie(
          this.item.responseType,
          i
        ), this.onUpdateCallback(this.item), i)));
    }
    return typeof r == "function" ? r.bind(e) : r;
  }
  mockReader() {
    let e;
    if (!this.resp.body || typeof this.resp.body.getReader != "function")
      return;
    const s = this.resp.body.getReader;
    this.resp.body.getReader = () => {
      const r = s.apply(this.resp.body);
      if (this.item.readyState === 4)
        return r;
      const i = r.read, a = r.cancel;
      return this.item.responseType = "arraybuffer", r.read = () => i.apply(r).then(
        (u) => {
          if (!e)
            e = new Uint8Array(u.value);
          else {
            const l = new Uint8Array(
              e.length + u.value.length
            );
            l.set(e), l.set(
              u.value,
              e.length
            ), e = l;
          }
          return this.item.endTime = Date.now(), this.item.costTime = this.item.endTime - (this.item.startTime || this.item.endTime), this.item.readyState = u.done ? 4 : 3, this.item.statusText = u.done ? String(this.item.status) : "Loading", this.item.responseSize = e.length, this.item.responseSizeText = je(
            this.item.responseSize
          ), u.done && (this.item.response = Ie(
            this.item.responseType,
            e
          )), this.onUpdateCallback(this.item), u;
        }
      ), r.cancel = (...u) => (this.item.cancelState = 2, this.item.statusText = "Cancel", this.item.endTime = Date.now(), this.item.costTime = this.item.endTime - (this.item.startTime || this.item.endTime), this.item.response = Ie(
        this.item.responseType,
        e
      ), this.onUpdateCallback(this.item), a.apply(r, u)), r;
    };
  }
}
class Qo {
  constructor(e) {
    b(this, "onUpdateCallback"), this.onUpdateCallback = e;
  }
  apply(e, s, r) {
    const i = r[0], a = r[1], u = new pr();
    return this.beforeFetch(u, i, a), e.apply(window, r).then(this.afterFetch(u)).catch((l) => {
      throw u.endTime = Date.now(), u.costTime = u.endTime - (u.startTime || u.endTime), this.onUpdateCallback(u), l;
    });
  }
  beforeFetch(e, s, r) {
    let i, a = "GET", u = null;
    if (Je(s) ? (a = (r == null ? void 0 : r.method) || "GET", i = As(s), u = (r == null ? void 0 : r.headers) || null) : (a = s.method || "GET", i = As(s.url), u = s.headers), e.method = a, e.requestType = "fetch", e.requestHeader = u, e.url = i.toString(), e.name = (i.pathname.split("/").pop() || "") + i.search, e.status = 0, e.statusText = "Pending", e.readyState = 1, !e.startTime) {
      e.startTime = Date.now();
      const l = Js(e.startTime);
      e.startTimeText = `${l.year}-${l.month}-${l.day} ${l.hour}:${l.minute}:${l.second}.${l.millisecond}`;
    }
    if (Object.prototype.toString.call(u) === "[object Headers]") {
      e.requestHeader = {};
      for (const [l, w] of u)
        e.requestHeader[l] = w;
    } else
      e.requestHeader = u;
    if (i.search && i.searchParams) {
      e.getData = {};
      for (const [l, w] of i.searchParams)
        e.getData[l] = w;
    }
    r != null && r.body && (e.postData = lr(r.body)), this.onUpdateCallback(e);
  }
  afterFetch(e) {
    return (s) => {
      e.endTime = Date.now(), e.costTime = e.endTime - (e.startTime || e.endTime), e.status = s.status, e.statusText = String(s.status);
      let r = !1;
      e.header = {};
      for (const [i, a] of s.headers)
        e.header[i] = a, r = a.toLowerCase().indexOf("chunked") > -1 ? !0 : r;
      return r ? e.readyState = 3 : (e.readyState = 4, this.handleResponseBody(s.clone(), e).then(
        (i) => {
          e.responseSize = typeof i == "string" ? i.length : i.byteLength, e.responseSizeText = je(e.responseSize), e.response = Ie(
            e.responseType,
            i
          ), this.onUpdateCallback(e);
        }
      )), this.onUpdateCallback(e), new Proxy(
        s,
        new Wo(s, e, this.onUpdateCallback)
      );
    };
  }
  handleResponseBody(e, s) {
    const r = e.headers.get("content-type");
    return r && r.includes("application/json") ? (s.responseType = "json", e.text()) : r && (r.includes("text/html") || r.includes("text/plain")) ? (s.responseType = "text", e.text()) : (s.responseType = "arraybuffer", e.arrayBuffer());
  }
}
class dr {
  static create(e) {
    return new Proxy(window.fetch, new Qo(e));
  }
}
b(dr, "origFetch", window.fetch);
class Vo {
  constructor(e, s) {
    b(this, "XMLReq"), b(this, "item"), b(this, "onUpdateCallback"), this.XMLReq = e, this.XMLReq.onreadystatechange = () => {
      this.onReadyStateChange();
    }, this.XMLReq.onabort = () => {
      this.onAbort();
    }, this.XMLReq.ontimeout = () => {
      this.onTimeout();
    }, this.item = new pr(), this.item._XMLReq = e, this.item.requestType = "xhr", this.onUpdateCallback = s;
  }
  get(e, s) {
    switch (s) {
      case "_noVConsole":
        return this.item.noVConsole;
      case "open":
        return this.getOpen(e);
      case "send":
        return this.getSend(e);
      case "setRequestHeader":
        return this.getSetRequestHeader(e);
      default:
        const r = Reflect.get(e, s);
        return typeof r == "function" ? r.bind(e) : r;
    }
  }
  set(e, s, r) {
    switch (s) {
      case "_noVConsole":
        return this.item.noVConsole = !!r, !1;
      case "onreadystatechange":
        return this.setOnReadyStateChange(e, s, r);
      case "onabort":
        return this.setOnAbort(e, s, r);
      case "ontimeout":
        return this.setOnTimeout(e, s, r);
    }
    return Reflect.set(e, s, r);
  }
  onReadyStateChange() {
    this.item.readyState = this.XMLReq.readyState, this.item.responseType = this.XMLReq.responseType, this.item.endTime = Date.now(), this.item.costTime = this.item.endTime - this.item.startTime, this.updateItemByReadyState(), this.item.response = Ie(
      this.item.responseType,
      this.item.response
    ), this.triggerUpdate();
  }
  onAbort() {
    this.item.cancelState = 1, this.item.statusText = "Abort", this.triggerUpdate();
  }
  onTimeout() {
    this.item.cancelState = 3, this.item.statusText = "Timeout", this.triggerUpdate();
  }
  triggerUpdate() {
    this.item.noVConsole || this.onUpdateCallback(this.item);
  }
  getOpen(e) {
    const s = Reflect.get(e, "open");
    return (...r) => {
      const i = r[0], a = r[1];
      return this.item.method = i ? i.toUpperCase() : "GET", this.item.url = a || "", this.item.name = this.item.url.replace(new RegExp("[/]*$"), "").split("/").pop() || "", this.item.getData = Xo(this.item.url, {}), this.triggerUpdate(), s.apply(e, r);
    };
  }
  getSend(e) {
    const s = Reflect.get(e, "send");
    return (...r) => {
      const i = r[0];
      return i && Object.prototype.hasOwnProperty.call(i, "length") && (this.item.postLength = i.length), this.item.postData = lr(i), this.triggerUpdate(), s.apply(e, r);
    };
  }
  getSetRequestHeader(e) {
    const s = Reflect.get(e, "setRequestHeader");
    return (...r) => (this.item.requestHeader || (this.item.requestHeader = {}), this.item.requestHeader[r[0]] = r[1], this.triggerUpdate(), s.apply(e, r));
  }
  setOnReadyStateChange(e, s, r) {
    return Reflect.set(e, s, (...i) => {
      this.onReadyStateChange(), r.apply(e, i);
    });
  }
  setOnAbort(e, s, r) {
    return Reflect.set(e, s, (...i) => {
      this.onAbort(), r.apply(e, i);
    });
  }
  setOnTimeout(e, s, r) {
    return Reflect.set(e, s, (...i) => {
      this.onTimeout(), r.apply(e, i);
    });
  }
  updateItemByReadyState() {
    switch (this.XMLReq.readyState) {
      case 0:
      case 1:
        if (this.item.status = 0, this.item.statusText = "Pending", !this.item.startTime) {
          this.item.startTime = Date.now();
          const r = Js(this.item.startTime);
          this.item.startTimeText = `${r.year}-${r.month}-${r.day} ${r.hour}:${r.minute}:${r.second}.${r.millisecond}`;
        }
        break;
      case 2:
        this.item.status = this.XMLReq.status, this.item.statusText = "Loading", this.item.header = {};
        const e = this.XMLReq.getAllResponseHeaders() || "", s = e.split(`
`);
        for (let r = 0; r < s.length; r++) {
          const i = s[r];
          if (!i)
            continue;
          const a = i.split(": "), u = a[0], l = a.slice(1).join(": ");
          this.item.header[u] = l;
        }
        break;
      case 3:
        this.item.status = this.XMLReq.status, this.item.statusText = "Loading", !!this.XMLReq.response && this.XMLReq.response.length && (this.item.responseSize = this.XMLReq.response.length, this.item.responseSizeText = je(
          this.item.responseSize
        ));
        break;
      case 4:
        this.item.status = this.XMLReq.status || this.item.status || 0, this.item.statusText = String(this.item.status), this.item.endTime = Date.now(), this.item.costTime = this.item.endTime - (this.item.startTime || this.item.endTime), this.item.response = this.XMLReq.response, !!this.XMLReq.response && this.XMLReq.response.length && (this.item.responseSize = this.XMLReq.response.length, this.item.responseSizeText = je(
          this.item.responseSize
        ));
        break;
      default:
        this.item.status = this.XMLReq.status, this.item.statusText = "Unknown";
        break;
    }
  }
}
class mr {
  static create(e) {
    return new Proxy(XMLHttpRequest, {
      construct(s) {
        const r = new s();
        return new Proxy(
          r,
          new Vo(r, e)
        );
      }
    });
  }
}
b(mr, "origXMLHttpRequest", XMLHttpRequest);
class rn extends at {
  constructor(e) {
    super(e, "http"), b(this, "url", ""), b(this, "method", ""), b(this, "startTime", 0), b(this, "endTime", 0), b(this, "requestContentLength", 0), b(this, "responseContentLength", 0), b(this, "statusCode", 0), b(this, "headers", {}), b(this, "trackOptions", {
      trackHeaders: !0
    });
  }
  setTrackOptions(e) {
    this.trackOptions = e;
  }
  getProperties() {
    return {
      url: this.url,
      method: this.method,
      header: this.trackOptions.trackHeaders ? this.headers : void 0,
      code: this.statusCode,
      duration: (this.endTime - this.startTime) * 1e6,
      reqcontentlength: this.requestContentLength,
      respcontentlength: this.responseContentLength,
      start: this.startTime * 1e6,
      end: this.endTime * 1e6
    };
  }
  start(e, s, r, i) {
    this.startTime = Date.now(), this.url = e, this.method = s, this.headers = i, this.requestContentLength = r;
  }
  end(e, s) {
    this.endTime = Date.now(), this.responseContentLength = e, this.statusCode = s;
  }
  setProperties(e) {
    this.url = e.url, this.method = e.method, this.startTime = e.startTime, this.endTime = e.endTime, this.requestContentLength = e.requestContentLength, this.responseContentLength = e.responseContentLength, this.statusCode = e.statusCode;
    let s = e.headers;
    s && (s = {
      ...s,
      token: ""
    }), this.headers = s;
  }
}
const Ko = (n, e) => {
  const s = (r, i) => {
    if (i.readyState === 4 && i.url !== r.options.url) {
      const a = new rn(r);
      a.setTrackOptions(e), a.setProperties({
        url: i.url,
        method: i.method,
        startTime: i.startTime,
        endTime: i.endTime,
        requestContentLength: i.postLength,
        responseContentLength: i.responseSize,
        statusCode: i.status,
        headers: i.header || {}
      }), r.addLogByEvent(a);
    }
  };
  window.XMLHttpRequest = mr.create((r) => {
    s(n, r);
  }), window.fetch = dr.create((r) => {
    s(n, r);
  });
}, Zo = (n) => {
  n || (n = {
    trackHeaders: !0
  }), rn.eventOptions = n, rn.startApaasTrackHook = (e) => {
    Ko(e, n);
  }, hn.registerEvent("http", rn);
}, kt = (n, e = !1) => {
  let s = location.href.replace(/#\/.+$/, n);
  return e && (s = s.replace(/\?\S+$/, "")), s;
}, fr = (n, e) => {
  let s = history.pushState, r = history.replaceState, i = kt(location.hash), a = null;
  history.pushState = function(...u) {
    const l = kt(location.hash), w = kt(u[2] || "");
    return i = w, n && (a = {
      newURL: w,
      oldURL: l,
      type: "push"
    }, On(() => {
      a && (e(a), a = null);
    })), s.apply(this, u);
  }, history.replaceState = function(...u) {
    if (n) {
      const l = kt(location.hash), w = kt(u[2] || "");
      a = {
        newURL: w,
        oldURL: l,
        type: "replace"
      }, i = w, On(() => {
        if (a && a.oldURL === l && a.newURL === w) {
          let p = kt(location.hash);
          l === w ? w !== p ? (a.newURL = p, a.type = "push") : a.type = "onload" : a.type = "replace", e(a), a = null;
        }
      });
    }
    return r.apply(this, u);
  }, window.addEventListener("popstate", (u) => {
    if (n) {
      const l = kt(location.hash);
      u.state && (a = {
        newURL: l,
        oldURL: i,
        type: u.state.forward ? "back" : "forward"
      }, i = l, e(a), a = null);
    }
  });
};
var Yo = function(n, e) {
  e === !0 && (e = 0);
  var s = "";
  if (typeof n == "string")
    try {
      s = new URL(n).protocol;
    } catch {
    }
  else
    n && n.constructor === URL && (s = n.protocol);
  var r = s.split(/\:|\+/).filter(Boolean);
  return typeof e == "number" ? r[e] : r;
}, tc = Yo;
function ec(n) {
  var e = {
    protocols: [],
    protocol: null,
    port: null,
    resource: "",
    host: "",
    user: "",
    password: "",
    pathname: "",
    hash: "",
    search: "",
    href: n,
    query: {},
    parse_failed: !1
  };
  try {
    var s = new URL(n);
    e.protocols = tc(s), e.protocol = e.protocols[0], e.port = s.port, e.resource = s.hostname, e.host = s.host, e.user = s.username || "", e.password = s.password || "", e.pathname = s.pathname, e.hash = s.hash.slice(1), e.search = s.search.slice(1), e.href = s.href, e.query = Object.fromEntries(s.searchParams);
  } catch {
    e.protocols = ["file"], e.protocol = e.protocols[0], e.port = "", e.resource = "", e.user = "", e.pathname = "", e.hash = "", e.search = "", e.href = n, e.query = {}, e.parse_failed = !0;
  }
  return e;
}
var nc = ec;
const sc = "text/plain", rc = "us-ascii", Os = (n, e) => e.some((s) => s instanceof RegExp ? s.test(n) : s === n), ic = (n, { stripHash: e }) => {
  const s = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(n);
  if (!s)
    throw new Error(`Invalid URL: ${n}`);
  let { type: r, data: i, hash: a } = s.groups;
  const u = r.split(";");
  a = e ? "" : a;
  let l = !1;
  u[u.length - 1] === "base64" && (u.pop(), l = !0);
  const w = (u.shift() || "").toLowerCase(), p = [
    ...u.map((f) => {
      let [v, h = ""] = f.split("=").map((_) => _.trim());
      return v === "charset" && (h = h.toLowerCase(), h === rc) ? "" : `${v}${h ? `=${h}` : ""}`;
    }).filter(Boolean)
  ];
  return l && p.push("base64"), (p.length > 0 || w && w !== sc) && p.unshift(w), `data:${p.join(";")},${l ? i.trim() : i}${a ? `#${a}` : ""}`;
};
function ac(n, e) {
  if (e = {
    defaultProtocol: "http:",
    normalizeProtocol: !0,
    forceHttp: !1,
    forceHttps: !1,
    stripAuthentication: !0,
    stripHash: !1,
    stripTextFragment: !0,
    stripWWW: !0,
    removeQueryParameters: [/^utm_\w+/i],
    removeTrailingSlash: !0,
    removeSingleSlash: !0,
    removeDirectoryIndex: !1,
    sortQueryParameters: !0,
    ...e
  }, n = n.trim(), /^data:/i.test(n))
    return ic(n, e);
  if (/^view-source:/i.test(n))
    throw new Error("`view-source:` is not supported as it is a non-standard protocol");
  const s = n.startsWith("//");
  !s && /^\.*\//.test(n) || (n = n.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, e.defaultProtocol));
  const r = new URL(n);
  if (e.forceHttp && e.forceHttps)
    throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
  if (e.forceHttp && r.protocol === "https:" && (r.protocol = "http:"), e.forceHttps && r.protocol === "http:" && (r.protocol = "https:"), e.stripAuthentication && (r.username = "", r.password = ""), e.stripHash ? r.hash = "" : e.stripTextFragment && (r.hash = r.hash.replace(/#?:~:text.*?$/i, "")), r.pathname) {
    const a = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;
    let u = 0, l = "";
    for (; ; ) {
      const w = a.exec(r.pathname);
      if (!w)
        break;
      const p = w[0], f = w.index;
      l += r.pathname.slice(u, f).replace(/\/{2,}/g, "/"), l += p, u = f + p.length;
    }
    l += r.pathname.slice(u, r.pathname.length).replace(/\/{2,}/g, "/"), r.pathname = l;
  }
  if (r.pathname)
    try {
      r.pathname = decodeURI(r.pathname);
    } catch {
    }
  if (e.removeDirectoryIndex === !0 && (e.removeDirectoryIndex = [/^index\.[a-z]+$/]), Array.isArray(e.removeDirectoryIndex) && e.removeDirectoryIndex.length > 0) {
    let a = r.pathname.split("/");
    const u = a[a.length - 1];
    Os(u, e.removeDirectoryIndex) && (a = a.slice(0, -1), r.pathname = a.slice(1).join("/") + "/");
  }
  if (r.hostname && (r.hostname = r.hostname.replace(/\.$/, ""), e.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(r.hostname) && (r.hostname = r.hostname.replace(/^www\./, ""))), Array.isArray(e.removeQueryParameters))
    for (const a of [...r.searchParams.keys()])
      Os(a, e.removeQueryParameters) && r.searchParams.delete(a);
  if (e.removeQueryParameters === !0 && (r.search = ""), e.sortQueryParameters) {
    r.searchParams.sort();
    try {
      r.search = decodeURIComponent(r.search);
    } catch {
    }
  }
  e.removeTrailingSlash && (r.pathname = r.pathname.replace(/\/$/, ""));
  const i = n;
  return n = r.toString(), !e.removeSingleSlash && r.pathname === "/" && !i.endsWith("/") && r.hash === "" && (n = n.replace(/\/$/, "")), (e.removeTrailingSlash || r.pathname === "/") && r.hash === "" && e.removeSingleSlash && (n = n.replace(/\/$/, "")), s && !e.normalizeProtocol && (n = n.replace(/^http:\/\//, "//")), e.stripProtocol && (n = n.replace(/^(?:https?:)?\/\//, "")), n;
}
const $e = (n, e = !1) => {
  const s = /^(?:([a-z_][a-z0-9_-]{0,31})@|https?:\/\/)([\w\.\-@]+)[\/:]([\~,\.\w,\-,\_,\/]+?(?:\.git|\/)?)$/, r = (a) => {
    const u = new Error(a);
    throw u.subject_url = n, u;
  };
  (typeof n != "string" || !n.trim()) && r("Invalid url."), n.length > $e.MAX_INPUT_LENGTH && r("Input exceeds maximum length. If needed, change the value of parseUrl.MAX_INPUT_LENGTH."), e && (typeof e != "object" && (e = {
    stripHash: !1
  }), n = ac(n, e));
  const i = nc(n);
  if (i.parse_failed) {
    const a = i.href.match(s);
    a ? (i.protocols = ["ssh"], i.protocol = "ssh", i.resource = a[2], i.host = a[2], i.user = a[1], i.pathname = `/${a[3]}`, i.parse_failed = !1) : r("URL parsing failed.");
  }
  return i;
};
$e.MAX_INPUT_LENGTH = 2048;
$e.MAX_INPUT_LENGTH = 2048 * 1024;
class _e extends at {
  constructor(e) {
    super(e, "online"), b(this, "url", ""), b(this, "duration", 0), b(this, "startTime", 0), b(this, "endTime", 0), b(this, "views", []);
  }
  getProperties() {
    return {
      url: this.url,
      duration: this.duration,
      startTime: this.startTime,
      endTime: this.endTime
    };
  }
  setProperties(e) {
    this.duration = e.duration, this.url = e.url, this.startTime = e.startTime, this.endTime = e.endTime, e.views && (this.views = e.views);
  }
}
let He = null;
const zs = (n, e) => {
  const s = () => !0;
  let r = typeof e == "object" && e.collectUrl ? e.collectUrl : s;
  return (i) => {
    let a = $e(i.newURL), u = $e(i.oldURL), l = kt(`#${a.hash}`, !0);
    i.oldURL && kt(`#${u.hash}`, !0), He && (He.stop(), He.destroy(), He = null), r(location) && (He = new oc(n, l));
  };
};
class oc {
  constructor(e, s, r) {
    b(this, "url", ""), b(this, "duration", 0), b(this, "startTime", 0), b(this, "onlineOptions"), b(this, "apaasTrack"), b(this, "visibleChangeHandler"), b(this, "beforeUnLoadHandler"), b(this, "userActionHandler"), b(this, "onlineTimer", null), b(this, "stopTimeout", null), this.url = s, this.apaasTrack = e, this.onlineOptions = r || {
      collectUrl: void 0
    }, this.visibleChangeHandler = (i) => {
      const a = i.target.visibilityState;
      this.stopUserActionMonitor(), a === "visible" ? this.start() : this.startUserActionMonitor();
    }, this.beforeUnLoadHandler = (i) => {
      if (this.apaasTrack) {
        const a = Date.now() - this.startTime;
        this.saveOnlineData(a);
        const u = this.apaasTrack.getStorageData();
        if (u.onlineData)
          for (let l in u.onlineData) {
            const w = u.onlineData[l], p = new _e(this.apaasTrack);
            p.setProperties({
              duration: w.duration,
              url: l,
              startTime: w.startTime,
              endTime: w.lastTime,
              views: w.views
            });
            const f = p.getEventLog();
            e.addToLegancyLog(f);
          }
        this.cleanOnlineData();
      }
    }, this.userActionHandler = wo(
      (i) => {
        console.log("\u6709\u7528\u6237\u884C\u4E3A"), this.stopUserActionMonitor(), this.start(), this.startUserActionMonitor();
      },
      60 * 1e3,
      {
        leading: !0,
        trailing: !1
      }
    ), hr(this.beforeUnLoadHandler), Uo(this.userActionHandler), this.init();
  }
  startUserActionMonitor() {
    console.log("startUserActionMonitor"), !this.stopTimeout && (this.stopTimeout = window.setTimeout(() => {
      this.onlineTimer && (console.log("\u65E0\u6548\u64CD\u4F5C\u65F6\u957F\uFF0C\u7528\u6237\u5DF2\u4E0B\u7EBF..."), clearInterval(this.onlineTimer), this.onlineTimer = null, this.saveOnlineData(this.duration), this.sendRecord(!1, this.url));
    }, 1e3 * 60));
  }
  stopUserActionMonitor() {
    console.log("stopUserActionMonitor"), this.stopTimeout && (clearTimeout(this.stopTimeout), this.stopTimeout = null);
  }
  init() {
    let e = this.apaasTrack.getStorageData();
    e || (this.apaasTrack.initStorageData(), e = this.apaasTrack.getStorageData()), e.onlineData ? this.cleanOnlineData() : e.onlineData = {}, localStorage.setItem("apaas-track", JSON.stringify(e)), document.addEventListener(
      "visibilitychange",
      this.visibleChangeHandler
    ), this.start();
    const s = window.document.createEvent("MouseEvent");
    this.userActionHandler(s);
  }
  saveOnlineData(e, s) {
    const r = this.apaasTrack.getStorageData();
    let i = r.onlineData, a = i[this.url] || (i[this.url] = {
      duration: 0,
      lastTime: Date.now()
    });
    a.duration = e, a.lastTime = Date.now(), a.startTime = this.startTime, s && (a.views || (a.views = []), a.views.push({
      name: s.name,
      duration: s.duration
    })), r.onlineData[this.url] = a, localStorage.setItem("apaas-track", JSON.stringify(r));
  }
  getStorageOnlineData() {
    return this.apaasTrack.getStorageData().onlineData;
  }
  cleanOnlineData(e) {
    const s = this.apaasTrack.getStorageData();
    !s.onlineData || (e ? delete s.onlineData[e] : s.onlineData = {}, localStorage.setItem("apaas-track", JSON.stringify(s)));
  }
  start() {
    if (this.onlineTimer)
      return;
    this.startTime = Date.now(), this.duration = 0;
    let e = 10 * 1e3;
    this.onlineTimer = window.setInterval(() => {
      console.log("onlineTimer---"), this.duration += e, this.saveOnlineData(this.duration);
    }, e);
  }
  stop() {
    if (this.onlineTimer) {
      clearInterval(this.onlineTimer), this.onlineTimer = null;
      const e = Date.now() - this.startTime;
      this.duration = e, this.saveOnlineData(e), this.sendRecord(!1, this.url);
    }
  }
  destroy() {
    this.stopUserActionMonitor(), document.removeEventListener(
      "visibilitychange",
      this.visibleChangeHandler
    ), this.beforeUnLoadHandler && jo(this.beforeUnLoadHandler), this.userActionHandler && qo(this.userActionHandler);
  }
  sendRecord(e = !1, s) {
    const r = this.getStorageOnlineData();
    if (r)
      if (s) {
        const i = r[s];
        if (i != null && i.duration) {
          const a = new _e(this.apaasTrack);
          a.setProperties({
            duration: i.duration,
            url: s,
            startTime: i.startTime,
            endTime: i.lastTime,
            views: i.views
          }), this.apaasTrack.addLogByEvent(a), e && this.apaasTrack.sendByBeacon();
        }
        this.cleanOnlineData(s);
      } else {
        for (let i in r) {
          const a = r[i];
          if (a.duration) {
            const u = new _e(this.apaasTrack);
            u.setProperties({
              duration: a.duration,
              url: i,
              startTime: a.startTime,
              endTime: a.lastTime,
              views: a.views
            }), this.apaasTrack.addLogByEvent(u), e && this.apaasTrack.sendByBeacon();
          }
        }
        this.cleanOnlineData();
      }
    this.duration = 0, this.startTime = 0;
  }
}
const cc = (n) => {
  console.log("registerOnlineEvent"), n || (n = {}), _e.eventOptions = n, _e.startApaasTrackHook = (e) => {
    console.log("registerOnlineEvent startApaasTrackHook");
    let s = null;
    fr(e, (a) => {
      console.log("online listenHistoryChange"), s || (s = zs(e)), s(a);
    });
    const r = () => {
      i && clearTimeout(i), s || (s = zs(e));
      const a = {
        newURL: kt(location.hash),
        oldURL: kt(location.hash),
        type: "onload"
      };
      s(a), window.removeEventListener("load", r);
    };
    let i = null;
    window.self !== window.top && (window.addEventListener("load", r), i = setTimeout(() => {
      r(), clearTimeout(i);
    }, 3e3));
  }, Bt.registerEvent("online", _e);
};
class Nn extends at {
  constructor(e) {
    super(e, "pageview", Vs.HIGH), b(this, "oldURL", ""), b(this, "newURL", ""), b(this, "entertype", "");
  }
  getProperties() {
    return {
      from: this.oldURL,
      to: this.newURL,
      entertype: this.entertype
    };
  }
  setProperties(e) {
    this.oldURL = e.oldURL, this.newURL = e.newURL, this.entertype = e.type;
  }
}
const uc = (n, e) => {
  const s = new Nn(n);
  s.setProperties(e);
  const r = s.getEventLog();
  n.addLogToQueue(r, !0);
}, hc = () => {
  Nn.startApaasTrackHook = (n) => {
    fr(n, (e) => {
      uc(n, e);
    });
  }, Bt.registerEvent("pageview", Nn);
};
var qt, Ne, gr, cn, jn, _r = -1, se = function(n) {
  addEventListener("pageshow", function(e) {
    e.persisted && (_r = e.timeStamp, n(e));
  }, !0);
}, Qn = function() {
  return window.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
}, _n = function() {
  var n = Qn();
  return n && n.activationStart || 0;
}, mt = function(n, e) {
  var s = Qn(), r = "navigate";
  return _r >= 0 ? r = "back-forward-cache" : s && (r = document.prerendering || _n() > 0 ? "prerender" : document.wasDiscarded ? "restore" : s.type.replace(/_/g, "-")), { name: n, value: e === void 0 ? -1 : e, rating: "good", delta: 0, entries: [], id: "v3-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1e12), navigationType: r };
}, ke = function(n, e, s) {
  try {
    if (PerformanceObserver.supportedEntryTypes.includes(n)) {
      var r = new PerformanceObserver(function(i) {
        Promise.resolve().then(function() {
          e(i.getEntries());
        });
      });
      return r.observe(Object.assign({ type: n, buffered: !0 }, s || {})), r;
    }
  } catch {
  }
}, vn = function(n, e) {
  var s = function r(i) {
    i.type !== "pagehide" && document.visibilityState !== "hidden" || (n(i), e && (removeEventListener("visibilitychange", r, !0), removeEventListener("pagehide", r, !0)));
  };
  addEventListener("visibilitychange", s, !0), addEventListener("pagehide", s, !0);
}, ft = function(n, e, s, r) {
  var i, a;
  return function(u) {
    e.value >= 0 && (u || r) && ((a = e.value - (i || 0)) || i === void 0) && (i = e.value, e.delta = a, e.rating = function(l, w) {
      return l > w[1] ? "poor" : l > w[0] ? "needs-improvement" : "good";
    }(e.value, s), n(e));
  };
}, Vn = function(n) {
  requestAnimationFrame(function() {
    return requestAnimationFrame(function() {
      return n();
    });
  });
}, Te = function(n) {
  document.prerendering ? addEventListener("prerenderingchange", function() {
    return n();
  }, !0) : n();
}, me = -1, Hs = function() {
  return document.visibilityState !== "hidden" || document.prerendering ? 1 / 0 : 0;
}, un = function(n) {
  document.visibilityState === "hidden" && me > -1 && (me = n.type === "visibilitychange" ? n.timeStamp : 0, lc());
}, Fs = function() {
  addEventListener("visibilitychange", un, !0), addEventListener("prerenderingchange", un, !0);
}, lc = function() {
  removeEventListener("visibilitychange", un, !0), removeEventListener("prerenderingchange", un, !0);
}, Kn = function() {
  return me < 0 && (me = Hs(), Fs(), se(function() {
    setTimeout(function() {
      me = Hs(), Fs();
    }, 0);
  })), { get firstHiddenTime() {
    return me;
  } };
}, vr = function(n, e) {
  e = e || {}, Te(function() {
    var s, r = [1800, 3e3], i = Kn(), a = mt("FCP"), u = ke("paint", function(l) {
      l.forEach(function(w) {
        w.name === "first-contentful-paint" && (u.disconnect(), w.startTime < i.firstHiddenTime && (a.value = Math.max(w.startTime - _n(), 0), a.entries.push(w), s(!0)));
      });
    });
    u && (s = ft(n, a, r, e.reportAllChanges), se(function(l) {
      a = mt("FCP"), s = ft(n, a, r, e.reportAllChanges), Vn(function() {
        a.value = performance.now() - l.timeStamp, s(!0);
      });
    }));
  });
}, pc = function(n, e) {
  e = e || {}, Te(function() {
    var s, r = [0.1, 0.25], i = mt("CLS"), a = -1, u = 0, l = [], w = function(v) {
      a > -1 && n(v);
    }, p = function(v) {
      v.forEach(function(h) {
        if (!h.hadRecentInput) {
          var _ = l[0], y = l[l.length - 1];
          u && h.startTime - y.startTime < 1e3 && h.startTime - _.startTime < 5e3 ? (u += h.value, l.push(h)) : (u = h.value, l = [h]), u > i.value && (i.value = u, i.entries = l, s());
        }
      });
    }, f = ke("layout-shift", p);
    f && (s = ft(w, i, r, e.reportAllChanges), vr(function(v) {
      a = v.value, i.value < 0 && (i.value = 0, s());
    }), vn(function() {
      p(f.takeRecords()), s(!0);
    }), se(function() {
      u = 0, a = -1, i = mt("CLS", 0), s = ft(w, i, r, e.reportAllChanges), Vn(function() {
        return s();
      });
    }));
  });
}, Fe = { passive: !0, capture: !0 }, dc = new Date(), Is = function(n, e) {
  qt || (qt = e, Ne = n, gr = new Date(), wr(removeEventListener), br());
}, br = function() {
  if (Ne >= 0 && Ne < gr - dc) {
    var n = { entryType: "first-input", name: qt.type, target: qt.target, cancelable: qt.cancelable, startTime: qt.timeStamp, processingStart: qt.timeStamp + Ne };
    cn.forEach(function(e) {
      e(n);
    }), cn = [];
  }
}, mc = function(n) {
  if (n.cancelable) {
    var e = (n.timeStamp > 1e12 ? new Date() : performance.now()) - n.timeStamp;
    n.type == "pointerdown" ? function(s, r) {
      var i = function() {
        Is(s, r), u();
      }, a = function() {
        u();
      }, u = function() {
        removeEventListener("pointerup", i, Fe), removeEventListener("pointercancel", a, Fe);
      };
      addEventListener("pointerup", i, Fe), addEventListener("pointercancel", a, Fe);
    }(e, n) : Is(e, n);
  }
}, wr = function(n) {
  ["mousedown", "keydown", "touchstart", "pointerdown"].forEach(function(e) {
    return n(e, mc, Fe);
  });
}, fc = function(n, e) {
  e = e || {}, Te(function() {
    var s, r = [100, 300], i = Kn(), a = mt("FID"), u = function(p) {
      p.startTime < i.firstHiddenTime && (a.value = p.processingStart - p.startTime, a.entries.push(p), s(!0));
    }, l = function(p) {
      p.forEach(u);
    }, w = ke("first-input", l);
    s = ft(n, a, r, e.reportAllChanges), w && vn(function() {
      l(w.takeRecords()), w.disconnect();
    }, !0), w && se(function() {
      var p;
      a = mt("FID"), s = ft(n, a, r, e.reportAllChanges), cn = [], Ne = -1, qt = null, wr(addEventListener), p = u, cn.push(p), br();
    });
  });
}, yr = 0, Cn = 1 / 0, nn = 0, gc = function(n) {
  n.forEach(function(e) {
    e.interactionId && (Cn = Math.min(Cn, e.interactionId), nn = Math.max(nn, e.interactionId), yr = nn ? (nn - Cn) / 7 + 1 : 0);
  });
}, kr = function() {
  return jn ? yr : performance.interactionCount || 0;
}, _c = function() {
  "interactionCount" in performance || jn || (jn = ke("event", gc, { type: "event", buffered: !0, durationThreshold: 0 }));
}, Tr = 0, Ns = function() {
  return kr() - Tr;
}, xt = [], Mn = {}, js = function(n) {
  var e = xt[xt.length - 1], s = Mn[n.interactionId];
  if (s || xt.length < 10 || n.duration > e.latency) {
    if (s)
      s.entries.push(n), s.latency = Math.max(s.latency, n.duration);
    else {
      var r = { id: n.interactionId, latency: n.duration, entries: [n] };
      Mn[r.id] = r, xt.push(r);
    }
    xt.sort(function(i, a) {
      return a.latency - i.latency;
    }), xt.splice(10).forEach(function(i) {
      delete Mn[i.id];
    });
  }
}, vc = function(n, e) {
  e = e || {}, Te(function() {
    var s = [200, 500];
    _c();
    var r, i = mt("INP"), a = function(l) {
      l.forEach(function(f) {
        f.interactionId && js(f), f.entryType === "first-input" && !xt.some(function(v) {
          return v.entries.some(function(h) {
            return f.duration === h.duration && f.startTime === h.startTime;
          });
        }) && js(f);
      });
      var w, p = (w = Math.min(xt.length - 1, Math.floor(Ns() / 50)), xt[w]);
      p && p.latency !== i.value && (i.value = p.latency, i.entries = p.entries, r());
    }, u = ke("event", a, { durationThreshold: e.durationThreshold || 40 });
    r = ft(n, i, s, e.reportAllChanges), u && (u.observe({ type: "first-input", buffered: !0 }), vn(function() {
      a(u.takeRecords()), i.value < 0 && Ns() > 0 && (i.value = 0, i.entries = []), r(!0);
    }), se(function() {
      xt = [], Tr = kr(), i = mt("INP"), r = ft(n, i, s, e.reportAllChanges);
    }));
  });
}, Rn = {}, bc = function(n, e) {
  e = e || {}, Te(function() {
    var s, r = [2500, 4e3], i = Kn(), a = mt("LCP"), u = function(p) {
      var f = p[p.length - 1];
      if (f) {
        var v = Math.max(f.startTime - _n(), 0);
        v < i.firstHiddenTime && (a.value = v, a.entries = [f], s());
      }
    }, l = ke("largest-contentful-paint", u);
    if (l) {
      s = ft(n, a, r, e.reportAllChanges);
      var w = function() {
        Rn[a.id] || (u(l.takeRecords()), l.disconnect(), Rn[a.id] = !0, s(!0));
      };
      ["keydown", "click"].forEach(function(p) {
        addEventListener(p, w, { once: !0, capture: !0 });
      }), vn(w, !0), se(function(p) {
        a = mt("LCP"), s = ft(n, a, r, e.reportAllChanges), Vn(function() {
          a.value = performance.now() - p.timeStamp, Rn[a.id] = !0, s(!0);
        });
      });
    }
  });
}, wc = function n(e) {
  document.prerendering ? Te(function() {
    return n(e);
  }) : document.readyState !== "complete" ? addEventListener("load", function() {
    return n(e);
  }, !0) : setTimeout(e, 0);
}, yc = function(n, e) {
  e = e || {};
  var s = [800, 1800], r = mt("TTFB"), i = ft(n, r, s, e.reportAllChanges);
  wc(function() {
    var a = Qn();
    if (a) {
      var u = a.responseStart;
      if (u <= 0 || u > performance.now())
        return;
      r.value = Math.max(u - _n(), 0), r.entries = [a], i(!0), se(function() {
        r = mt("TTFB", 0), (i = ft(n, r, s, e.reportAllChanges))(!0);
      });
    }
  });
};
class Un extends at {
  constructor(e) {
    super(e, "performance"), b(this, "performanceData", null);
  }
  getProperties() {
    return {
      ...this.performanceData
    };
  }
  setProperties(e) {
    this.performanceData = e;
  }
  track() {
    return new Promise((e, s) => {
      let r = {
        cls: null,
        lcp: null,
        ttfb: null,
        fcp: null,
        fid: null,
        inp: null
      };
      setTimeout(() => {
        const a = performance.timing, u = {
          ...r,
          connectEnd: a.connectEnd,
          connectStart: a.connectStart,
          domComplete: a.domComplete,
          domContentLoadedEventEnd: a.domContentLoadedEventEnd,
          domContentLoadedEventStart: a.domContentLoadedEventStart,
          domInteractive: a.domInteractive,
          domLoading: a.domLoading,
          domainLookupEnd: a.domainLookupEnd,
          domainLookupStart: a.domainLookupStart,
          fetchStart: a.fetchStart,
          loadEventEnd: a.loadEventEnd,
          loadEventStart: a.loadEventStart,
          navigationStart: a.navigationStart,
          redirectEnd: a.redirectEnd,
          redirectStart: a.redirectStart,
          requestStart: a.requestStart,
          responseEnd: a.responseEnd,
          responseStart: a.responseStart,
          secureConnectionStart: a.secureConnectionStart,
          unloadEventEnd: a.unloadEventEnd,
          unloadEventStart: a.unloadEventStart
        };
        this.setProperties(u), e(u);
      }, 1e4), bc((a) => {
        i(a);
      }), pc((a) => {
        i(a);
      }), yc((a) => {
        i(a);
      }), vr((a) => {
        i(a);
      }), fc((a) => {
        i(a);
      }), vc((a) => {
        i(a);
      });
      const i = (a) => {
        a.name === "FID" ? r.fid = a.value : a.name === "CLS" ? r.cls = a.value : a.name === "FCP" ? r.fcp = a.value : a.name === "TTFB" ? r.ttfb = a.value : a.name === "LCP" ? r.lcp = a.value : a.name === "INP" && (r.inp = a.value);
      };
    });
  }
}
const kc = async (n) => {
  const e = new Un(n);
  await e.track(), n.addLogByEvent(e);
}, Tc = () => {
  Un.startApaasTrackHook = (n) => {
    kc(n);
  }, Bt.registerEvent("performance", Un);
};
class Us extends at {
  constructor(e) {
    super(e, "throw"), b(this, "message", ""), b(this, "detailmessage", ""), b(this, "name", ""), b(this, "stack", []), b(this, "cause", {});
  }
  getProperties() {
    return {
      message: this.message,
      detailmessage: this.detailmessage,
      name: this.name,
      stack: this.stack,
      cause: this.cause
    };
  }
  setError(e) {
    const s = $n(e);
    this.message = s.message, this.detailmessage = s.detail, this.name = s.name, this.stack = s.stack;
  }
}
const Sc = (n) => {
  window.addEventListener("error", (e) => {
    const s = Ot(n, "throw");
    s.setError(e.error), n.addLogByEvent(s);
  }), window.addEventListener("unhandledrejection", (e) => {
    const s = Ot(n, "throw");
    s.setError(e.reason), n.addLogByEvent(s);
  });
}, Pc = () => {
  Us.startApaasTrackHook = (n) => {
    Sc(n);
  }, Bt.registerEvent("throw", Us);
}, Lc = () => {
  Tc(), Pc(), Go();
}, Ec = (n) => {
  Lc(), hc(), Jo(), (n == null ? void 0 : n.http) !== !1 && Zo(), n != null && n.click && No(
    typeof n.click == "object" ? n.click : void 0
  ), n != null && n.online && cc(
    typeof n.online == "object" ? n.online : void 0
  );
}, xc = (n) => (Ec(n), Bc(n)), Bc = (n) => new Bt(n);
class te {
  constructor(e, s, r) {
    b(this, "_level", 0), this.apaasTrack = e, this.type = s, r && (this._level = r);
  }
  getProperties() {
    return {};
  }
  setProperties(e) {
  }
  getEventLog(e) {
    const s = e || Date.now();
    return {
      ...this.apaasTrack.baseLog,
      types: this.type,
      logtime: String(s),
      epochnanos: String(s) + "000000",
      event: this.type,
      properties: this.getProperties(),
      url: we()
    };
  }
}
b(te, "eventOptions"), b(te, "initApaasTrackHook"), b(te, "startApaasTrackHook"), b(te, "destroyApaasTrackHook");
class Cc extends te {
  constructor(e) {
    super(e, "init");
  }
  getProperties() {
    const e = this.apaasTrack.baseLog;
    return {
      system: e.system || "",
      systemver: e.systemver || "",
      manufacturer: e.manufacturer || "",
      browser: e.browser || "",
      browserver: e.browserver || "",
      terminalid: e.terminalid || "",
      client: e.client || "",
      clientver: e.clientver || ""
    };
  }
}
class Mc extends te {
  constructor(e) {
    super(e, "custom"), b(this, "info", {});
  }
  setCustomType(e) {
    this.type = e;
  }
  getProperties() {
    return {
      ...this.info
    };
  }
  setProperties(e) {
    this.info = e;
  }
}
const ve = {
  init: Cc,
  custom: Mc
}, an = (n, e) => {
  const s = ve[e];
  return new s(n);
}, Rc = (n, e, s) => {
  const r = s || Date.now(), i = an(n, e);
  return {
    ...n.baseLog,
    types: e,
    logtime: String(r),
    epochnanos: String(r) + "000000",
    event: e,
    properties: i.getProperties(),
    url: we()
  };
}, qs = (n, e, s) => {
  const r = s || Date.now();
  return {
    ...n.baseLog,
    types: e.type,
    logtime: String(r),
    epochnanos: String(r) + "000000",
    event: e.type,
    properties: e.getProperties(),
    url: we()
  };
}, Sr = (n, e) => {
  if (ve[n])
    throw Error(`\u8BE5\u4E8B\u4EF6${n} \u5DF2\u5B58\u5728\uFF0C\u6CE8\u518C\u5931\u8D25`);
  ve[n] = e;
};
class Dc {
  constructor(e, s) {
    b(this, "name", ""), b(this, "time", 0), b(this, "info", {}), e && (this.name = e), s && (this.info = s), this.time = Date.now();
  }
  get epochnanos() {
    return this.time * 1e6;
  }
  get attributes() {
    return this.getAttributes();
  }
  getAttributes() {
    return {};
  }
  getJson() {
    return {
      name: this.name,
      epochnanos: this.time * 1e6,
      attributes: this.getAttributes(),
      ...this.info
    };
  }
  setInfo(e) {
    this.info = e || {};
  }
}
class Ac extends Dc {
  constructor() {
    super(...arguments), b(this, "name", "exception"), b(this, "exceptionType", ""), b(this, "exceptionMessage", ""), b(this, "exceptionStackTrace", "");
  }
  getAttributes() {
    return {
      "exception.type": this.exceptionType,
      "exception.message": this.exceptionMessage,
      "exception.stacktrace": this.exceptionStackTrace
    };
  }
  setInfo(e) {
    this.exceptionMessage = e.exceptionMessage, this.exceptionType = e.exceptionType, this.exceptionStackTrace = e.exceptionStackTrace;
  }
}
class Zn extends te {
  constructor(e, s, r) {
    super(e, "span"), b(this, "spanid", ""), b(this, "traceid", ""), b(this, "parentspanid", ""), b(this, "name", ""), b(this, "attributes", {}), b(this, "events", []), b(this, "statuscode", "OK"), b(this, "statusmessage", ""), b(this, "startTime", 0), b(this, "endTime", 0), this.name = s, this.traceid = be(), this.spanid = $s(), this.parentspanid = r || "", this.start();
  }
  trackLog() {
    this.apaasTrack.addLogByEvent(this);
  }
  createSpanEvent(e, s) {
    return new Zn(
      this.apaasTrack,
      e,
      s
    );
  }
  setAttribute(e) {
    const s = e.getAttributes();
    this.attributes = s;
  }
  addEvent(e) {
    this.events.push(e);
  }
  exception(e) {
    const s = new Ac();
    let r = "", i = "", a = "";
    if (e instanceof Error) {
      const u = $n(e);
      r = u.detail, i = u.name, a = u.stack.join(",");
    } else
      r = e.exceptionMessage, i = e.exceptionType, a = e.exceptionStackTrace;
    s.setInfo({
      exceptionMessage: r,
      exceptionType: i,
      exceptionStackTrace: a
    }), this.events.push(s);
  }
  start() {
    this.startTime = Date.now();
  }
  end(e, s) {
    e && (this.statusmessage = e), s && (this.statuscode = s), this.endTime = Date.now();
  }
  getProperties() {
    return {
      traceid: this.traceid,
      spanid: this.spanid,
      parentspanid: this.parentspanid,
      name: this.name,
      attributes: this.attributes,
      events: this.events.map((e) => e.getJson()),
      statuscode: this.statuscode,
      statusmessage: this.statusmessage,
      startepochnanos: this.startTime * 1e6,
      endepochnanos: this.endTime * 1e6,
      duration: (this.endTime - this.startTime) * 1e6
    };
  }
}
class Pr {
  constructor(e) {
    b(this, "_version", sn), b(this, "commonLog", null), b(this, "browserLog", null), b(this, "options"), this.options = e, typeof window < "u" && (window.__apaasTrackVersion__ = sn), typeof wx < "u" && !window && (wx.__apaasTrackVersion__ = sn), e.commonLog && this.initCommonLog(e.commonLog), this.runEventInitHooks();
  }
  registerEvent(e, s) {
    Sr(e, s), s.initApaasTrackHook && s.initApaasTrackHook(this), s.startApaasTrackHook && s.startApaasTrackHook(this);
  }
  get groupid() {
    var e;
    return (e = this.browserLog) == null ? void 0 : e.distinctid;
  }
  runEventInitHooks() {
    Object.values(ve).forEach(
      (e) => {
        e.initApaasTrackHook && e.initApaasTrackHook(this);
      }
    );
  }
  runEventStartHooks() {
    Object.values(ve).forEach(
      (e) => {
        e.startApaasTrackHook && e.startApaasTrackHook(this);
      }
    );
  }
  runEventDestroyHooks() {
    Object.values(ve).forEach(
      (e) => {
        e.destroyApaasTrackHook && e.destroyApaasTrackHook(this);
      }
    );
  }
  get anonymousid() {
    var e;
    return (e = this.browserLog) == null ? void 0 : e.anonymousid;
  }
  get distinctid() {
    var e;
    return (e = this.browserLog) == null ? void 0 : e.distinctid;
  }
  get baseLog() {
    return {
      ...this.browserLog,
      ...this.commonLog
    };
  }
  initCommonLog(e) {
    this.commonLog = e;
  }
  createEventLog(e, s) {
    return Rc(this, e, s);
  }
  addLogByType(e, s) {
    const r = this.createEventLog(e, s);
    this.addLogToQueue(r);
  }
  addLogByEvent(e, s) {
    const r = qs(this, e, s);
    this.addLogToQueue(r);
  }
  createCustomEvent(e) {
    const s = an(this, "custom");
    return s.setCustomType(e), s;
  }
  createSpanEvent(e, s) {
    return new Zn(this, e, s);
  }
  addLogByCustomEvent(e, s = {}, r) {
    const i = this.createCustomEvent(e);
    i.setProperties(s);
    const a = qs(this, i, r);
    this.addLogToQueue(a);
  }
  executeInitEvent() {
    const e = an(this, "init");
    e.setProperties({
      groupid: this.groupid
    }), this.addLogByEvent(e);
  }
  updateCommonLog(e) {
    this.commonLog = {
      ...this.commonLog,
      ...e
    };
  }
  trackEvent(e, s = {}, r) {
    const i = an(this, e);
    i.setProperties(s), this.addLogByEvent(i, r);
  }
  start(...e) {
    this.executeInitEvent(), this.runEventStartHooks();
  }
  destroy() {
    this.runEventDestroyHooks();
  }
  transformLog(e) {
    return e;
  }
  async addLogToQueue(e, s = !1, r = !0) {
    r && (e = this.transformLog(e)), await this.sendLog(e, s);
  }
}
b(Pr, "registerEvent", Sr);
const Oc = async (n) => {
  var i;
  let e = await n.getWebInitParams();
  const s = location.origin + "/static/apaas-track/apaas-spu/lzma_worker.js";
  console.log("createApaasTrack lzma_worker", s), Pi(s);
  const r = xc({
    url: n.url || "",
    click: {
      trackElementPath: !0
    },
    commonLog: {
      client: "Web",
      ...e
    },
    online: (n == null ? void 0 : n.online) || !1,
    pageview: !0,
    http: !0,
    zip: n.zip !== void 0 ? n.zip : !0,
    useIndexDB: (i = n == null ? void 0 : n.useIndexDB) != null ? i : !1
  });
  return r.sendLog = n.sendLog, r.start = function(...a) {
    return Pr.prototype.start.call(this, ...a);
  }, n.sendLog === Lr && (r.start = function(...a) {
    return Bt.prototype.start.call(this, ...a);
  }), n.startFn && (r.start = n.startFn), r;
};
let Dn = null;
const Fc = async (n) => {
  var s, r;
  if (Dn)
    return Dn;
  const e = await Oc({
    url: (n == null ? void 0 : n.url) || "",
    sendLog: (n == null ? void 0 : n.sendLog) || Lr,
    startFn: (n == null ? void 0 : n.startFn) || null,
    online: (n == null ? void 0 : n.online) || !1,
    getWebInitParams: (n == null ? void 0 : n.getWebInitParams) || zc,
    zip: (s = n == null ? void 0 : n.zip) != null ? s : !0,
    useIndexDB: (r = n == null ? void 0 : n.useIndexDB) != null ? r : !1
  });
  return Dn = e, e;
}, zc = () => new Promise((n, e) => {
  if (window.aPaaS && window.aPaaS.getWebInitParams) {
    const s = window.aPaaS.getWebInitParams(
      (r) => {
        n(r);
      }
    );
    s && s.then && s.then((r) => {
      n(r);
    });
  } else {
    window.parent.postMessage(
      {
        type: "getWebInitParams"
      },
      "*"
    );
    const s = (i) => {
      const a = (i == null ? void 0 : i.data) || {};
      if (a.type === "receiveWebInitParams")
        if (a.data) {
          const u = a.data;
          n(u), r && (clearTimeout(r), r = null), window.removeEventListener(
            "message",
            s
          );
        } else
          e(Error("receiveWebInitParams response null"));
    };
    window.addEventListener("message", s);
    let r = window.setTimeout(() => {
      e(Error("postMessage getWebInitParams timeout"));
    }, 2e3);
  }
});
function Ic(...n) {
  return Bt.prototype.start.call(this, n);
}
function Lr(n, e) {
  var s;
  return (s = window.aPaaS) != null && s.sendLog ? window.aPaaS.sendLog(n, e) : Bt.prototype.sendLog.call(this, n, e);
}
export {
  at as BaseEvent,
  Hc as BaseSpanAttribute,
  hn as BaseTrack,
  li as CustomEvent,
  Vs as EventLevel,
  fe as EventMap,
  mi as ExceptionSpanEvent,
  hi as InitEvent,
  Jn as SpanEvent,
  di as SpanPropertyEvent,
  ui as TaskQueue,
  Oc as createApaasTrack,
  Ot as createEvent,
  zc as defaultGetWebInitParams,
  Lr as defaultWebSendFunction,
  Ic as defaultWebStartFunction,
  Fc as getApaasSpuTrack,
  bs as getEventLog,
  pi as getEventLogByType,
  Ks as registerEvent
};
