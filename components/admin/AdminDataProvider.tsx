"use client";

import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";

export interface AdminStats {
  totalInquiries: number;
  unreadInquiries: number;
  totalProjects: number;
  activeProjects: number;
  isDbConnected: boolean;
  supabaseHost?: string;
  storageBucket?: string;
}

interface AdminDataContextType {
  stats: AdminStats;
  inquiries: any[];
  projects: any[];
  loading: boolean;
  isRefreshing: boolean;
  setStats: React.Dispatch<React.SetStateAction<AdminStats>>;
  setInquiries: React.Dispatch<React.SetStateAction<any[]>>;
  setProjects: React.Dispatch<React.SetStateAction<any[]>>;
  refetchStats: (silent?: boolean) => Promise<void>;
  refetchInquiries: (silent?: boolean) => Promise<void>;
  refetchProjects: (silent?: boolean) => Promise<void>;
  refetchAll: (silent?: boolean) => Promise<void>;
}

const defaultStats: AdminStats = {
  totalInquiries: 0,
  unreadInquiries: 0,
  totalProjects: 1,
  activeProjects: 1,
  isDbConnected: true,
  supabaseHost: "aws-0-ap-southeast-1.pooler.supabase.com",
  storageBucket: "project-assets",
};

const AdminDataContext = createContext<AdminDataContextType | null>(null);

export function useAdminData(): AdminDataContextType {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<AdminStats>(defaultStats);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ETag cache tracking refs to eliminate database queries on conditional requests
  const statsEtagRef = useRef<string | null>(null);
  const inquiriesEtagRef = useRef<string | null>(null);
  const projectsEtagRef = useRef<string | null>(null);
  const hasLoadedInitial = useRef(false);

  const fetchStats = async (silent = false) => {
    try {
      const headers: Record<string, string> = {};
      if (silent && statsEtagRef.current) {
        headers["If-None-Match"] = statsEtagRef.current;
      }
      const res = await fetch("/api/admin/stats", { headers });
      if (res.status === 304) return;
      if (res.ok) {
        const etag = res.headers.get("etag");
        if (etag) statsEtagRef.current = etag;
        const data = await res.json();
        setStats(data.stats || data);
      }
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    }
  };

  const fetchInquiries = async (silent = false) => {
    try {
      const headers: Record<string, string> = {};
      if (silent && inquiriesEtagRef.current) {
        headers["If-None-Match"] = inquiriesEtagRef.current;
      }
      const res = await fetch("/api/inquiries", { headers });
      if (res.status === 304) return;
      if (res.ok) {
        const etag = res.headers.get("etag");
        if (etag) inquiriesEtagRef.current = etag;
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    }
  };

  const fetchProjects = async (silent = false) => {
    try {
      const headers: Record<string, string> = {};
      if (silent && projectsEtagRef.current) {
        headers["If-None-Match"] = projectsEtagRef.current;
      }
      const res = await fetch("/api/projects?all=true", { headers });
      if (res.status === 304) return;
      if (res.ok) {
        const etag = res.headers.get("etag");
        if (etag) projectsEtagRef.current = etag;
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const refetchAll = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    await Promise.all([
      fetchStats(silent),
      fetchInquiries(silent),
      fetchProjects(silent),
    ]);
    if (!silent) setIsRefreshing(false);
  };

  // Initial load runs ONCE across the entire admin session
  useEffect(() => {
    if (hasLoadedInitial.current) return;
    hasLoadedInitial.current = true;

    setLoading(true);
    Promise.all([
      fetchStats(false),
      fetchInquiries(false),
      fetchProjects(false),
    ]).finally(() => {
      setLoading(false);
    });

    // Persistent Supabase Realtime channel across sidebar navigation
    let channel: any = null;
    if (supabase) {
      channel = supabase
        .channel("admin-global-realtime-stream")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "inquiries" },
          (payload: any) => {
            if (payload.eventType === "INSERT" && payload.new) {
              setInquiries((prev) => [payload.new, ...prev.filter((i) => i.id !== payload.new.id)]);
              setStats((prev) => ({
                ...prev,
                totalInquiries: (prev.totalInquiries || 0) + 1,
                unreadInquiries: (prev.unreadInquiries || 0) + 1,
              }));
            } else if (payload.eventType === "UPDATE" && payload.new) {
              setInquiries((prev) =>
                prev.map((i) => (i.id === payload.new.id ? { ...i, ...payload.new } : i))
              );
            } else if (payload.eventType === "DELETE" && payload.old) {
              setInquiries((prev) => prev.filter((i) => i.id !== payload.old.id));
              setStats((prev) => ({
                ...prev,
                totalInquiries: Math.max(0, (prev.totalInquiries || 1) - 1),
              }));
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "projects" },
          () => {
            fetchProjects(true);
            fetchStats(true);
          }
        )
        .subscribe();
    }

    // Silent background poll with 304 ETag checking every 8 seconds
    // Returns 304 Not Modified with 0 database queries unless new data exists
    const interval = setInterval(() => {
      refetchAll(true);
    }, 8000);

    return () => {
      clearInterval(interval);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        stats,
        inquiries,
        projects,
        loading,
        isRefreshing,
        setStats,
        setInquiries,
        setProjects,
        refetchStats: fetchStats,
        refetchInquiries: fetchInquiries,
        refetchProjects: fetchProjects,
        refetchAll,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}
