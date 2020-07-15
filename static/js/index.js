// keypress events to prevent entering Alphabets and special char
$(document).on('keypress','#issue_med input[name=quantity]',function(event){
    test = $(this).parent().find('.error_msg')
    if(event.which = 8 && isNaN(String.fromCharCode(event.which))){
        event.preventDefault(); //stop character from entering input
        test.html('Only Digits allowed *')
        test.css('display','block')
    }
    else{
        test.css('display','none')
    }
    if(event.target.name == 'quantity' && event.charCode == 13){
        if($(this).hasClass('issue_med')){
            event.preventDefault()
            max = parseInt(event.target.dataset.max)
            if(!isNaN(event.target.value)){
                quantity = parseInt(event.target.value)
                if(quantity >= max){
                    alert('Medicine quantity not available!, Please change quantity.\nTotal available quantity = '+max)
                }
                else{
                    rate = $(this).closest('tr').find('input[name=rate]').val()
                    $(this).closest('tr').find('input[name=amount]').val((quantity * parseInt(rate)))
                    $(this).closest('tr').find('input[name=amount]').attr("disabled",false)
                }
            }
            else{
                test.html('Only Digits allowed *')
                test.css('display','block')
                event.target.value=''
            }
        }
    }
});

$(document).on('keypress copy cut paste keydown keyup','#issue_med input[name=amount],#issue_med input[name=rate],#add_diagno input[name=amount],input[name=total_amount].raise_bill',function(event){
    event.preventDefault()
});

// change events to check entered input is not aplphabets and special char
$(document).on('change','#issue_med input[name=quantity]',function (event) {
    event.preventDefault()
    test = $(this).parent().find('.error_msg')
    if(isNaN(parseInt(event.target.value))){
        test.html('Only Digits allowed *')
        test.css('display','block')
        event.target.value=''
    }
    else{
        test.css('display','none')
        target = event.target
        if(target.id == "ssn_id" && target.value.length != 9){
            test.html('Required 9 digits *')
            test.css('display','block')
        }
    }
});

