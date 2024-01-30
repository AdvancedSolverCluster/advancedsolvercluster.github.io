

function insertAvatar() {
  let article = document.getElementById("main-content");
  if (article) {
    let hyperlinks = article.getElementsByTagName("a");
    for (let hyperlink of hyperlinks) {
      // let hyperlink = hyperlinks[i];
      if (hyperlink.href &&
        hyperlink.href.startsWith("mailto")) {
        let mail = hyperlink.href.substring(7).toLowerCase().trim();
        let hashed = CryptoJS.MD5(mail).toString();
        let img = document.createElement("img");
        img.src = 'https://www.gravatar.com/avatar/' + hashed + '?s=24';
        img.style.borderRadius = '50%';
        // add left and right padding
        img.style.paddingLeft = '8px';
        img.style.paddingRight = '8px';
        img.alt = "";
        hyperlink.appendChild(img);
      }
    }
  }
};


function hideAdminArea() {
  // Select the parent element with the 'site-nav' ID
  var siteNav = document.getElementById('site-nav');

  // Select all <ul> elements with the class 'nav-list' within the 'site-nav' element
  var navLists = siteNav.querySelectorAll('ul.nav-list');

  // Function to check recursively if any descendants have the 'active' class
  function hasActiveDescendant(element) {
    // Base case: If the current element has the 'active' class
    if (element.classList.contains('active')) {
      return true;
    }
    // Recursively check children
    for (var child of element.children) {
      if (hasActiveDescendant(child)) {
        return true; // Found an active descendant
      }
    }
    // No active descendants were found
    return false;
  }

  // Iterate through each <ul> element
  navLists.forEach(function (navList) {
    // Check if the <ul> is exactly after a div with the 'nav-category' class
    var prevSibling = navList.previousElementSibling;
    if (prevSibling && prevSibling.classList.contains('nav-category')) {
      // Check if any descendant of the <ul> has the 'active' class
      var hasActiveChild = hasActiveDescendant(navList);

      // Add or remove the 'hidden' class on the div.nav-category based on whether an active descendant was found
      if (hasActiveChild) {
        prevSibling.classList.remove('hidden');
      } else {
        prevSibling.classList.add('hidden');
      }
    }
  });

  jtd.addEvent(document, 'click', function (e) {
    var target = e.target;
    // Navigate up the DOM tree until you find the clicked 'nav-category' or reach the top
    while (target && !(target.classList && target.classList.contains('nav-category'))) {
      target = target.parentNode;
    }
    // If a 'nav-category' was indeed clicked
    if (target) {
      e.preventDefault(); // Prevent default behavior if needed
      target.classList.toggle('hidden');
    }
  });
}

// when DOM is ready
jtd.onReady(function () {
  insertAvatar();
  hideAdminArea();
});

