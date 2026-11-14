import { useMemo, useState } from 'react'
import {
  ArrowRight, Bell, Bookmark, Check, ChevronDown, Heart, Menu, MessageCircle,
  Search, ShieldCheck, SlidersHorizontal, Sparkles, UserRound, X,
} from 'lucide-react'
import { categories, listings as seedListings } from './data'
import type { Listing, User } from './types'

const money = (value: number) => new Intl.NumberFormat('fr-MA').format(value) + ' MAD'

function App() {
  const [page, setPage] = useState<'home' | 'listings' | 'detail' | 'dashboard' | 'login'>('home')
  const [listings, setListings] = useState(seedListings)
  const [selected, setSelected] = useState<Listing | null>(null)
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('Toutes les villes')
  const [category, setCategory] = useState('Toutes les catégories')
  const [sort, setSort] = useState('recent')
  const [menuOpen, setMenuOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [user, setUser] = useState<User | null>(null)

  const results = useMemo(() => {
    const filtered = listings.filter((item) => {
      const query = search.toLowerCase()
      return (!query || `${item.title} ${item.description}`.toLowerCase().includes(query))
        && (city === 'Toutes les villes' || item.city === city)
        && (category === 'Toutes les catégories' || item.category === category)
    })
    return [...filtered].sort((a, b) => sort === 'price' ? a.price - b.price : a.id.localeCompare(b.id))
  }, [category, city, listings, search, sort])

  const navigate = (next: typeof page) => {
    setPage(next)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const openListing = (item: Listing) => { setSelected(item); navigate('detail') }
  const toggleFavorite = (id: string) => setFavorites((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id])

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container nav">
          <button className="brand" onClick={() => navigate('home')} aria-label="SoukExpat - Accueil"><img src="/logo-soukexpat.png?v=2" alt="SoukExpat" /></button>
          <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
            <button onClick={() => navigate('home')}>Accueil</button>
            <button onClick={() => navigate('listings')}>Annonces</button>
            <button onClick={() => { setCategory('Immobilier'); navigate('listings') }}>Immobilier</button>
            <button onClick={() => { setCategory('Services'); navigate('listings') }}>Services</button>
            <button onClick={() => navigate('home')}>À propos</button>
          </nav>
          <div className="nav-actions">
            <button className="icon-btn notification"><Bell size={19} /><i /></button>
            {user ? <button className="avatar" onClick={() => navigate('dashboard')}>{user.name.slice(0, 1)}</button> : <button className="login-link" onClick={() => navigate('login')}>Connexion</button>}
            <button className="primary-btn small" onClick={() => navigate('dashboard')}>Déposer une annonce <ArrowRight size={16} /></button>
            <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </header>

      {page === 'home' && <Home onSearch={(value) => { setSearch(value); navigate('listings') }} onCategory={(value) => { setCategory(value); navigate('listings') }} onOpen={openListing} />}
      {page === 'listings' && <Listings results={results} search={search} setSearch={setSearch} city={city} setCity={setCity} category={category} setCategory={setCategory} sort={sort} setSort={setSort} favorites={favorites} toggleFavorite={toggleFavorite} onOpen={openListing} />}
      {page === 'detail' && selected && <Detail item={selected} favorite={favorites.includes(selected.id)} toggleFavorite={toggleFavorite} onBack={() => navigate('listings')} />}
      {page === 'login' && <Login onLogin={(next) => { setUser(next); navigate('dashboard') }} />}
      {page === 'dashboard' && <Dashboard user={user} listings={listings} onPublish={(item) => { setListings((current) => [item, ...current]); navigate('listings') }} />}

      <footer className="footer"><div className="container footer-grid"><div><button className="brand footer-brand" onClick={() => navigate('home')} aria-label="SoukExpat - Accueil"><img src="/logo-soukexpat.png?v=2" alt="SoukExpat" /></button><p>La communauté qui facilite votre vie au Maroc.</p></div><div><h4>Découvrir</h4><button>Annonces</button><button>Catégories</button><button>Comment ça marche</button></div><div><h4>Confiance</h4><button>Règles de publication</button><button>Conseils de sécurité</button><button>Centre d'aide</button></div><div><h4>Suivez-nous</h4><p className="muted">Une marketplace pensée pour les expatriés, par une communauté engagée.</p></div></div><div className="container footer-bottom"><span>© 2025 SoukExpat. Tous droits réservés.</span><span>Conditions · Confidentialité</span></div></footer>
    </div>
  )
}

function Home({ onSearch, onCategory, onOpen }: { onSearch: (v: string) => void; onCategory: (v: string) => void; onOpen: (v: Listing) => void }) {
  const [query, setQuery] = useState('')
  return <main>
    <section className="hero"><div className="container hero-grid"><div className="hero-content"><div className="eyebrow"><Sparkles size={14} /> LA COMMUNAUTÉ DES EXPATRIÉS AU MAROC</div><h1>Le Maroc,<br /><em>à votre façon.</em></h1><p>Trouvez un logement, un service ou une nouvelle communauté. Tout ce dont vous avez besoin pour vous sentir chez vous.</p><div className="hero-search"><Search size={20} /><input placeholder="Que recherchez-vous ?" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onSearch(query)} /><button onClick={() => onSearch(query)}>Rechercher</button></div><div className="popular">Recherches populaires : <button onClick={() => onSearch('appartement')}>Appartement</button><button onClick={() => onSearch('vélo')}>Vélo</button><button onClick={() => onSearch('cours')}>Cours de français</button></div></div><div className="hero-visual"><div className="hero-circle circle-back" /><div className="hero-circle circle-front" /><img src="/logo-soukexpat.png" alt="" /></div></div></section>
    <section className="container section"><div className="section-heading"><div><span className="eyebrow plain">EXPLORER</span><h2>Tout commence ici</h2></div><button className="text-link" onClick={() => onSearch('')}>Voir toutes les annonces <ArrowRight size={16} /></button></div><div className="category-grid">{categories.map((cat) => <button key={cat.name} className="category-card" onClick={() => onCategory(cat.name)}><span className="category-icon">{cat.icon}</span><strong>{cat.name}</strong><small>{cat.count}</small><ArrowRight size={16} /></button>)}</div></section>
    <section className="container section featured-section"><div className="section-heading"><div><span className="eyebrow plain">À LA UNE</span><h2>Les annonces du moment</h2></div><span className="live-dot"><i /> Mis à jour récemment</span></div><div className="listing-grid">{seedListings.slice(0, 3).map((item) => <ListingCard key={item.id} item={item} onOpen={onOpen} />)}</div></section>
    <section className="trust-banner"><div className="container trust-inner"><div className="trust-icon"><ShieldCheck size={27} /></div><div><h3>Une communauté de confiance</h3><p>Chaque annonce est vérifiée par notre équipe avant sa publication.</p></div><button className="secondary-btn">En savoir plus <ArrowRight size={16} /></button></div></section>
  </main>
}

