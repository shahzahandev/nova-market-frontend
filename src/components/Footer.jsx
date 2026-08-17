import Container from "./Container";
import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <Container className="grid grid-cols-2 gap-10 py-16 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="font-display text-lg font-bold">
            Nova<span className="text-brand-400">Market</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-white/60">
            Thoughtfully sourced goods, shipped fast, backed by real people.
          </p>
          <div className="mt-5 flex gap-3 text-white/60">
            <Instagram size={18} className="hover:text-white" />
            <Facebook size={18} className="hover:text-white" />
            <Twitter size={18} className="hover:text-white" />
          </div>
        </div>

        <FooterCol title="Shop" links={["All Products", "New Arrivals", "Best Sellers", "Deals"]} />
        <FooterCol title="Support" links={["Contact Us", "Shipping", "Returns", "FAQ"]} />
        <FooterCol title="Company" links={["About", "Careers", "Privacy Policy", "Terms"]} />
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Nova Market. All rights reserved.</p>
          <p>Designed for the modern shopper.</p>
        </Container>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-white/60 hover:text-white">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
