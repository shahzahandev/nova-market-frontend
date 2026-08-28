import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import axios from "axios";

export default function EmailVerify() {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      try {
        const res = await axios.post(`http://localhost:3000/api/v1/auth/verifyemail/${token}`); 
        setStatus("success");
        setMessage(res.data?.message || "Your email has been verified.");
        // console.log(res);
        
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "This verification link is invalid or expired.");
      }
    }
    if (token) verify();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-10 text-center shadow-card">
        <Link to="/" className="font-display text-lg font-bold">
          Nova<span className="text-brand-500">Market</span>
        </Link>

        <div className="mt-8">
          {status === "verifying" && (
            <>
              <Loader2 size={40} className="mx-auto animate-spin text-brand-500" />
              <h1 className="mt-4 font-display text-xl font-bold">Verifying your email...</h1>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle2 size={44} className="mx-auto text-emerald-500" />
              <h1 className="mt-4 font-display text-xl font-bold">You're verified!</h1>
              <p className="mt-2 text-sm text-ink/60">{message}</p>
              <Link
                to="/signin"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-ink text-sm font-semibold text-white hover:bg-ink/90"
              >
                Continue to sign in
              </Link>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle size={44} className="mx-auto text-red-500" />
              <h1 className="mt-4 font-display text-xl font-bold">Verification failed</h1>
              <p className="mt-2 text-sm text-ink/60">{message}</p>
              <Link
                to="/signup"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl border border-ink/10 text-sm font-semibold hover:bg-mist"
              >
                Back to sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
