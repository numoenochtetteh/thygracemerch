import { Link } from 'react-router-dom';
import Logo from './Logo';
export default function Footer() {
  return <footer className="page-padding border-t border-border py-8">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      <Link to="/" aria-label="ThyGraceMerch home"><Logo className="!h-16" /></Link>
      <nav aria-label="Footer" className="flex flex-wrap justify-center gap-4 text-xs">
        <Link to="/products">Shop</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link>
        <Link to="/shipping">Shipping &amp; Returns</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link>
      </nav>
      <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ThyGraceMerch</p>
    </div>
  </footer>;
}
