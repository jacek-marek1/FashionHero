import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BarChart3, Check, ChevronRight, CircleHelp, CreditCard, Eye, Info, LayoutGrid, Megaphone, PackageCheck, Sparkles, TrendingUp } from 'lucide-react';

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
  { id: 'linen-shirt', name: 'Lniana koszula', category: 'Damskie · Koszule', detail: 'Kamień · Rozmiar S–XL', position: 18, art: 'one' },
  { id: 'city-coat', name: 'Wełniany płaszcz City', category: 'Damskie · Płaszcze', detail: 'Granat · Rozmiar XS–L', position: 32, art: 'two' },
  { id: 'silk-skirt', name: 'Jedwabna spódnica Bias', category: 'Damskie · Spódnice', detail: 'Rdzawy · Rozmiar XS–XL', position: 27, art: 'three' },
  { id: 'everyday-knit', name: 'Dzianinowy kardigan Everyday', category: 'Damskie · Dzianiny', detail: 'Owsiany · Rozmiar S–XXL', position: 39, art: 'four' },
];
const packages: Package[] = [
  { days: 3, price: 29, label: 'Szybki test' },
  { days: 7, price: 59, label: 'Najlepszy wybór' },
  { days: 14, price: 99, label: 'Pełna widoczność' },
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
  const [productTab, setProductTab] = useState<'active' | 'promoted'>('active');
  const [events, setEvents] = useState<PromotionEvent[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package>(packages[1]);
  const [step, setStep] = useState<'catalog' | 'package' | 'confirmation' | 'performance'>('catalog');
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
  const openPerformance = (product: Product) => { setSelectedProduct(product); setStep('performance'); };
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
        <div className="rail-label">Panel sprzedawcy</div>
        <nav className="rail-nav" aria-label="Nawigacja panelu sprzedawcy">
          <button className={view === 'products' ? 'active' : ''} onClick={() => { setView('products'); setStep('catalog'); setSelectedProduct(null); }} data-testid="button-nav-products"><LayoutGrid size={16} /> Produkty</button>
          <button className={view === 'history' ? 'active' : ''} onClick={() => { setView('history'); setStep('catalog'); setSelectedProduct(null); }} data-testid="button-nav-history"><BarChart3 size={16} /> Historia promocji</button>
        </nav>
        <div className="rail-note"><strong>Widoczność bez zgadywania</strong><p>Zobacz możliwy efekt, zanim wypromujesz produkt.</p></div>
        <div className="user-chip"><div className="avatar">KN</div><div><strong>Kamil Nowak</strong><span>Konto sprzedawcy</span></div></div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand"><div className="brand-mark">FH</div> fashionhero</div>
          <div className="crumb"><span>Panel sprzedawcy</span><ChevronRight size={13} /><strong>{step === 'catalog' ? view === 'products' ? 'Produkty' : 'Historia promocji' : step === 'package' ? 'Promuj produkt' : step === 'performance' ? 'Wyniki promocji' : 'Promocja potwierdzona'}</strong></div>
          <div className="topbar-right"><span className="demo-pill"><span className="demo-dot" /> Środowisko demo</span><CircleHelp size={17} aria-label="Pomoc" /></div>
        </header>
        <div className="content">
          {step === 'catalog' && view === 'products' && (
            <>
              <section className="intro">
                <div><p className="eyebrow"><span className="eyebrow-line" /> Promowane oferty</p><h1>Umieść swoje produkty tam, gdzie je widać.</h1><p className="intro-copy">Zwiększ widoczność produktu w wynikach wyszukiwania. Wybierz produkt, sprawdź możliwą pozycję i podejmij decyzję.</p></div>
                <div className="stat-strip"><div className="stat"><span className="stat-value">{products.filter((product) => !purchasedIds.has(product.name)).length}</span><span className="stat-label">Aktywne produkty</span></div><div className="stat"><span className="stat-value">{products.filter((product) => purchasedIds.has(product.name)).length}</span><span className="stat-label">Promowane produkty</span></div></div>
              </section>
              <div className="section-head"><h2>Lista produktów</h2><span>Pozycje odświeżają się codziennie</span></div>
              <div className="product-tabs" role="tablist" aria-label="Widok produktów">
                <button className={productTab === 'active' ? 'active' : ''} onClick={() => setProductTab('active')} role="tab" aria-selected={productTab === 'active'}>Aktywne produkty <span>{products.filter((product) => !purchasedIds.has(product.name)).length}</span></button>
                <button className={productTab === 'promoted' ? 'active' : ''} onClick={() => setProductTab('promoted')} role="tab" aria-selected={productTab === 'promoted'}>Promowane produkty <span>{products.filter((product) => purchasedIds.has(product.name)).length}</span></button>
              </div>
              {productTab === 'active' && <div className="product-grid">{products.filter((product) => !purchasedIds.has(product.name)).map((product) => <ProductCard key={product.id} product={product} hasPromotion={false} onPromote={beginPromotion} />)}</div>}
              {productTab === 'promoted' && <div className="product-grid">{products.filter((product) => purchasedIds.has(product.name)).map((product) => <ProductCard key={product.id} product={product} hasPromotion onPromote={beginPromotion} onViewPerformance={openPerformance} />)}</div>}
              {productTab === 'promoted' && products.every((product) => !purchasedIds.has(product.name)) && <div className="tab-empty"><TrendingUp size={23} /><strong>Nie masz jeszcze promowanych produktów</strong><p>Wybierz produkt z zakładki aktywnych, aby zobaczyć jego potencjał.</p><button className="btn-arrow" onClick={() => setProductTab('active')}>Przejdź do aktywnych produktów <ArrowRight size={15} /></button></div>}
              <p className="disclosure"><Info size={14} /> To jest symulacja — żadna płatność nie została pobrana, a rzeczywisty ranking się nie zmienił.</p>
            </>
          )}
          {step === 'catalog' && view === 'history' && <HistoryView events={events} onNewPromotion={() => { setView('products'); setStep('catalog'); }} />}
          {step === 'package' && selectedProduct && <PromotionFlow product={selectedProduct} selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage} simulatedPosition={simulatedPosition} onBack={goCatalog} onPurchase={purchase} isSaving={isSaving} />}
          {step === 'confirmation' && selectedProduct && <Confirmation product={selectedProduct} selectedPackage={selectedPackage} simulatedPosition={simulatedPosition} onDone={goCatalog} onHistory={() => { setView('history'); setStep('catalog'); setSelectedProduct(null); }} />}
          {step === 'performance' && selectedProduct && <PerformanceView product={selectedProduct} event={events.find((item) => item.product === selectedProduct.name)} onBack={goCatalog} onPromoteAgain={beginPromotion} />}
        </div>
      </main>
    </div>
  );
}

