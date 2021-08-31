import { body, param } from "express-validator";

export const checkAddLink = [body('title', 'Escribe un título').not().isEmpty(),
    body('description', 'Escribe una descripción').not().isEmpty()
];

export const checkAddComment = [param('id', 'La sugerencia no existe').isNumeric(),
    body('comment', 'Escribe un comentario').not().isEmpty(),
];

export const checkAddReply = [param('id', 'El comentario no existe').isNumeric(),
    body('reply', 'Escribe una respuesta').not().isEmpty(),
];

export const checkAddRReply = [param('id', 'El comentario no existe').isNumeric(),
    param('idr', 'El comentario no existe').isNumeric(),
    body('reply', 'Escribe una respuesta').not().isEmpty(),
];

export const checkPage = [param('id', 'La página no existe').isNumeric()];

export const checkUpdateReply = [param('id', 'El comentario no existe').isNumeric(), body('text', 'Escribe un comentario').not().isEmpty()];

export const checkUpdateComment = [param('id', 'El comentario no existe').isNumeric(), body('text', 'Escribe un comentario').not().isEmpty()];

export const checkSignIn = [body('username', 'Escribe un usuario.').not().isEmpty(), body('password', 'Escribe una contraseña,').not().isEmpty()];