import { Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import PasswordGate from "./components/layout/PasswordGate";

const AutoBarcoder = lazy(() => import("./pages/projects/AutoBarcoder"));
const LeafCutter = lazy(() => import("./pages/projects/LeafCutter"));
const ZebraCHOP = lazy(() => import("./pages/projects/ZebraCHOP"));
const Veracare = lazy(() => import("./pages/projects/Veracare"));
const Neurotech = lazy(() => import("./pages/projects/Neurotech"));
const Izfc2025 = lazy(() => import("./pages/talks/Izfc2025"));
const NotFound = lazy(() => import("./pages/NotFound"));

const VERACARE_PASSWORD_HASH =
  "4e76c530ba2df616a564046bbba6cd40f11dd9f6385defed7d87f6a426c10225";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageFallback() {
  return (
    <div className="mx-auto max-w-4xl px-5 pt-16 sm:px-8">
      <div className="h-6 w-32 rounded bg-[var(--color-panel)]" />
      <div className="mt-6 h-10 w-3/4 rounded bg-[var(--color-panel)]" />
      <div className="mt-3 h-4 w-2/3 rounded bg-[var(--color-panel)]" />
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Nav />
      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/autobarcoder" element={<AutoBarcoder />} />
            <Route path="/projects/leafcutter" element={<LeafCutter />} />
            <Route path="/projects/zebrachop" element={<ZebraCHOP />} />
            <Route
              path="/projects/veracare"
              element={
                <PasswordGate
                  storageKey="veracare-unlocked"
                  passwordHash={VERACARE_PASSWORD_HASH}
                  label="Veracare · private preview"
                  blurb={
                    <p>
                      The Veracare walkthrough contains confidential product
                      and clinical-workflow details. If you&rsquo;ve received
                      the access password in my application, enter it below.
                    </p>
                  }
                >
                  <Veracare />
                </PasswordGate>
              }
            />
            <Route path="/projects/neurotech" element={<Neurotech />} />
            <Route path="/talks/izfc-2025" element={<Izfc2025 />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
