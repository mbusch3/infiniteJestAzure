module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const user = (req.query.user || (req.body && req.body.user));
    const pull = (req.query.pull || (req.body && req.body.pull));
    let responseMessage = '';
    if (!user) {
        responseMessage = "You just want all the jokes, don't you?";
    }
    else if (pull && pull == 'mine') {
        responseMessage = "You want all the jokes that you've submitted.";
    }
    else if (pull && pull == 'others') {
        responseMessage = "You want to see everyone else's jokes.";
    }
    else {
        responseMessage = "I have no idea what you want, but I know who you are.";
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}