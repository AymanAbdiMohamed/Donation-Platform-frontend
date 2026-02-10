import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitCharityApplication, api } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";
import { ROUTES } from "../../constants";

function CharityDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [application, setApplication] = useState(null);
  const [loadingApp, setLoadingApp] = useState(false);

  const [formData, setFormData] = useState({
    charityName: "",
    registrationNumber: "",
    countryOfOperation: "",
    primaryContactPerson: "",
    emailAddress: "",
    phoneNumber: "",
    missionStatement: "",
    targetAgeGroup: "",
    menstrualHealthProgramme: "",
    regionServed: "",
    girlsReachedLastYear: "",
    annualBudget: "",
    photos: null,
    evidenceFile: null,
    complyEducation: false,
    partnerSchools: false,
    confirmAccuracy: false,
  });

  // Fetch application status if it exists
  useEffect(() => {
    const fetchAppStatus = async () => {
      setLoadingApp(true);
      try {
        const response = await api.get("/charity/application");
        if (response.data && response.data.application) {
          setApplication(response.data.application);
        }
      } catch (err) {
        console.error("Error fetching application status:", err);
      } finally {
        setLoadingApp(false);
      }
    };

    if (user) {
      fetchAppStatus();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.confirmAccuracy) {
      alert("Please confirm the accuracy of provide information.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await submitCharityApplication(data);
      setApplication(response.data.application);
      setStatus("success");
      
      // Removed auto-redirect to stay on the dashboard and see the "Pending" status
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.response?.data?.message || "Failed to submit application. Please try again.");
    }
  };

  if (loadingApp) {
    return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  }

  // If already has a charity profile (approved), we might want a different view, 
  // but for now, we'll show status or form.
  
  return (
    <div className="max-w-[1200px] mx-auto p-12 bg-white min-h-screen">
      {/* Header Section from Image */}
      <header className="flex flex-col items-center mb-12 relative">
        <div className="absolute right-0 top-0">
          <button 
            onClick={() => {
              logout();
              navigate(ROUTES.LOGIN);
            }}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition font-semibold text-sm bg-gray-50 px-4 py-2 rounded-full border border-gray-100 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
        <div className="flex items-center gap-3 mb-4">
            {/* Simple representation of the logo */}
            <div className="flex items-center gap-1">
                <span className="text-red-500 text-3xl font-bold flex items-center">
                    <svg className="w-8 h-8 mr-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    SheNeeds
                </span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-black">
                Join Our Mission to Help Our Girls
            </h1>
        </div>
        <p className="text-gray-500 text-lg">
          Apply to become a verified Partner in ensuring our Girls get Access to essential Menstrual Hygiene Products
        </p>
      </header>

      {/* Application Status Alert */}
      {(application || status === "success") && (
        <div className={`mb-8 p-6 rounded-2xl flex justify-between items-center shadow-sm border-2 ${
          (application?.status === 'approved' || application?.status === 'active') ? 'bg-green-50 text-green-700 border-green-200' :
          application?.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
          'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${
                (application?.status === 'approved' || application?.status === 'active') ? 'bg-green-500' :
                application?.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
            }`} />
            <div>
                <p className="text-sm font-semibold uppercase tracking-wider opacity-70">Application Status</p>
                <h4 className="text-xl font-bold capitalize">
                    {application?.status === 'submitted' ? 'Pending Approval' : (application?.status || 'Processing')}
                </h4>
                {application?.rejection_reason && (
                    <p className="mt-2 text-sm bg-white/50 p-2 rounded-lg border border-red-100 italic">
                        " {application.rejection_reason} "
                    </p>
                )}
            </div>
          </div>
          {application?.id && (
            <p className="text-sm font-mono bg-white/50 px-3 py-1 rounded-full border border-inherit">
                REF: #{application.id}
            </p>
          )}
        </div>
      )}

      {status === "success" && !application ? (
        <div className="text-center py-24 bg-gradient-to-b from-green-50 to-white rounded-3xl border-2 border-green-100 shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Submission Successful!</h2>
          <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
            Your application has been logged into our system. Our administrators will review the details and provide feedback shortly.
          </p>
          <div className="mt-10 p-6 bg-amber-50 rounded-2xl border border-amber-100 inline-block">
             <p className="text-amber-800 font-bold flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                Current Status: Pending Admin Review
             </p>
          </div>
        </div>
      ) : application ? (
         <div className="bg-gray-50 p-12 rounded-3xl border-2 border-gray-100 text-center">
            <h2 className="text-2xl font-bold mb-4">Manage Your Charity</h2>
            <p className="text-gray-500 mb-8">
                {application.status === 'submitted' 
                    ? "Your application is currently being reviewed. You'll be notified once an admin takes action." 
                    : "Your organization is now part of the SheNeeds network."}
            </p>
            {(application.status === 'approved' || application.status === 'active') && (
                <button 
                  onClick={() => navigate(ROUTES.CHARITIES)}
                  className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg"
                >
                    Go to Dashboard
                </button>
            )}
         </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-16">
          
          {/* SECTION 1: Organisation Information */}
          <section>
            <h3 className="text-xl font-bold mb-6 text-gray-800">Organisation Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <input
                type="text"
                name="charityName"
                placeholder="Charity Name"
                value={formData.charityName}
                onChange={handleChange}
                className="w-full bg-gray-200 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                required
              />
              <input
                type="text"
                name="registrationNumber"
                placeholder="Registration Number"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="w-full bg-gray-200 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                required
              />
              <input
                type="text"
                name="countryOfOperation"
                placeholder="Country Of Operation"
                value={formData.countryOfOperation}
                onChange={handleChange}
                className="w-full bg-gray-200 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                required
              />
              <input
                type="text"
                name="yearOfEstablishment"
                placeholder="Year Established"
                value={formData.yearOfEstablishment}
                onChange={handleChange}
                className="w-full bg-gray-200 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                required
              />
            </div>
          </section>

          {/* SECTION 2: Contact Detail */}
          <section>
            <h3 className="text-xl font-bold mb-6 text-gray-800">Contact Detail</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                type="text"
                name="primaryContactPerson"
                placeholder="Primary Contact Person"
                value={formData.primaryContactPerson}
                onChange={handleChange}
                className="w-full bg-gray-200 p-4 rounded-md"
                required
              />
              <input
                type="email"
                name="emailAddress"
                placeholder="Email Address"
                value={formData.emailAddress}
                onChange={handleChange}
                className="w-full bg-gray-200 p-4 rounded-md"
                required
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full bg-gray-200 p-4 rounded-md"
                required
              />
            </div>
          </section>

          {/* SECTION 3: Mission & Activities */}
          <section>
            <h3 className="text-xl font-bold mb-6 text-gray-800">Mission & Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <input
                type="text"
                name="missionStatement"
                placeholder="Mission Statement"
                value={formData.missionStatement}
                onChange={handleChange}
                className="w-full bg-gray-200 p-4 rounded-md"
                required
              />
              <input
                type="text"
                name="targetAgeGroup"
                placeholder="Target Age Group"
                value={formData.targetAgeGroup}
                onChange={handleChange}
                className="w-full bg-gray-200 p-4 rounded-md"
                required
              />
              <input
                type="text"
                name="menstrualHealthProgramme"
                placeholder="Menstrual Health Programme"
                value={formData.menstrualHealthProgramme}
                onChange={handleChange}
                className="w-full bg-gray-200 p-4 rounded-md"
                required
              />
               <input
                type="text"
                name="regionServed"
                placeholder="Region Served"
                value={formData.regionServed}
                onChange={handleChange}
                className="w-full bg-gray-200 p-4 rounded-md"
                required
              />
            </div>
          </section>

          {/* SECTION 4: impact & Transparency */}
          <section>
            <h3 className="text-xl font-bold mb-6 text-gray-800">impact & Transparency</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <input
                type="text"
                name="girlsReachedLastYear"
                placeholder="Girls Reached Last Year"
                value={formData.girlsReachedLastYear}
                onChange={handleChange}
                className="w-full bg-gray-200 p-4 rounded-md"
                required
              />
              <div className="flex gap-4 items-center">
                   <label className="bg-gray-300 px-6 py-3 cursor-pointer rounded-md hover:bg-gray-400 transition text-sm font-semibold whitespace-nowrap">
                      Choose File
                      <input type="file" name="photos" onChange={handleChange} className="hidden" />
                   </label>
                   <div className="flex-1 bg-gray-200 p-4 rounded-md text-gray-500 truncate">
                      {formData.photos ? formData.photos.name : "Upload Photos or Testimonials"}
                   </div>
              </div>
              <div className="hidden lg:block"></div> {/* Spacer for alignment if needed */}

              <input
                type="text"
                name="annualBudget"
                placeholder="Annual Budget"
                value={formData.annualBudget}
                onChange={handleChange}
                className="w-full bg-gray-200 p-4 rounded-md"
                required
              />
               <div className="flex gap-4 items-center">
                   <label className="bg-gray-300 px-6 py-3 cursor-pointer rounded-md hover:bg-gray-400 transition text-sm font-semibold whitespace-nowrap">
                      Choose File
                      <input type="file" name="evidenceFile" onChange={handleChange} className="hidden" />
                   </label>
                   <div className="flex-1 bg-gray-200 p-4 rounded-md text-gray-500 truncate">
                      {formData.evidenceFile ? formData.evidenceFile.name : "Upload Files or text evidences"}
                   </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: Compliance & Verification */}
          <section>
            <h3 className="text-xl font-bold mb-6 text-gray-800">Compliance & Verification</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  name="complyEducation"
                  checked={formData.complyEducation}
                  onChange={handleChange}
                  className="w-5 h-5 accent-red-600"
                />
                <span className="text-gray-700 font-medium group-hover:text-black transition">Do you Follow Menstrual Health education guidlines ?</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  name="partnerSchools"
                  checked={formData.partnerSchools}
                  onChange={handleChange}
                  className="w-5 h-5 accent-red-600"
                />
                <span className="text-gray-700 font-medium group-hover:text-black transition">Do you patner with Schools or Clinics</span>
              </label>
            </div>
          </section>

          {/* SECTION 6: Final Confirmation */}
          <div className="pt-10 border-t-2 border-gray-100">
               <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  name="confirmAccuracy"
                  checked={formData.confirmAccuracy}
                  onChange={handleChange}
                  className="w-6 h-6 mt-1 accent-red-600"
                  required
                />
                <span className="text-gray-700 font-medium group-hover:text-black transition text-lg">
                    Confirm That all the information provided is accurate and that our organisation agrees to the Platform's Terms and Values
                </span>
              </label>
          </div>
          
          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold">
                {errorMessage}
            </div>
          )}

          <div className="flex justify-center pt-8 pb-20">
              <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="bg-red-600 text-white text-3xl font-bold py-5 px-24 rounded-full hover:bg-red-700 transition duration-300 shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                  {status === 'submitting' ? 'Submitting...' : 'Join Our Network'}
              </button>
          </div>

        </form>
      )}
    </div>
  );
}

export default CharityDashboard;