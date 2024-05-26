const { buildURLWithParams, isEmpty } = require("#Helpers/helpers");

const UserTrait = {

    /**
     * Parses an user to remove @
     * @param {String} userToParse The user that will be parsed
     * @returns {string} The user parsed
     */
    parseUser(userToParse) {

        let parsedUser = userToParse;

        if (userToParse.charAt(0) === "@") 
            parsedUser = parsedUser.slice(1);

        return parsedUser;
        
    },

    /**
     * Get an user information by its username
     * @param {String} username The username of the user you want to get information
     * @returns {Object} The user information
     */
    async getUserByUsername(username) {

        const {
            clientId,
            endpoints: { user },
            token: { access_token }
        } = this;

        try {

            const userData = await axios({
                method: "get",
                url: buildURLWithParams(user, {
                    login: this.parseUser(username)
                }),
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Client-Id": clientId
                }
            });

            return userData.data.data[0];
        
        } catch (error) {
            console.log(error);
            // if unauthorized refresh token
        }   

    },

    /**
     * Get an user information by its id
     * @param {Number} id The id of the user you want to get information
     * @returns {Object} The user information
     */
    async getUserByUserId(userId) {

        const {
            clientId,
            endpoints: { user },
            token: { access_token }
        } = this;

        try {

            const userData = await axios({
                method: "get",
                url: buildURLWithParams(user, {
                    id: userId
                }),
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Client-Id": clientId
                }
            });

            return userData.data.data[0];
        
        } catch (error) {
            console.log(error);
            // if unauthorized refresh token
        }   

    }

}

module.exports = { UserTrait };