function ProductCard({ product, hasPromotion, onPromote, onViewPerformance }: { product: Product; hasPromotion: boolean; onPromote: (product: Product) => void; onViewPerformance?: (product: Product) => void }) {
  const open = () => hasPromotion && onViewPerformance?.(product);
  return <article className={`product-card ${hasPromotion ? 'promoted-card' : ''}`} data-testid={`card-product-${product.id}`} onClick={open} onKeyDown={(event) => { if (hasPromotion && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); open(); } }} tabIndex={hasPromotion ? 0 : undefined} role={hasPromotion ? 'button' : undefined}>
    <div className={`product-art art-${product.art}`}><span className="art-label">Aktywna oferta</span></div>
    <div className="product-info"><span className="product-meta">{product.category}</span><h3>{product.name}</h3><p className="product-detail">{product.detail}</p>{hasPromotion && <span className="promoted-label"><TrendingUp size={12} /> Promowany produkt</span>}<div className="position-row"><div><span className="position-label">Aktualna pozycja</span><div className="position-number">#{product.position}<small> / 100</small></div></div><button className="btn-arrow" onClick={(event) => { event.stopPropagation(); onPromote(product); }} data-testid={`button-promote-${product.id}`}>{hasPromotion ? 'Promuj ponownie' : 'Promuj'} <ArrowRight size={15} /></button></div>{hasPromotion && <div className="performance-hint"><Eye size={13} /> Kliknij kartę, aby zobaczyć wyniki</div>}</div>
  </article>;
}

