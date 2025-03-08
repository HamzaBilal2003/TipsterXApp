const freeTip = require('./tab_free.png')
const viptip = require('./tab_diamon.png')
const tabHome = require('./tab_home.png')
const tabRank = require('./tab_rank.png')
const Menu = require('./tab_menu.png')

const postlike = require('./post_like.png')
const postComment = require('./post_comment.png')

const notification = require('./home_notification.png');


const profile = require('./home_profile.png');
const editProfile = require('./home_edit.png');
const subscription = require('./home_subscritions.png');
const transactionsHistory = require('./menu_transactions.png');
const helpSupport = require('./menu_help.png') 

const tabsIcon = {
    freeTip,
    viptip,
    tabHome,
    tabRank,
    Menu,
}
const post = {
    postlike,
    postComment,
}

const home = {
    notification,
}
const menu = {
    profile,
    editProfile,
    subscription,
    notification,
    transactionsHistory,
    helpSupport,
}

export { tabsIcon, post, home,menu };