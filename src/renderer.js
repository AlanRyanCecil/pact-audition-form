const electron = require('electron'),
    { ipcRenderer: ipc } = electron,
    {remote} = electron,
    {app} = remote,
    audition = require('./auditionFormApp'),
    inFile = require('./modules/inFileSystem'),
    verification = require('./modules/userVerification');

let userDatabaseDirectory = app.getPath('desktop'),
    userDatabase = inFile.getUserDatabase(userDatabaseDirectory),
    user = audition.user,
    userKey;

function userHistory() {
    user = audition.user;
    userKey = verification.getUserKey(user);
    userDatabase = inFile.getUserDatabase(userDatabaseDirectory);
    return verification.userLookup(userKey, userDatabase);
}

ipc.on('updateUser', (event, key, value) => {
    console.log('attempted update');
    if (userHistory()) {
        inFile.writeUser(userKey, user, userDatabase, userDatabaseDirectory);
        console.log('update');
    }
});

document.getElementById('save-user').addEventListener('click', _=> {
    userHistory();
    inFile.writeUser(userKey, user, userDatabase, userDatabaseDirectory);
});

const userDefinition = document.getElementsByClassName('user-definition');

Array.from(userDefinition).map(elem => {
    elem.addEventListener('change', event => {
        let foundHistory = userHistory();
        if (foundHistory) ipc.send('userHistoryFound', foundHistory);
    });
});