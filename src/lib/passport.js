import passport from "passport";
import moment from "moment";
import { Strategy as LocalStrategy } from "passport-local";
import { getAvatar } from "../lib/helpers";

import { pool, poola } from "../database";
import * as helpers from "./helpers";

import { validationResult } from "express-validator";

passport.use(
    "local.signin",
    new LocalStrategy({
            usernameField: "username",
            passwordField: "password",
            passReqToCallback: true,
        },
        async(req, username, password, done) => {
            console.log(req.body);
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const errorstxt = errors.mapped();
                var msg = "";
                for (var key in errorstxt) {
                    msg += "<p>" + errorstxt[key].msg + " </p> ";
                }
                req.flash('error', msg);
                res.redirect('back');
                return;
            }


            let rows;
            try {
                rows = await poola.query("SELECT * FROM authme WHERE realname=?", [
                    username,
                ]);
            } catch (error) {
                return done(null, false, req.flash("message", "Algo salió mal. Inténtalo de nuevo más tarde."));
            }

            if (rows.length > 0) {
                const user = rows[0];
                const validPassword = await helpers.matchPassword(
                    password,
                    user.password
                );
                if (validPassword) {
                    try {
                        var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
                        await pool.query('REPLACE INTO lastlogin (player_id,last_con) values (?,?)', [user.id, mysqlTimestamp]);
                        const hasImage = await pool.query('SELECT * FROM images WHERE player_id=?', [user.id]);
                        if (!hasImage[0]) {
                            const url = await getAvatar(user.realname);
                            await pool.query('REPLACE INTO images (player_id,filename,nick) values (?,?,?)', [user.id, url, user.realname]);
                        }
                        done(null, user, req.flash("success", "Bienvenido " + user.realname));
                    } catch (error) {
                        console.log(error);
                        return done(null, false, req.flash("message", "Algo salió mal. Inténtalo de nuevo más tarde."));

                    }

                } else {
                    done(null, false, req.flash("message", "Contraseña Incorrecta!"));
                }
            } else {
                return done(null, false, req.flash("message", "El Usuario no existe!"));
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try {
        const rows = await poola.query("SELECT * FROM authme WHERE id = ?", [id]);
        const image = await pool.query("SELECT * FROM images WHERE player_id = ?", [id]);
        if (image[0]) Object.assign(rows[0], { avatar: image[0].filename });
        delete rows[0].password;
        done(null, rows[0]);
    } catch (error) {
        return done(error, false);
    }
});