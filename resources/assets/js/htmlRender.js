/**
 *
 * @param avatar
 * @param message_id
 * @param message_text
 * @param created_at
 * @param first_name
 * @param last_name
 * @param is_file
 * @param class_name
 */
function newChatBubble(avatar, message_id, message_text, created_at, first_name, last_name, is_file = false,class_name =""){
    let dat, dropDown,copyD = "";

    if(is_file.message_type !== "image" && is_file.message_type !== "file"){
        copyD = '<a class="dropdown-item"  href="javascript:void(0)" onclick="copyToClipboard(\'#textContent'+message_id+'\')">Copy <i class="ri-file-copy-line float-end text-muted"></i></a>';
    }

    if(class_name === "right"){
        dropDown  = '                                    <div class="dropdown-menu">\n' + copyD +
            '                                        \n' +
            '                                        <a class="dropdown-item"  href="javascript:void(0)">Forward <i class="ri-chat-forward-line float-end text-muted"></i></a>\n' +
            '                                        <a class="dropdown-item"  href="javascript:void(0)">Delete <i class="ri-delete-bin-line float-end text-muted"></i></a>\n' +
            '                                    </div>\n';
    }else{
        dropDown = '                                    <div class="dropdown-menu">\n' +
            '                                        <a class="dropdown-item"  href="javascript:void(0)" onclick="copyToClipboard(\'#textContent'+message_id+'\')">Copy <i class="ri-file-copy-line float-end text-muted"></i></a>\n' +
            '                                        <a class="dropdown-item"  href="javascript:void(0)">Forward <i class="ri-chat-forward-line float-end text-muted"></i></a>\n' +
            '                                    </div>\n';
    }
    if(is_file.message_type === "image"){
         dat = '' +
            ' <ul class="list-inline message-img  mb-0">\n' +
            '                                                <li class="list-inline-item message-img-list me-2 ms-0">\n' +
            '                                                    <div>\n' +
            '                                                        <a class="popup-img d-inline-block m-1" href="/uploads/'+is_file.file_name+'" title="'+is_file.file_name+'">\n' +
            '                                                            <img src="/uploads/'+is_file.file_name+'" alt="" class="rounded border">\n' +
            '                                                        </a>\n' +
            '                                                    </div>\n' +
            '                                                    <div class="message-img-link">\n' +
            '                                                        <ul class="list-inline mb-0">\n' +
            '                                                            <li class="list-inline-item">\n' +
            '                                                                <a title="Something" download="/uploads/'+is_file.file_name+'" href="/uploads/'+is_file.file_name+'" class="fw-medium bg-primary rounded">\n' +
            '                                                                    <i class="ri-download-2-line"></i>\n' +
            '                                                                </a>\n' +
            '                                                            </li>\n' +
            '                                                        </ul>\n' +
            '                                                    </div>\n' +
            '                                                </li>\n' +
            '                                            </ul><script>' +
             '$(".popup-img").magnificPopup({ type: "image", closeOnContentClick: !0, mainClass: "mfp-img-mobile", image: { verticalFit: !0 } }),\n' +
             '                $("#user-status-carousel").owlCarousel({ items: 4, loop: !1, margin: 16, nav: !1, dots: !1 }),\n' +
             '                $("#chatinputmorelink-carousel").owlCarousel({ items: 2, loop: !1, margin: 16, nav: !1, dots: !1, responsive: { 0: { items: 2 }, 600: { items: 5, nav: !1 }, 992: { items: 8 } } }),\n' +
             '                $("#user-profile-hide").click(function () {\n' +
             '                    $(".user-profile-sidebar").hide();\n' +
             '                }),\n' +
             '                $(".user-profile-show").click(function () {\n' +
             '                    $(".user-profile-sidebar").show();\n' +
             '                })' +
             '</script>';
    }else if(is_file.message_type === "file"){
        dat = '<div class="card p-2 mb-2">\n' +
            '                                                <div class="d-flex flex-wrap align-items-center attached-file">\n' +
            '                                                    <div class="avatar-sm me-3 ms-0 attached-file-avatar">\n' +
            '                                                        <div class="avatar-title bg-soft-primary text-primary rounded font-size-20">\n' +
            '                                                            <i class="ri-file-text-fill"></i>\n' +
            '                                                        </div>\n' +
            '                                                    </div>\n' +
            '                                                    <div class="flex-grow-1 overflow-hidden">\n' +
            '                                                        <div class="text-start">\n' +
            '                                                            <h5 class="font-size-14 text-truncate mb-1">'+is_file.file_original_name+'</h5>\n' +
            '                                                            <p class="text-muted text-truncate font-size-13 mb-0">'+convertBytes(is_file.file_size)+'</p>\n' +
            '                                                        </div>\n' +
            '                                                    </div>\n' +
            '                                                    <div class="ms-4 me-0">\n' +
            '                                                        <div class="d-flex gap-2 font-size-20 d-flex align-items-start">\n' +
            '                                                            <div>\n' +
            '                                                                <a style="font-size: 18px;\n' +
            '    color: #fff;\n' +
            '    display: inline-block;\n' +
            '    line-height: 30px;\n' +
            '    width: 30px;\n' +
            '    height: 30px;\n' +
            '    text-align: center" download="'+is_file.file_original_name+'" href="/uploads/'+is_file.file_name+'" class="fw-medium bg-primary rounded">\n' +
            '                                                                    <i class="ri-download-2-line"></i>\n' +
            '                                                                </a>\n' +
            '                                                            </div>\n' +
            '                                                        </div>\n' +
            '                                                    </div>\n' +
            '                                                </div>\n' +
            '                                            </div>';
    }

    else{
        dat = '<p class="mb-0" id="textContent'+message_id+'">'+message_text+'</p>';
    }
    let chatM = '                <li class="'+class_name+'">\n' +
        '                    <div class="conversation-list">\n' +
        '                        <div class="chat-avatar">\n' +
        '                            <img src="'+avatar+'" alt="">\n' +
        '                        </div>\n' +
        '\n' +
        '                        <div class="user-chat-content">\n' +
        '                            <div class="ctext-wrap">\n' +
        '                                <div class="ctext-wrap-content">\n' +
        '                                    '+dat+'\n' +
        '                                    <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">'+created_at+'</span></p>\n' +
        '                                </div>\n' +
        '\n' +
        '                                <div class="dropdown align-self-start">\n' +
        '                                    <a class="dropdown-toggle" href="javascript:void(0)" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n' +
        '                                        <i class="ri-more-2-fill"></i>\n' +
        '                                    </a>\n' +
        dropDown
        '                                </div>\n' +
        '                            </div>\n' +
        '\n' +
        '                            <div class="conversation-name">\n' + first_name + ' '+ last_name  +
        '                            </div>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </li>';
    $("#holder-chat").append(chatM)
}

