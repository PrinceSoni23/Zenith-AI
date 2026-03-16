/**
 * Dashboard API Hooks with React Query
 * Provides intelligent caching and background refetching
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardApi, agentApi, streakApi, leaderboardApi } from "@/lib/api";

// ────────────────────────────────────────────────────────────────────────────
// DASHBOARD QUERIES
// ────────────────────────────────────────────────────────────────────────────

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await dashboardApi.getDashboard();
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Paginated dashboard hook for loading more data
 */
export const useDashboardPaginated = (page: number = 1) => {
  return useQuery({
    queryKey: ["dashboard", "paginated", page],
    queryFn: async () => {
      const response = await dashboardApi.getDashboard();
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ────────────────────────────────────────────────────────────────────────────
// AGENT / AI QUERIES
// ────────────────────────────────────────────────────────────────────────────

/**
 * Daily flow (mentor + study planner)
 * Cached for 30 minutes by backend
 * Only fetches if not in cache or stale
 */
export const useDailyFlow = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["agents", "daily-flow"],
    queryFn: async () => {
      const response = await agentApi.getDailyFlow();
      return response.data.data;
    },
    staleTime: 20 * 60 * 1000, // 20 minutes (backend cache is 30min)
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled, // Can defer this query
    retry: 1, // Only retry once (AI calls are expensive)
  });
};

/**
 * Force refresh daily flow
 */
export const useRefreshDailyFlow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await agentApi.dispatch("mentor", {});
      return response.data.data;
    },
    onSuccess: data => {
      // Update cache with fresh data
      queryClient.setQueryData(["agents", "daily-flow"], data);
    },
  });
};

// ────────────────────────────────────────────────────────────────────────────
// STREAK QUERIES
// ────────────────────────────────────────────────────────────────────────────

export const useStreak = () => {
  return useQuery({
    queryKey: ["streak"],
    queryFn: async () => {
      const response = await streakApi.getStreak();
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 15 * 60 * 1000,
  });
};

export const useMissions = () => {
  return useQuery({
    queryKey: ["missions"],
    queryFn: async () => {
      const response = await streakApi.getMissions();
      return response.data.data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 20 * 60 * 1000,
  });
};

/**
 * Complete task mutation with optimistic update
 */
export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => streakApi.completeTask(taskId),
    onMutate: async taskId => {
      // Optimistically update missions
      await queryClient.cancelQueries({ queryKey: ["missions"] });
      const previousMissions = queryClient.getQueryData(["missions"]);

      if (previousMissions) {
        queryClient.setQueryData(["missions"], (old: any) => ({
          ...old,
          missions: old.missions?.map((m: any) =>
            m._id === taskId ? { ...m, isCompleted: true } : m,
          ),
        }));
      }

      return { previousMissions };
    },
    onError: (err, taskId, context: any) => {
      // Revert on error
      if (context?.previousMissions) {
        queryClient.setQueryData(["missions"], context.previousMissions);
      }
    },
    onSuccess: () => {
      // Refetch missions and streak after success
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["streak"] });
    },
  });
};

// ────────────────────────────────────────────────────────────────────────────
// LEADERBOARD QUERIES
// ────────────────────────────────────────────────────────────────────────────

/**
 * Leaderboard with longer cache (users rarely change position drastically)
 */
export const useLeaderboard = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await leaderboardApi.getLeaderboard();
      return response.data.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled,
    retry: 1,
  });
};

// ────────────────────────────────────────────────────────────────────────────
// BATCH QUERIES - Load multiple items in parallel
// ────────────────────────────────────────────────────────────────────────────

/**
 * Load all dashboard data in parallel
 * Useful for initial load
 */
export const useDashboardData = (options?: { deferAI?: boolean }) => {
  const dashboardQuery = useDashboard();
  const streakQuery = useStreak();
  const missionsQuery = useMissions();
  const dailyFlowQuery = useDailyFlow(!options?.deferAI);

  return {
    dashboard: dashboardQuery,
    streak: streakQuery,
    missions: missionsQuery,
    dailyFlow: dailyFlowQuery,
    isLoading:
      dashboardQuery.isLoading ||
      streakQuery.isLoading ||
      missionsQuery.isLoading,
    isError:
      dashboardQuery.isError || streakQuery.isError || missionsQuery.isError,
  };
};
