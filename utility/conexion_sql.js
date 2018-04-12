// Create connection to database
var dbConfig = {
    user: process.env.user_database || 'sa', // update me
    password: process.env.password_database || 'paleC0nsult0res', // update me
    server: process.env.server_database || 'localhost',
    database: process.env.name_database || 'PALERPmisky'
}
exports.dbConfig = dbConfig;
