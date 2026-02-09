import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Heart } from "lucide-react";

function Home() {
  const { isAuthenticated, user, logout, getRedirectPath } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-600 fill-red-600" />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-red-600">She</span>Needs
          </span>
        </Link>

        <nav className="flex gap-4 items-center">
          <Link to="/" className="text-gray-700 hover:text-red-600 font-medium">
            Home
          </Link>
          <Link to="/charities" className="text-gray-700 hover:text-red-600 font-medium">
            Charities
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={getRedirectPath(user?.role)}
                className="text-red-600 font-semibold hover:underline"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-red-600 font-semibold hover:underline"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="flex flex-col items-center justify-center text-center px-6 py-24 bg-red-50">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 max-w-3xl mb-6 leading-tight">
          Help Girls Stay in School with Dignity
        </h2>

        <p className="text-gray-600 max-w-2xl mb-10 text-lg">
          Your donations help provide sanitary towels, clean water, and proper
          sanitation facilities for school-going girls across sub-Saharan Africa.
        </p>

        <div className="flex gap-4">
          <Link
            to={isAuthenticated ? getRedirectPath(user?.role) : "/login"}
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-bold text-lg shadow-lg shadow-red-200"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Today"}
          </Link>

          <Link
            to="/charities"
            className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg hover:bg-red-50 transition font-bold text-lg"
          >
            View Charities
          </Link>
        </div>
      </main>

      {/* FEATURES SECTION */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="space-y-3">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900">Choose a Charity</h3>
            <p className="text-gray-500">Browse verified organizations making a real impact in menstrual health.</p>
          </div>
          <div className="space-y-3">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900">Make a Donation</h3>
            <p className="text-gray-500">Contribute any amount — every dollar helps provide essential products.</p>
          </div>
          <div className="space-y-3">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900">See Your Impact</h3>
            <p className="text-gray-500">Track your donations and see how many girls you've helped stay in school.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} SheNeeds Donation Platform. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
