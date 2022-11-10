import axios from 'axios'

const BASE_URL = "http://localhost:5000/voters"

class VoterService {
  getVoters() {
    return axios.get(BASE_URL);
  }
}

export default new VoterService()