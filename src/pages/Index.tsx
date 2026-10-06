import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import HomeCollection from '@/components/HomeCollection';
import NewsletterSignup from '@/components/NewsletterSignup';
import MannequinHero from '@/components/MannequinHero';

export default function Index() {
  return (
    <Layout>
      <Helmet>
        <title>ThyGraceMerch — Clothing & Everyday Essentials</title>
        <meta name="description" content="Discover clothing and everyday essentials at ThyGraceMerch. Explore our collections and find your next favourite." />
      </Helmet>
      <MannequinHero />
      <HomeCollection />
      <NewsletterSignup />
    </Layout>
  );
}
