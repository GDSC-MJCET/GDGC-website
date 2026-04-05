// import React from 'react'
// import Hero from '../components/adsophos/Hero'
// import Room1 from '../components/adsophos/Room1'
// import Room2 from '../components/adsophos/Room2'

// const Adsophos = () => {
//   return (
//     <div><Hero /> <Room1 /> <Room2 /></div>
//   )
// }

// export default Adsophos

import React from 'react';
import Hero from '../components/adsophos/Hero';
import Room1 from '../components/adsophos/Room1';
import Room2 from '../components/adsophos/Room2';
import Booth from '../components/adsophos/Booth';
import Final from '../components/adsophos/Final';

const Adsophos = () => {
  return (
    <div className="bg-[#1e1e1e]">

      {/* Hero — full viewport height */}
      <div className="relative z-10">
        <Hero />
      </div>

      {/* Room1 — overlaps Hero by 64px, sits above Hero */}
      <div className="relative z-20 -mt-16">
        <Room1 />
      </div>

      {/* Room2 — overlaps Room1 by 64px, sits above Room1 */}
      <div className="relative z-30 -mt-">
        <Room2 />
      </div>

      <div>
        <Booth />
      </div>

      <div>
        <Final />
      </div>

    </div>
  );
};

export default Adsophos;