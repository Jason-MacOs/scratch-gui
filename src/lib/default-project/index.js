import {TextEncoder} from 'text-encoding';
import projectJson from './project.json';

/* eslint-disable import/no-unresolved */
import popWav from '!arraybuffer-loader!./83a9787d4cb6f3b7632b4ddfebf74367.wav';
import meowWav from '!arraybuffer-loader!./83c36d806dc92327b9e7049a565c6bff.wav';
import backdrop from '!raw-loader!./cd21514d0531fdffb22204e0ec5ed84a.svg';
import costume1 from '!raw-loader!./09dc888b0b7df19f70d81588ae73420e.svg';
import costume2 from '!raw-loader!./3696356a03a8d938318876a593572843.svg';
import costume3 from '!raw-loader!./37adf420abef899a024dc8e9def14ada.svg';
import costume4 from '!raw-loader!./59d2003830d4eb592cf5d9a37561fde9.svg';
import costume5 from '!raw-loader!./52656dad6a045a77b57d38ea85bf3c2c.svg';
import costume6 from '!raw-loader!./0ca03cb3489e383f1a97b76c9cc2b95c.svg';
/* eslint-enable import/no-unresolved */

const encoder = new TextEncoder();
export default [{
    id: 0,
    assetType: 'Project',
    dataFormat: 'JSON',
    data: JSON.stringify(projectJson)
}, {
    id: '83a9787d4cb6f3b7632b4ddfebf74367',
    assetType: 'Sound',
    dataFormat: 'WAV',
    data: new Uint8Array(popWav)
}, {
    id: '83c36d806dc92327b9e7049a565c6bff',
    assetType: 'Sound',
    dataFormat: 'WAV',
    data: new Uint8Array(meowWav)
}, {
    id: 'cd21514d0531fdffb22204e0ec5ed84a',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(backdrop)
}, {
    id: '09dc888b0b7df19f70d81588ae73420e',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(costume1)
}, {
    id: '3696356a03a8d938318876a593572843',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(costume2)
}, {
    id: '37adf420abef899a024dc8e9def14ada',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(costume3)
}, {
    id: '59d2003830d4eb592cf5d9a37561fde9',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(costume4)
}, {
    id: '52656dad6a045a77b57d38ea85bf3c2c',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(costume5)
}, {
    id: '0ca03cb3489e383f1a97b76c9cc2b95c',
    assetType: 'ImageVector',
    dataFormat: 'SVG',
    data: encoder.encode(costume6)
}];
