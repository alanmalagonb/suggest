import { pool, poola } from "../database";

export const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/signin");
};

export const isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) return next();
    res.redirect('/profile');
};

export const isAdmin = async(req, res, next) => {
    try {
        const user = await pool.query('SELECT * FROM admin where realname = ?', [req.user.realname]);
        if (user[0]) return next();
        res.redirect('/profile');
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }

};