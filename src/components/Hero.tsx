export default function Hero() {
  return (
    <section style={{
      padding: '6rem 2rem',
      textAlign: 'center',
      background: 'radial-gradient(circle at center, rgba(255, 0, 85, 0.1) 0%, transparent 60%)'
    }}>
      <h1 style={{
        fontSize: '4rem',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        textShadow: '0 0 20px var(--neon-pink-glow)'
      }}>
        Experience the <span className="gradient-text">Future</span> of Music
      </h1>
      <p style={{
        fontSize: '1.2rem',
        color: 'var(--text-secondary)',
        maxWidth: '600px',
        margin: '0 auto 2.5rem auto'
      }}>
        Secure your tickets to the most electrifying cyberpunk and synthwave concerts across the globe.
      </p>

    </section>
  );
}
