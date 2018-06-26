function dbConfig(){
 
    return config = {
        
        user: process.env.user_database || global.userDB, 
        password: process.env.password_database || global.passwordDB,
        server: process.env.server_database || global.serverDB,
        database: process.env.name_database || global.DB
    }
}

function dbMaster(){ 
    return config = {
        user: process.env.user_database || 'sa',
        password: process.env.password_database || 'paleC0nsult0res',
        server: process.env.server_database || 'localhost',
        database: process.env.name_database || 'PALERPmaster'   
    }   
}
module.exports = { dbConfig , dbMaster }
