const get_protected_url = async (url) => {
  const token = localStorage.getItem("token");
  if (token == null) {
    return ["error", "Need to logging"];
  } else {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token token="${token}"`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return ["error", "Invalid auth"];
    } else {
      return ["ok", data];
    }
  }
};

export default get_protected_url;
