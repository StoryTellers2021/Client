const storyApiUrl = 'http://localhost:8080/Server/v1/api';
var storyApiResponse = {};

function requestStoryAPI() {
    requestJSON(
        storyApiUrl,
        function (responseObject) {
            storyApiResponse = responseObject;
            // TODO: Put the function calls to refresh the game with the new story here.
            // responseObject.unsolvedStory
            // responseObject.solvedStory
            // responseObject.solvableWordIndexes
        }, function () {
            log('Oh no, the story failed to load!', LOG_FAILURE);
            // TODO: Put the error handling stuff here.
        }, false
    );
}
