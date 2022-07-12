setInterval( () => UpdateUserPreferences( {'todo' : "update-active-status" }), 30000)

/**
 *
 * @param data
 *
 */
function UpdateUserPreferences ( data ) {
    $.ajax({
        url  : "/user",
        type : "POST",
        dataType:  "JSON",
        data : data,
        success : function ( response ){
            if(response.location) window.location.replace(response.location);
        }
    })
}


function UpdateChat ( data ) {
    $.ajax({
        url  : "/chat/status",
        type : "POST",
        dataType:  "JSON",
        data : data,
        success : function ( response ){
            let chatOption = $('.chatOptions');
            if(response.status){
                chatOption.find(".muteButton").remove()
                response.status = Number(response.status)
                response.from_user_id = Number (response.from_user_id)
                response.to_user_id = Number(response.to_user_id)
                if(response.status === 1){
                    chatOption.prepend('<a class="dropdown-item muteButton" onclick="changeMuteStatus(0,'+response.from_user_id+','+response.to_user_id+',\''+data.type+'\')" href="javascript:void(0)">Un Mute <i class="ri-volume-up-line float-end text-muted"></i></a>')
                    Snackbar.show({text : "Conversation has been muted"})
                }
                if(response.status === 0){
                    chatOption.prepend('<a class="dropdown-item muteButton" onclick="changeMuteStatus(1,'+response.from_user_id+','+response.to_user_id+',\''+data.type+'\')" href="javascript:void(0)">Mute <i class="ri-volume-mute-line float-end text-muted"></i></a>')
                    Snackbar.show({text : "Conversation has been un muted"})
                }
            }
        }
    })
}

/**
 *
 * @param data
 * @param url
 * @constructor
 */
function CreateNewGroup(data ,url ){
    $.ajax({
        url     :   url,
        type    :   "POST",
        dataType:   "JSON",
        data    :   data,
        success :   function ( response ){
            if(response.status === 200){
                $('#createNewGroup').trigger("reset");
                $('#addgroup-exampleModal').modal("hide");
            }
        }
    })
}


function SendFileToChat( data, data_defer ){
    $.ajax({
        url     :   "/chat/send-file",
        type    :   "POST",
        data    :   data,
        processData: false,
        contentType : false,
        cache : false,
        success :   function ( response ){
            response.sender     = data_defer.sender
            response.receiver   = data_defer.receiver
            response.typ        = data_defer.typ
            response.caption    = data_defer.caption
            if(response.files){
                Socket.emit("new-file-send", { response })
                $(".item-image").remove();
                $("#send-file-modal").modal("hide");
            }
        }
    })
}

/**
 *
 * @param data
 * @param url
 * @param selector
 * @constructor
 */
function UpdateContactPreferences ( data, url, selector ) {
    $.ajax({
        url  : url,
        type : "POST",
        dataType:  "JSON",
        data : data,
        success : function ( response ){
            if(response.message){
                Snackbar.show({text : response.message })
                if(response.accepted || response.rejected){
                    $('#attachfile').find('.request-list[data-id="'+data.request_user_id+'"]').remove()
                }
                if(response.requested){
                    $('#new-friend-request').trigger("reset");
                }
                newEmptyFriendList()
            }
        }
    })
}



/**
 *
 * @param data
 * @param selector
 * @param url
 * 
 */
function CreatePostRequest ( data , selector, url = "") {
    $.ajax({
        url         :   url,
        data        :   data,
        type        :   "POST",
        dataType    :   "JSON",
        beforeSend: function ( request ){
            selector.hide()
            disableAll()
        },
        success: function ( response ){
            if(response.message) {
                selector.html( response.message )
                selector.show()
            }
            if(response.location) window.location.replace( response.location )
            disableAll("dismiss")
        },
        error: function ( response ){
            if(response.responseJSON) {
                selector.html( response.responseJSON.message )
                selector.show()
            }
            disableAll("dismiss")
        }
    })
}