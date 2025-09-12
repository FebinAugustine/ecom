const validationResult = (req) => {
  const { username, email, password } = req.body;
  const errors = [];
  if (!username) {
    errors.push({ msg: "Username is required" });
  } else if (username.length < 3) {
    errors.push({ msg: "Username must be at least 3 characters long" });
  }

  if (!email) {
    errors.push({ msg: "Email is required" });
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push({ msg: "Invalid email format" });
  }

  if (!password) {
    errors.push({ msg: "Password is required" });
  } else if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters long" });
  }

  return errors;
};

const loginValidator = (req) => {
  const { email, password } = req.body;
  const errors = [];
  if (!email) {
    errors.push({ msg: "Email is required" });
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push({ msg: "Invalid email format" });
  }

  if (!password) {
    errors.push({ msg: "Password is required" });
  }

  return errors;
};

export { validationResult, loginValidator };
