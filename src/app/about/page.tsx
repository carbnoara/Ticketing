import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "About Us | Neon Tickets",
  description: "Learn more about Neon Tickets, the premier cyberpunk concert ticketing platform.",
};

export default async function AboutPage() {
  const session = await getServerSession(authOptions);
  const activeRoleId = (session?.user as any)?.activeRoleId || 2;
  const isAdmin = activeRoleId === 1 || activeRoleId === 3;

  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ['about_vision', 'about_platform'] } }
  });

  const getSetting = (key: string, fallback: string) => {
    const s = settings.find((x: any) => x.key === key);
    return s ? s.value : fallback;
  };

  const visionText = getSetting('about_vision', "");
  const platformText = getSetting('about_platform', "");

  return (
    <div style={{
      padding: '4rem 72px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4rem'
    }}>
      <section style={{ textAlign: 'center', animation: 'fadeIn 1s ease-in' }}>
        <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
          About Neon Tickets
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          Welcome to Neon Tickets, your ultimate gateway to unforgettable live entertainment. Kami hadir untuk menghubungkan para penikmat musik dan pencinta acara dengan musisi, festival, dan konser impian melalui pengalaman transaksi yang cepat, aman, dan transparan.
        </p>
        {isAdmin && (
          <div style={{ marginTop: '2rem' }}>
            <Link href="/about/edit" className="btn-secondary" style={{ padding: '0.8rem 1.5rem', textDecoration: 'none' }}>
              Edit Content
            </Link>
          </div>
        )}
      </section>

      <section className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div>
          <h2 style={{ color: 'var(--neon-cyan)', marginBottom: '1rem', fontSize: '2rem' }}>Our Vision</h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#202020ff', whiteSpace: 'pre-wrap' }}>
            {visionText}
          </p>
        </div>

        <div>
          <h2 style={{ color: 'var(--neon-pink)', marginBottom: '1rem', fontSize: '2rem' }}>The Platform</h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#1e1d1dff', whiteSpace: 'pre-wrap' }}>
            {platformText}
          </p>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel hover-lift" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '60px', height: '60px',
            borderRadius: '50%',
            background: 'var(--neon-pink)',
            margin: '0 auto 1.5rem',
            boxShadow: '0 0 25px var(--neon-pink-glow)'
          }}></div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Global Reach</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>From Neo-Tokyo to Night City, we cover the biggest events in every major timezone on the grid.</p>
        </div>

        <div className="glass-panel hover-lift" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '60px', height: '60px',
            borderRadius: '50%',
            background: 'var(--neon-cyan)',
            margin: '0 auto 1.5rem',
            boxShadow: '0 0 25px var(--neon-cyan-glow)'
          }}></div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Secure Drops</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>Advanced anti-bot mechanics and unique digital locks keep the tickets in the hands of true fans.</p>
        </div>

        <div className="glass-panel hover-lift" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: '60px', height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, var(--neon-pink), var(--neon-cyan))',
            margin: '0 auto 1.5rem',
          }}></div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Next-Gen Venues</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>Partnered exclusively with holographic-ready and sensory-feedback enabled arenas worldwide.</p>
        </div>
      </section>

      <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to jack in?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Join thousands of other users on the grid and secure your next experience.</p>
        <Link href="/register">
          <button className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>Join the Grid</button>
        </Link>
      </div>
    </div>
  );
}
