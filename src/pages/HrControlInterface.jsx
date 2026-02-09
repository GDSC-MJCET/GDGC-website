// src/pages/HrControlInterface.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSyncAlt, FaPlus, FaTimes, FaCheck, FaQuestionCircle } from "react-icons/fa";
// import { AuthContext } from "../context/AuthContext"; // enable if you need auth

const SERVER = "http://localhost:3009/"; // <-- replace with your server base

export default function HrControlInterface() {
  const nav = useNavigate();
  const location = useLocation();
  const { left: leftTeamName, right: rightTeamName, topic } = location.state || {};
  // if user reached this page without state, redirect (safe guard)
  useEffect(() => {
    if (!leftTeamName || !rightTeamName) {
      nav("/", { replace: true });
    }
  }, [leftTeamName, rightTeamName, nav]);

  const [leftTeam, setLeftTeam] = useState(null); // expected shape: { clubName, logoUrl, speakers: [...] }
  const [rightTeam, setRightTeam] = useState(null);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [incLoading, setIncLoading] = useState({ left: false, right: false });
  const [refreshing, setRefreshing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [finalSubmitting, setFinalSubmitting] = useState(false);

  // fetch team data (initial + refresh). Template POST call — adapt endpoint & response shape.
  const fetchTeams = async () => {
    if (!leftTeamName || !rightTeamName) return;
    setLoading(true);
    try {
      const res = await axios.get(SERVER + "api/v1/techdebate/get-score", {
        leftTeam: leftTeamName,
        rightTeam: rightTeamName,
      });
      
      const data = res.data;
      console.log("fetchTeams response:", data);
      if (data.success) {
        let leftTeamStr = {
          clubName: data.sendingData.leftTeam || leftTeamName,
          logoUrl: data.sendingData.leftLogo || null,
          speakers: data.sendingData.speakersLeft|| [],
        }
        let rightTeamStr = {
          clubName: data.sendingData.rightTeam || rightTeamName,
          logoUrl: data.sendingData.rightLogo || null,
          speakers: data.sendingData.speakersRight|| [],
        }
        setLeftTeam(leftTeamStr);
        setRightTeam(rightTeamStr);
        setLeftScore(typeof data.sendingData.leftScore === "number" ? data.sendingData.leftScore : 0);
        setRightScore(typeof data.sendingData.rightScore === "number" ? data.sendingData.rightScore : 0);
      } else {
        console.warn("fetchTeams: backend responded with success=false", data);
      }
    } catch (err) {
      console.error("Error fetching teams:", err);
      // optionally show UI error toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftTeamName, rightTeamName]);

  // refresh handler (minimalistic)
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTeams();
    } finally {
      setRefreshing(false);
    }
  };

  // increment handler: optimistic update then POST to backend to persist
  const incrementScore = async (side) => {
    if (side !== "left" && side !== "right") return;
    setIncLoading((s) => ({ ...s, [side]: true }));
    // optimistic update
    if (side === "left") setLeftScore((s) => s + 1);
    else setRightScore((s) => s + 1);

    try {
      // Example endpoint: /increment-score { leftTeam, rightTeam, side }
      const res = await axios.post(SERVER + "api/v1/techdebate/increment-score", {
        leftTeam: leftTeamName,
        rightTeam: rightTeamName,
        side, // "left" or "right"
      });

      if (!res.data.success) {
        throw new Error(res.data.error || "Backend reported failure");
      }

      // if backend returns authoritative scores, reconcile:
      if (typeof res.data.leftScore === "number") setLeftScore(res.data.leftScore);
      if (typeof res.data.rightScore === "number") setRightScore(res.data.rightScore);
    } catch (err) {
      console.error("Increment error:", err);
      // revert optimistic update on failure
      if (side === "left") setLeftScore((s) => Math.max(0, s - 1));
      else setRightScore((s) => Math.max(0, s - 1));
      alert("Failed to increment score. Try refreshing.");
    } finally {
      setIncLoading((s) => ({ ...s, [side]: false }));
    }
  };

 
  const handleConfirmSubmit = async () => {
    setFinalSubmitting(true);
    try {
      const res = await axios.post(SERVER + "api/v1/techdebate/end-debate", {
        leftTeam: leftTeamName,
        rightTeam: rightTeamName
      });

      if (res.data.success) {
        nav("/", { replace: true });
      } 
    } catch (err) {
      console.error("Final submit error:", err);
      alert("Final submit failed: " + (err.message || "unknown"));
    } finally {
      setFinalSubmitting(false);
      setShowConfirm(false);
    }
  };

  // small presentational helpers
  const TeamCard = ({ team, side }) => {
    return (
      <div className="w-[40%] min-h-[320px] flex flex-col items-center rounded-lg p-6 shadow-md">
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {team?.logoUrl ? (
              <img src={team.logoUrl} alt={team.clubName} className="object-cover w-full h-full" />
            ) : (
              <FaQuestionCircle size={32} />
            )}
          </div>
          <h2 className="mt-3 text-lg text-white font-semibold">{team?.clubName || (side === "left" ? leftTeamName : rightTeamName)}</h2>
          <p className="text-sm text-white">{team?.description || ""}</p>
        </div>

        <div className="mt-4 w-full">
          <h3 className="text-sm text-white font-medium mb-2">Speakers</h3>
          <ul className="space-y-1 text-white max-h-40 overflow-auto">
            {
              console.log("Rendering speakers for", side, team) ||
              leftTeam && side === "left" ? leftTeam.speakers.map((speaker, index) => (
                <li key={index} className="text-sm text-white">
                  {speaker.name}
                </li>
              )) : rightTeam && side === "right" ? rightTeam.speakers.map((speaker, index) => (
                <li key={index} className="text-sm text-white">
                  {speaker.name}
                </li>
              )) : <li className="text-sm text-gray-500">No speakers data</li>
            }
          </ul>
        </div>

        <div className="mt-auto w-full flex items-center justify-between">
          <div className="text-xl font-bold">{side === "left" ? leftScore : rightScore}</div>

          <button
            onClick={() => incrementScore(side)}
            disabled={incLoading[side]}
            className={`px-3 py-2 rounded-md text-white flex items-center gap-2 ${
              incLoading[side] ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            <FaPlus />
            Add
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="min-h-screen p-6">
      {/* Header */}
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">HR — Debate Control</h1>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">{topic ? `Topic: ${topic}` : "No topic provided"}</div>

          <button
            onClick={handleRefresh}
            title="Refresh teams"
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Refresh"
          >
            <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Final Submit
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto flex items-center justify-between gap-6">
        {/* Left */}
        <TeamCard team={leftTeam} side="left" />

        {/* Center V/S */}
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold">V/S</div>
        </div>

        {/* Right */}
        <TeamCard team={rightTeam} side="right" />
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowConfirm(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-lg p-6 w-[90%] max-w-lg shadow-xl">
            <button
              className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setShowConfirm(false)}
              aria-label="close"
            >
              <FaTimes />
            </button>

            <h2 className="text-lg font-semibold mb-4">Confirm final submission</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{leftTeam?.clubName || leftTeamName}</div>
                <div className="font-bold">{leftScore}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="font-medium">{rightTeam?.clubName || rightTeamName}</div>
                <div className="font-bold">{rightScore}</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md border"
                disabled={finalSubmitting}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 rounded-md bg-green-600 text-white flex items-center gap-2"
                disabled={finalSubmitting}
              >
                {finalSubmitting ? "Submitting..." : <><FaCheck /> Confirm Submit</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
