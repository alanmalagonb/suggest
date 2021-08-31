import { pool, poola, poolp } from "../database";
import { getAvatar } from "../lib/helpers";
import { validationResult } from "express-validator";
const emojiRegex = require('emoji-regex/es2015/index.js');

export const renderAddLink = async(req, res) => {
    try {
        const permission = await poolp.query('SELECT luckperms_user_permissions.permission FROM luckperms_players, luckperms_user_permissions WHERE luckperms_players.username = ?', [req.user.username]);
        var hasPermission = false;
        for (var key in permission) {
            if (permission[key].permission === "group.vip" || permission[key].permission === "group.vip+") {
                hasPermission = true;
                break;
            }
        }
        res.render("links/add", { hasPermission });
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('/links/add');
    }

};

export const addLink = async(req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorstxt = errors.mapped();
        var msg = "";
        for (var key in errorstxt) {
            msg += "<p>" + errorstxt[key].msg + " </p> ";
        }
        req.flash('error', msg);
        res.redirect('/links/add');
        return;
    }

    try {
        const { title, description } = req.body;

        const permission = await poolp.query('SELECT luckperms_user_permissions.permission FROM luckperms_players, luckperms_user_permissions WHERE luckperms_players.username = ?', [req.user.username]);
        var hasPermission = false;
        for (var key in permission) {
            if (permission[key].permission === "group.vip" || permission[key].permission === "group.vip+") {
                hasPermission = true;
                break;
            }
        }

        const regex = emojiRegex();
        let match = regex.exec(description) || false;

        const newLink = {
            title,
            body: description.toString(),
            player_id: req.user.id,
            status_id: 1,
        };
        if (match && !hasPermission) {
            req.flash('message', 'Debes ser Vip/Vip+ para usar emojis');
            res.redirect('/links/add');
        } else {
            await pool.query('INSERT INTO links set ?', [newLink]);
            req.flash('success', 'Sugerencia añadida correctamente!');
            res.redirect('/links/pag/1');
        }
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('/links/pag/1');
    }
};

