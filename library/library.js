//Library of components
list_Math = [
    //Inputs
    {
        name: 'INPUT_INT',
        type: 'inp',
        id: 0,
        input: [],
        output: ['int'],
    },
    {
        name: 'INPUT_STR',
        type: 'inp',
        id: 0,
        input: [],
        output: ['str'],
    },
    {
        name: 'INPUT_BOOL',
        type: 'inp',
        id: 0,
        input: [],
        output: ['bool'],
    },

    //Outputs

    {
        name: 'OUTPUT_INT',
        type: 'outp',
        id: 0,
        input: ['int'],
        output: [],
    },
    {
        name: 'OUTPUT_STR',
        type: 'outp',
        id: 0,
        input: ['str'],
        output: [],
    },
    {
        name: 'OUTPUT_BOOL',
        type: 'outp',
        id: 0,
        input: ['bool'],
        output: [],
    },


    //Math operations
    {
        name: 'SUM',
        type: 'math',
        id: 0,
        input: ['int', 'int'],
        output: ['int'],
        funct: function (a) {
            return +a[0] + +a[1];
        }
    },
    {
        name: 'SUB',
        type: 'math',
        id: 0,
        input: ['int', 'int'],
        output: ['int'],
        funct: function (a) {
            return +a[0] - +a[1];
        }
    },
    {
        name: 'MULT',
        type: 'math',
        id: 0,
        input: ['int', 'int'],
        output: ['int'],
        funct: function (a) {
            return +a[0] * +a[1];
        }
    },
    {
        name: 'DIV',
        type: 'math',
        id: 0,
        input: ['int', 'int'],
        output: ['int'],
        funct: function (a) {
            return Math.floor(+a[0] / +a[1]);
        }
    },


    //String operations
    {//теперь работает
        name: 'REPL',
        type: 'strOp',
        id: 0,
        input: ['str', 'str', 'str'],
        output: ['str'],
        funct: function (a) {
            return a[0].split(a[1]).join(a[2]);
        }
    },
    {
        name: 'IsSubSTR',
        type: 'strOp',
        id: 0,
        input: ['str', 'str'],
        output: ['bool'],
        funct: function (a) {
            return a[0].includes(a[1]);
        }
    },
    {
        name: 'CONC',
        type: 'strOp',
        id: 0,
        input: ['str', 'str'],
        output: ['str'],
        funct: function (a) {
            return (String(a[0]) + String(a[1]));
        }
    },

    /*
    !!If you want to add new component
    Add Object to the list
    {
    name: '' - unique name that you want to use
    type: 'math' or 'strOp'
    id: 0 - should be equal to zero
    input: [] - array if all inputs 'int'/'str'/'bool'
    output: [] - type of output in array 'int'/'str'/'bool'
    funct: function(a){ a - input array
    return  operations that you want to execute (return a[1]+ a[2] - example of function)
    }
    */
];