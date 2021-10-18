import React from "react";

const parseDateToTime = (date) => {
  let [_, rawDate, state] = new Date(date).toLocaleString().split(" ");
  let withNoSeconds = rawDate.split(":").slice(0, 2).join(":") + " " + state;
  return withNoSeconds;
};

export default function MessageCard({ data, me }) {
  return (
    <div
      className={`d-flex mb-2 w-100 ${
        data && data.senderId === me.id
          ? `justify-content-end`
          : `justify-content-start`
      }`}
    >
      <div className="chat-message-wrapper shadow p-2">
        <h6>{data && data.message}</h6>

        <div className="d-flex justify-content-end">
          <small className="text-orange font11px">
            {data && parseDateToTime(data.createdAt)}
          </small>
        </div>
      </div>
    </div>
  );
}
