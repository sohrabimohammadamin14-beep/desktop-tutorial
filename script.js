"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1. منوی موبایل
  // =========================

  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector("#main-nav");

  if (menuToggle && mainNav) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "باز کردن منو");
      mainNav.classList.remove("is-open");
    };

    const openMenu = () => {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "بستن منو");
      mainNav.classList.add("is-open");
    };

    menuToggle.addEventListener("click", () => {
      const isExpanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (
        isOpen &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // =========================
  // 2. مدیریت تصاویر خراب
  // =========================

  const images = document.querySelectorAll(".project-image");

  images.forEach((img) => {
    const showFallback = () => {
      const isMainImage = img.classList.contains(
        "main-project-image"
      );

      img.hidden = true;

      if (isMainImage) {
        const frame = img.closest(".hero-image-frame");
        const fallback = frame?.querySelector(".image-fallback");

        if (fallback) {
          fallback.hidden = false;
        }

        return;
      }

      const wrapper = img.closest(".gallery-image-wrap");

      if (wrapper && !wrapper.querySelector(".missing-image-message")) {
        const message = document.createElement("div");

        message.className = "missing-image-message";
        message.textContent = "تصویر هنوز اضافه نشده است.";

        message.style.cssText = [
          "width:100%",
          "height:100%",
          "min-height:140px",
          "padding:20px",
          "display:flex",
          "align-items:center",
          "justify-content:center",
          "text-align:center",
          "color:#74766b",
          "font-size:12px",
          "line-height:2"
        ].join(";");

        wrapper.appendChild(message);
      }
    };

    img.addEventListener("error", showFallback);

    // اگر تصویر قبل از اجرای این کد خراب شده باشد
    if (img.complete && img.naturalWidth === 0) {
      showFallback();
    }
  });

  // =========================
  // 3. گالری و نمایش بزرگ عکس
  // =========================

  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const lightboxCaption = document.querySelector(".lightbox-caption");
  const lightboxClose = document.querySelector(".lightbox-close");

  if (
    lightbox &&
    lightboxImage &&
    lightboxCaption &&
    lightboxClose
  ) {
    const galleryButtons = document.querySelectorAll(
      ".gallery-card[data-full-image]"
    );

    let previousFocus = null;

    const closeLightbox = () => {
      if (typeof lightbox.close === "function" && lightbox.open) {
        lightbox.close();
      } else {
        lightbox.removeAttribute("open");
      }
    };

    galleryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const imagePath = button.dataset.fullImage;
        const imageAlt = button.dataset.imageAlt || "تصویر ربات";

        if (!imagePath) {
          return;
        }

        previousFocus = button;

        lightboxImage.hidden = false;
        lightboxImage.alt = imageAlt;
        lightboxImage.src = imagePath;
        lightboxCaption.textContent = imageAlt;

        if (typeof lightbox.showModal === "function") {
          if (!lightbox.open) {
            lightbox.showModal();
          }
        } else {
          lightbox.setAttribute("open", "");
        }

        lightboxClose.focus();
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
      // کلیک روی فضای بیرون تصویر، پنجره را می‌بندد.
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    lightbox.addEventListener("close", () => {
      lightboxImage.removeAttribute("src");
      lightboxImage.alt = "";
      lightboxCaption.textContent = "";

      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }

      previousFocus = null;
    });

    lightboxImage.addEventListener("error", () => {
      lightboxImage.hidden = true;
      lightboxCaption.textContent =
        "این تصویر پیدا نشد. نام فایل و مسیر آن را بررسی کن.";
    });
  }
});