/* Falcon public-site analytics.
 * The project token and ingestion host are injected at deploy time from
 * GitHub Actions repository variables; neither value is committed to source.
 * Do not enable session replay or capture form fields / user-entered payloads.
 */
(function () {
  "use strict";
  var config = window.FALCON_POSTHOG_CONFIG || {};
  if (!config.projectToken || !config.apiHost || window.posthog && window.posthog.__loaded) return;

  !function (t, e) {
    var o, n, p, r;
    e.__SV || (window.posthog && window.posthog.__loaded) || (
      window.posthog = e,
      e._i = [],
      e.init = function (i, s, a) {
        function g(t, e) {
          var o = e.split(".");
          2 == o.length && (t = t[o[0]], e = o[1]);
          t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); };
        }
        p || ((p = t.createElement("script")).type = "text/javascript",
          p.crossOrigin = "anonymous", p.async = true,
          p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js",
          p.onerror = function () { p = null; },
          (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r));
        var u = e;
        void 0 !== a ? u = e[a] = [] : a = "posthog";
        u.people = u.people || [];
        Object.defineProperty(u, "toString", { configurable: true, enumerable: true, writable: true, value: function (t) {
          var e = "posthog"; return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e;
        }});
        Object.defineProperty(u.people, "toString", { configurable: true, enumerable: true, writable: true, value: function () { return u.toString(1) + ".people (stub)"; }});
        o = "capture register register_once register_for_session unregister opt_out_capturing has_opted_out_capturing reset isFeatureEnabled getFeatureFlag getFeatureFlagPayload reloadFeatureFlags".split(" ");
        for (n = 0; n < o.length; n++) g(u, o[n]);
        e._i.push([i, s, a]);
      },
      e.__SV = 1
    );
  }(document, window.posthog || []);

  window.posthog.init(config.projectToken, {
    api_host: config.apiHost,
    defaults: "2026-08-30",
    capture_pageview: true,
    autocapture: false,
    disable_session_recording: true
  });

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || typeof target.closest !== "function") return;
    var link = target.closest("a[href]");
    if (!link) return;
    var destination;
    try { destination = new URL(link.href, window.location.href); } catch (_) { return; }
    var isExternal = destination.origin !== window.location.origin;
    var isProductPath = /\/products\//.test(destination.pathname);
    if (!isExternal && !isProductPath) return;
    window.posthog.capture("outbound_link_clicked", {
      page_path: window.location.pathname,
      destination: destination.origin + destination.pathname,
      link_label: (link.textContent || "").trim().slice(0, 80)
    });
  });

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || typeof target.closest !== "function") return;
    var button = target.closest("button");
    if (button && /run contract tests/i.test(button.textContent || "")) {
      window.posthog.capture("contract_test_run", { page_path: window.location.pathname });
    }
  });

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (form && form.id === "tx-form") {
      window.posthog.capture("payment_confirmation_submitted", { page_path: window.location.pathname });
    }
  });
})();
