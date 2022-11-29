import React, { Component } from "react"
import VoterService from "../service/VoterService"

class ListVoters extends Component {
  constructor(props) {
    super(props)
    this.state = {
      voters: []
    }
  }

  componentDidMount() {
    VoterService.getVoters()
      .then((res) => {
        console.log('res here', res.data)
        this.setState({voters: res.data})
      }).catch(error => {
        console.log(error)
      })
  }

  render() {
    return (
      <div className="votersList">
        <h1>List of voters</h1>
        <div className="voter-list">
          <table>
            <thead>
              <tr>
                <th>ID:</th>
                <th>Voting Status:</th>
              </tr>
            </thead>
            <tbody>
              {this.state.voters.map(
                voter => 
                <tr key={voter._id}>
                  <td>{voter._id}</td>
                  <td>{voter.voted ? "Voted" : "Not Voted"}</td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    )
  }
}

export default ListVoters