'use client';
import { useState, useEffect, use } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

function Stars({ rating, count }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  return (
    <div className="detail-rating">
      <span className="stars-lg">{'\u2605'.repeat(full)}{half ? '\u2605' : ''}{'\u2606'.repeat(5 - full - half)}</span>
      <strong>{rating.toFixed(1)}</strong>
      <span className="count">({count} recensioni)</span>
    </div>
  );
}

export default function BadanteDetail({ params }) {
  const { id } = use(params);
  const [b, setB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'badanti', id));
        if (snap.exists()) {
          setB({ id: snap.id, ...snap.data() });
        } else {
          setError(true);
        }
      } catch (e) {
        console.error(e);
        setError(true);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <>
      <header className="header"><div className="header-top"><a href="/" className="logo">Trova<span>Badante</span></a></div></header>
      <div className="detail-loading">Caricamento profilo...</div>
    </>
  );

  if (error || !b) return (
    <>
      <header className="header"><div className="header-top"><a href="/" className="logo">Trova<span>Badante</span></a></div></header>
      <div className="detail-error">
        <h2>Profilo non trovato</h2>
        <p>Questo profilo potrebbe essere stato rimosso.</p>
        <a href="/" className="cta-btn">Torna alla ricerca</a>
      </div>
    </>
  );

  const prezzo = b.tipo === 'a_ore'
    ? `\u20AC${b.prezzoOra}/ora`
    : `\u20AC${b.prezzoMese}/mese`;

  const tipoLabel = b.tipo === 'convivente' ? 'Convivente (h24)'
    : b.tipo === 'a_ore' ? 'A Ore'
    : 'Notturna';

  return (
    <>
      <header className="header">
        <div className="header-top">
          <a href="/" className="logo">Trova<span>Badante</span></a>
          <a href="/registrati" className="header-cta">Sei una Badante? Registrati</a>
        </div>
      </header>

      <div className="detail-container">
        <a href="/" className="detail-back">&larr; Torna alla ricerca</a>

        <div className="detail-card">
          <div className="detail-header">
            <div className="detail-avatar">
              {b.foto ? <img src={b.foto} alt={b.nome} /> : (b.nome?.charAt(0) || '?')}
            </div>
            <div className="detail-info">
              <h1 className="detail-name">
                {b.nome} {b.cognome}
                {b.bandiera && <span className="detail-flag">{b.bandiera}</span>}
              </h1>
              <div className="detail-meta">
                {b.nazionalita && <span>{b.nazionalita}</span>}
                {b.eta > 0 && <span>{b.eta} anni</span>}
                {b.anniEsperienza > 0 && <span>{b.anniEsperienza} anni di esperienza</span>}
              </div>
              <Stars rating={b.rating || 0} count={b.recensioni || 0} />
            </div>
          </div>

          <div className="detail-badges">
            <span className="detail-badge detail-badge-tipo">{tipoLabel}</span>
            <span className="detail-badge detail-badge-prezzo">{prezzo}</span>
            {b.disponibileOra && <span className="detail-badge detail-badge-dispo">Disponibile ora</span>}
            <span className="detail-badge detail-badge-citta">{b.citta || 'Italia'}</span>
          </div>

          {b.specialita && (
            <div className="detail-section">
              <h3>Specializzazione</h3>
              <p>{b.specialita}</p>
            </div>
          )}

          {b.descrizione && (
            <div className="detail-section">
              <h3>Presentazione</h3>
              <p className="detail-desc">{b.descrizione}</p>
            </div>
          )}

          {b.skills && b.skills.length > 0 && (
            <div className="detail-section">
              <h3>Competenze</h3>
              <div className="detail-tags">
                {b.skills.map((s, i) => <span key={i} className="tag">{s}</span>)}
              </div>
            </div>
          )}

          {b.lingue && b.lingue.length > 0 && (
            <div className="detail-section">
              <h3>Lingue</h3>
              <div className="detail-tags">
                {b.lingue.map((l, i) => <span key={i} className="tag tag-lingua">{l}</span>)}
              </div>
            </div>
          )}

          <div className="detail-cta-box">
            <h3>Interessato a questo profilo?</h3>
            <p>Scarica l'app TrovaBadante per contattare direttamente questa badante.</p>
            <button className="cta-btn">Scarica l'App</button>
          </div>
        </div>
      </div>
    </>
  );
}
