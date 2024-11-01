const db = require('./conn');

const cadastrarUsuario = async (nome, email) => {
    try {
        const sql = 'INSERT INTO cadastro (nome, email) VALUES (?, ?)';
        const [result] = await db.query(sql, [nome, email]);
        console.log('Usuário cadastrado com sucesso! ID:', result.insertId);
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
    }
};

module.exports = { cadastrarUsuario };
