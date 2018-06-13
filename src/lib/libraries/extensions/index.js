import musicImage from './music.png';
import penImage from './pen.png';
import videoImage from './video-sensing.png';
import speechImage from './speech.png';
import microbitImage from './microbit.png';
import wedoImage from './wedo.png';
import ev3Image from './ev3.png';
import boostImage from './boost.png';
import translateImage from './translate.png';

export default [
    {
        name: 'Arduino',
        extensionId: 'arduino',
        iconURL: 'https://www.arduino.cc/en/pub/skins/arduinoWide/img/ArduinoAPP-01.svg',
        description: 'Extension Arduino.',
        featured: true
    },
    {
        name: '音乐',
        extensionId: 'music',
        iconURL: musicImage,
        description: '使用小鼓和乐器演奏音乐.',
        featured: true
    },
    {
        name: '画笔',
        extensionId: 'pen',
        iconURL: penImage,
        description: '使用画笔作画.',
        featured: true
    },
    {
        name: '谷歌翻译',
        extensionId: 'translate',
        iconURL: translateImage,
        description: '将文字翻译成多国语言.',
        featured: true
    },
    {
        name: '视频侦测',
        extensionId: 'videoSensing',
        iconURL: videoImage,
        description: '使用摄像头捕获动作.',
        featured: true
    },
    {
        name: '语音识别',
        extensionId: 'speech',
        iconURL: speechImage,
        description: '你可以和你做的项目对话.',
        featured: true,
        disabled: true
    },
    {
        name: 'Micro:bit',
        extensionId: 'microbit',
        iconURL: microbitImage,
        description: 'Connect your projects with the physical world.',
        featured: true,
        disabled: true
    },
    {
        name: 'LEGO WeDo 2.0',
        extensionId: 'wedo2',
        iconURL: wedoImage,
        description: 'Build with motors and sensors.',
        featured: true,
        disabled: true
    },
    {
        name: 'LEGO MINDSTORMS EV3',
        extensionId: 'ev3',
        iconURL: ev3Image,
        description: 'Build interactive robots and more.',
        featured: true,
        disabled: true
    },
    {
        name: 'LEGO Boost',
        extensionId: 'boost',
        iconURL: boostImage,
        description: 'Build with motors and sensors.',
        featured: true,
        disabled: true
    }
];
