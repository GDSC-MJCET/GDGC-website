import Nav from "../components/Nav";
import Background from "@/components/Background";
import ipl from "../../public/Debate-ipl.png"
import LiveScoreCard from "../components/debate/LiveScore";
import Footer from "@/components/Footer";
import History from "../components/debate/History";

export default function ScorePage (){

    return  (
       <div>
        <Background
              bgColor="#0b0b0b"
              columnColor="rgba(87, 203, 255, 0.1)"
              dotColor="rgba(87,203,255,0.6)"
              dotGlowColor="rgba(87,203,255,0.9)"
            >

        <Nav bgColor='#0b0b0b'/>
        <div  className="text-white dm-mono flex ml-32 w-[76vw]">
            <div  className="flex">
                <p className="text-6xl text-[#57CBFF]" >Score</p><p className="text-6xl text-[#5DDB6E]">board</p>
            </div>
            <div className="ml-auto pt-8 " >
                <p className="text-[#FFD428] text-xl " >Learn about Tech Debate</p>
            </div>
        </div>
        <img src={ipl} className="max-w-[85vw] ml-23" />
       <LiveScoreCard/>
       {/* <History/> some changes are needed here  */}
        
              <Footer bgColor="#0b0b0b" />
        
            </Background>
       </div>

    ) 
}