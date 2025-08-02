import React, { useState } from 'react';

const HANDS = [
  { name: 'Royal Flush', base: 100, mult: 8 },
  { name: 'Straight Flush', base: 100, mult: 8 },
  { name: 'Four of a Kind', base: 60, mult: 7 },
  { name: 'Full House', base: 40, mult: 4 },
  { name: 'Flush', base: 35, mult: 4 },
  { name: 'Straight', base: 30, mult: 4 },
  { name: 'Three of a Kind', base: 30, mult: 3 },
  { name: 'Two Pair', base: 20, mult: 2 },
  { name: 'Pair', base: 10, mult: 2 },
  { name: 'High Card', base: 5, mult: 1 },
];

const CHIP_DENOMS = [1, 5, 25, 100, 500];

const JOKERS = [
  { name: "Seal of Approval", effect: "+50% chips and mult of all other Jokers, max +200 chips/mult", rarity: "Legendary", auto: false },
  { name: "Lucky Cat", effect: "+1 mult per Pair played this run (resets per round)", rarity: "Common", auto: false },
  { name: "Oily Joker", effect: "10% chance to duplicate a hand card, 5% chance to lose a random Joker", rarity: "Rare", auto: false },
  { name: "Echo Joker", effect: "Repeats previous hand for 50% chips (once per round)", rarity: "Uncommon", auto: false },
  { name: "Ace of Pain", effect: "+15 chips per Ace in hand", rarity: "Common", auto: false },
  { name: "The Collector", effect: "+20 chips per unique hand type played this run (resets per game)", rarity: "Rare", auto: false },
  { name: "Cheat Sheet", effect: "Sets mult to 5 if no other Jokers triggered this round", rarity: "Common", auto: false },
  { name: "Stack Overflow", effect: "Mult = hand size × 2 (max 10 mult)", rarity: "Uncommon", auto: false },
  { name: "Static Channel", effect: "All hands gain +0.5 xmult flat", rarity: "Common", auto: false },
  { name: "Lucky Bounce", effect: "20% chance to double chips for a hand (roll a d10: 1-2 triggers)", rarity: "Rare", auto: false },
  { name: "Foggy Mirror", effect: "Copies a random Joker’s effect each round (excludes Legendary)", rarity: "Rare", auto: false },
  { name: "Duct Tape", effect: "Adds weakest Joker’s mult to strongest (max +5 mult)", rarity: "Uncommon", auto: false },
  { name: "The Archivist", effect: "+75 chips per unique suit in deck", rarity: "Common", auto: false },
  { name: "Rotten Card", effect: "-1 mult, +200 chips per hand", rarity: "Common", auto: true },
  { name: "Forbidden Joker", effect: "If your only Joker, ×5 chips; otherwise, no effect", rarity: "Legendary", auto: false },
  { name: "Heartbeat", effect: "+2 xmult if Flush or Full House played", rarity: "Common", auto: false },
  { name: "Glitch Joker", effect: "Re-rolls hand before scoring (must use result, once per round)", rarity: "Rare", auto: false },
  { name: "The Recruiter", effect: "+50 chips per Joker in deck", rarity: "Common", auto: true },
  { name: "Pacifist", effect: "+3 mult if you skip a hand voluntarily (once per round)", rarity: "Uncommon", auto: false },
  { name: "Broken Clock", effect: "Every 2nd round: +300 chips (tracks rounds with a counter)", rarity: "Common", auto: false },
  { name: "Jester’s Mirror", effect: "Chips gained this hand are added as mult next hand", rarity: "Rare", auto: false },
  { name: "Wild Card", effect: "Counts as a random Joker each round (excludes Legendary)", rarity: "Rare", auto: false },
  { name: "Sleepy Joker", effect: "Inactive for 3 rounds, then +6 xmult permanently", rarity: "Rare", auto: false },
  { name: "Heat Sink", effect: "-1 mult, prevents Joker destruction (applies to this Joker only)", rarity: "Uncommon", auto: false },
  { name: "Energy Drink", effect: "+1 hand this round (max 1 extra hand)", rarity: "Common", auto: false },
  { name: "Monopoly Man", effect: "+40 chips per card in deck costing 5+", rarity: "Common", auto: false },
  { name: "Card Shark", effect: "+2 xmult if Straight or Straight Flush played", rarity: "Common", auto: false },
  { name: "Mirrorball", effect: "+1 chip per Joker per card in hand", rarity: "Uncommon", auto: false },
  { name: "Cosmic Dealer", effect: "+10 chips per planet card in deck", rarity: "Common", auto: false },
  { name: "Discard Dynamo", effect: "+2 mult per card discarded this round (resets per round)", rarity: "Uncommon", auto: false },
  { name: "Suit Savant", effect: "+25 chips if all cards in hand are the same suit", rarity: "Common", auto: false },
  { name: "Overclocker", effect: "+1 xmult if you play 3+ hands this round (tracks hand count)", rarity: "Uncommon", auto: false },
  { name: "Phantom Joker", effect: "15% chance to ignore hand scoring (roll a d10: 1 triggers)", rarity: "Rare", auto: false },
  { name: "Card Counter", effect: "+5 chips per card played this run (resets per game)", rarity: "Common", auto: false },
  { name: "Golden Ticket", effect: "+100 chips if you score exactly 100 chips in a hand", rarity: "Rare", auto: false },
  { name: "Chaos Engine", effect: "Randomly doubles or halves chips each hand (50% chance each)", rarity: "Rare", auto: false },
  { name: "Suit Amplifier", effect: "+1 xmult per unique suit in hand", rarity: "Uncommon", auto: false },
  { name: "Time Warp", effect: "+50 chips if you play the same hand type twice in a row", rarity: "Common", auto: false },
  { name: "Quantum Joker", effect: "+3 xmult if you have exactly 3 Jokers in deck", rarity: "Rare", auto: false },
  { name: "Final Gambit", effect: "If this is your last Joker, +200 chips and +5 mult", rarity: "Legendary", auto: false },
];

