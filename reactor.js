const reactor = document.getElementById('reactor');
if (reactor) {
  reactor.addEventListener('pointerdown', (e) => {
    const rect = reactor.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const b = document.createElement('span');
    b.className = 'reactor-burst';
    b.style.left = x + 'px';
    b.style.top = y + 'px';
    reactor.appendChild(b);
    setTimeout(() => b.remove(), 900);
  });
}
