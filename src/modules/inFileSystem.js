const fs = require('fs');
const path = require('path');

let userDatabasePath;

exports.getUserDatabase = targetPath => {
    const empty= '{}';
    let userDatabase;
    let userDatabaseDirectory = path.join(targetPath, 'inForm');
    userDatabasePath = path.join(userDatabaseDirectory, 'userDatabase.json');

    if (!fs.existsSync(userDatabaseDirectory)) {
        fs.mkdirSync(userDatabaseDirectory);
    }
    if (!fs.existsSync(userDatabasePath)) {
        fs.writeFileSync(userDatabasePath, empty);
    }
    userDatabase = fs.readFileSync(userDatabasePath);
    return userDatabase;
}

exports.writeUser = (key, user, database) => {
    let userFileJSON = JSON.parse(database);
    userFileJSON[key] = user;
    let userFileString = JSON.stringify(userFileJSON, null, 4);
    fs.writeFileSync(userDatabasePath, userFileString);
}