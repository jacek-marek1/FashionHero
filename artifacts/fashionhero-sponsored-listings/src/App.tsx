import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BarChart3, Check, ChevronRight, CircleHelp, CreditCard, Eye, Info, LayoutGrid, Megaphone, PackageCheck, Sparkles } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  category: string;
  detail: string;
  position: number;
  art: string;
};
type Package = { days: 3 | 7 | 14; price: number; label: string };
type PromotionEvent = {
  product: string;
  package: 3 | 7 | 14;
  simulatedNewPosition: number;
  timestamp: string;
  action: 'purchased';
};

const products: Product[] = [
  { id: 'linen-shirt', name: 'Linen blend shirt', category: 'Women · Shirts', detail: 'Stone · Size S–XL', position: 18, art: 'one' },
  { id: 'city-coat', name: 'City wool coat', category: 'Women · Coats', detail: 'Navy · Size XS–L', position: 32, art: 'two' },
  { id: 'silk-skirt', name: 'Bias cut silk skirt', category: 'Women · Skirts', detail: 'Rust · Size XS–XL', position: 27, art: 'three' },
  { id: 'everyday-knit', name: 'Everyday knit cardigan', category: 'Women · Knitwear', detail: 'Oat · Size S–XXL', position: 39, art: 'four' },
];
const packages: Package[] = [
  { days: 3, price: 29, label: 'Quick test' },
  { days: 7, price: 59, label: 'Best balance' },
  { days: 14, price: 99, label: 'Full runway' },
];
const storageKey = 'fashionhero-promotion-events';

function readEvents(): PromotionEvent[] {
  try {
    const value = localStorage.getItem(storageKey);
    return value ? JSON.parse(value) as PromotionEvent[] : [];
  } catch { return []; }
}

function App() {
  const [view, setView] = useState<'products' | 'history'>('products');
  const [events, setEvents] = useState<PromotionEvent[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package>(packages[1]);
  const [step, setStep] = useState<'catalog' | 'package' | 'confirmation'>('catalog');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => setEvents(readEvents()), []);
  const purchasedIds = useMemo(() => new Set(events.map((event) => event.product)), [events]);
  const simulatedPosition = selectedProduct ? Math.min(5, Math.max(1, Math.round(selectedProduct.position * (selectedPackage.days === 3 ? .18 : selectedPackage.days === 7 ? .11 : .08)))) : 0;

  const beginPromotion = (product: Product) => {
    setSelectedProduct(product);
    setSelectedPackage(packages[1]);
    setStep('package');
  };
  const goCatalog = () => { setSelectedProduct(null); setStep('catalog'); setView('products'); };
  const purchase = () => {
    if (!selectedProduct) return;
    setIsSaving(true);
    window.setTimeout(() => {
      const event: PromotionEvent = {
        product: selectedProduct.name,
        package: selectedPackage.days,
        simulatedNewPosition: simulatedPosition,
        timestamp: new Date().toISOString(),
        action: 'purchased',
      };
      const next = [event, ...readEvents()];
      localStorage.setItem(storageKey, JSON.stringify(next));
      setEvents(next);
      setIsSaving(false);
      setStep('confirmation');
    }, 550);
  };

  return (
    <div className="app-shell">
      <aside className="side-rail">
        <div className="brand"><div className="brand-mark">FH</div><div className="brand-word">fashion<span>hero</span></div></div>
        <div className="rail-label">Seller workspace</div>
        <nav className="rail-nav" aria-label="Seller workspace navigation">
          <button className={view === 'products' ? 'active' : ''} onClick={() => { setView('products'); setStep('catalog'); setSelectedProduct(null); }} data-testid="button-nav-products"><LayoutGrid size={16} /> Products</button>
          <button className={view === 'history' ? 'active' : ''} onClick={() => { setView('history'); setStep('catalog'); setSelectedProduct(null); }} data-testid="button-nav-history"><BarChart3 size={16} /> Promotion history</button>
        </nav>
        <div className="rail-note"><strong>Visibility, clarified</strong><p>See a realistic upside before you decide to promote.</p></div>
        <div className="user-chip"><div className="avatar">KN</div><div><strong>Kamil Nowak</strong><span>Seller account</span></div></div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand"><div className="brand-mark">FH</div> fashionhero</div>
          <div className="crumb"><span>Seller workspace</span><ChevronRight size={13} /><strong>{step === 'catalog' ? view === 'products' ? 'Products' : 'Promotion history' : step === 'package' ? 'Promote product' : 'Promotion confirmed'}</strong></div>
          <div className="topbar-right"><span className="demo-pill"><span className="demo-dot" /> Demo workspace</span><CircleHelp size={17} aria-label="Help" /></div>
        </header>
        <div className="content">
          {step === 'catalog' && view === 'products' && (
            <>
              <section className="intro">
                <div><p className="eyebrow"><span className="eyebrow-line" /> Sponsored listings</p><h1>Put your best pieces in the right place.</h1><p className="intro-copy">Give a product a short visibility boost in search. Pick an item, see its potential position, and make a clear decision.</p></div>
                <div className="stat-strip"><div className="stat"><span className="stat-value">{products.length}</span><span className="stat-label">Active products</span></div><div className="stat"><span className="stat-value">{events.length}</span><span className="stat-label">Promotions run</span></div></div>
              </section>
              <div className="section-head"><h2>Your product list</h2><span>Search positions refresh daily</span></div>
              <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} hasPromotion={purchasedIds.has(product.name)} onPromote={beginPromotion} />)}</div>
              <p className="disclosure"><Info size={14} /> Sponsored listings are a demo experience. No payment is collected and no live ranking is changed.</p>
            </>
          )}
          {step === 'catalog' && view === 'history' && <HistoryView events={events} onNewPromotion={() => { setView('products'); setStep('catalog'); }} />}
          {step === 'package' && selectedProduct && <PromotionFlow product={selectedProduct} selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage} simulatedPosition={simulatedPosition} onBack={goCatalog} onPurchase={purchase} isSaving={isSaving} />}
          {step === 'confirmation' && selectedProduct && <Confirmation product={selectedProduct} selectedPackage={selectedPackage} simulatedPosition={simulatedPosition} onDone={goCatalog} onHistory={() => { setView('history'); setStep('catalog'); setSelectedProduct(null); }} />}
        </div>
      </main>
    </div>
  );
}

