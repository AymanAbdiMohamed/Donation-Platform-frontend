/**
 * Charity Dashboard
 * Allows charity users to submit and track their application status
 */
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { submitCharityApplication, getCharityApplication } from "@/api";
import { APPLICATION_STATUS } from "@/constants";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  OrganizationSection,
  ContactSection,
  MissionSection,
  ImpactSection,
  ComplianceSection,
  ConfirmationSection,
} from "@/components/charity/ApplicationFormSections";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2, CheckCircle, XCircle, Clock, Send, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Charity Dashboard">
      <div className="space-y-8">
        {/* Header Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="h-8 w-8 text-primary fill-primary" />
              <CardTitle className="text-3xl font-extrabold tracking-tight">
                Join Our Mission to Help Our Girls
              </CardTitle>
            </div>
            <CardDescription className="text-base max-w-2xl mx-auto">
              Apply to become a verified Partner in ensuring our Girls get Access to essential Menstrual Hygiene Products
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Application Status Alert */}
        <ApplicationStatusAlert application={application} />

        {/* Success State */}
        {status === SUBMISSION_STATUS.SUCCESS ? (
          <SuccessMessage onSubmitAnother={handleSubmitAnother} />
        ) : (
          /* Application Form */
          <Card>
            <CardHeader>
              <CardTitle>Charity Application Form</CardTitle>
              <CardDescription>
                Fill out all sections below to submit your organization for verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-12">
                <OrganizationSection formData={formData} handleChange={handleChange} />
                <ContactSection formData={formData} handleChange={handleChange} />
                <MissionSection formData={formData} handleChange={handleChange} />
                <ImpactSection formData={formData} handleChange={handleChange} />
                <ComplianceSection formData={formData} handleChange={handleChange} />
                <ConfirmationSection formData={formData} handleChange={handleChange} />

                {/* Error Message */}
                {errorMessage && (
                  <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === SUBMISSION_STATUS.SUBMITTING}
                    className="text-lg px-12 py-6 h-auto"
                  >
                    {status === SUBMISSION_STATUS.SUBMITTING ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Join Our Network
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
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

  const statusConfig = {
    [APPLICATION_STATUS.APPROVED]: {
      variant: "default",
      icon: CheckCircle,
      className: "bg-green-50 border-green-200 text-green-800",
      iconClass: "text-green-600",
    },
    [APPLICATION_STATUS.REJECTED]: {
      variant: "destructive",
      icon: XCircle,
      className: "bg-destructive/10 border-destructive/20 text-destructive",
      iconClass: "text-destructive",
    },
    [APPLICATION_STATUS.PENDING]: {
      variant: "outline",
      icon: Clock,
      className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      iconClass: "text-yellow-600",
    },
  };

  const config = statusConfig[application.status] || statusConfig[APPLICATION_STATUS.PENDING];
  const Icon = config.icon;

  return (
    <Card className={cn("border", config.className)}>
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <Icon className={cn("h-5 w-5", config.iconClass)} />
          <div>
            <span className="font-semibold">Application Status: </span>
            <Badge variant={config.variant} className="capitalize ml-2">
              {application.status}
            </Badge>
            {application.rejection_reason && (
              <p className="text-sm mt-1 opacity-80">Reason: {application.rejection_reason}</p>
            )}
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          Case #{application.id}
        </Badge>
      </CardContent>
    </Card>
  );
}

/**
 * Success Message Component
 */
function SuccessMessage({ onSubmitAnother }) {
  return (
    <Card className="border-dashed">
      <CardContent className="text-center py-16">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-600 mb-4">Application Submitted!</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Thank you for applying. Our team will review your organization and get back to you shortly.
        </p>
        <Button onClick={onSubmitAnother} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Submit Another Application
        </Button>
      </CardContent>
    </Card>
  );
}

export default CharityDashboard;
