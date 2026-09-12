import Container from "./Container";
import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-100 text-black text-center">
      <Container className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-3">
        <FooterCol title="Information" links={[
          "About", "Contact Us", "Shipping", "Careers", "Terms", "Privacy Policy", "FAQ",
        ]} />

        <div>
          <h3 className="text-2xl md:text-4xl font-semibold text-slate-700">Follow us</h3>
          <div className="mt-5 flex gap-3 text-slate-600 justify-center">
            <Instagram size={25} className="hover:text-black" />
            <Facebook size={25} className="hover:text-black" />
            <Twitter size={25} className="hover:text-black" />
          </div>
        </div>

        <div className="col-span-1 sm:col-span-1">
          <p className="font-display text-2xl md:text-4xl font-bold">
            Nova<span className="text-brand-500">Market</span>
          </p>
              <p className="font-display text-lg md:text-2xl font-bold mt-2">
            Stay Connected

          </p>
          <p className="mt-3 max-w-xs text-sm text-slate-700 mx-auto">
            Head Office:  Read-4, Momtaz Plaza, Dhanmondi, Dhaka 1000
          </p>
           <p className="font-display text-lg md:text-2xl font-bold mt-2">
            Email
          </p>
              <p className="mt-3 max-w-xs text-sm text-slate-700 mx-auto">
                novamarket@gmail.com
          </p>
     

        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-center gap-2 text-xs text-slate-800 sm:flex-row">
          <p>©2026 NovaMarket. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <p className="text-2xl md:text-4xl font-semibold text-slate-700">{title}</p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-slate-700 hover:text-black">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
