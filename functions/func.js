const TranslateCfg = require('../models/TranslateCfg');
const Lang = require('../models/Lang');

module.exports.validateLangs = async function validateLangs(lang_arr) {
    let is_correct = true;
    for (i = 0; i < lang_arr.length; i++) {
        const lang_code = lang_arr[i].trim();
        const lang = await Lang.find({ code: lang_code }).limit(1);
        if (lang.length === 0) {
            is_correct = false;
        }
    }
    return is_correct;
}

module.exports.setUserConfig = async function setUserConfig(guild_id, user_id, user_tag, channel_id, langs) {
    let result = true;
    try {
        let cfgs = await TranslateCfg.find({ guild_id, user_id, channel_id });

        if (cfgs.length > 0) {
            for (i = 0; i < cfgs.length; i++) {
                await TranslateCfg.findByIdAndDelete(cfgs[i].id);
            }
        }

        let cfg = new TranslateCfg({ guild_id, user_id, user_tag, channel_id, langs, enabled: true })

        await cfg.save();
        result = true;
    } catch (e) {
        console.log(e);
        result = false;
    }

    return result;
}

module.exports.getLangsForTranslate = async function getLangsForTranslate(guild_id, user_id, channel_id) {
    let cfg = await TranslateCfg.findOne({ guild_id, user_id, channel_id, enabled: true });

    let result = [];
    if (cfg) {
        result = cfg.langs;
    }
    return result;
}

module.exports.enableAutoTranslate = async function enableAutoTranslate(guild_id, user_id, channel_id) {
    await TranslateCfg.findOneAndUpdate({ guild_id, user_id, channel_id }, { enabled: true });
}

module.exports.disableAutoTranslate = async function disabledAutoTranslate(guild_id, user_id, channel_id) {
    await TranslateCfg.findOneAndUpdate({ guild_id, user_id, channel_id }, { enabled: false });
}