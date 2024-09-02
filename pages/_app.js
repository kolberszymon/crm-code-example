import "@/styles/globals.css";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Add all the weights you need
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <div className={poppins.className + " text-zinc-950"}>
        <Component {...pageProps} />
        <ToastContainer />
      </div>
    </SessionProvider>
  );
}
