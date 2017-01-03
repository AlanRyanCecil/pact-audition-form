const electron = require('electron');
const { ipcRenderer: ipc } = electron;
const {remote} = electron;
const {app} = remote;
const inFile = require('./inFileSystem');
const audition = require('./auditionFormApp');
const verification = require('./userVerification');

let userDatabaseDirectory = app.getPath('desktop');
let userDatabase = inFile.getUserDatabase(userDatabaseDirectory);

document.getElementById('save-user').addEventListener('click', _=> {
    userDatabase = inFile.getUserDatabase(userDatabaseDirectory);
    inFile.writeUser(audition.user, userDatabase, userDatabaseDirectory);
});

const userDefinition = document.getElementsByClassName('user-definition');

Array.from(userDefinition).map(elem => {
    elem.addEventListener('change', event => {
        let id = event.target.id;
        let value = event.target.value;
        verification.verify(id, value, userDatabase);
    });
});