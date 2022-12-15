import React from 'react'
// import "./CandidateFormPopup.css"
import "./Candidate.css";

const CandidateFormPopup = (props) => {
  return (
    <div className="popup">
      <button className="close-button" onClick={() => props.setTrigger(false)}>X</button>
      <div className='pu-content-container'>
        {props.children}
      </div>
    </div>
  )
}

export default CandidateFormPopup
