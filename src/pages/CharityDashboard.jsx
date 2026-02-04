import { useState } from "react";
import { submitCharityApplication } from "../api";
import { useAuth } from "../context/AuthContext";

function CharityDashboard() {
  // Access the current logged-in user from our global AuthContext
  const { user } = useAuth();
  
  // STATE MANAGEMENT
  // This large state object holds all the values for our application form.
  // Using a single object for related fields is cleaner than having 20+ separate useState variables.
  const [formData, setFormData] = useState({
    charityName: "",
    registrationNumber: "",
    countryOfOperation: "",
    yearEstablished: "",
    primaryContactPerson: "",
    emailAddress: "",
    phoneNumber: "",
    missionStatement: "",
    targetAgeGroup: "",
    menstrualHealthProgramme: "",
    regionServed: "",
    girlsReachedLastYear: "",
    annualBudget: "",
    photos: null,       // Will store File object
    evidenceFile: null, // Will store File object
    complyEducation: false, // Checkbox
    partnerSchools: false,  // Checkbox
    confirmAccuracy: false, // Checkbox
  });

  // Track the status of the form submission:
  // 'idle' = user hasn't submitted yet
  // 'submitting' = request is in progress (show loading spinner)
  // 'success' = application sent successfully (show thank you message)
  // 'error' = something went wrong (show error message)
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // GENERIC CHANGE HANDLER
  // This one function handles ALL inputs (text, number, checkbox, file).
  const handleChange = (e) => {
    // Destructure properties from the input element
    const { name, value, type, checked, files } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]:
        // If it's a checkbox, use 'checked' (true/false)
        type === "checkbox" ? checked 
        // If it's a file input, grab the first file selected
        : type === "file" ? files[0] 
        // Otherwise (text, number, etc.), use the standard 'value'
        : value,
    }));
  };

  // FORM SUBMISSION HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop default HTML form submission
    setStatus("submitting"); // Update UI to show loading state
    setErrorMessage(""); // Clear old errors

    try {
        // PREPARE DATA FOR UPLOAD
        // Because we are uploading files, we can't just send a plain JSON object.
        // We must use 'FormData', which is a built-in browser API for constructing
        // key/value pairs representing form fields and their values (including files).
        const data = new FormData();
        
        // Loop through our state object and append each key-value pair to the FormData
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        
        // Send to backend via our API helper function
        await submitCharityApplication(data);
        
        // If successful, update status to show the success message
        setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Failed to submit application. Please try again.");
    }
  };

  // CONDITIONALLY RENDER SUCCESS MESSAGE
  // If status is 'success', we hide the form and show this nice message instead.
  if (status === "success") {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Application Submitted!</h2>
        <p className="text-gray-700">
          Thank you for joining our mission. Your application is currently under review.
          We will contact you shortly.
        </p>
        <button 
            onClick={() => setStatus("idle")} // Reset to show the form again
            className="mt-6 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
        >
            Start New Application
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-center gap-2 mb-2">
            {/* Title with multi-colored text span */}
            <h1 className="text-4xl font-bold flex items-center gap-2">
                <span className="text-red-500">SheNeeds</span>
                <span>Join Our Mission to Help Our Girls</span>
            </h1>
        </div>
        <p className="text-gray-600">
          Apply to become a verified Partner in ensuring our Girls get Access to essential Menstrual Hygiene Products
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1: Organisation Information */}
        <section>
          <h3 className="text-lg font-bold mb-4">Organisation Information</h3>
          {/* Grid layout: 1 column on mobile, 2 on medium screens, 4 on large screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <input
              type="text"
              name="charityName"
              placeholder="Charity Name"
              value={formData.charityName}
              onChange={handleChange}
              className="w-full bg-gray-200 p-3 rounded"
              required
            />
            <input
              type="text"
              name="registrationNumber"
              placeholder="Registration Number"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="w-full bg-gray-200 p-3 rounded"
              required
            />
            <input
              type="text"
              name="countryOfOperation"
              placeholder="Country Of Operation"
              value={formData.countryOfOperation}
              onChange={handleChange}
              className="w-full bg-gray-200 p-3 rounded"
              required
            />
            <input
              type="text"
              name="yearEstablished"
              placeholder="Year Established"
              value={formData.yearEstablished}
              onChange={handleChange}
              className="w-full bg-gray-200 p-3 rounded"
              required
            />
          </div>
        </section>

        {/* SECTION 2: Contact Detail */}
        <section>
          <h3 className="text-lg font-bold mb-4">Contact Detail</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <input
              type="text"
              name="primaryContactPerson"
              placeholder="Primary Contact Person"
              value={formData.primaryContactPerson}
              onChange={handleChange}
              className="w-full bg-gray-200 p-3 rounded"
              required
            />
            <input
              type="email"
              name="emailAddress"
              placeholder="Email Address"
              value={formData.emailAddress}
              onChange={handleChange}
              className="w-full bg-gray-200 p-3 rounded"
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full bg-gray-200 p-3 rounded"
              required
            />
          </div>
        </section>

        {/* SECTION 3: Mission & Activities */}
        <section>
          <h3 className="text-lg font-bold mb-4">Mission & Activities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <input
              type="text"
              name="missionStatement"
              placeholder="Mission Statement"
              value={formData.missionStatement}
              onChange={handleChange}
              className="w-full bg-gray-200 p-3 rounded"
              required
            />
            <input
              type="text"
              name="targetAgeGroup"
              placeholder="Target Age Group"
              value={formData.targetAgeGroup}
              onChange={handleChange}
              className="w-full bg-gray-200 p-3 rounded"
              required
            />
            <input
              type="text"
              name="menstrualHealthProgramme"
              placeholder="Menstrual Health Programme"
              value={formData.menstrualHealthProgramme}
              onChange={handleChange}
              className="w-full bg-gray-200 p-3 rounded"
              required
            />
             <input
              type="text"
              name="regionServed"
              placeholder="Region Served"
              value={formData.regionServed}
              onChange={handleChange}
              className="w-full bg-gray-200 p-3 rounded"
              required
            />
          </div>
        </section>

        {/* SECTION 4: Impact & Transparency (Handles File Uploads) */}
        <section>
          <h3 className="text-lg font-bold mb-4">Impact & Transparency</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Row 1: Girls Reached + Photo Upload */}
            <input
              type="text"
              name="girlsReachedLastYear"
              placeholder="Girls Reached Last Year"
              value={formData.girlsReachedLastYear}
              onChange={handleChange}
              className="w-full bg-gray-200 p-3 rounded"
              required
            />
            {/* Custom File Input Styling */}
            {/* We hide the actual <input type="file"> and style a label instead */}
            <div className="flex gap-4 items-center">
                 <label className="bg-gray-300 px-4 py-2 cursor-pointer rounded hover:bg-gray-400 text-sm whitespace-nowrap">
                    Choose File
                    <input type="file" name="photos" onChange={handleChange} className="hidden" />
                 </label>
                 {/* Show the selected file name or a default text */}
                 <div className="flex-1 bg-gray-200 p-3 rounded text-gray-500 truncate">
                    {formData.photos ? formData.photos.name : "Upload Photos or Testimonials"}
                 </div>
            </div>

             {/* Row 2: Budget + Evidence Upload */}
            <input
              type="text"
              name="annualBudget"
              placeholder="Annual Budget"
              value={formData.annualBudget}
              onChange={handleChange}
              className="w-full bg-gray-200 p-3 rounded"
              required
            />
             <div className="flex gap-4 items-center">
                 <label className="bg-gray-300 px-4 py-2 cursor-pointer rounded hover:bg-gray-400 text-sm whitespace-nowrap">
                    Choose File
                    <input type="file" name="evidenceFile" onChange={handleChange} className="hidden" />
                 </label>
                 <div className="flex-1 bg-gray-200 p-3 rounded text-gray-500 truncate">
                    {formData.evidenceFile ? formData.evidenceFile.name : "Upload Files or text evidences"}
                 </div>
            </div>

          </div>
        </section>

        {/* SECTION 5: Compliance & Verification (Checkboxes) */}
        <section>
          <h3 className="text-lg font-bold mb-4">Compliance & Verification</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="complyEducation"
                checked={formData.complyEducation}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span className="text-gray-700">Do you Follow Menstrual Health education guidlines ?</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="partnerSchools"
                checked={formData.partnerSchools}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span className="text-gray-700">Do you patner with Schools or Clinics</span>
            </label>
          </div>
        </section>

        {/* SECTION 6: Final Confirmation */}
        <div className="pt-6 border-t border-gray-300">
             <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="confirmAccuracy"
                checked={formData.confirmAccuracy}
                onChange={handleChange}
                className="w-5 h-5 mt-1"
                required
              />
              <span className="text-gray-700">Confirm That all the information provided is accurate and that our organisation agrees to the Platform Terms and Values</span>
            </label>
        </div>
        
        {/* Error Message Display */}
        {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}

        <div className="flex justify-center pb-12">
            <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-red-600 text-white text-xl font-bold py-3 px-12 rounded-full hover:bg-red-700 transition duration-300 shadow-lg"
            >
                {status === 'submitting' ? 'Submitting...' : 'Join Our Network'}
            </button>
        </div>

      </form>
    </div>
  );
}

export default CharityDashboard;