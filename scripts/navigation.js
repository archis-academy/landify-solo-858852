(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");

  // Bail out if the markup is missing or the script was already initialised
  if (!toggle || !nav || toggle.dataset.navReady === "true") return;
  toggle.dataset.navReady = "true";

  // Keep in sync with the `max-width: 992px` breakpoint in header.css
  const desktopQuery = window.matchMedia("(min-width: 993px)");

  const isOpen = () => nav.classList.contains("is-open");

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(!isOpen()));

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  });

  // Close when clicking outside the menu or following one of its links
  document.addEventListener("click", (event) => {
    if (!isOpen() || toggle.contains(event.target)) return;
    if (!nav.contains(event.target) || event.target.closest("a")) setOpen(false);
  });

  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
})();
