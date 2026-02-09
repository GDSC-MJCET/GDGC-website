import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaCaretUp, FaCaretDown, FaQuestion } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";

export default function HrInterface() {
  const [selectedLeft, setSelectedLeft] = useState("");
  const [selectedRight, setSelectedRight] = useState("");
const [topic, setTopic] = useState("");
  const [showMoreLeft, setShowMoreLeft] = useState(false);
  const [showMoreRight, setShowMoreRight] = useState(false);
  const nav = useNavigate()

  // const auth = JSON.parse(localStorage.getItem("AuthState"))

  // Auth code (commented for testing, should be enabled in production)
  // useEffect(() => {
  //   if (!AuthContext) {
  //     nav("/login")
  //   }

  //   axios
  //     .get(
  //       import.meta.env.VITE_SERVER + "/api/v1/dashboard/get-dashboard",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${auth?.token}`,
  //         },
  //       }
  //     )
  //     .then((data) => {
  //       if (!data.data.success) {
  //         nav("/login")
  //       }
  //     })
  //     .catch(() => {
  //       nav("/login")
  //     })
  // }, [])

  const server = "http://localhost:3009/";
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
  useEffect(() => {
setShowMoreLeft(prev=>!prev)
  }, [selectedLeft]);
 
  useEffect(() => {
    setShowMoreRight(prev=>!prev)
  }, [selectedRight]);

  const handleStart = () => {
    const trimmedTopic = topic.trim();
    if (!selectedLeft || !selectedRight || trimmedTopic.length === 0) {
      // You can replace these with UI feedback if you want
      alert("Please choose both teams and enter a topic before starting.");
      return;
    }
    axios.post(server + "api/v1/techdebate/start-round", {
      leftTeam: selectedLeft,
      rightTeam: selectedRight,
      Topic: trimmedTopic,
    }).then((data) => {  
      console.log(data)    
      if (data.data.Success) {
        nav("/team/hr-control", {
          state: {
            left: selectedLeft,
            right: selectedRight,
            topic: trimmedTopic,
          },
        });
      }
    }).catch((err) => {
      alert("Error starting debate: " + err.response?.data?.error || err.message);
    })

   
    
  };

  const startDisabled = !selectedLeft || !selectedRight || topic.trim().length === 0;

  return (
    <section>
      <div className="flex px-10 pt-10 justify-between ">
        {/* LEFT TEAM */}
        <div className="flex flex-col items-center">
          <div>
            {/* <FaQuestion
              className={selectedLeft === "" ? "" : "hidden"}
              size={150}
            /> */}

            <img
              className={`h-55 w-55${selectedLeft === "" ? " hidden" : ""}`}
              src={
                
                  radios.find((item) => item.clubName === selectedLeft)?.clubImageUrl ||''
                
              }
              alt={selectedLeft || "left team"}
            />

            <p>{selectedLeft}</p>
          </div>

          <div>
            <div className=" p-8 rounded-lg shadow-md w-[22vw] flex">
              <h1>Left Team</h1>

              <div className="flex relative pr-5">
                <button
                  className="absolute top-0 left-5"
                  onClick={() => setShowMoreLeft((prev) => !prev)}
                >
                  <span className={showMoreLeft ? "hidden" : ""}>
                    <FaCaretDown />
                  </span>

                  <span className={showMoreLeft ? "" : "hidden"}>
                    <FaCaretUp />
                  </span>
                </button>

                <div className="pt-5">
                  {showMoreLeft &&
                    radios.map((item) => (
                      <div
                        key={item._id}
                        className="border-b border-l border-r pr-10 pl-5 py-2 border-black"
                        onClick={() => setSelectedLeft(item.clubName)}
                      >
                        {item.clubName === selectedLeft
                          ? `${item.clubName} ●`
                          : item.clubName}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT TEAM */}
        <div className="flex flex-col items-center">
          <div>
            {/* <FaQuestion
              className={selectedRight === "" ? "" : "hidden"}
              size={150}
            /> */}

            <img
              className={`h-55 w-55${selectedRight === "" ? " hidden" : ""}`}
              src=
                // 'https://cydhrjohjxcunyxdlcay.supabase.co/storage/v1/object/public/tech-debate-clubs/club-image/file_1770661369303.jpg'
                {
                  radios.find((item) => item.clubName === selectedRight)?.clubImageUrl || ''
                }
              
              alt={selectedRight || "right team"}
            />

            <p>{selectedRight}</p>
          </div>

          <div>
            <div className=" p-8 rounded-lg shadow-md w-[22vw] flex">
              <h1>Right Team</h1>

              <div className="flex relative pr-5">
                <button
                  className="absolute top-0 left-5"
                  onClick={() => setShowMoreRight((prev) => !prev)}
                >
                  <span className={showMoreRight ? "hidden" : ""}>
                    <FaCaretDown />
                  </span>

                  <span className={showMoreRight ? "" : "hidden"}>
                    <FaCaretUp />
                  </span>
                </button>

                <div className="pt-5">
                  {showMoreRight &&
                    radios.map((item) => (
                      <div
                        key={item._id}
                        className="border-b border-l border-r pr-10 pl-5 py-2 border-black"
                        onClick={() => setSelectedRight(item.clubName)}
                      >
                        {item.clubName === selectedRight
                          ? `${item.clubName} ●`
                          : item.clubName}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topic input + counter + start button */}
      <div className="w-full flex justify-center mt-8">
        <div className="w-[60%]">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Debate Topic</label>
            <span className="text-sm text-gray-600">
              {topic.length}/200
            </span>
          </div>

          <textarea
            value={topic}
            onChange={handleTopicChange}
            maxLength={200}
            rows={3}
            placeholder="Enter the debate topic..."
            className="w-full p-3 border rounded-md resize-none"
          />

          <div className="flex justify-end mt-3">
            <button
              onClick={handleStart}
              disabled={startDisabled}
              className={`px-6 py-2 rounded-md text-white ${
                startDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Start Debate
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}