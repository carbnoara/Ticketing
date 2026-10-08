'use client';

import { useState } from 'react';

export interface TierData {
  id?: string;
  key: string;
  name: string;
  price: number;
  stock?: number;
}

interface TicketSelectorProps {
  onCheckout: (tickets: number, tierName: string, tierId: string, price: number) => void;
  eventDate?: string;
  tiers: TierData[];
  isAdmin?: boolean;
}

export default function TicketSelector({ onCheckout, eventDate = "TBA", tiers, isAdmin = false }: TicketSelectorProps) {
  //bikin logika kalau misalnya ada event gratis, ngga usah 'From TBA'. langsung aja jadi free
  const isFreeEvent = tiers.every((tier) => tier.price === 0);

  const [quantity, setQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState(tiers.length > 0 ? tiers[0].key : '');
  const [expandedTier, setExpandedTier] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleTierClick = (key: string) => {
    setSelectedTier(key);
    setExpandedTier(expandedTier === key ? null : key);
  };

  const TAX_RATE = 0.10; // 10% tax

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
      <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Select Tickets</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {tiers.map((tier) => {
          const key = tier.key;
          const isSelected = selectedTier === key;
          const isExpanded = expandedTier === key;
          const tax = tier.price * TAX_RATE;
          const totalAfter = tier.price + tax;

          const stock = tier.stock ?? 0;
          const isSoldOut = stock <= 0;

          return (
            <div key={key} style={{
              border: `1px solid ${isSelected && !isSoldOut ? 'var(--neon-pink)' : 'var(--glass-border)'}`,
              borderRadius: '8px',
              backgroundColor: isSelected && !isSoldOut ? 'rgba(255,0,85,0.05)' : 'rgba(255,255,255,0.02)',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              opacity: isSoldOut ? 0.6 : 1
            }}>
              {/* Header Section */}
              <button
                onClick={() => {
                  if (isSoldOut) return;
                  handleTierClick(key);
                }}
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: isSoldOut ? 'not-allowed' : 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                  <div 
                    style={{ 
                      fontWeight: 'bold', 
                      fontSize: '1.2rem', 
                      marginBottom: '0.2rem', 
                      color: isSelected && !isSoldOut ? 'var(--neon-pink)' : 'inherit', 
                      textDecoration: isSoldOut ? 'line-through' : 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={tier.name}
                  >
                    {tier.name}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}> Price: ${tier.price.toFixed(2)} {isAdmin && stock > 0 && `(Stock: ${stock})`}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {isSoldOut ? (
                    <div style={{ fontSize: '1rem', color: 'var(--neon-pink)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Sold Out
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '1.3rem', color: isSelected ? '#201c1cff' : 'var(--neon-cyan)', fontWeight: 'bold' }}>
                        ${totalAfter.toFixed(2)}
                      </div>
                      <div style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        color: 'var(--neon-cyan)'
                      }}>
                        ▼
                      </div>
                    </>
                  )}
                </div>
              </button>

              {/* Dropdown Details */}
              {isExpanded && (
                <div style={{
                  padding: '0 1.5rem 1.5rem 1.5rem',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    <span>Base Ticket Price:</span>
                    <span>${tier.price.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    <span>Tax (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px dashed var(--glass-border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                    <span>Total per ticket:</span>
                    <span style={{ color: 'var(--neon-cyan)' }}>${totalAfter.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    <span>Event Date:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{eventDate}</span>
                  </div>

                  {/* Quantity Box */}
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', fontWeight: 'bold' }}>Quantity</div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)'
                    }}>
                      <span style={{ fontWeight: 'bold' }}>Pax</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <span style={{ color: 'var(--neon-pink)', fontWeight: 'bold' }}>${totalAfter.toFixed(2)} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/pax</span></span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <button
                            disabled={quantity <= 1}
                            onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                            style={{ background: 'transparent', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', width: '30px', height: '30px', borderRadius: '50%', cursor: quantity <= 1 ? 'not-allowed' : 'pointer', opacity: quantity <= 1 ? 0.5 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                          >-</button>
                          <span style={{ fontSize: '1.1rem', width: '20px', textAlign: 'center', color: 'var(--text-primary)' }}>{Math.min(quantity, stock)}</span>
                          <button
                            disabled={quantity >= Math.min(4, stock)}
                            onClick={(e) => { e.stopPropagation(); setQuantity(Math.min(4, stock, quantity + 1)); }}
                            style={{ background: 'transparent', border: '1px solid var(--neon-cyan)', color: 'var(--neon-cyan)', width: '30px', height: '30px', borderRadius: '50%', cursor: quantity >= Math.min(4, stock) ? 'not-allowed' : 'pointer', opacity: quantity >= Math.min(4, stock) ? 0.5 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                          >+</button>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'right' }}>
                      Max 4 tickets per order
                    </div>
                  </div>

                  {/* Footer of the expanded tier: Total and Checkout Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--glass-border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                    <div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total ({quantity} pax):</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--neon-cyan)' }}>${(totalAfter * quantity).toFixed(2)}</div>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={(e) => { e.stopPropagation(); onCheckout(quantity, tier.name, tier.id || tier.key, totalAfter * quantity); }}
                      style={{ padding: '0.8rem 2rem' }}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(5px)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '500px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              onClick={() => setShowInfoModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.8rem', cursor: 'pointer', opacity: 0.7 }}
            >
              &times;
            </button>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--neon-pink)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.8rem' }}>
              Ticket Information
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--neon-cyan)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>How to Use (Redeem)</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                Your ticket will be issued as a cryptographic neural-net token. Upon arrival at the venue, open the Neon Tickets app and present your unique dynamic QR code to the scanner. Do not screenshot the code; it refreshes every 10 seconds to prevent unauthorized duplication.
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--neon-cyan)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Terms & Conditions</h3>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', paddingLeft: '1.5rem', margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>All ticket sales are final and non-refundable.</li>
                <li style={{ marginBottom: '0.5rem' }}>Tickets can only be transferred securely through our verified peer-to-peer platform.</li>
                <li style={{ marginBottom: '0.5rem' }}>Holographic recording devices are strictly prohibited inside the arena.</li>
                <li>Age restrictions may apply depending on the venue policies.</li>
              </ul>
            </div>

            <div>
              <h3 style={{ color: 'var(--neon-cyan)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Additional Info</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                <strong>Sensory Warning:</strong> This event features intense strobe lights, laser arrays, and heavy sub-bass frequencies. Proceed with caution if you are sensitive to such stimuli.
              </p>
            </div>

            <button className="btn-secondary" onClick={() => setShowInfoModal(false)} style={{ width: '100%', marginTop: '2.5rem', padding: '1rem' }}>
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
