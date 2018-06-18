list_Math = [
    //Inputs
    {
        name: 'INPUT_INT',
        id: 0,
        input: [],
        output: ['int'],
    },
    {
        name: 'INPUT_STR',
        id: 0,
        input: [],
        output: ['str'],
    },
    {
        name: 'INPUT_BOOL',
        id: 0,
        input: [],
        output: ['bool'],
    },

    //Outputs

    {
        name: 'OUTPUT_INT',
        id: 0,
        input: ['int'],
        output: [],
    },
    {
        name: 'OUTPUT_STR',
        id: 0,
        input: ['str'],
        output: [],
    },
    {
        name: 'OUTPUT_BOOL',
        id: 0,
        input: ['bool'],
        output: [],
    },


    //Math operations
    {
        name: 'SUM',
        id: 0,
        input: ['int', 'int'],
        output: ['int'],
        funct: function(a){
            return a[0]+a[1];
        }
    },
    {
        name: 'SUB',
        id: 0,
        input: ['int', 'int'],
        output: ['int'],
        funct: function(a){
            return a[0]-a[1];
        }
    },
    {
        name: 'MULT',
        id: 0,
        input: ['int', 'int'],
        output: ['int'],
        funct: function(a) {
            return a[0] * a[1];
        }
    },
    {
        name: 'DIV',
        id: 0,
        input: ['int', 'int'],
        output: ['int'],
        funct: function(a) {
            return Math.floor( a[0] / a[1] );
        }
    },


    //String operations
    {
        name: 'REPL',
        id: 0,
        input: ['str', 'str', 'str'],
        output: ['str'],
        funct: function(a) {
            return a[0].replace(a[1], a[2]);
        }
    },
    {
        name: 'IsSubSTR',
        id: 0,
        input: ['str', 'str'],
        output: ['bool'],
        funct: function(a) {
            return a[0].includes(a[1]);
        }
    },
    {
        name: 'CONC',
        id: 0,
        input: ['str', 'str'],
        output: ['str'],
        funct: function(a) {
            return String(a[0])+String(a[1]);
        }
    },
];


$('document').ready(function () {

    for (i of [list_Math[0], list_Math[1], list_Math[2]]) {
        $('#inp').append('<li class="col-md-12" id="' + i.name + '">' + i.name + '</li>');
    }

    for (i of [list_Math[3], list_Math[4], list_Math[5]]) {
        $('#outp').append('<li class="col-md-12" id="' + i.name + '">' + i.name + '</li>');
    }

    for (i of [list_Math[6], list_Math[7], list_Math[8], list_Math[9]]) {
        $('#math').append('<li class="col-md-12" id="' + i.name + '">' + i.name + '</li>');
    }

    for (i of [list_Math[10], list_Math[11], list_Math[12]]) {
        $('#strOp').append('<li class="col-md-12" id="' + i.name + '">' + i.name + '</li>');
    }



    $("#menu ul").hide();

    $("#menu li p").click(function () {

        if ($(this).hasClass("chosen") == false){
            $(this).addClass("chosen");
        }
        else {
            $(this).removeClass("chosen");
        }
        $("#"+ ($(this.parentNode).children())[1].id).slideToggle("slow");
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


    $('#diagramContainer').droppable({
        drop: function (event, ui) {

            var identity = ui.draggable.context.id;

            var result = list_Math.filter(word => word.name == identity);

            //Правильная позиция
            var d = $("#diagramContainer").offset();

            var component = '<div class="cont" id="' + result[0].name + result[0].id + '"' +
                'style=" width: 180px; height: ' + 40 * Math.max((result[0].input.length + 1), (result[0].output.length + 1)) + 'px;   ' +
                ' left:' + (ui.absolutePosition.left - d.left) + '; top: ' + (ui.absolutePosition.top - d.top) + ';  "' +
                ' >' + result[0].name;

            for (i = 1; i <= result[0].input.length; i++) {
                var input_id = result[0].name + String(result[0].id) + ".input" + i;
                console.log(input_id);
                component = component + '<div id="' + input_id + '" class="item ' + result[0].input[i - 1] + '" style="top:' + i * 40 + 'px;">' + result[0].input[i - 1] + '</div>';

            }

            for (i = 1; i <= result[0].output.length; i++) {
                var output_id = result[0].name + String(result[0].id) + ".output" + i;
                console.log(output_id);
                component = component + '<div id="' + output_id + '" class="item ' + result[0].output[i - 1] + '" style="top:' + i * 40 + 'px;left: 100px; ">' + result[0].output[i - 1] + '</div>';

            }

            component = component + '<button class="delete" id =' + result[0].name + result[0].id + 'd' + '></button></div>'
            $('#diagramContainer').append(component);

            for (i = 1; i <= result[0].input.length; i++) {
                var input_id = result[0].name + String(result[0].id) + ".input" + i;
                var endpointOptions = {
                    isTarget: true,
                    endpoint: "Rectangle",
                    paintStyle: {fill: "gray"},
                    anchor: "Left",
                };
                var endpoint = jsPlumb.addEndpoint(String(input_id), endpointOptions);
            }

            for (i = 1; i <= result[0].output.length; i++) {
                var output_id = result[0].name + String(result[0].id) + ".output" + i;
                var endpointOptions = {
                    isSource: true,
                    Connector: ["Straight"],
                    anchor: "Right",
                    maxConnections: -1,
                };
                var endpoint = jsPlumb.addEndpoint(String(output_id), endpointOptions);

            }
            jsPlumb.draggable(result[0].name + String(result[0].id));

            result[0].id = result[0].id + 1;


        },
    });

    //изменение цвета после соединения
    jsPlumb.bind("connection", function (ui) {
        var sId = document.getElementById(ui.sourceId).textContent;
        var tId = document.getElementById(ui.targetId).textContent;

        var color;

        if (sId != tId) {
            color = "#ed0034";
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
            //    hoverPaintStyle:{ stroke:"red", strokeWidth:1 }
        });

        ui.connection.setType("example");
    });

    //удаление элемнета
    $(".delete").live('click', function () {
        // alert('you clicked me!');
        var id_for_deletion = this.id.substr(0, this.id.length - 1);


        //подумать про правильный id если >10  - работать не будет
        var identity = id_for_deletion.substr(0, id_for_deletion.length - 1);
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

});
