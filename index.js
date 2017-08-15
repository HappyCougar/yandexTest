(function($){
	$(window).on('load', function(){
		MyForm = {
			validate: function() {
                var values = this.getData();
                var Object = {};
				Object.isValid = true;
				Object.errorFields = [];
				
				if(values.fio !== undefined) {
                    let reg = /^[a-zа-я'-]+ +[a-zа-я'-]+ +[a-zа-я'-]+$/i;
                    if((values.fio.match(/\S+/g) === null) || values.fio.match(/\S+/g).length !== 3 || !(reg.test(values.fio.trim()))) {
						Object.errorFields.push('fio');
					}
				}
				if(values.email !== undefined) {
                    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    let allowedDomains = ["ya.ru","yandex.ru","yandex.ua","yandex.by","yandex.kz","yandex.com"];
                    let domain = values.email.replace(/.*@/, "");
					if(!(reg.test(values.email.trim())) || !(allowedDomains.includes(domain))) {
						Object.errorFields.push('email');
					}
				}
				if(values.phone !== undefined) {
                    let reg = /\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}/g;
					if(!(reg.test(values.phone)) || (eval(values.phone.replace(/[^\d]/g,'').toString().split('').join('+')) > 30)) {
						Object.errorFields.push('phone');
					}
				}
				if(Object.errorFields.length) {
					Object.isValid = false;
				}
				return Object;
			},
			getData: function() {
				let Object = {};
				$("#form-body .form-control:input").each(function() {
					Object[$(this).attr('name')] = $(this).val();
				});
				return Object;
			},
			setData: function(Object) {
				let allowedFields = ["fio","email","phone"];
				$.each(Object, function(index, value) {
					if(($("#form-body input[name='"+index+"']").length) && (allowedFields.includes(index))) {
						$("#form-body input[name='"+index+"']").removeClass('error').val(value);
					}
				}); 
			},
			submit: function() {
				let validCheck = this.validate();
				if(validCheck.isValid) {
					$("#submitButton").attr('class','btn btn-block').prop('disabled', true);
					this.callAjax($("#myForm").attr('action'));
				}
				else {
					validCheck.errorFields.forEach(function(item, i, arr) {
						if($("#form-body input[name='"+item+"']").length) {
							$("#form-body input[name='"+item+"']").addClass('error');
						}
					});
				}
			},
			callAjax: function(target) {
				var self = this;
				$.ajax({
					type: "POST",
					url: target,
					dataType: "json",
					success: function (data) {
                        $("#resultContainer").attr("class","");
						if(data.status == "success") {
							$("#resultContainer").addClass("success alert alert-success").text("Success");
                        }
                        else if(data.status == "error") {
                            $("#resultContainer").addClass("error alert alert-danger").text(data.reason);
						}
						else if(data.status == "progress"){
                            $("#resultContainer").addClass("progress alert").text("Progress");
                            setTimeout(function () {self.callAjax(target)}, data.timeout);
						}
					},
					error: function (data) {
                        $("#resultContainer").addClass("error alert alert-danger").text("Cant connect");
					}
				});
                console.log("progress");
			}
		};
		$("#myForm").submit(function(event) {
            event.preventDefault();
            MyForm.submit();
        });
        $('#form-body input').on('input', function() {
            if(($(this).hasClass("error")) && ($(this).val().length > 0)) {
                $(this).removeClass("error");
            }
        });
        $("#phone").inputmask();
	});
})(jQuery);