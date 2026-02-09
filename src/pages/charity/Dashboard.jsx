import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitCharityApplication } from "../../api/charity";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";
import { ApprovedCharityDashboard } from "../../components/charity/ApprovedDashboard";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2, Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";

function CharityDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [application, setApplication] = useState(null);
  const [loadingApp, setLoadingApp] = useState(false);
  const [hasCharity, setHasCharity] = useState(false);

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

  useEffect(() => {
    const fetchStatus = async () => {
      setLoadingApp(true);
      try {
        try {
          const profileRes = await api.get("/charity/profile");
          if (profileRes.data?.charity) {
            setHasCharity(true);
            setLoadingApp(false);
            return;
          }
        } catch {
          // 404 means no charity yet
        }

        const response = await api.get("/charity/application");
        if (response.data?.application) {
          setApplication(response.data.application);
        }
      } catch (err) {
        console.error("Error fetching status:", err);
      } finally {
        setLoadingApp(false);
      }
    };

    if (user) {
      fetchStatus();
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
      alert("Please confirm the accuracy of provided information.");
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
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.response?.data?.message || "Failed to submit application. Please try again.");
    }
  };

  if (loadingApp) {
    return (
      <DashboardLayout title="Charity Dashboard">
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (hasCharity) {
    return (
      <DashboardLayout title="Charity Dashboard">
        <ApprovedCharityDashboard />
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Charity Application">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <Heart className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Join Our Mission
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Apply to become a verified partner in ensuring girls get access to essential menstrual hygiene products.
          </p>
        </div>

        {/* Application Status Alert */}
        {application && (
          <div className={`mb-8 p-4 rounded-xl flex items-start gap-3 ${
            application.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
            application.status === 'rejected' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
            'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {application.status === 'approved' ? <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" /> :
             application.status === 'rejected' ? <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" /> :
             <Loader2 className="h-5 w-5 mt-0.5 flex-shrink-0 animate-spin" />}
            <div className="flex-1">
              <p className="font-semibold">
                Application Status: <span className="capitalize">{application.status}</span>
              </p>
              {application.rejection_reason && (
                <p className="text-sm mt-1 opacity-80">Reason: {application.rejection_reason}</p>
              )}
            </div>
            <Badge variant="outline" className="flex-shrink-0">#{application.id}</Badge>
          </div>
        )}

        {status === "success" ? (
          <Card className="text-center py-16 border-dashed border-2">
            <CardContent>
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Thank you for applying. Our team will review your organization and get back to you shortly.
              </p>
              <Button className="mt-6" onClick={() => setStatus("idle")}>
                Submit Another Application
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* SECTION 1: Organisation Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Organisation Information
                </CardTitle>
                <CardDescription>Basic details about your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="charityName">Charity Name *</Label>
                    <Input id="charityName" name="charityName" placeholder="e.g. Hope Foundation" value={formData.charityName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number *</Label>
                    <Input id="registrationNumber" name="registrationNumber" placeholder="e.g. NGO-12345" value={formData.registrationNumber} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countryOfOperation">Country of Operation *</Label>
                    <Input id="countryOfOperation" name="countryOfOperation" placeholder="e.g. Kenya" value={formData.countryOfOperation} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearOfEstablishment">Year Established *</Label>
                    <Input id="yearOfEstablishment" name="yearOfEstablishment" placeholder="e.g. 2015" value={formData.yearOfEstablishment} onChange={handleChange} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 2: Contact Detail */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
                <CardDescription>How can we reach your organization?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryContactPerson">Primary Contact *</Label>
                    <Input id="primaryContactPerson" name="primaryContactPerson" placeholder="Full name" value={formData.primaryContactPerson} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress">Email Address *</Label>
                    <Input id="emailAddress" name="emailAddress" type="email" placeholder="contact@charity.org" value={formData.emailAddress} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+254 700 000000" value={formData.phoneNumber} onChange={handleChange} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 3: Mission & Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Mission & Activities</CardTitle>
                <CardDescription>Tell us about your work and impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="missionStatement">Mission Statement *</Label>
                    <Input id="missionStatement" name="missionStatement" placeholder="Your organization's mission" value={formData.missionStatement} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetAgeGroup">Target Age Group *</Label>
                    <Input id="targetAgeGroup" name="targetAgeGroup" placeholder="e.g. 10-18 years" value={formData.targetAgeGroup} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="menstrualHealthProgramme">Menstrual Health Programme *</Label>
                    <Input id="menstrualHealthProgramme" name="menstrualHealthProgramme" placeholder="Describe your programme" value={formData.menstrualHealthProgramme} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regionServed">Region Served *</Label>
                    <Input id="regionServed" name="regionServed" placeholder="e.g. Western Kenya" value={formData.regionServed} onChange={handleChange} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 4: Impact & Transparency */}
            <Card>
              <CardHeader>
                <CardTitle>Impact & Transparency</CardTitle>
                <CardDescription>Demonstrate your organization&apos;s impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="girlsReachedLastYear">Girls Reached Last Year *</Label>
                    <Input id="girlsReachedLastYear" name="girlsReachedLastYear" placeholder="e.g. 5000" value={formData.girlsReachedLastYear} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualBudget">Annual Budget *</Label>
                    <Input id="annualBudget" name="annualBudget" placeholder="e.g. $50,000" value={formData.annualBudget} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Photos or Testimonials</Label>
                    <label className="flex items-center gap-3 border border-input rounded-lg px-3 py-2.5 cursor-pointer hover:bg-secondary/50 transition-colors">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground truncate flex-1">
                        {formData.photos ? formData.photos.name : "Choose file..."}
                      </span>
                      <input type="file" name="photos" onChange={handleChange} className="hidden" />
                    </label>
                  </div>
                  <div className="space-y-2">
                    <Label>Evidence Files</Label>
                    <label className="flex items-center gap-3 border border-input rounded-lg px-3 py-2.5 cursor-pointer hover:bg-secondary/50 transition-colors">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground truncate flex-1">
                        {formData.evidenceFile ? formData.evidenceFile.name : "Choose file..."}
                      </span>
                      <input type="file" name="evidenceFile" onChange={handleChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 5: Compliance & Verification */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance & Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="complyEducation"
                    checked={formData.complyEducation}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, complyEducation: checked }))}
                  />
                  <Label htmlFor="complyEducation" className="font-normal cursor-pointer">
                    We follow menstrual health education guidelines
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="partnerSchools"
                    checked={formData.partnerSchools}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, partnerSchools: checked }))}
                  />
                  <Label htmlFor="partnerSchools" className="font-normal cursor-pointer">
                    We partner with schools or clinics
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Final Confirmation */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="confirmAccuracy"
                    checked={formData.confirmAccuracy}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, confirmAccuracy: checked }))}
                    required
                  />
                  <Label htmlFor="confirmAccuracy" className="font-normal cursor-pointer leading-relaxed">
                    I confirm that all the information provided is accurate and that our organisation agrees to the Platform&apos;s Terms and Values.
                  </Label>
                </div>
              </CardContent>
            </Card>
          
            {errorMessage && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-center text-sm border border-destructive/20">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-center pb-8">
              <Button
                type="submit"
                disabled={status === 'submitting'}
                size="lg"
                className="h-12 px-12 text-base rounded-xl shadow-lg shadow-primary/20"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Join Our Network'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CharityDashboard;