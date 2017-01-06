const fs = require('fs');
const path = require('path');
const appDirectory = 'inForm';
const databaseFileName = 'userDatabase.json';



exports.getFilePath = (directoryPath, fileName) => {
    return path.join(directoryPath, appDirectory, fileName);
}

exports.getExistingOrCreateNewFile = (databaseDirectory, fileName, dataForNewFile) => {
    let userDatabase,
        userDirectory = path.join(databaseDirectory, appDirectory),
        filePath = path.join(userDirectory, fileName)

    if (!fs.existsSync(userDirectory)) {
        fs.mkdirSync(userDirectory);
    }
    if (!fs.existsSync(filePath)) {
        console.log('dataForNewFile: ', dataForNewFile)
        fs.writeFileSync(filePath, dataForNewFile);
    }
    userDatabase = fs.readFileSync(filePath);
    return userDatabase;
}

exports.writeUser = (key, user, database, directory, fileName) => {
    user.key = key;
    let filePath = path.join(directory, appDirectory, fileName);
    let userFileJSON = JSON.parse(database);
    userFileJSON[key] = user;
    let userFileString = JSON.stringify(userFileJSON, null, 4);
    fs.writeFileSync(filePath, userFileString);
}

exports.updateUserDatabase = (databaseDirectory, database) => {
    let filePath = path.join(databaseDirectory, appDirectory, databaseFileName);
    console.info('filePath: ', filePath);
    fs.writeFileSync(filePath, JSON.stringify(database, null, 4));
}