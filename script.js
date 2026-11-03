const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

$("#beginBtn").addEventListener("click", () => $("#letter").scrollIntoView({behavior:"smooth"}));
$("#envelope").addEventListener("click", () => {
  const opened = $("#envelope").classList.toggle("open");
  $("#envelopeHint").classList.toggle("hidden", opened);
  $("#envelopeNote").classList.toggle("hidden", !opened);
  if (opened) setTimeout(() => $("#wonder").scrollIntoView({behavior:"smooth"}), 1500);
});

let found = 0;
$$(".hidden-star").forEach(star => star.addEventListener("click", () => {
  if (star.classList.contains("found")) return;
  star.classList.add("found");
  found++;
  $("#starCount").textContent = found + " of 5 stars found";
  $("#starProgress").style.width = (found * 20) + "%";
  if (found === 5) $("#starReward").classList.remove("hidden");
}));

const wishes = [
  "May you never feel too grown-up to dance in your room for no reason. 💃",
  "I hope you find little reasons to smile even on the most ordinary days. 🌷",
  "May your inner child always feel safe, free and full of wonder. 🧸",
  "You deserve soft mornings, loud laughter and dreams that come true. ☀️",
  "Never feel silly for being playful. That is a beautiful part of you. 🦋",
  "May this new year of life surprise you in the loveliest ways. ✨",
  "I hope you get more reasons to say: today was a really good day. 💗",
  "Keep dreaming big, laughing freely and being wonderfully you. 🌙"
];
let lastWish = -1;
$("#wishBtn").addEventListener("click", () => {
  let next;
  do { next = Math.floor(Math.random() * wishes.length); } while (next === lastWish && wishes.length > 1);
  lastWish = next;
  $("#wishCard").textContent = wishes[next];
  $("#wishCard").classList.remove("hidden");
});

function celebrate() {
  $$(".candle").forEach(c => c.classList.add("out"));
  $("#cakeMessage").classList.remove("hidden");
  const layer = $("#confettiLayer");
  layer.innerHTML = "";
  for (let i=0; i<65; i++) {
    const bit = document.createElement("i");
    bit.className = "confetti";
    bit.style.left = Math.random()*100 + "%";
    bit.style.animationDelay = Math.random()*.8 + "s";
    bit.style.animationDuration = (2 + Math.random()*2) + "s";
    bit.style.background = ["#f6b8d8","#cbb8fa","#ffe5a0","#fff0e6"][i%4];
    bit.style.transform = "rotate(" + Math.random()*180 + "deg)";
    layer.appendChild(bit);
  }
}
$("#wishCakeBtn").addEventListener("click", celebrate);
$$(".candle").forEach(c => c.addEventListener("click", () => c.classList.add("out")));

const sections = $$("main section[id]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("seen");
    });
  }, {threshold:.12});
  sections.forEach(section => observer.observe(section));
}

const lightbox = $("#photoLightbox");
const lightboxImage = $("#lightboxImage");
let lightboxOpener = null;
$$("[data-photo]:not([data-private-photo])").forEach(card => card.addEventListener("click", () => {
  lightboxOpener = card;
  lightboxImage.src = card.dataset.photo;
  const caption = card.dataset.caption || card.querySelector("span")?.textContent?.trim() || card.querySelector("img")?.alt || "Little memories, just for you";
  lightboxImage.alt = caption;
  lightbox.querySelector("p").textContent = caption + " ♡";
  lightbox.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  $("#lightboxClose").focus();
}));
function closeLightbox() {
  lightbox.classList.add("hidden");
  lightboxImage.removeAttribute("src");
  document.body.style.overflow = "";
  lightboxOpener?.focus();
  lightboxOpener = null;
}
$("#lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
function keepFocusInside(dialog, event) {
  if (event.key !== "Tab") return;
  const items = [...dialog.querySelectorAll('button:not([disabled]), a[href], audio[controls], [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!items.length) { event.preventDefault(); return; }
  const first = items[0], last = items[items.length - 1];
  if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
    event.preventDefault(); first.focus();
  }
}
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("hidden")) {
    if (event.key === "Escape") closeLightbox();
    else keepFocusInside(lightbox, event);
  }
});

/* Private photos: blur at rest; ask for privacy before opening */
const privacyGate = $("#privacyGate");
const privacyConfirm = $("#privacyConfirm");
const privacyCancel = $("#privacyCancel");
let pendingPrivatePhoto = null;
$$("[data-private-photo]").forEach(card => card.addEventListener("click", () => {
  pendingPrivatePhoto = card;
  privacyGate.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  privacyCancel.focus();
}));
function closePrivacyGate() {
  privacyGate.classList.add("hidden");
  const opener = pendingPrivatePhoto;
  pendingPrivatePhoto = null;
  document.body.style.overflow = "";
  opener?.focus();
}
privacyCancel.addEventListener("click", closePrivacyGate);
privacyGate.addEventListener("click", event => {
  if (event.target === privacyGate) closePrivacyGate();
});
privacyConfirm.addEventListener("click", () => {
  if (!pendingPrivatePhoto) return;
  const photoPath = pendingPrivatePhoto.dataset.photo;
  const caption = pendingPrivatePhoto.dataset.caption || "A personal memory";
  lightboxOpener = pendingPrivatePhoto;
  closePrivacyGate();
  lightboxImage.src = photoPath;
  lightboxImage.alt = caption;
  lightbox.querySelector("p").textContent = caption + " ♡";
  lightbox.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  $("#lightboxClose").focus();
});
document.addEventListener("keydown", event => {
  if (!privacyGate.classList.contains("hidden")) {
    if (event.key === "Escape") closePrivacyGate();
    else keepFocusInside(privacyGate, event);
  }
});
