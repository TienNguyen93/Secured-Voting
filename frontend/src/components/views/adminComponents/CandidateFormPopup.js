import React from 'react'
import "./CandidateFormPopup.css"

const CandidateFormPopup = (props) => {
  return (props.trigger) ? (
    <div className="popup">
        <div className="popup-inside">
            <button className="close-button" onClick={() => props.setTrigger(false)}>Close</button>
            {props.children}
        </div>
    </div>
  ) : "";
}

export default CandidateFormPopup