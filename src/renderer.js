'use strict';
const electron = require('electron'),
    { ipcRenderer: ipc } = electron,
    {remote} = electron,
    {app} = remote,
    audition = require('./auditionFormApp'),
    inFile = require('./modules/inFileSystem'),
    verification = require('./modules/userVerification');

let userDatabaseDirectory = app.getPath('desktop'),
    userDatabase = inFile.getExistingOrCreateNewFile(userDatabaseDirectory, 'userDatabase.json', '{}'),
    adminDatabase = inFile.getExistingOrCreateNewFile(userDatabaseDirectory, 'adminDatabase.json', '["qqmonnov111901"]'),
    user = audition.user,
    userKey;

function userHistory() {
    user = audition.user;
    userKey = verification.getUserKey(user);
    console.log('new user key from history: ', userKey);
    userDatabase = inFile.getExistingOrCreateNewFile(userDatabaseDirectory, 'userDatabase.json');
    return verification.userLookup(userKey, userDatabase);
}

ipc.on('updateUser', (event, userOrAdmin, newName, oldName) => {
    if (oldName) {
        userDatabase = JSON.parse(userDatabase);
        userDatabase.Key = verification.getUserKey(audition.user);
        userDatabase = JSON.stringify(userDatabase);
    }
    let fileName = userOrAdmin.concat('Database.json');
    console.log('attempted update');
    if (userHistory()) {
        inFile.writeUser(userKey, user, userDatabase, userDatabaseDirectory, fileName);
        console.log('update');
    }
});

ipc.on('userLogout', _=> {
    user = null;
    userKey = null;
});

ipc.on('removeUser', (event, user) => {
    console.log('user: ', user.key);
    let database = JSON.parse(userDatabase);
    delete database[user.key];
    inFile.updateUserDatabase(userDatabaseDirectory, database);
})

// document.getElementById('login-form').addEventListener('submit', _=> {
ipc.on('login-submit', _=> {
    let foundHistory = userHistory();
    let adminArray = JSON.parse(adminDatabase);
    for (let admin in adminArray) {
        if (userKey === adminArray[admin]) {
            ipc.send('adminLogin', JSON.parse(userDatabase));
        } else if (foundHistory) {
            ipc.send('userHistoryFound', foundHistory);
        } else {
            ipc.send('userLogin');
            inFile.writeUser(userKey, user, userDatabase, userDatabaseDirectory, 'userDatabase.json');
        }
    }
});

// const userDefinition = document.getElementsByClassName('user-definition');

// Array.from(userDefinition).map(elem => {
//     elem.addEventListener('change', event => {
//         let foundHistory = userHistory();
//         if (foundHistory) ipc.send('userHistoryFound', foundHistory);
//         for (let admin in adminDatabase) {
//         console.log(admin);
//             if (userKey === admin) ipc.send('adminLogin');
//         }
//     });
// });