import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Gateway from './components/Gateway';
import Pages from './components/Pages';
import IdentityGate from './components/IdentityGate';

import {
  getStoredIdentity,
  type Identity,
} from './embeddedWallet';

const PAGES = [
  'Pulse',
  'Traverse',
  'Realms',
  'Districts',
  'Nexuses',
  'Whispers',
  'Notifications',
  'Arcade',
  'Bazaar',
  'Vault',
  'Character',
  'Identity',
  'Core',
  'Companion',
];

function normalizePage(
  value: string | null,
) {
  return value &&
    PAGES.includes(value)
    ? value
    : 'Pulse';
}

export default function App() {
  const [
    entered,
    setEntered,
  ] = useState(false);

  const [
    identityOpen,
    setIdentityOpen,
  ] = useState(false);

  const [
    identity,
    setIdentity,
  ] = useState<Identity | null>(
    () => getStoredIdentity(),
  );

  const [
    transitioning,
    setTransitioning,
  ] = useState(false);

  const [
    page,
    setPageState,
  ] = useState(() => {
    const params =
      new URLSearchParams(
        window.location.search,
      );

    return normalizePage(
      params.get('page') ||
        window.location.hash.replace(
          '#',
          '',
        ),
    );
  });

  const [
    toast,
    setToast,
  ] = useState('');

  const setPage = (
    next: string,
  ) => {
    const target =
      normalizePage(next);

    setPageState(target);

    window.history.pushState(
      { page: target },
      '',
      `?page=${encodeURIComponent(
        target,
      )}#${target.toLowerCase()}`,
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const initial =
      normalizePage(
        new URLSearchParams(
          window.location.search,
        ).get('page') ||
          window.location.hash.replace(
            '#',
            '',
          ),
      );

    window.history.replaceState(
      { page: initial },
      '',
      `?page=${encodeURIComponent(
        initial,
      )}#${initial.toLowerCase()}`,
    );

    const onPop = () => {
      const next =
        normalizePage(
          new URLSearchParams(
            window.location.search,
          ).get('page') ||
            window.location.hash.replace(
              '#',
              '',
            ),
        );

      setPageState(next);
    };

    window.addEventListener(
      'popstate',
      onPop,
    );

    return () => {
      window.removeEventListener(
        'popstate',
        onPop,
      );
    };
  }, []);

  useEffect(() => {
    const onKey = (
      event: KeyboardEvent,
    ) => {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();

        setPage('Traverse');
      }

      if (
        event.key === 'Escape' &&
        transitioning
      ) {
        setTransitioning(false);
      }

      if (
        event.key === 'Escape' &&
        !transitioning
      ) {
        setToast(
          'ESC closes overlays · use the sidebar to travel',
        );
      }
    };

    window.addEventListener(
      'keydown',
      onKey,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        onKey,
      );
    };
  }, [transitioning]);

  useEffect(() => {
    if (!toast) return;

    const id =
      window.setTimeout(
        () => setToast(''),
        1800,
      );

    return () =>
      window.clearTimeout(id);
  }, [toast]);

  const enterUniverse = () => {
    if (transitioning) return;

    if (!identity) {
      setIdentityOpen(true);
      return;
    }

    setTransitioning(true);

    window.setTimeout(() => {
      setEntered(true);
      setTransitioning(false);
    }, 1450);
  };

  const handleIdentityComplete = (
    nextIdentity: Identity,
  ) => {
    setIdentity(
      nextIdentity,
    );

    setIdentityOpen(false);
    setTransitioning(true);

    window.setTimeout(() => {
      setEntered(true);
      setTransitioning(false);
    }, 950);
  };

  const appTitle = useMemo(
    () =>
      `LOKYX · ${page.toUpperCase()}`,
    [page],
  );

  useEffect(() => {
    document.title = appTitle;
  }, [appTitle]);

  if (!entered) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="gateway"
          animate={
            transitioning
              ? {
                  scale: 1.12,
                  opacity: 0,
                  filter: 'blur(8px)',
                }
              : {
                  scale: 1,
                  opacity: 1,
                  filter: 'blur(0px)',
                }
          }
          transition={{
            duration: 1.35,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          <Gateway
            enter={
              enterUniverse
            }
          />
        </motion.div>

        {transitioning && (
          <motion.div
            className="dimension-flash"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: [
                0,
                0.25,
                1,
                0,
              ],
            }}
            transition={{
              duration: 1.35,
              times: [
                0,
                0.45,
                0.82,
                1,
              ],
            }}
          />
        )}

        {identityOpen && (
          <IdentityGate
            onComplete={
              handleIdentityComplete
            }
          />
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="universe-app">
      <Sidebar
        page={page}
        setPage={setPage}
      />

      <div className="main-shell">
        <Topbar
          setPage={setPage}
        />

        <Pages
          page={page}
          setPage={setPage}
          notify={setToast}
        />
      </div>

      <div className="mobile-nav">
        {[
          'Pulse',
          'Traverse',
          'Realms',
          'Whispers',
          'Identity',
        ].map((item) => (
          <button
            className={
              page === item
                ? 'on'
                : ''
            }
            onClick={() =>
              setPage(item)
            }
            key={item}
          >
            {item}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="app-toast"
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 12,
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}