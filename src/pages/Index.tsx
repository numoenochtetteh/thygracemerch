import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import HomeCollection from '@/components/HomeCollection';
import CampaignPhotoHero from '@/components/CampaignPhotoHero';

export default function Index() {
  return (
    <Layout headerVariant="original">
      <Helmet>
        <title>THY-GRACE — Wear the Message, Live the Word.</title>
        <meta name="description" content="WEAR THE MESSAGE, Live the word. Discover original faith-inspired apparel and accessories from THY-GRACE." />
      </Helmet>
      <CampaignPhotoHero />
      <HomeCollection />
    </Layout>
  );
}
