document.addEventListener("DOMContentLoaded", () => {
    let BIN_PATTERN = /^[0-9][0-9](0[1-9]|1[0-2])[4-6][0-4][0-9][0-9][0-9][0-9][0-9][0-9]$/;
    let IIN_PATTERN = /^[0-9][0-9](0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])[0-6][0-9][0-9][0-9][0-9][0-9]$/;
    let NAME_PATTERN = /^([а-яА-Яa-zA-ZәғқңөұүhіӘҒҚҢӨҰҮHІёЁ'\-]+\s)*[а-яА-Яa-zA-ZәғқңөұүhіӘҒҚҢӨҰҮHІёЁ'\-]+$/;


    document.getElementById("iinBin").addEventListener("keyup", (validateBinIINOnLoad) =>{
        let val = document.getElementById("iinBin").value;
        let validIIN = validateIin(val);
        let validBIN = validateBin(val);
        
        if(validIIN && validBIN && val.length>=12) {
            document.getElementById("iinBinError").textContent = 'Введите корректное значение';
        } else{
            document.getElementById("iinBinError").textContent = "";
            document.getElementById("binName").textContent = "";
        }

        document.getElementById("name-block").style.display = 'none';
        if(validIIN == null){
            document.getElementById("name-block").style.display = 'block';
        } else if(validBIN == null){
            fetch('https://idp.ismet.kz/info/' + val + '/info')
                .then((response)=>{
                    if (!response.ok) {
                        throw new Error("HTTP error " + response.status);
                    }
                    return response.json();
                })
                .then((data)=>{
                    document.getElementById("binName").textContent = 'Найдена компания ' + data.name;
                    let name;
                    if(res.fio) {
                        name = res.fio;
                    } else {
                        name = res.name.replace('ИП', '').trim();
                    }
                })
                .catch((error)=> {
                    console.error('Error:', error)
                });
        }
        
    });

    document.getElementById("name").addEventListener("keyup", (validateBinIINOnLoad) =>{
        let val = document.getElementById("name").value.trim();
        let arr = val.split(" ");
        if (!NAME_PATTERN.test(val) || arr.length<2){
            document.getElementById("nameError").textContent = 'Введите Фамилию и Имя корректно';
        } else {
            document.getElementById("nameError").textContent = '';
        }
    });

    function validateIin(iin) {
        if (iin && iin.length == 12) {
            if (!IIN_PATTERN.test(iin)) {
                return "Неправильный формат ИИН";
            }
            if (checkIinOrBinCheckSum(iin)) {
                return null;
            } else {
                return "Неверный формат ИИН (контрольная сумма)";
            }
        } else {
            return "ИИН должен содержать 12 цифр. Пожалуйста, проверьте значение.";
        }
    }

    function validateBin(bin) {
        if (bin && bin.length == 12) {
            if (!BIN_PATTERN.test(bin)) {
                return "БИН должен состоять из 12 цифр. Введите БИН полностью.";
            }
            if (checkIinOrBinCheckSum(bin)) {
                return null;
            } else {
                return "Неверный формат БИН (контрольная сумма)";
            }
        } else {
            return "БИН не может быть меньше 12 символов";
        }
    }

    function checkIinOrBinCheckSum(iinBin) {
        if (iinBin && iinBin.length == 12) {
            let sum = 0;
            for (let i = 0; i < 11; i++) {
                sum += (i + 1) * (+iinBin[i]);
            }
            if (sum % 11 == 10) {
                sum = 3 * (+iinBin[0]) + 4 * (+iinBin[1]) + 5 * (+iinBin[2]) + 6 * (+iinBin[3]) + 7 * (+iinBin[4]) + 8 * (+iinBin[5])
                    + 9 * (+iinBin[6]) + 10 * (+iinBin[7]) + 11 * (+iinBin[8]) + 1 * (+iinBin[9]) + 2 * (+iinBin[10]);
            }
            if (sum % 11 === (+iinBin[11])) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

});
