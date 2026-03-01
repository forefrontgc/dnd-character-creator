'use client';

import { useRouter } from 'next/navigation';

export default function DMReferencePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-dark-bg text-white font-[family-name:var(--font-body)]">
      {/* Screen header */}
      <div className="no-print bg-dark-card border-b-2 border-gold/30 p-4 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-cinzel)] text-2xl text-gold font-bold">DM Quick Reference</h1>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="px-5 py-2 rounded-xl bg-gold text-dark-bg font-[family-name:var(--font-cinzel)] font-bold hover:bg-gold-dark transition-all">
            Print This Sheet
          </button>
          <button onClick={() => router.back()} className="px-5 py-2 rounded-xl bg-dark-border text-gold border-2 border-gold/30 font-[family-name:var(--font-cinzel)] font-bold hover:bg-gold/10 transition-all">
            Back
          </button>
        </div>
      </div>

      {/* DM Sheet Content */}
      <div className="print-sheet parchment-bg mx-auto my-8 rounded-lg shadow-2xl p-6 md:p-8" style={{ maxWidth: '7.5in', fontFamily: "'Inter', sans-serif" }}>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '22pt', fontWeight: 900, color: '#2c1810', textAlign: 'center', marginBottom: '4px' }}>
          DM Quick Reference
        </h1>
        <p style={{ fontFamily: "'MedievalSharp', cursive", textAlign: 'center', color: '#5a3e28', marginBottom: '16px', fontSize: '12pt' }}>
          Combat Rules &amp; Encounter Guide
        </p>

        <div style={{ borderTop: '2px solid #c4a46a', paddingTop: '12px' }}>
          {/* Combat Flow */}
          <div style={{ marginBottom: '14px' }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '14pt', fontWeight: 700, color: '#2c1810', marginBottom: '6px' }}>Combat Flow (Simplified)</h2>
            <div style={{ fontSize: '10.5pt', color: '#2c1810', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '4px' }}><b>1. Roll Initiative</b> &mdash; Each player rolls 1d20. Highest goes first.</p>
              <p style={{ marginBottom: '2px' }}><b>2. On Your Turn</b> &mdash; You get your Moves and can spend Action Points:</p>
              <ul style={{ marginLeft: '20px', marginBottom: '4px', listStyle: 'disc' }}>
                <li><b>Move</b> &mdash; Move between zones (1 Move = 1 zone)</li>
                <li><b>Attack</b> &mdash; Roll 1d20, add weapon modifier. Hit on 10+. Deal weapon damage minus target&apos;s armor (minimum 1 damage).</li>
                <li><b>Use Ability/Spell</b> &mdash; Spend Action Points as listed on character sheet</li>
                <li><b>Dodge</b> &mdash; Spend 1 AP, enemy must roll 15+ to hit you until your next turn</li>
              </ul>
              <p style={{ marginBottom: '4px' }}><b>3. Damage</b> &mdash; Weapon Damage &minus; Target&apos;s Armor = HP lost (minimum 1)</p>
              <p style={{ marginBottom: '0' }}><b>4. Knocked Out</b> &mdash; At 0 HP, you&apos;re knocked out. An ally can spend 1 AP on their turn to revive you with 3 HP.</p>
            </div>
          </div>

          {/* Difficulty Scaling */}
          <div style={{ borderTop: '2px solid #c4a46a', paddingTop: '12px', marginBottom: '14px' }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '14pt', fontWeight: 700, color: '#2c1810', marginBottom: '6px' }}>Difficulty Scaling Tips</h2>
            <div style={{ fontSize: '10.5pt', color: '#2c1810', lineHeight: '1.6' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '6px' }}>
                <div style={{ flex: 1, background: 'rgba(39,174,96,0.15)', borderRadius: '8px', padding: '8px', border: '1px solid rgba(39,174,96,0.3)' }}>
                  <div style={{ fontWeight: 700, color: '#27ae60', marginBottom: '2px' }}>Easy</div>
                  <div style={{ fontSize: '9.5pt' }}>5-8 HP, 2-3 damage, 1 move/turn</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(232,185,35,0.15)', borderRadius: '8px', padding: '8px', border: '1px solid rgba(232,185,35,0.3)' }}>
                  <div style={{ fontWeight: 700, color: '#c49b1a', marginBottom: '2px' }}>Medium</div>
                  <div style={{ fontSize: '9.5pt' }}>10-15 HP, 3-5 damage, 2 moves/turn</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(192,57,43,0.15)', borderRadius: '8px', padding: '8px', border: '1px solid rgba(192,57,43,0.3)' }}>
                  <div style={{ fontWeight: 700, color: '#c0392b', marginBottom: '2px' }}>Hard / Boss</div>
                  <div style={{ fontSize: '9.5pt' }}>20-30 HP, 5-8 damage, special abilities, 2 moves/turn</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Reference Table */}
          <div style={{ borderTop: '2px solid #c4a46a', paddingTop: '12px' }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '14pt', fontWeight: 700, color: '#2c1810', marginBottom: '6px' }}>Key Numbers at a Glance</h2>
            <table style={{ width: '100%', fontSize: '10pt', borderCollapse: 'collapse', color: '#2c1810' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #c4a46a' }}>
                  <th style={{ textAlign: 'left', padding: '4px', fontFamily: "'Cinzel', serif" }}>Action</th>
                  <th style={{ textAlign: 'left', padding: '4px', fontFamily: "'Cinzel', serif" }}>Cost</th>
                  <th style={{ textAlign: 'left', padding: '4px', fontFamily: "'Cinzel', serif" }}>Roll Needed</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #dbc89e' }}><td style={{ padding: '3px 4px' }}>Basic Attack</td><td style={{ padding: '3px 4px' }}>Free (1/turn)</td><td style={{ padding: '3px 4px' }}>10+ on d20</td></tr>
                <tr style={{ borderBottom: '1px solid #dbc89e' }}><td style={{ padding: '3px 4px' }}>Dodge</td><td style={{ padding: '3px 4px' }}>1 AP</td><td style={{ padding: '3px 4px' }}>Enemy needs 15+</td></tr>
                <tr style={{ borderBottom: '1px solid #dbc89e' }}><td style={{ padding: '3px 4px' }}>Revive Ally</td><td style={{ padding: '3px 4px' }}>1 AP</td><td style={{ padding: '3px 4px' }}>Auto (heals 3 HP)</td></tr>
                <tr style={{ borderBottom: '1px solid #dbc89e' }}><td style={{ padding: '3px 4px' }}>Use Ability</td><td style={{ padding: '3px 4px' }}>Varies (see sheet)</td><td style={{ padding: '3px 4px' }}>Varies</td></tr>
                <tr><td style={{ padding: '3px 4px' }}>Move</td><td style={{ padding: '3px 4px' }}>1 Move = 1 zone</td><td style={{ padding: '3px 4px' }}>No roll</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '8pt', color: '#a0907a', fontFamily: "'MedievalSharp', cursive" }}>
          D&D Character Creator &mdash; DM Quick Reference Sheet
        </div>
      </div>
    </div>
  );
}
