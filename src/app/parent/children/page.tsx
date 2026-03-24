"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { parentApi } from "@/lib/api";
import toast from "react-hot-toast";
import { Users, Plus, Trash2, Check, X, Copy, CheckCircle } from "lucide-react";

interface LinkedChild {
  id: string;
  name: string;
  classLevel: string;
}

const STORAGE_KEY = "parent_linked_children";

// Mock student data
const MOCK_STUDENTS: { [key: string]: LinkedChild } = {
  STU001: { id: "STU001", name: "Sarah Johnson", classLevel: "Class 6" },
  STU002: { id: "STU002", name: "John Smith", classLevel: "Class 8" },
  STU003: { id: "STU003", name: "Emma Davis", classLevel: "Class 7" },
  STU004: { id: "STU004", name: "Michael Brown", classLevel: "Class 9" },
};

export default function ChildrenPage() {
  const { user } = useAuthStore();
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState("");
  const [linking, setLinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Use parent ID in storage key to isolate data per parent account
  const parentStorageKey = user?.id ? `${STORAGE_KEY}:${user.id}` : STORAGE_KEY;

  useEffect(() => {
    // Clean up old shared storage key (for backward compatibility)
    if (user?.id) {
      const oldSharedData = localStorage.getItem(STORAGE_KEY);
      if (oldSharedData && !localStorage.getItem(parentStorageKey)) {
        // If old shared data exists and new parent-specific data doesn't, keep the old data
        // Otherwise, old data is ignored (parent has new data)
      }
      // Always remove the old shared key to avoid confusion
      if (STORAGE_KEY !== parentStorageKey) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    loadChildren();
  }, [parentStorageKey]);

  const loadChildren = () => {
    try {
      const stored = localStorage.getItem(parentStorageKey);
      if (stored) {
        setChildren(JSON.parse(stored));
      }
    } catch (error) {
      // Silently handle loading errors
    } finally {
      setLoading(false);
    }
  };

  const handleLinkChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      toast.error("Please enter a Student ID");
      return;
    }

    setLinking(true);
    try {
      const id = studentId.trim();

      // Call backend to create the parent-student link
      const response = await parentApi.linkStudent({
        studentUserId: id,
        relationship: "guardian", // Use valid enum value
      });

      // Fetch real student data from insights endpoint
      let studentData: LinkedChild = {
        id: id,
        name: "Loading...",
        classLevel: "Unknown",
      };

      try {
        const insightsResponse = await parentApi.getInsights(id);

        if (insightsResponse.data?.data?.profile) {
          const profile = insightsResponse.data.data.profile;

          studentData = {
            id: id,
            name: profile.name || "Unknown",
            classLevel: profile.classLevel || "Unknown",
          };
        }
      } catch (insightsError: any) {
        // Silently handle errors - use fallback data
        const mockData = MOCK_STUDENTS[id];

        if (mockData) {
          studentData = mockData;
        }
      }

      // Check if already linked
      const alreadyLinked = children.some(c => c.id === studentData.id);
      if (alreadyLinked) {
        toast.error("This child is already linked");
        setLinking(false);
        return;
      }

      const updatedChildren = [...children, studentData];
      setChildren(updatedChildren);
      localStorage.setItem(parentStorageKey, JSON.stringify(updatedChildren));
      setStudentId("");
      toast.success(`Child linked! Redirecting to dashboard...`);

      // Redirect to parent dashboard to see the child's data load
      setTimeout(() => {
        window.location.href = "/parent";
      }, 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to link child";
      toast.error(errorMessage);
    } finally {
      setLinking(false);
    }
  };

  const handleRemoveChild = async (id: string) => {
    if (confirm("Are you sure you want to unlink this child?")) {
      try {
        // Call backend to remove the parent-student link
        await parentApi.unlinkStudent(id);

        // Remove from local state and localStorage
        const updatedChildren = children.filter(c => c.id !== id);
        setChildren(updatedChildren);
        localStorage.setItem(parentStorageKey, JSON.stringify(updatedChildren));
        toast.success("Child unlinked successfully");
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to unlink child";
        toast.error(errorMessage);
      }
    }
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Student ID copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 mb-2">
          My Children
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Link and manage your children's learning profiles
        </p>
      </div>

      {/* Link Child Form */}
      <div className="rounded-3xl p-8 bg-white dark:bg-dark-900 border-2 border-slate-200 dark:border-slate-700 shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Plus className="w-6 h-6 text-pink-500" />
          Link a New Child
        </h2>

        <form onSubmit={handleLinkChild} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
              Child's Student ID
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                placeholder="Paste your child's Student ID here..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={linking}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 transition-all"
              >
                {linking ? "Linking..." : "Link"}
              </button>
            </div>
            <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">
              Ask your child to share their Student ID from their Profile page →
              Account Information → Student ID (Share with Parents)
            </p>
          </div>
        </form>
      </div>

      {/* Children List */}
      <div className="rounded-3xl p-8 bg-white dark:bg-dark-900 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-500" />
          Linked Children ({children.length})
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">Loading...</p>
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 mb-2">
              No children linked yet
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Link your child's profile to monitor their learning
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {children.map(child => {
              return (
                <div
                  key={child.id}
                  className="rounded-2xl p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {child.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {child.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {child.classLevel}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          ID:{" "}
                        </p>
                        <code className="text-xs font-mono bg-slate-200 dark:bg-slate-900 px-3 py-1 rounded text-slate-800 dark:text-slate-200">
                          {child.id}
                        </code>
                        <button
                          onClick={() => copyToClipboard(child.id)}
                          className={`p-2 rounded-lg transition-all ${
                            copiedId === child.id
                              ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                              : "bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-800"
                          }`}
                        >
                          {copiedId === child.id ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`/parent/analytics?childId=${child.id}`}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all"
                      >
                        View Analytics
                      </a>
                      <button
                        onClick={() => handleRemoveChild(child.id)}
                        className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all font-semibold"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