function ListingCard({ item, onOpen, favorite = false, onFavorite }: { item: Listing; onOpen: (v: Listing) => void; favorite?: boolean; onFavorite?: () => void }) {
  return <article className="listing-card"><div className="card-image" onClick={() => onOpen(item)}><img src={item.image} alt={item.title} /><span className="type-tag">{item.type}</span>{onFavorite && <button className={favorite ? 'heart active' : 'heart'} onClick={(e) => { e.stopPropagation(); onFavorite() }}><Heart size={17} fill={favorite ? 'currentColor' : 'none'} /></button>}</div><div className="card-body" onClick={() => onOpen(item)}><div className="card-meta"><span>{item.category}</span><span>·</span><span>{item.city}</span></div><h3>{item.title}</h3><div className="card-bottom"><strong>{money(item.price)}{item.type === 'Location' && <small> / mois</small>}</strong><span>{item.date}</span></div><div className="seller"><span className="mini-avatar">{item.initials}</span><span>{item.seller}</span><span className="verified"><Check size={11} /></span></div></div></article>
}

function Listings(props: { results: Listing[]; search: string; setSearch: (v: string) => void; city: string; setCity: (v: string) => void; category: string; setCategory: (v: string) => void; sort: string; setSort: (v: string) => void; favorites: string[]; toggleFavorite: (v: string) => void; onOpen: (v: Listing) => void }) {
  return <main className="container listing-page"><div className="page-intro"><div><span className="eyebrow plain">LE MARCHÉ SOUKEXPAT</span><h1>Trouvez ce qu'il vous faut.</h1><p>Des milliers d'annonces proposées par la communauté.</p></div><button className="filter-btn"><SlidersHorizontal size={17} /> Filtres</button></div><div className="filter-bar"><div className="filter-search"><Search size={18} /><input value={props.search} onChange={(e) => props.setSearch(e.target.value)} placeholder="Rechercher une annonce..." /></div><select value={props.category} onChange={(e) => props.setCategory(e.target.value)}><option>Toutes les catégories</option>{categories.map((c) => <option key={c.name}>{c.name}</option>)}</select><select value={props.city} onChange={(e) => props.setCity(e.target.value)}><option>Toutes les villes</option>{['Marrakech', 'Casablanca', 'Rabat', 'Agadir', 'Tanger', 'Essaouira'].map((c) => <option key={c}>{c}</option>)}</select></div><div className="results-top"><span><strong>{props.results.length}</strong> annonces trouvées</span><label>Trier par <select value={props.sort} onChange={(e) => props.setSort(e.target.value)}><option value="recent">Plus récentes</option><option value="price">Prix croissant</option></select></label></div>{props.results.length ? <div className="listing-grid">{props.results.map((item) => <ListingCard key={item.id} item={item} onOpen={props.onOpen} favorite={props.favorites.includes(item.id)} onFavorite={() => props.toggleFavorite(item.id)} />)}</div> : <div className="empty"><Search size={32} /><h3>Aucune annonce trouvée</h3><p>Essayez de modifier vos filtres de recherche.</p></div>}</main>
}

