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
        <div className="px-4  sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8">
           { displayedRounds.map(
            (round, index) => (
                <div className="flex flex-col lg:flex-row w-full mb-8 lg:mb-0" key={index}>
                    <div className="hidden lg:block flex-shrink-0">
                        <div className='h-77.5 border-r border-[#57CBFF] border-dashed'>
                            <div className='flex items-center'>
                                <button className='bg-[#18263D] text-white border border-[#57CBFF] h-14 w-50 rounded-xs text-sm'>
                                    {round.match}
                                </button>
                                
                                <div className='bg-[#57CBFF] w-31.5 h-px'></div>
                                <div className='bg-[#57CBFF] w-2.5 h-2.5 rounded-2xl shadow-[0_0_16px_#57CBFF]'></div>
                            </div>
                            <div className='font-medium text-white w-44 text-[16px] pl-6 pt-9'>
                                {round.status}
                            </div>
                        </div>
                    </div>
                    
                    <div className='px-0  sm:px-4 md:px-8 w-full min-h-[300px] lg:h-77.5 py-4 lg:py-0'>
                            <p className='text-white text-sm sm:text-[16px] font-normal hidden lg:block'>Seminar Hall, MJCET BLOCK 4</p>
                            
                            {/* Mobile/Tablet layout */}
                            <div className='lg:hidden flex flex-col items-center justify-center w-full mb-4 space-y-4 rounded-xl p-4 sm:p-6 border border-[#57CBFF]/20'>
                                    {/* Match info at top */}
                                    <button className='bg-[#18263D] text-white border border-[#57CBFF] h-12 sm:h-14 px-4 sm:px-6 rounded-xs text-xs sm:text-sm text-center'>
                                        {round.match}
                                    </button>
                                    <div className='font-medium text-white text-sm sm:text-[16px] text-center'>
                                        {round.status}
                                    </div>
                                    <p className='text-white text-xs sm:text-sm font-normal'>Seminar Hall, MJCET BLOCK 4</p>
                                    <span className='text-[#686868] text-sm sm:text-[16px] font-normal'>{round.date}</span>
                                    
                                    {/* Club images side by side - LARGER */}
                                    <div className='flex items-center justify-center gap-3 sm:gap-6 md:gap-10 py-4 w-full'>
                                        <div className='flex flex-col items-center flex-1'>
                                            <p className={`${round.isAWinner ? 'visible' : 'invisible'} text-[#5DDB6E] text-xs sm:text-sm mb-2`}>WINNER</p>
                                            <img src={round.coverA} alt={round.teamA} className='h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 object-cover rounded-xl border-2 border-[#57CBFF]/30' />
                                            <p className='text-white text-sm sm:text-base md:text-lg mt-3 text-center font-medium'>{round.teamA}</p>
                                            <p className='text-[#686868] text-xs sm:text-sm'>For the Motion</p>
                                        </div>
                                        
                                        <span className='text-[#FFD428] font-bold text-xl sm:text-2xl md:text-3xl px-2'>VS</span>
                                        
                                        <div className='flex flex-col items-center flex-1'>
                                            <p className={`${!round.isAWinner ? 'visible' : 'invisible'} text-[#5DDB6E] text-xs sm:text-sm mb-2`}>WINNER</p>
                                            <img src={round.coverB} alt={round.teamB} className='h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 object-cover rounded-xl border-2 border-[#57CBFF]/30' />
                                            <p className='text-white text-sm sm:text-base md:text-lg mt-3 text-center font-medium'>{round.teamB}</p>
                                            <p className='text-[#686868] text-xs sm:text-sm'>Against the Motion</p>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        className='relative'
                                        onMouseEnter={() => setHoveredRound(index)}
                                        onMouseLeave={() => setHoveredRound(null)}
                                        onClick={() => setHoveredRound(hoveredRound === index ? null : index)}
                                    >
                                        <span className='text-[#FFD428] text-sm sm:text-[16px] font-normal cursor-pointer'>Speakers & Topic →</span>
                                        
                                        {hoveredRound === index && (
                                            <div className='absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#18263D] border border-[#57CBFF] rounded-lg p-4 sm:p-6 z-10 w-[280px] sm:w-80 md:w-96 shadow-lg'>
                                                <h3 className='text-[#FFD428] text-base sm:text-[18px] font-semibold mb-3 sm:mb-4'>Topic</h3>
                                                <p className='text-white text-xs sm:text-[14px] mb-4 sm:mb-6'>{round.topic}</p>
                                                
                                                <div className='flex flex-col sm:flex-row justify-between gap-4'>
                                                    <div className='flex-1'>
                                                        <h4 className='text-[#57CBFF] text-sm sm:text-[16px] font-semibold mb-2 sm:mb-3'>{round.teamA}</h4>
                                                        <p className='text-[#686868] text-[10px] sm:text-[12px] mb-2'>For the Motion</p>
                                                        <ul className='space-y-1 sm:space-y-2'>
                                                            {round.leftMembers?.map((member, idx) => (
                                                                <li key={idx} className='text-white text-xs sm:text-[14px] flex items-center gap-2'>
                                                                    {member.isLeader && <span className='text-[#FFD428]'>👑</span>}
                                                                    {member.name}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    
                                                    <div className='flex-1'>
                                                        <h4 className='text-[#57CBFF] text-sm sm:text-[16px] font-semibold mb-2 sm:mb-3'>{round.teamB}</h4>
                                                        <p className='text-[#686868] text-[10px] sm:text-[12px] mb-2'>Against the Motion</p>
                                                        <ul className='space-y-1 sm:space-y-2'>
                                                            {round.rightMembers?.map((member, idx) => (
                                                                <li key={idx} className='text-white text-xs sm:text-[14px] flex items-center gap-2'>
                                                                    {member.isLeader && <span className='text-[#FFD428]'>👑</span>}
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
                           <hr className='border-px border-[#686868] mb-4 sm:mb-6 lg:mb-8 lg:block hidden' />

                           {/* Teams section - desktop only */}
                           <div className='w-full hidden lg:flex flex-row items-center justify-start'>

                               <div className='flex flex-col items-start'>
                                   <p className={`${round.isAWinner ? 'visible' : 'invisible'} text-[#5DDB6E] text-sm pl-28 mb-1`}>WINNER</p>
                                   <div className='flex flex-row items-center'>
                                       <img src={round.coverA} alt="" className='h-24 w-24 object-cover rounded-lg' />
                                       <div className='pl-4 text-left'>
                                           <p className='text-white text-[24px]'>{round.teamA}</p>
                                           <p className='text-[#686868] text-[16px]'>For the Motion</p>
                                       </div>
                                   </div>
                               </div>

                               <span className='text-[#FFD428] font-normal text-[16px] px-8'>VS</span>

                               <div className='flex flex-col items-start'>
                                   <p className={`${!(round.isAWinner) ? 'visible' : 'invisible'} text-[#5DDB6E] text-sm mb-1`}>WINNER</p>
                                   <div className='flex flex-row items-center'>
                                       <div className='pr-4 text-left'>
                                           <p className='text-white text-[24px]'>{round.teamB}</p>
                                           <p className='text-[#686868] text-[16px]'>Against the Motion</p>
                                       </div>
                                       <img src={round.coverB} className='h-24 w-24 object-cover rounded-lg' alt="" />
                                   </div>
                               </div>
                           </div>

                    </div>
                </div>
                
            )
        )}
        
        {rounds.length > 5 && (
            <div className='flex  justify-center mt-6 sm:mt-8'>
                <button 
                    onClick={() => setShowAll(!showAll)}
                    className='bg-black/12  cursor-pointer text-white border border-white/12 px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-colors duration-300 text-sm sm:text-base'
                >
                    {showAll ? 'Show Less' : 'Read More'}
                </button>
            </div>
        )}
        </div>
        
    
  )
}

export default History