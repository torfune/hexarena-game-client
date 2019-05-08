const authHeader = accessToken => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})

export default authHeader