function Detail({ item, favorite, toggleFavorite, onBack }: { item: Listing; favorite: boolean; toggleFavorite: (id: string) => void; onBack: () => void }) {
  return <main className="container detail-page"><button className="back-link" onClick={onBack}>← Retour aux annonces</button><div className="detail-layout"><div><img className="detail-image" src={item.image} alt={item.title} /><div className="detail-thumb"><img src={item.image} alt="" /><span>+ 4 photos</span></div></div><div className="detail-info"><div className="card-meta"><span>{item.category}</span><span>·</span><span>{item.city}</span><span>·</span><span>{item.date}</span></div><h1>{item.title}</h1><strong className="detail-price">{money(item.price)}{item.type === 'Location' && <small> / mois</small>}</strong><p className="detail-description">{item.description}</p><div className="seller-box"><span className="big-avatar">{item.initials}</span><div><strong>{item.seller}</strong><span>Membre vérifié · Membre depuis 2023</span></div><Check className="green-check" size={18} /></div><button className="primary-btn full"><MessageCircle size={18} /> Contacter l'annonceur</button><button className={favorite ? 'secondary-btn full saved' : 'secondary-btn full'} onClick={() => toggleFavorite(item.id)}><Bookmark size={17} fill={favorite ? 'currentColor' : 'none'} /> {favorite ? 'Dans vos favoris' : 'Ajouter aux favoris'}</button><div className="safe-note"><ShieldCheck size={18} /><span><strong>Conseil de sécurité</strong><br />Ne versez jamais d'argent avant d'avoir vu le bien ou le produit.</span></div></div></div></main>
}

function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [isRegister, setIsRegister] = useState(false)
  return <main className="auth-page"><div className="auth-card"><img className="auth-logo" src="/logo-soukexpat.png?v=2" alt="SoukExpat" /><h1>{isRegister ? 'Rejoignez SoukExpat' : 'Bon retour parmi nous'}</h1><p>{isRegister ? 'Créez votre compte gratuitement.' : 'Connectez-vous pour continuer.'}</p>{isRegister && <input placeholder="Nom complet" />}<input type="email" placeholder="Adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} /><input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} /><button className="primary-btn full" onClick={() => onLogin({ name: isRegister ? 'Nouveau membre' : 'Alexandre Martin', email: email || 'alexandre@example.com', city: 'Marrakech' })}>{isRegister ? 'Créer mon compte' : 'Se connecter'} <ArrowRight size={16} /></button><div className="auth-switch">{isRegister ? 'Déjà membre ?' : 'Pas encore de compte ?'} <button onClick={() => setIsRegister(!isRegister)}>{isRegister ? 'Se connecter' : 'S’inscrire'}</button></div><p className="auth-legal">En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.</p></div></main>
}

function Dashboard({ user, listings, onPublish }: { user: User | null; listings: Listing[]; onPublish: (item: Listing) => void }) {
  const [title, setTitle] = useState(''); const [showForm, setShowForm] = useState(false)
  if (!user) return <Login onLogin={() => window.location.reload()} />
  const mine = listings.slice(0, 2)
  return <main className="container dashboard"><div className="dashboard-head"><div><span className="eyebrow plain">ESPACE MEMBRE</span><h1>Bonjour, {user.name.split(' ')[0]} <span>👋</span></h1><p>Gérez vos annonces et retrouvez vos échanges.</p></div><button className="primary-btn" onClick={() => setShowForm(!showForm)}>+ Déposer une annonce</button></div>{showForm && <div className="publish-box"><h2>Nouvelle annonce</h2><input placeholder="Titre de l'annonce" value={title} onChange={(e) => setTitle(e.target.value)} /><button className="primary-btn" disabled={!title} onClick={() => onPublish({ ...listings[0], id: Date.now().toString(), title, seller: user.name, initials: user.name.slice(0, 2).toUpperCase(), date: 'À l’instant', featured: false })}>Soumettre à la modération <ArrowRight size={16} /></button><p><ShieldCheck size={15} /> Votre annonce sera vérifiée avant publication.</p></div>}<div className="stats-row"><div><strong>{mine.length}</strong><span>Annonces publiées</span></div><div><strong>{favoritesCount(listings)}</strong><span>Vues ce mois</span></div><div><strong>0</strong><span>Messages non lus</span></div></div><div className="dashboard-section"><div className="section-heading"><div><span className="eyebrow plain">VOS ANNONCES</span><h2>Gérez vos publications</h2></div><button className="text-link">Voir tout <ArrowRight size={16} /></button></div><div className="dashboard-list">{mine.map((item) => <div className="dashboard-item" key={item.id}><img src={item.image} alt="" /><div><strong>{item.title}</strong><span>{money(item.price)} · {item.city}</span></div><span className="status"><i /> En ligne</span><button>⋮</button></div>)}</div></div><div className="message-callout"><MessageCircle size={22} /><div><strong>Vous avez des messages ?</strong><p>Retrouvez toutes vos conversations avec les membres de la communauté.</p></div><button className="text-link">Voir mes messages <ArrowRight size={16} /></button></div></main>
}

const favoritesCount = (items: Listing[]) => items.reduce((total, item) => total + (item.featured ? 2 : 1), 0)

export default App
