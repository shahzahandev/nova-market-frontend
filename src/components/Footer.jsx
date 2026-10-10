import Container from "./Container";
import { Instagram, Facebook, Twitter } from "lucide-react";
import pay from "../assets/pay.webp";
import { useStoreInfo } from "../context/StoreInfoContext";


export default function Footer() {

  const { storeInfo } = useStoreInfo();


  return (
    <footer className="bg-slate-100 text-black text-center">
      <Container className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-3">

        {/* Information */}
        <FooterCol
          title="Information"
          links={[
            { name: "About", path: "/about" },
            { name: "Contact Us", path: "/contact" },
            { name: "Shipping", path: "/shhiping" },
            { name: "Careers", path: "/careers" },
            { name: "Privacy Policy", path: "/privacyPolicy" },
            { name: "Terms", path: "/terms" },
          ]}
        />

        {/* Follow Us */}
        <div>
          <h3 className="text-2xl md:text-4xl font-semibold text-slate-700">
            Follow us
          </h3>

          <div className="md:mt-5 mt-1 flex gap-3 text-slate-600 justify-center">
            <Instagram
              size={25}
              className="hover:text-black scale-75 md:scale-100 cursor-pointer"
            />

            <Facebook
              size={25}
              className="hover:text-black scale-75 md:scale-100 cursor-pointer"
            />

            <Twitter
              size={25}
              className="hover:text-black scale-75 md:scale-100 cursor-pointer"
            />
          </div>

          <img
            src={pay}
            alt="Payment methods"
            className="mt-5 md:mt-5 scale-60 md:scale-100"
          />
        </div>

        {/* Company Information */}
        <div className="col-span-1 sm:col-span-1">
          <p className="font-display text-2xl md:text-4xl font-bold">
            {(() => {
              const name = storeInfo?.storeName || "";
              const words = name.split(" ");
              const firstWord = words.shift();
              const remainingWords = words.join(" ");

              return (
                <>
                  {firstWord}
                  {remainingWords && (
                    <span className="text-brand-500">{remainingWords}</span>
                  )}
                </>
              );
            })()}
          </p>

          <p className="font-display text-lg md:text-2xl font-bold">
            Stay Connected
          </p>

          <p className="mt-1 md:mt-2 max-w-xs text-sm text-slate-700 mx-auto">
            Head Office: House-12 Road-4, Block-B, Niketon, Gulshan, Dhaka 1212
          </p>

          <p className="flex items-center justify-center space-x-1 m-1 max-w-xs text-sm text-slate-700 mx-auto">
     <p>Email:</p>
            <p>{storeInfo?.storeEmail || ""}</p>
          </p>
          <p className="mt-1 max-w-xs text-sm text-slate-700 mx-auto">
            01737-954516 | 01404-753495
          </p>
        </div>
      </Container>

      {/* Copyright */}
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
      <p className="text-2xl md:text-4xl font-semibold text-slate-700">
        {title}
      </p>

      <ul className="mt-4 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.path}>
            <a
              href={link.path}
              className="text-sm text-slate-700 hover:text-black"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}