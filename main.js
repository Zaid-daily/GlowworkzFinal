const YEAR = document.getElementById('year');
if (YEAR) YEAR.textContent = new Date().getFullYear();

const forms = document.querySelectorAll('form[action^="https://formspree.io/f/mjkozpqq"]');
forms.forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const modal = document.getElementById('formModal');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn?.setAttribute('disabled', 'true');
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
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
