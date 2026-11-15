/* 20at archive: the time machine's bar, at the top of every saved front page (pipeline/timemachine.py puts
   <script src="/js/tm-bar.js" data-site data-day data-ts data-wb> first thing in the page's body).
   It lives in a shadow root so the old page's styles and the bar's never touch each other. It shows which
   site and which day this is; moves to the previous or next saved day, to a picked date (the nearest saved
   day), to a design period, to today's date in the site's final year, to the last update, or to another
   site; and says what the page is, with the same capture on the Wayback Machine. Data: /data/tm.json. */
(function () {
  "use strict";
  var me = document.currentScript;
  if (!me) return;
  var site = me.getAttribute("data-site"), day = me.getAttribute("data-day"), wb = me.getAttribute("data-wb");
  var D = "٠١٢٣٤٥٦٧٨٩", ar = function (s) { return String(s).replace(/\d/g, function (d) { return D[d]; }); };
  var M = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  var WD = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  var fmt = function (d) { return ar(+d.slice(6, 8)) + " " + M[+d.slice(4, 6) - 1] + " " + ar(d.slice(0, 4)); };
  var wd = function (d) { return WD[new Date(Date.UTC(+d.slice(0, 4), +d.slice(4, 6) - 1, +d.slice(6, 8))).getUTCDay()]; };
  var go = function (s, d) { location.href = "/tm/" + s + "/" + (d ? (/^\d{8}$/.test(d) ? d + "/" : "?d=" + d) : ""); };
  // any day, saved or not: /tm/<site>/?d= opens that site's nearest saved day
  var goNear = function (s, d) { location.href = "/tm/" + s + "/?d=" + d; };
  var SHOW_DATE_PICKER = false;   // the date field is hidden for now (user's choice, 2026-11-14); kept for later

  // the Noto fonts the archive uses (font-face rules only: the old page's own styles stay as they were)
  if (!document.querySelector('link[href="/css/fonts-noto.css"]')) {
    var fl = document.createElement("link");
    fl.rel = "stylesheet"; fl.href = "/css/fonts-noto.css";
    (document.head || document.documentElement).appendChild(fl);
  }
  var host = document.createElement("div");
  host.setAttribute("data-tm-bar", "");
  host.style.cssText = "all: initial; display: block; position: sticky; top: 0; z-index: 2147483647;";
  // outside <body>: some old scripts rewrite document.body.innerHTML (Silverlight.js), which would wipe it
  var de = document.documentElement;
  de.insertBefore(host, document.body && document.body.parentNode === de ? document.body : de.firstChild);
  var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;

  var css = [
    ":host { all: initial; }",
    ".bar { direction: rtl; font: 13px/1.6 'Noto Kufi Arabic', 'Segoe UI', sans-serif; color: #FFFFFF;",
    "  background: #0F2A3D; box-shadow: 0 2px 6px rgba(0,0,0,.3); text-align: right; }",
    ".row { max-width: 1120px; margin: 0 auto; padding: 6px 16px; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; }",
    ".row + .row { padding-top: 0; }",
    "a { color: #FFFFFF; text-decoration: none; } a:hover { text-decoration: underline; }",
    "a:focus-visible, button:focus-visible, select:focus-visible, input:focus-visible { outline: 2px solid #FFCC00; outline-offset: 2px; }",
    ".home { font-weight: 700; white-space: nowrap; }",
    ".tm { padding: 1px 8px; border: 1px solid #FFCC00; color: #FFCC00; font-size: 12px; white-space: nowrap; }",
    "select { max-width: 16em; }",
    "select, input, button { font: inherit; font-size: 13px; color: #FFFFFF; background: #1C4058; border: 1px solid #3D6680; padding: 3px 8px; min-height: 32px; box-sizing: border-box; }",
    "button { cursor: pointer; } button:disabled { opacity: .4; cursor: default; }",
    "input[type=date] { color-scheme: dark; }",
    ".dial { display: flex; align-items: center; gap: 4px; margin-inline-start: auto; }",
    ".dial button { width: 32px; padding: 0; }",
    ".day { min-width: 13em; text-align: center; padding: 4px 10px; background: #FFCC00; color: #111111; font-weight: 700; }",
    ".ghost { background: transparent; }",
    ".periods { display: flex; flex-wrap: wrap; gap: 4px; flex: 1; align-items: center; }",
    ".jumps { display: flex; flex-wrap: wrap; gap: 6px; }",
    ".jumps button { font-size: 12px; min-height: 26px; padding: 1px 10px; }",
    ".periods span.l { opacity: .75; font-size: 12px; margin-inline-end: 4px; }",
    ".periods button { font-size: 12px; min-height: 26px; padding: 1px 8px; background: transparent; }",
    ".periods button[aria-pressed=true] { background: #FFCC00; color: #111111; border-color: #FFCC00; }",
    ".note { font-size: 12px; opacity: .85; }",
    ".note a { color: #FFE680; text-decoration: underline; }",
    "[hidden] { display: none !important; }",
    ".sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }",
    "@media (max-width: 640px) { .dial { margin-inline-start: 0; } .day { min-width: 0; } .row { padding: 6px 12px; } .periods { flex-basis: 100%; } }"
  ].join("\n");

  var el = function (tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  };

  var style = document.createElement("style");
  style.textContent = css;
  root.appendChild(style);
  var bar = el("div", { "class": "bar", role: "region", "aria-label": "آلة الزمن", lang: "ar", dir: "rtl" });
  root.appendChild(bar);
  // until the data arrives: where this is, and the honest line
  var top = el("div", { "class": "row" }, [
    el("a", { "class": "home", href: "/", text: "→ أرشيف عشرينات" }),
    el("a", { "class": "tm", href: "/time-machine/", text: "آلة الزمن" }),
    el("span", { "class": "day", text: wd(day) + " " + fmt(day) })
  ]);
  bar.appendChild(top);
  var redrawn = me.getAttribute("data-redrawn") === "1";
  var note = el("div", { "class": "row note" }, [
    el("span", { text: "الصفحة الأولى كما حفظها أرشيف الإنترنت يوم " + fmt(day) + ". ما لم يُحفظ من صورها يظهر فراغًا، والمقالات تُفتح في الأرشيف. " +
      (redrawn ? "بعض عناصر شكلها (الألوان والخلفيات والرأس) لم يحفظها الأرشيف أبدًا، فأعدنا رسمها تقريبًا مما بقي منها. " : "") }),
    el("a", { href: wb, rel: "noopener", text: "اللقطة نفسها على أرشيف الإنترنت ↗" })
  ]);
  bar.appendChild(note);

  fetch("/data/tm.json").then(function (r) { return r.json(); }).then(function (data) {
    var s = null;
    data.sites.forEach(function (x) { if (x.key === site) s = x; });
    if (!s) return;
    var i = s.days.indexOf(day);
    var sel = el("select", { id: "tm-site", onchange: function () { goNear(sel.value, day); } });
    data.sites.forEach(function (x) {
      var o = el("option", { value: x.key, text: x.name, title: x.host });
      if (x.key === site) o.selected = true;
      sel.appendChild(o);
    });
    var pick = el("input", { type: "date", id: "tm-date", value: day.slice(0, 4) + "-" + day.slice(4, 6) + "-" + day.slice(6),
      min: s.days[0].replace(/(\d{4})(\d\d)(\d\d)/, "$1-$2-$3"), max: s.days[s.days.length - 1].replace(/(\d{4})(\d\d)(\d\d)/, "$1-$2-$3"),
      onchange: function () { if (pick.value) goNear(site, pick.value.replace(/-/g, "")); } });
    pick.hidden = !SHOW_DATE_PICKER;
    // the arrows point outwards, away from the date: the earlier day on the right (the bar reads right to left).
    // dir="ltr" so the browser does not mirror ‹ › as it does in right-to-left text
    var prev = el("button", { type: "button", dir: "ltr", "aria-label": "اليوم المحفوظ السابق", text: "›",
      onclick: function () { go(site, s.days[i - 1]); } });
    var next = el("button", { type: "button", dir: "ltr", "aria-label": "اليوم المحفوظ التالي", text: "‹",
      onclick: function () { go(site, s.days[i + 1]); } });
    prev.disabled = i <= 0; next.disabled = i < 0 || i >= s.days.length - 1;
    var last = s.days[s.days.length - 1];
    top.textContent = "";
    [el("a", { "class": "home", href: "/", text: "→ أرشيف عشرينات" }),
     el("a", { "class": "tm", href: "/time-machine/", text: "آلة الزمن" }),
     el("label", { "for": "tm-site", "class": "sr", text: "الموقع" }), sel,
     el("div", { "class": "dial" }, [prev,
       el("span", { "class": "day", "aria-live": "polite",
         text: wd(day) + " " + fmt(day) + (day === last ? " · آخر تحديث" : "") }), next]),
     SHOW_DATE_PICKER ? el("label", { "for": "tm-date", "class": "sr", text: "اختيار يوم" }) : null, pick
    ].forEach(function (n) { if (n) top.appendChild(n); });
    // second row: the design periods (each run of saved days with the same look), then the jumps
    var periods = s.periods.length > 1 ? el("div", { "class": "periods", role: "group", "aria-label": "أشكال الموقع عبر السنين" },
      [el("span", { "class": "l", text: "أشكال الموقع:" })].concat(s.periods.map(function (p) {
        var on = day >= p[0] && day <= p[1];
        var y0 = p[0].slice(0, 4), y1 = p[1].slice(0, 4);
        var label = y0 === y1 ? M[+p[0].slice(4, 6) - 1] + " " + ar(y0) : ar(y0) + "–" + ar(y1);
        return el("button", { type: "button", "aria-pressed": on ? "true" : "false", title: fmt(p[0]) + " – " + fmt(p[1]),
          text: label, onclick: function () { go(site, p[0]); } });
      }))) : el("div", { "class": "periods" });
    var jumps = el("div", { "class": "jumps" }, [
      el("button", { type: "button", "class": "ghost", text: "اليوم، في آخر سنواته",
        onclick: function () { go(site, s["default"]); } }),
      el("button", { type: "button", "class": "ghost", text: "آخر تحديث", onclick: function () { go(site, last); } }),
      el("button", { type: "button", "class": "ghost", text: "يوم عشوائي",
        onclick: function () { go(site, s.days[Math.floor(Math.random() * s.days.length)]); } })]);
    bar.insertBefore(el("div", { "class": "row" }, [periods, jumps]), note);
  })["catch"](function () {});
})();
