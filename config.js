const API_AI_CLIENT_ACCESS_TOKEN = '64bc212a802a4aafb1dfef61eb0fe70e';
module.exports = {
    FB_PAGE_TOKEN: "EAACIqS6YbZAYBACEgcsHZBIeDyT9bwDJTS4h1YqhpUwse5qWTg4T15VUm0GLRr0UJC9AZAPX7w00z2mZCx6rSXaeLDqog79DsTAYSX2cNYlUBDwWQkHU6nZCeKXSmfZAwGAaFyBSzJ0RKSLYd3S4kfT48ZCd5y3fZBQlRITJlcnidgZDZD",
    FB_VERIFY_TOKEN: "dfcommunicationbot100714",
    API_AI_CLIENT_ACCESS_TOKEN,
    FB_APP_SECRET: "c8ddd656d2bb48f44269fa13971a333fe",
    // apiAiService: (apiai) => {
    //     (API_AI_CLIENT_ACCESS_TOKEN, {
    //         language: "en",
    //         requestSource: "fb"
    //     })
    // },
    isDefined: function (obj) {
        if (typeof obj == "undefined") {
            return false;
        }
        if (!obj) {
            return false;
        }
        return obj != null;
    }

};

