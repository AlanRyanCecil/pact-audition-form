const electron = require('electron'),
    { ipcRenderer: ipc } = electron,
    {remote} = electron,
    {app} = remote,
    audition = require('./ngSrc/auditionFormApp'),
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

ipc.on('userLogin', _=> {
    userHistory();
    inFile.writeUser(userKey, user, userDatabase, userDatabaseDirectory);
});

ipc.on('updateUser', (event, key, value) => {
    console.log('attempted update');
    if (userHistory()) {
        inFile.writeUser(userKey, user, userDatabase, userDatabaseDirectory);
        console.log('update');
    }
});

ipc.on('userLogout', _=> {
    user = null;
    userKey = null;
})

// document.getElementById('user-login').addEventListener('click', _=> {
//     userHistory();
//     inFile.writeUser(userKey, user, userDatabase, userDatabaseDirectory);
// });

const userDefinition = document.getElementsByClassName('user-definition');

Array.from(userDefinition).map(elem => {
    elem.addEventListener('change', event => {
        let foundHistory = userHistory();
        if (foundHistory) ipc.send('userHistoryFound', foundHistory);
        if (userKey === 'davidgotleibsatnov111111') ipc.send('adminLogin');
    });
});