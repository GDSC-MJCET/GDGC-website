import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaCaretUp, FaCaretDown, FaQuestion, FaSyncAlt, FaPlus, FaTimes, FaCheck } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import {Toaster,toast} from "react-hot-toast"

export default function HrInterface() {
  const [selectedLeft, setSelectedLeft] = useState("");
  const [selectedRight, setSelectedRight] = useState("");
  const [topic, setTopic] = useState("");
  const [showMoreLeft, setShowMoreLeft] = useState(false);
  const [showMoreRight, setShowMoreRight] = useState(false);
  const [viewMode, setViewMode] = useState("selection"); // "selection" or "control"
  
  // Control interface states
  const [leftTeam, setLeftTeam] = useState(null);
  const [rightTeam, setRightTeam] = useState(null);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [incLoading, setIncLoading] = useState({ left: false, right: false });
  const [refreshing, setRefreshing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [finalSubmitting, setFinalSubmitting] = useState(false);
  const [stage, setStage] = useState("");
  const [checkingAuth,setCheckingAuth] = useState(false)
  const [loadMatch,setLoadMatch] = useState(false)
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const stageOptions = ["League", "SemiFinal", "Final"];
  const nav = useNavigate()

  const auth = JSON.parse(localStorage.getItem("AuthState"))

  // Auth code (commented for testing, should be enabled in production)
  useEffect(() => {
    if (!AuthContext) {
      nav("/login")
    }

    axios
      .get(
        import.meta.env.VITE_SERVER||"http://localhost:3009" + "/api/v1/admin/verify-admin",
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      )
      .then((data) => {
        if(data.data.success){
          setCheckingAuth(true)
        }
        if (!data.data.success) {
          nav("/login")
        }
      })
      .catch(() => {
        nav("/login")
      })
  }, [auth?.token])
 if(!checkingAuth){
  return <div className="bg-black"></div>
 }
  const server = import.meta.env.VITE_SERVER;
  const [radios, setRadios] = useState([]);

  useEffect(() => {
    axios.get(server + "api/v1/techdebate/get-clubs").then((data) => {
      setRadios(data.data.clubs);
    });
  }, []);

  const handleTopicChange = (e) => {
    const val = e.target.value;
    // enforce 200 char limit 
    if (val.length <= 200) setTopic(val);
  };

  // fetch team data for control interface
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await axios.get(server + "api/v1/techdebate/get-score");
      
      const data = res.data;
      console.log("fetchTeams response:", data);
      if (data.success) {
        setLoadMatch(true)
        let leftTeamStr = {
          clubName: data.sendingData.leftTeam || selectedLeft,
          logoUrl: data.sendingData.leftLogo || null,
          speakers: data.sendingData.speakersLeft|| [],
        }
        let rightTeamStr = {
          clubName: data.sendingData.rightTeam || selectedRight,
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
    } finally {
      setLoading(false);
    }
  };

  // refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTeams();
    } finally {
      setRefreshing(false);
    }
  };

  // increment score handler
  const incrementScore = async (side) => {
    if (side !== "left" && side !== "right") return;
    setIncLoading((s) => ({ ...s, [side]: true }));
    // optimistic update
    if (side === "left") setLeftScore((s) => s + 1);
    else setRightScore((s) => s + 1);

    try {
      const res = await axios.post(server + "api/v1/techdebate/increment-score", {
        leftTeam: selectedLeft,
        rightTeam: selectedRight,
        side,
      });

      if (!res.data.success) {
        throw new Error(res.data.error || res.data.message || "Backend reported failure");
      }

      const updated = res.data.updatedDebate;
      if (updated) {
        if (typeof updated.leftScore === "number") setLeftScore(updated.leftScore);
        if (typeof updated.rightScore === "number") setRightScore(updated.rightScore);
      }
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
      const res = await axios.post(server + "api/v1/techdebate/end-debate", {
        leftTeam: selectedLeft,
        rightTeam: selectedRight
      });
      console.log(res.data.message)
      if (res.data.message === "success") {
        toast.success("Match finished successfully")
        // Reset to selection view
        setLeftTeam(null);
        setRightTeam(null);
        setSelectedLeft("");
        setSelectedRight("");
        setTopic("");
        setLeftScore(0);
        setRightScore(0);
        setShowConfirm(false);
        setViewMode("selection");
      } 
    } catch (err) {
      console.error("Final submit error:", err);
      alert("Final submit failed: " + (err.message || "unknown"));
    } finally {
      setFinalSubmitting(false);
      setShowConfirm(false);
    }
  };

  const handleStart = () => {
    const trimmedTopic = topic.trim();
    if (!selectedLeft || !selectedRight || trimmedTopic.length === 0) {
      alert("Please choose both teams and enter a topic before starting.");
      return;
    }
    axios.post(server + "api/v1/techdebate/start-round", {
      leftTeam: selectedLeft,
      rightTeam: selectedRight,
      Topic: trimmedTopic,
      status:stage
    }).then((data) => {  
      console.log(data)    
      if (data.data.Success) {
        // Reset scores for the new match
        setLeftScore(0);
        setRightScore(0);
        setLeftTeam(null);
        setRightTeam(null);
        // Switch to control view and fetch team data
        setViewMode("control");
        // Small delay to ensure backend has created the round before fetching
        setTimeout(() => fetchTeams(), 500);
      }
    }).catch((err) => {
      const errorMsg = err.response?.data?.error || err.message;
      // If debate already exists, just go to the control view
      
        alert("Error starting debate: " + errorMsg);
      
    })
  };

  const startDisabled = !selectedLeft || !selectedRight || topic.trim().length === 0|| !stage;

  // Control interface - Team Card component
  const TeamCard = ({ team, side }) => {
    return (
      <div className="w-full lg:w-[40%] min-h-[320px] flex flex-col items-center rounded-lg p-6 shadow-md border border-white/10 bg-[#111111]">
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {team?.logoUrl ? (
              <img src={team.logoUrl} alt={team.clubName} className="object-cover w-full h-full" />
            ) : (
              <FaQuestionCircle size={32} className="text-gray-400" />
            )}
          </div>
          <h2 className="mt-3 text-lg text-white font-semibold">{team?.clubName || (side === "left" ? selectedLeft : selectedRight)}</h2>
          <p className="text-sm text-gray-400">{team?.description || ""}</p>
        </div>

        <div className="mt-4 w-full">
          <h3 className="text-sm text-white font-medium mb-2">Speakers</h3>
          <ul className="space-y-1 text-white max-h-40 overflow-auto">
            {side === "left" && leftTeam ? leftTeam.speakers.map((speaker, index) => (
              <li key={index} className="text-sm text-white">
                {speaker.name}
              </li>
            )) : side === "right" && rightTeam ? rightTeam.speakers.map((speaker, index) => (
              <li key={index} className="text-sm text-white">
                {speaker.name}
              </li>
            )) : <li className="text-sm text-gray-500">No speakers data</li>}
          </ul>
        </div>

        <div className="mt-auto w-full flex items-center justify-between pt-4">
          <div className="text-3xl font-bold text-white">{side === "left" ? leftScore : rightScore}</div>

          <button
            onClick={() => incrementScore(side)}
            disabled={incLoading[side]}
            className={`px-4 py-2 rounded-md text-white flex items-center gap-2 ${
              incLoading[side] ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            <FaPlus />
            Add Point
          </button>
        </div>
      </div>
    );
  };

  // Render selection view
  if (viewMode === "selection") {
    return (
      <>
      <Toaster />
    <section className="min-h-screen overflow-x-hidden bg-[#0b0b0c] relative noto-sans-mono">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#ffffff,transparent)]" />
      </div>

      {/* Header */}
      <div className="relative pt-8 pb-4 text-center">
        <h1 className="text-3xl md:text-5xl text-white noto-sans-mono">
          SELECT TEAMS
        </h1>
        <div className="h-1 w-32 mx-auto mt-3 bg-white/20" />
      </div>

      <div className="relative flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-12 px-4 sm:px-6 py-8 max-w-6xl mx-auto">
        {/* LEFT TEAM CARD */}
        <div className="w-full max-w-xs lg:max-w-xs">
          <div className="relative">
            <div className="relative bg-[#171717] rounded-xl p-1 border border-white/8 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
              <div className="bg-[#1f1f1f] rounded-xl p-4">
                {/* Logo Circle */}
                <div className="relative mx-auto w-40 h-40 mb-4">
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-xl">
                    {selectedLeft ? (
                      <img
                        src={radios.find((item) => item.clubName === selectedLeft)?.clubImageUrl || ''}
                        alt={selectedLeft}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0f0f10]">
                        <FaQuestionCircle className="text-5xl text-white/10" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Name */}
                <p className="text-sm text-center text-white/50 mb-1">For the Motion</p>
                <h1 className="text-xl font-bold text-center text-white mb-3 tracking-wide uppercase">
                  {selectedLeft || "—"}
                </h1>

                {/* Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowMoreLeft((prev) => !prev)}
                    className="w-full bg-transparent border border-white/20 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-between hover:border-white/40"
                  >
                    <span className="text-sm">SELECT TEAM</span>
                    {showMoreLeft ? <FaCaretUp className="text-lg" /> : <FaCaretDown className="text-lg" />}
                  </button>

                  {showMoreLeft && (
                    <div className="absolute z-[100] w-full mt-2 bg-[#1f1f1f] border border-white/10 rounded-lg overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
                      {radios.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => {
                            setSelectedLeft(item.clubName);
                            setShowMoreLeft(false);
                          }}
                          className={`px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 text-sm ${
                            item.clubName === selectedLeft
                              ? "bg-white/10 text-white"
                              : "text-white/80 hover:bg-white/5"
                          }`}
                        >
                          <img
                            src={item.clubImageUrl}
                            alt={item.clubName}
                            className="w-8 h-8 rounded-full object-cover border border-white/20"
                          />
                          <span className="font-semibold">{item.clubName}</span>
                          {item.clubName === selectedLeft && <span className="ml-auto text-lg">●</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VS DIVIDER */}
        <div className="flex flex-col items-center justify-center lg:mt-12">
          <div className="text-5xl md:text-6xl font-black text-white/90 tracking-wider">
            VS
          </div>
          <div className="mt-3 h-1 w-16 bg-white/20 rounded-full" />
        </div>

        {/* RIGHT TEAM CARD */}
        <div className="w-full max-w-xs lg:max-w-xs">
          <div className="relative">
            <div className="relative bg-[#171717] rounded-xl p-1 border border-white/8 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
              <div className="bg-[#1f1f1f] rounded-xl p-4">
                {/* Logo Circle */}
                <div className="relative mx-auto w-40 h-40 mb-4">
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-xl">
                    {selectedRight ? (
                      <img
                        src={radios.find((item) => item.clubName === selectedRight)?.clubImageUrl || ''}
                        alt={selectedRight}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0f0f10]">
                        <FaQuestionCircle className="text-5xl text-white/10" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Name */}
                <p className="text-sm text-center text-white/50 mb-1">Against the Motion</p>
                <h2 className="text-xl font-bold text-center text-white mb-3 tracking-wide uppercase">
                  {selectedRight || "—"}
                </h2>

                {/* Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowMoreRight((prev) => !prev)}
                    className="w-full bg-transparent border border-white/20 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-between hover:border-white/40"
                  >
                    <span className="text-sm">SELECT TEAM</span>
                    {showMoreRight ? <FaCaretUp className="text-lg" /> : <FaCaretDown className="text-lg" />}
                  </button>

                  {showMoreRight && (
                    <div className="absolute z-[100] w-full mt-2 bg-[#1f1f1f] border border-white/10 rounded-lg overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
                      {radios.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => {
                            setSelectedRight(item.clubName);
                            setShowMoreRight(false);
                          }}
                          className={`px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 text-sm ${
                            item.clubName === selectedRight
                              ? "bg-white/10 text-white"
                              : "text-white/80 hover:bg-white/5"
                          }`}
                        >
                          <img
                            src={item.clubImageUrl}
                            alt={item.clubName}
                            className="w-8 h-8 rounded-full object-cover border border-white/20"
                          />
                          <span className="font-semibold">{item.clubName}</span>
                          {item.clubName === selectedRight && <span className="ml-auto text-lg">●</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          
      {/* Topic input + counter + start button */}
              <div className="w-full flex justify-center mt-6 md:mt-8 px-4 sm:px-6">
        <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[60%]">
          {/* Stage Input */}
          {/* Stage Dropdown */}
              <div className="flex justify-center mb-4 relative">
          <div className="relative w-40">
          <button
            type="button"
            onClick={() => setShowStageDropdown((prev) => !prev)}
            className="w-full bg-transparent border border-white/20 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-between hover:border-white/40"
          >
            <span className="text-sm">{stage || "Select Stage"}</span>
            {showStageDropdown ? <FaCaretUp className="text-lg" /> : <FaCaretDown className="text-lg" />}
          </button>
          {showStageDropdown && (
            <div className="absolute z-20 w-full mt-2 bg-[#1f1f1f] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
              {stageOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setStage(option);
                    setShowStageDropdown(false);
                  }}
                  className={`px-4 py-2 cursor-pointer transition-all duration-200 text-sm ${
                    stage === option
                      ? "bg-white/10 text-white"
                      : "text-white/80 hover:bg-white/5"
                  }`}
                >
                  {option}
                  {stage === option && <span className="ml-2 text-lg">●</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm sm:text-base font-medium">Debate Topic</label>
            <span className="text-xs sm:text-sm text-gray-600">
              {topic.length}/200
            </span>
          </div>

          <textarea
            value={topic}
            onChange={handleTopicChange}
            maxLength={200}
            rows={3}
            placeholder="Enter the debate topic..."
            className="w-full p-3 border rounded-md resize-none text-sm sm:text-base"          />

          <div className="flex justify-end mt-3">
            <button
              onClick={handleStart}
              disabled={startDisabled}
              className={`px-4 sm:px-6 py-2 rounded-md text-white text-sm sm:text-base ${
                startDisabled ? "bg-white/10 cursor-not-allowed" : "bg-white/20 hover:bg-white/30 border border-white/20"
              }`}
            >
              Start Debate
            </button>
          </div>
        </div>
      </div>
    </section>
    </>
  );
  }
if ((loadMatch == false) &&(viewMode === "control")){
  return(<div className="bg-black"></div>)
}
  // Render control view
  return (
    <section className="min-h-screen p-4 sm:p-6">
      <Toaster/>
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">HR — Debate Control</h1>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="text-sm text-gray-400">{topic ? `Topic: ${topic}` : "No topic provided"}</div>

          <button
            onClick={handleRefresh}
            title="Refresh teams"
            className="p-2 rounded-md hover:bg-gray-800 text-white"
            aria-label="Refresh"
          >
            <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm sm:text-base"
          >
            End Debate
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Team */}
        <TeamCard team={leftTeam} side="left" />

        {/* Center V/S */}
        <div className="flex flex-col items-center">
          <div className="text-3xl sm:text-4xl font-bold text-white">V/S</div>
        </div>

        {/* Right Team */}
        <TeamCard team={rightTeam} side="right" />
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowConfirm(false)}
            aria-hidden="true"
          />
          <div className="relative bg-[#1E1E1E] rounded-lg p-6 w-full max-w-lg shadow-xl border border-white/10">
            <button
              className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-800 text-white"
              onClick={() => setShowConfirm(false)}
              aria-label="close"
            >
              <FaTimes />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-white">Confirm End Debate</h2>

            <div className="space-y-3 text-white">
              <div className="flex items-center justify-between">
                <div className="font-medium">{leftTeam?.clubName || selectedLeft}</div>
                <div className="font-bold text-xl">{leftScore}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="font-medium">{rightTeam?.clubName || selectedRight}</div>
                <div className="font-bold text-xl">{rightScore}</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-600 text-white hover:bg-gray-800"
                disabled={finalSubmitting}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                disabled={finalSubmitting}
              >
                {finalSubmitting ? "Submitting..." : <><FaCheck /> Confirm</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}