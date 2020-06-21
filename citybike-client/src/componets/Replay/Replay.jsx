import React from "react";
import moment from "moment";
import Icons from "../Icons";

import "./stylesReplay.css";
function Replay({ data, changeStatus, status }) {
  return (
    <div className="Replay">
      <h2 className="Replay-title">Replay List since you entered this site</h2>
      <ul className="Replay-list">
        {Object.keys(data).map((replayItem) => {
          return (
            <li
              key={replayItem}
              className={`Replay-item ${
                status === replayItem ? "Replay-item--active" : ""
              }`}
              onClick={() => {
                console.log(`Data Status: ${data[replayItem].date}`);
                changeStatus(replayItem);
              }}
            >
              <div>
                <Icons
                  type="Bike"
                  fill={status === replayItem ? "green" : "#26003e"}
                />
              </div>
              {data[replayItem].date && replayItem !== "current" && (
                <div>{moment(data[replayItem].date).fromNow()}</div>
              )}
              {replayItem === "current" && <div>Now</div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Replay;
