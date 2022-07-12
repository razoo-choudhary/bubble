const wave   = $('meta[name=wave]').attr("content");
const Socket = io("?token=" + wave);

Socket.on("connect", () => {
})

Socket.on("user-online-change", (data) => {
    $('a[data-id=' + data.user_id + ']').find(".chat-user-img").addClass("online")
    $("div[data-private-id=" + data.user_id + "]").find('.ri-record-circle-fill').addClass("text-success");
})

Socket.on("offline-users", (offlineUsers) => {
    offlineUsers.offLineUsers.forEach((offlineUser) => {
        $('a[data-id=' + offlineUser.user_id + ']').find(".chat-user-img").removeClass("online")
        $("div[data-private-id=" + offlineUser.user_id + "]").find('.ri-record-circle-fill').removeClass("text-success");
        $(".activeStatusSlider[data-id=" + offlineUser.user + "]").remove();
    })
})

Socket.on("total-unread-count", (data) => {
    let privateChatCountHolder = $(".private-message-all-count")
    let groupChatCountHolder = $(".group-message-all-count")

    privateChatCountHolder.hide();
    groupChatCountHolder.hide();

    if (data.privateUnreadAll > 0) {
        privateChatCountHolder.html(data.privateUnreadAll)
        privateChatCountHolder.show();
    }

    if (data.groupUnreadAll > 0) {
        groupChatCountHolder.html(data.groupUnreadAll)
        groupChatCountHolder.show();
    }
})

Socket.on("new-friend-request-received", (data) => {
    let FullName = data.requestedUserData.first_name + " " + data.requestedUserData.last_name;
    if (data.requestedUserData.first_name && data.requestedUserData.last_name) {
        newFriendRequestList(data.listId, data.requestedUserData.user_avatar, data.requestedUserData.username, FullName, data.requestedUserData.user_email)
        $('.friend-request-notification').show();
        Snackbar.show({text: " New friend request from " + FullName})
        newEmptyFriendList()
        messageNotificationSound.play()
    }
})

Socket.on("request-accepted", (data) => {
    let FullName = data.user.first_name + " " + data.user.last_name;
    Snackbar.show({
        text: FullName + " has accepted your friend request"
    })
    newContactList(FullName, data.user.username, data.user.user_id)
})
Socket.on("new-private-message-received", (data) => {
    let mainChatContent = $(".chat-container").attr("data-private-id");
    let username,userid,avatar,fullname;
    let sideBarList;
    newChatBubble(
        data.fromMeta.user_avatar,
        data.contentMeta.chat_messages_id,
        data.contentMeta.message_text,
        data.created_at,
        data.fromMeta.first_name,
        data.fromMeta.last_name,
        data.attachmentData ? data.attachmentData : false,
        Number(mainChatContent) === Number(data.fromMeta.user_id) ? "" : "right",
    )
    if(Number($('#nameF').attr("data-id")) === Number(data.fromMeta.user_id)){
        sideBarList = ($('.recentChatList').find('a[data-id=' + data.toMeta.user_id + ']'))
        fullname = data.toMeta.first_name + " " + data.toMeta.last_name;
        userid = data.toMeta.user_id;
        username = data.toMeta.username;
        avatar = data.toMeta.user_avatar;
        count = 0;
    }else{
        sideBarList =($('.recentChatList').find('a[data-id=' + data.fromMeta.user_id + ']'))
        username =data.fromMeta.username;
        userid =data.fromMeta.user_id;
        avatar = data.fromMeta.user_avatar;
        fullname = data.fromMeta.first_name + " " + data.fromMeta.last_name;
        count = data.countOfUnread
    }

    if (sideBarList.length < 1) {
        newRecentChatList(
            fullname,
            username,
            userid,
            "online",
            avatar,
            data.contentMeta.message_text,
            data.created_at,
            data.countOfUnread,
        )
    }
    sideBarList.find(".chat-user-message").html(data.contentMeta.message_text ? data.contentMeta.message_text : "Attachment")
    sideBarList.find(".time-message").html(data.created_at)
    if (count > 0){
        sideBarList.find(".unread-message > span").show()
    } else{
        sideBarList.find(".unread-message > span").hide()
    }
    sideBarList.find(".unread-message > span").html(count)
    sideBarList.parent("li").prependTo(".recentChatList")
    if(data.chatMutedStatus.is_chat_muted < 1) messageNotificationSound.play()
    scrollIt()
})

Socket.on("new-group-chat-created", ( socket_data ) => {
    newGroupChatList(
        socket_data.group_data.group_id,
        socket_data.group_data.group_name,
        socket_data.group_data.group_image,
        0)
    Socket.emit("join-room", {
        "room_id" : socket_data.group_data.group_socket_id,
        "socketId" : socket_data.socketId
    })
})

Socket.on("group-message-received", (data) => {
    let className = "";
    let mainChatContent = $(".chat-container").attr("data-group-id");
    let loggedInId = Number($('input[name=new-message]').attr('data-from'));
    if(Number(data.fromMeta.user_id) === loggedInId) className  = "right";
    if(className !== "right"){
        // TODO :: REMOVE LOOP AND MAKE A SOCKET REQUEST FOR NOTIFICATION SOUND
        for(const fx of data.chatMutedStatus){
            if(fx.user_id === loggedInId){
                if(fx.is_chat_muted < 1){
                    messageNotificationSound.play()
                }
            }
        }
    }
    if(Number(mainChatContent) === Number(data.toMeta.group_id)){
        newChatBubble(
            data.fromMeta.user_avatar,
            data.contentMeta.chat_messages_id,
            data.contentMeta.message_text,
            data.created_at,
            data.fromMeta.first_name,
            data.fromMeta.last_name,
            data.attachmentData ? data.attachmentData : false,
            className
        )
        scrollIt()
    }
})