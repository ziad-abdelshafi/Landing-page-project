/**
 * Define Global Variables
 *
 */

// global variables won't be assigned beacuse here because the DOM hasn't loaded
let prevSectionsNum = 0;
let sectionDivs = document.querySelectorAll(".landing__container");
let currSectionsNum = sectionDivs.length;

let prevActiveSection = document.querySelector(".your-active-class");
let prevActiveNavItem = document.querySelector(".menu__link");

let navList = document.getElementById("navbar__list");

/**
 * End Global Variables
 * Start Helper Functions
 *
 */

// function to set multiple attributes at a time
function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

// returns trues if the section occupies more than half the viewport vertically
function isInViewport(sec) {
  const rect = sec.getBoundingClientRect();
  return (
    ((rect.top >= 0 &&
      rect.top <=
        (window.innerHeight / 2 ||
          document.documentElement.clientHeight / 2)) ||
      (rect.bottom >=
        (window.innerHeight / 2 || document.documentElement.clientHeight / 2) &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight))) &&
    rect.left >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav bar
function createDynamicNav(sectionIdx) {
  let navListFragment = new DocumentFragment();
  for (; sectionIdx < currSectionsNum; ++sectionIdx) {
    let section = sectionDivs[sectionIdx].parentElement;
    const navListItemLink = document.createElement("a");
    navListItemLink.textContent = section.getAttribute("data-nav");
    setAttributes(navListItemLink, {
      href: `#${section.getAttribute("id")}`,
      id: `navbar__item${sectionIdx + 1}`,
      class: "menu__link",
    });

    let navListItem = document.createElement("li");
    navListItem.appendChild(navListItemLink);
    navListFragment.appendChild(navListItem);
  }

  navList.appendChild(navListFragment);
}

// Add active class to section when near top of viewport and to the nav item pointing to the section
function addActiveClass() {
  if (!isInViewport(prevActiveSection)) {
    for (const sectionDiv of sectionDivs) {
      let section = sectionDiv.parentElement;
      if (isInViewport(section)) {
        // Add active class to section
        prevActiveSection.classList.remove("your-active-class");
        section.classList.add("your-active-class");
        prevActiveSection = section;

        // Get the nav item pointing to the section
        let sectionNavItemId = section.id.slice(-1);
        let sectionNavItem = document.getElementById(
          `navbar__item${sectionNavItemId}`
        );

        // Add acrive class to that nav item
        prevActiveNavItem.classList.remove("menu__link-active");
        sectionNavItem.classList.add("menu__link-active");
        prevActiveNavItem = sectionNavItem;
      }
    }
  }
}

// Scroll to anchor ID using scrollTO event
function scrollToClickedSection(evt) {
  evt.preventDefault();
  const href = evt.target.getAttribute("href");
  const offsetTop = document.querySelector(href).offsetTop;

  window.scrollTo({
    top: offsetTop,
    behavior: "smooth",
  });
}

/**
 * End Main Functions
 * Begin Events
 *
 */

// The code is inside a DOMContentLoaded event listener so we can put the script tag in the head
document.addEventListener("DOMContentLoaded", () => {
  navList = document.getElementById("navbar__list");

  // Build menu
  sectionDivs = document.querySelectorAll(".landing__container");
  currSectionsNum = sectionDivs.length;
  createDynamicNav(prevSectionsNum);
  prevSectionsNum = currSectionsNum;

  // Check every 500ms to see if a new section has been added to the page
  window.setInterval(() => {
    sectionDivs = document.querySelectorAll(".landing__container");
    currSectionsNum = sectionDivs.length;
    if (currSectionsNum > prevSectionsNum) {
      createDynamicNav(prevSectionsNum);
      prevSectionsNum = currSectionsNum;
    }
  }, 500);

  // Set sections as active
  prevActiveSection = document.querySelector(".your-active-class");
  prevActiveNavItem = document.querySelector(".menu__link");
  prevActiveNavItem.classList.add("menu__link-active");

  document.addEventListener("scroll", addActiveClass);

  // Scroll to section on link click
  navList.addEventListener("click", scrollToClickedSection);

  // Hide nav bar while not scrolling and not hover over it
  let timer = null;
  let canHideNav = true;
  const pageHeader = document.querySelector(".page__header");
  pageHeader.addEventListener("mouseenter", function () {
    canHideNav = false;
  });
  pageHeader.addEventListener("mouseleave", function () {
    canHideNav = true;
  });
  document.addEventListener("scroll", function () {
    if (timer !== null) {
      clearTimeout(timer);
      pageHeader.classList.remove("page__header--hidden");
    }
    timer = setTimeout(function () {
      if (canHideNav) {
        pageHeader.classList.add("page__header--hidden");
      }
    }, 1500);
  });
});
