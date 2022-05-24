import { getAuth } from 'firebase-admin/auth'

const auth = getAuth()

export default async (uid: string) => {
  const user = await auth.getUser(uid)

  const hasPasswordProviderId = user.providerData.findIndex(
      ({ providerId }) => providerId === 'password'
  ) !== -1

  return hasPasswordProviderId
}
