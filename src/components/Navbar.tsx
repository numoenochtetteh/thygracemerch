import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, UserRound, ShoppingBag, Menu } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import OffCanvasMenu from './OffCanvasMenu';
import SearchPanel from './SearchPanel';
import CartDrawer from './CartDrawer';
import Logo from './Logo';
import './StoreHeader.css';

const links = [
  { name: 'Home', to: '/' }, { name: 'Shop', to: '/products' },
  { name: 'Info', to: '/info' },
  { name: 'Contact', to: '/contact' },
];
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const count = useCartStore(s => s.getTotalItems());
  const cartOpen = useCartStore(s => s.isOpen);
  const setCartOpen = useCartStore(s => s.setOpen);
  const { pathname } = useLocation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);
  return <>
    <div className="tg-promo">New drops, brand stories and updates — join the THY-GRACE community</div>
    <header className={`tg-header ${scrolled ? 'tg-header--scrolled' : ''}`}>
      <div className="tg-header__inner">
        <Link to="/" className="tg-header__logo" aria-label="THY-GRACE home"><Logo /></Link>
        <nav className="tg-header__links" aria-label="Main navigation">
          {links.map(link => <Link aria-current={pathname===link.to?'page':undefined} key={link.to} to={link.to}>{link.name}</Link>)}
        </nav>
        <div className="tg-header__actions">
          <button aria-label="Search products" onClick={()=>setSearchOpen(true)} type="button"><Search /></button>
          <Link aria-label="Account" to="/account"><UserRound /></Link>
          <button aria-label={`Open cart: ${count} items`} onClick={()=>setCartOpen(true)} type="button" className="tg-header__bag"><ShoppingBag/><span>{count}</span></button>
          <button aria-label="Open navigation menu" onClick={()=>setMenuOpen(true)} type="button" className="tg-header__hamburger"><Menu /></button>
        </div>
      </div>
    </header>
    <OffCanvasMenu open={menuOpen} onClose={()=>setMenuOpen(false)} onOpenSearch={()=>{setMenuOpen(false);setSearchOpen(true);}} />
    <SearchPanel open={searchOpen} onClose={()=>setSearchOpen(false)} />
    <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} />
  </>;
}
