import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import {
  ArrowRight,
  Check,
  Copy,
  KeyRound,
  Shield,
  Sparkles,
} from 'lucide-react';

import { useState } from 'react';

import {
  createEmbeddedWallet,
  hasWallet,
  restoreEmbeddedWallet,
  unlockEmbeddedWallet,
  type Identity,
} from '../embeddedWallet';

type Props = {
  onComplete: (identity: Identity) => void;
};

type Step =
  | 'choice'
  | 'create'
  | 'recovery'
  | 'confirm'
  | 'login'
  | 'restore';

export default function IdentityGate({
  onComplete,
}: Props) {
  const [step, setStep] = useState<Step>(
    hasWallet()
      ? 'login'
      : 'choice',
  );

  const [username, setUsername] =
    useState('');

  const [passcode, setPasscode] =
    useState('');

  const [restorePhrase, setRestorePhrase] =
    useState('');

  const [confirm, setConfirm] =
    useState('');

  const [phrase, setPhrase] =
    useState<string[]>([]);

  const [createdIdentity, setCreatedIdentity] =
    useState<Identity | null>(null);

  const [address, setAddress] =
    useState('');

  const [error, setError] =
    useState('');

  const [copied, setCopied] =
    useState(false);

  const create = async () => {
    setError('');

    try {
      const result =
        await createEmbeddedWallet(
          username,
          passcode,
        );

      setCreatedIdentity(
        result.identity,
      );

      setPhrase(
        result.phrase.split(' '),
      );

      setAddress(
        result.identity.address,
      );

      setStep('recovery');
    } catch (errorValue) {
      setError(
        errorValue instanceof Error
          ? errorValue.message
          : 'Could not create wallet.',
      );
    }
  };

  const finish = () => {
    setError('');

    if (!createdIdentity) {
      setError(
        'Identity creation data is missing. Please start again.',
      );

      setStep('create');

      return;
    }

    const firstWord =
      phrase[0]?.toLowerCase();

    const enteredWord =
      confirm.trim().toLowerCase();

    if (
      enteredWord !== firstWord
    ) {
      setError(
        'That recovery word does not match.',
      );

      return;
    }

    onComplete(
      createdIdentity,
    );
  };

  const login = async () => {
    setError('');

    try {
      const result =
        await unlockEmbeddedWallet(
          passcode,
        );

      onComplete(
        result.identity,
      );
    } catch (errorValue) {
      setError(
        errorValue instanceof Error
          ? errorValue.message
          : 'Unable to unlock.',
      );
    }
  };

  const restore = async () => {
    setError('');

    try {
      const result =
        await restoreEmbeddedWallet(
          username,
          restorePhrase,
          passcode,
        );

      onComplete(result);
    } catch (errorValue) {
      setError(
        errorValue instanceof Error
          ? errorValue.message
          : 'Unable to restore wallet.',
      );
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        phrase.join(' '),
      );

      setCopied(true);

      window.setTimeout(
        () => setCopied(false),
        1500,
      );
    } catch {
      setError(
        'Copy failed. Please write the phrase down manually.',
      );
    }
  };

  return (
    <div className="identity-gate">
      <div className="identity-stars" />

      <motion.div
        className="identity-card"
        initial={{
          opacity: 0,
          y: 24,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <div className="identity-brand">
          <span>◆</span> LOKYX
        </div>

        <div className="identity-signal">
          <i />
          IDENTITY PROTOCOL // ONLINE
        </div>

        <AnimatePresence mode="wait">

          {/* CHOICE */}

          {step === 'choice' && (
            <motion.div
              key="choice"
              className="identity-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Sparkles size={28} />

              <h1>
                Enter as an identity.
              </h1>

              <p>
                Create your LOKYX wallet
                directly inside the platform.
                No external wallet required.
              </p>

              <button
                className="identity-primary"
                onClick={() =>
                  setStep('create')
                }
              >
                CREATE LOKYX IDENTITY
                <ArrowRight size={15} />
              </button>

              <button
                className="identity-secondary"
                onClick={() =>
                  setStep('login')
                }
              >
                I ALREADY HAVE A LOKYX WALLET
              </button>
            </motion.div>
          )}

          {/* CREATE */}

          {step === 'create' && (
            <motion.div
              key="create"
              className="identity-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="identity-icon">
                <KeyRound />
              </div>

              <h1>
                Create your identity.
              </h1>

              <p>
                A real Ethereum wallet is
                generated locally in your browser
                and encrypted on this device.
              </p>

              <label>
                LOKYX USERNAME

                <input
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value,
                    )
                  }
                  placeholder="e.g. KAIROX"
                  autoFocus
                />
              </label>

              <label>
                WALLET PASSCODE

                <input
                  type="password"
                  value={passcode}
                  onChange={(event) =>
                    setPasscode(
                      event.target.value,
                    )
                  }
                  placeholder="8+ characters"
                />
              </label>

              <button
                className="identity-primary"
                onClick={create}
              >
                GENERATE WALLET
                <ArrowRight size={15} />
              </button>

              {error && (
                <div className="identity-error">
                  {error}
                </div>
              )}

              <small>
                <Shield size={12} />

                The recovery phrase is
                generated in your browser
                and is not sent to LOKYX.
              </small>
            </motion.div>
          )}

          {/* RECOVERY */}

          {step === 'recovery' && (
            <motion.div
              key="recovery"
              className="identity-panel wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="identity-icon">
                <Shield />
              </div>

              <h1>
                Secure your 12-word phrase.
              </h1>

              <p>
                Write these words down offline.
                Anyone with this phrase can
                control the wallet.
              </p>

              <div className="phrase-grid">
                {phrase.map(
                  (word, index) => (
                    <div
                      key={`${word}-${index}`}
                    >
                      <span>
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <b>
                        {word}
                      </b>
                    </div>
                  ),
                )}
              </div>

              <div className="recovery-actions">

                <button
                  className="identity-secondary"
                  onClick={copy}
                >
                  {copied ? (
                    <Check size={14} />
                  ) : (
                    <Copy size={14} />
                  )}

                  {copied
                    ? 'COPIED'
                    : 'COPY PHRASE'}
                </button>

                <button
                  className="identity-primary"
                  onClick={() =>
                    setStep('confirm')
                  }
                >
                  I SAVED IT
                  <ArrowRight size={15} />
                </button>

              </div>

              <div className="identity-warning">
                Never share this phrase
                with anyone. LOKYX support
                will never ask for it.
              </div>
            </motion.div>
          )}

          {/* CONFIRM */}

          {step === 'confirm' && (
            <motion.div
              key="confirm"
              className="identity-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Check size={30} />

              <h1>
                Confirm recovery.
              </h1>

              <p>
                Enter the first word to
                confirm you saved the phrase.
              </p>

              <input
                className="identity-confirm"
                value={confirm}
                onChange={(event) =>
                  setConfirm(
                    event.target.value,
                  )
                }
                placeholder="Recovery word #01"
                autoFocus
              />

              <button
                className="identity-primary"
                onClick={finish}
              >
                ACTIVATE IDENTITY
                <ArrowRight size={15} />
              </button>

              {error && (
                <div className="identity-error">
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {/* LOGIN */}

          {step === 'login' && (
            <motion.div
              key="login"
              className="identity-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="identity-icon">
                <KeyRound />
              </div>

              <h1>
                Welcome back.
              </h1>

              <p>
                Unlock the LOKYX wallet
                stored on this device.
              </p>

              <label>
                WALLET PASSCODE

                <input
                  type="password"
                  value={passcode}
                  onChange={(event) =>
                    setPasscode(
                      event.target.value,
                    )
                  }
                  placeholder="Your passcode"
                  autoFocus
                />
              </label>

              <button
                className="identity-primary"
                onClick={login}
              >
                UNLOCK LOKYX
                <ArrowRight size={15} />
              </button>

              {error && (
                <div className="identity-error">
                  {error}
                </div>
              )}

              <small>
                Your phrase is the recovery
                key. Keep it offline and private.
              </small>

              <button
                className="identity-secondary"
                onClick={() =>
                  setStep('restore')
                }
              >
                RESTORE WITH RECOVERY PHRASE
              </button>
            </motion.div>
          )}

          {/* RESTORE */}

          {step === 'restore' && (
            <motion.div
              key="restore"
              className="identity-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="identity-icon">
                <Shield />
              </div>

              <h1>
                Restore your identity.
              </h1>

              <p>
                Enter your 12-word phrase
                to restore the same Ethereum
                wallet on this device.
              </p>

              <label>
                LOKYX USERNAME

                <input
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value,
                    )
                  }
                  placeholder="Your username"
                  autoFocus
                />
              </label>

              <label>
                12-WORD RECOVERY PHRASE

                <textarea
                  className="identity-confirm"
                  rows={4}
                  value={restorePhrase}
                  onChange={(event) =>
                    setRestorePhrase(
                      event.target.value,
                    )
                  }
                  placeholder="word word word …"
                />
              </label>

              <label>
                NEW WALLET PASSCODE

                <input
                  type="password"
                  value={passcode}
                  onChange={(event) =>
                    setPasscode(
                      event.target.value,
                    )
                  }
                  placeholder="8+ characters"
                />
              </label>

              <button
                className="identity-primary"
                onClick={restore}
              >
                RESTORE LOKYX
                <ArrowRight size={15} />
              </button>

              {error && (
                <div className="identity-error">
                  {error}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

        {address && (
          <div className="identity-address">
            {address.slice(0, 8)}
            …
            {address.slice(-6)}
          </div>
        )}
      </motion.div>
    </div>
  );
}