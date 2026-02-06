import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-red-600">
          SheNeeds Donation Platform
        </h1>

        <nav className="flex gap-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-red-600">
            Home
          </Link>
          <Link to="/charities" className="text-gray-700 hover:text-red-600">
            Charities
          </Link>
          <Link
            to="/login"
            className="text-red-600 font-medium hover:underline"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Register 
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="flex flex-col items-center justify-center text-center px-6 py-20 bg-red-50">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-3xl mb-6">
          Help Girls Stay in School with Dignity
        </h2>

        <p className="text-gray-700 max-w-2xl mb-8">
          Your donations help provide sanitary towels, clean water, and proper
          sanitation facilities for school-going girls across sub-Saharan Africa.
        </p>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Get Started today
          </Link>

          <Link
            to="/charities"
            className="border border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-100 transition"
          >
            View Charities
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