export default function App() {
  const [handCounts, setHandCounts] = useState(Array(HANDS.length).fill(0));
  const [mult, setMult] = useState(1);
  const [xmult, setXmult] = useState(1);
  const [jokerDouble, setJokerDouble] = useState(false);
  const [foil, setFoil] = useState(false);
  const [holo, setHolo] = useState(false);
  const [poly, setPoly] = useState(false);
  const [chipStacks, setChipStacks] = useState(Array(CHIP_DENOMS.length).fill(0));
  const [result, setResult] = useState(null);
  const [activeJokers, setActiveJokers] = useState([]);

  function updateHand(idx, delta) {
    setHandCounts(h => h.map((v, i) => i === idx ? Math.max(0, v + delta) : v));
  }

  function updateChipStack(idx, val) {
    setChipStacks(s => s.map((v, i) => i === idx ? Math.max(0, Number(val)||0) : v));
  }

  function resetAll() {
    setHandCounts(Array(HANDS.length).fill(0));
    setMult(1);
    setXmult(1);
    setJokerDouble(false);
    setFoil(false);
    setHolo(false);
    setPoly(false);
    setChipStacks(Array(CHIP_DENOMS.length).fill(0));
    setResult(null);
  }

  function calculateTotal() {
    let handTotal = handCounts.reduce((sum, count, i) => sum + count * HANDS[i].base * HANDS[i].mult, 0);
    let bonus = 1;
    if (foil) bonus += 0.25;
    if (holo) bonus += 0.5;
    if (poly) bonus += 1;
    handTotal = Math.round(handTotal * bonus);
    if (jokerDouble) handTotal *= 2;
    let total = handTotal * mult * xmult;
    setResult({ handTotal, total });
  }

  function chipValue() {
    return chipStacks.reduce((sum, count, i) => sum + count * CHIP_DENOMS[i], 0);
  }

  return (
    <div style={{ maxWidth: 480, padding: 24 }}>
      <h1 style={{textAlign:'center'}}>Balatro Chip Calculator</h1>
      <div style={{background:'#fff',border:'2px solid #b22222',borderRadius:8,padding:16,marginBottom:16}}>
        <h2>Poker Hands</h2>
        {HANDS.map((hand, i) => (
          <div key={hand.name} style={{display:'flex',alignItems:'center',marginBottom:6}}>
            <button className="pixel-btn" onClick={()=>updateHand(i,-1)}>-</button>
            <span style={{width:36,display:'inline-block',textAlign:'center'}}>{handCounts[i]}</span>
            <button className="pixel-btn" onClick={()=>updateHand(i,1)}>+</button>
            <span style={{marginLeft:12,width:120,display:'inline-block'}}>{hand.name}</span>
            <span style={{marginLeft:8,fontSize:'0.85em'}}>Base: {hand.base} × Mult: {hand.mult}</span>
          </div>
        ))}
      </div>
      <div style={{background:'#fff',border:'2px solid #b22222',borderRadius:8,padding:16,marginBottom:16}}>
        <h2>Multipliers</h2>
        <label>Mult: <input type="number" min={1} value={mult} onChange={e=>setMult(Math.max(1,Number(e.target.value)||1))} /></label>
        <label style={{marginLeft:16}}>XMult: <input type="number" min={1} value={xmult} onChange={e=>setXmult(Math.max(1,Number(e.target.value)||1))} /></label>
      </div>
      <div style={{background:'#fff',border:'2px solid #b22222',borderRadius:8,padding:16,marginBottom:16}}>
        <h2>Joker & Bonuses</h2>
        <label><input type="checkbox" className="pixel-toggle" checked={jokerDouble} onChange={e=>setJokerDouble(e.target.checked)} /> Double Chips (Joker)</label>
        <label style={{marginLeft:16}}><input type="checkbox" className="pixel-toggle" checked={foil} onChange={e=>setFoil(e.target.checked)} /> Foil (+25%)</label>
        <label style={{marginLeft:16}}><input type="checkbox" className="pixel-toggle" checked={holo} onChange={e=>setHolo(e.target.checked)} /> Holographic (+50%)</label>
        <label style={{marginLeft:16}}><input type="checkbox" className="pixel-toggle" checked={poly} onChange={e=>setPoly(e.target.checked)} /> Polychrome (+100%)</label>
      </div>
      <div style={{background:'#fff',border:'2px solid #b22222',borderRadius:8,padding:16,marginBottom:16}}>
        <h2>Jokers</h2>
        <div style={{maxHeight:180,overflowY:'auto',marginBottom:8}}>
          {JOKERS.map((joker, i) => (
            <div key={joker.name} style={{display:'flex',alignItems:'flex-start',marginBottom:4}}>
              <input
                type="checkbox"
                className="pixel-toggle"
                checked={activeJokers.includes(i)}
                onChange={e => {
                  setActiveJokers(j => e.target.checked ? [...j, i] : j.filter(idx => idx !== i));
                }}
                style={{marginRight:8,marginTop:2}}
              />
              <span style={{fontWeight:'bold',color: joker.rarity==='Legendary' ? '#b22222' : joker.rarity==='Rare' ? '#6e2ca1' : joker.rarity==='Uncommon' ? '#1e90ff' : '#444'}}>{joker.name}</span>
              <span style={{marginLeft:8,fontSize:'0.95em',color:'#555'}}>{joker.effect}</span>
              <span style={{marginLeft:8,fontSize:'0.85em',fontStyle:'italic',color:'#888'}}>({joker.rarity})</span>
            </div>
          ))}
        </div>
        <div style={{fontSize:'0.9em',color:'#888'}}>Note: Only some Joker effects are auto-applied. Others are for tracking and reference.</div>
      </div>
      <div style={{background:'#fff',border:'2px solid #b22222',borderRadius:8,padding:16,marginBottom:16}}>
        <h2>Chip Stacks</h2>
        {CHIP_DENOMS.map((denom,i)=>(
          <div key={denom} style={{display:'flex',alignItems:'center',marginBottom:4}}>
            <span style={{width:60,display:'inline-block'}}>${denom}</span>
            <input type="number" min={0} value={chipStacks[i]} onChange={e=>updateChipStack(i,e.target.value)} />
            <span style={{marginLeft:8}}>chips = ${chipStacks[i]*denom}</span>
          </div>
        ))}
        <div style={{marginTop:8,fontWeight:'bold'}}>Physical Chips Total: ${chipValue()}</div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
        <button className="pixel-btn" onClick={calculateTotal}>Calculate Total Chips</button>
        <button className="pixel-btn" style={{background:'#f8dada'}} onClick={resetAll}>Reset</button>
      </div>
      {result && (
        <div style={{background:'#fff',border:'2px solid #b22222',borderRadius:8,padding:16,marginBottom:16}}>
          <h2>Results</h2>
          <div>Hand Total: <b>{result.handTotal}</b></div>
          <div>Final Chips (× Mult × XMult): <b style={{color:'#b22222',fontSize:'1.2em'}}>{result.total.toLocaleString()}</b></div>
        </div>
      )}
    </div>
  );
}
