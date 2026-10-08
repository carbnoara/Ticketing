'use client';

import { useState } from 'react';
import TicketSelector, { TierData } from '@/components/TicketSelector';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DeleteEventButton from './DeleteEventButton';
import { useEffect } from 'react';

interface EventPageClientProps {
  event: {
    id: string;
    name: string;
    artist: string;
    date: Date;
    location: string;
    description: string;
    imageUrl: string | null;
  };
  tiers: TierData[];
}

export default function EventPageClient({ event, tiers }: EventPageClientProps) {
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ quantity: 0, tier: '', tierId: '', total: 0 });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const { data: session } = useSession();
  const activeRoleId = (session?.user as any)?.activeRoleId || 2;
  const isAdmin = activeRoleId === 1 || activeRoleId === 3;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }) + ' | ' + new Date(event.date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  const handleCheckout = (quantity: number, tier: string, tierId: string, total: number) => {
    setCheckoutData({ quantity, tier, tierId, total });
    setPromoCode('');
    setDiscount(0);
    setShowCheckout(true);
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    try {
      const res = await fetch(`/api/promo?code=${promoCode}`);
      const data = await res.json();
      if (res.ok && data.discount) {
        setDiscount(data.discount);
        alert(`Promo applied! ${data.discount}% OFF`);
      } else {
        setDiscount(0);
        alert(data.error || 'Invalid promo code');
      }
    } catch (err) {
      alert('Error verifying promo code');
    }
  };

  const finalizePurchase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const newOrderId = 'TRX-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          orderId: newOrderId,
          quantity: checkoutData.quantity,
          tier: checkoutData.tier,
          tierId: checkoutData.tierId,
          total: checkoutData.total * (1 - discount / 100),
          eventId: event.id,
          eventName: event.name,
          eventDate: formattedDate
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        setOrderId(newOrderId);
        if (responseData.previewUrl) setPreviewUrl(responseData.previewUrl);
        setPurchaseComplete(true);
      } else {
        const errorData = await response.json();
        alert('Failed to process payment/email: ' + (errorData.details || errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (showCheckout && !purchaseComplete) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = 'Changes you made may not be saved.';
        return 'Changes you made may not be saved.';
      };

      const handlePopState = (e: PopStateEvent) => {
        if (window.confirm('Changes you made may not be saved. Are you sure you want to leave?')) {
          setShowCheckout(false);
        } else {
          // Push state again to prevent going back
          window.history.pushState(null, '', window.location.href);
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [showCheckout, purchaseComplete]);

  return (
    <div style={{ padding: '4rem 72px', position: 'relative' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: 'var(--neon-cyan)', display: 'inline-block' }}>
          ← Back to Events
        </Link>
        {isAdmin && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href={`/events/${(event as any).id}/edit`} className="btn-secondary" style={{ padding: '0.8rem 1.5rem', textDecoration: 'none' }}>
              Edit Event
            </Link>
            <DeleteEventButton eventId={(event as any).id} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <div style={{
            width: '100%',
            height: '300px',
            backgroundColor: 'var(--glass-bg)',
            borderRadius: '12px',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'var(--neon-cyan)', fontSize: '4rem', opacity: 0.5 }}>♫</span>
            )}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, var(--bg-color), transparent)' }} />
          </div>

          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textShadow: '0 0 10px var(--neon-pink-glow)' }}>
            {event.name}
          </h1>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--neon-pink)', marginBottom: '1rem' }}>
            {event.artist}
          </h2>

          <div style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
            <p>🗓 {formattedDate}</p>
            <p>📍 {event.location}</p>
            <p style={{ marginTop: '1rem' }}>
              {event.description}
            </p>
          </div>
        </div>

        <div style={{ flex: '1 1 400px' }}>
          <TicketSelector onCheckout={handleCheckout} eventDate={formattedDate} tiers={tiers} isAdmin={isAdmin} />
        </div>
      </div>

      {/* Checkout Modal Overlay */}
      {showCheckout && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 5, 5, 0.8)',
          backdropFilter: 'blur(5px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '500px', position: 'relative' }}>
            {!purchaseComplete ? (
              <>
                <button
                  onClick={() => setShowCheckout(false)}
                  style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  &times;
                </button>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--neon-cyan)' }}>Complete Purchase</h2>
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--glass-bg)', borderRadius: '8px' }}>
                  <p><strong>Tickets:</strong> {checkoutData.quantity}x {checkoutData.tier}</p>
                  {discount > 0 ? (
                    <>
                      <p><strong>Subtotal:</strong> <span style={{ textDecoration: 'line-through', opacity: 0.5 }}>${checkoutData.total.toFixed(2)}</span></p>
                      <p style={{ color: 'var(--neon-pink)' }}><strong>Discount ({discount}%):</strong> -${(checkoutData.total * discount / 100).toFixed(2)}</p>
                      <p style={{ fontSize: '1.2rem', color: 'var(--neon-cyan)', marginTop: '0.5rem' }}><strong>Total:</strong> ${(checkoutData.total * (1 - discount / 100)).toFixed(2)}</p>
                    </>
                  ) : (
                    <p><strong>Total:</strong> ${checkoutData.total.toFixed(2)}</p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                  <input type="text" placeholder="Promo Code" value={promoCode} onChange={e => setPromoCode(e.target.value)} style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} />
                  <button type="button" onClick={handleApplyPromo} className="btn-secondary" style={{ padding: '0.8rem 1.5rem', borderRadius: '4px' }}>Apply</button>
                </div>

                <form onSubmit={finalizePurchase} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input type="text" name="firstName" placeholder="First Name" required style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} />
                    <input type="text" name="lastName" placeholder="Last Name" required style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} />
                  </div>
                  <input type="email" name="email" placeholder="Email Address" required style={{ padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} />

                  <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Secure Payment Details</div>
                    <input type="text" placeholder="Card Number (e.g. 4111 1111 1111 1111)" pattern="[0-9 ]+" maxLength={19} required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', marginBottom: '1rem' }} />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input type="text" placeholder="MM/YY" pattern="[0-9]{2}/[0-9]{2}" maxLength={5} required style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} />
                      <input type="text" placeholder="CVC" pattern="[0-9]{3,4}" maxLength={4} required style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>

                  <button type="submit" disabled={isProcessing} className="btn-primary" style={{ marginTop: '1.5rem', opacity: isProcessing ? 0.7 : 1, cursor: isProcessing ? 'wait' : 'pointer' }}>
                    {isProcessing ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                        Processing Payment...
                      </span>
                    ) : (
                      `Pay $${checkoutData.total.toFixed(2)} Securely`
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', color: 'var(--neon-cyan)', marginBottom: '1rem' }}>✓</div>
                <h2 style={{ marginBottom: '1rem' }}>Payment Successful!</h2>

                <div style={{ background: 'rgba(0,0,0,0.05)', border: '1px dashed var(--neon-cyan)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Order ID:</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{orderId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Date:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Item:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{checkoutData.quantity}x {checkoutData.tier}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Paid:</span>
                    <span style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>${checkoutData.total.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                  A receipt and your tickets have been securely delivered to your email inbox.
                  {previewUrl && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0, 255, 255, 0.1)', borderRadius: '8px', border: '1px solid var(--neon-cyan)' }}>
                      <strong>Test Mode:</strong> <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-cyan)', textDecoration: 'underline' }}>Click here to view the test email receipt</a>
                    </div>
                  )}
                </div>
                <button className="btn-secondary" onClick={() => { 
                  setShowCheckout(false); 
                  setPurchaseComplete(false); 
                  router.refresh(); 
                }} style={{ width: '100%', padding: '1rem' }}>Close Window</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
