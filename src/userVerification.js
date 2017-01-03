const userDefinition = {};

exports.verify = (id, value, userData) => {
    let userDatabase = JSON.parse(userData);
    console.log(userDatabase[0]);
    userDefinition[id] = value;
    return userDefinition;
}