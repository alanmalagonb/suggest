$("i").click(function(e) {
    e.preventDefault();
    if ($(e.target).hasClass('suggest')) {
        let id = $(this).data('id');
        let url = '/links/';
        if ($(e.target).hasClass('like')) {
            url = url + 'like/suggest/' + id;
        } else if ($(e.target).hasClass('dislike')) {
            url = url + 'dislike/suggest/' + id;
        }
        $.post(url)
            .done(data => {
                $('#likes-count-suggest').text(data.likes.plikes);
                $('#likes-count-suggest').removeClass();
                $('#likes-count-suggest').addClass('fs-6');
                $('#likes-count-suggest').addClass('text-secondary');
                $('#dislikes-count-suggest').text(data.likes.pdislikes * (-1));
                $('#dislikes-count-suggest').removeClass();
                $('#dislikes-count-suggest').addClass('fs-6');
                $('#dislikes-count-suggest').addClass('text-secondary');
                if (data.status > 0) {
                    $('#suggestdislike' + id).removeClass('text-danger');
                    $('#suggestdislike' + id).removeClass('text-secondary');
                    $('#suggestdislike' + id).addClass('text-secondary');
                    $('#suggestlike' + id).removeClass('text-secondary');
                    $('#suggestlike' + id).addClass('text-success');
                } else if (data.status < 0) {
                    $('#suggestlike' + id).removeClass('text-success');
                    $('#suggestlike' + id).removeClass('text-secondary');
                    $('#suggestlike' + id).addClass('text-secondary');
                    $('#suggestdislike' + id).removeClass('text-secondary');
                    $('#suggestdislike' + id).addClass('text-danger');
                } else {
                    $('#suggestlike' + id).removeClass('text-success');
                    $('#suggestdislike' + id).removeClass('text-danger');
                    $('#suggestlike' + id).removeClass('text-secondary');
                    $('#suggestdislike' + id).removeClass('text-secondary');
                    $('#suggestlike' + id).addClass('text-secondary');
                    $('#suggestdislike' + id).addClass('text-secondary');
                }

            });
    } else if ($(e.target).hasClass('comment')) {
        let id = $(this).data('id');
        let url = '/links/';
        if ($(e.target).hasClass('like')) {
            url = url + 'like/comment/' + id;
        } else if ($(e.target).hasClass('dislike')) {
            url = url + 'dislike/comment/' + id;
        }
        $.post(url)
            .done(data => {
                $('#likes-count-comment-' + id).text(data.votes.total);
                $('#likes-count-comment-' + id).removeClass();
                $('#likes-count-comment-' + id).addClass('fs-5');
                if (data.votes.total > 0) {
                    $('#likes-count-comment-' + id).addClass('text-success');
                    $('#likes-count-comment-' + id).text('+' + data.votes.total);
                } else if (data.votes.total < 0) {
                    $('#likes-count-comment-' + id).addClass('text-danger');
                } else {
                    $('#likes-count-comment-' + id).addClass('text-secondary');
                }

                if (data.status > 0) {
                    $('#commentdislike' + id).removeClass('text-danger');
                    $('#commentdislike' + id).removeClass('text-secondary');
                    $('#commentdislike' + id).addClass('text-secondary');
                    $('#commentlike' + id).removeClass('text-secondary');
                    $('#commentlike' + id).addClass('text-success');
                } else if (data.status < 0) {
                    $('#commentlike' + id).removeClass('text-success');
                    $('#commentlike' + id).removeClass('text-secondary');
                    $('#commentlike' + id).addClass('text-secondary');
                    $('#commentdislike' + id).removeClass('text-secondary');
                    $('#commentdislike' + id).addClass('text-danger');
                } else {
                    $('#commentlike' + id).removeClass('text-success');
                    $('#commentdislike' + id).removeClass('text-danger');
                    $('#commentlike' + id).removeClass('text-secondary');
                    $('#commentdislike' + id).removeClass('text-secondary');
                    $('#commentlike' + id).addClass('text-secondary');
                    $('#commentdislike' + id).addClass('text-secondary');
                }

            });
    } else if ($(e.target).hasClass('reply')) {
        let id = $(this).data('id');
        let url = '/links/';
        if ($(e.target).hasClass('like')) {
            url = url + 'like/reply/' + id;
        } else if ($(e.target).hasClass('dislike')) {
            url = url + 'dislike/reply/' + id;
        }
        $.post(url)
            .done(data => {
                $('#likes-count-reply-' + id).text(data.votes.total);
                $('#likes-count-reply-' + id).removeClass();
                $('#likes-count-reply-' + id).addClass('fs-5');
                if (data.votes.total > 0) {
                    $('#likes-count-reply-' + id).addClass('text-success');
                    $('#likes-count-reply-' + id).text('+' + data.votes.total);
                } else if (data.votes.total < 0) {
                    $('#likes-count-reply-' + id).addClass('text-danger');
                } else {
                    $('#likes-count-reply-' + id).addClass('text-secondary');
                }

                if (data.status > 0) {
                    $('#replydislike' + id).removeClass('text-danger');
                    $('#replydislike' + id).removeClass('text-secondary');
                    $('#replydislike' + id).addClass('text-secondary');
                    $('#replylike' + id).removeClass('text-secondary');
                    $('#replylike' + id).addClass('text-success');
                } else if (data.status < 0) {
                    $('#replylike' + id).removeClass('text-success');
                    $('#replylike' + id).removeClass('text-secondary');
                    $('#replylike' + id).addClass('text-secondary');
                    $('#replydislike' + id).removeClass('text-secondary');
                    $('#replydislike' + id).addClass('text-danger');
                } else {
                    $('#replylike' + id).removeClass('text-success');
                    $('#replydislike' + id).removeClass('text-danger');
                    $('#replylike' + id).removeClass('text-secondary');
                    $('#replydislike' + id).removeClass('text-secondary');
                    $('#replylike' + id).addClass('text-secondary');
                    $('#replydislike' + id).addClass('text-secondary');
                }

            });
    }

});