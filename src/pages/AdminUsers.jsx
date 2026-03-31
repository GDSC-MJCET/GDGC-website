import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [confirmState, setConfirmState] = useState({
    open: false,
    user: null,
    make: true,
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
        nav("/login");
      }
    };

    fetchUsers();
  }, [auth?.token, nav, server]);

  if (checkingAuth) {
    return <div className="bg-black min-h-screen" />;
  }

  const superAdmins = users.filter((u) => !!u.superadmin);
  const others = users.filter((u) => !u.superadmin);

  const openConfirm = (user) => {
    setConfirmState({
      open: true,
      user,
      make: true,
      loading: false,
    });
  };

  const closeConfirm = () => {
    setConfirmState({
      open: false,
      user: null,
      make: true,
      loading: false,
    });
  };

  const handleConfirm = async () => {
    const { user } = confirmState;
    if (!user) return;

    const endpoint = "/api/v1/admin/create-admin";

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

      if (workDone.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id
              ? {
                  ...u,
                  admin: true,
                }
              : u
          )
        );

        toast.success("User promoted to admin.");
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

      <div className="w-full max-w-5xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Admin — Users Preview
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl">
            Preview of all users. You can promote users to admin. SuperAdmins
            and existing Admins cannot be modified here.
          </p>
        </div>

        {/* SuperAdmins section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            SuperAdmins
          </h2>
          {loading ? (
            <div className="flex justify-center items-center py-6 text-gray-400">
              Loading users...
            </div>
          ) : superAdmins.length === 0 ? (
            <p className="text-sm text-gray-500">
              No superadmins found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {superAdmins.map((user) => (
                <div
                  key={user._id || user.id || user.email}
                  className="flex flex-col justify-between border border-purple-500/40 rounded-xl px-4 py-3 bg-[#111111] h-full"
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
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full w-fit bg-purple-500/10 text-purple-300 border border-purple-500/40">
                    SuperAdmin
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Other users section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            Other Users
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-6 text-gray-400">
              Loading users...
            </div>
          ) : others.length === 0 ? (
            <p className="text-sm text-gray-500">
              No users found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {others.map((user) => {
                const isAdmin = !!user.admin;

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
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full w-fit ${
                          isAdmin
                            ? "bg-green-500/10 text-green-400 border border-green-500/40"
                            : "bg-gray-500/10 text-gray-400 border border-gray-500/40"
                        }`}
                      >
                        {isAdmin ? "Admin" : "User"}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          Admin
                        </span>
                        <Switch
                          checked={isAdmin}
                          disabled={isAdmin}
                          onCheckedChange={(value) => {
                            if (!isAdmin && value) {
                              openConfirm(user);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {confirmState.open && confirmState.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-[#111111] border border-white/15 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Promote to admin?
            </h2>
            <p className="text-sm text-gray-300">
              You are about to promote this user to <span className="font-semibold">admin</span>.
              This will give them additional access on the platform.
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
                className="px-4 py-1.5 text-xs rounded-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
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

export default AdminUsers;

