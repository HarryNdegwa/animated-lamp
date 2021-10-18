export const authConfig = (token) => {
  return {
    authorization: `Bearer ${token}`,
  };
};
