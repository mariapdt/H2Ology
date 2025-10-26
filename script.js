// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

// Debugging switch for carousel behavior
const CAROUSEL_DEBUG = true;
function clog(...args) {
  if (CAROUSEL_DEBUG) console.log("[carousel]", ...args);
}

// Water Calculator Function
function calculateWater() {
  const weightInput = document.getElementById("weight");
  const resultDiv = document.getElementById("result");
  const weight = parseFloat(weightInput.value);

  // Validate input
  if (!weight || weight <= 0 || weight > 300) {
    resultDiv.innerHTML = `
            <div style="color: #e74c3c; font-size: 1.1rem;">
                ⚠️ Introdu o greutate validă între 1 și 300 kg
            </div>
        `;
    return;
  }

  // Calculate water intake (Body weight in kg × 0.033)
  const waterNeeded = (weight * 0.033).toFixed(2);
  const waterInML = (waterNeeded * 1000).toFixed(0);
  const waterInCups = (waterNeeded * 4.22).toFixed(1); // 1 liter ≈ 4.22 cups

  // Display result with animation
  resultDiv.innerHTML = `
    <div class="result-text">Ar trebui să bei aproximativ:</div>
    <div class="result-number">${waterNeeded} L</div>
    <div style="font-size: 1.1rem; color: #007ea7; margin-top: 1rem;">
      Asta înseamnă aproximativ ${waterInML} ml sau ${waterInCups} pahare pe zi
    </div>
    <div style="margin-top: 1.5rem; padding: 1rem; background: #e8f8f5; border-radius: 8px; color: #00695c;">
      💧 <strong>Sfat util:</strong> Cu sticla ta inteligentă H2Ology vei primi memento-uri personalizate ca să atingi acest obiectiv!
    </div>
  `;
}

// Allow Enter key to calculate
document.getElementById("weight")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    calculateWater();
  }
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#") {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  });
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    navbar.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
  }

  lastScroll = currentScroll;
});

// Animate cards on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all cards
document.addEventListener("DOMContentLoaded", () => {
  initCarousels();

  // Then setup animations for non-carousel cards only (avoid carousel reload effect)
  const cards = document.querySelectorAll(".value-card, .app-feature");
  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });

  // Recompute sizes on resize to keep alignment exact
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initCarousels(true);
    }, 150);
  });
});

