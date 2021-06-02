const crypto = require('crypto');
const connection = require('../../database/connection');

module.exports = {
    async sha512(password, salt){
        var hash = crypto.createHmac('sha512', salt); // Algoritmo de cripto sha512
        hash.update(password);
        hash = hash.digest('hex');
        return {
            salt,
            hash,
        };
    },

    async generateSalt(){
        return crypto.randomBytes(Math.ceil(16))
                .toString('hex')
                .slice(0,16); 
    },

    async validate(password, password_hash, salt){
        var password_encrypted = await this.sha512(password, salt);
        if(password_encrypted.hash === password_hash){
            return true;
        }else{
            return false;
        }
    },

    async authenticate(id, token){

        const result = await connection('user')
            .where('id', id)
            .select('salt_session')
            .first();
        
        if(result && result.salt_session != null){
            const salt = result.salt_session;
            const validation = await this.validate(
                id,
                token,
                salt);
            
            return validation;
        }else{
            return false;
        }
        
    }
}