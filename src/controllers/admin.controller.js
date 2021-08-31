import { pool, poola } from "../database";

import { validationResult } from "express-validator";
export const renderAllSuggests = async(req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorstxt = errors.mapped();
            var msg = "";
            for (var key in errorstxt) {
                msg += "<p>" + errorstxt[key].msg + " </p> ";
            }
            req.flash('error', msg);
            res.redirect('/links/');
            return;
        }

        const { id } = req.params;

        const page = id || 1;
        const numPerPage = 10;
        const skip = (Number(page) - 1) * numPerPage;
        const limit = skip + ',' + numPerPage;
        const rows = await pool.query('SELECT count(*) as numRows FROM links');
        const numRows = rows[0].numRows;
        const numPages = Math.ceil(numRows / numPerPage);
        const links = await pool.query('SELECT links.*, images.filename AS image,lastlogin.last_con FROM links LEFT JOIN images ON links.player_id=images.player_id LEFT JOIN lastlogin ON links.player_id=lastlogin.player_id LIMIT ' + limit);
        console.log(links[0])
        if (!links[0] && page != 1) {
            req.flash('message', 'La página no existe.');
            res.redirect('back');
            return;
        }
        for (const suggest in links) {
            const realname = await poola.query('SELECT realname FROM authme WHERE id=?', [links[suggest].player_id]);
            Object.assign(links[suggest], { nick: realname[0].realname });

            const progress = await pool.query('SELECT (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=1) AS plikes, (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=-1) as pdislikes', [links[suggest].id, links[suggest].id]);
            const { plikes, pdislikes } = progress[0];
            const totalProgress = plikes + ((-1) * (pdislikes));
            let progressBar;
            if (totalProgress > 0) {
                progressBar = {
                    plikes,
                    pdislikes: pdislikes * -1,
                    percentagel: (plikes / totalProgress) * 100,
                    percentagedl: ((pdislikes) * (-1) / totalProgress) * 100
                };
            } else progressBar = null;
            Object.assign(links[suggest], { progressBar });
        }
        var pagination = {
            previous: null,
            current: null,
            next: null,
            first: null,
            last: null,
        };
        if (page == 1 && numPages == 1) pagination.first = true;
        else if (page != numPages || numPages == 1) pagination.last = true;
        if (page == 1) pagination.first = null;
        else if (page > 2) pagination.first = true;
        pagination.current = page;
        pagination.previous = Number(page) - 1;

        var nextp = Number(page) + 1;
        if (nextp < numPages) pagination.next = nextp;
        console.log(pagination);
        res.render('admin/list', { links, pagination, numPages });
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }

};

export const renderByStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const links = await pool.query('SELECT * FROM links WHERE status_id=?', [id]);
        res.render('admin/list', { links });
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }

};