function PromotionFlow({ product, selectedPackage, setSelectedPackage, simulatedPosition, onBack, onPurchase, isSaving }: { product: Product; selectedPackage: Package; setSelectedPackage: (value: Package) => void; simulatedPosition: number; onBack: () => void; onPurchase: () => void; isSaving: boolean }) {
  return <section className="flow-wrap"><div className="flow-top"><button className="back-button" onClick={onBack} data-testid="button-back-to-products"><ArrowLeft size={15} /> Wróć do produktów</button><ChevronRight size={14} color="hsl(218 17% 46%)" /><h1>Promuj produkt</h1></div><div className="flow-layout">
    <div className="selected-card"><div className="selected-product"><div className={`selected-art ${product.art}`} /><div><span className="product-meta">{product.category}</span><h2>{product.name}</h2><p>Obecna pozycja: #{product.position} w wynikach wyszukiwania</p></div></div><p className="section-kicker">Wybierz czas promocji</p><div className="package-grid">{packages.map((item) => <button key={item.days} className={`package-option ${selectedPackage.days === item.days ? 'selected' : ''}`} onClick={() => setSelectedPackage(item)} data-testid={`button-package-${item.days}`}><span className="package-days">{item.days} dni</span><span className="package-label">{item.label}</span><span className="package-price">{item.price} zł</span></button>)}</div><p className="package-note"><Sparkles size={14} color="hsl(48 79% 45%)" /> Promowany produkt pojawi się wyżej w wynikach przez wybrany czas.</p></div>
     <aside className="simulation-card"><p className="section-kicker">Symulacja widoczności</p><h2>Sprawdź, jak może zmienić się pozycja produktu.</h2><div className="rank-shift"><div className="rank-box"><span className="rank-label">Teraz</span><strong className="rank-number">#{product.position}</strong></div><ArrowRight className="rank-arrow" size={21} /><div className="rank-box"><span className="rank-label">Po promocji</span><strong className="rank-number">#{simulatedPosition}</strong></div></div><p>To symulowana poprawa pozycji, a nie gwarancja rzeczywistego rankingu.</p><button className="btn-primary" onClick={onPurchase} disabled={isSaving} data-testid="button-confirm-purchase">{isSaving ? 'Zapisywanie…' : <>Kup promocję — {selectedPackage.price} zł <ArrowRight size={15} /></>}</button></aside>
   </div><p className="disclosure"><CreditCard size={14} /> <strong>Symulacja — żadna płatność nie została pobrana.</strong> Nie prosimy o dane karty.</p></section>;
}

function Confirmation({ product, selectedPackage, simulatedPosition, onDone, onHistory }: { product: Product; selectedPackage: Package; simulatedPosition: number; onDone: () => void; onHistory: () => void }) {
  return <section className="confirmation"><div className="confirm-mark"><Check size={30} strokeWidth={3} /></div><p className="eyebrow" style={{ justifyContent: 'center' }}><span className="eyebrow-line" /> Promocja aktywna (demo) <span className="eyebrow-line" /></p><h1>{product.name} jest teraz lepiej widoczny.</h1><p>Twoja demonstracyjna promocja została zapisana. Będzie aktywna przez {selectedPackage.days} dni, a symulowana zmiana pozycji to #{product.position} → #{simulatedPosition}.</p><div className="receipt"><div className="receipt-line"><span>Produkt</span><strong>{product.name}</strong></div><div className="receipt-line"><span>Pakiet</span><strong>{selectedPackage.days} dni</strong></div><div className="receipt-line"><span>Symulowana pozycja</span><strong>#{product.position} → #{simulatedPosition}</strong></div><div className="receipt-line"><span>Wartość demo</span><strong>{selectedPackage.price} zł</strong></div></div><div className="confirm-actions"><button className="btn-ghost" onClick={onHistory} data-testid="button-view-history">Zobacz historię promocji</button><button className="btn-primary" onClick={onDone} data-testid="button-back-product-list">Wróć do listy produktów <ArrowRight size={15} /></button></div><p className="disclosure"><Info size={14} /> To zakup demonstracyjny do celów badawczych. Żadne środki nie zostały pobrane, a rzeczywista pozycja FashionHero się nie zmieniła.</p></section>;
}

