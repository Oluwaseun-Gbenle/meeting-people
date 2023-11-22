export const Logout = (signOut, auth, setLoading, setError, AsyncStorage) => {
  signOut(auth)
    .then(() => {
      setLoading(true);
      AsyncStorage.removeItem("user");
    })
    .catch((error) => setError(error))
    .finally(() => setLoading(false));
};
