const opcodeMap = {
    // Motion
    motion_direction: {
        category: 'motion',
        label: '方向'
    },
    motion_xposition: {
        category: 'motion',
        label: 'x坐标'
    },
    motion_yposition: {
        category: 'motion',
        label: 'y坐标'
    },

    // Looks
    looks_size: {
        category: 'looks',
        label: '大小'
    },
    looks_costumenumbername: {
        category: 'looks',
        //labelFn: params => `造型 ${params.NUMBER_NAME}`
        labelFn: (params) => {
            return '造型编号';
        }
    },
    looks_backdropnumbername: {
        category: 'looks',
        //labelFn: params => `背景 ${params.NUMBER_NAME}`
        labelFn: (params) => {
            return '背景编号';
        }
    },
    looks_backdropname: {
        category: 'looks',
        label: '背景名称'
    },

    // Data
    data_variable: {
        category: 'data',
        labelFn: params => params.VARIABLE
    },
    data_listcontents: {
        category: 'list',
        labelFn: params => params.LIST
    },

    // Sound
    sound_volume: {
        category: 'sound',
        label: '音量'
    },
    sound_tempo: {
        category: 'sound',
        label: '节奏'
    },

    // Sensing
    sensing_answer: {
        category: 'sensing',
        label: '回答'
    },
    sensing_loudness: {
        category: 'sensing',
        label: '响度'
    },
    sensing_username: {
        category: 'sensing',
        label: '用户名'
    },
    sensing_current: {
        category: 'sensing',
        labelFn: params => {
            let currentMenu = params.CURRENTMENU.toLowerCase();
            return {
                year: '年',
                month: '月',
                date: '日',
                dayofweek: '星期',
                hour: '时',
                minute: '分',
                second: '秒'
            }[currentMenu];
            /*
            if (currentMenu === 'dayofweek') {
                currentMenu = 'day of week';
            }
            return currentMenu;
            */
        }
    },
    sensing_timer: {
        category: 'sensing',
        label: '计时器'
    }
};

/**
 * Get the label for an opcode
 * @param {string} opcode the opcode you want a label for
 * @return {object} object with label and category
 */
export default function (opcode) {
    if (opcode in opcodeMap) return opcodeMap[opcode];
    return {
        category: 'data',
        label: opcode
    };
}
