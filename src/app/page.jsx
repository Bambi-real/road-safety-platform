function getSeasonLabel() {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const isRainySeason = month >= 6 && month <= 10;
  return isRainySeason
    ? `Rainy season, ${year} — The Gambia`
    : `Dry season, ${year} — The Gambia`;
}

export default function HomePage() {
  return (
    <div>
      <section className="hero">
        <div className="hero__eyebrow">{getSeasonLabel()}</div>
        <h1 className="hero__headline">
          Every road tells you<br />
          something is{' '}
          <span className="hero__crack">
            wrong.
            <svg viewBox="0 0 200 20" preserveAspectRatio="none">
              <path d="M2,4 L40,12 L55,2 L90,15 L110,6 L140,16 L160,3 L198,10" />
            </svg>
          </span>
        </h1>
        <p className="hero__sub">
          Report potholes, floods, and damaged roads in seconds. AI verifies
          the damage, authorities track the fix, and every citizen can see
          it happen on a live map.
        </p>
        <div className="hero__actions">
          <a href="/report" className="btn-laterite">Report a hazard</a>
          <a href="/map" className="btn-outline">View the map</a>
        </div>
      </section>

      <section className="how" style={{ borderTop: '1px solid var(--line)', maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem 0' }}>
        <div style={{ maxWidth: '640px' }}>
          <div className="hero__eyebrow" style={{ color: 'var(--laterite)' }}>The problem</div>
          <h2 className="font-display" style={{ fontSize: '1.75rem', margin: '0.5rem 0 1rem' }}>
            Damaged roads go unreported and unfixed.
          </h2>
          <p style={{ color: '#4a463f', lineHeight: 1.6 }}>
            Potholes, floods, and broken infrastructure damage vehicles and
            cause accidents across The Gambia every rainy season — but there's
            no central system for citizens to report them, or for road
            authorities to see where the worst damage actually is. Reports
            get lost in phone calls and word of mouth. Repairs happen
            reactively, not where they're needed most.
          </p>
        </div>
      </section>

      <section className="how">
        <div className="hero__eyebrow" style={{ color: 'var(--teal)', marginBottom: '0.5rem' }}>The solution</div>
        <h2 className="font-display" style={{ fontSize: '1.75rem' }}>How it works</h2>
        <div className="how__grid">
          <div className="how__step">
            <div className="how__num">01</div>
            <h3>Report</h3>
            <p>Snap a photo of the hazard. Your location is captured automatically — no typing an address.</p>
          </div>
          <div className="how__step">
            <div className="how__num">02</div>
            <h3>AI verifies</h3>
            <p>The photo is checked against a trained damage-detection model and given a severity score.</p>
          </div>
          <div className="how__step">
            <div className="how__num">03</div>
            <h3>Authority acts</h3>
            <p>Road authorities see verified reports on a live dashboard and assign repair teams.</p>
          </div>
          <div className="how__step">
            <div className="how__num">04</div>
            <h3>Track the fix</h3>
            <p>Every citizen can follow their report's status, from submitted to resolved.</p>
          </div>
        </div>
      </section>

      <section className="route-section">
        <div className="route-section__inner">
          <div>
            <div className="hero__eyebrow" style={{ color: 'var(--hazard)', marginBottom: '0.5rem' }}>The impact</div>
            <h2 className="font-display">From damage to data.</h2>
            <p>
              Every report becomes a data point — hotspots, response times,
              and hazard trends the road authority can act on, instead of a
              complaint that disappears. Fewer accidents, faster repairs,
              and a national record of road conditions that didn't exist
              before.
            </p>
          </div>
          <div className="route-line">
            <svg viewBox="0 0 300 80" preserveAspectRatio="none">
              <path d="M10,60 L60,60 L90,20 L300,20" />
              <circle cx="10" cy="60" r="5" />
              <circle cx="300" cy="20" r="5" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}