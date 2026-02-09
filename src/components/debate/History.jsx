const History = ({rounds}) => {
  return (
        <div>
           { rounds.map(
            (round, index) => (
                <div className="flex flex-row w-full" key={index}>
                        <div>
                            <div className='h-77.5 border-r border-[#57CBFF] border-dashed'>
                                <div className='flex items-center'>
                                    <button className='bg-[#18263D] text-white border border-[#57CBFF] h-14 w-50 rounded-xs'>
                                        {
                                            round.match
                                        }
                                    </button>
                                    
                                    <div className='bg-[#57CBFF] w-31.5 h-px'></div>
                                    <div className='bg-[#57CBFF] w-2.5 h-2.5 rounded-2xl shadow-[0_0_16px_#57CBFF]'></div>
                                </div>
                                <div className='font-medium text-white w-44 text-[16px] pl-6 pt-9'>
                                    Lorem ipsum dolor sit amet consectetur
                                </div>
                            </div>
                        </div>
                    
                    <div className='px-8 w-full h-77.5'>
                            <p className='text-white text-[16px] font-normal'>Semilar Hall, MJCET BLOCK 4</p>
                            <div className='flex items-center justify-between w-full mb-4 px-8'>
                               <span className='text-[#686868] text-[16px] font-normal'>{round.date}</span>
                               <span className='text-[#FFD428] text-[16px] font-normal'>Speakers & Topic →</span>
                            </div>
                           <hr className='border-px border-[#686868] mb-8' />


                           <div className='w-full flex flex-row items-center justify-start'>

                               <div>
                                   <p className={`${round.isAWinner ? 'visible' : 'invisible'} text-[#5DDB6E] w-full pl-28`}>WINNER</p>
                                   <div className='flex flex-wrap items-center justify-around'>
                                       <img src={round.coverA} alt="" className='h-24 w-24 object-cover' />
                                       <div className='pl-4'>
                                           <p className='text-white text-[24px] '>{round.teamA}</p>
                                           <p className='text-[#686868] text-[16px]'>For the Motion</p>
                                       </div>
                                   </div>
                               </div>

                               <span className='text-[#FFD428] font-normal text-[16px] px-8'>VS</span>

                               <div>
                                   <p className={`${!(round.isAWinner) ? 'visible' : 'invisible'} text-[#5DDB6E] w-full`}>WINNER</p>
                                   <div className='flex flex-wrap items-center justify-around'>
                                       <div className='pr-4'>
                                           <p className='text-white text-[24px] '>{round.teamB}</p>
                                           <p className='text-[#686868] text-[16px]'>Against the Motion</p>
                                       </div>
                                       <img src={round.coverB} className='h-24 w-24 object-cover' alt="" />
                                   </div>
                               </div>
                           </div>

                       </div>
                       </div>
                
            )
        )}
        </div>
        
    
  )
}

export default History