export const renderById = async(req, res) => {
    try {
        const { id } = req.params;
        const links = await pool.query('SELECT * FROM links WHERE id=?', [id]);
        if (!links[0]) {
            req.flash('message', 'Sugerencia no encontrada.');
            res.redirect('back');
            return;
        }

        const comments = await pool.query('SELECT comments.id,comments.text, comments.created_at ,images.filename, images.nick FROM comments INNER JOIN images ON comments.player_id=images.player_id WHERE comments.links_id=? ORDER BY created_at ASC', [id]);
        for (const key in comments) {
            /*const votes = await pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingcomment where comment_id=?', [comments[key].id]);
            const likedbyc = await pool.query('SELECT voting_id FROM votingcomment where comment_id=? and player_id=?', [comments[key].id, req.user.id]);
            let voteType;
            if (likedbyc[0]) {
                voteType = likedbyc[0].voting_id;
            } else voteType = 0;
            Object.assign(comments[key], { votos: votes[0].total });
            Object.assign(comments[key], { voteType });*/
            const reply = await pool.query('SELECT reply.id,reply.text,reply.comment_id,reply.created_at,reply.reply_id,reply.player_id,images.filename,images.nick FROM reply,images WHERE reply.player_id = images.player_id AND reply.comment_id = ?', [comments[key].id]);
            if (comments[key].nick == req.user.realname) Object.assign(comments[key], { owned: true });
            for (const rkey in reply) {
                if (reply[rkey].nick == req.user.realname) Object.assign(reply[rkey], { owned: true });
                if (reply[rkey].reply_id) {
                    const nick = await pool.query('SELECT images.nick as rn FROM images INNER JOIN reply ON reply.player_id=images.player_id WHERE reply.player_id=? AND reply.reply_id=?', [reply[rkey].player_id, reply[rkey].reply_id]);
                    Object.assign(reply[rkey], { reply_nick: nick[0].rn });
                }
                /*const votesr = await pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingreply where reply_id=?', [reply[rkey].id]);
                const likedbyr = await pool.query('SELECT voting_id FROM votingreply where reply_id=? and player_id=?', [reply[rkey].id, req.user.id]);
                let voteTyper;
                if (likedbyr[0]) {
                    voteTyper = likedbyr[0].voting_id;
                } else voteTyper = 0;
                Object.assign(reply[rkey], { votos: votesr[0].total });
                Object.assign(reply[rkey], { voteType: voteTyper });*/
            }

            Object.assign(comments[key], { reply: reply });
        }
        const images = await pool.query('SELECT * FROM images WHERE player_id=?', [links[0].player_id]);
        const progress = await pool.query('SELECT (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=1) AS plikes, (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=-1) as pdislikes', [id, id]);
        const { plikes, pdislikes } = progress[0];
        const totalProgress = plikes + ((-1) * (pdislikes));
        let progressBar;
        if (totalProgress > 0) {
            progressBar = {
                plikes,
                pdislikes: pdislikes * -1,
                percentagel: (plikes / totalProgress) * 100,
                percentagedl: ((pdislikes) * (-1) / totalProgress) * 100
            };
        } else progressBar = null;
        const count = await pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingSuggest where suggest_id=?', [id]);
        const likedby = await pool.query('SELECT * FROM votingSuggest where suggest_id=? and player_id=?', [id, req.user.id]);
        const url = images[0].filename;
        const likes = count[0].total;
        let voteType;
        if (likedby[0]) {
            voteType = likedby[0].voting_id;
        } else voteType = 0;
        var own;
        if (links[0].player_id === req.user.id) own = true;
        else own = false;
        const { title, body, created_at, status_id } = links[0];
        const idl = links[0].id;
        res.render('admin/detail', { links, comments, title, body, created_at, status_id, url, own, idl, likes, likedby, voteType, progressBar });
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');

    }

};

export const acceptSuggest = async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE links SET status_id=2 WHERE id=?', [id]);
        req.flash('success', 'Sugerencia Aceptada');
        res.redirect('/admin/detail/' + id);
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }
};

export const denySuggest = async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE links SET status_id=3 WHERE id=?', [id]);
        req.flash('success', 'Sugerencia Rechazada');
        res.redirect('/admin/detail/' + id);
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }


};

export const deleteSuggest = async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM links where id=?', [id]);
        req.flash('success', 'Sugerencia eliminada correctamente');
        res.redirect('/admin/pag/1');
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('/admin/pag/1');
    }

};

export const deleteComment = async(req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM reply where comment_id=?', [id]);
        await pool.query('DELETE FROM comments where id=?', [id]);

        req.flash('success', 'Comentario eliminado correctamente');
        res.redirect('back');
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }

};

export const deleteReply = async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM reply where id=?', [id]);
        req.flash('success', 'Comentario eliminado correctamente');
        res.redirect('back');
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }

};

export const listAdmins = async(req, res) => {
    try {
        const admins = await pool.query('SELECT * FROM admin');
        console.log(admins);
        res.render('admin/admins', { admins });
        console.log(admins);
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }
}


export const addAdmin = async(req, res) => {
    try {
        const { realname } = req.body;
        await pool.query('INSERT INTO admin SET realname=?', [realname]);

        req.flash('success', 'Administrador agregado correctamente');
        res.redirect('back');
    } catch (error) {
        console.log(error);
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }
};

export const deleteAdmin = async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM admin WHERE id=?', [id]);
        req.flash('success', 'Administrador eliminado');
        res.redirect('back');
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }
};