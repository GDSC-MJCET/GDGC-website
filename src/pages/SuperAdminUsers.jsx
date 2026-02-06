import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

const SuperAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [confirmState, setConfirmState] = useState({
    open: false,
    user: null,
    role: "admin", // "admin" | "superadmin"
    make: false,
    loading: false,
  });

  const nav = useNavigate();
  const auth = JSON.parse(localStorage.getItem("AuthState"));
  const server = import.meta.env.VITE_SERVER;

  useEffect(() => {
    if (!auth?.token) {
      nav("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${server}/api/v1/admin/get-all-users`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        const data = res.data;
        const list =
          data?.users ??
          data?.data ??
          (Array.isArray(data) ? data : []);

        setUsers(list);
        setCheckingAuth(false);
        setLoading(false);
      } catch {
        // If unauthorized or any error, send back to login
        nav("/login");
      }
    };

    fetchUsers();
  }, [auth?.token, nav, server]);

  if (checkingAuth) {
    return <div className="bg-black min-h-screen" />;
  }

  const openConfirm = (user, role, make) => {
    setConfirmState({
      open: true,
      user,
      role,
      make,
      loading: false,
    });
  };

  const closeConfirm = () => {
    setConfirmState({ open: false, user: null, make: false });
  };

  const handleConfirm = async () => {
    const { user, role, make } = confirmState;
    if (!user) return;

    let endpoint = "";
    if (role === "admin") {
      endpoint = make
        ? "/api/v1/admin/create-admin"
        : "/api/v1/admin/remove-admin";
    } else {
      endpoint = make
        ? "/api/v1/admin/create-super-admin"
        : "/api/v1/admin/remove-super-admin";
    }

    try {
      setConfirmState((prev) => ({ ...prev, loading: true }));
      const workDone = await axios.post(
        `${server}${endpoint}`,
        {
          id: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if(workDone.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id
              ? {
                  ...u,
                  admin:
                    role === "admin" ? make : u.admin,
                  superadmin:
                    role === "superadmin" ? make : u.superadmin,
                }
              : u
          )
        );

        if (role === "admin") {
          toast.success(
            make
              ? "User promoted to admin."
              : "User removed from admin."
          );
        } else {
          toast.success(
            make
              ? "User promoted to superadmin."
              : "User removed from superadmin."
          );
        }

      } else {
        toast.error(workDone.data.message);
      }
    } catch (err) {
      toast.error("Failed to update user role.");
      console.log(err);
    } finally {
      closeConfirm();
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center px-4 py-10">
      <Toaster />

      <div className="w-full max-w-5xl">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Users Preview
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl">
            Preview of all registered users on the platform. You can toggle their admin
            access from here.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12 text-gray-400">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="flex justify-center items-center py-12 text-gray-400">
            No users found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {users.map((user) => {
              const isAdmin = !!user.admin;
              const isSuperAdmin = !!user.superadmin;

              return (
                <div
                  key={user._id || user.id || user.email}
                  className="flex flex-col justify-between border border-white/10 rounded-xl px-4 py-3 bg-[#111111] h-full"
                >
                  <div className="space-y-1 mb-3">
                    <p className="text-white font-medium">
                      {user.name || user.fullName || "Unnamed User"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {user.email || "No email"}
                    </p>
                    <p className="text-xs text-gray-500">
                      ID: {user._id || user.id || "-"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isSuperAdmin
                        ? "SuperAdmin"
                        : isAdmin
                        ? "Admin"
                        : "User"}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex flex-col gap-2 text-xs">
                      <span
                        className={`px-2 py-1 rounded-full w-fit ${
                          isSuperAdmin
                            ? "bg-purple-500/10 text-purple-300 border border-purple-500/40"
                            : isAdmin
                            ? "bg-green-500/10 text-green-400 border border-green-500/40"
                            : "bg-gray-500/10 text-gray-400 border border-gray-500/40"
                        }`}
                      >
                        {isSuperAdmin
                          ? "SuperAdmin"
                          : isAdmin
                          ? "Admin"
                          : "User"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          Admin
                        </span>
                        <Switch
                          checked={isAdmin}
                          disabled={isSuperAdmin}
                          onCheckedChange={(value) => {
                            if (value !== isAdmin) {
                              openConfirm(user, "admin", value);
                            }
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          SuperAdmin
                        </span>
                        <Switch
                          checked={isSuperAdmin}
                          disabled={!isAdmin}
                          onCheckedChange={(value) => {
                            if (value !== isSuperAdmin) {
                              openConfirm(
                                user,
                                "superadmin",
                                value
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {confirmState.open && confirmState.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-[#111111] border border-white/15 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Change user role?
            </h2>
            <p className="text-sm text-gray-300">
              You are about to{" "}
              {confirmState.make
                ? `promote this user to ${confirmState.role}.`
                : `remove this user&apos;s ${confirmState.role} access.`}{" "}
              This action affects what they can do on the platform.
            </p>
            <p className="text-xs text-gray-500">
              User:{" "}
              {confirmState.user.email ||
                confirmState.user.name ||
                confirmState.user._id}
            </p>

            {confirmState.loading && (
              <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                <span className="inline-block w-3 h-3 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                <span>Applying changes...</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={closeConfirm}
                className="px-4 py-1.5 text-xs rounded-full border border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                disabled={confirmState.loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-1.5 text-xs rounded-full bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                disabled={confirmState.loading}
              >
                {confirmState.loading ? "Working..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminUsers;
