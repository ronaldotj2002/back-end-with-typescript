import bcrypt from 'bcrypt';

const encriptSenha = async (request: any) => {

    if(request.payload.senha) {
        request.payload = {
            ...request.payload,
            senha: await bcrypt.hash(request.payload.senha, 10)
        }
    }
    return request
}

export {encriptSenha}