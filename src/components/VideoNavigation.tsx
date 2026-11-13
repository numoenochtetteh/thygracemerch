import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingBag, UserRound } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import OffCanvasMenu from './OffCanvasMenu';
import SearchPanel from './SearchPanel';
import CartDrawer from './CartDrawer';
import './VideoHero.css';

export default function VideoNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = useCartStore(s => s.getTotalItems());
  const cartOpen = useCartStore(s => s.isOpen);
  const setCartOpen = useCartStore(s => s.setOpen);
  const { pathname } = useLocation();
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);
  return <>
    <header className="campaign-nav">
      <nav aria-label="Main navigation" className="campaign-nav__inner">
        <Link to="/" className="campaign-nav__brand" aria-label="THY-GRACE home">THY-GRACE<span>WEAR THE MESSAGE</span></Link>
        <div className="campaign-nav__actions">
          <Link to="/products" className="campaign-nav__shop">Shop</Link>
          <button type="button" aria-label="Search products" onClick={() => setSearchOpen(true)}><Search size={18} /></button>
          <Link to="/account" aria-label="Account"><UserRound size={18} /></Link>
          <button type="button" aria-label={`Open cart: ${count} items`} onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><span>{count}</span></button>
          <button type="button" aria-label="Open navigation menu" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
        </div>
      </nav>
    </header>
    <OffCanvasMenu open={menuOpen} onClose={() => setMenuOpen(false)} onOpenSearch={() => { setMenuOpen(false); setSearchOpen(true); }} />
    <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
  </>;
}
