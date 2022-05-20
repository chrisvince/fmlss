import axios from 'axios'
import type { AxiosInstance } from 'axios'

export const createSendGridApi = () => axios.create({
  baseURL: 'https://api.sendgrid.com/',
  headers: {
    'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    'Content-Type': 'application/json',
  },
})

/** A SendGrid API client */
export default class SendGrid {
  api: AxiosInstance

  /** Setup Axios instance */
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.sendgrid.com/',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })
  }

  /** Send SendGrid dynamic transactional email */
  /**
   * Send SendGrid dynamic transactional email.
   * @param {object} dynamicTemplateData Dynamic template data for email.
   * @param {string} email To email.
   * @param {string} fromEmail From email. Defaults to 'noreply@fameless.app'.
   * @param {string} templateId Dynamic template email ID.
   * @return {void}
   */
  async sendTemplateEmail({
    dynamicTemplateData,
    email,
    fromEmail = 'noreply@fameless.app',
    templateId,
  }: {
    dynamicTemplateData?: object
    email: string
    fromEmail?: string
    templateId: string
  }) {
    await this.api.post('/v3/mail/send', {
      from: {
        email: fromEmail,
      },
      personalizations: [
        {
          to: [{ email }],
          dynamic_template_data: dynamicTemplateData,
        },
      ],
      template_id: templateId,
    })
  }
}
