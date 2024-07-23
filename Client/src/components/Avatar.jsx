import React from 'react';

const Avatar = ({online, username, userId }) => {
  const colors = [
      "bg-yellow-200",
      "bg-blue-200",
    "bg-teal-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-red-200",
  ];

  const userIdbase10=parseInt(userId,16);
  const colorIndex=userIdbase10%colors.length;
  const color=colors[colorIndex];
  const letter = username[0];
  return (
    <div className={`flex relative justify-center items-center h-4 w-4 md:w-8 md:h-8 rounded-full ${color}`}>
      <div className="text-center text-black w-full">{letter}</div>
      {online &&(
        <div className='absolute h-[5px] w-[5px] md:h-3 md:w-3 bottom-0 right-0 rounded-full bg-green-500 border border-white'></div>
      )}
      {!online &&(
        <div className='absolute h-[5px] w-[5px] md:h-3 md:w-3 bottom-0 right-0 rounded-full bg-slate-500 border border-white'></div>
      )}
    </div>
  );
};

export default Avatar;
