const fs = require('fs');
const yaml = require('hexo-component-inferno/lib/util/yaml');

module.exports = hexo => {
    return function generateFriends(locals) {
        const configs = yaml.parse(fs.readFileSync('./_friends.yml', 'utf8'));
        const friends = configs.friends;
        if (!friends || !friends.list) {
            return;
        }
        const defaultAvatar = 'https://cdn.jsdelivr.net/gh/Candinya/Kratos-Rebirth/source/images/avatar.webp';
        const flist = JSON.parse(JSON.stringify(friends.list));
        let friendCard = '';
        while (flist.length > 0) {
            const rndNum = Math.floor(Math.random() * flist.length);
            friendCard += '<li><a target="_blank" href="' + flist[rndNum].link + '"><img src="' + (flist[rndNum].avatar || defaultAvatar) + '"><h4>' + flist[rndNum].name + '</h4><p>' + (flist[rndNum].bio || '') + '</p></a></li>';
            flist.splice(rndNum, 1);
        };
        const style = '.linkpage ul{color:rgba(255,255,255,.15);}.linkpage ul:after{content:" ";clear:both;display:block}.linkpage ul li{float:left;width:48%;position:relative;transition:.3s ease-out;border-radius:5px;line-height:1.3;height:90px;display:block;min-width: 15rem;}.linkpage ul li:hover{background:rgba(230,244,250,.5);cursor:pointer}.linkpage ul li a{padding:0 10px 0 90px}.linkpage ul li a img{width:60px;height:60px;object-fit:cover;border-radius:50%;position:absolute;top:15px;left:15px;cursor:pointer;margin:auto;border:none}.linkpage ul li a h4{color:#333;font-size:18px;margin:0 0 7px;padding-left:90px}.linkpage ul li a p{font-size:12px;color:#999;padding-left:90px}.linkpage ul li a h4,.linkpage ul li a p{cursor:pointer;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;line-height:1.4}.linkpage ul li a:hover h4{color:#51aded}.linkpage h3{margin:15px -25px;padding:0 25px;border-left:5px solid #51aded;background-color:#f7f7f7;font-size:25px;line-height:40px}';

        const friendsDom = '<style>' + style + '</style><div class="linkpage"><ul id="friendsList">' + friendCard + '</ul></div>';
        const friendsContent = friendsDom + '<hr/><p>扩列中！！！！<br>提交友链附上：</p><ul><li>链接</li><li>一句话介绍自己（可选）</li><li>头像链接（可选）</li></ul>';

        return {
            path: friends.href + '/index.html',
            data: Object.assign(friends.page, {
                content: friendsContent
            }),
            layout: 'friends'
        };
    };
};