function ProductCard({ product, hasPromotion, onPromote }: { product: Product; hasPromotion: boolean; onPromote: (product: Product) => void }) {
  return <article className="product-card" data-testid={`card-product-${product.id}`}>
    <div className={`product-art art-${product.art}`}><span className="art-label">Live listing</span></div>
    <div className="product-info"><span className="product-meta">{product.category}</span><h3>{product.name}</h3><p className="product-detail">{product.detail}</p><div className="position-row"><div><span className="position-label">Current position</span><div className="position-number">#{product.position}<small> / 100</small></div></div><button className="btn-arrow" onClick={() => onPromote(product)} data-testid={`button-promote-${product.id}`}>{hasPromotion ? 'Promuj ponownie' : 'Promuj'} <ArrowRight size={15} /></button></div></div>
  </article>;
}

function PromotionFlow({ product, selectedPackage, setSelectedPackage, simulatedPosition, onBack, onPurchase, isSaving }: { product: Product; selectedPackage: Package; setSelectedPackage: (value: Package) => void; simulatedPosition: number; onBack: () => void; onPurchase: () => void; isSaving: boolean }) {
  return <section className="flow-wrap"><div className="flow-top"><button className="back-button" onClick={onBack} data-testid="button-back-to-products"><ArrowLeft size={15} /> Wróć do produktów</button><ChevronRight size={14} color="hsl(218 17% 46%)" /><h1>Promuj produkt</h1></div><div className="flow-layout">
    <div className="selected-card"><div className="selected-product"><div className={`selected-art ${product.art}`} /><div><span className="product-meta">{product.category}</span><h2>{product.name}</h2><p>Obecna pozycja: #{product.position} w wynikach wyszukiwania</p></div></div><p className="section-kicker">Wybierz czas promocji</p><div className="package-grid">{packages.map((item) => <button key={item.days} className={`package-option ${selectedPackage.days === item.days ? 'selected' : ''}`} onClick={() => setSelectedPackage(item)} data-testid={`button-package-${item.days}`}><span className="package-days">{item.days} dni</span><span className="package-label">{item.label}</span><span className="package-price">{item.price} zł</span></button>)}</div><p className="package-note"><Sparkles size={14} color="hsl(48 79% 45%)" /> Promowany produkt pojawi się wyżej w wynikach przez wybrany czas.</p></div>
     <aside className="simulation-card"><p className="section-kicker">Symulacja widoczności</p><h2>Sprawdź, jak może zmienić się pozycja produktu.</h2><div className="rank-shift"><div className="rank-box"><span className="rank-label">Teraz</span><strong className="rank-number">#{product.position}</strong></div><ArrowRight className="rank-arrow" size={21} /><div className="rank-box"><span className="rank-label">Po promocji</span><strong className="rank-number">#{simulatedPosition}</strong></div></div><p>To symulowana poprawa pozycji, a nie gwarancja rzeczywistego rankingu.</p><button className="btn-primary" onClick={onPurchase} disabled={isSaving} data-testid="button-confirm-purchase">{isSaving ? 'Zapisywanie…' : <>Kup promocję — {selectedPackage.price} zł <ArrowRight size={15} /></>}</button></aside>
   </div><p className="disclosure"><CreditCard size={14} /> <strong>Symulacja — żadna płatność nie została pobrana.</strong> Nie prosimy o dane karty.</p></section>;
}

