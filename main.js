const YEAR = document.getElementById('year');
if (YEAR) YEAR.textContent = new Date().getFullYear();

let stripe;
if (window.STRIPE_PUBLISHABLE_KEY && Stripe) {
  stripe = Stripe(window.STRIPE_PUBLISHABLE_KEY);
}

document.querySelectorAll('.checkout').forEach(btn => {
  btn.addEventListener('click', async () => {
    const priceId = btn.getAttribute('data-price');
    if (!stripe) return alert("Stripe publishable key missing. See js/config.js");
    try {
      const res = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
      if (error) alert(error.message);
    } catch (err) {
      alert(err.message);
    }
  });
});

const forms = document.querySelectorAll('form[action^="https://formspree.io/f/mjkozpqq"]');
forms.forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const modal = document.getElementById('formModal');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn?.setAttribute('disabled', 'true');
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        modal?.classList.remove('hidden');
        form.reset();
      } else {
        alert('There was a problem sending your message. Please try again.');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      submitBtn?.removeAttribute('disabled');
    }
  });
});

document.getElementById('closeModal')?.addEventListener('click', () => {
  document.getElementById('formModal')?.classList.add('hidden');
});

const navToggle = document.getElementById('nav-toggle');
if (navToggle) {
  navToggle.addEventListener('change', (e) => {
    document.querySelector('.nav-links')?.classList.toggle('open', e.target.checked);
  });
}

