import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitCharityApplication, api } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";

function CharityDashboard() {
  const { user } = useAuth();
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

      await submitCharityApplication(data);
      setStatus("success");
      
      // Auto-redirect after a short delay for UX
      setTimeout(() => {
        navigate(ROUTES.CHARITIES);
      }, 2000);
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
      <header className="flex flex-col items-center mb-12">
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
      {application && (
        <div className={`mb-8 p-4 rounded-lg flex justify-between items-center ${
          application.status === 'approved' ? 'bg-green-100 text-green-800' :
          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          <div>
            <span className="font-bold">Application Status: </span>
            <span className="capitalize">{application.status}</span>
            {application.rejection_reason && (
                <p className="text-sm mt-1">Reason: {application.rejection_reason}</p>
            )}
          </div>
          <p className="text-xs uppercase tracking-wider font-semibold opacity-70">Case #{application.id}</p>
        </div>
      )}

      {status === "success" ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Thank you for applying. Our team will review your organization and get back to you shortly.
          </p>
          <button 
            onClick={() => setStatus("idle")}
            className="mt-8 bg-red-600 text-white px-10 py-3 rounded-full hover:bg-red-700 transition font-bold"
          >
            Submit Another Application
          </button>
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