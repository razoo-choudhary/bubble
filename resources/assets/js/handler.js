$(function ($){
    $("#auth-signin").on( "submit", function ( e ) {
        e.preventDefault()
        CreatePostRequest($(this).serializeArray(), $('#auth-signin-alert'), "/signin")
    })

    $("#auth-signup").on( "submit", function ( e ) {
        e.preventDefault()
        CreatePostRequest($(this).serializeArray(), $('#auth-signup-alert'), "/signup")
    })

    $("#auth-forgot-password").on( "submit", function ( e ) {
        e.preventDefault();
        CreatePostRequest($(this).serializeArray(), $("#auth-forgot-password-alert"), "/forgot-password")
    })

    $("#auth-reset-password").on( "submit", function ( e ) {
        e.preventDefault();
        CreatePostRequest($(this).serializeArray(), $("#auth-reset-password-alert"), "/reset-password")
    })

    $('#new-friend-request').on("submit", function (e){
        e.preventDefault();
        UpdateContactPreferences($(this).serializeArray(),'/request/create')
    })

    $("#createNewGroup").on("submit", function (e){
        e.preventDefault();
        CreateNewGroup($(this).serializeArray(), "/group/create")
    })

    $('.change-mode').on("click", function () {
        let bodySelector = $('body');
        UpdateUserPreferences( {
            mode : bodySelector.attr('data-layout-mode') ? bodySelector.attr('data-layout-mode') : "light",
            todo : "dark-mode"
        } )
    })

    $('.generate-profile-avatar').on("click", function () {
        UpdateUserPreferences({
            todo: "generate-random-avatar"
        })
    })

    loadMessageContentFooter();
    scrollIt();
    dynamicSearch($('#searchUserRecentChatInput'),'.recentChatList')
    dynamicSearch($('#searchUserContactList'),'.contactList')
    dynamicSearch($('#searchGroupList'),'.groupChatList')
})