// keypress events to prevent entering numbers and special char
$(document).on('keypress', '#issue_med input[name=name], #add_diagno input[name=name]', function(){
    test = $(this).parent().find('.error_msg')
    if(!((event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || event.charCode==32 || event.charCode==13)){
        event.preventDefault(); //stop Number from entering input
        test.html('Only Alphabets and Space allowed *')
        test.css('display','block')
    }
    else{
        test.css('display','none')
    }
    if(event.target.name == 'name' && event.charCode == 13){
        if($(this).hasClass('issue_med')){
            event.preventDefault()
            name = event.target.value.trim().toLowerCase()
            if(isNaN(name) && name.length>=2){
                getMedicine(this,name)
            }
            else{
                test.html('Only Alphabets and Space allowed *')
                test.css('display','block')
                event.target.value=''
            }
        }
        else if($(this).hasClass('add_diagno')){
            event.preventDefault()
            name = event.target.value.trim().toLowerCase()
            if(isNaN(name) && name.length>=2){
                getDiagnostic(this,name)
            }
            else{
                test.html('Only Alphabets and Space allowed *')
                test.css('display','block')
                event.target.value=''
            }
        }
    }
});

// change events to check entered input is not numbers and special char
$(document).on('change', '#issue_med input[name=name]', function(){
    event.preventDefault()
    test = $(this).parent().find('.error_msg')
    if(!isNaN(event.target.value)){
        test.html('Only Alphabets and Space allowed *')
        test.css('display','block')
        event.target.value=''
    }
    else{
        test.css('display','none')
    }
});

// on change of medicine name fetch medicine data
$(document).on('change','#issue_med input[name=name], #add_diagno input[name=name]',function (event) {
    event.preventDefault()
    name = event.target.value.trim().toLowerCase()
    if(isNaN(name) && name.length>=2){
        if($(this).hasClass('issue_med')){
            getMedicine(this,name)
        }
        else if($(this).hasClass('add_diagno')){
            getDiagnostic(this,name)
        }
    }
});

// on change of quantity calculate total price
$(document).on('change','#issue_med input[name=quantity]',function (event) {
    event.preventDefault()
    max = parseInt(event.target.dataset.max)
    if(!isNaN(event.target.value)){
        quantity = parseInt(event.target.value)
        if(quantity >= max){
            alert('Medicine quantity not available!, Please change quantity.\nTotal available quantity = '+max)
        }
        else{
            rate = $(this).closest('tr').find('input[name=rate]').val()
            $(this).closest('tr').find('input[name=amount]').val((quantity * parseInt(rate)))
            $(this).closest('tr').find('input[name=amount]').attr("disabled",false)
        }
    }
});

$(document).ready(function() {

    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000); // <-- time in milliseconds

    $('#showPass').click(function(){
        var x = $("#passwordInput")[0]
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    });

    $('input[type=button].issue_med').click(function(event){
        event.preventDefault()
        $('#issue_med').css('display','block')
    })

    $('input[type=button].add_diagno').click(function(event){
        event.preventDefault()
        $('#add_diagno').css('display','block')
    })

    $('.reset_btn').click(function(event){
        event.preventDefault();
        $("input[type=textfield]").val('');
        $("input[type=date]").val('');
        $("input[type=number]").val('');
    });

    $('input[name=dod].raise_bill').change(function(event){
        // code for calculate day difference
        d1 = $(this).closest('tr').find('.p_doa').html()
        d2 = event.target.value
        date1 = new Date(d1)
        date2 = new Date(d2)
        one_day = 1000 * 60 *60 * 24
        day_diff = (date2.getTime() - date1.getTime())/ one_day

        $(this).closest('.table-responsive').find('.nub_days').append(day_diff)
        
        // code for calculate room charges
        room_charge = 0
        b_type = $(this).closest('tr').find('.p_tob').html()

        if(b_type.toLowerCase() == 'single room'){
            room_charge = day_diff * 8000
        }
        else if(b_type.toLowerCase() == 'semi sharing'){
            room_charge = day_diff * 4000
        }
        else if(b_type.toLowerCase() == 'general ward'){
            room_charge = day_diff * 2000
        }

        $(this).closest('.table-responsive').find('.room_price').append(room_charge)

        // code to calculate total price of medicines
        total_med = 0
        for (let index = 0; index < $('.m_amount').length; index++) {
            const element = $('.m_amount')[index];
            total_med += parseInt($(element).html())
        }

        // code to calculate total price of Diagnostics
        total_diagno = 0
        for (let index = 0; index < $('.d_amount').length; index++) {
            const element = $('.d_amount')[index];
            total_diagno += parseInt($(element).html())
        }

        // code to calculate total bill amount
        total_amount = room_charge + total_diagno + total_med
        $('input[name=total_amount].raise_bill').val(total_amount)
        $('input[name=total_amount].raise_bill').attr('disabled',false)
        
    })

    $('#ssn_id, #age, #amount').keypress(function(event){
        test = $(this).parent().find('.error_msg')
        if(event.which = 8 && isNaN(String.fromCharCode(event.which))){
            event.preventDefault(); //stop character from entering input
            test.html('Only Digits allowed *')
            test.addClass("alert-danger")
            test.addClass("alert")
            test.css('display','block')
        }
        else{
            test.css('display','none')
        }
        if(event.target.id == 'ssn_id' && event.target.value.length == 9 && event.charCode == 13){
            event.preventDefault()
            id = event.target.value
            if(!isNaN(parseInt(event.target.value))){
                getPatientData(this,id)
            }
            else{
                test.html('Only Digits allowed *')
                test.addClass("alert-danger")
                test.addClass("alert")
                test.css('display','block')
                event.target.value=''
            }
        }
    })

    $('#ssn_id, #age, #amount').change(function (event) {
        event.preventDefault()
        test = $(this).parent().find('.error_msg')
        if(isNaN(parseInt(event.target.value))){
            test.html('Only Digits allowed *')
            test.addClass("alert-danger")
            test.addClass("alert")
            test.css('display','block')
            event.target.value=''
        }
        else{
            test.css('display','none')
            target = event.target
            if(target.id == "ssn_id" && target.value.length != 9){
                test.html('Required 9 digits *')
                test.css('display','block')
            }
        }
    });

    $('#name, #state, #city').keypress(function(event){
        test = $(this).parent().find('.error_msg')
        if(!((event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123) || event.charCode==32)){
            event.preventDefault(); //stop Number from entering input
            test.html('Only Alphabets and Space allowed *')
            test.addClass("alert-danger")
            test.addClass("alert")
            test.css('display','block')
        }
        else{
            test.css('display','none')
        }
    })

    $('#name, #state, #city').change(function (event) {
        event.preventDefault()
        test = $(this).parent().find('.error_msg')
        if(!isNaN(event.target.value)){
            test.html('Only Alphabets and Space allowed *')
            test.addClass("alert-danger")
            test.addClass("alert")
            test.css('display','block')
            event.target.value=''
        }
        else{
            test.css('display','none')
        }
    });

    $('#issue_med .add_row').click(function(event){
        event.preventDefault()
        temp = '<tr> <td> <div> <input class="form-control issue_med" name="name" type="textfield" placeholder="Medicine Name" required minlength="2" maxlength="50"> <span class="error_msg" style="position: inherit;"></span> </div> </td> <td> <div> <input class="form-control issue_med" name="quantity" type="textfield" placeholder="Quantity" disabled required min="1" minlength="1" maxlength="3"> <span class="error_msg" style="position: inherit;"></span> </div> </td> <td><input class="form-control" name="rate" type="textfield" required disabled></td> <td><input class="form-control" name="amount" type="textfield" required disabled></td> </tr>'
        $('#issue_med tbody').append(temp)
    })

    $('#add_diagno .add_row').click(function(event){
        event.preventDefault()
        temp = '<tr> <td> <div> <input class="form-control add_diagno" name="name" type="textfield" placeholder="Name" required minlength="2" maxlength="50"> <span class="error_msg" style="position: inherit;"></span> </div> </td> <td><input class="form-control" name="amount" type="textfield" required disabled></td> </tr>'
        $('#add_diagno tbody').append(temp)
    })

    $('#edit_patient input[name=ssn_id]').change(function (event) {
        event.preventDefault()
        id = event.target.value
        if(!isNaN(parseInt(event.target.value)) && id.length==9){
            getPatientData(this,id)
        }
    });

    $('input[name=ssn_id].issue_med, input[name=ssn_id].add_diagno').change(function (event) {
        event.preventDefault()
        id = event.target.value
        if(!isNaN(parseInt(event.target.value)) && id.length==9){
            getPatientData(this,id)
        }
    });

    $('#add_patient input[name=ssn_id]').change(function (event) {
        event.preventDefault()
        id = event.target.value
        if(!isNaN(parseInt(event.target.value)) && id.length==9){
            getPatientData(this,id)
        }
    });
});