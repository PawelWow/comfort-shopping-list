import Platform from './Platform';

export default {
    list: Platform.isAndroid ? 'md-list' : 'ios-list',
    create: Platform.isAndroid ? 'md-create' : 'ios-create',
    checkmark: Platform.isAndroid ? 'md-checkmark' : 'ios-checkmark',
    menu: Platform.isAndroid ? 'md-menu' : 'ios-menu',
    paper: Platform.isAndroid ? 'md-paper' : 'ios-paper'
}