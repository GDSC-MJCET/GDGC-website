import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SuperAdminContacts = () => {
  const server = import.meta.env.VITE_SERVER;
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const auth = JSON.parse(localStorage.getItem("AuthState"));
  useEffect(() => {
    if (!auth?.token) {
      nav("/login");
      return;
    }
    axios.get(`${server}/api/v1/admin/contacts`, {
      headers: {
              Authorization: `Bearer ${auth.token}`,
            },
    })
    .then(res => {
      if (res.data.success) setContacts(res.data.contacts);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-foreground">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Contact Submissions</h1>
      {contacts.length === 0 ? (
        <p className="text-muted-foreground">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm text-foreground">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                <th className="px-4 py-3 text-left text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left text-muted-foreground">Subject</th>
                <th className="px-4 py-3 text-left text-muted-foreground">Message</th>
                <th className="px-4 py-3 text-left text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr
                  key={c._id}
                  style={{
                    background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                    borderTop: "1px solid rgba(255,255,255,0.05)"
                  }}
                >
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.subject}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{c.message}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SuperAdminContacts;