import { useState } from "react";

export async function loader() {
  // Simulate a slow network request
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return null;
}

export default function IndexPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <section className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <img alt="Vite logo" className="mb-2 h-24 w-24" src="/image/vite.svg" />
          <h1 className="text-center text-4xl font-bold text-gray-800">Counter App</h1>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <div className="text-7xl font-bold text-blue-600">{count}</div>
          <button
            className="cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none active:bg-blue-800"
            onClick={() => setCount((count) => count + 1)}
          >
            Increment
          </button>

          <p className="text-center text-sm text-gray-600">
            Click the button above to increment the counter
          </p>
        </div>
      </section>
    </div>
  );
}
