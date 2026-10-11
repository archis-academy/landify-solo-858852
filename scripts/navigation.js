(() => {
  const toggle = document.querySelector(".nav-toggle");

  // Bail out if the markup is missing or the script was already initialised
  if (!toggle || toggle.dataset.navReady === "true") return;

  // The toggle shows/hides every element listed in its aria-controls (nav + badges)
  const panels = (toggle.getAttribute("aria-controls") || "")
    .split(/\s+/)
    .map((id) => id && document.getElementById(id))
    .filter(Boolean);

  if (panels.length === 0) return;
  toggle.dataset.navReady = "true";

  // Keep in sync with the `max-width: 992px` breakpoint in header.css
  const desktopQuery = window.matchMedia("(min-width: 993px)");

  let isOpen = false;

  const setOpen = (open) => {
    isOpen = open;
    panels.forEach((panel) => panel.classList.toggle("is-open", open));
    toggle.setAttribute("aria-expanded", String(open));
  };

  // event.target is not guaranteed to be an Element (e.g. a text node, or an
  // event dispatched on document), so resolve it before using Element APIs
  const toElement = (target) => {
    if (target instanceof Element) return target;
    if (target instanceof Node) return target.parentElement;
    return null;
  };

  toggle.addEventListener("click", () => setOpen(!isOpen));

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isOpen) return;
    setOpen(false);
    toggle.focus();
  });

  // Close when clicking outside the menu or following one of its links
  document.addEventListener("click", (event) => {
    if (!isOpen) return;

    const target = toElement(event.target);
    if (target && toggle.contains(target)) return;

    const insideMenu = target && panels.some((panel) => panel.contains(target));
    if (!insideMenu || target.closest("a")) setOpen(false);
  });

  const closeOnDesktop = (event) => {
    if (event.matches) setOpen(false);
  };

  // Safari < 14 only supports the deprecated addListener API
  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", closeOnDesktop);
  } else {
    desktopQuery.addListener(closeOnDesktop);
  }
})();