export const addComment = async(req, res) => {

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

    const { id } = req.params;

    const { comment } = req.body;
    const newComment = {
        text: comment,
        links_id: id,
        player_id: req.user.id
    };

    try {
        const idExists = await pool.query('SELECT * FROM links WHERE id=?', [id]);
        if (!idExists[0]) {
            req.flash('error', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');
            return;
        }
        await pool.query('INSERT INTO comments set ?', [newComment]);
        req.flash('success', 'Comentario añadido');
        res.redirect('/links/detail/' + id);
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('/links/detail/' + id);
    }

};

export const replyComment = async(req, res) => {

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

    const { id, idr } = req.params;
    const { reply } = req.body;
    const newReply = {
        text: reply,
        comment_id: id,
        player_id: req.user.id,
        reply_id: idr
    };

    try {
        const idExists = await pool.query('SELECT * FROM comments WHERE id=?', [id]);
        if (!idExists[0]) {
            req.flash('error', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');
            return;
        }
        await pool.query('INSERT INTO reply set ?', [newReply]);
        req.flash('success', 'Comentario añadido');
        res.redirect('back');
    } catch (error) {
        console.log(error);
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }

};

export const updateComment = async(req, res) => {
    const errors = validationResult(req);
    console.log(errors);
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

    const { id } = req.params;
    const { text } = req.body;

    try {
        const idExists = await pool.query('SELECT * FROM comments WHERE id=?', [id]);
        if (!idExists[0] || idExists[0].player_id != req.user.id) {
            req.flash('error', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');
            return;
        }
        await pool.query('UPDATE comments SET text=? WHERE id=?', [text, id]);
        req.flash('success', 'Comentario actualizado');
        res.redirect('back');
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }

};

export const updateReplyComment = async(req, res) => {
    const errors = validationResult(req);
    console.log(errors);
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

    const { id } = req.params;
    const { text } = req.body;

    try {
        const idExists = await pool.query('SELECT * FROM reply WHERE id=?', [id]);
        if (!idExists[0] || idExists[0].player_id != req.user.id) {
            req.flash('error', 'Algo salió mal. Inténtalo de nuevo más tarde.');
            res.redirect('back');
            return;
        }
        await pool.query('UPDATE reply SET text=? WHERE id=?', [text, id]);
        req.flash('success', 'Comentario actualizado');
        res.redirect('back');
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }

};

export const renderLinksByPage = async(req, res) => {
    try {
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

        const { id } = req.params;

        const page = id;
        const numPerPage = 10;
        const skip = (Number(page) - 1) * numPerPage;
        const limit = skip + ',' + numPerPage;
        const rows = await pool.query('SELECT count(*) as numRows FROM links');
        const numRows = rows[0].numRows;
        const numPages = Math.ceil(numRows / numPerPage);
        const links = await pool.query('SELECT links.*, images.filename AS image,lastlogin.last_con FROM links LEFT JOIN images ON links.player_id=images.player_id LEFT JOIN lastlogin ON links.player_id=lastlogin.player_id LIMIT ' + limit);

        if (!(links[0]) && page != 1) {
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
        res.render('links/list', { links, pagination, numPages });
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }

};

export const renderMyLinks = async(req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE player_id=?', [req.user.id]);
    res.render('links/list', { links });
};

export const renderLinksByStatus = async(req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE status_id=?', [id]);
    if (!links[0]) {
        res.redirect('/links');
        return;
    }
    res.render('links/list', { links });
};

export const renderDetailedLink = async(req, res) => {
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
        res.render('links/detail', { links, comments, title, body, created_at, status_id, url, own, idl, likes, likedby, voteType, progressBar });
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');

    }

};

export const deleteLink = async(req, res) => {
    try {
        const { id } = req.params;
        const link = await pool.query('SELECT player_id FROM links WHERE id=?', [id]);
        if (!links[0]) {
            req.flash('message', 'La sugerencia no existe.');
            res.redirect('back');
            return;
        }
        if (link[0].player_id == req.user.id) {
            await pool.query('DELETE FROM links where id=?', [id]);
            req.flash('success', 'Sugerencia eliminada correctamente!');
        } else {
            req.flash('success', 'No puedes borrar esta sugerencia');
        }
        res.redirect('/links');
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }
};

export const deleteComment = async(req, res) => {
    try {
        const { id } = req.params;
        const comment = await pool.query('SELECT * FROM comments WHERE id=?', [id]);
        if (!comment[0] || comment[0].player_id != req.user.id) {
            req.flash('message', 'El comentario no te pertenece.');
            res.redirect('back');
            return;
        }
        await pool.query('DELETE FROM comments where id=?', [id]);
        req.flash('success', 'Comentario eliminado correctamente');
        res.redirect('back');
    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
        console.log(error);
    }

};

export const deleteReply = async(req, res) => {
    try {
        const { id } = req.params;

        const reply = await pool.query('SELECT * FROM reply where id=?', [id]);
        if (!reply[0] || reply[0].player_id != req.user.id) {
            req.flash('message', 'El comentario no te pertenece.');
            res.redirect('back');
            return;
        }

        await pool.query('DELETE FROM reply where id=?', [id]);
        req.flash('success', 'Comentario eliminado correctamente');
        res.redirect('back');

    } catch (error) {
        req.flash('message', 'Algo salió mal. Inténtalo de nuevo más tarde.');
        res.redirect('back');
    }

};

export const likeSuggest = async(req, res) => {
    try {
        const { id } = req.params;
        const player_id = req.user.id;
        let newVote = {
            player_id,
            suggest_id: id,
            voting_id: 1
        }
        const isLiked = await pool.query('SELECT * FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);
        if (isLiked[0]) {
            if (isLiked[0].voting_id == 1) {
                await pool.query('DELETE FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);
            } else {
                await pool.query('DELETE FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);
                await pool.query('INSERT INTO votingSuggest SET ?', [newVote]);
            }
        } else {
            await pool.query('INSERT INTO votingSuggest SET ?', [newVote]);
        }

        const count = await pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingSuggest where suggest_id=?', [id]);
        const votingid = await pool.query('SELECT voting_id FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);
        const progress = await pool.query('SELECT (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=1) AS plikes, (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=-1) as pdislikes', [id, id]);

        let status;
        if (!votingid[0]) status = 0
        else status = votingid[0].voting_id;
        let likes;
        if (progress[0]) likes = progress[0];
        else likes = {
            plikes: 0,
            pdislikes: 0,
        };
        const data = {
            votes: count[0],
            status,
            likes
        }
        res.json(data);
    } catch (error) {
        res.json({ error: 'Algo salió mal. Inténtalo de nuevo más tarde.' });
    }

}

export const dislikeSuggest = async(req, res) => {
    try {
        const { id } = req.params;
        const player_id = req.user.id;
        let newVote = {
            player_id,
            suggest_id: id,
            voting_id: -1
        }
        const isLiked = await pool.query('SELECT * FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);

        if (isLiked[0]) {
            if (isLiked[0].voting_id == -1) {
                await pool.query('DELETE FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);
            } else {
                await pool.query('DELETE FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);
                await pool.query('INSERT INTO votingSuggest SET ?', [newVote]);
            }
        } else {
            await pool.query('INSERT INTO votingSuggest SET ?', [newVote]);
        }

        const count = await pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingSuggest where suggest_id=?', [id]);
        const votingid = await pool.query('SELECT voting_id FROM votingSuggest WHERE player_id=? AND suggest_id=?', [player_id, id]);
        const progress = await pool.query('SELECT (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=1) AS plikes, (SELECT IFNULL(SUM(voting_id),0) FROM votingSuggest where suggest_id=? AND voting_id=-1) as pdislikes', [id, id]);

        let status;
        if (!votingid[0]) status = 0
        else status = votingid[0].voting_id;
        let likes;
        if (progress[0]) likes = progress[0];
        else likes = {
            plikes: 0,
            pdislikes: 0,
        };
        const data = {
            votes: count[0],
            status,
            likes
        }
        res.json(data);
    } catch (error) {
        res.json({ error: 'Algo salió mal. Inténtalo de nuevo más tarde.' });
    }
}

export const likeComment = async(req, res) => {
    try {
        const { id } = req.params;
        const player_id = req.user.id;
        let newVote = {
            player_id,
            comment_id: id,
            voting_id: 1
        }
        const isLiked = await pool.query('SELECT * FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);
        if (isLiked[0]) {
            if (isLiked[0].voting_id == 1) {
                await pool.query('DELETE FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);
            } else {
                await pool.query('DELETE FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);
                await pool.query('INSERT INTO votingcomment SET ?', [newVote]);
            }
        } else {
            await pool.query('INSERT INTO votingcomment SET ?', [newVote]);
        }

        const count = await pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingcomment where comment_id=?', [id]);
        const votingid = await pool.query('SELECT voting_id FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);
        let status;
        if (!votingid[0]) status = 0
        else status = votingid[0].voting_id;
        const data = {
            votes: count[0],
            status
        }
        res.json(data);
    } catch (error) {
        res.json({ error: 'Algo salió mal. Inténtalo de nuevo más tarde.' });
    }

}

export const dislikeComment = async(req, res) => {
    try {
        const { id } = req.params;
        const player_id = req.user.id;
        let newVote = {
            player_id,
            comment_id: id,
            voting_id: -1
        }
        const isLiked = await pool.query('SELECT * FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);
        if (isLiked[0]) {
            if (isLiked[0].voting_id == -1) {
                await pool.query('DELETE FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);
            } else {
                await pool.query('DELETE FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);
                await pool.query('INSERT INTO votingcomment SET ?', [newVote]);
            }
        } else {
            await pool.query('INSERT INTO votingcomment SET ?', [newVote]);
        }

        const count = await pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingcomment where comment_id=?', [id]);
        const votingid = await pool.query('SELECT voting_id FROM votingcomment WHERE player_id=? AND comment_id=?', [player_id, id]);
        let status;
        if (!votingid[0]) status = 0
        else status = votingid[0].voting_id;
        const data = {
            votes: count[0],
            status
        }
        res.json(data);
    } catch (error) {
        res.json({ error: 'Algo salió mal. Inténtalo de nuevo más tarde.' });
    }
}

export const likeReply = async(req, res) => {
    try {
        const { id } = req.params;
        const player_id = req.user.id;
        let newVote = {
            player_id,
            reply_id: id,
            voting_id: 1
        }
        const isLiked = await pool.query('SELECT * FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);
        if (isLiked[0]) {
            if (isLiked[0].voting_id == 1) {
                await pool.query('DELETE FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);
            } else {
                await pool.query('DELETE FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);
                await pool.query('INSERT INTO votingreply SET ?', [newVote]);
            }
        } else {
            await pool.query('INSERT INTO votingreply SET ?', [newVote]);
        }

        const count = await pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingreply where reply_id=?', [id]);
        const votingid = await pool.query('SELECT voting_id FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);

        let status;
        if (!votingid[0]) status = 0
        else status = votingid[0].voting_id;
        const data = {
            votes: count[0],
            status
        }
        res.json(data);
    } catch (error) {
        res.json({ error: 'Algo salió mal. Inténtalo de nuevo más tarde.' });
    }

}

export const dislikeReply = async(req, res) => {
    try {
        const { id } = req.params;
        const player_id = req.user.id;
        let newVote = {
            player_id,
            reply_id: id,
            voting_id: -1
        }
        const isLiked = await pool.query('SELECT * FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);
        if (isLiked[0]) {
            if (isLiked[0].voting_id == -1) {
                await pool.query('DELETE FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);
            } else {
                await pool.query('DELETE FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);
                await pool.query('INSERT INTO votingreply SET ?', [newVote]);
            }
        } else {
            await pool.query('INSERT INTO votingreply SET ?', [newVote]);
        }

        const count = await pool.query('SELECT IFNULL(SUM(voting_id),0) as total FROM votingreply where reply_id=?', [id]);
        const votingid = await pool.query('SELECT voting_id FROM votingreply WHERE player_id=? AND reply_id=?', [player_id, id]);
        let status;
        if (!votingid[0]) status = 0
        else status = votingid[0].voting_id;
        const data = {
            votes: count[0],
            status
        }
        res.json(data);
    } catch (error) {
        res.json({ error: 'Algo salió mal. Inténtalo de nuevo más tarde.' });
    }
}