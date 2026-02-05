/**
 * Charity Application Form Section Components
 * Extracted from CharityDashboard for maintainability
 */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

/**
 * Reusable Form Field Component
 */
function FormField({ label, children, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      {children}
    </div>
  );
}

/**
 * Section Header Component
 */
function SectionHeader({ children }) {
  return (
    <h3 className="text-lg font-semibold mb-4 text-foreground border-b pb-2">
      {children}
    </h3>
  );
}

/**
 * Organization Information Section
 */
export function OrganizationSection({ formData, handleChange }) {
  return (
    <section>
      <SectionHeader>Organisation Information</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField label="Charity Name">
          <Input
            type="text"
            name="charityName"
            placeholder="Enter charity name"
            value={formData.charityName}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField label="Registration Number">
          <Input
            type="text"
            name="registrationNumber"
            placeholder="Enter registration number"
            value={formData.registrationNumber}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField label="Country of Operation">
          <Input
            type="text"
            name="countryOfOperation"
            placeholder="Enter country"
            value={formData.countryOfOperation}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField label="Year Established">
          <Input
            type="text"
            name="yearOfEstablishment"
            placeholder="e.g., 2015"
            value={formData.yearOfEstablishment}
            onChange={handleChange}
            required
          />
        </FormField>
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
      <SectionHeader>Contact Details</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Primary Contact Person">
          <Input
            type="text"
            name="primaryContactPerson"
            placeholder="Full name"
            value={formData.primaryContactPerson}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField label="Email Address">
          <Input
            type="email"
            name="emailAddress"
            placeholder="email@example.com"
            value={formData.emailAddress}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField label="Phone Number">
          <Input
            type="tel"
            name="phoneNumber"
            placeholder="+1 234 567 8900"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </FormField>
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
      <SectionHeader>Mission & Activities</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField label="Mission Statement">
          <Input
            type="text"
            name="missionStatement"
            placeholder="Brief mission statement"
            value={formData.missionStatement}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField label="Target Age Group">
          <Input
            type="text"
            name="targetAgeGroup"
            placeholder="e.g., 10-18 years"
            value={formData.targetAgeGroup}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField label="Menstrual Health Programme">
          <Input
            type="text"
            name="menstrualHealthProgramme"
            placeholder="Programme description"
            value={formData.menstrualHealthProgramme}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField label="Region Served">
          <Input
            type="text"
            name="regionServed"
            placeholder="Geographic regions"
            value={formData.regionServed}
            onChange={handleChange}
            required
          />
        </FormField>
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
      <SectionHeader>Impact & Transparency</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField label="Girls Reached Last Year">
            <Input
              type="text"
              name="girlsReachedLastYear"
              placeholder="Number of beneficiaries"
              value={formData.girlsReachedLastYear}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="Annual Budget">
            <Input
              type="text"
              name="annualBudget"
              placeholder="e.g., $50,000"
              value={formData.annualBudget}
              onChange={handleChange}
              required
            />
          </FormField>
        </div>
        
        <div className="space-y-4">
          <FormField label="Photos or Testimonials">
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" asChild className="cursor-pointer">
                <label>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                  <input type="file" name="photos" onChange={handleChange} className="hidden" />
                </label>
              </Button>
              <span className="text-sm text-muted-foreground truncate flex-1">
                {formData.photos ? formData.photos.name : "No file selected"}
              </span>
            </div>
          </FormField>
          <FormField label="Evidence Files">
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" asChild className="cursor-pointer">
                <label>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                  <input type="file" name="evidenceFile" onChange={handleChange} className="hidden" />
                </label>
              </Button>
              <span className="text-sm text-muted-foreground truncate flex-1">
                {formData.evidenceFile ? formData.evidenceFile.name : "No file selected"}
              </span>
            </div>
          </FormField>
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
      <SectionHeader>Compliance & Verification</SectionHeader>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="complyEducation"
            name="complyEducation"
            checked={formData.complyEducation}
            onCheckedChange={(checked) => 
              handleChange({ target: { name: "complyEducation", type: "checkbox", checked } })
            }
          />
          <Label htmlFor="complyEducation" className="cursor-pointer">
            Do you follow Menstrual Health education guidelines?
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <Checkbox
            id="partnerSchools"
            name="partnerSchools"
            checked={formData.partnerSchools}
            onCheckedChange={(checked) => 
              handleChange({ target: { name: "partnerSchools", type: "checkbox", checked } })
            }
          />
          <Label htmlFor="partnerSchools" className="cursor-pointer">
            Do you partner with Schools or Clinics?
          </Label>
        </div>
      </div>
    </section>
  );
}

/**
 * Final Confirmation Section
 */
export function ConfirmationSection({ formData, handleChange }) {
  return (
    <div className="pt-6 border-t">
      <div className="flex items-start space-x-3">
        <Checkbox
          id="confirmAccuracy"
          name="confirmAccuracy"
          checked={formData.confirmAccuracy}
          onCheckedChange={(checked) => 
            handleChange({ target: { name: "confirmAccuracy", type: "checkbox", checked } })
          }
          required
          className="mt-1"
        />
        <Label htmlFor="confirmAccuracy" className="cursor-pointer text-sm leading-relaxed">
          I confirm that all the information provided is accurate and that our organisation agrees to 
          the Platform's Terms and Values
        </Label>
      </div>
    </div>
  );
}
