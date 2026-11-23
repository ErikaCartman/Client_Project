/*
  UMSI Engaged Learning Office — shared site script
  SI 539 Client Project, Deliverable 3 (tablet/desktop)

  Citations:
  - Dynamic copyright year pattern from CodexWorld:
    https://www.codexworld.com/how-to/get-current-year-to-display-dynamic-year-in-copyright-using-javascript/
  - Scroll-spy / IntersectionObserver TOC pattern informed by MDN:
    https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
*/

(function () {
  "use strict";

  /* ---- Dynamic copyright year ---- */
  var year = new Date().getFullYear();
  var yearNodes = document.querySelectorAll(".js-year");
  for (var i = 0; i < yearNodes.length; i++) {
    yearNodes[i].textContent = String(year);
  }

  /* ---- On-this-page TOC + scroll spy (challenging element) ---- */
  var tocRoot = document.querySelector("[data-page-toc]");
  if (!tocRoot) {
    return;
  }

  var headings = document.querySelectorAll(".site-main .section > h2");
  if (!headings.length) {
    tocRoot.hidden = true;
    return;
  }

  var list = document.createElement("ul");
  list.className = "page-toc-list";

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  var observed = [];

  for (var h = 0; h < headings.length; h++) {
    var heading = headings[h];
    if (!heading.id) {
      var base = slugify(heading.textContent || "section");
      var id = base;
      var n = 2;
      while (document.getElementById(id)) {
        id = base + "-" + n;
        n += 1;
      }
      heading.id = id;
    }

    var item = document.createElement("li");
    var link = document.createElement("a");
    link.href = "#" + heading.id;
    link.textContent = heading.textContent;
    item.appendChild(link);
    list.appendChild(item);
    observed.push({ id: heading.id, link: link, el: heading });
  }

  var title = document.createElement("p");
  title.className = "page-toc-title";
  title.textContent = "On this page";
  tocRoot.appendChild(title);
  tocRoot.appendChild(list);

  if (!("IntersectionObserver" in window)) {
    return;
  }

  var activeId = "";

  function setActive(id) {
    if (id === activeId) {
      return;
    }
    activeId = id;
    for (var j = 0; j < observed.length; j++) {
      if (observed[j].id === id) {
        observed[j].link.setAttribute("aria-current", "true");
      } else {
        observed[j].link.removeAttribute("aria-current");
      }
    }
  }

  var observer = new IntersectionObserver(
    function (entries) {
      var visible = entries
        .filter(function (entry) {
          return entry.isIntersecting;
        })
        .sort(function (a, b) {
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });
      if (visible.length) {
        setActive(visible[0].target.id);
      }
    },
    {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.25, 1]
    }
  );

  for (var k = 0; k < observed.length; k++) {
    observer.observe(observed[k].el);
  }
})();
