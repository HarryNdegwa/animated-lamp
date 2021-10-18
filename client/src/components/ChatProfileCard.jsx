import React from "react";

export default function ChatProfileCard({
  data,
  setActiveProfileId,
  idx,
  // setMessages,
}) {
  return (
    <div
      className="py-3 cursor-pointer card mt-2 px-2"
      onClick={() => {
        setActiveProfileId(idx);
        // setMessages([]);
      }}
    >
      <h5>{data.username}</h5>
    </div>
  );
}
