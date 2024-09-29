const users = {};

const getUserByEmail = (userEmail) => {
    return users[userEmail];
}

const getUserByEmailAndToken = (userEmail,token) => {
    const user = users[userEmail];
    if (user) {
        const hasToken = user.tokens.find(t => t.token == token);
        
        if(hasToken)
            return user;
    }
}

const saveUserByEmail = (userEmail, body) => {
    users[userEmail] = body;
}

// use for single deveice logout
const deleteSingleTokenByEmail = (userEmail,token) => {
    const user = users[userEmail];
    if (user) {
        user.tokens = user.tokens.filter(t => t.token !== token);

        // if thire was single device and that logout then making all device logout
        if(user.tokens.length == 0)
            removeUserByEmail(userEmail);
    }
}

// use for all device logout
const removeUserByEmail = (userEmail) => {
    delete users[userEmail];
}

const redisServer = {getUserByEmail, saveUserByEmail, deleteSingleTokenByEmail, removeUserByEmail, getUserByEmailAndToken}
export default redisServer;