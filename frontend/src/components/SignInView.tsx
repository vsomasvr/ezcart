
import React, { useState } from 'react';

interface SignInViewProps {
  onSignIn: (username: string) => void;
  onCancel: () => void;
  error: string | null;
}

const SignInView: React.FC<SignInViewProps> = ({ onSignIn, onCancel, error }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSignIn(username.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 sm:p-10 rounded-xl shadow-2xl border border-slate-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-sky-400">
            Sign in to EZCart
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                placeholder="Username (e.g., demoUser)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-700 border border-rose-600 text-rose-100 px-3 py-2.5 rounded-md text-sm text-center" role="alert">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="mt-6">
          <button
            onClick={onCancel}
            className="group relative w-full flex justify-center py-3 px-4 border border-slate-600 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInView;