// Update visibility using minimal changes: only toggle cards that enter/leave
function updateCarouselVisibility(type) {
  const grid = document.querySelector(`.${type}-grid`);
  const wrapper = document.querySelector(`.${type}-grid-wrapper`);
  if (!grid || !wrapper) return;

  const state = carouselStates[type];
  const allCards = wrapper.querySelectorAll(
    type === "features"
      ? ".feature-card"
      : type === "tips"
      ? ".tip-card"
      : ".sustainability-card"
  );
  if (!allCards.length || !state.cardWidth || !state.gap) return;

  const totalCards = allCards.length;
  const originalCount = Math.max(1, Math.floor(totalCards / 2));

  const gridStyles = getComputedStyle(grid);
  const gridPadLeft = parseFloat(gridStyles.paddingLeft || "0") || 0;
  const gridPadRight = parseFloat(gridStyles.paddingRight || "0") || 0;
  const containerWidth = grid.clientWidth - gridPadLeft - gridPadRight;

  const ratio = (containerWidth + state.gap) / (state.cardWidth + state.gap);
  const visibleCount = Math.min(3, Math.max(1, Math.round(ratio)));
  clog(
    `${type} visibility: container=${containerWidth.toFixed(
      2
    )}, card=${state.cardWidth?.toFixed?.(2)}, gap=${
      state.gap
    }, ratio=${ratio.toFixed(3)}, visibleCount=${visibleCount}`
  );

  const start =
    ((state.currentIndex % originalCount) + originalCount) % originalCount;
  const newVisible = new Set();
  for (let k = 0; k < visibleCount; k++) {
    newVisible.add((start + k) % originalCount);
  }

  const prev = state.lastVisible instanceof Set ? state.lastVisible : null;

  if (!prev) {
    // First run: hide everything not in newVisible
    clog(`${type} initial visible set ->`, Array.from(newVisible).join(", "));
    allCards.forEach((card, i) => {
      const logical = i % originalCount;
      if (newVisible.has(logical)) {
        card.classList.remove("carousel-hidden");
        card.classList.remove("carousel-entering");
      } else {
        card.classList.remove("carousel-entering");
        card.classList.add("carousel-hidden");
      }
    });
  } else {
    // Toggle only deltas to avoid reloading all three cards
    // Leave cards
    const leaving = [];
    prev.forEach((idx) => {
      if (!newVisible.has(idx)) {
        leaving.push(idx);
        // hide all clones of this logical index
        allCards.forEach((card, i) => {
          if (i % originalCount === idx) {
            card.classList.remove("carousel-entering");
            card.classList.add("carousel-hidden");
          }
        });
      }
    });
    // Enter cards
    const entering = [];
    newVisible.forEach((idx) => {
      if (!prev.has(idx)) {
        entering.push(idx);
        // show all clones of this logical index
        allCards.forEach((card, i) => {
          if (i % originalCount === idx) {
            card.classList.remove("carousel-hidden");
            // mark entering to allow fade-in only for the new one
            card.classList.add("carousel-entering");
            // clean up the entering class after the fade completes
            setTimeout(() => card.classList.remove("carousel-entering"), 700);
          }
        });
      }
    });
    clog(
      `${type} visibility delta -> leaving: [${leaving.join(
        ", "
      )}] entering: [${entering.join(", ")}] (start=${start})`
    );
  }

  state.lastVisible = newVisible;
}

