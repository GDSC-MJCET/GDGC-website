

const PixelSkyline = () => {
  // Hardcoded pattern based on the reference image (Columns)
  // Each array represents a column from bottom to top: 0 = gap, 1 = black, 2 = cyan
  const columns = [
    [1], [0], [1], [1, 1, 1], [1], [1, 1], [0, 1, 1], [1, 0], [0, 0], [0], [0], [0],
    [0, 1], [1], [1, 0], [0, 1], [1, 0], [0, 1, 1], [1], [1, 1], [1, 1, 1], [1], [1, 1], [0]
  ];

  return (
    <div className="hidden md:flex relative w-full overflow-hidden items-end bg-transparent pointer-events-none">
      
      {/* Static Pattern Container — Repeating to fill screen width */}
      <div className="flex items-end gap-0 w-full">
        {[...columns, ...columns, ...columns, ...columns].map((col, cIdx) => (
          <div key={cIdx} className="flex flex-col-reverse gap-0">
            {col.map((cell, rIdx) => (
              <div
                key={rIdx}
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: cell === 1 ? '#1e1e1e' : 'transparent',
                }}
              />
            ))}
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default PixelSkyline;
