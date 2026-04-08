'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, where, limit } from 'firebase/firestore';

const TIPI = [
  { key: 'tutte', label: 'Tutte' },
  { key: 'convivente', label: 'Convivente' },
  { key: 'a_ore', label: 'A Ore' },
  { key: 'notturna', label: 'Notturna' },
];

function Stars({ rating, count }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  return (
    <div className="card-rating">
      <span className="stars">{'★'.repeat(full)}{half ? '★' : ''}{'☆'.repeat(5 - full - half)}</span>
      <strong>{rating.toFixed(1)}</strong>
      <span className="count">({count})</span>
    </div>
  );
}

function BadanteCard({ b }) {
  const prezzo = b.tipo === 'a_ore'
    ? `€${b.prezzoOra}/ora`
    : `€${b.prezzoMese}/mese`;

  return (
    <a href={`/badante/${b.id}`} className={`card ${b.inEvidenza ? 'card-featured' : ''}`}>
      <div className="card-body">
        <div className="card-top">
          <div className="card-avatar">
            {b.foto ? <img src={b.foto} alt={b.nome} /> : b.nome?.charAt(0) || '?'}
          </div>
          <div className="card-info">
            <div className="card-name">
              {b.nome} {b.cognome}
              {b.bandiera && <span className="flag">{b.bandiera}</span>}
            </div>
            <div className="card-spec">
              {b.specialita || `Badante ${b.tipo === 'a_ore' ? 'a ore' : b.tipo}`}
              {b.anniEsperienza > 0 && ` · ${b.anniEsperienza} anni esp.`}
            </div>
            <Stars rating={b.rating || 0} count={b.recensioni || 0} />
          </div>
        </div>

        <div className="card-tags">
          {(b.skills || []).slice(0, 4).map((s, i) => (
            <span key={i} className="tag">{s}</span>
          ))}
          {(b.lingue || []).slice(0, 2).map((l, i) => (
            <span key={`l${i}`} className="tag">{l}</span>
          ))}
        </div>

        <div className="card-bottom">
          <span className="card-price">{prezzo}</span>
          <span className="card-city">{b.citta || 'Italia'}</span>
          {b.disponibileOra && <span className="card-dispo">Disponibile</span>}
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const [badanti, setBadanti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('tutte');
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('tutte');

  useEffect(() => {
    fetchBadanti();
  }, [filtro]);

  const fetchBadanti = async () => {
    try {
      let q;
      if (filtro === 'tutte') {
        q = query(
          collection(db, 'badanti'),
          orderBy('inEvidenza', 'desc'),
          orderBy('rating', 'desc'),
          limit(100)
        );
      } else {
        q = query(
          collection(db, 'badanti'),
          where('tipo', '==', filtro),
          orderBy('rating', 'desc'),
          limit(100)
        );
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBadanti(data);
    } catch (err) {
      console.error('Errore Firestore:', err);
      // Fallback: mostra dati demo se Firestore vuoto o errore
      setBadanti([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchType !== 'tutte') setFiltro(searchType);
    // City filter client-side
  };

  const filtered = searchCity
    ? badanti.filter(b => (b.citta || '').toLowerCase().includes(searchCity.toLowerCase()))
    : badanti;

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="header-top">
          <div className="logo">Trova<span>Badante</span></div>
          <a href="/registrati" className="header-cta">Sei una Badante? Registrati</a>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>Trova la Badante Giusta<br />per la Tua Famiglia</h1>
        <p>Profili verificati, recensioni reali, contatto diretto. Assistenza anziani sicura in tutta Italia.</p>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Inserisci la tua citta..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="tutte">Tutti i tipi</option>
            <option value="convivente">Convivente</option>
            <option value="a_ore">A Ore</option>
            <option value="notturna">Notturna</option>
          </select>
          <button type="submit" className="search-btn">Cerca</button>
        </form>

        <div className="stats">
          <div className="stat">
            <div className="stat-num">{badanti.length || '0'}</div>
            <div className="stat-label">Badanti disponibili</div>
          </div>
          <div className="stat">
            <div className="stat-num">100+</div>
            <div className="stat-label">Citta coperte</div>
          </div>
          <div className="stat">
            <div className="stat-num">4.7★</div>
            <div className="stat-label">Valutazione media</div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <div className="filters">
        {TIPI.map(t => (
          <button
            key={t.key}
            className={`filter-btn ${filtro === t.key ? 'active' : ''}`}
            onClick={() => setFiltro(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid">
        {loading ? (
          <p style={{ textAlign: 'center', padding: 40, gridColumn: '1/-1', color: 'var(--text-light)' }}>
            Caricamento badanti...
          </p>
        ) : filtered.length > 0 ? (
          filtered.map(b => <BadanteCard key={b.id} b={b} />)
        ) : (
          <p style={{ textAlign: 'center', padding: 40, gridColumn: '1/-1', color: 'var(--text-light)' }}>
            Nessuna badante trovata. Prova a cambiare filtri o citta.
          </p>
        )}
      </div>

      {/* CTA */}
      <section className="cta-section">
        <h2>Sei una Badante Esperta?</h2>
        <p>Registrati gratis e trova nuove famiglie. Il tuo profilo sara visibile a migliaia di famiglie in tutta Italia.</p>
        <a href="/registrati" className="cta-btn">Registrati Gratis</a>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>&copy; 2026 TrovaBadante.eu — Assistenza anziani sicura e verificata</p>
        <p style={{ marginTop: 8 }}>
          <a href="/privacy">Privacy</a> · <a href="/termini">Termini</a> · <a href="/chi-siamo">Chi Siamo</a>
        </p>
      </footer>
    </>
  );
}
