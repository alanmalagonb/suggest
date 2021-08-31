import { getAvatar, randomNumber } from "../lib/helpers";
import { pool, poolp } from "../database";
import fs from "fs-extra";
import path from "path";

const userCtrl = {};

userCtrl.renderUserProfile = async(req, res) => {
    try {
        const images = await pool.query('SELECT images.*,lastlogin.last_con as fecha FROM images INNER JOIN lastlogin ON images.player_id = lastlogin.player_id WHERE images.player_id=?', [req.user.id]);

        let helmavatar;
        let fecha = images[0].fecha;
        let stadistics = {
            suggests: 0,
            comments: 0,
            replys: 0,
        };
        const suggestsc = await pool.query('SELECT IFNULL(count(*),0) as suggests FROM links where player_id=?', [req.user.id]);
        const commentsc = await pool.query('SELECT IFNULL(count(*),0) as comments FROM comments where player_id=?', [req.user.id]);
        const replysc = await pool.query('SELECT IFNULL(count(*),0) as replys FROM reply where player_id=?', [req.user.id]);

        stadistics.suggests = suggestsc[0].suggests;
        stadistics.comments = commentsc[0].comments;
        stadistics.replys = replysc[0].replys;

        if (images[0]) helmavatar = images[0].filename;
        else helmavatar = await getAvatar(req.user.realname);

        const permission = await poolp.query('SELECT luckperms_user_permissions.permission FROM luckperms_players, luckperms_user_permissions WHERE luckperms_players.username = ?', [req.user.username]);
        let role = `<span class="badge bg-warning">Miembro</span>`;
        let priority = 0;
        for (var key in permission) {
            if (permission[key].permission === "group.vip" && priority < 1) {
                role = `<span class="badge bg-info">VIP</span>`;
                priority = 1;
            } else if (permission[key].permission === "group.vip+" && priority < 2) {
                role = `<span class="badge bg-primary">VIP+</span>`;
                priority = 2;
            } else if (permission[key].permission === "group.admin" && priority < 3) {
                role = `<span class="badge bg-danger">Admin</span>`;
                priority = 2;
            }
        }


        res.render('profile', { helmavatar, stadistics, role, fecha });
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }

}

userCtrl.updateImage = async(req, res, next) => {
    try {
        const saveImage = async() => {
            const imgUrl = randomNumber();
            const query = '%' + imgUrl + '%';
            const images = await pool.query('SELECT * FROM images WHERE filename LIKE ?', [query]);
            const permission = await poolp.query('SELECT luckperms_user_permissions.permission FROM luckperms_players, luckperms_user_permissions WHERE luckperms_players.username = ?', [req.user.username]);
            var hasPermissionImage = false;
            var hasPermissionGif = false;
            for (var key in permission) {
                if (permission[key].permission === "group.vip") {
                    hasPermissionImage = true;
                }
                if (permission[key].permission === "group.vip+") {
                    hasPermissionGif = true;
                }
            }
            if (images.length > 0) {
                saveImage();
            } else {
                const imageTempPath = req.file.path;
                const ext = path.extname(req.file.originalname).toLowerCase();
                const targetPath = path.resolve(`./uploads/${imgUrl}${ext}`);
                if (!hasPermissionImage && (ext === ".jpeg" || ext === ".jpg" || ext === ".png")) {
                    await fs.unlink(imageTempPath);
                    req.flash('message', 'Necesitas rango Vip para subir imágenes');
                    res.redirect('/profile');
                    return;
                } else if (!hasPermissionGif && ext === ".gif") {
                    await fs.unlink(imageTempPath);
                    req.flash('message', 'Necesitas rango Vip+ para subir gifs');
                    res.redirect('/profile');
                    return;
                }
                if (
                    ext === ".png" ||
                    ext === ".jpg" ||
                    ext === ".jpeg" ||
                    ext === ".gif"
                ) {
                    await fs.rename(imageTempPath, targetPath);
                    const filename = imgUrl + ext;
                    await pool.query('REPLACE INTO images (player_id,filename,nick) values (?,?,?)', [req.user.id, filename, req.user.realname]);
                    req.flash('success', 'Imagen actualizada!');
                    res.redirect('/profile');
                } else {
                    await fs.unlink(imageTempPath);
                    req.flash('message', 'Solo se permiten Imagenes/Gifs');
                    res.redirect('/profile');
                }
            }
        };

        saveImage();
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }
    //const helmavatar = await getAvatar(req.user.realname);
    //res.render('profile', { helmavatar });
};

module.exports = userCtrl;