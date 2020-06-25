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

const post_protected_url = async (url, body) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token token="${token}"`,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    return ["error", "Invalid auth"];
  } else {
    return ["ok", data];
  }
};

export { get_protected_url, post_protected_url };
