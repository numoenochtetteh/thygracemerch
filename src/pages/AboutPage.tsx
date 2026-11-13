import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';

const support = 'support@thygrace.com';
const sections = [
  {
    id: 'delivery', title: 'Delivery', paragraphs: [
      'We deliver globally. Orders within Ghana are typically delivered within 3–5 working days, while international deliveries take 7–12 working days.',
      'After checkout, you will receive an order confirmation via email or SMS. To ensure a smooth delivery, our courier partner or dispatch rider will contact you on the phone number provided prior to arrival.',
    ],
  },
  {
    id: 'returns-exchanges', title: 'Returns & Exchanges', paragraphs: [
      'If your piece arrives damaged or the size is wrong, contact us within 7 days of delivery and we will make it right with an exchange or store credit.',
      'Items must be unworn, unwashed and in their original condition. To start a return, email support with your order number and a photo of the item.',
    ],
  },
  {
    id: 'what-we-collect', title: 'What We Collect', paragraphs: [
      'When you place an order we collect your name, email, phone number and delivery address — the minimum needed to fulfil and deliver your order.',
      'If you join our newsletter we store your email address so we can send you updates about drops and events.',
    ],
  },
  {
    id: 'how-we-use-it', title: 'How We Use It', paragraphs: [
      'Order details are used to process payment (via Paystack), arrange delivery and provide support. Newsletter emails are used only for THY-GRACE updates — we do not sell or share your information with third parties for marketing.',
    ],
  },
];

export default function InfoPage() {
  return <Layout>
    <Helmet>
      <title>Info — THY-GRACE</title>
      <meta name="description" content="THY-GRACE delivery, returns, privacy and support information." />
      <link rel="canonical" href="https://thygracemerch.vercel.app/info" />
    </Helmet>
    <article className="mx-auto max-w-3xl px-6 py-14 sm:px-10 sm:py-20 normal-case">
      <p className="text-xs font-semibold tracking-widest text-[#285c39] mb-3">Support</p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight normal-case mb-12">Info</h1>
      <div className="space-y-10 text-sm leading-7 text-[#555]">
        {sections.map(section => <section key={section.id} id={section.id} className="scroll-mt-28">
          <h2 className="text-lg font-semibold text-[#171717] normal-case tracking-normal mb-3">{section.title}</h2>
          <div className="space-y-4">{section.paragraphs.map(text => <p key={text}>{text}</p>)}</div>
        </section>)}
        <section id="your-choices" className="scroll-mt-28">
          <h2 className="text-lg font-semibold text-[#171717] normal-case tracking-normal mb-3">Your Choices</h2>
          <p>You can unsubscribe from the newsletter at any time, and you can ask us to delete your personal data by emailing <a className="underline underline-offset-4 break-words" href={`mailto:${support}`}>{support}</a>.</p>
        </section>
        <section id="questions" className="scroll-mt-28">
          <h2 className="text-lg font-semibold text-[#171717] normal-case tracking-normal mb-3">Questions</h2>
          <p>Anything unclear? Reach us at <a className="underline underline-offset-4 break-words" href={`mailto:${support}`}>{support}</a> and we will respond as quickly as we can.</p>
        </section>
      </div>
    </article>
  </Layout>;
}
