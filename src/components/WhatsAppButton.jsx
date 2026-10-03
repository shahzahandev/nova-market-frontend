import { useEffect, useState } from "react";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";

const API_ORIGIN =
  "https://nova-market-backend-2.onrender.com/api/v1/whatsapp";

export default function WhatsAppButton() {
  const [whatsapp, setWhatsapp] = useState(null);

  useEffect(() => {
    const getWhatsApp = async () => {
      try {
        const response = await axios.get(
          `${API_ORIGIN}/getWhatsapp`
        );

        console.log("WhatsApp API Response:", response.data);

        if (response.data.success) {
          setWhatsapp(response.data.data);
        }
      } catch (error) {
        console.log("WhatsApp Error:", error);
      }
    };

    getWhatsApp();
  }, []);

  if (!whatsapp || !whatsapp.isActive) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end">
      <div
        className=" mb-2 rounded-full bg-[#0cc14e] px-4 py-2 text-sm font-medium text-white shadow-md border border-slate-100" >
        Say something
      </div>

      <a href={`https://wa.me/${whatsapp.phone}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className=" whatsapp-pulse flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a]"
      >
        <FaWhatsapp size={32} />
      </a>

      <style>{`
        @keyframes whatsappPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.55);
          }

          50% {
            box-shadow: 0 0 0 10px rgba(37, 211, 102, 0.20);
          }

          100% {
            box-shadow: 0 0 0 20px rgba(37, 211, 102, 0);
          }
        }

        .whatsapp-pulse {
          animation: whatsappPulse 2s infinite;
        }
      `}</style>
    </div>
  );
}
