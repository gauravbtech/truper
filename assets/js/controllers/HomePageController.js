  'use strict';
var app = angular.module('app', []); 
app.controller('myCtrl', function($scope,$http) {
  $scope.logindetails={};
  $scope.logindetails.usertype="shipper";
  $scope.errmsg={};
  $scope.errorarr = ['fnameError','cnameError','phoneError','cityError','stateError','camcError','emailError','passwordError'];
  
  $scope.funSubmit=function(){
    $http.defaults.headers.common['Accept'] = 'application/html';
    if ($scope.chkValidation() && $('#terms').is(':checked')) {
       $http.post('/savesignupdetails',$scope.logindetails). 
       success(function(data, status, headers, config) { 
          console.log("checknig Submmit");
          console.log("AffectedRows : "+data.affectedRows);
          if(data.affectedRows=="1"){
             window.location.href = '/loginshipper';
          } 
      }).error(function(data, status, headers, config) {console.log("error");});
    }    
  },
  $scope.funLogin=function(){
    $http.defaults.headers.common['Accept'] = 'application/json';
    $http.post('/login',$scope.logindetails).success(function(data, status, headers, config) {}).error(function(data, status, headers, config) {});
  },
  $scope.chkValidation=function(){
    var values = [{name: 'first_name', error: 'fnameError'},{name: 'company_name', error: 'cnameError'},{name: 'phone', error: 'phoneError'},{name: 'city', error: 'cityError'},{name: 'state', error: 'stateError'},{name: 'dot_number', error: 'camcError'},{name: 'email', error: 'emailError'},{name: 'password', error: 'passwordError'}];    
    var trueFalse=true,isValid =true;

    angular.forEach(values, function(value) { 
      document.getElementById(value.error).style.display='none';document.getElementById(value.name).style.border='';
    });
    
    if($scope.logindetails.usertype=='shipper')values.splice(5,1);
    angular.forEach(values, function(value, key) {  trueFalse=true;
        if($("#"+value.name).val().trim().length==0){trueFalse=false}
        else if(value.name=='phone'||value.name=='dot_number'||value.name=='email')trueFalse = $scope.formVal(value.name);
        if(!trueFalse){
          document.getElementById(value.error).style.display='block';
          document.getElementById(value.name).style.border='1px solid red';
        }
        isValid = isValid && trueFalse;
     });
    return isValid;
  },
  $scope.chngbrdr=function(eid){
    document.getElementById(eid).style.border='';
  },
  $scope.formVal=function(eid){
    var re = /^[0-9]*$/;
    var trueFalse = true;
    switch (eid) {
    case "phone":
        if($("#"+eid).val().trim().length<10 || $("#"+eid).val().trim().match(re)==null)trueFalse=false; 
        $scope.errmsgphn=" valid US " ;     
        break;
    case "dot_number":
        //$("#"+eid).val().trim().match(re)==null)trueFalse=false;
        break;
    case "email":
        var ergx = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
        if(ergx.test($("#"+eid).val().trim())==false)trueFalse=false;
        $scope.errmsgmail=" valid " ;
        break;
    }
    return trueFalse;
  }
});

app.controller('shpc', function($scope,$http) {
  $scope.shipperHome = function(){
      var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('='); 
        if (urlparam[0] == 'ufn')$scope.userName=urlparam[1];
      }
  }
});

app.controller('profile', function($scope,$http) {
   $scope.data;
   $scope.pswd={};
   $scope.ErrArray=[];
   $scope.Errorvalues = [{name: 'first_name', error: 'first name'},{name: 'last_name', error: 'last name'},{name: 'company_name', error: 'company name'},{name: 'phone', error: 'phone number'},{name: 'email', error: 'email'}];
  $scope.gtprofil = function(){
    $http.defaults.headers.common['Accept'] = 'application/json';
    $http.get('/logindtls'). 
      success(function(data, status, headers, config) {
        $scope.data=data;
      }).error(function(data, status, headers, config) {});
  },
   $scope.updtprofil = function(){
    $http.defaults.headers.common['Accept'] = 'application/json';
    if($scope.formVal()){
      $http.post('/updtprofildtls',$scope.data). 
      success(function(data, status, headers, config) {
        if(data.affectedRows==1)$('#savedInfo').css({'display':'block'});
      }).error(function(data, status, headers, config) {});
    }
   },
   $scope.chngbrdr=function(eid){
    document.getElementById(eid).style.border='';
  },
  $scope.updtpswd = function(){
    var cpswd  = $scope.pswd.cpswd || "";
    var npswd  = $scope.pswd.npswd || "";
    var cnpswd = $scope.pswd.cnpswd || "";
    var isValid =true;
    $scope.pswd.id  =  $scope.data.id;
    var values = [{name: 'cpassword', ngmodel: 'cpassword'},{name: 'npassword', ngmodel: 'npassword'},{name: 'cnpassword', ngmodel: 'cnpassword'}]
    angular.forEach(values, function(value, key) { document.getElementById(value.name).style.border=''});
    document.getElementById('passwordError').style.display='none';
    angular.forEach(values, function(value, key) {
      if($('#'+value.ngmodel).val().trim().length==0){
        $scope.curentpswderr= "Please enter password details in the field having red border."
         $('#passwordError').css({'display':'block'});
         $('#'+value.ngmodel).css({'border':'1px solid red'});
         isValid=isValid && false;
      }
      else{
        isValid=isValid && true;
      }
    });
    if(isValid && npswd!=cnpswd){
      $scope.curentpswderr = " Password Mismatch";
      $scope.pswd.npswd    ="";
      $scope.pswd.cnpswd   ="";
      $('#npassword').css({'border':'1px solid red'});
      $('#cnpassword').css({'border':'1px solid red'});
      $('#passwordError').css({'display':'block'});
      isValid=isValid && false;
    }
    
    $http.defaults.headers.common['Accept'] = 'application/json';
    if(isValid && $scope.pswd.npswd==$scope.pswd.cnpswd){
      $http.post('/updtpswd',$scope.pswd). 
      success(function(data, status, headers, config) {
        if(data.affectedRows==1){
          $('#savedpaswd').css({'display':'block'})
          setTimeout("$('#savedpaswd').css({'display':'none'})", 10000);
        }
        else if(data=="wp") {
          $scope.curentpswderr=" Your current passwor does not match please enter the right password."
          $('#passwordError').css({'display':'block'});
          $('#cpassword').css({'border':'1px solid red'});
          $scope.pswd.cpswd="";
        }
        else if(data=="nochange"){
          $scope.curentpswderr = "Your new password is same as old password."
          $('#passwordError').css({'display':'block'});
        }
      }).error(function(data, status, headers, config) {});
    }  
  },
  $scope.formVal=function(eid){
    var re = /^[0-9]*$/;    
    var ergx = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
    $scope.ErrArray=[];
    var trueFalse=true,isValid =true;
    angular.forEach($scope.Errorvalues, function(value, key) {
      if($('#'+value.name).val().trim().length==0){
          isValid=isValid && false;
          $scope.ErrArray.push({err:value.error});
      }
      else if(value.name=='phone'){
        if($("#phone").val().trim().length<10 || $("#phone").val().trim().match(re)==null){
          isValid=isValid && false;
          $scope.ErrArray.push({err:"valid us phone number"});
        }
      }
      else if(ergx.test($("#email").val().trim())==false && value.name=='email'){
        isValid=isValid && false;
        $scope.ErrArray.push({err:"valid email"});
      } 
    });
    console.log("value.error : "+JSON.stringify($scope.ErrArray)+isValid+$('.form-control').val());
    return isValid;
  }

});  