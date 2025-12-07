let USER = require('../model/model')

exports.loginPage = async (req, res) => {
    res.render("login", {
        error: "",
        data: {}
    });
};

exports.signUp = async (req, res) => {
    const error = req.session.error || "";
    const data = req.session.data || {};
    
    // clear session
    req.session.error = null;
    req.session.data = null;

    res.render("signup", { error, data });
};

exports.signupUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        req.session.error = "All fields are required";
        req.session.data = { username, email };
        return res.redirect("/signUp");
    }

    const user = await USER.findOne({ username });
    const emailExist = await USER.findOne({ email });

    if (user && emailExist) {
        req.session.error = "User already exists";
        req.session.data = { username, email };
        return res.redirect("/signUp");
    }

    if (user) {
        req.session.error = "Username already taken";
        req.session.data = { username, email };
        return res.redirect("/signUp");
    }

    if (emailExist) {
        req.session.error = "Email already registered";
        req.session.data = { username, email };
        return res.redirect("/signUp");
    }

    await USER.create({ username, email, password });
    res.redirect("/"); // success → login page
};


exports.loginUser = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await USER.findOne({ username });

    if (!user) {
        return res.render("login", {
            error: "User not found",
            data: { username }
        });
    }

    if (user.password !== password) {
        return res.render("login", {
            error: "Incorrect password",
            data: { username }
        });
    }

    // === IMPORTANT: set session user (so dashboard uses session, not query) ===
    req.session.user = {
        username: user.username,
        email: user.email
    };

    // Redirect to protected dashboard (no username in URL)
    res.redirect("/dashboard");
};


exports.dashboard = async (req, res) => {
    // Block dashboard if no session
    if (!req.session.user) {
        return res.redirect("/");   // <-- was "/login" before; change to "/" because your login route is "/"
    }

    // Always use SESSION user, never allow URL control
    const user = await USER.findOne({ username: req.session.user.username });

    if (!user) {
        return res.redirect("/");
    }

    // Fetch all users (only usernames)
    const allUsers = await USER.find({}, "username");

    res.render("dashboard", { user, allUsers });
};



exports.switchUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) 
        return res.json({ success: false });

    try {
        const user = await USER.findOne({ username });
        if (!user) return res.json({ success: false });

        // Verify password
        if (user.password !== password) {
            return res.json({ success: false });
        }

        // ✔ Password correct → update SESSION
        req.session.user = {
            username: user.username,
            email: user.email
        };

        return res.json({ success: true });

    } catch (err) {
        console.error(err);
        return res.json({ success: false });
    }
};




exports.logout = async (req, res) => {
    req.session.destroy(err => {
        // ignore error for now, redirect to login
        return res.redirect("/");
    });
};

