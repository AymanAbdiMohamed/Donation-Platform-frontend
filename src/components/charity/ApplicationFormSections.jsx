/**
 * Charity Application Form Section Components
 * Extracted from CharityDashboard for maintainability
 */

/**
 * Organization Information Section
 */
export function OrganizationSection({ formData, handleChange }) {
  return (
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
  );
}

/**
 * Contact Details Section
 */
export function ContactSection({ formData, handleChange }) {
  return (
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
  );
}

/**
 * Mission & Activities Section
 */
export function MissionSection({ formData, handleChange }) {
  return (
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
  );
}

/**
 * Impact & Transparency Section
 */
export function ImpactSection({ formData, handleChange }) {
  return (
    <section>
      <h3 className="text-xl font-bold mb-6 text-gray-800">Impact & Transparency</h3>
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
        <div className="hidden lg:block"></div>

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
  );
}

/**
 * Compliance & Verification Section
 */
export function ComplianceSection({ formData, handleChange }) {
  return (
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
          <span className="text-gray-700 font-medium group-hover:text-black transition">
            Do you Follow Menstrual Health education guidelines?
          </span>
        </label>
        <label className="flex items-center gap-4 cursor-pointer group">
          <input
            type="checkbox"
            name="partnerSchools"
            checked={formData.partnerSchools}
            onChange={handleChange}
            className="w-5 h-5 accent-red-600"
          />
          <span className="text-gray-700 font-medium group-hover:text-black transition">
            Do you partner with Schools or Clinics?
          </span>
        </label>
      </div>
    </section>
  );
}

/**
 * Final Confirmation Section
 */
export function ConfirmationSection({ formData, handleChange }) {
  return (
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
          Confirm that all the information provided is accurate and that our organisation agrees to the Platform's Terms and Values
        </span>
      </label>
    </div>
  );
}
