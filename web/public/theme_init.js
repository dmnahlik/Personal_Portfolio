/* Runs in <head> before first paint: restores the saved theme and
   marks JS as available (so .reveal animations are enabled). */
(function () {
  var root = document.documentElement;
  root.classList.remove("no-js");
  try {
    var t = localStorage.getItem("theme");
    if (t === "light" || t === "dark") root.setAttribute("data-theme", t);
  } catch (e) {
    /* storage unavailable: fall back to the OS preference */
  }
})();