// Initialize or re-initialize carousels; if reinit=true, don't clone again
function initCarousels(reinit = false) {
  ["features", "tips", "sustainability"].forEach((type) => {
    const wrapper = document.querySelector(`.${type}-grid-wrapper`);
    const grid = document.querySelector(`.${type}-grid`);
    if (!wrapper || !grid) return;

    const state = carouselStates[type];

    // --- Mobile swipe/touch support ---
    let touchStartX = null;
    let touchEndX = null;
    // Remove previous listeners to avoid duplicates
    wrapper.ontouchstart = null;
    wrapper.ontouchend = null;
    wrapper.ontouchmove = null;
    wrapper.addEventListener('touchstart', function(e) {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
      }
    }, {passive: true});
    wrapper.addEventListener('touchend', function(e) {
      if (touchStartX !== null && e.changedTouches.length === 1) {
        touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;
        if (Math.abs(deltaX) > 40) {
          if (deltaX < 0) scrollCarousel(type, 1); // swipe left, next
          else scrollCarousel(type, -1); // swipe right, prev
        }
      }
      touchStartX = null;
      touchEndX = null;
    }, {passive: true});
    // --- End mobile swipe/touch support ---

    // Measure available width inside the viewport (exclude grid side paddings)
    const gridStyles = getComputedStyle(grid);
    const gridPadLeft = parseFloat(gridStyles.paddingLeft || "0") || 0;
    const gridPadRight = parseFloat(gridStyles.paddingRight || "0") || 0;
    const containerWidth = grid.clientWidth - gridPadLeft - gridPadRight;
    let gapSize = type === "tips" ? 32 : 40;
    let cardWidth;
    let cardsPerView = 3;
    if (window.innerWidth <= 600) {
      cardsPerView = 1;
    } else if (window.innerWidth <= 1024) {
      cardsPerView = 2;
    }
    cardWidth = (containerWidth - gapSize * (cardsPerView - 1)) / cardsPerView;
    // Remove extra padding, keep layout identical to desktop
    if (wrapper) {
      wrapper.style.paddingLeft = '';
      wrapper.style.paddingRight = '';
       if (cardsPerView <= 2) {
        wrapper.style.paddingTop = '60px';
        wrapper.style.paddingBottom = '60px';
      } else {
        wrapper.style.paddingTop = '24px';
        wrapper.style.paddingBottom = '24px';
      }
    }

    clog(
      `${type} init: container=${containerWidth.toFixed(
        2
      )}, gap=${gapSize}, cardWidth=${cardWidth.toFixed(2)}, reinit=${reinit}`
    );

    // Apply exact width to all existing children
    Array.from(wrapper.children).forEach((child) => {
      child.style.minWidth = `${cardWidth}px`;
      child.style.flex = `0 0 ${cardWidth}px`;
    });

    // Clone only once on first init
    if (!reinit && !wrapper.dataset.cloned) {
      const originals = Array.from(wrapper.children);
      clog(`${type} cloning once: originals=${originals.length}`);
      originals.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.style.minWidth = `${cardWidth}px`;
        clone.style.flex = `0 0 ${cardWidth}px`;
        wrapper.appendChild(clone);
      });
      wrapper.dataset.cloned = "true";
    }

    // Store precise measurements to avoid rounding mismatches
    const firstCard = wrapper.querySelector(
      type === "features"
        ? ".feature-card"
        : type === "tips"
        ? ".tip-card"
        : ".sustainability-card"
    );
    if (firstCard) {
      const measuredWidth = firstCard.getBoundingClientRect().width;
      const computedStyles = getComputedStyle(wrapper);
      const gap =
        parseFloat(
          computedStyles.columnGap || computedStyles.gap || gapSize + ""
        ) || gapSize;
      const padLeft = parseFloat(computedStyles.paddingLeft || "0") || 0;
      // Prefer computed width to keep math consistent across devices
      state.cardWidth = cardWidth;
      state.gap = gap;
      state.padLeft = padLeft;
      state.delta = Math.max(padLeft - gap, 0); // correction so previous card never peeks
      clog(
        `${type} measure: measuredWidth=${measuredWidth.toFixed(
          2
        )}, state.cardWidth=${state.cardWidth.toFixed(
          2
        )}, gap=${gap}, padLeft=${padLeft}, delta=${state.delta}`
      );

      // Reapply current transform based on measured values
      const translateX =
        -(state.currentIndex * (state.cardWidth + state.gap)) - state.delta;
      wrapper.style.transition = "none";
      wrapper.style.transform = `translateX(${Math.floor(translateX)}px)`;
      // ensure only the fully visible cards are actually visible
      updateCarouselVisibility(type);
    }
  });
}

// Carousel functionality for feature cards, tips, and sustainability cards
const carouselStates = {
  features: { currentIndex: 0, isTransitioning: false },
  tips: { currentIndex: 0, isTransitioning: false },
  sustainability: { currentIndex: 0, isTransitioning: false },
};

