"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@nexion/database";
import { createClient } from "@/features/core/lib/supabase/client";
import {
  ensureProfile,
  signInWithEmail,
  signOut as authSignOut,
  signUpWithEmail,
  updateProfileTheme,
} from "@/features/auth/services/auth-service";

interface AuthContextValue {
  user: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  updateTheme: (theme: NonNullable<Profile["theme"]>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(
    async (authUser: User) => {
      const profile = await ensureProfile(supabase, authUser);
      setUser(profile);
    },
    [supabase],
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        loadProfile(authUser).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, loadProfile]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await signInWithEmail(supabase, email, password);
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) await loadProfile(authUser);
    },
    [supabase, loadProfile],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await signUpWithEmail(supabase, name, email, password);
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) await loadProfile(authUser);
      return result;
    },
    [supabase, loadProfile],
  );

  const signOut = useCallback(async () => {
    await authSignOut(supabase);
    setUser(null);
  }, [supabase]);

  const updateTheme = useCallback(
    async (theme: NonNullable<Profile["theme"]>) => {
      if (!user) return;
      await updateProfileTheme(supabase, user.id, theme);
      setUser({ ...user, theme });
    },
    [supabase, user],
  );

  const value = useMemo(
    () => ({ user, isLoading, signIn, signUp, signOut, updateTheme }),
    [user, isLoading, signIn, signUp, signOut, updateTheme],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
