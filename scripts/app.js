(function () {

    // Create your own kinvey application
    let baseUrl = "https://baas.kinvey.com";

    // Place your appKey from Kinvey here...
    let appKey = "kid_HkDW2Ayv";

    // Place your appSecret from Kinvey here...
    let appSecret = "6ffafacfffe84d39a1f3a9367021cfa6";

    // Create a guest user using PostMan/RESTClient/Fiddler and place his authtoken here...
    // authtoken from RESTED upon user creation
    var _guestCredentials = "3e5a8882-099b-418d-9dcf-2ddcdf577fb3.pNOF6K84IQf52ddAArBpSa1R9minnPaSx2yBs8CvJ8o=";

    //Create AuthorizationService and Requester

    let authService = new AuthorizationService(
        baseUrl,
        appKey,
        appSecret,
        _guestCredentials);
    
    authService.initAuthorizationType("Kinvey");

    let requester = new Requester(authService);    

    let selector = ".wrapper";
    let mainContentSelector = ".main-content";

    // Create HomeView, HomeController, UserView, UserController, PostView and PostController

    // functionality added
    let homeView = new HomeView(selector, mainContentSelector);
    let homeController = new HomeController(homeView, requester, baseUrl, appKey);

    let userView = new UserView(selector, mainContentSelector);
    let userController = new UserController(userView, requester, baseUrl, appKey);

    let postView = new PostView(selector, mainContentSelector);
    let postController = new PostController(postView, requester, baseUrl, appKey);
    // functionality added
    
    
    initEventServices();

    onRoute("#/", function () {
        // Check if user is logged in and if its not show the guest page, otherwise show the user page...
        if (!authService.isLoggedIn()) {
            homeController.showGuestPage();
        }
        else {
            homeController.showUserPage();
        }
    });

    onRoute("#/post-:id", function () {
        // Create a redirect to one of the recent posts...
        let top = $("#post-" + this.param['id']).position().top();
        $(window).scrollTop(top);
    });

    onRoute("#/login", function () {
        // Show the login page...
        userController.showLoginPage(authService.isLoggedIn())
    });

    onRoute("#/register", function () {
        // Show the register page...
        userController.showRegisterPage(authService.isLoggedIn());
    });

    onRoute("#/logout", function () {
        // Logout the current user...
        userController.logout();
    });

    onRoute('#/posts/create', function () {
        // Show the new post page...
        let data = {
            fullname: sessionStorage['fullname']
        };
        postController.showCreatePostPage(data, authService.isLoggedIn());
    });

    bindEventHandler('login', function (ev, data) {
        // Login the user...
        userController.login(data);
    });

    bindEventHandler('register', function (ev, data) {
        // Register a new user...
        userController.register(data);
    });

    bindEventHandler('createPost', function (ev, data) {
        // Create a new post...
        postController.createPost(data);
    });

    run('#/');
})();