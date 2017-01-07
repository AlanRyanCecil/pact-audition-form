exports.getUserKey = user => {
    let first = user.name.first || '',
        last = user.name.last || '',

        birthdate = (user.birthdate || '').toString()
            .replace(/ /g, '')
            .replace(/(\w{6}\d{6}).*/, (match, one) => {return one})
            .toLowerCase();
    first = first.toLowerCase();
    last = last.toLowerCase();
    return [first, last, birthdate].join('');
}

exports.userLookup = (key, database) => {
    let userDatabaseJSON = JSON.parse(database);
    return userDatabaseJSON[key] || false;
}