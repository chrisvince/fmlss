import initFirebaseAdmin from '../../initFirebaseAdmin'

export const checkUserHasPasswordServer = async (
  uid: string
): Promise<boolean> => {
  const firebase = initFirebaseAdmin()
  const auth = firebase.auth()
  const user = await auth.getUser(uid)

  const hasPasswordProviderId =
    user.providerData.findIndex(
      ({ providerId }) => providerId === 'password'
    ) !== -1

  return hasPasswordProviderId
}
