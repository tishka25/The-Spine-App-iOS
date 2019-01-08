/**
 * Global variable for opening files in "Saved Notes"
 */
var currentFileUrl = null;

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
        app.showPage("mainPage");
        // var ref = cordova.InAppBrowser.open('https://www.thespineapp.com', '_blank', 'toolbar=no');
        // ref.show();
    },
    saveNote: function (object) {
        console.log(object);
            var date;
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
        if (!object) {
            date = document.getElementById("dateTime").value;
            name = document.getElementById("name").value;
            city = document.getElementById("city").value;
            diagnose = document.getElementById("diagnose").value;
            recommends = document.getElementById("recommends").checked;
            surgery = document.getElementById("surgery").value;
        }else{
            date = object.date;
            name = object.name;
            city = object.city;
            diagnose = object.diagnose;
            recommends = object.recommends;
            surgery = object.surgery;
        }
        


        if (date.length < 1 || name.length < 1 || city.length < 1 || diagnose.length < 1)
            navigator.notification.alert("Моля попълнете всички празни полета");
        else {
            var fileTitle = (date + diagnose).replace(/\s+/g, '') + '.txt';
            var obj = {
                "date": date,
                "name": name,
                "city": city,
                "diagnose": diagnose,
                "recommends": recommends,
                "surgery": surgery
            };
            var fileInformation = JSON.stringify(obj);
            console.log("Saving file: " + fileTitle, fileInformation, JSON.parse(fileInformation));
            app.writeToFile(cordova.file.dataDirectory, fileTitle, fileInformation);
        }
    },
    listNotes: function () {
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
                title.innerHTML = f[i].name;

                title.dataset.url = f[i].name;
                listItem.addEventListener("click", app.openSavedNote, false);

                outerDiv.appendChild(title);
                listItem.appendChild(outerDiv);
                fileEntries.appendChild(listItem);
            }
        });
    },
    openSavedNote: function (event) {
        // console.log(event.target);

        var url = event.target.dataset.url;
        app.readFile(url, function (d) {
            app.showPage("savedNotePage");
            pageTitle.innerHTML = url;
            var data = JSON.parse(d);
            console.log("Saved file is: ", data);

            document.getElementById('saved-dateTime').value = data.date;
            document.getElementById('saved-name').value = data.name;            
            document.getElementById('saved-city').value = data.city;
            document.getElementById('saved-diagnose').value = data.diagnose;
            document.getElementById('saved-recommends').checked = data.recommends;
            document.getElementById('saved-surgery').value = data.surgery;
        });
    },
    resaveNote: function(){
        var data = {};
        data.date = document.getElementById("saved-dateTime").value;
        data.name = document.getElementById("saved-name").value;
        data.city = document.getElementById("saved-city").value;
        data.diagnose = document.getElementById("saved-diagnose").value;
        data.recommends = document.getElementById("saved-recommends").checked;
        data.surgery = document.getElementById("saved-surgery").value;

        app.saveNote(data);
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
    writeToFile: function (path, fileName, information) {
        window.resolveLocalFileSystemURL(path, function (dir) {
            dir.getFile(fileName, {create: true},
                function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function (e) {
                            console.log("Write completed.");
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
                    }, app.onError);
                },
                app.onError
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
                    navigator.notification.alert("Успешно изтрихте записка" , null , "The Spine app");
                    onDelete();
                }, function (error) {
                    // Error deleting the file
                    navigator.notification.alert("Проблем при изтриване", null , "The Spine app");
                }, function () {
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