/**
 *
 * @param listIdAsJsonWebToken
 * @param userAvatar
 * @param userName
 * @param fullName
 * @param email
 */
function newFriendRequestList( listIdAsJsonWebToken, userAvatar, userName, fullName, email){
    const data = '                                <div class="card p-2 border mb-2 request-list" data-id="'+listIdAsJsonWebToken+'">\n' +
        '                                    <div class="d-flex align-items-center">\n' +
        '                                        <div class="avatar-sm me-3 ms-0">\n' +
        '                                            <div class="avatar-title bg-soft-primary text-primary rounded font-size-20">\n' +
        '                                                <img class="avatar-xs" src="'+userAvatar+'"  alt="'+userName+'"/>\n' +
        '                                            </div>\n' +
        '                                        </div>\n' +
        '                                        <div class="flex-grow-1">\n' +
        '                                            <div class="text-start">\n' +
        '                                                <h5 class="font-size-14 mb-1">'+fullName+'</h5>\n' +
        '                                                <p class="text-muted font-size-13 mb-0">'+email+'</p>\n' +
        '                                            </div>\n' +
        '                                        </div>\n' +
        '\n' +
        '                                        <div class="ms-4 me-0">\n' +
        '                                            <ul class="list-inline mb-0 font-size-18">\n' +
        '                                                <li class="list-inline-item">\n' +
        '                                                    <a href="javascript:void(0)" onclick="AcceptRequest(\''+listIdAsJsonWebToken+'\', $(this))" class="text-muted px-1 accept-request">\n' +
        '                                                        <i class="ri-user-follow-line"></i>\n' +
        '                                                    </a>\n' +
        '                                                </li>\n' +
        '                                                <li class="list-inline-item dropdown">\n' +
        '                                                    <a class="dropdown-toggle text-muted px-1" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n' +
        '                                                        <i class="ri-more-fill"></i>\n' +
        '                                                    </a>\n' +
        '                                                    <div class="dropdown-menu dropdown-menu-end">\n' +
        '                                                        <a class="dropdown-item" data-id="'+listIdAsJsonWebToken+'" href="javascript:void(0)">Report</a>\n' +
        '                                                        <a class="dropdown-item reject-request" onclick="RejectRequest(\''+listIdAsJsonWebToken+'\', $(this))" href="javascript:void(0)">Delete</a>\n' +
        '                                                    </div>\n' +
        '                                                </li>\n' +
        '                                            </ul>\n' +
        '                                        </div>\n' +
        '                                    </div>\n' +
        '                                </div>';
    $("#attachfile").find(".accordion-body").append(data)
}

/**
 *
 */
function newEmptyFriendList(){
    let friendListCount = $("#attachfile").find(".request-list").length;
    if(friendListCount < 1){
        const data = '<div class="card p-2 border mb-2 empty-request-list">\n' +
            '                                    <div class="d-flex align-items-center">\n' +
            '                                        <div class="avatar-sm me-3 ms-0">\n' +
            '                                            <div class="avatar-title bg-soft-primary text-primary rounded font-size-20">\n' +
            '                                                <img class="avatar-xs" src="https://emojipedia-us.s3.amazonaws.com/source/skype/289/monkey_1f412.png" alt="" />\n' +
            '                                            </div>\n' +
            '                                        </div>\n' +
            '                                        <div class="flex-grow-1">\n' +
            '                                            <div class="text-start">\n' +
            '                                                <p class="text-muted font-size-13 mb-0"> No Pending Friend Requests </p>\n' +
            '                                            </div>\n' +
            '                                        </div>\n' +
            '                                    </div>\n' +
            '                                </div>';
        $("#attachfile").find(".accordion-body").html(data)
        $('.friend-request-notification').hide();
    }else{
        $('.friend-request-notification').show();
       $('#attachfile').find('.empty-request-list').hide();
    }
}

