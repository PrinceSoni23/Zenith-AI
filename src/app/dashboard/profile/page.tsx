"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { HelpButton } from "@/components/Tutorial/HelpButton";
import { dashboardTutorials } from "@/config/tutorialConfig";
import { profileApi } from "@/lib/api";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  BookOpen,
  Award,
  Settings,
  Save,
  Loader2,
  Zap,
  Copy,
  Check,
} from "lucide-react";

interface StudentProfile {
  _id: string;
  userId: string;
  classLevel: string;
  board: string; // Allow custom boards
  subjects: string[];
  preferredLanguage: "english" | "hinglish";
  learningStyle: "visual" | "auditory" | "reading" | "kinesthetic";
  studyGoalMinutes: number;
  streakDays: number;
  totalStudyMinutes: number;
  studyScore: number;
  weeklyScore: number;
  lastStudyDate?: Date;
  badges: string[];
  weakTopics: string[];
  powerHourTime?: string;
  streakShields: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  parentEmail?: string;
}

const classLevels = [
  "Nursery",
  "LKG",
  "UKG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

const boards = ["CBSE", "ICSE", "State", "IB", "IGCSE", "Other"];
const subjects = [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Economics",
  "Civics",
];
const learningStyles = ["visual", "auditory", "reading", "kinesthetic"];

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [formData, setFormData] = useState<Partial<StudentProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customBoard, setCustomBoard] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [showCustomBoard, setShowCustomBoard] = useState(false);
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const [copiedStudentId, setCopiedStudentId] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          setUser(JSON.parse(userStr));
        }

        const res = await profileApi.get();
        const profileData = res.data.data;
        setProfile(profileData);
        setFormData(profileData);
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "subjects") {
      // Handle multi-select for subjects
      setFormData(prev => ({
        ...prev,
        subjects: prev.subjects?.includes(value)
          ? prev.subjects.filter(s => s !== value)
          : [...(prev.subjects || []), value],
      }));
    } else if (name === "studyGoalMinutes") {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await profileApi.update(formData);
      setProfile(res.data.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
    setShowCustomBoard(false);
    setShowCustomSubject(false);
    setCustomBoard("");
    setCustomSubject("");
  };

  const copyStudentId = () => {
    if (profile?.userId) {
      navigator.clipboard.writeText(profile.userId);
      setCopiedStudentId(true);
      toast.success("Student ID copied to clipboard!");
      setTimeout(() => setCopiedStudentId(false), 2000);
    }
  };

  const addCustomBoard = () => {
    if (customBoard.trim() && formData.board !== customBoard.trim()) {
      setFormData(prev => ({ ...prev, board: customBoard.trim() }));
      setCustomBoard("");
      setShowCustomBoard(false);
    }
  };

  const addCustomSubject = () => {
    if (
      customSubject.trim() &&
      !formData.subjects
        ?.map(s => s.toLowerCase())
        .includes(customSubject.toLowerCase())
    ) {
      setFormData(prev => ({
        ...prev,
        subjects: [...(prev.subjects || []), customSubject.trim()],
      }));
      setCustomSubject("");
      setShowCustomSubject(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-dark-950 dark:via-slate-900 dark:to-purple-900/20">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              Loading your profile...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-dark-950 dark:via-slate-900 dark:to-purple-900/20">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10 animate-fade-up flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center animate-bounce-gentle shadow-lg shadow-purple-300/50 dark:shadow-purple-500/20">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                  My Profile
                </h1>
                <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
                  Manage your personal details and learning preferences
                </p>
              </div>
            </div>
            <HelpButton tutorial={dashboardTutorials.profile} />
          </div>

          {/* User Info Card */}
          {user && (
            <div
              data-tutorial="account-info"
              className="rounded-3xl p-6 md:p-8 mb-8 bg-white dark:bg-dark-900 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  Account Information
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <p className="text-base text-slate-600 dark:text-slate-400 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    {user.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <p className="text-base text-slate-600 dark:text-slate-400 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    {user.email}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Student ID (Share with Parents)
                  </label>
                  <div className="flex items-center gap-3">
                    <p className="flex-1 text-base text-slate-600 dark:text-slate-400 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 font-mono break-all">
                      {profile?.userId}
                    </p>
                    <button
                      onClick={copyStudentId}
                      className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                        copiedStudentId
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                      title="Copy Student ID to clipboard"
                    >
                      {copiedStudentId ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">
                    Share this ID with your parents so they can access your
                    learning insights
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Settings Card */}
          <div
            data-tutorial="settings"
            className="rounded-3xl p-6 md:p-8 bg-white dark:bg-dark-900 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                <Settings className="w-5 h-5 text-purple-500" />
                Learning Profile
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold text-sm transition-all"
                >
                  Edit Profile
                </button>
              ) : null}
            </div>

            {isEditing ? (
              <div className="space-y-6">
                {/* Class Level */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Class Level
                    </span>
                  </label>
                  <select
                    name="classLevel"
                    value={formData.classLevel || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Class Level</option>
                    {classLevels.map(level => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Board */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Board
                    </span>
                  </label>
                  <select
                    name="board"
                    value={formData.board || ""}
                    onChange={e => {
                      handleInputChange(e);
                      if (boards.includes(e.target.value)) {
                        setShowCustomBoard(false);
                      }
                    }}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Board</option>
                    {boards.map(board => (
                      <option key={board} value={board}>
                        {board}
                      </option>
                    ))}
                  </select>

                  {/* Custom Board Display */}
                  {formData.board && !boards.includes(formData.board) && (
                    <div className="mt-3 p-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30">
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                        Custom Board:{" "}
                        <span className="font-bold">{formData.board}</span>
                        <button
                          type="button"
                          onClick={() => setShowCustomBoard(true)}
                          className="ml-2 text-xs underline hover:no-underline"
                        >
                          Change
                        </button>
                      </p>
                    </div>
                  )}

                  {/* Custom Board Input */}
                  {showCustomBoard && (
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        value={customBoard}
                        onChange={e => setCustomBoard(e.target.value)}
                        placeholder="Enter custom board name"
                        className="input-field flex-1"
                        onKeyPress={e => e.key === "Enter" && addCustomBoard()}
                      />
                      <button
                        type="button"
                        onClick={addCustomBoard}
                        className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-all"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomBoard(false);
                          setCustomBoard("");
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-dark-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {!showCustomBoard && (
                    <button
                      type="button"
                      onClick={() => setShowCustomBoard(true)}
                      className="mt-3 text-xs text-green-600 dark:text-green-400 hover:underline font-semibold"
                    >
                      + Add custom board if not in list
                    </button>
                  )}
                </div>

                {/* Subjects */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Subjects (Select Multiple)
                    </span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                    {subjects.map(subject => (
                      <label
                        key={subject}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                      >
                        <input
                          type="checkbox"
                          name="subjects"
                          value={subject}
                          checked={
                            formData.subjects?.includes(subject) || false
                          }
                          onChange={handleInputChange}
                          className="w-4 h-4 cursor-pointer accent-purple-500"
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {subject}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Custom Subjects Display */}
                  {formData.subjects?.filter(s => !subjects.includes(s))
                    .length ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                      {formData.subjects
                        .filter(s => !subjects.includes(s))
                        .map(subject => (
                          <label
                            key={subject}
                            className="flex items-center gap-3 p-3 rounded-xl border border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800/30 transition-all"
                          >
                            <input
                              type="checkbox"
                              name="subjects"
                              value={subject}
                              checked={true}
                              onChange={handleInputChange}
                              className="w-4 h-4 cursor-pointer accent-green-500"
                            />
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                              {subject}
                            </span>
                          </label>
                        ))}
                    </div>
                  ) : null}

                  {/* Custom Subject Input */}
                  {showCustomSubject && (
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={customSubject}
                        onChange={e => setCustomSubject(e.target.value)}
                        placeholder="Enter custom subject name"
                        className="input-field flex-1"
                        onKeyPress={e =>
                          e.key === "Enter" && addCustomSubject()
                        }
                      />
                      <button
                        type="button"
                        onClick={addCustomSubject}
                        className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-all"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomSubject(false);
                          setCustomSubject("");
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-dark-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {!showCustomSubject && (
                    <button
                      type="button"
                      onClick={() => setShowCustomSubject(true)}
                      className="text-xs text-green-600 dark:text-green-400 hover:underline font-semibold"
                    >
                      + Add custom subject if not in list
                    </button>
                  )}
                </div>

                {/* Learning Style */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Learning Style
                    </span>
                  </label>
                  <select
                    name="learningStyle"
                    value={formData.learningStyle || ""}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Learning Style</option>
                    {learningStyles.map(style => (
                      <option key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Daily Study Goal */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
                    Daily Study Goal (minutes)
                  </label>
                  <input
                    type="number"
                    name="studyGoalMinutes"
                    value={formData.studyGoalMinutes || 0}
                    onChange={handleInputChange}
                    min="0"
                    step="15"
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Preferred Language */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
                    Preferred Language for AI Responses
                  </label>
                  <select
                    name="preferredLanguage"
                    value={formData.preferredLanguage || "english"}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="english">🇬🇧 English</option>
                    <option value="hinglish">🇮🇳 Hinglish</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-base transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Class Level
                  </label>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    {profile?.classLevel || "Not set"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Board
                  </label>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    {profile?.board || "Not set"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Subjects
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profile?.subjects && profile.subjects.length > 0 ? (
                      profile.subjects.map((subject, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-3 py-1 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30"
                        >
                          {subject}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400">
                        Not set
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Learning Style
                  </label>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    {profile?.learningStyle
                      ? profile.learningStyle.charAt(0).toUpperCase() +
                        profile.learningStyle.slice(1)
                      : "Not set"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Daily Study Goal
                  </label>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    {profile?.studyGoalMinutes || 0} minutes
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Preferred Language
                  </label>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    {profile?.preferredLanguage === "hinglish"
                      ? "🇮🇳 Hinglish"
                      : "🇬🇧 English"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Current Streak
                  </label>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    {profile?.streakDays || 0} days 🔥
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Total Study Time
                  </label>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    {Math.floor((profile?.totalStudyMinutes || 0) / 60)} hours
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Stats Footer */}
          {!isEditing && (
            <div className="rounded-3xl p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-200 dark:border-blue-500/30 mt-8 text-center">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                ✨ Keep up your learning streak and watch your progress grow! 🚀
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
