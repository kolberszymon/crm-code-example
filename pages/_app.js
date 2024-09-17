import "@/styles/globals.css";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Add all the weights you need
});

const queryClient = new QueryClient()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <div className={poppins.className + " text-zinc-950"}>
        <Component {...pageProps} />
        <ToastContainer />
        </div>
      </SessionProvider>
    </QueryClientProvider>
  );
}
