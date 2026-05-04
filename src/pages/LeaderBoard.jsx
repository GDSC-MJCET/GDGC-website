import axios from "axios";
import { useState, useEffect } from "react";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_SERVER + "/api/v1/leaderboard")
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading leaderboard...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* <h1 className="text-9xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-400 to-blue-500">
             Leaderboard
        </h1> */}
      <h1 className="flex justify-center">
        <span
          className="inline-block text-6xl font-bold
      bg-gradient-to-r from-red-500 via-blue-600 to-yellow-300
      bg-clip-text text-transparent "
        >
          Leaderboard
        </span>
      </h1>
      <br />
      <br />

      <div className="rounded-xl border overflow-hidden shadow-sm">
        <div className="grid grid-cols-5 md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-muted px-4 py-3 text-xs md:text-sm font-bold text-center">
          <div>RANK</div>
          <div>NAME</div>
          <div className="hidden md:block">EASY</div>
          <div className="hidden md:block">MED</div>
          <div className="hidden md:block">HARD</div>
          <div className="hidden md:block">RATING</div>
          <div>TOTAL</div>
          <div>STREAK</div>
          <div>PROFILE</div>
        </div>
        {/* Rows */}
        {users.map((u, index) => {
          const lcUser = u.user?.username || u.username;
          return (
            <div
              key={u._id}
              className="grid grid-cols-5 md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] px-4 py-3 text-sm items-center text-center border-t hover:bg-muted/50"
            >
              <div className="font-bold text-primary">{u.rank}</div>
              <div className="font-semibold truncate text-left">
                {u.user?.name}
              </div>
              <div className="hidden md:block">{u.easySolved}</div>
              <div className="hidden md:block">{u.mediumSolved}</div>
              <div className="hidden md:block">{u.hardSolved}</div>
              <div className="font-medium hidden md:block text-blue-500">
                {u.contestRating}
              </div>
              <div className="font-semibold">{u.totalSolved}</div>
              <div className="text-lg flex justify-center items-center w-9 h-9 mx-auto">
                {u.activityStatus}
              </div>
              <div>
                <a
                  href={`https://leetcode.com/${lcUser}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline font-medium"
                >
                  🔗{" "}
                </a>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 p-4 border rounded-xl bg-muted/30 max-w-xl mx-auto">
        <h2 className="text-lg font-bold mb-3 text-center">Streak Legend</h2>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg text-green-500">🔥</span>
            <span>Solved today</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg text-yellow-400">💪</span>
            <span>Solved yesterday</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg text-orange-500">💀</span>
            <span>No activity for 2 days</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg text-gray-400">⛔</span>
            <span>Inactive (more than 2 days)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Leaderboard;
