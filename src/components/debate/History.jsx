import axios from "axios"
import { useEffect, useState } from "react"

const History = () => {
    const [rounds, setRounds] = useState([])
    const [showAll, setShowAll] = useState(false)
    const [hoveredRound, setHoveredRound] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let isMounted = true
        
        const fetchDebateHistory = async () => {
            if (loading) return // Prevent multiple simultaneous requests
            
            setLoading(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER}`+`/api/v1/techdebate/get-history`)
                const data = response.data.history
                
                if (!isMounted) return // Don't update state if component unmounted
                
                // Map the response to the rounds format
                const mappedRounds = data.map(debate => ({
                    match: debate.leftTeam.name + ' vs ' + debate.rightTeam.name,
                    date: new Date(debate.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    }),
                    topic: debate.topic,
                    teamA: debate.leftTeam.name,
                    teamB: debate.rightTeam.name,
                    coverA: debate.leftTeam.image,
                    coverB: debate.rightTeam.image,
                    leftMembers: debate.leftTeam.members,
                    rightMembers: debate.rightTeam.members,
                    leftScore: debate.leftScore,
                    rightScore: debate.rightScore,
                    isAWinner: debate.winner?.clubName === debate.leftTeam.name,
                    isLive: debate.isLive,
                    status:debate.status
                }))
                
                setRounds(mappedRounds)
                
            } catch (error) {
                console.error('Error fetching debate history:', error)
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }
        
        fetchDebateHistory()
        
        return () => {
            isMounted = false // Cleanup function
        }
    }, [])

    const displayedRounds = showAll ? rounds : rounds.slice(0, 5)

return (
  // center + constrain width so component doesn't span full screen
  <div className="mx-auto w-full max-w-6xl px-4">
    {displayedRounds.map((round, index) => (
      <div className="flex flex-col md:flex-row w-full" key={index}>
        {/* ---------- MOBILE: compact heading (only on small screens) ---------- */}
        <div className="w-full md:hidden px-4 py-3 mb-3 bg-transparent">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[#57CBFF] text-xs">Round</div>
              <div className="text-white text-[16px] font-medium">
                {round.state || round.status}
              </div>
              <div className="text-[#BFCBD8] text-[12px]">
                {round.isAWinner
                  ? `${round.teamA} beat ${round.teamB}`
                  : `${round.teamB} beat ${round.teamA}`}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-2xl bg-[#57CBFF] shadow-[0_0_12px_#57CBFF]" />
            </div>
          </div>
        </div>

        {/* ---------- LEFT panel: kept identical to your original but hidden on small screens ---------- */}
        <div className="hidden md:block">
          <div className="h-77.5 border-r border-[#57CBFF] border-dashed">
            <div className="flex items-center">
              <button className="bg-[#18263D] text-white border border-[#57CBFF] h-14 w-50 rounded-xs">
                {round.status}
              </button>

              <div className="bg-[#57CBFF] w-31.5 h-px"></div>
              <div className="bg-[#57CBFF] w-2.5 h-2.5 rounded-2xl shadow-[0_0_16px_#57CBFF]"></div>
            </div>
            <div className="font-medium text-white w-44 text-[16px] pl-6 pt-9">
              {round.isAWinner ? round.teamA : round.teamB} Beat {round.isAWinner ? round.teamB : round.teamA}
            </div>
          </div>
        </div>

        {/* ---------- RIGHT panel: unchanged on large, responsive on mobile ---------- */}
        <div className="px-4 md:px-8 w-full h-auto md:h-77.5">
          <p className="text-white text-[16px] font-normal">Semilar Hall, MJCET BLOCK 4</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-4 md:px-8">
            <span className="text-[#686868] text-[16px] font-normal mb-2 sm:mb-0">{round.date}</span>
            <div
              className="relative"
              onMouseEnter={() => setHoveredRound(index)}
              onMouseLeave={() => setHoveredRound(null)}
            >
              <span className="text-[#FFD428] text-[16px] font-normal cursor-pointer">Speakers & Topic →</span>

              {hoveredRound === index && (
                <div className="absolute top-full right-0 mt-2 bg-[#18263D] border border-[#57CBFF] rounded-lg p-4 md:p-6 z-10 w-80 md:w-96 shadow-lg">
                  <h3 className="text-[#FFD428] text-[18px] font-semibold mb-4">Topic</h3>
                  <p className="text-white text-[14px] mb-6">{round.topic}</p>

                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1 mb-4 md:mb-0">
                      <h4 className="text-[#57CBFF] text-[16px] font-semibold mb-3">{round.teamA}</h4>
                      <p className="text-[#686868] text-[12px] mb-2">For the Motion</p>
                      <ul className="space-y-2">
                        {round.leftMembers?.map((member, idx) => (
                          <li key={idx} className="text-white text-[14px] flex items-center gap-2">
                            {member.isLeader && <span className="text-[#FFD428]">👑</span>}
                            {member.name}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-[#57CBFF] text-[16px] font-semibold mb-3">{round.teamB}</h4>
                      <p className="text-[#686868] text-[12px] mb-2">Against the Motion</p>
                      <ul className="space-y-2">
                        {round.rightMembers?.map((member, idx) => (
                          <li key={idx} className="text-white text-[14px] flex items-center gap-2">
                            {member.isLeader && <span className="text-[#FFD428]">👑</span>}
                            {member.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <hr className="border-px border-[#686868] mb-6 md:mb-8" />

          <div className="w-full flex items-center justify-between">
            {/* Team A Section */}
            <div className="flex-1">
              <p className={`${round.isAWinner ? 'visible' : 'invisible'} text-[#5DDB6E] text-center md:text-left`}>WINNER</p>
              <div className="flex items-center justify-center md:justify-start">
                <img src={round.coverA} alt="" className="h-20 w-20 md:h-24 md:w-24 object-cover" />
                <div className="pl-4 text-center md:text-left">
                  <p className="text-white text-[20px] md:text-[24px]">{round.teamA}</p>
                  <p className="text-[#686868] text-[14px] md:text-[16px]">For the Motion</p>
                </div>
              </div>
            </div>

            <span className="text-[#FFD428] font-normal text-[16px] px-4 md:px-8">VS</span>

            {/* Team B Section */}
            <div className="flex-1">
              <p className={`${!(round.isAWinner) ? 'visible' : 'invisible'} text-[#5DDB6E] text-center md:text-left`}>WINNER</p>
              <div className="flex items-center justify-center md:justify-end">
                <div className="pr-4 text-center md:text-right">
                  <p className="text-white text-[20px] md:text-[24px]">{round.teamB}</p>
                  <p className="text-[#686868] text-[14px] md:text-[16px]">Against the Motion</p>
                </div>
                <img src={round.coverB} className="h-20 w-20 md:h-24 md:w-24 object-cover" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}

    {rounds.length > 5 && (
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-[#57CBFF] hover:bg-[#18263D] text-white border border-[#57CBFF] px-6 md:px-8 py-3 rounded-lg transition-colors duration-300 text-sm md:text-base"
        >
          {showAll ? 'Show Less' : 'Read More'}
        </button>
      </div>
    )}
  </div>
);


}

export default History