function Confirmation({ product, selectedPackage, simulatedPosition, onDone, onHistory }: { product: Product; selectedPackage: Package; simulatedPosition: number; onDone: () => void; onHistory: () => void }) {
  return <section className="confirmation"><div className="confirm-mark"><Check size={30} strokeWidth={3} /></div><p className="eyebrow" style={{ justifyContent: 'center' }}><span className="eyebrow-line" /> Promotion booked <span className="eyebrow-line" /></p><h1>{product.name} is ready for more eyes.</h1><p>Your demo promotion has been saved. It will run for {selectedPackage.days} days, with a simulated move from #{product.position} to #{simulatedPosition}.</p><div className="receipt"><div className="receipt-line"><span>Product</span><strong>{product.name}</strong></div><div className="receipt-line"><span>Package</span><strong>{selectedPackage.days} days</strong></div><div className="receipt-line"><span>Simulated position</span><strong>#{product.position} → #{simulatedPosition}</strong></div><div className="receipt-line"><span>Demo total</span><strong>{selectedPackage.price} PLN</strong></div></div><div className="confirm-actions"><button className="btn-ghost" onClick={onHistory} data-testid="button-view-history">View promotion history</button><button className="btn-primary" onClick={onDone} data-testid="button-back-product-list">Back to product list <ArrowRight size={15} /></button></div><p className="disclosure"><Info size={14} /> This is a simulated purchase for research. No money changed hands and no live FashionHero position was altered.</p></section>;
}

function HistoryView({ events, onNewPromotion }: { events: PromotionEvent[]; onNewPromotion: () => void }) {
  return <section className="flow-wrap"><div className="intro"><div><p className="eyebrow"><span className="eyebrow-line" /> Activity log</p><h1>Promotion history.</h1><p className="intro-copy">A simple record of the visibility decisions you have explored in this demo.</p></div><button className="btn-primary" onClick={onNewPromotion} data-testid="button-new-promotion"><Megaphone size={15} /> New promotion</button></div><div className="section-head"><h2>Saved promotions</h2><span>{events.length} {events.length === 1 ? 'entry' : 'entries'}</span></div><div className="history-panel">{events.length === 0 ? <div className="empty-history"><PackageCheck size={24} color="hsl(48 79% 45%)" /><p>No promotions yet. Choose a product to see your first simulated result.</p><button className="btn-arrow" onClick={onNewPromotion} data-testid="button-empty-new-promotion">Browse products <ArrowRight size={15} /></button></div> : <><div className="history-row header"><span>Product</span><span>Package</span><span>Movement</span><span>Date</span><span>Status</span></div>{events.map((event, index) => <div className="history-row" key={`${event.timestamp}-${index}`} data-testid={`row-promotion-${index}`}><div className="history-product"><span className={`mini-art ${products.find((product) => product.name === event.product)?.art ?? 'one'}`} />{event.product}</div><strong>{event.package} days</strong><span className="move-up">#{event.simulatedNewPosition}</span><span>{new Date(event.timestamp).toLocaleDateString('en-GB')}</span><span className="history-status"><Check size={13} /> Purchased</span></div>)}</>}</div><p className="disclosure"><Info size={14} /> Demo records live only in this browser via localStorage. They are not sent to FashionHero.</p></section>;
}

export default App;
