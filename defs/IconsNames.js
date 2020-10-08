import Platform from './Platform';

export default {
    list: Platform.isAndroid ? 'md-list' : 'ios-list',
    create: Platform.isAndroid ? 'md-create' : 'ios-create',
    checkmark: Platform.isAndroid ? 'md-checkmark' : 'ios-checkmark',
    menu: Platform.isAndroid ? 'md-menu' : 'ios-menu',
    paper: Platform.isAndroid ? 'md-paper' : 'ios-paper',
    remove: Platform.isAndroid ? 'md-remove-circle-outline' : 'ios-remove-circle-outline',
    add: Platform.isAndroid ? 'md-add-circle-outline' : 'ios-add-circle-outline',
}