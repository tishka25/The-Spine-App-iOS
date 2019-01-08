/**
 * Global variables for notifications when using different languages
 */
//TODO
var currentLanguage = 'bg';
const notificationMessages = {
    enterAllFields:{
        bg: "Моля попълнете задължителните полета",
        en: "Please enter all required fields",
        de: "Bitte geben Sie alle erforderlichen Felder ein",
        ru: "Введите все обязательные поля"
    },
    saveSuccess:{
        bg: "Успешно запазено",
        en:"Saved successfully",
        de: "Erfolgreich gespeichert",
        ru: "Успешно сохранено"
    },
    noteAlreadyExists:{
        bg: "Записката вече същестува",
        en: "Note already exists",
        de: "Hinweis existiert bereits",
        ru: "Примечание уже существует"
    },
    deleteSuccess:{
        bg: "Успешно изтрита записка",
        en: "Success",
        de: "Notiz wurde erfolgreich gelöscht",
        ru: "Успешно удаленная заметка"
    }

};


var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
        app.showPage("loadingPage");
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    onDeviceReady: function () {
        console.log("Device ready");
        app.showPage("notebookPage");
        app.deleteFile("2017-06-13f-title.txt");
    },
    saveNote: function (isAlertActive , onSave) {
        if(notebookPage.hidden){
            return;
        }
        var date;
        //String
        var title;
        //String
        var name;
        //String
        var city;
        //String
        var diagnose;
        //Boolean
        var recommends;
        //String
        var surgery;

        date = document.getElementById("dateTime").value;
        title = document.getElementById("title").value;
        name = document.getElementById("name").value;
        city = document.getElementById("city").value;
        diagnose = document.getElementById("diagnose").value;
        recommends = document.getElementById("recommends").checked;
        surgery = document.getElementById("surgery").value;

        var a  = app.isFormAcceptable();
        console.log("Is form acceptable: " , a);

        if (!app.isFormAcceptable()){
            if(isAlertActive)
                navigator.notification.alert("Моля попълнете всички полета" , null , "The Spine App");

            console.log("Please enter all fields");
        }
        else {
            var fileTitle;
            var generatedTitle = null;
            if(!title){
                generatedTitle = diagnose.slice(0,18);
                fileTitle = app.generateFileName(date + diagnose + "f-title"+ generatedTitle);
            }else{
                fileTitle = app.generateFileName(date + diagnose + "f-title"+ title);

            }
            var obj = {
                "fileName": fileTitle,
                "date": date,
                "title": title,
                "name": name,
                "city": city,
                "diagnose": diagnose,
                "recommends": recommends,
                "surgery": surgery
            };
            var fileInformation = JSON.stringify(obj);
            console.log("Saving file: " + fileTitle, fileInformation, JSON.parse(fileInformation));
            app.writeToFile(cordova.file.dataDirectory, fileTitle, fileInformation , function(){
                if(isAlertActive){
                    navigator.notification.alert(notificationMessages.saveSuccess[currentLanguage] , null , "The Spine App");
                    app.clearForm();
                }
                onSave();
            } , function(e){
                if(e.code == 12 && isCallbackActive){
                    navigator.notification.alert(notificationMessages.noteAlreadyExists[currentLanguage] , null , "The Spine App");
                }
                console.log(e);
            });
        }
    },
    listNotes: function () {
        app.saveNote(null , false);
        app.showPage("savedNotesPage");
        app.listDir(cordova.file.dataDirectory, function (f) {
            console.log(f);
            for (var i = 0; i < f.length; i++) {
                var listItem = document.createElement("li");
                listItem.className = "list-item list-item--tappable";
                var outerDiv = document.createElement("div");
                outerDiv.className = "list-item__center";
                var title = document.createElement("div");
                title.className = "list-item__title";
                // title.innerHTML = f[i].name.replace(/.txt/g , '');
                title.innerHTML = app.getTitle(f[i].name);
                console.log("Filename: ", f[i].name ," at index: " , i);

                title.dataset.url = f[i].name;
                listItem.addEventListener("click", app.openSavedNote, false);

                outerDiv.appendChild(title);
                listItem.appendChild(outerDiv);
                fileEntries.appendChild(listItem);
            }
        });
    },
    deleteNote:function(){
        var onDelete = function(){
            navigator.notification.alert(notificationMessages.deleteSuccess[currentLanguage] , null , "The Spine app");
        };
        var f = app.generateFileName(document.getElementById('dateTime').value + document.getElementById('diagnose').value +"f-title"+ document.getElementById("title").value);
        app.deleteFile(f);
        app.clearForm(onDelete);
    },
    openSavedNote: function (event) {
        var url = event.target.dataset.url;
        app.readFile(url, function (d) {
            app.showPage("notebookPage");
            // pageTitle.innerHTML = url;
            var data = JSON.parse(d);

            document.getElementById('dateTime').value = data.date;
            document.getElementById("title").value = data.title;
            document.getElementById('name').value = data.name;            
            document.getElementById('city').value = data.city;
            document.getElementById('diagnose').value = data.diagnose;
            document.getElementById('recommends').checked = data.recommends;
            document.getElementById('surgery').value = data.surgery;
            document.getElementById('surgery').hidden = !data.recommends;
            // var f = app.generateFileName(document.getElementById('dateTime').value + document.getElementById('diagnose').value +"f-title"+ document.getElementById("title").value);
            app.deleteFile(url);
        });
    },
    showPage: function (id) {
        app.clearLists();
        var pages = document.getElementsByClassName("pages");
        var page = document.getElementById(id);

        for (var i = 0; i < pages.length; i++) {
            pages[i].hidden = true;
        }
        page.hidden = false;
    },
    newNote: function(){
        var a  = app.isFormAcceptable();
        console.log("Is form acceptable: " , a);
        if(app.isFormAcceptable()){
            app.saveNote(false , function(){
                app.clearForm();
            });
        }else{
            app.clearForm();
        }
    },
    isFormAcceptable: function(){
        console.log("Values: " , document.getElementById("dateTime").value.length ,
        document.getElementById("diagnose").value.length, document.getElementById("name").value.length);
        if(document.getElementById("dateTime").value.length<1 ||  document.getElementById("name").value.length<1 ||
            document.getElementById("diagnose").value.length<1){
            return false;
        }else{
            return true;
        }
    },
    previousPage: function(){
        if(notebookPage.hidden && !savedNotesPage.hidden){
           app.showPage('notebookPage'); 
        }
    },
    clearForm: function(onClear){
        document.getElementById("name").value = "";
        document.getElementById("title").value = "";
        document.getElementById("city").value = "";
        document.getElementById("diagnose").value = "";
        document.getElementById("recommends").checked = false;
        document.getElementById("surgery").value = "";
        document.getElementById("surgery").hidden = true;
        onClear();
    },
    changeLanguage: function(lan){
        currentLanguage = lan;
        console.log("Language is: ",lan);
        switch (lan) {
          case "bg":
            dateTimePlaceholder.innerHTML = "Дата*";
            title.placeholder = "Заглавие";
            document.getElementById("name").placeholder = "Име на доктор*";
            city.placeholder = "Град";
            diagnose.placeholder = "Диагноза*";
            recommendsPlaceholder.innerHTML = "Препоръчва ли се операция?";
            surgery.placeholder = "Каква операция?";
            requiredFieldsPlaceholder.innerHTML = "Полетата със * са задължителни";
            savedNotesButton.innerHTML = "Запазени";
            deleteNoteButton.innerHTML = "Изтрий";
            newNoteButton.innerHTML = "Нова";
            break;
          case "en":
            dateTimePlaceholder.innerHTML = "Date*";
            title.placeholder = "Title";
            document.getElementById("name").placeholder = "Doctor's name*";
            city.placeholder = "City";
            diagnose.placeholder = "Diagnose*";
            recommendsPlaceholder.innerHTML = "Recommends surgery?";
            requiredFieldsPlaceholder.innerHTML = "Fields with * are mandatory";
            surgery.placeholder = "What surgery?";
            savedNotesButton.innerHTML = "Saved";
            deleteNoteButton.innerHTML = "Delete";
            newNoteButton.innerHTML = "New";
            break;
          case "de":
            dateTimePlaceholder.innerHTML = "Datum*";
            title.placeholder = "Titel";
            document.getElementById("name").placeholder = "Name des Arztes*";
            city.placeholder = "Stadt";
            diagnose.placeholder = "Diagnostizieren*";
            requiredFieldsPlaceholder.innerHTML = "Mit * gekennzeichnete Felder sind Pflichtfelder";
            recommendsPlaceholder.innerHTML = "Wird eine Operation empfohlen?";
            surgery.placeholder = "Was für eine Operation?";
            savedNotesButton.innerHTML = "Gespeichert";
            deleteNoteButton.innerHTML = "Löschen";
            newNoteButton.innerHTML = "Neu";
            break;
          case "ru":
            dateTimePlaceholder.innerHTML = "Дата*";
            title.placeholder = "Заглавие";
            document.getElementById("name").placeholder = "Имя доктора*";
            city.placeholder = "Город";
            diagnose.placeholder = "Диагностики*";
            recommendsPlaceholder.innerHTML = "Рекомендуется ли операция?";
            requiredFieldsPlaceholder.innerHTML = "Поля отмечанные * обязательны";
            surgery.placeholder = "Какая операция?";
            savedNotesButton.innerHTML = "Сохраняется";
            deleteNoteButton.innerHTML = "Удалять";
            newNoteButton.innerHTML = "Новый";
            break;
        }
    },
    generateFileName : function(string) {
        var buff = (string).replace(/,/g, '') + '.txt';
        //Remove all special characters in a file name
        // var buff = buff.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') + '.txt';
        return buff;
    },
    getTitle :  function(fileName){
        return (fileName.slice(fileName.search(/f-title/g) + 7 , fileName.length - 4));
    },
    writeToFile: function (path, fileName, information , onWrite , onError) {
        window.resolveLocalFileSystemURL(path, function (dir) {
            dir.getFile(fileName, {create: true , exclusive:true},
                function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function (e) {
                            console.log("Write completed.");
                            onWrite(fileName);
                        };
                        fileWriter.onerror = function (e) {
                            console.log("Write failed: " + e.toString());
                        };
                        var blob = new Blob([information], {
                            type: "text/plain"
                        });
                        fileWriter.truncate(information.length);
                        // fileWriter.seek(0);
                        fileWriter.write(blob);
                    }, onError);
                },
                onError
            );
        });
    },
    readFile: function (fileName, handler) {
        var path = cordova.file.dataDirectory;
        window.resolveLocalFileSystemURL(path, function (dir) {
            dir.getFile(fileName, {},function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function (e) {
                            handler(this.result);
                        };
                        reader.readAsText(file);
                    }, app.onError);
                },
                app.onError
            );
        });
    },
    deleteFile: function (fileName , onDelete) {
        var path = cordova.file.dataDirectory;
        console.log("Filename is: " , fileName);
        window.resolveLocalFileSystemURL(path, function (dir) {
            dir.getFile(fileName, {
                create: false
            }, function (fileEntry) {
                fileEntry.remove(function () {
                    // The file has been removed succesfully
                    // navigator.notification.alert("Успешно изтрихте записка" , null , "The Spine app");
                    onDelete();
                    console.log("Deleted file: " , fileName);
                }, function (error) {
                    // Error deleting the file
                    console.log(error);
                    navigator.notification.alert("Проблем при изтриване", null , "The Spine app");
                }, function () {
                    console.log("The file doesn't exist");
                    // The file doesn't exist
                    navigator.notification.alert("Не можете да изтриете незаписана записка" , null , "The Spine app");
                });
            });
        });
    },
    listDir: function (path, onRead) {
        app.clearLists();
        window.resolveLocalFileSystemURL(path,
            function (fileSystem) {
                var reader = fileSystem.createReader();
                reader.readEntries(
                    function (entries) {
                        // console.log(entries);
                        onRead(entries);
                    },
                    function (err) {
                        console.log(err);
                    }
                );
            },
            function (err) {
                console.log(err);
            }
        );
    },
    clearLists: function () {
        fileEntries.innerHTML = "";
    },
    onError: function (e) {
        navigator.notification.alert("ERROR: " + e);
        console.log(e);
    }

};