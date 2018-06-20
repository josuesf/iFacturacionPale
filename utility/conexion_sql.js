function dbConfig(){
 
    return config = {
        user: process.env.user_database || global.userDB, // update me
        password: process.env.password_database || global.passwordDB, // update me
        server: process.env.server_database || global.serverDB,
        database: process.env.name_database || global.DB
    }
}

function dbMaster(){ 
    return config = {
        user: process.env.user_database || 'sa', // update me
        password: process.env.password_database || 'paleC0nsult0res', // update me
        server: process.env.server_database || 'localhost',
        database: process.env.name_database || 'PALERPmaster'   
    }   
}
module.exports = { dbConfig , dbMaster }
