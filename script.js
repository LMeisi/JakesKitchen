// console.log("hello world me");

///////Make Mobile Navigation Work

// Element Definition
const btnNavEl = document.querySelector(".btn-mobile-nav"); //Mobile Menu button
const headerEl = document.querySelector(".header"); //header element

//Add eventlistner to menu button; If button clicked, add 'nav-open' to header element if not present; remove otherwise
btnNavEl.addEventListener("click", function () {
  // Toggle 'nav-open': if class not there, add it; If there, remove it
  // NOTE: don't use 'dot' here, only name of the class
  headerEl.classList.toggle("nav-open");
});

///////////////////////////////////////////////////////////
// Smooth Scrolling Animation

// Select all anchor elements with links - returns a nodelist
const allLinks = document.querySelectorAll("a:link");

// For each of the elements ('link') of the nodelist, execute the funtion with the current element assigned to 'link'
// i.e. Add add eventlistener to each of the elements
allLinks.forEach(function (link) {
  // For each link, add eventlistner; When clicked on the link, listener function will execute
  link.addEventListener("click", function (e) {
    // Prevent the default operation of scrolling to the section upon anchor click
    e.preventDefault();

    // Assign the anchor's href value to the variable 'href'
    // e.g. '#meals"
    // Link represents the button you clicked on
    const href = link.getAttribute("href");

    // '#' will scroll back to top
    if (href === "#")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    // For all other links (i.e. links that starts with # but not only #)
    if (href !== "#" && href.startsWith("#")) {
      // Good TRICK: utilize anchor's 'href' value as the id selector to select the section that corresponds to the href value
      const sectionEl = document.querySelector(href);

      // Cannot use 'scrollTo' here as we don't know which pixel to scroll to here
      // scrollIntoView will scroll the viewport to sectionEl
      sectionEl.scrollIntoView({ behavior: "smooth" });
    }

    // Close mobile navigation upon click of the link
    // If link (element you clicked on) has 'main-nav-link' class (i.e. one of the (mobile expanded) nav links was clicked on), execute the code
    if (link.classList.contains("main-nav-link"))
      // Remove the expanded menu if present
      // NOTE: When it's outside mobile scope, below will execute but nothing will be done because 'nav-open' isn't present outside mobile scope
      // Jonas's class uses 'toggle', but that is a bug cuz it doesn't take care of the cases outside of the mobile scope
      headerEl.classList.remove("nav-open");
  });
});

///////////////////////////////////////////////////////////
// Sticky Navigation

// Element definition: section-hero
const sectionFrontEl = document.querySelector(".section-front");

// set up a new observer object ('obs'), which observes the hero section element
const obs = new IntersectionObserver(
  function (entries) {
    // define the intersection event as 'ent'
    const ent = entries[0]; // entries is an array, now we only use the first element
    // When observer meets threshold, below will be logged in console

    // console.log(ent); // for checking in console: the intersection event is an object

    // If event's 'isIntersecting' property is false, hero section has left the viewport, sticky header will appear
    if (ent.isIntersecting === false)
      //NOTE: Add the sticky class to the body element, so all child elements could utilize 'sticky' to add new formats (for sticky nav)
      // Since we have to move the hero section margin upon adding sticky class, we have to make sure hero section format can be changed upon adding sticky, so sticky should be added to body (which includes the hero section)
      document.body.classList.add("sticky");

    // If 'isIntersecting' property is true, hero section is scrolled into (and reaching 80px height in viewport), sticky nav will be removed
    if (ent.isIntersecting === true) document.body.classList.remove("sticky");
  },
  // Below is like a condition, if met, above will be executed
  {
    // Inside the viewport
    root: null, // Usually default, set to null meaning we observe the element inside the viewport (and not in some other element)
    threshold: 0, // Event will fire as soon as section to be observed occupies 0% of the viewport (could be from up scrolling down or opposite)
    // Adding rootMargin will add more condition to the above threshold
    rootMargin: "-80px", //Event will fire exactly now as hero-section is exactly 80px (8rem, height of header) above the threshold (i.e. when hero-section has 80px left in the viewport)
  }
);

// The intersectionObserver object is now observing the section hero
// When hero section moves in/out of viewport, IntersectionObserver object will appear in console
// As the hero section moves into the viewport, 'isIntersecting' value is false; If moves out of the viewport, 'isIntersecting' value is true;
obs.observe(sectionFrontEl);

///////////////////////////////////////////////////////////
// Favorite Dishes Section - Slider, buttons, and dots
// Code copied and revised from Ancient Chinese Poems

// Element Definitions

