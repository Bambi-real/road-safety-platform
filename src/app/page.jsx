function getSeasonLabel() {
  const month = new Date().getMonth() + 1; // 1-12
  const year = new Date().getFullYear();
  const isRainySeason = month >= 6 && month <= 10; // June–October
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

      <section className="how">
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
            <h2 className="font-display">From damage to data.</h2>
            <p>
              Every report becomes a data point — hotspots, response times,
              and hazard trends the road authority can act on, not just a
              complaint that disappears.
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