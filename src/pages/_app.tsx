import { AppProps } from "next/app";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import "tailwindcss/tailwind.css";

export default function App({ Component, pageProps, router }: AppProps) {
  const { message = null } = router.query as { message?: string };

  useEffect(() => {
    if (message) toast(message);
    if (!["/", "/login", "/register"].includes(router.asPath)) {
      if (!pageProps.user) router.push("/");
    }
  }, [router, pageProps]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Component {...pageProps} />
    </>
  );
}