function PerformanceView({ product, event, onBack, onPromoteAgain }: { product: Product; event?: PromotionEvent; onBack: () => void; onPromoteAgain: (product: Product) => void }) {
  if (!event) return null;
  return <section className="flow-wrap performance-view"><div className="flow-top"><button className="back-button" onClick={onBack}><ArrowLeft size={15} /> Wróć do produktów</button><ChevronRight size={14} color="hsl(218 17% 46%)" /><h1>Wyniki promocji</h1></div><div className="performance-header"><div><p className="eyebrow"><span className="eyebrow-line" /> Raport promowanego produktu</p><h2>{product.name}</h2><p>Podsumowanie efektu wybranego pakietu widoczności.</p></div><span className="active-badge"><Check size={13} /> Promocja aktywna (demo)</span></div><div className="performance-grid"><div className="result-card result-primary"><span className="result-label">Zmiana pozycji w wynikach</span><div className="result-movement"><strong>#{product.position}</strong><ArrowRight size={24} /><strong>#{event.simulatedNewPosition}</strong></div><p>Symulowany wynik po włączeniu promocji</p></div><div className="result-card"><span className="result-label">Wybrany pakiet</span><strong className="result-value">{event.package} dni</strong><p>Promocja została uruchomiona {new Date(event.timestamp).toLocaleDateString('pl-PL')}</p></div><div className="result-card"><span className="result-label">Widoczność</span><strong className="result-value result-green"><TrendingUp size={22} /> Wyższa</strong><p>Produkt jest oznaczony jako promowany</p></div></div><div className="performance-note"><Eye size={18} /><div><strong>Co oznacza ten wynik?</strong><p>Pozycja po promocji jest symulacją do celów badawczych. Nie wpływa na rzeczywiste wyniki wyszukiwania FashionHero.</p></div></div><div className="performance-actions"><button className="btn-ghost" onClick={onBack}>Wróć do listy</button><button className="btn-primary" onClick={() => onPromoteAgain(product)}>Promuj ponownie <ArrowRight size={15} /></button></div><p className="disclosure"><Info size={14} /> Symulacja — żadna płatność nie została pobrana.</p></section>;
}

function HistoryView({ events, onNewPromotion }: { events: PromotionEvent[]; onNewPromotion: () => void }) {
  return <section className="flow-wrap"><div className="intro"><div><p className="eyebrow"><span className="eyebrow-line" /> Historia działań</p><h1>Historia promocji.</h1><p className="intro-copy">Tutaj znajdziesz zapis decyzji dotyczących widoczności produktów w tej demonstracji.</p></div><button className="btn-primary" onClick={onNewPromotion} data-testid="button-new-promotion"><Megaphone size={15} /> Nowa promocja</button></div><div className="section-head"><h2>Zapisane promocje</h2><span>{events.length} {events.length === 1 ? 'wpis' : 'wpisów'}</span></div><div className="history-panel">{events.length === 0 ? <div className="empty-history"><PackageCheck size={24} color="hsl(48 79% 45%)" /><p>Nie ma jeszcze promocji. Wybierz produkt, aby zobaczyć pierwszy symulowany efekt.</p><button className="btn-arrow" onClick={onNewPromotion} data-testid="button-empty-new-promotion">Przeglądaj produkty <ArrowRight size={15} /></button></div> : <><div className="history-row header"><span>Produkt</span><span>Pakiet</span><span>Zmiana</span><span>Data</span><span>Status</span></div>{events.map((event, index) => <div className="history-row" key={`${event.timestamp}-${index}`} data-testid={`row-promotion-${index}`}><div className="history-product"><span className={`mini-art ${products.find((product) => product.name === event.product)?.art ?? 'one'}`} />{event.product}</div><strong>{event.package} dni</strong><span className="move-up">#{event.simulatedNewPosition}</span><span>{new Date(event.timestamp).toLocaleDateString('pl-PL')}</span><span className="history-status"><Check size={13} /> Kupiono</span></div>)}</>}</div><p className="disclosure"><Info size={14} /> Dane demonstracyjne są przechowywane tylko w tej przeglądarce. Nie są wysyłane do FashionHero.</p></section>;
}

export default App;
