import bcrypt from "bcryptjs";
import mcapi from "minecraft-lookup";
import path from "path";

export const encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(16);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

export const matchPassword = async(password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log(e);
    }
};

export const timeagoes = (number, index) => {
    return [
        ['justo ahora', 'en un rato'],
        ['hace %s segundos', 'en %s segundos'],
        ['hace 1 minuto', 'en 1 minuto'],
        ['hace %s minutos', 'en %s minutos'],
        ['hace 1 hora', 'en 1 hora'],
        ['hace %s horas', 'en %s horas'],
        ['hace 1 día', 'en 1 día'],
        ['hace %s días', 'en %s días'],
        ['hace 1 semana', 'en 1 semana'],
        ['hace %s semanas', 'en %s semanas'],
        ['hace 1 mes', 'en 1 mes'],
        ['hace %s meses', 'en %s meses'],
        ['hace 1 año', 'en 1 año'],
        ['hace %s años', 'en %s años'],
    ][index];
};

export const getAvatar = async(realname) => {
    try {
        const { helmavatar } = await mcapi.head(realname);
        return helmavatar;
    } catch (e) {
        console.log(e);
        return "/img/steve.png";
    }


};

export const randomNumber = () => {
    const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    let randomNumber = 0;
    for (let i = 0; i < 6; i++) {
        randomNumber += possible.charAt(
            Math.floor(Math.random() * possible.length)
        );
    }
    return randomNumber;
};

export const getFileName = (filename) => {
    return filename.replace(path.extname(filename), "");
}