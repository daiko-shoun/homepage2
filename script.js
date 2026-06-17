const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("[data-contact-form]");
const contactFormEndpoint = "https://script.google.com/macros/s/AKfycbytKzGWoC9RGLlRYGkrTvPtYbwoiy61lYBiaWyh_OMTy175aWXucV3fHqnlc4zQhU4/exec";

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));
setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const status = contactForm.querySelector("[data-form-status]");
  const email = String(formData.get("email") || "").trim();
  const emailConfirm = String(formData.get("emailConfirm") || "").trim();

  status?.classList.remove("is-success");

  if (!contactForm.checkValidity()) {
    status.textContent = "必須項目を入力してください。";
    contactForm.reportValidity();
    return;
  }

  if (email !== emailConfirm) {
    status.textContent = "メールアドレスと確認用メールアドレスが一致していません。";
    return;
  }

  if (!contactFormEndpoint) {
    status.textContent = "フォーム送信の設定が未完了です。恐れ入りますが、お電話でお問い合わせください。";
    return;
  }

  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  status.textContent = "送信しています。しばらくお待ちください。";

  try {
    await fetch(contactFormEndpoint, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });

    contactForm.reset();
    status.textContent = "お問い合わせを送信しました。内容を確認後、担当者よりご連絡いたします。";
    status.classList.add("is-success");
  } catch (error) {
    status.textContent = "送信できませんでした。時間をおいて再度お試しいただくか、お電話でお問い合わせください。";
  } finally {
    submitButton.disabled = false;
  }
});
