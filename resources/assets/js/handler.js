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

    let ediSaveButton = $(".edit-name-button")
    ediSaveButton.on("click", function () {
        let x = $(".setting-name");
        x.find("h5").hide();
        if(x.find("input").length < 1){
            x.append('<input type="text" class="form-control mt-3 input-new-name" value="'+x.find("h5").html()+'" />');
            $(this).html("Save")
        }
    })

    $( document ).on("keyup", ".input-new-name", function (){
        ediSaveButton.addClass("save-name-button")
        ediSaveButton.removeClass("edit-name-button")
    })
    $( document ).on( "click", ".save-name-button", function() {
        UpdateUserPreferences({
            todo:   "change-user-full-name",
            name:   $(".input-new-name").val()
        })
    });

    loadMessageContentFooter();
    scrollIt();
    dynamicSearch($('#searchUserRecentChatInput'),'.recentChatList')
    dynamicSearch($('#searchUserContactList'),'.contactList')
    dynamicSearch($('#searchGroupList'),'.groupChatList')
})