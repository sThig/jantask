function setTitle() {
    var titleEl = document.querySelector('[data-behavior=title]');
    var title = localStorage.getItem("taskTitle");

    if (!title) return;
    titleEl.innerText = title;
}

function setTasks() {
    var taskListEl = document.querySelector('#incomplete-tasks');
    var tasks = localStorage.getItem("tasks");
    if (!tasks) return;

    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
    }
}

$(document).ready(function() {
    var apiKey = 'j878g39yx378pa77djthzzpn';

    setTitle();

    setTasks();
    var taskInput = document.getElementById("new-task"); //new-task
    var addButton = document.getElementsByTagName("button")[0]; //first button
    var incompleteTaskHolder = document.getElementById("incomplete-tasks"); //incomplete-tasks
    var completedTasksHolder = document.getElementById("completed-tasks"); //completed-tasks



    // New Task List Item
    var createNewTaskElement = function(taskString) {
        var listItem = document.createElement("li")

        //input (checkbox)
        var checkBox = document.createElement("input")
            //label
        var label = document.createElement("label")
            //input (text)
        var editInput = document.createElement("input")
            //button.edit
        // var buttonContainer = document.createElement("div")
        //     //open Div
        // var buttons =
        var editButton = document.createElement("button");
        //button.delete
        var deleteButton = document.createElement("button");
        //add in the image`
        // buttonContainerEnd = document.createElement("/div")

        //my edit

        function fadeIn(listItem) {
            listItem.style.opacity = 0;
            // listItem.style.backgroundColor = '#99C262';


            var tick = function() {
                listItem.style.opacity = +listItem.style.opacity + 0.05;

                if (+listItem.style.opacity < 1) {
                    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
                }

            };

            tick();
            listItem.style.backgroundColor = 'hsl(75, 100%, 1%)';
            var d = 1;
            for (var i = 75; i <= 100; i = i + 0.05) { //i represents the lightness
                d += 4.75;
                (function(ii, dd) {
                    setTimeout(function() {
                        listItem.style.backgroundColor = 'hsl(220, 100%, ' + ii + '%)';
                    }, dd);
                })(i, d);
            }
        }

        fadeIn(listItem);


        //Each element, need to be modified

        checkBox.type = "checkbox";
        editInput.type = "text";

        editButton.innerText = "Edit"
        editButton.className = "edit";
        deleteButton.innerText = "Delete";
        deleteButton.className = "delete";

        label.innerText = taskString;

        listItem.appendChild(checkBox);
        // .className = "list-group-item";
        listItem.appendChild(label);
        listItem.appendChild(editInput);

        // listItem.appendChild(buttonContainer)
        //     .className = "button-set";

        listItem.appendChild(editButton)
            .className = "dynobuttons1 btn btn-secondary edit btn-sm";
        listItem.appendChild(deleteButton)
            .className = "dynobuttons2 btn btn-secondary delete btn-sm";

      // buttonContainer.insertHTML(listItem.className("btn-secondary"))
        // listItem.appendChild(image);
// debugger
//         $('.dynobuttons').wrap("<div class='button-set'></div>");
//         // listItem.appendChild(object).html(innerHTML stuff)

        return listItem;
    }

    //Add a new task
    var addTask = function() {
        //Create a new list item with the text from #new-task:
        var listItem = createNewTaskElement(taskInput.value);
        var tasks = JSON.parse(localStorage.getItem("tasks"));
        var flickrValue = taskInput.value;

                $.ajax({
                        type: 'GET',
                        url: "https://api.gettyimages.com/v3/search/images/creative?phrase=" + (flickrValue),
                        beforeSend: function(request) {
                            request.setRequestHeader("Api-Key", apiKey);
                        }
                    })

                    .done(function(data) {
                        console.log("Success with data")
                        var image = data.images[0];
                            $(listItem).append("<div class='img-placement image-cropper'><img class='img-round' src='" + data.images[i].display_sizes[0].uri + "'/></div>");
                    })
                    .fail(function(data) {
                        alert(JSON.stringify(data, 2))
                        console.log(data.images)

                    });

        //Append listItem to incompleteTaskholder
        incompleteTaskHolder.appendChild(listItem)
            .className = "list-group-item";
        bindTaskEvents(listItem, taskCompleted);
            $(".todo").css('visibility','visible');
        taskInput.value = "";
        //

    }

    $('.add-button').attr('disabled', true);



    $('#new-task').keyup(function() {
        if ($(this).val().length != 0)
            $('.add-button').attr('disabled', false).html("Adding...");

        else
            $('.add-button').attr('disabled', true);
    });


    $('#new-task').keypress(function(e) {
        if (e.which == 13) {
            addButton.click();
            return false; //<---- Add this line
        }
    });

    $(".add-button").click(function() {
        $(this).attr('disabled', 'disabled').html("Add");

    });

    //Edit an existing task
    var editTask = function() {
        console.log("edit task...");
        var listItem = this.parentNode;

        var editInput = listItem.querySelector("input[type=text");
        var label = listItem.querySelector("label");

        var containsClass = listItem.classList.contains("editMode");
        //if the class of the parent is .editMode

        if (containsClass) {
            //Switch from .editMode
            //label text become the input's value
            label.innerText = editInput.value
            this.classList.remove('btn-primary');
            this.classList.add('btn-secondary');
        } else {
            //Switch to .editMode
            //input value becomes the label' text
            editInput.value = label.innerText
            this.classList.remove('btn-secondary');
            this.classList.add('btn-primary');
        }
        //Toggle .editMode on the list item
        listItem.classList.toggle("editMode");
    }
    //Delete an existing task
    var deleteTask = function() {

        var listItem = this.parentNode;
        var ul = listItem.parentNode;
        ul.removeChild(listItem);
    }

    //Mark a task complete
    var taskCompleted = function() {
        console.log("complete task...");
        //Append the task list item to the complete-tasks
        var listItem = this.parentNode
        completedTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskIncomplete);
        $(".completed").css('visibility','visible');
    }

    //Mark a task as Incomplete
    var taskIncomplete = function() {
        console.log("Incomplete task...");
        var listItem = this.parentNode;
        incompleteTaskHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskCompleted);
        $(".completed").css('visibility','hidden');
    }

    var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
        // console.log("Bind list item events");
        //select it's children
        var checkBox = taskListItem.querySelector("input[type=checkbox]");
        var editButton = taskListItem.querySelector("button.edit");
        var deleteButton = taskListItem.querySelector("button.delete");
        //bind editTask to edit button
        editButton.onclick = editTask;
        //bind deleteTask to delete button
        deleteButton.onclick = deleteTask;
        //bind checkBoxEventhandler to checkbox
        checkBox.onchange = checkBoxEventHandler;

        //bind taskCompleted to the checkbox
    }

    var ajaxRequest = function() {
            // console.log("AJAX request");
        }
        //Set the click handler to the addTask function
        //addButton.onclick = addTask;
    addButton.addEventListener("click", addTask);
    addButton.addEventListener("click", ajaxRequest);

    //cycle over incompleteTaskHolder ul list items
    for (var i = 0; i < incompleteTaskHolder.children.length; i++) {
        //bind events to list item's children (taskComplete)
        bindTaskEvents(incompleteTaskHolder.children[i], taskCompleted)
    }

    //cycle over CmpleteTaskHolder ul list items
    for (var i = 0; i < completedTasksHolder.children.length; i++) {

        //bind events to list item's children (taskIncomplete)
        bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
    }


});
