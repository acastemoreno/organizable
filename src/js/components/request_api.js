const get_url = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    return ["error", "Invalid request"];
  } else {
    return ["ok", data];
  }
};

const post_url = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    return ["error", "Invalid request"];
  } else {
    return ["ok", data];
  }
};

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

const patch_protected_url = async (url, body) => {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    method: "PATCH",
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

export default get_url;
export {
  get_url,
  post_url,
  post_protected_url,
  get_protected_url,
  patch_protected_url,
};
