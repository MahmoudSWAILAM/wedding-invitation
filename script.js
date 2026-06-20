/* ============================================
   Malek & Reem — Wedding Invitation behaviors
   ============================================ */

(function () {
  "use strict";

  /* ---------- Background music ---------- */
  var bgMusic = document.getElementById("bgMusic");
  var musicToggle = document.getElementById("musicToggle");
  var noteIcon = musicToggle ? musicToggle.querySelector(".music-toggle__icon--note") : null;
  var muteIcon = musicToggle ? musicToggle.querySelector(".music-toggle__icon--mute") : null;

  function setMusicUI(isPlaying) {
    if (!musicToggle) return;
    musicToggle.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
    if (noteIcon) noteIcon.hidden = isPlaying ? false : true;
    if (muteIcon) muteIcon.hidden = isPlaying ? true : false;
  }

  function tryPlayMusic() {
    if (!bgMusic) return;
    var playAttempt = bgMusic.play();
    if (playAttempt && typeof playAttempt.then === "function") {
      playAttempt
        .then(function () { setMusicUI(true); })
        .catch(function () { setMusicUI(false); }); // autoplay blocked; user can tap the toggle
    } else {
      setMusicUI(true);
    }
  }

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener("click", function () {
      if (bgMusic.paused) {
        tryPlayMusic();
      } else {
        bgMusic.pause();
        setMusicUI(false);
      }
    });
  }

  /* ---------- Envelope intro ---------- */
  var envelopeIntro = document.getElementById("envelopeIntro");
  var envelopeButton = document.getElementById("envelopeButton");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasOpened = false;

  document.documentElement.classList.add("no-scroll");

  function revealHeroElements() {
    var heroEls = document.querySelectorAll(".hero-reveal");
    heroEls.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add("is-visible");
      }, prefersReducedMotion ? 0 : i * 110);
    });
  }

  function openEnvelope() {
    if (hasOpened) return;
    hasOpened = true;

    tryPlayMusic();

    if (prefersReducedMotion) {
      envelopeIntro.classList.add("is-hidden");
      document.documentElement.classList.remove("no-scroll");
      revealHeroElements();
      setTimeout(function () {
        envelopeIntro.style.display = "none";
      }, 250);
      return;
    }

    envelopeButton.classList.add("is-opening");
    envelopeButton.setAttribute("aria-disabled", "true");

    setTimeout(function () {
      envelopeIntro.classList.add("is-hidden");
      document.documentElement.classList.remove("no-scroll");
      revealHeroElements();
    }, 1300);

    setTimeout(function () {
      envelopeIntro.style.display = "none";
      envelopeIntro.setAttribute("aria-hidden", "true");
    }, 2100);
  }

  if (envelopeIntro && envelopeButton) {
    envelopeButton.addEventListener("click", openEnvelope);
    envelopeButton.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openEnvelope();
      }
    });
  } else {
    document.documentElement.classList.remove("no-scroll");
  }

  /* ---------- Countdown (runs once, never loops) ---------- */
  // Wedding moment: June 30th, 8:00 PM, Cairo time (UTC+3)
  var WEDDING_DATE = new Date("2026-06-30T20:00:00+03:00").getTime();

  var elDays = document.getElementById("cdDays");
  var elHours = document.getElementById("cdHours");
  var elMinutes = document.getElementById("cdMinutes");
  var elSeconds = document.getElementById("cdSeconds");
  var elGrid = document.getElementById("countdownGrid");
  var elMessage = document.getElementById("countdownMessage");

  var countdownTimer = null;
  var hasFinished = false;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function renderCountdown() {
    var now = Date.now();
    var diff = WEDDING_DATE - now;

    if (diff <= 0) {
      finishCountdown();
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((diff / (1000 * 60)) % 60);
    var seconds = Math.floor((diff / 1000) % 60);

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }

  function finishCountdown() {
    if (hasFinished) return;
    hasFinished = true;
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    elDays.textContent = "00";
    elHours.textContent = "00";
    elMinutes.textContent = "00";
    elSeconds.textContent = "00";
    if (elGrid) elGrid.style.opacity = "0.45";
    if (elMessage) elMessage.hidden = false;
  }

  // Initial paint, then tick once per second. Does not repeat/reset after completion.
  renderCountdown();
  if (WEDDING_DATE > Date.now()) {
    countdownTimer = setInterval(renderCountdown, 1000);
  } else {
    finishCountdown();
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal:not(.hero-reveal)");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Top progress thread ---------- */
  var progressFill = document.getElementById("progressFill");

  function updateProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  /* ---------- RSVP form ---------- */
  var rsvpForm = document.getElementById("rsvpForm");
  var rsvpError = document.getElementById("rsvpError");
  var rsvpStatus = document.getElementById("rsvpStatus");
  var rsvpSubmit = document.getElementById("rsvpSubmit");
  var rsvpSubmitLabel = rsvpSubmit ? rsvpSubmit.querySelector(".rsvp__submit-label") : null;
  var rsvpOptions = document.querySelectorAll(".rsvp__option");

  // Telegram bot delivery — messages post directly into the couple's group chat.
  var TELEGRAM_BOT_TOKEN = "8914965102:AAHY2RhAvmKRqXXE5IH9JdP6Es1N2qQJ4wY";
  var TELEGRAM_CHAT_ID = "-5340937902";

  rsvpOptions.forEach(function (option) {
    var input = option.querySelector("input");
    input.addEventListener("change", function () {
      rsvpOptions.forEach(function (opt) {
        opt.classList.toggle("is-selected", opt.querySelector("input").checked);
      });
    });
  });

  function setRsvpStatus(msg, type) {
    if (!rsvpStatus) return;
    rsvpStatus.textContent = msg;
    rsvpStatus.hidden = false;
    rsvpStatus.classList.remove("rsvp__status--success", "rsvp__status--error");
    if (type) rsvpStatus.classList.add("rsvp__status--" + type);
  }

  function setRsvpSending(isSending) {
    if (!rsvpSubmit) return;
    rsvpSubmit.disabled = isSending;
    if (rsvpSubmitLabel) {
      rsvpSubmitLabel.textContent = isSending ? "Sending..." : "Send RSVP";
    }
  }

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = rsvpForm.elements["name"].value.trim();
      var attendanceInput = rsvpForm.querySelector('input[name="attendance"]:checked');
      var attendance = attendanceInput ? attendanceInput.value : "";
      var message = rsvpForm.elements["message"].value.trim();

      if (!name || !attendance) {
        rsvpError.hidden = false;
        if (rsvpStatus) rsvpStatus.hidden = true;
        if (!name) {
          rsvpForm.elements["name"].focus();
        }
        return;
      }
      rsvpError.hidden = true;

      var lines = [
        "💌 Wedding RSVP — Malek & Reem",
        "Name: " + name,
        "Attending: " + attendance
      ];
      if (message) {
        lines.push("Message: " + message);
      }
      var text = lines.join("\n");

      setRsvpSending(true);
      if (rsvpStatus) rsvpStatus.hidden = true;

      fetch("https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text })
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.ok) {
            setRsvpStatus("Thank you! Your RSVP has been sent to Malek & Reem. 🤍", "success");
            rsvpForm.reset();
            rsvpOptions.forEach(function (opt) { opt.classList.remove("is-selected"); });
          } else {
            setRsvpStatus("Something went wrong sending your RSVP. Please try again.", "error");
          }
        })
        .catch(function () {
          setRsvpStatus("Couldn't reach the server. Please check your connection and try again.", "error");
        })
        .finally(function () {
          setRsvpSending(false);
        });
    });
  }
})();