function scrollCarousel(type, direction) {
  const state = carouselStates[type];
  if (state.isTransitioning) return; // Prevent rapid clicks

  const grid = document.querySelector(`.${type}-grid`);
  const wrapper = document.querySelector(`.${type}-grid-wrapper`);
  if (!wrapper || !grid) {
    console.error(`Wrapper or grid not found for ${type}`);
    return;
  }

  // If sizes were not measured yet (edge case), initialize once
  if (!state.cardWidth || !state.gap) {
    initCarousels(true);
  }

  const allCards = wrapper.querySelectorAll(
    type === "features"
      ? ".feature-card"
      : type === "tips"
      ? ".tip-card"
      : ".sustainability-card"
  );

  clog(
    `scroll ${type}: cards=${allCards.length}, index(before)=${state.currentIndex}, dir=${direction}`
  );

  const totalCards = allCards.length;
  const originalCount = totalCards / 2; // Half are clones

  state.isTransitioning = true;
  state.currentIndex += direction;

  // Use measured width and gap to avoid any rounding drift
  const gridStyles2 = getComputedStyle(grid);
  const gridPadLeft2 = parseFloat(gridStyles2.paddingLeft || "0") || 0;
  const gridPadRight2 = parseFloat(gridStyles2.paddingRight || "0") || 0;
  const cardWidth =
    state.cardWidth ??
    (grid.clientWidth -
      gridPadLeft2 -
      gridPadRight2 -
      2 * (type === "tips" ? 32 : 40)) /
      3;
  const gapSize = state.gap ?? (type === "tips" ? 32 : 40);
  const delta = state.delta ?? Math.max((state.padLeft ?? 0) - gapSize, 0);
  const containerWidth = grid.clientWidth - gridPadLeft2 - gridPadRight2; // for logging/debugging only
  let translateX = -(state.currentIndex * (cardWidth + gapSize)) - delta;

  // Seamless left wrap: if moving left from the first item, pre-jump to the end clones, then animate one step left
  if (state.currentIndex < 0) {
    // Jump instantly to the equivalent position in the cloned section at the end
    wrapper.style.transition = "none";
    const preIndex = originalCount; // first item in the clone section
    const preX = -(preIndex * (cardWidth + gapSize)) - delta;
    state.currentIndex = preIndex; // logical temp position
    wrapper.style.transform = `translateX(${Math.floor(preX)}px)`;
    clog(
      `${type} left wrap pre-jump -> preIndex=${preIndex}, preX=${Math.floor(
        preX
      )}`
    );
    // Force reflow to apply the non-animated jump before we animate
    void wrapper.offsetHeight;

    // Now animate one step left to show the last original item seamlessly
    state.currentIndex = preIndex - 1;
    translateX = -(state.currentIndex * (cardWidth + gapSize)) - delta;
    clog(
      `${type} left wrap animate -> index=${
        state.currentIndex
      }, translateX=${Math.floor(translateX)}`
    );
  }

  clog(
    `${type} dims: container=${containerWidth.toFixed(
      2
    )}, card=${cardWidth.toFixed(2)}, gap=${gapSize}, delta=${delta}, index=${
      state.currentIndex
    }, translateX=${Math.floor(translateX)}`
  );

  wrapper.style.transition = "transform 0.5s ease";
  wrapper.style.transform = `translateX(${Math.floor(translateX)}px)`;
  // Visibility update is deferred to the end of the transition for smooth fade
  // Defer visibility update to after transition for a smoother fade-out
  // Update visibility during movement so peeking cards are hidden
  updateCarouselVisibility(type);

  // After transition, reset position if needed for infinite effect
  setTimeout(() => {
    wrapper.style.transition = "none";

    // If we scrolled past the original cards, reset to beginning
    let didReset = false;
    if (state.currentIndex >= originalCount) {
      console.log(`Resetting ${type} to beginning`);
      state.currentIndex = 0;
      wrapper.style.transform = `translateX(${-delta}px)`;
      didReset = true;
    }
    // If we scrolled before first card, jump to end of original set
    else if (state.currentIndex < 0) {
      console.log(`Resetting ${type} to end`);
      state.currentIndex = originalCount - 1;
      const resetX = -(state.currentIndex * (cardWidth + gapSize)) - delta;
      wrapper.style.transform = `translateX(${Math.floor(resetX)}px)`;
      didReset = true;
    }

    // Final visibility update; only suppress fades if we had to reset (wrap)
    if (didReset) {
      clog(
        `${type} post-reset -> index=${state.currentIndex}, didReset=${didReset}`
      );
      wrapper.classList.add("carousel-no-fade");
      updateCarouselVisibility(type);
      void wrapper.offsetHeight;
      setTimeout(() => wrapper.classList.remove("carousel-no-fade"), 0);
    } else {
      clog(
        `${type} post-move -> index=${state.currentIndex}, didReset=${didReset}`
      );
      updateCarouselVisibility(type);
    }
    state.isTransitioning = false;
  }, 500);
}
