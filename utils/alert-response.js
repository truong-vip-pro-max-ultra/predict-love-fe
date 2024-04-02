function alertError(message){
    if(message!=undefined){
      toastr.error(message);
    }
}
function alertSuccess(message){
  if(message!=undefined){
    toastr.success(message);
  }
}