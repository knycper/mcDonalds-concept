import React, { Suspense } from 'react';

const Register = React.lazy(() => import('../components/Register'));

export default function App() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="text-center">
              <div className="animate-spin mb-4">
                <svg className="w-12 h-12 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M4 12a8 8 0 0 1 8-8V3M12 21v-3" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-yellow-600">Ładowanie...</p>
            </div>
          </div>
        }
      >
        <Register />
      </Suspense>
    </div>
  );
}
