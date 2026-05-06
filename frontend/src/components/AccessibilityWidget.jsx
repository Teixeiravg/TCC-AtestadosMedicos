'use client';
import { useState, useEffect } from 'react';

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [colorFilter, setColorFilter] = useState('none');
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const savedContrast = localStorage.getItem('a11y-contrast') === 'true';
    const savedFilter = localStorage.getItem('a11y-filter') || 'none';
    setContrast(savedContrast);
    setColorFilter(savedFilter);
    if (savedContrast) document.documentElement.classList.add('high-contrast');
    applyColorFilter(savedFilter);
  }, []);

  function applyColorFilter(filter) {
    const filters = {
      none: '',
      protanopia: 'url(#a11y-protanopia)',
      deuteranopia: 'url(#a11y-deuteranopia)',
      tritanopia: 'url(#a11y-tritanopia)',
    };
    // Aplica só no body, não no html inteiro (evita conflito com high-contrast)
    document.body.style.filter = filters[filter] || '';
  }

  function toggleContrast() {
    const next = !contrast;
    setContrast(next);
    localStorage.setItem('a11y-contrast', String(next));
    document.documentElement.classList.toggle('high-contrast', next);
  }

  function selectFilter(filter) {
    setColorFilter(filter);
    localStorage.setItem('a11y-filter', filter);
    applyColorFilter(filter);
  }

  function toggleSpeak() {
    if (!window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = document.querySelector('main')?.innerText || document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  return (
    <>
      {/* Filtros SVG invisíveis para daltonismo */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="a11y-protanopia">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
          </filter>
          <filter id="a11y-deuteranopia">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
          </filter>
          <filter id="a11y-tritanopia">
            <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
          </filter>
        </defs>
      </svg>

      {/* Botão flutuante */}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999 }}>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Abrir menu de acessibilidade"
          title="Acessibilidade"
          style={{
            width: 50, height: 50, borderRadius: '50%',
            background: '#1a6b6b', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: 22,
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          ♿
        </button>

        {open && (
          <div
            role="dialog"
            aria-label="Opções de acessibilidade"
            style={{
              position: 'absolute', bottom: 60, right: 0,
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 12, padding: '1rem', width: 230,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
            }}
          >
            <p style={{ fontWeight: 700, marginBottom: 10, fontSize: 14, color: '#1e293b' }}>
              ♿ Acessibilidade
            </p>

            <button onClick={toggleContrast} style={btnStyle(contrast)}>
              {contrast ? '✅' : '⬜'} Alto Contraste
            </button>

            <p style={{ fontSize: 11, color: '#64748b', margin: '8px 0 4px' }}>Visão para daltonismo:</p>
            {[
              { value: 'none', label: 'Normal' },
              { value: 'protanopia', label: 'Protanopia (vermelho)' },
              { value: 'deuteranopia', label: 'Deuteranopia (verde)' },
              { value: 'tritanopia', label: 'Tritanopia (azul)' },
            ].map(({ value, label }) => (
              <button key={value} onClick={() => selectFilter(value)} style={btnStyle(colorFilter === value)}>
                {colorFilter === value ? '✅' : '⬜'} {label}
              </button>
            ))}

            <hr style={{ margin: '8px 0', borderColor: '#e2e8f0' }} />

            <button onClick={toggleSpeak} style={btnStyle(speaking)}>
              {speaking ? '🔊 Parar leitura' : '🔈 Ler página em voz'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function btnStyle(active) {
  return {
    display: 'block', width: '100%', textAlign: 'left',
    padding: '5px 10px', marginBottom: 3,
    background: active ? '#f0fdfa' : 'transparent',
    border: active ? '1px solid #99f6e4' : '1px solid transparent',
    borderRadius: 6, cursor: 'pointer',
    fontSize: 12, color: '#1e293b',
  };
}