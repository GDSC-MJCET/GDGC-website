import axios from "axios";
import { useState,useEffect } from "react";

const Leaderboard = ()=>{
    const [users, setUsers]= useState([]);
    const [loading, setLoading ]= useState(true);

    useEffect(() => {
        axios 
        .get(import.meta.env.VITE_SERVER + "/api/v1/leaderboard")
        .then((res)=>{
                setUsers(res.data.data);
        })
        .catch((e) => {
            console.log(err);
        })
        .finally(()=>{setLoading(false )});
    },[]);
      if (loading) {
    return <div className="p-6">Loading leaderboard...</div>;
  }

  return (
    // <div className="min-h-screen bg-background p-6">
    //   <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
    //   <div className="rounded-xl border overflow-hidden">
    //     {/* Header */}
    //     <div className="grid grid-cols-6 bg-muted p-3 text-sm font-bold">
    //       <div>RANK</div>
    //       <div>NAME</div>
          
    //       <div>EASY</div>
    //       <div>MED</div>
    //       <div>HARD</div>
    //       <div>CONTEST RATING</div>
    //       <div>TOTAL</div>
    //     </div>

    //     {/* Rows */}
    //     {users.map((u) => (
    //       <div
    //         key={u._id}
    //         className="grid grid-cols-6 p-3 border-t text-sm hover:bg-muted/50"
    //       >
    //         <div>{u.rank}</div>
    //         <div>{u.user?.name}</div>
            
    //         <div>{u.easySolved}</div>
    //         <div>{u.mediumSolved}</div>
    //         <div>{u.hardSolved}</div>
    //         <div>{u.contestRating}</div>
    //         <div>{u.totalSolved}</div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className="min-h-screen bg-background p-4 md:ml-64">
  <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500">
    Leaderboard
  </h1>

  <div className="rounded-xl border overflow-x-auto">
    {/* Header */}
    <div className="grid grid-cols-7 bg-muted p-3 text-sm font-bold min-w-[700px]">
      <div>RANK</div>
      <div>NAME</div>
      <div>EASY</div>
      <div>MED</div>
      <div>HARD</div>
      <div>CONTEST RATING</div>
      <div>TOTAL</div>
    </div>

    {/* Rows */}
    {users.map((u) => (
      <div
        key={u._id}
        className="grid grid-cols-7 p-3 border-t text-sm hover:bg-muted/50 min-w-[700px]"
      >
        <div>{u.rank}</div>
        <div>{u.user?.name}</div>
        <div>{u.easySolved}</div>
        <div>{u.mediumSolved}</div>
        <div>{u.hardSolved}</div>
        <div>{u.contestRating}</div>
        <div>{u.totalSolved}</div>
      </div>
    ))}
  </div>
</div>
  );
};

export default Leaderboard;