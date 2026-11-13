import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import VideoNavigation from './VideoNavigation';
interface LayoutProps { children: ReactNode; showHero?: boolean; hideNavbar?: boolean; headerVariant?: 'original' | 'video'; }
export default function Layout({ children, headerVariant = 'original' }: LayoutProps) {
 return <div className="min-h-screen">{headerVariant === 'video' ? <VideoNavigation /> : <Navbar />}<main>{children}</main><Footer /></div>;
}
