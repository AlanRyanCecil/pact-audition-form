const fs = require('fs');
const path = require('path');

let userDatabasePath;

exports.getUserDatabase = targetPath => {
    const emptyArray = '[]';
    let userDatabase;
    let userDatabaseDirectory = path.join(targetPath, 'inForm');
    userDatabasePath = path.join(userDatabaseDirectory, 'userDatabase.json');

    if (!fs.existsSync(userDatabaseDirectory)) {
        fs.mkdirSync(userDatabaseDirectory);
    }
    if (!fs.existsSync(userDatabasePath)) {
        fs.writeFileSync(userDatabasePath, emptyArray);
    }
    userDatabase = fs.readFileSync(userDatabasePath);
    return userDatabase;
}

exports.writeUser = (user, database) => {
    let userFileJSON = JSON.parse(database);
    userFileJSON.push(user);
    let userFileString = JSON.stringify(userFileJSON, null, 4);
    fs.writeFileSync(userDatabasePath, userFileString);
}