// Slider Elements
const slides = document.querySelectorAll(".slide"); //nodelist of slides
const btnLeft = document.querySelector(".slider__btn__left");
const btnRight = document.querySelector(".slider__btn__right");
const dotContainer = document.querySelector(".dots");

// Slider Variables
let curSlide = 0;
const maxSlide = slides.length; //return length of nodelist

// Slider Functions

/// Create Dots
const createDots = function () {
  //Based on number of slides, create the number of dots
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>` //BE CAREFUL with where "" are!!
    );
  });
};

/// Highlight dot that corresponds to the slide being moved to (active dot)
const activateDot = function (slide) {
  //First, remove active class from all dots
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot__active"));

  //Second, add the active class to the dot we want to activate
  //Selecting the 'dots__dot' class element with the 'data-slide' attribute equal to the slide number to be set active
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot__active");
};

////Go to the slide being specified (target slide Number) (actually moving all slides at the same time, to the right/left)
const goToSlide = function (slide) {
  //slide is the 'curSlide' argument passed in
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
  );
};

////Increment slide counter and call goToSlide function
const nextSlide = function () {
  //Check if already reaching the end of the slider using counter, if so, return to initial position
  if (curSlide === maxSlide - 1) curSlide = 0;
  else curSlide++;

  goToSlide(curSlide); //Move slides to updated current slide number
  activateDot(curSlide); //Highlight dot that corresponds to the updated current slide number
};

////Decrement slide counter and call goToSlide function
const prevSlide = function () {
  //Check if already reaching the end of the slider using counter, if so, return to initial position
  if (curSlide === 0) curSlide = maxSlide - 1;
  else curSlide--;

  goToSlide(curSlide); //Move slides to updated current slide number
  activateDot(curSlide); //Highlight dot that corresponds to the updated current slide number
};

////////////Create Slider initial conditions
const init = function () {
  goToSlide(0); //Set initial slide position to first slide
  createDots(); //Create dots
  activateDot(0); //Activate first dot
};

///////////Call the initial conditions function
init();

/////Event handlers - Button click to call nextSlide/prevSlide functions
btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

//////Keyboard event to slide - Left and Right keys
document.addEventListener("keydown", function (e) {
  //Check e.key, contains text value, if it equals to the text value we specify
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === "ArrowRight") nextSlide();
});

/////Event handlers - Dot click
// e.target is the element that the event happens onto (which is the clicked dot)
dotContainer.addEventListener("click", function (e) {
  //Utilize dots__dot's data-slide attribute to return the slide number to go to
  if (e.target.classList.contains("dots__dot")) {
    const slideNum = e.target.dataset.slide;

    // Go to the slide that the dot corresponds to
    goToSlide(slideNum); // Moving the slides based on target slideNum
    activateDot(slideNum); // Highlight the dot corresponding to activated slide (CSS format change)
  }
});

/////////////////////////////////////////////////////////////////////////////

// Tabs Elements Definition
const tabs = document.querySelectorAll(".btn--tab"); //node list of all tabs
const tabsContainer = document.querySelector(".tabs--container");
const tabsContent = document.querySelectorAll(".tabs--content"); //node list of all tab contents

tabsContainer.addEventListener("click", function (e) {
  //Set variable for clicked element
  const clicked = e.target;

  // If click happened on one of the tabs, perform below; otherwise (if click happened in container's empty space), nothing will happen
  if (clicked.classList.contains("btn--tab")) {
    //Remove active class from all tabs, add active class to the selected tab
    tabs.forEach((t) => t.classList.remove("btn--tab--active"));
    clicked.classList.add("btn--tab--active");

    //Change tab content accordingly, Remove active from all content first
    tabsContent.forEach((t) => t.classList.remove("tabs--content--active"));
    //Add active to the selected content
    //Select corresponding operation content element by using element.dataset.tab
    //Remember in button element there is an attribute: 'data-tab='1' (or 2, 3)
    //'data' can be refered to using .dataset, 'tab' using .tab
    //clicked.dataset.tab will return the number corresponding to the button (i.e. 1, 2, or 3)
    //Use that number to refer to the selected content to add active class to
    // console.log(clicked.dataset.tab);
    document
      .querySelector(`.tabs--content--${clicked.dataset.tab}`)
      .classList.add("tabs--content--active");
  }
});

///////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions

/* Since some Safari browsers don't support gap property for flexbox, we have to manually add the gap properties to the flexboxes in CSS */
/* Below code when executed, will add the 'no-flexbox-gap' class to body, thus triggering the 'no-flexbox-gap' class related formats to apply (all flex gap related) */

function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);
  console.log(isSupported);

  // If browser doesn't support, add below class to body
  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();
