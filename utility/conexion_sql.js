function dbConfig(){ 
    return global.cadenaConexion
    /*return config = {
        
        user: process.env.user_database || global.userDB, 
        password: process.env.password_database || global.passwordDB,
        server: process.env.server_database || global.serverDB,
        database: process.env.name_database || global.DB,
        requestTimeout: 30000,
        connectionTimeout: 30000
    }*/
}

function dbMaster(){ 
    return config = {
        user: process.env.user_database || 'sa',
        password: process.env.password_database || 'paleC0nsult0res',
        server: process.env.server_database || 'localhost',
        database: process.env.name_database || 'PALERPmaster',
        requestTimeout: 30000,
        connectionTimeout: 30000
    }   
}
module.exports = { dbConfig , dbMaster }
