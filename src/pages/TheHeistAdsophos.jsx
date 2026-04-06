import { motion } from "framer-motion";
import PixelSkyline from "../components/adsophos/PixelSkyline";
import Nav from "../components/adsophos/nav";
import heading from "../../public/ad-loop.jpg"
import adsec from "../../public/loop-section-i.png"
import loophead from "../../public/loop-heading.jpeg"
export default function TheHeistAdsophos() {
return (
    <>
    <div className="relative" >
    <div className="relative">
        <img src={loophead} alt="The Heist: Adsophos" className="absolute h-22 w-[50vw] left-[25vw] -bottom-[11vh]" />
    <img src={heading} alt="The Heist: Adsophos" className="w-full h-[55vh] object-cover" />
    </div>
    <img src={adsec} alt="The Heist: Adsophos" className="w-full h-auto z-5 object-cover " />
    <Nav/>
    </div>

    </>
)

}