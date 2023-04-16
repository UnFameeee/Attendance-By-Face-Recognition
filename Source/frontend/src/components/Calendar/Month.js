import React from "react";
import Day from "./Day";
export default function Month(props) {
  const { month, listWorkShift } = props;
  // console.log("month",month);
  return (
    <div className="flex-1 grid grid-cols-7 grid-rows-5">
      {month.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((day, idx) => (
            <Day listWorkShift={listWorkShift} day={day} key={idx} rowIdx={i} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
