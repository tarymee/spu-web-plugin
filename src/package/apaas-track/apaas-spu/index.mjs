function Ut() {
  return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}
function we() {
  return Ut() + Ut() + "-" + Ut() + "-" + Ut() + "-" + Ut() + "-" + Ut() + Ut() + Ut();
}
function qs() {
  return we().replace(/-/g, "").slice(0, 16);
}
function $s(r) {
  let e = r > 0 ? new Date(r) : new Date(), s = e.getDate() < 10 ? "0" + e.getDate() : e.getDate(), n = e.getMonth() < 9 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1, i = e.getFullYear(), a = e.getHours() < 10 ? "0" + e.getHours() : e.getHours(), u = e.getMinutes() < 10 ? "0" + e.getMinutes() : e.getMinutes(), h = e.getSeconds() < 10 ? "0" + e.getSeconds() : e.getSeconds(), _ = e.getMilliseconds() < 10 ? "0" + e.getMilliseconds() : e.getMilliseconds();
  return _ < 100 && (_ = "0" + _), {
    time: +e,
    year: i,
    month: n,
    day: s,
    hour: a,
    minute: u,
    second: h,
    millisecond: _
  };
}
function Js(r) {
  return Object.prototype.toString.call(r) === "[object Number]";
}
function Xs(r) {
  return typeof r == "bigint";
}
function Je(r) {
  return typeof r == "string";
}
function Et(r) {
  return Object.prototype.toString.call(r) === "[object Array]";
}
function Xn(r) {
  return typeof r == "boolean";
}
function Gn(r) {
  return r === void 0;
}
function Wn(r) {
  return r === null;
}
function Ur(r) {
  return typeof r == "symbol";
}
function Yt(r) {
  return Object.prototype.toString.call(r) === "[object Object]" || !Js(r) && !Xs(r) && !Je(r) && !Xn(r) && !Et(r) && !Wn(r) && !Gs(r) && !Gn(r) && !Ur(r);
}
function Gs(r) {
  return typeof r == "function";
}
function Qn(r) {
  const e = Object.prototype.toString.call(r);
  return e === "[object Window]" || e === "[object DOMWindow]" || e === "[object global]";
}
function Vn(r) {
  return r == null || typeof r == "string" || typeof r == "boolean" || typeof r == "number" || typeof r == "function" || typeof r == "symbol" || typeof r == "bigint" ? !1 : typeof Symbol < "u" && typeof r[Symbol.iterator] == "function";
}
function Kn(r) {
  return Object.prototype.toString.call(r).replace(/\[object (.*)\]/, "$1");
}
function Zn(r) {
  let e = Object.prototype.hasOwnProperty;
  if (!r || typeof r != "object" || r.nodeType || Qn(r))
    return !1;
  try {
    if (r.constructor && !e.call(r, "constructor") && !e.call(r.constructor.prototype, "isPrototypeOf"))
      return !1;
  } catch {
    return !1;
  }
  let s;
  for (s in r)
    ;
  return s === void 0 || e.call(r, s);
}
const Yn = /[\n\t]/g, ti = (r) => ({ "\n": "\\n", "	": "\\t" })[r];
function ei(r) {
  return typeof r != "string" ? r : String(r).replace(
    Yn,
    ti
  );
}
const ri = () => {
  const r = /* @__PURE__ */ new WeakSet();
  return (e) => {
    if (typeof e == "object" && e !== null) {
      if (r.has(e))
        return !0;
      r.add(e);
    }
    return !1;
  };
}, gs = (r, e = 0) => {
  let s = "";
  return Je(r) ? (e > 0 && (r = Ws(r, e)), s += '"' + ei(r) + '"') : Ur(r) ? s += String(r).replace(/^Symbol\((.*)\)$/i, 'Symbol("$1")') : Gs(r) ? s += (r.name || "function") + "()" : Xs(r) ? s += String(r) + "n" : s += String(r), s;
}, Dr = (r, e, s = 0) => {
  var n, i;
  if (!Yt(r) && !Et(r)) {
    e.ret += gs(r, e.keyMaxLen);
    return;
  }
  if (e.circularFinder(r)) {
    let f = "";
    Et(r) ? f = "(Circular Array)" : Yt(r) && (f = `(Circular ${((n = r.constructor) == null ? void 0 : n.name) || "Object"})`), e.ret += e.standardJSON ? `"${f}"` : f;
    return;
  }
  let a = "", u = "";
  if (e.pretty) {
    for (let f = 0; f <= s; f++)
      a += "  ";
    u = `
`;
  }
  let h = "{", _ = "}";
  Et(r) && (h = "[", _ = "]"), e.ret += h + u;
  const p = ni(r);
  for (let f = 0; f < p.length; f++) {
    const w = p[f];
    e.ret += a;
    try {
      Et(r) || (Yt(w) || Et(w) || Ur(w) ? e.ret += Object.prototype.toString.call(w) : Je(w) && e.standardJSON ? e.ret += '"' + w + '"' : e.ret += w, e.ret += ": ");
    } catch {
      continue;
    }
    try {
      const l = r[w];
      Et(l) ? e.maxDepth > -1 && s >= e.maxDepth ? e.ret += "Array(" + l.length + ")" : Dr(l, e, s + 1) : Yt(l) ? e.maxDepth > -1 && s >= e.maxDepth ? e.ret += (((i = l.constructor) == null ? void 0 : i.name) || "Object") + " {}" : Dr(l, e, s + 1) : e.ret += gs(l, e.keyMaxLen);
    } catch {
      e.ret += e.standardJSON ? '"(PARSE_ERROR)"' : "(PARSE_ERROR)";
    }
    if (e.keyMaxLen > 0 && e.ret.length >= e.keyMaxLen * 10) {
      e.ret += ", (...)";
      break;
    }
    f < p.length - 1 && (e.ret += ", "), e.ret += u;
  }
  e.ret += a.substring(0, a.length - 2) + _;
};
function vs(r, e = {
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
      circularFinder: ri()
    },
    e
  );
  return Dr(r, s), s.ret;
}
function si(r) {
  try {
    return self.Blob ? new self.Blob([r], { type: "text/plain" }).size : encodeURI(r).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length - 1;
  } catch {
    return 0;
  }
}
function je(r) {
  return r <= 0 ? "" : r >= 1e3 * 1e3 ? (r / 1e3 / 1e3).toFixed(1) + " MB" : r >= 1e3 * 1 ? (r / 1e3).toFixed(1) + " KB" : r + " B";
}
function Ws(r, e) {
  return r.length > e && (r = r.substring(0, e) + `...(${je(si(r))})`), r;
}
function ni(r) {
  return !Yt(r) && !Et(r) ? [] : Object.keys(r);
}
function ii(r = [], e = 1024 * 1024) {
  if (!r.length)
    return [];
  if (JSON.stringify(r).length <= e)
    return [r];
  let s = [], n = [], i = 0;
  for (let a = 0; a < r.length; a++) {
    const u = r[a], h = JSON.stringify(u).length;
    i + h < e ? (n.push(u), i += h) : n.length ? (s.push(n), n = [u], i = h) : (s.push([u]), i = 0);
  }
  return s;
}
const ai = (r) => typeof r == "object" ? (r.config && r.request && (r.config = void 0, r.request = void 0), r.status !== void 0 ? r.data ? (r.detail = typeof r.data == "object" ? JSON.stringify(r.data) : r.data, r = new Error(r.detail)) : r.body ? (r.detail = typeof r.body == "object" ? JSON.stringify(r.body) : r.body, r = new Error(r.detail)) : (r.message = `${r.statusText || r.bodyText || ""}`, r = new Error(r.message)) : r = new Error(JSON.stringify(r)), r) : new Error(r), qr = (r) => {
  var e;
  let s = null;
  r ? r && r instanceof Error ? s = r : s = ai(r) : (r = new Error("error"), s = r);
  const n = {
    message: "",
    detail: "",
    name: "",
    stack: []
  };
  if (n.message = s.message, n.name = s.name, n.detail = ((e = s.stack) == null ? void 0 : e.toString()) || s.message, s.stack) {
    let i = s.stack.split(/\n\s+at/);
    i.length && (i = i.slice(1)), n.stack = i;
  }
  return n;
}, Ar = (r) => new Promise((e) => {
  setTimeout(() => {
    e(void 0), r && r();
  }, 0);
}), ye = () => {
  if (typeof wx < "u" && !window) {
    const r = getCurrentPages();
    return r.length ? r[r.length - 1].route : "applaunch";
  } else
    return window.location.href;
};
var oi = Object.defineProperty, ci = (r, e, s) => e in r ? oi(r, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : r[e] = s, I = (r, e, s) => (ci(r, typeof e != "symbol" ? e + "" : e, s), s);
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
var Qs = /* @__PURE__ */ ((r) => (r[r.NORMAL = 0] = "NORMAL", r[r.HIGH = 1] = "HIGH", r[r.EMERGEN = 2] = "EMERGEN", r))(Qs || {});
class at {
  constructor(e, s, n) {
    I(this, "_level", 0), this.apaasTrack = e, this.type = s, n && (this._level = n);
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
      url: ye()
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
}, Ot = (r, e) => {
  const s = fe[e];
  return new s(r);
}, pi = (r, e, s) => {
  const n = s || Date.now(), i = Ot(r, e);
  return {
    ...r.baseLog,
    types: e,
    logtime: String(n),
    epochnanos: String(n) + "000000",
    event: e,
    properties: i.getProperties(),
    url: ye()
  };
}, _s = (r, e, s) => {
  const n = s || Date.now();
  return {
    ...r.baseLog,
    types: e.type,
    logtime: String(n),
    epochnanos: String(n) + "000000",
    event: e.type,
    properties: e.getProperties(),
    url: ye()
  };
}, Vs = (r, e) => {
  if (fe[r])
    throw Error(`\u8BE5\u4E8B\u4EF6${r} \u5DF2\u5B58\u5728\uFF0C\u6CE8\u518C\u5931\u8D25`);
  fe[r] = e;
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
class $r extends at {
  constructor(e, s, n) {
    super(e, "span"), I(this, "spanid", ""), I(this, "traceid", ""), I(this, "parentspanid", ""), I(this, "name", ""), I(this, "attributes", {}), I(this, "events", []), I(this, "statuscode", "OK"), I(this, "statusmessage", ""), I(this, "startTime", 0), I(this, "endTime", 0), this.name = s, this.traceid = we(), this.spanid = qs(), this.parentspanid = n || "", this.start();
  }
  trackLog() {
    this.apaasTrack.addLogByEvent(this);
  }
  createSpanEvent(e, s) {
    return new $r(
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
    let n = "", i = "", a = "";
    if (e instanceof Error) {
      const u = qr(e);
      n = u.detail, i = u.name, a = u.stack.join(",");
    } else
      n = e.exceptionMessage, i = e.exceptionType, a = e.exceptionStackTrace;
    s.setInfo({
      exceptionMessage: n,
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
const Pr = "1.0.22";
class ur {
  constructor(e) {
    I(this, "_version", Pr), I(this, "commonLog", null), I(this, "browserLog", null), I(this, "options"), this.options = e, typeof window < "u" && (window.__apaasTrackVersion__ = Pr), typeof wx < "u" && !window && (wx.__apaasTrackVersion__ = Pr), e.commonLog && this.initCommonLog(e.commonLog), this.runEventInitHooks();
  }
  registerEvent(e, s) {
    Vs(e, s), s.initApaasTrackHook && s.initApaasTrackHook(this), s.startApaasTrackHook && s.startApaasTrackHook(this);
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
    const n = this.createEventLog(e, s);
    this.addLogToQueue(n);
  }
  addLogByEvent(e, s) {
    const n = _s(this, e, s);
    this.addLogToQueue(n);
  }
  createCustomEvent(e) {
    const s = Ot(this, "custom");
    return s.setCustomType(e), s;
  }
  createSpanEvent(e, s) {
    return new $r(this, e, s);
  }
  addLogByCustomEvent(e, s = {}, n) {
    const i = this.createCustomEvent(e);
    i.setProperties(s);
    const a = _s(this, i, n);
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
  trackEvent(e, s = {}, n) {
    const i = Ot(this, e);
    i.setProperties(s), this.addLogByEvent(i, n);
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
  async addLogToQueue(e, s = !1, n = !0) {
    n && (e = this.transformLog(e)), await this.sendLog(e, s);
  }
}
I(ur, "registerEvent", Vs);
class Fc {
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
var fi = Object.defineProperty, gi = (r, e, s) => e in r ? fi(r, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : r[e] = s, y = (r, e, s) => (gi(r, typeof e != "symbol" ? e + "" : e, s), s), vi = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Or = { exports: {} };
(function(r, e) {
  (function(s, n) {
    var i = "1.0.32", a = "", u = "?", h = "function", _ = "undefined", p = "object", f = "string", w = "major", l = "model", v = "name", b = "type", k = "vendor", T = "version", R = "architecture", tt = "console", M = "mobile", C = "tablet", V = "smarttv", J = "wearable", ht = "embedded", gt = 350, zt = "Amazon", ne = "Apple", Se = "ASUS", Xe = "BlackBerry", Ft = "Browser", Jt = "Chrome", _r = "Edge", ie = "Firefox", Xt = "Google", Ge = "Huawei", Y = "LG", Tt = "Microsoft", Ht = "Motorola", ae = "Opera", Pe = "Samsung", Le = "Sharp", Gt = "Sony", It = "Xiaomi", Ee = "Zebra", We = "Facebook", wr = function(z, q) {
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
    }, yr = function(z) {
      return typeof z === f ? z.replace(/[^\d\.]/g, a).split(".")[0] : n;
    }, Qt = function(z, q) {
      if (typeof z === f)
        return z = z.replace(/^\s\s*/, a).replace(/\s\s*$/, a), typeof q === _ ? z : z.substring(0, gt);
    }, lt = function(z, q) {
      for (var A = 0, W, O, ce, X, dt, vt; A < q.length && !dt; ) {
        var Ke = q[A], Ce = q[A + 1];
        for (W = O = 0; W < Ke.length && !dt; )
          if (dt = Ke[W++].exec(z), dt)
            for (ce = 0; ce < Ce.length; ce++)
              vt = dt[++O], X = Ce[ce], typeof X === p && X.length > 0 ? X.length === 2 ? typeof X[1] == h ? this[X[0]] = X[1].call(this, vt) : this[X[0]] = X[1] : X.length === 3 ? typeof X[1] === h && !(X[1].exec && X[1].test) ? this[X[0]] = vt ? X[1].call(this, vt, X[2]) : n : this[X[0]] = vt ? vt.replace(X[1], X[2]) : n : X.length === 4 && (this[X[0]] = vt ? X[3].call(this, vt.replace(X[1], X[2])) : n) : this[X] = vt || n;
        A += 2;
      }
    }, Be = function(z, q) {
      for (var A in q)
        if (typeof q[A] === p && q[A].length > 0) {
          for (var W = 0; W < q[A].length; W++)
            if (xe(q[A][W], z))
              return A === u ? n : A;
        } else if (xe(q[A], z))
          return A === u ? n : A;
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
        [T, [v, "Chrome"]],
        [
          /edg(?:e|ios|a)?\/([\w\.]+)/i
        ],
        [T, [v, "Edge"]],
        [
          /(opera mini)\/([-\w\.]+)/i,
          /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
          /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
        ],
        [v, T],
        [
          /opios[\/ ]+([\w\.]+)/i
        ],
        [T, [v, ae + " Mini"]],
        [
          /\bopr\/([\w\.]+)/i
        ],
        [T, [v, ae]],
        [
          /(kindle)\/([\w\.]+)/i,
          /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,
          /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,
          /(ba?idubrowser)[\/ ]?([\w\.]+)/i,
          /(?:ms|\()(ie) ([\w\.]+)/i,
          /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
          /(weibo)__([\d\.]+)/i
        ],
        [v, T],
        [
          /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
        ],
        [T, [v, "UC" + Ft]],
        [
          /microm.+\bqbcore\/([\w\.]+)/i,
          /\bqbcore\/([\w\.]+).+microm/i
        ],
        [T, [v, "WeChat(Win) Desktop"]],
        [
          /micromessenger\/([\w\.]+)/i
        ],
        [T, [v, "WeChat"]],
        [
          /konqueror\/([\w\.]+)/i
        ],
        [T, [v, "Konqueror"]],
        [
          /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
        ],
        [T, [v, "IE"]],
        [
          /yabrowser\/([\w\.]+)/i
        ],
        [T, [v, "Yandex"]],
        [
          /(avast|avg)\/([\w\.]+)/i
        ],
        [[v, /(.+)/, "$1 Secure " + Ft], T],
        [
          /\bfocus\/([\w\.]+)/i
        ],
        [T, [v, ie + " Focus"]],
        [
          /\bopt\/([\w\.]+)/i
        ],
        [T, [v, ae + " Touch"]],
        [
          /coc_coc\w+\/([\w\.]+)/i
        ],
        [T, [v, "Coc Coc"]],
        [
          /dolfin\/([\w\.]+)/i
        ],
        [T, [v, "Dolphin"]],
        [
          /coast\/([\w\.]+)/i
        ],
        [T, [v, ae + " Coast"]],
        [
          /miuibrowser\/([\w\.]+)/i
        ],
        [T, [v, "MIUI " + Ft]],
        [
          /fxios\/([-\w\.]+)/i
        ],
        [T, [v, ie]],
        [
          /\bqihu|(qi?ho?o?|360)browser/i
        ],
        [[v, "360 " + Ft]],
        [
          /(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i
        ],
        [[v, /(.+)/, "$1 " + Ft], T],
        [
          /(comodo_dragon)\/([\w\.]+)/i
        ],
        [[v, /_/g, " "], T],
        [
          /(electron)\/([\w\.]+) safari/i,
          /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
          /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i
        ],
        [v, T],
        [
          /(metasr)[\/ ]?([\w\.]+)/i,
          /(lbbrowser)/i,
          /\[(linkedin)app\]/i
        ],
        [v],
        [
          /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
        ],
        [[v, We], T],
        [
          /safari (line)\/([\w\.]+)/i,
          /\b(line)\/([\w\.]+)\/iab/i,
          /(chromium|instagram)[\/ ]([-\w\.]+)/i
        ],
        [v, T],
        [
          /\bgsa\/([\w\.]+) .*safari\//i
        ],
        [T, [v, "GSA"]],
        [
          /headlesschrome(?:\/([\w\.]+)| )/i
        ],
        [T, [v, Jt + " Headless"]],
        [
          / wv\).+(chrome)\/([\w\.]+)/i
        ],
        [[v, Jt + " WebView"], T],
        [
          /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
        ],
        [T, [v, "Android " + Ft]],
        [
          /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
        ],
        [v, T],
        [
          /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i
        ],
        [T, [v, "Mobile Safari"]],
        [
          /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i
        ],
        [T, v],
        [
          /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
        ],
        [v, [T, Be, Qe]],
        [
          /(webkit|khtml)\/([\w\.]+)/i
        ],
        [v, T],
        [
          /(navigator|netscape\d?)\/([-\w\.]+)/i
        ],
        [[v, "Netscape"], T],
        [
          /mobile vr; rv:([\w\.]+)\).+firefox/i
        ],
        [T, [v, ie + " Reality"]],
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
        [v, T]
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
        [l, [k, Pe], [b, C]],
        [
          /\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i,
          /samsung[- ]([-\w]+)/i,
          /sec-(sgh\w+)/i
        ],
        [l, [k, Pe], [b, M]],
        [
          /\((ip(?:hone|od)[\w ]*);/i
        ],
        [l, [k, ne], [b, M]],
        [
          /\((ipad);[-\w\),; ]+apple/i,
          /applecoremedia\/[\w\.]+ \((ipad)/i,
          /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
        ],
        [l, [k, ne], [b, C]],
        [
          /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
        ],
        [l, [k, Ge], [b, C]],
        [
          /(?:huawei|honor)([-\w ]+)[;\)]/i,
          /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
        ],
        [l, [k, Ge], [b, M]],
        [
          /\b(poco[\w ]+)(?: bui|\))/i,
          /\b; (\w+) build\/hm\1/i,
          /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
          /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
          /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i
        ],
        [[l, /_/g, " "], [k, It], [b, M]],
        [
          /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i
        ],
        [[l, /_/g, " "], [k, It], [b, C]],
        [
          /; (\w+) bui.+ oppo/i,
          /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
        ],
        [l, [k, "OPPO"], [b, M]],
        [
          /vivo (\w+)(?: bui|\))/i,
          /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
        ],
        [l, [k, "Vivo"], [b, M]],
        [
          /\b(rmx[12]\d{3})(?: bui|;|\))/i
        ],
        [l, [k, "Realme"], [b, M]],
        [
          /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
          /\bmot(?:orola)?[- ](\w*)/i,
          /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
        ],
        [l, [k, Ht], [b, M]],
        [
          /\b(mz60\d|xoom[2 ]{0,2}) build\//i
        ],
        [l, [k, Ht], [b, C]],
        [
          /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
        ],
        [l, [k, Y], [b, C]],
        [
          /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
          /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
          /\blg-?([\d\w]+) bui/i
        ],
        [l, [k, Y], [b, M]],
        [
          /(ideatab[-\w ]+)/i,
          /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
        ],
        [l, [k, "Lenovo"], [b, C]],
        [
          /(?:maemo|nokia).*(n900|lumia \d+)/i,
          /nokia[-_ ]?([-\w\.]*)/i
        ],
        [[l, /_/g, " "], [k, "Nokia"], [b, M]],
        [
          /(pixel c)\b/i
        ],
        [l, [k, Xt], [b, C]],
        [
          /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i
        ],
        [l, [k, Xt], [b, M]],
        [
          /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
        ],
        [l, [k, Gt], [b, M]],
        [
          /sony tablet [ps]/i,
          /\b(?:sony)?sgp\w+(?: bui|\))/i
        ],
        [[l, "Xperia Tablet"], [k, Gt], [b, C]],
        [
          / (kb2005|in20[12]5|be20[12][59])\b/i,
          /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
        ],
        [l, [k, "OnePlus"], [b, M]],
        [
          /(alexa)webm/i,
          /(kf[a-z]{2}wi)( bui|\))/i,
          /(kf[a-z]+)( bui|\)).+silk\//i
        ],
        [l, [k, zt], [b, C]],
        [
          /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
        ],
        [[l, /(.+)/g, "Fire Phone $1"], [k, zt], [b, M]],
        [
          /(playbook);[-\w\),; ]+(rim)/i
        ],
        [l, k, [b, C]],
        [
          /\b((?:bb[a-f]|st[hv])100-\d)/i,
          /\(bb10; (\w+)/i
        ],
        [l, [k, Xe], [b, M]],
        [
          /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
        ],
        [l, [k, Se], [b, C]],
        [
          / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
        ],
        [l, [k, Se], [b, M]],
        [
          /(nexus 9)/i
        ],
        [l, [k, "HTC"], [b, C]],
        [
          /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
          /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
          /(alcatel|geeksphone|nexian|panasonic|sony(?!-bra))[-_ ]?([-\w]*)/i
        ],
        [k, [l, /_/g, " "], [b, M]],
        [
          /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
        ],
        [l, [k, "Acer"], [b, C]],
        [
          /droid.+; (m[1-5] note) bui/i,
          /\bmz-([-\w]{2,})/i
        ],
        [l, [k, "Meizu"], [b, M]],
        [
          /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
        ],
        [l, [k, Le], [b, M]],
        [
          /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,
          /(hp) ([\w ]+\w)/i,
          /(asus)-?(\w+)/i,
          /(microsoft); (lumia[\w ]+)/i,
          /(lenovo)[-_ ]?([-\w]+)/i,
          /(jolla)/i,
          /(oppo) ?([\w ]+) bui/i
        ],
        [k, l, [b, M]],
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
        [k, l, [b, C]],
        [
          /(surface duo)/i
        ],
        [l, [k, Tt], [b, C]],
        [
          /droid [\d\.]+; (fp\du?)(?: b|\))/i
        ],
        [l, [k, "Fairphone"], [b, M]],
        [
          /(u304aa)/i
        ],
        [l, [k, "AT&T"], [b, M]],
        [
          /\bsie-(\w*)/i
        ],
        [l, [k, "Siemens"], [b, M]],
        [
          /\b(rct\w+) b/i
        ],
        [l, [k, "RCA"], [b, C]],
        [
          /\b(venue[\d ]{2,7}) b/i
        ],
        [l, [k, "Dell"], [b, C]],
        [
          /\b(q(?:mv|ta)\w+) b/i
        ],
        [l, [k, "Verizon"], [b, C]],
        [
          /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i
        ],
        [l, [k, "Barnes & Noble"], [b, C]],
        [
          /\b(tm\d{3}\w+) b/i
        ],
        [l, [k, "NuVision"], [b, C]],
        [
          /\b(k88) b/i
        ],
        [l, [k, "ZTE"], [b, C]],
        [
          /\b(nx\d{3}j) b/i
        ],
        [l, [k, "ZTE"], [b, M]],
        [
          /\b(gen\d{3}) b.+49h/i
        ],
        [l, [k, "Swiss"], [b, M]],
        [
          /\b(zur\d{3}) b/i
        ],
        [l, [k, "Swiss"], [b, C]],
        [
          /\b((zeki)?tb.*\b) b/i
        ],
        [l, [k, "Zeki"], [b, C]],
        [
          /\b([yr]\d{2}) b/i,
          /\b(dragon[- ]+touch |dt)(\w{5}) b/i
        ],
        [[k, "Dragon Touch"], l, [b, C]],
        [
          /\b(ns-?\w{0,9}) b/i
        ],
        [l, [k, "Insignia"], [b, C]],
        [
          /\b((nxa|next)-?\w{0,9}) b/i
        ],
        [l, [k, "NextBook"], [b, C]],
        [
          /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i
        ],
        [[k, "Voice"], l, [b, M]],
        [
          /\b(lvtel\-)?(v1[12]) b/i
        ],
        [[k, "LvTel"], l, [b, M]],
        [
          /\b(ph-1) /i
        ],
        [l, [k, "Essential"], [b, M]],
        [
          /\b(v(100md|700na|7011|917g).*\b) b/i
        ],
        [l, [k, "Envizen"], [b, C]],
        [
          /\b(trio[-\w\. ]+) b/i
        ],
        [l, [k, "MachSpeed"], [b, C]],
        [
          /\btu_(1491) b/i
        ],
        [l, [k, "Rotor"], [b, C]],
        [
          /(shield[\w ]+) b/i
        ],
        [l, [k, "Nvidia"], [b, C]],
        [
          /(sprint) (\w+)/i
        ],
        [k, l, [b, M]],
        [
          /(kin\.[onetw]{3})/i
        ],
        [[l, /\./g, " "], [k, Tt], [b, M]],
        [
          /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
        ],
        [l, [k, Ee], [b, C]],
        [
          /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
        ],
        [l, [k, Ee], [b, M]],
        [
          /(ouya)/i,
          /(nintendo) ([wids3utch]+)/i
        ],
        [k, l, [b, tt]],
        [
          /droid.+; (shield) bui/i
        ],
        [l, [k, "Nvidia"], [b, tt]],
        [
          /(playstation [345portablevi]+)/i
        ],
        [l, [k, Gt], [b, tt]],
        [
          /\b(xbox(?: one)?(?!; xbox))[\); ]/i
        ],
        [l, [k, Tt], [b, tt]],
        [
          /smart-tv.+(samsung)/i
        ],
        [k, [b, V]],
        [
          /hbbtv.+maple;(\d+)/i
        ],
        [[l, /^/, "SmartTV"], [k, Pe], [b, V]],
        [
          /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
        ],
        [[k, Y], [b, V]],
        [
          /(apple) ?tv/i
        ],
        [k, [l, ne + " TV"], [b, V]],
        [
          /crkey/i
        ],
        [[l, Jt + "cast"], [k, Xt], [b, V]],
        [
          /droid.+aft(\w)( bui|\))/i
        ],
        [l, [k, zt], [b, V]],
        [
          /\(dtv[\);].+(aquos)/i,
          /(aquos-tv[\w ]+)\)/i
        ],
        [l, [k, Le], [b, V]],
        [
          /(bravia[\w ]+)( bui|\))/i
        ],
        [l, [k, Gt], [b, V]],
        [
          /(mitv-\w{5}) bui/i
        ],
        [l, [k, It], [b, V]],
        [
          /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
          /hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i
        ],
        [[k, Qt], [l, Qt], [b, V]],
        [
          /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i
        ],
        [[b, V]],
        [
          /((pebble))app/i
        ],
        [k, l, [b, J]],
        [
          /droid.+; (glass) \d/i
        ],
        [l, [k, Xt], [b, J]],
        [
          /droid.+; (wt63?0{2,3})\)/i
        ],
        [l, [k, Ee], [b, J]],
        [
          /(quest( 2)?)/i
        ],
        [l, [k, We], [b, J]],
        [
          /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
        ],
        [k, [b, ht]],
        [
          /droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i
        ],
        [l, [b, M]],
        [
          /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i
        ],
        [l, [b, C]],
        [
          /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
        ],
        [[b, C]],
        [
          /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
        ],
        [[b, M]],
        [
          /(android[-\w\. ]{0,9});.+buil/i
        ],
        [l, [k, "Generic"]]
      ],
      engine: [
        [
          /windows.+ edge\/([\w\.]+)/i
        ],
        [T, [v, _r + "HTML"]],
        [
          /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
        ],
        [T, [v, "Blink"]],
        [
          /(presto)\/([\w\.]+)/i,
          /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
          /ekioh(flow)\/([\w\.]+)/i,
          /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
          /(icab)[\/ ]([23]\.[\d\.]+)/i
        ],
        [v, T],
        [
          /rv\:([\w\.]{1,9})\b.+(gecko)/i
        ],
        [T, v]
      ],
      os: [
        [
          /microsoft (windows) (vista|xp)/i
        ],
        [v, T],
        [
          /(windows) nt 6\.2; (arm)/i,
          /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,
          /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i
        ],
        [v, [T, Be, Ve]],
        [
          /(win(?=3|9|n)|win 9x )([nt\d\.]+)/i
        ],
        [[v, "Windows"], [T, Be, Ve]],
        [
          /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
          /cfnetwork\/.+darwin/i
        ],
        [[T, /_/g, "."], [v, "iOS"]],
        [
          /(mac os x) ?([\w\. ]*)/i,
          /(macintosh|mac_powerpc\b)(?!.+haiku)/i
        ],
        [[v, "Mac OS"], [T, /_/g, "."]],
        [
          /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i
        ],
        [T, v],
        [
          /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
          /(blackberry)\w*\/([\w\.]*)/i,
          /(tizen|kaios)[\/ ]([\w\.]+)/i,
          /\((series40);/i
        ],
        [v, T],
        [
          /\(bb(10);/i
        ],
        [T, [v, Xe]],
        [
          /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i
        ],
        [T, [v, "Symbian"]],
        [
          /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
        ],
        [T, [v, ie + " OS"]],
        [
          /web0s;.+rt(tv)/i,
          /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i
        ],
        [T, [v, "webOS"]],
        [
          /crkey\/([\d\.]+)/i
        ],
        [T, [v, Jt + "cast"]],
        [
          /(cros) [\w]+ ([\w\.]+\w)/i
        ],
        [[v, "Chromium OS"], T],
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
        [v, T],
        [
          /(sunos) ?([\w\.\d]*)/i
        ],
        [[v, "Solaris"], T],
        [
          /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
          /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
          /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i,
          /(unix) ?([\w\.]*)/i
        ],
        [v, T]
      ]
    }, ot = function(z, q) {
      if (typeof z === p && (q = z, z = n), !(this instanceof ot))
        return new ot(z, q).getResult();
      var A = z || (typeof s !== _ && s.navigator && s.navigator.userAgent ? s.navigator.userAgent : a), W = q ? wr(Mt, q) : Mt;
      return this.getBrowser = function() {
        var O = {};
        return O[v] = n, O[T] = n, lt.call(O, A, W.browser), O.major = yr(O.version), O;
      }, this.getCPU = function() {
        var O = {};
        return O[R] = n, lt.call(O, A, W.cpu), O;
      }, this.getDevice = function() {
        var O = {};
        return O[k] = n, O[l] = n, O[b] = n, lt.call(O, A, W.device), O;
      }, this.getEngine = function() {
        var O = {};
        return O[v] = n, O[T] = n, lt.call(O, A, W.engine), O;
      }, this.getOS = function() {
        var O = {};
        return O[v] = n, O[T] = n, lt.call(O, A, W.os), O;
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
    ot.VERSION = i, ot.BROWSER = Ct([v, T, w]), ot.CPU = Ct([R]), ot.DEVICE = Ct([l, k, b, tt, M, V, C, J, ht]), ot.ENGINE = ot.OS = Ct([v, T]), r.exports && (e = r.exports = ot), e.UAParser = ot;
    var Nt = typeof s !== _ && (s.jQuery || s.Zepto);
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
  })(typeof window == "object" ? window : vi);
})(Or, Or.exports);
var Ks = { exports: {} }, Zs = { exports: {} };
(function() {
  var r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", e = {
    rotl: function(s, n) {
      return s << n | s >>> 32 - n;
    },
    rotr: function(s, n) {
      return s << 32 - n | s >>> n;
    },
    endian: function(s) {
      if (s.constructor == Number)
        return e.rotl(s, 8) & 16711935 | e.rotl(s, 24) & 4278255360;
      for (var n = 0; n < s.length; n++)
        s[n] = e.endian(s[n]);
      return s;
    },
    randomBytes: function(s) {
      for (var n = []; s > 0; s--)
        n.push(Math.floor(Math.random() * 256));
      return n;
    },
    bytesToWords: function(s) {
      for (var n = [], i = 0, a = 0; i < s.length; i++, a += 8)
        n[a >>> 5] |= s[i] << 24 - a % 32;
      return n;
    },
    wordsToBytes: function(s) {
      for (var n = [], i = 0; i < s.length * 32; i += 8)
        n.push(s[i >>> 5] >>> 24 - i % 32 & 255);
      return n;
    },
    bytesToHex: function(s) {
      for (var n = [], i = 0; i < s.length; i++)
        n.push((s[i] >>> 4).toString(16)), n.push((s[i] & 15).toString(16));
      return n.join("");
    },
    hexToBytes: function(s) {
      for (var n = [], i = 0; i < s.length; i += 2)
        n.push(parseInt(s.substr(i, 2), 16));
      return n;
    },
    bytesToBase64: function(s) {
      for (var n = [], i = 0; i < s.length; i += 3)
        for (var a = s[i] << 16 | s[i + 1] << 8 | s[i + 2], u = 0; u < 4; u++)
          i * 8 + u * 6 <= s.length * 8 ? n.push(r.charAt(a >>> 6 * (3 - u) & 63)) : n.push("=");
      return n.join("");
    },
    base64ToBytes: function(s) {
      s = s.replace(/[^A-Z0-9+\/]/ig, "");
      for (var n = [], i = 0, a = 0; i < s.length; a = ++i % 4)
        a != 0 && n.push((r.indexOf(s.charAt(i - 1)) & Math.pow(2, -2 * a + 8) - 1) << a * 2 | r.indexOf(s.charAt(i)) >>> 6 - a * 2);
      return n;
    }
  };
  Zs.exports = e;
})();
var zr = {
  utf8: {
    stringToBytes: function(r) {
      return zr.bin.stringToBytes(unescape(encodeURIComponent(r)));
    },
    bytesToString: function(r) {
      return decodeURIComponent(escape(zr.bin.bytesToString(r)));
    }
  },
  bin: {
    stringToBytes: function(r) {
      for (var e = [], s = 0; s < r.length; s++)
        e.push(r.charCodeAt(s) & 255);
      return e;
    },
    bytesToString: function(r) {
      for (var e = [], s = 0; s < r.length; s++)
        e.push(String.fromCharCode(r[s]));
      return e.join("");
    }
  }
}, ws = zr;
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var _i = function(r) {
  return r != null && (Ys(r) || wi(r) || !!r._isBuffer);
};
function Ys(r) {
  return !!r.constructor && typeof r.constructor.isBuffer == "function" && r.constructor.isBuffer(r);
}
function wi(r) {
  return typeof r.readFloatLE == "function" && typeof r.slice == "function" && Ys(r.slice(0, 0));
}
(function() {
  var r = Zs.exports, e = ws.utf8, s = _i, n = ws.bin, i = function(a, u) {
    a.constructor == String ? u && u.encoding === "binary" ? a = n.stringToBytes(a) : a = e.stringToBytes(a) : s(a) ? a = Array.prototype.slice.call(a, 0) : !Array.isArray(a) && a.constructor !== Uint8Array && (a = a.toString());
    for (var h = r.bytesToWords(a), _ = a.length * 8, p = 1732584193, f = -271733879, w = -1732584194, l = 271733878, v = 0; v < h.length; v++)
      h[v] = (h[v] << 8 | h[v] >>> 24) & 16711935 | (h[v] << 24 | h[v] >>> 8) & 4278255360;
    h[_ >>> 5] |= 128 << _ % 32, h[(_ + 64 >>> 9 << 4) + 14] = _;
    for (var b = i._ff, k = i._gg, T = i._hh, R = i._ii, v = 0; v < h.length; v += 16) {
      var tt = p, M = f, C = w, V = l;
      p = b(p, f, w, l, h[v + 0], 7, -680876936), l = b(l, p, f, w, h[v + 1], 12, -389564586), w = b(w, l, p, f, h[v + 2], 17, 606105819), f = b(f, w, l, p, h[v + 3], 22, -1044525330), p = b(p, f, w, l, h[v + 4], 7, -176418897), l = b(l, p, f, w, h[v + 5], 12, 1200080426), w = b(w, l, p, f, h[v + 6], 17, -1473231341), f = b(f, w, l, p, h[v + 7], 22, -45705983), p = b(p, f, w, l, h[v + 8], 7, 1770035416), l = b(l, p, f, w, h[v + 9], 12, -1958414417), w = b(w, l, p, f, h[v + 10], 17, -42063), f = b(f, w, l, p, h[v + 11], 22, -1990404162), p = b(p, f, w, l, h[v + 12], 7, 1804603682), l = b(l, p, f, w, h[v + 13], 12, -40341101), w = b(w, l, p, f, h[v + 14], 17, -1502002290), f = b(f, w, l, p, h[v + 15], 22, 1236535329), p = k(p, f, w, l, h[v + 1], 5, -165796510), l = k(l, p, f, w, h[v + 6], 9, -1069501632), w = k(w, l, p, f, h[v + 11], 14, 643717713), f = k(f, w, l, p, h[v + 0], 20, -373897302), p = k(p, f, w, l, h[v + 5], 5, -701558691), l = k(l, p, f, w, h[v + 10], 9, 38016083), w = k(w, l, p, f, h[v + 15], 14, -660478335), f = k(f, w, l, p, h[v + 4], 20, -405537848), p = k(p, f, w, l, h[v + 9], 5, 568446438), l = k(l, p, f, w, h[v + 14], 9, -1019803690), w = k(w, l, p, f, h[v + 3], 14, -187363961), f = k(f, w, l, p, h[v + 8], 20, 1163531501), p = k(p, f, w, l, h[v + 13], 5, -1444681467), l = k(l, p, f, w, h[v + 2], 9, -51403784), w = k(w, l, p, f, h[v + 7], 14, 1735328473), f = k(f, w, l, p, h[v + 12], 20, -1926607734), p = T(p, f, w, l, h[v + 5], 4, -378558), l = T(l, p, f, w, h[v + 8], 11, -2022574463), w = T(w, l, p, f, h[v + 11], 16, 1839030562), f = T(f, w, l, p, h[v + 14], 23, -35309556), p = T(p, f, w, l, h[v + 1], 4, -1530992060), l = T(l, p, f, w, h[v + 4], 11, 1272893353), w = T(w, l, p, f, h[v + 7], 16, -155497632), f = T(f, w, l, p, h[v + 10], 23, -1094730640), p = T(p, f, w, l, h[v + 13], 4, 681279174), l = T(l, p, f, w, h[v + 0], 11, -358537222), w = T(w, l, p, f, h[v + 3], 16, -722521979), f = T(f, w, l, p, h[v + 6], 23, 76029189), p = T(p, f, w, l, h[v + 9], 4, -640364487), l = T(l, p, f, w, h[v + 12], 11, -421815835), w = T(w, l, p, f, h[v + 15], 16, 530742520), f = T(f, w, l, p, h[v + 2], 23, -995338651), p = R(p, f, w, l, h[v + 0], 6, -198630844), l = R(l, p, f, w, h[v + 7], 10, 1126891415), w = R(w, l, p, f, h[v + 14], 15, -1416354905), f = R(f, w, l, p, h[v + 5], 21, -57434055), p = R(p, f, w, l, h[v + 12], 6, 1700485571), l = R(l, p, f, w, h[v + 3], 10, -1894986606), w = R(w, l, p, f, h[v + 10], 15, -1051523), f = R(f, w, l, p, h[v + 1], 21, -2054922799), p = R(p, f, w, l, h[v + 8], 6, 1873313359), l = R(l, p, f, w, h[v + 15], 10, -30611744), w = R(w, l, p, f, h[v + 6], 15, -1560198380), f = R(f, w, l, p, h[v + 13], 21, 1309151649), p = R(p, f, w, l, h[v + 4], 6, -145523070), l = R(l, p, f, w, h[v + 11], 10, -1120210379), w = R(w, l, p, f, h[v + 2], 15, 718787259), f = R(f, w, l, p, h[v + 9], 21, -343485551), p = p + tt >>> 0, f = f + M >>> 0, w = w + C >>> 0, l = l + V >>> 0;
    }
    return r.endian([p, f, w, l]);
  };
  i._ff = function(a, u, h, _, p, f, w) {
    var l = a + (u & h | ~u & _) + (p >>> 0) + w;
    return (l << f | l >>> 32 - f) + u;
  }, i._gg = function(a, u, h, _, p, f, w) {
    var l = a + (u & _ | h & ~_) + (p >>> 0) + w;
    return (l << f | l >>> 32 - f) + u;
  }, i._hh = function(a, u, h, _, p, f, w) {
    var l = a + (u ^ h ^ _) + (p >>> 0) + w;
    return (l << f | l >>> 32 - f) + u;
  }, i._ii = function(a, u, h, _, p, f, w) {
    var l = a + (h ^ (u | ~_)) + (p >>> 0) + w;
    return (l << f | l >>> 32 - f) + u;
  }, i._blocksize = 16, i._digestsize = 16, Ks.exports = function(a, u) {
    if (a == null)
      throw new Error("Illegal argument " + a);
    var h = r.wordsToBytes(i(a, u));
    return u && u.asBytes ? h : u && u.asString ? n.bytesToString(h) : r.bytesToHex(h);
  };
})();
const sr = "1.0.22";
//! © 2015 Nathan Rugg <nmrugg@gmail.com> | MIT
function yi(r) {
  var e = 1, s = 2, n = 3, i = {}, a = new Worker(r || "./lzma_worker-min.js");
  return a.onmessage = function(u) {
    u.data.action === n ? i[u.data.cbn] && typeof i[u.data.cbn].on_progress == "function" && i[u.data.cbn].on_progress(u.data.result) : i[u.data.cbn] && typeof i[u.data.cbn].on_finish == "function" && (i[u.data.cbn].on_finish(u.data.result, u.data.error), delete i[u.data.cbn]);
  }, a.onerror = function(u) {
    var h = new Error(u.message + " (" + u.filename + ":" + u.lineno + ")");
    for (var _ in i)
      i[_].on_finish(null, h);
    console.error("Uncaught error in lzma_worker", h);
  }, function() {
    function u(h, _, p, f, w) {
      var l;
      do
        l = Math.floor(Math.random() * 1e7);
      while (typeof i[l] < "u");
      i[l] = {
        on_finish: f,
        on_progress: w
      }, a.postMessage({
        action: h,
        cbn: l,
        data: _,
        mode: p
      });
    }
    return {
      compress: function(h, _, p, f) {
        u(e, h, _, p, f);
      },
      decompress: function(h, _, p) {
        u(s, h, !1, _, p);
      },
      worker: function() {
        return a;
      }
    };
  }();
}
var Fr = function() {
  var r = 1, e = 3, s = typeof setImmediate == "function" ? setImmediate : setTimeout, n = 4294967296, i = [4294967295, -n], a = [0, -9223372036854776e3], u = [0, 0], h = [1, 0];
  function _(t, o) {
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
    return v(t[0] + o[0], t[1] + o[1]);
  }
  function w(t, o) {
    return R(~~Math.max(Math.min(t[1] / n, 2147483647), -2147483648) & ~~Math.max(Math.min(o[1] / n, 2147483647), -2147483648), T(t) & T(o));
  }
  function l(t, o) {
    var c, d;
    return t[0] == o[0] && t[1] == o[1] ? 0 : (c = t[1] < 0, d = o[1] < 0, c && !d ? -1 : !c && d ? 1 : J(t, o)[1] < 0 ? -1 : 1);
  }
  function v(t, o) {
    var c, d;
    for (o %= 18446744073709552e3, t %= 18446744073709552e3, c = o % n, d = Math.floor(t / n) * n, o = o - c + d, t = t - d + c; t < 0; )
      t += n, o -= n;
    for (; t > 4294967295; )
      t -= n, o += n;
    for (o = o % 18446744073709552e3; o > 9223372032559809e3; )
      o -= 18446744073709552e3;
    for (; o < -9223372036854776e3; )
      o += 18446744073709552e3;
    return [t, o];
  }
  function b(t, o) {
    return t[0] == o[0] && t[1] == o[1];
  }
  function k(t) {
    return t >= 0 ? [t, 0] : [t + n, -n];
  }
  function T(t) {
    return t[0] >= 2147483648 ? ~~Math.max(Math.min(t[0] - n, 2147483647), -2147483648) : ~~Math.max(Math.min(t[0], 2147483647), -2147483648);
  }
  function R(t, o) {
    var c, d;
    return c = t * n, d = o, o < 0 && (d += n), [d, c];
  }
  function tt(t) {
    return t <= 30 ? 1 << t : tt(30) * tt(t - 30);
  }
  function M(t, o) {
    var c, d, m, g;
    if (o &= 63, b(t, a))
      return o ? u : t;
    if (t[1] < 0)
      throw new Error("Neg");
    return g = tt(o), d = t[1] * g % 18446744073709552e3, m = t[0] * g, c = m - m % n, d += c, m -= c, d >= 9223372036854776e3 && (d -= 18446744073709552e3), [m, d];
  }
  function C(t, o) {
    var c;
    return o &= 63, c = tt(o), v(Math.floor(t[0] / c), t[1] / c);
  }
  function V(t, o) {
    var c;
    return o &= 63, c = C(t, o), t[1] < 0 && (c = f(c, M([2, 0], 63 - o))), c;
  }
  function J(t, o) {
    return v(t[0] - o[0], t[1] - o[1]);
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
  function ne(t) {
    var o = t.buf;
    return o.length = t.count, o;
  }
  function Se(t, o) {
    t.buf[t.count++] = o << 24 >> 24;
  }
  function Xe(t, o, c, d) {
    Jt(o, c, t.buf, t.count, d), t.count += d;
  }
  function Ft(t, o, c, d, m) {
    var g;
    for (g = o; g < c; ++g)
      d[m++] = t.charCodeAt(g);
  }
  function Jt(t, o, c, d, m) {
    for (var g = 0; g < m; ++g)
      c[d + g] = t[o + g];
  }
  function _r(t, o) {
    xn(o, 1 << t.s), o._numFastBytes = t.f, Bn(o, t.m), o._numLiteralPosStateBits = 0, o._numLiteralContextBits = 3, o._posStateBits = 2, o._posStateMask = 3;
  }
  function ie(t, o, c, d, m) {
    var g, S;
    if (l(d, i) < 0)
      throw new Error("invalid length " + d);
    for (t.length_0 = d, g = q({}), _r(m, g), g._writeEndMark = typeof Fr.disableEndMark > "u", Cn(g, c), S = 0; S < 64; S += 8)
      Se(c, T(C(d, S)) & 255);
    t.chunker = (g._needReleaseMFStream = 0, g._inStream = o, g._finished = 0, z(g), g._rangeEncoder.Stream = c, Ke(g), W(g), A(g), g._lenEncoder._tableSize = g._numFastBytes + 1 - 2, rs(g._lenEncoder, 1 << g._posStateBits), g._repMatchLenEncoder._tableSize = g._numFastBytes + 1 - 2, rs(g._repMatchLenEncoder, 1 << g._posStateBits), g.nowPos64 = u, Be({}, g));
  }
  function Xt(t, o, c) {
    return t.output = zt({}), ie(t, ht({}, o), t.output, k(o.length), c), t;
  }
  function Ge(t, o, c, d) {
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
  function Ht(t) {
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
  function Gt(t, o) {
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
    o < 1073741567 && (t._cutValue = 16 + (d >> 1), B = ~~((o + c + d + m) / 2) + 256, Ge(t, o + c, d + m, B), t._matchMaxLen = d, g = o + 1, t._cyclicBufferSize != g && (t._son = p((t._cyclicBufferSize = g) * 2)), S = 65536, t.HASH_ARRAY && (S = o - 1, S |= S >> 1, S |= S >> 2, S |= S >> 4, S |= S >> 8, S >>= 1, S |= 65535, S > 16777216 && (S >>= 1), t._hashMask = S, ++S, S += t.kFixHashSize), S != t._hashSizeSum && (t._hash = p(t._hashSizeSum = S)));
  }
  function We(t, o) {
    var c, d, m, g, S, B, D, L, x, G, F, H, et, P, N, K, j, _t, st, wt, St;
    if (t._pos + t._matchMaxLen <= t._streamPos)
      P = t._matchMaxLen;
    else if (P = t._streamPos - t._pos, P < t.kMinMatchCheck)
      return Ct(t), 0;
    for (j = 0, N = t._pos > t._cyclicBufferSize ? t._pos - t._cyclicBufferSize : 0, d = t._bufferOffset + t._pos, K = 1, L = 0, x = 0, t.HASH_ARRAY ? (St = It[t._bufferBase[d] & 255] ^ t._bufferBase[d + 1] & 255, L = St & 1023, St ^= (t._bufferBase[d + 2] & 255) << 8, x = St & 65535, G = (St ^ It[t._bufferBase[d + 3] & 255] << 5) & t._hashMask) : G = t._bufferBase[d] & 255 ^ (t._bufferBase[d + 1] & 255) << 8, m = t._hash[t.kFixHashSize + G] || 0, t.HASH_ARRAY && (g = t._hash[L] || 0, S = t._hash[1024 + x] || 0, t._hash[L] = t._pos, t._hash[1024 + x] = t._pos, g > N && t._bufferBase[t._bufferOffset + g] == t._bufferBase[d] && (o[j++] = K = 2, o[j++] = t._pos - g - 1), S > N && t._bufferBase[t._bufferOffset + S] == t._bufferBase[d] && (S == g && (j -= 2), o[j++] = K = 3, o[j++] = t._pos - S - 1, g = S), j != 0 && g == m && (j -= 2, K = 1)), t._hash[t.kFixHashSize + G] = t._pos, st = (t._cyclicBufferPos << 1) + 1, wt = t._cyclicBufferPos << 1, H = et = t.kNumHashDirectBytes, t.kNumHashDirectBytes != 0 && m > N && t._bufferBase[t._bufferOffset + m + t.kNumHashDirectBytes] != t._bufferBase[d + t.kNumHashDirectBytes] && (o[j++] = K = t.kNumHashDirectBytes, o[j++] = t._pos - m - 1), c = t._cutValue; ; ) {
      if (m <= N || c-- == 0) {
        t._son[st] = t._son[wt] = 0;
        break;
      }
      if (D = t._pos - m, B = (D <= t._cyclicBufferPos ? t._cyclicBufferPos - D : t._cyclicBufferPos - D + t._cyclicBufferSize) << 1, _t = t._bufferOffset + m, F = H < et ? H : et, t._bufferBase[_t + F] == t._bufferBase[d + F]) {
        for (; ++F != P && t._bufferBase[_t + F] == t._bufferBase[d + F]; )
          ;
        if (K < F && (o[j++] = K = F, o[j++] = D - 1, F == P)) {
          t._son[wt] = t._son[B], t._son[st] = t._son[B + 1];
          break;
        }
      }
      (t._bufferBase[_t + F] & 255) < (t._bufferBase[d + F] & 255) ? (t._son[wt] = m, wt = B + 1, m = t._son[wt], et = F) : (t._son[st] = m, st = B, m = t._son[st], H = F);
    }
    return Ct(t), j;
  }
  function wr(t) {
    t._bufferOffset = 0, t._pos = 0, t._streamPos = 0, t._streamEndWasReached = 0, Le(t), t._cyclicBufferPos = 0, Gt(t, -1);
  }
  function Ct(t) {
    var o;
    ++t._cyclicBufferPos >= t._cyclicBufferSize && (t._cyclicBufferPos = 0), Pe(t), t._pos == 1073741823 && (o = t._pos - t._cyclicBufferSize, xe(t._son, t._cyclicBufferSize * 2, o), xe(t._hash, t._hashSizeSum, o), Gt(t, o));
  }
  function xe(t, o, c) {
    var d, m;
    for (d = 0; d < o; ++d)
      m = t[d] || 0, m <= c ? m = 0 : m -= c, t[d] = m;
  }
  function Wt(t, o) {
    t.HASH_ARRAY = o > 2, t.HASH_ARRAY ? (t.kNumHashDirectBytes = 0, t.kMinMatchCheck = 4, t.kFixHashSize = 66560) : (t.kNumHashDirectBytes = 2, t.kMinMatchCheck = 3, t.kFixHashSize = 0);
  }
  function yr(t, o) {
    var c, d, m, g, S, B, D, L, x, G, F, H, et, P, N, K, j;
    do {
      if (t._pos + t._matchMaxLen <= t._streamPos)
        H = t._matchMaxLen;
      else if (H = t._streamPos - t._pos, H < t.kMinMatchCheck) {
        Ct(t);
        continue;
      }
      for (et = t._pos > t._cyclicBufferSize ? t._pos - t._cyclicBufferSize : 0, d = t._bufferOffset + t._pos, t.HASH_ARRAY ? (j = It[t._bufferBase[d] & 255] ^ t._bufferBase[d + 1] & 255, B = j & 1023, t._hash[B] = t._pos, j ^= (t._bufferBase[d + 2] & 255) << 8, D = j & 65535, t._hash[1024 + D] = t._pos, L = (j ^ It[t._bufferBase[d + 3] & 255] << 5) & t._hashMask) : L = t._bufferBase[d] & 255 ^ (t._bufferBase[d + 1] & 255) << 8, m = t._hash[t.kFixHashSize + L], t._hash[t.kFixHashSize + L] = t._pos, N = (t._cyclicBufferPos << 1) + 1, K = t._cyclicBufferPos << 1, G = F = t.kNumHashDirectBytes, c = t._cutValue; ; ) {
        if (m <= et || c-- == 0) {
          t._son[N] = t._son[K] = 0;
          break;
        }
        if (S = t._pos - m, g = (S <= t._cyclicBufferPos ? t._cyclicBufferPos - S : t._cyclicBufferPos - S + t._cyclicBufferSize) << 1, P = t._bufferOffset + m, x = G < F ? G : F, t._bufferBase[P + x] == t._bufferBase[d + x]) {
          for (; ++x != H && t._bufferBase[P + x] == t._bufferBase[d + x]; )
            ;
          if (x == H) {
            t._son[K] = t._son[g], t._son[N] = t._son[g + 1];
            break;
          }
        }
        (t._bufferBase[P + x] & 255) < (t._bufferBase[d + x] & 255) ? (t._son[K] = m, K = g + 1, m = t._son[K], F = x) : (t._son[N] = m, N = g, m = t._son[N], G = x);
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
    oe(t.encoder, t.encoder.processedInSize, t.encoder.processedOutSize, t.encoder.finished), t.inBytesProcessed = t.encoder.processedInSize[0], t.encoder.finished[0] && (En(t.encoder), t.alive = 0);
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
      t._optimum[o].Prev1IsChar && (ns(t._optimum[m]), t._optimum[m].PosPrev = m - 1, t._optimum[o].Prev2 && (t._optimum[m - 1].Prev1IsChar = 0, t._optimum[m - 1].PosPrev = t._optimum[o].PosPrev2, t._optimum[m - 1].BackPrev = t._optimum[o].BackPrev2)), g = m, c = d, d = t._optimum[g].BackPrev, m = t._optimum[g].PosPrev, t._optimum[g].BackPrev = c, t._optimum[g].PosPrev = o, o = g;
    while (o > 0);
    return t.backRes = t._optimum[0].BackPrev, t._optimumCurrentIndex = t._optimum[0].PosPrev, t._optimumCurrentIndex;
  }
  function Nt(t) {
    t._state = 0, t._previousByte = 0;
    for (var o = 0; o < 4; ++o)
      t._repDistances[o] = 0;
  }
  function oe(t, o, c, d) {
    var m, g, S, B, D, L, x, G, F, H, et, P, N, K, j;
    if (o[0] = u, c[0] = u, d[0] = 1, t._inStream && (t._matchFinder._stream = t._inStream, wr(t._matchFinder), t._needReleaseMFStream = 1, t._inStream = null), !t._finished) {
      if (t._finished = 1, K = t.nowPos64, b(t.nowPos64, u)) {
        if (!Ht(t._matchFinder)) {
          O(t, T(t.nowPos64));
          return;
        }
        br(t), N = T(t.nowPos64) & t._posStateMask, Q(t._rangeEncoder, t._isMatch, (t._state << 4) + N, 0), t._state = lt(t._state), S = Y(t._matchFinder, -t._additionalOffset), ss(ue(t._literalEncoder, T(t.nowPos64), t._previousByte), t._rangeEncoder, S), t._previousByte = S, --t._additionalOffset, t.nowPos64 = f(t.nowPos64, h);
      }
      if (!Ht(t._matchFinder)) {
        O(t, T(t.nowPos64));
        return;
      }
      for (; ; ) {
        if (x = ce(t, T(t.nowPos64)), H = t.backRes, N = T(t.nowPos64) & t._posStateMask, g = (t._state << 4) + N, x == 1 && H == -1)
          Q(t._rangeEncoder, t._isMatch, g, 0), S = Y(t._matchFinder, -t._additionalOffset), j = ue(t._literalEncoder, T(t.nowPos64), t._previousByte), t._state < 7 ? ss(j, t._rangeEncoder, S) : (F = Y(t._matchFinder, -t._repDistances[0] - 1 - t._additionalOffset), Fn(j, t._rangeEncoder, F, S)), t._previousByte = S, t._state = lt(t._state);
        else {
          if (Q(t._rangeEncoder, t._isMatch, g, 1), H < 4) {
            if (Q(t._rangeEncoder, t._isRep, t._state, 1), H ? (Q(t._rangeEncoder, t._isRepG0, t._state, 1), H == 1 ? Q(t._rangeEncoder, t._isRepG1, t._state, 0) : (Q(t._rangeEncoder, t._isRepG1, t._state, 1), Q(t._rangeEncoder, t._isRepG2, t._state, H - 2))) : (Q(t._rangeEncoder, t._isRepG0, t._state, 0), x == 1 ? Q(t._rangeEncoder, t._isRep0Long, g, 0) : Q(t._rangeEncoder, t._isRep0Long, g, 1)), x == 1 ? t._state = t._state < 7 ? 9 : 11 : (Tr(t._repMatchLenEncoder, t._rangeEncoder, x - 2, N), t._state = t._state < 7 ? 8 : 11), B = t._repDistances[H], H != 0) {
              for (L = H; L >= 1; --L)
                t._repDistances[L] = t._repDistances[L - 1];
              t._repDistances[0] = B;
            }
          } else {
            for (Q(t._rangeEncoder, t._isRep, t._state, 0), t._state = t._state < 7 ? 7 : 10, Tr(t._lenEncoder, t._rangeEncoder, x - 2, N), H -= 4, P = kr(H), G = Qt(x), Re(t._posSlotEncoder[G], t._rangeEncoder, P), P >= 4 && (D = (P >> 1) - 1, m = (2 | P & 1) << D, et = H - m, P < 14 ? jn(t._posEncoders, m - P - 1, t._rangeEncoder, D, et) : (as(t._rangeEncoder, et >> 4, D - 4), is(t._posAlignEncoder, t._rangeEncoder, et & 15), ++t._alignPriceCount)), B = H, L = 3; L >= 1; --L)
              t._repDistances[L] = t._repDistances[L - 1];
            t._repDistances[0] = B, ++t._matchPriceCount;
          }
          t._previousByte = Y(t._matchFinder, x - 1 - t._additionalOffset);
        }
        if (t._additionalOffset -= x, t.nowPos64 = f(t.nowPos64, k(x)), !t._additionalOffset) {
          if (t._matchPriceCount >= 128 && W(t), t._alignPriceCount >= 16 && A(t), o[0] = t.nowPos64, c[0] = qn(t._rangeEncoder), !Ht(t._matchFinder)) {
            O(t, T(t.nowPos64));
            return;
          }
          if (l(J(t.nowPos64, K), [4096, 0]) >= 0) {
            t._finished = 0, d[0] = 0;
            return;
          }
        }
      }
    }
  }
  function z(t) {
    var o, c;
    t._matchFinder || (o = {}, c = 4, t._matchFinderType || (c = 2), Wt(o, c), t._matchFinder = o), On(t._literalEncoder, t._numLiteralPosStateBits, t._numLiteralContextBits), !(t._dictionarySize == t._dictionarySizePrev && t._numFastBytesPrev == t._numFastBytes) && (Ee(t._matchFinder, t._dictionarySize, 4096, t._numFastBytes, 274), t._dictionarySizePrev = t._dictionarySize, t._numFastBytesPrev = t._numFastBytes);
  }
  function q(t) {
    var o;
    for (t._repDistances = p(4), t._optimum = [], t._rangeEncoder = {}, t._isMatch = p(192), t._isRep = p(12), t._isRepG0 = p(12), t._isRepG1 = p(12), t._isRepG2 = p(12), t._isRep0Long = p(192), t._posSlotEncoder = [], t._posEncoders = p(114), t._posAlignEncoder = Me({}, 4), t._lenEncoder = es({}), t._repMatchLenEncoder = es({}), t._literalEncoder = {}, t._matchDistances = [], t._posSlotPrices = [], t._distancesPrices = [], t._alignPrices = p(16), t.reps = p(4), t.repLens = p(4), t.processedInSize = [u], t.processedOutSize = [u], t.finished = [0], t.properties = p(5), t.tempPrices = p(128), t._longestMatchLength = 0, t._matchFinderType = 1, t._numDistancePairs = 0, t._numFastBytesPrev = -1, t.backRes = 0, o = 0; o < 4096; ++o)
      t._optimum[o] = {};
    for (o = 0; o < 4; ++o)
      t._posSlotEncoder[o] = Me({}, 6);
    return t;
  }
  function A(t) {
    for (var o = 0; o < 16; ++o)
      t._alignPrices[o] = Nn(t._posAlignEncoder, o);
    t._alignPriceCount = 0;
  }
  function W(t) {
    var o, c, d, m, g, S, B, D;
    for (m = 4; m < 128; ++m)
      S = kr(m), d = (S >> 1) - 1, o = (2 | S & 1) << d, t.tempPrices[m] = Un(t._posEncoders, o - S - 1, d, m - o);
    for (g = 0; g < 4; ++g) {
      for (c = t._posSlotEncoder[g], B = g << 6, S = 0; S < t._distTableSize; ++S)
        t._posSlotPrices[B + S] = Ye(c, S);
      for (S = 14; S < t._distTableSize; ++S)
        t._posSlotPrices[B + S] += (S >> 1) - 1 - 4 << 6;
      for (D = g * 128, m = 0; m < 4; ++m)
        t._distancesPrices[D + m] = t._posSlotPrices[B + m];
      for (; m < 128; ++m)
        t._distancesPrices[D + m] = t._posSlotPrices[B + kr(m)] + t.tempPrices[m];
    }
    t._matchPriceCount = 0;
  }
  function O(t, o) {
    Zr(t), Mn(t, o & t._posStateMask);
    for (var c = 0; c < 5; ++c)
      Sr(t._rangeEncoder);
  }
  function ce(t, o) {
    var c, d, m, g, S, B, D, L, x, G, F, H, et, P, N, K, j, _t, st, wt, St, pt, he, tr, yt, Pt, Lt, ut, Rt, Z, E, jt, Kt, nt, it, hs, bt, Ae, Zt, Dt, le, Oe, U, rt, pe, ls, ps, ds, ms, fs;
    if (t._optimumEndIndex != t._optimumCurrentIndex)
      return et = t._optimum[t._optimumCurrentIndex].PosPrev - t._optimumCurrentIndex, t.backRes = t._optimum[t._optimumCurrentIndex].BackPrev, t._optimumCurrentIndex = t._optimum[t._optimumCurrentIndex].PosPrev, et;
    if (t._optimumCurrentIndex = t._optimumEndIndex = 0, t._longestMatchWasFound ? (H = t._longestMatchLength, t._longestMatchWasFound = 0) : H = br(t), Lt = t._numDistancePairs, yt = Ht(t._matchFinder) + 1, yt < 2)
      return t.backRes = -1, 1;
    for (yt > 273 && (yt = 273), Dt = 0, x = 0; x < 4; ++x)
      t.reps[x] = t._repDistances[x], t.repLens[x] = Tt(t._matchFinder, -1, t.reps[x], 273), t.repLens[x] > t.repLens[Dt] && (Dt = x);
    if (t.repLens[Dt] >= t._numFastBytes)
      return t.backRes = Dt, et = t.repLens[Dt], Ce(t, et - 1), et;
    if (H >= t._numFastBytes)
      return t.backRes = t._matchDistances[Lt - 1] + 4, Ce(t, H - 1), H;
    if (D = Y(t._matchFinder, -1), j = Y(t._matchFinder, -t._repDistances[0] - 1 - 1), H < 2 && D != j && t.repLens[Dt] < 2)
      return t.backRes = -1, 1;
    if (t._optimum[0].State = t._state, nt = o & t._posStateMask, t._optimum[1].Price = $[t._isMatch[(t._state << 4) + nt] >>> 2] + Ze(ue(t._literalEncoder, o, t._previousByte), t._state >= 7, j, D), ns(t._optimum[1]), _t = $[2048 - t._isMatch[(t._state << 4) + nt] >>> 2], Zt = _t + $[2048 - t._isRep[t._state] >>> 2], j == D && (le = Zt + vt(t, t._state, nt), le < t._optimum[1].Price && (t._optimum[1].Price = le, In(t._optimum[1]))), F = H >= t.repLens[Dt] ? H : t.repLens[Dt], F < 2)
      return t.backRes = t._optimum[1].BackPrev, 1;
    t._optimum[1].PosPrev = 0, t._optimum[0].Backs0 = t.reps[0], t._optimum[0].Backs1 = t.reps[1], t._optimum[0].Backs2 = t.reps[2], t._optimum[0].Backs3 = t.reps[3], G = F;
    do
      t._optimum[G--].Price = 268435455;
    while (G >= 2);
    for (x = 0; x < 4; ++x)
      if (Ae = t.repLens[x], !(Ae < 2)) {
        hs = Zt + dt(t, x, t._state, nt);
        do
          g = hs + Vt(t._repMatchLenEncoder, Ae - 2, nt), E = t._optimum[Ae], g < E.Price && (E.Price = g, E.PosPrev = 0, E.BackPrev = x, E.Prev1IsChar = 0);
        while (--Ae >= 2);
      }
    if (tr = _t + $[t._isRep[t._state] >>> 2], G = t.repLens[0] >= 2 ? t.repLens[0] + 1 : 2, G <= H) {
      for (ut = 0; G > t._matchDistances[ut]; )
        ut += 2;
      for (; L = t._matchDistances[ut + 1], g = tr + X(t, L, G, nt), E = t._optimum[G], g < E.Price && (E.Price = g, E.PosPrev = 0, E.BackPrev = L + 4, E.Prev1IsChar = 0), !(G == t._matchDistances[ut] && (ut += 2, ut == Lt)); ++G)
        ;
    }
    for (c = 0; ; ) {
      if (++c, c == F)
        return ot(t, c);
      if (st = br(t), Lt = t._numDistancePairs, st >= t._numFastBytes)
        return t._longestMatchLength = st, t._longestMatchWasFound = 1, ot(t, c);
      if (++o, Kt = t._optimum[c].PosPrev, t._optimum[c].Prev1IsChar ? (--Kt, t._optimum[c].Prev2 ? (U = t._optimum[t._optimum[c].PosPrev2].State, t._optimum[c].BackPrev2 < 4 ? U = U < 7 ? 8 : 11 : U = U < 7 ? 7 : 10) : U = t._optimum[Kt].State, U = lt(U)) : U = t._optimum[Kt].State, Kt == c - 1 ? t._optimum[c].BackPrev ? U = lt(U) : U = U < 7 ? 9 : 11 : (t._optimum[c].Prev1IsChar && t._optimum[c].Prev2 ? (Kt = t._optimum[c].PosPrev2, jt = t._optimum[c].BackPrev2, U = U < 7 ? 8 : 11) : (jt = t._optimum[c].BackPrev, jt < 4 ? U = U < 7 ? 8 : 11 : U = U < 7 ? 7 : 10), Z = t._optimum[Kt], jt < 4 ? jt ? jt == 1 ? (t.reps[0] = Z.Backs1, t.reps[1] = Z.Backs0, t.reps[2] = Z.Backs2, t.reps[3] = Z.Backs3) : jt == 2 ? (t.reps[0] = Z.Backs2, t.reps[1] = Z.Backs0, t.reps[2] = Z.Backs1, t.reps[3] = Z.Backs3) : (t.reps[0] = Z.Backs3, t.reps[1] = Z.Backs0, t.reps[2] = Z.Backs1, t.reps[3] = Z.Backs2) : (t.reps[0] = Z.Backs0, t.reps[1] = Z.Backs1, t.reps[2] = Z.Backs2, t.reps[3] = Z.Backs3) : (t.reps[0] = jt - 4, t.reps[1] = Z.Backs0, t.reps[2] = Z.Backs1, t.reps[3] = Z.Backs2)), t._optimum[c].State = U, t._optimum[c].Backs0 = t.reps[0], t._optimum[c].Backs1 = t.reps[1], t._optimum[c].Backs2 = t.reps[2], t._optimum[c].Backs3 = t.reps[3], B = t._optimum[c].Price, D = Y(t._matchFinder, -1), j = Y(t._matchFinder, -t.reps[0] - 1 - 1), nt = o & t._posStateMask, d = B + $[t._isMatch[(U << 4) + nt] >>> 2] + Ze(ue(t._literalEncoder, o, Y(t._matchFinder, -2)), U >= 7, j, D), pt = t._optimum[c + 1], wt = 0, d < pt.Price && (pt.Price = d, pt.PosPrev = c, pt.BackPrev = -1, pt.Prev1IsChar = 0, wt = 1), _t = B + $[2048 - t._isMatch[(U << 4) + nt] >>> 2], Zt = _t + $[2048 - t._isRep[U] >>> 2], j == D && !(pt.PosPrev < c && !pt.BackPrev) && (le = Zt + ($[t._isRepG0[U] >>> 2] + $[t._isRep0Long[(U << 4) + nt] >>> 2]), le <= pt.Price && (pt.Price = le, pt.PosPrev = c, pt.BackPrev = 0, pt.Prev1IsChar = 0, wt = 1)), Pt = Ht(t._matchFinder) + 1, Pt = 4095 - c < Pt ? 4095 - c : Pt, yt = Pt, !(yt < 2)) {
        if (yt > t._numFastBytes && (yt = t._numFastBytes), !wt && j != D && (pe = Math.min(Pt - 1, t._numFastBytes), N = Tt(t._matchFinder, 0, t.reps[0], pe), N >= 2)) {
          for (rt = lt(U), it = o + 1 & t._posStateMask, he = d + $[2048 - t._isMatch[(rt << 4) + it] >>> 2] + $[2048 - t._isRep[rt] >>> 2], Rt = c + 1 + N; F < Rt; )
            t._optimum[++F].Price = 268435455;
          g = he + (ls = Vt(t._repMatchLenEncoder, N - 2, it), ls + dt(t, 0, rt, it)), E = t._optimum[Rt], g < E.Price && (E.Price = g, E.PosPrev = c + 1, E.BackPrev = 0, E.Prev1IsChar = 1, E.Prev2 = 0);
        }
        for (Oe = 2, bt = 0; bt < 4; ++bt)
          if (P = Tt(t._matchFinder, -1, t.reps[bt], yt), !(P < 2)) {
            K = P;
            do {
              for (; F < c + P; )
                t._optimum[++F].Price = 268435455;
              g = Zt + (ps = Vt(t._repMatchLenEncoder, P - 2, nt), ps + dt(t, bt, U, nt)), E = t._optimum[c + P], g < E.Price && (E.Price = g, E.PosPrev = c, E.BackPrev = bt, E.Prev1IsChar = 0);
            } while (--P >= 2);
            if (P = K, bt || (Oe = P + 1), P < Pt && (pe = Math.min(Pt - 1 - P, t._numFastBytes), N = Tt(t._matchFinder, P, t.reps[bt], pe), N >= 2)) {
              for (rt = U < 7 ? 8 : 11, it = o + P & t._posStateMask, m = Zt + (ds = Vt(t._repMatchLenEncoder, P - 2, nt), ds + dt(t, bt, U, nt)) + $[t._isMatch[(rt << 4) + it] >>> 2] + Ze(ue(t._literalEncoder, o + P, Y(t._matchFinder, P - 1 - 1)), 1, Y(t._matchFinder, P - 1 - (t.reps[bt] + 1)), Y(t._matchFinder, P - 1)), rt = lt(rt), it = o + P + 1 & t._posStateMask, St = m + $[2048 - t._isMatch[(rt << 4) + it] >>> 2], he = St + $[2048 - t._isRep[rt] >>> 2], Rt = P + 1 + N; F < c + Rt; )
                t._optimum[++F].Price = 268435455;
              g = he + (ms = Vt(t._repMatchLenEncoder, N - 2, it), ms + dt(t, 0, rt, it)), E = t._optimum[c + Rt], g < E.Price && (E.Price = g, E.PosPrev = c + P + 1, E.BackPrev = 0, E.Prev1IsChar = 1, E.Prev2 = 1, E.PosPrev2 = c, E.BackPrev2 = bt);
            }
          }
        if (st > yt) {
          for (st = yt, Lt = 0; st > t._matchDistances[Lt]; Lt += 2)
            ;
          t._matchDistances[Lt] = st, Lt += 2;
        }
        if (st >= Oe) {
          for (tr = _t + $[t._isRep[U] >>> 2]; F < c + st; )
            t._optimum[++F].Price = 268435455;
          for (ut = 0; Oe > t._matchDistances[ut]; )
            ut += 2;
          for (P = Oe; ; ++P)
            if (S = t._matchDistances[ut + 1], g = tr + X(t, S, P, nt), E = t._optimum[c + P], g < E.Price && (E.Price = g, E.PosPrev = c, E.BackPrev = S + 4, E.Prev1IsChar = 0), P == t._matchDistances[ut]) {
              if (P < Pt && (pe = Math.min(Pt - 1 - P, t._numFastBytes), N = Tt(t._matchFinder, P, S, pe), N >= 2)) {
                for (rt = U < 7 ? 7 : 10, it = o + P & t._posStateMask, m = g + $[t._isMatch[(rt << 4) + it] >>> 2] + Ze(ue(t._literalEncoder, o + P, Y(t._matchFinder, P - 1 - 1)), 1, Y(t._matchFinder, P - (S + 1) - 1), Y(t._matchFinder, P - 1)), rt = lt(rt), it = o + P + 1 & t._posStateMask, St = m + $[2048 - t._isMatch[(rt << 4) + it] >>> 2], he = St + $[2048 - t._isRep[rt] >>> 2], Rt = P + 1 + N; F < c + Rt; )
                  t._optimum[++F].Price = 268435455;
                g = he + (fs = Vt(t._repMatchLenEncoder, N - 2, it), fs + dt(t, 0, rt, it)), E = t._optimum[c + Rt], g < E.Price && (E.Price = g, E.PosPrev = c + P + 1, E.BackPrev = 0, E.Prev1IsChar = 1, E.Prev2 = 1, E.PosPrev2 = c, E.BackPrev2 = S + 4);
              }
              if (ut += 2, ut == Lt)
                break;
            }
        }
      }
    }
  }
  function X(t, o, c, d) {
    var m, g = Qt(c);
    return o < 128 ? m = t._distancesPrices[g * 128 + o] : m = t._posSlotPrices[(g << 6) + Rn(o)] + t._alignPrices[o & 15], m + Vt(t._lenEncoder, c - 2, d);
  }
  function dt(t, o, c, d) {
    var m;
    return o ? (m = $[2048 - t._isRepG0[c] >>> 2], o == 1 ? m += $[t._isRepG1[c] >>> 2] : (m += $[2048 - t._isRepG1[c] >>> 2], m += De(t._isRepG2[c], o - 2))) : (m = $[t._isRepG0[c] >>> 2], m += $[2048 - t._isRep0Long[(c << 4) + d] >>> 2]), m;
  }
  function vt(t, o, c) {
    return $[t._isRepG0[o] >>> 2] + $[t._isRep0Long[(o << 4) + c] >>> 2];
  }
  function Ke(t) {
    Nt(t), $n(t._rangeEncoder), ct(t._isMatch), ct(t._isRep0Long), ct(t._isRep), ct(t._isRepG0), ct(t._isRepG1), ct(t._isRepG2), ct(t._posEncoders), zn(t._literalEncoder);
    for (var o = 0; o < 4; ++o)
      ct(t._posSlotEncoder[o].Models);
    Yr(t._lenEncoder, 1 << t._posStateBits), Yr(t._repMatchLenEncoder, 1 << t._posStateBits), ct(t._posAlignEncoder.Models), t._longestMatchWasFound = 0, t._optimumEndIndex = 0, t._optimumCurrentIndex = 0, t._additionalOffset = 0;
  }
  function Ce(t, o) {
    o > 0 && (yr(t._matchFinder, o), t._additionalOffset += o);
  }
  function br(t) {
    var o = 0;
    return t._numDistancePairs = We(t._matchFinder, t._matchDistances), t._numDistancePairs > 0 && (o = t._matchDistances[t._numDistancePairs - 2], o == t._numFastBytes && (o += Tt(t._matchFinder, o - 1, t._matchDistances[t._numDistancePairs - 1], 273 - o))), ++t._additionalOffset, o;
  }
  function Zr(t) {
    t._matchFinder && t._needReleaseMFStream && (t._matchFinder._stream = null, t._needReleaseMFStream = 0);
  }
  function En(t) {
    Zr(t), t._rangeEncoder.Stream = null;
  }
  function xn(t, o) {
    t._dictionarySize = o;
    for (var c = 0; o > 1 << c; ++c)
      ;
    t._distTableSize = c * 2;
  }
  function Bn(t, o) {
    var c = t._matchFinderType;
    t._matchFinderType = o, t._matchFinder && c != t._matchFinderType && (t._dictionarySizePrev = -1, t._matchFinder = null);
  }
  function Cn(t, o) {
    t.properties[0] = (t._posStateBits * 5 + t._numLiteralPosStateBits) * 9 + t._numLiteralContextBits << 24 >> 24;
    for (var c = 0; c < 4; ++c)
      t.properties[1 + c] = t._dictionarySize >> 8 * c << 24 >> 24;
    Xe(o, t.properties, 0, 5);
  }
  function Mn(t, o) {
    if (t._writeEndMark) {
      Q(t._rangeEncoder, t._isMatch, (t._state << 4) + o, 1), Q(t._rangeEncoder, t._isRep, t._state, 0), t._state = t._state < 7 ? 7 : 10, Tr(t._lenEncoder, t._rangeEncoder, 0, o);
      var c = Qt(2);
      Re(t._posSlotEncoder[c], t._rangeEncoder, 63), as(t._rangeEncoder, 67108863, 26), is(t._posAlignEncoder, t._rangeEncoder, 15);
    }
  }
  function kr(t) {
    return t < 2048 ? Mt[t] : t < 2097152 ? Mt[t >> 10] + 20 : Mt[t >> 20] + 40;
  }
  function Rn(t) {
    return t < 131072 ? Mt[t >> 6] + 12 : t < 134217728 ? Mt[t >> 16] + 32 : Mt[t >> 26] + 52;
  }
  function Dn(t, o, c, d) {
    c < 8 ? (Q(o, t._choice, 0, 0), Re(t._lowCoder[d], o, c)) : (c -= 8, Q(o, t._choice, 0, 1), c < 8 ? (Q(o, t._choice, 1, 0), Re(t._midCoder[d], o, c)) : (Q(o, t._choice, 1, 1), Re(t._highCoder, o, c - 8)));
  }
  function An(t) {
    t._choice = p(2), t._lowCoder = p(16), t._midCoder = p(16), t._highCoder = Me({}, 8);
    for (var o = 0; o < 16; ++o)
      t._lowCoder[o] = Me({}, 3), t._midCoder[o] = Me({}, 3);
    return t;
  }
  function Yr(t, o) {
    ct(t._choice);
    for (var c = 0; c < o; ++c)
      ct(t._lowCoder[c].Models), ct(t._midCoder[c].Models);
    ct(t._highCoder.Models);
  }
  function ts(t, o, c, d, m) {
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
  function Tr(t, o, c, d) {
    Dn(t, o, c, d), --t._counters[d] == 0 && (ts(t, d, t._tableSize, t._prices, d * 272), t._counters[d] = t._tableSize);
  }
  function es(t) {
    return An(t), t._prices = [], t._counters = [], t;
  }
  function Vt(t, o, c) {
    return t._prices[c * 272 + o];
  }
  function rs(t, o) {
    for (var c = 0; c < o; ++c)
      ts(t, c, t._tableSize, t._prices, c * 272), t._counters[c] = t._tableSize;
  }
  function On(t, o, c) {
    var d, m;
    if (!(t.m_Coders != null && t.m_NumPrevBits == c && t.m_NumPosBits == o))
      for (t.m_NumPosBits = o, t.m_PosMask = (1 << o) - 1, t.m_NumPrevBits = c, m = 1 << t.m_NumPrevBits + t.m_NumPosBits, t.m_Coders = p(m), d = 0; d < m; ++d)
        t.m_Coders[d] = Hn({});
  }
  function ue(t, o, c) {
    return t.m_Coders[((o & t.m_PosMask) << t.m_NumPrevBits) + ((c & 255) >>> 8 - t.m_NumPrevBits)];
  }
  function zn(t) {
    var o, c = 1 << t.m_NumPrevBits + t.m_NumPosBits;
    for (o = 0; o < c; ++o)
      ct(t.m_Coders[o].m_Encoders);
  }
  function ss(t, o, c) {
    var d, m, g = 1;
    for (m = 7; m >= 0; --m)
      d = c >> m & 1, Q(o, t.m_Encoders, g, d), g = g << 1 | d;
  }
  function Fn(t, o, c, d) {
    var m, g, S, B, D = 1, L = 1;
    for (g = 7; g >= 0; --g)
      m = d >> g & 1, B = L, D && (S = c >> g & 1, B += 1 + S << 8, D = S == m), Q(o, t.m_Encoders, B, m), L = L << 1 | m;
  }
  function Hn(t) {
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
  function ns(t) {
    t.BackPrev = -1, t.Prev1IsChar = 0;
  }
  function In(t) {
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
  function is(t, o, c) {
    var d, m, g = 1;
    for (m = 0; m < t.NumBitLevels; ++m)
      d = c & 1, Q(o, t.Models, g, d), g = g << 1 | d, c >>= 1;
  }
  function Nn(t, o) {
    var c, d, m = 1, g = 0;
    for (d = t.NumBitLevels; d != 0; --d)
      c = o & 1, o >>>= 1, g += De(t.Models[m], c), m = m << 1 | c;
    return g;
  }
  function jn(t, o, c, d, m) {
    var g, S, B = 1;
    for (S = 0; S < d; ++S)
      g = m & 1, Q(c, t, o + B, g), B = B << 1 | g, m >>= 1;
  }
  function Un(t, o, c, d) {
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
    m = (t.Range >>> 11) * g, d ? (t.Low = f(t.Low, w(k(m), [4294967295, 0])), t.Range -= m, o[c] = g - (g >>> 5) << 16 >> 16) : (t.Range = m, o[c] = g + (2048 - g >>> 5) << 16 >> 16), t.Range & -16777216 || (t.Range <<= 8, Sr(t));
  }
  function as(t, o, c) {
    for (var d = c - 1; d >= 0; --d)
      t.Range >>>= 1, (o >>> d & 1) == 1 && (t.Low = f(t.Low, k(t.Range))), t.Range & -16777216 || (t.Range <<= 8, Sr(t));
  }
  function qn(t) {
    return f(f(k(t._cacheSize), t._position), [4, 0]);
  }
  function $n(t) {
    t._position = u, t.Low = u, t.Range = -1, t._cacheSize = 1, t._cache = 0;
  }
  function Sr(t) {
    var o, c = T(V(t.Low, 32));
    if (c != 0 || l(t.Low, [4278190080, 0]) < 0) {
      t._position = f(t._position, k(t._cacheSize)), o = t._cache;
      do
        Se(t.Stream, o + c), o = 255;
      while (--t._cacheSize != 0);
      t._cache = T(t.Low) >>> 24;
    }
    ++t._cacheSize, t.Low = M(w(t.Low, [16777215, 0]), 8);
  }
  function De(t, o) {
    return $[((t - o ^ -o) & 2047) >>> 2];
  }
  function os(t) {
    var o, c = [], d, m = 0, g, S = t.length;
    if (typeof t == "object")
      return t;
    for (Ft(t, 0, S, c, 0), g = 0; g < S; ++g)
      o = c[g], o >= 1 && o <= 127 ? ++m : !o || o >= 128 && o <= 2047 ? m += 2 : m += 3;
    for (d = [], m = 0, g = 0; g < S; ++g)
      o = c[g], o >= 1 && o <= 127 ? d[m++] = o << 24 >> 24 : !o || o >= 128 && o <= 2047 ? (d[m++] = (192 | o >> 6 & 31) << 24 >> 24, d[m++] = (128 | o & 63) << 24 >> 24) : (d[m++] = (224 | o >> 12 & 15) << 24 >> 24, d[m++] = (128 | o >> 6 & 63) << 24 >> 24, d[m++] = (128 | o & 63) << 24 >> 24);
    return d;
  }
  function cs(t) {
    return t[1] + t[0];
  }
  function Jn(t, o, c, d) {
    var m = {}, g, S, B = typeof c > "u" && typeof d > "u";
    if (typeof c != "function" && (S = c, c = d = 0), d = d || function(L) {
      if (!(typeof S > "u"))
        return _(L, S);
    }, c = c || function(L, x) {
      if (!(typeof S > "u"))
        return postMessage({
          action: r,
          cbn: S,
          result: L,
          error: x
        });
    }, B) {
      for (m.c = Xt({}, os(t), us(o)); Qe(m.c.chunker); )
        ;
      return ne(m.c.output);
    }
    try {
      m.c = Xt({}, os(t), us(o)), d(0);
    } catch (L) {
      return c(null, L);
    }
    function D() {
      try {
        for (var L, x = new Date().getTime(); Qe(m.c.chunker); )
          if (g = cs(m.c.chunker.inBytesProcessed) / cs(m.c.length_0), new Date().getTime() - x > 200)
            return d(g), s(D, 0), 0;
        d(1), L = ne(m.c.output), s(c.bind(null, L), 0);
      } catch (G) {
        c(null, G);
      }
    }
    s(D, 0);
  }
  var us = function() {
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
      t && t.data && t.data.action == r && Fr.compress(t.data.data, t.data.mode, t.data.cbn);
    };
  }(), {
    compress: Jn
  };
}();
const bi = async (r) => await Ti(r);
let er = null;
const ki = async (r) => (r = r || '"./lzma_worker-min.js"', er || (await bi(r) ? er = yi(r) : (console.error("lzma\u65E0\u6CD5\u627E\u5230" + r + ": \u65E0\u6CD5\u542F\u52A8worker\u6A21\u5F0F\uFF0C\u5C06\u542F\u7528\u6D4F\u89C8\u5668\u8BA1\u7B97\u6A21\u5F0F\uFF0C\u6027\u80FD\u53D7\u5F71\u54CD"), er = Fr), er)), Ti = (r) => new Promise((e, s) => {
  const n = new XMLHttpRequest();
  n.open("get", r, !0), n.addEventListener("error", (i) => {
    e(!1);
  }), n.addEventListener("load", (i) => {
    n.status === 200 && e(!0), e(!1);
  }), n.send();
}), Si = new ui(5);
let tn = "";
const Pi = (r) => {
  tn = r;
};
let ys = null;
const en = (r) => {
  const e = typeof r == "string" ? r : JSON.stringify(r);
  let s = location.pathname;
  s = s.replace(/[^\/\/.]+\.(html|html)$/, "").replace("//", "/");
  const n = tn || location.origin + s + "static/lzma_worker.js";
  return console.log("lzma_worker", n), new Promise(async (i) => {
    let a = Date.now();
    window.requestIdleCallback(async () => {
      ys = await ki(n), ys.compress(e, 5, (u, h) => {
        if (!u)
          throw Error("static/lzma_worker.js \u65E0\u6CD5\u52A0\u8F7D\uFF0C\u8BF7\u68C0\u67E5\u8BE5\u6587\u4EF6");
        console.log("compress finish", Date.now() - a);
        const _ = [...u], p = new Int8Array(_.length);
        for (let f = 0; f < _.length; f++)
          p[f] = _[f];
        console.log("compress success", Date.now() - a), i(p);
      });
    });
  });
}, ar = async (r, e, s) => new Promise((n, i) => {
  const a = new XMLHttpRequest();
  a.open("POST", r, !0), s ? (a.setRequestHeader("xw-body-encoding", "v1"), Si.addTask(() => new Promise((u, h) => {
    en(e).then((_) => {
      a.send(_.buffer);
    }).finally(() => {
      u();
    });
  }))) : a.send(JSON.stringify(e)), a.onreadystatechange = () => {
  }, a.addEventListener("readystatechange", (u) => {
    a.readyState === 4 && a.status === 200 ? n(void 0) : a.status === 500 && i(a.statusText);
  }), a.addEventListener("error", (u) => {
    console.error("\u957F\u5EA6", JSON.stringify(e).length), i(u);
  });
}), Li = (r, e, s) => {
  window.navigator.sendBeacon !== void 0 ? s ? en(e).then((n) => {
    window.navigator.sendBeacon(r, n.buffer);
  }) : window.navigator.sendBeacon(r, JSON.stringify(e)) : ar(r, e, s);
};
class Ei {
  constructor() {
    y(this, "logs", []);
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
async function xi(r) {
  const e = new Ei();
  return await e.init(), e;
}
var Bi = typeof global == "object" && global && global.Object === Object && global;
const Ci = Bi;
var Mi = typeof self == "object" && self && self.Object === Object && self, Ri = Ci || Mi || Function("return this")();
const hr = Ri;
var Di = hr.Symbol;
const $t = Di;
var rn = Object.prototype, Ai = rn.hasOwnProperty, Oi = rn.toString, ze = $t ? $t.toStringTag : void 0;
function zi(r) {
  var e = Ai.call(r, ze), s = r[ze];
  try {
    r[ze] = void 0;
    var n = !0;
  } catch {
  }
  var i = Oi.call(r);
  return n && (e ? r[ze] = s : delete r[ze]), i;
}
var Fi = Object.prototype, Hi = Fi.toString;
function Ii(r) {
  return Hi.call(r);
}
var Ni = "[object Null]", ji = "[object Undefined]", bs = $t ? $t.toStringTag : void 0;
function Jr(r) {
  return r == null ? r === void 0 ? ji : Ni : bs && bs in Object(r) ? zi(r) : Ii(r);
}
function Xr(r) {
  return r != null && typeof r == "object";
}
var Ui = "[object Symbol]";
function lr(r) {
  return typeof r == "symbol" || Xr(r) && Jr(r) == Ui;
}
function qi(r, e) {
  for (var s = -1, n = r == null ? 0 : r.length, i = Array(n); ++s < n; )
    i[s] = e(r[s], s, r);
  return i;
}
var $i = Array.isArray;
const pr = $i;
var Ji = 1 / 0, ks = $t ? $t.prototype : void 0, Ts = ks ? ks.toString : void 0;
function sn(r) {
  if (typeof r == "string")
    return r;
  if (pr(r))
    return qi(r, sn) + "";
  if (lr(r))
    return Ts ? Ts.call(r) : "";
  var e = r + "";
  return e == "0" && 1 / r == -Ji ? "-0" : e;
}
var Xi = /\s/;
function Gi(r) {
  for (var e = r.length; e-- && Xi.test(r.charAt(e)); )
    ;
  return e;
}
var Wi = /^\s+/;
function Qi(r) {
  return r && r.slice(0, Gi(r) + 1).replace(Wi, "");
}
function Ue(r) {
  var e = typeof r;
  return r != null && (e == "object" || e == "function");
}
var Ss = 0 / 0, Vi = /^[-+]0x[0-9a-f]+$/i, Ki = /^0b[01]+$/i, Zi = /^0o[0-7]+$/i, Yi = parseInt;
function Ps(r) {
  if (typeof r == "number")
    return r;
  if (lr(r))
    return Ss;
  if (Ue(r)) {
    var e = typeof r.valueOf == "function" ? r.valueOf() : r;
    r = Ue(e) ? e + "" : e;
  }
  if (typeof r != "string")
    return r === 0 ? r : +r;
  r = Qi(r);
  var s = Ki.test(r);
  return s || Zi.test(r) ? Yi(r.slice(2), s ? 2 : 8) : Vi.test(r) ? Ss : +r;
}
var ta = "[object AsyncFunction]", ea = "[object Function]", ra = "[object GeneratorFunction]", sa = "[object Proxy]";
function na(r) {
  if (!Ue(r))
    return !1;
  var e = Jr(r);
  return e == ea || e == ra || e == ta || e == sa;
}
var ia = hr["__core-js_shared__"];
const Lr = ia;
var Ls = function() {
  var r = /[^.]+$/.exec(Lr && Lr.keys && Lr.keys.IE_PROTO || "");
  return r ? "Symbol(src)_1." + r : "";
}();
function aa(r) {
  return !!Ls && Ls in r;
}
var oa = Function.prototype, ca = oa.toString;
function ua(r) {
  if (r != null) {
    try {
      return ca.call(r);
    } catch {
    }
    try {
      return r + "";
    } catch {
    }
  }
  return "";
}
var ha = /[\\^$.*+?()[\]{}|]/g, la = /^\[object .+?Constructor\]$/, pa = Function.prototype, da = Object.prototype, ma = pa.toString, fa = da.hasOwnProperty, ga = RegExp(
  "^" + ma.call(fa).replace(ha, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function va(r) {
  if (!Ue(r) || aa(r))
    return !1;
  var e = na(r) ? ga : la;
  return e.test(ua(r));
}
function _a(r, e) {
  return r == null ? void 0 : r[e];
}
function nn(r, e) {
  var s = _a(r, e);
  return va(s) ? s : void 0;
}
function wa(r, e) {
  return r === e || r !== r && e !== e;
}
var ya = "[object Arguments]";
function Es(r) {
  return Xr(r) && Jr(r) == ya;
}
var an = Object.prototype, ba = an.hasOwnProperty, ka = an.propertyIsEnumerable, Ta = Es(function() {
  return arguments;
}()) ? Es : function(r) {
  return Xr(r) && ba.call(r, "callee") && !ka.call(r, "callee");
};
const Sa = Ta;
var Pa = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, La = /^\w*$/;
function Ea(r, e) {
  if (pr(r))
    return !1;
  var s = typeof r;
  return s == "number" || s == "symbol" || s == "boolean" || r == null || lr(r) ? !0 : La.test(r) || !Pa.test(r) || e != null && r in Object(e);
}
var xa = nn(Object, "create");
const qe = xa;
function Ba() {
  this.__data__ = qe ? qe(null) : {}, this.size = 0;
}
function Ca(r) {
  var e = this.has(r) && delete this.__data__[r];
  return this.size -= e ? 1 : 0, e;
}
var Ma = "__lodash_hash_undefined__", Ra = Object.prototype, Da = Ra.hasOwnProperty;
function Aa(r) {
  var e = this.__data__;
  if (qe) {
    var s = e[r];
    return s === Ma ? void 0 : s;
  }
  return Da.call(e, r) ? e[r] : void 0;
}
var Oa = Object.prototype, za = Oa.hasOwnProperty;
function Fa(r) {
  var e = this.__data__;
  return qe ? e[r] !== void 0 : za.call(e, r);
}
var Ha = "__lodash_hash_undefined__";
function Ia(r, e) {
  var s = this.__data__;
  return this.size += this.has(r) ? 0 : 1, s[r] = qe && e === void 0 ? Ha : e, this;
}
function ee(r) {
  var e = -1, s = r == null ? 0 : r.length;
  for (this.clear(); ++e < s; ) {
    var n = r[e];
    this.set(n[0], n[1]);
  }
}
ee.prototype.clear = Ba;
ee.prototype.delete = Ca;
ee.prototype.get = Aa;
ee.prototype.has = Fa;
ee.prototype.set = Ia;
function Na() {
  this.__data__ = [], this.size = 0;
}
function dr(r, e) {
  for (var s = r.length; s--; )
    if (wa(r[s][0], e))
      return s;
  return -1;
}
var ja = Array.prototype, Ua = ja.splice;
function qa(r) {
  var e = this.__data__, s = dr(e, r);
  if (s < 0)
    return !1;
  var n = e.length - 1;
  return s == n ? e.pop() : Ua.call(e, s, 1), --this.size, !0;
}
function $a(r) {
  var e = this.__data__, s = dr(e, r);
  return s < 0 ? void 0 : e[s][1];
}
function Ja(r) {
  return dr(this.__data__, r) > -1;
}
function Xa(r, e) {
  var s = this.__data__, n = dr(s, r);
  return n < 0 ? (++this.size, s.push([r, e])) : s[n][1] = e, this;
}
function be(r) {
  var e = -1, s = r == null ? 0 : r.length;
  for (this.clear(); ++e < s; ) {
    var n = r[e];
    this.set(n[0], n[1]);
  }
}
be.prototype.clear = Na;
be.prototype.delete = qa;
be.prototype.get = $a;
be.prototype.has = Ja;
be.prototype.set = Xa;
var Ga = nn(hr, "Map");
const Wa = Ga;
function Qa() {
  this.size = 0, this.__data__ = {
    hash: new ee(),
    map: new (Wa || be)(),
    string: new ee()
  };
}
function Va(r) {
  var e = typeof r;
  return e == "string" || e == "number" || e == "symbol" || e == "boolean" ? r !== "__proto__" : r === null;
}
function mr(r, e) {
  var s = r.__data__;
  return Va(e) ? s[typeof e == "string" ? "string" : "hash"] : s.map;
}
function Ka(r) {
  var e = mr(this, r).delete(r);
  return this.size -= e ? 1 : 0, e;
}
function Za(r) {
  return mr(this, r).get(r);
}
function Ya(r) {
  return mr(this, r).has(r);
}
function to(r, e) {
  var s = mr(this, r), n = s.size;
  return s.set(r, e), this.size += s.size == n ? 0 : 1, this;
}
function re(r) {
  var e = -1, s = r == null ? 0 : r.length;
  for (this.clear(); ++e < s; ) {
    var n = r[e];
    this.set(n[0], n[1]);
  }
}
re.prototype.clear = Qa;
re.prototype.delete = Ka;
re.prototype.get = Za;
re.prototype.has = Ya;
re.prototype.set = to;
var eo = "Expected a function";
function Gr(r, e) {
  if (typeof r != "function" || e != null && typeof e != "function")
    throw new TypeError(eo);
  var s = function() {
    var n = arguments, i = e ? e.apply(this, n) : n[0], a = s.cache;
    if (a.has(i))
      return a.get(i);
    var u = r.apply(this, n);
    return s.cache = a.set(i, u) || a, u;
  };
  return s.cache = new (Gr.Cache || re)(), s;
}
Gr.Cache = re;
var ro = 500;
function so(r) {
  var e = Gr(r, function(n) {
    return s.size === ro && s.clear(), n;
  }), s = e.cache;
  return e;
}
var no = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, io = /\\(\\)?/g, ao = so(function(r) {
  var e = [];
  return r.charCodeAt(0) === 46 && e.push(""), r.replace(no, function(s, n, i, a) {
    e.push(i ? a.replace(io, "$1") : n || s);
  }), e;
});
const oo = ao;
function co(r) {
  return r == null ? "" : sn(r);
}
function uo(r, e) {
  return pr(r) ? r : Ea(r, e) ? [r] : oo(co(r));
}
var ho = 1 / 0;
function lo(r) {
  if (typeof r == "string" || lr(r))
    return r;
  var e = r + "";
  return e == "0" && 1 / r == -ho ? "-0" : e;
}
function po(r, e) {
  e = uo(e, r);
  for (var s = 0, n = e.length; r != null && s < n; )
    r = r[lo(e[s++])];
  return s && s == n ? r : void 0;
}
function on(r, e, s) {
  var n = r == null ? void 0 : po(r, e);
  return n === void 0 ? s : n;
}
function mo(r, e) {
  for (var s = -1, n = e.length, i = r.length; ++s < n; )
    r[i + s] = e[s];
  return r;
}
var xs = $t ? $t.isConcatSpreadable : void 0;
function fo(r) {
  return pr(r) || Sa(r) || !!(xs && r && r[xs]);
}
function cn(r, e, s, n, i) {
  var a = -1, u = r.length;
  for (s || (s = fo), i || (i = []); ++a < u; ) {
    var h = r[a];
    e > 0 && s(h) ? e > 1 ? cn(h, e - 1, s, n, i) : mo(i, h) : n || (i[i.length] = h);
  }
  return i;
}
function un(r) {
  var e = r == null ? 0 : r.length;
  return e ? cn(r, 1) : [];
}
var go = function() {
  return hr.Date.now();
};
const Er = go;
var vo = "Expected a function", _o = Math.max, wo = Math.min;
function yo(r, e, s) {
  var n, i, a, u, h, _, p = 0, f = !1, w = !1, l = !0;
  if (typeof r != "function")
    throw new TypeError(vo);
  e = Ps(e) || 0, Ue(s) && (f = !!s.leading, w = "maxWait" in s, a = w ? _o(Ps(s.maxWait) || 0, e) : a, l = "trailing" in s ? !!s.trailing : l);
  function v(J) {
    var ht = n, gt = i;
    return n = i = void 0, p = J, u = r.apply(gt, ht), u;
  }
  function b(J) {
    return p = J, h = setTimeout(R, e), f ? v(J) : u;
  }
  function k(J) {
    var ht = J - _, gt = J - p, zt = e - ht;
    return w ? wo(zt, a - gt) : zt;
  }
  function T(J) {
    var ht = J - _, gt = J - p;
    return _ === void 0 || ht >= e || ht < 0 || w && gt >= a;
  }
  function R() {
    var J = Er();
    if (T(J))
      return tt(J);
    h = setTimeout(R, k(J));
  }
  function tt(J) {
    return h = void 0, l && n ? v(J) : (n = i = void 0, u);
  }
  function M() {
    h !== void 0 && clearTimeout(h), p = 0, n = _ = i = h = void 0;
  }
  function C() {
    return h === void 0 ? u : tt(Er());
  }
  function V() {
    var J = Er(), ht = T(J);
    if (n = arguments, i = this, _ = J, ht) {
      if (h === void 0)
        return b(_);
      if (w)
        return clearTimeout(h), h = setTimeout(R, e), v(_);
    }
    return h === void 0 && (h = setTimeout(R, e)), u;
  }
  return V.cancel = M, V.flush = C, V;
}
class bo {
  constructor() {
    y(this, "logsObj"), y(this, "initPromise"), this.initPromise = this.init();
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
    const n = await ((s = this.logsObj) == null ? void 0 : s.shift());
    n != null && n.length && await e(un(n));
  }
  async sendByBeacon(e) {
    var s;
    await this.initPromise;
    const n = await ((s = this.logsObj) == null ? void 0 : s.shift());
    n != null && n.length && await e(n);
  }
}
function ko(r) {
  return fr(r, "String");
}
function To(r) {
  return fr(r, "Array");
}
function So(r) {
  return fr(r, "Object");
}
function Po(r) {
  return typeof r == "function";
}
function Bs(r, e = "Object") {
  return To(r) ? r.every((s) => fr(s, e)) : !1;
}
function fr(r, e = "Object") {
  return Object.prototype.toString.call(r) === `[object ${e}]`;
}
const Lo = window.indexedDB, Eo = /* @__PURE__ */ new Set(["add", "clear", "count", "delete", "get", "getAll", "getAllKeys", "getKey", "openCursor", "openKeyCursor", "put"]);
function xo(r, e, ...s) {
  return new Promise(async (n, i) => {
    try {
      const a = (await this.createTransaction(r)).objectStore(r);
      let u = a[e].call(a, ...s);
      u ? (u.onsuccess = function(h) {
        n(on(h, "target.result"));
      }, u.onerror = function(h) {
        console.log("---storeOperate onerror", r, e, h), i(h);
      }) : n(void 0);
    } catch (a) {
      i(a);
    }
  });
}
function Bo(r) {
  const e = this;
  let s = {};
  return Eo.forEach((n) => {
    s[n] = function(...i) {
      var a;
      return (a = e == null ? void 0 : e.manager) == null ? void 0 : a.pushTask(
        () => xo.call(e, r, n, ...i)
      );
    };
  }), s;
}
class Co {
  constructor() {
    y(this, "dbManagerMap", /* @__PURE__ */ new Map());
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
    y(this, "initPromise", Promise.resolve()), y(this, "openStatus", ""), y(this, "version", 0), y(this, "dbName"), y(this, "db", null), y(this, "isClose", !0), y(this, "task", Promise.resolve()), this.dbName = e, this.init();
  }
  pushTask(e) {
    if (this.isClose) {
      console.log("----task error, IndexDB is close");
      return;
    }
    let s = this.task.then(() => {
      try {
        return Po(e) ? e() : e;
      } catch (n) {
        console.log("----task error", n);
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
    return ko(e) ? [{ storeName: e }] : Bs(e, "String") ? e.map((s) => ({ storeName: s })) : So(e) ? [e] : Bs(e) ? e : (console.warn("[transTransactionParam]\u5165\u53C2\u683C\u5F0F\u4E0D\u6B63\u786E", e), []);
  }
  async transaction(e, s = "readonly") {
    await this.initPromise;
    const n = this.transTransactionParam(e);
    if (!n.length)
      return;
    const i = [];
    return n.forEach((a) => {
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
    let n = this.initPromise;
    this.initPromise = new Promise(async (i, a) => {
      await n, await this.close();
      const u = Lo.open(this.dbName, e);
      let h = setTimeout(() => {
        a(new Error("[IndexDB\u8FDE\u63A5\u8D85\u65F6] name: " + this.dbName + " \u8BF7\u5C1D\u8BD5\u5237\u65B0\u6216\u91CD\u542F\u6D4F\u89C8\u5668"));
      }, 1e4);
      u.onsuccess = () => {
        clearTimeout(h), this.openStatus = "success", this.db = u.result;
        const _ = this.db;
        this.isClose = !1;
        const p = _.version;
        this.version = _.version, _.onclose = () => {
          this.isClose = !0, console.log("[indexDB\u5173\u95ED]", p);
        }, console.log(`[indexDB\u521D\u59CB\u5316] 
onsuccess name: ` + this.dbName + ` 
version: ` + p), i();
      }, u.onupgradeneeded = (_) => {
        this.openStatus = "upgradeneeded";
        const p = on(_, "target.result");
        p ? (s && s(p), console.log("[indexDB\u521D\u59CB\u5316] onupgradeneeded name: " + this.dbName)) : console.error("[indexDB\u521D\u59CB\u5316\u5931\u8D25] onupgradeneeded name: " + this.dbName);
      }, u.onerror = (_) => {
        clearTimeout(h), console.error("[indexDB\u521D\u59CB\u5316\u5931\u8D25] name: " + this.dbName, _), i();
      };
    });
  }
  async upgradeneeded(e) {
    try {
      this.init(this.version + 1, function(s) {
        let n = e.length;
        for (; n--; )
          e[n](s);
      }), await this.initPromise;
    } catch (s) {
      console.error("[DBManager.upgradeneeded\u5931\u8D25]", s);
    }
  }
}
const xr = new Co();
class Ro {
  constructor(e = "logs") {
    y(this, "logs", []), y(this, "thisSize", 0), y(this, "dbLength", 0), y(this, "dbName", "apaas-track"), y(this, "storeName", "logs"), y(this, "maxSize", 1024 * 1024), this.storeName = e;
  }
  get length() {
    return this.dbLength + this.logs.length;
  }
  async init() {
    let e = [];
    const s = await (await xr.get(this.dbName)).transaction(this.storeName, "readonly");
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
      const s = await (await xr.get(this.dbName)).transaction(this.storeName, "readwrite");
      s && (await s(this.storeName).add(e, Date.now()), this.dbLength++, this.clearArray());
    } catch (e) {
      console.error(e);
    }
  }
  async shift(e = 1) {
    let s = [];
    if (this.dbLength !== 0 && (s = await this.shiftDB(e)), e - s.length > 0 && this.logs.length > 0) {
      let n = [...this.logs];
      this.clearArray(), s.push(n);
    }
    return s;
  }
  async shiftDB(e) {
    try {
      let s = [];
      const n = await (await xr.get(this.dbName)).transaction(this.storeName, "readwrite");
      if (n) {
        const i = n(this.storeName);
        let a = await i.getAllKeys();
        if (a.length === 0)
          return [];
        const u = this.getRange(e, a), h = [];
        u.forEach((p) => {
          h.push(i.get(p));
        }), s = await Promise.all(h);
        const _ = [];
        u.forEach((p) => {
          _.push(i.delete(p));
        }), await Promise.all(_), a = await i.getAllKeys(), this.dbLength = a.length;
      }
      return s;
    } catch (s) {
      return console.error(s), [];
    }
  }
  getRange(e, s) {
    const n = [];
    for (let i = 0; i < e && i < s.length; i++)
      n.push(s[i]);
    return n;
  }
}
async function Do(r) {
  const e = new Ro(r);
  return await e.init(), e;
}
class Ao {
  constructor() {
    y(this, "logsDB"), y(this, "initPromise"), this.initPromise = this.init();
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
    const n = await ((s = this.logsDB) == null ? void 0 : s.shift(5));
    n != null && n.length && e(un(n));
  }
  async sendByBeacon(e) {
    var s;
    await this.initPromise, await ((s = this.logsDB) == null ? void 0 : s.compulsionSave());
  }
}
class Bt extends ur {
  constructor(e) {
    super(e), y(this, "options"), y(this, "logsSender"), y(this, "nextTickLogs", []), y(this, "isStart", !1), y(this, "listenPostMessageHandler"), this.options = e, this.initStorageData(), this.initBrowserLog(), e.commonLog && this.initCommonLog(e.commonLog), console.log("this.options.useIndexDB", this.options.useIndexDB), this.options.useIndexDB ? this.logsSender = new Ao() : this.logsSender = new bo();
  }
  initStorageData() {
    const e = JSON.parse(
      localStorage.getItem("apaas-track") || "{}"
    );
    e.anonymousid || (e.anonymousid = we()), e.logs || (e.logs = []), e.distinctid = we(), localStorage.setItem("apaas-track", JSON.stringify(e));
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
    const e = new Or.exports.UAParser();
    e.setUA(navigator.userAgent);
    const s = e.getResult(), n = s.os.version || "", i = s.os.name || "", a = s.browser.name || "", u = s.browser.version || "", h = navigator.vendor, _ = Ks.exports(
      `${i}${n}${h}${a}${u}`
    ), p = location.href;
    this.browserLog = {
      system: i,
      systemver: n,
      manufacturer: h,
      browser: a,
      browserver: u,
      terminalid: _,
      anonymousid: this.anonymousid,
      distinctid: this.distinctid,
      url: p,
      logsdkver: sr
    };
  }
  start(...e) {
    if (this.isStart)
      return;
    let s = 0, n = 60 * 5 * 1e3, i = null, a = window.setInterval(() => {
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
      }).catch((h) => {
        console.error("track send error", h), s++, s >= 5 && (a && clearInterval(a), a = null, i || (i = window.setInterval(() => {
          u();
        }, n)));
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
    const s = [...this.getLegancyLogs() || [], e], n = this.getStorageData();
    n.logs = s, this.updateStorageData(n);
  }
  listenPostMessage() {
    this.listenPostMessageHandler = (e) => {
      var s;
      const n = (e == null ? void 0 : e.data) || {};
      if (n.type === "getWebCommonParams") {
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
      } else if (n.type === "sendApaasLog") {
        const i = n.data, { log: a, isImmediate: u } = i;
        this.sendLog(a, u);
      }
    }, window.addEventListener("message", this.listenPostMessageHandler);
  }
  divideLogsSend(e) {
    return this.options.useIndexDB ? ar(this.options.url, e, this.getZip()) : Oo(e, {
      url: this.options.url,
      zip: this.getZip(),
      maxSize: this.getMaxSize()
    });
  }
  async sendByNextTick(e) {
    if (this.nextTickLogs.push(e), await Ar(), !this.nextTickLogs.length)
      return;
    const s = JSON.parse(JSON.stringify(this.nextTickLogs));
    this.divideLogsSend(this.nextTickLogs).catch((n) => {
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
    const s = async (n) => Li(
      `${this.options.url}`,
      n,
      e !== void 0 ? e : this.getZip()
    );
    this.logsSender.length && await this.logsSender.sendByBeacon(s.bind(this));
  }
}
function Oo(r, e) {
  const { url: s, zip: n, maxSize: i } = e;
  if (JSON.stringify(r).length <= i || r.length === 1)
    return ar(s, r, n);
  {
    const a = ii(r, i), u = [];
    return a.forEach((h) => {
      u.push(ar(s, h, n));
    }), Promise.all(u);
  }
}
class de extends at {
  constructor(e) {
    super(e, "click"), y(this, "paths", ""), y(this, "customProperties", {}), y(this, "name", "");
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
const zo = (r) => !r || r === document || r.tagName === "HTML" || !r.hasAttribute ? !1 : r.hasAttribute("apaas-track-click") && r.getAttribute("apaas-track-click") !== "false", Cs = (r) => {
  r.target;
  const e = r.composedPath();
  if (!e.length)
    return !1;
  for (let s = 0; s < e.length; s++) {
    const n = e[s];
    if (n === window)
      return !1;
    if (zo(n))
      return n;
  }
  return !1;
}, Hr = (r) => {
  const e = r.tagName, s = r.id, n = r.className, i = (h, _, p) => `${h}${_ ? "#" + _ : ""}${p ? "." + p : ""}`;
  let a = i(e, s, n) + " > ", u = r.parentElement;
  for (; u; ) {
    const h = u.tagName, _ = u.id, p = u.className;
    a += i(h, _, p) + " > ", u = u.parentElement;
  }
  return a = a.replace(/\s>\s$/, ""), a && (a = a.split(" > ").reverse().join(" > ")), a;
}, Fo = (r, e) => {
  const s = (n, i) => n === i;
  if (r === document)
    return !0;
  {
    const n = e.target;
    if (s(r, n))
      return !0;
    let i = n.parentElement;
    if (!i)
      return !1;
    for (; i; ) {
      if (s(r, i))
        return !0;
      i = i.parentElement;
    }
    return !1;
  }
}, Ho = (r, e) => {
  const s = () => !0, n = (a) => Cs(a), i = (a) => {
    a.target;
    const u = (e == null ? void 0 : e.collectSelectors) || [];
    if (!u.length)
      return null;
    let h = [];
    for (let p = 0; p < u.length; p++) {
      const { selector: f, name: w } = u[p], l = document.querySelectorAll(f);
      !l || !l.length || l.forEach((v) => {
        h.push({
          name: w,
          selector: f,
          element: v
        });
      });
    }
    if (!h.length)
      return null;
    let _ = [];
    for (let p = 0; p < h.length; p++) {
      const {
        element: f,
        name: w,
        selector: l
      } = h[p];
      f && Fo(f, a) && _.push({
        name: w,
        selector: l,
        element: f
      });
    }
    return _;
  };
  e && document.addEventListener(
    "click",
    (a) => {
      if (!((e == null ? void 0 : e.collectUrl) || s)(location))
        return;
      const u = ((e == null ? void 0 : e.collectElement) || n)(a), h = i(a);
      if (!u && (!h || !h.length))
        return;
      const _ = Cs(a);
      if (_) {
        let p = {};
        const f = (e == null ? void 0 : e.customProperty) || [], w = _.attributes;
        let l = "";
        const v = w.getNamedItem("apaas-track-click");
        if (v && v.nodeName === "apaas-track-click") {
          const T = v.nodeValue;
          T && T !== "false" && T !== "true" && (l = T);
        }
        for (let T of w) {
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
        let b = "";
        e != null && e.trackElementPath && (b = Hr(_));
        const k = new de(r);
        k.setProperties({
          name: p.name || l,
          paths: b,
          customProperties: p
        }), r.addLogByEvent(k);
      }
      if (h && h.length)
        for (let p of h) {
          let f = "";
          e != null && e.trackElementPath && (f = Hr(
            p.element
          ));
          const w = new de(r);
          w.setProperties({
            name: p.name,
            paths: f,
            customProperties: {
              selector: p.selector,
              name: p.name
            }
          }), r.addLogByEvent(w);
        }
    },
    !0
  );
}, Io = (r, e, s, n) => {
  const i = {
    paths: "",
    customProperties: {}
  };
  "customProperties" in e ? i.customProperties = e.customProperties : i.customProperties = e;
  const a = Ot(r, "click");
  let u = e.paths || "";
  n && !u && (s == null ? void 0 : s.trackElementPath) && (u = Hr(n.target), i.paths = u), a.setProperties(i), r.addLogByEvent(a);
}, No = (r) => {
  r || (r = {}), de.eventOptions = r, de.initApaasTrackHook = (e) => {
    e.executeClickEvent = (s, n) => {
      Io(e, s, r, n);
    };
  }, de.startApaasTrackHook = (e) => {
    Ho(e, r);
  }, Bt.registerEvent("click", de);
}, ge = [], hn = (r) => {
  ge.length || window.addEventListener("pagehide", (...e) => {
    ge.forEach((s) => {
      s(...e);
    });
  }), ge.push(r);
}, jo = (r) => {
  for (let e = 0; e < ge.length; e++) {
    const s = ge[e];
    r === s && ge.splice(e, 1);
  }
}, At = [], Uo = (r) => {
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
  })), At.push(r);
}, qo = (r) => {
  for (let e = 0; e < At.length; e++) {
    const s = At[e];
    r === s && At.splice(e, 1);
  }
};
class Ms extends at {
  constructor(e) {
    super(e, "close");
  }
}
const $o = (r) => {
  hn((e) => {
    if (r) {
      r.sendByBeacon();
      const s = Ot(r, "close").getEventLog();
      r.addToLegancyLog(s);
    }
  });
}, Jo = () => {
  Ms.startApaasTrackHook = (r) => {
    $o(r);
  }, Bt.registerEvent("close", Ms);
};
class Rs extends at {
  constructor(e) {
    super(e, "entermain"), y(this, "groupid", ""), y(this, "localtime", ""), y(this, "cheatinfo", {});
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
const Xo = () => {
  Rs.initApaasTrackHook = (r) => {
    r.executeEnterMainEvent = () => {
      const e = Ot(r, "entermain");
      e.setProperties({
        groupid: r.groupid
      }), r.addLogByEvent(e);
    };
  }, ur.registerEvent("entermain", Rs);
}, Go = (r, e = {}) => {
  Yt(e) || (e = {});
  let s = r ? r.split("?") : [];
  if (s.shift(), s.length > 0) {
    s = s.join("?").split("&");
    for (const n of s) {
      const i = n.split("=");
      try {
        e[i[0]] = decodeURIComponent(i[1]);
      } catch {
        e[i[0]] = i[1];
      }
    }
  }
  return e;
}, Ie = (r, e) => {
  let s = "";
  switch (r) {
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
          s = Ws(String(e), 1e4);
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
}, ln = (r) => {
  if (!r)
    return null;
  let e = null;
  if (typeof r == "string")
    try {
      e = JSON.parse(r);
    } catch {
      const s = r.split("&");
      if (s.length === 1)
        e = r;
      else {
        e = {};
        for (let n of s) {
          const i = n.split("=");
          e[i[0]] = i[1] === void 0 ? "undefined" : i[1];
        }
      }
    }
  else if (Vn(r))
    if (e = {}, Et(r) && Js(r[0]))
      e = r;
    else
      for (const [s, n] of r)
        e[s] = typeof n == "string" ? n : "[object Object]";
  else
    Zn(r) ? e = r : e = `[object ${Kn(r)}]`;
  return e;
}, Ds = (r = "") => (r.startsWith("//") && (r = `${new URL(window.location.href).protocol}${r}`), r.startsWith("http") ? new URL(r) : new URL(r, window.location.href));
class pn {
  constructor() {
    y(this, "id", ""), y(this, "name", ""), y(this, "method", ""), y(this, "url", ""), y(this, "status", 0), y(this, "statusText", ""), y(this, "cancelState", 0), y(this, "readyState", 0), y(this, "header", null), y(this, "responseType", ""), y(this, "requestType", "xhr"), y(this, "requestHeader", null), y(this, "response"), y(this, "responseSize", 0), y(this, "responseSizeText", ""), y(this, "startTime", 0), y(this, "startTimeText", ""), y(this, "endTime", 0), y(this, "costTime", 0), y(this, "getData", null), y(this, "postData", null), y(this, "postLength", 0), y(this, "actived", !1), y(this, "noVConsole", !1), y(this, "_XMLReq", null), this.id = we();
  }
}
class Wo {
  constructor(e, s, n) {
    y(this, "resp"), y(this, "item"), y(this, "onUpdateCallback"), this.resp = e, this.item = s, this.onUpdateCallback = n, this.mockReader();
  }
  set(e, s, n) {
    return Reflect.set(e, s, n);
  }
  get(e, s) {
    const n = Reflect.get(e, s);
    switch (s) {
      case "arrayBuffer":
      case "blob":
      case "formData":
      case "json":
      case "text":
        return () => (this.item.responseType = s.toLowerCase(), n.apply(e).then((i) => (this.item.response = Ie(
          this.item.responseType,
          i
        ), this.onUpdateCallback(this.item), i)));
    }
    return typeof n == "function" ? n.bind(e) : n;
  }
  mockReader() {
    let e;
    if (!this.resp.body || typeof this.resp.body.getReader != "function")
      return;
    const s = this.resp.body.getReader;
    this.resp.body.getReader = () => {
      const n = s.apply(this.resp.body);
      if (this.item.readyState === 4)
        return n;
      const i = n.read, a = n.cancel;
      return this.item.responseType = "arraybuffer", n.read = () => i.apply(n).then(
        (u) => {
          if (!e)
            e = new Uint8Array(u.value);
          else {
            const h = new Uint8Array(
              e.length + u.value.length
            );
            h.set(e), h.set(
              u.value,
              e.length
            ), e = h;
          }
          return this.item.endTime = Date.now(), this.item.costTime = this.item.endTime - (this.item.startTime || this.item.endTime), this.item.readyState = u.done ? 4 : 3, this.item.statusText = u.done ? String(this.item.status) : "Loading", this.item.responseSize = e.length, this.item.responseSizeText = je(
            this.item.responseSize
          ), u.done && (this.item.response = Ie(
            this.item.responseType,
            e
          )), this.onUpdateCallback(this.item), u;
        }
      ), n.cancel = (...u) => (this.item.cancelState = 2, this.item.statusText = "Cancel", this.item.endTime = Date.now(), this.item.costTime = this.item.endTime - (this.item.startTime || this.item.endTime), this.item.response = Ie(
        this.item.responseType,
        e
      ), this.onUpdateCallback(this.item), a.apply(n, u)), n;
    };
  }
}
class Qo {
  constructor(e) {
    y(this, "onUpdateCallback"), this.onUpdateCallback = e;
  }
  apply(e, s, n) {
    const i = n[0], a = n[1], u = new pn();
    return this.beforeFetch(u, i, a), e.apply(window, n).then(this.afterFetch(u)).catch((h) => {
      throw u.endTime = Date.now(), u.costTime = u.endTime - (u.startTime || u.endTime), this.onUpdateCallback(u), h;
    });
  }
  beforeFetch(e, s, n) {
    let i, a = "GET", u = null;
    if (Je(s) ? (a = (n == null ? void 0 : n.method) || "GET", i = Ds(s), u = (n == null ? void 0 : n.headers) || null) : (a = s.method || "GET", i = Ds(s.url), u = s.headers), e.method = a, e.requestType = "fetch", e.requestHeader = u, e.url = i.toString(), e.name = (i.pathname.split("/").pop() || "") + i.search, e.status = 0, e.statusText = "Pending", e.readyState = 1, !e.startTime) {
      e.startTime = Date.now();
      const h = $s(e.startTime);
      e.startTimeText = `${h.year}-${h.month}-${h.day} ${h.hour}:${h.minute}:${h.second}.${h.millisecond}`;
    }
    if (Object.prototype.toString.call(u) === "[object Headers]") {
      e.requestHeader = {};
      for (const [h, _] of u)
        e.requestHeader[h] = _;
    } else
      e.requestHeader = u;
    if (i.search && i.searchParams) {
      e.getData = {};
      for (const [h, _] of i.searchParams)
        e.getData[h] = _;
    }
    n != null && n.body && (e.postData = ln(n.body)), this.onUpdateCallback(e);
  }
  afterFetch(e) {
    return (s) => {
      e.endTime = Date.now(), e.costTime = e.endTime - (e.startTime || e.endTime), e.status = s.status, e.statusText = String(s.status);
      let n = !1;
      e.header = {};
      for (const [i, a] of s.headers)
        e.header[i] = a, n = a.toLowerCase().indexOf("chunked") > -1 ? !0 : n;
      return n ? e.readyState = 3 : (e.readyState = 4, this.handleResponseBody(s.clone(), e).then(
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
    const n = e.headers.get("content-type");
    return n && n.includes("application/json") ? (s.responseType = "json", e.text()) : n && (n.includes("text/html") || n.includes("text/plain")) ? (s.responseType = "text", e.text()) : (s.responseType = "arraybuffer", e.arrayBuffer());
  }
}
class dn {
  static create(e) {
    return new Proxy(window.fetch, new Qo(e));
  }
}
y(dn, "origFetch", window.fetch);
class Vo {
  constructor(e, s) {
    y(this, "XMLReq"), y(this, "item"), y(this, "onUpdateCallback"), this.XMLReq = e, this.XMLReq.onreadystatechange = () => {
      this.onReadyStateChange();
    }, this.XMLReq.onabort = () => {
      this.onAbort();
    }, this.XMLReq.ontimeout = () => {
      this.onTimeout();
    }, this.item = new pn(), this.item._XMLReq = e, this.item.requestType = "xhr", this.onUpdateCallback = s;
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
        const n = Reflect.get(e, s);
        return typeof n == "function" ? n.bind(e) : n;
    }
  }
  set(e, s, n) {
    switch (s) {
      case "_noVConsole":
        return this.item.noVConsole = !!n, !1;
      case "onreadystatechange":
        return this.setOnReadyStateChange(e, s, n);
      case "onabort":
        return this.setOnAbort(e, s, n);
      case "ontimeout":
        return this.setOnTimeout(e, s, n);
    }
    return Reflect.set(e, s, n);
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
    return (...n) => {
      const i = n[0], a = n[1];
      return this.item.method = i ? i.toUpperCase() : "GET", this.item.url = a || "", this.item.name = this.item.url.replace(new RegExp("[/]*$"), "").split("/").pop() || "", this.item.getData = Go(this.item.url, {}), this.triggerUpdate(), s.apply(e, n);
    };
  }
  getSend(e) {
    const s = Reflect.get(e, "send");
    return (...n) => {
      const i = n[0];
      return i && Object.prototype.hasOwnProperty.call(i, "length") && (this.item.postLength = i.length), this.item.postData = ln(i), this.triggerUpdate(), s.apply(e, n);
    };
  }
  getSetRequestHeader(e) {
    const s = Reflect.get(e, "setRequestHeader");
    return (...n) => (this.item.requestHeader || (this.item.requestHeader = {}), this.item.requestHeader[n[0]] = n[1], this.triggerUpdate(), s.apply(e, n));
  }
  setOnReadyStateChange(e, s, n) {
    return Reflect.set(e, s, (...i) => {
      this.onReadyStateChange(), n.apply(e, i);
    });
  }
  setOnAbort(e, s, n) {
    return Reflect.set(e, s, (...i) => {
      this.onAbort(), n.apply(e, i);
    });
  }
  setOnTimeout(e, s, n) {
    return Reflect.set(e, s, (...i) => {
      this.onTimeout(), n.apply(e, i);
    });
  }
  updateItemByReadyState() {
    switch (this.XMLReq.readyState) {
      case 0:
      case 1:
        if (this.item.status = 0, this.item.statusText = "Pending", !this.item.startTime) {
          this.item.startTime = Date.now();
          const n = $s(this.item.startTime);
          this.item.startTimeText = `${n.year}-${n.month}-${n.day} ${n.hour}:${n.minute}:${n.second}.${n.millisecond}`;
        }
        break;
      case 2:
        this.item.status = this.XMLReq.status, this.item.statusText = "Loading", this.item.header = {};
        const e = this.XMLReq.getAllResponseHeaders() || "", s = e.split(`
`);
        for (let n = 0; n < s.length; n++) {
          const i = s[n];
          if (!i)
            continue;
          const a = i.split(": "), u = a[0], h = a.slice(1).join(": ");
          this.item.header[u] = h;
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
class mn {
  static create(e) {
    return new Proxy(XMLHttpRequest, {
      construct(s) {
        const n = new s();
        return new Proxy(
          n,
          new Vo(n, e)
        );
      }
    });
  }
}
y(mn, "origXMLHttpRequest", XMLHttpRequest);
class nr extends at {
  constructor(e) {
    super(e, "http"), y(this, "url", ""), y(this, "method", ""), y(this, "startTime", 0), y(this, "endTime", 0), y(this, "requestContentLength", 0), y(this, "responseContentLength", 0), y(this, "responseContent", null), y(this, "requestContent", null), y(this, "statusCode", 0), y(this, "headers", {}), y(this, "trackOptions", {
      trackHeaders: !0,
      trackRequesetData: !1,
      trackResponseData: !1,
      trackFilter: void 0
    });
  }
  setTrackOptions(e) {
    this.trackOptions = {
      ...this.trackOptions,
      ...e
    };
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
      requestContent: this.trackOptions.trackRequesetData ? this.requestContent : void 0,
      responseContent: this.trackOptions.trackResponseData ? this.responseContent : void 0,
      start: this.startTime * 1e6,
      end: this.endTime * 1e6
    };
  }
  start(e, s, n, i) {
    this.startTime = Date.now(), this.url = e, this.method = s, this.headers = i, this.requestContentLength = n;
  }
  end(e, s) {
    this.endTime = Date.now(), this.responseContentLength = e, this.statusCode = s;
  }
  setProperties(e) {
    this.url = e.url, this.method = e.method, this.startTime = e.startTime, this.endTime = e.endTime, this.requestContentLength = e.requestContentLength, this.responseContentLength = e.responseContentLength, this.statusCode = e.statusCode, this.trackOptions.trackResponseData && (this.responseContent = e.responseContent), this.trackOptions.trackRequesetData && (this.requestContent = e.requestContent);
    let s = e.headers;
    s && (s = {
      ...s,
      token: ""
    }), this.headers = s;
  }
}
const Ko = (r, e) => {
  const s = (n, i) => {
    var a, u, h;
    if (i.readyState === 4 && i.url !== n.options.url) {
      let _ = {
        url: i.url,
        method: i.method,
        startTime: i.startTime,
        endTime: i.endTime,
        requestContentLength: i.postLength,
        responseContentLength: i.responseSize,
        responseContent: i.response,
        requestContent: i.postData || i.getData,
        statusCode: i.status,
        headers: i.header || {}
      };
      if (e.trackFilter) {
        const f = e.trackFilter(_, i);
        if (f === !1)
          return;
        typeof f == "object" ? _ = f : f === !0 && (e.trackResponseData && _.responseContent && ((a = _.responseContent) == null ? void 0 : a.length) > 1048576 && (_.responseContent = void 0), e.trackRequesetData && _.requestContent && ((u = _.requestContent) == null ? void 0 : u.length) > 1048576 && (_.requestContent = void 0));
      } else
        e.trackResponseData && _.responseContent && _.responseContent.length > 1048576 && (_.responseContent = void 0), e.trackRequesetData && _.requestContent && ((h = _.requestContent) == null ? void 0 : h.length) > 1048576 && (_.requestContent = void 0);
      const p = new nr(n);
      p.setTrackOptions(e), p.setProperties(_), n.addLogByEvent(p);
    }
  };
  window.XMLHttpRequest = mn.create((n) => {
    s(r, n);
  }), window.fetch = dn.create((n) => {
    s(r, n);
  });
}, Zo = (r) => {
  r || (r = {
    trackHeaders: !0,
    trackResponseData: !1,
    trackRequesetData: !1
  }), nr.eventOptions = r, nr.startApaasTrackHook = (e) => {
    Ko(e, r);
  }, ur.registerEvent("http", nr);
}, kt = (r, e = !1) => {
  let s = location.href.replace(/#\/.+$/, r);
  return e && (s = s.replace(/\?\S+$/, "")), s;
}, fn = (r, e) => {
  let s = history.pushState, n = history.replaceState, i = kt(location.hash), a = null;
  history.pushState = function(...u) {
    const h = kt(location.hash), _ = kt(u[2] || "");
    return i = _, r && (a = {
      newURL: _,
      oldURL: h,
      type: "push"
    }, Ar(() => {
      a && (e(a), a = null);
    })), s.apply(this, u);
  }, history.replaceState = function(...u) {
    if (r) {
      const h = kt(location.hash), _ = kt(u[2] || "");
      a = {
        newURL: _,
        oldURL: h,
        type: "replace"
      }, i = _, Ar(() => {
        if (a && a.oldURL === h && a.newURL === _) {
          let p = kt(location.hash);
          h === _ ? _ !== p ? (a.newURL = p, a.type = "push") : a.type = "onload" : a.type = "replace", e(a), a = null;
        }
      });
    }
    return n.apply(this, u);
  }, window.addEventListener("popstate", (u) => {
    if (r) {
      const h = kt(location.hash);
      u.state && (a = {
        newURL: h,
        oldURL: i,
        type: u.state.forward ? "back" : "forward"
      }, i = h, e(a), a = null);
    }
  });
};
var Yo = function(r, e) {
  e === !0 && (e = 0);
  var s = "";
  if (typeof r == "string")
    try {
      s = new URL(r).protocol;
    } catch {
    }
  else
    r && r.constructor === URL && (s = r.protocol);
  var n = s.split(/\:|\+/).filter(Boolean);
  return typeof e == "number" ? n[e] : n;
}, tc = Yo;
function ec(r) {
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
    href: r,
    query: {},
    parse_failed: !1
  };
  try {
    var s = new URL(r);
    e.protocols = tc(s), e.protocol = e.protocols[0], e.port = s.port, e.resource = s.hostname, e.host = s.host, e.user = s.username || "", e.password = s.password || "", e.pathname = s.pathname, e.hash = s.hash.slice(1), e.search = s.search.slice(1), e.href = s.href, e.query = Object.fromEntries(s.searchParams);
  } catch {
    e.protocols = ["file"], e.protocol = e.protocols[0], e.port = "", e.resource = "", e.user = "", e.pathname = "", e.hash = "", e.search = "", e.href = r, e.query = {}, e.parse_failed = !0;
  }
  return e;
}
var rc = ec;
const sc = "text/plain", nc = "us-ascii", As = (r, e) => e.some((s) => s instanceof RegExp ? s.test(r) : s === r), ic = (r, { stripHash: e }) => {
  const s = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(r);
  if (!s)
    throw new Error(`Invalid URL: ${r}`);
  let { type: n, data: i, hash: a } = s.groups;
  const u = n.split(";");
  a = e ? "" : a;
  let h = !1;
  u[u.length - 1] === "base64" && (u.pop(), h = !0);
  const _ = (u.shift() || "").toLowerCase(), p = [
    ...u.map((f) => {
      let [w, l = ""] = f.split("=").map((v) => v.trim());
      return w === "charset" && (l = l.toLowerCase(), l === nc) ? "" : `${w}${l ? `=${l}` : ""}`;
    }).filter(Boolean)
  ];
  return h && p.push("base64"), (p.length > 0 || _ && _ !== sc) && p.unshift(_), `data:${p.join(";")},${h ? i.trim() : i}${a ? `#${a}` : ""}`;
};
function ac(r, e) {
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
  }, r = r.trim(), /^data:/i.test(r))
    return ic(r, e);
  if (/^view-source:/i.test(r))
    throw new Error("`view-source:` is not supported as it is a non-standard protocol");
  const s = r.startsWith("//");
  !s && /^\.*\//.test(r) || (r = r.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, e.defaultProtocol));
  const n = new URL(r);
  if (e.forceHttp && e.forceHttps)
    throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
  if (e.forceHttp && n.protocol === "https:" && (n.protocol = "http:"), e.forceHttps && n.protocol === "http:" && (n.protocol = "https:"), e.stripAuthentication && (n.username = "", n.password = ""), e.stripHash ? n.hash = "" : e.stripTextFragment && (n.hash = n.hash.replace(/#?:~:text.*?$/i, "")), n.pathname) {
    const a = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;
    let u = 0, h = "";
    for (; ; ) {
      const _ = a.exec(n.pathname);
      if (!_)
        break;
      const p = _[0], f = _.index;
      h += n.pathname.slice(u, f).replace(/\/{2,}/g, "/"), h += p, u = f + p.length;
    }
    h += n.pathname.slice(u, n.pathname.length).replace(/\/{2,}/g, "/"), n.pathname = h;
  }
  if (n.pathname)
    try {
      n.pathname = decodeURI(n.pathname);
    } catch {
    }
  if (e.removeDirectoryIndex === !0 && (e.removeDirectoryIndex = [/^index\.[a-z]+$/]), Array.isArray(e.removeDirectoryIndex) && e.removeDirectoryIndex.length > 0) {
    let a = n.pathname.split("/");
    const u = a[a.length - 1];
    As(u, e.removeDirectoryIndex) && (a = a.slice(0, -1), n.pathname = a.slice(1).join("/") + "/");
  }
  if (n.hostname && (n.hostname = n.hostname.replace(/\.$/, ""), e.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(n.hostname) && (n.hostname = n.hostname.replace(/^www\./, ""))), Array.isArray(e.removeQueryParameters))
    for (const a of [...n.searchParams.keys()])
      As(a, e.removeQueryParameters) && n.searchParams.delete(a);
  if (e.removeQueryParameters === !0 && (n.search = ""), e.sortQueryParameters) {
    n.searchParams.sort();
    try {
      n.search = decodeURIComponent(n.search);
    } catch {
    }
  }
  e.removeTrailingSlash && (n.pathname = n.pathname.replace(/\/$/, ""));
  const i = r;
  return r = n.toString(), !e.removeSingleSlash && n.pathname === "/" && !i.endsWith("/") && n.hash === "" && (r = r.replace(/\/$/, "")), (e.removeTrailingSlash || n.pathname === "/") && n.hash === "" && e.removeSingleSlash && (r = r.replace(/\/$/, "")), s && !e.normalizeProtocol && (r = r.replace(/^http:\/\//, "//")), e.stripProtocol && (r = r.replace(/^(?:https?:)?\/\//, "")), r;
}
const $e = (r, e = !1) => {
  const s = /^(?:([a-z_][a-z0-9_-]{0,31})@|https?:\/\/)([\w\.\-@]+)[\/:]([\~,\.\w,\-,\_,\/]+?(?:\.git|\/)?)$/, n = (a) => {
    const u = new Error(a);
    throw u.subject_url = r, u;
  };
  (typeof r != "string" || !r.trim()) && n("Invalid url."), r.length > $e.MAX_INPUT_LENGTH && n("Input exceeds maximum length. If needed, change the value of parseUrl.MAX_INPUT_LENGTH."), e && (typeof e != "object" && (e = {
    stripHash: !1
  }), r = ac(r, e));
  const i = rc(r);
  if (i.parse_failed) {
    const a = i.href.match(s);
    a ? (i.protocols = ["ssh"], i.protocol = "ssh", i.resource = a[2], i.host = a[2], i.user = a[1], i.pathname = `/${a[3]}`, i.parse_failed = !1) : n("URL parsing failed.");
  }
  return i;
};
$e.MAX_INPUT_LENGTH = 2048;
$e.MAX_INPUT_LENGTH = 2048 * 1024;
class ve extends at {
  constructor(e) {
    super(e, "online"), y(this, "url", ""), y(this, "duration", 0), y(this, "startTime", 0), y(this, "endTime", 0), y(this, "views", []);
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
let Fe = null;
const Os = (r, e) => {
  const s = () => !0;
  let n = typeof e == "object" && e.collectUrl ? e.collectUrl : s;
  return (i) => {
    let a = $e(i.newURL), u = $e(i.oldURL), h = kt(`#${a.hash}`, !0);
    i.oldURL && kt(`#${u.hash}`, !0), Fe && (Fe.stop(), Fe.destroy(), Fe = null), n(location) && (Fe = new oc(r, h));
  };
};
class oc {
  constructor(e, s, n) {
    y(this, "url", ""), y(this, "duration", 0), y(this, "startTime", 0), y(this, "onlineOptions"), y(this, "apaasTrack"), y(this, "visibleChangeHandler"), y(this, "beforeUnLoadHandler"), y(this, "userActionHandler"), y(this, "onlineTimer", null), y(this, "stopTimeout", null), this.url = s, this.apaasTrack = e, this.onlineOptions = n || {
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
          for (let h in u.onlineData) {
            const _ = u.onlineData[h], p = new ve(this.apaasTrack);
            p.setProperties({
              duration: _.duration,
              url: h,
              startTime: _.startTime,
              endTime: _.lastTime,
              views: _.views
            });
            const f = p.getEventLog();
            e.addToLegancyLog(f);
          }
        this.cleanOnlineData();
      }
    }, this.userActionHandler = yo(
      (i) => {
        console.log("\u6709\u7528\u6237\u884C\u4E3A"), this.stopUserActionMonitor(), this.start(), this.startUserActionMonitor();
      },
      60 * 1e3,
      {
        leading: !0,
        trailing: !1
      }
    ), hn(this.beforeUnLoadHandler), Uo(this.userActionHandler), this.init();
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
    const n = this.apaasTrack.getStorageData();
    let i = n.onlineData, a = i[this.url] || (i[this.url] = {
      duration: 0,
      lastTime: Date.now()
    });
    a.duration = e, a.lastTime = Date.now(), a.startTime = this.startTime, s && (a.views || (a.views = []), a.views.push({
      name: s.name,
      duration: s.duration
    })), n.onlineData[this.url] = a, localStorage.setItem("apaas-track", JSON.stringify(n));
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
    const n = this.getStorageOnlineData();
    if (n)
      if (s) {
        const i = n[s];
        if (i != null && i.duration) {
          const a = new ve(this.apaasTrack);
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
        for (let i in n) {
          const a = n[i];
          if (a.duration) {
            const u = new ve(this.apaasTrack);
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
const cc = (r) => {
  console.log("registerOnlineEvent"), r || (r = {}), ve.eventOptions = r, ve.startApaasTrackHook = (e) => {
    console.log("registerOnlineEvent startApaasTrackHook");
    let s = null;
    fn(e, (a) => {
      console.log("online listenHistoryChange"), s || (s = Os(e)), s(a);
    });
    const n = () => {
      i && clearTimeout(i), s || (s = Os(e));
      const a = {
        newURL: kt(location.hash),
        oldURL: kt(location.hash),
        type: "onload"
      };
      s(a), window.removeEventListener("load", n);
    };
    let i = null;
    window.self !== window.top && (window.addEventListener("load", n), i = setTimeout(() => {
      n(), clearTimeout(i);
    }, 3e3));
  }, Bt.registerEvent("online", ve);
};
class Ir extends at {
  constructor(e) {
    super(e, "pageview", Qs.HIGH), y(this, "oldURL", ""), y(this, "newURL", ""), y(this, "entertype", "");
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
const uc = (r, e) => {
  const s = new Ir(r);
  s.setProperties(e);
  const n = s.getEventLog();
  r.addLogToQueue(n, !0);
}, hc = () => {
  Ir.startApaasTrackHook = (r) => {
    fn(r, (e) => {
      uc(r, e);
    });
  }, Bt.registerEvent("pageview", Ir);
};
var qt, Ne, gn, or, Nr, vn = -1, se = function(r) {
  addEventListener("pageshow", function(e) {
    e.persisted && (vn = e.timeStamp, r(e));
  }, !0);
}, Wr = function() {
  return window.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
}, gr = function() {
  var r = Wr();
  return r && r.activationStart || 0;
}, mt = function(r, e) {
  var s = Wr(), n = "navigate";
  return vn >= 0 ? n = "back-forward-cache" : s && (n = document.prerendering || gr() > 0 ? "prerender" : document.wasDiscarded ? "restore" : s.type.replace(/_/g, "-")), { name: r, value: e === void 0 ? -1 : e, rating: "good", delta: 0, entries: [], id: "v3-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1e12), navigationType: n };
}, ke = function(r, e, s) {
  try {
    if (PerformanceObserver.supportedEntryTypes.includes(r)) {
      var n = new PerformanceObserver(function(i) {
        Promise.resolve().then(function() {
          e(i.getEntries());
        });
      });
      return n.observe(Object.assign({ type: r, buffered: !0 }, s || {})), n;
    }
  } catch {
  }
}, vr = function(r, e) {
  var s = function n(i) {
    i.type !== "pagehide" && document.visibilityState !== "hidden" || (r(i), e && (removeEventListener("visibilitychange", n, !0), removeEventListener("pagehide", n, !0)));
  };
  addEventListener("visibilitychange", s, !0), addEventListener("pagehide", s, !0);
}, ft = function(r, e, s, n) {
  var i, a;
  return function(u) {
    e.value >= 0 && (u || n) && ((a = e.value - (i || 0)) || i === void 0) && (i = e.value, e.delta = a, e.rating = function(h, _) {
      return h > _[1] ? "poor" : h > _[0] ? "needs-improvement" : "good";
    }(e.value, s), r(e));
  };
}, Qr = function(r) {
  requestAnimationFrame(function() {
    return requestAnimationFrame(function() {
      return r();
    });
  });
}, Te = function(r) {
  document.prerendering ? addEventListener("prerenderingchange", function() {
    return r();
  }, !0) : r();
}, me = -1, zs = function() {
  return document.visibilityState !== "hidden" || document.prerendering ? 1 / 0 : 0;
}, cr = function(r) {
  document.visibilityState === "hidden" && me > -1 && (me = r.type === "visibilitychange" ? r.timeStamp : 0, lc());
}, Fs = function() {
  addEventListener("visibilitychange", cr, !0), addEventListener("prerenderingchange", cr, !0);
}, lc = function() {
  removeEventListener("visibilitychange", cr, !0), removeEventListener("prerenderingchange", cr, !0);
}, Vr = function() {
  return me < 0 && (me = zs(), Fs(), se(function() {
    setTimeout(function() {
      me = zs(), Fs();
    }, 0);
  })), { get firstHiddenTime() {
    return me;
  } };
}, _n = function(r, e) {
  e = e || {}, Te(function() {
    var s, n = [1800, 3e3], i = Vr(), a = mt("FCP"), u = ke("paint", function(h) {
      h.forEach(function(_) {
        _.name === "first-contentful-paint" && (u.disconnect(), _.startTime < i.firstHiddenTime && (a.value = Math.max(_.startTime - gr(), 0), a.entries.push(_), s(!0)));
      });
    });
    u && (s = ft(r, a, n, e.reportAllChanges), se(function(h) {
      a = mt("FCP"), s = ft(r, a, n, e.reportAllChanges), Qr(function() {
        a.value = performance.now() - h.timeStamp, s(!0);
      });
    }));
  });
}, pc = function(r, e) {
  e = e || {}, Te(function() {
    var s, n = [0.1, 0.25], i = mt("CLS"), a = -1, u = 0, h = [], _ = function(w) {
      a > -1 && r(w);
    }, p = function(w) {
      w.forEach(function(l) {
        if (!l.hadRecentInput) {
          var v = h[0], b = h[h.length - 1];
          u && l.startTime - b.startTime < 1e3 && l.startTime - v.startTime < 5e3 ? (u += l.value, h.push(l)) : (u = l.value, h = [l]), u > i.value && (i.value = u, i.entries = h, s());
        }
      });
    }, f = ke("layout-shift", p);
    f && (s = ft(_, i, n, e.reportAllChanges), _n(function(w) {
      a = w.value, i.value < 0 && (i.value = 0, s());
    }), vr(function() {
      p(f.takeRecords()), s(!0);
    }), se(function() {
      u = 0, a = -1, i = mt("CLS", 0), s = ft(_, i, n, e.reportAllChanges), Qr(function() {
        return s();
      });
    }));
  });
}, He = { passive: !0, capture: !0 }, dc = new Date(), Hs = function(r, e) {
  qt || (qt = e, Ne = r, gn = new Date(), yn(removeEventListener), wn());
}, wn = function() {
  if (Ne >= 0 && Ne < gn - dc) {
    var r = { entryType: "first-input", name: qt.type, target: qt.target, cancelable: qt.cancelable, startTime: qt.timeStamp, processingStart: qt.timeStamp + Ne };
    or.forEach(function(e) {
      e(r);
    }), or = [];
  }
}, mc = function(r) {
  if (r.cancelable) {
    var e = (r.timeStamp > 1e12 ? new Date() : performance.now()) - r.timeStamp;
    r.type == "pointerdown" ? function(s, n) {
      var i = function() {
        Hs(s, n), u();
      }, a = function() {
        u();
      }, u = function() {
        removeEventListener("pointerup", i, He), removeEventListener("pointercancel", a, He);
      };
      addEventListener("pointerup", i, He), addEventListener("pointercancel", a, He);
    }(e, r) : Hs(e, r);
  }
}, yn = function(r) {
  ["mousedown", "keydown", "touchstart", "pointerdown"].forEach(function(e) {
    return r(e, mc, He);
  });
}, fc = function(r, e) {
  e = e || {}, Te(function() {
    var s, n = [100, 300], i = Vr(), a = mt("FID"), u = function(p) {
      p.startTime < i.firstHiddenTime && (a.value = p.processingStart - p.startTime, a.entries.push(p), s(!0));
    }, h = function(p) {
      p.forEach(u);
    }, _ = ke("first-input", h);
    s = ft(r, a, n, e.reportAllChanges), _ && vr(function() {
      h(_.takeRecords()), _.disconnect();
    }, !0), _ && se(function() {
      var p;
      a = mt("FID"), s = ft(r, a, n, e.reportAllChanges), or = [], Ne = -1, qt = null, yn(addEventListener), p = u, or.push(p), wn();
    });
  });
}, bn = 0, Br = 1 / 0, rr = 0, gc = function(r) {
  r.forEach(function(e) {
    e.interactionId && (Br = Math.min(Br, e.interactionId), rr = Math.max(rr, e.interactionId), bn = rr ? (rr - Br) / 7 + 1 : 0);
  });
}, kn = function() {
  return Nr ? bn : performance.interactionCount || 0;
}, vc = function() {
  "interactionCount" in performance || Nr || (Nr = ke("event", gc, { type: "event", buffered: !0, durationThreshold: 0 }));
}, Tn = 0, Is = function() {
  return kn() - Tn;
}, xt = [], Cr = {}, Ns = function(r) {
  var e = xt[xt.length - 1], s = Cr[r.interactionId];
  if (s || xt.length < 10 || r.duration > e.latency) {
    if (s)
      s.entries.push(r), s.latency = Math.max(s.latency, r.duration);
    else {
      var n = { id: r.interactionId, latency: r.duration, entries: [r] };
      Cr[n.id] = n, xt.push(n);
    }
    xt.sort(function(i, a) {
      return a.latency - i.latency;
    }), xt.splice(10).forEach(function(i) {
      delete Cr[i.id];
    });
  }
}, _c = function(r, e) {
  e = e || {}, Te(function() {
    var s = [200, 500];
    vc();
    var n, i = mt("INP"), a = function(h) {
      h.forEach(function(f) {
        f.interactionId && Ns(f), f.entryType === "first-input" && !xt.some(function(w) {
          return w.entries.some(function(l) {
            return f.duration === l.duration && f.startTime === l.startTime;
          });
        }) && Ns(f);
      });
      var _, p = (_ = Math.min(xt.length - 1, Math.floor(Is() / 50)), xt[_]);
      p && p.latency !== i.value && (i.value = p.latency, i.entries = p.entries, n());
    }, u = ke("event", a, { durationThreshold: e.durationThreshold || 40 });
    n = ft(r, i, s, e.reportAllChanges), u && (u.observe({ type: "first-input", buffered: !0 }), vr(function() {
      a(u.takeRecords()), i.value < 0 && Is() > 0 && (i.value = 0, i.entries = []), n(!0);
    }), se(function() {
      xt = [], Tn = kn(), i = mt("INP"), n = ft(r, i, s, e.reportAllChanges);
    }));
  });
}, Mr = {}, wc = function(r, e) {
  e = e || {}, Te(function() {
    var s, n = [2500, 4e3], i = Vr(), a = mt("LCP"), u = function(p) {
      var f = p[p.length - 1];
      if (f) {
        var w = Math.max(f.startTime - gr(), 0);
        w < i.firstHiddenTime && (a.value = w, a.entries = [f], s());
      }
    }, h = ke("largest-contentful-paint", u);
    if (h) {
      s = ft(r, a, n, e.reportAllChanges);
      var _ = function() {
        Mr[a.id] || (u(h.takeRecords()), h.disconnect(), Mr[a.id] = !0, s(!0));
      };
      ["keydown", "click"].forEach(function(p) {
        addEventListener(p, _, { once: !0, capture: !0 });
      }), vr(_, !0), se(function(p) {
        a = mt("LCP"), s = ft(r, a, n, e.reportAllChanges), Qr(function() {
          a.value = performance.now() - p.timeStamp, Mr[a.id] = !0, s(!0);
        });
      });
    }
  });
}, yc = function r(e) {
  document.prerendering ? Te(function() {
    return r(e);
  }) : document.readyState !== "complete" ? addEventListener("load", function() {
    return r(e);
  }, !0) : setTimeout(e, 0);
}, bc = function(r, e) {
  e = e || {};
  var s = [800, 1800], n = mt("TTFB"), i = ft(r, n, s, e.reportAllChanges);
  yc(function() {
    var a = Wr();
    if (a) {
      var u = a.responseStart;
      if (u <= 0 || u > performance.now())
        return;
      n.value = Math.max(u - gr(), 0), n.entries = [a], i(!0), se(function() {
        n = mt("TTFB", 0), (i = ft(r, n, s, e.reportAllChanges))(!0);
      });
    }
  });
};
class jr extends at {
  constructor(e) {
    super(e, "performance"), y(this, "performanceData", null);
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
      let n = {
        cls: null,
        lcp: null,
        ttfb: null,
        fcp: null,
        fid: null,
        inp: null
      };
      setTimeout(() => {
        const a = performance.timing, u = {
          ...n,
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
      }, 1e4), wc((a) => {
        i(a);
      }), pc((a) => {
        i(a);
      }), bc((a) => {
        i(a);
      }), _n((a) => {
        i(a);
      }), fc((a) => {
        i(a);
      }), _c((a) => {
        i(a);
      });
      const i = (a) => {
        a.name === "FID" ? n.fid = a.value : a.name === "CLS" ? n.cls = a.value : a.name === "FCP" ? n.fcp = a.value : a.name === "TTFB" ? n.ttfb = a.value : a.name === "LCP" ? n.lcp = a.value : a.name === "INP" && (n.inp = a.value);
      };
    });
  }
}
const kc = async (r) => {
  const e = new jr(r);
  await e.track(), r.addLogByEvent(e);
}, Tc = () => {
  jr.startApaasTrackHook = (r) => {
    kc(r);
  }, Bt.registerEvent("performance", jr);
};
class js extends at {
  constructor(e) {
    super(e, "throw"), y(this, "message", ""), y(this, "detailmessage", ""), y(this, "name", ""), y(this, "stack", []), y(this, "cause", {});
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
    const s = qr(e);
    this.message = s.message, this.detailmessage = s.detail, this.name = s.name, this.stack = s.stack;
  }
}
const Sc = (r) => {
  window.addEventListener("error", (e) => {
    const s = Ot(r, "throw");
    s.setError(e.error), r.addLogByEvent(s);
  }), window.addEventListener("unhandledrejection", (e) => {
    const s = Ot(r, "throw");
    s.setError(e.reason), r.addLogByEvent(s);
  });
}, Pc = () => {
  js.startApaasTrackHook = (r) => {
    Sc(r);
  }, Bt.registerEvent("throw", js);
}, Lc = () => {
  Tc(), Pc(), Xo();
}, Ec = (r) => {
  Lc(), hc(), Jo(), (r == null ? void 0 : r.http) !== !1 && Zo(typeof (r == null ? void 0 : r.http) == "object" ? r.http : void 0), r != null && r.click && No(
    typeof r.click == "object" ? r.click : void 0
  ), r != null && r.online && cc(
    typeof r.online == "object" ? r.online : void 0
  );
}, xc = (r) => (Ec(r), Bc(r)), Bc = (r) => new Bt(r);
class te {
  constructor(e, s, n) {
    y(this, "_level", 0), this.apaasTrack = e, this.type = s, n && (this._level = n);
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
      url: ye()
    };
  }
}
y(te, "eventOptions"), y(te, "initApaasTrackHook"), y(te, "startApaasTrackHook"), y(te, "destroyApaasTrackHook");
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
    super(e, "custom"), y(this, "info", {});
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
const _e = {
  init: Cc,
  custom: Mc
}, ir = (r, e) => {
  const s = _e[e];
  return new s(r);
}, Rc = (r, e, s) => {
  const n = s || Date.now(), i = ir(r, e);
  return {
    ...r.baseLog,
    types: e,
    logtime: String(n),
    epochnanos: String(n) + "000000",
    event: e,
    properties: i.getProperties(),
    url: ye()
  };
}, Us = (r, e, s) => {
  const n = s || Date.now();
  return {
    ...r.baseLog,
    types: e.type,
    logtime: String(n),
    epochnanos: String(n) + "000000",
    event: e.type,
    properties: e.getProperties(),
    url: ye()
  };
}, Sn = (r, e) => {
  if (_e[r])
    throw Error(`\u8BE5\u4E8B\u4EF6${r} \u5DF2\u5B58\u5728\uFF0C\u6CE8\u518C\u5931\u8D25`);
  _e[r] = e;
};
class Dc {
  constructor(e, s) {
    y(this, "name", ""), y(this, "time", 0), y(this, "info", {}), e && (this.name = e), s && (this.info = s), this.time = Date.now();
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
    super(...arguments), y(this, "name", "exception"), y(this, "exceptionType", ""), y(this, "exceptionMessage", ""), y(this, "exceptionStackTrace", "");
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
class Kr extends te {
  constructor(e, s, n) {
    super(e, "span"), y(this, "spanid", ""), y(this, "traceid", ""), y(this, "parentspanid", ""), y(this, "name", ""), y(this, "attributes", {}), y(this, "events", []), y(this, "statuscode", "OK"), y(this, "statusmessage", ""), y(this, "startTime", 0), y(this, "endTime", 0), this.name = s, this.traceid = we(), this.spanid = qs(), this.parentspanid = n || "", this.start();
  }
  trackLog() {
    this.apaasTrack.addLogByEvent(this);
  }
  createSpanEvent(e, s) {
    return new Kr(
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
    let n = "", i = "", a = "";
    if (e instanceof Error) {
      const u = qr(e);
      n = u.detail, i = u.name, a = u.stack.join(",");
    } else
      n = e.exceptionMessage, i = e.exceptionType, a = e.exceptionStackTrace;
    s.setInfo({
      exceptionMessage: n,
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
class Pn {
  constructor(e) {
    y(this, "_version", sr), y(this, "commonLog", null), y(this, "browserLog", null), y(this, "options"), this.options = e, typeof window < "u" && (window.__apaasTrackVersion__ = sr), typeof wx < "u" && !window && (wx.__apaasTrackVersion__ = sr), e.commonLog && this.initCommonLog(e.commonLog), this.runEventInitHooks();
  }
  registerEvent(e, s) {
    Sn(e, s), s.initApaasTrackHook && s.initApaasTrackHook(this), s.startApaasTrackHook && s.startApaasTrackHook(this);
  }
  get groupid() {
    var e;
    return (e = this.browserLog) == null ? void 0 : e.distinctid;
  }
  runEventInitHooks() {
    Object.values(_e).forEach(
      (e) => {
        e.initApaasTrackHook && e.initApaasTrackHook(this);
      }
    );
  }
  runEventStartHooks() {
    Object.values(_e).forEach(
      (e) => {
        e.startApaasTrackHook && e.startApaasTrackHook(this);
      }
    );
  }
  runEventDestroyHooks() {
    Object.values(_e).forEach(
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
    const n = this.createEventLog(e, s);
    this.addLogToQueue(n);
  }
  addLogByEvent(e, s) {
    const n = Us(this, e, s);
    this.addLogToQueue(n);
  }
  createCustomEvent(e) {
    const s = ir(this, "custom");
    return s.setCustomType(e), s;
  }
  createSpanEvent(e, s) {
    return new Kr(this, e, s);
  }
  addLogByCustomEvent(e, s = {}, n) {
    const i = this.createCustomEvent(e);
    i.setProperties(s);
    const a = Us(this, i, n);
    this.addLogToQueue(a);
  }
  executeInitEvent() {
    const e = ir(this, "init");
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
  trackEvent(e, s = {}, n) {
    const i = ir(this, e);
    i.setProperties(s), this.addLogByEvent(i, n);
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
  async addLogToQueue(e, s = !1, n = !0) {
    n && (e = this.transformLog(e)), await this.sendLog(e, s);
  }
}
y(Pn, "registerEvent", Sn);
const Oc = async (r) => {
  var i, a;
  let e = await r.getWebInitParams();
  const s = location.origin + "/static/apaas-track/apaas-spu/lzma_worker.js";
  console.log("createApaasTrack lzma_worker", s), Pi(s);
  const n = xc({
    url: r.url || "",
    click: {
      trackElementPath: !0
    },
    commonLog: {
      client: "Web",
      ...e
    },
    online: (r == null ? void 0 : r.online) || !1,
    pageview: !0,
    http: (i = r.http) != null ? i : !0,
    zip: r.zip !== void 0 ? r.zip : !0,
    useIndexDB: (a = r == null ? void 0 : r.useIndexDB) != null ? a : !1
  });
  return n.sendLog = r.sendLog, n.start = function(...u) {
    return Pn.prototype.start.call(this, ...u);
  }, r.sendLog === Ln && (n.start = function(...u) {
    return Bt.prototype.start.call(this, ...u);
  }), r.startFn && (n.start = r.startFn), n;
};
let Rr = null;
const Hc = async (r) => {
  var s, n, i;
  if (Rr)
    return Rr;
  const e = await Oc({
    url: (r == null ? void 0 : r.url) || "",
    sendLog: (r == null ? void 0 : r.sendLog) || Ln,
    startFn: (r == null ? void 0 : r.startFn) || null,
    online: (r == null ? void 0 : r.online) || !1,
    getWebInitParams: (r == null ? void 0 : r.getWebInitParams) || zc,
    zip: (s = r == null ? void 0 : r.zip) != null ? s : !0,
    useIndexDB: (n = r == null ? void 0 : r.useIndexDB) != null ? n : !1,
    http: (i = r == null ? void 0 : r.http) != null ? i : !0
  });
  return Rr = e, e;
}, zc = () => new Promise((r, e) => {
  if (window.aPaaS && window.aPaaS.getWebInitParams) {
    const s = window.aPaaS.getWebInitParams(
      (n) => {
        r(n);
      }
    );
    s && s.then && s.then((n) => {
      r(n);
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
          r(u), n && (clearTimeout(n), n = null), window.removeEventListener(
            "message",
            s
          );
        } else
          e(Error("receiveWebInitParams response null"));
    };
    window.addEventListener("message", s);
    let n = window.setTimeout(() => {
      e(Error("postMessage getWebInitParams timeout"));
    }, 2e3);
  }
});
function Ic(...r) {
  return Bt.prototype.start.call(this, r);
}
function Ln(r, e) {
  var s;
  return (s = window.aPaaS) != null && s.sendLog ? window.aPaaS.sendLog(r, e) : Bt.prototype.sendLog.call(this, r, e);
}
export {
  at as BaseEvent,
  Fc as BaseSpanAttribute,
  ur as BaseTrack,
  li as CustomEvent,
  Qs as EventLevel,
  fe as EventMap,
  mi as ExceptionSpanEvent,
  hi as InitEvent,
  $r as SpanEvent,
  di as SpanPropertyEvent,
  ui as TaskQueue,
  Oc as createApaasTrack,
  Ot as createEvent,
  zc as defaultGetWebInitParams,
  Ln as defaultWebSendFunction,
  Ic as defaultWebStartFunction,
  Hc as getApaasSpuTrack,
  _s as getEventLog,
  pi as getEventLogByType,
  Vs as registerEvent
};