/**
 *
 * @param fullName
 * @param username
 * @param user_id
 * @param status
 * @param avatar
 * @param lastTextMessage
 * @param time
 * @param count
 */
function newRecentChatList (fullName, username, user_id, status,avatar, lastTextMessage, time, count = 0) {
    let countDisplay = "";
    if(count < 1) countDisplay = "display:none";
    const data =  '<li data-search-tag="'+fullName+'">\n' +
        '                    <a href="javascript:void(0)" onclick="loadChat($(this))" data-username="'+username+'" data-id="'+user_id+'">\n' +
        '                        <div class="d-flex">\n' +
        '                            <div class="chat-user-img '+status+' align-self-center me-3 ms-0">\n' +
        '                                <img src="'+avatar+'" class="rounded-circle avatar-xs" alt="'+username+'">\n' +
        '                                <span class="user-status"></span>\n' +
        '                            </div>\n' +
        '                            <div class="flex-grow-1 overflow-hidden">\n' +
        '                                <h5 class="text-truncate font-size-15 mb-1">'+fullName+'</h5>\n' +
        '                                <p class="chat-user-message text-truncate mb-0">'+lastTextMessage+'</p>\n' +
        '                            </div>\n' +
        '                            <div class="font-size-11 time-message">'+time+'</div>\n' +
        '                            <div class="unread-message">\n' +
        '                                <span class="badge badge-soft-danger rounded-pill" style="'+countDisplay+'">'+count+'</span>\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                    </a>\n' +
        '                </li>';
    $(data).prependTo(".recentChatList");
}

function newContactList( fullname, username, user_id){
    const data = '            <li data-search-tag="'+fullname+'">\n' +
        '                <div class="d-flex align-items-center">\n' +
        '                    <div class="flex-grow-1" onclick="newChatContact($(this))" data-username="'+username+'">\n' +
        '                        <h5 class="font-size-14 m-0">'+fullname+'</h5>\n' +
        '                    </div>\n' +
        '                    <div class="dropdown">\n' +
        '                        <a href="#" data-id="'+user_id+'" class="text-muted dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n' +
        '                            <i class="ri-more-2-fill"></i>\n' +
        '                        </a>\n' +
        '                        <div class="dropdown-menu dropdown-menu-end">\n' +
        '                            <a class="dropdown-item" data-id="'+user_id+'" href="#">Share <i class="ri-share-line float-end text-muted"></i></a>\n' +
        '                            <a class="dropdown-item" data-id="'+user_id+'" href="#">Block <i class="ri-forbid-line float-end text-muted"></i></a>\n' +
        '                            <a class="dropdown-item" data-id="'+user_id+'" href="#">Remove <i class="ri-delete-bin-line float-end text-muted"></i></a>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </li>'
    $('.contactList').prepend(data)
}

function newGroupChatList ( group_id, group_name, group_image, count){
    let display = "";
    if(count < 1) display = "display:none";
    const data = '<li data-search-tag="'+group_name+'" data-group-id="'+group_id+'" onclick="OpenNewGroupChat($(this))">\n' +
        '                <a href="javascript:void(0)">\n' +
        '                    <div class="d-flex align-items-center">\n' +
        '                        <div class="chat-user-img me-3 ms-0">\n' +
        '                            <div class="chat-user-img align-self-center me-3 ms-0">\n' +
        '                                <img src="'+group_image+'" class="rounded-circle avatar-xs" alt="">\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                        <div class="flex-grow-1 overflow-hidden">\n' +
        '                            <h5 class="text-truncate font-size-14 mb-0">#'+group_name+' <span style="'+display+'" class="badge badge-soft-danger rounded-pill float-end"> + '+ count +' </span></h5>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </a>\n' +
        '            </li>';
    $('.groupChatList').append(data);
}

function newFileIconOnSend( src, originalName, displayImage ){
    const rand = make_id(15);
    let d = src;
    if(displayImage === "file"){
        d = "/resources/assets/images/file.png"
    }
    const data = '<div class="card mb-2 item-image" style="width: 8rem;" data-id="'+rand+'">\n' +
        '                            <img class="card-img-top" data-source="'+src+'" src="'+d+'" alt="'+originalName+'">\n' +
        '                            <a class="#" onclick="$(\'div[data-id='+rand+']\').remove();" style="position: absolute; right: 5px; top :-10px; cursor: pointer">\n' +
        '                                <i class="ri-close-circle-fill"></i>\n' +
        '                            </a>\n' +
        '                        </div>';
    $(".x-fil-con").append(data)
}