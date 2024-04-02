var btnSettingUser = document.getElementById('btn-setting-user');
var formSettingUser = document.getElementById('form-setting-user');
var btnCloseSetting = document.getElementById('btn-close-setting');
var optionChangePassword = document.getElementById('option-change-password');
formSettingUser.style.display='none';
btnSettingUser.onclick = function(){
    formSettingUser.style.display='block';
}
btnCloseSetting.onclick = function(){
    formSettingUser.style.display='none';
}
optionChangePassword.onclick = function(){
    var div= document.createElement('div');
    div.innerHTML = `<div id="form-change-password" style="height:35em;position:absolute;top:50%;left:50%;transform: translate(-50%,-50%);" class="container d-flex justify-content-center">
          <div class="card px-1 py-4">
                    <div class="card-body">
                        <h6 class="information mt-4">Đổi mật khẩu mới</h6>
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="form-group">
                                        <div class="input-group"> <input id="old-password" class="form-control" type="text" placeholder="Mật khẩu cũ"> </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="form-group">
                                        <div class="input-group"> <input id="new-password" class="form-control" type="password" placeholder="Mật khẩu mới"> </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="form-group">
                                        <div class="input-group"> <input id="confirm-new-password" class="form-control" type="password" placeholder="Nhập lại mật khẩu mới"> </div>
                                    </div>
                                </div>
                            </div>
                            <div class="button mt-2 d-flex flex-row align-items-center">
                                <button id="btn-ok-change-password" class="btn btn-primary w-100 confirm-button">Đổi Mật Khẩu</button>
                                <button id="btn-close-change-password" class="btn btn-danger w-100 ml-3 confirm-button">Hủy</button>
                            </div>
                    </div>
                </div>
            </div>`;
    document.body.appendChild(div);
    var btnOkChangePassword = document.getElementById('btn-ok-change-password');
    var btnCloseChangePassword = document.getElementById('btn-close-change-password');

    var loading = document.getElementById("loading").style;
	var bodyForm = document.getElementById("bodyForm").style;
    loading.display="none";

    btnOkChangePassword.onclick = function(){

        bodyForm.opacity=0.3;
        loading.display="block";

        var jwtToken = getJwtTokenFromLocalStorage();
        if(jwtToken!=null){
            var data = {
                oldPassword: document.getElementById("old-password").value,
                newPassword: document.getElementById("new-password").value,
                confirmNewPassword: document.getElementById("confirm-new-password").value
            };
            $.ajax({
                url: (server+'/change-password'),
                headers: {
                'Authorization':'Bearer '+jwtToken
                },
                type: "POST",
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                data: JSON.stringify(data),
                success: function (result) {
                    loading.display="none";
                    bodyForm.opacity=1;
                    alertSuccess(result['message']);
                    document.getElementById('form-change-password').remove();
                    document.getElementById('form-setting-user').style.display='none';
                },
                error: function (xhr, status, error) {
                    loading.display="none";
                    bodyForm.opacity=1;
                    var result = xhr.responseJSON;
                    try{
                        alertError(result['message']);
                        alertError(result['oldPassword']);
                        alertError(result['newPassword']);
                    }
                    catch(err){
                        alertError("Lỗi kết nối đến server");
                    }
                }
            });
        }
        else{
            window.location.href = './index.html';
        }
    }
    btnCloseChangePassword.onclick = function(){
        document.getElementById('form-change-password').remove();
    }
}
