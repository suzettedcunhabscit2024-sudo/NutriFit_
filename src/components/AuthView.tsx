import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import {
  auth,
  googleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateAuthProfile,
  db,
  doc,
  getDoc,
  setDoc,
  handleFirestoreError,
  OperationType
} from '../lib/firebase';
import { User, Mail, Lock, ArrowRight, Shield, AlertCircle, Loader2 } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { setCurrentStep, updateProfile } = useHealth();
  const [isRegister, setIsRegister] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    if (isRegister && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // Firebase Auth: Create new user
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        if (name.trim()) {
          try {
            await updateAuthProfile(user, { displayName: name.trim() });
          } catch (err) {
            console.warn('Could not update display name:', err);
          }
        }

        // Store initial profile in Firestore
        try {
          await setDoc(
            doc(db, 'users', user.uid),
            {
              userId: user.uid,
              name: name.trim(),
              email: user.email || email.trim(),
              age: 22,
              gender: 'Male',
              height: 170,
              weight: 68,
              isRegistered: true,
              hasCompletedBasicInfo: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, `users/${user.uid}`);
        }

        updateProfile({
          name: name.trim(),
          email: user.email || email.trim(),
          userId: user.uid,
          isRegistered: true,
          hasCompletedBasicInfo: false,
        });

        // Advance to Step 1: Basic Health Information
        setCurrentStep('basic-info');
      } else {
        // Firebase Auth: Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        // Check if user already completed basic health info in Firestore
        let hasCompleted = false;
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            hasCompleted = Boolean(data.hasCompletedBasicInfo);
          }
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.GET, `users/${user.uid}`);
        }

        if (hasCompleted) {
          setCurrentStep('dashboard');
        } else {
          setCurrentStep('basic-info');
        }
      }
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      let friendlyMessage = 'Authentication failed. Please try again.';

      if (err?.code === 'auth/email-already-in-use') {
        friendlyMessage = 'An account with this email already exists. Please log in instead.';
      } else if (err?.code === 'auth/invalid-email') {
        friendlyMessage = 'The email address entered is not valid.';
      } else if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email or password. Please verify your credentials.';
      } else if (err?.code === 'auth/user-not-found') {
        friendlyMessage = 'No account found with this email. Please register first.';
      } else if (err?.code === 'auth/operation-not-allowed') {
        friendlyMessage = 'Email/Password sign-in is not yet enabled in your Firebase console. Please sign in with Google or enable Email/Password provider in the Firebase Console.';
      } else if (err?.code === 'auth/unauthorized-domain') {
        friendlyMessage = 'This preview domain is not yet allowlisted in your Firebase Console (Authentication > Settings > Authorized domains). Please add this domain to allow sign-in.';
      } else if (err?.message) {
        friendlyMessage = err.message;
      }

      setErrorMessage(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      let hasCompleted = false;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          hasCompleted = Boolean(data.hasCompletedBasicInfo);
        } else {
          // Initialize document
          await setDoc(
            doc(db, 'users', user.uid),
            {
              userId: user.uid,
              name: user.displayName || 'Health Enthusiast',
              email: user.email || '',
              age: 22,
              gender: 'Male',
              height: 170,
              weight: 68,
              isRegistered: true,
              hasCompletedBasicInfo: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        }
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.WRITE, `users/${user.uid}`);
      }

      if (hasCompleted) {
        setCurrentStep('dashboard');
      } else {
        setCurrentStep('basic-info');
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        // User voluntarily dismissed popup
      } else if (err?.code === 'auth/unauthorized-domain') {
        setErrorMessage('This preview domain is not yet allowlisted in your Firebase Console (Authentication > Settings > Authorized domains). Please add this domain to allow sign-in.');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setErrorMessage('Google Sign-in is not yet enabled in your Firebase Console (Authentication > Sign-in method). Please enable it.');
      } else {
        setErrorMessage(err?.message || 'Google sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-4 pb-28 sm:py-12 max-w-lg mx-auto px-3 sm:px-4">
      {/* Step Breadcrumb indicator */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-500 mb-5">
        <span className="text-slate-400">Home</span>
        <span>→</span>
        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Step: Auth
        </span>
        <span>→</span>
        <span className="text-slate-400">Basic Info</span>
        <span>→</span>
        <span className="text-slate-400">Dashboard</span>
      </div>

      <div className="bg-white rounded-2xl p-5 sm:p-8 border border-slate-200 shadow-sm">
        <div className="text-center mb-5 sm:mb-6">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xs border border-emerald-100 bg-white mx-auto mb-3 p-0.5 flex items-center justify-center">
            <img
              src="/nutrifit-logo.png"
              alt="NutriFit"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isRegister ? 'Create Your NutriFit Account' : 'Welcome Back to NutriFit'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isRegister
              ? 'Register securely to track nutrition, exercises, and persist your metrics in Cloud Firestore'
              : 'Log in with your credentials to access your saved NutriFit health metrics'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isRegister
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isRegister
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Log In
          </button>
        </div>

        {/* Google Sign-in Provider */}
        <button
          id="btn-auth-google"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 mb-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 flex items-center justify-center gap-2.5 shadow-xs transition-colors disabled:opacity-60"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-slate-400 font-medium">or with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="input-auth-name"
                  type="text"
                  required={isRegister}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Suzette D'Cunha"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="input-auth-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="input-auth-password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <button
            id="btn-auth-submit"
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing with Firebase...</span>
              </>
            ) : (
              <>
                <span>{isRegister ? 'Register Account with Firebase' : 'Sign In with Firebase'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-600">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Connected to Firebase Authentication &amp; Cloud Firestore. Your health metrics are encrypted and private to your account.
          </span>
        </div>
      </div>
    </div>
  );
};
