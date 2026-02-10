import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitCharityApplication } from "../../api/charity";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";
import { ROUTES } from "../../constants";
import { ApprovedCharityDashboard } from "../../components/charity/ApprovedDashboard";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2, Upload, CheckCircle, AlertCircle, FileText, Sparkles, Users, Globe } from "lucide-react";

function CharityDashboard() {
  const { user, logout } = useAuth();
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
    if (user) { fetchStatus(); }
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
        if (formData[key] !== null) { data.append(key, formData[key]); }
      });
      await submitCharityApplication(data);
      setStatus("success");
      setTimeout(() => { window.location.reload(); }, 2000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.response?.data?.message || "Failed to submit application. Please try again.");
    }
  };

  if (loadingApp) {
    return (
      <DashboardLayout title="Charity Dashboard">
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[#FDF2F8] flex items-center justify-center mb-4">
            <Loader2 className="h-7 w-7 animate-spin text-[#EC4899]" />
          </div>
          <p className="text-[#4B5563]">Loading Dashboard...</p>
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
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#DB2777] mb-4 shadow-pink">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
            Join Our Mission
          </h1>
          <p className="text-[#4B5563] mt-2 max-w-xl mx-auto">
            Apply to become a verified partner in ensuring girls get access to essential menstrual hygiene products.
          </p>
        </div>

        {/* Application Status */}
        {application && (
          <div className={`mb-8 p-4 rounded-xl flex items-start gap-3 animate-slide-up ${
            application.status === 'approved' ? 'bg-[#dcfce7] text-[#166534] border border-[#22C55E]/20' :
            application.status === 'rejected' ? 'bg-red-50 text-[#EF4444] border border-red-100' :
            'bg-[#FDF2F8] text-[#EC4899] border border-[#FBB6CE]/20'
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
            <Badge variant="outline" className="flex-shrink-0 border-current/20">#{application.id}</Badge>
          </div>
        )}

        {status === "success" ? (
          <Card className="text-center py-16 border-dashed border-2 border-[#FBB6CE]/30 animate-scale-in">
            <CardContent>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#16a34a] flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Application Submitted!</h2>
              <p className="text-[#4B5563] max-w-md mx-auto">
                Thank you for applying. Our team will review your organization and get back to you shortly.
              </p>
              <Button
                className="mt-6 rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-pink"
                onClick={() => setStatus("idle")}
              >
                Submit Another Application
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* SECTION 1: Organisation Information */}
            <Card className="border-[#FBB6CE]/10 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1F2937]">
                  <FileText className="h-5 w-5 text-[#EC4899]" />
                  Organisation Information
                </CardTitle>
                <CardDescription className="text-[#4B5563]">Basic details about your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="charityName" className="text-[#1F2937]">Charity Name *</Label>
                    <Input id="charityName" name="charityName" placeholder="e.g. Hope Foundation" value={formData.charityName} onChange={handleChange} required className="border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber" className="text-[#1F2937]">Registration Number *</Label>
                    <Input id="registrationNumber" name="registrationNumber" placeholder="e.g. NGO-12345" value={formData.registrationNumber} onChange={handleChange} required className="border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countryOfOperation" className="text-[#1F2937]">Country of Operation *</Label>
                    <Input id="countryOfOperation" name="countryOfOperation" placeholder="e.g. Kenya" value={formData.countryOfOperation} onChange={handleChange} required className="border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearOfEstablishment" className="text-[#1F2937]">Year Established *</Label>
                    <Input id="yearOfEstablishment" name="yearOfEstablishment" placeholder="e.g. 2015" value={formData.yearOfEstablishment} onChange={handleChange} required className="border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 2: Contact */}
            <Card className="border-[#FBB6CE]/10 animate-fade-in-up animation-delay-200">
              <CardHeader>
                <CardTitle className="text-[#1F2937]">Contact Details</CardTitle>
                <CardDescription className="text-[#4B5563]">How can we reach your organization?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryContactPerson" className="text-[#1F2937]">Primary Contact *</Label>
                    <Input id="primaryContactPerson" name="primaryContactPerson" placeholder="Full name" value={formData.primaryContactPerson} onChange={handleChange} required className="border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress" className="text-[#1F2937]">Email Address *</Label>
                    <Input id="emailAddress" name="emailAddress" type="email" placeholder="contact@charity.org" value={formData.emailAddress} onChange={handleChange} required className="border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-[#1F2937]">Phone Number *</Label>
                    <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+254 700 000000" value={formData.phoneNumber} onChange={handleChange} required className="border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 3: Mission */}
            <Card className="border-[#FBB6CE]/10 animate-fade-in-up animation-delay-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1F2937]">
                  <Globe className="h-5 w-5 text-[#EC4899]" />
                  Mission & Activities
                </CardTitle>
                <CardDescription className="text-[#4B5563]">Tell us about your work and impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="missionStatement" className="text-[#1F2937]">Mission Statement *</Label>
                    <Input id="missionStatement" name="missionStatement" placeholder="Your organization's mission" value={formData.missionStatement} onChange={handleChange} required className="border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetAgeGroup" className="text-[#1F2937]">Target Age Group *</Label>
                    <Input id="targetAgeGroup" name="targetAgeGroup" placeholder="e.g. 10-18 years" value={formData.targetAgeGroup} onChange={handleChange} required className="border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="menstrualHealthProgramme" className="text-[#1F2937]">Menstrual Health Programme *</Label>
                    <Input id="menstrualHealthProgramme" name="menstrualHealthProgramme" placeholder="Describe your programme" value={formData.menstrualHealthProgramme} onChange={handleChange} required className="border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regionServed" className="text-[#1F2937]">Region Served *</Label>
                    <Input id="regionServed" name="regionServed" placeholder="e.g. Western Kenya" value={formData.regionServed} onChange={handleChange} required className="border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 4: Impact */}
            <Card className="border-[#FBB6CE]/10 animate-fade-in-up animation-delay-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1F2937]">
                  <Users className="h-5 w-5 text-[#EC4899]" />
                  Impact & Transparency
                </CardTitle>
                <CardDescription className="text-[#4B5563]">Demonstrate your organization&apos;s impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="girlsReachedLastYear" className="text-[#1F2937]">Girls Reached Last Year *</Label>
                    <Input id="girlsReachedLastYear" name="girlsReachedLastYear" placeholder="e.g. 5000" value={formData.girlsReachedLastYear} onChange={handleChange} required className="border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualBudget" className="text-[#1F2937]">Annual Budget *</Label>
                    <Input id="annualBudget" name="annualBudget" placeholder="e.g. KES 5,000,000" value={formData.annualBudget} onChange={handleChange} required className="border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#1F2937]">Photos or Testimonials</Label>
                    <label className="flex items-center gap-3 border border-[#FBB6CE]/30 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-[#FDF2F8] transition-colors">
                      <Upload className="h-4 w-4 text-[#EC4899]" />
                      <span className="text-sm text-[#4B5563] truncate flex-1">
                        {formData.photos ? formData.photos.name : "Choose file..."}
                      </span>
                      <input type="file" name="photos" onChange={handleChange} className="hidden" />
                    </label>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#1F2937]">Evidence Files</Label>
                    <label className="flex items-center gap-3 border border-[#FBB6CE]/30 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-[#FDF2F8] transition-colors">
                      <Upload className="h-4 w-4 text-[#EC4899]" />
                      <span className="text-sm text-[#4B5563] truncate flex-1">
                        {formData.evidenceFile ? formData.evidenceFile.name : "Choose file..."}
                      </span>
                      <input type="file" name="evidenceFile" onChange={handleChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 5: Compliance */}
            <Card className="border-[#FBB6CE]/10">
              <CardHeader>
                <CardTitle className="text-[#1F2937]">Compliance & Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 bg-[#FDF2F8] rounded-xl px-3 py-2.5">
                  <Checkbox
                    id="complyEducation"
                    checked={formData.complyEducation}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, complyEducation: checked }))}
                    className="border-[#FBB6CE] data-[state=checked]:bg-[#EC4899] data-[state=checked]:border-[#EC4899]"
                  />
                  <Label htmlFor="complyEducation" className="font-normal cursor-pointer text-[#4B5563]">
                    We follow menstrual health education guidelines
                  </Label>
                </div>
                <div className="flex items-center space-x-3 bg-[#FDF2F8] rounded-xl px-3 py-2.5">
                  <Checkbox
                    id="partnerSchools"
                    checked={formData.partnerSchools}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, partnerSchools: checked }))}
                    className="border-[#FBB6CE] data-[state=checked]:bg-[#EC4899] data-[state=checked]:border-[#EC4899]"
                  />
                  <Label htmlFor="partnerSchools" className="font-normal cursor-pointer text-[#4B5563]">
                    We partner with schools or clinics
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Final Confirmation */}
            <Card className="border-[#EC4899]/20 bg-[#FDF2F8]">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="confirmAccuracy"
                    checked={formData.confirmAccuracy}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, confirmAccuracy: checked }))}
                    required
                    className="border-[#EC4899] data-[state=checked]:bg-[#EC4899] data-[state=checked]:border-[#EC4899]"
                  />
                  <Label htmlFor="confirmAccuracy" className="font-normal cursor-pointer leading-relaxed text-[#4B5563]">
                    I confirm that all the information provided is accurate and that our organisation agrees to the Platform&apos;s Terms and Values.
                  </Label>
                </div>
              </CardContent>
            </Card>

            {errorMessage && (
              <div className="bg-red-50 text-[#EF4444] p-4 rounded-xl text-center text-sm border border-red-100 animate-slide-up">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-center pb-8">
              <Button
                type="submit"
                disabled={status === 'submitting'}
                size="lg"
                className="h-12 px-12 text-base rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-pink hover:shadow-pink-lg transition-all"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Join Our Network
                  </>
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
