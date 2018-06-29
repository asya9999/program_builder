$('document').ready(function () {

    for(let comp of list_Math){

    $('#' + comp.type).append('<li class="col-md-12" id="' + comp.name + '">' + comp.name + '</li>');

    }

    $("#menu ul").hide();

    $("#menu li p").click(function () {

        if ($(this).hasClass("chosen") == false) {
            $(this).addClass("chosen");
        }
        else {
            $(this).removeClass("chosen");
        }
        $("#" + ($(this.parentNode).children())[1].id).slideToggle("slow");
    });


    $("#dialog-1").dialog({
        modal: true,
        autoOpen: false,
    });

    $("#dialog-3").dialog({
        modal: true,
        autoOpen: false,
    });


});


jsPlumb.ready(function () {

    jsPlumb.setContainer("diagramContainer");

    for (i of list_Math) {
        $('#' + i.name).draggable({
            helper: 'clone',
            appendTo: '.container'
        });

        $('#' + i.name).addClass('clone col-md-12');

    }

    $('#diagramContainer').droppable({//создание элемента
        drop: function (event, ui) {

            var identity = ui.draggable.context.id;

            var result = list_Math.filter(word => word.name == identity);

            //Правильная позиция
            var d = $("#diagramContainer").offset();

            var component = '<div class="cont" id="' + result[0].name + "id" + result[0].id + '"' +
                'style=" width: 180px; height: ' + 40 * Math.max((result[0].input.length + 1), (result[0].output.length + 1)) + 'px;   ' +
                ' left:' + (ui.absolutePosition.left - d.left) + '; top: ' + (ui.absolutePosition.top - d.top) + ';  "' +
                ' >' + result[0].name + '<span class ="number" >' + result[0].id + '</span>';

            for (i = 1; i <= result[0].input.length; i++) {
                var input_id = result[0].name + "id" + String(result[0].id) + ".input" + i;
                component = component + '<div id="' + input_id + '" class="item ' + result[0].input[i - 1] + '" style="top:' + i * 40 + 'px;">' + result[0].input[i - 1] + '</div>';

            }

            for (i = 1; i <= result[0].output.length; i++) {
                var output_id = result[0].name + "id" + String(result[0].id) + ".output" + i;
                component = component + '<div id="' + output_id + '" class="item ' + result[0].output[i - 1] + '" style="top:' + i * 40 + 'px;left: 100px; ">' + result[0].output[i - 1] + '</div>';

            }

            component = component + '<button class="delete" id =' + result[0].name + "id" + result[0].id + 'd' + '></button></div>'
            $('#diagramContainer').append(component);

            for (i = 1; i <= result[0].input.length; i++) {
                var input_id = result[0].name + "id" + String(result[0].id) + ".input" + i;
                var endpointOptions = {
                    isTarget: true,
                    endpoint: "Rectangle",
                    paintStyle: {fill: "gray"},
                    anchor: "Left",
                };
                var endpoint = jsPlumb.addEndpoint(String(input_id), endpointOptions);
            }

            for (i = 1; i <= result[0].output.length; i++) {
                var output_id = result[0].name + "id" + String(result[0].id) + ".output" + i;
                var endpointOptions = {
                    isSource: true,
                    Connector: ["Straight"],
                    anchor: "Right",
                    maxConnections: -1,
                };
                var endpoint = jsPlumb.addEndpoint(String(output_id), endpointOptions);

            }
            jsPlumb.draggable(result[0].name + "id" + String(result[0].id));

            result[0].id = result[0].id + 1;

        },
    });

    var color_red = [];//для отслеживания красных соединений

    //изменение цвета после соединения
    jsPlumb.bind("connection", function (ui) {
        var sId = document.getElementById(ui.sourceId).textContent;
        var tId = document.getElementById(ui.targetId).textContent;

        var color;

        if (sId != tId) {
            color = "#ed0034";
            color_red.push({source: ui.sourceId, target: ui.targetId});
        }
        else {
            switch (tId) {
                case 'str':
                    color = "#00af3b";
                    break;
                case 'int':
                    color = "#006cff";
                    break;
                case 'bool':
                    color = "#6b757e";
                    break;
            }
        }


        jsPlumb.registerConnectionType("example", {
            paintStyle: {stroke: color, strokeWidth: 1},
        });

        ui.connection.setType("example");


    });

    //проверяю, убирается ли красное соединение
    jsPlumb.bind("connectionDetached", function (ui) {
        color_red = color_red.filter(word => (word.source != ui.sourceId) || (word.target != ui.targetId));
    })

    //удаление элемнета
    $(".delete").live('click', function () {
        // alert('you clicked me!');

        var id_for_deletion = this.id.substr(0, this.id.length - 1);

        //подумать про правильный id если >10  - работать не будет
        var identity = id_for_deletion.substr(0, id_for_deletion.lastIndexOf("id"));

        var result = list_Math.filter(word => word.name == identity);

        for (i = 1; i <= result[0].input.length; i++) {
            var input_id = id_for_deletion + ".input" + i;
            jsPlumb.removeAllEndpoints(input_id);
        }

        for (i = 1; i <= result[0].output.length; i++) {
            var output_id = id_for_deletion + ".output" + i;
            jsPlumb.removeAllEndpoints(output_id);
        }

        $('#' + id_for_deletion).remove();

    });

    //Topological Sort
    $(".start").click(
        function () {

            if (color_red.length > 0) {

                $('#dialog-1').dialog("open");
            }
            else {
                var conn = jsPlumb.getAllConnections();

                var connector = [];
                var elements = [];

                function parse(element) {
                    if (element.includes(".input")) {
                        element = element.substr(0, element.indexOf(".input"));
                    }
                    if (element.includes(".output")) {
                        element = element.substr(0, element.indexOf(".output"));
                    }
                    return element;
                }

                for (i = 0; i < conn.length; i++) {
                    connector.push({
                        targetId: parse(conn[i].targetId),
                        sourceId: parse(conn[i].sourceId)
                    });
                    if (elements.includes(parse(conn[i].targetId)) == false) {
                        elements.push(parse(conn[i].targetId))
                    }
                    ;
                    if (elements.includes(parse(conn[i].sourceId)) == false) {
                        elements.push(parse(conn[i].sourceId));
                    }
                }
                ;

                var number = elements.length + 1;
                while (elements.length != number) {
                    number = elements.length;
                    for (let element of elements) {
                        var no_parent = true;
                        //ищем элемент из connector без родителей -  correct
                        for (z = 0; z < connector.length; z++) {
                            if (connector[z].targetId == element) {
                                no_parent = false;
                            }
                        }
                        //создаем новый массив без элемента-
                        if (no_parent == true) {
                            connector = connector.filter(c => c.sourceId != element);
                            elements = elements.filter(c => c != element);
                        }
                    }
                }
                if (elements.length != 0) {
                  //  alert("Delete cycles!!!!");//добавить всплывающее окно!!!!
                    $("<div title='ERROR!'>Delete cycles</div>").dialog({
                        modal: true,
                    })
                }
                else {

                    //Data  driven engine
                    var new_connectors = [];
                    var new_elements = [];//инпуты и оутпуты
                    elements = [];//блоки

                    for (i = 0; i < conn.length; i++) {
                        new_connectors.push({
                            targetId: conn[i].targetId,
                            sourceId: conn[i].sourceId
                        });

                        var contain = false;

                        for (let element of elements) {
                            if (element.id == parse(conn[i].targetId)) {
                                contain = true;
                            }
                        }
                        ;
                        if (contain == false) {
                            var ind = 0;


                            //надо, чтобы
                            for (k = 0; k < list_Math.length; k++) {
                                if (((parse(conn[i].targetId)).substr(0, (parse(conn[i].targetId)).lastIndexOf("id"))) == (list_Math[k].name)) {
                                    ind = k;
                                }
                            }
                            elements.push({id: parse(conn[i].targetId), index: ind})
                        }
                        ;


                        var contain = false;

                        for (let element of elements) {
                            if (element.id == parse(conn[i].sourceId)) {
                                contain = true;
                            }
                        }
                        ;
                        if (contain == false) {

                            var ind = 0;

                            for (k = 0; k < list_Math.length; k++) {
                                /*  if ((parse(conn[i].sourceId)).includes(list_Math[k].name)) {
                                      ind = k;
                                  }*/
                                if (((parse(conn[i].sourceId)).substr(0, (parse(conn[i].sourceId)).lastIndexOf("id"))) == (list_Math[k].name)) {
                                    ind = k;
                                }

                            }

                            elements.push({id: parse(conn[i].sourceId), index: ind})
                        }
                        ;


                        contain = false;
                        for (let new_element of new_elements) {
                            if (new_element.id == conn[i].targetId) {
                                contain = true;
                            }
                        }
                        ;

                        if (contain == false) {
                            new_elements.push({id: conn[i].targetId, val: null})
                        }
                        ;


                        contain = false;
                        for (let new_element of new_elements) {
                            if (new_element.id == conn[i].sourceId) {
                                contain = true;
                            }
                        }
                        ;

                        if (contain == false) {
                            new_elements.push({id: conn[i].sourceId, val: null});
                        }
                        ;

                    }
                    ;

                    for (let new_element of new_elements) {

                        if ((String(new_element.id)).includes("INPUT_INT")) {

                            new_element.val = +prompt("Введите число " + new_element.id.substr(0, new_element.id.lastIndexOf(".output")), 10);//потом считать строку
                            //добавить считывание строки и boolean
                            for (let new_connector of new_connectors) {//ищу, где вводимое значение является сорсом

                                if (new_connector.sourceId == new_element.id) {//является сорсом

                                    for (let new_el of new_elements) {
                                        if (new_connector.targetId == new_el.id) {
                                            new_el.val = new_element.val;
                                        }
                                    }
                                }
                            }
                            new_elements = new_elements.filter(c => c.id != new_element.id);
                        };
                        if ((String(new_element.id)).includes("INPUT_STR")) {

                            new_element.val = prompt("Введите число " + new_element.id.substr(0, new_element.id.lastIndexOf(".output")), 10);//потом считать строку
                            //добавить считывание строки и boolean
                            for (let new_connector of new_connectors) {//ищу, где вводимое значение является сорсом

                                if (new_connector.sourceId == new_element.id) {//является сорсом

                                    for (let new_el of new_elements) {
                                        if (new_connector.targetId == new_el.id) {
                                            new_el.val = new_element.val;
                                        }
                                    }
                                }
                            }
                            new_elements = new_elements.filter(c => c.id != new_element.id);
                        }

                        if ((String(new_element.id)).includes("INPUT_BOOL")) {

                            new_element.val = prompt("Введите " + true + " or " + false  + " " + new_element.id.substr(0, new_element.id.lastIndexOf(".output")), true);//потом считать строку

                            if (new_element.val == "true"){
                            new_element.val = true;
                            }
                            else if( new_element.val == "false"){
                            new_element.val = false;
                            }
                            else {
                             $("<div title='ERROR!'>Not Boolean</div>").dialog({
                                modal: true,
                               })
                            }

                            //добавить считывание строки и boolean
                            for (let new_connector of new_connectors) {//ищу, где вводимое значение является сорсом

                                if (new_connector.sourceId == new_element.id) {//является сорсом

                                    for (let new_el of new_elements) {
                                        if (new_connector.targetId == new_el.id) {
                                            new_el.val = new_element.val;
                                        }
                                    }
                                }
                            }
                            new_elements = new_elements.filter(c => c.id != new_element.id);
                        }
                    }
                    ;


                    //recursion
                    var len = new_elements.length + 1;
                    while ((len != 0) && (len != new_elements.length)) {
                        len = new_elements.length;
                        for (let element of elements) {

                            if (((new_elements.filter(word => (((word.id).includes(element.id)) && (word.val != null)))).length) == (list_Math[element.index].input.length) && (list_Math[element.index].input.length > 0)) {
                                var input = (new_elements.filter(word => (((word.id).includes(element.id)) && (word.val != null))));


                                var result = 0;
                                if ((input[0].id).includes("OUTPUT")) {

                                // сделать для нескольких аутпутов
                                    result = input[0].val;
                                  /* $("<div class='result' title='RESULT!'>" + result +"</div>").dialog({
                                     modal: true,
                                   })*/
                                 alert(result);//добавить всплывающее окно

                                }
                                else {

                                var number = [];

                                for (let inp_element of input){
                                var inp_ind = +inp_element.id.substr( (String(inp_element)).lastIndexOf(".input"), inp_element.length)
                                number[inp_ind - 1] = inp_element.val;
                                }

                                    result = list_Math[element.index].funct(number);

                                }

                                //записсываю в аутпут
                                //передаю по коннекшенам

                                for (i = 1; i <= list_Math[element.index].output.length; i++) {
                                    var output_id = element.id + ".output" + i;

                                    for (let new_connector of new_connectors) {//ищу, где вводимое значение является сорсом

                                        if (new_connector.sourceId == output_id) {//является сорсом, всем таргетам надо поставить значение

                                            for (let new_el of new_elements) {
                                                if (new_connector.targetId == new_el.id) {
                                                    new_el.val = result;
                                                }
                                            }

                                        }
                                    }
                                    new_elements = new_elements.filter(word => word.id != output_id);
                                }
                                ;


                                var new_array = [];

                                for (let el of new_elements) {
                                    var for_deletion = false;
                                    for (let inp of input) {
                                        if (inp.id == el.id) {
                                            for_deletion = true;
                                        }
                                    }
                                    if (for_deletion == false) {
                                        new_array.push(el);
                                    }
                                }
                                new_elements = new_array;
                            }
                        }

                    }


                    if (((len != 0) && (len == new_elements.length))) {
                        //alert("Не все значения введены");
                        $('#dialog-3').dialog("open");
                    }
                }
                ;

            }
        }
    );//Finish of topoligical sort


});
