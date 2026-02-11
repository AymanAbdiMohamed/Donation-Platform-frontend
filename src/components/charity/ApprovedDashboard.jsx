/**
 * Approved Charity Dashboard
 * Pink-themed dashboard for approved charities with Stories & Beneficiaries tabs
 */
import { useState, useEffect, useCallback } from "react";
import {
  getCharityDashboard,
  getReceivedDonations,
  updateCharityProfile,
} from "@/api/charity";
import {
  getCharityStories,
  createStory,
  updateStory,
  deleteStory,
} from "@/api/stories";
import {
  getBeneficiaries,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
  addInventoryItem,
  deleteInventoryItem,
} from "@/api/beneficiaries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  DollarSign,
  Users,
  Loader2,
  Edit2,
  Save,
  X,
  TrendingUp,
  BookOpen,
  Plus,
  Trash2,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ================================================================
   TAB BUTTON
   ================================================================ */
function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-[#EC4899] text-white shadow-pink"
          : "bg-[#FDF2F8] text-[#4B5563] hover:bg-[#FCE7F3]"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

/* ================================================================
   STORIES PANEL
   ================================================================ */
function StoriesPanel() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCharityStories();
      setStories(data.stories || []);
    } catch (err) {
      console.error("Failed to load stories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStories(); }, [fetchStories]);

  const resetForm = () => { setForm({ title: "", content: "" }); setEditingId(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateStory(editingId, form);
      } else {
        await createStory(form);
      }
      resetForm();
      fetchStories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save story");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (story) => {
    setForm({ title: story.title, content: story.content });
    setEditingId(story.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this story?")) return;
    try {
      await deleteStory(id);
      fetchStories();
    } catch (err) {
      alert("Failed to delete story");
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#EC4899]" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#1F2937]">Beneficiary Stories</h3>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-pink" size="sm">
          <Plus className="h-4 w-4 mr-1" /> New Story
        </Button>
      </div>

      {showForm && (
        <Card className="border-[#EC4899]/20 animate-scale-in">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-[#1F2937] font-medium">Title</Label>
              <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Story title..." className="border-[#FBB6CE]/30 focus:border-[#EC4899] rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[#1F2937] font-medium">Content</Label>
              <Textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Tell the story of a beneficiary..." rows={4} className="border-[#FBB6CE]/30 focus:border-[#EC4899] rounded-xl resize-none" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={resetForm} className="rounded-xl border-[#FBB6CE]/30" size="sm"><X className="h-4 w-4 mr-1" /> Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !form.title.trim() || !form.content.trim()} className="rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white" size="sm">
                {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                {editingId ? "Update" : "Publish"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {stories.length === 0 ? (
        <Card className="border-dashed border-2 border-[#FBB6CE]/20">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-10 w-10 text-[#FBB6CE]/50 mx-auto mb-3" />
            <p className="text-[#4B5563] font-medium">No stories yet</p>
            <p className="text-sm text-[#9CA3AF]">Share stories about how donations help your beneficiaries</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {stories.map((story) => (
            <Card key={story.id} className="border-[#FBB6CE]/10 hover:border-[#EC4899]/20 transition-all">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#1F2937]">{story.title}</h4>
                    <p className="text-sm text-[#4B5563] mt-1 line-clamp-3">{story.content}</p>
                    <p className="text-xs text-[#9CA3AF] mt-2">{story.created_at ? new Date(story.created_at).toLocaleDateString() : ""}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(story)} className="h-8 w-8 p-0 text-[#4B5563] hover:text-[#EC4899]"><Edit2 className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(story.id)} className="h-8 w-8 p-0 text-[#4B5563] hover:text-[#EF4444]"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   BENEFICIARIES PANEL
   ================================================================ */
function BeneficiariesPanel() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", age: "", location: "", school: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [invForm, setInvForm] = useState({ item_name: "", quantity: "1", notes: "" });
  const [addingInv, setAddingInv] = useState(false);

  const fetchBeneficiaries = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBeneficiaries(true);
      setBeneficiaries(data.beneficiaries || []);
    } catch (err) {
      console.error("Failed to load beneficiaries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBeneficiaries(); }, [fetchBeneficiaries]);

  const resetForm = () => { setForm({ name: "", age: "", location: "", school: "", notes: "" }); setEditingId(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = { ...form, age: form.age ? parseInt(form.age, 10) : null };
      if (editingId) {
        await updateBeneficiary(editingId, payload);
      } else {
        await createBeneficiary(payload);
      }
      resetForm();
      fetchBeneficiaries();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save beneficiary");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (b) => {
    setForm({ name: b.name, age: b.age || "", location: b.location || "", school: b.school || "", notes: b.notes || "" });
    setEditingId(b.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this beneficiary and their inventory records?")) return;
    try {
      await deleteBeneficiary(id);
      fetchBeneficiaries();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleAddInventory = async (beneficiaryId) => {
    if (!invForm.item_name.trim()) return;
    setAddingInv(true);
    try {
      await addInventoryItem(beneficiaryId, { ...invForm, quantity: parseInt(invForm.quantity, 10) || 1 });
      setInvForm({ item_name: "", quantity: "1", notes: "" });
      fetchBeneficiaries();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item");
    } finally {
      setAddingInv(false);
    }
  };

  const handleDeleteInvItem = async (itemId) => {
    try {
      await deleteInventoryItem(itemId);
      fetchBeneficiaries();
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#EC4899]" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#1F2937]">Beneficiaries & Inventory</h3>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-pink" size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Beneficiary
        </Button>
      </div>

      {showForm && (
        <Card className="border-[#EC4899]/20 animate-scale-in">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[#1F2937] text-sm font-medium">Name *</Label>
                <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" className="border-[#FBB6CE]/30 focus:border-[#EC4899] rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-[#1F2937] text-sm font-medium">Age</Label>
                <Input type="number" value={form.age} onChange={(e) => setForm(f => ({ ...f, age: e.target.value }))} placeholder="e.g. 14" className="border-[#FBB6CE]/30 focus:border-[#EC4899] rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-[#1F2937] text-sm font-medium">Location</Label>
                <Input value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Nairobi" className="border-[#FBB6CE]/30 focus:border-[#EC4899] rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-[#1F2937] text-sm font-medium">School</Label>
                <Input value={form.school} onChange={(e) => setForm(f => ({ ...f, school: e.target.value }))} placeholder="School name" className="border-[#FBB6CE]/30 focus:border-[#EC4899] rounded-xl" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[#1F2937] text-sm font-medium">Notes</Label>
              <Input value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional notes..." className="border-[#FBB6CE]/30 focus:border-[#EC4899] rounded-xl" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={resetForm} className="rounded-xl border-[#FBB6CE]/30" size="sm"><X className="h-4 w-4 mr-1" /> Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !form.name.trim()} className="rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white" size="sm">
                {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                {editingId ? "Update" : "Add"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {beneficiaries.length === 0 ? (
        <Card className="border-dashed border-2 border-[#FBB6CE]/20">
          <CardContent className="py-12 text-center">
            <Users className="h-10 w-10 text-[#FBB6CE]/50 mx-auto mb-3" />
            <p className="text-[#4B5563] font-medium">No beneficiaries yet</p>
            <p className="text-sm text-[#9CA3AF]">Add beneficiaries and track items distributed to them</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {beneficiaries.map((b) => (
            <Card key={b.id} className="border-[#FBB6CE]/10 hover:border-[#EC4899]/20 transition-all overflow-hidden">
              <CardContent className="py-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-[#1F2937]">{b.name}</h4>
                      {b.age && <span className="text-xs bg-[#FDF2F8] text-[#EC4899] px-2 py-0.5 rounded-full font-medium">Age {b.age}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#4B5563] mt-1 flex-wrap">
                      {b.location && <span>{b.location}</span>}
                      {b.school && <span>· {b.school}</span>}
                    </div>
                    {b.notes && <p className="text-xs text-[#9CA3AF] mt-1">{b.notes}</p>}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === b.id ? null : b.id)} className="h-8 w-8 p-0 text-[#4B5563] hover:text-[#EC4899]">
                      {expandedId === b.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(b)} className="h-8 w-8 p-0 text-[#4B5563] hover:text-[#EC4899]"><Edit2 className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(b.id)} className="h-8 w-8 p-0 text-[#4B5563] hover:text-[#EF4444]"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>

                {expandedId === b.id && (
                  <div className="border-t border-[#FBB6CE]/10 pt-3 space-y-3 animate-scale-in">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-[#EC4899]" />
                      <span className="text-sm font-semibold text-[#1F2937]">Inventory ({b.inventory?.length || 0} items)</span>
                    </div>
                    {b.inventory?.length > 0 && (
                      <div className="space-y-1.5">
                        {b.inventory.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-[#FDF2F8] rounded-lg px-3 py-2 text-sm">
                            <div>
                              <span className="font-medium text-[#1F2937]">{item.item_name}</span>
                              <span className="text-[#4B5563] ml-2">× {item.quantity}</span>
                              {item.notes && <span className="text-[#9CA3AF] ml-2">({item.notes})</span>}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteInvItem(item.id)} className="h-6 w-6 p-0 text-[#9CA3AF] hover:text-[#EF4444]"><X className="h-3 w-3" /></Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 items-end">
                      <div className="flex-1"><Input value={invForm.item_name} onChange={(e) => setInvForm(f => ({ ...f, item_name: e.target.value }))} placeholder="Item name (e.g. Sanitary pads)" className="h-9 text-sm border-[#FBB6CE]/30 focus:border-[#EC4899] rounded-lg" /></div>
                      <div className="w-20"><Input type="number" value={invForm.quantity} onChange={(e) => setInvForm(f => ({ ...f, quantity: e.target.value }))} min="1" className="h-9 text-sm border-[#FBB6CE]/30 focus:border-[#EC4899] rounded-lg" /></div>
                      <Button onClick={() => handleAddInventory(b.id)} disabled={addingInv || !invForm.item_name.trim()} className="h-9 rounded-lg bg-[#EC4899] hover:bg-[#DB2777] text-white" size="sm">
                        {addingInv ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   MAIN APPROVED DASHBOARD
   ================================================================ */
export function ApprovedCharityDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashData, donationsData] = await Promise.all([
          getCharityDashboard(),
          getReceivedDonations(10),
        ]);
        setDashboard(dashData);
        setDonations(donationsData.donations || []);
      } catch (err) {
        console.error("Failed to fetch charity data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FDF2F8] flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-7 w-7 animate-spin text-[#EC4899]" />
          </div>
          <p className="text-[#4B5563]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-[#FDF2F8] flex items-center justify-center mx-auto mb-4">
          <X className="h-7 w-7 text-[#EC4899]" />
        </div>
        <p className="text-[#4B5563]">Failed to load dashboard data</p>
      </div>
    );
  }

  const stats = dashboard.stats || {};
  const charity = dashboard.charity || {};

  return (
    <div className="space-y-6">
      {/* Stats (always visible) */}
      <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up">
        <Card className="border-[#FBB6CE]/10 hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22C55E] to-[#16a34a]" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#4B5563]">Total Donations</CardTitle>
            <div className="rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#22C55E]/20 p-2"><DollarSign className="h-4 w-4 text-[#22C55E]" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-[#1F2937]">KES {((stats.total_donations || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3 text-[#22C55E]" /><p className="text-xs text-[#22C55E] font-medium">All time revenue</p></div>
          </CardContent>
        </Card>

        <Card className="border-[#FBB6CE]/10 hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#EC4899] to-[#DB2777]" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#4B5563]">Donations Received</CardTitle>
            <div className="rounded-xl bg-gradient-to-br from-[#EC4899]/10 to-[#EC4899]/20 p-2"><Heart className="h-4 w-4 text-[#EC4899]" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-[#1F2937]">{stats.donation_count || 0}</div>
            <p className="text-xs text-[#9CA3AF] mt-1">Total contributions</p>
          </CardContent>
        </Card>

        <Card className="border-[#FBB6CE]/10 hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#4B5563]">Active Status</CardTitle>
            <div className="rounded-xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/20 p-2"><Users className="h-4 w-4 text-[#8B5CF6]" /></div>
          </CardHeader>
          <CardContent>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${charity.is_active ? "bg-[#dcfce7] text-[#22C55E]" : "bg-red-50 text-[#EF4444]"}`}>
              <span className={`w-2 h-2 rounded-full ${charity.is_active ? "bg-[#22C55E]" : "bg-[#EF4444]"}`} />
              {charity.is_active ? "Active" : "Inactive"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={DollarSign} label="Donations" />
        <TabButton active={activeTab === "stories"} onClick={() => setActiveTab("stories")} icon={BookOpen} label="Stories" />
        <TabButton active={activeTab === "beneficiaries"} onClick={() => setActiveTab("beneficiaries")} icon={Users} label="Beneficiaries" />
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <Card className="border-[#FBB6CE]/10 animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] flex items-center justify-center"><DollarSign className="h-5 w-5 text-[#EC4899]" /></div>
              <div>
                <CardTitle className="text-[#1F2937]">Recent Donations</CardTitle>
                <CardDescription className="text-[#4B5563]">Latest contributions received</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {donations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-2xl bg-[#FDF2F8] flex items-center justify-center mx-auto mb-3"><Heart className="h-7 w-7 text-[#FBB6CE]" /></div>
                <p className="text-[#1F2937] font-semibold mb-1">No donations yet</p>
                <p className="text-sm text-[#9CA3AF]">Donations will appear here once received</p>
              </div>
            ) : (
              <div className="space-y-3">
                {donations.map((donation, i) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 border border-[#FBB6CE]/10 rounded-xl hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                    <div>
                      <p className="font-medium text-[#1F2937]">{donation.is_anonymous ? "Anonymous Donor" : `Donor #${donation.donor_id}`}</p>
                      {donation.message && <p className="text-sm text-[#4B5563] mt-1 italic">&quot;{donation.message}&quot;</p>}
                      <p className="text-xs text-[#9CA3AF] mt-1">{new Date(donation.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="font-bold text-lg text-[#EC4899]">KES {(donation.amount_kes || 0).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "stories" && <StoriesPanel />}
      {activeTab === "beneficiaries" && <BeneficiariesPanel />}
    </div>
  );
}
