document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Shared Data and Functions ---

  // Array of package objects for dynamic rendering and calculations
  const packages = [
    {
      id: "paris",
      destination: "Paris, France",
      durationDays: 7,
      basePrice: 150000,
      season: "Peak", // Peak, Off-Peak
      largeImage: "images/paris.jpeg",
      caption: "Romantic Paris",
    },
    {
      id: "tokyo",
      destination: "Tokyo, Japan",
      durationDays: 8,
      basePrice: 180000,
      season: "Peak",
      largeImage: "images/tokyo.jpeg",
      caption: "Vibrant Tokyo",
    },
    {
      id: "bali",
      destination: "Bali, Indonesia",
      durationDays: 6,
      basePrice: 120000,
      season: "Off-Peak",
      largeImage: "images/bali.jpeg",
      caption: "Relaxing Bali",
    },
  ];

  /**
   * Calculates the final price based on seasonal demand.
   * Peak season has a 15% surcharge.
   * @param {object} pkg - The package object.
   * @returns {number} The calculated final price.
   */
  function calculateFinalPrice(pkg) {
    let finalPrice = pkg.basePrice;
    switch (pkg.season) {
      case "Peak":
        finalPrice *= 1.15; // 15% surcharge for peak season
        break;
      case "Off-Peak":
        finalPrice *= 0.9; // 10% discount for off-peak season
        break;
    }
    return Math.round(finalPrice);
  }

  // --- 2. Navigation Highlighting (Runs on all pages) ---

  /**
   * Highlights the current page's link in the navigation bar.
   */
  function highlightActiveNav() {
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll("#nav-bar li a");

    navLinks.forEach((link) => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  highlightActiveNav(); // Call on every page load

  // --- 3. Packages Page Logic ---

  /**
   * Renders the travel packages table from the packages array.
   */
  function renderPackagesTable() {
    const tableBody = document.getElementById("packages-tbody");
    if (!tableBody) return; // Exit if not on the packages page

    tableBody.innerHTML = ""; // Clear existing static content

    packages.forEach((pkg) => {
      const finalPrice = calculateFinalPrice(pkg);
      const row = `
                <tr>
                    <td>${pkg.destination}</td>
                    <td>${pkg.basePrice.toLocaleString("en-IN")}</td>
                    <td>${pkg.durationDays} Days</td>
                    <td>${
                      pkg.season
                    } Season</td> <td>${finalPrice.toLocaleString("en-IN")}</td>
                </tr>
            `;
      tableBody.innerHTML += row;
    });
  }

  renderPackagesTable();

  // --- 4. Booking Page Price Estimator ---

  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    const packageSelect = document.getElementById("package");
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const guestsInput = document.getElementById("guests");
    const promoCodeInput = document.getElementById("promo-code");
    const estimatedPriceEl = document.getElementById("estimated-price");
    const submitButton = document.getElementById("submit-btn");

    // Populate package options dynamically
    packages.forEach((pkg) => {
      const option = document.createElement("option");
      option.value = pkg.id;
      option.textContent = `${
        pkg.destination.split(",")[0]
      } - ${pkg.basePrice.toLocaleString("en-IN")} INR`;
      packageSelect.appendChild(option);
    });

    /**
     * Calculates and displays the estimated booking price live.
     */
    function updateBookingPrice() {
      const packageId = packageSelect.value;
      const startDate = new Date(startDateInput.value);
      const endDate = new Date(endDateInput.value);
      const guests = parseInt(guestsInput.value, 10);
      const promoCode = promoCodeInput.value.trim().toUpperCase();

      // Validation
      const isValid =
        packageId &&
        startDateInput.value &&
        endDateInput.value &&
        endDate > startDate &&
        guests > 0;

      if (!isValid) {
        estimatedPriceEl.textContent = "Please fill all fields correctly.";
        submitButton.disabled = true;
        return;
      }

      submitButton.disabled = false;

      // Calculation
      const selectedPackage = packages.find((p) => p.id === packageId);
      const nights = (endDate - startDate) / (1000 * 60 * 60 * 24);
      let total =
        selectedPackage.basePrice * (nights / selectedPackage.durationDays); // Pro-rate price based on duration

      // Guest multiplier
      if (guests > 2) {
        total += total * 0.2 * (guests - 2); // +20% for each guest above 2
      }

      // Promo code logic
      switch (promoCode) {
        case "EARLYBIRD":
          total *= 0.9; // 10% discount
          break;
        case "WANDERLUST25":
          total -= 5000; // 5,000 INR off
          break;
      }

      estimatedPriceEl.textContent = `Estimated Total: ${Math.round(
        total
      ).toLocaleString("en-IN")} INR`;
    }

    // Event listeners to trigger live price update
    bookingForm.addEventListener("change", updateBookingPrice);
    bookingForm.addEventListener("keyup", updateBookingPrice);
    updateBookingPrice(); // Initial call
  }

  // --- 5. Gallery Page Modal Logic ---

  const gallery = document.querySelector(".gallery");
  if (gallery) {
    // Dynamically create gallery from packages data
    gallery.innerHTML = ""; // Clear static gallery
    packages.forEach((pkg) => {
      const figure = document.createElement("figure");
      figure.setAttribute("data-large", pkg.largeImage);
      figure.setAttribute("data-caption", pkg.caption);
      figure.innerHTML = `
                <img src="${pkg.largeImage}" alt="${pkg.caption}">
                <figcaption>${pkg.caption}</figcaption>
            `;
      gallery.appendChild(figure);
    });

    // Create and append the modal structure to the body
    const modal = document.createElement("div");
    modal.id = "gallery-modal";
    modal.className = "modal";
    modal.innerHTML = `
            <span class="modal-close">&times;</span>
            <img class="modal-content" id="modal-image">
            <div class="modal-caption" id="modal-caption-text"></div>
        `;
    document.body.appendChild(modal);

    const modalImage = document.getElementById("modal-image");
    const modalCaption = document.getElementById("modal-caption-text");
    const closeBtn = document.querySelector(".modal-close");

    gallery.addEventListener("click", (e) => {
      const figure = e.target.closest("figure");
      if (figure) {
        modal.style.display = "block";
        modalImage.src = figure.dataset.large;
        modalImage.alt = figure.dataset.caption;
        modalCaption.textContent = figure.dataset.caption;
      }
    });

    const closeModal = () => {
      modal.style.display = "none";
    };

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        // Close if clicking on the background
        closeModal();
      }
    });
  }
});
