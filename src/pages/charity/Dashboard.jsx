/**
 * Charity Dashboard
 * Allows charity users to submit and track their application status
 */
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { submitCharityApplication, getCharityApplication } from "../../api";
import { APPLICATION_STATUS } from "../../constants";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  OrganizationSection,
  ContactSection,
  MissionSection,
  ImpactSection,
  ComplianceSection,
  ConfirmationSection,
} from "../../components/charity/ApplicationFormSections";

// Initial form state
const INITIAL_FORM_STATE = {
  charityName: "",
  registrationNumber: "",
  countryOfOperation: "",
  yearOfEstablishment: "",
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
};

// Submission status enum
const SUBMISSION_STATUS = {
  IDLE: "idle",
  SUBMITTING: "submitting",
  SUCCESS: "success",
  ERROR: "error",
};

function CharityDashboard() {
  const { user } = useAuth();
  const [status, setStatus] = useState(SUBMISSION_STATUS.IDLE);
  const [errorMessage, setErrorMessage] = useState("");
  const [application, setApplication] = useState(null);
  const [loadingApp, setLoadingApp] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  /**
   * Fetch existing application status
   */
  const fetchApplicationStatus = useCallback(async () => {
    setLoadingApp(true);
    try {
      const data = await getCharityApplication();
      if (data && data.application) {
        setApplication(data.application);
      }
    } catch (err) {
      // 404 is expected if no application exists yet
      if (err.response?.status !== 404) {
        console.error("Error fetching application status:", err);
      }
    } finally {
      setLoadingApp(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchApplicationStatus();
    }
  }, [user, fetchApplicationStatus]);

  /**
   * Handle form field changes
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.confirmAccuracy) {
      alert("Please confirm the accuracy of provided information.");
      return;
    }

    setStatus(SUBMISSION_STATUS.SUBMITTING);
    setErrorMessage("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      await submitCharityApplication(data);
      setStatus(SUBMISSION_STATUS.SUCCESS);
      
      // Refresh application status
      await fetchApplicationStatus();
    } catch (err) {
      console.error("Application submission failed:", err);
      setStatus(SUBMISSION_STATUS.ERROR);
      setErrorMessage(
        err.response?.data?.error || "Failed to submit application. Please try again."
      );
    }
  };

  /**
   * Reset form to submit another application
   */
  const handleSubmitAnother = () => {
    setStatus(SUBMISSION_STATUS.IDLE);
    setFormData(INITIAL_FORM_STATE);
  };

  if (loadingApp) {
    return (
      <DashboardLayout title="Charity Dashboard">
        <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Charity Dashboard">
      <div className="max-w-[1200px] mx-auto p-12 bg-white min-h-screen">
        {/* Header Section */}
        <header className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-4">
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
        <ApplicationStatusAlert application={application} />

        {/* Success State */}
        {status === SUBMISSION_STATUS.SUCCESS ? (
          <SuccessMessage onSubmitAnother={handleSubmitAnother} />
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="space-y-16">
            <OrganizationSection formData={formData} handleChange={handleChange} />
            <ContactSection formData={formData} handleChange={handleChange} />
            <MissionSection formData={formData} handleChange={handleChange} />
            <ImpactSection formData={formData} handleChange={handleChange} />
            <ComplianceSection formData={formData} handleChange={handleChange} />
            <ConfirmationSection formData={formData} handleChange={handleChange} />

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-8 pb-20">
              <button
                type="submit"
                disabled={status === SUBMISSION_STATUS.SUBMITTING}
                className="bg-red-600 text-white text-3xl font-bold py-5 px-24 rounded-full hover:bg-red-700 transition duration-300 shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {status === SUBMISSION_STATUS.SUBMITTING ? "Submitting..." : "Join Our Network"}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

/**
 * Application Status Alert Component
 */
function ApplicationStatusAlert({ application }) {
  if (!application) return null;

  const statusStyles = {
    [APPLICATION_STATUS.APPROVED]: "bg-green-100 text-green-800",
    [APPLICATION_STATUS.REJECTED]: "bg-red-100 text-red-800",
    [APPLICATION_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  };

  const styleClass = statusStyles[application.status] || statusStyles[APPLICATION_STATUS.PENDING];

  return (
    <div className={`mb-8 p-4 rounded-lg flex justify-between items-center ${styleClass}`}>
      <div>
        <span className="font-bold">Application Status: </span>
        <span className="capitalize">{application.status}</span>
        {application.rejection_reason && (
          <p className="text-sm mt-1">Reason: {application.rejection_reason}</p>
        )}
      </div>
      <p className="text-xs uppercase tracking-wider font-semibold opacity-70">
        Case #{application.id}
      </p>
    </div>
  );
}

/**
 * Success Message Component
 */
function SuccessMessage({ onSubmitAnother }) {
  return (
    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
      <h2 className="text-3xl font-bold text-green-600 mb-4">Application Submitted!</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Thank you for applying. Our team will review your organization and get back to you shortly.
      </p>
      <button
        onClick={onSubmitAnother}
        className="mt-8 bg-red-600 text-white px-10 py-3 rounded-full hover:bg-red-700 transition font-bold"
      >
        Submit Another Application
      </button>
    </div>
  );
}

export default CharityDashboard;
