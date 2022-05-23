import axios from 'axios'
import type { AxiosInstance } from 'axios'

/** A firebaseAuthRestApi client */
export default class FirebaseAuthRestApi {
  api: AxiosInstance

  /** Setup Axios instance */
  constructor() {
    this.api = axios.create({
      baseURL: 'https://identitytoolkit.googleapis.com/',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Verify Firebase Auth user credentials.
   * @param {object} email The user's email.
   * @param {string} password The user's password.
   * @return {boolean} Whether or not the user's credentials are valid.
   */
  async verifyCredentials({
    email,
    password,
  }: {
    email: string
    password: string
  }) {
    const apiKey = process.env.WEB_API_KEY
    try {
      const response = await this.api.post(
          `/v1/accounts:signInWithPassword?key=${apiKey}`,
          {
            email,
            password,
            returnSecureToken: true,
          }
      )
      return response.status === 200
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
