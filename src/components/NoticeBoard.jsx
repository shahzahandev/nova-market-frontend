import { useEffect, useState } from "react";
import Container from "./Container";

const API = "https://nova-market-backend-2.onrender.com";

const NoticeBoard = () => {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`${API}/api/v1/notice/getNotice`);
        const data = await res.json();
        setNotice(data.notice);
      } catch (err) {
        console.error("Notice load failed", err);
      }
    };

    fetchNotice();
  }, []);

  // Notice nai ba inactive hole kichui show hobe na
  if (!notice || !notice.isActive || !notice.text) return null;

  return (
    <Container>
      <div className="py-5">
        <div className="w-full overflow-hidden rounded-full border-y bg-slate-100 px-5 py-1 md:py-2">
          <style>{`
            @keyframes notice-marquee {
              0% {
                transform: translateX(100%);
              }

              100% {
                transform: translateX(-100%);
              }
            }

            .notice-marquee {
              display: inline-block;
              white-space: nowrap;
              padding: 8px 0;
              animation: notice-marquee 25s linear infinite;
              font-family: "Poppins", sans-serif;
            }
          `}</style>

          <div className="overflow-hidden">
            <p className="notice-marquee text-lg tracking-wide font-medium text-black">
              📢 {notice.text}
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default NoticeBoard;