export const makeSecret = (count = 6) => {
  let text = "";
  const possible = "0123456789";

  for (let i = 0; i < count; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export default makeSecret;
