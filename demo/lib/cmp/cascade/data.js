/**
 * User: caolvchong@gmail.com
 * Date: 7/22/13
 * Time: 9:45 AM
 */
define(function(require, exports, module) {
    var data = [{
        name: 'province',
        data: [{value: '100', text: '北京'}, {value: '101', text: '广东'}, {value: '102', text: '福建', selected: true}]
    }, {
        name: 'city',
        data: [
            [{value: '1001', text: '北京'}],
            [{value: '1010', text: '广州'}, {value: '1011', text: '深圳'}],
            [{value: '1020', text: '福州'}, {value: '1021', text: '厦门'}, {value: '1022', text: '泉州'}]
        ]
    }, {
        name: 'county',
        data: [
            [
                [{value: '10010', text: '东城区'}, {value: '10011', text: '西城区'}, {value: '10012', text: '崇文区'}, {value: '10013', text: '宣武区'}]
            ],
            [
                [{value: '10100', text: '天河区'}, {value: '10101', text: '越秀区'}],
                [{value: '10110', text: '福田区'}, {value: '10111', text: '罗湖区'}, {value: '10112', text: '南山区'}]
            ],
            [
                [{value: '10200', text: '鼓楼区'}, {value: '10201', text: '台江区'}, {value: '10202', text: '闽侯县'}],
                [{value: '10210', text: '思明区'}, {value: '10211', text: '翔安区'}, {value: '10212', text: '海沧区'}],
                [{value: '10220', text: '梅列区'}, {value: '10221', text: '三元区'}]
            ]
        ]
    }];

    module.exports = data;
});